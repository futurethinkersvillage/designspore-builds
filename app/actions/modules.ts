"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { activations, users, customModuleRequests } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getModuleById, creditsForModule, modules } from "@/lib/modules";
import { getMonthKey } from "@/lib/queue";
import { sendActivationEmail } from "@/lib/email";

export type ActivateResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function activateModule(moduleId: string): Promise<ActivateResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };

  const user = session.user as {
    id?: string; name?: string; email?: string; businessName?: string;
  };
  if (!user.id) return { success: false, error: "Session missing user ID." };

  const mod = getModuleById(moduleId);
  if (!mod) return { success: false, error: "Module not found." };

  const creditsNeeded = creditsForModule(mod);

  const [dbUser] = await db
    .select({ monthlyBudget: users.monthlyBudget })
    .from(users)
    .where(eq(users.id, user.id));
  const monthlyCredits = Math.floor((dbUser?.monthlyBudget ?? 1500) / 375);

  // Check if already queued anywhere (any pending/active month)
  const existingAny = await db
    .select({ id: activations.id })
    .from(activations)
    .where(
      and(
        eq(activations.userId, user.id),
        eq(activations.moduleId, moduleId)
      )
    );
  const alreadyActive = existingAny.filter(
    (r) => !["cancelled", "completed"].includes((r as unknown as { status: string }).status ?? "")
  );
  // Re-query with status filter
  const existingActive = await db
    .select({ id: activations.id })
    .from(activations)
    .where(
      and(
        eq(activations.userId, user.id),
        eq(activations.moduleId, moduleId)
      )
    );
  // Filter in JS since drizzle enum comparison can be tricky
  const notDone = existingActive; // we'll just check on insert — duplicate check per month below

  // Auto-assign to the earliest month with enough credits (look up to 4 months ahead)
  let targetMonth: string | null = null;
  for (let i = 0; i < 4; i++) {
    const month = getMonthKey(i);

    // Already queued this module in this month?
    const dupe = await db
      .select({ id: activations.id })
      .from(activations)
      .where(
        and(
          eq(activations.userId, user.id),
          eq(activations.moduleId, moduleId),
          eq(activations.periodMonth, month)
        )
      );
    if (dupe.length > 0) return { success: false, error: "Already queued." };

    // Credits used in this month (exclude cancelled/completed)
    const monthRows = await db
      .select({ moduleId: activations.moduleId, status: activations.status })
      .from(activations)
      .where(
        and(eq(activations.userId, user.id), eq(activations.periodMonth, month))
      );
    const used = monthRows
      .filter((r) => r.status !== "cancelled" && r.status !== "completed")
      .reduce((sum, r) => {
        const m = getModuleById(r.moduleId);
        return sum + (m ? creditsForModule(m) : 0);
      }, 0);

    if (used + creditsNeeded <= monthlyCredits) {
      targetMonth = month;
      break;
    }
  }

  if (!targetMonth) {
    return {
      success: false,
      error: "Your queue is full for the next 4 months. Complete or cancel something first.",
    };
  }

  await db.insert(activations).values({
    userId: user.id,
    moduleId,
    status: "pending",
    periodMonth: targetMonth,
    valueConsumed: mod.estimatedValue,
  });

  // Notify Mike
  const isCurrentMonth = targetMonth === getMonthKey(0);
  const monthsAhead = !isCurrentMonth
    ? ` (scheduled for ${targetMonth})`
    : "";

  try {
    await sendActivationEmail({
      clientName: user.name ?? "Unknown",
      clientEmail: user.email ?? "",
      businessName: (user as { businessName?: string }).businessName ?? "",
      moduleName: mod.name,
      moduleId,
      tier: mod.tier,
      periodMonth: targetMonth,
    });
  } catch { /* non-fatal */ }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🟡 **Queued** — ${user.name ?? user.email} added **${mod.name}** [${creditsNeeded} credit${creditsNeeded > 1 ? "s" : ""}]${monthsAhead}`,
        }),
      });
    } catch { /* non-fatal */ }
  }

  return {
    success: true,
    message: isCurrentMonth
      ? `${mod.name} queued for this month. We'll be in touch soon.`
      : `${mod.name} scheduled for ${targetMonth}. We'll reach out when it's your active month.`,
  };
}

export async function cancelActivation(moduleId: string, periodMonth?: string): Promise<ActivateResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string };
  if (!user.id) return { success: false, error: "Session missing user ID." };

  const month = periodMonth ?? getMonthKey(0);

  const [row] = await db
    .select({ id: activations.id, status: activations.status })
    .from(activations)
    .where(
      and(
        eq(activations.userId, user.id),
        eq(activations.moduleId, moduleId),
        eq(activations.periodMonth, month)
      )
    );

  if (!row) return { success: false, error: "Activation not found." };
  if (row.status === "active")
    return { success: false, error: "Cannot cancel an in-progress service — contact us." };

  await db.update(activations).set({ status: "cancelled" }).where(eq(activations.id, row.id));
  return { success: true, message: "Removed from queue. Credits returned." };
}

// ── Custom module requests ──────────────────────────────────────────────

export type CustomModuleResult =
  | { success: true; matched: false; message: string }
  | { success: true; matched: true; moduleId: string; moduleName: string }
  | { success: false; error: string };

/**
 * Scores how well a description matches an existing module.
 * Simple keyword overlap — no external deps needed.
 */
function scoreMatch(description: string, mod: (typeof modules)[0]): number {
  const hay = [
    mod.name,
    mod.shortDescription,
    mod.problemHeadline,
    mod.problemDescription,
    ...mod.tags,
    ...mod.includedDeliverables,
  ]
    .join(" ")
    .toLowerCase();

  const words = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  if (words.length === 0) return 0;
  const hits = words.filter((w) => hay.includes(w)).length;
  return hits / words.length;
}

export async function submitCustomModule(
  description: string
): Promise<CustomModuleResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string; name?: string; email?: string; businessName?: string };
  if (!user.id) return { success: false, error: "Session missing user ID." };

  const trimmed = description.trim();
  if (trimmed.length < 20)
    return { success: false, error: "Please describe what you want in a bit more detail." };
  if (trimmed.length > 1000)
    return { success: false, error: "Please keep your description under 1000 characters." };

  // Check for strong match against existing modules (threshold: 25% keyword overlap)
  const scored = modules
    .map((m) => ({ mod: m, score: scoreMatch(trimmed, m) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (best && best.score >= 0.25) {
    // Strong enough match — tell them it already exists
    return {
      success: true,
      matched: true,
      moduleId: best.mod.id,
      moduleName: best.mod.name,
    };
  }

  // Save the custom request
  await db.insert(customModuleRequests).values({
    userId: user.id,
    description: trimmed,
    status: "pending",
  });

  // Notify Mike
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `💡 **Custom module request** from ${user.name ?? user.email} (${user.businessName ?? ""})\n> ${trimmed.slice(0, 200)}${trimmed.length > 200 ? "…" : ""}`,
        }),
      });
    } catch { /* non-fatal */ }
  }

  const { Resend } = await import("resend");
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  if (resend) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "DesignSpore Portal <onboarding@resend.dev>",
        to: "futurethinkerspodcast@gmail.com",
        subject: `💡 Custom module request — ${user.businessName ?? user.name}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <h2 style="margin:0 0 16px;font-size:18px;">Custom Module Request</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:6px 0;color:#888;width:120px;">Client</td><td>${user.name ?? ""}</td></tr>
              <tr><td style="padding:6px 0;color:#888;">Email</td><td>${user.email ?? ""}</td></tr>
              <tr><td style="padding:6px 0;color:#888;">Business</td><td>${user.businessName ?? ""}</td></tr>
            </table>
            <h3 style="margin:20px 0 8px;font-size:14px;color:#555;">What they want:</h3>
            <p style="margin:0;font-size:14px;line-height:1.6;background:#f5f5f5;padding:16px;border-radius:8px;">${trimmed}</p>
            <p style="margin:20px 0 0;font-size:13px;color:#888;">Review in the admin panel and set a credit estimate.</p>
          </div>
        `,
      });
    } catch { /* non-fatal */ }
  }

  return {
    success: true,
    matched: false,
    message: "Request submitted. Mike will review it and get back to you with a credit estimate.",
  };
}

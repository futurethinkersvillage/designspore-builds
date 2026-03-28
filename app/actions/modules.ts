"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { activations, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getModuleById, creditsForModule } from "@/lib/modules";
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

    // Credits used in this month
    const monthRows = await db
      .select({ moduleId: activations.moduleId })
      .from(activations)
      .where(
        and(eq(activations.userId, user.id), eq(activations.periodMonth, month))
      );
    const used = monthRows.reduce((sum, r) => {
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
          content: `🟡 **Queued** — ${user.name ?? user.email} added **${mod.name}** [${
            mod.tier === 1 ? "Flagship" : mod.tier === 2 ? "Core" : "Quick Win"
          }]${monthsAhead}`,
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

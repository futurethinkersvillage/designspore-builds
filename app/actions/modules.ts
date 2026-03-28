"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { activations, users } from "@/lib/db/schema";
import { eq, and, sum } from "drizzle-orm";
import { getModuleById, creditsForModule, MONTHLY_CREDITS } from "@/lib/modules";
import { sendActivationEmail } from "@/lib/email";

export type ActivateResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function activateModule(moduleId: string, periodMonth?: string): Promise<ActivateResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };

  const user = session.user as { id?: string; monthlyBudget?: number; name?: string; email?: string; businessName?: string };
  if (!user.id) return { success: false, error: "Session missing user ID." };

  const mod = getModuleById(moduleId);
  if (!mod) return { success: false, error: "Module not found." };

  // Validate month — must be current or future, max 4 months ahead
  const currentMonth = new Date().toISOString().slice(0, 7);
  const targetMonth = periodMonth ?? currentMonth;
  const maxMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 4, 1).toISOString().slice(0, 7);
  if (targetMonth < currentMonth || targetMonth > maxMonth) {
    return { success: false, error: "Invalid month selected." };
  }
  const creditsNeeded = creditsForModule(mod);

  // Fetch user's monthly budget
  const [dbUser] = await db.select({ monthlyBudget: users.monthlyBudget })
    .from(users).where(eq(users.id, user.id));
  const monthlyBudget = dbUser?.monthlyBudget ?? 1500;
  const monthlyCredits = Math.floor(monthlyBudget / 375);

  // Check if already activated this period
  const existing = await db.select({ id: activations.id })
    .from(activations)
    .where(and(
      eq(activations.userId, user.id),
      eq(activations.moduleId, moduleId),
      eq(activations.periodMonth, targetMonth)
    ));
  if (existing.length > 0) return { success: false, error: "Already activated this month." };

  // Check credit balance for the target month
  const activeRows = await db.select({ moduleId: activations.moduleId })
    .from(activations)
    .where(and(eq(activations.userId, user.id), eq(activations.periodMonth, targetMonth)));

  const { getModuleById: getMod, creditsForModule: credits } = await import("@/lib/modules");
  const creditsUsed = activeRows.reduce((sum, r) => {
    const m = getMod(r.moduleId);
    return sum + (m ? credits(m) : 0);
  }, 0);

  if (creditsUsed + creditsNeeded > monthlyCredits) {
    return { success: false, error: "Not enough credits remaining this month." };
  }

  // Create activation record
  await db.insert(activations).values({
    userId: user.id,
    moduleId,
    status: "pending",
    periodMonth: targetMonth,
    valueConsumed: mod.estimatedValue,
  });

  // Notify Mike
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
  } catch {
    // notification failure is non-fatal
  }

  // Discord webhook
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🟡 **New Activation** — ${user.name ?? user.email} (${(user as { businessName?: string }).businessName ?? ""}) activated **${mod.name}** [${mod.tier === 1 ? "Flagship" : mod.tier === 2 ? "Core" : "Quick Win"}] for ${periodMonth}`,
        }),
      });
    } catch {
      // non-fatal
    }
  }

  return { success: true, message: `${mod.name} has been queued. We'll be in touch shortly.` };
}

export async function cancelActivation(moduleId: string): Promise<ActivateResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string };
  if (!user.id) return { success: false, error: "Session missing user ID." };

  const periodMonth = new Date().toISOString().slice(0, 7);

  const [row] = await db.select({ id: activations.id, status: activations.status })
    .from(activations)
    .where(and(
      eq(activations.userId, user.id),
      eq(activations.moduleId, moduleId),
      eq(activations.periodMonth, periodMonth)
    ));

  if (!row) return { success: false, error: "Activation not found." };
  if (row.status === "active") return { success: false, error: "Cannot cancel an in-progress service — contact us." };

  await db.update(activations)
    .set({ status: "cancelled" })
    .where(eq(activations.id, row.id));

  return { success: true, message: "Activation cancelled. Credits returned." };
}

"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, activations, customModuleRequests } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getModuleById, creditsForModule } from "@/lib/modules";
import { getMonthKey } from "@/lib/queue";

const ADMIN_EMAILS = ["mike@designspore.co", "futurethinkerspodcast@gmail.com", "mikenoises@gmail.com"];

async function assertAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");
  const user = session.user as { email?: string | null };
  if (!user.email || !ADMIN_EMAILS.includes(user.email)) throw new Error("Not authorized.");
}

export async function updateActivationStatus(
  activationId: string,
  status: "active" | "completed" | "cancelled"
) {
  await assertAdmin();

  const [row] = await db
    .select({ userId: activations.userId, moduleId: activations.moduleId, periodMonth: activations.periodMonth })
    .from(activations)
    .where(eq(activations.id, activationId));

  await db.update(activations)
    .set({ status, ...(status === "completed" ? { completedAt: new Date() } : {}) })
    .where(eq(activations.id, activationId));

  // Auto-renew recurring modules when completed
  if (status === "completed" && row) {
    const mod = getModuleById(row.moduleId);
    if (mod?.recurring) {
      const nextMonth = getMonthKey(1);
      // Only create if not already queued for next month
      const existing = await db
        .select({ id: activations.id })
        .from(activations)
        .where(and(
          eq(activations.userId, row.userId),
          eq(activations.moduleId, row.moduleId),
          eq(activations.periodMonth, nextMonth)
        ));
      if (existing.length === 0) {
        await db.insert(activations).values({
          userId: row.userId,
          moduleId: row.moduleId,
          status: "pending",
          periodMonth: nextMonth,
          valueConsumed: mod.estimatedValue,
        });
      }
    }
  }
}

export async function addProgressUpdate(activationId: string, update: string) {
  await assertAdmin();
  await db.update(activations)
    .set({ progressUpdate: update })
    .where(eq(activations.id, activationId));
}

export async function setUserTier(userId: string, tier: string) {
  await assertAdmin();
  const monthlyBudget =
    tier === "starter" ? 1500 : tier === "growth" ? 3000 : tier === "scale" ? 5000 : 299;
  await db.update(users)
    .set({ subscriptionTier: tier as "starter" | "growth" | "scale" | "paused", monthlyBudget })
    .where(eq(users.id, userId));
}

export async function setUserActive(userId: string, active: boolean) {
  await assertAdmin();
  await db.update(users).set({ isActive: active }).where(eq(users.id, userId));
}

export async function respondToCustomModule(
  requestId: string,
  status: "scoped" | "declined",
  clientResponse: string,
  estimatedCredits?: number
) {
  await assertAdmin();
  await db
    .update(customModuleRequests)
    .set({
      status,
      clientResponse,
      estimatedCredits: estimatedCredits ?? null,
      updatedAt: new Date(),
    })
    .where(eq(customModuleRequests.id, requestId));
}


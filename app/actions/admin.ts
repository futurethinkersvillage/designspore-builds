"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, activations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
  await db.update(activations)
    .set({ status, ...(status === "completed" ? { completedAt: new Date() } : {}) })
    .where(eq(activations.id, activationId));
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
    tier === "starter" ? 1500 : tier === "growth" ? 3000 : tier === "partner" ? 4500 : 299;
  await db.update(users)
    .set({ subscriptionTier: tier as "starter" | "growth" | "partner" | "paused", monthlyBudget })
    .where(eq(users.id, userId));
}

export async function setUserActive(userId: string, active: boolean) {
  await assertAdmin();
  await db.update(users).set({ isActive: active }).where(eq(users.id, userId));
}

"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Result = { success: true; message: string } | { success: false; error: string };

export async function pauseSubscription(): Promise<Result> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string };
  if (!user.id) return { success: false, error: "Missing user ID." };
  await db.update(users).set({ subscriptionTier: "paused" }).where(eq(users.id, user.id));
  return { success: true, message: "Plan paused. You're on Keep the Lights On ($299/mo)." };
}

export async function unpauseSubscription(): Promise<Result> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string };
  if (!user.id) return { success: false, error: "Missing user ID." };
  await db.update(users).set({ subscriptionTier: "starter" }).where(eq(users.id, user.id));
  return { success: true, message: "Plan reactivated. Full credits resume next cycle." };
}

export async function toggleAutopilot(enabled: boolean): Promise<Result> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string };
  if (!user.id) return { success: false, error: "Missing user ID." };
  await db.update(users).set({ autopilot: enabled }).where(eq(users.id, user.id));
  return {
    success: true,
    message: enabled
      ? "Autopilot enabled. Mike will curate your queue each month."
      : "Autopilot disabled. You manage your own queue.",
  };
}

export async function completeOnboarding(): Promise<Result> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string };
  if (!user.id) return { success: false, error: "Missing user ID." };
  await db.update(users).set({ hasCompletedOnboarding: true }).where(eq(users.id, user.id));
  return { success: true, message: "Onboarding complete." };
}

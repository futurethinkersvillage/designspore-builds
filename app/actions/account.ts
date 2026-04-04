"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, accounts, activations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { redirect } from "next/navigation";

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

/**
 * Creates a Stripe Checkout session for a one-time credit top-up.
 * Each pack adds N credits to the user's monthly balance for the current cycle.
 */
export async function createCreditTopupCheckout(creditPack: 1 | 2 | 4): Promise<never> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { id?: string; email?: string | null };
  if (!user.id) redirect("/login");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });

  const priceMap: Record<number, { amount: number; label: string }> = {
    1: { amount: 37500, label: "1 Credit Top-Up" },
    2: { amount: 75000, label: "2 Credits Top-Up" },
    4: { amount: 150000, label: "4 Credits Top-Up" },
  };

  const pack = priceMap[creditPack];
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://portal.designspore.co";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pack.amount,
          product_data: {
            name: `DesignSpore — ${pack.label}`,
            description: `Adds ${creditPack} credit${creditPack !== 1 ? "s" : ""} to your current monthly allocation.`,
          },
        },
      },
    ],
    metadata: {
      userId: user.id,
      creditPack: String(creditPack),
      type: "credit_topup",
    },
    success_url: `${baseUrl}/account?topup=success`,
    cancel_url: `${baseUrl}/account`,
  });

  redirect(checkoutSession.url!);
}

export async function deleteAccount(): Promise<Result> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string };
  if (!user.id) return { success: false, error: "Missing user ID." };

  // Cancel all pending activations
  await db.update(activations)
    .set({ status: "cancelled" })
    .where(eq(activations.userId, user.id));

  // Delete auth accounts (OAuth links)
  await db.delete(accounts).where(eq(accounts.userId, user.id));

  // Delete the user — activations will cascade via FK if configured,
  // otherwise they're already cancelled above
  await db.delete(users).where(eq(users.id, user.id));

  return { success: true, message: "Account deleted." };
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendSignupNotification } from "@/lib/email";

/**
 * Stripe price ID → subscription tier mapping.
 * Set these in Coolify env once you have your Stripe products configured.
 *
 * STRIPE_PRICE_STARTER=price_xxx
 * STRIPE_PRICE_GROWTH=price_xxx
 * STRIPE_PRICE_PARTNER=price_xxx
 */
const PRICE_TO_TIER: Record<string, { tier: "starter" | "growth" | "partner"; budget: number }> = {
  [process.env.STRIPE_PRICE_STARTER ?? "__unset_starter__"]: { tier: "starter", budget: 1500 },
  [process.env.STRIPE_PRICE_GROWTH ?? "__unset_growth__"]:   { tier: "growth",  budget: 3000 },
  [process.env.STRIPE_PRICE_PARTNER ?? "__unset_partner__"]: { tier: "partner", budget: 4500 },
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !sig) {
    return new NextResponse("Missing webhook secret or signature", { status: 400 });
  }

  // Lazy-load stripe to keep edge-safe (not used in middleware)
  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    event = stripe.webhooks.constructEvent(body, sig, secret) as unknown as typeof event;
  } catch (err) {
    console.error("Stripe webhook verification failed:", err);
    return new NextResponse("Webhook verification failed", { status: 400 });
  }

  const obj = event.data.object;

  if (event.type === "checkout.session.completed") {
    const session = obj as {
      customer_email?: string; customer?: string; metadata?: Record<string, string>;
      subscription?: string;
    };
    const email = session.customer_email ?? session.metadata?.email;
    if (!email) return new NextResponse("OK", { status: 200 });

    // Determine tier from line items — use metadata if set, else default to starter
    const tier = (session.metadata?.tier as "starter" | "growth" | "partner") ?? "starter";
    const budget = tier === "growth" ? 3000 : tier === "partner" ? 4500 : 1500;

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));

    if (existing) {
      await db.update(users).set({
        isActive: true,
        subscriptionTier: tier,
        monthlyBudget: budget,
        stripeCustomerId: (session.customer as string) ?? null,
        stripeSubscriptionId: (session.subscription as string) ?? null,
      }).where(eq(users.email, email));
    } else {
      // Create a dormant account — client will set password on first login
      await db.insert(users).values({
        email,
        name: session.metadata?.name ?? null,
        isActive: true,
        subscriptionTier: tier,
        monthlyBudget: budget,
        stripeCustomerId: (session.customer as string) ?? null,
        stripeSubscriptionId: (session.subscription as string) ?? null,
      });

      // Notify Mike
      try {
        await sendSignupNotification({
          name: session.metadata?.name ?? email,
          email,
          businessName: session.metadata?.businessName ?? "",
          businessType: session.metadata?.businessType ?? "",
        });
      } catch { /* non-fatal */ }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = obj as { customer: string };
    await db.update(users)
      .set({ subscriptionTier: "paused", monthlyBudget: 299 })
      .where(eq(users.stripeCustomerId, sub.customer));
  }

  return new NextResponse("OK", { status: 200 });
}

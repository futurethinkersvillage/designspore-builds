"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { sendSignupNotification } from "@/lib/email";
import Stripe from "stripe";
import { PLANS } from "@/lib/subscription";
import type { PlanKey } from "@/lib/subscription";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z.string().min(2, "Business name required"),
  businessType: z.string().min(1, "Business type required"),
});

export async function loginWithCredentials(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

/**
 * Creates account (isActive: false) then redirects to Stripe Checkout.
 * Webhook fires on payment → sets isActive: true → user can log in.
 */
export async function signupAndCheckout(
  formData: FormData
): Promise<
  | { success: true; checkoutUrl: string }
  | { success: false; error?: string; fieldErrors?: Record<string, string> }
> {
  const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    businessName: z.string().min(2, "Business name required"),
    businessType: z.string().min(1, "Business type required"),
    plan: z.enum(["starter", "growth", "scale"]),
  });

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    businessName: formData.get("businessName") as string,
    businessType: formData.get("businessType") as string,
    plan: formData.get("plan") as string,
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [field, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[field] = msgs?.[0] ?? "Invalid";
    }
    return { success: false, fieldErrors };
  }

  const { name, email, password, businessName, businessType, plan } = parsed.data;

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return { success: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [newUser] = await db.insert(users).values({
    name,
    email,
    passwordHash,
    businessName,
    businessType,
    subscriptionTier: plan as PlanKey,
    monthlyBudget: PLANS[plan as PlanKey].monthlyBudget,
    isActive: false,
  }).returning({ id: users.id });

  // Create Stripe Checkout — one-time payment representing first month + onboarding fee
  // TODO: switch to subscription mode once Stripe products/prices are configured
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });
  const p = PLANS[plan as PlanKey];
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://designspore.co";
  const onboardingFee = 500_00; // $500 in cents
  const monthlyAmount = p.monthlyBudget * 100;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: onboardingFee,
          product_data: {
            name: "DesignSpore — Onboarding",
            description: "Discovery call, 90-day roadmap, and website rebuild included",
          },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: monthlyAmount,
          product_data: {
            name: `DesignSpore — ${p.label} Plan (Month 1)`,
            description: `${p.monthlyCredits} credits/month · ${p.description}`,
          },
        },
      },
    ],
    metadata: {
      userId: newUser.id,
      tier: plan,
      name,
      email,
      businessName,
      businessType,
    },
    success_url: `${baseUrl}/login?welcome=true`,
    cancel_url: `${baseUrl}/signup?cancelled=true`,
  });

  // Non-blocking notification to Mike
  sendSignupNotification({ name, email, businessName, businessType }).catch(() => {});

  return { success: true, checkoutUrl: session.url! };
}

export async function signupWithCredentials(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; fieldErrors?: Record<string, string> }> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    businessName: formData.get("businessName") as string,
    businessType: formData.get("businessType") as string,
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [field, msgs] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      fieldErrors[field] = msgs?.[0] ?? "Invalid";
    }
    return { fieldErrors };
  }

  const { name, email, password, businessName, businessType } = parsed.data;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));
  if (existing.length > 0) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(users).values({
    name,
    email,
    passwordHash,
    businessName,
    businessType,
    isActive: false,
  });

  // Fire-and-forget — don't block the response on email delivery
  sendSignupNotification({ name, email, businessName, businessType }).catch(
    () => {}
  );

  return {
    error:
      "Account created! Mike will review and activate your access. You'll hear back within 24 hours.",
  };
}

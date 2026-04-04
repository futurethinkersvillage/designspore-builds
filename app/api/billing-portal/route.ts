import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id?: string };
  const [row] = await db
    .select({ stripeCustomerId: users.stripeCustomerId, email: users.email })
    .from(users)
    .where(eq(users.id, user.id!));

  if (!row?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 404 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const baseUrl = process.env.AUTH_URL?.replace("/api/auth", "") ?? "https://designspore.co";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: row.stripeCustomerId,
    return_url: `${baseUrl}/account`,
  });

  return NextResponse.redirect(portalSession.url);
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

/**
 * One-time migration endpoint.
 * Call: POST /api/internal/migrate?secret=<INTERNAL_SECRET>
 * Remove this file after all migrations are complete.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Remove stale 'partner' value from subscription_tier enum.
    // Postgres can't DROP an enum value directly — must recreate the type.
    const enumCheck = await db.execute(sql`
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'subscription_tier' AND e.enumlabel = 'partner'
    `);

    if (enumCheck.rows.length > 0) {
      // No users should have tier='partner' since it was never used in code,
      // but cast any stragglers to 'starter' to be safe.
      await db.execute(sql`
        UPDATE "user" SET subscription_tier = 'starter'
        WHERE subscription_tier::text = 'partner'
      `);
      // Recreate the enum without 'partner'
      await db.execute(sql`
        CREATE TYPE subscription_tier_new AS ENUM('starter', 'growth', 'scale', 'paused')
      `);
      // Drop column default before altering type (default references old enum)
      await db.execute(sql`ALTER TABLE "user" ALTER COLUMN subscription_tier DROP DEFAULT`);
      await db.execute(sql`
        ALTER TABLE "user"
          ALTER COLUMN subscription_tier TYPE subscription_tier_new
          USING subscription_tier::text::subscription_tier_new
      `);
      await db.execute(sql`DROP TYPE subscription_tier`);
      await db.execute(sql`ALTER TYPE subscription_tier_new RENAME TO subscription_tier`);
      // Restore default
      await db.execute(sql`ALTER TABLE "user" ALTER COLUMN subscription_tier SET DEFAULT 'starter'`);
    }

    const finalValues = await db.execute(sql`
      SELECT e.enumlabel FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'subscription_tier'
      ORDER BY e.enumsortorder
    `);

    return NextResponse.json({
      success: true,
      message: "Migration complete.",
      subscriptionTierValues: finalValues.rows.map((r: any) => r.enumlabel),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

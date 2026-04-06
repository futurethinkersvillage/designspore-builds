import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

/**
 * One-time migration endpoint.
 * Call: POST /api/internal/migrate?secret=<INTERNAL_SECRET>
 * Remove this file after migration completes.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check current enum values
    const enumValues = await db.execute(sql`
      SELECT e.enumlabel FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'subscription_tier'
      ORDER BY e.enumsortorder
    `);
    const labels = enumValues.rows.map((r: any) => r.enumlabel);

    // Rename 'partner' → 'scale' only if 'partner' exists and 'scale' doesn't
    if (labels.includes('partner') && !labels.includes('scale')) {
      await db.execute(sql`ALTER TYPE subscription_tier RENAME VALUE 'partner' TO 'scale'`);
    }

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE change_request_type AS ENUM ('content-change','design-tweak','bug-issue','new-feature');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE change_request_priority AS ENUM ('low','medium','high');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE change_request_status AS ENUM ('new','in-review','in-progress','resolved','closed');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS change_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id),
        module_id TEXT,
        type change_request_type NOT NULL,
        priority change_request_priority NOT NULL DEFAULT 'medium',
        status change_request_status NOT NULL DEFAULT 'new',
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        page_url TEXT,
        admin_notes TEXT,
        client_update TEXT,
        task_file_path TEXT,
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS client_info_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id),
        module_id TEXT,
        message TEXT NOT NULL,
        response_text TEXT,
        is_resolved BOOLEAN NOT NULL DEFAULT false,
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        responded_at TIMESTAMP
      )
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE custom_module_status AS ENUM ('pending','matched','scoped','declined');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS custom_module_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id),
        description TEXT NOT NULL,
        status custom_module_status NOT NULL DEFAULT 'pending',
        matched_module_id TEXT,
        estimated_credits INTEGER,
        admin_notes TEXT,
        client_response TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    return NextResponse.json({ success: true, message: "Migration complete.", subscriptionTierValues: labels });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

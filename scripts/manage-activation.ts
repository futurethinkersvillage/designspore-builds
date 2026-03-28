/**
 * CLI tool for managing activations from the terminal.
 *
 * Usage:
 *   npx tsx scripts/manage-activation.ts list
 *   npx tsx scripts/manage-activation.ts pending
 *   npx tsx scripts/manage-activation.ts status <activationId> <active|completed|cancelled>
 *   npx tsx scripts/manage-activation.ts note <activationId> "Your message to the client"
 *   npx tsx scripts/manage-activation.ts activate-user <email>
 *   npx tsx scripts/manage-activation.ts set-tier <email> <starter|growth|partner|paused>
 *   npx tsx scripts/manage-activation.ts usage <email> <service> <requests> [tokens]
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const [, , command, ...args] = process.argv;

async function main() {
  switch (command) {
    case "list": {
      const rows = await db.select().from(schema.activations).orderBy(desc(schema.activations.activatedAt));
      console.table(rows.map((r) => ({
        id: r.id.slice(0, 8),
        user: r.userId.slice(0, 8),
        module: r.moduleId,
        status: r.status,
        month: r.periodMonth,
        note: r.progressUpdate?.slice(0, 40) ?? "",
      })));
      break;
    }

    case "pending": {
      const rows = await db.select().from(schema.activations)
        .where(eq(schema.activations.status, "pending"))
        .orderBy(desc(schema.activations.activatedAt));
      if (rows.length === 0) { console.log("No pending activations."); break; }
      console.table(rows.map((r) => ({ id: r.id, module: r.moduleId, month: r.periodMonth })));
      break;
    }

    case "status": {
      const [id, newStatus] = args;
      if (!id || !newStatus) { console.error("Usage: status <id> <active|completed|cancelled>"); process.exit(1); }
      if (!["active", "completed", "cancelled"].includes(newStatus)) {
        console.error("Status must be: active | completed | cancelled"); process.exit(1);
      }
      await db.update(schema.activations)
        .set({ status: newStatus as "active" | "completed" | "cancelled", ...(newStatus === "completed" ? { completedAt: new Date() } : {}) })
        .where(eq(schema.activations.id, id));
      console.log(`✓ Activation ${id.slice(0, 8)} → ${newStatus}`);
      break;
    }

    case "note": {
      const [id, ...noteParts] = args;
      const note = noteParts.join(" ");
      if (!id || !note) { console.error('Usage: note <id> "message"'); process.exit(1); }
      await db.update(schema.activations).set({ progressUpdate: note }).where(eq(schema.activations.id, id));
      console.log(`✓ Progress note updated for ${id.slice(0, 8)}`);
      break;
    }

    case "activate-user": {
      const [email] = args;
      if (!email) { console.error("Usage: activate-user <email>"); process.exit(1); }
      const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
      if (!user) { console.error(`User not found: ${email}`); process.exit(1); }
      await db.update(schema.users).set({ isActive: true }).where(eq(schema.users.id, user.id));
      console.log(`✓ Activated ${email}`);
      break;
    }

    case "set-tier": {
      const [email, tier] = args;
      if (!email || !tier) { console.error("Usage: set-tier <email> <starter|growth|partner|paused>"); process.exit(1); }
      const budgets: Record<string, number> = { starter: 1500, growth: 3000, partner: 4500, paused: 299 };
      if (!budgets[tier]) { console.error("Tier must be: starter | growth | partner | paused"); process.exit(1); }
      const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
      if (!user) { console.error(`User not found: ${email}`); process.exit(1); }
      await db.update(schema.users)
        .set({ subscriptionTier: tier as "starter" | "growth" | "partner" | "paused", monthlyBudget: budgets[tier] })
        .where(eq(schema.users.id, user.id));
      console.log(`✓ ${email} → ${tier} ($${budgets[tier]}/mo)`);
      break;
    }

    case "usage": {
      const [email, service, requests, tokens] = args;
      if (!email || !service || !requests) {
        console.error("Usage: usage <email> <service> <requests> [tokens]"); process.exit(1);
      }
      const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
      if (!user) { console.error(`User not found: ${email}`); process.exit(1); }
      const periodMonth = new Date().toISOString().slice(0, 7);
      const reqCount = parseInt(requests);
      const tokCount = tokens ? parseInt(tokens) : 0;
      const estimatedCredits = reqCount > 1000 ? 1 : 0; // 1 credit per 1k+ requests
      await db.insert(schema.apiUsage).values({
        userId: user.id, service, periodMonth,
        requestCount: reqCount, tokenCount: tokCount, estimatedCredits,
      }).onConflictDoNothing();
      console.log(`✓ Logged ${reqCount} requests for ${service} (${email}) — ${estimatedCredits} credits`);
      break;
    }

    default:
      console.log(`
DesignSpore Activation Manager
────────────────────────────────
  list                                   List all activations
  pending                                Show pending activations
  status <id> <active|completed|cancelled>  Update activation status
  note <id> "message"                    Add client-visible progress note
  activate-user <email>                  Activate a user account
  set-tier <email> <tier>                Set subscription tier
  usage <email> <service> <n> [tokens]   Log API usage
      `);
  }
}

main().then(() => pool.end()).catch((e) => { console.error(e); pool.end(); process.exit(1); });

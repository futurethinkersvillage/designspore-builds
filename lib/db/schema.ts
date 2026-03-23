import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "starter",
  "growth",
  "partner",
]);

export const activationStatusEnum = pgEnum("activation_status", [
  "pending",
  "active",
  "completed",
  "cancelled",
]);

// ── Users table — includes Auth.js required fields + our custom fields ──
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // Custom Design Spore fields
  businessName: text("business_name"),
  businessType: text("business_type"),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("starter"),
  monthlyBudget: integer("monthly_budget").default(1500), // in dollars
  isActive: boolean("is_active").default(false).notNull(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Auth.js adapter tables ──────────────────────────────────────────────
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compositePk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// ── Activations ────────────────────────────────────────────────────────
export const activations = pgTable("activations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  moduleId: text("module_id").notNull(),
  status: activationStatusEnum("status").default("pending"),
  activatedAt: timestamp("activated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  periodMonth: text("period_month").notNull(), // YYYY-MM
  valueConsumed: integer("value_consumed").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  "scale",
  "paused", // Keep the Lights On — hosting + maintenance only
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
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false).notNull(),
  passwordHash: text("password_hash"),
  autopilot: boolean("autopilot").default(false).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
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
  notes: text("notes"),               // internal: Mike's admin notes
  progressUpdate: text("progress_update"), // client-visible: status message from Mike
  periodMonth: text("period_month").notNull(), // YYYY-MM — can be future month for queuing
  valueConsumed: integer("value_consumed").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Change Requests (client → Mike) ────────────────────────────────────
export const changeRequestTypeEnum = pgEnum("change_request_type", [
  "content-change",
  "design-tweak",
  "bug-issue",
  "new-feature",
]);

export const changeRequestPriorityEnum = pgEnum("change_request_priority", [
  "low",
  "medium",
  "high",
]);

export const changeRequestStatusEnum = pgEnum("change_request_status", [
  "new",
  "in-review",
  "in-progress",
  "resolved",
  "closed",
]);

export const changeRequests = pgTable("change_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  moduleId: text("module_id"),           // which active service this relates to (optional)
  type: changeRequestTypeEnum("type").notNull(),
  priority: changeRequestPriorityEnum("priority").notNull().default("medium"),
  status: changeRequestStatusEnum("status").notNull().default("new"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pageUrl: text("page_url"),             // if website-related
  adminNotes: text("admin_notes"),       // Mike's internal notes (not shown to client)
  clientUpdate: text("client_update"),   // visible to client — Mike's status message
  taskFilePath: text("task_file_path"),  // path to generated anti-gravity MD file
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Mike → Client info requests ─────────────────────────────────────────
export const clientInfoRequests = pgTable("client_info_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  moduleId: text("module_id"),           // related service (optional)
  message: text("message").notNull(),    // "We need your hosting login to proceed"
  responseText: text("response_text"),   // client's reply
  isResolved: boolean("is_resolved").default(false).notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// ── Custom module requests (client-imagined services) ───────────────────
export const customModuleStatusEnum = pgEnum("custom_module_status", [
  "pending",      // submitted, waiting for Mike to review
  "matched",      // matched to an existing module
  "scoped",       // Mike reviewed and set a credit cost
  "declined",     // Mike declined (out of scope, etc.)
]);

export const customModuleRequests = pgTable("custom_module_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  description: text("description").notNull(),     // what the client wants
  status: customModuleStatusEnum("status").notNull().default("pending"),
  matchedModuleId: text("matched_module_id"),     // if matched to existing
  estimatedCredits: integer("estimated_credits"), // Mike's estimate
  adminNotes: text("admin_notes"),                // Mike's internal notes
  clientResponse: text("client_response"),        // Mike's message back to client
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── API Usage tracking ──────────────────────────────────────────────────
export const apiUsage = pgTable("api_usage", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  service: text("service").notNull(), // e.g. "chatbot", "lead-response", "resend"
  periodMonth: text("period_month").notNull(), // YYYY-MM
  requestCount: integer("request_count").default(0).notNull(),
  tokenCount: integer("token_count").default(0).notNull(),
  estimatedCredits: integer("estimated_credits").default(0).notNull(), // credits to bill
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

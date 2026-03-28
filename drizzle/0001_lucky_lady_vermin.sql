ALTER TYPE "public"."subscription_tier" ADD VALUE 'paused';--> statement-breakpoint
CREATE TABLE "api_usage" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"service" text NOT NULL,
	"period_month" text NOT NULL,
	"request_count" integer DEFAULT 0 NOT NULL,
	"token_count" integer DEFAULT 0 NOT NULL,
	"estimated_credits" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "activations" ADD COLUMN "progress_update" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "has_completed_onboarding" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "api_usage" ADD CONSTRAINT "api_usage_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
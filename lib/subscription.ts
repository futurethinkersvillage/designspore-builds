/**
 * Subscription plan definitions.
 * Dollar amounts are internal — only tier names are shown to clients.
 */

export const PLANS = {
  starter: {
    label: "Starter",
    monthlyBudget: 1500,
    annualBudget: 15000,
    monthlyCredits: 4,
    description: "One complete AI system per month — built, integrated, and working in your business.",
    color: "gold",
  },
  growth: {
    label: "Growth",
    monthlyBudget: 3000,
    annualBudget: 30000,
    monthlyCredits: 8,
    description: "Multiple systems running in parallel — enough throughput to feel like real momentum.",
    color: "blue",
  },
  scale: {
    label: "Scale",
    monthlyBudget: 5000,
    annualBudget: 50000,
    monthlyCredits: 13,
    description: "Full-engagement month — Mike is deep in your business across your whole stack.",
    color: "purple",
  },
  /**
   * Keep the Lights On — $299/mo pause state.
   * Covers: VPS hosting, SSL, uptime monitoring, security patches,
   * AI API baseline usage, and minor maintenance.
   * No build credits. No new services.
   * Clients can unpause at any time; credits resume next billing cycle.
   */
  paused: {
    label: "Keep the Lights On",
    monthlyBudget: 299,
    annualBudget: null,
    monthlyCredits: 0,
    description:
      "Your site and AI systems stay live, secure, and maintained — but no new builds until you unpause.",
    color: "neutral",
    includes: [
      "VPS hosting & SSL",
      "Uptime monitoring",
      "Security patches & updates",
      "AI API baseline usage",
      "Minor bug fixes",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/** One-time onboarding fee for all new clients (covers discovery, roadmap, website rebuild). */
export const ONBOARDING_FEE = 500;

/** Dollar value of one credit across all paid plans. */
export const CREDIT_VALUE = 375;

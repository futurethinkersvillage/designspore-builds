/**
 * Subscription plan definitions.
 * Dollar amounts are internal — only tier names are shown to clients.
 */

export const PLANS = {
  starter: {
    label: "Starter",
    monthlyBudget: 1500,
    monthlyCredits: 4,
    description: "One flagship, two core, or up to four quick-win services per month.",
    color: "gold",
  },
  growth: {
    label: "Growth",
    monthlyBudget: 3000,
    monthlyCredits: 8,
    description: "Double the build capacity — tackle bigger systems in parallel.",
    color: "blue",
  },
  partner: {
    label: "Partner",
    monthlyBudget: 4500,
    monthlyCredits: 12,
    description: "Full-service engagement — we move fast across your whole stack.",
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

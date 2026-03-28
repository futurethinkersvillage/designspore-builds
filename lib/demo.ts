export const DEMO_USER = {
  id: "demo",
  name: "Alex Rivera",
  email: "alex@acmeplumbing.com",
  businessName: "Acme Plumbing",
  subscriptionTier: "growth",
  monthlyBudget: 2500,
  isActive: true,
};

export const DEMO_ACTIVATIONS = [
  {
    moduleId: "chatbot-setup",
    status: "active" as const,
    valueConsumed: 1500, // Tier 1 Flagship
  },
  {
    moduleId: "missed-call-text-back",
    status: "pending" as const,
    valueConsumed: 375, // Tier 3 Quick Win
  },
];

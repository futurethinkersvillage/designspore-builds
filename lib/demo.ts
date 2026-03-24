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
    valueConsumed: 1200,
  },
  {
    moduleId: "missed-call-text-back",
    status: "pending" as const,
    valueConsumed: 600,
  },
];

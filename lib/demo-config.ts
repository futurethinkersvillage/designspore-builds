export interface TourStep {
  target: string;      // CSS selector for the highlighted element
  title: string;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
}

export interface DemoService {
  name: string;
  description: string;
  icon?: string;       // Phosphor icon name, e.g. "ChatCircle"
}

export interface DemoConfig {
  // ── Client identity ──────────────────────────────────────────
  businessName: string;           // "Acme Plumbing"
  businessSlug: string;           // "acme-plumbing" (used in URL)
  industry: string;               // "plumbing / home services"
  location: string;               // "Tampa, FL"
  address?: string;               // Full street address for Maps embed
  tagline: string;                // Rewritten headline for hero
  subtagline: string;             // Supporting subheadline
  aboutBlurb: string;             // 2–3 sentence about section
  phone?: string;
  email?: string;
  website?: string;               // Their original website
  logoUrl?: string | null;        // URL to their logo (or null)

  // ── Visual customization ─────────────────────────────────────
  accentColor: string;            // Hex, e.g. "#1E6FBA" — overrides DS gold for client brand
  accentColorLight: string;       // Lighter variant for hover, e.g. "#3A8FD4"
  accentColorDark: string;        // Darker variant, e.g. "#124E87"
  fontPreset: string;             // One of the fontGroups ids, e.g. "outfit-jakarta"
  heroStyle: "split" | "minimal"; // Layout variant — "centered" is banned per taste rules

  // ── Services shown in the demo ───────────────────────────────
  services: DemoService[];

  // ── AI features integrated in this demo ─────────────────────
  aiFeatures: string[];           // e.g. ["chatbot", "missed-call-text-back", "review-automation"]

  // ── Chatbot context (used in system prompt) ──────────────────
  industryContext: string;        // 2–3 sentences on industry pain points
  painPoints: string[];           // ["missed after-hours calls", "manual estimate follow-up"]
  relevantServices: string[];     // Design Spore service IDs this prospect should hear about

  // ── Tour ─────────────────────────────────────────────────────
  tourSteps: TourStep[];

  // ── Meta ─────────────────────────────────────────────────────
  createdAt: string;              // ISO date
  bookingUrl: string;             // Mike's call link
  portalDemoUrl?: string;         // DS client portal demo link (appended as final tour step)
}

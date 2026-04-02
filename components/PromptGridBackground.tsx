"use client";

const PROMPTS = [
  "Build me a website",
  "Design a new logo",
  "Set up my Google Ads",
  "Write blog posts for SEO",
  "Create a booking system",
  "Build a client portal",
  "Redesign my homepage",
  "Set up email marketing",
  "Create social media graphics",
  "Build a mobile app",
  "Automate my invoicing",
  "Write product descriptions",
  "Design business cards",
  "Set up analytics tracking",
  "Create a landing page",
  "Build an online store",
  "Design email templates",
  "Optimize my site speed",
  "Create a sales funnel",
  "Set up CRM integration",
  "Write ad copy that converts",
  "Build a customer dashboard",
  "Design a brand style guide",
  "Create automated workflows",
  "Build a review collection system",
  "Set up appointment scheduling",
  "Design social media templates",
  "Create a lead magnet",
  "Build a membership site",
  "Automate follow-up emails",
  "Design a pricing page",
  "Create video thumbnails",
  "Build a FAQ chatbot",
  "Set up retargeting ads",
  "Write website copy",
  "Create a referral program",
  "Build an event page",
  "Design infographics",
  "Set up payment processing",
  "Create a newsletter",
  "Build a quote calculator",
  "Automate social posting",
  "Design packaging mockups",
  "Create customer surveys",
  "Build a job board",
  "Set up Google Business",
  "Write case studies",
  "Create an onboarding flow",
  "Build a directory listing",
  "Design presentation decks",
  "Optimize for local SEO",
  "Create a content calendar",
  "Build a waitlist page",
  "Set up A/B testing",
  "Design trade show banners",
  "Create an affiliate program",
  "Build a knowledge base",
  "Automate client reporting",
  "Design vehicle wraps",
  "Create explainer videos",
  "Build a service catalog",
  "Set up SMS marketing",
  "Write press releases",
  "Create loyalty rewards",
  "Build a portfolio site",
  "Design menu boards",
  "Automate inventory alerts",
  "Create competitor analysis",
  "Build a team directory",
  "Set up live chat",
  "Write email sequences",
  "Create proposal templates",
  "Build a resource library",
  "Automate review requests",
  "Create training materials",
  "Build a testimonials page",
  "Set up conversion tracking",
  "Create a media kit",
  "Design brand collateral",
  "Build an AI chatbot",
  "Redesign my brand identity",
  "Create a mobile app",
  "Set up marketing automation",
  "Write my company bio",
  "Build a donation page",
  "Create retargeting campaigns",
  "Design product labels",
  "Automate appointment reminders",
  "Build a comparison page",
  "Write social media captions",
  "Create an ROI calculator",
  "Design a capability deck",
  "Build a client intake form",
  "Set up lead scoring",
  "Create a webinar funnel",
  "Design email signatures",
  "Build an internal wiki",
  "Create seasonal promotions",
  "Automate billing workflows",
];

const CARD_W = 240;
const CARD_H = 68;
const GAP = 12;

/**
 * Renders enough cards to fill any viewport.
 * Uses a large fixed grid that overflows and is centered.
 * Odd rows are offset by half a card for the brick pattern.
 */
function BrickGrid() {
  // Enough columns/rows to cover ultra-wide + tall screens
  const cols = 20;
  const rows = 20;
  const totalW = cols * (CARD_W + GAP);

  const allRows: { prompts: string[]; offset: boolean }[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 1;
    const count = offset ? cols + 1 : cols;
    const prompts: string[] = [];
    for (let c = 0; c < count; c++) {
      prompts.push(PROMPTS[idx % PROMPTS.length]);
      idx++;
    }
    allRows.push({ prompts, offset });
  }

  return (
    <div
      className="flex flex-col"
      style={{ gap: GAP, width: totalW }}
    >
      {allRows.map((row, r) => (
        <div
          key={r}
          className="flex"
          style={{
            gap: GAP,
            marginLeft: row.offset ? -(CARD_W + GAP) / 2 : 0,
          }}
        >
          {row.prompts.map((prompt, c) => (
            <div
              key={`${r}-${c}`}
              className="shrink-0 rounded-xl border border-white/[0.04] bg-white/[0.015] flex items-center justify-center px-5"
              style={{ width: CARD_W, height: CARD_H }}
            >
              <span className="text-[13px] text-white/[0.06] font-medium text-center leading-snug select-none">
                {prompt}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function PromptGridBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Center the oversized grid in the viewport */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BrickGrid />
      </div>

      {/*
        Center mask — hard-edged clear zone matching the form width (~32rem / 512px).
        Uses a layered gradient: solid in the middle, feathered edges to blend
        into the cards. Cards butt up against this zone rather than fading underneath.
      */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            // Vertical: solid center strip, feather 60px at top/bottom of strip
            "linear-gradient(to bottom, transparent 0%, transparent 5%, var(--color-darker) 12%, var(--color-darker) 88%, transparent 95%, transparent 100%)",
          ].join(", "),
          maskImage:
            "linear-gradient(to right, transparent 0%, transparent calc(50% - 380px), black calc(50% - 330px), black calc(50% + 330px), transparent calc(50% + 380px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, transparent calc(50% - 380px), black calc(50% - 330px), black calc(50% + 330px), transparent calc(50% + 380px), transparent 100%)",
        }}
      />

      {/* Thin edge vignettes so cards don't hard-stop at screen borders */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-darker) 0%, transparent 8%, transparent 92%, var(--color-darker) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--color-darker) 0%, transparent 4%, transparent 96%, var(--color-darker) 100%)",
        }}
      />
    </div>
  );
}

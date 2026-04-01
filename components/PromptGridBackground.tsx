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
  "Build an event registration page",
  "Design infographics",
  "Set up payment processing",
  "Create a newsletter template",
  "Build a quote calculator",
  "Automate social media posting",
  "Design packaging mockups",
  "Create customer surveys",
  "Build a job board",
  "Set up Google Business Profile",
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
  "Design yard signs",
  "Automate review requests",
  "Create training materials",
  "Build a testimonials page",
  "Set up conversion tracking",
  "Design door hangers",
  "Create a media kit",
];

// Build rows in a brick pattern — odd rows are offset by half a card width
function BrickGrid() {
  const rows: string[][] = [];
  let idx = 0;
  const cardsPerRow = 6;
  const totalRows = 14;

  for (let r = 0; r < totalRows; r++) {
    const row: string[] = [];
    // Offset rows get one extra card to fill the gap
    const count = r % 2 === 1 ? cardsPerRow + 1 : cardsPerRow;
    for (let c = 0; c < count; c++) {
      row.push(PROMPTS[idx % PROMPTS.length]);
      idx++;
    }
    rows.push(row);
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, r) => (
        <div
          key={r}
          className="flex gap-3"
          style={{
            marginLeft: r % 2 === 1 ? "-100px" : "0",
          }}
        >
          {row.map((prompt, c) => (
            <div
              key={`${r}-${c}`}
              className="shrink-0 w-[200px] h-[56px] rounded-xl border border-white/[0.04] bg-white/[0.02] flex items-center justify-center px-4"
            >
              <span className="text-[13px] text-white/[0.07] font-medium text-center leading-tight select-none whitespace-nowrap overflow-hidden text-ellipsis">
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
      {/* Center the grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="-rotate-6 scale-110">
          <BrickGrid />
        </div>
      </div>

      {/* Radial vignette — fades cards out toward edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, var(--color-darker) 70%)",
        }}
      />
    </div>
  );
}

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

function Card({ text }: { text: string }) {
  return (
    <div
      className="shrink-0 rounded-xl border border-white/[0.05] bg-white/[0.02] flex items-center justify-center px-5"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <span className="text-[13px] text-white/[0.08] font-medium text-center leading-snug select-none">
        {text}
      </span>
    </div>
  );
}

/**
 * A single side column of brick-patterned cards.
 * `side` controls the offset direction so both halves tile correctly.
 * Cards fade out at the top, bottom, and outer edge.
 */
function CardColumn({ side }: { side: "left" | "right" }) {
  const cols = 10;
  const rows = 20;

  const allRows: { prompts: string[]; offset: boolean }[] = [];
  // Offset the starting index so left and right show different prompts
  let idx = side === "left" ? 0 : 50;
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

  const totalW = cols * (CARD_W + GAP);

  // Fade: top/bottom edges + the outer edge (left side fades left, right side fades right)
  const edgeFade =
    side === "left"
      ? "linear-gradient(to right, transparent 0%, black 15%, black 100%)"
      : "linear-gradient(to left, transparent 0%, black 15%, black 100%)";
  const vertFade =
    "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)";

  return (
    <div
      className="overflow-hidden h-full"
      style={{
        maskImage: `${edgeFade}, ${vertFade}`,
        WebkitMaskImage: `${edgeFade}, ${vertFade}`,
        maskComposite: "intersect",
        WebkitMaskComposite: "destination-in",
      }}
    >
      <div
        className="flex flex-col"
        style={{
          gap: GAP,
          width: totalW,
          // Push the grid so the inner edge aligns flush with the form
          marginLeft: side === "right" ? 0 : "auto",
          marginRight: side === "left" ? 0 : "auto",
          // Vertically center the grid
          transform: "translateY(-10%)",
        }}
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
              <Card key={`${r}-${c}`} text={prompt} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { CardColumn };
export default function PromptGridBackground() {
  // Legacy export kept for easy removal — no longer used as an overlay
  return null;
}

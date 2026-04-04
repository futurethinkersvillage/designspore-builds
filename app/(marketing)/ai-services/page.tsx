import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { caseStudies } from "@/lib/case-studies";
import { modules, categoryLabels, tierConfig, creditsForModule, type ModuleCategory } from "@/lib/modules";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "AI Services — DesignSpore",
  description:
    "Done-for-you AI systems, websites, and automation for real businesses. Built and managed by Mike Gilliland in Clearwater, BC.",
};

// Featured services — hand-picked to show breadth
const featuredModuleIds = [
  "chatbot-setup",
  "missed-call-text-back",
  "lead-response-automation",
  "review-automation",
  "lead-sourcing",
  "appointment-booking",
];

const categoryOrder: ModuleCategory[] = [
  "lead-generation",
  "sales-followup",
  "client-communication",
  "reputation",
  "automation",
  "operations",
  "website",
  "market-intelligence",
];

const categoryIcons: Record<ModuleCategory, string> = {
  "lead-generation": "⚡",
  "sales-followup": "📬",
  "client-communication": "💬",
  "reputation": "⭐",
  "automation": "🤖",
  "operations": "📊",
  "website": "🌐",
  "market-intelligence": "🔍",
};

const plans = [
  {
    name: "Starter",
    price: "$1,500",
    per: "/mo",
    credits: 4,
    tagline: "Get your AI foundation in place",
    highlight: false,
    includes: [
      "4 credits/month ($375 each)",
      "Website rebuild & hosting included",
      "Onboarding roadmap call",
      "Client portal access",
      "Priority email support",
    ],
  },
  {
    name: "Growth",
    price: "$3,000",
    per: "/mo",
    credits: 8,
    tagline: "Build the full automation stack",
    highlight: true,
    includes: [
      "8 credits/month ($375 each)",
      "Website rebuild & hosting included",
      "Onboarding roadmap call",
      "Client portal access",
      "Priority email support",
      "Bi-weekly check-ins",
    ],
  },
  {
    name: "Scale",
    price: "$5,000",
    per: "/mo",
    credits: 13,
    tagline: "Maximum output, month after month",
    highlight: false,
    includes: [
      "13 credits/month (~$385 each)",
      "Website rebuild & hosting included",
      "Onboarding roadmap call",
      "Client portal access",
      "Priority email support",
      "Weekly strategy sessions",
      "Custom integrations on request",
    ],
  },
];

const proofPoints = [
  { stat: "21+", label: "done-for-you services in the catalog" },
  { stat: "$375", label: "per credit — consistent, no surprises" },
  { stat: "1–4", label: "credits per service based on scope" },
  { stat: "48hr", label: "typical turnaround on activated services" },
];

const featuredCaseStudies = caseStudies.slice(0, 3);
const featuredModules = featuredModuleIds
  .map((id) => modules.find((m) => m.id === id))
  .filter(Boolean) as typeof modules;

export default function AIServicesPage() {
  const groupedCategories = categoryOrder.map((cat) => ({
    cat,
    label: categoryLabels[cat],
    icon: categoryIcons[cat],
    count: modules.filter((m) => m.category === cat).length,
  }));

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="section-pad bg-darker border-b border-white/[0.06] relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_-10%,rgba(193,144,48,0.08),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">
              AI Services
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.92] mb-6"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Done-for-you AI systems for real businesses.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed mb-4 max-w-2xl">
              Not a SaaS tool. Not a template. Mike builds and manages your AI stack directly — websites,
              automations, chatbots, and lead systems that actually run.
            </p>
            <p className="text-base text-white/30 mb-10">
              Based in Clearwater, BC. Serving businesses across Canada.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="http://futurethinkers.org/call60"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark font-bold text-lg tracking-wide hover:bg-gold-light btn-press"
              >
                Book a Strategy Call <ArrowRightIcon size={16} weight="bold" />
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 px-8 py-4 rounded border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Start a plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF NUMBERS ───────────────────────────────────────────── */}
      <section className="border-b border-white/[0.06] bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {proofPoints.map(({ stat, label }) => (
              <div key={stat} className="py-8 px-6 text-center">
                <p
                  className="text-3xl md:text-4xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {stat}
                </p>
                <p className="text-xs text-white/40 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
                The model
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                Credits, not contracts.
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                Every service in the catalog has a credit cost based on scope. You choose what gets built
                each month from a menu of 21 done-for-you AI systems. Mike builds it. You use it.
              </p>
              <div className="space-y-4">
                {[
                  { credits: "1 credit", cost: "$375", example: "Missed-call text-back, review automation, SEO check" },
                  { credits: "2 credits", cost: "$750", example: "Lead response system, CRM setup, booking automation" },
                  { credits: "4 credits", cost: "$1,500", example: "Full website chatbot, lead sourcing system" },
                ].map(({ credits, cost, example }) => (
                  <div
                    key={credits}
                    className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-raised"
                  >
                    <div className="shrink-0 text-center">
                      <p className="text-sm font-bold text-white">{credits}</p>
                      <p className="text-xs text-gold">{cost}</p>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed pt-0.5">{example}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Pick your plan",
                  body: "Choose how many credits you want each month. Every plan includes a website rebuild and hosting setup.",
                },
                {
                  step: "02",
                  title: "Activate services",
                  body: "Browse the catalog and activate what you need. Queue ahead — schedule future months in one sitting.",
                },
                {
                  step: "03",
                  title: "Mike builds it",
                  body: "You're notified within 48 hours. Mike delivers the finished system directly to your business.",
                },
                {
                  step: "04",
                  title: "It runs. We maintain.",
                  body: "Systems stay live, monitored, and improved. Swap services any month — your business evolves, your stack does too.",
                },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex gap-5">
                  <div className="shrink-0 w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-gold">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES ───────────────────────────────────────── */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
              From the catalog
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Popular services.
            </h2>
            <p className="mt-4 text-white/40 text-lg">
              A sample of what's available. 21 services across 8 categories — new ones added regularly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {featuredModules.map((mod) => {
              const credits = creditsForModule(mod);
              const creditColor =
                mod.tier === 1 ? "text-gold border-gold/20 bg-gold/[0.06]" :
                mod.tier === 2 ? "text-blue-300 border-blue-500/20 bg-blue-500/[0.06]" :
                "text-emerald-300 border-emerald-500/20 bg-emerald-500/[0.06]";
              return (
                <div
                  key={mod.id}
                  className="p-6 rounded-2xl border border-white/[0.06] bg-dark hover:border-white/[0.12] hover:bg-raised transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3
                      className="font-bold text-white text-lg leading-snug group-hover:text-gold transition-colors"
                      style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                    >
                      {mod.name}
                    </h3>
                    <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${creditColor}`}>
                      {credits}cr
                    </span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-3">{mod.shortDescription}</p>
                  <p className="text-xs text-white/25 leading-relaxed italic">{mod.businessOutcome}</p>
                </div>
              );
            })}
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold transition-colors"
          >
            See all 21 services in the client portal <ArrowRightIcon size={14} />
          </Link>
        </div>
      </section>

      {/* ── SERVICE CATEGORIES ──────────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
              Categories
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Every corner of your operations.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {groupedCategories.map(({ cat, label, icon, count }) => (
              <div
                key={cat}
                className="p-5 rounded-xl border border-white/[0.06] bg-raised hover:border-white/[0.12] transition-colors"
              >
                <span className="text-2xl mb-3 block">{icon}</span>
                <h3 className="font-semibold text-white text-sm mb-1">{label}</h3>
                <p className="text-xs text-white/30">{count} service{count !== 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ───────────────────────────────────────────────────── */}
      <section className="section-pad bg-raised" id="plans">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
              Pricing
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Simple, predictable pricing.
            </h2>
            <p className="mt-4 text-white/40 text-lg max-w-xl">
              All plans run on the same $375/credit rate. More credits means more gets done each month — nothing else changes.
            </p>
          </div>

          {/* Onboarding callout */}
          <div className="mb-8 p-5 rounded-xl border border-gold/20 bg-gold/[0.04] flex items-start gap-4">
            <span className="text-gold text-xl shrink-0">✦</span>
            <div>
              <p className="text-sm font-semibold text-white mb-1">$500 one-time onboarding fee for all new clients</p>
              <p className="text-sm text-white/50">
                Covers the discovery call, 90-day build roadmap, and a full website rebuild hosted on DesignSpore infrastructure.
                Every client gets a new website — it's how the AI systems integrate cleanly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(({ name, price, per, credits, tagline, highlight, includes }) => (
              <div
                key={name}
                className={`rounded-2xl p-8 border flex flex-col ${
                  highlight
                    ? "bg-dark border-gold/40 ring-1 ring-gold/20"
                    : "bg-dark border-white/[0.08]"
                }`}
              >
                {highlight && (
                  <span className="tag mb-4 self-start">Most popular</span>
                )}
                <h3
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {name}
                </h3>
                <p className="text-white/40 text-sm mb-5">{tagline}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{price}</span>
                  <span className="text-white/40 text-sm">{per}</span>
                  <p className="text-xs text-gold mt-1">{credits} credits/month</p>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                      <CheckIcon size={15} weight="bold" className="text-gold mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all btn-press ${
                    highlight
                      ? "bg-gold text-dark hover:bg-gold-light"
                      : "border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-white/30">
            Annual plans available — pay for 10 months, get 12. {" "}
            <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors">
              Ask on the call.
            </a>
          </p>
        </div>
      </section>

      {/* ── CASE STUDIES ────────────────────────────────────────────── */}
      {featuredCaseStudies.length > 0 && (
        <section className="section-pad bg-dark">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="mb-14">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
                Proof
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                Real work, real results.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCaseStudies.map(({ slug, name, tagline, tags }) => (
                <Link
                  key={slug}
                  href={`/case-studies/${slug}`}
                  className="group p-7 rounded-2xl border border-white/[0.06] bg-raised hover:border-gold/30 hover:bg-dark transition-all block"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.slice(0, 2).map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                  <h3
                    className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors"
                    style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                  >
                    {name}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">{tagline}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold transition-colors"
              >
                View all case studies <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHO THIS IS FOR ─────────────────────────────────────────── */}
      <section className="section-pad bg-raised border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
                Who it's for
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                Built for businesses that actually operate.
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                Trades, hospitality, tourism, professional services, local retailers — businesses where the
                owner is still in the work and doesn't have time to become an AI expert. That's the point.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Trades & Home Services", "Tourism & Hospitality", "Consulting & Coaching", "Retail & E-commerce", "Real Estate", "Healthcare"].map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1.5 text-sm border border-white/[0.08] text-white/50 rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              {[
                {
                  headline: "You're losing leads you don't know about.",
                  body: "Missed calls, slow email responses, a website that doesn't convert — these are fixable. AI systems close the gaps automatically.",
                },
                {
                  headline: "You don't need another tool to manage.",
                  body: "Everything Mike builds is done-for-you. You get a working system, not a login and a tutorial video.",
                },
                {
                  headline: "You want results, not a retainer.",
                  body: "The credit model means you control what gets built. If your priorities shift, so does your queue.",
                },
              ].map(({ headline, body }) => (
                <div key={headline} className="p-5 rounded-xl border border-white/[0.06] bg-dark">
                  <h3 className="font-semibold text-white mb-2">{headline}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="section-pad bg-darker border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">
            Ready to start
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5"
            style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
          >
            Let's build your AI stack.
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto mb-10">
            Book a free 30-minute strategy call. We'll identify the highest-impact systems for your business and put together a build roadmap.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="http://futurethinkers.org/call60"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded bg-gold text-dark text-lg font-bold tracking-wide hover:bg-gold-light btn-press"
            >
              Book a Strategy Call <ArrowRightIcon size={18} weight="bold" />
            </a>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 rounded border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
            >
              Start a plan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

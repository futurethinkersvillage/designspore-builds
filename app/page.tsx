import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  PhoneIcon,
  RobotIcon,
  EnvelopeSimpleIcon,
  ChartLineUpIcon,
  StarIcon,
  MapPinIcon,
} from "@phosphor-icons/react/dist/ssr";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Design Spore — AI Systems & Launch Studio",
  description:
    "AI systems, websites, and automations for real businesses. Serving trades, tourism, hospitality, and service businesses across Canada.",
};

const outcomes = [
  { Icon: PhoneIcon, headline: "Never miss a lead again", body: "Missed-call text-back, AI phone systems, and 24/7 chatbots keep you in front of customers even when you're on the job." },
  { Icon: RobotIcon, headline: "Respond to inquiries instantly", body: "AI-powered email and chat responses handle routine questions, quotes, and bookings — automatically." },
  { Icon: EnvelopeSimpleIcon, headline: "Automate the follow-up", body: "CRM setup, quote systems, and review request sequences run without you lifting a finger." },
  { Icon: ChartLineUpIcon, headline: "Get found locally", body: "Modern website, Google Business Profile setup, and local SEO that puts you in front of customers right now." },
];

const steps = [
  { number: "01", title: "Talk", body: "30–60 minutes understanding your business, what's breaking down, and where the biggest wins are." },
  { number: "02", title: "Build", body: "We design and deploy your AI systems, website, or automation stack — no long timelines, no agency bloat." },
  { number: "03", title: "Run", body: "Your systems run continuously. We monitor, improve, and iterate as your business grows." },
];

const featuredSlugs = ["future-thinkers", "aeternity", "game-b-movement"];
const featuredCaseStudies = caseStudies.filter((cs) => featuredSlugs.includes(cs.slug));

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-darker min-h-[100dvh] flex items-center">
        <div className="max-w-7xl mx-auto px-5 md:px-8 w-full py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded border border-gold/30 bg-gold/10">
              <MapPinIcon size={13} weight="fill" className="text-gold" />
              <span className="text-sm text-gold tracking-wide font-medium">Clearwater, BC — AI systems for real businesses</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-white mb-6" style={{ fontFamily: "var(--font-archivo)" }}>
              Automate the work.<br />
              <span className="text-gold">Grow the business.</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 max-w-2xl leading-relaxed mb-12">
              We build AI systems, modern websites, and business automations for trades,
              tourism, hospitality, and local service businesses across Canada.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="http://futurethinkers.org/call60"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark text-lg font-bold tracking-wide transition-all hover:bg-gold-light btn-press"
              >
                Book a Strategy Call
                <ArrowRightIcon size={18} weight="bold" />
              </a>
              <Link
                href="/ai-services"
                className="inline-flex items-center gap-3 px-8 py-4 rounded border-2 border-white/20 text-white text-lg font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Explore AI Services
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-20 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { value: "$79M+", label: "Raised for clients" },
              { value: "4M+", label: "Views generated" },
              { value: "7+", label: "Brands launched" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl md:text-4xl font-bold text-gold" style={{ fontFamily: "var(--font-archivo)" }}>{value}</p>
                <p className="text-sm text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT NAMES ─────────────────────────────────────────── */}
      <section className="py-10 bg-raised border-y border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold text-center mb-6">
            Trusted by forward-thinking brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {["Future Thinkers", "Aeternity", "Empire Flippers", "Equalli", "Portal DAO", "Wells Gray"].map((name) => (
              <span key={name} className="text-white/25 font-semibold text-sm uppercase tracking-widest hover:text-white/50 transition-colors">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE HELP ──────────────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Who we help</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-archivo)" }}>
                Built for businesses doing real work.
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                We build practical AI systems for the businesses that actually run the economy —
                not abstract startups. If you serve real customers and need your operations
                to work harder, we can help.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Trades & contractors","Tourism & recreation","Hospitality","Local service businesses","Founders & solo operators","Restaurants & cafes","Health & wellness","Professional services"].map((industry) => (
                  <span key={industry} className="tag">{industry}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE CATEGORIES ───────────────────────────────────── */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">What we do</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-archivo)" }}>
              Two ways to work with us.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Services */}
            <div className="relative p-8 md:p-12 rounded-lg bg-darker border border-gold/20 overflow-hidden group hover:border-gold/40 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none transition-opacity group-hover:opacity-20"
                style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)", transform: "translate(40%, -40%)" }}
                aria-hidden="true"
              />
              <div className="relative">
                <span className="tag mb-6 inline-block">Primary offer</span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-archivo)" }}>
                  AI Services
                </h3>
                <p className="text-white/50 leading-relaxed mb-8 text-lg">
                  Websites, chatbots, AI phone systems, lead capture, CRM setup,
                  automated email response, and reputation systems.
                </p>
                <ul className="flex flex-col gap-3 mb-10">
                  {["AI chatbots & customer service","AI phone & missed-call text-back","New websites & rebuilds","Quote & invoice automation","Local SEO & Google Business Profile"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/ai-services" className="inline-flex items-center gap-2 px-6 py-3 rounded bg-gold text-dark font-bold text-sm tracking-wide transition-all hover:bg-gold-light btn-press">
                  See all AI services <ArrowRightIcon size={14} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Launch Services */}
            <div className="p-8 md:p-12 rounded-lg border border-white/10 bg-dark group hover:border-white/20 transition-colors">
              <span className="inline-block text-xs uppercase tracking-widest text-white/30 font-semibold border border-white/15 px-2.5 py-1 rounded mb-6">Secondary offer</span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-archivo)" }}>
                Launch Services
              </h3>
              <p className="text-white/50 leading-relaxed mb-8 text-lg">
                Strategy, brand identity, media production, and launch activation
                for new ventures, campaigns, and initiatives.
              </p>
              <ul className="flex flex-col gap-3 mb-10">
                {["Strategy & positioning","Brand & identity design","Media & content production","Partnerships & influencer strategy","Paid growth & campaign optimization"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/launch-services" className="inline-flex items-center gap-2 px-6 py-3 rounded border-2 border-white/20 text-white font-semibold text-sm transition-all hover:border-white/40 hover:bg-white/5 btn-press">
                Explore launch services <ArrowRightIcon size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUTCOMES ─────────────────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">What you get</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-lg" style={{ fontFamily: "var(--font-archivo)" }}>
              Problems we solve, every day.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8 rounded-xl overflow-hidden border border-white/8">
            {outcomes.map(({ Icon, headline, body }) => (
              <div key={headline} className="p-8 md:p-10 bg-dark hover:bg-raised transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-gold/15 flex items-center justify-center mb-6 transition-colors group-hover:bg-gold/20">
                  <Icon size={22} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-archivo)" }}>{headline}</h3>
                <p className="text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Process</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-archivo)" }}>
                Simple, fast, no fluff.
              </h2>
              <p className="mt-5 text-white/50 leading-relaxed">
                No long discovery phases or agency bloat. We move fast because
                that&apos;s what real businesses need.
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6 flex flex-col divide-y divide-white/8">
              {steps.map(({ number, title, body }) => (
                <div key={number} className="py-8 flex gap-8 items-start">
                  <span className="text-sm font-mono text-gold/60 mt-1 w-8 shrink-0 tabular-nums">{number}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-archivo)" }}>{title}</h3>
                    <p className="text-white/50 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDY PREVIEWS ──────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Selected work</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-archivo)" }}>
                Results that speak plainly.
              </h2>
            </div>
            <Link href="/case-studies" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-semibold shrink-0">
              View all work <ArrowRightIcon size={15} weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCaseStudies.map(({ slug, name, tagline, stats, tags }) => (
              <Link key={slug} href={`/case-studies/${slug}`} className="group block p-7 rounded-xl border border-white/8 bg-raised hover:border-gold/30 transition-all">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded border border-white/10 text-white/30 font-medium uppercase tracking-wide">{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-archivo)" }}>{name}</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-5">{tagline}</p>
                {stats && (
                  <div className="flex gap-6">
                    {stats.slice(0, 2).map(({ value, label }) => (
                      <div key={label}>
                        <p className="text-xl font-bold text-gold">{value}</p>
                        <p className="text-xs text-white/30">{label}</p>
                      </div>
                    ))}
                  </div>
                )}
                <span className="inline-flex items-center gap-2 mt-5 text-sm text-gold font-semibold group-hover:gap-3 transition-all">
                  Read case study <ArrowRightIcon size={13} weight="bold" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────── */}
      <section className="section-pad bg-raised">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="flex gap-1 justify-center mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} size={20} weight="fill" className="text-gold" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-semibold text-white leading-relaxed tracking-tight mb-8" style={{ fontFamily: "var(--font-archivo)" }}>
            &ldquo;These two technological artists were able to decipher my needs,
            expand on my vision and provide a service that totally impressed me,
            my colleagues, and most importantly, my clients. Expectation surpassed.
            Mind blown. This is why you hire the experts.&rdquo;
          </blockquote>
          <cite className="not-italic">
            <p className="text-lg font-bold text-white">Gabrielle K.</p>
            <p className="text-white/40">Design Spore client</p>
          </cite>
        </div>
      </section>

      {/* ── CLEARWATER SIGNAL ────────────────────────────────────── */}
      <section className="section-pad bg-dark border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPinIcon size={16} weight="fill" className="text-gold" />
                <span className="text-xs text-gold uppercase tracking-widest font-semibold">Clearwater, BC</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5 leading-tight" style={{ fontFamily: "var(--font-archivo)" }}>
                Rooted in real-world building.
              </h2>
              <p className="text-lg text-white/50 leading-relaxed max-w-md">
                Based in Clearwater, BC. We run AI-for-business meetups, workshops,
                and hands-on programs — because we believe in testing ideas in the
                real world, not just talking about them.
              </p>
              <Link href="/community" className="inline-flex items-center gap-2 mt-8 text-gold font-semibold hover:text-gold-light transition-colors">
                See what&apos;s happening locally <ArrowRightIcon size={14} weight="bold" />
              </Link>
            </div>
            <div className="md:col-span-5 md:col-start-8 grid grid-cols-2 gap-4">
              {[
                { label: "AI meetups", detail: "Clearwater, BC" },
                { label: "Workshops", detail: "Practical & hands-on" },
                { label: "Maker programs", detail: "Tools & fabrication" },
                { label: "Youth programs", detail: "Technology education" },
              ].map(({ label, detail }) => (
                <div key={label} className="p-5 rounded-lg border border-white/8 bg-raised">
                  <p className="font-bold text-white mb-1">{label}</p>
                  <p className="text-sm text-white/40">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="section-pad bg-gold relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(to right, #14191F 1px, transparent 1px), linear-gradient(to bottom, #14191F 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-dark mb-5 leading-tight" style={{ fontFamily: "var(--font-archivo)" }}>
            Ready to modernize your business?
          </h2>
          <p className="text-dark/60 text-xl max-w-xl mx-auto mb-12 leading-relaxed">
            Let&apos;s spend 30 minutes figuring out where AI can save you time and book you more work.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 w-full">
            <a
              href="http://futurethinkers.org/call60"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded bg-dark text-white text-lg font-bold tracking-wide transition-all hover:bg-raised btn-press"
            >
              Book a Strategy Call <ArrowRightIcon size={18} weight="bold" />
            </a>
            <Link href="/ai-services" className="inline-flex items-center gap-3 px-10 py-4 rounded border-2 border-dark/20 text-dark text-lg font-semibold hover:border-dark/40 hover:bg-dark/5 transition-all">
              See all services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

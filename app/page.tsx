import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
import ScrollReveal from "@/components/ui/ScrollReveal";
import CountUp from "@/components/ui/CountUp";

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

const clientLogos = [
  { name: "Future Thinkers", logo: "https://designspore.co/wp-content/uploads/2023/06/Client-Logos_0003_FTP-Blue-Logo-light-Euvie-I.s-conflicted-copy-2022-06-02-150x150.png" },
  { name: "Aeternity",       logo: "https://designspore.co/wp-content/uploads/2024/09/aeternity-logo-150x150.png" },
  { name: "Empire Flippers", logo: "https://designspore.co/wp-content/uploads/2023/06/Client-Logos_0002_ef-logo-white-150x150.png" },
  { name: "Equalli",         logo: "https://designspore.co/wp-content/uploads/2023/06/Client-Logos_0001_Equalli_Logo-150x150.png" },
  { name: "Portal DAO",      logo: "https://designspore.co/wp-content/uploads/2023/06/Client-Logos_0004_Portal-DAO-Logo4x-150x150.png" },
  { name: "Wells Gray",      logo: null },
  { name: "Game B",          logo: null },
];

const featuredSlugs = ["future-thinkers", "aeternity", "game-b-movement"];
const featuredCaseStudies = caseStudies.filter((cs) => featuredSlugs.includes(cs.slug));

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative bg-darker min-h-[100dvh] flex items-center overflow-hidden">
        {/* Ambient gold glow — top-left */}
        <div
          className="glow-gold"
          style={{ width: "800px", height: "600px", top: "-15%", left: "-10%", opacity: 0.4 }}
          aria-hidden="true"
        />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 w-full py-24 md:py-36">
          <div className="max-w-4xl">
            {/* Location badge */}
            <div className="hero-in hero-in-1 inline-flex items-center gap-2 mb-10 px-3 py-1.5 rounded-full border border-gold/25 bg-gold/8">
              <MapPinIcon size={11} weight="fill" className="text-gold" />
              <span className="text-xs text-gold/80 tracking-widest font-semibold uppercase">Clearwater, BC — AI systems for real businesses</span>
            </div>

            {/* Headline */}
            <h1
              className="hero-in hero-in-2 font-bold text-white leading-[0.9] mb-8"
              style={{
                fontFamily: "var(--font-archivo)",
                fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Automate the work.<br />
              <span className="text-gold">Grow the business.</span>
            </h1>

            {/* Sub */}
            <p className="hero-in hero-in-3 text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-12">
              We build AI systems, modern websites, and business automations for trades,
              tourism, hospitality, and local service businesses across Canada.
            </p>

            {/* CTAs */}
            <div className="hero-in hero-in-4 flex flex-wrap gap-4">
              <a
                href="http://futurethinkers.org/call60"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base px-8 py-4"
              >
                Book a Strategy Call
                <ArrowRightIcon size={16} weight="bold" />
              </a>
              <Link href="/ai-services" className="btn-outline text-base px-8 py-4">
                Explore AI Services
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="hero-in hero-in-5 mt-24 grid grid-cols-3 gap-0 max-w-sm divide-x divide-white/8">
            {[
              { value: "$79M+", label: "Raised for clients" },
              { value: "4M+",   label: "Views generated" },
              { value: "7+",    label: "Brands launched" },
            ].map(({ value, label }, i) => (
              <div key={label} className={i === 0 ? "pr-8" : i === 1 ? "px-8" : "pl-8"}>
                <p className="stat-number">
                  <CountUp value={value} />
                </p>
                <p className="text-xs text-white/35 mt-1 tracking-wide uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT LOGO MARQUEE ───────────────────────────────────── */}
      <section className="py-10 bg-raised border-y border-white/6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/20 font-semibold text-center mb-7">
          Trusted by forward-thinking brands
        </p>
        {/* Inline marquee with logos */}
        <div className="marquee-wrap overflow-hidden" style={{ WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)", maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
          <div className="marquee-track flex items-center">
            {[...clientLogos, ...clientLogos].map((client, i) => (
              <div key={i} className="flex items-center gap-10 px-10 shrink-0">
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={48}
                    className="h-8 w-auto object-contain opacity-40 hover:opacity-70 transition-opacity duration-300 grayscale brightness-200"
                    unoptimized
                  />
                ) : (
                  <span className="text-white/25 font-semibold text-xs uppercase tracking-widest whitespace-nowrap select-none">
                    {client.name}
                  </span>
                )}
                <span className="text-gold/25 select-none">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE HELP ──────────────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <ScrollReveal className="md:col-span-5">
              <p className="section-label">Who we help</p>
              <h2
                className="font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
              >
                Built for businesses doing real work.
              </h2>
            </ScrollReveal>
            <ScrollReveal className="md:col-span-6 md:col-start-7" delay={100}>
              <p className="text-lg text-white/55 leading-relaxed mb-8">
                We build practical AI systems for the businesses that actually run the economy —
                not abstract startups. If you serve real customers and need your operations
                to work harder, we can help.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Trades & contractors","Tourism & recreation","Hospitality","Local service businesses","Founders & solo operators","Restaurants & cafes","Health & wellness","Professional services"].map((industry) => (
                  <span key={industry} className="tag">{industry}</span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── SERVICE CATEGORIES ───────────────────────────────────── */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-16">
            <p className="section-label">What we do</p>
            <h2
              className="font-bold text-white"
              style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              Two ways to work with us.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* AI Services */}
            <ScrollReveal variant="scale">
              <div className="relative card-premium p-8 md:p-12 overflow-hidden group h-full" style={{ background: '#14191F' }}>
                {/* ambient glow */}
                <div
                  className="glow-gold pointer-events-none absolute"
                  style={{ width: "400px", height: "400px", top: "-40%", right: "-20%", opacity: 0 }}
                  aria-hidden="true"
                />
                <span className="tag mb-8 inline-block">Primary offer</span>
                <h3
                  className="font-bold text-white mb-4 leading-tight"
                  style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
                >
                  AI Services
                </h3>
                <p className="text-white/50 leading-relaxed mb-8 text-base">
                  Websites, chatbots, AI phone systems, lead capture, CRM setup,
                  automated email response, and reputation systems.
                </p>
                <ul className="flex flex-col gap-3 mb-10">
                  {["AI chatbots & customer service","AI phone & missed-call text-back","New websites & rebuilds","Quote & invoice automation","Local SEO & Google Business Profile"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/50 text-sm">
                      <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0 opacity-80" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/ai-services" className="btn-primary inline-flex">
                  See all AI services <ArrowRightIcon size={14} weight="bold" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Launch Services */}
            <ScrollReveal variant="scale" delay={80}>
              <div className="card-premium p-8 md:p-12 h-full group">
                <span className="inline-block text-xs uppercase tracking-[0.12em] text-white/25 font-semibold border border-white/10 px-2.5 py-1 rounded mb-8">Secondary offer</span>
                <h3
                  className="font-bold text-white mb-4 leading-tight"
                  style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
                >
                  Launch Services
                </h3>
                <p className="text-white/50 leading-relaxed mb-8 text-base">
                  Strategy, brand identity, media production, and launch activation
                  for new ventures, campaigns, and initiatives.
                </p>
                <ul className="flex flex-col gap-3 mb-10">
                  {["Strategy & positioning","Brand & identity design","Media & content production","Partnerships & influencer strategy","Paid growth & campaign optimization"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/50 text-sm">
                      <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/launch-services" className="btn-outline inline-flex">
                  Explore launch services <ArrowRightIcon size={14} weight="bold" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── OUTCOMES ─────────────────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal className="mb-16">
            <p className="section-label">What you get</p>
            <h2
              className="font-bold text-white max-w-lg"
              style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              Problems we solve, every day.
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/6 rounded-xl overflow-hidden border border-white/6">
              {outcomes.map(({ Icon, headline, body }) => (
                <div key={headline} className="p-8 md:p-10 bg-dark hover:bg-raised transition-colors duration-300 group">
                  <div className="w-11 h-11 rounded-lg bg-gold/12 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-gold/22">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors duration-200" style={{ fontFamily: "var(--font-archivo)" }}>
                    {headline}
                  </h3>
                  <p className="text-white/45 leading-relaxed text-sm">{body}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <ScrollReveal className="md:col-span-4">
              <p className="section-label">Process</p>
              <h2
                className="font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                Simple, fast, no fluff.
              </h2>
              <p className="mt-5 text-white/45 leading-relaxed text-sm">
                No long discovery phases or agency bloat. We move fast because
                that&apos;s what real businesses need.
              </p>
            </ScrollReveal>

            <ScrollReveal className="md:col-span-7 md:col-start-6 flex flex-col" delay={120}>
              {steps.map(({ number, title, body }, i) => (
                <div key={number} className={`py-9 flex gap-8 items-start ${i < steps.length - 1 ? "border-b border-white/6" : ""}`}>
                  <span className="text-xs font-mono text-gold/50 mt-1 w-8 shrink-0 tabular-nums">{number}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-archivo)" }}>{title}</h3>
                    <p className="text-white/45 leading-relaxed text-sm">{body}</p>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CASE STUDY PREVIEWS ──────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <p className="section-label">Selected work</p>
                <h2
                  className="font-bold text-white"
                  style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                >
                  Results that speak plainly.
                </h2>
              </div>
              <Link href="/case-studies" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-semibold text-sm shrink-0 group">
                View all work
                <ArrowRightIcon size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="stagger">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredCaseStudies.map(({ slug, name, tagline, stats, tags }) => (
                <Link key={slug} href={`/case-studies/${slug}`} className="card-premium group block p-7">
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[0.6rem] px-2 py-0.5 rounded border border-white/8 text-white/25 font-semibold uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors duration-200" style={{ fontFamily: "var(--font-archivo)" }}>
                    {name}
                  </h3>
                  <p className="text-sm text-white/35 leading-relaxed mb-6">{tagline}</p>
                  {stats && (
                    <div className="flex gap-6 mb-6">
                      {stats.slice(0, 2).map(({ value, label }) => (
                        <div key={label}>
                          <p className="text-xl font-bold text-gold" style={{ fontFamily: "var(--font-archivo)", letterSpacing: "-0.03em" }}>{value}</p>
                          <p className="text-xs text-white/25 mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <span className="inline-flex items-center gap-2 text-xs text-gold font-semibold uppercase tracking-wider group-hover:gap-3 transition-all duration-200">
                    Read case study <ArrowRightIcon size={11} weight="bold" />
                  </span>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────── */}
      <section className="section-pad bg-raised relative overflow-hidden">
        {/* faint gold glow center */}
        <div
          className="glow-gold absolute"
          style={{ width: "600px", height: "400px", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.3 }}
          aria-hidden="true"
        />
        <ScrollReveal className="relative max-w-3xl mx-auto px-5 md:px-8 text-center">
          {/* Large decorative quote mark */}
          <div
            className="text-gold/12 select-none mb-4 leading-none"
            style={{ fontFamily: "var(--font-archivo)", fontSize: "9rem", lineHeight: 0.8, marginBottom: "1.5rem" }}
            aria-hidden="true"
          >
            &ldquo;
          </div>
          <div className="flex gap-1 justify-center mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} size={16} weight="fill" className="text-gold" />
            ))}
          </div>
          <blockquote
            className="font-bold text-white leading-tight tracking-tight mb-10"
            style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-0.02em" }}
          >
            These two technological artists were able to decipher my needs,
            expand on my vision and provide a service that totally impressed me,
            my colleagues, and most importantly, my clients. Expectation surpassed.
            Mind blown. This is why you hire the experts.
          </blockquote>
          <cite className="not-italic flex flex-col items-center gap-3">
            <Image
              src="https://designspore.co/wp-content/uploads/2024/09/Asset-1-750x1024.png"
              alt="Gabrielle K."
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover object-top border-2 border-gold/30"
              unoptimized
            />
            <div>
              <p className="font-bold text-white text-base">Gabrielle K.</p>
              <p className="text-white/35 text-sm mt-0.5 tracking-wide">Design Spore client</p>
            </div>
          </cite>
        </ScrollReveal>
      </section>

      {/* ── CLEARWATER ───────────────────────────────────────────── */}
      <section className="section-pad bg-dark border-t border-white/6">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <ScrollReveal className="md:col-span-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPinIcon size={14} weight="fill" className="text-gold" />
                <span className="text-xs text-gold uppercase tracking-[0.16em] font-semibold">Clearwater, BC</span>
              </div>
              <h2
                className="font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                Rooted in real-world building.
              </h2>
              <p className="text-lg text-white/45 leading-relaxed max-w-md">
                Based in Clearwater, BC. We run AI-for-business meetups, workshops,
                and hands-on programs — because we believe in testing ideas in the
                real world, not just talking about them.
              </p>
              <Link href="/community" className="inline-flex items-center gap-2 mt-8 text-gold font-semibold text-sm hover:text-gold-light transition-colors group">
                See what&apos;s happening locally
                <ArrowRightIcon size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>

            <ScrollReveal className="md:col-span-5 md:col-start-8 grid grid-cols-2 gap-4" variant="stagger" delay={100}>
              {[
                { label: "AI meetups", detail: "Clearwater, BC" },
                { label: "Workshops", detail: "Practical & hands-on" },
                { label: "Maker programs", detail: "Tools & fabrication" },
                { label: "Youth programs", detail: "Technology education" },
              ].map(({ label, detail }) => (
                <div key={label} className="p-5 rounded-lg border border-white/6 bg-raised hover:border-gold/20 transition-colors duration-300">
                  <p className="font-bold text-white text-sm mb-1" style={{ fontFamily: "var(--font-archivo)" }}>{label}</p>
                  <p className="text-xs text-white/35">{detail}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="section-pad bg-gold relative overflow-hidden">
        {/* subtle dark grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #14191F 1px, transparent 1px), linear-gradient(to bottom, #14191F 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />
        <ScrollReveal className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h2
            className="font-bold text-dark mb-5 leading-tight"
            style={{ fontFamily: "var(--font-archivo)", fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em" }}
          >
            Ready to modernize<br />your business?
          </h2>
          <p className="text-dark/55 text-lg max-w-lg mx-auto mb-12 leading-relaxed">
            Let&apos;s spend 30 minutes figuring out where AI can save you time and book you more work.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="http://futurethinkers.org/call60"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded bg-dark text-white text-base font-bold tracking-wide transition-all hover:bg-raised btn-press"
            >
              Book a Strategy Call <ArrowRightIcon size={16} weight="bold" />
            </a>
            <Link
              href="/ai-services"
              className="inline-flex items-center gap-3 px-10 py-4 rounded border-2 border-dark/20 text-dark text-base font-semibold hover:border-dark/40 hover:bg-dark/6 transition-all"
            >
              See all services
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

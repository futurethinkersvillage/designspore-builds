import type { DemoConfig } from "@/lib/demo-config";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/ui/ContactForm";
import FAQAccordion from "@/components/ui/FAQAccordion";
import {
  ArrowRight,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  EnvelopeSimple,
  Quotes,
} from "@phosphor-icons/react/dist/ssr";

type Config = DemoConfig & { address?: string; portalDemoUrl?: string; heroImageUrl?: string };

const PROCESS_STEPS = [
  { num: "01", title: "Get in Touch", desc: "Call, text, or fill out the form. We get back to you the same day." },
  { num: "02", title: "Free Site Visit", desc: "We come to you, assess the scope, and give you a detailed written estimate." },
  { num: "03", title: "We Build It", desc: "Skilled crew, quality materials, clear communication at every stage." },
  { num: "04", title: "Final Sign-Off", desc: "We walk through every detail with you before the job is done." },
];

const REVIEWS = [
  { name: "D. Hartmann", text: "Sean was communicative from day one. The deck came out better than we imagined — solid craftsmanship, clean site, done on schedule.", rating: 5, project: "Deck Build" },
  { name: "T. Renwick", text: "Got quotes from three contractors. SGM was the most upfront about costs, stuck to the timeline, and the kitchen reno came out exactly as planned.", rating: 5, project: "Kitchen Renovation" },
  { name: "M. Calloway", text: "Respectful of our home, great attention to detail, and genuinely good craftsmanship. We've already referred two neighbours.", rating: 5, project: "Interior Carpentry" },
];

const STATS = [
  { value: "200+", label: "Projects Completed" },
  { value: "15+", label: "Years Experience" },
  { value: "5★", label: "Google Rating" },
  { value: "Free", label: "Estimates" },
];

const fg = (opacity: number) => `rgba(var(--fg-r,255),var(--fg-g,255),var(--fg-b,255),${opacity})`;

export default function DesignVariantB({ config }: { config: Config }) {
  return (
    <>
      {/* ── HERO — full bleed image, text pinned bottom-left ──────── */}
      <section
        className="relative flex items-end"
        style={{ minHeight: "100dvh" }}
      >
        {/* Background image layer */}
        <div className="absolute inset-0">
          {config.heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.heroImageUrl}
              alt={config.businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `radial-gradient(ellipse 90% 70% at 60% 40%, color-mix(in srgb, var(--accent) 15%, transparent), var(--bg-warm-dark, #13100E))`,
              }}
            />
          )}
          {/* Gradient overlays */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(13,10,8,0.97) 0%, rgba(13,10,8,0.6) 45%, rgba(13,10,8,0.15) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(13,10,8,0.7) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Text — pinned bottom-left */}
        <div className="relative w-full max-w-6xl mx-auto px-5 md:px-10 pb-20 pt-48">
          <p
            className="hero-in hero-in-1 text-xs font-bold tracking-widest uppercase mb-5"
            style={{ color: "color-mix(in srgb, var(--accent) 80%, var(--fg-primary-hex))" }}
          >
            {config.location} &nbsp;·&nbsp; {config.industry}
          </p>
          <h1
            className="hero-in hero-in-2 font-black mb-6"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              lineHeight: "0.92",
              letterSpacing: "-0.03em",
              color: "var(--fg-primary-hex, #fff)",
              maxWidth: "14ch",
            }}
          >
            {config.tagline}
          </h1>
          <p
            className="hero-in hero-in-3 text-lg mb-10 leading-relaxed max-w-lg"
            style={{ color: fg(0.6) }}
          >
            {config.subtagline}
          </p>
          <div className="hero-in hero-in-4 flex flex-col sm:flex-row gap-3">
            <a href="#demo-contact" className="btn-primary text-sm px-7 py-4 flex items-center gap-2 w-fit">
              Get a Free Quote <ArrowRight size={16} weight="bold" />
            </a>
            {config.phone && (
              <a href={`tel:${config.phone}`} className="btn-outline text-sm px-7 py-4 flex items-center gap-2 w-fit">
                <Phone size={15} /> {config.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <div style={{ background: "var(--accent)", padding: "0" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-5 px-4"
                style={{
                  borderRight: i < 3 ? "1px solid rgba(0,0,0,0.12)" : "none",
                  borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.12)" : "none",
                }}
              >
                <span className="text-2xl font-black leading-none" style={{ color: "#0C1012" }}>{stat.value}</span>
                <span className="text-xs font-medium mt-1" style={{ color: "rgba(0,0,0,0.55)" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section id="demo-services" className="section-pad" style={{ background: "var(--bg-warm-section, #1C1510)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <div className="mb-14">
              <h2
                className="text-3xl md:text-5xl font-black mb-4"
                style={{ lineHeight: "1.0", letterSpacing: "-0.025em", color: "var(--fg-primary-hex)" }}
              >
                What we build
              </h2>
              <p className="text-base max-w-md leading-relaxed" style={{ color: fg(0.45) }}>
                Every project handled with care, from first conversation to final walkthrough.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="stagger">
            <div className="grid md:grid-cols-2 gap-px" style={{ background: "var(--border-base)" }}>
              {config.services.map((service) => (
                <a
                  key={service.name}
                  href="#demo-contact"
                  className="group relative p-8 flex flex-col gap-3 transition-all duration-200"
                  style={{
                    background: "var(--bg-warm-dark, #13100E)",
                    textDecoration: "none",
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-200 group-hover:opacity-100"
                    style={{
                      background: "var(--accent)",
                      opacity: 0,
                    }}
                  />
                  <h3
                    className="text-lg font-bold transition-colors duration-200"
                    style={{ color: fg(0.85) }}
                  >
                    {service.name}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: fg(0.4) }}>
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>Get a quote</span>
                    <ArrowRight size={12} weight="bold" style={{ color: "var(--accent)" }} />
                  </div>
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PROCESS — 2×2 grid with ghost numbers ─────────────────── */}
      <section className="section-pad" style={{ background: "var(--bg-warm-dark, #13100E)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <div className="mb-14">
              <h2
                className="text-3xl md:text-5xl font-black"
                style={{ lineHeight: "1.0", letterSpacing: "-0.025em", color: "var(--fg-primary-hex)" }}
              >
                How it works
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-px" style={{ background: "var(--border-base)" }}>
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 60}>
                <div
                  className="relative p-8 overflow-hidden"
                  style={{ background: "var(--bg-warm-section, #1C1510)" }}
                >
                  {/* Ghost number */}
                  <span
                    className="absolute right-4 top-2 text-8xl font-black select-none pointer-events-none"
                    style={{
                      color: "color-mix(in srgb, var(--accent) 8%, transparent)",
                      lineHeight: "1",
                      fontFamily: "var(--font-display-active, inherit)",
                    }}
                    aria-hidden="true"
                  >
                    {step.num}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-5 relative z-10"
                    style={{
                      background: i === 0 ? "var(--accent)" : "color-mix(in srgb, var(--accent) 12%, transparent)",
                      border: `1px solid ${i === 0 ? "transparent" : "color-mix(in srgb, var(--accent) 25%, transparent)"}`,
                    }}
                  >
                    <span
                      className="text-xs font-black tabular-nums"
                      style={{ color: i === 0 ? "#0C1012" : "var(--accent)" }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2 relative z-10" style={{ color: "var(--fg-primary-hex)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed relative z-10" style={{ color: fg(0.4) }}>
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ───────────────────────────────────────────────── */}
      <section id="demo-social-proof" className="section-pad" style={{ background: "var(--bg-warm-section, #1C1510)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <h2
              className="text-3xl md:text-4xl font-black mb-12"
              style={{ lineHeight: "1.0", letterSpacing: "-0.02em", color: "var(--fg-primary-hex)" }}
            >
              What clients say
            </h2>
          </ScrollReveal>

          {/* Featured review */}
          <ScrollReveal>
            <div
              className="p-8 md:p-12 rounded-2xl mb-4"
              style={{
                background: "var(--bg-warm-card, #231A13)",
                border: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)",
              }}
            >
              <Quotes size={28} className="mb-6" style={{ color: "color-mix(in srgb, var(--accent) 50%, transparent)" }} />
              <p
                className="text-xl md:text-2xl font-medium italic leading-relaxed mb-7"
                style={{ fontFamily: "var(--font-display-active, inherit)", color: "var(--fg-primary-hex)" }}
              >
                &ldquo;{REVIEWS[0].text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: REVIEWS[0].rating }).map((_, i) => (
                    <Star key={i} size={13} weight="fill" style={{ color: "var(--accent)" }} />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: fg(0.7) }}>{REVIEWS[0].name}</span>
                <span className="text-sm" style={{ color: fg(0.25) }}>·</span>
                <span className="text-sm" style={{ color: fg(0.4) }}>{REVIEWS[0].project}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Secondary reviews */}
          <ScrollReveal delay={80}>
            <div className="grid md:grid-cols-2 gap-4">
              {REVIEWS.slice(1).map((review) => (
                <div
                  key={review.name}
                  className="p-6 rounded-xl"
                  style={{
                    background: "var(--bg-warm-dark, #13100E)",
                    border: "1px solid var(--border-base)",
                  }}
                >
                  <p className="text-sm leading-relaxed mb-5" style={{ color: fg(0.5) }}>
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} size={11} weight="fill" style={{ color: "var(--accent)" }} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: fg(0.65) }}>{review.name}</span>
                    <span className="text-sm" style={{ color: fg(0.2) }}>·</span>
                    <span className="text-xs" style={{ color: fg(0.35) }}>{review.project}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ABOUT — reversed (image left, text right) ─────────────── */}
      <section id="demo-about" className="section-pad" style={{ background: "var(--bg-warm-dark, #13100E)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-[360px_1fr] gap-14 lg:gap-20 items-center">

            {/* Image — left side */}
            <ScrollReveal delay={60}>
              <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden hidden md:block"
                style={{
                  background: "var(--bg-warm-card, #231A13)",
                  border: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)",
                }}
              >
                {config.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={config.heroImageUrl}
                    alt={`${config.businessName} work`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse 80% 60% at 60% 30%, color-mix(in srgb, var(--accent) 15%, transparent), var(--bg-warm-card, #231A13))`,
                    }}
                  />
                )}
                {/* Accent corner block */}
                <div
                  className="absolute bottom-0 left-0 w-16 h-16"
                  style={{ background: "var(--accent)" }}
                  aria-hidden="true"
                />
              </div>
            </ScrollReveal>

            {/* Text — right side */}
            <ScrollReveal>
              <h2
                className="text-3xl md:text-4xl font-black mb-6"
                style={{ lineHeight: "1.0", letterSpacing: "-0.02em", color: "var(--fg-primary-hex)" }}
              >
                {config.businessName}
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: fg(0.55) }}>
                {config.aboutBlurb}
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Quality craftsmanship — every time",
                  "Clear communication from quote to walkthrough",
                  "Respect for your home, schedule, and budget",
                  "Honest estimates — what we quote is what you pay",
                ].map(value => (
                  <div key={value} className="flex items-start gap-3">
                    <CheckCircle size={15} weight="fill" className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                    <span className="text-sm leading-relaxed" style={{ color: fg(0.5) }}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {config.phone && (
                  <a href={`tel:${config.phone}`} className="flex items-center gap-3 w-fit" style={{ textDecoration: "none" }}>
                    <Phone size={15} style={{ color: "var(--accent)" }} />
                    <span className="text-sm" style={{ color: fg(0.55) }}>{config.phone}</span>
                  </a>
                )}
                {config.email && (
                  <a href={`mailto:${config.email}`} className="flex items-center gap-3 w-fit" style={{ textDecoration: "none" }}>
                    <EnvelopeSimple size={15} style={{ color: "var(--accent)" }} />
                    <span className="text-sm" style={{ color: fg(0.55) }}>{config.email}</span>
                  </a>
                )}
                <div className="flex items-center gap-3">
                  <MapPin size={15} style={{ color: "var(--accent)" }} />
                  <span className="text-sm" style={{ color: fg(0.55) }}>{config.location}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "var(--bg-warm-section, #1C1510)" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <h2
              className="text-3xl md:text-4xl font-black mb-12"
              style={{ lineHeight: "1.0", letterSpacing: "-0.02em", color: "var(--fg-primary-hex)" }}
            >
              Common questions
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={60}><FAQAccordion /></ScrollReveal>
        </div>
      </section>

      {/* ── CTA BAND ──────────────────────────────────────────────── */}
      <section style={{ background: "var(--accent)", padding: "4rem 0" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: "#0C1012", lineHeight: "1.1" }}>
              Ready to get started?
            </h2>
            <p className="text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>
              Free estimate, same-day response. {config.location} and BC Interior.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="#demo-contact"
              className="font-bold text-sm px-7 py-4 rounded-xl transition-all duration-200 flex items-center gap-2"
              style={{ background: "#0C1012", color: "#fff" }}
            >
              Get a Free Quote <ArrowRight size={16} weight="bold" />
            </a>
            {config.phone && (
              <a
                href={`tel:${config.phone}`}
                className="font-bold text-sm px-5 py-4 rounded-xl transition-all duration-200"
                style={{ background: "rgba(0,0,0,0.15)", color: "#0C1012" }}
              >
                <Phone size={16} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────── */}
      <section id="demo-contact" className="section-pad" style={{ background: "var(--bg-warm-dark, #13100E)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <h2
              className="text-3xl md:text-4xl font-black mb-3"
              style={{ lineHeight: "1.0", letterSpacing: "-0.02em", color: "var(--fg-primary-hex)" }}
            >
              Request a free quote
            </h2>
            <p className="text-base mb-12 max-w-md leading-relaxed" style={{ color: fg(0.4) }}>
              Describe your project and we&apos;ll get back to you the same day.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-start">
            <ScrollReveal><ContactForm /></ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="space-y-6">
                {config.phone && (
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: fg(0.2) }}>Call or Text</p>
                    <a href={`tel:${config.phone}`} className="text-base font-semibold transition-colors" style={{ color: fg(0.8), textDecoration: "none" }}>{config.phone}</a>
                  </div>
                )}
                {config.email && (
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: fg(0.2) }}>Email</p>
                    <a href={`mailto:${config.email}`} className="text-base font-semibold transition-colors" style={{ color: fg(0.8), textDecoration: "none" }}>{config.email}</a>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: fg(0.2) }}>Location</p>
                  <p className="text-base font-semibold" style={{ color: fg(0.8) }}>{config.location}</p>
                </div>
                {(config as any).address && (
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-base)" }}>
                    <iframe
                      title={`${config.businessName} location`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent((config as any).address)}&output=embed&hl=en`}
                      width="100%" height="200"
                      style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg) saturate(0.5) brightness(0.8)" }}
                      allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="py-7 px-5 md:px-10" style={{ borderTop: "1px solid var(--border-base)", background: "var(--bg-warm-section, #1C1510)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs" style={{ color: fg(0.2) }}>© {new Date().getFullYear()} {config.businessName}</p>
          <p className="text-xs" style={{ color: fg(0.15) }}>
            Website by{" "}
            <a href="https://designspore.co" target="_blank" rel="noopener noreferrer" style={{ color: fg(0.2), textDecoration: "none" }}>Design Spore</a>
          </p>
        </div>
      </footer>
    </>
  );
}

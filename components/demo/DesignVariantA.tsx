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

// Adaptive color helper — works in both dark and light mode
const fg = (opacity: number) => `rgba(var(--fg-r,255),var(--fg-g,255),var(--fg-b,255),${opacity})`;

export default function DesignVariantA({ config }: { config: Config }) {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100dvh] flex items-center"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 5% 95%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 60%),
            radial-gradient(ellipse 50% 40% at 90% 5%, color-mix(in srgb, var(--accent) 5%, transparent), transparent 55%),
            var(--bg-warm-dark, #13100E)`,
        }}
      >
        <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-28 md:py-36 w-full">
          <div className="grid md:grid-cols-[1fr_420px] gap-14 lg:gap-20 items-center">
            <div>
              <p className="hero-in hero-in-1 text-xs font-bold tracking-widest uppercase mb-7"
                style={{ color: "color-mix(in srgb, var(--accent) 70%, var(--fg-primary-hex, #fff))" }}>
                {config.location} &nbsp;·&nbsp; {config.industry}
              </p>
              <h1 className="hero-in hero-in-2 text-5xl md:text-6xl lg:text-7xl font-black mb-6"
                style={{ lineHeight: "0.95", letterSpacing: "-0.025em", color: "var(--fg-primary-hex)" }}>
                {config.tagline}
              </h1>
              <p className="hero-in hero-in-3 text-lg mb-10 leading-relaxed max-w-md" style={{ color: fg(0.55) }}>
                {config.subtagline}
              </p>
              <div className="hero-in hero-in-4 flex flex-col sm:flex-row gap-3">
                <a href="#demo-contact" className="btn-primary text-sm px-7 py-4 flex items-center gap-2">
                  Get a Free Quote <ArrowRight size={16} weight="bold" />
                </a>
                {config.phone && (
                  <a href={`tel:${config.phone}`} className="btn-outline text-sm px-7 py-4 flex items-center gap-2">
                    <Phone size={15} /> {config.phone}
                  </a>
                )}
              </div>
              <div className="hero-in hero-in-4 flex flex-wrap items-center gap-5 mt-9">
                {["Licensed & Insured", "Free Estimates", `${config.location} & BC Interior`].map(badge => (
                  <div key={badge} className="flex items-center gap-1.5">
                    <CheckCircle size={13} weight="fill" style={{ color: "color-mix(in srgb, var(--accent) 80%, var(--fg-primary-hex))" }} />
                    <span className="text-xs font-medium" style={{ color: fg(0.4) }}>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-in hero-in-3 relative hidden md:block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden"
                style={{
                  background: "var(--bg-warm-card, #231A13)",
                  border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
                }}>
                {config.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={config.heroImageUrl} alt={config.businessName} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0" style={{
                    background: `radial-gradient(ellipse 80% 60% at 30% 70%, color-mix(in srgb, var(--accent) 18%, transparent), var(--bg-warm-card, #231A13))`,
                  }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-center px-6 leading-relaxed" style={{ color: fg(0.1) }}>Hero photo goes here</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-5 left-5 right-5 rounded-xl px-4 py-3"
                  style={{
                    background: "color-mix(in srgb, var(--bg-warm-dark, #13100E) 85%, transparent)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)",
                  }}>
                  <p className="font-semibold text-sm" style={{ color: "var(--fg-primary-hex)" }}>{config.businessName}</p>
                  <p className="text-xs mt-0.5" style={{ color: fg(0.35) }}>{config.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <section id="demo-services" className="section-pad" style={{ background: "var(--bg-warm-section, #1C1510)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: "color-mix(in srgb, var(--accent) 70%, var(--fg-primary-hex))" }}>What We Do</p>
                <h2 className="text-3xl md:text-5xl font-black" style={{ lineHeight: "1.0", letterSpacing: "-0.02em", color: "var(--fg-primary-hex)" }}>
                  Our Services
                </h2>
              </div>
              <a href="#demo-contact" className="text-sm font-semibold flex items-center gap-1.5 shrink-0 pb-1"
                style={{ color: "var(--accent)", textDecoration: "none" }}>
                Request a Quote <ArrowRight size={14} weight="bold" />
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="stagger">
            <div>
              {config.services.map((service, i) => (
                <a key={service.name} href="#demo-contact"
                  className="group flex items-start gap-6 md:gap-10 py-7 transition-colors duration-200"
                  style={{ borderTop: "1px solid var(--border-base)", textDecoration: "none" }}>
                  <span className="text-xs font-black shrink-0 mt-1 tabular-nums"
                    style={{ color: "color-mix(in srgb, var(--accent) 50%, transparent)", minWidth: "2rem" }}>
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1.5 transition-colors"
                      style={{ color: fg(0.85) }}>
                      {service.name}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: fg(0.4) }}>{service.description}</p>
                  </div>
                  <ArrowRight size={16} weight="bold" className="shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    style={{ color: "var(--accent)" }} />
                </a>
              ))}
              <div style={{ borderTop: "1px solid var(--border-base)" }} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "var(--bg-warm-dark, #13100E)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <p className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "color-mix(in srgb, var(--accent) 70%, var(--fg-primary-hex))" }}>Our Process</p>
            <h2 className="text-3xl md:text-4xl font-black mb-16"
              style={{ lineHeight: "1.0", letterSpacing: "-0.02em", color: "var(--fg-primary-hex)" }}>
              What to expect
            </h2>
          </ScrollReveal>
          <div className="hidden md:grid grid-cols-4 gap-0 relative">
            <div className="absolute top-5 left-[15%] right-[15%] h-px" style={{ background: "var(--border-strong)" }} aria-hidden="true" />
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 80}>
                <div className="flex flex-col items-center text-center px-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-7 relative z-10"
                    style={{
                      background: i === 0 ? "var(--accent)" : "var(--bg-warm-card, #231A13)",
                      border: `1px solid ${i === 0 ? "transparent" : "var(--border-strong)"}`,
                    }}>
                    <span className="text-xs font-black tabular-nums"
                      style={{ color: i === 0 ? "#fff" : fg(0.4) }}>{step.num}</span>
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: "var(--fg-primary-hex)" }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: fg(0.4) }}>{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="md:hidden space-y-8">
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 60}>
                <div className="flex items-start gap-5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: i === 0 ? "var(--accent)" : "var(--bg-warm-card, #231A13)", border: `1px solid ${i === 0 ? "transparent" : "var(--border-strong)"}` }}>
                    <span className="text-xs font-black" style={{ color: i === 0 ? "#fff" : fg(0.4) }}>{step.num}</span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-sm font-bold mb-1" style={{ color: "var(--fg-primary-hex)" }}>{step.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: fg(0.4) }}>{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED REVIEW ───────────────────────────────────────── */}
      <section id="demo-social-proof" className="section-pad" style={{ background: "var(--bg-warm-section, #1C1510)" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <div className="text-center py-4 md:py-8" style={{ borderBottom: "1px solid var(--border-base)" }}>
              <Quotes size={36} className="mx-auto mb-8" style={{ color: "color-mix(in srgb, var(--accent) 45%, transparent)" }} />
              <p className="text-xl md:text-2xl lg:text-3xl font-medium italic leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-display-active, inherit)", color: "var(--fg-primary-hex)" }}>
                &ldquo;{REVIEWS[0].text}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: REVIEWS[0].rating }).map((_, i) => (
                    <Star key={i} size={13} weight="fill" style={{ color: "var(--accent)" }} />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: fg(0.6) }}>{REVIEWS[0].name}</span>
                <span className="text-sm" style={{ color: fg(0.25) }}>·</span>
                <span className="text-sm" style={{ color: fg(0.35) }}>{REVIEWS[0].project}</span>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="grid md:grid-cols-2 gap-0">
              {REVIEWS.slice(1).map((review, i) => (
                <div key={review.name} className="py-8 flex flex-col gap-4"
                  style={{
                    borderRight: i === 0 ? "1px solid var(--border-base)" : "none",
                    paddingLeft: i === 1 ? "2.5rem" : "0",
                    paddingRight: i === 0 ? "2.5rem" : "0",
                  }}>
                  <p className="text-sm leading-relaxed" style={{ color: fg(0.55) }}>&ldquo;{review.text}&rdquo;</p>
                  <div className="flex items-center gap-2.5 mt-auto">
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} size={11} weight="fill" style={{ color: "var(--accent)" }} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: fg(0.65) }}>{review.name}</span>
                    <span className="text-sm" style={{ color: fg(0.2) }}>·</span>
                    <span className="text-xs" style={{ color: fg(0.3) }}>{review.project}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section id="demo-about" className="section-pad" style={{ background: "var(--bg-warm-dark, #13100E)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-[1fr_360px] gap-14 lg:gap-20 items-start">
            <ScrollReveal>
              <p className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "color-mix(in srgb, var(--accent) 70%, var(--fg-primary-hex))" }}>About Us</p>
              <h2 className="text-3xl md:text-4xl font-black mb-7"
                style={{ lineHeight: "1.0", letterSpacing: "-0.02em", color: "var(--fg-primary-hex)" }}>
                {config.businessName}
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: fg(0.55) }}>{config.aboutBlurb}</p>
              <div className="flex flex-col gap-3 pt-2">
                {config.phone && (
                  <a href={`tel:${config.phone}`} className="flex items-center gap-3 group w-fit" style={{ textDecoration: "none" }}>
                    <Phone size={15} style={{ color: "var(--accent)" }} />
                    <span className="text-sm transition-colors" style={{ color: fg(0.55) }}>{config.phone}</span>
                  </a>
                )}
                {config.email && (
                  <a href={`mailto:${config.email}`} className="flex items-center gap-3 group w-fit" style={{ textDecoration: "none" }}>
                    <EnvelopeSimple size={15} style={{ color: "var(--accent)" }} />
                    <span className="text-sm transition-colors" style={{ color: fg(0.55) }}>{config.email}</span>
                  </a>
                )}
                <div className="flex items-center gap-3">
                  <MapPin size={15} style={{ color: "var(--accent)" }} />
                  <span className="text-sm" style={{ color: fg(0.55) }}>{config.location}</span>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="space-y-4 md:pt-20">
                {["Quality craftsmanship — every time", "Clear communication from quote to walkthrough", "Respect for your home, schedule, and budget", "Honest estimates — what we quote is what you pay"].map(value => (
                  <div key={value} className="flex items-start gap-3">
                    <CheckCircle size={15} weight="fill" className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                    <span className="text-sm leading-relaxed" style={{ color: fg(0.5) }}>{value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "var(--bg-warm-section, #1C1510)" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <p className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "color-mix(in srgb, var(--accent) 70%, var(--fg-primary-hex))" }}>Questions</p>
            <h2 className="text-3xl md:text-4xl font-black mb-12"
              style={{ lineHeight: "1.0", letterSpacing: "-0.02em", color: "var(--fg-primary-hex)" }}>
              Common questions
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={60}><FAQAccordion /></ScrollReveal>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────── */}
      <section id="demo-contact" className="section-pad" style={{ background: "var(--bg-warm-dark, #13100E)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <ScrollReveal>
            <p className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "color-mix(in srgb, var(--accent) 70%, var(--fg-primary-hex))" }}>Get in Touch</p>
            <h2 className="text-3xl md:text-4xl font-black mb-3"
              style={{ lineHeight: "1.0", letterSpacing: "-0.02em", color: "var(--fg-primary-hex)" }}>
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
            <a href="https://designspore.co" target="_blank" rel="noopener noreferrer"
              style={{ color: fg(0.2), textDecoration: "none" }}>Design Spore</a>
          </p>
        </div>
      </footer>
    </>
  );
}

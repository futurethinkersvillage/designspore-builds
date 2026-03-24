import demoConfigRaw from "@/demo-config.json";
import type { DemoConfig } from "@/lib/demo-config";
import DemoHeader from "@/components/layout/DemoHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/ui/ContactForm";
import ChatbotWidget from "@/components/demo/ChatbotWidget";
import {
  ArrowRight,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  EnvelopeSimple,
  Quotes,
} from "@phosphor-icons/react/dist/ssr";

const config = demoConfigRaw as DemoConfig & { address?: string; portalDemoUrl?: string };

// ── Process steps — override via config in future if needed ──────────────────
const PROCESS_STEPS = [
  { num: "01", title: "Get in Touch", desc: "Call, email, or fill out the form. We respond the same day." },
  { num: "02", title: "Free Quote", desc: "We visit the site, assess the scope, and give you a detailed estimate." },
  { num: "03", title: "We Get to Work", desc: "Skilled crew, quality materials, and consistent communication throughout." },
  { num: "04", title: "Final Walkthrough", desc: "We review every detail with you before signing off. No surprises." },
];

// ── Placeholder reviews — swap for real ones via config ───────────────────────
const REVIEWS = [
  {
    name: "D. Hartmann",
    text: "Sean was communicative from start to finish. The deck turned out better than we imagined — solid craftsmanship and they left the site clean.",
    rating: 5,
    project: "Deck Build",
  },
  {
    name: "T. Renwick",
    text: "Got quotes from three contractors. SGM was upfront about costs, stuck to the timeline, and the kitchen reno came out exactly as planned.",
    rating: 5,
    project: "Kitchen Renovation",
  },
  {
    name: "M. Calloway",
    text: "Responsive, respectful of our home, and genuinely good work. We've already referred two neighbours.",
    rating: 5,
    project: "Interior Carpentry",
  },
];

export default function HomePage() {
  return (
    <>
      <DemoHeader />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100dvh] flex items-center"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 100%, color-mix(in srgb, var(--accent, #BE8C2A) 7%, transparent), transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 0%, color-mix(in srgb, var(--accent, #BE8C2A) 5%, transparent), transparent 55%),
            var(--bg-body)`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32 w-full">
          {config.heroStyle === "split" ? (
            <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-center">
              {/* Left: copy */}
              <div>
                <p className="hero-in hero-in-1 section-label mb-5">
                  {config.location} · {config.industry}
                </p>
                <h1 className="hero-in hero-in-2 text-4xl md:text-5xl lg:text-[3.5rem] font-black mb-6 text-white" style={{ lineHeight: "1.05" }}>
                  {config.tagline}
                </h1>
                <p className="hero-in hero-in-3 text-lg text-white/60 mb-8 leading-relaxed max-w-lg">
                  {config.subtagline}
                </p>
                <div className="hero-in hero-in-4 flex flex-col sm:flex-row gap-3">
                  <a href="#demo-contact" className="btn-primary text-base px-7 py-4 flex items-center gap-2">
                    Get a Free Quote <ArrowRight size={18} weight="bold" />
                  </a>
                  {config.phone && (
                    <a href={`tel:${config.phone}`} className="btn-outline text-base px-7 py-4 flex items-center gap-2">
                      <Phone size={16} /> {config.phone}
                    </a>
                  )}
                </div>

                {/* Trust signals */}
                <div className="hero-in hero-in-4 flex flex-wrap items-center gap-4 mt-8">
                  {["Licensed & Insured", "Free Estimates", "Kamloops & BC Interior"].map(badge => (
                    <div key={badge} className="flex items-center gap-1.5">
                      <CheckCircle size={14} style={{ color: "var(--accent, #BE8C2A)" }} />
                      <span className="text-white/50 text-sm">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: image placeholder */}
              <div className="hero-in hero-in-3 relative">
                <div
                  className="aspect-[4/3] rounded-2xl overflow-hidden flex items-end p-6"
                  style={{
                    background: "var(--bg-raised)",
                    border: "1px solid var(--border-base)",
                  }}
                >
                  {/* Image goes here — add via config.heroImageUrl */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/15 text-sm text-center px-6">Hero image<br />goes here</p>
                  </div>
                  <div
                    className="relative z-10 rounded-xl px-4 py-3 w-full"
                    style={{ background: "color-mix(in srgb, var(--bg-section) 90%, transparent)", backdropFilter: "blur(8px)", border: "1px solid var(--border-base)" }}
                  >
                    <p className="text-white font-semibold text-sm">{config.businessName}</p>
                    <p className="text-white/45 text-xs mt-0.5">{config.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* minimal */
            <div className="max-w-3xl">
              <p className="hero-in hero-in-1 section-label mb-5">{config.location} · {config.industry}</p>
              <h1 className="hero-in hero-in-2 text-5xl md:text-6xl font-black mb-6 text-white" style={{ lineHeight: "1.05" }}>
                {config.tagline}
              </h1>
              <p className="hero-in hero-in-3 text-xl text-white/60 mb-8 leading-relaxed">{config.subtagline}</p>
              <div className="hero-in hero-in-4 flex flex-col sm:flex-row gap-3">
                <a href="#demo-contact" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                  Get a Free Quote <ArrowRight size={18} weight="bold" />
                </a>
                {config.phone && (
                  <a href={`tel:${config.phone}`} className="btn-outline text-base px-8 py-4 flex items-center gap-2">
                    <Phone size={16} /> {config.phone}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <section id="demo-services" className="section-pad bg-darker">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <ScrollReveal>
            <p className="section-label">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              Our Services
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger">
            <div className="grid sm:grid-cols-2 gap-px" style={{ background: "var(--border-base)", borderRadius: "1rem", overflow: "hidden" }}>
              {config.services.map((service, i) => (
                <div
                  key={service.name}
                  className="p-7 group"
                  style={{ background: "var(--bg-card)" }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="text-xs font-black mt-0.5 shrink-0 w-6 h-6 rounded flex items-center justify-center"
                      style={{
                        color: "var(--accent, #BE8C2A)",
                        background: "color-mix(in srgb, var(--accent, #BE8C2A) 10%, transparent)",
                      }}
                    >
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-white font-bold text-base mb-1.5">{service.name}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mt-8 text-center">
              <a href="#demo-contact" className="btn-outline inline-flex items-center gap-2 px-6 py-3">
                Request a Free Quote <ArrowRight size={15} weight="bold" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <ScrollReveal>
            <p className="section-label">Our Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-14">
              How it works
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 70}>
                <div className="relative">
                  <p className="text-5xl font-black mb-4 leading-none" style={{ color: "color-mix(in srgb, var(--accent, #BE8C2A) 25%, transparent)" }}>
                    {step.num}
                  </p>
                  <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section id="demo-about" className="section-pad bg-darker">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-start">
            <ScrollReveal>
              <p className="section-label">About Us</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                {config.businessName}
              </h2>
              <p className="text-white/65 text-lg leading-relaxed mb-8">{config.aboutBlurb}</p>

              <div className="flex flex-col gap-3">
                {config.phone && (
                  <a href={`tel:${config.phone}`} className="flex items-center gap-3 group w-fit">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent, #BE8C2A) 12%, transparent)" }}>
                      <Phone size={15} style={{ color: "var(--accent, #BE8C2A)" }} />
                    </div>
                    <span className="text-white/65 text-sm group-hover:text-white/90 transition-colors">{config.phone}</span>
                  </a>
                )}
                {config.email && (
                  <a href={`mailto:${config.email}`} className="flex items-center gap-3 group w-fit">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent, #BE8C2A) 12%, transparent)" }}>
                      <EnvelopeSimple size={15} style={{ color: "var(--accent, #BE8C2A)" }} />
                    </div>
                    <span className="text-white/65 text-sm group-hover:text-white/90 transition-colors">{config.email}</span>
                  </a>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent, #BE8C2A) 12%, transparent)" }}>
                    <MapPin size={15} style={{ color: "var(--accent, #BE8C2A)" }} />
                  </div>
                  <span className="text-white/65 text-sm">{config.location}</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              {/* Values */}
              <div className="space-y-3 pt-1 md:pt-16">
                {["Quality craftsmanship on every project", "Clear communication throughout", "Respect for your home and time", "No surprises — honest quotes"].map(value => (
                  <div key={value} className="flex items-start gap-3">
                    <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: "var(--accent, #BE8C2A)" }} />
                    <span className="text-white/65 text-sm leading-relaxed">{value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ───────────────────────────────────────────────── */}
      <section id="demo-social-proof" className="section-pad bg-dark">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <ScrollReveal>
            <p className="section-label">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              What clients say
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger">
            <div className="grid md:grid-cols-3 gap-5">
              {REVIEWS.map((review) => (
                <div
                  key={review.name}
                  className="rounded-xl p-6 flex flex-col gap-4"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-base)",
                  }}
                >
                  <Quotes size={24} style={{ color: "color-mix(in srgb, var(--accent, #BE8C2A) 35%, transparent)" }} />
                  <p className="text-white/70 text-sm leading-relaxed flex-1">{review.text}</p>
                  <div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={12} weight="fill" style={{ color: "var(--accent, #BE8C2A)" }} />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm font-semibold">{review.name}</p>
                    <p className="text-white/35 text-xs mt-0.5">{review.project}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CONTACT + MAPS ────────────────────────────────────────── */}
      <section id="demo-contact" className="section-pad bg-darker">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <ScrollReveal>
            <p className="section-label justify-center text-center">Get in Touch</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 text-center">
              Request a free quote
            </h2>
            <p className="text-white/50 text-lg mb-12 max-w-lg mx-auto text-center leading-relaxed">
              Describe your project and we&apos;ll get back to you the same day with next steps.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-start">
            {/* Contact form */}
            <ScrollReveal>
              <div
                className="rounded-2xl p-7"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-base)",
                }}
              >
                <ContactForm />
              </div>
            </ScrollReveal>

            {/* Contact info + map */}
            <ScrollReveal delay={80}>
              <div className="space-y-4">
                {/* Contact cards */}
                {[
                  config.phone && { icon: Phone, label: "Call or Text", value: config.phone, href: `tel:${config.phone}` },
                  config.email && { icon: EnvelopeSimple, label: "Email", value: config.email, href: `mailto:${config.email}` },
                  { icon: MapPin, label: "Location", value: config.location, href: "#" },
                ].filter(Boolean).map((item) => {
                  if (!item) return null;
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 rounded-xl p-4 transition-all"
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-base)",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "color-mix(in srgb, var(--accent, #BE8C2A) 12%, transparent)" }}
                      >
                        <Icon size={18} style={{ color: "var(--accent, #BE8C2A)" }} />
                      </div>
                      <div>
                        <p className="text-white/35 text-xs mb-0.5">{item.label}</p>
                        <p className="text-white font-medium text-sm">{item.value}</p>
                      </div>
                    </a>
                  );
                })}

                {/* Google Maps embed */}
                {config.address && (
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-base)" }}>
                    <iframe
                      title={`${config.businessName} location`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(config.address)}&output=embed&hl=en`}
                      width="100%"
                      height="220"
                      style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.85)" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-5 md:px-8 text-center"
        style={{ borderTop: "1px solid var(--border-base)", background: "var(--bg-section)" }}
      >
        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} {config.businessName} · {config.location}
          <span className="mx-2 text-white/10">·</span>
          <span>
            Website by{" "}
            <a href="https://designspore.co" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "rgba(190,140,42,0.5)" }}>
              Design Spore
            </a>
          </span>
        </p>
      </footer>

      {/* ── CHATBOT (floating) ────────────────────────────────────── */}
      <ChatbotWidget config={config} />
    </>
  );
}

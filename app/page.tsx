import demoConfigRaw from "@/demo-config.json";
import type { DemoConfig } from "@/lib/demo-config";
import DemoHeader from "@/components/layout/DemoHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/ui/ContactForm";
import ChatNowButton from "@/components/ui/ChatNowButton";
import {
  ArrowRight,
  CheckCircle,
  ChatCircle,
  PhoneCall,
  Star,
  Robot,
  Clock,
  EnvelopeSimple,
  MapPin,
  Phone,
} from "@phosphor-icons/react/dist/ssr";

const config = demoConfigRaw as DemoConfig;

// Map AI feature IDs to display info
const AI_FEATURE_INFO: Record<string, { label: string; description: string; icon: React.ElementType }> = {
  "chatbot": {
    label: "24/7 AI Chatbot",
    description: "Answers questions, qualifies leads, and captures contact info automatically — even at 2am.",
    icon: ChatCircle,
  },
  "missed-call-text-back": {
    label: "Missed-Call Text-Back",
    description: "Every missed call gets an instant text reply so leads don't go cold before you call back.",
    icon: PhoneCall,
  },
  "review-automation": {
    label: "Automated Reviews",
    description: "Happy customers get a review request automatically. Your Google rating climbs on autopilot.",
    icon: Star,
  },
  "estimate-follow-up": {
    label: "Estimate Follow-Up",
    description: "Quotes that don't hear back trigger a timed follow-up sequence. Close more jobs, less chasing.",
    icon: Clock,
  },
  "lead-response": {
    label: "Instant Lead Response",
    description: "New leads get a personalized reply within seconds — before they even check a competitor.",
    icon: Robot,
  },
};

export default function HomePage() {
  const aiFeatures = config.aiFeatures
    .map(id => ({ id, ...AI_FEATURE_INFO[id] }))
    .filter(f => f.label);

  return (
    <>
      <DemoHeader />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        className="relative min-h-[85vh] flex items-center"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--accent, #BE8C2A) 12%, transparent), transparent 70%),
            linear-gradient(180deg, #0C1012 0%, #131719 100%)`,
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-32">
          {config.heroStyle === "centered" ? (
            <div className="text-center max-w-4xl mx-auto">
              <p className="hero-in hero-in-1 section-label justify-center mb-6">
                {config.location} · {config.industry}
              </p>
              <h1
                className="hero-in hero-in-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-white"
                style={{ lineHeight: "1.0" }}
              >
                {config.tagline}
              </h1>
              <p className="hero-in hero-in-3 text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                {config.subtagline}
              </p>
              <div className="hero-in hero-in-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a href="#demo-contact" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                  Get a Free Quote <ArrowRight size={18} weight="bold" />
                </a>
                {config.phone && (
                  <a href={`tel:${config.phone}`} className="btn-outline text-base px-8 py-4 flex items-center gap-2">
                    <Phone size={16} />
                    {config.phone}
                  </a>
                )}
              </div>
            </div>
          ) : config.heroStyle === "split" ? (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="hero-in hero-in-1 section-label mb-6">{config.location} · {config.industry}</p>
                <h1 className="hero-in hero-in-2 text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
                  {config.tagline}
                </h1>
                <p className="hero-in hero-in-3 text-lg text-white/60 mb-8 leading-relaxed">{config.subtagline}</p>
                <div className="hero-in hero-in-4 flex flex-col sm:flex-row gap-3">
                  <a href="#demo-contact" className="btn-primary text-base px-7 py-4 flex items-center gap-2">
                    Get a Free Quote <ArrowRight size={18} weight="bold" />
                  </a>
                  {config.phone && (
                    <a href={`tel:${config.phone}`} className="btn-outline text-base px-7 py-4 flex items-center gap-2">
                      <Phone size={16} /> Call Us
                    </a>
                  )}
                </div>
              </div>
              <div className="hero-in hero-in-3">
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white mx-auto mb-4"
                    style={{ background: "var(--accent, #BE8C2A)" }}
                  >
                    {config.businessName.charAt(0)}
                  </div>
                  <p className="text-white font-bold text-xl mb-1">{config.businessName}</p>
                  <p className="text-white/50 text-sm">{config.location}</p>
                </div>
              </div>
            </div>
          ) : (
            /* minimal */
            <div className="max-w-3xl">
              <p className="hero-in hero-in-1 section-label mb-6">{config.industry}</p>
              <h1 className="hero-in hero-in-2 text-5xl md:text-6xl font-black mb-6 text-white">{config.tagline}</h1>
              <p className="hero-in hero-in-3 text-xl text-white/60 mb-8">{config.subtagline}</p>
              <div className="hero-in hero-in-4 flex gap-3">
                <a href="#demo-contact" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                  Get Started <ArrowRight size={18} weight="bold" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section id="demo-services" className="section-pad bg-darker">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <ScrollReveal>
            <p className="section-label">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Services Built for {config.industry.split("/")[0].trim()} businesses
            </h2>
            <p className="text-white/55 text-lg max-w-2xl mb-14">
              Everything you need to run efficiently and win more jobs — handled by experts who understand your industry.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="stagger">
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {config.services.map((service) => (
                <div key={service.name} className="card-premium p-6 group">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white font-black text-lg"
                    style={{ background: "color-mix(in srgb, var(--accent, #BE8C2A) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--accent, #BE8C2A) 25%, transparent)" }}
                  >
                    <span style={{ color: "var(--accent, #BE8C2A)" }}>✓</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-accent transition-colors" style={{ "--tw-text-opacity": "1" } as React.CSSProperties}>
                    {service.name}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── AI FEATURES ───────────────────────────────────────── */}
      {aiFeatures.length > 0 && (
        <section id="demo-ai-features" className="section-pad bg-dark relative overflow-hidden">
          {/* Ambient glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, color-mix(in srgb, var(--accent, #BE8C2A) 6%, transparent), transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-6xl mx-auto px-5 md:px-8">
            <ScrollReveal>
              <p className="section-label">AI-Powered</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Your business, running smarter
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mb-14">
                These AI features are already integrated into this demo. They work quietly in the background,
                capturing leads and following up so you don&apos;t have to.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6">
              {aiFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <ScrollReveal key={feature.id} delay={i * 80}>
                    <div
                      className="rounded-xl p-6 h-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                        border: "1px solid color-mix(in srgb, var(--accent, #BE8C2A) 20%, rgba(255,255,255,0.05))",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: "color-mix(in srgb, var(--accent, #BE8C2A) 12%, transparent)" }}
                      >
                        <Icon size={24} style={{ color: "var(--accent, #BE8C2A)" }} />
                      </div>
                      <h3 className="text-white font-bold text-base mb-2">{feature.label}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Try the chatbot callout */}
            <ScrollReveal delay={200}>
              <div
                className="mt-12 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                style={{
                  background: "color-mix(in srgb, var(--accent, #BE8C2A) 6%, #1B2126)",
                  border: "1px solid color-mix(in srgb, var(--accent, #BE8C2A) 25%, transparent)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "color-mix(in srgb, var(--accent, #BE8C2A) 20%, transparent)" }}
                  >
                    <ChatCircle size={24} style={{ color: "var(--accent, #BE8C2A)" }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Try the AI chatbot</p>
                    <p className="text-white/50 text-sm">It&apos;s live — ask it anything about {config.businessName}</p>
                  </div>
                </div>
                <ChatNowButton />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── SOCIAL PROOF ──────────────────────────────────────── */}
      <section id="demo-social-proof" className="section-pad bg-raised">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <ScrollReveal>
            <p className="section-label">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              What customers say
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger">
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { name: "Sarah M.", text: "Called at 7am with a burst pipe — they were there within the hour. Couldn't believe how fast.", rating: 5 },
                { name: "James K.", text: "Got a text back immediately when I missed them. Booked the appointment right there. So easy.", rating: 5 },
                { name: "Linda T.", text: "Transparent pricing, no surprises. The work was clean and they cleaned up after themselves. 10/10.", rating: 5 },
              ].map((review) => (
                <div key={review.name} className="card-premium p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={14} weight="fill" style={{ color: "var(--accent, #BE8C2A)" }} />
                    ))}
                  </div>
                  <p className="text-white/75 text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "color-mix(in srgb, var(--accent, #BE8C2A) 30%, #212A31)" }}
                    >
                      {review.name.charAt(0)}
                    </div>
                    <p className="text-white/60 text-sm font-medium">{review.name}</p>
                    <div className="flex items-center gap-1 ml-auto">
                      <CheckCircle size={12} style={{ color: "var(--accent, #BE8C2A)" }} />
                      <span className="text-white/30 text-xs">Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <section id="demo-about" className="section-pad bg-dark">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <p className="section-label">About Us</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                {config.businessName}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">{config.aboutBlurb}</p>
              <div className="flex items-center gap-3">
                <MapPin size={16} style={{ color: "var(--accent, #BE8C2A)" }} />
                <span className="text-white/60 text-sm">{config.location}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Years in Business", value: "15+" },
                  { label: "Jobs Completed", value: "2,400+" },
                  { label: "Response Time", value: "< 1 hr" },
                  { label: "Customer Rating", value: "4.9 ★" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-5 text-center"
                    style={{ background: "#1B2126", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p
                      className="text-3xl font-black mb-1"
                      style={{ color: "var(--accent, #BE8C2A)" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-white/50 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CONTACT / CTA ─────────────────────────────────────── */}
      <section id="demo-contact" className="section-pad bg-darker">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <ScrollReveal>
            <p className="section-label justify-center">Get in Touch</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/55 text-lg mb-12 max-w-xl mx-auto">
              Get a free quote for your project. We respond within the hour during business hours — and within seconds after hours.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              {[
                config.phone && { icon: Phone, label: "Call or Text", value: config.phone, href: `tel:${config.phone}` },
                config.email && { icon: EnvelopeSimple, label: "Email Us", value: config.email, href: `mailto:${config.email}` },
                { icon: MapPin, label: "Location", value: config.location, href: "#" },
              ].filter(Boolean).map((item) => {
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="card-premium p-5 flex flex-col items-center gap-2 hover:no-underline"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "color-mix(in srgb, var(--accent, #BE8C2A) 12%, transparent)" }}
                    >
                      <Icon size={20} style={{ color: "var(--accent, #BE8C2A)" }} />
                    </div>
                    <p className="text-white/40 text-xs">{item.label}</p>
                    <p className="text-white font-medium text-sm">{item.value}</p>
                  </a>
                );
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div
              className="rounded-2xl p-8 md:p-12"
              style={{
                background: "linear-gradient(135deg, #1B2126, #212A31)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h3 className="text-white font-bold text-xl mb-6">Request a Free Quote</h3>
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer
        className="py-8 px-5 md:px-8 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0C1012" }}
      >
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} {config.businessName} · {config.location}
          <span className="mx-2 text-white/15">·</span>
          <span>
            Demo built by{" "}
            <a href="https://designspore.co" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "#BE8C2A" }}>
              Design Spore
            </a>
          </span>
        </p>
      </footer>
    </>
  );
}

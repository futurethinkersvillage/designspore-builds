import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "AI Services",
  description: "Practical AI systems for real businesses. Websites, chatbots, AI phone systems, CRM, automation, and more.",
};

const services = [
  { title: "New Websites & Rebuilds", desc: "Fast, modern, conversion-focused websites that actually work on mobile. Built to rank, built to convert." },
  { title: "AI Chatbots & Customer Service", desc: "24/7 chat automation that answers questions, qualifies leads, and books appointments while you sleep." },
  { title: "AI Phone Systems & Missed-Call Text-Back", desc: "Never lose a lead to voicemail. Automated text responses fire the second a call goes unanswered." },
  { title: "Lead Capture & Qualification", desc: "Automated intake forms, triage sequences, and follow-up that separates serious buyers from tire kickers." },
  { title: "Automated Email Response", desc: "Instant, intelligent replies to incoming inquiries. Smart routing that sends the right message at the right time." },
  { title: "CRM & Pipeline Setup", desc: "Organize your leads, track every job, and never lose track of a follow-up again." },
  { title: "Quote & Invoice Automation", desc: "Cut admin time in half. Automated estimates and invoices that go out fast and follow up automatically." },
  { title: "Review Request & Reputation Systems", desc: "Get 5-star reviews on autopilot. Systematic follow-up sequences that turn happy customers into public proof." },
  { title: "Local SEO & Google Business Profile", desc: "Dominate local search. Get found by customers in your area who are ready to buy right now." },
  { title: "Knowledge Base & SOP Assistants", desc: "AI that knows your business and trains your team — available 24/7, never forgets, never calls in sick." },
];

const packages = [
  {
    name: "Starter",
    tagline: "Get online and start capturing leads",
    includes: ["Professional website", "Basic AI chatbot", "Contact form automation", "Google Business Profile setup", "Monthly report"],
    cta: "Book a Call",
  },
  {
    name: "Growth",
    tagline: "Full automation stack for a scaling business",
    includes: ["Everything in Starter", "AI phone & missed-call text-back", "CRM setup & pipeline", "Automated email sequences", "Review request system", "Lead qualification flows", "Bi-weekly check-ins"],
    cta: "Book a Call",
    featured: true,
  },
  {
    name: "Ops Partner",
    tagline: "Ongoing AI systems management",
    includes: ["Everything in Growth", "Monthly strategy sessions", "Continuous automation improvements", "Custom AI integrations", "Priority support", "Quarterly audits"],
    cta: "Book a Call",
  },
];

const aiCaseStudies = caseStudies.filter((cs) => cs.relatedServices.includes("ai-services"));

export default function AIServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-pad bg-darker border-b border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">AI Services</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9] mb-6" style={{ fontFamily: "var(--font-archivo)" }}>
              Practical AI for real business operations.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed mb-10">
              We build the systems that save you time, capture more leads, and modernize how your
              business runs — without the fluff.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark font-bold text-lg tracking-wide hover:bg-gold-light btn-press">
                Book a Strategy Call <ArrowRightIcon size={16} weight="bold" />
              </a>
              <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-4 rounded border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">What we build</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-archivo)" }}>
              The full AI services stack.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8 rounded-xl overflow-hidden border border-white/8">
            {services.map(({ title, desc }) => (
              <div key={title} className="p-7 md:p-8 bg-dark hover:bg-raised transition-colors group">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-archivo)" }}>{title}</h3>
                <p className="text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Packages</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-archivo)" }}>
              Pick a starting point.
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-xl">
              Every business is different. These packages are starting points — we&apos;ll scope exactly what you need on the call.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map(({ name, tagline, includes, cta, featured }) => (
              <div key={name} className={`rounded-xl p-8 border flex flex-col ${featured ? "bg-dark border-gold/40 ring-1 ring-gold/20" : "bg-dark border-white/10"}`}>
                {featured && <span className="tag mb-4 self-start">Most popular</span>}
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-archivo)" }}>{name}</h3>
                <p className="text-white/40 text-sm mb-6">{tagline}</p>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                      <CheckIcon size={16} weight="bold" className="text-gold mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center px-6 py-3 rounded font-bold text-sm tracking-wide transition-all btn-press ${featured ? "bg-gold text-dark hover:bg-gold-light" : "border-2 border-white/20 text-white hover:border-white/40"}`}>
                  {cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Proof */}
      {aiCaseStudies.length > 0 && (
        <section className="section-pad bg-dark">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="mb-14">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Proof</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-archivo)" }}>
                Results from the field.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiCaseStudies.slice(0, 2).map(({ slug, name, tagline, tags }) => (
                <Link key={slug} href={`/case-studies/${slug}`} className="group p-8 rounded-xl border border-white/8 bg-raised hover:border-gold/30 transition-all block">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-archivo)" }}>{name}</h3>
                  <p className="text-white/40">{tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="section-pad bg-raised border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5" style={{ fontFamily: "var(--font-archivo)" }}>
            Ready to build your AI stack?
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto mb-10">
            Book a free 30-minute strategy call. We&apos;ll identify the highest-impact automation for your business.
          </p>
          <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded bg-gold text-dark text-lg font-bold tracking-wide hover:bg-gold-light btn-press">
            Book a Strategy Call <ArrowRightIcon size={18} weight="bold" />
          </a>
        </div>
      </section>
    </>
  );
}

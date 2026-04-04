import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Launch Services",
  description: "Strategy, brand, media, and launch activation for new ventures, campaigns, and initiatives.",
};

const services = [
  { title: "Strategy & Positioning", desc: "Define your mission, target audience, value proposition, and launch roadmap. We help you shape the story and the structure behind your brand." },
  { title: "Brand & Identity Design", desc: "Logo, visual identity, messaging, and web presence — cohesive and ready for public eyes. Built to last, not just to launch." },
  { title: "Media & Content Production", desc: "Cinematic video, photography, podcasts, interviews, short-form social clips — all crafted to tell your story and drive engagement." },
  { title: "Partnerships & Influencer Strategy", desc: "We connect you with collaborators, sponsors, and amplifiers who share your audience and values." },
  { title: "Paid Growth & Campaign Optimization", desc: "Launch, test, and scale through ads, PPC, funnels, and conversion optimization. Systems that deliver measurable growth." },
  { title: "Launch Activation & Momentum", desc: "We coordinate the go-live moment and manage the early traction phase — from press and partnerships to data tracking and iteration." },
];

const audiences = [
  "New businesses & startups",
  "Product & service launches",
  "Personal brands & thought leaders",
  "Fundraising campaigns",
  "Events, retreats & summits",
  "Social movements & community initiatives",
  "Media platforms & podcasts",
  "Nonprofits & cause-driven projects",
  "Foundations & organizations",
  "Future-facing ventures",
];

const launchCaseStudies = caseStudies.filter((cs) => cs.relatedServices.includes("launch-services"));

export default function LaunchServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-pad bg-darker border-b border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">Launch Services</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9] mb-6" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
              Positioning, strategy, brand, and media for new ventures.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed mb-10">
              For founders, campaigns, media brands, events, and future-facing
              initiatives that need to make an impact fast.
            </p>
            <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark font-bold text-lg tracking-wide hover:bg-gold-light btn-press">
              Start a Plan <ArrowRightIcon size={16} weight="bold" />
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">What&apos;s included</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
              End-to-end launch capability.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8 rounded-xl overflow-hidden border border-white/8">
            {services.map(({ title, desc }) => (
              <div key={title} className="p-7 md:p-8 bg-dark hover:bg-raised transition-colors group">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>{title}</h3>
                <p className="text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Who it&apos;s for</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
                If it needs a launch, we can handle it.
              </h2>
              <p className="mt-5 text-white/50 leading-relaxed">
                We&apos;ve helped visionary projects raise millions, reach global audiences,
                and shape emerging movements in tech, culture, and community.
              </p>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <div className="flex flex-wrap gap-2">
                {audiences.map((a) => (
                  <span key={a} className="tag">{a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Proof</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
                Launch results we&apos;re proud of.
              </h2>
            </div>
            <Link href="/case-studies" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-semibold shrink-0">
              View all work <ArrowRightIcon size={14} weight="bold" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {launchCaseStudies.slice(0, 3).map(({ slug, name, tagline, stats, tags }) => (
              <Link key={slug} href={`/case-studies/${slug}`} className="group p-7 rounded-xl border border-white/8 bg-raised hover:border-gold/30 transition-all block">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>{name}</h3>
                <p className="text-sm text-white/40 mb-4">{tagline}</p>
                {stats && (
                  <p className="text-lg font-bold text-gold">{stats[0].value} <span className="text-sm text-white/30 font-normal">{stats[0].label}</span></p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-raised border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
            Ready to launch?
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto mb-10">
            Tell us about your project and we&apos;ll put together a plan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded bg-gold text-dark text-lg font-bold tracking-wide hover:bg-gold-light btn-press">
              Start a Plan <ArrowRightIcon size={18} weight="bold" />
            </a>
            <Link href="/case-studies" className="inline-flex items-center gap-3 px-10 py-4 rounded border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all">
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

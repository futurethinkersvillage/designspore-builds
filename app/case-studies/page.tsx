import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { caseStudies, tagLabels } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real results across AI systems, branding, media, fundraising, and launch campaigns. See our work.",
};

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-pad bg-darker border-b border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">Our Work</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9] mb-6" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
            Results that speak for themselves.
          </h1>
          <p className="text-xl text-white/50 max-w-2xl leading-relaxed">
            Brands launched, millions raised, audiences built. Here&apos;s what we&apos;ve done
            for the projects and businesses that trusted us.
          </p>
        </div>
      </section>

      {/* Case studies grid */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map(({ slug, name, tagline, stats, tags }) => (
              <Link
                key={slug}
                href={`/case-studies/${slug}`}
                className="card-premium group block p-7"
              >
                {/* Content */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded border border-white/10 text-white/30 font-medium uppercase tracking-wide">
                        {tagLabels[tag] ?? tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
                    {name}
                  </h2>
                  <p className="text-white/40 mb-5 leading-relaxed">{tagline}</p>

                  {stats && (
                    <div className="flex flex-wrap gap-6 mb-5">
                      {stats.map(({ value, label }) => (
                        <div key={label}>
                          <p className="text-xl font-bold text-gold">{value}</p>
                          <p className="text-xs text-white/30">{label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="inline-flex items-center gap-2 text-sm text-gold font-semibold group-hover:gap-3 transition-all">
                    Read case study <ArrowRightIcon size={13} weight="bold" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-raised border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
            Want results like these?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded bg-gold text-dark text-lg font-bold tracking-wide hover:bg-gold-light btn-press">
              Book a Strategy Call <ArrowRightIcon size={18} weight="bold" />
            </a>
            <Link href="/ai-services" className="inline-flex items-center gap-3 px-10 py-4 rounded border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all">
              See AI Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

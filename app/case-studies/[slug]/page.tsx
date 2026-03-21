import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { caseStudies, getCaseStudy, tagLabels } from "@/lib/case-studies";

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: "Not Found" };
  return { title: cs.name, description: cs.tagline };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const { name, tagline, tags, thumbnail, heroImage, problem, whatWeDid, outcomes, stats, videos, images, relatedServices } = cs;

  return (
    <>
      {/* Back link */}
      <div className="bg-darker border-b border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeftIcon size={14} weight="bold" />
            All case studies
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-darker pb-0">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-14">
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="tag">{tagLabels[tag] ?? tag}</span>
            ))}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9] mb-5" style={{ fontFamily: "var(--font-archivo)" }}>
            {name}
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed">{tagline}</p>
        </div>

        {/* Hero image */}
        <div className="relative h-64 md:h-96 lg:h-[520px] overflow-hidden">
          <Image
            src={heroImage ?? thumbnail}
            alt={name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
        </div>
      </section>

      {/* Stats bar */}
      {stats && (
        <section className="bg-raised border-y border-white/8">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
            <div className="flex flex-wrap gap-12 md:gap-20">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl md:text-4xl font-bold text-gold" style={{ fontFamily: "var(--font-archivo)" }}>{value}</p>
                  <p className="text-white/40 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            {/* Main content */}
            <div className="md:col-span-7">
              {/* Problem */}
              <div className="mb-14">
                <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">The Problem</p>
                <blockquote className="text-2xl md:text-3xl font-semibold text-white leading-relaxed border-l-4 border-gold pl-8" style={{ fontFamily: "var(--font-archivo)" }}>
                  {problem}
                </blockquote>
              </div>

              {/* What we did */}
              <div className="mb-14">
                <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">What We Did</p>
                <ul className="flex flex-col gap-4">
                  {whatWeDid.map((item) => (
                    <li key={item} className="flex items-start gap-4 text-white/70 text-lg leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-gold mt-2.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div>
                <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">Results</p>
                <ul className="flex flex-col gap-4">
                  {outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-4 text-white/70 text-lg leading-relaxed">
                      <span className="text-gold mt-1 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-4 md:col-start-9">
              <div className="sticky top-24 flex flex-col gap-5">
                {/* Related services */}
                <div className="p-6 rounded-xl border border-white/10 bg-raised">
                  <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Services used</p>
                  <div className="flex flex-col gap-3">
                    {relatedServices.map((svc) => (
                      <Link key={svc} href={`/${svc}`}
                        className="flex items-center justify-between text-sm text-white/60 hover:text-gold transition-colors group">
                        {svc === "ai-services" ? "AI Services" : "Launch Services"}
                        <ArrowRightIcon size={13} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-6 rounded-xl border border-gold/20 bg-gold/5">
                  <p className="text-sm text-white/60 mb-4">Want results like this for your business?</p>
                  <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded bg-gold text-dark font-bold text-sm tracking-wide hover:bg-gold-light btn-press w-full">
                    Book a Strategy Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos */}
      {videos && videos.length > 0 && (
        <section className="section-pad bg-raised border-t border-white/8">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-8">Featured Videos</p>
            <div className={`grid grid-cols-1 ${videos.length > 1 ? "md:grid-cols-2" : ""} gap-6`}>
              {videos.map((videoId) => (
                <div key={videoId} className="relative rounded-xl overflow-hidden bg-darker" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`${name} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional images */}
      {images && images.length > 1 && (
        <section className="section-pad bg-dark border-t border-white/8">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-8">Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((src, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden aspect-square">
                  <Image src={src} alt={`${name} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next case study / CTA */}
      <section className="section-pad bg-darker border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-archivo)" }}>
              See more work →
            </h2>
            <Link href="/case-studies" className="text-gold hover:text-gold-light transition-colors text-sm font-semibold mt-2 inline-block">
              View all case studies
            </Link>
          </div>
          <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark font-bold text-lg tracking-wide hover:bg-gold-light btn-press shrink-0">
            Book a Strategy Call <ArrowRightIcon size={16} weight="bold" />
          </a>
        </div>
      </section>
    </>
  );
}

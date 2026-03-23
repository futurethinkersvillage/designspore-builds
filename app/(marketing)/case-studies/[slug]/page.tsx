import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { caseStudies, getCaseStudy, tagLabels } from "@/lib/case-studies";
import Lightbox from "@/components/ui/Lightbox";

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

  const { name, tagline, tags, logo, thumbnail, problem, whatWeDid, outcomes, stats, videos, images, instagramReels, relatedServices } = cs;

  const hasMedia = (images && images.length > 0) || (videos && videos.length > 0) || (instagramReels && instagramReels.length > 0);

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

      {/* Header — compact, ~20% smaller than before */}
      <section className="bg-darker" style={{ paddingTop: "3.5rem", paddingBottom: "3rem" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="tag">{tagLabels[tag] ?? tag}</span>
            ))}
          </div>

          {/* Client logo */}
          {logo && (
            <div className="mb-6">
              <Image
                src={logo}
                alt={name}
                width={160}
                height={56}
                className="h-12 w-auto object-contain brightness-200 grayscale opacity-75"
                unoptimized
              />
            </div>
          )}

          {/* Title + tagline */}
          <h1
            className="font-bold text-white mb-4"
            style={{
              fontFamily: "var(--font-display-active, var(--font-outfit))",
              fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
            }}
          >
            {name}
          </h1>
          <p className="text-base md:text-lg text-white/50 max-w-2xl leading-relaxed">{tagline}</p>
        </div>
      </section>

      {/* Stats bar */}
      {stats && (
        <section className="bg-raised border-y border-white/8">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
            <div className="flex flex-wrap gap-10 md:gap-16">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p
                    className="text-2xl md:text-3xl font-bold text-gold"
                    style={{ fontFamily: "var(--font-display-active, var(--font-outfit))", letterSpacing: "-0.03em" }}
                  >
                    {value}
                  </p>
                  <p className="text-white/40 text-xs mt-1 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-14">

            {/* Left column — full narrative + media embedded inline */}
            <div className="md:col-span-7">

              {/* Problem */}
              <div className="mb-12">
                <p className="section-label">The Problem</p>
                <blockquote
                  className="text-lg md:text-xl font-semibold text-white leading-relaxed pl-6 border-l-2 border-gold"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {problem}
                </blockquote>
              </div>

              {/* What we did */}
              <div className="mb-12">
                <p className="section-label">What We Did</p>
                <ul className="flex flex-col gap-3">
                  {whatWeDid.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/60 text-base leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-gold mt-2.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div className={hasMedia ? "mb-12" : ""}>
                <p className="section-label">Results</p>
                <ul className="flex flex-col gap-3">
                  {outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/60 text-base leading-relaxed">
                      <span className="text-gold text-xs mt-1 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Media — images and videos embedded inline after content */}
              {hasMedia && (
                <div>
                  <p className="section-label">Project Media</p>

                  {/* Images — full native aspect ratio + lightbox */}
                  {images && images.length > 0 && (
                    <Lightbox images={images} alt={name} />
                  )}

                  {/* Video embeds */}
                  {videos && videos.length > 0 && (
                    <div className={`grid gap-4 mb-4 ${videos.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                      {videos.map((videoId) => (
                        <div
                          key={videoId}
                          className="relative rounded-xl overflow-hidden bg-darker"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`${name} — video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Instagram reels */}
                  {instagramReels && instagramReels.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {instagramReels.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-raised hover:border-gold/30 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">View on Instagram</p>
                            <p className="text-xs text-white/35 truncate mt-0.5">{url}</p>
                          </div>
                          <ArrowRightIcon size={14} weight="bold" className="text-white/30 group-hover:text-gold transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right — sticky sidebar */}
            <div className="md:col-span-4 md:col-start-9">
              <div className="sticky top-24 flex flex-col gap-5">

                {/* Thumbnail — only if we have a confirmed image */}
                {thumbnail && (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-raised">
                    <Image
                      src={thumbnail}
                      alt={name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                {/* All related services */}
                <div className="p-6 rounded-xl border border-white/10 bg-raised">
                  <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Services used</p>
                  <div className="flex flex-col gap-3">
                    {relatedServices.map((svc) => (
                      <Link
                        key={svc}
                        href={`/${svc}`}
                        className="flex items-center justify-between text-sm text-white/60 hover:text-gold transition-colors group py-1"
                      >
                        {svc === "ai-services" ? "AI Services" : "Launch Services"}
                        <ArrowRightIcon size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-6 rounded-xl border border-gold/20 bg-gold/5">
                  <p className="text-sm text-white/55 mb-4 leading-relaxed">
                    Want results like this for your business?
                  </p>
                  <a
                    href="http://futurethinkers.org/call60"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center text-sm"
                  >
                    Book a Strategy Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer nav */}
      <section className="section-pad bg-darker border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
              See more work
            </h2>
            <Link href="/case-studies" className="text-gold hover:text-gold-light transition-colors text-sm font-semibold mt-1 inline-flex items-center gap-1 group">
              View all case studies
              <ArrowRightIcon size={12} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <a
            href="http://futurethinkers.org/call60"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary shrink-0 px-8 py-4 text-base"
          >
            Book a Strategy Call <ArrowRightIcon size={16} weight="bold" />
          </a>
        </div>
      </section>
    </>
  );
}

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

  const { name, tagline, tags, logo, thumbnail, problem, whatWeDid, outcomes, stats, videos, images, relatedServices } = cs;

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

      {/* Header — tags, logo, title, tagline */}
      <section className="bg-darker section-pad pb-0">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <span key={tag} className="tag">{tagLabels[tag] ?? tag}</span>
            ))}
          </div>

          {/* Client logo or name */}
          {logo ? (
            <div className="mb-8">
              <Image
                src={logo}
                alt={name}
                width={160}
                height={64}
                className="h-14 w-auto object-contain brightness-200 grayscale opacity-80"
                unoptimized
              />
            </div>
          ) : null}

          <h1
            className="font-bold text-white mb-5"
            style={{
              fontFamily: "var(--font-archivo)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
            }}
          >
            {name}
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed">{tagline}</p>
        </div>
      </section>

      {/* Stats bar */}
      {stats && (
        <section className="bg-raised border-y border-white/8">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
            <div className="flex flex-wrap gap-12 md:gap-20">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl md:text-3xl font-bold text-gold" style={{ fontFamily: "var(--font-archivo)", letterSpacing: "-0.03em" }}>{value}</p>
                  <p className="text-white/40 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

            {/* Left — narrative */}
            <div className="md:col-span-7">

              {/* Problem */}
              <div className="mb-14">
                <p className="section-label">The Problem</p>
                <blockquote
                  className="text-xl md:text-2xl font-semibold text-white leading-relaxed pl-7 border-l-2 border-gold"
                  style={{ fontFamily: "var(--font-archivo)" }}
                >
                  {problem}
                </blockquote>
              </div>

              {/* What we did */}
              <div className="mb-14">
                <p className="section-label">What We Did</p>
                <ul className="flex flex-col gap-4">
                  {whatWeDid.map((item) => (
                    <li key={item} className="flex items-start gap-4 text-white/65 text-base leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div>
                <p className="section-label">Results</p>
                <ul className="flex flex-col gap-3">
                  {outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/65 text-base leading-relaxed">
                      <span className="text-gold text-sm mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Videos — embedded inline after content */}
              {videos && videos.length > 0 && (
                <div className="mt-14">
                  <p className="section-label">Project Videos</p>
                  <div className={`grid grid-cols-1 ${videos.length > 1 ? "md:grid-cols-2" : ""} gap-5`}>
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
              )}
            </div>

            {/* Right — sidebar */}
            <div className="md:col-span-4 md:col-start-9">
              <div className="sticky top-24 flex flex-col gap-5">

                {/* Thumbnail image (not full-width, contained in sidebar) */}
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
                    className="btn-primary w-full justify-center">
                    Book a Strategy Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image gallery — additional project images */}
      {images && images.length > 0 && (
        <section className="section-pad bg-raised border-t border-white/8">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <p className="section-label">Project Gallery</p>
            <div className={`grid ${images.length === 1 ? "grid-cols-1 max-w-2xl" : images.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-3"} gap-4`}>
              {images.map((src, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-darker" style={{ aspectRatio: "16/9" }}>
                  <Image src={src} alt={`${name} image ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" unoptimized />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="section-pad bg-darker border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-archivo)" }}>
              See more work
            </h2>
            <Link href="/case-studies" className="text-gold hover:text-gold-light transition-colors text-sm font-semibold mt-1 inline-flex items-center gap-1 group">
              View all case studies
              <ArrowRightIcon size={12} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
            className="btn-primary shrink-0 px-8 py-4 text-base">
            Book a Strategy Call <ArrowRightIcon size={16} weight="bold" />
          </a>
        </div>
      </section>
    </>
  );
}

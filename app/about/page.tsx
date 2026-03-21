import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "About",
  description: "Design Spore is a strategic creative agency built for the future. We bridge visionary thinking with execution — brand, media, AI, and launch strategy.",
};

const values = [
  { title: "Future-First Thinking", desc: "We don't chase trends — we study where things are going and build for what's next. Every project is a bet on tomorrow." },
  { title: "Execution Over Theory", desc: "Beautiful strategies mean nothing without delivery. We're in the room from concept to launch to post-mortem." },
  { title: "Systems, Not Services", desc: "We build reusable machines — brand systems, media systems, AI systems — that compound value over time." },
  { title: "Real Skin in the Game", desc: "We work with founders who are all-in, and we match their energy. We've built our own ventures and know what's at stake." },
];

const stats = [
  { value: "$10M+", label: "Raised for client campaigns" },
  { value: "50M+", label: "Content views generated" },
  { value: "100+", label: "Brands and campaigns launched" },
  { value: "15+", label: "Years of combined experience" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-pad bg-darker border-b border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">About Design Spore</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9] mb-6" style={{ fontFamily: "var(--font-archivo)" }}>
              We build the brands that build the future.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed">
              A creative and AI strategy agency for visionaries who need more than a vendor — they need a partner who
              thinks as big as they do.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-raised border-b border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl md:text-4xl font-bold text-gold" style={{ fontFamily: "var(--font-archivo)" }}>{value}</p>
                <p className="text-white/40 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-14">The Founders</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

            {/* Euvie */}
            <div className="flex flex-col gap-6">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                  src="https://designspore.co/wp-content/uploads/2024/09/EuvieIvanova-bw-682x1024.jpg"
                  alt="Euvie Ivanova"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/10 to-transparent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-archivo)" }}>Euvie Ivanova</h2>
                <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">Co-Founder · Strategy & Media</p>
                <p className="text-white/60 leading-relaxed text-lg">
                  Co-host of the Future Thinkers podcast with 50M+ downloads. Euvie has spent over a decade
                  interviewing the world&apos;s most forward-thinking minds — and building the media systems to
                  reach them at scale. She leads brand strategy, content direction, and fundraising campaigns.
                </p>
              </div>
            </div>

            {/* Mike */}
            <div className="flex flex-col gap-6">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                  src="https://designspore.co/wp-content/uploads/2024/07/9653-e1723773032417.jpg"
                  alt="Mike Gilliland"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/10 to-transparent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-archivo)" }}>Mike Gilliland</h2>
                <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">Co-Founder · Technology & AI</p>
                <p className="text-white/60 leading-relaxed text-lg">
                  Builder, technologist, and community organizer. Mike leads AI implementation, technical
                  infrastructure, and digital systems for Design Spore clients. He runs AI meetups in Clearwater,
                  BC and is at the center of the region&apos;s emerging innovation ecosystem through Portal.Place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-archivo)" }}>
                Built from the inside of real ventures.
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 space-y-5 text-white/60 leading-relaxed text-lg">
              <p>
                Design Spore wasn&apos;t started by consultants — it was built by operators. We&apos;ve run
                campaigns, launched products, raised capital, and built audiences from zero. We&apos;ve felt the
                stakes of a launch that has to work.
              </p>
              <p>
                That experience is what we bring to every client. We don&apos;t just advise — we roll up our
                sleeves, get embedded in your team, and build alongside you.
              </p>
              <p>
                Our work sits at the intersection of design, technology, and strategy — and increasingly, AI.
                We believe AI isn&apos;t a threat to great creative work. It&apos;s a multiplier for the people
                who know how to use it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">How We Work</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-archivo)" }}>
              The principles behind the work.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8 rounded-xl overflow-hidden border border-white/8">
            {values.map(({ title, desc }) => (
              <div key={title} className="p-7 md:p-8 bg-dark hover:bg-raised transition-colors group">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-archivo)" }}>{title}</h3>
                <p className="text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-raised border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5" style={{ fontFamily: "var(--font-archivo)" }}>
            Want to work with us?
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto mb-10">
            Tell us about your project. If it&apos;s a fit, we&apos;ll move fast.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded bg-gold text-dark text-lg font-bold tracking-wide hover:bg-gold-light btn-press">
              Book a Strategy Call <ArrowRightIcon size={18} weight="bold" />
            </a>
            <Link href="/case-studies" className="inline-flex items-center gap-3 px-10 py-4 rounded border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all">
              See Our Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

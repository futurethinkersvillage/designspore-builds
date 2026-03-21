import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, UsersIcon, LightbulbIcon, MapPinIcon, CalendarIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Community",
  description: "AI meetups, maker workshops, and innovation events in Clearwater, BC. Join the growing tech and creative community at the heart of Portal.Place.",
};

const programs = [
  {
    icon: UsersIcon,
    title: "AI Meetups",
    desc: "Monthly gatherings for practitioners, founders, and curious minds exploring practical AI applications. Talks, demos, and real conversation — no hype.",
  },
  {
    icon: LightbulbIcon,
    title: "Workshops & Sprints",
    desc: "Hands-on sessions building AI tools, automation workflows, and creative systems. Learn by doing alongside people who are shipping real products.",
  },
  {
    icon: MapPinIcon,
    title: "Clearwater Innovation Hub",
    desc: "Based in Clearwater, BC — a small town with an outsized concentration of forward-thinking builders. Come for the mountains. Stay for the community.",
  },
  {
    icon: CalendarIcon,
    title: "Events & Summits",
    desc: "Larger gatherings that bring together thinkers, makers, and investors for deep conversation about where technology and culture are heading.",
  },
];

export default function CommunityPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-pad bg-darker border-b border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">Community</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9] mb-6" style={{ fontFamily: "var(--font-archivo)" }}>
              The future is built in community.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed mb-10">
              AI meetups, maker workshops, and innovation events for the builders, founders, and creatives
              shaping what&apos;s next — centered in Clearwater, BC.
            </p>
            <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark font-bold text-lg tracking-wide hover:bg-gold-light btn-press">
              Get Involved <ArrowRightIcon size={16} weight="bold" />
            </a>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">What we run</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-archivo)" }}>
              Spaces for builders to connect.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-8 rounded-xl border border-white/8 bg-raised hover:border-gold/30 transition-all group">
                <Icon size={28} weight="duotone" className="text-gold mb-5" />
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-archivo)" }}>{title}</h3>
                <p className="text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal.Place */}
      <section className="section-pad bg-raised">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Physical Space</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6" style={{ fontFamily: "var(--font-archivo)" }}>
                Portal.Place — where it all happens.
              </h2>
              <p className="text-white/60 leading-relaxed text-lg mb-6">
                Portal.Place is the physical and digital home for the Clearwater innovation ecosystem. A makerspace,
                event venue, and co-working community for the people building the next generation of technology,
                media, and culture.
              </p>
              <p className="text-white/60 leading-relaxed text-lg mb-8">
                Design Spore is deeply embedded in Portal.Place — hosting events, running workshops, and helping
                build the infrastructure for a thriving innovation community in the BC interior.
              </p>
              <a href="https://portal.place" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-light transition-colors">
                Visit Portal.Place <ArrowRightIcon size={14} weight="bold" />
              </a>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <div className="p-8 rounded-xl border border-gold/20 bg-gold/5 space-y-6">
                <div>
                  <p className="text-3xl font-bold text-gold" style={{ fontFamily: "var(--font-archivo)" }}>Clearwater, BC</p>
                  <p className="text-white/40 text-sm mt-1">Home base</p>
                </div>
                <div className="border-t border-white/8 pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-gold mt-1 shrink-0">✓</span>
                    <p className="text-white/60">Monthly AI meetups open to all skill levels</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-gold mt-1 shrink-0">✓</span>
                    <p className="text-white/60">Hands-on workshops and build sprints</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-gold mt-1 shrink-0">✓</span>
                    <p className="text-white/60">Makerspace equipment and co-working</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-gold mt-1 shrink-0">✓</span>
                    <p className="text-white/60">Online community for remote participants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Thinkers */}
      <section className="section-pad bg-dark border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Connected Ecosystem</p>
              <h2 className="text-4xl font-bold tracking-tight text-white leading-tight mb-5" style={{ fontFamily: "var(--font-archivo)" }}>
                Part of a larger movement.
              </h2>
              <p className="text-white/60 leading-relaxed text-lg mb-6">
                Design Spore is connected to the Future Thinkers ecosystem — a global community of forward-thinking
                individuals exploring technology, culture, and human potential. With 50M+ podcast downloads and
                decades of community building, Future Thinkers brings a global perspective to local events.
              </p>
              <a href="https://futurethinkers.org" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-light transition-colors">
                Explore Future Thinkers <ArrowRightIcon size={14} weight="bold" />
              </a>
            </div>
            <div className="space-y-4">
              <div className="p-6 rounded-xl border border-white/8 bg-raised">
                <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-archivo)" }}>Future Thinkers Podcast</p>
                <p className="text-white/40 text-sm mb-3">50M+ downloads · 500+ episodes</p>
                <p className="text-white/60 text-sm leading-relaxed">In-depth conversations with scientists, technologists, entrepreneurs, and artists on the leading edge of what&apos;s possible.</p>
              </div>
              <div className="p-6 rounded-xl border border-white/8 bg-raised">
                <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-archivo)" }}>Future Thinkers Community</p>
                <p className="text-white/40 text-sm mb-3">Global · Online + in-person</p>
                <p className="text-white/60 text-sm leading-relaxed">Membership community with courses, events, and a curated network of people building a better future.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-raised border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5" style={{ fontFamily: "var(--font-archivo)" }}>
            Come build with us.
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto mb-10">
            Whether you&apos;re in Clearwater or joining remotely — there&apos;s a place for you in this community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded bg-gold text-dark text-lg font-bold tracking-wide hover:bg-gold-light btn-press">
              Get in Touch <ArrowRightIcon size={18} weight="bold" />
            </a>
            <Link href="/about" className="inline-flex items-center gap-3 px-10 py-4 rounded border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all">
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

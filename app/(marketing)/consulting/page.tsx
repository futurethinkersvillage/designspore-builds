import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartLineUpIcon,
  RobotIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  BuildingsIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "AI Consulting for Local Business — Design Spore",
  description:
    "Practical AI consulting for trades, home services, tourism, and small businesses in BC's interior. $200/hr. Plain language, no hype.",
};

const offerings = [
  {
    title: "AI Readiness Assessment",
    price: "$600",
    duration: "3 hours",
    desc: "A focused deep-dive into your business. Where AI can save you time today, what your competitors will be doing in 18 months, and an honest answer on what's actually worth doing first.",
    deliverable: "Written report + 90-day action roadmap",
    best: false,
  },
  {
    title: "Half-Day Workshop",
    price: "$1,200",
    duration: "4 hours on-site or remote",
    desc: "Hands-on session for you and your team. Live demonstrations of the tools your industry is already using, plus a clear map of your top 3 opportunities — with implementation steps.",
    deliverable: "Workshop summary + team implementation guide",
    best: true,
  },
  {
    title: "Monthly Advisory",
    price: "$800/mo",
    duration: "Ongoing",
    desc: "A standing monthly call plus async support between sessions. Ideal for owners who are actively implementing AI and want a plain-language resource to lean on as they go.",
    deliverable: "Monthly strategy call + email/Slack access",
    best: false,
  },
];

const problems = [
  {
    Icon: PhoneIcon,
    headline: "You're losing leads while you're working",
    body: "If your phone goes to voicemail and you don't call back within 5 minutes, 80% of those leads call someone else. AI can close that gap automatically.",
  },
  {
    Icon: EnvelopeSimpleIcon,
    headline: "Your follow-up is inconsistent",
    body: "Most small businesses lose jobs not because they quoted too high, but because they didn't follow up fast enough. AI can send the right message at the right time without you lifting a finger.",
  },
  {
    Icon: ChartLineUpIcon,
    headline: "Your competitors are getting ahead",
    body: "This isn't happening in 5 years. The businesses in your area that adopt AI systems in the next 12 months will have a structural advantage that's hard to close. The gap is opening now.",
  },
  {
    Icon: RobotIcon,
    headline: "You don't know where to start",
    body: "There are thousands of AI tools. Most of them are not useful for a trades company in Clearwater. Knowing which ones matter for your specific situation is exactly what this consulting is for.",
  },
];

const whoFor = [
  "Trades & construction",
  "Home services (cleaning, landscaping, HVAC, plumbing)",
  "Tourism & hospitality",
  "Real estate & property management",
  "Health & wellness practitioners",
  "Professional services (accountants, lawyers, consultants)",
  "Retail & e-commerce",
  "Any owner-operated business in BC's interior",
];

export default function ConsultingPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="section-pad bg-darker border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">
              AI Consulting · Local Business · Clearwater, BC
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.92] mb-6"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Your competitors are figuring out AI. Let&apos;s make sure you&apos;re ahead of them.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-2xl mb-4">
              Practical, plain-language AI consulting for small and medium businesses. No jargon. No fluff. Just what actually works for a business like yours.
            </p>
            <p className="text-base text-white/30 mb-10">
              $200/hr · Based in Clearwater, BC · Available in-person across the Thompson-Okanagan or remote
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://cal.com/mikegilliland/consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark font-bold tracking-wide hover:bg-gold-light transition-colors"
              >
                Book a Free 30-Min Call <ArrowRightIcon size={16} weight="bold" />
              </a>
              <a
                href="mailto:mike@designspore.co"
                className="inline-flex items-center gap-3 px-8 py-4 rounded border border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Email Mike
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE SITUATION ─────────────────────────────────────────── */}
      <section className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">The situation</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                Interior BC is behind. That&apos;s a window — but it won&apos;t stay open long.
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 space-y-5 text-white/55 leading-relaxed text-lg">
              <p>
                In Vancouver, AI is already built into how businesses operate. In Clearwater and most of interior BC, the majority of business owners haven&apos;t touched it yet. That gap is closing — and fast.
              </p>
              <p>
                I run AI meetups in Clearwater. I build these systems for real businesses. I&apos;ve seen firsthand how much of a lift even simple automations give to owner-operated companies. A missed-call text-back system alone recovers jobs that were walking out the door.
              </p>
              <p>
                The question isn&apos;t whether AI will affect your business. It&apos;s whether you&apos;re the one using it or the one getting outcompeted by someone who is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEMS WE SOLVE ─────────────────────────────────────── */}
      <section className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">What we actually fix</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              The problems that cost you money every single week.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.map(({ Icon, headline, body }) => (
              <div
                key={headline}
                className="rounded-2xl border border-white/[0.07] bg-raised p-7 hover:border-gold/25 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-gold" weight="duotone" />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {headline}
                </h3>
                <p className="text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <section className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">How to work together</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Three simple entry points.
            </h2>
            <p className="mt-3 text-white/40 text-sm">All engagements billed at $200/hr. Packages below are flat-rate for convenience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offerings.map((o) => (
              <div
                key={o.title}
                className={`flex flex-col rounded-2xl border p-7 transition-all group relative ${
                  o.best
                    ? "border-gold/30 bg-gold/[0.04] hover:border-gold/50"
                    : "border-white/[0.08] bg-dark hover:border-gold/20 hover:bg-gold/[0.02]"
                }`}
              >
                {o.best && (
                  <span className="absolute -top-3 left-6 text-[11px] font-bold bg-gold text-dark px-3 py-1 rounded-full uppercase tracking-wider">
                    Most popular
                  </span>
                )}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-2xl font-bold text-gold"
                    style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                  >
                    {o.price}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/30 border border-white/[0.08] rounded-full px-2.5 py-1">
                    <ClockIcon size={11} />
                    {o.duration}
                  </span>
                </div>
                <h3
                  className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {o.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm flex-1 mb-5">{o.desc}</p>
                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Deliverable</p>
                  <p className="text-sm text-white/60">{o.deliverable}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="https://cal.com/mikegilliland/consulting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold transition-colors"
            >
              Start with a free 30-minute discovery call <ArrowRightIcon size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ───────────────────────────────────────── */}
      <section className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Who this is for</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                Owner-operated businesses that run on reputation and hustle.
              </h2>
              <p className="mt-5 text-white/45 leading-relaxed">
                You don&apos;t have a tech team. You don&apos;t have time to become an AI expert. You need someone to cut through the noise and tell you exactly what&apos;s worth doing for a business like yours, in a market like this.
              </p>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <div className="grid grid-cols-1 gap-2">
                {whoFor.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-raised text-white/60 text-sm"
                  >
                    <CheckCircleIcon size={15} className="text-gold shrink-0" weight="fill" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOV CALLOUT ───────────────────────────────────────────── */}
      <section className="bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-7">
            <BuildingsIcon size={32} className="text-blue-300 shrink-0" weight="duotone" />
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">Working in local or provincial government?</p>
              <p className="text-white/50 text-sm">Municipal, regional, and Indigenous governments have specific needs around AI policy, staff training, and procurement. There&apos;s a dedicated page for that.</p>
            </div>
            <Link
              href="/consulting/government"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-blue-500/30 bg-blue-500/[0.08] text-blue-300 text-sm font-semibold hover:border-blue-500/50 transition-all whitespace-nowrap"
            >
              Government Consulting <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">Ready to start?</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Start with 30 minutes. No commitment.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              A free call is the fastest way to find out if this is useful for your specific situation. If it&apos;s not a fit, I&apos;ll tell you.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://cal.com/mikegilliland/consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 rounded bg-gold text-dark text-lg font-bold tracking-wide hover:bg-gold-light transition-colors"
              >
                Book Free Discovery Call <ArrowRightIcon size={18} weight="bold" />
              </a>
              <a
                href="mailto:mike@designspore.co"
                className="inline-flex items-center gap-3 px-10 py-4 rounded border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Email Mike Directly
              </a>
            </div>
            <p className="mt-6 text-sm text-white/25">
              Based in Clearwater, BC. Available in person in the Thompson–Nicola region and remotely across Canada.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

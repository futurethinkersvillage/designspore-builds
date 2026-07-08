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
  title: "AI Strategy & Automation Consulting — Design Spore",
  description:
    "High-level AI strategy, automation, and engineering consulting. Plain language, real systems, measurable results. $400/hr.",
};

const offerings = [
  {
    title: "Automation Audit",
    price: "$800",
    duration: "2 hours",
    desc: "An exploratory deep-dive into how your business runs day to day. We map out where you're losing time, which of it AI can take over today, and what's actually worth doing first — in plain language.",
    deliverable: "Written recommendations + 90-day action roadmap",
    best: true,
  },
  {
    title: "Half-Day Workshop",
    price: "$1,600",
    duration: "4 hours on-site or remote",
    desc: "Hands-on session for you and your team. Live demonstrations of the tools your industry is already using, plus a clear map of your top 3 opportunities — with implementation steps.",
    deliverable: "Workshop summary + team implementation guide",
    best: false,
  },
  {
    title: "Monthly Advisory",
    price: "$1,200/mo",
    duration: "Ongoing",
    desc: "A standing monthly call plus async support between sessions. Ideal for owners who are actively implementing AI and want a plain-language resource to lean on as they go.",
    deliverable: "Monthly strategy call + email/Slack access",
    best: false,
  },
];

const problems = [
  {
    Icon: ChartLineUpIcon,
    headline: "You have AI curiosity, not an AI strategy",
    body: "Experiments are happening all over your business, but none of them connect to revenue, cost, or a plan. Strategy means deciding where AI creates leverage for you specifically — and in what order.",
  },
  {
    Icon: RobotIcon,
    headline: "You're using AI like a chat window, not a system",
    body: "Copy-pasting into a chatbot is the shallow end. The real gains come from engineered workflows that run on their own — no one prompting, nothing forgotten, every time.",
  },
  {
    Icon: EnvelopeSimpleIcon,
    headline: "Manual work is your biggest hidden expense",
    body: "Follow-ups, data entry, reporting, scheduling, quoting — hours of repeatable process that software should be doing. Every week it stays manual, it costs you again.",
  },
  {
    Icon: PhoneIcon,
    headline: "Opportunities slip while you're busy",
    body: "Slow responses and dropped follow-ups quietly lose deals that were yours to win. Automated systems respond in seconds and never let a thread go cold.",
  },
];

const whoFor = [
  "Founders & executives who want a real AI roadmap, not hype",
  "Operations-heavy businesses drowning in manual process",
  "Professional services (legal, accounting, consulting)",
  "Agencies & studios productizing their delivery",
  "E-commerce & SaaS teams automating ops and support",
  "Real estate, property & asset management",
  "Tourism, hospitality & service businesses",
  "Owner-operated businesses ready to scale without hiring",
];

export default function ConsultingPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="section-pad bg-darker border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">
              AI Strategy · Automation · Engineering
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.92] mb-6"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Your competitors are figuring out AI. Let&apos;s make sure you&apos;re ahead of them.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-2xl mb-4">
              Plain-language AI strategy, automation, and engineering — for businesses that want AI doing real work, not just answering questions.
            </p>
            <p className="text-base text-white/30 mb-10">
              $400/hr · Based in Clearwater, BC · Working remotely with clients everywhere
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
                Most businesses use 10% of what AI can do. The other 90% is where the advantage is.
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 space-y-5 text-white/55 leading-relaxed text-lg">
              <p>
                Nearly every business &quot;uses AI&quot; now — usually a chat window and a few prompts. Very few have engineered it into how the business actually operates: lead handling, follow-up, reporting, quoting, support, internal tools. That&apos;s the gap between a novelty and a structural advantage.
              </p>
              <p>
                I work at both altitudes. Strategy: where AI actually fits your business, what to build first, what to ignore. Engineering: building the systems themselves — AI phone agents, automated pipelines, custom dashboards, internal tools that run without anyone prompting them.
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
            <p className="mt-3 text-white/40 text-sm">All engagements billed at $400/hr. Packages below are flat-rate for convenience.</p>
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
                    Start here
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
                Teams ready to move from experimenting to engineering.
              </h2>
              <p className="mt-5 text-white/45 leading-relaxed">
                You don&apos;t need another AI demo. You need someone who can look at how your business runs, design the systems that remove the busywork, and build them — or hand you a plan your team can execute.
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
              Based in Clearwater, BC. Available in person across BC&apos;s interior and remotely worldwide.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

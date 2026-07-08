import type { Metadata } from "next";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
  MapTrifoldIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Automation Audit for Uchenna — Design Spore",
  description: "Your Automation Audit session with Mike Gilliland.",
  robots: { index: false, follow: false },
};

const PAYMENT_URL = "https://buy.stripe.com/9B64gzdGE4R70YcaTr00002";

const sessionFacts = [
  { Icon: CalendarCheckIcon, label: "When", value: "Monday, July 13 · 9:00 AM Pacific" },
  { Icon: ClockIcon, label: "Length", value: "2 hours" },
  { Icon: CreditCardIcon, label: "Investment", value: "$800 CAD flat" },
];

const steps = [
  {
    Icon: MagnifyingGlassIcon,
    title: "The session — 2 hours",
    body: "We walk through how your business actually runs: where the hours go, what gets dropped, what you're doing manually that a system should be doing. Exploratory and practical — bring your real problems.",
  },
  {
    Icon: FileTextIcon,
    title: "Written recommendations",
    body: "After the call, I put together specific recommendations for your situation — which automations are worth building, in what order, and roughly what each takes to implement.",
  },
  {
    Icon: MapTrifoldIcon,
    title: "90-day roadmap",
    body: "A clear sequence for the next 90 days so you know exactly what to do first, what to defer, and what to ignore entirely. Yours to run with — with me or without me.",
  },
];

export default function UchennaPage() {
  return (
    <>
      {/* ── HERO / SESSION DETAILS ────────────────────────────────── */}
      <section className="section-pad bg-darker border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">
              Automation Audit · Prepared for Uchenna
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.92] mb-6"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              Uchenna — good talking with you. Here&apos;s the plan.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-2xl mb-10">
              Two hours together to find what&apos;s worth automating in your business, followed by written
              recommendations and a 90-day roadmap you can act on right away.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mb-10">
              {sessionFacts.map(({ Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/[0.08] bg-raised p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className="text-gold" weight="duotone" />
                    <span className="text-xs uppercase tracking-wider text-white/30">{label}</span>
                  </div>
                  <p className="text-white font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href={PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark font-bold tracking-wide hover:bg-gold-light transition-colors"
              >
                Confirm Your Session — $800 <ArrowRightIcon size={16} weight="bold" />
              </a>
              <a
                href="mailto:mike@designspore.co"
                className="inline-flex items-center gap-3 px-8 py-4 rounded border border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Questions? Email Mike
              </a>
            </div>
            <p className="mt-6 text-sm text-white/25">
              Payment confirms your Monday slot. Need a different time? Just reply to my email and we&apos;ll move it.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ──────────────────────────────────────────── */}
      <section className="section-pad bg-raised border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">How it works</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              One session, three deliverables.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ Icon, title, body }, i) => (
              <div
                key={title}
                className="rounded-2xl border border-white/[0.07] bg-dark p-7 hover:border-gold/25 transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Icon size={20} className="text-gold" weight="duotone" />
                  </div>
                  <span className="text-4xl font-bold text-white/[0.06]" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
                    0{i + 1}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors"
                  style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
                >
                  {title}
                </h3>
                <p className="text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COME PREPARED ─────────────────────────────────────────── */}
      <section className="section-pad bg-dark border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Before we meet</p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
              >
                Get the most out of the two hours.
              </h2>
              <p className="mt-5 text-white/45 leading-relaxed">
                No prep is required — but if you have ten minutes beforehand, jotting down a few of these
                will let us go deeper, faster.
              </p>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <div className="grid grid-cols-1 gap-2">
                {[
                  "The 3 tasks that eat the most of your week",
                  "Anything you do more than once a day, by hand",
                  "Where leads or follow-ups slip through the cracks",
                  "Tools you already pay for (CRM, email, booking, invoicing)",
                  "One thing you wish just handled itself",
                ].map((item) => (
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

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="section-pad bg-darker">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">Lock it in</p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5"
              style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}
            >
              See you Monday at 9.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              Confirm below and you&apos;ll get a receipt right away, with the calendar invite to follow.
            </p>
            <a
              href={PAYMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded bg-gold text-dark text-lg font-bold tracking-wide hover:bg-gold-light transition-colors"
            >
              Confirm Your Session — $800 <ArrowRightIcon size={18} weight="bold" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

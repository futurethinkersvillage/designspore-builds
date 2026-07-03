"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Minus, Plus } from "@phosphor-icons/react";
import { MembershipInquiryForm } from "@/components/MembershipInquiryForm";

const FI = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.7 },
};

type BenefitRow = {
  label: string;
  max: boolean | string;
  cabin: boolean | string;
  rv: boolean | string;
};

const BENEFITS: BenefitRow[] = [
  { label: "Non-voting equity stake", max: true, cabin: true, rv: true },
  { label: "Free weeks / season", max: "2 weeks", cabin: "1 week", rv: "2 weeks" },
  { label: "Accommodation type", max: "Private cabin", cabin: "Cabin (sleeps 4)", rv: "Your RV + full hookups" },
  { label: "Priority booking window", max: "90 days out", cabin: "60 days out", rv: "60 days out" },
  { label: "Long weekend priority", max: true, cabin: false, rv: false },
  { label: "Golf rounds / season", max: "10", cabin: "5", rv: "5" },
  { label: "Sauna sessions / season", max: "6", cabin: "3", rv: "3" },
  { label: "Guest nights / year", max: "4", cabin: "2", rv: "2" },
  { label: "Makerspace & co-working gazebo", max: true, cabin: true, rv: true },
  { label: "Otherworld festival access", max: true, cabin: true, rv: true },
  { label: "Lifetime access", max: true, cabin: true, rv: true },
  { label: "Annual Founders Gathering", max: true, cabin: true, rv: true },
];

const FAQ_ITEMS = [
  {
    q: "Is this a timeshare?",
    a: "No — and the differences matter. Timeshares lock you to a fixed week, charge rising annual fees indefinitely, and are notoriously hard to exit. A Founding Membership gives you a flexible booking window, no annual membership fees, and a right-of-first-refusal exit. You hold a non-voting equity stake in the company — not just a booking right.",
  },
  {
    q: "What does the $2,000 deposit do?",
    a: "It holds your place in the founding queue while you review the full brief. It's fully refundable — it commits you to nothing. If you proceed, it's applied to your membership. If you don't, it's returned in full.",
  },
  {
    q: "What if the development doesn't happen?",
    a: "The golf course, RV sites, sauna, and river access are operating right now. You're not investing in a concept — the place is already here. The cabins and village are what grows from the founding round, but the resort runs regardless.",
  },
  {
    q: "When do member benefits begin?",
    a: "The 2027 season. In the meantime, you can visit as a regular guest — the resort is open this season. The cabin stays and founding benefits become available once the cabin development phase completes.",
  },
  {
    q: "Who else is in the founding circle?",
    a: "The founding round is by invitation — to past Wells Gray guests, Future Thinkers podcast listeners, community members, friends, family, and business associates of Mike, Euvie, and the Gilliland family. Not the general public.",
  },
];

const WHO_ITS_FOR = [
  { label: "Families with kids", body: "Who want the same trails, the same river, the same community every summer — with an equity stake instead of a rental receipt." },
  { label: "Future Thinkers listeners", body: "Already connected to Mike and Euvie's work and want to be part of the land behind it." },
  { label: "Past Wells Gray guests", body: "Who've experienced the property and want to make it theirs." },
  { label: "Remote workers & builders", body: "Who want a mountain base that works — co-working gazebo, fast wifi, sauna, and a community already there." },
  { label: "Multigenerational families", body: "A home base for grandparents, parents, and kids — every season, for life." },
  { label: "Intentional investors", body: "Who want land-backed community membership as a meaningful place to put capital alongside personal use." },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} weight="bold" className="text-amber mx-auto" />;
  if (value === false) return <span className="text-white/20 text-sm">—</span>;
  return <span className="text-white/65 text-sm">{value}</span>;
}

export default function MembershipPage3() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-warm-dark text-white">

      {/* ANNOUNCEMENT BAR */}
      <div className="bg-amber text-white text-center py-3 px-4">
        <p className="text-xs sm:text-sm tracking-wide">
          <span className="font-medium">50 founding spots.</span>
          &nbsp;We break ground at 30 committed.&nbsp;
          <a href="#inquiry" className="underline underline-offset-2 hover:no-underline">
            Express your interest →
          </a>
        </p>
      </div>

      {/* HERO */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(217,119,6,0.1),transparent)]" />
        <motion.div {...FI} className="relative max-w-3xl mx-auto">
          <p className="text-white/25 text-[11px] tracking-[0.35em] uppercase mb-6">
            Wells Gray Village &nbsp;·&nbsp; Clearwater, BC &nbsp;·&nbsp; 400 acres
          </p>
          <h1 className="font-serif font-light text-[clamp(44px,9vw,82px)] leading-[0.95] mb-8">
            Own a stake in
            <br />
            <em className="not-italic text-amber">Wells Gray Village.</em>
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto mb-10 leading-relaxed">
            50 founding spots. One-time investment. Non-voting equity stake, free seasonal stays, and lifetime access to 400 acres bordering Wells Gray Provincial Park.
          </p>

          <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-10 text-left mb-12">
            {[
              "Non-voting equity stake",
              "Free cabin or RV weeks, every season",
              "Priority booking — 60–90 days out",
              "Golf, sauna, hot tubs, river access, makerspace",
              "Otherworld arts festival on the land each summer",
              "No annual membership fees",
            ].map((b) => (
              <div key={b} className="flex items-start gap-2.5">
                <Check size={14} weight="bold" className="text-amber mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">{b}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inquiry"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber px-9 py-4 text-sm font-medium text-white hover:bg-amber/90 active:scale-[0.98] transition-all"
            >
              Express your interest <ArrowRight size={13} weight="bold" />
            </a>
            <a
              href="#compare"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-9 py-4 text-sm text-white/65 hover:border-white/40 hover:text-white transition-all"
            >
              Compare the three tiers
            </a>
          </div>
        </motion.div>
      </section>

      {/* THE MATH */}
      <section className="bg-[#0C0B0F] py-24 px-6">
        <motion.div {...FI} className="max-w-4xl mx-auto">
          <h2 className="font-serif text-[clamp(24px,4vw,36px)] text-white text-center mb-4 leading-snug">
            You&apos;re probably already spending money on this.
          </h2>
          <p className="text-white/40 text-center text-sm mb-14 max-w-lg mx-auto leading-relaxed">
            The average peak-season cabin in the BC interior rents for $1,750–$3,200 per week. Two weeks, every summer, for 20 years.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
            {[
              { stat: "$3,500–$6,400", label: "per season renting", sub: "2 weeks at market rates" },
              { stat: "$70,000+", label: "over 20 seasons", sub: "with nothing to show for it" },
              { stat: "$0", label: "equity at the end", sub: "when renting every year" },
            ].map((s, i) => (
              <div key={i} className="bg-[#0C0B0F] border border-white/[0.06] flex flex-col items-center justify-center py-10 px-6 text-center">
                <span className="font-serif text-[clamp(28px,5vw,44px)] text-white mb-1">{s.stat}</span>
                <span className="text-white/50 text-sm mb-1">{s.label}</span>
                <span className="text-white/25 text-xs">{s.sub}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/35 text-sm mt-8">
            A Founding Membership replaces that outlay with a one-time investment and an equity stake.{" "}
            <a href="#inquiry" className="text-amber hover:text-amber/80 underline underline-offset-2">
              Get the full breakdown in the brief →
            </a>
          </p>
        </motion.div>
      </section>

      {/* TIER COMPARISON */}
      <section id="compare" className="py-24 px-4 sm:px-6">
        <motion.div {...FI} className="max-w-4xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-4">Compare the three ways to join</p>
          <h2 className="font-serif text-[clamp(24px,4vw,34px)] text-white text-center mb-14 leading-snug">
            Every membership includes equity. Choose your stay.
          </h2>

          <div className="overflow-x-auto -mx-4 px-4">
            <div className="min-w-[580px]">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px mb-px">
                <div />
                {["Cabin Max", "Cabin", "RV"].map((h, i) => (
                  <div
                    key={h}
                    className={`text-center py-3 px-2 rounded-t-xl text-sm font-medium ${
                      i === 0
                        ? "bg-amber/15 text-amber border border-amber/25 border-b-0"
                        : "bg-white/[0.03] text-white/50 border border-white/[0.07] border-b-0"
                    }`}
                  >
                    {h}
                    {i === 0 && (
                      <span className="block text-[9px] uppercase tracking-[0.15em] text-amber/60 mt-0.5">
                        Most complete
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {BENEFITS.map((row, i) => (
                <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px">
                  <div className={`py-3 px-4 text-sm text-white/50 flex items-center border-b border-white/[0.05] ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                    {row.label}
                  </div>
                  {(["max", "cabin", "rv"] as const).map((key, j) => (
                    <div
                      key={key}
                      className={`py-3 px-2 flex items-center justify-center border-b border-white/[0.05] ${
                        j === 0
                          ? `bg-amber/5 border-x border-amber/15 ${i % 2 === 0 ? "bg-amber/[0.06]" : ""}`
                          : i % 2 === 0 ? "bg-white/[0.01]" : ""
                      }`}
                    >
                      <Cell value={row[key]} />
                    </div>
                  ))}
                </div>
              ))}

              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px">
                <div className="py-4 px-4 text-xs text-white/25 flex items-center">
                  Full pricing in the Founders Brief
                </div>
                {(["Inquire →", "Inquire →", "Inquire →"] as const).map((label, j) => (
                  <div
                    key={j}
                    className={`py-4 px-2 flex items-center justify-center rounded-b-xl ${
                      j === 0
                        ? "bg-amber/10 border-x border-b border-amber/25"
                        : "bg-white/[0.02] border-x border-b border-white/[0.07]"
                    }`}
                  >
                    <a
                      href="#inquiry"
                      className={`text-xs font-medium transition-colors ${
                        j === 0 ? "text-amber hover:text-amber/80" : "text-white/40 hover:text-white/60"
                      }`}
                    >
                      {label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#0C0B0F] py-24 px-6">
        <motion.div {...FI} className="max-w-3xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-14">How it works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Send an inquiry",
                body: "Fill in the short form below. Takes about 3 minutes. Tells us who you are and what draws you here.",
              },
              {
                step: "02",
                title: "Receive the Founders Brief",
                body: "If it looks like a fit, we send the Founders Brief — full tier pricing, legal structure, and how to hold your spot with a refundable $2,000 deposit.",
              },
              {
                step: "03",
                title: "Formal membership offer",
                body: "Once your deposit is in, we send the subscription documents. You review with your advisors, sign, and you're a founding member.",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="text-center"
              >
                <span className="inline-flex items-center justify-center rounded-full bg-amber/10 border border-amber/20 w-10 h-10 text-amber text-xs font-mono mb-5">
                  {s.step}
                </span>
                <h3 className="font-serif text-[17px] text-white mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="#inquiry"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-9 py-4 text-sm font-medium text-white hover:bg-amber/90 transition-all"
            >
              Start the inquiry <ArrowRight size={13} weight="bold" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <motion.div {...FI} className="max-w-[700px] mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-14">Common questions</p>
          <div className="space-y-px">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-white/[0.07]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                >
                  <span className={`text-[15px] transition-colors ${openFaq === i ? "text-white" : "text-white/60 group-hover:text-white/85"}`}>
                    {item.q}
                  </span>
                  <span className="shrink-0 text-white/30 group-hover:text-white/50 transition-colors">
                    {openFaq === i ? <Minus size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-white/45 text-sm leading-relaxed pb-6 pr-8">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="bg-[#0C0B0F] py-24 px-6">
        <motion.div {...FI} className="max-w-5xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-4">Who joins the founding circle</p>
          <h2 className="font-serif text-[clamp(22px,3.5vw,30px)] text-white text-center mb-14 leading-snug">
            This is for people with a reason to be here.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WHO_ITS_FOR.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-6"
              >
                <p className="text-white/80 text-sm font-medium mb-2">{item.label}</p>
                <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SCARCITY CTA */}
      <section className="py-20 px-6 text-center">
        <motion.div {...FI} className="max-w-[580px] mx-auto">
          <p className="text-amber text-[11px] uppercase tracking-[0.28em] mb-4">50 spots · First come, first committed</p>
          <h2 className="font-serif text-[clamp(24px,4vw,34px)] text-white mb-5 leading-snug">
            The deposit is refundable.
            <br />The founding terms are not permanent.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Once the 50th member commits, this round closes. The public membership — when it eventually launches — will not include equity or free stays.
          </p>
          <a
            href="#inquiry"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-10 py-4 text-sm font-medium text-white hover:bg-amber/90 transition-all"
          >
            Express your interest now <ArrowRight size={13} weight="bold" />
          </a>
        </motion.div>
      </section>

      {/* FORM */}
      <section id="inquiry" className="bg-[#0C0B0F] py-28 px-6">
        <motion.div {...FI} className="max-w-[560px] mx-auto">
          <div className="mb-12">
            <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] mb-4">Founding membership inquiry</p>
            <h2 className="font-serif text-[30px] text-white mb-3 leading-tight">
              3 minutes. Fully refundable if it&apos;s not a fit.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Tell us about yourself and what draws you here. If it looks like a fit, we send the Founders Brief and you can decide from there.
            </p>
          </div>
          <MembershipInquiryForm theme="dark" ctaLabel="Send my inquiry" />
        </motion.div>
      </section>
    </main>
  );
}

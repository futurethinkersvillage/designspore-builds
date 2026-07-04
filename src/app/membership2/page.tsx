"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Minus, Plus } from "@phosphor-icons/react";
import { MembershipInquiryForm } from "@/components/MembershipInquiryForm";

const FI = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.8 },
};

/* ---------- tier comparison (from the Founders Brief — no pricing) ---------- */

type BenefitRow = {
  label: string;
  max: boolean | string;
  cabin: boolean | string;
  rv: boolean | string;
};

const BENEFITS: BenefitRow[] = [
  { label: "Non-voting Founders equity", max: true, cabin: true, rv: true },
  { label: "Free use each season", max: "2 weeks in a cabin", cabin: "1 week in a cabin", rv: "2 weeks on your RV site" },
  { label: "Long weekends", max: "Priority pick", cabin: false, rv: false },
  { label: "Priority booking window", max: "90 days before public", cabin: "60 days", rv: "60 days" },
  { label: "Member rate on extra nights", max: "30% off cabins", cabin: "20% off cabins", rv: "20% off sites & cabins" },
  { label: "Golf each season", max: "10 rounds", cabin: "5 rounds", rv: "5 rounds" },
  { label: "Disc golf", max: "Unlimited", cabin: "Unlimited", rv: "Unlimited" },
  { label: "Wood-fired sauna sessions", max: "6 / season", cabin: "3 / season", rv: "3 / season" },
  { label: "120-person gazebo", max: "Priority + 20% off", cabin: "20% off", rv: "20% off" },
  { label: "Friends & family nights", max: "4 / year", cabin: "2 / year", rv: "2 / year" },
  { label: "Annual Founders Gathering", max: true, cabin: true, rv: true },
  { label: "Lifetime access", max: true, cabin: true, rv: true },
];

/* ---------- FAQ (grounded in the Founders Brief + Reservation EOI) ---------- */

const FAQ_ITEMS = [
  {
    q: "Is this a timeshare?",
    a: "No. A timeshare sells you a fixed week and charges rising fees forever. A Founding Membership includes non-voting equity in the membership company, free weeks each season with a flexible booking window, and no annual membership fee — just a small per-stay cleaning fee. You're a founding member with a stake, not a customer with a contract.",
  },
  {
    q: "What does the $2,000 deposit commit me to?",
    a: "Nothing. It's a fully refundable reservation — not a purchase, and not an investment. It holds your place in line (spots are prioritized in the order deposits arrive) while the offering is finalized. You can request a full refund at any time before signing final agreements, and if the village doesn't proceed, every deposit is returned in full.",
  },
  {
    q: "What's actually there today?",
    a: "A working resort. The RV sites, golf course, disc golf, wood-fired sauna, and river access have been operating for five years — around 3,000 guests come through each year. The cabins are being built in phases for the 2027 season. The first cabins may start simple and gain comforts over the seasons — we'll always be clear about what's ready each year.",
  },
  {
    q: "When do founding benefits begin?",
    a: "The 2027 season, when the first cabins open. The founding round funds the build: we break ground once 30 memberships are committed. In the meantime the resort is open — you can visit as a guest this season.",
  },
  {
    q: "Are there ongoing fees?",
    a: "No annual membership fee — ever. Founders pay only a small per-stay cleaning fee when they use their weeks. (A separate public Annual Membership with perks and discounts — but no equity or free stays — will be available for everyone else.)",
  },
  {
    q: "Who's behind this?",
    a: "Mike and Euvie Gilliland — co-founders of Future Thinkers, a podcast with 10+ million downloads — who crowdfunded, acquired, and have personally operated the 400-acre resort for five years. This isn't a developer's rendering. It's their home project, offered first to the people closest to it.",
  },
  {
    q: "Why aren't prices on this page?",
    a: "The founding round is a private offering to a small circle, not a public listing. Full tier pricing, terms, and legal structure are in the Founders Brief, which we send after a short inquiry. The tiers and benefits shown here are indicative and still being finalized — nothing on this page is a binding offer.",
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} weight="bold" className="text-amber mx-auto" />;
  if (value === false) return <span className="text-white/20 text-sm">—</span>;
  return <span className="text-white/65 text-sm">{value}</span>;
}

export default function MembershipPage2() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-warm-dark text-white">

      {/* ============ HERO — full-bleed aerial, big type ============ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <img
          src="/images/membership/hero-aerial.jpg"
          alt="Aerial view of Wells Gray Village — 400 acres of golf course, river, and forest"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-warm-dark" />
        <motion.div {...FI} className="relative max-w-4xl mx-auto">
          <p className="text-white/50 text-[11px] tracking-[0.35em] uppercase mb-10">
            Wells Gray Village &nbsp;·&nbsp; 400 acres &nbsp;·&nbsp; 50 founding spots
          </p>
          <h1 className="font-serif font-light text-[clamp(52px,10vw,96px)] leading-[0.92] mb-8 drop-shadow-lg">
            Founding
            <br />
            <em className="not-italic text-amber">Membership.</em>
          </h1>
          <p className="text-white/70 text-[15px] max-w-sm mx-auto mb-10 leading-relaxed drop-shadow">
            A founding stake in this valley — with free weeks every season, for life.
          </p>
          <a
            href="#inquiry"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-9 py-4 text-sm font-medium text-white hover:bg-amber/90 active:scale-[0.98] transition-all"
          >
            Reserve your founding spot <ArrowRight size={13} weight="bold" />
          </a>
          <p className="text-white/45 text-xs mt-5">
            Starts with a 3-minute inquiry. Fully refundable. No commitment.
          </p>
        </motion.div>
      </section>

      {/* ============ PROOF STRIP ============ */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <motion.div
          {...FI}
          className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.06]"
        >
          {[
            { num: "400", label: "acres of private land" },
            { num: "5 yrs", label: "owned & operated" },
            { num: "3,000", label: "guests each year" },
            { num: "10M+", label: "podcast downloads" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <span className="font-serif text-[clamp(24px,3.5vw,36px)] text-white leading-none mb-2">{s.num}</span>
              <span className="text-white/30 text-[10px] uppercase tracking-[0.18em] leading-snug">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ============ WHAT YOU GET — 3 cards, one lede ============ */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div {...FI} className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] mb-4">What this is</p>
          <h2 className="font-serif text-[clamp(24px,4vw,34px)] text-white leading-snug">
            The highest tier this village will ever have — for the 50 people closest to it.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              title: "A founding stake",
              body: "Non-voting equity in the membership company behind the village. Founders get first access to future opportunities — including ones never offered publicly.",
            },
            {
              title: "Free weeks, every season",
              body: "One to two weeks in a cabin or on your own serviced RV site, each season, for life — plus golf, unlimited disc golf, and wood-fired saunas.",
            },
            {
              title: "The best terms, permanently",
              body: "No annual membership fee. Priority booking before the public. When the 50th spot fills, this round closes — the public membership that follows includes none of this.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8"
            >
              <span className="inline-block w-8 h-px bg-amber mb-6" />
              <h3 className="font-serif text-[19px] text-white mb-3">{item.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ PHOTO BAND — community ============ */}
      <section className="relative h-[75vh] min-h-[440px] overflow-hidden">
        <img
          src="/images/membership/gazebo-families.jpg"
          alt="Families gathered at the 120-person gazebo at Wells Gray Village"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-transparent to-warm-dark/40" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 left-0 right-0 max-w-[860px] mx-auto px-8 pb-16"
        >
          <p className="font-serif text-[clamp(19px,3.2vw,30px)] leading-[1.45] text-white drop-shadow-lg max-w-[640px]">
            Summers by the river. Campfires and long evenings — and kids who grow up alongside the same friends, year after year.
          </p>
        </motion.div>
      </section>

      {/* ============ TIER COMPARISON TABLE ============ */}
      <section id="compare" className="py-24 px-4 sm:px-6">
        <motion.div {...FI} className="max-w-4xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-4">Three ways to join</p>
          <h2 className="font-serif text-[clamp(24px,4vw,34px)] text-white text-center mb-3 leading-snug">
            Every membership includes equity. Choose your stay.
          </h2>
          <p className="text-white/35 text-center text-sm mb-14 max-w-md mx-auto">
            A cabin sleeps four — younger members split a Founder Cabin with a partner, sibling, or friends.
          </p>

          <div className="overflow-x-auto -mx-4 px-4">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[1.8fr_1.1fr_1fr_1fr] gap-px mb-px">
                <div />
                {["Founder Cabin Max", "Founder Cabin", "Founder RV"].map((h, i) => (
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
                        The prime dates
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {BENEFITS.map((row, i) => (
                <div key={i} className="grid grid-cols-[1.8fr_1.1fr_1fr_1fr] gap-px">
                  <div className={`py-3 px-4 text-sm text-white/50 flex items-center border-b border-white/[0.05] ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                    {row.label}
                  </div>
                  {(["max", "cabin", "rv"] as const).map((key, j) => (
                    <div
                      key={key}
                      className={`py-3 px-2 flex items-center justify-center text-center border-b border-white/[0.05] ${
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

              <div className="grid grid-cols-[1.8fr_1.1fr_1fr_1fr] gap-px">
                <div className="py-4 px-4 text-xs text-white/25 flex items-center">
                  Full pricing in the Founders Brief
                </div>
                {[0, 1, 2].map((j) => (
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
                      Inquire →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-white/20 text-xs mt-8 text-center max-w-xl mx-auto">
            No annual membership fee — a small per-stay cleaning fee applies to member stays. Tiers and benefits are indicative and still being finalized. Full pricing and terms are in the Founders Brief, sent after inquiry.
          </p>
        </motion.div>
      </section>

      {/* ============ PHOTO GRID — the place ============ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { src: "/images/membership/dome-meadow.jpg", alt: "The dome in a summer meadow at Wells Gray Village", caption: "Summer in the meadow" },
            { src: "/images/membership/creek-site.jpg", alt: "Creekside site at Wells Gray Village", caption: "Sites on the creek" },
            { src: "/images/membership/gathering-dinner.jpg", alt: "A shared dinner at the gazebo", caption: "Dinners that run long" },
          ].map((img, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden aspect-[4/5] group"
            >
              <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-5 text-white/85 text-sm font-medium drop-shadow">
                {img.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS — compressed ============ */}
      <section className="bg-[#0C0B0F] py-24 px-6">
        <motion.div {...FI} className="max-w-3xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-4">How it works</p>
          <h2 className="font-serif text-[clamp(22px,3.5vw,30px)] text-white text-center mb-14 leading-snug">
            Reserve first. Decide later.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "3-minute inquiry",
                body: "Who you are, how you know us, which tier fits.",
              },
              {
                step: "02",
                title: "Brief + hold your place",
                body: "Full pricing in the Founders Brief. A refundable $2,000 deposit holds your spot — in deposit order.",
              },
              {
                step: "03",
                title: "Decide on final terms",
                body: "Formal documents come when the round is finalized. Proceed, or get every dollar back.",
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
          <p className="text-center text-white/30 text-xs mt-10 max-w-md mx-auto leading-relaxed">
            The deposit is a reservation — not a purchase, and not an investment. Refundable in full at any time before final agreements are signed.
          </p>
        </motion.div>
      </section>

      {/* ============ TIMELINE ============ */}
      <section className="py-24 px-6">
        <motion.div {...FI} className="max-w-3xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-14">The path</p>
          <div className="space-y-0">
            {[
              { when: "Now", what: "The resort is open — RV sites, golf, disc golf, wood-fired sauna, and river access, operating for five years." },
              { when: "30 members", what: "We break ground. The founding round funds the first cabins and secures the land for the long term." },
              { when: "2027 season", what: "Cabins open and founding benefits begin — your free weeks, priority booking, and recreation pass start here." },
              { when: "50 members", what: "The founding round closes, permanently. Later rounds come at higher prices, without equity or founding terms." },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex gap-6 sm:gap-10 py-6 border-b border-white/[0.06] items-baseline"
              >
                <span className="font-serif text-amber text-[17px] shrink-0 w-28 sm:w-36">{t.when}</span>
                <p className="text-white/50 text-sm leading-relaxed">{t.what}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ FOUNDERS' LETTER — photo + short text ============ */}
      <section className="bg-[#0C0B0F] py-24 px-6">
        <motion.div {...FI} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <figure className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src="/images/membership/firepit-evening.jpg"
              alt="An evening around the firepit at the Wells Gray Village gazebo"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </figure>
          <div>
            <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] mb-8">From Mike &amp; Euvie</p>
            <div className="space-y-4 font-serif text-[clamp(16px,2.2vw,18px)] leading-[1.75] text-white/65">
              <p>
                For a decade on Future Thinkers we asked how people will live in the next era. Five years ago we stopped asking — we crowdfunded, bought this 400-acre resort, moved here, and ran it. Every season, every guest, every repair.
              </p>
              <p>
                Before the village opens to the world, we&apos;re offering the best of it to the fifty people closest to this place. If that might be you, we&apos;d like to hear from you.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-12 bg-amber/40" />
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase">
                Mike &amp; Euvie Gilliland · Future Thinkers
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ FAQ ============ */}
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

      {/* ============ SCARCITY ============ */}
      <section className="bg-amber py-20 px-6">
        <motion.div {...FI} className="max-w-[620px] mx-auto text-center">
          <p className="font-serif text-[clamp(20px,3.5vw,30px)] text-white leading-[1.4] mb-8">
            Fifty founding memberships. The best terms we will ever offer. When they&apos;re gone, this round is closed.
          </p>
          <a
            href="#inquiry"
            className="inline-flex items-center gap-2 rounded-full border border-white/50 px-8 py-4 text-sm text-white hover:bg-white/15 transition-all"
          >
            Reserve your founding spot <ArrowRight size={12} weight="bold" />
          </a>
        </motion.div>
      </section>

      {/* ============ FORM ============ */}
      <section id="inquiry" className="py-28 px-6">
        <motion.div {...FI} className="max-w-[560px] mx-auto">
          <div className="mb-12">
            <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] mb-4">Private inquiry</p>
            <h2 className="font-serif text-[32px] text-white mb-3 leading-tight">
              Tell us about yourself.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              The founding circle is offered privately — to past guests, podcast listeners, friends, and people with a real connection to Wells Gray. Three minutes, no commitment. If it&apos;s a fit, the Founders Brief comes next.
            </p>
          </div>
          <MembershipInquiryForm theme="dark" ctaLabel="Send my inquiry" />
        </motion.div>
      </section>
    </main>
  );
}

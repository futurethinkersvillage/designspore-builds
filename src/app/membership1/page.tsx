"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowRight, Check, Minus, Plus } from "@phosphor-icons/react";
import { MembershipInquiryForm } from "@/components/MembershipInquiryForm";

const FI = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.8 },
};

/* ---------- tier comparison data (from the Founders Brief — no pricing) ---------- */

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

/* ---------- why nothing else works (from the deck's market-gap logic) ---------- */

const ALTERNATIVES = [
  {
    name: "The lakeside cottage",
    gives: "Roots and a place that's yours",
    misses: "A fortune upfront, endless maintenance, and it sits empty 40 weeks a year",
  },
  {
    name: "Resorts & rentals",
    gives: "Comfort and zero upkeep",
    misses: "Different place every year, rising prices, and nothing to show for a decade of summers",
  },
  {
    name: "The timeshare",
    gives: "A guaranteed week",
    misses: "Fees that climb forever, a fixed slot, and a contract that's famously hard to exit",
  },
  {
    name: "Ecovillages & communes",
    gives: "Community and ideals",
    misses: "No professional operations — and your comfort depends on everyone else's follow-through",
  },
];

/* ---------- who it's for (from the brief's own audience framing) ---------- */

const WHO_ITS_FOR = [
  {
    label: "Families with kids",
    body: "The same river, the same trails, the same friends every summer. Kids learn hands-on skills and grow up alongside the same families, year after year.",
  },
  {
    label: "Younger members",
    body: "A cabin sleeps four — bring your partner, a sibling, or friends and split a place of your own. This is the affordable way into founding equity.",
  },
  {
    label: "RV travellers",
    body: "Two free weeks on your own serviced site every season, with a real community waiting when you pull in — not a parking lot of strangers.",
  },
  {
    label: "Future Thinkers listeners",
    body: "You've heard Mike and Euvie think about how people will live for a decade. This is the land where that thinking becomes physical.",
  },
  {
    label: "Builders & creators",
    body: "A makerspace, a co-working gazebo, workshops, and a village where something is always being built, grown, or made.",
  },
  {
    label: "Couples & retirees",
    body: "Golf, wood-fired saunas, long evenings by the river — with modern comforts, professional operations, and people you'll know by name.",
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} weight="bold" className="text-amber mx-auto" />;
  if (value === false) return <span className="text-white/20 text-sm">—</span>;
  return <span className="text-white/65 text-sm">{value}</span>;
}

export default function MembershipPage1() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-warm-dark text-white">

      {/* ============ HERO — big, bold, simple ============ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(217,119,6,0.09),transparent)]" />
        <motion.div {...FI} className="relative max-w-4xl mx-auto">
          <p className="text-white/25 text-[11px] tracking-[0.35em] uppercase mb-10">
            Wells Gray Village &nbsp;·&nbsp; Clearwater, BC &nbsp;·&nbsp; 50 founding spots
          </p>
          <h1 className="font-serif font-light text-[clamp(52px,10vw,96px)] leading-[0.92] mb-10">
            Founding
            <br />
            <em className="not-italic text-amber">Membership.</em>
          </h1>
          <p className="text-white/40 text-[15px] max-w-sm mx-auto mb-12 leading-relaxed">
            A founding stake in a 400-acre village bordering Wells Gray Provincial Park — with free weeks every season, for life.
          </p>
          <a
            href="#inquiry"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-9 py-4 text-sm font-medium text-white hover:bg-amber/90 active:scale-[0.98] transition-all"
          >
            Reserve your founding spot <ArrowRight size={13} weight="bold" />
          </a>
          <p className="text-white/25 text-xs mt-5">
            Starts with a 3-minute inquiry. Fully refundable. No commitment.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-10 text-white/20"
        >
          <ArrowDown size={18} />
        </motion.div>
      </section>

      {/* ============ PROOF STRIP — this place already exists ============ */}
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

      {/* ============ STORY — the brief's own voice ============ */}
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <img
          src="/images/gemini_generated_image_o3gzbko3gzbko3gz-1024x747.png"
          alt="Wells Gray Village"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-black/25 to-warm-dark/60" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 left-0 right-0 max-w-[860px] mx-auto px-8 pb-16"
        >
          <p className="font-serif text-[clamp(19px,3.2vw,30px)] leading-[1.45] text-white/85 max-w-[640px]">
            Summers by the river. Golf and wood-fired saunas. Campfires and long evenings with the people you love — and kids who grow up alongside the same friends, year after year.
          </p>
        </motion.div>
      </section>

      {/* ============ WHAT THIS IS ============ */}
      <section className="max-w-[800px] mx-auto px-8 py-28">
        <motion.div {...FI} className="space-y-6">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em]">What this is</p>
          <div className="space-y-5 text-[17px] leading-[1.85] text-white/55">
            <p>
              Wells Gray Village is a seasonal community for families, nature lovers, and creators — on 400 acres of private land bordering Wells Gray Provincial Park. It&apos;s a professionally run resort that has operated for five years, and it&apos;s becoming something more: a village where there is always something being built, grown, or made.
            </p>
            <p>
              The Founding Membership is the highest tier it will ever have — reserved for{" "}
              <span className="text-white/90">a small circle of 50 people who want a home base here for years to come</span>. Every founding membership includes non-voting equity in the membership company, free weeks in a cabin or on an RV site every season, lifetime access, and a genuine voice in where the village goes.
            </p>
            <p>
              Founders also get first access to future opportunities — including ones that will never be offered publicly. When the 50 spots are gone, this round is closed. The public membership that follows will not include equity, free stays, or founding terms.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ============ WHY NOTHING ELSE DOES THIS ============ */}
      <section className="bg-[#0C0B0F] py-24 px-6">
        <motion.div {...FI} className="max-w-4xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-4">The gap</p>
          <h2 className="font-serif text-[clamp(24px,4vw,36px)] text-white text-center mb-4 leading-snug">
            Every way to spend summers in nature makes you choose.
          </h2>
          <p className="text-white/40 text-center text-sm mb-14 max-w-lg mx-auto leading-relaxed">
            Ownership or freedom. Community or professionalism. A founding membership is built to stop the trade-off.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {ALTERNATIVES.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6"
              >
                <p className="text-white/80 text-sm font-medium mb-3">{a.name}</p>
                <p className="text-white/45 text-sm leading-relaxed mb-1.5">
                  <span className="text-amber/60">Gives you:</span> {a.gives}.
                </p>
                <p className="text-white/45 text-sm leading-relaxed">
                  <span className="text-white/30">Costs you:</span> {a.misses}.
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div {...FI} className="rounded-xl border border-amber/25 bg-amber/[0.06] p-8 text-center">
            <p className="font-serif text-[clamp(17px,2.6vw,22px)] text-white/90 leading-[1.5] max-w-2xl mx-auto">
              A Founding Membership: equity instead of rent, free weeks instead of fees, a professionally run resort instead of a group project — and the same community waiting every summer.
            </p>
          </motion.div>
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

      {/* ============ HOW IT WORKS — the reservation flow ============ */}
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
                title: "Tell us who you are",
                body: "A 3-minute inquiry — who you are, how you know us, and which tier fits. The founding circle is offered to people with a real connection to the village.",
              },
              {
                step: "02",
                title: "Get the brief, hold your place",
                body: "If it's a fit, we send the Founders Brief with full pricing and terms. A fully refundable $2,000 deposit holds your place in line — spots are prioritized in the order deposits arrive.",
              },
              {
                step: "03",
                title: "Decide with the final terms",
                body: "When the round is finalized with our advisors, you get the formal documents. Proceed, and your deposit applies to your membership. Pass — or if we don't launch — and it's returned in full.",
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
          <div className="text-center mt-8">
            <a
              href="#inquiry"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-9 py-4 text-sm font-medium text-white hover:bg-amber/90 transition-all"
            >
              Start the inquiry <ArrowRight size={13} weight="bold" />
            </a>
          </div>
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
              { when: "50 members", what: "The founding round closes, permanently. Later membership rounds come at higher prices, without equity or founding terms." },
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

      {/* ============ WHO IT'S FOR ============ */}
      <section className="bg-[#0C0B0F] py-24 px-6">
        <motion.div {...FI} className="max-w-4xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-4">The founding circle</p>
          <h2 className="font-serif text-[clamp(22px,3.5vw,30px)] text-white text-center mb-14 leading-snug">
            Fifty spots. People with a reason to be here.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHO_ITS_FOR.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6"
              >
                <p className="text-white/80 text-sm font-medium mb-2">{item.label}</p>
                <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ FOUNDERS' LETTER ============ */}
      <section className="py-28 px-6">
        <motion.div {...FI} className="max-w-[680px] mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] mb-10">From Mike &amp; Euvie</p>
          <div className="space-y-5 font-serif text-[clamp(16px,2.4vw,19px)] leading-[1.8] text-white/65">
            <p>
              For over a decade we made Future Thinkers, asking one question: how will people live in the next era? Five years ago we stopped just asking. We crowdfunded, bought a 400-acre resort at the edge of Wells Gray Provincial Park, moved here, and ran it — every season, every guest, every repair.
            </p>
            <p>
              The village we&apos;re building now grows out of everything we learned. And before it opens to the world, we&apos;re offering the best of it — the equity, the free weeks, the first pick of everything — to the fifty people closest to this place.
            </p>
            <p>
              If that might be you, we&apos;d like to hear from you.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-12 bg-amber/40" />
            <p className="text-white/40 text-xs tracking-[0.2em] uppercase">
              Mike &amp; Euvie Gilliland · Co-founders, Future Thinkers
            </p>
          </div>
        </motion.div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-[#0C0B0F] py-24 px-6">
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
      <section className="bg-amber py-24 px-6">
        <motion.div {...FI} className="max-w-[620px] mx-auto text-center">
          <p className="font-serif text-[clamp(20px,3.5vw,32px)] text-white leading-[1.4] mb-8">
            Fifty founding memberships. The best terms we will ever offer, reserved for the people closest to the project. When they&apos;re gone, this round is closed.
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

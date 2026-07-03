"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { MembershipInquiryForm } from "@/components/MembershipInquiryForm";

const FI = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.8 },
};

const TIERS = [
  {
    num: "01",
    name: "Founder Cabin Max",
    tagline: "Two weeks every season. The deepest founding benefits.",
    desc: "Two free weeks in a private cabin, long weekend priority, 10 rounds of golf, 6 sauna sessions, and 4 guest nights per year. The most complete membership in the founding circle.",
  },
  {
    num: "02",
    name: "Founder Cabin",
    tagline: "One week every season in a cabin that sleeps four.",
    desc: "60-day priority booking, 5 rounds of golf, 3 sauna sessions, and 2 guest nights per year. A full week at Wells Gray, every season.",
  },
  {
    num: "03",
    name: "Founder RV",
    tagline: "Two weeks on a fully serviced site. Bring your own rig.",
    desc: "Your own site, your own pace. 60-day priority booking, 5 rounds of golf, 3 sauna sessions, and 2 guest nights per year.",
  },
];

export default function MembershipPage3() {
  return (
    <main className="bg-warm-dark text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(217,119,6,0.09),transparent)]" />
        <motion.div {...FI} className="relative max-w-4xl mx-auto">
          <p className="text-white/25 text-[11px] tracking-[0.35em] uppercase mb-10">
            Clearwater, BC &nbsp;·&nbsp; 400 acres &nbsp;·&nbsp; 50 founding spots
          </p>
          <h1 className="font-serif font-light text-[clamp(52px,10vw,96px)] leading-[0.92] mb-10">
            Founding
            <br />
            <em className="not-italic text-amber">Membership.</em>
          </h1>
          <p className="text-white/40 text-[15px] max-w-xs mx-auto mb-12 leading-relaxed">
            A non-voting equity stake, free seasonal stays, and a home base at Wells Gray Village — for 50 founding members.
          </p>
          <a
            href="#inquiry"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-9 py-4 text-sm font-medium text-white hover:bg-amber/90 active:scale-[0.98] transition-all"
          >
            Express your interest <ArrowRight size={13} weight="bold" />
          </a>
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

      {/* FULL-BLEED IMAGE */}
      <section className="relative h-[65vh] min-h-[360px] overflow-hidden">
        <img
          src="/images/gemini_generated_image_o3gzbko3gzbko3gz-1024x747.png"
          alt="Wells Gray Village"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-black/20 to-warm-dark/50" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 left-0 right-0 max-w-[820px] mx-auto px-8 pb-14"
        >
          <p className="font-serif text-[clamp(18px,3vw,26px)] leading-[1.45] text-white/80 max-w-[580px]">
            "The same families. The same place.
            <br className="hidden sm:block" />
            Season after season. A home base
            <br className="hidden sm:block" />
            your children will bring their children."
          </p>
        </motion.div>
      </section>

      {/* WHAT IT IS */}
      <section className="max-w-[800px] mx-auto px-8 py-28">
        <motion.div {...FI} className="space-y-6">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em]">What this is</p>
          <div className="space-y-5 text-[17px] leading-[1.85] text-white/55">
            <p>
              A Founding Membership is not a resort booking. It is not a timeshare. It is not a deed to a piece of land.
            </p>
            <p>
              It is a{" "}
              <span className="text-white/90">non-voting equity stake in the company behind Wells Gray Village</span>{" "}
              — plus free weeks in a cabin or on a serviced RV site every season, for life. Priority booking, golf, sauna, and a guaranteed home in the mountains.
            </p>
            <p>
              50 spots total. When the 50th member commits, the founding round closes. The public membership, when it launches, will not include equity, free stays, or founding terms.
            </p>
            <p>
              Pricing and full legal terms are in the Founders Brief — sent after a short inquiry, if it looks like a fit.
            </p>
          </div>
        </motion.div>
      </section>

      <div className="max-w-[800px] mx-auto px-8">
        <div className="border-t border-white/[0.07]" />
      </div>

      {/* TIERS */}
      <section className="max-w-[800px] mx-auto px-8">
        <motion.p {...FI} className="text-white/25 text-[11px] uppercase tracking-[0.28em] pt-16 mb-2">
          Three ways to join
        </motion.p>
        <motion.p
          {...FI}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-white/30 text-sm mb-0"
        >
          Every membership includes a non-voting equity stake, lifetime access, and the annual Founders Gathering.
        </motion.p>
        {TIERS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="border-b border-white/[0.07] py-10 flex gap-7 items-start group cursor-default"
          >
            <span className="text-white/15 text-xs font-mono shrink-0 mt-1.5 w-6">{t.num}</span>
            <div>
              <h3 className="font-serif text-[21px] text-white mb-1 group-hover:text-amber transition-colors duration-300">
                {t.name}
              </h3>
              <p className="text-amber/60 text-sm mb-3">{t.tagline}</p>
              <p className="text-white/40 text-sm leading-relaxed max-w-xl">{t.desc}</p>
            </div>
          </motion.div>
        ))}
        <p className="text-white/20 text-xs mt-8">
          Membership pricing is in the Founders Brief — shared after inquiry. Not published publicly.
        </p>
      </section>

      {/* OPERATING TODAY */}
      <section className="max-w-[800px] mx-auto px-8 py-20">
        <motion.div
          {...FI}
          className="border border-white/[0.07] rounded-2xl p-10 space-y-4 bg-white/[0.02]"
        >
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em]">Already operating</p>
          <h3 className="font-serif text-[22px] text-white/85 leading-snug">
            Wells Gray Golf &amp; RV Resort is open this season.
          </h3>
          <p className="text-white/40 text-sm leading-relaxed">
            The golf course, RV sites, hot tubs, sauna, and river access are running now. Founding Members aren&apos;t investing in a concept — they&apos;re joining a place that already works, at founding terms, before the cabins and village development completes.
          </p>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="max-w-[800px] mx-auto px-8 pb-20">
        <motion.div
          {...FI}
          className="grid grid-cols-3 divide-x divide-white/[0.07] border border-white/[0.07] rounded-2xl overflow-hidden"
        >
          {[
            { num: "50", label: "founding spots total" },
            { num: "30", label: "commits = we break ground" },
            { num: "2027", label: "when benefits begin" },
          ].map((s) => (
            <div
              key={s.num}
              className="bg-white/[0.025] flex flex-col items-center justify-center py-12 px-4 text-center"
            >
              <span className="font-serif text-[clamp(32px,5vw,52px)] text-white leading-none mb-2">
                {s.num}
              </span>
              <span className="text-white/25 text-[11px] uppercase tracking-[0.18em] leading-snug">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* SCARCITY */}
      <section className="bg-amber py-24 px-6">
        <motion.div {...FI} className="max-w-[620px] mx-auto text-center">
          <p className="font-serif text-[clamp(20px,3.5vw,32px)] text-white leading-[1.4] mb-8">
            "The founding round closes when the 50th member commits. The public membership — when it eventually
            launches — will not include equity or free stays."
          </p>
          <a
            href="#inquiry"
            className="inline-flex items-center gap-2 rounded-full border border-white/50 px-8 py-4 text-sm text-white hover:bg-white/15 transition-all"
          >
            Express your interest <ArrowRight size={12} weight="bold" />
          </a>
        </motion.div>
      </section>

      {/* FORM */}
      <section id="inquiry" className="py-28 px-6">
        <motion.div {...FI} className="max-w-[520px] mx-auto">
          <div className="mb-12">
            <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] mb-4">Private inquiry</p>
            <h2 className="font-serif text-[32px] text-white mb-3 leading-tight">
              Express your interest.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Founding Memberships are offered privately — to people with an existing connection to Wells Gray, the
              Future Thinkers community, or the Gilliland family. Tell us about yourself and what draws you here.
            </p>
          </div>
          <MembershipInquiryForm theme="dark" ctaLabel="Send my inquiry" />
        </motion.div>
      </section>
    </main>
  );
}

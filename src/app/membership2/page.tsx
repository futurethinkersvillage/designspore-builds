"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { MembershipInquiryForm } from "@/components/MembershipInquiryForm";

const FI = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.8 },
};

const TIERS = [
  {
    name: "Founder Cabin Max",
    featured: true,
    badge: "Most complete",
    tagline: "Two free weeks every season.",
    perks: [
      "2 free weeks/season in a private cabin",
      "90-day priority booking window",
      "First pick on long weekends",
      "10 golf rounds per season",
      "6 sauna sessions per season",
      "4 guest nights per year",
      "Non-voting equity stake",
      "Lifetime access + Founders Gathering",
    ],
  },
  {
    name: "Founder Cabin",
    featured: false,
    tagline: "One free week every season.",
    perks: [
      "1 free week/season (cabin sleeps 4)",
      "60-day priority booking window",
      "5 golf rounds per season",
      "3 sauna sessions per season",
      "2 guest nights per year",
      "Non-voting equity stake",
      "Lifetime access + Founders Gathering",
    ],
  },
  {
    name: "Founder RV",
    featured: false,
    tagline: "Two free weeks on your own site.",
    perks: [
      "2 free weeks/season on a serviced site",
      "60-day priority booking window",
      "Bring your own rig",
      "5 golf rounds per season",
      "3 sauna sessions per season",
      "2 guest nights per year",
      "Non-voting equity stake",
      "Lifetime access + Founders Gathering",
    ],
  },
];

export default function MembershipPage2() {
  return (
    <main className="bg-warm-dark text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <img
          src="/images/gemini_generated_image_o3gzbko3gzbko3gz-1024x747.png"
          alt="Wells Gray Village"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f05]/80 via-[#0f0b06]/60 to-warm-dark" />
        <motion.div {...FI} className="relative max-w-3xl mx-auto">
          <p className="text-amber/60 text-[11px] tracking-[0.35em] uppercase mb-8">
            Wells Gray Village &nbsp;·&nbsp; Clearwater, BC &nbsp;·&nbsp; 50 founding spots
          </p>
          <h1 className="font-serif font-light text-[clamp(40px,7.5vw,78px)] leading-[1.05] mb-8">
            Your family&apos;s summer home
            <br />
            <em className="not-italic text-amber">for life.</em>
          </h1>
          <p className="text-white/50 text-base max-w-sm mx-auto mb-12 leading-relaxed">
            A founding equity stake, free seasonal stays, and a guaranteed home at Wells Gray Village — for the families who choose it first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#inquiry"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber px-9 py-4 text-sm font-medium text-white hover:bg-amber/90 active:scale-[0.98] transition-all"
            >
              Become a founding member <ArrowRight size={13} weight="bold" />
            </a>
            <a
              href="#tiers"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-9 py-4 text-sm text-white/70 hover:border-white/40 hover:text-white transition-all"
            >
              See the three ways to join
            </a>
          </div>
        </motion.div>
      </section>

      {/* PULL QUOTE */}
      <section className="py-28 px-6 text-center">
        <motion.div {...FI} className="max-w-[820px] mx-auto">
          <p className="font-serif italic text-[clamp(22px,4.5vw,42px)] text-white/75 leading-[1.4]">
            "400 acres bordering one of BC&apos;s greatest parks.
            <br className="hidden md:block" />
            The same families. The same trails.
            <br className="hidden md:block" />
            The same place, year after year."
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-amber/40" />
            <p className="text-amber/50 text-xs tracking-[0.25em] uppercase">Clearwater, BC</p>
            <div className="h-px w-12 bg-amber/40" />
          </div>
        </motion.div>
      </section>

      {/* WHAT YOU GET */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <motion.p {...FI} className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-14">
          What every founding member gets
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: "⛳",
              title: "Free seasonal stays",
              body: "One or two free weeks every season — in a private cabin or on a fully serviced RV site. Yours, every year, for life.",
            },
            {
              icon: "🏔️",
              title: "An equity stake",
              body: "Non-voting shares in the company behind Wells Gray Village. You hold a stake in the land, the infrastructure, and whatever it becomes.",
            },
            {
              icon: "🔥",
              title: "Lifetime access",
              body: "Golf, sauna, hot tubs, river access, makerspace, co-working gazebo, and the annual Founders Gathering. Otherworld — a small arts and music festival — happens on the land each summer.",
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
              <span className="text-3xl mb-5 block">{item.icon}</span>
              <h3 className="font-serif text-[18px] text-white mb-3">{item.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COST COMPARISON */}
      <section className="bg-[#0C0B0F] py-28 px-6">
        <motion.div {...FI} className="max-w-4xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-4">The math</p>
          <h2 className="font-serif text-[clamp(26px,4.5vw,40px)] text-white text-center mb-16 leading-snug">
            What you&apos;d spend renting the same time<br className="hidden sm:block" />
            over 20 seasons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Renting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl border border-white/10 p-8 space-y-5"
            >
              <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Renting the same time</p>
              <div className="space-y-3 text-sm">
                {[
                  ["Peak season cabin (BC interior)", "$1,750–$3,200 / week"],
                  ["2 weeks per year", "$3,500–$6,400 / season"],
                  ["20 seasons", "$70,000–$128,000"],
                  ["Equity stake at the end", "$0"],
                  ["Guarantee of returning next year", "None"],
                  ["You own any of it", "No"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2 border-b border-white/5">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white/60 text-right shrink-0">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Founding */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl border border-amber/30 bg-amber/5 p-8 space-y-5"
            >
              <p className="text-amber/70 text-xs uppercase tracking-[0.2em]">A Founding Membership</p>
              <div className="space-y-3 text-sm">
                {[
                  ["One-time founding investment", "In the Founders brief"],
                  ["2 free weeks per season", "For life"],
                  ["Over 20 seasons", "Same investment"],
                  ["Non-voting equity stake", "Yes"],
                  ["Guaranteed access year after year", "Yes"],
                  ["You hold a stake in it", "Yes"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2 border-b border-amber/10">
                    <span className="text-white/50">{label}</span>
                    <span className="text-amber/70 text-right shrink-0">{value}</span>
                  </div>
                ))}
              </div>
              <a
                href="#inquiry"
                className="block w-full text-center rounded-full bg-amber px-6 py-3.5 text-sm font-medium text-white hover:bg-amber/90 transition-all mt-4"
              >
                See full pricing in the brief
              </a>
            </motion.div>
          </div>
          <p className="text-center text-white/25 text-xs mt-8">
            Full pricing is in the Founders Brief — sent after inquiry. Not published on this page.
          </p>
        </motion.div>
      </section>

      {/* TIERS */}
      <section id="tiers" className="py-28 px-6">
        <motion.div {...FI} className="max-w-5xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-4">Three ways to join</p>
          <h2 className="font-serif text-[clamp(26px,4vw,36px)] text-white text-center mb-14 leading-snug">
            Choose how deep you want to go.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`relative rounded-2xl p-7 flex flex-col ${
                  t.featured
                    ? "border-2 border-amber bg-amber/5"
                    : "border border-white/[0.08] bg-white/[0.02]"
                }`}
              >
                {t.featured && t.badge && (
                  <span className="absolute -top-3 left-6 bg-amber text-white text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full">
                    {t.badge}
                  </span>
                )}
                <h3 className={`font-serif text-[20px] mb-1 ${t.featured ? "text-amber" : "text-white"}`}>
                  {t.name}
                </h3>
                <p className="text-white/40 text-sm mb-6">{t.tagline}</p>
                <ul className="space-y-2.5 flex-1">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        weight="bold"
                        className={`mt-0.5 shrink-0 ${t.featured ? "text-amber" : "text-white/30"}`}
                      />
                      <span className="text-sm text-white/55">{p}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#inquiry"
                  className={`mt-8 block text-center rounded-full py-3.5 text-sm font-medium transition-all ${
                    t.featured
                      ? "bg-amber text-white hover:bg-amber/90"
                      : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  }`}
                >
                  Inquire about this tier
                </a>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/25 text-xs mt-8">
            Pricing for each tier is in the Founders Brief — sent after your inquiry.
          </p>
        </motion.div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="bg-[#0C0B0F] py-24 px-6">
        <motion.div {...FI} className="max-w-4xl mx-auto">
          <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] text-center mb-4">Who joins the founding circle</p>
          <h2 className="font-serif text-[clamp(22px,3.5vw,30px)] text-white text-center mb-14 leading-snug">
            Families who want a place — not just a trip.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Families with kids", body: "Who want the same trails, the same river, the same community — every summer." },
              { label: "Multigenerational families", body: "Three generations under one sky, on land you all have a stake in." },
              { label: "Future Thinkers listeners", body: "Who already feel connected to Mike and Euvie's work and want to be part of the place behind it." },
              { label: "Remote workers & builders", body: "Who want a base in the mountains that works as hard as they do — co-working gazebo, sauna, fast wifi." },
              { label: "Couples & retirees", body: "Looking for a beautiful, active place with a community already in place when you arrive." },
              { label: "Investors in intentional living", body: "Who see land-backed community membership as a meaningful place to park capital alongside personal use." },
            ].map((item, i) => (
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

      {/* URGENCY */}
      <section className="py-24 px-6">
        <motion.div {...FI} className="max-w-[680px] mx-auto">
          <div className="rounded-2xl border border-amber/30 bg-amber/5 p-10 space-y-6 text-center">
            <p className="text-amber text-[11px] uppercase tracking-[0.28em]">50 spots · First come, first committed</p>
            <h2 className="font-serif text-[clamp(22px,4vw,32px)] text-white leading-[1.3]">
              The founding round closes when the 50th member commits.
            </h2>
            <p className="text-white/45 text-sm leading-relaxed max-w-md mx-auto">
              The public membership — when it eventually launches — will not include equity, free stays, or founding terms. There&apos;s no second version of this offer.
            </p>
            <p className="text-white/35 text-sm">
              The resort is operating now. The deposit is fully refundable. The brief is two pages.
            </p>
            <a
              href="#inquiry"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber px-10 py-4 text-sm font-medium text-white hover:bg-amber/90 transition-all"
            >
              Start your inquiry <ArrowRight size={13} weight="bold" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* FORM */}
      <section id="inquiry" className="bg-[#0C0B0F] py-28 px-6">
        <motion.div {...FI} className="max-w-[560px] mx-auto">
          <div className="mb-12">
            <p className="text-white/25 text-[11px] uppercase tracking-[0.28em] mb-4">Founding membership inquiry</p>
            <h2 className="font-serif text-[30px] text-white mb-4 leading-tight">
              Tell us about your family.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              The founding round is by invitation — to people with a connection to Wells Gray, the Future Thinkers community, or the Gilliland family. A short inquiry is how we get started.
            </p>
          </div>
          <MembershipInquiryForm
            theme="dark"
            ctaLabel="Start my inquiry"
          />
        </motion.div>
      </section>
    </main>
  );
}

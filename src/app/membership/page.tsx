"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle,
  Quotes,
  Tree,
  Tent,
  Car,
  Star,
  Users,
  CalendarBlank,
  Golf,
  Waves,
  Warning,
} from "@phosphor-icons/react";

// ── Types ─────────────────────────────────────────────────────────────────────

const HOW_KNOW_OPTIONS = [
  { value: "friend_family", label: "Friend of Mike and Euvie / the Gilliland family" },
  { value: "family", label: "Family" },
  { value: "business_associate", label: "Business associate or colleague" },
  { value: "past_guest", label: "Past guest at Wells Gray Golf & RV Resort" },
  { value: "podcast_listener", label: "Future Thinkers podcast listener" },
  { value: "mailing_list", label: "Future Thinkers mailing list" },
  { value: "group_online", label: "Saw it in a group or online community" },
  { value: "referred", label: "Referred by a current member or a friend" },
] as const;

const NEEDS_DETAIL = ["podcast_listener", "mailing_list", "group_online", "referred", "business_associate"];

const JOINING_AS_OPTIONS = [
  "Family with kids",
  "Multigenerational family (kids + grandparents)",
  "Couple",
  "Retired couple",
  "Younger couple",
  "Single",
];

const TIER_OPTIONS = [
  { value: "cabin_max", label: "Founder Cabin Max — deepest benefits, 2 free weeks/season in a cabin" },
  { value: "cabin", label: "Founder Cabin — 1 free week/season in a cabin (sleeps four)" },
  { value: "rv", label: "Founder RV — 2 free weeks/season on a serviced RV site" },
  { value: "public_waitlist", label: "Public membership (no equity) — join the waitlist" },
  { value: "not_sure", label: "Not sure yet — help me choose" },
];

const COMMUNITY_FIT_OPTIONS = [
  { value: "yes", label: "Yes — that's exactly what appeals to me" },
  { value: "mostly", label: "Mostly — I have a couple of questions" },
  { value: "not_quite", label: "Not quite — I'm looking for something different" },
];

const TIMELINE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "probably", label: "Probably — I'd want to see the full details first" },
  { value: "just_exploring", label: "Just exploring for now" },
];

// ── Shared input styles ───────────────────────────────────────────────────────

const INPUT =
  "w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber/60 transition-colors";
const LABEL = "block text-xs font-medium uppercase tracking-[0.12em] text-white/40 mb-2";

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark flex items-end">
      <div className="absolute inset-0">
        <Image
          src="/images/add_a_group_202511251511-copy.jpeg"
          alt="Wells Gray Village"
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/50 to-warm-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-36 lg:px-16 lg:pb-36 w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-amber/30 bg-amber/[0.08] px-4 py-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber">
            Wells Gray Village · Founders Membership · 50 spots
          </span>
        </motion.div>

        <div className="overflow-hidden pb-4 -mb-4">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(4rem,11vw,9rem)] font-light leading-[0.88] tracking-tighter text-white"
          >
            A home base
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-10 -mb-10">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(4rem,11vw,9rem)] italic font-light leading-[0.88] tracking-tighter text-amber"
          >
            for life.
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12 max-w-[50ch] text-base leading-relaxed text-white/50"
        >
          A founding equity stake in Wells Gray Village — 400 acres bordering
          Wells Gray Provincial Park. Seasonal stays, real community, and a place
          your family returns to for generations. Invitation only. Capped at 50.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#inquiry"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
          >
            Express your interest <ArrowRight size={13} weight="bold" />
          </a>
          <span className="text-sm text-white/35">
            Break ground at 30 committed · Benefits begin 2027
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ── The Place ─────────────────────────────────────────────────────────────────

function ThePlace() {
  return (
    <section className="bg-[#0F0E12] py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_40%] items-start">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6"
            >
              The place
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-serif text-4xl font-light text-white lg:text-5xl mb-10 leading-tight"
            >
              Summers by the river.{" "}
              <span className="italic text-white/50">The same families, season after season.</span>
            </motion.h2>

            <div className="space-y-5 text-base leading-relaxed text-white/50 max-w-[60ch]">
              {[
                "Wells Gray Village is a seasonal recreational community for families, nature lovers, and creators — on 400 acres of private land bordering Wells Gray Provincial Park, near Clearwater, BC.",
                "It is a place to slow down and reconnect: summers by the river, golf and disc golf, wood-fired saunas, campfires, and long evenings with the people you love. Kids learn hands-on skills and grow up alongside the same friends year after year, and there is always something being built, grown, or made.",
                "Real nature and modern comforts, a professionally run resort, and a genuine community of families who come back season after season. The RV sites are operating now. The first cabins open in 2027.",
              ].map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl"
          >
            <Image
              src="/images/add_a_small_202511251502-572x1024.jpeg"
              alt="Wells Gray Village"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── What It Is ───────────────────────────────────────────────────────────────

function WhatItIs() {
  const pillars = [
    {
      label: "A founding equity stake",
      body: "Non-voting Founders shares in the membership company — a real stake, not just a guest pass. Allocated in proportion to your contribution.",
    },
    {
      label: "Free weeks every season",
      body: "One or two weeks in a cabin or on a serviced RV site each season, depending on your tier. Member rates on extra nights.",
    },
    {
      label: "Lifetime access",
      body: "Priority booking ahead of the public, every year. A say in the village's direction. And first access to future opportunities across the network.",
    },
  ];

  return (
    <section className="bg-warm-dark py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6"
          >
            What it is
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl font-light text-white lg:text-5xl leading-tight"
          >
            Not a timeshare. Not a deed.{" "}
            <span className="italic text-amber">Something better.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-warm-dark p-8 lg:p-10"
            >
              <div className="font-mono text-xs text-white/20 mb-5">{String(i + 1).padStart(2, "0")}</div>
              <div className="text-base font-medium text-white mb-4">{p.label}</div>
              <div className="text-sm leading-relaxed text-white/45">{p.body}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-sm text-white/35 max-w-[60ch]"
        >
          A resort is transient — people come to consume and leave. Wells Gray Village is
          designed the other way around. The same families return to the same place season
          after season, so your kids grow up alongside the same friends, and you build real,
          multigenerational relationships over years — not just visits.
        </motion.p>
      </div>
    </section>
  );
}

// ── Three Ways to Join ────────────────────────────────────────────────────────

function ThreeWays() {
  const tiers = [
    {
      icon: Tree,
      name: "Founder Cabin Max",
      tagline: "For families and couples who want the cabin, the prime dates, and the deepest benefits.",
      benefits: [
        "2 free weeks in a cabin every season",
        "First-priority booking (90 days ahead of public)",
        "10 golf rounds, 6 sauna sessions, unlimited disc golf",
        "Long-weekend pick included",
        "4 friends & family nights per year",
      ],
    },
    {
      icon: Tent,
      name: "Founder Cabin",
      tagline: "For younger members. A cabin sleeps four — bring your partner, a sibling, or friends.",
      benefits: [
        "1 free week in a cabin every season",
        "Cabin sleeps four — split it with your people",
        "5 golf rounds, 3 sauna sessions, unlimited disc golf",
        "Priority booking (60 days ahead of public)",
        "2 friends & family nights per year",
      ],
    },
    {
      icon: Car,
      name: "Founder RV",
      tagline: "For members who travel with their own rig and want a home base for the summer.",
      benefits: [
        "2 free weeks on a serviced RV site every season",
        "Your rig, your home base",
        "5 golf rounds, 3 sauna sessions, unlimited disc golf",
        "Priority booking (60 days ahead of public)",
        "2 friends & family nights per year",
      ],
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6"
          >
            Three ways to join
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl font-light text-white lg:text-5xl"
          >
            Find your <span className="italic">founding tier.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-warm-dark/60 p-8 flex flex-col"
            >
              <tier.icon size={24} weight="light" className="text-amber mb-5" />
              <div className="text-base font-medium text-white mb-3">{tier.name}</div>
              <div className="text-sm text-white/50 leading-relaxed mb-7">{tier.tagline}</div>
              <div className="space-y-3 flex-1">
                {tier.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <Check size={13} weight="bold" className="text-amber shrink-0 mt-0.5" />
                    <span className="text-sm text-white/65">{b}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-white/30">
                  Every tier includes a non-voting equity stake, lifetime access, and the annual Founders Gathering.
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-sm text-white/35"
        >
          Full details — including pricing, the tier comparison table, and the financial summary — are in the Founders brief, sent after a short inquiry.
        </motion.p>
      </div>
    </section>
  );
}

// ── Every Founder Gets ────────────────────────────────────────────────────────

function EveryFounderGets() {
  const benefits = [
    { icon: Star, label: "Equity stake", body: "Non-voting Founders shares in the membership company, allocated in proportion to your contribution." },
    { icon: CalendarBlank, label: "Free seasonal stays", body: "1–2 weeks in a cabin or on an RV site every season, used how and when you choose." },
    { icon: Users, label: "Priority booking — forever", body: "Your booking window opens 60–90 days before the public, every year. Peak dates, first pick." },
    { icon: Golf, label: "Recreation pass", body: "Golf rounds, wood-fired sauna sessions, and unlimited disc golf every season." },
    { icon: Waves, label: "Founders Gathering", body: "A private, members-only gathering each season — connect, celebrate, and help shape the village." },
    { icon: Tree, label: "First access to what's next", body: "First in line for future programs, facilities, and investment opportunities across the network — opportunities never offered publicly." },
  ];

  return (
    <section className="bg-warm-dark py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6"
          >
            What every Founder gets
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl font-light text-white lg:text-5xl"
          >
            A stake. A say. <span className="italic">A home.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="bg-warm-dark p-8"
            >
              <b.icon size={18} weight="light" className="text-amber mb-5" />
              <div className="text-sm font-medium text-white mb-3">{b.label}</div>
              <div className="text-sm leading-relaxed text-white/40">{b.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What Exists Today ────────────────────────────────────────────────────────

function WhatExistsToday() {
  const items = [
    "RV & tenting sites (operating now)",
    "Geodesic glamping dome",
    "Bunk cabins with shared bathrooms & showers",
    "Barrel sauna & river cold plunge",
    "120-person gazebo + smaller gazebos",
    "Kids' playground",
    "Small maker space & woodworking shop",
    "Small garden",
    "Private lake",
    "Forest trails, river access & mountain scenery",
    "Golf & disc golf course",
    "Early seasonal programs & events",
  ];

  return (
    <section className="bg-[#0F0E12] py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            What exists today
          </p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl mb-4">
            Already <span className="italic">operating.</span>
          </h2>
          <p className="text-sm text-white/40 max-w-[52ch]">
            This isn't a concept. Wells Gray Village is on 400 acres we've owned and operated for five years. Everything below is there now.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-16 sm:grid-cols-2 max-w-3xl">
          {[items.slice(0, 7), items.slice(7)].map((col, ci) => (
            <div key={ci} className="divide-y divide-white/10 border-y border-white/10">
              {col.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="flex items-center gap-4 py-4"
                >
                  <Check size={13} weight="bold" className="text-amber shrink-0" />
                  <span className="text-sm text-white/60">{item}</span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const testimonials = [
    { quote: "We felt an immediate sense of peace — like stepping into another world.", attribution: "Summer Guest, 2024" },
    { quote: "It's amazing to see Mike & Euvie's Smart Village vision take shape. They're putting together everything they said they would: sauna, maker-space, community atmosphere. I can't say enough.", attribution: "Future Thinkers Podcast Listener, 2025" },
    { quote: "The community feeling here is something we've never experienced anywhere else.", attribution: "Family Visitor, 2023" },
    { quote: "It's the kind of place you want to come back to every year.", attribution: "Snowbird Couple, 2023" },
    { quote: "Waking up beside the creek with the sound of rushing water and mountain views — a peaceful, nature-filled escape that felt like a dream.", attribution: "Couple, 2025" },
    { quote: "Such a beautiful, relaxing place to be — with a warm, family-oriented atmosphere and nature all around.", attribution: "Family, 2024" },
  ];

  return (
    <section className="bg-warm-dark py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">Testimonials</p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl">
            What guests are <span className="italic">saying.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="bg-warm-dark p-8 flex flex-col"
            >
              <Quotes size={22} weight="fill" className="text-amber/35 mb-4 shrink-0" />
              <p className="text-sm leading-relaxed text-white/55 mb-6 flex-1">{t.quote}</p>
              <p className="text-xs text-white/25">— {t.attribution}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Now ───────────────────────────────────────────────────────────────────

function WhyNow() {
  const reasons = [
    { n: "01", label: "50 spots total — and only 50", body: "When the founding round closes, it closes. There will be a more affordable public membership in the future, but the founding 50 are a different thing entirely." },
    { n: "02", label: "Best terms we will ever offer", body: "More free time, deeper discounts, and benefits that later memberships won't include. Founding terms are permanent — your benefits don't change as new members join at higher prices." },
    { n: "03", label: "First pick — forever", body: "Founders choose cabins, sites, and dates first, by tier and in the order they joined. Your priority is permanent." },
    { n: "04", label: "Early Founder bonus", body: "The first 15 members to commit receive an extra complimentary week in the 2027 season and a guaranteed long-weekend pick (Cabin Max)." },
    { n: "05", label: "We break ground at 30", body: "We launch and break ground on the cabin build once 30 memberships are committed. The founding round drives the construction timeline." },
  ];

  return (
    <section className="bg-[#0F0E12] py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16 max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6"
          >
            Why the founding round
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl font-light text-white lg:text-5xl"
          >
            Founding 50 is a different thing.{" "}
            <span className="italic text-amber">Join now or join later — not the same offer.</span>
          </motion.h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10 max-w-3xl">
          {reasons.map((r, i) => (
            <motion.div
              key={r.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="grid grid-cols-[3rem_1fr] gap-6 py-6 lg:grid-cols-[3rem_16rem_1fr]"
            >
              <span className="font-mono text-xs text-white/20">{r.n}</span>
              <span className="text-sm font-medium text-white">{r.label}</span>
              <span className="hidden text-sm leading-relaxed text-white/40 lg:block col-start-3">{r.body}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Inquiry Form ──────────────────────────────────────────────────────────────

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  joining_as: string;
  how_know_us: string;
  how_know_us_detail: string;
  tier_interest: string;
  what_interests_you: string;
  community_fit: string;
  timeline: string;
  anything_else: string;
  consent: boolean;
};

const EMPTY_FORM: FormData = {
  name: "", email: "", phone: "", location: "", joining_as: "",
  how_know_us: "", how_know_us_detail: "", tier_interest: "",
  what_interests_you: "", community_fit: "", timeline: "",
  anything_else: "", consent: false,
};

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all ${
            value === opt.value
              ? "border-amber bg-amber/10 text-white"
              : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/70"
          }`}
        >
          <input
            type="radio"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          <span
            className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-all ${
              value === opt.value ? "border-amber bg-amber" : "border-white/25"
            }`}
          >
            {value === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </span>
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function InquiryForm() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [autoApproved, setAutoApproved] = useState(false);

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const needsDetail = NEEDS_DETAIL.includes(form.how_know_us);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/membership-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAutoApproved(data.score === "GREEN");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
        <CheckCircle size={40} weight="fill" className="text-amber mb-6" />
        <h3 className="font-serif text-3xl font-light text-white mb-4">
          {autoApproved ? "Check your inbox." : "Inquiry received."}
        </h3>
        <p className="text-base leading-relaxed text-white/50">
          {autoApproved
            ? `Thanks, ${form.name.split(" ")[0]}. We've sent you the full Founders brief and next steps — check your inbox (and spam folder just in case).`
            : `Thanks, ${form.name.split(" ")[0]}. We'll review your inquiry and if it's a fit, you'll hear from us with the full Founders brief and how to hold your spot.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-10">
      {/* About you */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-amber/70 mb-6">About you</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Full name *</label>
            <input required className={INPUT} placeholder="Jane Smith" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Email *</label>
            <input required type="email" className={INPUT} placeholder="jane@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Phone (optional)</label>
            <input className={INPUT} placeholder="+1 (250) 555-0100" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Where are you based? *</label>
            <input required className={INPUT} placeholder="City, Province / State" value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Who would be joining? *</label>
            <select
              required
              value={form.joining_as}
              onChange={(e) => set("joining_as", e.target.value)}
              className={INPUT + " cursor-pointer"}
            >
              <option value="">Select…</option>
              {JOINING_AS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Your connection */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-amber/70 mb-6">Your connection</p>
        <div className="space-y-5">
          <div>
            <label className={LABEL}>How do you know us? *</label>
            <select
              required
              value={form.how_know_us}
              onChange={(e) => { set("how_know_us", e.target.value); set("how_know_us_detail", ""); }}
              className={INPUT + " cursor-pointer"}
            >
              <option value="">Select…</option>
              {HOW_KNOW_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {needsDetail && (
            <div>
              <label className={LABEL}>Tell us more *</label>
              <textarea
                required
                rows={3}
                className={INPUT + " resize-none"}
                placeholder="Who referred you, which group, or how we know each other — a sentence or two is perfect."
                value={form.how_know_us_detail}
                onChange={(e) => set("how_know_us_detail", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Your interest */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-amber/70 mb-6">Your interest</p>
        <div className="space-y-5">
          <div>
            <label className={LABEL}>Which membership interests you? *</label>
            <select
              required
              value={form.tier_interest}
              onChange={(e) => set("tier_interest", e.target.value)}
              className={INPUT + " cursor-pointer"}
            >
              <option value="">Select…</option>
              {TIER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>What interests you about Wells Gray Village? *</label>
            <textarea
              required
              rows={4}
              className={INPUT + " resize-none"}
              placeholder="There are no wrong answers — we'd just like to hear it in your words."
              value={form.what_interests_you}
              onChange={(e) => set("what_interests_you", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Values & timing */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-amber/70 mb-6">Values &amp; timing</p>
        <div className="space-y-7">
          <div>
            <label className={LABEL + " mb-3"}>
              Wells Gray Village is a professionally run resort community with clear house rules and a friendly, respectful atmosphere — members are expected to be good neighbours. Does that sound like the place you&apos;re looking for? *
            </label>
            <RadioGroup options={COMMUNITY_FIT_OPTIONS} value={form.community_fit} onChange={(v) => set("community_fit", v)} />
          </div>
          <div>
            <label className={LABEL + " mb-3"}>
              Founding spots are held with a fully refundable $2,000 deposit that commits you to nothing. If it&apos;s a fit, are you in a position to move forward this season? *
            </label>
            <RadioGroup options={TIMELINE_OPTIONS} value={form.timeline} onChange={(v) => set("timeline", v)} />
          </div>
        </div>
      </div>

      {/* Anything else */}
      <div>
        <label className={LABEL}>Anything else you&apos;d like us to know? (optional)</label>
        <textarea
          rows={3}
          className={INPUT + " resize-none"}
          placeholder="Questions, context, or anything you'd like to share."
          value={form.anything_else}
          onChange={(e) => set("anything_else", e.target.value)}
        />
      </div>

      {/* Consent + submit */}
      <div className="space-y-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
            form.consent ? "border-amber bg-amber" : "border-white/25 group-hover:border-white/45"
          }`}>
            {form.consent && <Check size={10} weight="bold" className="text-white" />}
          </div>
          <input
            type="checkbox"
            required
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="sr-only"
          />
          <span className="text-xs leading-relaxed text-white/40">
            I understand this is an inquiry, not an offer of membership or securities, and I&apos;m happy for Mike &amp; Euvie to contact me.
          </span>
        </label>

        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Warning size={14} weight="bold" />
            Something went wrong. Email us directly at{" "}
            <a href="mailto:contact@futurethinkers.org" className="underline">contact@futurethinkers.org</a>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-amber px-10 py-4 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending…" : <>Send my inquiry <ArrowRight size={13} weight="bold" /></>}
        </button>
      </div>
    </form>
  );
}

function InquirySection() {
  return (
    <section id="inquiry" className="bg-warm-dark py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-14 max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6"
          >
            Express your interest
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl font-light text-white lg:text-5xl mb-6"
          >
            Reserve your place in the <span className="italic">inquiry.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm leading-relaxed text-white/45"
          >
            This is a short inquiry, not a commitment. If it looks like a fit, we&apos;ll share the full
            Founders brief and how to hold your spot with a fully refundable $2,000 deposit.
            Takes about 3 minutes.
          </motion.p>
        </div>

        <InquiryForm />

        <div className="mt-14 pt-8 border-t border-white/10 max-w-2xl">
          <p className="text-xs leading-relaxed text-white/25">
            This form is an inquiry, not an offer of membership or securities. A Founding Membership includes
            non-voting shares in Portal.Place Inc. and is offered only to eligible persons under applicable
            private-placement exemptions. Full details, pricing, terms, and risk disclosures are provided
            in the formal subscription documents. Amounts in CAD. The tiers and benefits described on this
            page are indicative and subject to change.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MembershipPage() {
  return (
    <>
      <Hero />
      <ThePlace />
      <WhatItIs />
      <ThreeWays />
      <EveryFounderGets />
      <WhatExistsToday />
      <Testimonials />
      <WhyNow />
      <InquirySection />
    </>
  );
}

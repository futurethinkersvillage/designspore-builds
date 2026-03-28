"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Campfire,
  TreeEvergreen,
  Mountains,
  Users,
  Wrench,
  Waves,
  Golf,
  Coffee,
  Laptop,
  Leaf,
  Sun,
} from "@phosphor-icons/react";

// ── C: Bold Typographic / Poster ────────────────────────────────────────────
// Dark throughout. Huge display type as the primary design element.
// Amber (#EA824E) as the accent. Photography used as texture, not hero.
// Horizontal marquee band. Large numbered sections.

function Marquee() {
  const items = [
    "Near Clearwater, BC",
    "400 Acres",
    "Seasonal · Recreational · Community",
    "Founded 2019",
    "Membership Now Open",
    "Builders · Families · Entrepreneurs",
  ];
  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-white/10 bg-warm-dark py-4">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-0 whitespace-nowrap"
      >
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-8">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/40">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-amber shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      {/* Background: photo as subtle texture */}
      <div className="absolute inset-0">
        <Image
          src="/images/wells-gray-golf-rv-06-1024x685.jpg"
          alt="Wells Gray"
          fill
          priority
          className="object-cover opacity-[0.08]"
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-32 pb-0 lg:px-16">
        {/* Oversized headline — left aligned, intentionally large */}
        <div className="overflow-hidden pb-[0.15em] -mb-[0.15em] pl-[0.08em] -ml-[0.08em]">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(4rem,13vw,12rem)] font-light leading-[0.88] tracking-tighter text-white"
          >
            Building
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-[0.15em] -mb-[0.15em] pl-[0.08em] -ml-[0.08em]">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(4rem,13vw,12rem)] italic font-light leading-[0.88] tracking-tighter text-amber"
          >
            resilient
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-[0.15em] -mb-[0.15em] pl-[0.08em] -ml-[0.08em]">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(4rem,13vw,12rem)] font-light leading-[0.88] tracking-tighter text-white"
          >
            communities
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-[0.15em] -mb-[0.15em] pl-[0.08em] -ml-[0.08em]">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.21, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(4rem,13vw,12rem)] font-light leading-[0.88] tracking-tighter text-white"
          >
            for what comes next.
          </motion.h1>
        </div>

        {/* Bottom row: descriptor + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-col items-start justify-between gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-end"
        >
          <p className="max-w-[40ch] text-sm leading-relaxed text-white/40">
            A seasonal village and membership community for builders, entrepreneurs, and families — on 400 acres near Clearwater, BC, 2 hours north of Kamloops.
          </p>
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/village"
              className="text-sm font-medium text-white/40 transition-colors hover:text-white"
            >
              Visit
            </Link>
            <Link
              href="/partner"
              className="text-sm font-medium text-white/40 transition-colors hover:text-white"
            >
              Request Investor Access
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Become a Member <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="mt-16">
        <Marquee />
      </div>
    </section>
  );
}

function CoreIdea() {
  const pillars = [
    { n: "01", icon: Users, label: "Community", body: "Real-life social ties beyond cities and social media — intergenerational, family-centred." },
    { n: "02", icon: Leaf, label: "Health", body: "Nature, movement, better food. Environments that regulate your nervous system." },
    { n: "03", icon: Wrench, label: "Skills", body: "Maker culture, creativity, collaboration, and adaptability for a changing world." },
    { n: "04", icon: Mountains, label: "Infrastructure", body: "Local food, energy, shared tools and spaces — resilient by design, not by accident." },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-20 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_45%]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">The core idea</p>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl">
              A real place.<br />
              <span className="italic">A real community.</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm leading-relaxed text-white/40 max-w-[45ch]">
              Not a commune. Not a co-op. A seasonal village and membership community — backed by real land, real programs, and real people building something worth returning to. Think of it as a country club with 21st-century values.
            </p>
          </div>
        </div>

        {/* Pillars: large numbered rows, no cards */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="grid grid-cols-[3rem_1fr_1fr] items-start gap-8 py-8 lg:grid-cols-[5rem_1fr_2fr]"
            >
              <span className="font-mono text-xs text-white/20 pt-0.5">{p.n}</span>
              <div className="flex items-center gap-4">
                <p.icon size={16} weight="light" className="text-amber shrink-0" />
                <span className="text-base font-medium text-white">{p.label}</span>
              </div>
              <p className="text-sm leading-relaxed text-white/40 max-w-[55ch]">{p.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/membership"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90"
          >
            Explore membership <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TheVillage() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left: copy + stats */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Our first village
            </p>
            <h2 className="font-serif text-5xl font-light leading-tight text-white lg:text-6xl">
              Near Clearwater, BC.<br />
              <span className="italic text-white/40">400 acres.</span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/40 max-w-[42ch]">
              Waterfalls, hiking, horseback riding, canoeing, and whitewater rafting in Interior BC — 2 hours north of Kamloops. Operating for 5 years as a resort, now becoming the first Portal.Place village.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-6">
              {[
                { value: "400", unit: "ac", label: "Owned & operating" },
                { value: "5+", unit: "yrs", label: "Running programs" },
                { value: "40+", unit: "", label: "Waterfalls nearby" },
                { value: "2026", unit: "", label: "Membership open" },
              ].map((s) => (
                <div key={s.label} className="border-b border-white/10 pb-5">
                  <div className="font-mono text-3xl font-light tabular-nums text-white">
                    {s.value}
                    {s.unit && <span className="ml-1 text-lg text-amber">{s.unit}</span>}
                  </div>
                  <div className="mt-1.5 text-xs uppercase tracking-wider text-white/25">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {[
                { icon: TreeEvergreen, label: "Forest trails" },
                { icon: Waves, label: "Private lake" },
                { icon: Mountains, label: "Sauna" },
                { icon: Golf, label: "9-hole golf" },
                { icon: Wrench, label: "Maker space" },
                { icon: Campfire, label: "Campfire" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                  <item.icon size={11} weight="light" className="text-amber" />
                  <span className="text-xs text-white/40">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: photo */}
          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "500px" }}>
            <Image
              src="/images/gazebo-interior-campfire-1024x771.jpg"
              alt="Portal.Place village"
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E12]/80 to-transparent" />
            <Link
              href="/village"
              className="absolute bottom-6 left-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-all hover:text-white hover:gap-3"
            >
              Explore the village <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DayInVillage() {
  const schedule = [
    { time: "7:00", label: "Coffee at the gazebo", icon: Coffee },
    { time: "9:30", label: "Forest school for the kids", icon: TreeEvergreen },
    { time: "10:00", label: "Deep work, coworking space", icon: Laptop },
    { time: "15:00", label: "Golf round or trail walk", icon: Golf },
    { time: "17:00", label: "Sauna by the creek & cold plunge", icon: Sun },
    { time: "19:00", label: "Campfire & community dinner", icon: Campfire },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">Daily rhythm</p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            A day in the village
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-0 divide-y divide-white/10 border-y border-white/10 lg:grid-cols-2 lg:divide-y-0 lg:[&>*:nth-child(odd)]:border-r lg:[&>*:nth-child(odd)]:border-white/10">
          {schedule.map((item, i) => (
            <motion.div
              key={item.time}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-6 px-0 py-6 lg:px-8 lg:first:pl-0 lg:even:pl-8"
            >
              <span className="w-14 shrink-0 font-mono text-sm text-white/20">{item.time}</span>
              <item.icon size={14} weight="light" className="shrink-0 text-amber" />
              <span className="text-sm text-white/55">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetInvolved() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_40%]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Come and see<br />
              <span className="italic">what we&apos;re</span><br />
              building.
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-4">
            {[
              { label: "Visit", sub: "Book a stay or join a seasonal program", href: "/village" },
              { label: "Become a Member", sub: "Founding membership now open — buy instantly", href: "/membership" },
              { label: "Request Investor Access", sub: "Private materials available", href: "/partner" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-2xl bg-white/10 px-6 py-5 transition-all hover:bg-white/20"
              >
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="mt-0.5 text-xs text-white/60">{item.sub}</div>
                </div>
                <ArrowRight size={14} weight="bold" className="text-white/50 transition-all group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VariantC() {
  return (
    <>
      <Hero />
      <CoreIdea />
      <TheVillage />
      <DayInVillage />
      <GetInvolved />
    </>
  );
}

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

// ── B: Warm Light / Magazine ─────────────────────────────────────────────────
// Cream dominant. Hero is a full editorial spread — large italic serif headline
// across the top, tall photo panel beside it. No dark sections on light pages
// (per redesign-skill: "don't randomly drop a dark section in a cream page").
// Terracotta is bold and warm throughout.

function Hero() {
  return (
    <section className="min-h-[100dvh] bg-cream pt-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        {/* Top kicker */}
        <div className="flex items-center justify-between border-b border-ink/10 py-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink/40">
            Wells Gray, BC — Canada&apos;s first Smart Village
          </p>
          <p className="hidden text-xs text-ink/30 lg:block">
            Est. 2019 · Phase 1 operational
          </p>
        </div>

        {/* Main hero grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_38%]">
          {/* Left: headline + body + CTAs */}
          <div className="flex flex-col justify-between py-8 lg:py-16">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.95] tracking-tight text-ink"
              >
                The future<br />
                of <span className="italic text-terracotta">human</span><br />
                living.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-10 max-w-[42ch] text-base leading-relaxed text-ink/55"
              >
                A membership network of villages for remote workers, families, and
                builders who want a healthier, more connected, future-proof life.
                Real land. Real programs. A replicable blueprint.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-14 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-terracotta/90 active:scale-[0.98]"
              >
                Apply for membership <ArrowRight size={14} weight="bold" />
              </Link>
              <Link
                href="/village"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink/50 transition-colors hover:text-ink"
              >
                Visit the village <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Right: tall photo panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative hidden overflow-hidden rounded-2xl lg:block"
            style={{ minHeight: "70vh" }}
          >
            <Image
              src="/images/gazebo-interior-campfire-1024x771.jpg"
              alt="Campfire inside the village gazebo"
              fill
              priority
              className="object-cover"
            />
            {/* Caption */}
            <div className="absolute bottom-5 left-5 rounded-lg bg-white/80 px-4 py-2.5 backdrop-blur-sm">
              <p className="text-xs text-ink/60">Wells Gray Village, BC</p>
            </div>
          </motion.div>
        </div>

        {/* Three paths — horizontal rule layout */}
        <div className="mt-16 grid grid-cols-1 gap-0 divide-y divide-ink/10 border-y border-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { label: "Visit", sub: "Book a stay or join a program", href: "/village" },
            { label: "Become a member", sub: "Founding membership now open", href: "/membership", accent: true },
            { label: "Invest or partner", sub: "Request private materials", href: "/partner" },
          ].map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex items-center justify-between px-6 py-5 first:pl-0 last:pr-0 hover:bg-terracotta/5 sm:px-8 transition-colors"
            >
              <div>
                <div className={`text-sm font-medium ${p.accent ? "text-terracotta" : "text-ink"}`}>
                  {p.label}
                </div>
                <div className="mt-0.5 text-xs text-ink/35">{p.sub}</div>
              </div>
              <ArrowRight size={14} weight="light" className="text-ink/25 transition-all group-hover:translate-x-1 group-hover:text-terracotta" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoreIdea() {
  return (
    <section className="bg-off-white py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-[1fr_45%]">

          {/* Left: photo */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-auto">
            <Image
              src="/images/many_people_sitting_202512032320-1024x576.jpeg"
              alt="Community gathering at Portal.Place"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: copy */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta mb-6">
              The core idea
            </p>
            <h2 className="font-serif text-5xl font-light leading-[1.1] text-ink lg:text-6xl" style={{ textWrap: "balance" } as React.CSSProperties}>
              Not a commune.<br />
              Not a co-op.<br />
              <span className="italic">A village.</span>
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/55">
              <p>
                Portal.Place is a membership platform for village living — backed by real
                land, a clear economic model, and a replicable blueprint.
              </p>
              <p>
                A flexible membership community where people move fluidly between
                villages — rooted in nature, powered by technology, built around
                human connection.
              </p>
            </div>

            <div className="mt-12 divide-y divide-ink/10">
              {[
                { icon: Users, label: "Community", body: "Real-life social ties beyond cities and social media" },
                { icon: Leaf, label: "Health", body: "Nature, movement, better food, regulated nervous systems" },
                { icon: Wrench, label: "Skills", body: "Maker culture, creativity, and adaptability" },
                { icon: Mountains, label: "Infrastructure", body: "Local food, energy, shared tools — resilient by design" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 py-4">
                  <item.icon size={15} weight="light" className="mt-0.5 shrink-0 text-terracotta" />
                  <div>
                    <span className="text-sm font-medium text-ink">{item.label} — </span>
                    <span className="text-sm text-ink/50">{item.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TheVillage() {
  return (
    <section className="bg-cream py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta mb-4">
              Our first village
            </p>
            <h2 className="font-serif text-5xl font-light leading-tight text-ink lg:text-6xl">
              Wells Gray, BC
            </h2>
          </div>
          <Link
            href="/village"
            className="hidden items-center gap-2 text-sm font-medium text-ink/40 transition-colors hover:text-ink lg:flex"
          >
            Explore the village <ArrowRight size={13} />
          </Link>
        </div>

        {/* Asymmetric photo grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="relative col-span-2 aspect-video overflow-hidden rounded-2xl lg:col-span-1 lg:row-span-2" style={{ aspectRatio: "unset", minHeight: "400px" }}>
            <Image src="/images/wells-gray-golf-rv-06-1024x685.jpg" alt="Wells Gray village property" fill className="object-cover" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image src="/images/a_young_camphost_202512041422-1024x576.jpeg" alt="Camp host at village" fill className="object-cover" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image src="/images/bf57b989-df81-4b14-8435-046dec6e4fb1-1024x576.jpg" alt="Village life" fill className="object-cover" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image src="/images/a_person_filming_202512032314-1024x576.jpeg" alt="Documentary at village" fill className="object-cover" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image src="/images/many_people_sitting_202512032320-1024x576.jpeg" alt="Community gathering" fill className="object-cover" />
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-12 flex flex-wrap gap-3">
          {[
            { icon: TreeEvergreen, label: "Forest trails" },
            { icon: Waves, label: "Private lake" },
            { icon: Mountains, label: "Mountain sauna" },
            { icon: Golf, label: "9-hole golf" },
            { icon: Wrench, label: "Maker space" },
            { icon: Users, label: "Coworking" },
            { icon: Leaf, label: "Community garden" },
            { icon: Campfire, label: "Campfire grounds" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2">
              <item.icon size={13} weight="light" className="text-terracotta" />
              <span className="text-sm text-ink/60">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DayAndProof() {
  return (
    <section className="bg-off-white py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">

          {/* Day timeline */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta mb-6">A typical day</p>
            <h3 className="font-serif text-4xl font-light text-ink mb-10">Life at the village</h3>
            <div className="space-y-1">
              {[
                { time: "7:00", label: "Coffee at the gazebo", icon: Coffee },
                { time: "9:30", label: "Forest school for the kids", icon: TreeEvergreen },
                { time: "10:00", label: "Deep work, coworking space", icon: Laptop },
                { time: "15:00", label: "Golf or trail walk", icon: Golf },
                { time: "17:00", label: "Sauna by the lake", icon: Sun },
                { time: "19:00", label: "Campfire & community dinner", icon: Campfire },
              ].map((item, i) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 120, damping: 22 }}
                  className="flex items-center gap-5 border-b border-ink/8 py-4"
                >
                  <span className="w-12 shrink-0 font-mono text-sm text-ink/25">{item.time}</span>
                  <item.icon size={14} weight="light" className="shrink-0 text-terracotta" />
                  <span className="text-sm text-ink/60">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta mb-6">Proof of progress</p>
            <h3 className="font-serif text-4xl font-light text-ink mb-10">Not starting from zero</h3>
            <div className="grid grid-cols-2 gap-8">
              {[
                { value: "400", unit: "ac", label: "Owned & operating" },
                { value: "5+", unit: "yrs", label: "Running programs" },
                { value: "23", unit: "eps", label: "Documentary series" },
                { value: "100+", unit: "", label: "Founder network" },
              ].map((s) => (
                <div key={s.label} className="border-b border-ink/10 pb-6">
                  <div className="font-mono text-4xl font-light tabular-nums text-ink">
                    {s.value}
                    {s.unit && <span className="ml-1 text-xl text-terracotta">{s.unit}</span>}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-wider text-ink/35">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-terracotta/90"
              >
                Explore membership <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VariantB() {
  return (
    <>
      <Hero />
      <CoreIdea />
      <TheVillage />
      <DayAndProof />
    </>
  );
}

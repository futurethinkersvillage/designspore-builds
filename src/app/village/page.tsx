"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Waves,
  Mountains,
  TreeEvergreen,
  Golf,
  Wrench,
  Users,
  Leaf,
  Campfire,
  Horse,
  House,
  Tent,
  ArrowUpRight,
} from "@phosphor-icons/react";

// ── Village ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      {/* Full-bleed photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/wells-gray-golf-rv-06-1024x685.jpg"
          alt="Wells Gray Village — 400 acres in Interior BC"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/80 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
          >
            Near Clearwater, BC — 2 hours north of Kamloops
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Your seasonal
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              sanctuary.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            400 acres near Clearwater, BC — gateway to Wells Gray Provincial Park, home to over 40 waterfalls, world-class hiking, horseback riding, canoeing, and whitewater rafting. A seasonal recreational village, operating since 2019.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="https://wellsgrayresort.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Book a stay <ArrowUpRight size={14} weight="bold" />
            </a>
            <a
              href="#programs"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              Explore programs <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {[
              { value: "400", unit: "ac", label: "Private land" },
              { value: "5+", unit: "yrs", label: "In operation" },
              { value: "50°", unit: "N", label: "Latitude" },
              { value: "24°C", unit: "avg", label: "Summer high" },
            ].map((s) => (
              <div key={s.label} className="px-6 py-5 first:pl-0">
                <div className="font-mono text-xl font-light text-white tabular-nums">
                  {s.value}
                  <span className="ml-1 text-sm text-amber">{s.unit}</span>
                </div>
                <div className="text-xs text-white/30 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* Left */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              The property
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              A living prototype<br />
              <span className="italic">in the mountains</span>
            </h2>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>
                Wells Gray Village sits at the gateway to Wells Gray Provincial
                Park — one of BC&apos;s largest and most spectacular wilderness areas,
                known for its 40+ waterfalls, volcanic landscape, hiking, horseback riding, canoeing, and whitewater rafting.
              </p>
              <p>
                The property has been welcoming guests since 2019: campers, families,
                corporate retreats, and events. It&apos;s a seasonal, recreational village — and the first prototype of the Portal.Place community model.
              </p>
              <p>
                Everything you experience here — the sauna, the programs, the
                community rhythms — is the foundation of what we&apos;re building together.
              </p>
            </div>
          </div>

          {/* Right: photo grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-square overflow-hidden rounded-xl col-span-2">
              <Image
                src="/images/many_people_sitting_202512032320-1024x576.jpeg"
                alt="Community at Wells Gray Village"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/images/gemini_generated_image_o3gzbko3gzbko3gz-1024x747.png"
                alt="The geodesic dome at Wells Gray Village"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/images/gazebo-interior-campfire-1024x771.jpg"
                alt="Campfire in the village gazebo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Amenities() {
  const amenities = [
    {
      icon: Tent,
      label: "RV sites, glamping & camping",
      body: "Powered RV pads, a geodesic glamping dome, tenting sites, and a limited number of on-site bunk cabins.",
    },
    {
      icon: Mountains,
      label: "Barrel sauna & cold plunge",
      body: "Wood-fired barrel sauna with a natural river cold plunge — a staple of the daily village rhythm.",
    },
    {
      icon: Waves,
      label: "Private lake",
      body: "A secluded lake on the property for swimming, paddling, and quiet mornings away from the crowds.",
    },
    {
      icon: Golf,
      label: "9-hole golf & disc golf",
      body: "A scenic 9-hole golf course and disc golf route winding through the trees. Available to all guests.",
    },
    {
      icon: Users,
      label: "120-person events gazebo",
      body: "The main communal hub — used for meals, gatherings, workshops, and evening campfires.",
    },
    {
      icon: Wrench,
      label: "Maker space & woodshop — Coming Soon",
      body: "A planned maker space and woodworking shop for prototyping, building, and creative projects. Part of our near-future build-out.",
    },
    {
      icon: TreeEvergreen,
      label: "Forest trails & mountain views",
      body: "Trails through the property with direct access into Wells Gray Provincial Park — home to 40+ waterfalls and world-class hiking.",
    },
    {
      icon: Leaf,
      label: "Community garden",
      body: "A shared growing space for fresh herbs, vegetables, and experiments in regenerative food production.",
    },
    {
      icon: Horse,
      label: "Horse corrals",
      body: "Facilities for guests traveling with horses, with access to surrounding forest and trail networks.",
    },
    {
      icon: House,
      label: "Coworking gazebo — Coming Soon",
      body: "The coworking gazebo is planned as an upgrade of the existing 120-person gazebo — a dedicated space for deep work, workshops, and family gatherings.",
    },
    {
      icon: Campfire,
      label: "Village Rhythm",
      body: "A weekly schedule of themed activities running through the summer season (May 1–Oct 7) — sauna days, forest school, communal meals, campfires, and more.",
    },
    {
      icon: TreeEvergreen,
      label: "Forest school programs",
      body: "Nature-based learning programs for kids, running seasonally within the village grounds.",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            On the property
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            What&apos;s here<br />
            <span className="italic">right now</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.07, duration: 0.4 }}
              className="bg-warm-dark p-7"
            >
              <a.icon size={18} weight="light" className="text-amber mb-4" />
              <div className="text-sm font-medium text-white mb-2">{a.label}</div>
              <div className="text-sm leading-relaxed text-white/35">{a.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Programs() {
  const programs = [
    {
      label: "Village Immersion",
      sub: "Month-long stay",
      body: "A 30-day village residency for families and remote workers. Live the full village rhythm — forest school for the kids, deep work for adults, shared meals, sauna, and community.",
      href: "/immersion",
      cta: "Learn about immersion",
    },
    {
      label: "Village Rhythm",
      sub: "Weekly program",
      body: "Forest school, sauna, campfire, and golf — every Sunday. A low-commitment entry point for locals, guests, and visitors who want a taste of village life.",
      href: "/sunday",
      cta: "See the village rhythm",
    },
    {
      label: "Work-Stay Program",
      sub: "2026 cohort",
      body: "A season-long work-stay for builders, makers, and contributors. Trade skilled work for accommodation, meals, and full village access. Applications open for 2026.",
      href: "/workstay",
      cta: "Apply for work-stay",
    },
    {
      label: "Host an Event",
      sub: "Retreats & gatherings",
      body: "Bring your team, community, or organization to the village. The 120-person gazebo, forest, and lake make for an unforgettable off-site — corporate, creative, or personal.",
      href: "/host",
      cta: "Submit an inquiry",
    },
  ];

  return (
    <section id="programs" className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Ways to participate
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Village<br />
            <span className="italic">programs</span>
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {programs.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group grid grid-cols-1 gap-6 py-10 lg:grid-cols-[16rem_1fr_auto] lg:items-center"
            >
              <div>
                <div className="text-base font-medium text-white">{p.label}</div>
                <div className="text-xs text-amber mt-1 uppercase tracking-wider">{p.sub}</div>
              </div>
              <p className="text-sm leading-relaxed text-white/40 max-w-[55ch]">{p.body}</p>
              <Link
                href={p.href}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white/40 transition-all hover:text-amber hover:gap-3"
              >
                {p.cta} <ArrowRight size={13} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookStay() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_42%]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Come see it<br />
              <span className="italic">for yourself.</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              The best way to understand village life is to experience it.
              Wells Gray Village is a seasonal, recreational community — come for a weekend, a week, or a full program. Arrive as a guest, leave as a believer.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wellsgrayresort.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                Visit — Book at wellsgrayresort.ca <ArrowUpRight size={14} weight="bold" />
              </a>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Become a Member <ArrowRight size={14} />
              </Link>
              <Link
                href="/partner"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Request Investor Access <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Photo */}
          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "320px" }}>
            <Image
              src="/images/wells-gray-golf-rv-06-1024x685.jpg"
              alt="Wells Gray Village — aerial view of the resort"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VillagePage() {
  return (
    <>
      <Hero />
      <About />
      <Amenities />
      <Programs />
      <BookStay />
    </>
  );
}

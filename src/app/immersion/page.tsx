"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Tent,
  Golf,
  Waves,
  Tree,
  Users,
  Leaf,
  Student,
  CalendarBlank,
  CheckCircle,
  ArrowUpRight,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/many_people_sitting_202512032320-1024x576.jpeg"
          alt="Village Immersion at Wells Gray"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/90 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
          >
            Wells Gray Village — Month-Long Residency
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Live the village
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              for a month.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            A 30-day family residency in Wells Gray, BC. Not a campsite booking
            — a full village lifestyle package with accommodation, community
            rhythms, wellness, recreation, and optional forest school for the kids.
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
              Book your month <ArrowUpRight size={14} weight="bold" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              See pricing <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {[
              { value: "30", unit: "days", label: "Full residency" },
              { value: "$2,200", unit: "/mo", label: "Base package" },
              { value: "400", unit: "ac", label: "Private land" },
              { value: "2+", unit: "kids", label: "Forest school" },
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

function WhatItIs() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              What this is
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              A residency,<br />
              <span className="italic">not a campsite</span>
            </h2>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>
                The Village Immersion is a premium family residency — a month-long
                stay that combines accommodation, community, recreation, wellness,
                and village culture into a single lifestyle package.
              </p>
              <p>
                You live inside the rhythms of Wells Gray Village: shared meals,
                sauna sessions, forest walks, campfires, and the quiet productive
                days that come from living somewhere truly beautiful.
              </p>
              <p>
                For families with children, add our Forest School / Worldschooling
                program — structured outdoor learning 2–3 days per week for ages
                3–12.
              </p>
            </div>
          </div>

          <div className="space-y-0 divide-y divide-white/10 border-y border-white/10">
            {[
              {
                icon: Tent,
                label: "RV site for 30 days",
                body: "Powered RV pad with water and sani dump — your home base for the month.",
              },
              {
                icon: Users,
                label: "Village access for the family",
                body: "2 adults and dependent children included. Community gatherings, shared spaces, and village rhythms.",
              },
              {
                icon: Golf,
                label: "Golf — 4 sessions/month",
                body: "Two adults get 4 rounds of golf each on our scenic 9-hole course.",
              },
              {
                icon: Waves,
                label: "Sauna — 4 sessions/month",
                body: "Wood-fired barrel sauna with cold plunge for the whole family, 4 times per month.",
              },
              {
                icon: Tree,
                label: "Full amenity access",
                body: "Private lake, trails, maker space, campfire grounds, and coworking spaces.",
              },
              {
                icon: Leaf,
                label: "Community programming",
                body: "Cultural events, village gatherings, and the social fabric of a living community.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-start gap-5 py-6"
              >
                <item.icon size={18} weight="light" className="text-amber mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white mb-1">{item.label}</div>
                  <div className="text-sm leading-relaxed text-white/35">{item.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ForestSchool() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[42%_1fr]">
          {/* Photo */}
          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "480px" }}>
            <Image
              src="/images/a_young_camphost_202512041422-1024x576.jpeg"
              alt="Forest school at Wells Gray Village"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Optional add-on
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Forest school<br />
              <span className="italic">for your kids</span>
            </h2>
            <div className="mt-6 text-sm leading-relaxed text-white/45 max-w-[44ch]">
              <p>
                A real educational program — not a token activity. Nature play,
                seasonal crafts, stories, exploration, and structured outdoor
                learning in the heart of the forest.
              </p>
            </div>

            <div className="mt-10 space-y-0 divide-y divide-white/10 border-y border-white/10">
              {[
                {
                  label: "Ages 3–6",
                  detail: "$495 / month",
                  sub: "Tue + Thu, 9:30am–1:00pm",
                },
                {
                  label: "Ages 6–12",
                  detail: "$595 / month",
                  sub: "Tue + Thu or Mon / Wed / Fri",
                },
                {
                  label: "Sibling discount",
                  detail: "10% off",
                  sub: "Second child's add-on fee",
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-5">
                  <div>
                    <div className="text-sm font-medium text-white">{row.label}</div>
                    <div className="text-xs text-white/35 mt-0.5">{row.sub}</div>
                  </div>
                  <div className="font-mono text-base text-amber">{row.detail}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Student size={16} className="text-amber" weight="light" />
              <span className="text-sm text-white/40">
                Small mixed-age groups. Drop-off format. Half-day structure.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Investment
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Package<br />
            <span className="italic">pricing</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 lg:grid-cols-3">
          {[
            {
              label: "Base Family Package",
              price: "$2,200",
              period: "/ month",
              note: "The RV site alone is worth $1,500/mo",
              includes: [
                "1 RV site, 30 days",
                "Power, water & sani dump",
                "2 adults + children",
                "Village programming & gatherings",
                "Golf — 4 sessions/month",
                "Sauna — 4 sessions/month",
                "Full amenity access",
              ],
            },
            {
              label: "Forest School Add-On",
              price: "$495–$595",
              period: "/ month",
              note: "Per child, 10% sibling discount",
              includes: [
                "Ages 3–6: $495/month",
                "Ages 6–12: $595/month",
                "2–3 days per week",
                "9:30am–1:00pm",
                "Nature play & outdoor learning",
                "Small mixed-age groups",
                "Drop-off format",
              ],
            },
            {
              label: "Example: Family of 4",
              price: "$3,241",
              period: "/ month",
              note: "2 adults + kids age 4 & 8",
              includes: [
                "Base package: $2,200",
                "Child 1 (age 4): $495",
                "Child 2 (age 8): $595",
                "Sibling discount: −$49.50",
                "All village amenities",
                "Full family forest school",
                "30 days of village life",
              ],
            },
          ].map((tier, i) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-[#0F0E12] p-8"
            >
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
                {tier.label}
              </div>
              <div className="font-mono text-4xl font-light text-white">
                {tier.price}
                <span className="text-base text-white/30 ml-1">{tier.period}</span>
              </div>
              <div className="text-xs text-white/30 mt-2 mb-8">{tier.note}</div>
              <ul className="space-y-2">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/50">
                    <CheckCircle size={14} weight="light" className="text-amber mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoItsFor() {
  const profiles = [
    {
      n: "01",
      label: "Worldschooling families",
      body: "Families who educate on the road and want a nature-based month with real programming for the kids — not just another campsite.",
    },
    {
      n: "02",
      label: "Remote-working families",
      body: "Parents who work remotely and want a productive, beautiful home base for summer — where the kids have things to do and you can actually focus.",
    },
    {
      n: "03",
      label: "Seasonal lifestyle seekers",
      body: "Families looking for something more meaningful than a resort vacation — a real community, real rhythms, and time to slow down.",
    },
    {
      n: "04",
      label: "Wellness-oriented families",
      body: "Parents who prioritize sauna, nature, and active outdoor living, and want their kids in that environment for a full month.",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Best fit
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Who this<br />
            <span className="italic">is for</span>
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {profiles.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="grid grid-cols-1 gap-4 py-8 lg:grid-cols-[5rem_20rem_1fr]"
            >
              <div className="font-mono text-xs text-amber/60">{p.n}</div>
              <div className="text-base font-medium text-white">{p.label}</div>
              <p className="text-sm leading-relaxed text-white/40 max-w-[52ch]">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookImmersion() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_42%]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Ready to spend<br />
              <span className="italic">a month here?</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              Book through Wells Gray Resort. Select your dates, note your family
              size and any forest school interest, and we&apos;ll set up your
              Village Immersion package from there.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wellsgrayresort.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                Book at wellsgrayresort.ca <ArrowUpRight size={14} weight="bold" />
              </a>
              <Link
                href="/village"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Explore the village <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "320px" }}>
            <Image
              src="/images/gazebo-interior-campfire-1024x771.jpg"
              alt="Village campfire at Wells Gray"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ImmersionPage() {
  return (
    <>
      <Hero />
      <WhatItIs />
      <ForestSchool />
      <Pricing />
      <WhoItsFor />
      <BookImmersion />
    </>
  );
}

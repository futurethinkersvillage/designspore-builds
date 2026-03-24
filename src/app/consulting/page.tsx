"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Buildings,
  ChartLine,
  Compass,
  Users,
  Broadcast,
  TreeEvergreen,
  ArrowUpRight,
  VideoCamera,
  Money,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/wells-gray-golf-rv-06-1024x685.jpg"
          alt="Smart Village Consulting"
          fill
          priority
          className="object-cover opacity-25"
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
            Advisory — $150 / hour
          </motion.p>

          <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Smart Village
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              consulting.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            Upgrade your land project into a revenue-generating, community-centered,
            tech-enabled village destination. $150/hour, no retainer required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="https://futurethinkers.org/call60"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Book a session <ArrowUpRight size={14} weight="bold" />
            </a>
            <a
              href="#what-we-cover"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              What we cover <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {[
              { value: "$150", unit: "/hr", label: "Flat rate" },
              { value: "No", unit: "retainer", label: "Required" },
              { value: "Video", unit: "call", label: "Format" },
              { value: "10+", unit: "yrs", label: "Experience" },
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

function WhoItsFor() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Who this is for
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Land-based<br />
              <span className="italic">project owners</span>
            </h2>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>
                If you own or operate a land-based project that wants to become
                a lifestyle-first destination, this is for you. Not theory —
                practical strategy from someone who built this from scratch.
              </p>
              <p>
                We work with RV parks, resorts, campsites, land developers,
                retreat centers, and land-based communities who want to attract
                long-stay guests, generate more revenue, and build real community.
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {[
              "RV parks & campgrounds",
              "Resorts & retreat centers",
              "Land developers & land trusts",
              "Permaculture & intentional communities",
              "Eco-lodges & glamping operations",
              "Rural land & homestead projects",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-center gap-4 py-5"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-amber shrink-0" />
                <span className="text-sm text-white/60">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatWeCover() {
  const topics = [
    {
      icon: ChartLine,
      label: "Revenue uplift & long-stay strategies",
      body: "Move from nightly bookings to week-long and month-long stays. Higher revenue per guest, lower turnover.",
    },
    {
      icon: Compass,
      label: "Site layout & build sequencing",
      body: "Land use planning, accommodation mix (cabins, RV pads, domes, village structures), and how to phase development cost-effectively.",
    },
    {
      icon: Users,
      label: "Cultural design & community-building",
      body: "Seasonal rhythms, village programming, community events, and the social infrastructure that makes people want to stay.",
    },
    {
      icon: Broadcast,
      label: "Village OS & AI workflows",
      body: "Operations systems, communication tools, dashboards, and AI-assisted workflows that reduce friction and improve guest experience.",
    },
    {
      icon: TreeEvergreen,
      label: "Food, wellness & maker infrastructure",
      body: "Community gardens, sauna, coworking, maker spaces — the amenity layer that differentiates lifestyle destinations.",
    },
    {
      icon: Buildings,
      label: "Investor narrative & development roadmap",
      body: "How to tell the story of your project to investors, partners, and the community — and what to build in what order.",
    },
    {
      icon: Money,
      label: "Membership models & partnerships",
      body: "Building recurring revenue through memberships, long-term programs, and strategic promotional partnerships.",
    },
    {
      icon: VideoCamera,
      label: "Marketing & positioning",
      body: "How to tell your story, attract the right guests, and build a brand that stands for something more than a campsite.",
    },
  ];

  return (
    <section id="what-we-cover" className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Topics covered
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            What we<br />
            <span className="italic">work through</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.4 }}
              className="bg-warm-dark p-7"
            >
              <t.icon size={18} weight="light" className="text-amber mb-4" />
              <div className="text-sm font-medium text-white mb-2">{t.label}</div>
              <div className="text-sm leading-relaxed text-white/35">{t.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SessionFormat() {
  const steps = [
    { n: "01", label: "Site introduction", body: "You walk us through your land, project, and what you&apos;re trying to build." },
    { n: "02", label: "Strategic assessment", body: "We identify the highest-leverage opportunities and biggest gaps in your current approach." },
    { n: "03", label: "Practical recommendations", body: "Specific, actionable advice — not generic frameworks. What to build, in what order, for what purpose." },
    { n: "04", label: "Implementation roadmap", body: "A prioritized plan with realistic next steps and cost-effective sequencing." },
    { n: "05", label: "Network connections", body: "Introductions to builders, operators, investors, and communities in the Smart Village network where relevant." },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            How it works
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Session<br />
            <span className="italic">format</span>
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="grid grid-cols-1 gap-4 py-8 lg:grid-cols-[5rem_20rem_1fr]"
            >
              <div className="font-mono text-xs text-amber/60">{step.n}</div>
              <div className="text-base font-medium text-white">{step.label}</div>
              <p
                className="text-sm leading-relaxed text-white/40 max-w-[52ch]"
                dangerouslySetInnerHTML={{ __html: step.body }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Why work with us
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Built, not<br />
              <span className="italic">theorized</span>
            </h2>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>
                We didn&apos;t study villages — we built one. Over five years running
                Wells Gray Resort and designing it into Canada&apos;s first Smart
                Village prototype.
              </p>
              <p>
                10+ years building Future Thinkers, operating an active campsite
                and golf resort, designing infrastructure, hosting community events,
                and developing deep expertise in AI-powered village operations.
              </p>
              <p>
                We developed the Smart Village Standard and Village OS from the ground
                up. What we offer is real operational knowledge, not consulting
                from the sidelines.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "400px" }}>
            <Image
              src="/images/mike-and-euvie-headshot.jpg"
              alt="Mike and Euvie — Portal.Place founders"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BookSession() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Ready to upgrade<br />
              <span className="italic">your land project?</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              $150/hour. No retainer. No commitments beyond the session. Book
              a video call and bring your project — we&apos;ll make it worth your time.
            </p>
            <div className="mt-10">
              <a
                href="https://futurethinkers.org/call60"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                Book a session <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              About the founders <ArrowRight size={13} />
            </Link>
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Investment thesis <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ConsultingPage() {
  return (
    <>
      <Hero />
      <WhoItsFor />
      <WhatWeCover />
      <SessionFormat />
      <WhyUs />
      <BookSession />
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Metadata } from "next";
import {
  ArrowRight,
  Users,
  Heart,
  Wrench,
  TreeEvergreen,
  Star,
  Shield,
  Calendar,
  Campfire,
  Check,
} from "@phosphor-icons/react";

// ── Membership ────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/many_people_sitting_202512032320-1024x576.jpeg"
          alt="Community at Portal.Place"
          fill
          priority
          className="object-cover opacity-[0.08]"
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_42%]">
          {/* Left: headline */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
            >
              Membership
            </motion.p>

            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
              >
                Become
              </motion.h1>
            </div>
            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
              >
                a Founding
              </motion.h1>
            </div>
            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
              >
                Member.
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 max-w-[45ch] text-base leading-relaxed text-white/45"
            >
              Membership is open to anyone — locals near Clearwater, BC, out-of-towners, and early supporters worldwide. Come for the season, or support from afar. Be part of something being built.
            </motion.p>
          </div>

          {/* Right: founding member card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Star size={16} weight="fill" className="text-amber" />
                <span className="text-xs font-medium uppercase tracking-widest text-amber">
                  Founding member status
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/60 mb-8">
                The first wave of members will be recognized as Founding Members —
                a status that will not be available later. Join now and lock in
                founding pricing.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  "Golf access — play the 9-hole course",
                  "Free sauna access on community days",
                  "Member pricing on paid programs (forest school, immersions, etc.)",
                  "Priority access to future programs & events",
                  "Recognition as part of the founding wave",
                  "Early access to private materials & network updates",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-amber" />
                    <span className="text-sm text-white/55">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wellsgrayresort.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
              >
                Buy Now — Become a Member <ArrowRight size={14} weight="bold" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhyMembership() {
  const reasons = [
    {
      n: "01",
      icon: Users,
      label: "Belonging",
      body: "Real relationships and community rhythms — people who share your values and show up in person.",
    },
    {
      n: "02",
      icon: Heart,
      label: "Health & wellness",
      body: "Nature, daily movement, simplicity. A lifestyle that regulates your nervous system rather than wrecking it.",
    },
    {
      n: "03",
      icon: Wrench,
      label: "Creativity & learning",
      body: "Workshops, skills, shared projects. A maker culture where you build things with your hands alongside others.",
    },
    {
      n: "04",
      icon: TreeEvergreen,
      label: "Seasonal living",
      body: "A reason to return, year after year. Village rhythms that mark the seasons with meaning.",
    },
    {
      n: "05",
      icon: Campfire,
      label: "Purpose",
      body: "Contributing meaningfully to something being built. Being part of the early story.",
    },
    {
      n: "06",
      icon: Shield,
      label: "Resilience",
      body: "A lifestyle less dependent on urban systems — a real alternative, not just a retreat.",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Why become a member
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            What you&apos;re really<br />
            <span className="italic">looking for</span>
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {reasons.map((r, i) => (
            <motion.div
              key={r.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="grid grid-cols-[3rem_1fr] items-start gap-8 py-7 lg:grid-cols-[5rem_14rem_1fr]"
            >
              <span className="font-mono text-xs text-white/20 pt-0.5">{r.n}</span>
              <div className="flex items-center gap-4 col-span-1">
                <r.icon size={15} weight="light" className="text-amber shrink-0" />
                <span className="text-sm font-medium text-white">{r.label}</span>
              </div>
              <p className="hidden text-sm leading-relaxed text-white/40 max-w-[55ch] lg:block">
                {r.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatYouGet() {
  const benefits = [
    {
      title: "Golf access",
      body: "Members can play the 9-hole golf course at Wells Gray Village — a beautiful course winding through the trees.",
    },
    {
      title: "Free sauna on community days",
      body: "Members get complimentary access to the wood-fired barrel sauna by the creek on scheduled community days.",
    },
    {
      title: "Member pricing on paid programs",
      body: "Discounts on forest school, immersions, workshops, and seasonal programs. The more you participate, the more you save.",
    },
    {
      title: "Priority access to programs & stays",
      body: "Members get first pick on seasonal residencies, immersions, workshops, and events before they open to the public.",
    },
    {
      title: "Access to Wells Gray Village & future network",
      body: "Stay at the flagship seasonal village near Clearwater, BC and, as the network grows, access future locations.",
    },
    {
      title: "Community connections",
      body: "A growing network of builders, families, entrepreneurs, and thinkers who are building this together.",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[40%_1fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              What members receive
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              What&apos;s<br />
              <span className="italic">included</span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/40 max-w-[38ch]">
              Membership is annual. The entry tier is open to everyone — buy instantly with no review process. Higher tiers are available for deeper involvement.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="bg-warm-dark p-8">
                <div className="text-sm font-medium text-white mb-3">{b.title}</div>
                <div className="text-sm leading-relaxed text-white/40">{b.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoItsFor() {
  const profiles = [
    "Founders, technologists & remote workers",
    "Families seeking healthier seasonal rhythms",
    "Artists, facilitators & creators",
    "Builders & hands-on problem-solvers",
    "Snowbirds wanting a meaningful seasonal home base",
    "Regenerative thinkers & designers",
    "Values-aligned investors hedging against uncertainty",
    "Anyone inspired by nature, community, and culture",
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              Who this is for
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Is this<br />
              <span className="italic">you?</span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/40 max-w-[42ch]">
              If the vision spoke directly to you — you likely belong here.
              Membership is a fit for people who want to participate, not
              just spectate.
            </p>
          </div>

          {/* Right: profile list */}
          <div className="divide-y divide-white/10 border-y border-white/10">
            {profiles.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 120, damping: 22 }}
                className="flex items-center gap-4 py-4"
              >
                <span className="font-mono text-xs text-white/20 w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-white/65">{p}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "1", label: "Buy Now", body: "Choose your membership tier and purchase instantly — no application or call required for the entry tier." },
    { n: "2", label: "Welcome", body: "Receive your welcome email with access details, the member calendar, and what's coming." },
    { n: "3", label: "Show Up", body: "Visit Wells Gray Village, join community days, use your golf and sauna benefits." },
    { n: "4", label: "Participate", body: "Join gatherings, programs, and seasonal events at member pricing." },
    { n: "5", label: "Go Deeper", body: "Early invitations to immersions, residencies, and higher-tier membership options." },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            The process
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            How membership<br />
            <span className="italic">works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="bg-warm-dark p-8">
              <div className="font-mono text-3xl font-light text-white/15 mb-6">{s.n}</div>
              <div className="text-sm font-medium text-white mb-3">{s.label}</div>
              <div className="text-sm leading-relaxed text-white/40">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Apply() {
  return (
    <section id="apply" className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_42%]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              This is your<br />
              <span className="italic">invitation.</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              If you&apos;re drawn to seasonal village life — to nature, meaningful connection, hands-on skills, and a more resilient way of living — membership is the doorway. Open to builders, families, entrepreneurs, and anyone who cares about community.
            </p>
            <p className="mt-4 max-w-[45ch] text-base leading-relaxed text-white/75">
              Be part of it from the beginning.
            </p>
          </div>

          {/* Buy Now */}
          <div className="rounded-2xl bg-white/10 p-8 lg:p-10 flex flex-col justify-center">
            <h3 className="text-lg font-medium text-white mb-4">Founding Membership</h3>
            <p className="text-sm leading-relaxed text-white/60 mb-8">
              The entry tier is publicly available — no application, no review call. Buy now and become a Founding Member. Higher tiers with deeper involvement are available — reach out directly.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Golf access",
                "Free sauna on community days",
                "Member pricing on programs",
                "Priority program access",
                "Founding Member recognition",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-amber" />
                  <span className="text-sm text-white/55">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://wellsgrayresort.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              Buy Now — Become a Member <ArrowRight size={14} weight="bold" />
            </a>
            <p className="text-center text-xs text-white/40 mt-4">
              Open to locals near Clearwater, out-of-towners, and early supporters everywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MembershipPage() {
  return (
    <>
      <Hero />
      <WhyMembership />
      <WhatYouGet />
      <WhoItsFor />
      <HowItWorks />
      <Apply />
    </>
  );
}

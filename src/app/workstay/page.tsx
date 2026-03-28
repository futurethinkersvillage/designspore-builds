"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Wrench,
  Monitor,
  Camera,
  Users,
  Leaf,
  House,
  ArrowUpRight,
  CalendarBlank,
  CheckCircle,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/wells-gray-golf-rv-06-1024x685.jpg"
          alt="Work-Stay at Wells Gray Village"
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
            Wells Gray Village — 2026 Cohort
          </motion.p>

          <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Build the village.
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              Live it too.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            A project-based work-stay for builders, makers, and contributors.
            Come for a few weeks, or stay for the full season. Bring your skills,
            trade them for accommodation on 400 acres in Interior BC near Clearwater.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Apply for 2026 <ArrowRight size={14} weight="bold" />
            </a>
            <a
              href="#roles"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              See open roles <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {[
              { value: "May 1", unit: "", label: "2026 start" },
              { value: "2–5", unit: "mo", label: "Flexible duration" },
              { value: "6", unit: "roles", label: "Open positions" },
              { value: "400", unit: "ac", label: "Private land" },
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
              The arrangement
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Skilled work<br />
              <span className="italic">traded for land</span>
            </h2>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>
                The 2026 Work-Stay is for people who want to be part of building
                something real — not just passing through. Whether you can come for
                a few weeks or the full season, there&apos;s a place for you here.
              </p>
              <p>
                You bring a specific skillset. We put it to work building and running
                Wells Gray Village near Clearwater, BC. In return, you stay on 400 acres of
                mountain land in Interior BC — no rent required.
              </p>
              <p>
                It&apos;s project-based: show up, contribute, and be part of a living community.
                Outstanding contributors may be invited into paid roles or deeper
                involvement as the village grows.
              </p>
            </div>
          </div>

          <div className="space-y-0 divide-y divide-white/10 border-y border-white/10">
            {[
              {
                label: "What you get",
                items: [
                  "Free RV site for your stay (power, water, sani)",
                  "Full village amenity access",
                  "Community participation",
                  "Hands-on village-building experience",
                  "Real portfolio work",
                  "Possibility of paid role for outstanding contributors",
                ],
              },
              {
                label: "What you bring",
                items: [
                  "Your own RV",
                  "Ability to cook your own food",
                  "A specific skill (see roles below)",
                  "A few weeks minimum — full season welcome",
                  "Builder mindset",
                ],
              },
            ].map((group) => (
              <div key={group.label} className="py-8">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-5">
                  {group.label}
                </div>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/50">
                      <CheckCircle size={14} weight="light" className="text-amber mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Roles() {
  const roles = [
    {
      icon: House,
      n: "01",
      label: "Village Operations & Guest Experience",
      body: "Check-ins, guest support, cleaning, and day-to-day admin. The backbone of a welcoming, well-run village.",
    },
    {
      icon: Leaf,
      n: "02",
      label: "Land, Grounds & Maintenance",
      body: "Firepits, signage, facilities, repairs, mowing, and trails. Keep 400 acres looking and functioning well.",
    },
    {
      icon: Wrench,
      n: "03",
      label: "Builder / Maker / Fabrication Lead",
      body: "Building cabins, domes, platforms, and CNC/makerspace projects. For hands-on builders and fabricators.",
    },
    {
      icon: Monitor,
      n: "04",
      label: "Tech & Village AI Systems",
      body: "Internet infrastructure, sensors, communications, dashboards, and AI-assisted workflows. The village OS.",
    },
    {
      icon: Camera,
      n: "05",
      label: "Media, Story & Events Producer",
      body: "Filming, photography, content creation, and event documentation. Tell the village story.",
    },
    {
      icon: Users,
      n: "06",
      label: "Community & Culture Weaver",
      body: "Hosting events, facilitating community connection, and maintaining the social fabric of village life.",
    },
  ];

  return (
    <section id="roles" className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Open positions
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            2026<br />
            <span className="italic">cohort roles</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, i) => (
            <motion.div
              key={role.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.07, duration: 0.4 }}
              className="bg-warm-dark p-7"
            >
              <div className="flex items-center gap-3 mb-4">
                <role.icon size={18} weight="light" className="text-amber" />
                <span className="font-mono text-xs text-amber/50">{role.n}</span>
              </div>
              <div className="text-sm font-medium text-white mb-2">{role.label}</div>
              <div className="text-sm leading-relaxed text-white/35">{role.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            2026 season
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Season<br />
            <span className="italic">timeline</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              date: "Now",
              label: "Applications open",
              body: "Submit your application. Tell us your background, your skill, and why you want to build this.",
            },
            {
              date: "Winter 2026",
              label: "Cohort selection",
              body: "We review applications and select the 2026 cohort. Selected applicants are notified and onboarded.",
            },
            {
              date: "May 1, 2026",
              label: "Season begins",
              body: "Arrive on site. Set up your RV, get oriented, and begin your role in the village.",
            },
            {
              date: "Sep 30, 2026",
              label: "Season closes",
              body: "The 2026 season ends. Top contributors may be invited into paid roles for 2027.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-[#0F0E12] p-7"
            >
              <div className="flex items-center gap-2 mb-4">
                <CalendarBlank size={14} className="text-amber" weight="light" />
                <span className="text-xs font-mono text-amber">{step.date}</span>
              </div>
              <div className="text-sm font-medium text-white mb-2">{step.label}</div>
              <div className="text-sm leading-relaxed text-white/35">{step.body}</div>
            </motion.div>
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
              Come and<br />
              <span className="italic">build with us.</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              Tell us who you are, what you build, and when you can come.
              A few weeks or a full season — we&apos;re looking for people who
              want to be part of something real.
            </p>
            <div className="mt-10">
              <a
                href="https://wellsgrayresort.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                Apply now <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>

            <div className="mt-12 space-y-3">
              {[
                "Must have your own RV",
                "A few weeks minimum — full season (May 1–Sep 30) welcome",
                "All skill levels welcome — we value attitude over résumé",
              ].map((note) => (
                <div key={note} className="flex items-start gap-2 text-sm text-white/60">
                  <CheckCircle size={14} weight="light" className="mt-0.5 shrink-0 text-white/40" />
                  {note}
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "320px" }}>
            <Image
              src="/images/a_person_filming_202512032314-1024x576.jpeg"
              alt="Village work at Wells Gray"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WorkstayPage() {
  return (
    <>
      <Hero />
      <WhatItIs />
      <Roles />
      <Timeline />
      <Apply />
    </>
  );
}

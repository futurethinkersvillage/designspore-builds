"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Tree,
  Waves,
  ArrowUpRight,
  Sun,
  Wrench,
  Briefcase,
  Campfire,
  Golf,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/gazebo-interior-campfire-1024x771.jpg"
          alt="Village Rhythm at Wells Gray Village"
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
            Wells Gray Village — Sundays, May 1 – Sep 30
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Village
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              Rhythm.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            A recurring Sunday gathering open to guests, locals, and members.
            Forest school for the kids. Wood-fired sauna for you. Builders Club,
            campfire, and golf to round out the day.
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
              Book your visit <ArrowUpRight size={14} weight="bold" />
            </a>
            <a
              href="#schedule"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              See the schedule <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Schedule() {
  const events = [
    {
      label: "Forest School",
      icon: Tree,
      time: "Morning",
      body: "A drop-off outdoor program for kids — nature play, seasonal crafts, stories, and free exploration in the forest.",
      ages: "Ages 4–10",
    },
    {
      label: "Builders Club",
      icon: Wrench,
      time: "Morning / Afternoon",
      body: "An informal gathering for hands-on people — makers, builders, and anyone working on projects at the village.",
      ages: null,
    },
    {
      label: "Business & Resilience Meetup",
      icon: Briefcase,
      time: "Afternoon",
      body: "A meetup for local business owners and people investing in community resilience — connection, ideas, and collaboration.",
      ages: null,
    },
    {
      label: "Community Sauna",
      icon: Waves,
      time: "Afternoon",
      body: "Wood-fired barrel sauna by the creek with a natural cold plunge. Open to guests and locals.",
      ages: null,
    },
    {
      label: "Golf & Disc Golf",
      icon: Golf,
      time: "All day",
      body: "Our 9-hole golf course and 18-hole disc golf course are open all day as a drop-in on Village Days.",
      ages: null,
    },
    {
      label: "Campfire",
      icon: Campfire,
      time: "Evening",
      body: "Community campfire to end the day. Come for one part or stay all day.",
      ages: null,
    },
  ];

  return (
    <section id="schedule" className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Sundays, May 1 – Sep 30
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            The village<br />
            <span className="italic">rhythm</span>
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {events.map((ev, i) => (
            <motion.div
              key={ev.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group grid grid-cols-1 gap-6 py-8 lg:grid-cols-[16rem_10rem_1fr] lg:items-start"
            >
              <div className="flex items-center gap-3">
                <ev.icon size={16} weight="light" className="text-amber shrink-0" />
                <div className="text-base font-medium text-white">{ev.label}</div>
              </div>
              <div>
                <div className="font-mono text-xs text-amber/60">{ev.time}</div>
                {ev.ages && <div className="text-xs text-white/30 mt-1">{ev.ages}</div>}
              </div>
              <p className="text-sm leading-relaxed text-white/40 max-w-[52ch]">{ev.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-amber/30 bg-amber/5 px-8 py-7">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-3">
            Sample Village Day
          </p>
          <p className="text-base font-medium text-white">
            Forest School · Builders Club · Business Meetup · Community Sauna · Golf · Campfire
          </p>
          <p className="mt-2 text-sm text-white/40">Come for one part or stay for all of it.</p>
        </div>
      </div>
    </section>
  );
}

function MakeADay() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Come for one part.<br />
              <span className="italic">Stay for all of it.</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              Golf in the morning, forest school for the kids, sauna by the creek,
              campfire in the evening. That&apos;s a village day.
            </p>
          </div>

          <div className="flex flex-col justify-end gap-4">
            <a
              href="https://wellsgrayresort.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98] whitespace-nowrap"
            >
              Book your visit <ArrowUpRight size={14} weight="bold" />
            </a>
            <Link
              href="/immersion"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/10 whitespace-nowrap"
            >
              Explore the month-long immersion <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RhythmPage() {
  return (
    <>
      <Hero />
      <Schedule />
      <MakeADay />
    </>
  );
}

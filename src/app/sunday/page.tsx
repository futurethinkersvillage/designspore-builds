"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Tree,
  Flame,
  Golf,
  Waves,
  Clock,
  ArrowUpRight,
  Sun,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/gazebo-interior-campfire-1024x771.jpg"
          alt="Sunday Community Day at Wells Gray Village"
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
            Wells Gray Village — Village Rhythm
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
            Forest school for the kids. Wood-fired sauna for you. Campfire to end
            the day. We&apos;re testing a regular village rhythm — a recurring community gathering open to locals, guests, and curious visitors. Days may vary.
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
              Sign up <ArrowUpRight size={14} weight="bold" />
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

      {/* Stat strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {[
              { value: "Regular", unit: "", label: "Village rhythm" },
              { value: "$249", unit: "/6wks", label: "Forest school" },
              { value: "$10", unit: "/person", label: "Sauna session" },
              { value: "Free", unit: "", label: "Campfire" },
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

function Schedule() {
  const events = [
    {
      time: "All day",
      label: "Golf",
      icon: Golf,
      price: "$30/round",
      body: "Come early and make a full day of it. 9-hole scenic course winding through the trees. Carts available at extra cost.",
      cta: "Book a tee time",
      href: "https://wellsgrayresort.ca",
    },
    {
      time: "Afternoon",
      label: "Forest School",
      icon: Tree,
      price: "$249 / 6 weeks",
      body: "A 6-week pilot program for ages 4–10. Drop-off outdoor learning with nature play, seasonal activities, stories, games, and free exploration. Small mixed-age group.",
      cta: "Sign up for forest school",
      href: "https://wellsgrayresort.ca",
    },
    {
      time: "Late afternoon",
      label: "Community Sauna",
      icon: Waves,
      price: "$10 / person",
      body: "Wood-fired barrel sauna by the creek with a natural cold plunge. Open to locals and guests. Kids under 12 are free. Reserve your spot in advance.",
      cta: "Reserve a sauna spot",
      href: "https://wellsgrayresort.ca",
    },
    {
      time: "Evening",
      label: "Campfire",
      icon: Flame,
      price: "Free",
      body: "An optional all-ages campfire after sauna. S'mores kits, cold drinks, simple snacks. No signup needed — just show up. Subject to fire ban conditions.",
      cta: "No signup needed",
      href: null,
    },
  ];

  return (
    <section id="schedule" className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            What&apos;s happening
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
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group grid grid-cols-1 gap-6 py-10 lg:grid-cols-[10rem_18rem_1fr_auto] lg:items-start"
            >
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber/60" weight="light" />
                <span className="text-xs font-mono text-amber/60">{ev.time}</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <ev.icon size={16} weight="light" className="text-amber" />
                  <div className="text-base font-medium text-white">{ev.label}</div>
                </div>
                <div className="font-mono text-sm text-amber/80">{ev.price}</div>
              </div>
              <p className="text-sm leading-relaxed text-white/40 max-w-[52ch]">{ev.body}</p>
              {ev.href ? (
                <a
                  href={ev.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white/40 transition-all hover:text-amber hover:gap-3"
                >
                  {ev.cta} <ArrowRight size={13} />
                </a>
              ) : (
                <span className="text-sm text-white/25 shrink-0">{ev.cta}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForestSchoolDetail() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_42%]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              6-week pilot
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Forest school<br />
              <span className="italic">for ages 4–10</span>
            </h2>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>
                A simple drop-off outdoor program running on community gathering days.
                Nature play, seasonal activities, stories, games, crafts, and free
                exploration in the forest.
              </p>
              <p>
                Small mixed-age group. No screens, no structured classrooms — just
                the forest and a good facilitator.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div>
                <div className="font-mono text-3xl text-white">$249</div>
                <div className="text-xs text-white/30 uppercase tracking-wider mt-1">Per child / 6 weeks</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="font-mono text-3xl text-white">6</div>
                <div className="text-xs text-white/30 uppercase tracking-wider mt-1">Week pilot</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="font-mono text-3xl text-white">4–10</div>
                <div className="text-xs text-white/30 uppercase tracking-wider mt-1">Ages</div>
              </div>
            </div>
            <div className="mt-10">
              <a
                href="https://wellsgrayresort.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
              >
                Sign up for forest school <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "400px" }}>
            <Image
              src="/images/remove_the_reserved_202512032320-1024x576.jpeg"
              alt="Village grounds at Wells Gray"
              fill
              className="object-cover"
            />
          </div>
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
              Golf in the morning, forest school for the kids in the afternoon,
              sauna by the creek, campfire in the evening. That&apos;s a village day.
            </p>
          </div>

          <div className="flex flex-col justify-end gap-4">
            <a
              href="https://wellsgrayresort.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98] whitespace-nowrap"
            >
              Sign up for forest school <ArrowUpRight size={14} weight="bold" />
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

export default function SundayPage() {
  return (
    <>
      <Hero />
      <Schedule />
      <ForestSchoolDetail />
      <MakeADay />
    </>
  );
}

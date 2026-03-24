"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Tent,
  TreeEvergreen,
  Star,
  Buildings,
  Waves,
  ArrowUpRight,
  CheckCircle,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/many_people_sitting_202512032320-1024x576.jpeg"
          alt="Host an event at Wells Gray Village"
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
            Wells Gray Village — Events & Retreats
          </motion.p>

          <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Bring your vision
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              to the village.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            400 acres in Interior BC. A 120-person gazebo, private lake, forest
            trails, sauna, and camping grounds. Host a retreat, workshop,
            gathering, or multi-day event in a setting unlike anywhere else.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#inquire"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Submit an inquiry <ArrowRight size={14} weight="bold" />
            </a>
            <a
              href="#event-types"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              What you can host <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {[
              { value: "120", unit: "cap", label: "Main gazebo" },
              { value: "400", unit: "ac", label: "Total land" },
              { value: "1", unit: "lake", label: "Private" },
              { value: "5+", unit: "yrs", label: "Hosting events" },
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

function EventTypes() {
  const types = [
    {
      icon: Users,
      label: "Retreats & Workshops",
      body: "Wellness retreats, creative residencies, leadership intensives, skill-building workshops. The forest and sauna do half the work.",
    },
    {
      icon: Star,
      label: "Meetups & Gatherings",
      body: "Community circles, coworking intensives, interest-based group gatherings. From 10 people to 120.",
    },
    {
      icon: TreeEvergreen,
      label: "Workstay & Residency Programs",
      body: "Hands-on learning experiences, community contribution cohorts, maker culture programs. Multi-week residential formats.",
    },
    {
      icon: Buildings,
      label: "Festivals & Multi-Day Events",
      body: "Cultural gatherings, artistic events, nature-based festivals, and experimental multi-day experiences.",
    },
    {
      icon: Tent,
      label: "Corporate Off-Sites",
      body: "Take your team out of the boardroom. Strategy sessions, team-building, and the kind of conversations that only happen in the forest.",
    },
    {
      icon: Waves,
      label: "Wellness & Nature Programs",
      body: "Sauna ceremonies, cold plunge programs, forest bathing, and nature-based wellness immersions.",
    },
  ];

  return (
    <section id="event-types" className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            What you can host
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Events for<br />
            <span className="italic">every vision</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.07, duration: 0.4 }}
              className="bg-[#0F0E12] p-7"
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

function Spaces() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_42%]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              The spaces
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              What&apos;s<br />
              <span className="italic">available</span>
            </h2>

            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {[
                { label: "120-person events gazebo", detail: "Main gathering hub" },
                { label: "Smaller gazebos & covered spaces", detail: "Breakouts, workshops" },
                { label: "Tenting field & camping grounds", detail: "Overnight guests" },
                { label: "Private lake area", detail: "Swimming, paddling, reflection" },
                { label: "Wood-fired barrel sauna", detail: "With cold plunge" },
                { label: "Golf & disc golf course", detail: "Team activities" },
                { label: "Horse corrals", detail: "For equestrian events" },
                { label: "Entire site rental", detail: "Large private events" },
              ].map((space, i) => (
                <motion.div
                  key={space.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="flex items-center justify-between py-5"
                >
                  <div className="text-sm font-medium text-white">{space.label}</div>
                  <div className="text-xs text-white/30">{space.detail}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-xl" style={{ minHeight: "280px" }}>
              <Image
                src="/images/gazebo-interior-campfire-1024x771.jpg"
                alt="120-person events gazebo"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden rounded-xl" style={{ minHeight: "200px" }}>
              <Image
                src="/images/76747423_10163561173205725_3017674924459294720_n-1024x577.jpg"
                alt="Wells Gray Village landscape"
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

function Process() {
  const steps = [
    {
      n: "01",
      label: "Submit an inquiry",
      body: "Tell us about your event — dates, attendance, format, and what you need from the space.",
    },
    {
      n: "02",
      label: "We reach out",
      body: "Our team reviews your inquiry and schedules a conversation to explore logistics and fit.",
    },
    {
      n: "03",
      label: "Plan together",
      body: "We work through dates, support, setup, and how to make your event work in the village context.",
    },
    {
      n: "04",
      label: "Co-create the experience",
      body: "You bring the vision. We provide the space, the infrastructure, and the village community around it.",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            How it works
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            The<br />
            <span className="italic">process</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-[#0F0E12] p-7"
            >
              <div className="font-mono text-xs text-amber/60 mb-4">{step.n}</div>
              <div className="text-sm font-medium text-white mb-2">{step.label}</div>
              <div className="text-sm leading-relaxed text-white/35">{step.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Inquire() {
  return (
    <section id="inquire" className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_42%]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Let&apos;s make<br />
              <span className="italic">it happen.</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              Tell us about your event. We&apos;ll respond within a few days to
              discuss logistics and see if we&apos;re a good fit.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wellsgrayresort.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                Submit an inquiry <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>

            <div className="mt-12 space-y-3">
              {[
                "Retreats from 10–120 people",
                "Multi-day and week-long formats welcome",
                "Full site rental available for large events",
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
              src="/images/remove_the_reserved_202512032320-1024x576.jpeg"
              alt="Wells Gray Village gathering space"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HostPage() {
  return (
    <>
      <Hero />
      <EventTypes />
      <Spaces />
      <Process />
      <Inquire />
    </>
  );
}

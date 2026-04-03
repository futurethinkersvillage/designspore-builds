"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Campfire,
  TreeEvergreen,
  Star,
  CheckCircle,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/gazebo-interior-campfire-1024x771.jpg"
          alt="Host an event at Portal.Place"
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
            Portal.Place — Host
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Host an Event, Retreat,
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              or Program
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg font-medium text-white/70"
          >
            Bring your vision to life in a Smart Village setting.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-[52ch] text-base leading-relaxed text-white/55"
          >
            Our network is designed for creators, facilitators, and community
            builders hosting meaningful experiences — whether it&apos;s a workshop,
            retreat, meetup, workstay program, residency, or full-scale festival.
            We align with values of regeneration, creativity, wellness, culture,
            and community connection.
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
              href="#what-you-can-host"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              What you can host <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhatYouCanHost() {
  const items = [
    {
      icon: Users,
      label: "Retreats & Workshops",
      body: "Wellness, creativity, leadership, skill-building.",
    },
    {
      icon: Star,
      label: "Meetups & Gatherings",
      body: "Community circles, coworking intensives, interest-based groups.",
    },
    {
      icon: TreeEvergreen,
      label: "Workstay or Residency Programs",
      body: "Hands-on learning, community contribution, maker culture.",
    },
    {
      icon: Campfire,
      label: "Festivals & Multi-Day Events",
      body: "Cultural, artistic, nature-based, experimental experiences.",
    },
  ];

  return (
    <section id="what-you-can-host" className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            What you can host
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Meaningful<br />
            <span className="italic">experiences</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
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

function WhatToExpect() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            What to expect
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-8">
            The<br />
            <span className="italic">process</span>
          </h2>
          <p className="text-base leading-relaxed text-white/55 max-w-[50ch]">
            Our team reviews every application. If your event is aligned with the
            village values and community, we&apos;ll reach out to discuss logistics,
            dates, space requirements, and how we can support your vision together.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-3">
          {[
            { n: "01", label: "You submit an inquiry", body: "Tell us about your event, your audience, and what you need." },
            { n: "02", label: "We review & reach out", body: "If aligned, we schedule a conversation to explore fit and logistics." },
            { n: "03", label: "We plan together", body: "Dates, space, support, accommodation — we work through the details together." },
          ].map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-warm-dark p-7"
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

function InquiryForm() {
  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-amber focus:outline-none";
  const labelClass = "block text-sm font-medium text-white/70 mb-2";

  return (
    <section id="inquire" className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16 max-w-2xl">
          <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
            Host<br />
            <span className="italic">inquiry.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/75 max-w-[50ch]">
            Tell us about your event. Fill out the form below and we&apos;ll be
            in touch if there&apos;s a fit.
          </p>
        </div>

        <form action="#" className="max-w-3xl space-y-8">
          {/* Contact info */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Name</label>
              <input type="text" name="name" required placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" required placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>
                Company / Organization <span className="text-white/30">(optional)</span>
              </label>
              <input type="text" name="company" placeholder="Your org" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Website / Social Link <span className="text-white/30">(optional)</span>
            </label>
            <input type="url" name="website" placeholder="https://" className={inputClass} />
          </div>

          {/* Event type */}
          <div>
            <label className={labelClass}>Event Type</label>
            <select name="event_type" required className={inputClass + " appearance-none"}>
              <option value="" className="bg-warm-dark">Select event type...</option>
              <option value="private" className="bg-warm-dark">Private event</option>
              <option value="cultural" className="bg-warm-dark">Cultural / community event</option>
              <option value="partnership" className="bg-warm-dark">Partnership</option>
            </select>
          </div>

          {/* Event details */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Event Name</label>
              <input type="text" name="event_name" required placeholder="What is this event called?" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Preferred Dates</label>
              <input type="text" name="dates" placeholder="e.g. July 15-20, 2026" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Short Description</label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="Describe your event — format, goals, audience..."
              className={inputClass + " resize-y"}
            />
          </div>

          <div>
            <label className={labelClass}>Estimated Attendance</label>
            <input type="text" name="attendance" placeholder="e.g. 30-50 people" className={inputClass + " max-w-sm"} />
          </div>

          {/* Space requirements */}
          <fieldset>
            <legend className={labelClass}>Space Requirements</legend>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "120-person gazebo",
                "Smaller gazebos",
                "Tenting field",
                "Sauna",
                "Horse corrals",
                "Golf / disc golf",
                "Entire site rental",
                "Other",
              ].map((space) => (
                <label key={space} className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
                  <input
                    type="checkbox"
                    name="spaces"
                    value={space.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-amber focus:ring-amber accent-amber"
                  />
                  {space}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Additional details */}
          <div>
            <label className={labelClass}>Overnight Accommodation Options</label>
            <textarea
              name="accommodation"
              rows={3}
              placeholder="Describe overnight needs — tenting, RV, glamping, nearby lodging..."
              className={inputClass + " resize-y"}
            />
          </div>

          <div>
            <label className={labelClass}>Collaboration / Revenue Sharing Details</label>
            <textarea
              name="collaboration"
              rows={3}
              placeholder="For cultural events — describe potential collaboration or revenue sharing arrangements..."
              className={inputClass + " resize-y"}
            />
          </div>

          <div>
            <label className={labelClass}>Additional Logistics Notes</label>
            <textarea
              name="logistics"
              rows={3}
              placeholder="Power, AV, catering, accessibility, or anything else we should know..."
              className={inputClass + " resize-y"}
            />
          </div>

          {/* Confirmation */}
          <label className="flex items-start gap-3 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              name="confirm"
              required
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-amber focus:ring-amber accent-amber"
            />
            <span>
              I understand this is an inquiry, not a confirmed booking.
            </span>
          </label>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              Submit Inquiry <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function HostPage() {
  return (
    <>
      <Hero />
      <WhatYouCanHost />
      <WhatToExpect />
      <InquiryForm />
    </>
  );
}

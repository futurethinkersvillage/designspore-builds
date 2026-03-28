"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  WhatsappLogo,
  EnvelopeSimple,
  MicrophoneStage,
  Buildings,
  ArrowUpRight,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[60dvh] bg-warm-dark flex items-end">
      <div className="absolute inset-0">
        <Image
          src="/images/mike-and-euvie-headshot.jpg"
          alt="Mike Gilliland — Portal.Place"
          fill
          priority
          className="object-cover opacity-20 object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/70 to-warm-dark/30" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
          >
            Portal.Place — Get in touch
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Talk to Mike
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              directly.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[44ch] text-base leading-relaxed text-white/55"
          >
            WhatsApp or email — no forms, no ticket systems. If you have a real
            question about the village, a partnership, or an idea, just reach out.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function ContactMethods() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              How to reach us
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Direct<br />
              <span className="italic">contact</span>
            </h2>
            <div className="mt-8 text-sm leading-relaxed text-white/45 max-w-[40ch]">
              <p>
                Mike responds to WhatsApp and email. For bookings and reservations,
                use the Wells Gray Resort website directly.
              </p>
            </div>
          </div>

          <div className="space-y-0 divide-y divide-white/10 border-y border-white/10">
            {[
              {
                icon: WhatsappLogo,
                label: "WhatsApp",
                detail: "Fastest response",
                action: "Message on WhatsApp",
                href: "https://wa.me/17788818088",
                external: true,
              },
              {
                icon: EnvelopeSimple,
                label: "Email",
                detail: "mike@portal.place",
                action: "Send an email",
                href: "mailto:mike@portal.place",
                external: true,
              },
              {
                icon: MicrophoneStage,
                label: "Book a call",
                detail: "60-minute video call",
                action: "Schedule via Calendly",
                href: "https://futurethinkers.org/call60",
                external: true,
              },
              {
                icon: Buildings,
                label: "Reservations",
                detail: "Wells Gray Resort",
                action: "Book at wellsgrayresort.ca",
                href: "https://wellsgrayresort.ca",
                external: true,
              },
            ].map((method, i) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex items-center justify-between py-6"
              >
                <div className="flex items-center gap-4">
                  <method.icon size={18} weight="light" className="text-amber shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">{method.label}</div>
                    <div className="text-xs text-white/30 mt-0.5">{method.detail}</div>
                  </div>
                </div>
                <a
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/40 transition-all hover:text-amber hover:gap-3"
                >
                  {method.action} <ArrowUpRight size={13} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatToAskAbout() {
  const topics = [
    {
      label: "Village stays & bookings",
      href: "/village",
      sub: "RV sites, glamping, events",
    },
    {
      label: "Month-long immersion",
      href: "/immersion",
      sub: "Family residency package",
    },
    {
      label: "Work-stay applications",
      href: "/workstay",
      sub: "2026 cohort",
    },
    {
      label: "Membership",
      href: "/membership",
      sub: "Founding member access",
    },
    {
      label: "Investment & partnerships",
      href: "/partner",
      sub: "Village network",
    },
    {
      label: "Smart Village consulting",
      href: "/consulting",
      sub: "$150/hr advisory",
    },
    {
      label: "Host an event",
      href: "/host",
      sub: "Retreats & gatherings",
    },
    {
      label: "Media & press",
      href: "/media-kit",
      sub: "Interviews, brand assets",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Or browse
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            What are you<br />
            <span className="italic">interested in?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.4 }}
            >
              <Link
                href={topic.href}
                className="group block bg-warm-dark p-7 transition-colors hover:bg-white/5"
              >
                <div className="text-sm font-medium text-white mb-1 group-hover:text-amber transition-colors">
                  {topic.label}
                </div>
                <div className="text-xs text-white/30">{topic.sub}</div>
                <div className="mt-4 flex items-center gap-1 text-xs text-white/20 group-hover:text-amber/60 transition-all group-hover:gap-2">
                  Learn more <ArrowRight size={11} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <Hero />
      <ContactMethods />
      <WhatToAskAbout />
    </>
  );
}

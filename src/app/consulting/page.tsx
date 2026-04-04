"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PhotoGrid from "@/components/ui/PhotoGrid";
import {
  ArrowRight,
  ArrowUpRight,
  ChartLineUp,
  Compass,
  Users,
  Broadcast,
  TreeEvergreen,
  Buildings,
  VideoCamera,
  Megaphone,
  HandCoins,
  CalendarBlank,
  House,
  Campfire,
  Mountains,
  MapPin,
  Leaf,
  Handshake,
  Lightning,
  Check,
  Play,
  File,
} from "@phosphor-icons/react";

/* ─────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/106547744_10165033448205725_3967614752782880468_n-1024x1024.jpg"
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
            Consulting &amp; Advisory
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Smart Village
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              Consulting &amp; Advisory
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[56ch] text-lg leading-relaxed text-white/70"
          >
            Upgrade your land project into a revenue-generating, community-centered,
            tech-enabled village destination — with expert guidance.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-[56ch] text-sm leading-relaxed text-white/45"
          >
            For RV parks, resorts, campsites, land developers, retreat centers, and
            land-based communities that want to become lifestyle-first destinations —
            culturally, operationally, and technologically.
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
              Book a Session <ArrowUpRight size={14} weight="bold" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WHY WORK WITH US
   ───────────────────────────────────────────── */

function WhyWorkWithUs() {
  const gaps = [
    "A strong community and culture layer",
    "Seasonal programming and repeat visitation",
    "Long-stay accommodations and clear messaging",
    "Village-level infrastructure and operations frameworks",
    "Modern storytelling and marketing",
    "Templates and best practices for scaling",
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              The gap
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Why Work<br />
              <span className="italic">With Us</span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              What most projects lack:
            </p>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {gaps.map((item, i) => (
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

/* ─────────────────────────────────────────────
   WHAT WE HELP YOU BUILD
   ───────────────────────────────────────────── */

function WhatWeHelpYouBuild() {
  const areas = [
    {
      icon: ChartLineUp,
      label: "Revenue uplift & long-stay strategies",
    },
    {
      icon: Compass,
      label: "Site layout, land use planning & build sequencing",
    },
    {
      icon: House,
      label: "Accommodation mix",
    },
    {
      icon: Users,
      label: "Cultural design, seasonal rhythms & community-building",
    },
    {
      icon: Broadcast,
      label: "Village OS — operations, communication & AI-assisted workflows",
    },
    {
      icon: TreeEvergreen,
      label: "Food, wellness & maker infrastructure",
    },
    {
      icon: Megaphone,
      label: "Marketing, storytelling & positioning",
    },
    {
      icon: HandCoins,
      label: "Membership models & promotional partnerships",
    },
    {
      icon: CalendarBlank,
      label: "Events, retreats, pop-ups & residency programs",
    },
    {
      icon: Buildings,
      label: "Investor narrative & development roadmap",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Advisory areas
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            What We Help<br />
            <span className="italic">You Build</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {areas.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 5) * 0.06, duration: 0.4 }}
              className="bg-warm-dark p-7"
            >
              <a.icon size={18} weight="light" className="text-amber mb-4" />
              <div className="text-sm font-medium text-white">{a.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRICING
   ───────────────────────────────────────────── */

function Pricing() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
          Pricing
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-6xl font-light text-white lg:text-7xl"
        >
          $150 <span className="italic text-amber">per hour.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 text-base text-white/45"
        >
          Simple, transparent, no retainers required.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   VIDEO CALL FORMAT
   ───────────────────────────────────────────── */

function VideoCallFormat() {
  const sessionItems = [
    "Walkthrough of your site, project, or concept",
    "Assessment of current gaps and opportunities",
    "Revenue and accommodation strategy",
    "Cultural and community design recommendations",
    "Operations and tech-stack guidance",
    "Build sequencing and phasing priorities",
    "Marketing and positioning feedback",
  ];

  const deliverables = [
    "Recorded session for your team to review",
    "Prioritized action items and next steps",
    "Relevant templates and frameworks",
    "Network introductions where applicable",
    "Follow-up notes and resource links",
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            How it works
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Video Call<br />
            <span className="italic">Format</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* Typical session */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-white mb-6">
              Typical Session
            </h3>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {sessionItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex items-center gap-4 py-4"
                >
                  <div className="font-mono text-xs text-amber/60">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span className="text-sm text-white/60">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-white mb-6">
              Deliverables
            </h3>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {deliverables.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex items-center gap-4 py-4"
                >
                  <Check size={14} weight="bold" className="text-amber shrink-0" />
                  <span className="text-sm text-white/60">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT US / CREDENTIALS
   ───────────────────────────────────────────── */

function AboutCredentials() {
  const credentials = [
    "Crowdfunded a 400-acre site in rural British Columbia",
    "Operating an active campsite and golf resort",
    "Designing cabins, saunas, coworking spaces, and maker infrastructure",
    "Hosting seasonal events, retreats, and community programming",
    "10+ years building a global network via Future Thinkers",
    "Deep AI expertise applied to village operations and workflows",
    "Developed the Smart Village Standard",
    "Consulting on village design, hospitality ops, and regenerative placemaking",
  ];

  const images = [
    {
      src: "/images/106547744_10165033448205725_3967614752782880468_n-1024x1024.jpg",
      alt: "Community gathering at the village",
    },
    {
      src: "/images/the_woman_in_202512041426-1024x576.jpeg",
      alt: "Village life and culture",
    },
    {
      src: "/images/76747423_10163561173205725_3017674924459294720_n-1024x577.jpg",
      alt: "Land and infrastructure development",
    },
    {
      src: "/images/pxl_20240518_203625592-edit-819x1024.jpg",
      alt: "On-site operations",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Who we are
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              About Us &amp;<br />
              <span className="italic">Credentials</span>
            </h2>

            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {credentials.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="flex items-start gap-4 py-4"
                >
                  <Check size={14} weight="bold" className="text-amber shrink-0 mt-0.5" />
                  <span className="text-sm text-white/60">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 text-base font-medium text-white/80 italic max-w-[50ch]"
            >
              We&apos;re not talking theoretically — we&apos;re in the arena, doing
              the work every day.
            </motion.p>
          </div>

          {/* Image grid */}
          <PhotoGrid
            photos={images}
            cols="grid-cols-2"
            gap="gap-3"
            sizes="(max-width: 1024px) 50vw, 33vw"
            rounded="rounded-xl"
            staggerMod={2}
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WHO WE WORK WITH
   ───────────────────────────────────────────── */

function WhoWeWorkWith() {
  const profiles = [
    {
      icon: Campfire,
      label: "RV parks converting to long-stay villages",
    },
    {
      icon: Mountains,
      label: "Glamping operators and retreat center owners",
    },
    {
      icon: MapPin,
      label: "Multi-acre family lands seeking new business models",
    },
    {
      icon: Buildings,
      label: "Traditional resorts seeking cultural and community upgrade",
    },
    {
      icon: Leaf,
      label: "Developers exploring seasonal or post-job living models",
    },
    {
      icon: Handshake,
      label: "Towns and municipalities exploring regenerative placemaking",
    },
    {
      icon: Lightning,
      label: "Hospitality owners seeking differentiation",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Ideal clients
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Who We<br />
            <span className="italic">Work With</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.4 }}
              className="bg-warm-dark p-7"
            >
              <p.icon size={18} weight="light" className="text-amber mb-4" />
              <div className="text-sm font-medium text-white/60">{p.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOW CONSULTING SUPPORTS PORTAL.PLACE
   ───────────────────────────────────────────── */

function ConsultingSupportsPortal() {
  const benefits = [
    {
      label: "Shared audience demand",
      body: "Consulting clients become part of the Portal.Place network, expanding the pool of aligned destinations.",
    },
    {
      label: "Cross-visitation",
      body: "Members and guests from one village discover and visit others in the network.",
    },
    {
      label: "Joint programming",
      body: "Events, retreats, and residency programs can be coordinated across multiple sites for greater reach.",
    },
    {
      label: "Future investment opportunities",
      body: "Well-advised projects become candidates for deeper partnership, co-development, or investment down the line.",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Ecosystem
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            How Consulting Supports<br />
            <span className="italic">Portal.Place</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.4 }}
              className="bg-[#0F0E12] p-7"
            >
              <div className="text-sm font-medium text-white mb-2">{b.label}</div>
              <div className="text-sm leading-relaxed text-white/35">{b.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA SECTION
   ───────────────────────────────────────────── */

function BookSession() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl"
        >
          Book a <span className="italic">Session</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-8 max-w-[52ch] text-base leading-relaxed text-white/75"
        >
          If you&apos;re not sure — book a single exploratory working session. If
          we&apos;re aligned, we continue. If not, you still walk away with clarity
          and direction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <a
            href="https://futurethinkers.org/call60"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
          >
            Book a Session <ArrowUpRight size={14} weight="bold" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE EXPORT
   ───────────────────────────────────────────── */

export default function ConsultingPage() {
  return (
    <>
      <Hero />
      <WhyWorkWithUs />
      <WhatWeHelpYouBuild />
      <Pricing />
      <VideoCallFormat />
      <AboutCredentials />
      <WhoWeWorkWith />
      <ConsultingSupportsPortal />
      <BookSession />
    </>
  );
}

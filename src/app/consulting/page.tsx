"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Users,
  Broadcast,
  TreeEvergreen,
  Buildings,
  Megaphone,
  HandCoins,
  Check,
} from "@phosphor-icons/react";

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
            className="mt-10 max-w-[52ch] text-base leading-relaxed text-white/55"
          >
            Strategic advisory for land developers, hospitality operators,
            investor groups, and municipalities building toward resilient,
            community-centered destinations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10"
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

function Credentials() {
  const items = [
    "Crowdfunded, acquired, and operated a 400-acre resort destination in BC for 5+ years",
    "Designed and installed shared infrastructure: sauna, makerspace, event spaces, golf course",
    "10+ years building Future Thinkers — a globally recognized podcast and media platform (10M+ downloads)",
    "International speaker and consultant on societal transformation, technology, and community systems",
    "Deep expertise in AI — applied to operations, community tooling, and organizational design",
    "Board member, Clearwater Chamber of Commerce; TNRD policy advocacy",
    "Active investor relations and capital raise structuring experience",
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Qualifications
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Not theory.<br />
              <span className="italic">In the arena.</span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/45 max-w-[44ch]">
              We advise from direct operational experience — not from a framework.
              Every recommendation is grounded in what we&apos;ve actually built.
            </p>

            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {items.map((item, i) => (
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
          </div>

          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src="/images/106547744_10165033448205725_3967614752782880468_n-1024x1024.jpg"
              alt="Mike Gilliland — Smart Village Consulting"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpertiseAreas() {
  const areas = [
    {
      icon: TreeEvergreen,
      label: "Village & destination design",
      body: "Site planning, phasing, infrastructure priorities, and cultural programming for land-based community projects.",
    },
    {
      icon: Users,
      label: "Community & culture systems",
      body: "Membership models, community rhythms, governance structures, and the cultural layer that makes a place sticky.",
    },
    {
      icon: HandCoins,
      label: "Investor narratives & capital strategy",
      body: "Structuring raise materials, positioning for accredited and institutional investors, SPV design, and stakeholder communication.",
    },
    {
      icon: Megaphone,
      label: "Brand, media & audience building",
      body: "Building a media presence that generates inbound demand — podcasts, content platforms, and community-led growth.",
    },
    {
      icon: Broadcast,
      label: "AI & village operating systems",
      body: "Applying AI to hospitality operations, community coordination, and the digital infrastructure of a living destination.",
    },
    {
      icon: Buildings,
      label: "Municipal & regional placemaking",
      body: "Working with towns, regional districts, and development authorities on resilience infrastructure and economic diversification.",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Areas of expertise
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Where we<br />
            <span className="italic">add value</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.06, duration: 0.4 }}
              className="bg-warm-dark p-7"
            >
              <a.icon size={18} weight="light" className="text-amber mb-4" />
              <div className="text-sm font-medium text-white mb-2">{a.label}</div>
              <div className="text-sm leading-relaxed text-white/40">{a.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          className="mx-auto mt-8 max-w-[48ch] text-base leading-relaxed text-white/75"
        >
          Start with a single working session. If there&apos;s a fit, we continue.
          Either way, you walk away with clarity and a sharper strategy.
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

export default function ConsultingPage() {
  return (
    <>
      <Hero />
      <Credentials />
      <ExpertiseAreas />
      <BookSession />
    </>
  );
}

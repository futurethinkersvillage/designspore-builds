"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Buildings,
  Globe,
  Lightning,
  TrendUp,
  Users,
  Cpu,
  Hammer,
  Tree,
  ArrowUpRight,
} from "@phosphor-icons/react";

// ── Partner / Investor ────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/bf57b989-df81-4b14-8435-046dec6e4fb1-1024x576.jpg"
          alt="Wells Gray Village aerial"
          fill
          priority
          className="object-cover opacity-[0.07]"
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_38%]">
          {/* Left: headline */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
            >
              Partners & Investors
            </motion.p>

            <div className="overflow-hidden pb-10 -mb-10">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
              >
                Become a
              </motion.h1>
            </div>
            <div className="overflow-hidden pb-10 -mb-10">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
              >
                partner or
              </motion.h1>
            </div>
            <div className="overflow-hidden pb-10 -mb-10">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
              >
                investor.
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 max-w-[50ch] text-base leading-relaxed text-white/45"
            >
              Portal.Place is building a network of villages — flagship sites where
              families, builders, entrepreneurs, creators, and purpose-driven people
              return year after year to live, work, and regenerate in nature.
              We&apos;re working with investors, operators, and regional stakeholders who
              are actively investing in resilience infrastructure to help develop the
              next phase of the project.
            </motion.p>
          </div>

          {/* Right: quick credentials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col justify-center divide-y divide-white/10 border-y border-white/10"
          >
            {[
              { label: "400-acre flagship site", sub: "Near Clearwater, BC — operating for 5+ years" },
              { label: "10M+ content views", sub: "Future Thinkers podcast & media ecosystem" },
              { label: "Phase 2 planning underway", sub: "Investor conversations in progress" },
              { label: "Multi-entity ecosystem", sub: "Portal.Place · Future Thinkers · Wells Gray Resort / Village · Design Spore" },
            ].map((item) => (
              <div key={item.label} className="py-5">
                <div className="text-sm font-medium text-white">{item.label}</div>
                <div className="mt-0.5 text-xs text-white/35">{item.sub}</div>
              </div>
            ))}
            <div className="pt-6 flex flex-wrap gap-3">
              <a
                href="#access"
                className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
              >
                Request investor access <ArrowRight size={13} weight="bold" />
              </a>
              <Link
                href="/deck"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-sm font-medium text-white transition-all hover:border-white/50 hover:bg-white/5"
              >
                View investor deck <ArrowUpRight size={13} weight="bold" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Thesis() {
  const pillars = [
    {
      n: "01",
      icon: Buildings,
      label: "Lifestyle-first real estate",
      body: "Seasonal villages designed for a world where many jobs are automated — and where family environments, entrepreneurship, wellness, maker spaces, and regenerative culture shape community life. We see this as the next major real estate category.",
    },
    {
      n: "02",
      icon: Globe,
      label: "Network, not just a single site",
      body: "A scalable model: multiple villages across regions and biomes sharing culture, systems, and tech — creating network effects that a single property can never achieve.",
    },
    {
      n: "03",
      icon: Lightning,
      label: "Land + tech + media flywheel",
      body: "Physical hospitality site, network platform, tech & tools layer, non-profit education arm, and mature media ecosystem that tells the story. A mutually reinforcing flywheel.",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_45%]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              The thesis
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              A model for<br />
              <span className="italic">21st-century living</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm leading-relaxed text-white/40 max-w-[50ch]">
              Global uncertainty, AI automation, and burnout are redefining how
              people live. Millions are choosing to decouple from cities.
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="grid grid-cols-[3rem_1fr] items-start gap-8 py-8 lg:grid-cols-[5rem_16rem_1fr]"
            >
              <span className="font-mono text-xs text-white/20 pt-0.5">{p.n}</span>
              <div className="flex items-center gap-4">
                <p.icon size={15} weight="light" className="text-amber shrink-0" />
                <span className="text-sm font-medium text-white">{p.label}</span>
              </div>
              <p className="hidden text-sm leading-relaxed text-white/40 max-w-[55ch] lg:block">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatExists() {
  const categories = [
    {
      label: "Accommodation & infrastructure",
      items: [
        "RV and tenting sites",
        "Geodesic glamping dome",
        "Bunk cabins with shared bathrooms & showers",
        "120-person events gazebo + smaller gazebos",
      ],
    },
    {
      label: "Wellness & nature",
      items: [
        "Barrel sauna & natural river cold plunge",
        "Private lake",
        "Forest, river & mountain views within Wells Gray Provincial Park",
        "Kids playground & family-friendly outdoor areas",
      ],
    },
    {
      label: "Maker, coworking & activities",
      items: [
        "Maker space & woodworking shop",
        "Golf & disc golf course",
        "Horse corrals",
        "Early seasonal programs & events",
      ],
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[42%_1fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              What exists today
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              A real operating<br />
              <span className="italic">destination</span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/40 max-w-[42ch]">
              Not a concept deck. The flagship site is welcoming guests, families,
              and events today — with a long track record of strong reviews and
              a clear path to higher-end village living.
            </p>
            <div className="mt-10 relative aspect-video overflow-hidden rounded-xl">
              <Image
                src="/images/wells-gray-golf-rv-06-1024x685.jpg"
                alt="Wells Gray Village property"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-10">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="text-xs font-medium uppercase tracking-wider text-white/30 mb-4">
                  {cat.label}
                </div>
                <div className="divide-y divide-white/10 border-t border-white/10">
                  {cat.items.map((item) => (
                    <div key={item} className="py-3 text-sm text-white/55">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyNow() {
  const forces = [
    {
      n: "01",
      label: "Macro shift in how we live & work",
      body: "Remote work, automation, and burnout are redefining what a good life looks like. Millions are decoupling from cities.",
    },
    {
      n: "02",
      label: "Exploding demand for nature, wellness & community",
      body: "People want Blue Zone-inspired lifestyles, strong social ties, and access to nature — without sacrificing connectivity.",
    },
    {
      n: "03",
      label: "Open space in the market",
      body: "There are resorts, RV parks, and gated communities — but no widely recognized Smart Village network combining hospitality, tech, wellness, and culture at scale.",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Why now
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            The conditions<br />
            <span className="italic">are converging</span>
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {forces.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="grid grid-cols-[3rem_1fr] items-start gap-8 py-8 lg:grid-cols-[5rem_18rem_1fr]"
            >
              <span className="font-mono text-xs text-white/20 pt-0.5">{f.n}</span>
              <span className="text-sm font-medium text-white">{f.label}</span>
              <p className="hidden text-sm leading-relaxed text-white/40 max-w-[55ch] lg:block">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RevenueStreams() {
  const streams = [
    { icon: Users, label: "Memberships", body: "Annual memberships with add-on services and tiered involvement." },
    { icon: Tree, label: "Stays & programs", body: "Short-term stays, retreats, festivals, and month-long village immersion programs." },
    { icon: Hammer, label: "Local production & fabrication", body: "On-site manufacturing of cabins and infrastructure via CNC and maker spaces — reducing costs and increasing design control." },
    { icon: Buildings, label: "Glamping & cabins", body: "Partnerships on seasonal glamping dwellings and long-term site leases." },
    { icon: Cpu, label: "Village AI (tech layer)", body: "AI-assisted coordination, operations, and community tools — licensable to other villages and land projects." },
    { icon: TrendUp, label: "Consulting & partnerships", body: "Working with hospitality operators, municipalities, and developers to design and launch Smart Village-style projects." },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              Business model
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Revenue<br />
              <span className="italic">streams</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm leading-relaxed text-white/40 max-w-[48ch]">
              A diversified, scalable model combining real land, hospitality,
              membership, technology, and media. Full details available under NDA
              to qualified partners.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {streams.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="bg-warm-dark p-8"
            >
              <s.icon size={18} weight="light" className="text-amber mb-5" />
              <div className="text-sm font-medium text-white mb-3">{s.label}</div>
              <div className="text-sm leading-relaxed text-white/40">{s.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Phases() {
  const phases = [
    {
      label: "Phase 1",
      status: "Complete",
      items: [
        "400-acre site acquired & operating",
        "RV sites, glamping dome, bunk cabins",
        "Sauna, private lake, golf course",
        "Maker space & coworking gazebo",
        "Early seasonal programs running",
      ],
    },
    {
      label: "Phase 2",
      status: "Planning",
      items: [
        "New prefab accommodation units",
        "Coworking centre & café",
        "Pro operations & land security",
        "Maker space & local production hub",
        "Festival-ready land preparation",
      ],
    },
    {
      label: "Phase 3",
      status: "Vision",
      items: [
        "Village services hub",
        "Expanded maker space & CNC production",
        "Staff housing",
        "Food truck & community kitchen",
        "Regenerative farm & gardens",
      ],
    },
    {
      label: "Phase 4",
      status: "Vision",
      items: [
        "Forest school & learning campus",
        "Long-term tiny home & RV sites",
        "Network expansion to additional sites",
        "Village AI platform rollout",
        "Consulting & licensing to other villages",
      ],
    },
  ];

  const statusColors: Record<string, string> = {
    Complete: "text-amber bg-amber/10",
    Planning: "text-white/60 bg-white/5",
    Vision: "text-white/30 bg-white/[0.03]",
  };

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Development roadmap
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Campus<br />
            <span className="italic">upgrades</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-[#0F0E12] p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-white">{phase.label}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[phase.status]}`}>
                  {phase.status}
                </span>
              </div>
              <ul className="space-y-2.5">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber/40" />
                    <span className="text-xs leading-relaxed text-white/40">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const coFounders = [
    {
      name: "Mike Gilliland",
      role: "Co-founder · Strategy & Media",
      src: "/images/gemini_generated_image_j883fhj883fhj883.png",
    },
    {
      name: "Euvie Gilliland",
      role: "Co-founder · Programs & Culture",
      src: "/images/beautyplus_20240811124204769_save-edit-edit-edit-1-1024x1024.jpg",
    },
  ];

  const advisors = [
    {
      name: "Gordon Cory",
      role: "Advisor · Planning & Development",
      src: "/images/gordon-cory.jpg",
    },
    {
      name: "Dean Clifford",
      role: "Advisor · Infrastructure & Building",
      src: "/images/306360633_102513715948004_2535655262561801205_n-768x1024.jpg",
    },
    {
      name: "Kaara Long",
      role: "Advisor · Business Development & PR",
      src: "/images/kaara-long.jpg",
    },
  ];

  const network = [
    "Clearwater Chamber of Commerce",
    "Otherworld Festival",
    "EthVan",
    "DWeb",
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            The team
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Who&apos;s behind<br />
            <span className="italic">the project</span>
          </h2>
        </div>

        {/* Co-founders */}
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-8">
            Co-founders
          </p>
          <div className="grid grid-cols-2 gap-8 max-w-sm">
            {coFounders.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="text-center"
              >
                <div className="relative mx-auto mb-5 h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    src={m.src}
                    alt={m.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div className="text-sm font-medium text-white">{m.name}</div>
                <div className="mt-1 text-xs text-white/35">{m.role}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Advisors */}
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-8">
            Advisors
          </p>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-3 max-w-2xl">
            {advisors.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="text-center"
              >
                <div className="relative mx-auto mb-5 h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    src={m.src}
                    alt={m.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div className="text-sm font-medium text-white">{m.name}</div>
                <div className="mt-1 text-xs text-white/35">{m.role}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Network & Collaborators */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-6">
            Network &amp; Collaborators
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {network.map((name, i) => (
              <span key={name} className="text-sm text-white/50">
                {name}{i < network.length - 1 ? "," : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Organizations() {
  const orgs = [
    {
      name: "Future Thinkers",
      src: "/images/ftp-blue-logo-light-1.png",
    },
    {
      name: "Design Spore",
      src: "/images/designspore-logo-with-text-1024x1024.png",
    },
    {
      name: "Wells Gray Resort",
      src: "/images/wells-gray-resort-logo-green-vertical-1024x983.png",
    },
    {
      name: "Portal.Place",
      src: "/images/portalplace-logo-vertical-white-738x1024.png",
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
            Our<br />
            <span className="italic">organizations</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
          {orgs.map((org, i) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="flex flex-col items-center"
            >
              <div className="relative h-28 w-full">
                <Image
                  src={org.src}
                  alt={org.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-contain"
                />
              </div>
              <div className="mt-4 text-xs text-white/40">{org.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Foundation() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_38%] items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              Non-profit arm
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              The<br />
              <span className="italic">Foundation</span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/40 max-w-[48ch]">
              The Future Thinkers Foundation supports education, research, and
              community development aligned with Smart Village principles —
              ensuring the long-term mission stays rooted in public benefit.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="relative h-32 w-64">
              <Image
                src="/images/ftp-blue-logo-dark.png"
                alt="Future Thinkers Foundation"
                fill
                sizes="256px"
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StrategicPartnerships() {
  const partners = [
    {
      name: "Carbide 3D",
      src: "/images/1737499346-d7bca4e8d7918c0c31e43aaf3be9e77e1d07103be327cbcee29d4ce31df5d142-d-300x286.png",
    },
    {
      name: "xTool",
      src: "/images/xtool-logo-01-300x300.png",
    },
    {
      name: "Wells Gray Resort",
      src: "/images/wells-gray-resort-logo-green-vertical-300x288.png",
    },
    {
      name: "Design Spore",
      src: "/images/designspore-logo-with-text-300x300.png",
    },
    {
      name: "Future Thinkers",
      src: "/images/ftp-blue-logo-light-1-300x195.png",
    },
    {
      name: "HypeDome",
      src: "/images/hypedome_logo_color-2-300x300.png",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Collaborators
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Strategic &amp; corporate<br />
            <span className="italic">partnerships</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-10 lg:grid-cols-6 items-center">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex items-center justify-center"
            >
              <div className="relative h-20 w-full">
                <Image
                  src={p.src}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  className="object-contain opacity-60 transition-opacity hover:opacity-100"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RequestAccess() {
  return (
    <section id="access" className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_42%]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Let&apos;s build<br />
              <span className="italic">this together.</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              We invite serious contributors to request more information. Some
              materials require a signed NDA. Tell us who you are and what
              draws you to the project.
            </p>
            <div className="mt-10 flex flex-col gap-4 max-w-xs">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <ArrowUpRight size={14} weight="bold" className="text-white shrink-0" />
                Capital partners & co-investors
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <ArrowUpRight size={14} weight="bold" className="text-white shrink-0" />
                Operational collaborators
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <ArrowUpRight size={14} weight="bold" className="text-white shrink-0" />
                strategic & development partners
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-white/10 p-8 lg:p-10">
            <h3 className="text-lg font-medium text-white mb-6">Request investor access</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-white/50">
                    First name
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus-visible:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-colors"
                    placeholder="James"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-white/50">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus-visible:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-colors"
                    placeholder="Novotný"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/50">
                  Email
                </label>
                <input
                  type="email"
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus-visible:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-colors"
                  placeholder="james@example.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/50">
                  Organization / background
                </label>
                <input
                  type="text"
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus-visible:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-colors"
                  placeholder="Fund name, company, or role"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/50">
                  What draws you to this project
                </label>
                <textarea
                  rows={3}
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus-visible:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-colors resize-none"
                  placeholder="Your investment focus, what excites you about Smart Villages, any relevant context..."
                />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                Submit request <ArrowRight size={14} weight="bold" />
              </button>
              <p className="text-center text-xs text-white/40">
                We review every request personally. NDA available upon confirmation of fit.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PartnerPage() {
  return (
    <>
      <Hero />
      <Thesis />
      <WhatExists />
      <WhyNow />
      <RevenueStreams />
      <Phases />
      <Team />
      <Organizations />
      <Foundation />
      <StrategicPartnerships />
      <RequestAccess />
    </>
  );
}

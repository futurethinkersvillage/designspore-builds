"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 1 — HERO / COVER
───────────────────────────────────────────────────────────────────────────── */
function Hero() {
  const summaryRows = [
    ["RAISING", "$3M CAD SENIOR BRIDGE"],
    ["STRUCTURE", "SPV — MULTIPLE ALIGNED INVESTORS"],
    ["SECURITY", "FIRST POSITION ON LAND TITLE"],
    ["RETURN", "FIXED INTEREST + EQUITY KICKER"],
    ["UPSIDE", "~50% TARGET AT NEXT ROUND"],
    ["TIMELINE", "18–24 MONTHS"],
  ];

  return (
    <section className="relative min-h-[100dvh] bg-warm-dark flex flex-col justify-between">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16 w-full pt-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
          Confidential — For Qualified Investors Only
        </p>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-16 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-start">
          {/* Left: Heading + subline + CTAs */}
          <div>
            <div className="overflow-hidden pb-4 -mb-4">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(4rem,10vw,9rem)] font-light leading-[0.9] tracking-tighter text-white"
              >
                Portal.Place
              </motion.h1>
            </div>
            <div className="overflow-hidden pb-4 -mb-4">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(4rem,10vw,9rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
              >
                Investor Deck
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
            >
              New model for living, working, creating and learning — built on real land, designed to be scaled through a membership layer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="http://futurethinkers.org/call60"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-amber px-8 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
              >
                Book a Call
              </a>
              <Link
                href="/one-pager"
                className="inline-block rounded-full border border-white/25 px-8 py-3.5 text-sm font-medium text-white transition-all hover:border-white/50 hover:bg-white/5"
              >
                View One-Pager
              </Link>
            </motion.div>
          </div>

          {/* Right: Summary table */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="rounded-2xl border border-white/10 overflow-hidden"
          >
            {summaryRows.map(([label, value], i) => (
              <div
                key={label}
                className={`grid grid-cols-2 divide-x divide-white/10 ${i < summaryRows.length - 1 ? "border-b border-white/10" : ""}`}
              >
                <div className="px-6 py-4">
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                    {label}
                  </span>
                </div>
                <div className="px-6 py-4">
                  <span className="text-xs font-medium uppercase tracking-[0.1em] text-amber">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16 w-full pb-10 flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center gap-3 text-white/30"
        >
          <div className="h-px w-12 bg-white/20" />
          <span className="text-xs uppercase tracking-[0.2em]">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 2 — THE VISION
───────────────────────────────────────────────────────────────────────────── */
function TheVision() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          01 — The Vision
        </p>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-start">
          {/* Left: Heading + body */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-10 leading-[1.05]">
              We believe the next durable asset class will be real-world lifestyle infrastructure built for a post-AI world.
            </h2>
            <div className="space-y-5 text-sm leading-relaxed text-white/55 max-w-[52ch]">
              <p>
                Portal.Place is building a village campus for seasonal living, co-working, creating and learning — on a 400-acre flagship site we&apos;ve owned and operated in BC, Canada for five years.
              </p>
              <p>
                The model scales through a membership layer, cultural and operational templates, tech-enabled coordination, and an established media platform — creating an asset-backed platform with existing demand and software-like scalability.
              </p>
            </div>
          </motion.div>

          {/* Right: Pull quote card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-8 lg:p-12 flex flex-col justify-center min-h-[280px]"
          >
            <div className="h-px w-12 bg-amber mb-8" />
            <blockquote className="font-serif text-3xl lg:text-4xl font-light italic text-white/90 leading-[1.2]">
              Not a concept. A living, operating proof of model.
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 3 — WHY THIS WORKS
───────────────────────────────────────────────────────────────────────────── */
function WhyThisWorks() {
  const stats = [
    {
      number: "200,000+",
      label: "annual visitors to Wells Gray Provincial Park",
      note: "Local demand already exists, adjacent to our property",
    },
    {
      number: "$2T+",
      label: "projected wellness tourism market by 2030",
      note: "One of the fastest-growing travel segments globally",
    },
    {
      number: "40%+",
      label: "of Canadian workers now have remote-capable roles",
      note: "Where people live is becoming a choice again",
    },
    {
      number: "3,000+",
      label: "guests hosted per year at our current site",
      note: "Proven demand with minimal marketing",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          02 — The Premise & Demand
        </p>
        <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-16 max-w-3xl leading-[1.05]">
          A massive lifestyle shift is underway — and the infrastructure doesn&apos;t exist yet.
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 lg:p-8"
            >
              <div className="text-4xl lg:text-5xl font-serif font-light text-amber mb-3">
                {stat.number}
              </div>
              <div className="text-sm font-medium text-white/80 mb-2">
                {stat.label}
              </div>
              <div className="text-xs leading-relaxed text-white/40">
                {stat.note}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-sm leading-relaxed text-white/55 max-w-[65ch]"
        >
          Remote work, AI disruption, housing pressure, loneliness, global instability, and institutional breakdown are creating demand for a new model. We&apos;re building the early physical infrastructure for what comes next.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 4 — THE GAP
───────────────────────────────────────────────────────────────────────────── */
function TheGap() {
  const models = [
    {
      label: "Resorts & Hotels",
      description: "Short stays, passive consumption. No cultural continuity or community.",
    },
    {
      label: "Co-living / Co-working",
      description: "Urban, transient, not designed for families or long stays.",
    },
    {
      label: "RV Parks & Glamping",
      description: "Access to nature, but no programming, culture, or belonging.",
    },
    {
      label: "Retreats & Festivals",
      description: "Powerful experiences, but episodic. Not a sustainable lifestyle.",
    },
    {
      label: "Wellness Clubs",
      description: "Visit-based health amenities. Not lifestyle-integrated.",
    },
    {
      label: "Intentional Communities",
      description: "Holistic vision, but lack professional operations and scalability.",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          03 — Why Existing Models Fail
        </p>
        <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-16 max-w-3xl leading-[1.05]">
          Every existing model solves one piece. None offer a systemic approach.
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-12">
          {models.map((model, i) => (
            <motion.div
              key={model.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 lg:p-8 flex gap-5 items-start"
            >
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-terracotta" />
              <div>
                <div className="text-sm font-medium text-terracotta mb-1.5">
                  {model.label}
                </div>
                <div className="text-sm leading-relaxed text-white/55">
                  {model.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-amber/30 bg-amber/10 px-8 py-6"
        >
          <p className="text-sm leading-relaxed text-amber font-medium">
            Portal.Place is the only model that combines all elements — professionally operated, membership-anchored, and designed to scale.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 5 — THE SOLUTION
───────────────────────────────────────────────────────────────────────────── */
function TheSolution() {
  const pillars = [
    {
      title: "Seasonal Lifestyle & Rhythms",
      description: "Monthly, seasonal, and annual stays with cultural programming built in",
    },
    {
      title: "Health & Wellness",
      description: "Sauna, cold plunge, outdoor fitness, and wellness-integrated design",
    },
    {
      title: "Access to Nature",
      description: "400 acres, two creeks, private lake, forest trails, and Wells Gray Park next door",
    },
    {
      title: "Co-working & Maker Culture",
      description: "Shared workspace, digital fabrication, and builder culture",
    },
    {
      title: "Cultural & Learning Programs",
      description: "Workshops, courses, events, and seasonal programs",
    },
    {
      title: "Family-Friendly & Holistic",
      description: "Designed for families, not just solo travelers or couples",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          04 — Our Solution
        </p>
        <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-6 max-w-3xl leading-[1.05]">
          A membership-based village campus. A new asset class.
        </h2>
        <p className="text-sm leading-relaxed text-white/55 max-w-[52ch] mb-16">
          Portal.Place combines real estate, hospitality, membership, and emerging technology into one repeatable model.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 lg:p-8"
            >
              {/* Icon placeholder */}
              <div className="mb-6 h-10 w-10 rounded-full border border-amber/30 bg-amber/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-amber/60" />
              </div>
              <h3 className="font-serif text-xl font-light text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/55">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 6 — PROOF OF CONCEPT
───────────────────────────────────────────────────────────────────────────── */
function ProofOfConcept() {
  const propertyStats = [
    "393 acres across 2 land titles (C-3 + C-4 zoning)",
    "45 serviced RV sites + 30 non-serviced",
    "3 bunk cabins + 1 glamping dome",
    "120-person event gazebo with commercial kitchen",
    "Sauna, cold plunge, makerspace",
    "9-hole golf course + disc golf",
    "Horse corral, private lake, 2 creeks",
    "Starlink internet throughout",
  ];

  const businessStats = [
    "~$250K annual revenue (normalized, seasonal operation)",
    "Revenue trend: $131K (2021) → $177K (2022) → $187K (2023)",
    "~3,000 guests per year, May–October season only",
    "Current appraised value: ~$2.25M+ (land & business)",
    "200,000+ annual visitors to adjacent Wells Gray Park",
    "Majority bookings direct (low acquisition cost)",
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          05 — Proof of Concept
        </p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-2 leading-[1.05]">
            We are not
          </h2>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-12 leading-[1.05] italic">
            starting from scratch.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 px-8 py-6 mb-16"
        >
          <p className="font-serif text-2xl lg:text-3xl font-light italic text-amber/90 leading-[1.3]">
            5 years. 400 acres. 3,000 guests/year. Real infrastructure. Real revenue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* The Property */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-2xl font-light text-white mb-6">
              The Property
            </h3>
            <ul className="space-y-3">
              {propertyStats.map((stat) => (
                <li key={stat} className="flex items-start gap-3 text-sm leading-relaxed text-white/55">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  {stat}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* The Business */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-serif text-2xl font-light text-white mb-6">
              The Business
            </h3>
            <ul className="space-y-3">
              {businessStats.map((stat) => (
                <li key={stat} className="flex items-start gap-3 text-sm leading-relaxed text-white/55">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  {stat}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-sm italic leading-relaxed text-white/35 max-w-[65ch]"
        >
          These numbers reflect a minimal-investment, skeleton-crew operation with almost no paid marketing. The upside is in what we haven&apos;t yet built.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 7 — EXPANSION PLAN
───────────────────────────────────────────────────────────────────────────── */
function ExpansionPlan() {
  const timelineSteps = [
    "Bridge",
    "Feasibility & Structuring",
    "$20M Raise",
    "Phase 2 Build",
    "Full Village",
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          06 — The Bridge
        </p>
        <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-6 max-w-3xl leading-[1.05]">
          The bridge between Phase 1 and Phase 2.
        </h2>
        <p className="text-sm leading-relaxed text-white/55 max-w-[60ch] mb-16">
          Phase 1 is complete — we have land, infrastructure, guests, and 5 years of operating history. The $3M bridge connects Phase 1 to Phase 2: a $20M expansion raise. It secures our land position, funds the feasibility work, and builds the operational capacity to run a larger raise with confidence.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
          {[
            {
              title: "Land Security",
              body: "Secures land position and completes legal and title structuring | Clean on title, ready for the $20M raise | Removes title risk as a barrier to institutional investment",
            },
            {
              title: "Feasibility & Structuring",
              body: "Funds the feasibility study, due diligence, and investor materials for Phase 2 | Engages qualified legal, financial, and planning advisors | Positions the project for a credible $20M raise",
            },
            {
              title: "Makerspace Completion",
              body: "Completes the on-site makerspace and fabrication lab | Enables in-house cabin and unit production at lower cost | Doubles as guest workshop and cultural program space",
            },
          ].map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 lg:p-8"
            >
              <h3 className="font-serif text-xl font-light text-white mb-4">
                {cat.title}
              </h3>
              <div className="space-y-1.5">
                {cat.body.split(" | ").map((line) => (
                  <div key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/55">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber/50" />
                    {line}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-sm leading-relaxed text-white/40 mb-12"
        >
          Phase 2 ($20M raise): New accommodation units, full-scale village infrastructure, and the first expansion sites. Feasibility in progress.
        </motion.p>

        {/* Timeline bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 lg:p-8"
        >
          <div className="flex items-center">
            {timelineSteps.map((step, i) => (
              <div key={step} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`h-3 w-3 rounded-full border-2 ${i === 0 ? "border-amber bg-amber" : "border-amber/40 bg-transparent"}`} />
                  <span className="mt-2 text-[10px] font-medium uppercase tracking-wider text-center text-white/55 whitespace-nowrap">
                    {step}
                  </span>
                </div>
                {i < timelineSteps.length - 1 && (
                  <div className="h-px flex-1 mx-2 bg-gradient-to-r from-amber/40 to-amber/10" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 8 — BUSINESS MODEL & PROJECTIONS
───────────────────────────────────────────────────────────────────────────── */
function BusinessModel() {
  const streams = [
    {
      title: "Membership",
      subtitle: "(Anchor)",
      points: [
        "Annual memberships, predictable recurring revenue",
        "Lowers acquisition cost",
        "Enables network effects",
      ],
    },
    {
      title: "Operating Revenue",
      subtitle: "",
      points: [
        "Stays (RV, glamping, cabins, long-stay)",
        "Seasonal events & programs",
        "Add-on services (laundry, meals, rentals, childcare)",
      ],
    },
    {
      title: "Expansion Revenue",
      subtitle: "(Future)",
      points: [
        "Platform licensing",
        "Village OS",
        "Partner site fees",
        "Consulting",
      ],
    },
  ];

  const projectionRows = [
    { stream: "Lodging (existing units)", current: "$187K", year1: "$250K", year3: "$350K" },
    { stream: "Glamping & Cabins (new)", current: "—", year1: "$400K", year3: "$1.1M" },
    { stream: "Wellness & Events", current: "$20K", year1: "$150K", year3: "$350K" },
    { stream: "Membership Revenue", current: "—", year1: "$50K", year3: "$250K" },
    { stream: "Total", current: "~$250K", year1: "~$850K", year3: "~$2.0M", isTotal: true },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          07 — Business Model
        </p>
        <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-16 max-w-3xl leading-[1.05]">
          Multiple revenue streams. Recurring at the core.
        </h2>

        {/* Revenue stream cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
          {streams.map((stream, i) => (
            <motion.div
              key={stream.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 lg:p-8"
            >
              <h3 className="font-serif text-xl font-light text-white mb-1">
                {stream.title}
              </h3>
              {stream.subtitle && (
                <p className="text-xs text-amber mb-4">{stream.subtitle}</p>
              )}
              {!stream.subtitle && <div className="mb-5" />}
              <ul className="space-y-2.5">
                {stream.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/55">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber/50" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Projections table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-8"
        >
          {/* Header */}
          <div className="grid grid-cols-4 border-b border-white/10 bg-white/5">
            <div className="px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white/40">Revenue Stream</div>
            <div className="px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white/40 text-right">Current</div>
            <div className="px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white/40 text-right">Year 1 Post-Bridge</div>
            <div className="px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-amber text-right">Year 3 Steady State</div>
          </div>
          {/* Rows */}
          {projectionRows.map((row, i) => (
            <div
              key={row.stream}
              className={`grid grid-cols-4 ${i < projectionRows.length - 1 ? "border-b border-white/10" : ""} ${row.isTotal ? "bg-white/5" : ""}`}
            >
              <div className={`px-6 py-4 text-sm ${row.isTotal ? "font-medium text-white" : "text-white/60"}`}>
                {row.stream}
              </div>
              <div className={`px-6 py-4 text-sm text-right ${row.isTotal ? "font-medium text-white" : "text-white/55"}`}>
                {row.current}
              </div>
              <div className={`px-6 py-4 text-sm text-right ${row.isTotal ? "font-medium text-white" : "text-white/55"}`}>
                {row.year1}
              </div>
              <div className={`px-6 py-4 text-sm text-right ${row.isTotal ? "font-medium text-amber" : "text-amber/80"}`}>
                {row.year3}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-white/35 max-w-[70ch]">
            Year 1 assumes 45% occupancy on new units, summer season only. Year 3 assumes shoulder season activation. No winter revenue in base case.
          </p>
          <p className="text-xs leading-relaxed text-white/35 max-w-[70ch]">
            These are conservative estimates. The CIM prepared for the original property sale projected $3.1M+ in summer revenue alone at full build-out — we are using a fraction of that as our base case.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 9 — THE FOUNDERS
───────────────────────────────────────────────────────────────────────────── */
function TheFounders() {
  const credentials = [
    { number: "10M+", label: "podcast downloads" },
    { number: "iTunes Top 40", label: "Tech Podcast (global)" },
    { number: "5 Years", label: "operating a real destination" },
  ];

  const advantages = [
    {
      label: "Not a concept",
      description: "Real land, real guests, real revenue. 5 years of operational learning baked in.",
    },
    {
      label: "End-to-end builders",
      description: "Ideas → audience → capital → land → operations → repeatable systems.",
    },
    {
      label: "Built-in distribution",
      description: "10+ years growing Future Thinkers into a globally recognized platform with a highly aligned audience.",
    },
    {
      label: "Designed to scale",
      description: "Portal.Place standardizes proven cultural, operational, and infrastructure patterns into a repeatable village model.",
    },
    {
      label: "Timing tailwind",
      description: "AI disruption, remote work, lifestyle shifts, and institutional breakdown accelerate demand for our model.",
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          08 — The Founders
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-20">
          {/* Left: bio */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-light text-white mb-8 leading-[1.05]">
              Mike & Euvie Gilliland
            </h2>
            <p className="text-sm leading-relaxed text-white/55 max-w-[52ch]">
              We are the co-founders of Future Thinkers, a globally recognized podcast and media platform we built over more than a decade exploring the future of society, technology, and culture. That work translated into real-world execution when we crowdfunded, acquired, and operated our village destination in Canada — gaining hands-on experience in land ownership, hospitality, community design, and infrastructure development.
            </p>
          </motion.div>

          {/* Right: credential stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center gap-8"
          >
            {credentials.map((cred) => (
              <div key={cred.number} className="border-l-2 border-amber/30 pl-6">
                <div className="font-serif text-3xl lg:text-4xl font-light text-amber mb-1">
                  {cred.number}
                </div>
                <div className="text-sm text-white/55">{cred.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Unfair Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-serif text-2xl font-light text-white mb-8">
            Unfair Advantages
          </h3>
          <div className="grid grid-cols-1 gap-0 divide-y divide-white/10 rounded-2xl border border-white/10 overflow-hidden">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="grid grid-cols-1 gap-2 px-6 py-5 md:grid-cols-[200px_1fr] md:gap-8 md:items-start"
              >
                <span className="text-sm font-medium text-white">{adv.label}</span>
                <span className="text-sm leading-relaxed text-white/55">{adv.description}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 10 — THE RAISE
───────────────────────────────────────────────────────────────────────────── */
function TheRaise() {
  const termsRows = [
    ["Instrument", "Senior secured bridge loan via SPV"],
    ["Timeline", "18–24 months"],
    ["Security", "First position on land title"],
    ["Return", "Fixed annual interest + equity kicker"],
    ["Equity Kicker", "~50% target upside at next round"],
    ["Repayment", "First close of $20M raise or refinancing"],
    ["Min. Ticket", "$100,000 CAD"],
  ];

  const structureBenefits = [
    "Clean on title — one mortgage, one lender (the SPV)",
    "Opens to 10–20 aligned investors across multiple exemptions",
    "Creates a community of financially motivated evangelists",
    "Securities: Accredited Investor + Minimum Amount exemptions",
  ];

  const tiers = [
    {
      label: "Trailblazer",
      minimum: "$100K+",
      perks: "Fixed interest + equity kicker + Core Perks",
      borderColor: "border-amber",
      textColor: "text-amber",
    },
    {
      label: "Homesteader",
      minimum: "$250K+",
      perks: "Enhanced kicker + Extended Access + Founders\u2019 Area site",
      borderColor: "border-terracotta",
      textColor: "text-terracotta",
      featured: true,
    },
    {
      label: "Cornerstone",
      minimum: "$500K+",
      perks: "Best terms + Naming rights + Advisory seat + Full perk bundle",
      borderColor: "border-mauve",
      textColor: "text-mauve",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          09 — The Raise
        </p>
        <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-16 max-w-3xl leading-[1.05]">
          $3M CAD Bridge — to unlock a $10–20M expansion round.
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-16">
          {/* Structure */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6 lg:p-8"
          >
            <h3 className="font-serif text-2xl font-light text-white mb-5">
              Structure
            </h3>
            <p className="text-sm leading-relaxed text-white/55 mb-6">
              We are raising through a Special Purpose Vehicle (SPV) — a new BC corporation that pools capital from multiple aligned investors and holds the mortgage as a single first-position lender on the Giant Supernova Holdings land title.
            </p>
            <ul className="space-y-3">
              {structureBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/55">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <div className="px-6 pt-6 lg:px-8 lg:pt-8 pb-2">
              <h3 className="font-serif text-2xl font-light text-white">
                Terms
              </h3>
            </div>
            {termsRows.map(([label, value], i) => (
              <div
                key={label}
                className={`grid grid-cols-2 gap-4 px-6 lg:px-8 py-3.5 ${i < termsRows.length - 1 ? "border-b border-white/10" : ""}`}
              >
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-white/35">
                  {label}
                </span>
                <span className="text-xs text-white/70">{value}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`rounded-2xl border-2 ${tier.borderColor} bg-white/5 p-6 lg:p-8 ${tier.featured ? "lg:scale-[1.03]" : ""}`}
            >
              <div className={`text-xs font-medium uppercase tracking-[0.2em] ${tier.textColor} mb-2`}>
                {tier.label}
              </div>
              <div className="font-serif text-3xl font-light text-white mb-4">
                {tier.minimum}
              </div>
              <p className="text-sm leading-relaxed text-white/55">
                {tier.perks}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 11 — INVESTOR PERKS
───────────────────────────────────────────────────────────────────────────── */
function InvestorPerks() {
  const columns = [
    {
      heading: "Access",
      color: "text-amber",
      perks: [
        "Annual stay allocation (1–4 weeks, by tier)",
        "Dedicated semi-permanent Founders\u2019 Area site (Homesteader+)",
        "Family & guest passes included",
      ],
    },
    {
      heading: "Resilience & Community",
      color: "text-terracotta",
      perks: [
        "Emergency access — guaranteed spot for family in wildfire/disaster",
        "Annual Founders\u2019 Gathering (2\u20133 day exclusive event)",
        "Food program participation — harvests, CSA-style, garden access",
      ],
    },
    {
      heading: "Priority & Upside",
      color: "text-mauve",
      perks: [
        "First right of refusal on $10\u201320M expansion round",
        "Priority unit selection when residential phase builds",
        "Founding membership rate locked for life",
        "Founders\u2019 Council — input on village design & programming",
        "Naming rights for trail, garden, or gathering space (Cornerstone)",
      ],
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
          10 — Investor Perks
        </p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl leading-[1.05]">
            Everything you want from owning rural land —
          </h2>
          <h2 className="font-serif text-5xl font-light italic text-amber lg:text-6xl leading-[1.05]">
            without worrying about maintenance.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm leading-relaxed text-white/55 max-w-[62ch] mb-16"
        >
          Our target investors are people who might otherwise spend $200–500K buying a rural parcel in BC or Alberta. These perks deliver the same psychological benefits — access, security, community, belonging — without the isolation, maintenance headaches, and underuse that comes with owning remote land alone.
        </motion.p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
          {columns.map((col, i) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className={`text-xs font-medium uppercase tracking-[0.2em] mb-6 ${col.color}`}>
                {col.heading}
              </h3>
              <ul className="space-y-4">
                {col.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm leading-relaxed text-white/55">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                    {perk}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-amber/30 bg-amber/10 px-8 py-6"
        >
          <p className="text-sm leading-relaxed text-amber font-medium">
            Non-financial value that doesn&apos;t exist later. These perks are available now because we&apos;re early. Once the village is built and the network grows, the founding tier closes permanently.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 12 — NEXT STEPS
───────────────────────────────────────────────────────────────────────────── */
function NextSteps() {
  const actions = [
    {
      title: "Book a 30-Minute Call",
      body: "Talk directly with Mike or Euvie about the opportunity.",
      href: "http://futurethinkers.org/call60",
      external: true,
    },
    {
      title: "Schedule a Site Visit",
      body: "Come see the 400 acres in person. Nothing replaces standing on the land.",
      href: "mailto:contact@futurethinkers.org",
      external: true,
    },
    {
      title: "Request Full Information",
      body: "Get the detailed financials, legal structure, and due diligence package.",
      href: "mailto:contact@futurethinkers.org",
      external: true,
    },
  ];

  const links = [
    { label: "Portal.Place", href: "https://portal.place", external: true },
    { label: "FutureThinkers.org", href: "https://futurethinkers.org", external: true },
    { label: "WellsGrayResort.ca", href: "https://wellsgrayresort.ca", external: true },
    { label: "Instagram @futurethinkers", href: "https://instagram.com/futurethinkers", external: true },
    { label: "+1 778-586-5613", href: "tel:+17785865613", external: false },
  ];

  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h2 className="font-serif text-5xl font-light text-white lg:text-7xl leading-[1.0] mb-8">
            Ready to be part of this?
          </h2>
          <p className="text-base leading-relaxed text-white/80 max-w-[52ch]">
            We&apos;re building something rare: a real asset, a real community, and a real model for how people live well in a changing world. The bridge round is the entry point.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
          {actions.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {action.external ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <h3 className="font-serif text-xl font-light text-warm-dark mb-3">
                    {action.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-warm-dark/60">
                    {action.body}
                  </p>
                </a>
              ) : (
                <Link
                  href={action.href}
                  className="group block rounded-2xl bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <h3 className="font-serif text-xl font-light text-warm-dark mb-3">
                    {action.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-warm-dark/60">
                    {action.body}
                  </p>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Links row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          {links.map((link, i) => (
            <div key={link.label} className="flex items-center gap-4">
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  href={link.href}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              )}
              {i < links.length - 1 && (
                <span className="text-white/30 text-xs">|</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-xs leading-relaxed text-white/50 max-w-[65ch]"
        >
          This deck is for informational purposes only and does not constitute an offer to sell securities. All investments involve risk. Please consult your financial and legal advisors.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────────────────────────────────────── */
export default function DeckPage() {
  return (
    <>
      <Hero />
      <TheVision />
      <WhyThisWorks />
      <TheGap />
      <TheSolution />
      <ProofOfConcept />
      <ExpansionPlan />
      <BusinessModel />
      <TheFounders />
      <TheRaise />
      <InvestorPerks />
      <NextSteps />
    </>
  );
}

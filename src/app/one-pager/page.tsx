"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  SUMMARY_ROWS,
  MARKET_STATS,
  PROPERTY_ITEMS,
  BUSINESS_ITEMS,
  BRIDGE_USES,
  PROJECTION_ROWS,
  COMPARISON_ROWS,
  INVESTMENT_TIERS,
  FOUNDER_STATS,
} from "./data";
import { Redacted } from "@/components/ui/Redacted";

/* ── Shared animation variant ───────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

/* ══════════════════════════════════════════════════════════════════
   Section 1 — Header
══════════════════════════════════════════════════════════════════ */
function Header() {
  const summaryRows = SUMMARY_ROWS;

  return (
    <section className="bg-warm-dark py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        {/* Confidentiality badge */}
        <p className="mb-10 text-xs font-medium uppercase tracking-[0.2em] text-amber">
          Confidential — For Qualified Investors
        </p>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start">
          {/* Left */}
          <div>
            <h1 className="font-serif text-6xl font-light text-white lg:text-7xl">
              Portal.Place
            </h1>
            <p className="mt-3 font-serif text-2xl italic text-amber">
              Investor One-Pager
            </p>
            <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-white/55">
              New model for living, working, creating and learning — built on
              real land, designed to be scaled through a membership layer.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/deck"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                View Full Deck →
              </Link>
              <Link
                href="/investor-print"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg border border-amber/40 px-5 py-2.5 text-sm font-medium text-amber transition-colors hover:border-amber hover:bg-amber/10"
              >
                Print / Save PDF →
              </Link>
              <a
                href="http://futurethinkers.org/call60"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-amber px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Book a Call →
              </a>
            </div>
          </div>

          {/* Right — summary table */}
          <div className="overflow-hidden rounded-xl border border-white/15">
            {summaryRows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-stretch${i < summaryRows.length - 1 ? " border-b border-white/10" : ""}`}
              >
                <div className="w-40 shrink-0 bg-white/5 px-4 py-3 text-xs uppercase tracking-wider text-white/40">
                  {row.label}
                </div>
                <div className="flex-1 px-4 py-3 text-sm font-medium text-white">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Section 2 — What It Is
══════════════════════════════════════════════════════════════════ */
function WhatItIs() {
  return (
    <section className="bg-cream py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.div
          {...fadeUp}
          className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start"
        >
          <h2 className="font-serif text-4xl font-light text-warm-dark lg:text-5xl">
            What It Is
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-warm-dark/70">
            <p>
              Portal.Place is building a village campus for seasonal living,
              co-working, creating and learning — on a 400-acre flagship site
              owned and operated in BC, Canada for five years. The model scales
              through a membership layer, operational templates, and an
              established media platform.
            </p>
            <p>
              This is not a concept. We have land, infrastructure, guests, and
              revenue. The $3M bridge de-risks the flagship site for a $10–20M
              expansion raise.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Section 3 — Why It Works
══════════════════════════════════════════════════════════════════ */
function WhyItWorks() {
  const stats = MARKET_STATS;

  return (
    <section className="bg-off-white py-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.h2
          {...fadeUp}
          className="mb-10 font-serif text-4xl font-light text-warm-dark"
        >
          Why It Works
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl border border-warm-dark/8 bg-white p-6"
            >
              <p className="font-serif text-3xl font-light text-warm-dark">
                {stat.number}
              </p>
              <p className="mt-2 text-xs leading-snug text-warm-dark/60">
                {stat.label}
              </p>
              <p className="mt-2 text-xs font-medium text-amber">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Section 4 — What We Have
══════════════════════════════════════════════════════════════════ */
function WhatWeHave() {
  const property = PROPERTY_ITEMS;
  const business = BUSINESS_ITEMS;

  return (
    <section className="bg-warm-dark py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.div {...fadeUp}>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-amber">
            Proof of Concept
          </p>
          <h2 className="mb-14 font-serif text-4xl font-light text-white lg:text-5xl">
            The asset is real.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* The Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 text-xs uppercase tracking-wider text-white/40">
              The Property
            </p>
            <ul className="space-y-3">
              {property.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  <span className="text-sm leading-relaxed text-white/60">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* The Business */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="mb-4 text-xs uppercase tracking-wider text-white/40">
              The Business
            </p>
            <ul className="space-y-3">
              {business.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  <span className="text-sm leading-relaxed text-white/60">
                    {item.sensitive ? (
                      <Redacted>{item.text}</Redacted>
                    ) : (
                      item.text
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.p
          {...fadeUp}
          className="mt-12 font-serif text-base italic text-amber"
        >
          These figures reflect a minimal-crew, near-zero-marketing operation.
          The upside is in what hasn&apos;t been built yet.
        </motion.p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Section 5 — The Opportunity
══════════════════════════════════════════════════════════════════ */
function TheOpportunity() {
  const uses = BRIDGE_USES;
  const projRows = PROJECTION_ROWS;

  return (
    <section className="bg-cream py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start">
          {/* Left */}
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-4xl font-light text-warm-dark">
              The $3M Bridge
            </h2>
            <p className="mt-2 font-serif text-2xl italic text-terracotta">
              What it unlocks immediately
            </p>
            <ul className="mt-8 space-y-3">
              {uses.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  <span className="text-sm leading-relaxed text-warm-dark/70">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — projection table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="overflow-hidden rounded-xl border border-warm-dark/15">
              {/* Header */}
              <div className="grid grid-cols-4 bg-warm-dark">
                <div className="px-4 py-3 text-xs uppercase tracking-wider text-white/40"></div>
                <div className="px-4 py-3 text-xs uppercase tracking-wider text-white">
                  Current
                </div>
                <div className="px-4 py-3 text-xs uppercase tracking-wider text-white">
                  Yr 1
                </div>
                <div className="px-4 py-3 text-xs uppercase tracking-wider text-white">
                  Yr 3
                </div>
              </div>
              {/* Rows */}
              {projRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-4 ${i % 2 === 0 ? "bg-white" : "bg-off-white"} border-t border-warm-dark/8`}
                >
                  <div
                    className={`px-4 py-3 text-xs leading-snug text-warm-dark/60 ${row.bold ? "font-medium text-warm-dark" : ""}`}
                  >
                    {row.label}
                  </div>
                  <div
                    className={`px-4 py-3 text-sm text-warm-dark/70 ${row.bold ? "font-semibold text-warm-dark" : ""}`}
                  >
                    {row.sensitive ? <Redacted>{row.current}</Redacted> : row.current}
                  </div>
                  <div
                    className={`px-4 py-3 text-sm text-warm-dark/70 ${row.bold ? "font-semibold text-warm-dark" : ""}`}
                  >
                    {row.sensitive ? <Redacted>{row.yr1}</Redacted> : row.yr1}
                  </div>
                  <div
                    className={`px-4 py-3 text-sm text-warm-dark/70 ${row.bold ? "font-semibold text-warm-dark" : ""}`}
                  >
                    {row.sensitive ? <Redacted>{row.yr3}</Redacted> : row.yr3}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-warm-dark/40">
              45% occupancy, summer season only. No winter revenue in base case.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Section 6 — Investment Tiers
══════════════════════════════════════════════════════════════════ */
function InvestmentTiers() {
  return (
    <section className="bg-warm-dark py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.div {...fadeUp} className="mb-12">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-amber">
            Investment Tiers
          </p>
          <h2 className="font-serif text-4xl font-light text-white">
            Three ways in.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1 — Trailblazer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-amber/50 bg-white/5 p-7"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-amber">
              Trailblazer
            </p>
            <p className="font-serif text-4xl font-light text-white"><Redacted>$100K+</Redacted></p>
            <div className="my-5 border-t border-white/10" />
            <div className="mb-4">
              <p className="mb-1 text-xs uppercase tracking-wider text-white/40">
                Core financial terms
              </p>
              <p className="text-sm text-white/70">
                Fixed annual interest + equity kicker at next round
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-white/40">
                Core Perks
              </p>
              <ul className="space-y-2">
                {INVESTMENT_TIERS[0].perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber/60" />
                    <span className="text-sm text-white/55">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Card 2 — Homesteader */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl border border-terracotta/60 bg-white/5 py-9 px-7"
          >
            <span className="absolute right-5 top-4 rounded-full border border-terracotta/40 bg-terracotta/15 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-terracotta">
              Most Popular
            </span>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
              Homesteader
            </p>
            <p className="font-serif text-4xl font-light text-white"><Redacted>$250K+</Redacted></p>
            <div className="my-5 border-t border-white/10" />
            <div className="mb-4">
              <p className="mb-1 text-xs uppercase tracking-wider text-white/40">
                Core financial terms
              </p>
              <p className="text-sm text-white/70">
                Enhanced equity kicker terms
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-white/40">
                Everything in Trailblazer, plus:
              </p>
              <ul className="space-y-2">
                {INVESTMENT_TIERS[1].perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta/60" />
                    <span className="text-sm text-white/55">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Card 3 — Cornerstone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-mauve/60 bg-white/5 p-7"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-mauve">
              Cornerstone
            </p>
            <p className="font-serif text-4xl font-light text-white"><Redacted>$500K+</Redacted></p>
            <div className="my-5 border-t border-white/10" />
            <div className="mb-4">
              <p className="mb-1 text-xs uppercase tracking-wider text-white/40">
                Core financial terms
              </p>
              <p className="text-sm text-white/70">
                Best equity conversion terms
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-white/40">
                Everything in Homesteader, plus:
              </p>
              <ul className="space-y-2">
                {INVESTMENT_TIERS[2].perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mauve/60" />
                    <span className="text-sm text-white/55">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Section 7 — Why Here vs. Buying Land
══════════════════════════════════════════════════════════════════ */
function WhyHereVsBuyingLand() {
  const rows = COMPARISON_ROWS;

  return (
    <section className="bg-off-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.div {...fadeUp} className="mb-8">
          <h2 className="font-serif text-4xl font-light text-warm-dark">
            Why invest here instead of buying your own land?
          </h2>
          <p className="mt-4 max-w-[54ch] text-sm text-warm-dark/60">
            Our target investors are people who might otherwise spend $200–500K
            on a rural parcel in BC or Alberta. Here&apos;s the comparison:
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-warm-dark/12"
        >
          {/* Table header */}
          <div className="grid grid-cols-2">
            <div className="bg-warm-dark/8 px-5 py-3 text-xs uppercase tracking-wider text-warm-dark/60">
              Buying Rural Land
            </div>
            <div className="bg-warm-dark px-5 py-3 text-xs uppercase tracking-wider text-amber">
              Investing in Portal.Place
            </div>
          </div>
          {/* Table rows */}
          {rows.map((row, i) => (
            <div
              key={row.left}
              className={`grid grid-cols-2 border-t border-warm-dark/8 ${i % 2 === 0 ? "bg-white" : "bg-off-white"}`}
            >
              <div className="px-5 py-3 text-sm text-warm-dark/55">
                {row.left}
              </div>
              <div className="px-5 py-3 text-sm font-medium text-warm-dark">
                {row.right}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Amber callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 rounded-xl border border-amber/25 bg-amber/10 p-6 text-sm italic text-warm-dark"
        >
          Everything you want from owning rural land — access, resilience,
          community, and belonging — plus a financial return, without the
          property taxes, the broken well, and the driveway you have to plow.
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Section 8 — The Founders
══════════════════════════════════════════════════════════════════ */
function TheFounders() {
  const stats = FOUNDER_STATS;

  return (
    <section className="bg-warm-dark py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start">
          {/* Left */}
          <motion.div {...fadeUp}>
            <h2 className="mb-6 font-serif text-4xl font-light text-white">
              Mike &amp; Euvie Gilliland
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-white/55">
              <p>
                Co-founders of Future Thinkers, a globally recognized podcast
                and media platform (10M+ downloads, iTunes Top 40 Tech). We
                crowdfunded, acquired, and have operated our village destination
                in BC since 2021 — gaining hands-on experience in land
                ownership, hospitality operations, community design, and
                infrastructure development.
              </p>
              <p>
                We have a demonstrated ability to move from ideas → audience →
                capital → land → operations → repeatable systems. Portal.Place
                is the next phase of a long-running body of work.
              </p>
            </div>
          </motion.div>

          {/* Right — stat blocks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-center gap-8 lg:pt-2"
          >
            {stats.map((stat) => (
              <div key={stat.number}>
                <p className="font-serif text-4xl font-light text-amber">
                  {stat.sensitive ? (
                    <Redacted>{stat.number}</Redacted>
                  ) : (
                    stat.number
                  )}
                </p>
                <p className="mt-1 text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Section 9 — Contact & CTA
══════════════════════════════════════════════════════════════════ */
function ContactCTA() {
  const actions = [
    {
      title: "Book a Call",
      body: "30 minutes with Mike or Euvie",
      linkLabel: "Book Now →",
      href: "http://futurethinkers.org/call60",
      external: true,
    },
    {
      title: "Site Visit",
      body: "Come see the 400 acres in person",
      linkLabel: "Request Visit →",
      href: "mailto:contact@futurethinkers.org",
      external: false,
    },
    {
      title: "Due Diligence",
      body: "Full financials, legal structure, and data room",
      linkLabel: "Request Package →",
      href: "mailto:contact@futurethinkers.org",
      external: false,
    },
  ];

  return (
    <section className="bg-amber py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <motion.div {...fadeUp}>
          <h2 className="font-serif text-5xl font-light text-white">
            Let&apos;s talk.
          </h2>
          <p className="mt-4 max-w-[44ch] text-sm text-white/80">
            The bridge round is the entry point. Book a call, schedule a site
            visit, or request the full due diligence package.
          </p>
        </motion.div>

        {/* Action cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {actions.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl bg-white p-6"
            >
              <p className="font-medium text-warm-dark">{action.title}</p>
              <p className="mt-1 text-sm text-warm-dark/55">{action.body}</p>
              {action.external ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-amber hover:underline"
                >
                  {action.linkLabel}
                </a>
              ) : (
                <a
                  href={action.href}
                  className="mt-4 inline-block text-sm font-medium text-amber hover:underline"
                >
                  {action.linkLabel}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Links row */}
        <motion.div
          {...fadeUp}
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70"
        >
          <a
            href="https://portal.place"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Portal.Place
          </a>
          <span className="text-white/30">|</span>
          <a
            href="https://futurethinkers.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            FutureThinkers.org
          </a>
          <span className="text-white/30">|</span>
          <a
            href="https://instagram.com/futurethinkers"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            @futurethinkers
          </a>
          <span className="text-white/30">|</span>
          <a href="tel:+17785865613" className="hover:text-white">
            +1 778-586-5613
          </a>
          <span className="text-white/30">|</span>
          <a
            href="mailto:contact@futurethinkers.org"
            className="hover:text-white"
          >
            contact@futurethinkers.org
          </a>
        </motion.div>

        {/* Legal */}
        <motion.div {...fadeUp} className="mt-8 space-y-2">
          <p className="max-w-[80ch] text-xs text-white/45">
            This one-pager is for informational purposes only and does not
            constitute an offer to sell securities. Investments involve risk.
            Consult your financial and legal advisors. Securities offered under
            applicable BC/AB exemptions.
          </p>
          <p className="text-xs text-white/45">
            View the full investor deck at{" "}
            <Link href="/deck" className="underline hover:text-white/70">
              portal.place/deck
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Page export
══════════════════════════════════════════════════════════════════ */
export default function OnePagerPage() {
  return (
    <>
      <Header />
      <WhatItIs />
      <WhyItWorks />
      <WhatWeHave />
      <TheOpportunity />
      <InvestmentTiers />
      <WhyHereVsBuyingLand />
      <TheFounders />
      <ContactCTA />
    </>
  );
}

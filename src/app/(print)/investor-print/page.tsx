"use client";

import { useEffect } from "react";
import Link from "next/link";
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
} from "../../one-pager/data";
import { Redacted } from "@/components/ui/Redacted";

/* ─── Auto-print on load ─────────────────────────────────────────── */
function PrintTrigger() {
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 800);
    return () => clearTimeout(timer);
  }, []);
  return null;
}

/* ─── Shared styles ──────────────────────────────────────────────── */
const SECTION = "mb-10 pb-10 border-b border-gray-200";
const EYEBROW = "text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3";
const H2 = "font-serif text-3xl font-light text-gray-900 mb-4";
const H3 = "font-serif text-xl font-light text-gray-900 mb-2";
const BODY = "text-sm leading-relaxed text-gray-600";
const LABEL = "text-[10px] font-semibold uppercase tracking-wider text-gray-400";

export default function InvestorPrintPage() {
  return (
    <>
      <PrintTrigger />

      {/* ── Print / screen button bar ── */}
      <div className="print:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between bg-gray-900 px-6 py-3">
        <span className="text-xs text-white/60">
          Portal.Place — Investor One-Pager
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/one-pager"
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            ← Back to web version
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Save as PDF
          </button>
        </div>
      </div>

      {/* ── Document ─────────────────────────────────────────────── */}
      <main className="mx-auto max-w-[760px] px-10 pt-20 pb-16 print:pt-6 print:px-0 print:max-w-none font-sans">

        {/* Header */}
        <header className="mb-10 pb-8 border-b-2 border-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className={EYEBROW}>Confidential — For Qualified Investors</p>
              <h1 className="font-serif text-5xl font-light text-gray-900 leading-none">
                Portal<span className="italic text-orange-500">.Place</span>
              </h1>
              <p className="mt-2 font-serif text-lg italic text-gray-500">
                Investor One-Pager · April 2026
              </p>
            </div>
            <div className="text-right text-xs text-gray-400 leading-relaxed mt-2">
              <p>contact@futurethinkers.org</p>
              <p>+1 778-586-5613</p>
              <p>portal.place/deck</p>
            </div>
          </div>

          {/* Summary table */}
          <div className="mt-6 grid grid-cols-3 gap-0 border border-gray-200 rounded-lg overflow-hidden text-sm">
            {SUMMARY_ROWS.map((row, i) => (
              <div key={row.label} className={`flex flex-col px-4 py-3 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b border-gray-100`}>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{row.label}</span>
                <span className="text-sm font-medium text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </header>

        {/* What It Is */}
        <section className={SECTION}>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className={EYEBROW}>What It Is</p>
              <h2 className={H2}>The asset is real.</h2>
              <p className={BODY}>
                Portal.Place is building a village campus for seasonal living,
                co-working, creating and learning — on a 400-acre flagship site
                owned and operated in BC, Canada for five years. The model
                scales through a membership layer, operational templates, and an
                established media platform.
              </p>
              <p className={`${BODY} mt-3 font-medium text-gray-800`}>
                This is not a concept. We have land, infrastructure, guests, and
                revenue. The $3M bridge de-risks the site for a $10–20M
                expansion raise.
              </p>
            </div>
            <div>
              <p className={EYEBROW}>Why It Works</p>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {MARKET_STATS.map((stat) => (
                  <div key={stat.number} className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                    <p className="font-serif text-2xl font-light text-orange-500">{stat.number}</p>
                    <p className="text-xs text-gray-500 leading-snug mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Asset */}
        <section className={SECTION}>
          <p className={EYEBROW}>The Property & Business</p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className={H3}>The Land</h3>
              <ul className="space-y-1.5">
                {PROPERTY_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={H3}>The Business</h3>
              <ul className="space-y-1.5">
                {BUSINESS_ITEMS.map((item) => (
                  <li key={item.text} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange-400" />
                    {item.sensitive ? <Redacted>{item.text}</Redacted> : item.text}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs italic text-gray-400 leading-snug">
                These figures reflect a minimal-crew, near-zero-marketing
                operation. The upside is in what hasn&apos;t been built yet.
              </p>
            </div>
          </div>
        </section>

        {/* Projections */}
        <section className={SECTION}>
          <p className={EYEBROW}>Conservative Revenue Projections</p>
          <p className="text-xs text-gray-500 mb-4">
            45% occupancy assumption · Summer season only · No winter revenue in base case
          </p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left px-4 py-2.5 text-xs font-medium rounded-tl-lg">Revenue Stream</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium">Current</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium">Year 1</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium rounded-tr-lg">Year 3</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTION_ROWS.filter((r) => !r.bold).map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2.5 text-xs text-gray-700">{row.label}</td>
                  <td className="px-4 py-2.5 text-xs text-right text-gray-500">
                    {row.sensitive ? <Redacted>{row.current}</Redacted> : row.current}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right text-gray-700">
                    {row.sensitive ? <Redacted>{row.yr1}</Redacted> : row.yr1}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right font-medium text-gray-900">
                    {row.sensitive ? <Redacted>{row.yr3}</Redacted> : row.yr3}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-900 text-white">
                <td className="px-4 py-2.5 text-xs font-semibold rounded-bl-lg">Total</td>
                <td className="px-4 py-2.5 text-xs text-right text-white/70"><Redacted>~$250K</Redacted></td>
                <td className="px-4 py-2.5 text-xs text-right text-white/90"><Redacted>~$850K</Redacted></td>
                <td className="px-4 py-2.5 text-xs text-right font-bold text-orange-400 rounded-br-lg"><Redacted>~$2.0M</Redacted></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Deal Terms & Tiers */}
        <section className={SECTION}>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className={EYEBROW}>Deal Terms</p>
              <h2 className={H2}>The Raise</h2>
              <p className={`${BODY} mb-4`}>
                Raised through a Special Purpose Vehicle (SPV) — a new BC
                corporation that pools capital from multiple aligned investors and
                holds the mortgage as a single first-position lender on the Giant
                Supernova Holdings land title. Clean on title. Community of
                financially aligned investors.
              </p>
              <div className="space-y-2">
                {[
                  ["Instrument", "Senior secured bridge via SPV"],
                  ["Timeline", "18–24 months"],
                  ["Security", "First position on land title"],
                  ["Return", "Fixed annual interest"],
                  ["Equity Kicker", "~50% target upside at next round"],
                  ["Repayment", "First close of $20M raise or refi"],
                  ["Min. Ticket", "$100,000 CAD"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 text-xs">
                    <span className="w-28 shrink-0 text-gray-400 font-medium">{k}</span>
                    <span className="text-gray-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className={EYEBROW}>Investment Tiers</p>
              <div className="space-y-3 mt-1">
                {INVESTMENT_TIERS.map((tier, idx) => {
                  const colors = ["border-orange-400", "border-red-400", "border-purple-400"];
                  return (
                    <div key={tier.name} className={`rounded-lg border-l-4 ${colors[idx]} bg-gray-50 px-4 py-3`}>
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-900">{tier.name}</span>
                        <span className="font-serif text-lg font-light text-gray-800"><Redacted>{tier.amount}</Redacted></span>
                      </div>
                      <ul className="space-y-0.5">
                        {tier.perks.map((p) => (
                          <li key={p} className="text-[10px] text-gray-500 flex items-start gap-1.5">
                            <span className="mt-1 h-0.5 w-0.5 shrink-0 rounded-full bg-gray-400" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Why here vs. buying land */}
        <section className={SECTION}>
          <p className={EYEBROW}>Why Invest Here vs. Buying Your Own Land?</p>
          <p className="text-xs text-gray-500 mb-4">
            Our target investors are people who might otherwise spend $200–500K on a rural parcel in BC or Alberta.
          </p>
          <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Buying Rural Land</div>
            <div className="bg-gray-900 px-4 py-2 font-semibold text-orange-400 uppercase tracking-wider border-b border-gray-200">Investing in Portal.Place</div>
            {COMPARISON_ROWS.map((row, i) => (
              <>
                <div key={`bad-${i}`} className={`px-4 py-2.5 text-gray-600 border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>{row.left}</div>
                <div key={`good-${i}`} className={`px-4 py-2.5 text-gray-800 font-medium border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>{row.right}</div>
              </>
            ))}
          </div>
          <p className="mt-4 text-xs italic text-gray-500 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
            Everything you want from owning rural land — access, resilience, community, and belonging — plus a financial return, without the property taxes, the broken well, and the driveway you have to plow.
          </p>
        </section>

        {/* Founders */}
        <section className={SECTION}>
          <p className={EYEBROW}>The Founders</p>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <h2 className="font-serif text-2xl font-light text-gray-900 mb-3">Mike & Euvie Gilliland</h2>
              <p className={BODY}>
                Co-founders of Future Thinkers, a globally recognized podcast (10M+
                downloads, iTunes Top 40 Tech). We crowdfunded, acquired, and have
                operated our village destination in BC since 2021 — gaining hands-on
                experience in land ownership, hospitality, community design, and
                infrastructure development.
              </p>
              <p className={`${BODY} mt-2 font-medium text-gray-800`}>
                Ideas → audience → capital → land → operations → repeatable systems.
              </p>
            </div>
            <div className="space-y-4">
              {FOUNDER_STATS.map((stat) => (
                <div key={stat.number}>
                  <p className="font-serif text-2xl font-light text-orange-500">
                    {stat.sensitive ? <Redacted>{stat.number}</Redacted> : stat.number}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-6">
          <p className={EYEBROW}>Next Steps</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              ["Book a Call", "30 min with Mike or Euvie", "futurethinkers.org/call60"],
              ["Site Visit", "Come see the 400 acres in person", "contact@futurethinkers.org"],
              ["Full Deck", "Detailed financials & due diligence", "portal.place/deck"],
            ].map(([title, desc, link]) => (
              <div key={title} className="rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-500 mb-2">{desc}</p>
                <p className="text-xs text-orange-500 font-medium">{link}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-[10px] text-gray-400">
            Portal.Place · Wells Gray Village · Giant Supernova Holdings Inc.
          </p>
          <p className="text-[10px] text-gray-400 max-w-[48ch] text-right">
            Confidential. For informational purposes only. Not an offer to sell securities.
            All investments involve risk. Consult your financial and legal advisors.
          </p>
        </footer>
      </main>

      {/* ── Print styles ─────────────────────────────────────────── */}
      <style>{`
        @media print {
          @page {
            margin: 1.5cm 1.8cm;
            size: A4;
          }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          main { padding-top: 0 !important; max-width: 100% !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          section { page-break-inside: avoid; }
        }
      `}</style>
    </>
  );
}

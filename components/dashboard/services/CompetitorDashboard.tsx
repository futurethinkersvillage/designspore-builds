"use client";
import { useState } from "react";

/* ── MOCK DATA ──────────────────────────────────────────────── */

const competitors = [
  {
    name: "Clearwater Plumbing Co.",
    website: "clearwaterplumbing.ca",
    category: "Plumbing",
    serviceCall: "$115",
    featured: "Free camera inspection with any drain job",
    change: "NEW",
    changeType: "new",
    googleRating: "4.6",
    reviewCount: 32,
    responseTime: "~4 hrs",
    seoScore: 68,
  },
  {
    name: "Thompson Valley Mechanical",
    website: "thompsonvalleymech.com",
    category: "Plumbing & HVAC",
    serviceCall: "$99",
    featured: "Spring tune-up special — $149",
    change: "↓ $20",
    changeType: "down",
    googleRating: "4.3",
    reviewCount: 21,
    responseTime: "~8 hrs",
    seoScore: 54,
  },
  {
    name: "Rapid Rooter Plumbing",
    website: "rapidrooter.ca",
    category: "Drain Specialists",
    serviceCall: "$89",
    featured: "Senior discount 10% off",
    change: "No change",
    changeType: "none",
    googleRating: "4.8",
    reviewCount: 47,
    responseTime: "~2 hrs",
    seoScore: 72,
  },
  {
    name: "BC Interior Plumbing",
    website: "bcinteriorplumbing.ca",
    category: "Residential & Commercial",
    serviceCall: "$125",
    featured: "Hot water tank install — $1,499 flat",
    change: "↑ $25",
    changeType: "up",
    googleRating: "4.1",
    reviewCount: 14,
    responseTime: "> 24 hrs",
    seoScore: 41,
  },
];

const pricingComparison = [
  { service: "Service call / diagnostic", you: "$95", c1: "$115", c2: "$99", c3: "$89", c4: "$125" },
  { service: "Drain clearing (standard)", you: "$175", c1: "$195", c2: "$189", c3: "$165", c4: "$210" },
  { service: "Hot water tank install", you: "$1,350", c1: "$1,400", c2: "$1,550", c3: "N/A", c4: "$1,499" },
  { service: "Emergency after-hours", you: "$195", c1: "$195", c2: "$175", c3: "$149", c4: "$225" },
  { service: "Toilet replacement", you: "$350", c1: "$395", c2: "$375", c3: "N/A", c4: "$420" },
  { service: "Kitchen re-pipe", you: "$2,200", c1: "$2,500", c2: "$2,400", c3: "N/A", c4: "$2,800" },
];

const recentChanges = [
  { text: "Thompson Valley dropped service call from $119 to $99", date: "Apr 10", type: "down" },
  { text: "Clearwater Plumbing launched free camera inspection promo", date: "Apr 9", type: "new" },
  { text: "BC Interior raised hot water tank install to $1,499 (was $1,474)", date: "Apr 8", type: "up" },
  { text: "Rapid Rooter added senior discount to all services", date: "Apr 6", type: "new" },
  { text: "Thompson Valley removed 'same day service' from homepage messaging", date: "Apr 4", type: "messaging" },
  { text: "Clearwater Plumbing updated Google Business Profile cover photo", date: "Apr 3", type: "profile" },
  { text: "BC Interior launched new website redesign with online booking", date: "Apr 1", type: "new" },
];

const adActivity = [
  { competitor: "Clearwater Plumbing", platform: "Google Ads", query: "emergency plumber clearwater", position: "Ad #1", firstSeen: "Mar 28", status: "active" },
  { competitor: "Rapid Rooter", platform: "Google Ads", query: "drain cleaning kamloops", position: "Ad #2", firstSeen: "Apr 2", status: "active" },
  { competitor: "Thompson Valley", platform: "Facebook", query: "Spring tune-up campaign", position: "Sponsored", firstSeen: "Apr 5", status: "active" },
  { competitor: "BC Interior", platform: "Google Ads", query: "hot water tank bc", position: "Ad #3", firstSeen: "Mar 15", status: "paused" },
];

const contentActivity = [
  { competitor: "Clearwater Plumbing", type: "Blog Post", title: "5 Signs Your Hot Water Tank Is Failing", date: "Apr 8", engagement: "12 shares" },
  { competitor: "Rapid Rooter", type: "Google Post", title: "Spring drain maintenance tips", date: "Apr 5", engagement: "3 likes" },
  { competitor: "Thompson Valley", type: "Facebook Post", title: "Before & after bathroom renovation photos", date: "Apr 3", engagement: "47 likes, 8 shares" },
  { competitor: "BC Interior", type: "Website Update", title: "Added online booking system", date: "Apr 1", engagement: "—" },
];

const reviewTrends = [
  { competitor: "Rapid Rooter", last30: 6, avg: 4.8, trend: "steady", sentiment: "Praised for speed" },
  { competitor: "Clearwater Plumbing", last30: 4, avg: 4.6, trend: "up", sentiment: "Recent positive surge" },
  { competitor: "Thompson Valley", last30: 2, avg: 4.3, trend: "down", sentiment: "2 complaints about wait time" },
  { competitor: "BC Interior", last30: 1, avg: 4.1, trend: "down", sentiment: "Low volume, pricing complaint" },
  { competitor: "Your Business", last30: 5, avg: 4.9, trend: "up", sentiment: "Leading on quality + speed" },
];

const changeStyle: Record<string, string> = {
  new: "bg-gold/10 text-gold border-gold/20",
  down: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  up: "bg-red-500/10 text-red-400 border-red-500/20",
  none: "bg-white/[0.06] text-white/30 border-white/[0.08]",
  messaging: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  profile: "bg-blue-500/10 text-blue-300 border-blue-500/20",
};

type Tab = "overview" | "pricing" | "ads" | "content" | "reviews";

/* ── COMPONENT ──────────────────────────────────────────────── */

export default function CompetitorDashboard() {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Pricing" },
    { id: "ads", label: "Ads & Search" },
    { id: "content", label: "Content" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Competitor Offer & Pricing Monitor</p>
        <h1 className="text-2xl font-bold text-white">Market Intelligence</h1>
      </div>

      {/* Last updated banner */}
      <div className="flex items-center gap-3 px-5 py-3 bg-raised border border-white/[0.06] rounded-xl">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <p className="text-sm text-white/60">Monitoring <span className="text-white">4 competitors</span> · Last scan <span className="text-white">April 10, 2026</span> · Next update in <span className="text-white">4 days</span></p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-raised border border-white/[0.06] rounded-xl p-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-gold/[0.12] text-gold border border-gold/20"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ──────────────────────────────────────── */}
      {tab === "overview" && (
        <>
          {/* Competitor scorecards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitors.map((c) => (
              <div key={c.name} className="bg-raised border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-colors">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-base font-bold text-white">{c.name}</p>
                    <p className="text-xs text-white/35 mt-0.5">{c.category} · {c.website}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${changeStyle[c.changeType]}`}>
                    {c.change}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="py-2 border-t border-white/[0.05]">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">Service Call</span>
                    <p className="text-sm font-bold text-white tabular-nums mt-0.5">{c.serviceCall}</p>
                  </div>
                  <div className="py-2 border-t border-white/[0.05]">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">Google Rating</span>
                    <p className="text-sm font-bold text-white tabular-nums mt-0.5">{c.googleRating} ★ <span className="text-white/30 font-normal text-xs">({c.reviewCount})</span></p>
                  </div>
                  <div className="py-2 border-t border-white/[0.05]">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">Response Time</span>
                    <p className="text-sm font-bold text-white mt-0.5">{c.responseTime}</p>
                  </div>
                  <div className="py-2 border-t border-white/[0.05]">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">SEO Score</span>
                    <p className={`text-sm font-bold tabular-nums mt-0.5 ${c.seoScore >= 70 ? "text-emerald-400" : c.seoScore >= 50 ? "text-yellow-300" : "text-red-400"}`}>{c.seoScore}/100</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.05]">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">Current Offer</span>
                  <p className="text-xs text-white/60 mt-1">{c.featured}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Changes feed */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05]">
              <p className="text-sm font-semibold text-white">Recent Changes Detected</p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentChanges.map((ch, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-4">
                  <div className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${ch.type === "down" ? "bg-emerald-400" : ch.type === "up" ? "bg-red-400" : ch.type === "new" ? "bg-gold" : ch.type === "messaging" ? "bg-purple-400" : "bg-blue-400"}`} />
                  <p className="text-sm text-white/65 leading-snug flex-1">{ch.text}</p>
                  <span className="shrink-0 text-xs text-white/25">{ch.date}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── PRICING TAB ───────────────────────────────────────── */}
      {tab === "pricing" && (
        <>
          {/* Your position summary */}
          <div className="bg-gold/[0.06] border border-gold/20 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Your Pricing Position</p>
            <p className="text-sm text-white/70 leading-relaxed">
              You are the <span className="text-white font-semibold">lowest-priced</span> on service calls ($95) and hot water tank installs ($1,350). Rapid Rooter undercuts you on emergency after-hours by $46. You have room to raise standard drain clearing by $10–15 without losing competitiveness.
            </p>
          </div>

          {/* Pricing table */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05]">
              <p className="text-sm font-semibold text-white">Service-by-Service Comparison</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/25 font-semibold">Service</th>
                    <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-gold font-semibold">You</th>
                    {competitors.map(c => (
                      <th key={c.name} className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-white/25 font-semibold whitespace-nowrap">{c.name.split(" ")[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {pricingComparison.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-sm text-white/70">{row.service}</td>
                      <td className="px-4 py-3.5 text-sm text-gold font-bold tabular-nums text-center">{row.you}</td>
                      <td className="px-4 py-3.5 text-sm text-white/50 tabular-nums text-center">{row.c1}</td>
                      <td className="px-4 py-3.5 text-sm text-white/50 tabular-nums text-center">{row.c2}</td>
                      <td className="px-4 py-3.5 text-sm text-white/50 tabular-nums text-center">{row.c3}</td>
                      <td className="px-4 py-3.5 text-sm text-white/50 tabular-nums text-center">{row.c4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price alert */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-3">Price Movement — Last 90 Days</p>
            <div className="space-y-3">
              {[
                { name: "Thompson Valley", direction: "down", detail: "Dropped service call $119 → $99 (−17%)", date: "Apr 10" },
                { name: "BC Interior", direction: "up", detail: "Raised hot water tank install $1,474 → $1,499 (+2%)", date: "Apr 8" },
                { name: "Rapid Rooter", direction: "none", detail: "No pricing changes in 90 days", date: "—" },
                { name: "Clearwater Plumbing", direction: "none", detail: "No pricing changes — added free camera inspection promo instead", date: "Apr 9" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-dark">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${p.direction === "down" ? "bg-emerald-400" : p.direction === "up" ? "bg-red-400" : "bg-white/20"}`} />
                  <span className="text-sm text-white/70 font-semibold w-44 shrink-0">{p.name}</span>
                  <span className="text-sm text-white/50 flex-1">{p.detail}</span>
                  <span className="text-xs text-white/25 shrink-0">{p.date}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── ADS & SEARCH TAB ──────────────────────────────────── */}
      {tab === "ads" && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Competitors running ads", value: "3 of 4" },
              { label: "Keywords being targeted", value: "7" },
              { label: "Est. monthly ad spend (combined)", value: "$1,200–$2,400" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs text-white/40 mb-2">{label}</p>
                <p className="text-xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Ad activity table */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05]">
              <p className="text-sm font-semibold text-white">Active Ads & Sponsored Placements</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {["Competitor", "Platform", "Query / Campaign", "Position", "First Seen", "Status"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/25 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {adActivity.map((ad, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-sm font-semibold text-white">{ad.competitor}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ad.platform === "Google Ads" ? "bg-gold/10 text-gold border-gold/20" : "bg-blue-500/10 text-blue-300 border-blue-500/20"}`}>
                          {ad.platform}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white/60">{ad.query}</td>
                      <td className="px-5 py-3.5 text-sm text-white/45">{ad.position}</td>
                      <td className="px-5 py-3.5 text-xs text-white/35">{ad.firstSeen}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${ad.status === "active" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : "bg-white/[0.06] text-white/30 border-white/[0.08]"}`}>
                          {ad.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Search visibility comparison */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Local Search Visibility — Top Keywords</p>
            <div className="space-y-4">
              {[
                { keyword: "plumber clearwater bc", you: 3, c1: 7, c2: 5, c3: 1, c4: 12 },
                { keyword: "emergency plumbing clearwater", you: 1, c1: 4, c2: 8, c3: 2, c4: 15 },
                { keyword: "drain cleaning kamloops", you: 14, c1: 18, c2: 6, c3: 3, c4: 22 },
                { keyword: "hot water tank repair bc", you: 8, c1: 11, c2: 9, c3: null, c4: 5 },
              ].map((kw, i) => (
                <div key={i} className="border border-white/[0.05] rounded-xl p-4 bg-dark">
                  <p className="text-sm text-white/70 font-semibold mb-3">&quot;{kw.keyword}&quot;</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: "You", pos: kw.you, highlight: true },
                      { label: "Clearwater", pos: kw.c1, highlight: false },
                      { label: "Thompson", pos: kw.c2, highlight: false },
                      { label: "Rapid", pos: kw.c3, highlight: false },
                      { label: "BC Int.", pos: kw.c4, highlight: false },
                    ].map(({ label, pos, highlight }) => (
                      <div key={label} className="text-center">
                        <p className="text-[10px] text-white/25 mb-1">{label}</p>
                        <p className={`text-sm font-bold tabular-nums ${highlight ? "text-gold" : pos && pos <= 5 ? "text-emerald-400" : pos && pos <= 10 ? "text-yellow-300" : "text-white/30"}`}>
                          {pos ? `#${pos}` : "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CONTENT TAB ───────────────────────────────────────── */}
      {tab === "content" && (
        <>
          {/* Content summary */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Blog posts (30 days)", value: "1" },
              { label: "Social posts", value: "3" },
              { label: "Website updates", value: "1" },
              { label: "Google Business posts", value: "1" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs text-white/40 mb-2">{label}</p>
                <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
              </div>
            ))}
          </div>

          {/* Content feed */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05]">
              <p className="text-sm font-semibold text-white">Competitor Content Activity</p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {contentActivity.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-white">{item.competitor}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.type === "Blog Post" ? "bg-gold/10 text-gold border-gold/20" :
                        item.type === "Facebook Post" ? "bg-blue-500/10 text-blue-300 border-blue-500/20" :
                        item.type === "Google Post" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" :
                        "bg-purple-500/10 text-purple-300 border-purple-500/20"
                      }`}>{item.type}</span>
                    </div>
                    <p className="text-sm text-white/60">{item.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-white/25">{item.date}</p>
                    <p className="text-xs text-white/40 mt-0.5">{item.engagement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social media presence */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Social Media Presence</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wider text-white/25 font-semibold">Competitor</th>
                    <th className="text-center px-4 py-2.5 text-[10px] uppercase tracking-wider text-white/25 font-semibold">Facebook</th>
                    <th className="text-center px-4 py-2.5 text-[10px] uppercase tracking-wider text-white/25 font-semibold">Instagram</th>
                    <th className="text-center px-4 py-2.5 text-[10px] uppercase tracking-wider text-white/25 font-semibold">Posts/mo</th>
                    <th className="text-center px-4 py-2.5 text-[10px] uppercase tracking-wider text-white/25 font-semibold">Avg. Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {[
                    { name: "You", fb: "312 followers", ig: "—", posts: "2", eng: "Medium" },
                    { name: "Clearwater Plumbing", fb: "489 followers", ig: "124 followers", posts: "4", eng: "Medium" },
                    { name: "Thompson Valley", fb: "267 followers", ig: "—", posts: "3", eng: "High" },
                    { name: "Rapid Rooter", fb: "198 followers", ig: "—", posts: "1", eng: "Low" },
                    { name: "BC Interior", fb: "87 followers", ig: "—", posts: "0", eng: "—" },
                  ].map((row, i) => (
                    <tr key={i} className={`hover:bg-white/[0.02] transition-colors ${i === 0 ? "bg-gold/[0.03]" : ""}`}>
                      <td className={`px-4 py-3.5 text-sm font-semibold ${i === 0 ? "text-gold" : "text-white"}`}>{row.name}</td>
                      <td className="px-4 py-3.5 text-sm text-white/50 text-center">{row.fb}</td>
                      <td className="px-4 py-3.5 text-sm text-white/50 text-center">{row.ig}</td>
                      <td className="px-4 py-3.5 text-sm text-white/50 text-center tabular-nums">{row.posts}</td>
                      <td className="px-4 py-3.5 text-sm text-white/40 text-center">{row.eng}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── REVIEWS TAB ───────────────────────────────────────── */}
      {tab === "reviews" && (
        <>
          {/* Review comparison */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05]">
              <p className="text-sm font-semibold text-white">Review Benchmark — Last 30 Days</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {["Business", "New Reviews", "Avg. Rating", "Trend", "Sentiment Summary"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/25 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {reviewTrends.map((r, i) => {
                    const isYou = r.competitor === "Your Business";
                    return (
                      <tr key={i} className={`hover:bg-white/[0.02] transition-colors ${isYou ? "bg-gold/[0.03]" : ""}`}>
                        <td className={`px-5 py-3.5 text-sm font-semibold ${isYou ? "text-gold" : "text-white"}`}>{r.competitor}</td>
                        <td className="px-5 py-3.5 text-sm text-white/60 tabular-nums">{r.last30}</td>
                        <td className="px-5 py-3.5 text-sm text-white/60 tabular-nums">{r.avg} ★</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold ${r.trend === "up" ? "text-emerald-400" : r.trend === "down" ? "text-red-400" : "text-white/30"}`}>
                            {r.trend === "up" ? "↑ Improving" : r.trend === "down" ? "↓ Declining" : "— Steady"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-white/45">{r.sentiment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Review velocity */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Review Velocity — Reviews Per Month (6-Month View)</p>
            <div className="space-y-3">
              {[
                { name: "Your Business", bars: [3, 4, 3, 5, 4, 5], color: "bg-gold" },
                { name: "Rapid Rooter", bars: [4, 5, 6, 5, 7, 6], color: "bg-emerald-400" },
                { name: "Clearwater Plumbing", bars: [2, 2, 3, 2, 3, 4], color: "bg-blue-400" },
                { name: "Thompson Valley", bars: [3, 3, 2, 1, 2, 2], color: "bg-purple-400" },
                { name: "BC Interior", bars: [1, 0, 1, 1, 0, 1], color: "bg-white/20" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className={`w-40 shrink-0 text-xs font-semibold ${i === 0 ? "text-gold" : "text-white/50"}`}>{row.name}</span>
                  <div className="flex-1 flex items-end gap-1 h-6">
                    {row.bars.map((val, j) => (
                      <div
                        key={j}
                        className={`flex-1 rounded-sm ${row.color} opacity-70`}
                        style={{ height: `${(val / 7) * 100}%`, minHeight: val > 0 ? 3 : 0 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/25 tabular-nums w-8 text-right">{row.bars[row.bars.length - 1]}/mo</span>
                </div>
              ))}
              <div className="flex items-center gap-4 mt-1">
                <span className="w-40 shrink-0" />
                <div className="flex-1 flex justify-between">
                  {["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map(m => (
                    <span key={m} className="text-[9px] text-white/15 text-center flex-1">{m}</span>
                  ))}
                </div>
                <span className="w-8" />
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="bg-gold/[0.06] border border-gold/20 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">Insight</p>
            <p className="text-sm text-white/70 leading-relaxed">
              You have the <span className="text-white font-semibold">highest average rating (4.9)</span> in the market. Rapid Rooter leads on volume (6/mo) but your review quality is stronger. Thompson Valley is declining — two complaints about wait times in the last 30 days may create an opportunity to capture their dissatisfied customers.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

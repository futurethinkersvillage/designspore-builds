const competitors = [
  {
    name: "Clearwater Plumbing Co.",
    category: "Plumbing",
    serviceCall: "$115",
    featured: "Free camera inspection with any drain job",
    change: "NEW",
    changeType: "new",
    lastChecked: "Apr 10",
  },
  {
    name: "Thompson Valley Mechanical",
    category: "Plumbing & HVAC",
    serviceCall: "$99",
    featured: "Spring tune-up special — $149",
    change: "↓ $20",
    changeType: "down",
    lastChecked: "Apr 10",
  },
  {
    name: "Rapid Rooter Plumbing",
    category: "Drain Specialists",
    serviceCall: "$89",
    featured: "Senior discount 10% off",
    change: "No change",
    changeType: "none",
    lastChecked: "Apr 9",
  },
  {
    name: "BC Interior Plumbing",
    category: "Residential & Commercial",
    serviceCall: "$125",
    featured: "Hot water tank install — $1,499 flat",
    change: "↑ $25",
    changeType: "up",
    lastChecked: "Apr 10",
  },
];

const changeStyle: Record<string, string> = {
  new: "bg-gold/10 text-gold border-gold/20",
  down: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  up: "bg-red-500/10 text-red-400 border-red-500/20",
  none: "bg-white/[0.06] text-white/30 border-white/[0.08]",
};

const recentChanges = [
  { text: "Thompson Valley dropped service call from $119 to $99", date: "Apr 10", type: "down" },
  { text: "Clearwater Plumbing launched free camera inspection promo", date: "Apr 9", type: "new" },
  { text: "BC Interior raised hot water tank install to $1,499 (was $1,474)", date: "Apr 8", type: "up" },
  { text: "Rapid Rooter added senior discount to all services", date: "Apr 6", type: "new" },
  { text: "Thompson Valley removed 'same day service' from homepage messaging", date: "Apr 4", type: "none" },
];

export default function CompetitorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Competitor Offer & Pricing Monitor</p>
        <h1 className="text-2xl font-bold text-white">Market Intelligence</h1>
      </div>

      {/* Last updated banner */}
      <div className="flex items-center gap-3 px-5 py-3 bg-raised border border-white/[0.06] rounded-xl">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <p className="text-sm text-white/60">Last monitored <span className="text-white">April 10, 2026</span> · Next update in <span className="text-white">4 days</span></p>
      </div>

      {/* Competitor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitors.map((c) => (
          <div key={c.name} className="bg-raised border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-colors">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-base font-bold text-white">{c.name}</p>
                <p className="text-xs text-white/35 mt-0.5">{c.category}</p>
              </div>
              <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${changeStyle[c.changeType]}`}>
                {c.change}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-t border-white/[0.05]">
                <span className="text-xs text-white/35">Service call fee</span>
                <span className="text-sm font-bold text-white tabular-nums">{c.serviceCall}</span>
              </div>
              <div className="flex items-start justify-between py-2 border-t border-white/[0.05] gap-3">
                <span className="text-xs text-white/35 shrink-0">Current offer</span>
                <span className="text-xs text-white/60 text-right">{c.featured}</span>
              </div>
            </div>
            <p className="text-[10px] text-white/20 mt-3">Checked {c.lastChecked}</p>
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
              <div className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${ch.type === "down" ? "bg-emerald-400" : ch.type === "up" ? "bg-red-400" : ch.type === "new" ? "bg-gold" : "bg-white/20"}`} />
              <p className="text-sm text-white/65 leading-snug flex-1">{ch.text}</p>
              <span className="shrink-0 text-xs text-white/25">{ch.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

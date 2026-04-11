const issues = [
  { severity: "critical", text: "3 pages missing meta description", fix: "Add unique meta descriptions to Services, About, and Contact pages" },
  { severity: "critical", text: "Page speed score below 70 on mobile", fix: "Compress hero image (currently 2.4MB) and defer non-critical scripts" },
  { severity: "critical", text: "Missing XML sitemap", fix: "Generate and submit sitemap to Google Search Console" },
  { severity: "warning", text: "6 images missing alt text", fix: "Add descriptive alt attributes to gallery images" },
  { severity: "warning", text: "H1 tag missing on Services page", fix: "Add primary heading to Services page" },
  { severity: "warning", text: "No schema markup on homepage", fix: "Add LocalBusiness schema for improved local search visibility" },
  { severity: "pass", text: "SSL certificate valid and up to date", fix: "" },
  { severity: "pass", text: "Mobile responsive design detected", fix: "" },
  { severity: "pass", text: "Google Business Profile linked", fix: "" },
];

const rankings = [
  { keyword: "plumber clearwater bc", position: 3, change: +2, volume: "90/mo" },
  { keyword: "emergency plumbing clearwater", position: 1, change: 0, volume: "40/mo" },
  { keyword: "drain cleaning kamloops", position: 14, change: +5, volume: "210/mo" },
  { keyword: "hot water tank repair bc interior", position: 8, change: +1, volume: "70/mo" },
  { keyword: "plumber near me", position: 22, change: -2, volume: "1,200/mo" },
];

const severityStyle = {
  critical: { dot: "bg-red-400", badge: "bg-red-500/10 text-red-400 border-red-500/20", label: "Critical" },
  warning: { dot: "bg-yellow-400", badge: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20", label: "Warning" },
  pass: { dot: "bg-emerald-400", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", label: "Pass" },
};

export default function SeoDashboard() {
  const critical = issues.filter(i => i.severity === "critical").length;
  const warnings = issues.filter(i => i.severity === "warning").length;
  const passes = issues.filter(i => i.severity === "pass").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">SEO Health Check</p>
        <h1 className="text-2xl font-bold text-white">Search Performance</h1>
      </div>

      {/* Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-card border border-white/[0.07] rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-xs text-white/40 mb-3 text-center">Health Score</p>
          <p className="text-5xl font-bold text-yellow-300 tabular-nums">74</p>
          <p className="text-xs text-white/30 mt-1">/100</p>
          <p className="text-xs text-emerald-400 mt-2 font-semibold">↑ 6 from last month</p>
        </div>
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          {[
            { label: "Critical issues", value: critical, color: "text-red-400" },
            { label: "Warnings", value: warnings, color: "text-yellow-300" },
            { label: "Checks passed", value: passes, color: "text-emerald-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
              <p className="text-xs text-white/40 mb-2">{label}</p>
              <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Issues */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <p className="text-sm font-semibold text-white">Audit Results</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {issues.map((issue, i) => {
            const s = severityStyle[issue.severity as keyof typeof severityStyle];
            return (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70">{issue.text}</p>
                  {issue.fix && <p className="text-xs text-white/30 mt-0.5">Fix: {issue.fix}</p>}
                </div>
                <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${s.badge}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rankings */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <p className="text-sm font-semibold text-white">Keyword Rankings</p>
        </div>
        <div>
          <div className="grid grid-cols-12 px-6 py-2.5 border-b border-white/[0.04]">
            <p className="col-span-5 text-[10px] text-white/25 uppercase tracking-wider">Keyword</p>
            <p className="col-span-3 text-[10px] text-white/25 uppercase tracking-wider text-center">Position</p>
            <p className="col-span-2 text-[10px] text-white/25 uppercase tracking-wider text-center">Change</p>
            <p className="col-span-2 text-[10px] text-white/25 uppercase tracking-wider text-right">Volume</p>
          </div>
          {rankings.map((r, i) => (
            <div key={i} className="grid grid-cols-12 px-6 py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
              <p className="col-span-5 text-sm text-white/65">{r.keyword}</p>
              <p className="col-span-3 text-sm font-bold text-white tabular-nums text-center">#{r.position}</p>
              <p className={`col-span-2 text-sm font-semibold tabular-nums text-center ${r.change > 0 ? "text-emerald-400" : r.change < 0 ? "text-red-400" : "text-white/30"}`}>
                {r.change > 0 ? `↑${r.change}` : r.change < 0 ? `↓${Math.abs(r.change)}` : "—"}
              </p>
              <p className="col-span-2 text-sm text-white/35 tabular-nums text-right">{r.volume}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const kpis = [
    { label: "Total Visitors", value: "1,247", delta: "+12%", up: true },
    { label: "Leads Captured", value: "34", delta: "+8%", up: true },
    { label: "Chatbot Sessions", value: "89", delta: "+21%", up: true },
    { label: "Avg. Session", value: "2m 14s", delta: "+0:18", up: true },
  ];

  const sources = [
    { name: "Organic Search", pct: 52, color: "bg-gold" },
    { name: "Direct", pct: 28, color: "bg-blue-400" },
    { name: "Referral", pct: 12, color: "bg-emerald-400" },
    { name: "Social", pct: 8, color: "bg-purple-400" },
  ];

  const pages = [
    { path: "/", title: "Homepage", sessions: 612, bounce: "38%" },
    { path: "/services", title: "Services", sessions: 284, bounce: "44%" },
    { path: "/contact", title: "Contact", sessions: 198, bounce: "22%" },
    { path: "/about", title: "About", sessions: 153, bounce: "51%" },
  ];

  // Mock sparkline bar heights
  const sparkBars = [30, 45, 38, 60, 55, 70, 52, 65, 80, 74, 88, 92, 78, 85, 90, 72, 68, 84, 95, 88, 74, 80, 92, 85, 78, 88, 94, 100, 88, 92];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Monthly Analytics Report</p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">April 2026 Overview</h1>
          <span className="text-xs text-white/30 border border-white/[0.06] rounded-full px-3 py-1">Last updated Apr 11</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, up }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
            <p className={`text-xs mt-1 font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
              {up ? "↑" : "↓"} {delta} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Sparkline Chart */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
        <p className="text-sm font-semibold text-white mb-1">Daily Visitors — April 2026</p>
        <p className="text-xs text-white/30 mb-5">Showing 30-day trend</p>
        <div className="flex items-end gap-[3px] h-24">
          {sparkBars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gold/30 hover:bg-gold/60 transition-colors"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/20">Apr 1</span>
          <span className="text-[10px] text-white/20">Apr 15</span>
          <span className="text-[10px] text-white/20">Apr 30</span>
        </div>
      </div>

      {/* 2-col: Traffic Sources + Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
          <p className="text-sm font-semibold text-white mb-4">Traffic Sources</p>
          <div className="space-y-3">
            {sources.map(({ name, pct, color }) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{name}</span>
                  <span className="text-white/40 tabular-nums">{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
          <p className="text-sm font-semibold text-white mb-4">Top Pages</p>
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-2 px-2 pb-2 border-b border-white/[0.05]">
              <p className="col-span-5 text-[10px] text-white/25 uppercase tracking-wider">Page</p>
              <p className="col-span-4 text-[10px] text-white/25 uppercase tracking-wider text-right">Sessions</p>
              <p className="col-span-3 text-[10px] text-white/25 uppercase tracking-wider text-right">Bounce</p>
            </div>
            {pages.map(({ path, title, sessions, bounce }) => (
              <div key={path} className="grid grid-cols-12 gap-2 px-2 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="col-span-5">
                  <p className="text-sm text-white/70">{title}</p>
                  <p className="text-[10px] text-white/25">{path}</p>
                </div>
                <p className="col-span-4 text-sm text-white/50 text-right tabular-nums self-center">{sessions.toLocaleString()}</p>
                <p className="col-span-3 text-sm text-white/40 text-right tabular-nums self-center">{bounce}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Insight */}
      <div className="bg-gold/[0.06] border border-gold/20 rounded-2xl p-5">
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">This Month&apos;s Insight</p>
        <p className="text-sm text-white/70 leading-relaxed">
          Your contact page has the lowest bounce rate (22%) — visitors who reach it are highly intent. Consider adding a direct phone number and a booking link to capture more of this traffic as leads.
        </p>
      </div>
    </div>
  );
}

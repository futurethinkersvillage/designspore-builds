const log = [
  { number: "250-555-••••", time: "Today 3:42 PM", textSent: true, responded: true, outcome: "Booked service call" },
  { number: "250-674-••••", time: "Today 1:18 PM", textSent: true, responded: false, outcome: "No reply yet" },
  { number: "778-901-••••", time: "Today 10:55 AM", textSent: true, responded: true, outcome: "Requested quote" },
  { number: "250-555-••••", time: "Yesterday 4:30 PM", textSent: true, responded: true, outcome: "Booked service call" },
  { number: "250-312-••••", time: "Yesterday 2:07 PM", textSent: true, responded: true, outcome: "Booked service call" },
  { number: "604-488-••••", time: "Yesterday 11:34 AM", textSent: true, responded: false, outcome: "No reply" },
  { number: "250-555-••••", time: "Apr 9, 5:02 PM", textSent: true, responded: true, outcome: "Referred to friend" },
  { number: "250-786-••••", time: "Apr 9, 3:21 PM", textSent: true, responded: true, outcome: "Booked estimate" },
];

export default function MissedCallDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Missed Call Text-Back</p>
        <h1 className="text-2xl font-bold text-white">Recovery Dashboard</h1>
      </div>

      {/* Big KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
          <p className="text-xs text-white/40 mb-2">Missed calls this month</p>
          <p className="text-4xl font-bold text-white tabular-nums">23</p>
        </div>
        <div className="bg-card border border-emerald-500/20 rounded-2xl p-6 bg-emerald-500/[0.03]">
          <p className="text-xs text-white/40 mb-2">Texts sent automatically</p>
          <p className="text-4xl font-bold text-emerald-400 tabular-nums">23</p>
          <p className="text-xs text-emerald-400/60 mt-1 font-semibold">100% response rate</p>
        </div>
        <div className="bg-card border border-gold/20 rounded-2xl p-6 bg-gold/[0.03]">
          <p className="text-xs text-white/40 mb-2">Leads recovered</p>
          <p className="text-4xl font-bold text-gold tabular-nums">7</p>
          <p className="text-xs text-gold/60 mt-1 font-semibold">Est. $2,450 in jobs</p>
        </div>
      </div>

      {/* Message sent preview */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Auto-Response Text Sent</p>
        <div className="bg-dark border border-white/[0.06] rounded-xl p-4 max-w-sm">
          <p className="text-sm text-white/70 leading-relaxed">
            Hey! Sorry we missed your call — we&apos;re probably on another job right now. We&apos;ll call you back within the hour. In the meantime, you can book a time here: [booking link] 👍
          </p>
          <p className="text-[10px] text-white/25 mt-2">Sent within 15 seconds of missed call</p>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Call Activity Log</p>
          <span className="text-xs text-white/30">Last 30 days</span>
        </div>
        <div>
          <div className="grid grid-cols-12 gap-2 px-6 py-2.5 border-b border-white/[0.05]">
            <p className="col-span-3 text-[10px] text-white/25 uppercase tracking-wider">Number</p>
            <p className="col-span-3 text-[10px] text-white/25 uppercase tracking-wider">Time</p>
            <p className="col-span-2 text-[10px] text-white/25 uppercase tracking-wider">Text Sent</p>
            <p className="col-span-2 text-[10px] text-white/25 uppercase tracking-wider">Replied</p>
            <p className="col-span-2 text-[10px] text-white/25 uppercase tracking-wider">Outcome</p>
          </div>
          {log.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors last:border-0">
              <p className="col-span-3 text-sm text-white/60 tabular-nums">{row.number}</p>
              <p className="col-span-3 text-sm text-white/40">{row.time}</p>
              <div className="col-span-2">
                <span className="text-xs font-semibold text-emerald-400">✓ Sent</span>
              </div>
              <div className="col-span-2">
                <span className={`text-xs font-semibold ${row.responded ? "text-emerald-400" : "text-white/30"}`}>
                  {row.responded ? "Yes" : "No"}
                </span>
              </div>
              <p className="col-span-2 text-xs text-white/40">{row.outcome}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

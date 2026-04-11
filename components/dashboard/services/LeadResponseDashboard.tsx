const recentResponses = [
  { name: "Inbound Contact Form", channel: "Form", trigger: "New form submission", sent: "Apr 11, 2:14 PM", responseTime: "12s", outcome: "Booked call" },
  { name: "Google Business Inquiry", channel: "Email", trigger: "New email received", sent: "Apr 11, 11:30 AM", responseTime: "8s", outcome: "Quote requested" },
  { name: "Facebook DM", channel: "Social", trigger: "New DM received", sent: "Apr 11, 9:55 AM", responseTime: "6s", outcome: "No reply yet" },
  { name: "Inbound Contact Form", channel: "Form", trigger: "New form submission", sent: "Apr 10, 4:08 PM", responseTime: "11s", outcome: "Booked call" },
  { name: "Inbound Email", channel: "Email", trigger: "Keyword match: quote", sent: "Apr 10, 1:22 PM", responseTime: "9s", outcome: "Qualified lead" },
  { name: "Facebook DM", channel: "Social", trigger: "New DM received", sent: "Apr 10, 10:47 AM", responseTime: "7s", outcome: "Info sent" },
  { name: "Inbound Contact Form", channel: "Form", trigger: "New form submission", sent: "Apr 9, 3:15 PM", responseTime: "10s", outcome: "Booked call" },
];

const channelStyle: Record<string, string> = {
  Form: "bg-gold/10 text-gold border-gold/20",
  Email: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Social: "bg-purple-500/10 text-purple-300 border-purple-500/20",
};

const channels = [
  { name: "Contact Form", count: 22, icon: "📋" },
  { name: "Email", count: 18, icon: "✉️" },
  { name: "Social DM", count: 7, icon: "💬" },
];

export default function LeadResponseDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Lead Response Automation</p>
        <h1 className="text-2xl font-bold text-white">Response Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Responses sent this month", value: "47" },
          { label: "Avg. response time", value: "38s" },
          { label: "Leads qualified", value: "9" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Channel breakdown */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
        <p className="text-sm font-semibold text-white mb-4">Responses by Channel</p>
        <div className="grid grid-cols-3 gap-4">
          {channels.map(({ name, count, icon }) => (
            <div key={name} className="bg-dark border border-white/[0.06] rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-xs text-white/40 mb-1">{name}</p>
              <p className="text-2xl font-bold text-white tabular-nums">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <p className="text-sm font-semibold text-white">Recent Automated Responses</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recentResponses.map((r, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${channelStyle[r.channel]}`}>{r.channel}</span>
                </div>
                <p className="text-xs text-white/35">{r.trigger}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-emerald-400 font-semibold">✓ {r.responseTime}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{r.sent}</p>
              </div>
              <div className="shrink-0 w-28 text-right">
                <p className="text-xs text-white/50">{r.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const campaigns = [
  { subject: "Spring HVAC Tune-Up — Book Before May", type: "Email", sent: 847, opens: 362, clicks: 89, date: "Apr 7", status: "sent" },
  { subject: "Don't forget — your estimate expires Friday", type: "SMS", sent: 124, opens: 112, clicks: 41, date: "Apr 5", status: "sent" },
  { subject: "Your neighbours are booking — are you ready?", type: "Email", sent: 610, opens: 241, clicks: 54, date: "Mar 31", status: "sent" },
  { subject: "Emergency plumbing? We're available 24/7", type: "SMS", sent: 98, opens: 91, clicks: 28, date: "Mar 28", status: "sent" },
  { subject: "April newsletter — tips, deals & updates", type: "Email", sent: 0, opens: 0, clicks: 0, date: "Apr 12", status: "scheduled" },
];

const sequences = [
  { name: "New Lead Welcome", trigger: "Form submission", steps: 5, enrolled: 23, lastRun: "2 hours ago", status: "active" },
  { name: "Post-Service Follow-Up", trigger: "Job marked complete", steps: 3, enrolled: 41, lastRun: "Yesterday", status: "active" },
  { name: "Estimate Follow-Up", trigger: "Estimate sent, no reply", steps: 4, enrolled: 12, lastRun: "3 days ago", status: "active" },
  { name: "Win-Back (Inactive 90d)", trigger: "90 days since last contact", steps: 2, enrolled: 67, lastRun: "1 week ago", status: "active" },
  { name: "Review Request", trigger: "Job complete + 3 days", steps: 2, enrolled: 38, lastRun: "Yesterday", status: "paused" },
];

const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const growthCounts = [2840, 2920, 2970, 3050, 3140, 3240];
const maxGrowth = Math.max(...growthCounts);

const segments = [
  { label: "Past Customers", count: 1847, pct: 57 },
  { label: "Leads (Not Converted)", count: 892, pct: 28 },
  { label: "Newsletter Opt-In", count: 501, pct: 15 },
];

const statusStyle: Record<string, string> = {
  sent: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  scheduled: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  draft: "bg-white/[0.05] text-white/40 border-white/[0.08]",
  active: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  paused: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
};

const typeStyle: Record<string, string> = {
  Email: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  SMS: "bg-purple-500/10 text-purple-300 border-purple-500/20",
};

const tabs = ["Campaigns", "Sequences", "Subscribers"] as const;
type Tab = typeof tabs[number];

export default function EmailCampaignsDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Campaigns");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Email & SMS Campaigns</p>
        <h1 className="text-2xl font-bold text-white">Campaign Manager</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Subscribers", value: "3,240", delta: "+100 this month", up: true },
          { label: "Avg Open Rate", value: "42.1%", delta: "+3.4% vs last month", up: true },
          { label: "Active Sequences", value: "8", delta: "4 paused", up: null },
        ].map(({ label, value, delta, up }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
            <p className={`text-xs mt-1.5 ${up === true ? "text-emerald-400" : up === false ? "text-red-400" : "text-white/30"}`}>{delta}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-raised border border-white/[0.06] rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-gold/[0.12] text-gold" : "text-white/40 hover:text-white/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaigns tab */}
      {activeTab === "Campaigns" && (
        <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Recent Sends</p>
            <button className="text-xs text-gold hover:text-gold/80 transition-colors">+ New Campaign</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["Subject", "Type", "Sent", "Opens", "Clicks", "Date", "Status"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {campaigns.map((c, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-sm text-white/80 max-w-[220px] truncate">{c.subject}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeStyle[c.type]}`}>{c.type}</span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/60 tabular-nums">{c.sent > 0 ? c.sent.toLocaleString() : "—"}</td>
                    <td className="px-6 py-3.5 text-sm text-white/60 tabular-nums">
                      {c.opens > 0 ? `${Math.round((c.opens / c.sent) * 100)}%` : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/60 tabular-nums">
                      {c.clicks > 0 ? `${Math.round((c.clicks / c.sent) * 100)}%` : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/40">{c.date}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize ${statusStyle[c.status]}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sequences tab */}
      {activeTab === "Sequences" && (
        <div className="space-y-3">
          {sequences.map((seq, i) => (
            <div key={i} className="bg-raised border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{seq.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[seq.status]}`}>{seq.status}</span>
                </div>
                <p className="text-xs text-white/35">Trigger: <span className="text-white/55">{seq.trigger}</span></p>
              </div>
              <div className="flex gap-6 shrink-0 text-center">
                <div>
                  <p className="text-lg font-bold text-white tabular-nums">{seq.steps}</p>
                  <p className="text-[11px] text-white/30">Steps</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white tabular-nums">{seq.enrolled}</p>
                  <p className="text-[11px] text-white/30">Enrolled</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">{seq.lastRun}</p>
                  <p className="text-[11px] text-white/25">Last run</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscribers tab */}
      {activeTab === "Subscribers" && (
        <div className="space-y-4">
          {/* Growth chart */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Subscriber Growth</p>
            <div className="flex items-end gap-3 h-32">
              {months.map((month, i) => {
                const h = Math.round((growthCounts[i] / maxGrowth) * 100);
                const isLast = i === months.length - 1;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-white/40 tabular-nums">{growthCounts[i].toLocaleString()}</span>
                    <div
                      className={`w-full rounded-t-md transition-all ${isLast ? "bg-gold/60" : "bg-white/[0.08]"}`}
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[11px] text-white/30">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Segments */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">List Segments</p>
            <div className="space-y-3">
              {segments.map(({ label, count, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/70">{label}</span>
                    <span className="text-sm text-white/50 tabular-nums">{count.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gold/50 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

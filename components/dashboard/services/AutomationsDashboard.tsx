"use client";

import { useState } from "react";

const workflows = [
  { name: "New Lead → CRM + Instant Reply", trigger: "Form submission (any)", runs: 89, lastRun: "2 hours ago", status: "active" },
  { name: "Missed Call → Text-Back", trigger: "Missed call (phone system)", runs: 23, lastRun: "Yesterday", status: "active" },
  { name: "Booking Confirmed → SMS Reminder", trigger: "Booking confirmed", runs: 18, lastRun: "3 days ago", status: "active" },
  { name: "Job Complete → Review Request", trigger: "Job marked complete", runs: 41, lastRun: "Yesterday", status: "active" },
  { name: "Estimate Sent → 48hr Follow-Up", trigger: "Estimate sent, no reply (48h)", runs: 12, lastRun: "4 days ago", status: "active" },
  { name: "Inactive Lead → Win-Back (30d)", trigger: "No contact for 30 days", runs: 34, lastRun: "1 week ago", status: "active" },
  { name: "New Review → Thank You Reply", trigger: "Review received (any platform)", runs: 19, lastRun: "2 days ago", status: "active" },
  { name: "Invoice Overdue → Reminder Sequence", trigger: "Invoice overdue by 3 days", runs: 11, lastRun: "5 days ago", status: "paused" },
];

const runHistory = [
  { workflow: "New Lead → CRM + Instant Reply", trigger: "Form: Contact page", started: "Apr 9, 2:14pm", duration: "0.4s", status: "success" },
  { workflow: "Missed Call → Text-Back", trigger: "Missed call: (250) 4••-••47", started: "Apr 9, 11:32am", duration: "1.1s", status: "success" },
  { workflow: "Job Complete → Review Request", trigger: "Job #1042 marked complete", started: "Apr 9, 9:05am", duration: "0.6s", status: "success" },
  { workflow: "New Lead → CRM + Instant Reply", trigger: "Form: Quote request", started: "Apr 8, 4:48pm", duration: "0.4s", status: "success" },
  { workflow: "Booking Confirmed → SMS Reminder", trigger: "Booking: Apr 11 at 9am", started: "Apr 8, 10:21am", duration: "0.9s", status: "success" },
  { workflow: "Estimate Sent → 48hr Follow-Up", trigger: "Estimate #1039 sent", started: "Apr 7, 3:17pm", duration: "0.5s", status: "success" },
  { workflow: "Invoice Overdue → Reminder Sequence", trigger: "INV-1044 overdue 3d", started: "Apr 7, 8:00am", duration: "—", status: "failed" },
  { workflow: "New Lead → CRM + Instant Reply", trigger: "Form: Chatbot lead capture", started: "Apr 6, 6:54pm", duration: "0.4s", status: "success" },
];

const templates = [
  {
    name: "New Lead → CRM + Instant Reply",
    description: "When someone fills out a contact form or the chatbot captures a lead, add to CRM, tag by source, and send an instant personalized reply within 30 seconds.",
    steps: ["Trigger: Form submit", "Add to CRM", "Tag lead source", "Send SMS reply", "Notify owner"],
    category: "Leads",
  },
  {
    name: "Booking Confirmed → Client Comms",
    description: "When a booking is confirmed, send a confirmation SMS, calendar invite, and a reminder 24 hours before the appointment.",
    steps: ["Trigger: Booking confirmed", "Send confirmation SMS", "Send calendar invite", "Schedule reminder (24h prior)"],
    category: "Bookings",
  },
  {
    name: "Review Request Flow",
    description: "Three days after a job is marked complete, send a review request via SMS. If no action in 48h, follow up once by email.",
    steps: ["Trigger: Job complete", "Wait 3 days", "Send SMS review request", "Wait 48h if no action", "Send email follow-up"],
    category: "Reputation",
  },
  {
    name: "Estimate Follow-Up Sequence",
    description: "If an estimate is sent but the client hasn't responded in 48 hours, send a gentle follow-up. A second follow-up goes out at 5 days.",
    steps: ["Trigger: Estimate sent", "Wait 48h (no reply)", "Send follow-up #1", "Wait 3 more days", "Send follow-up #2"],
    category: "Sales",
  },
];

const statusStyle: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  paused: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const categoryStyle: Record<string, string> = {
  Leads: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Bookings: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  Reputation: "bg-gold/10 text-gold border-gold/20",
  Sales: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

const tabs = ["Active Workflows", "Run History", "Templates"] as const;
type Tab = typeof tabs[number];

const activeCount = workflows.filter(w => w.status === "active").length;
const totalRuns = workflows.reduce((s, w) => s + w.runs, 0);
const successRate = ((runHistory.filter(r => r.status === "success").length / runHistory.length) * 100).toFixed(1);

export default function AutomationsDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Active Workflows");
  const [workflowStatus, setWorkflowStatus] = useState(workflows.map(w => w.status));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Workflow Automations</p>
        <h1 className="text-2xl font-bold text-white">Automation Center</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Workflows", value: `${activeCount}`, delta: `${workflows.length - activeCount} paused`, up: null },
          { label: "Runs This Month", value: totalRuns.toString(), delta: "+47 vs last month", up: true },
          { label: "Success Rate", value: `${successRate}%`, delta: "1 failed run this month", up: null },
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

      {/* Active Workflows */}
      {activeTab === "Active Workflows" && (
        <div className="space-y-3">
          {workflows.map((wf, i) => (
            <div key={i} className="bg-raised border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{wf.name}</span>
                </div>
                <p className="text-xs text-white/35">Trigger: <span className="text-white/55">{wf.trigger}</span></p>
              </div>
              <div className="flex gap-6 shrink-0 text-center items-center">
                <div>
                  <p className="text-lg font-bold text-white tabular-nums">{wf.runs}</p>
                  <p className="text-[11px] text-white/30">Runs</p>
                </div>
                <div>
                  <p className="text-xs text-white/40">{wf.lastRun}</p>
                  <p className="text-[11px] text-white/25">Last run</p>
                </div>
                <button
                  onClick={() => setWorkflowStatus(prev =>
                    prev.map((s, idx) => idx === i ? (s === "active" ? "paused" : "active") : s)
                  )}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${statusStyle[workflowStatus[i]]}`}
                >
                  {workflowStatus[i] === "active" ? "Active" : "Paused"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Run History */}
      {activeTab === "Run History" && (
        <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.05]">
            <p className="text-sm font-semibold text-white">Recent Runs</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["Workflow", "Trigger", "Started", "Duration", "Status"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {runHistory.map((run, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-sm text-white/70 max-w-[200px] truncate">{run.workflow}</td>
                    <td className="px-6 py-3.5 text-sm text-white/40 max-w-[160px] truncate">{run.trigger}</td>
                    <td className="px-6 py-3.5 text-sm text-white/40 whitespace-nowrap">{run.started}</td>
                    <td className="px-6 py-3.5 text-sm text-white/40 tabular-nums">{run.duration}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize ${statusStyle[run.status]}`}>{run.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates */}
      {activeTab === "Templates" && (
        <div className="space-y-3">
          {templates.map((tmpl, i) => (
            <div key={i} className="bg-raised border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">{tmpl.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryStyle[tmpl.category]}`}>{tmpl.category}</span>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed">{tmpl.description}</p>
                </div>
                <button className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-gold/[0.10] text-gold hover:bg-gold/[0.16] transition-colors font-medium mt-0.5">
                  Enable
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tmpl.steps.map((step, si) => (
                  <span key={si} className="text-[10px] text-white/35 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md">
                    {si + 1}. {step}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

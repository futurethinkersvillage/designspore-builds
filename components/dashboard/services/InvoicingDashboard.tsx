"use client";

import { useState } from "react";

const invoices = [
  { id: "INV-1041", client: "Robertson Plumbing Supply", service: "HVAC Install + Labour", amount: 3400, issued: "Apr 1", due: "Apr 15", status: "paid" },
  { id: "INV-1042", client: "Clearwater Lodge", service: "Preventive Maintenance Plan — Q2", amount: 880, issued: "Apr 3", due: "Apr 17", status: "outstanding" },
  { id: "INV-1043", client: "Wanda M.", service: "Water Heater Replacement", amount: 1250, issued: "Apr 5", due: "Apr 19", status: "paid" },
  { id: "INV-1044", client: "Thompson Valley RV Park", service: "Plumbing Inspection + Report", amount: 420, issued: "Apr 7", due: "Apr 14", status: "overdue" },
  { id: "INV-1045", client: "Barriere Community Hall", service: "Boiler Servicing", amount: 750, issued: "Apr 8", due: "Apr 22", status: "outstanding" },
  { id: "INV-1046", client: "Gary & Lisa T.", service: "Emergency Call + Parts", amount: 620, issued: "Apr 9", due: "Apr 23", status: "outstanding" },
];

const reminders = [
  { timing: "3 days before due", enabled: true, channel: "Email + SMS" },
  { timing: "Day of due date", enabled: true, channel: "Email" },
  { timing: "3 days overdue", enabled: true, channel: "Email + SMS" },
  { timing: "7 days overdue", enabled: false, channel: "SMS only" },
  { timing: "14 days overdue", enabled: false, channel: "Email — escalation template" },
];

const statusStyle: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  outstanding: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  overdue: "bg-red-500/10 text-red-400 border-red-500/20",
};

const tabs = ["Invoices", "Reminders", "Settings"] as const;
type Tab = typeof tabs[number];

const totalCollected = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
const outstanding = invoices.filter(i => i.status === "outstanding" || i.status === "overdue");
const overdue = invoices.filter(i => i.status === "overdue");

export default function InvoicingDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Invoices");
  const [reminderEnabled, setReminderEnabled] = useState(reminders.map(r => r.enabled));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Invoice & Payments</p>
        <h1 className="text-2xl font-bold text-white">Payment Tracker</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
          <p className="text-xs text-white/40 mb-2">Collected This Month</p>
          <p className="text-3xl font-bold text-white tabular-nums">${totalCollected.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-1.5">↑ +$1,240 vs last month</p>
        </div>
        <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
          <p className="text-xs text-white/40 mb-2">Outstanding Invoices</p>
          <p className="text-3xl font-bold text-white tabular-nums">{outstanding.length}</p>
          <p className="text-xs text-white/30 mt-1.5">${outstanding.reduce((s, i) => s + i.amount, 0).toLocaleString()} total outstanding</p>
        </div>
        <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
          <p className="text-xs text-white/40 mb-2">Avg Days to Pay</p>
          <p className="text-3xl font-bold text-white tabular-nums">4.2</p>
          <p className="text-xs text-white/30 mt-1.5">Industry avg: 14 days</p>
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-red-500/[0.06] border border-red-500/20 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
          <p className="text-sm text-white/70">
            <span className="text-red-400 font-semibold">{overdue.length} invoice{overdue.length > 1 ? "s" : ""} overdue.</span> Reminder sent automatically. No action needed unless you want to escalate.
          </p>
        </div>
      )}

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

      {/* Invoices tab */}
      {activeTab === "Invoices" && (
        <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <p className="text-sm font-semibold text-white">April Invoices</p>
            <button className="text-xs text-gold hover:text-gold/80 transition-colors">+ New Invoice</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["Invoice", "Client", "Service", "Amount", "Issued", "Due", "Status"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-xs font-mono text-white/40">{inv.id}</td>
                    <td className="px-6 py-3.5 text-sm text-white/80 max-w-[140px] truncate">{inv.client}</td>
                    <td className="px-6 py-3.5 text-sm text-white/50 max-w-[160px] truncate">{inv.service}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-white tabular-nums">${inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-sm text-white/40">{inv.issued}</td>
                    <td className="px-6 py-3.5 text-sm text-white/40">{inv.due}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize ${statusStyle[inv.status]}`}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reminders tab */}
      {activeTab === "Reminders" && (
        <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.05]">
            <p className="text-sm font-semibold text-white">Automatic Payment Reminders</p>
            <p className="text-xs text-white/35 mt-0.5">The system sends these automatically — no action needed unless you want to adjust.</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {reminders.map((r, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 font-medium">{r.timing}</p>
                  <p className="text-xs text-white/35 mt-0.5">{r.channel}</p>
                </div>
                <button
                  onClick={() => setReminderEnabled(prev => prev.map((v, idx) => idx === i ? !v : v))}
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${reminderEnabled[i] ? "bg-gold/70" : "bg-white/[0.12]"}`}
                  style={{ width: 40, height: 22 }}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${reminderEnabled[i] ? "translate-x-5" : "translate-x-0.5"}`}
                    style={{ width: 18, height: 18, top: 2, left: reminderEnabled[i] ? 20 : 2, position: "absolute", transition: "left 0.15s" }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings tab */}
      {activeTab === "Settings" && (
        <div className="space-y-4">
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Payment Methods</p>
            <div className="space-y-3">
              {[
                { name: "Stripe (Credit/Debit)", status: "Connected", note: "Visa, Mastercard, AMEX accepted" },
                { name: "e-Transfer", status: "Enabled", note: "Instructions included in invoice email" },
                { name: "Cash / Cheque", status: "Enabled", note: "Marked manually after receipt" },
              ].map(({ name, status, note }) => (
                <div key={name} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                  <div>
                    <p className="text-sm text-white/80">{name}</p>
                    <p className="text-xs text-white/35 mt-0.5">{note}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-1">Late Fee Policy</p>
            <p className="text-sm text-white/40 mb-4">Automatically applied to invoices after grace period.</p>
            <div className="flex items-center gap-4">
              <div className="bg-card border border-white/[0.07] rounded-xl px-4 py-3 flex-1">
                <p className="text-xs text-white/30 mb-1">Grace period</p>
                <p className="text-lg font-bold text-white">7 days</p>
              </div>
              <div className="bg-card border border-white/[0.07] rounded-xl px-4 py-3 flex-1">
                <p className="text-xs text-white/30 mb-1">Late fee</p>
                <p className="text-lg font-bold text-white">1.5% / month</p>
              </div>
              <div className="bg-card border border-white/[0.07] rounded-xl px-4 py-3 flex-1">
                <p className="text-xs text-white/30 mb-1">Notify client</p>
                <p className="text-lg font-bold text-white">On apply</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

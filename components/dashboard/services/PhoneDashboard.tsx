"use client";
import { useState } from "react";

/* ── MOCK DATA ──────────────────────────────────────────────── */

const phoneNumbers = [
  { number: "+1 (250) 555-0180", label: "Main Business Line", type: "Local", status: "active", aiEnabled: true, forwarding: "+1 (250) 555-0147" },
  { number: "+1 (778) 555-0221", label: "After-Hours / Overflow", type: "Local", status: "active", aiEnabled: true, forwarding: null },
  { number: "+1 (800) 555-0199", label: "Toll-Free (Marketing)", type: "Toll-Free", status: "active", aiEnabled: false, forwarding: "+1 (250) 555-0180" },
];

const callLog = [
  { id: 1, caller: "+1 (250) 555-0312", callerName: "Sarah Mitchell", direction: "inbound", duration: "3:42", time: "Today 2:14 PM", outcome: "Booked service call", handledBy: "AI Agent", line: "Main", hasTranscript: true },
  { id: 2, caller: "+1 (604) 555-0488", callerName: "Unknown", direction: "inbound", duration: "1:18", time: "Today 1:05 PM", outcome: "Transferred to Mike", handledBy: "AI Agent → Mike", line: "Main", hasTranscript: true },
  { id: 3, caller: "+1 (250) 555-0147", callerName: "You", direction: "outbound", duration: "0:45", time: "Today 11:30 AM", outcome: "Left voicemail", handledBy: "Manual", line: "Main", hasTranscript: false },
  { id: 4, caller: "+1 (250) 674-0091", callerName: "Dave Kowalski", direction: "inbound", duration: "4:55", time: "Today 9:22 AM", outcome: "Quote requested", handledBy: "AI Agent", line: "Main", hasTranscript: true },
  { id: 5, caller: "+1 (778) 555-0334", callerName: "Linda Harper", direction: "inbound", duration: "2:10", time: "Yesterday 4:48 PM", outcome: "FAQ answered", handledBy: "AI Agent", line: "After-Hours", hasTranscript: true },
  { id: 6, caller: "+1 (250) 555-0776", callerName: "Chris Turner", direction: "inbound", duration: "0:00", time: "Yesterday 3:15 PM", outcome: "Missed → Text sent", handledBy: "Auto Text-Back", line: "Main", hasTranscript: false },
  { id: 7, caller: "+1 (604) 555-0192", callerName: "Unknown", direction: "inbound", duration: "1:44", time: "Yesterday 11:02 AM", outcome: "Booked estimate", handledBy: "AI Agent", line: "Toll-Free", hasTranscript: true },
  { id: 8, caller: "+1 (250) 555-0418", callerName: "Tom Burns", direction: "inbound", duration: "6:12", time: "Apr 9, 2:30 PM", outcome: "Complaint — escalated", handledBy: "AI Agent → Mike", line: "Main", hasTranscript: true },
];

const sampleTranscript = [
  { speaker: "AI", text: "Thanks for calling! This is the AI assistant for Thompson Plumbing. How can I help you today?" },
  { speaker: "Caller", text: "Hi, yeah, I've got a kitchen sink that's completely backed up. It's not draining at all." },
  { speaker: "AI", text: "Sorry to hear that — a fully blocked kitchen drain definitely needs attention. Are you in the Clearwater area?" },
  { speaker: "Caller", text: "Yeah, I'm on Pine Street." },
  { speaker: "AI", text: "Perfect, you're in our service area. A few quick questions: Is there any water overflowing or leaking right now, or is it just not draining?" },
  { speaker: "Caller", text: "No leaking, just won't drain. There's standing water in the sink." },
  { speaker: "AI", text: "Got it. That's a standard drain clearing — we can usually have that sorted in under an hour. Our diagnostic/service call fee is $95, and most kitchen drain clearings run between $165–$195 total depending on the situation. Would you like me to book a technician?" },
  { speaker: "Caller", text: "Yeah, how soon can someone come out?" },
  { speaker: "AI", text: "We have availability tomorrow morning between 9 and 11 AM, or Thursday afternoon. Which works better for you?" },
  { speaker: "Caller", text: "Tomorrow morning would be great." },
  { speaker: "AI", text: "Done — I've booked you for tomorrow, April 12th, between 9 and 11 AM. Can I get your name and the best number to confirm?" },
  { speaker: "Caller", text: "Sarah Mitchell, and this number is fine — 250-555-0312." },
  { speaker: "AI", text: "Perfect, Sarah. You'll get a confirmation text shortly, and the technician will call about 30 minutes before arriving. Anything else I can help with?" },
  { speaker: "Caller", text: "No, that's everything. Thanks!" },
  { speaker: "AI", text: "You're welcome! We'll see you tomorrow morning. Have a good one." },
];

const voicemails = [
  { caller: "+1 (250) 555-0661", callerName: "Karen Fields", time: "Today 12:30 PM", duration: "0:34", transcript: "Hi, this is Karen Fields. I'm calling about getting a quote for re-piping my bathroom. The pipes are pretty old and I've been getting rusty water. Can you give me a call back at 250-555-0661? Thanks.", status: "new" },
  { caller: "+1 (778) 555-0882", callerName: "Unknown", time: "Yesterday 5:22 PM", duration: "0:18", transcript: "Yeah hi, just wondering if you guys do gas fitting work as well as plumbing. Give me a call back when you can.", status: "new" },
  { caller: "+1 (250) 555-0443", callerName: "Paul Vance", time: "Apr 9, 8:45 AM", duration: "0:42", transcript: "Hey, it's Paul Vance from Vance Home Services. We talked last week about subcontracting some plumbing work for a renovation project. Just following up — give me a ring when you get a chance. Cheers.", status: "listened" },
];

const aiConfig = {
  greeting: "Thanks for calling! This is the AI assistant for Thompson Plumbing. How can I help you today?",
  personality: "Professional, warm, and efficient. Uses plain language. Avoids jargon.",
  canBook: true,
  canQuote: true,
  canTransfer: true,
  transferTo: "+1 (250) 555-0147 (Mike)",
  escalationRules: "Transfer to Mike if: complaint, existing customer issue, commercial project, or caller explicitly asks for a human.",
  businessHours: "Mon–Fri 8 AM – 6 PM, Sat 9 AM – 4 PM",
  afterHoursMode: "AI answers, captures info, sends morning digest",
  knowledgeBase: [
    "Service areas: Clearwater, Barriere, Vavenby, Blue River, surrounding TNRD area",
    "Services: Residential plumbing, drain clearing, hot water tanks, re-piping, fixture install",
    "Pricing: Service call $95, drain clearing $165–$195, HWT install $1,350+, emergency after-hours $195",
    "Does NOT do: Gas fitting, HVAC, septic systems, commercial fire suppression",
    "Booking: Same-day for emergencies, 1–3 day lead time for standard work",
  ],
};

const businessHoursSchedule = [
  { day: "Monday", hours: "8:00 AM – 6:00 PM", active: true },
  { day: "Tuesday", hours: "8:00 AM – 6:00 PM", active: true },
  { day: "Wednesday", hours: "8:00 AM – 6:00 PM", active: true },
  { day: "Thursday", hours: "8:00 AM – 6:00 PM", active: true },
  { day: "Friday", hours: "8:00 AM – 6:00 PM", active: true },
  { day: "Saturday", hours: "9:00 AM – 4:00 PM", active: true },
  { day: "Sunday", hours: "Closed (AI answers)", active: false },
];

const outcomeStyle: Record<string, string> = {
  "Booked service call": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  "Booked estimate": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  "Quote requested": "bg-gold/10 text-gold border-gold/20",
  "FAQ answered": "bg-blue-500/10 text-blue-300 border-blue-500/20",
  "Transferred to Mike": "bg-purple-500/10 text-purple-300 border-purple-500/20",
  "Left voicemail": "bg-white/[0.06] text-white/30 border-white/[0.08]",
  "Missed → Text sent": "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  "Complaint — escalated": "bg-red-500/10 text-red-400 border-red-500/20",
};

type Tab = "calls" | "voicemail" | "numbers" | "ai-config" | "hours";

/* ── COMPONENT ──────────────────────────────────────────────── */

export default function PhoneDashboard() {
  const [tab, setTab] = useState<Tab>("calls");
  const [viewTranscript, setViewTranscript] = useState<number | null>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: "calls", label: "Call Log" },
    { id: "voicemail", label: "Voicemail" },
    { id: "numbers", label: "Phone Numbers" },
    { id: "ai-config", label: "Voice AI Setup" },
    { id: "hours", label: "Hours & Routing" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">AI Phone System</p>
        <h1 className="text-2xl font-bold text-white">Phone Management</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Calls this month", value: "47" },
          { label: "Handled by AI", value: "38", sub: "81%" },
          { label: "Appointments booked", value: "12" },
          { label: "Avg. call duration", value: "2m 48s" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
            {sub && <p className="text-xs text-emerald-400 mt-0.5 font-semibold">{sub} of total</p>}
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-raised border border-white/[0.06] rounded-xl p-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setViewTranscript(null); }}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
              tab === t.id
                ? "bg-gold/[0.12] text-gold border border-gold/20"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CALLS TAB ─────────────────────────────────────────── */}
      {tab === "calls" && !viewTranscript && (
        <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Recent Calls</p>
            <span className="text-xs text-white/30">Last 7 days</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {callLog.map(call => (
              <div key={call.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                {/* Direction indicator */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  call.direction === "inbound" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                }`}>
                  {call.direction === "inbound" ? "↓" : "↑"}
                </div>

                {/* Caller info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-semibold text-white">{call.callerName}</span>
                    <span className="text-xs text-white/30 tabular-nums">{call.caller}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-white/35">{call.handledBy}</span>
                    <span className="text-[10px] text-white/20">·</span>
                    <span className="text-xs text-white/25">{call.line} line</span>
                    <span className="text-[10px] text-white/20">·</span>
                    <span className="text-xs text-white/25 tabular-nums">{call.duration}</span>
                  </div>
                </div>

                {/* Outcome */}
                <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${outcomeStyle[call.outcome] ?? "bg-white/[0.06] text-white/30 border-white/[0.08]"}`}>
                  {call.outcome}
                </span>

                {/* Time + transcript link */}
                <div className="text-right shrink-0 w-28">
                  <p className="text-xs text-white/25">{call.time}</p>
                  {call.hasTranscript && (
                    <button
                      onClick={() => setViewTranscript(call.id)}
                      className="text-[10px] text-gold hover:text-gold-light transition-colors mt-0.5"
                    >
                      View transcript →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TRANSCRIPT VIEW ───────────────────────────────────── */}
      {tab === "calls" && viewTranscript && (() => {
        const call = callLog.find(c => c.id === viewTranscript);
        if (!call) return null;
        return (
          <>
            <button
              onClick={() => setViewTranscript(null)}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              ← Back to call log
            </button>
            <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{call.callerName} — {call.caller}</p>
                    <p className="text-xs text-white/30 mt-0.5">{call.time} · {call.duration} · {call.handledBy}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${outcomeStyle[call.outcome] ?? ""}`}>
                    {call.outcome}
                  </span>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4 max-h-[500px] overflow-y-auto">
                {sampleTranscript.map((line, i) => (
                  <div key={i} className={`flex ${line.speaker === "Caller" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${line.speaker === "AI" ? "" : ""}`}>
                      <p className={`text-[10px] font-semibold mb-1 ${line.speaker === "AI" ? "text-gold/60" : "text-white/30"}`}>
                        {line.speaker === "AI" ? "AI Agent" : "Caller"}
                      </p>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        line.speaker === "AI"
                          ? "bg-gold/[0.08] border border-gold/15 text-white/75 rounded-tl-sm"
                          : "bg-white/[0.06] border border-white/[0.06] text-white/65 rounded-tr-sm"
                      }`}>
                        {line.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-white/[0.05] flex items-center gap-3">
                <span className="text-[10px] text-white/20 uppercase tracking-wider">AI Confidence</span>
                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-xs">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: "94%" }} />
                </div>
                <span className="text-xs text-emerald-400 font-semibold tabular-nums">94%</span>
              </div>
            </div>
          </>
        );
      })()}

      {/* ── VOICEMAIL TAB ─────────────────────────────────────── */}
      {tab === "voicemail" && (
        <>
          <div className="flex items-center gap-3 px-5 py-3 bg-gold/[0.06] border border-gold/20 rounded-xl">
            <span className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">2</span>
            <p className="text-sm text-white/70"><span className="text-gold font-semibold">2 new voicemails</span> need review</p>
          </div>

          <div className="space-y-4">
            {voicemails.map((vm, i) => (
              <div key={i} className={`bg-raised border rounded-2xl p-6 ${vm.status === "new" ? "border-gold/20" : "border-white/[0.06]"}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white">{vm.callerName}</p>
                      <span className="text-xs text-white/30 tabular-nums">{vm.caller}</span>
                      {vm.status === "new" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">New</span>
                      )}
                    </div>
                    <p className="text-xs text-white/30">{vm.time} · {vm.duration}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] transition-colors">Call Back</button>
                  </div>
                </div>
                <div className="bg-dark border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[10px] text-white/25 uppercase tracking-wider mb-2">AI Transcription</p>
                  <p className="text-sm text-white/60 leading-relaxed italic">&ldquo;{vm.transcript}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── PHONE NUMBERS TAB ─────────────────────────────────── */}
      {tab === "numbers" && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/50">{phoneNumbers.length} numbers configured</p>
            <button className="text-xs text-gold hover:text-gold-light px-4 py-2 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors font-semibold">
              + Add Number
            </button>
          </div>

          <div className="space-y-4">
            {phoneNumbers.map((pn, i) => (
              <div key={i} className="bg-raised border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-lg font-bold text-white tabular-nums tracking-wide">{pn.number}</p>
                    <p className="text-xs text-white/40 mt-0.5">{pn.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${pn.type === "Toll-Free" ? "bg-blue-500/10 text-blue-300 border-blue-500/20" : "bg-white/[0.06] text-white/40 border-white/[0.08]"}`}>
                      {pn.type}
                    </span>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                      Active
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="py-3 border-t border-white/[0.05]">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Voice AI</p>
                    <p className={`text-sm font-semibold ${pn.aiEnabled ? "text-emerald-400" : "text-white/30"}`}>
                      {pn.aiEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <div className="py-3 border-t border-white/[0.05]">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Forwarding</p>
                    <p className="text-sm text-white/50 tabular-nums">
                      {pn.forwarding ?? "None (AI only)"}
                    </p>
                  </div>
                  <div className="py-3 border-t border-white/[0.05] flex items-end justify-end">
                    <button className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] transition-colors">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── AI CONFIG TAB ─────────────────────────────────────── */}
      {tab === "ai-config" && (
        <>
          {/* Greeting */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-3">Opening Greeting</p>
            <div className="bg-dark border border-white/[0.08] rounded-xl px-4 py-3">
              <p className="text-sm text-white/60 italic">&ldquo;{aiConfig.greeting}&rdquo;</p>
            </div>
            <button className="text-xs text-gold hover:text-gold-light mt-3 transition-colors">Edit greeting →</button>
          </div>

          {/* Personality & behavior */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-3">Agent Personality</p>
            <div className="bg-dark border border-white/[0.08] rounded-xl px-4 py-3">
              <p className="text-sm text-white/60">{aiConfig.personality}</p>
            </div>
          </div>

          {/* Capabilities */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Agent Capabilities</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Book appointments", enabled: aiConfig.canBook },
                { label: "Provide quotes", enabled: aiConfig.canQuote },
                { label: "Transfer to human", enabled: aiConfig.canTransfer },
              ].map(({ label, enabled }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.06] bg-dark">
                  <span className="text-sm text-white/60">{label}</span>
                  <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${enabled ? "bg-emerald-500/30" : "bg-white/10"}`}>
                    <div className={`w-4 h-4 rounded-full transition-transform ${enabled ? "bg-emerald-400 translate-x-4" : "bg-white/30 translate-x-0"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transfer rules */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-1">Transfer & Escalation Rules</p>
            <p className="text-xs text-white/30 mb-4">When the AI should hand off to a human</p>
            <div className="bg-dark border border-white/[0.08] rounded-xl px-4 py-3 mb-3">
              <p className="text-sm text-white/60">{aiConfig.escalationRules}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">Transfer to:</span>
              <span className="text-xs text-white/60 font-semibold tabular-nums">{aiConfig.transferTo}</span>
            </div>
          </div>

          {/* Knowledge base */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-white">Knowledge Base</p>
                <p className="text-xs text-white/30 mt-0.5">What the AI knows about your business</p>
              </div>
              <button className="text-xs text-gold hover:text-gold-light px-3 py-1.5 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors font-semibold">
                + Add Entry
              </button>
            </div>
            <div className="space-y-2">
              {aiConfig.knowledgeBase.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-dark group">
                  <span className="w-5 h-5 rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[10px] text-white/25 font-bold mt-0.5 shrink-0">{i + 1}</span>
                  <p className="text-sm text-white/55 leading-relaxed flex-1">{entry}</p>
                  <button className="text-xs text-white/20 hover:text-white/50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">Edit</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── HOURS & ROUTING TAB ───────────────────────────────── */}
      {tab === "hours" && (
        <>
          {/* Business hours */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Business Hours</p>
            <div className="space-y-1">
              {businessHoursSchedule.map(({ day, hours, active }) => (
                <div key={day} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.05] bg-dark">
                  <span className={`text-sm font-semibold w-28 ${active ? "text-white" : "text-white/30"}`}>{day}</span>
                  <span className={`text-sm tabular-nums ${active ? "text-white/60" : "text-white/25 italic"}`}>{hours}</span>
                  <div className={`w-9 h-5 rounded-full flex items-center px-0.5 ${active ? "bg-emerald-500/30" : "bg-white/10"}`}>
                    <div className={`w-4 h-4 rounded-full ${active ? "bg-emerald-400 translate-x-4" : "bg-white/30 translate-x-0"} transition-transform`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call routing */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-4">Call Routing Rules</p>
            <div className="space-y-3">
              {[
                { condition: "During business hours", action: "AI answers → books or transfers to Mike if needed", icon: "☀️" },
                { condition: "After hours (weekdays)", action: "AI answers → captures info → morning digest email", icon: "🌙" },
                { condition: "Sunday / Closed", action: "AI answers with limited scope → voicemail if complex", icon: "📵" },
                { condition: "Emergency keyword detected", action: "AI answers → immediate transfer to Mike's cell", icon: "🚨" },
                { condition: "Missed call (any time)", action: "Auto text-back within 15 seconds with booking link", icon: "💬" },
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-4 px-4 py-4 rounded-xl border border-white/[0.06] bg-dark">
                  <span className="text-lg shrink-0">{rule.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-0.5">{rule.condition}</p>
                    <p className="text-xs text-white/45">{rule.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Morning digest preview */}
          <div className="bg-raised border border-white/[0.06] rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-1">Morning Digest Email</p>
            <p className="text-xs text-white/30 mb-4">Sent daily at 7:30 AM with overnight call summary</p>
            <div className="bg-dark border border-white/[0.08] rounded-xl p-5 space-y-3">
              <p className="text-xs text-gold font-semibold">OVERNIGHT SUMMARY — April 11, 2026</p>
              <div className="border-t border-white/[0.06] pt-3 space-y-2">
                <p className="text-sm text-white/60">📞 <span className="text-white font-semibold">3 calls</span> received after hours</p>
                <p className="text-sm text-white/60">🎯 <span className="text-white font-semibold">1 appointment</span> booked (Linda Harper, drain clearing, Apr 14)</p>
                <p className="text-sm text-white/60">📱 <span className="text-white font-semibold">1 missed call</span> — text-back sent, no reply yet</p>
                <p className="text-sm text-white/60">📝 <span className="text-white font-semibold">2 new voicemails</span> — transcriptions ready for review</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

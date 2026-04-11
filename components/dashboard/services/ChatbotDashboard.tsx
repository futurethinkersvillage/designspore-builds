"use client";
import { useState } from "react";

const conversations = [
  {
    id: 1,
    name: "Sarah M.",
    preview: "Do you do emergency plumbing on weekends?",
    time: "Today, 2:14 PM",
    status: "lead",
    messages: [
      { from: "user", text: "Hi, do you do emergency plumbing on weekends?" },
      { from: "bot", text: "Hi! Yes, we offer emergency plumbing services 7 days a week including weekends. What's the issue you're dealing with?" },
      { from: "user", text: "My kitchen sink is completely blocked and backing up. It's a mess." },
      { from: "bot", text: "That sounds urgent — a blocked drain backing up can cause water damage if left too long. I can get someone out to you today. Can I grab your address and the best number to reach you?" },
      { from: "user", text: "Yeah sure — 247 Pine St, Clearwater. My number is 250-555-0147." },
      { from: "bot", text: "Perfect, thanks Sarah. I've logged your request. A technician will call you within 30 minutes to confirm the arrival time. Is there anything else I can help with in the meantime?" },
      { from: "user", text: "No that's great, thanks!" },
      { from: "bot", text: "You're welcome! We'll get it sorted out. Talk soon." },
    ],
  },
  {
    id: 2,
    name: "Dave K.",
    preview: "What are your hot water tank prices?",
    time: "Today, 11:42 AM",
    status: "inquiry",
    messages: [
      { from: "user", text: "What are your hot water tank prices?" },
      { from: "bot", text: "Great question. Pricing depends on the tank size and brand — we carry 40, 50, and 60-gallon units. Supply and installation typically runs between $1,200–$1,800 depending on complexity. Would you like a free quote for your specific situation?" },
      { from: "user", text: "Yeah that'd be helpful. It's a 40 gallon electric tank." },
      { from: "bot", text: "Perfect. To put together an accurate quote I'll need to know your location and whether the install is straightforward (same location, same hookups) or involves moving it. Can I book a quick 15-minute call with one of our team?" },
    ],
  },
  {
    id: 3,
    name: "Anonymous",
    preview: "What are your business hours?",
    time: "Yesterday, 4:08 PM",
    status: "resolved",
    messages: [
      { from: "user", text: "What are your business hours?" },
      { from: "bot", text: "We're open Monday to Friday 8 AM – 6 PM, and Saturday 9 AM – 4 PM. For emergencies we're available 24/7. Is there something specific I can help you book?" },
    ],
  },
  {
    id: 4,
    name: "Chris T.",
    preview: "Can you fix a leaking outdoor faucet?",
    time: "Yesterday, 1:55 PM",
    status: "lead",
    messages: [
      { from: "user", text: "Can you fix a leaking outdoor faucet?" },
      { from: "bot", text: "Absolutely — outdoor faucet repairs are one of our most common jobs and usually take under an hour. Would you like to book a service call? We have openings this week." },
      { from: "user", text: "Yes please, Thursday morning if possible." },
      { from: "bot", text: "Thursday morning works — I've noted the request. Can I get your name and address so we can confirm the booking?" },
    ],
  },
];

const statusColors: Record<string, string> = {
  lead: "bg-gold/10 text-gold border-gold/20",
  inquiry: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  resolved: "bg-white/[0.06] text-white/30 border-white/[0.08]",
};

const statusLabels: Record<string, string> = {
  lead: "Lead",
  inquiry: "Inquiry",
  resolved: "Resolved",
};

export default function ChatbotDashboard() {
  const [activeId, setActiveId] = useState(1);
  const active = conversations.find(c => c.id === activeId)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Website Chatbot</p>
        <h1 className="text-2xl font-bold text-white">Conversation Dashboard</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Conversations this month", value: "89" },
          { label: "Leads captured", value: "23" },
          { label: "Avg. session length", value: "4m 12s" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Conversation UI */}
      <div className="bg-raised border border-white/[0.06] rounded-2xl overflow-hidden flex" style={{ height: 480 }}>
        {/* Left: conversation list */}
        <div className="w-72 shrink-0 border-r border-white/[0.06] flex flex-col overflow-y-auto">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Recent Conversations</p>
          </div>
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`w-full text-left px-4 py-3.5 border-b border-white/[0.04] transition-colors ${activeId === conv.id ? "bg-gold/[0.06] border-l-2 border-l-gold" : "hover:bg-white/[0.03]"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white">{conv.name}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[conv.status]}`}>
                  {statusLabels[conv.status]}
                </span>
              </div>
              <p className="text-xs text-white/40 truncate">{conv.preview}</p>
              <p className="text-[10px] text-white/25 mt-1">{conv.time}</p>
            </button>
          ))}
        </div>

        {/* Right: chat detail */}
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{active.name}</p>
              <p className="text-xs text-white/30">{active.time}</p>
            </div>
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${statusColors[active.status]}`}>
              {statusLabels[active.status]}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {active.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "bot"
                      ? "bg-gold/[0.1] border border-gold/20 text-white/80 rounded-tl-sm"
                      : "bg-white/[0.08] border border-white/[0.06] text-white/70 rounded-tr-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

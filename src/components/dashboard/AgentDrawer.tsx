"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Scales, Compass, Plant, Hammer, GlobeHemisphereWest, Sparkle, Robot,
  X, PaperPlaneRight, ArrowRight,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { findAgent } from "@/lib/data/dashboard/agents";
import type { AgentAccent } from "@/lib/data/dashboard/agents";

/* ── Icon map ────────────────────────────────────────────────────────── */

const iconMap: Record<string, ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }>> = {
  Scales, Compass, Plant, Hammer, GlobeHemisphereWest, Sparkle,
};

const accentMap: Record<AgentAccent, { bg: string; text: string; border: string; inputFocus: string }> = {
  indigo:     { bg: "bg-indigo-500/10",  text: "text-indigo-400",  border: "border-indigo-500/25", inputFocus: "focus:border-indigo-500/40"  },
  amber:      { bg: "bg-amber/10",       text: "text-amber",       border: "border-amber/25",       inputFocus: "focus:border-amber/40"       },
  emerald:    { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", inputFocus: "focus:border-emerald-500/40" },
  terracotta: { bg: "bg-[#C4614A]/10",   text: "text-[#C4614A]",   border: "border-[#C4614A]/25",   inputFocus: "focus:border-[#C4614A]/40"   },
  mauve:      { bg: "bg-[#9B7FA0]/10",   text: "text-[#9B7FA0]",   border: "border-[#9B7FA0]/25",   inputFocus: "focus:border-[#9B7FA0]/40"   },
  blue:       { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/25",    inputFocus: "focus:border-blue-500/40"    },
};

/* ── Demo responses by agent ─────────────────────────────────────────── */

interface ChatMessage {
  role: "agent" | "user";
  text: string;
}

const demoGreetings: Record<string, ChatMessage[]> = {
  sage: [
    {
      role: "agent",
      text: "I see 5 active proposals this week. The Solar Array Expansion vote closes in 5 days — 12 for, 3 against, 2 abstaining.\n\nThe Garden Expansion consent round is in the integration phase with one unresolved objection.\n\nIs there something you'd like me to look into?",
    },
  ],
  orion: [
    {
      role: "agent",
      text: "Runway sits at 14 months at current burn. Two grant deadlines land this week — BC Green Infrastructure closes Thursday.\n\nThe equity round is at 68% of target. Want a quick campaign summary?",
    },
  ],
  fern: [
    {
      role: "agent",
      text: "Greenhouse 2 humidity normalized after this morning's alert. Plot A tomatoes are harvest-ready — 2,340 kg estimated.\n\nBattery is at 78%. Solar producing well today — 45 kWh so far.",
    },
  ],
  forge: [
    {
      role: "agent",
      text: "3 tasks are overdue. I've prepared a reassignment proposal — it needs your approval before I move them.\n\nMaintenance budget is at 112%. Want me to flag that in the next P&L summary?",
    },
  ],
  atlas: [
    {
      role: "agent",
      text: "2 marketplace listings published today. Terraluna Ecovillage in Portugal is hosting a permaculture intensive in July — could be relevant for the work-stay program.\n\nAnything you'd like me to follow up on in the network?",
    },
  ],
  iris: [
    {
      role: "agent",
      text: "Marcus Rivera's carpentry skills are a strong match for the Plot B build project. Shall I make the introduction?\n\nAlso — 3 Explorer members are approaching their 90-day renewal window. Might be worth a personal touch.",
    },
  ],
};

const demoReplies: Record<string, string[]> = {
  sage: [
    "The Solar Array Expansion has 3 objections on record:\n\n• **James W.** — upfront cost timing concerns\n• **Mia Clarke** — wants clearer environmental impact data\n• **Anonymous** — prefers phased approach\n\nThe integration round I drafted addresses James's concern directly. I'd recommend a 48-hour window for the others to review before re-opening the vote.",
    "I've drafted a consent round agenda for the Garden Expansion. It runs about 40 minutes. Want me to schedule it for next Tuesday's council meeting?",
    "Here's a summary of all 5 active proposals with current vote counts and deadlines. I can send this to the community channel as a weekly governance update — just say the word.",
  ],
  orion: [
    "Current campaigns:\n\n• **Equity round** — $510K raised of $750K (68%), closes Aug 2026\n• **BC Green Infrastructure Grant** — $150K approved ✓\n• **Crowdfunding** — $47K of $100K (47%), 23 days left\n\nRunway: 14 months. No immediate risk.",
    "Draft investor update is ready. Highlights Q2 revenue growth (+8.3%), the energy milestone, and the work-stay cohort expansion. I'll flag it for your review.",
  ],
  fern: [
    "Current sensor readings:\n\n• Soil moisture Plot A: 72% (optimal)\n• Soil moisture Plot C: 41% (low — monitor)\n• Greenhouse temp: 22°C\n• Battery: 78%, charging\n\nAll other sensors within normal range.",
    "Panel 18 is producing 22% below baseline. Could be debris accumulation or a micro-inverter issue. I'd recommend a visual inspection before assuming hardware failure.",
  ],
  forge: [
    "Overdue tasks:\n\n1. **Sauna pump inspection** — 3 days overdue, unassigned\n2. **Winter path gravel top-up** — 5 days overdue, Ben M.\n3. **Greenhouse shade net repair** — 2 days overdue, unassigned\n\nI can reassign #1 and #3 to work-stay participants with relevant skills. Awaiting your approval.",
    "This month: Revenue $187K, Expenses $142K, Net $45K (24% margin). Maintenance is the only category over budget at 112%. All other categories within 5% of target.",
  ],
  atlas: [
    "Marketplace this month: $4,200 volume across 23 active sellers. Top categories: tools (32%), produce (28%), services (24%), skill swaps (16%).\n\nTop listing: Elena's herbal tincture set — 4 inquiries this week.",
    "3 villages in the network hosted events this month: Earthsong (NZ), Terraluna (PT), and River Valley Co-op (BC). Terraluna's permaculture intensive has 4 spots left — I can share the link if relevant for work-stay alumni.",
  ],
  iris: [
    "Marcus Rivera: carpentry (advanced), permaculture (intermediate), 3 strong references. He applied for the summer work-stay cohort and ranked 3rd in screening.\n\nThe Plot B build needs 2 skilled carpenters for 6 weeks. Strong match. Want me to draft the intro message?",
    "3 Explorer members approaching renewal:\n\n• **Sarah P.** — 88 days, highly active\n• **James H.** — 91 days, low recent activity\n• **Ana M.** — 94 days, upcoming event RSVPs\n\nI'd focus personal outreach on James — he's the one most likely to churn.",
  ],
};

const suggestedActions: Record<string, string[]> = {
  sage:   ["Summarize active votes", "Log a tension", "Draft announcement", "Schedule integration round"],
  orion:  ["Show runway calculation", "Grant deadline summary", "Draft investor update", "Campaign status"],
  fern:   ["Current sensor readings", "Harvest-ready plots", "Energy report", "Flag anomalies"],
  forge:  ["Overdue tasks summary", "Generate work order", "P&L snapshot", "Occupancy report"],
  atlas:  ["Marketplace analytics", "Network pulse", "Pending listings", "Skill-swap matches"],
  iris:   ["Member skill matches", "Renewal alerts", "Upcoming events summary", "Work-stay screening"],
};

/* ── Component ───────────────────────────────────────────────────────── */

interface AgentDrawerProps {
  agentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentDrawer({ agentId, isOpen, onClose }: AgentDrawerProps) {
  const agent = findAgent(agentId);
  const [messages, setMessages] = useState<ChatMessage[]>(demoGreetings[agentId] ?? []);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const replyPool = demoReplies[agentId] ?? [];
  const replyIndexRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = replyPool[replyIndexRef.current % replyPool.length] ?? "I'll look into that for you.";
      replyIndexRef.current += 1;
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "agent", text: reply }]);
    }, 1200 + Math.random() * 600);
  };

  if (!agent) return null;

  const Icon = iconMap[agent.iconName] ?? Robot;
  const ac = accentMap[agent.accent];
  const actions = suggestedActions[agentId] ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col bg-[#16131F] border-l border-white/[0.06] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06] shrink-0">
              <div className={`w-9 h-9 rounded-xl overflow-hidden shrink-0 ${ac.bg}`}>
                <Image
                  src={agent.imgSrc}
                  alt={agent.name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{agent.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${ac.bg} ${ac.text} ${ac.border}`}>
                    {agent.archetype}
                  </span>
                </div>
                <p className="text-[11px] text-white/35 truncate">{agent.role}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/agents/${agent.id}`}
                  className={`text-[11px] ${ac.text} opacity-60 hover:opacity-100 flex items-center gap-0.5 transition-opacity`}
                >
                  Profile <ArrowRight size={10} />
                </Link>
                <button onClick={onClose} className="p-1.5 text-white/30 hover:text-white/60 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "agent" && (
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${ac.bg}`}>
                      <Icon size={12} className={ac.text} weight="fill" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-sm leading-relaxed ${
                      msg.role === "agent"
                        ? "bg-white/[0.06] text-white/75"
                        : "bg-white/[0.1] text-white/85"
                    }`}
                  >
                    {msg.text.split("\n").map((line, j) => {
                      if (!line) return <br key={j} />;
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <span key={j} className="block">
                          {parts.map((p, k) =>
                            p.startsWith("**") ? (
                              <strong key={k} className="text-white font-medium">{p.slice(2, -2)}</strong>
                            ) : p
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${ac.bg}`}>
                    <Icon size={12} className={ac.text} weight="fill" />
                  </div>
                  <div className="rounded-2xl px-3.5 py-3 bg-white/[0.06] flex items-center gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className={`w-1.5 h-1.5 rounded-full ${ac.text.replace("text-", "bg-")} opacity-60 animate-bounce`}
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested actions */}
            {actions.length > 0 && (
              <div className="px-4 pb-2 shrink-0">
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {actions.map((action) => (
                    <button
                      key={action}
                      onClick={() => sendMessage(action)}
                      disabled={isTyping}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors disabled:opacity-40 ${ac.border} ${ac.text} ${ac.bg} hover:opacity-80`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2 shrink-0 border-t border-white/[0.06]">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${agent.name}…`}
                  disabled={isTyping}
                  className={`flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors disabled:opacity-50 ${ac.inputFocus}`}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 ${ac.bg} ${ac.text}`}
                >
                  <PaperPlaneRight size={16} weight="fill" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

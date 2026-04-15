"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Scales, Compass, Plant, Hammer, GlobeHemisphereWest, Sparkle,
  Robot, ArrowRight, CheckCircle, Clock, Warning, Wrench,
  Megaphone, Users, Leaf, CurrencyDollar,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

/* ── Types ─────────────────────────────────────────────────────────── */

type Status = "active" | "idle" | "thinking" | "needs-approval";
type Accent = "indigo" | "amber" | "emerald" | "terracotta" | "mauve" | "blue";
type Model = "opus" | "sonnet" | "haiku";

interface Agent {
  id: string;
  name: string;
  archetype: string;
  role: string;
  voice: string;
  modules: string[];
  icon: ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }>;
  accent: Accent;
  status: Status;
  actionsToday: number;
  pendingApprovals: number;
  lastActive: string;
  skills: string[];
  model: Model;
}

interface RecentAction {
  agent: string;
  accent: Accent;
  action: string;
  time: string;
  type: "resolved" | "approval" | "created" | "action" | "logged" | "sent" | "published";
}

/* ── Data ───────────────────────────────────────────────────────────── */

const agents: Agent[] = [
  {
    id: "sage",
    name: "Sage",
    archetype: "Elder",
    role: "Governance & Communications",
    voice: "Before we vote — what tension are we trying to resolve?",
    modules: ["Governance", "Comms"],
    icon: Scales,
    accent: "indigo",
    status: "thinking",
    actionsToday: 8,
    pendingApprovals: 1,
    lastActive: "2 min ago",
    skills: ["Draft proposals", "Facilitate consent rounds", "Log tensions", "Send announcements"],
    model: "opus",
  },
  {
    id: "orion",
    name: "Orion",
    archetype: "Steward",
    role: "Capital & Fundraising",
    voice: "Runway at 14 months. Two grant deadlines this week.",
    modules: ["Fundraising"],
    icon: Compass,
    accent: "amber",
    status: "idle",
    actionsToday: 4,
    pendingApprovals: 0,
    lastActive: "1 hr ago",
    skills: ["Track grant deadlines", "Draft investor updates", "Flag runway risk", "Cap table summaries"],
    model: "sonnet",
  },
  {
    id: "fern",
    name: "Fern",
    archetype: "Keeper",
    role: "Land & Energy Systems",
    voice: "Plot A is ready. Moisture low — rain coming in two days.",
    modules: ["Farm & IoT", "Energy"],
    icon: Plant,
    accent: "emerald",
    status: "active",
    actionsToday: 12,
    pendingApprovals: 0,
    lastActive: "just now",
    skills: ["Monitor sensors", "Flag anomalies", "Crop cycle planning", "Energy optimization"],
    model: "haiku",
  },
  {
    id: "forge",
    name: "Forge",
    archetype: "Executor",
    role: "Operations & Tasks",
    voice: "3 tasks overdue. Shall I reassign to available work-stay participants?",
    modules: ["Operations", "Tasks"],
    icon: Hammer,
    accent: "terracotta",
    status: "needs-approval",
    actionsToday: 11,
    pendingApprovals: 2,
    lastActive: "5 min ago",
    skills: ["Triage tasks", "Reassign work orders", "Flag budget overruns", "Generate work orders"],
    model: "sonnet",
  },
  {
    id: "atlas",
    name: "Atlas",
    archetype: "Weaver",
    role: "Network & Exchange",
    voice: "3 villages in our network are hosting events this month.",
    modules: ["Marketplace", "Network Map"],
    icon: GlobeHemisphereWest,
    accent: "mauve",
    status: "idle",
    actionsToday: 3,
    pendingApprovals: 0,
    lastActive: "3 hrs ago",
    skills: ["Curate marketplace listings", "Inter-village introductions", "Network pulse reports"],
    model: "sonnet",
  },
  {
    id: "iris",
    name: "Iris",
    archetype: "Connector",
    role: "People, Culture & Soul",
    voice: "Marcus's skills match the Plot B build. Shall I make the intro?",
    modules: ["Members", "Work-Stay", "Events", "Wellness", "Membership", "Village Soul"],
    icon: Sparkle,
    accent: "blue",
    status: "active",
    actionsToday: 9,
    pendingApprovals: 0,
    lastActive: "15 min ago",
    skills: ["Skill matching", "Culture design", "Event planning", "Wellness check-ins", "Soul.md stewardship"],
    model: "opus",
  },
];

const recentActions: RecentAction[] = [
  { agent: "Fern", accent: "emerald", action: "Sensor alert resolved — Greenhouse 2 humidity normalized", time: "2 min ago", type: "resolved" },
  { agent: "Forge", accent: "terracotta", action: "Flagged 3 overdue tasks — awaiting reassignment approval", time: "5 min ago", type: "approval" },
  { agent: "Sage", accent: "indigo", action: "Drafted integration round summary for Solar Array proposal", time: "12 min ago", type: "created" },
  { agent: "Iris", accent: "blue", action: "Matched Marcus Rivera to Plot B carpentry project", time: "28 min ago", type: "action" },
  { agent: "Fern", accent: "emerald", action: "Battery storage hit 78% — efficiency record logged", time: "1 hr ago", type: "logged" },
  { agent: "Orion", accent: "amber", action: "BC Green Infrastructure Grant deadline reminder sent", time: "2 hrs ago", type: "sent" },
  { agent: "Atlas", accent: "mauve", action: "2 new marketplace listings published: sauna tools, compost", time: "3 hrs ago", type: "published" },
  { agent: "Sage", accent: "indigo", action: "Tension logged: Quiet hours policy ambiguity flagged by 2 members", time: "4 hrs ago", type: "logged" },
];

const globalStats = [
  { label: "Active Agents", value: "6 / 6", icon: Robot },
  { label: "Actions Today", value: "47", icon: CheckCircle },
  { label: "Pending Approvals", value: "3", icon: Warning },
  { label: "Cost This Month", value: "$124", icon: CurrencyDollar },
];

/* ── Accent colour maps ─────────────────────────────────────────────── */

const accentMap: Record<Accent, { bg: string; text: string; border: string; dot: string }> = {
  indigo:     { bg: "bg-indigo-500/10",    text: "text-indigo-400",  border: "border-indigo-500/20",  dot: "bg-indigo-400" },
  amber:      { bg: "bg-amber/10",         text: "text-amber",       border: "border-amber/20",       dot: "bg-amber" },
  emerald:    { bg: "bg-emerald-500/10",   text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  terracotta: { bg: "bg-[#C4614A]/10",     text: "text-[#C4614A]",   border: "border-[#C4614A]/20",   dot: "bg-[#C4614A]" },
  mauve:      { bg: "bg-[#9B7FA0]/10",     text: "text-[#9B7FA0]",   border: "border-[#9B7FA0]/20",   dot: "bg-[#9B7FA0]" },
  blue:       { bg: "bg-blue-500/10",      text: "text-blue-400",    border: "border-blue-500/20",    dot: "bg-blue-400" },
};

const statusMap: Record<Status, { label: string; dot: string; pulse: boolean }> = {
  active:           { label: "Active",         dot: "bg-emerald-400", pulse: false },
  idle:             { label: "Idle",           dot: "bg-white/20",    pulse: false },
  thinking:         { label: "Thinking…",      dot: "bg-amber",       pulse: true  },
  "needs-approval": { label: "Needs Approval", dot: "bg-[#C4614A]",   pulse: true  },
};

const actionTypeIcon: Record<RecentAction["type"], ComponentType<{ size?: number; className?: string }>> = {
  resolved:  CheckCircle,
  approval:  Warning,
  created:   Wrench,
  action:    Users,
  logged:    Leaf,
  sent:      Megaphone,
  published: GlobeHemisphereWest,
};

const modelBadge: Record<Model, string> = {
  opus:    "bg-amber/10 text-amber border-amber/20",
  sonnet:  "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  haiku:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

/* ── Animations ──────────────────────────────────────────────────────── */

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const staggerFast  = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const staggerSlow  = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          The <span className="italic">Council</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Wells Gray Village — AI agent fleet managing village operations
        </p>
      </div>

      {/* Global stats */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
      >
        {globalStats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-white/40">{s.label}</span>
                <div className="rounded-lg bg-amber/10 p-1.5">
                  <Icon size={14} className="text-amber" />
                </div>
              </div>
              <div className="text-xl font-semibold text-white lg:text-2xl">{s.value}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Agent grid */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {agents.map((agent) => {
          const Icon = agent.icon;
          const ac = accentMap[agent.accent];
          const st = statusMap[agent.status];
          const maxModules = 3;
          const visibleModules = agent.modules.slice(0, maxModules);
          const extraModules = agent.modules.length - maxModules;

          return (
            <motion.div
              key={agent.id}
              variants={fadeUp}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 flex flex-col gap-4 hover:border-white/[0.1] transition-colors duration-300"
            >
              {/* Top row: icon + name + model badge */}
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${ac.bg}`}>
                  <Icon size={22} className={ac.text} weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-semibold text-white">{agent.name}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${ac.bg} ${ac.text} ${ac.border}`}>
                      {agent.archetype}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${modelBadge[agent.model]}`}>
                      {agent.model}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 truncate">{agent.role}</p>
                </div>
              </div>

              {/* Voice quote */}
              <p className="text-xs italic text-white/30 leading-relaxed border-l-2 border-white/[0.06] pl-3">
                &ldquo;{agent.voice}&rdquo;
              </p>

              {/* Module chips */}
              <div className="flex flex-wrap gap-1.5">
                {visibleModules.map((mod) => (
                  <span
                    key={mod}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] text-white/40 border border-white/[0.06]"
                  >
                    {mod}
                  </span>
                ))}
                {extraModules > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] text-white/30 border border-white/[0.06]">
                    +{extraModules} more
                  </span>
                )}
              </div>

              {/* Status + stats row */}
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${st.dot} ${
                      st.pulse ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="text-xs text-white/50">{st.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>{agent.actionsToday} actions today</span>
                  {agent.pendingApprovals > 0 && (
                    <span className="text-[#C4614A]">{agent.pendingApprovals} pending</span>
                  )}
                </div>
              </div>

              {/* Last active + view link */}
              <div className="flex items-center justify-between -mt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-white/25">
                  <Clock size={11} />
                  {agent.lastActive}
                </div>
                <Link
                  href={`/agents/${agent.id}`}
                  className={`flex items-center gap-1 text-xs font-medium transition-colors ${ac.text} opacity-60 hover:opacity-100`}
                >
                  View agent
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Council Activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-medium text-white">Recent Council Activity</h2>
          <span className="text-xs text-white/25">Last 8 actions</span>
        </div>

        <div className="space-y-0">
          {recentActions.map((item, i) => {
            const TypeIcon = actionTypeIcon[item.type];
            const ac = accentMap[item.accent];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.04, duration: 0.35 }}
                className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0"
              >
                <div className={`mt-0.5 shrink-0 ${ac.text}`}>
                  <TypeIcon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[11px] font-semibold ${ac.text}`}>{item.agent}</span>
                    <span className={`inline-flex px-1.5 py-0 rounded text-[9px] uppercase tracking-wide ${ac.bg} ${ac.text} opacity-70`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{item.action}</p>
                </div>
                <span className="text-[10px] text-white/25 shrink-0">{item.time}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

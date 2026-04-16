"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Scales, Compass, Plant, Hammer, GlobeHemisphereWest, Sparkle, Robot,
  ArrowLeft, CheckCircle, Warning, Wrench, Megaphone, Users, Leaf,
  Clock, PencilSimple, FloppyDisk, X, Check, Lock,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { findAgent } from "@/lib/data/dashboard/agents";
import type { AgentData, AgentAccent, AgentModel, AgentStatus, ActionType } from "@/lib/data/dashboard/agents";

type AccentColors = { bg: string; text: string; border: string; ring: string };

/* ── Icon map ───────────────────────────────────────────────────────── */

const iconMap: Record<string, ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }>> = {
  Scales, Compass, Plant, Hammer, GlobeHemisphereWest, Sparkle,
};

/* ── Colour maps ────────────────────────────────────────────────────── */

const accentMap: Record<AgentAccent, { bg: string; text: string; border: string; ring: string }> = {
  indigo:     { bg: "bg-indigo-500/10",  text: "text-indigo-400",  border: "border-indigo-500/25", ring: "ring-indigo-500/30"  },
  amber:      { bg: "bg-amber/10",       text: "text-amber",       border: "border-amber/25",       ring: "ring-amber/30"       },
  emerald:    { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", ring: "ring-emerald-500/30" },
  terracotta: { bg: "bg-[#C4614A]/10",   text: "text-[#C4614A]",   border: "border-[#C4614A]/25",   ring: "ring-[#C4614A]/30"   },
  mauve:      { bg: "bg-[#9B7FA0]/10",   text: "text-[#9B7FA0]",   border: "border-[#9B7FA0]/25",   ring: "ring-[#9B7FA0]/30"   },
  blue:       { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/25",    ring: "ring-blue-500/30"    },
};

const statusMap: Record<AgentStatus, { label: string; dot: string; pulse: boolean }> = {
  active:           { label: "Active",         dot: "bg-emerald-400", pulse: false },
  idle:             { label: "Idle",           dot: "bg-white/20",    pulse: false },
  thinking:         { label: "Thinking…",      dot: "bg-amber",       pulse: true  },
  "needs-approval": { label: "Needs Approval", dot: "bg-[#C4614A]",   pulse: true  },
};

const modelBadge: Record<AgentModel, string> = {
  opus:   "bg-amber/10 text-amber border-amber/20",
  sonnet: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  haiku:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const accessBadge = {
  read:    "bg-blue-500/10 text-blue-400",
  write:   "bg-amber/10 text-amber",
  approve: "bg-[#9B7FA0]/10 text-[#9B7FA0]",
};

const actionTypeIcon: Record<ActionType, ComponentType<{ size?: number; className?: string }>> = {
  resolved:  CheckCircle,
  approval:  Warning,
  created:   Wrench,
  action:    Users,
  logged:    Leaf,
  sent:      Megaphone,
  published: GlobeHemisphereWest,
};

/* ── Soul parser ────────────────────────────────────────────────────── */

interface SoulSection { title: string; lines: string[] }

function parseSoul(soul: string): { heading: string; sections: SoulSection[] } {
  const lines = soul.split("\n");
  let heading = "";
  const sections: SoulSection[] = [];
  let current: SoulSection | null = null;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      heading = line.slice(2);
    } else if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.slice(3), lines: [] };
    } else if (current && line.trim()) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return { heading, sections };
}

function renderLine(line: string, key: number) {
  if (line.startsWith("- ")) {
    const content = line.slice(2);
    // Split on **bold**
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return (
      <li key={key} className="flex items-start gap-2 text-sm text-white/55 leading-relaxed">
        <span className="text-white/20 mt-1.5 shrink-0">·</span>
        <span>
          {parts.map((p, i) =>
            p.startsWith("**") ? <strong key={i} className="text-white/80 font-medium">{p.slice(2, -2)}</strong> : p
          )}
        </span>
      </li>
    );
  }
  return (
    <p key={key} className="text-sm text-white/55 leading-relaxed">
      {line.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
        p.startsWith("**") ? <strong key={i} className="text-white/80 font-medium">{p.slice(2, -2)}</strong> : p
      )}
    </p>
  );
}

/* ── Tabs ────────────────────────────────────────────────────────────── */

const TABS = ["Soul", "Skills", "Access", "History", "Settings"] as const;
type Tab = typeof TABS[number];

/* ── Animations ──────────────────────────────────────────────────────── */

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agentData = findAgent(id);
  const [activeTab, setActiveTab] = useState<Tab>("Soul");

  if (!agentData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Robot size={40} className="text-white/20" />
        <p className="text-white/40 text-sm">Agent &ldquo;{id}&rdquo; not found.</p>
        <Link href="/agents" className="text-xs text-amber hover:text-amber/80 flex items-center gap-1">
          <ArrowLeft size={12} /> Back to Council
        </Link>
      </div>
    );
  }

  const agent = agentData;
  const Icon = iconMap[agent.iconName] ?? Robot;
  const ac = accentMap[agent.accent];
  const st = statusMap[agent.status];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors"
      >
        <ArrowLeft size={13} /> Back to Council
      </Link>

      {/* Agent header card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6"
      >
        <div className="flex items-start gap-5">
          <div className={`w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-2 ${ac.ring} ${ac.bg}`}>
            <Image
              src={agent.imgSrc}
              alt={agent.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h1 className="text-2xl font-semibold text-white">{agent.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ac.bg} ${ac.text} ${ac.border}`}>
                {agent.archetype}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${modelBadge[agent.model]}`}>
                {agent.model}
              </span>
            </div>
            <p className="text-sm text-white/45">{agent.role}</p>
            <p className="text-sm italic text-white/30 mt-2 border-l-2 border-white/[0.08] pl-3">
              &ldquo;{agent.voice}&rdquo;
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2 text-right">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${st.dot} ${st.pulse ? "animate-pulse" : ""}`} />
              <span className="text-xs text-white/50">{st.label}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-white/25">
              <Clock size={11} /> {agent.lastActive}
            </div>
            <div className="text-[11px] text-white/25">{agent.actionsToday} actions today</div>
          </div>
        </div>

        {/* Module chips */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/[0.05]">
          {agent.modules.map((mod) => (
            <span key={mod} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] text-white/40 border border-white/[0.06]">
              {mod}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] relative">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab ? "text-white" : "text-white/35 hover:text-white/60"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="agent-tab-indicator"
                className={`absolute bottom-0 left-0 right-0 h-[2px] ${ac.text.replace("text-", "bg-")}`}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Soul" && <SoulTab agent={agent} ac={ac} />}
          {activeTab === "Skills" && <SkillsTab agent={agent} ac={ac} />}
          {activeTab === "Access" && <AccessTab agent={agent} ac={ac} />}
          {activeTab === "History" && <HistoryTab agent={agent} ac={ac} />}
          {activeTab === "Settings" && <SettingsTab agent={agent} ac={ac} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Soul tab ──────────────────────────────────────────────────────────── */

function SoulTab({ agent, ac }: { agent: AgentData; ac: AccentColors }) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState(agent.soul);
  const { heading, sections } = parseSoul(agent.soul);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-white">{heading}</h2>
          <p className="text-xs text-white/30 mt-0.5">soul.md — governs how this agent reasons and communicates</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-xs text-emerald-400"
            >
              <Check size={12} /> Saved
            </motion.span>
          )}
          {editing ? (
            <>
              <button
                onClick={() => { setEditing(false); setDraft(agent.soul); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/[0.06] transition-colors"
              >
                <X size={12} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${ac.bg} ${ac.text} ${ac.border}`}
              >
                <FloppyDisk size={12} /> Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/[0.06] transition-colors"
            >
              <PencilSimple size={12} /> Edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full h-[480px] rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-sm text-white/70 font-mono leading-relaxed resize-none outline-none focus:border-white/[0.15] transition-colors"
        />
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
          {sections.map((section) => (
            <motion.div
              key={section.title}
              variants={fadeUp}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
            >
              <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${ac.text}`}>
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.lines.map((line, i) => renderLine(line, i))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ── Skills tab ────────────────────────────────────────────────────────── */

function SkillsTab({ agent, ac }: { agent: AgentData; ac: AccentColors }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(agent.skills.map((s) => [s.name, s.enabled]))
  );

  const toggle = (name: string) => setEnabled((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-white">Skills & Capabilities</h2>
          <p className="text-xs text-white/30 mt-0.5">{agent.skills.filter((s) => enabled[s.name]).length} of {agent.skills.length} enabled</p>
        </div>
      </div>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2">
        {agent.skills.map((skill) => (
          <motion.div
            key={skill.name}
            variants={fadeUp}
            className={`rounded-2xl border p-4 flex items-start gap-4 transition-colors ${
              enabled[skill.name] ? "border-white/[0.08] bg-white/[0.04]" : "border-white/[0.04] bg-white/[0.02] opacity-60"
            }`}
          >
            <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${enabled[skill.name] ? ac.bg : "bg-white/[0.04]"}`}>
              <Wrench size={14} className={enabled[skill.name] ? ac.text : "text-white/25"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-white/80">{skill.name}</span>
                <span className={`inline-flex items-center px-1.5 py-0 rounded text-[9px] uppercase tracking-wide font-medium ${accessBadge[skill.access]}`}>
                  {skill.access}
                </span>
              </div>
              <p className="text-xs text-white/40">{skill.description}</p>
            </div>
            <button
              onClick={() => toggle(skill.name)}
              className={`relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${
                enabled[skill.name] ? ac.bg.replace("/10", "/30") : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                  enabled[skill.name] ? `left-4 ${ac.text.replace("text-", "bg-")}` : "left-0.5 bg-white/30"
                }`}
              />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Access tab ────────────────────────────────────────────────────────── */

function AccessTab({ agent, ac }: { agent: AgentData; ac: AccentColors }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-medium text-white">Module Access</h2>
        <p className="text-xs text-white/30 mt-0.5">What {agent.name} can read, write, and when approval is required</p>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-white/30">Module</th>
              <th className="px-5 py-3 text-center text-[10px] font-medium uppercase tracking-wider text-white/30">Read</th>
              <th className="px-5 py-3 text-center text-[10px] font-medium uppercase tracking-wider text-white/30">Write</th>
              <th className="px-5 py-3 text-center text-[10px] font-medium uppercase tracking-wider text-white/30">Needs Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {agent.access.map((rule) => (
              <tr key={rule.module} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-sm text-white/70">{rule.module}</td>
                <td className="px-5 py-3.5 text-center">
                  {rule.read
                    ? <Check size={14} className="text-emerald-400 mx-auto" weight="bold" />
                    : <X size={14} className="text-white/20 mx-auto" />}
                </td>
                <td className="px-5 py-3.5 text-center">
                  {rule.write
                    ? <Check size={14} className={`${ac.text} mx-auto`} weight="bold" />
                    : <X size={14} className="text-white/20 mx-auto" />}
                </td>
                <td className="px-5 py-3.5 text-center">
                  {rule.approvalRequired
                    ? <Lock size={13} className="text-amber mx-auto" weight="fill" />
                    : <span className="text-[10px] text-white/20">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/25 px-1">
        <Lock size={10} className="inline mr-1" weight="fill" /> Approval required = {agent.name} proposes the action but a human must confirm before it executes.
      </p>
    </div>
  );
}

/* ── History tab ───────────────────────────────────────────────────────── */

function HistoryTab({ agent, ac }: { agent: AgentData; ac: AccentColors }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-medium text-white">Action History</h2>
        <p className="text-xs text-white/30 mt-0.5">Recent actions taken by {agent.name}</p>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="divide-y divide-white/[0.04]">
          {agent.history.map((entry, i) => {
            const TypeIcon = actionTypeIcon[entry.type];
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className={`mt-0.5 shrink-0 ${ac.text}`}>
                  <TypeIcon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/65 leading-relaxed">{entry.action}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide ${ac.bg} ${ac.text} opacity-70`}>
                    {entry.type}
                  </span>
                  <p className="text-[10px] text-white/25 mt-1">{entry.time}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Settings tab ──────────────────────────────────────────────────────── */

function SettingsTab({ agent, ac }: { agent: AgentData; ac: AccentColors }) {
  const models: AgentModel[] = ["haiku", "sonnet", "opus"];
  const [selectedModel, setSelectedModel] = useState<AgentModel>(agent.model);
  const [costCap, setCostCap] = useState("50");
  const [active, setActive] = useState(agent.status !== "idle");

  const modelDesc: Record<AgentModel, string> = {
    haiku:  "Fastest, lowest cost — best for high-frequency monitoring tasks",
    sonnet: "Balanced speed and quality — best for analysis and drafting",
    opus:   "Most capable — best for complex reasoning and sensitive decisions",
  };

  return (
    <div className="space-y-4">
      {/* Status toggle */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Agent Active</h3>
          <p className="text-xs text-white/35 mt-0.5">When off, {agent.name} will not monitor or take actions</p>
        </div>
        <button
          onClick={() => setActive((v) => !v)}
          className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${active ? ac.bg.replace("/10", "/30") : "bg-white/10"}`}
        >
          <span className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ${active ? `left-5 ${ac.text.replace("text-", "bg-")}` : "left-1 bg-white/30"}`} />
        </button>
      </div>

      {/* Model selector */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-white">Model</h3>
          <p className="text-xs text-white/35 mt-0.5">Choose the Claude model this agent runs on</p>
        </div>
        <div className="space-y-2">
          {models.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                selectedModel === m ? `${ac.border} ${ac.bg}` : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedModel === m ? ac.border : "border-white/20"
              }`}>
                {selectedModel === m && <div className={`w-2 h-2 rounded-full ${ac.text.replace("text-", "bg-")}`} />}
              </div>
              <div>
                <span className={`text-sm font-medium capitalize ${selectedModel === m ? ac.text : "text-white/60"}`}>{m}</span>
                <p className="text-xs text-white/30 mt-0.5">{modelDesc[m]}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Monthly cost cap */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-white">Monthly Cost Cap</h3>
          <p className="text-xs text-white/35 mt-0.5">{agent.name} will pause and notify you when this limit is reached</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-sm">$</span>
          <input
            type="number"
            value={costCap}
            onChange={(e) => setCostCap(e.target.value)}
            className="w-28 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-white/[0.2] transition-colors"
          />
          <span className="text-white/30 text-xs">USD / month</span>
        </div>
      </div>
    </div>
  );
}

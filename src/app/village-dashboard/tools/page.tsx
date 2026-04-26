"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench, CheckCircle, Clock, Warning, MapPin,
  Hammer, Plant, Boat, ForkKnife, Sparkle, Plus,
  ArrowsClockwise, Package, ArrowRight,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import AgentDrawer from "@/components/dashboard/AgentDrawer";
import { tools, borrowingActivity, toolStats, toolCategories } from "@/lib/data/dashboard/tools";
import type { Tool, ToolStatus, ToolCondition, ToolCategory } from "@/lib/data/dashboard/tools";

/* ── Maps ─────────────────────────────────────────────────────────── */

const categoryIcon: Record<ToolCategory, ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }>> = {
  "Power Tools": Hammer,
  "Garden": Plant,
  "Outdoor Recreation": Boat,
  "Kitchen": ForkKnife,
  "Specialty": Sparkle,
};

const statusStyle: Record<ToolStatus, { bg: string; text: string; dot: string; label: string }> = {
  available:   { bg: "bg-emerald-500/10",  text: "text-emerald-400",  dot: "bg-emerald-400",  label: "Available" },
  borrowed:    { bg: "bg-amber/10",        text: "text-amber",        dot: "bg-amber",        label: "Borrowed" },
  maintenance: { bg: "bg-[#9B7FA0]/10",    text: "text-[#9B7FA0]",    dot: "bg-[#9B7FA0]",    label: "Maintenance" },
};

const conditionStyle: Record<ToolCondition, string> = {
  excellent: "text-emerald-400/80",
  good:      "text-white/55",
  fair:      "text-amber/80",
};

const borrowerTypeStyle: Record<string, string> = {
  "Member":    "bg-indigo-500/15 text-indigo-300",
  "Work-Stay": "bg-emerald-500/15 text-emerald-300",
  "Guest":     "bg-amber/15 text-amber",
};

const activityIcon = {
  checkout:    { Icon: ArrowRight,       color: "text-amber" },
  return:      { Icon: ArrowsClockwise,  color: "text-emerald-400" },
  added:       { Icon: Plus,             color: "text-indigo-400" },
  maintenance: { Icon: Wrench,           color: "text-[#9B7FA0]" },
};

/* ── Stats config ───────────────────────────────────────────────── */

const stats = [
  { label: "Total Tools",     value: toolStats.total,     icon: Package,      tone: "amber"     },
  { label: "Available",       value: toolStats.available, icon: CheckCircle,  tone: "emerald"   },
  { label: "Currently Out",   value: toolStats.borrowed,  icon: Clock,        tone: "amber"     },
  { label: "Overdue Returns", value: toolStats.overdue,   icon: Warning,      tone: "terracotta", alert: true },
];

const toneBg: Record<string, string> = {
  amber:      "bg-amber/10 text-amber",
  emerald:    "bg-emerald-500/10 text-emerald-400",
  terracotta: "bg-[#C4614A]/10 text-[#C4614A]",
};

/* ── Animation ──────────────────────────────────────────────────── */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const fadeUp  = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ── Filter type ────────────────────────────────────────────────── */

type Filter = "all" | "available" | "borrowed" | "maintenance" | ToolCategory;

const primaryFilters: { key: Filter; label: string; count: number }[] = [
  { key: "all",         label: "All",         count: toolStats.total       },
  { key: "available",   label: "Available",   count: toolStats.available   },
  { key: "borrowed",    label: "Borrowed",    count: toolStats.borrowed    },
  { key: "maintenance", label: "Maintenance", count: toolStats.maintenance },
];

/* ── Page ────────────────────────────────────────────────────────── */

export default function ToolsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [agentOpen, setAgentOpen] = useState(false);

  const filtered: Tool[] = tools.filter((t) => {
    if (filter === "all") return true;
    if (filter === "available" || filter === "borrowed" || filter === "maintenance") {
      return t.status === filter;
    }
    return t.category === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
            Tool <span className="italic">Library</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Village-owned tools available for members and guests to borrow
          </p>
        </div>
        <button
          onClick={() => setAgentOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#C4614A]/25 bg-[#C4614A]/10 text-xs font-medium text-[#C4614A] hover:opacity-80 transition-opacity self-start shrink-0"
        >
          <Hammer size={13} weight="fill" /> Ask Forge
        </button>
      </div>

      {/* Stats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
      >
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className={`rounded-2xl border p-4 lg:p-5 ${
                s.alert && s.value > 0
                  ? "border-[#C4614A]/30 bg-[#C4614A]/[0.06]"
                  : "border-white/[0.06] bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-white/40">{s.label}</span>
                <div className={`rounded-lg p-1.5 ${toneBg[s.tone]}`}>
                  <Icon size={14} weight="fill" />
                </div>
              </div>
              <div className={`text-2xl font-semibold ${s.alert && s.value > 0 ? "text-[#C4614A]" : "text-white"}`}>
                {s.value}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main grid: tool table + activity sidebar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Tool table column */}
        <div className="space-y-4">
          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {primaryFilters.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? "bg-amber/15 text-amber border border-amber/30"
                      : "bg-white/[0.04] text-white/60 border border-white/[0.06] hover:text-white/85 hover:bg-white/[0.07]"
                  }`}
                >
                  {f.label}
                  <span className={`px-1.5 py-0 rounded-full text-[10px] leading-tight ${active ? "bg-amber/20" : "bg-white/[0.08] text-white/45"}`}>
                    {f.count}
                  </span>
                </button>
              );
            })}
            <span className="mx-1 h-4 w-px bg-white/[0.08]" />
            {toolCategories.map((c) => {
              const active = filter === c;
              const Icon = categoryIcon[c];
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? "bg-white/[0.10] text-white border border-white/[0.18]"
                      : "bg-white/[0.04] text-white/55 border border-white/[0.06] hover:text-white/85 hover:bg-white/[0.07]"
                  }`}
                >
                  <Icon size={12} weight="fill" />
                  {c}
                </button>
              );
            })}
          </div>

          {/* Tool table */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            key={filter}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden"
          >
            <div className="overflow-x-auto scrollbar-subtle">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/40 font-medium">Tool</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/40 font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/40 font-medium">Borrower</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/40 font-medium">Checked Out</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/40 font-medium">Due</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/40 font-medium">Condition</th>
                    <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-white/40 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tool) => {
                    const CatIcon = categoryIcon[tool.category];
                    const st = statusStyle[tool.status];
                    return (
                      <motion.tr
                        key={tool.id}
                        variants={fadeUp}
                        className={`border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors ${
                          tool.overdue ? "bg-[#C4614A]/[0.04]" : ""
                        }`}
                      >
                        {/* Tool */}
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                              <CatIcon size={14} className="text-white/55" weight="regular" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-white/85 leading-tight">{tool.name}</div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-white/35">
                                <span>{tool.category}</span>
                                <span className="text-white/20">·</span>
                                <MapPin size={9} weight="fill" />
                                <span>{tool.location}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium ${st.bg} ${st.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${tool.overdue ? "animate-pulse" : ""}`} />
                            {tool.overdue ? "Overdue" : st.label}
                          </span>
                        </td>
                        {/* Borrower */}
                        <td className="px-4 py-3">
                          {tool.borrower ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-[10px] font-medium text-white/70 shrink-0">
                                {tool.borrower.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs text-white/75 leading-tight truncate">{tool.borrower.name}</div>
                                <span className={`inline-block mt-0.5 px-1.5 py-0 rounded text-[9px] uppercase tracking-wide ${borrowerTypeStyle[tool.borrower.type]}`}>
                                  {tool.borrower.type}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-white/25">—</span>
                          )}
                        </td>
                        {/* Checked out */}
                        <td className="px-4 py-3 text-xs text-white/55">
                          {tool.checkedOutDate ?? <span className="text-white/25">—</span>}
                        </td>
                        {/* Due */}
                        <td className="px-4 py-3 text-xs">
                          {tool.dueDate ? (
                            <span className={tool.overdue ? "text-[#C4614A] font-medium" : "text-white/55"}>
                              {tool.dueDate}
                            </span>
                          ) : (
                            <span className="text-white/25">—</span>
                          )}
                        </td>
                        {/* Condition */}
                        <td className="px-4 py-3">
                          <span className={`text-xs capitalize ${conditionStyle[tool.condition]}`}>
                            {tool.condition}
                          </span>
                        </td>
                        {/* Action */}
                        <td className="px-4 py-3 text-right">
                          {tool.status === "available" && (
                            <button className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors">
                              Check out
                            </button>
                          )}
                          {tool.status === "borrowed" && (
                            <button className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-amber bg-amber/10 border border-amber/20 hover:bg-amber/15 transition-colors">
                              Return
                            </button>
                          )}
                          {tool.status === "maintenance" && (
                            <span className="text-[11px] text-white/25 italic">In service</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-white/35">
                No tools match this filter.
              </div>
            )}
          </motion.div>
        </div>

        {/* Activity sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 h-fit lg:sticky lg:top-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Recent Activity</h2>
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Last 8</span>
          </div>
          <div className="space-y-0">
            {borrowingActivity.map((entry, i) => {
              const { Icon, color } = activityIcon[entry.type];
              return (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
                  <div className={`mt-0.5 shrink-0 ${color}`}>
                    <Icon size={13} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/75 leading-snug">
                      {entry.type === "checkout"    && <><span className="font-medium text-white/85">{entry.borrower}</span> checked out <span className="text-white/55">{entry.toolName}</span></>}
                      {entry.type === "return"      && <><span className="font-medium text-white/85">{entry.borrower}</span> returned <span className="text-white/55">{entry.toolName}</span></>}
                      {entry.type === "added"       && <>New tool added: <span className="text-white/55">{entry.toolName}</span></>}
                      {entry.type === "maintenance" && <><span className="text-white/55">{entry.toolName}</span> sent for maintenance</>}
                    </div>
                    <div className="text-[10px] text-white/30 mt-0.5">{entry.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <AgentDrawer agentId="forge" isOpen={agentOpen} onClose={() => setAgentOpen(false)} />
    </div>
  );
}

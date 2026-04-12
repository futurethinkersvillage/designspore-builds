"use client";

import { motion } from "framer-motion";
import {
  ClipboardText, Spinner, CheckCircle, Warning,
  Timer, ArrowUp, FunnelSimple, Calendar,
  Wrench, TreeStructure, UsersThree, Plant, Confetti,
  Flag,
} from "@phosphor-icons/react";

/* ── Inline data ───────────────────────────────────────────────────── */

const stats = [
  { label: "Open Tasks", value: "34", icon: ClipboardText },
  { label: "In Progress", value: "18", icon: Spinner },
  { label: "Completed This Week", value: "12", icon: CheckCircle },
  { label: "Overdue", value: "3", icon: Warning, alert: true },
  { label: "Avg Completion", value: "2.3 days", icon: Timer },
];

const categories = ["All", "Maintenance", "Infrastructure", "Community", "Farm", "Events"];

const categoryIcons: Record<string, typeof Wrench> = {
  Maintenance: Wrench,
  Infrastructure: TreeStructure,
  Community: UsersThree,
  Farm: Plant,
  Events: Confetti,
};

type KanbanCard = {
  title: string;
  assignee: string;
  priority: "P1" | "P2" | "P3" | "P4";
  category: string;
  due: string;
};

const columns: { id: string; label: string; cards: KanbanCard[] }[] = [
  {
    id: "backlog", label: "Backlog",
    cards: [
      { title: "Order replacement pump for well", assignee: "David O.", priority: "P2", category: "Infrastructure", due: "Apr 20" },
      { title: "Plan autumn harvest festival", assignee: "Anika P.", priority: "P3", category: "Events", due: "May 1" },
      { title: "Research composting toilet options", assignee: "Marcus C.", priority: "P3", category: "Infrastructure", due: "Apr 28" },
      { title: "Draft Q3 newsletter content", assignee: "Sarah L.", priority: "P4", category: "Community", due: "May 5" },
      { title: "Update emergency evacuation map", assignee: "Ben M.", priority: "P2", category: "Maintenance", due: "Apr 22" },
      { title: "Source sustainable timber supplier", assignee: "James W.", priority: "P3", category: "Infrastructure", due: "May 10" },
    ],
  },
  {
    id: "in-progress", label: "In Progress",
    cards: [
      { title: "Fix sauna heater thermostat", assignee: "Thomas P.", priority: "P1", category: "Maintenance", due: "Apr 13" },
      { title: "Install solar panel mounting brackets", assignee: "Marcus C.", priority: "P2", category: "Infrastructure", due: "Apr 18" },
      { title: "Repair gazebo railing section B", assignee: "David O.", priority: "P2", category: "Maintenance", due: "Apr 15" },
      { title: "Set up IoT gateway for greenhouse", assignee: "Yuki T.", priority: "P3", category: "Farm", due: "Apr 25" },
      { title: "Paint new cabin exterior", assignee: "Chris D.", priority: "P2", category: "Maintenance", due: "Apr 20" },
    ],
  },
  {
    id: "review", label: "Review",
    cards: [
      { title: "Update work-stay handbook 2026", assignee: "Sarah L.", priority: "P3", category: "Community", due: "Apr 14" },
      { title: "Configure WiFi mesh node 7", assignee: "Yuki T.", priority: "P2", category: "Infrastructure", due: "Apr 12" },
      { title: "Trail marker installation — Loop A", assignee: "Ben M.", priority: "P3", category: "Maintenance", due: "Apr 16" },
      { title: "Inventory audit — tool shed", assignee: "Rachel K.", priority: "P4", category: "Maintenance", due: "Apr 17" },
    ],
  },
  {
    id: "done", label: "Done",
    cards: [
      { title: "Replace water filter cartridges", assignee: "Thomas P.", priority: "P1", category: "Maintenance", due: "Apr 8" },
      { title: "Install new fire pit ring", assignee: "David O.", priority: "P3", category: "Infrastructure", due: "Apr 7" },
      { title: "Fix leaking faucet — Cabin 3", assignee: "Chris D.", priority: "P2", category: "Maintenance", due: "Apr 9" },
      { title: "Calibrate soil moisture sensors", assignee: "Marcus C.", priority: "P3", category: "Farm", due: "Apr 6" },
      { title: "Community notice board — repaint", assignee: "Mira J.", priority: "P4", category: "Community", due: "Apr 10" },
    ],
  },
];

const workOrders = [
  { location: "Cabin 3 — Bathroom", reportedBy: "Elena V.", urgency: "High", assignedTo: "Thomas P.", status: "In Progress", created: "Apr 8" },
  { location: "Main Lodge — Roof", reportedBy: "James W.", urgency: "High", assignedTo: "David O.", status: "Open", created: "Apr 10" },
  { location: "Greenhouse — Ventilation", reportedBy: "Marcus C.", urgency: "Medium", assignedTo: "Yuki T.", status: "In Progress", created: "Apr 6" },
  { location: "Trail Loop B — Bridge", reportedBy: "Ben M.", urgency: "Medium", assignedTo: "Chris D.", status: "Open", created: "Apr 9" },
  { location: "Solar Array — Inverter 2", reportedBy: "Yuki T.", urgency: "High", assignedTo: "Marcus C.", status: "Open", created: "Apr 11" },
  { location: "Cabin 7 — Window Seal", reportedBy: "Sarah L.", urgency: "Low", assignedTo: "David O.", status: "Resolved", created: "Apr 3" },
  { location: "Sauna — Door Hinge", reportedBy: "Anika P.", urgency: "Low", assignedTo: "Thomas P.", status: "Resolved", created: "Apr 2" },
  { location: "Coworking — Power Outlet 4B", reportedBy: "Rachel K.", urgency: "Medium", assignedTo: "Chris D.", status: "In Progress", created: "Apr 7" },
  { location: "Tool Shed — Lock", reportedBy: "Ben M.", urgency: "Low", assignedTo: "David O.", status: "Open", created: "Apr 10" },
  { location: "Cabin 1 — Heater", reportedBy: "Thomas P.", urgency: "High", assignedTo: "Marcus C.", status: "In Progress", created: "Apr 5" },
  { location: "Garden — Irrigation Valve", reportedBy: "Mira J.", urgency: "Medium", assignedTo: "Chris D.", status: "Open", created: "Apr 11" },
  { location: "Parking Area — Lighting", reportedBy: "James W.", urgency: "Low", assignedTo: "Ben M.", status: "Resolved", created: "Apr 1" },
];

const projects = [
  { name: "Cabin Phase 2", start: 3, end: 8, progress: 35, color: "#EA824E" },
  { name: "Coworking Gazebo", start: 4, end: 7, progress: 55, color: "#38387F" },
  { name: "Garden Expansion", start: 5, end: 9, progress: 20, color: "#AF695E" },
  { name: "Trail System", start: 6, end: 10, progress: 10, color: "#73516F" },
  { name: "WiFi Infrastructure", start: 4, end: 6, progress: 80, color: "#EA824E" },
  { name: "Solar Array", start: 5, end: 8, progress: 15, color: "#38387F" },
];

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ── Helpers ─────────────────────────────────────────────────────── */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const priorityBadge: Record<string, string> = {
  P1: "bg-red-500/15 text-red-400",
  P2: "bg-amber/15 text-amber",
  P3: "bg-blue-500/15 text-blue-400",
  P4: "bg-white/10 text-white/50",
};

const urgencyBadge: Record<string, string> = {
  High: "bg-red-500/15 text-red-400",
  Medium: "bg-amber/15 text-amber",
  Low: "bg-white/10 text-white/50",
};

const woStatusBadge: Record<string, string> = {
  Open: "bg-blue-500/15 text-blue-400",
  "In Progress": "bg-amber/15 text-amber",
  Resolved: "bg-emerald-500/15 text-emerald-400",
};

const categoryBadge: Record<string, string> = {
  Maintenance: "bg-amber/10 text-amber",
  Infrastructure: "bg-indigo/15 text-blue-400",
  Community: "bg-mauve/15 text-mauve",
  Farm: "bg-emerald-500/10 text-emerald-400",
  Events: "bg-terracotta/15 text-terracotta",
};

/* ── Page ─────────────────────────────────────────────────────────── */

export default function TasksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Task <span className="italic">Management</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Kanban board, work orders, and project timelines
        </p>
      </div>

      {/* Stats row */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className={`rounded-lg p-1.5 ${s.alert ? "bg-red-500/10" : "bg-amber/10"}`}>
                <s.icon size={14} weight="fill" className={s.alert ? "text-red-400" : "text-amber"} />
              </div>
            </div>
            <div className="text-xl font-semibold text-white lg:text-2xl">{s.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Category Filter tabs */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <FunnelSimple size={14} className="text-white/30 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                cat === "All"
                  ? "bg-amber/20 text-amber"
                  : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Kanban Board */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="overflow-x-auto">
        <div className="grid min-w-[960px] grid-cols-4 gap-4">
          {columns.map((col) => (
            <div key={col.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
              {/* Column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-medium text-white/60">{col.label}</h3>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/[0.08] px-1.5 text-[10px] font-medium text-white/50">
                  {col.cards.length}
                </span>
              </div>
              {/* Cards */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {col.cards.map((card, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.04] p-3 hover:bg-white/[0.06] transition-colors cursor-default">
                    <p className="text-xs text-white/80 leading-relaxed mb-2">{card.title}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${priorityBadge[card.priority]}`}>{card.priority}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${categoryBadge[card.category] || "bg-white/10 text-white/50"}`}>{card.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/30">{card.assignee}</span>
                      <span className="flex items-center gap-1 text-[10px] text-white/25">
                        <Calendar size={9} /> {card.due}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Work Orders */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white">Work Orders</h2>
          <span className="text-xs text-white/30">{workOrders.length} requests</span>
        </div>
        <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
          <table className="w-full min-w-[780px]">
            <thead className="sticky top-0 bg-[#0F0D14]">
              <tr className="text-xs uppercase text-white/30">
                <th className="pb-3 text-left font-medium">Location</th>
                <th className="pb-3 text-left font-medium">Reported By</th>
                <th className="pb-3 text-left font-medium">Urgency</th>
                <th className="pb-3 text-left font-medium">Assigned To</th>
                <th className="pb-3 text-left font-medium">Status</th>
                <th className="pb-3 text-left font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((wo, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 text-xs text-white/80">{wo.location}</td>
                  <td className="py-2.5 text-xs text-white/50">{wo.reportedBy}</td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${urgencyBadge[wo.urgency]}`}>{wo.urgency}</span>
                  </td>
                  <td className="py-2.5 text-xs text-white/50">{wo.assignedTo}</td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${woStatusBadge[wo.status]}`}>{wo.status}</span>
                  </td>
                  <td className="py-2.5 text-xs text-white/30">{wo.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Project Tracker (Gantt-style) */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-5">Project Timeline</h2>
        {/* Month headers */}
        <div className="flex mb-3">
          <div className="w-40 shrink-0" />
          <div className="flex-1 grid grid-cols-12">
            {monthLabels.map((m) => (
              <span key={m} className="text-[10px] text-white/25 text-center">{m}</span>
            ))}
          </div>
        </div>
        {/* Rows */}
        <div className="space-y-3">
          {projects.map((p) => {
            const leftPct = ((p.start - 1) / 12) * 100;
            const widthPct = ((p.end - p.start + 1) / 12) * 100;
            return (
              <div key={p.name} className="flex items-center">
                <div className="w-40 shrink-0 pr-3">
                  <span className="text-xs text-white/60 truncate block">{p.name}</span>
                </div>
                <div className="flex-1 relative h-7 bg-white/[0.02] rounded-md">
                  {/* Full bar */}
                  <div
                    className="absolute top-0 h-full rounded-md opacity-30"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: p.color }}
                  />
                  {/* Progress overlay */}
                  <div
                    className="absolute top-0 h-full rounded-md"
                    style={{ left: `${leftPct}%`, width: `${widthPct * (p.progress / 100)}%`, backgroundColor: p.color }}
                  />
                  {/* Label */}
                  <div
                    className="absolute top-0 h-full flex items-center justify-center"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  >
                    <span className="text-[10px] font-medium text-white/80">{p.progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Current month indicator */}
        <div className="flex mt-2">
          <div className="w-40 shrink-0" />
          <div className="flex-1 relative">
            <div className="absolute h-3 w-px bg-red-400/60" style={{ left: `${((4 - 0.5) / 12) * 100}%` }}>
              <span className="absolute -top-0.5 -translate-x-1/2 text-[8px] text-red-400/60">Now</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

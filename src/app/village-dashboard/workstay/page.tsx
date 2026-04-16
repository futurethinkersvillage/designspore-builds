"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Backpack, Users, Star, ArrowUp, CheckCircle,
  ClipboardText, CalendarBlank, Timer, UserPlus, Sparkle,
} from "@phosphor-icons/react";
import AgentDrawer from "@/components/dashboard/AgentDrawer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

/* ── Data ─────────────────────────────────────────────────────────── */

const cohort = {
  name: "Summer 2026",
  participants: 12,
  start: "May 1, 2026",
  end: "Sep 30, 2026",
  week: 8,
  totalWeeks: 22,
};

const pipeline = [
  { stage: "Applied", count: 47, color: "bg-white/10 text-white/50", width: "100%" },
  { stage: "Screening", count: 18, color: "bg-blue-500/15 text-blue-400", width: "38%" },
  { stage: "Interview", count: 8, color: "bg-indigo/15 text-blue-400", width: "17%" },
  { stage: "Accepted", count: 12, color: "bg-emerald-500/15 text-emerald-400", width: "26%" },
  { stage: "Waitlist", count: 6, color: "bg-amber/15 text-amber", width: "13%" },
];

const stats = [
  { label: "Total Applications", value: "91", trend: "+24", trendUp: true, icon: ClipboardText },
  { label: "Acceptance Rate", value: "26%", trend: "Selective", trendUp: true, icon: CheckCircle },
  { label: "Avg Rating", value: "4.6/5", trend: "+0.2", trendUp: true, icon: Star },
  { label: "Hours Logged", value: "2,847", trend: "+340 this week", trendUp: true, icon: Timer },
];

const participants = [
  { name: "Alex Torres", skills: ["Carpentry", "Solar"], hours: 156, rating: 4.7, initials: "AT" },
  { name: "Mei Lin", skills: ["Farming", "Cooking"], hours: 189, rating: 4.9, initials: "ML" },
  { name: "Jonas Berg", skills: ["Construction", "Plumbing"], hours: 142, rating: 4.5, initials: "JB" },
  { name: "Priya Nair", skills: ["Teaching", "Yoga"], hours: 178, rating: 4.8, initials: "PN" },
  { name: "Sam O'Brien", skills: ["Tech", "IoT"], hours: 134, rating: 4.6, initials: "SO" },
  { name: "Lucia Ferreira", skills: ["Garden", "Herbalism"], hours: 201, rating: 4.9, initials: "LF" },
  { name: "Takeshi Yamada", skills: ["Woodworking", "Design"], hours: 167, rating: 4.7, initials: "TY" },
  { name: "Emma Lindström", skills: ["Admin", "Events"], hours: 145, rating: 4.4, initials: "EL" },
  { name: "Rafael Costa", skills: ["Farming", "Animals"], hours: 198, rating: 4.8, initials: "RC" },
  { name: "Nina Kowalski", skills: ["Cooking", "Fermentation"], hours: 176, rating: 4.6, initials: "NK" },
  { name: "Aiden Murphy", skills: ["Building", "Trails"], hours: 112, rating: 4.3, initials: "AM" },
  { name: "Freya Hansen", skills: ["Art", "Teaching"], hours: 89, rating: 4.5, initials: "FH" },
];

const totalHours = 400;
const hoursData = participants.map((p) => ({
  name: p.name.split(" ")[0],
  hours: p.hours,
  fill: p.hours / totalHours >= 0.4 ? "#34d399" : p.hours / totalHours >= 0.2 ? "#EA824E" : "#AF695E",
}));

const taskAssignments: Record<string, string[]> = {
  "Alex T.": ["Farm", "Build", "Build", "Maintenance", "Free"],
  "Mei L.": ["Kitchen", "Farm", "Farm", "Kitchen", "Free"],
  "Jonas B.": ["Build", "Build", "Maintenance", "Build", "Build"],
  "Priya N.": ["Events", "Free", "Events", "Free", "Events"],
  "Sam O.": ["Tech", "Tech", "Farm", "Tech", "Free"],
  "Lucia F.": ["Farm", "Farm", "Farm", "Garden", "Free"],
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const cellColors: Record<string, string> = {
  Farm: "bg-emerald-500/20 text-emerald-400",
  Kitchen: "bg-amber/20 text-amber",
  Build: "bg-indigo/20 text-blue-400",
  Maintenance: "bg-terracotta/20 text-orange-300",
  Events: "bg-mauve/20 text-purple-300",
  Tech: "bg-blue-500/20 text-blue-400",
  Garden: "bg-emerald-500/15 text-emerald-300",
  Free: "bg-white/[0.04] text-white/25",
};

const pastCohorts = [
  { name: "Spring 2026", dates: "Mar 1 – Apr 30", participants: 8, rating: 4.5, highlight: "Built new sauna deck and outdoor showers" },
  { name: "Fall 2025", dates: "Sep 1 – Oct 31", participants: 10, rating: 4.7, highlight: "Completed trail system Phase 1 (2.4km loop)" },
  { name: "Summer 2025", dates: "May 1 – Sep 30", participants: 14, rating: 4.6, highlight: "Constructed Bunk Cabin B (12 beds)" },
  { name: "Spring 2025", dates: "Apr 1 – May 31", participants: 6, rating: 4.4, highlight: "Launched herb spiral garden and greenhouse 1" },
];

function HoursTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs">
      <p className="text-white/50">{label}</p>
      <p className="text-white">{payload[0].value} / {totalHours} hrs</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function WorkStayPage() {
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
            Work-Stay <span className="italic">Programs</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">Application pipeline, cohorts, tasks, and participant tracking</p>
        </div>
        <button
          onClick={() => setAgentOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-xs font-medium text-blue-400 hover:opacity-80 transition-opacity self-start shrink-0"
        >
          <Sparkle size={13} weight="fill" /> Ask Iris
        </button>
      </div>

      {/* Current cohort banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1A1720 0%, #38387F 100%)" }}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-1">Active Cohort</p>
              <h2 className="font-serif text-3xl font-light text-white">{cohort.name} <span className="italic">Cohort</span></h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <Users size={14} className="text-white/60" />
              <span className="text-sm text-white">{cohort.participants} participants</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/50 mb-4">
            <span>{cohort.start} – {cohort.end}</span>
            <span>Week {cohort.week} of {cohort.totalWeeks}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-white/40">
              <span>Progress</span>
              <span>{Math.round(cohort.week / cohort.totalWeeks * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-amber/70" style={{ width: `${cohort.week / cohort.totalWeeks * 100}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 + 0.1 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5"><s.icon size={12} weight="fill" className="text-amber" /></div>
            </div>
            <div className="text-xl font-semibold text-white">{s.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400"><ArrowUp size={10} weight="bold" />{s.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Pipeline + Participant grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Application pipeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Application Pipeline</h2>
          <div className="space-y-3">
            {pipeline.map((p) => (
              <div key={p.stage}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/50">{p.stage}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.color}`}>{p.count}</span>
                </div>
                <div className="h-6 rounded-lg bg-white/[0.04] overflow-hidden">
                  <div className={`h-full rounded-lg transition-all ${p.color.replace("text-", "bg-").split(" ")[0]}`} style={{ width: p.width, opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Participant grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Current Participants</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
            {participants.map((p) => (
              <div key={p.name} className="rounded-xl bg-white/[0.04] p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo/20 text-xs font-bold text-blue-400">{p.initials}</div>
                  <span className="text-xs text-white/70 truncate">{p.name}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {p.skills.map((s) => <span key={s} className="rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-white/30">{s}</span>)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/30">{p.hours}/400h</div>
                  <div className="flex items-center gap-0.5 text-amber">
                    <Star size={10} weight="fill" /><span className="text-[10px] text-white/50">{p.rating}</span>
                  </div>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-white/[0.06]">
                  <div className={`h-full rounded-full ${p.hours / 400 >= 0.4 ? "bg-emerald-500/60" : "bg-amber/60"}`} style={{ width: `${p.hours / 400 * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hours tracker */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Hours Tracker</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={hoursData} layout="vertical">
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 400]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} unit="h" />
            <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} width={50} />
            <Tooltip content={<HoursTooltip />} />
            <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
              {hoursData.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Task assignments */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">This Week&#39;s Task Assignments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 text-left text-white/30 font-medium">Participant</th>
                {days.map((d) => <th key={d} className="pb-3 text-center text-white/30 font-medium">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.entries(taskAssignments).map(([name, assignments]) => (
                <tr key={name} className="border-b border-white/[0.04]">
                  <td className="py-2.5 text-white/60">{name}</td>
                  {assignments.map((a, i) => (
                    <td key={i} className="py-2.5 text-center">
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${cellColors[a]}`}>{a}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Past cohorts */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Past Cohorts</h2>
        <div className="space-y-2">
          {pastCohorts.map((c) => (
            <div key={c.name} className="rounded-xl bg-white/[0.04] p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-white">{c.name}</span>
                  <span className="text-xs text-white/30 ml-2">{c.dates}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-white/40">{c.participants} participants</span>
                  <div className="flex items-center gap-1 text-amber"><Star size={11} weight="fill" />{c.rating}</div>
                </div>
              </div>
              <p className="text-xs text-white/40">{c.highlight}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <AgentDrawer agentId="iris" isOpen={agentOpen} onClose={() => setAgentOpen(false)} />
    </div>
  );
}

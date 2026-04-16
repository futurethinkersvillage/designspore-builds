"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heartbeat, Smiley, HandsClapping, ShieldCheck, FirstAid,
  ArrowUp, ArrowDown, Fire, TreeEvergreen, MusicNote,
  Cookie, Bandaids, Phone, MapPin, CalendarBlank, Sparkle,
} from "@phosphor-icons/react";
import AgentDrawer from "@/components/dashboard/AgentDrawer";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

/* ── Data ─────────────────────────────────────────────────────────── */

const pulseStats = [
  { label: "Happiness Score", value: "8.2/10", trend: "+0.3", trendUp: true, icon: Smiley },
  { label: "Conflict Level", value: "Low", trend: "Stable", trendUp: true, icon: ShieldCheck },
  { label: "Social Cohesion", value: "91%", trend: "+2%", trendUp: true, icon: HandsClapping },
  { label: "Event Participation", value: "78%", trend: "+5%", trendUp: true, icon: Heartbeat },
];

const weeklyMood = [
  { day: "Mon", mood: 7.8 }, { day: "Tue", mood: 8.1 },
  { day: "Wed", mood: 8.4 }, { day: "Thu", mood: 7.9 },
  { day: "Fri", mood: 8.6 }, { day: "Sat", mood: 8.8 },
  { day: "Sun", mood: 8.2 },
];

const programs = [
  { name: "Yoga", attendance: 32, trend: "up", icon: "🧘", sessions: "5x/week" },
  { name: "Meditation", attendance: 24, trend: "up", icon: "🧠", sessions: "Daily" },
  { name: "Sauna & Cold Plunge", attendance: 35, trend: "up", icon: "🔥", sessions: "Open daily" },
  { name: "Forest Bathing", attendance: 18, trend: "stable", icon: "🌲", sessions: "2x/week" },
  { name: "Breathwork", attendance: 14, trend: "up", icon: "💨", sessions: "3x/week" },
  { name: "Sound Healing", attendance: 12, trend: "down", icon: "🔔", sessions: "1x/week" },
];

const safety = {
  daysSinceIncident: 47,
  firstAidKits: 8,
  firstAidCertified: 12,
  lastEmergencyDrill: "Mar 15, 2026",
  evacuationPlanUpdated: "Jan 10, 2026",
  emergencyContacts: [
    { name: "Ben Morrison", role: "Head of Safety", phone: "250-555-0147" },
    { name: "Ingrid Larsen", role: "Village Nurse", phone: "250-555-0193" },
    { name: "RCMP Clearwater", role: "Police", phone: "250-674-2237" },
    { name: "BC Ambulance", role: "EMS", phone: "911" },
  ],
};

const nutrition = {
  farmToTable: 73,
  mealsServedMonthly: 840,
  satisfaction: 4.6,
  dietaryAccommodations: 12,
  menuHighlights: [
    "Garden-fresh salads daily",
    "Sourdough bread — village bakery",
    "Goat milk yogurt & cheese",
    "Seasonal preserves & ferments",
    "Wild mushroom dishes",
    "Herbal teas from herb spiral",
  ],
};

/* ── Helpers ──────────────────────────────────────────────────────── */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

function MoodTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs">
      <p className="text-white/50">{label}</p>
      <p className="text-white font-medium">{payload[0].value}/10</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function WellnessPage() {
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
            Wellness & <span className="italic">Community Health</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">Wellbeing metrics, programs, safety, and nutrition</p>
        </div>
        <button
          onClick={() => setAgentOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-xs font-medium text-blue-400 hover:opacity-80 transition-opacity self-start shrink-0"
        >
          <Sparkle size={13} weight="fill" /> Ask Iris
        </button>
      </div>

      {/* Pulse stats */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {pulseStats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5"><s.icon size={14} weight="fill" className="text-amber" /></div>
            </div>
            <div className="text-xl font-semibold text-white">{s.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
              <ArrowUp size={10} weight="bold" /> {s.trend}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mood chart + Programs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Weekly mood */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-1">Weekly Mood Check-in</h2>
          <p className="text-xs text-white/30 mb-4">Average community happiness by day</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyMood}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[6, 10]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<MoodTooltip />} />
              <Bar dataKey="mood" fill="#EA824E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Wellness programs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Wellness Programs</h2>
          <div className="space-y-0">
            {programs.map((p) => (
              <div key={p.name} className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
                <span className="text-lg">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/80">{p.name}</span>
                    {p.trend === "up" && <ArrowUp size={10} weight="bold" className="text-emerald-400" />}
                    {p.trend === "down" && <ArrowDown size={10} weight="bold" className="text-red-400" />}
                  </div>
                  <span className="text-[10px] text-white/30">{p.sessions}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{p.attendance}</div>
                  <div className="text-[10px] text-white/30">avg/session</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Safety Dashboard */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Safety Dashboard</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
          <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10 p-4 text-center">
            <ShieldCheck size={24} weight="fill" className="text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-white">{safety.daysSinceIncident}</div>
            <div className="text-xs text-white/40">Days since incident</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
            <FirstAid size={24} weight="fill" className="text-amber mx-auto mb-2" />
            <div className="text-2xl font-semibold text-white">{safety.firstAidKits}</div>
            <div className="text-xs text-white/40">First aid kits</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
            <Bandaids size={24} weight="fill" className="text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-white">{safety.firstAidCertified}</div>
            <div className="text-xs text-white/40">Certified responders</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
            <CalendarBlank size={24} weight="fill" className="text-mauve mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">{safety.lastEmergencyDrill}</div>
            <div className="text-xs text-white/40">Last emergency drill</div>
          </div>
        </div>

        {/* Emergency contacts */}
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Emergency Contacts</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {safety.emergencyContacts.map((c) => (
            <div key={c.name} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
              <Phone size={14} weight="fill" className="text-amber shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white/70">{c.name}</div>
                <div className="text-[10px] text-white/30">{c.role}</div>
              </div>
              <span className="text-xs font-mono text-white/50">{c.phone}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Food & Nutrition */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Food & Nutrition</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-white/[0.04] p-3">
                <div className="text-xs text-white/40 mb-1">Farm-to-Table</div>
                <div className="text-xl font-semibold text-white">{nutrition.farmToTable}%</div>
                <div className="mt-2 h-1.5 rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${nutrition.farmToTable}%` }} />
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3">
                <div className="text-xs text-white/40 mb-1">Meals/Month</div>
                <div className="text-xl font-semibold text-white">{nutrition.mealsServedMonthly}</div>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3">
                <div className="text-xs text-white/40 mb-1">Satisfaction</div>
                <div className="text-xl font-semibold text-white">{nutrition.satisfaction}/5.0</div>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3">
                <div className="text-xs text-white/40 mb-1">Dietary Options</div>
                <div className="text-xl font-semibold text-white">{nutrition.dietaryAccommodations}</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Menu Highlights</h3>
            <div className="space-y-2">
              {nutrition.menuHighlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-white/50">
                  <Cookie size={10} weight="fill" className="text-amber shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <AgentDrawer agentId="iris" isOpen={agentOpen} onClose={() => setAgentOpen(false)} />
    </div>
  );
}

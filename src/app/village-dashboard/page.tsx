"use client";

import { motion } from "framer-motion";
import {
  UsersThree, CurrencyDollar, Briefcase, Bed,
  Lightning, Heartbeat, ArrowUp, ArrowDown,
  CalendarBlank, CheckCircle, UserPlus, Plant,
  Megaphone, Drop, WifiHigh, Wind,
  CloudSun, Clock,
} from "@phosphor-icons/react";
import CountUp from "@/components/dashboard/CountUp";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

/* ── Demo data (inline to keep page self-contained) ──────────────── */

const stats = [
  { label: "Total Members", to: 247, prefix: "", suffix: "", trend: "+12%", trendUp: true, icon: UsersThree },
  { label: "Monthly Revenue", to: 187420, prefix: "$", suffix: "", trend: "+8.3%", trendUp: true, icon: CurrencyDollar },
  { label: "Active Projects", to: 23, prefix: "", suffix: "", localize: false, trend: "+3", trendUp: true, icon: Briefcase },
  { label: "Occupancy Rate", to: 89, prefix: "", suffix: "%", localize: false, trend: "+5%", trendUp: true, icon: Bed },
  { label: "Energy Self-Sufficiency", to: 72, prefix: "", suffix: "%", localize: false, trend: "+4%", trendUp: true, icon: Lightning },
  { label: "Community Health", to: 94, prefix: "", suffix: "/100", localize: false, trend: "+2", trendUp: true, icon: Heartbeat },
];

const revenueHistory = [
  { month: "Jul", revenue: 118200 }, { month: "Aug", revenue: 132400 },
  { month: "Sep", revenue: 124800 }, { month: "Oct", revenue: 98600 },
  { month: "Nov", revenue: 87200 }, { month: "Dec", revenue: 72400 },
  { month: "Jan", revenue: 68900 }, { month: "Feb", revenue: 84300 },
  { month: "Mar", revenue: 112700 }, { month: "Apr", revenue: 148900 },
  { month: "May", revenue: 168200 }, { month: "Jun", revenue: 187420 },
];

const recentActivity = [
  { icon: UserPlus, label: "Sarah Chen joined as Builder member", time: "2 hours ago", color: "text-emerald-400" },
  { icon: CheckCircle, label: "Solar panel mounting brackets installed", time: "4 hours ago", color: "text-amber" },
  { icon: Plant, label: "Tomato harvest ready — Plot A", time: "5 hours ago", color: "text-emerald-400" },
  { icon: Megaphone, label: "Community vote: Solar Array Expansion passed", time: "8 hours ago", color: "text-blue-400" },
  { icon: CalendarBlank, label: "Full Moon Gathering — 28 registered", time: "12 hours ago", color: "text-amber" },
  { icon: CurrencyDollar, label: "BC Green Infrastructure Grant approved — $150K", time: "1 day ago", color: "text-emerald-400" },
  { icon: CheckCircle, label: "Sauna heater thermostat repaired", time: "1 day ago", color: "text-amber" },
  { icon: UserPlus, label: "Marcus Rivera applied for Work-Stay", time: "1 day ago", color: "text-blue-400" },
  { icon: Plant, label: "Greenhouse humidity alert resolved", time: "2 days ago", color: "text-amber" },
  { icon: Lightning, label: "Battery storage hit 78% — new record", time: "2 days ago", color: "text-emerald-400" },
];

const upcomingEvents = [
  { title: "Full Moon Gathering", date: "Jun 14", type: "ceremony" },
  { title: "Permaculture Workshop", date: "Jun 16", type: "workshop" },
  { title: "Community Dinner", date: "Jun 18", type: "social" },
  { title: "Yoga Sunrise Session", date: "Jun 19", type: "wellness" },
  { title: "Maker Night", date: "Jun 21", type: "workshop" },
];

const healthIndicators = [
  { label: "Water Systems", value: 98, icon: Drop },
  { label: "Power Grid", value: 95, icon: Lightning },
  { label: "Internet", value: 99.2, icon: WifiHigh },
  { label: "Air Quality", value: 94, icon: Wind },
];

const weather = { temp: 22, condition: "Partly Cloudy", humidity: 45, wind: 12 };

/* ── Helpers ─────────────────────────────────────────────────────── */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const typeColors: Record<string, string> = {
  ceremony: "bg-mauve/20 text-mauve",
  workshop: "bg-indigo/20 text-blue-400",
  social: "bg-amber/20 text-amber",
  wellness: "bg-emerald-500/20 text-emerald-400",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="text-white font-medium">${(payload[0].value / 1000).toFixed(1)}K</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Village <span className="italic">Dashboard</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Wells Gray Village — Real-time overview of your smart village
        </p>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6 lg:gap-4"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5">
                <s.icon size={14} weight="fill" className="text-amber" />
              </div>
            </div>
            <div className="text-xl font-semibold text-white lg:text-2xl">
              <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} localize={s.localize !== false} />
            </div>
            <div className={`mt-1 flex items-center gap-1 text-xs ${s.trendUp ? "text-emerald-400" : "text-red-400"}`}>
              {s.trendUp ? <ArrowUp size={10} weight="bold" /> : <ArrowDown size={10} weight="bold" />}
              {s.trend}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue chart + Activity feed */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px] xl:gap-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-medium text-white">Revenue Trend</h2>
              <p className="text-xs text-white/30 mt-0.5">Last 12 months</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-white">$187,420</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 justify-end">
                <ArrowUp size={10} weight="bold" /> +8.3% vs last month
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueHistory}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA824E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#EA824E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#EA824E" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
        >
          <h2 className="text-sm font-medium text-white mb-4">Recent Activity</h2>
          <div className="space-y-0">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0"
              >
                <div className={`mt-0.5 shrink-0 ${item.color}`}>
                  <item.icon size={14} weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/70 leading-relaxed">{item.label}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row: Weather + Health + Events */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:gap-6">
        {/* Weather */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
        >
          <h2 className="text-sm font-medium text-white mb-4">Weather — Wells Gray</h2>
          <div className="flex items-center gap-4 mb-4">
            <CloudSun size={40} weight="fill" className="text-amber" />
            <div>
              <div className="text-3xl font-light text-white">{weather.temp}°C</div>
              <div className="text-xs text-white/40">{weather.condition}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Drop size={12} weight="fill" /> Humidity {weather.humidity}%
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Wind size={12} weight="fill" /> Wind {weather.wind} km/h
            </div>
          </div>
        </motion.div>

        {/* Village health */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
        >
          <h2 className="text-sm font-medium text-white mb-4">Village Health</h2>
          <div className="space-y-3">
            {healthIndicators.map((h) => (
              <div key={h.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <h.icon size={12} weight="fill" className="text-amber" />
                    {h.label}
                  </div>
                  <span className="text-xs font-medium text-white">{h.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-emerald-500/70"
                    style={{ width: `${h.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming events */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Upcoming Events</h2>
            <Clock size={14} className="text-white/25" />
          </div>
          <div className="space-y-0">
            {upcomingEvents.map((e, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[e.type]}`}>
                  {e.type}
                </span>
                <span className="text-xs text-white/70 flex-1">{e.title}</span>
                <span className="text-[10px] text-white/30">{e.date}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

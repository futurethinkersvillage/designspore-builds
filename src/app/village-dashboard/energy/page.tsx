"use client";

import { motion } from "framer-motion";
import {
  Lightning, SolarPanel, Drop, Recycle, ArrowUp,
  Sun, Cloud, CloudRain, Snowflake, Wind,
} from "@phosphor-icons/react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

/* ── Data ─────────────────────────────────────────────────────────── */

const stats = [
  { label: "Solar Today", value: "45 kWh", trend: "+12%", trendUp: true, icon: Sun },
  { label: "Grid Usage", value: "12 kWh", trend: "-8%", trendUp: true, icon: Lightning },
  { label: "Battery Level", value: "78%", trend: "+3%", trendUp: true, icon: Lightning },
  { label: "Self-Sufficiency", value: "72%", trend: "+4%", trendUp: true, icon: SolarPanel },
];

const energyHistory = [
  { day: "Mon", solar: 38, grid: 16, consumption: 52 },
  { day: "Tue", solar: 42, grid: 14, consumption: 54 },
  { day: "Wed", solar: 35, grid: 18, consumption: 51 },
  { day: "Thu", solar: 47, grid: 11, consumption: 56 },
  { day: "Fri", solar: 44, grid: 13, consumption: 55 },
  { day: "Sat", solar: 50, grid: 8, consumption: 56 },
  { day: "Sun", solar: 45, grid: 12, consumption: 55 },
];

const solarPanels = Array.from({ length: 24 }, (_, i) => {
  const id = `P${String(i + 1).padStart(2, "0")}`;
  const status: "active" | "degraded" | "offline" =
    i === 14 ? "offline" : i === 7 || i === 19 ? "degraded" : "active";
  const output = status === "offline" ? 0 : status === "degraded" ? 95 + Math.floor(i * 3.7) % 30 : 185 + Math.floor(i * 7.3) % 40;
  return { id, output, status };
});

const waterSystems = [
  { label: "Well Level", value: 82, unit: "%", color: "bg-blue-500/70" },
  { label: "Rainwater Collection", value: 340, unit: "L/day", color: "bg-blue-400/70", raw: true },
  { label: "Daily Usage", value: 2800, unit: "L", color: "bg-indigo/70", raw: true },
  { label: "Greywater Recycling", value: 65, unit: "%", color: "bg-emerald-500/70" },
];

const wasteHistory = [
  { month: "Jul", compost: 1100, recycling: 310, landfill: 142 },
  { month: "Aug", compost: 1180, recycling: 328, landfill: 135 },
  { month: "Sep", compost: 1140, recycling: 318, landfill: 128 },
  { month: "Oct", compost: 1090, recycling: 304, landfill: 120 },
  { month: "Nov", compost: 1040, recycling: 294, landfill: 115 },
  { month: "Dec", compost: 980, recycling: 278, landfill: 108 },
  { month: "Jan", compost: 940, recycling: 262, landfill: 102 },
  { month: "Feb", compost: 960, recycling: 270, landfill: 98 },
  { month: "Mar", compost: 1020, recycling: 288, landfill: 95 },
  { month: "Apr", compost: 1100, recycling: 308, landfill: 92 },
  { month: "May", compost: 1160, recycling: 326, landfill: 90 },
  { month: "Jun", compost: 1200, recycling: 340, landfill: 89 },
];

const carbonOffsets = [
  { label: "Trees Planted", value: "12,400", sub: "kg CO₂/yr", color: "text-emerald-400" },
  { label: "Solar Savings", value: "8,900", sub: "kg CO₂/yr", color: "text-amber" },
  { label: "Food Miles Saved", value: "3,200", sub: "kg CO₂/yr", color: "text-blue-400" },
];

const sustainabilityScores = [
  { label: "Energy", value: 78, color: "bg-amber/70" },
  { label: "Water", value: 85, color: "bg-blue-500/70" },
  { label: "Waste", value: 88, color: "bg-emerald-500/70" },
  { label: "Food", value: 76, color: "bg-mauve/70" },
  { label: "Transport", value: 82, color: "bg-indigo/70" },
];

const forecast = [
  { day: "Today", icon: Sun, high: 22, low: 12, rain: 5 },
  { day: "Mon", icon: CloudRain, high: 17, low: 10, rain: 65 },
  { day: "Tue", icon: Cloud, high: 19, low: 11, rain: 20 },
  { day: "Wed", icon: Sun, high: 24, low: 13, rain: 0 },
  { day: "Thu", icon: Sun, high: 26, low: 14, rain: 0 },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs space-y-0.5">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value} {p.name === "consumption" || p.name === "solar" || p.name === "grid" ? "kWh" : "kg"}</p>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function EnergyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Energy & <span className="italic">Sustainability</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">Solar, battery, water, waste, and carbon tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5"><s.icon size={14} weight="fill" className="text-amber" /></div>
            </div>
            <div className="text-xl font-semibold text-white">{s.value}</div>
            <div className={`mt-1 flex items-center gap-1 text-xs ${s.trendUp ? "text-emerald-400" : "text-red-400"}`}>
              <ArrowUp size={10} weight="bold" /> {s.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Energy chart + Solar panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Energy: Production vs Consumption (7 days)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={energyHistory}>
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EA824E" stopOpacity={0.3} /><stop offset="100%" stopColor="#EA824E" stopOpacity={0} /></linearGradient>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#AF695E" stopOpacity={0.3} /><stop offset="100%" stopColor="#AF695E" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} unit=" kWh" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="solar" name="Solar" stroke="#EA824E" fill="url(#solarGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="grid" name="Grid" stroke="#AF695E" fill="url(#gridGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="consumption" name="Consumption" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Solar panel grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-3">Solar Panel Status</h2>
          <div className="grid grid-cols-6 gap-1.5">
            {solarPanels.map((p) => (
              <div
                key={p.id}
                title={`${p.id}: ${p.output}W — ${p.status}`}
                className={`aspect-square rounded-md flex items-center justify-center text-[8px] font-mono cursor-default transition-colors ${
                  p.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                  p.status === "degraded" ? "bg-amber/20 text-amber" :
                  "bg-red-500/20 text-red-400"
                }`}
              >
                {p.id.slice(1)}
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-3 text-xs text-white/40">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500/30" />Active (22)</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-amber/30" />Degraded (2)</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-red-500/30" />Offline (1)</div>
          </div>
        </motion.div>
      </div>

      {/* Water systems */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Water Systems</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {waterSystems.map((w) => (
            <div key={w.label} className="rounded-xl bg-white/[0.04] p-4">
              <div className="text-xs text-white/40 mb-2">{w.label}</div>
              <div className="text-2xl font-semibold text-white">{w.value.toLocaleString()}</div>
              <div className="text-xs text-white/30 mb-2">{w.unit}</div>
              {!w.raw && (
                <div className="h-1.5 rounded-full bg-white/[0.06]">
                  <div className={`h-full rounded-full ${w.color}`} style={{ width: `${w.value}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Waste trend + Carbon */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-1">Waste Management Trend</h2>
          <p className="text-xs text-white/30 mb-4">Landfill trending down — 89 kg/mo this month</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={wasteHistory}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}kg`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="compost" name="Compost" fill="#34d399" stackId="a" />
              <Bar dataKey="recycling" name="Recycling" fill="#38387F" stackId="a" />
              <Bar dataKey="landfill" name="Landfill" fill="#AF695E" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Carbon + Sustainability */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
            <h2 className="text-sm font-medium text-white mb-3">Carbon Offset (kg CO₂/yr)</h2>
            <div className="space-y-2">
              {carbonOffsets.map((c) => (
                <div key={c.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-white/50">{c.label}</span>
                  <div className="text-right">
                    <span className={`text-lg font-semibold ${c.color}`}>{c.value}</span>
                    <span className="text-xs text-white/30 ml-1">{c.sub}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-white/70">Total Offset</span>
                <span className="text-lg font-semibold text-emerald-400">24,500 <span className="text-xs text-white/30">kg CO₂/yr</span></span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white">Sustainability Score</h2>
              <span className="text-2xl font-semibold text-emerald-400">82<span className="text-sm text-white/30">/100</span></span>
            </div>
            <div className="space-y-2.5">
              {sustainabilityScores.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/50">{s.label}</span>
                    <span className="text-xs font-medium text-white">{s.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06]">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">5-Day Forecast — Wells Gray</h2>
        <div className="grid grid-cols-5 gap-3">
          {forecast.map((f) => (
            <div key={f.day} className="rounded-xl bg-white/[0.04] p-4 text-center">
              <div className="text-xs text-white/40 mb-3">{f.day}</div>
              <f.icon size={28} weight="fill" className="text-amber mx-auto mb-3" />
              <div className="text-sm font-medium text-white">{f.high}°</div>
              <div className="text-xs text-white/30">{f.low}°</div>
              {f.rain > 0 && <div className="text-[10px] text-blue-400 mt-1">{f.rain}% rain</div>}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

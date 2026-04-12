"use client";

import { motion } from "framer-motion";
import {
  CurrencyDollar, TrendUp, Percent, Bed,
  ArrowUp, ArrowDown,
} from "@phosphor-icons/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

/* ── Data ─────────────────────────────────────────────────────────── */

const stats = [
  { label: "Monthly Revenue", value: "$187,420", trend: "+8.3%", trendUp: true, icon: CurrencyDollar },
  { label: "Monthly Expenses", value: "$142,380", trend: "+3.1%", trendUp: false, icon: TrendUp },
  { label: "Net Income", value: "$45,040", trend: "+21%", trendUp: true, icon: CurrencyDollar },
  { label: "Margin", value: "24.0%", trend: "+3.2%", trendUp: true, icon: Percent },
  { label: "RevPAR", value: "$127", trend: "+$14", trendUp: true, icon: CurrencyDollar },
  { label: "Bookings", value: "156", trend: "+18", trendUp: true, icon: Bed },
];

const revenueBreakdown = [
  { month: "Jul", accommodation: 68200, memberships: 28400, events: 12300, farm: 6800, consulting: 5100, workshops: 4200 },
  { month: "Aug", accommodation: 78400, memberships: 30200, events: 16800, farm: 8200, consulting: 6100, workshops: 5200 },
  { month: "Sep", accommodation: 72100, memberships: 29800, events: 14200, farm: 8600, consulting: 5900, workshops: 4400 },
  { month: "Oct", accommodation: 52300, memberships: 28100, events: 9800, farm: 6400, consulting: 5400, workshops: 3200 },
  { month: "Nov", accommodation: 38200, memberships: 26900, events: 7200, farm: 4800, consulting: 5400, workshops: 2800 },
  { month: "Dec", accommodation: 28100, memberships: 25600, events: 6400, farm: 4200, consulting: 5200, workshops: 2300 },
  { month: "Jan", accommodation: 24800, memberships: 24400, events: 5800, farm: 3800, consulting: 6200, workshops: 2100 },
  { month: "Feb", accommodation: 31200, memberships: 25100, events: 8200, farm: 4600, consulting: 7400, workshops: 3100 },
  { month: "Mar", accommodation: 54600, memberships: 27300, events: 12400, farm: 6200, consulting: 7800, workshops: 4200 },
  { month: "Apr", accommodation: 82400, memberships: 29800, events: 16800, farm: 8600, consulting: 6100, workshops: 5200 },
  { month: "May", accommodation: 91200, memberships: 31400, events: 22100, farm: 10400, consulting: 7600, workshops: 5500 },
  { month: "Jun", accommodation: 94600, memberships: 33200, events: 26800, farm: 12400, consulting: 10100, workshops: 10320 },
];

const expenseBreakdown = [
  { name: "Staffing", value: 54028, color: "#EA824E" },
  { name: "Infrastructure", value: 31324, color: "#38387F" },
  { name: "Food & Farm", value: 19933, color: "#73516F" },
  { name: "Marketing", value: 11390, color: "#AF695E" },
  { name: "Insurance", value: 9967, color: "#60a5fa" },
  { name: "Maintenance", value: 8543, color: "#34d399" },
  { name: "Utilities", value: 7195, color: "#a78bfa" },
];

const occupancyTypes = [
  { type: "Cabins", pct: 95, count: "4/4 units" },
  { type: "RV Sites", pct: 87, count: "13/15 sites" },
  { type: "Glamping", pct: 92, count: "11/12 domes" },
  { type: "Bunkhouse", pct: 78, count: "14/18 beds" },
];

const occupancyTrend = [
  { month: "Jul", pct: 82 }, { month: "Aug", pct: 94 }, { month: "Sep", pct: 88 },
  { month: "Oct", pct: 65 }, { month: "Nov", pct: 44 }, { month: "Dec", pct: 38 },
  { month: "Jan", pct: 35 }, { month: "Feb", pct: 42 }, { month: "Mar", pct: 58 },
  { month: "Apr", pct: 76 }, { month: "May", pct: 87 }, { month: "Jun", pct: 89 },
];

const budgetVsActual = [
  { category: "Staffing", budget: 56000, actual: 54028 },
  { category: "Infrastructure", budget: 28000, actual: 31324 },
  { category: "Food/Farm", budget: 20000, actual: 19933 },
  { category: "Marketing", budget: 14000, actual: 11390 },
  { category: "Insurance", budget: 10000, actual: 9967 },
  { category: "Maintenance", budget: 8000, actual: 8543 },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs space-y-1">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: ${(p.value / 1000).toFixed(1)}K</p>
      ))}
    </div>
  );
}

function OccupancyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs">
      <p className="text-white/50">{label}</p>
      <p className="text-white">{payload[0].value}%</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function OperationsPage() {
  const totalExpenses = expenseBreakdown.reduce((s, e) => s + e.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Business & <span className="italic">Operations</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">P&L, revenue streams, occupancy, and financial metrics</p>
      </div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6 lg:gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5"><s.icon size={14} weight="fill" className="text-amber" /></div>
            </div>
            <div className="text-xl font-semibold text-white">{s.value}</div>
            <div className={`mt-1 flex items-center gap-1 text-xs ${s.trendUp ? "text-emerald-400" : "text-red-400"}`}>
              {s.trendUp ? <ArrowUp size={10} weight="bold" /> : <ArrowDown size={10} weight="bold" />} {s.trend}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Revenue Breakdown (12 months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueBreakdown}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}K`} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="accommodation" name="Accommodation" stackId="a" fill="#EA824E" />
            <Bar dataKey="memberships" name="Memberships" stackId="a" fill="#38387F" />
            <Bar dataKey="events" name="Events" stackId="a" fill="#73516F" />
            <Bar dataKey="farm" name="Farm" stackId="a" fill="#AF695E" />
            <Bar dataKey="consulting" name="Consulting" stackId="a" fill="#34d399" />
            <Bar dataKey="workshops" name="Workshops" stackId="a" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-3 justify-center">
          {[["Accommodation","#EA824E"], ["Memberships","#38387F"], ["Events","#73516F"], ["Farm","#AF695E"], ["Consulting","#34d399"], ["Workshops","#60a5fa"]].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Expense + Occupancy */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Expense Donut */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-2">Expense Breakdown</h2>
          <p className="text-xs text-white/30 mb-4">Total: ${totalExpenses.toLocaleString()}/mo</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={88} dataKey="value" strokeWidth={0}>
                {expenseBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {expenseBreakdown.map((e) => (
              <div key={e.name} className="flex items-center gap-2 text-xs text-white/40">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
                {e.name} ({Math.round(e.value / totalExpenses * 100)}%)
              </div>
            ))}
          </div>
        </motion.div>

        {/* Occupancy */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-1">Current Occupancy</h2>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-semibold text-white">89%</span>
            <span className="text-xs text-emerald-400 mb-1 flex items-center gap-1"><ArrowUp size={10} weight="bold" />+5% vs last month</span>
          </div>
          <div className="space-y-3">
            {occupancyTypes.map((o) => (
              <div key={o.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/50">{o.type}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/25">{o.count}</span>
                    <span className="text-sm font-semibold text-white">{o.pct}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${o.pct >= 90 ? "bg-emerald-500/70" : o.pct >= 75 ? "bg-amber/70" : "bg-terracotta/70"}`}
                    style={{ width: `${o.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Occupancy Trend + Budget vs Actual */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Occupancy Trend (12 months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={occupancyTrend}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <Tooltip content={<OccupancyTooltip />} />
              <Line type="monotone" dataKey="pct" stroke="#EA824E" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Budget vs Actual</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={budgetVsActual} layout="vertical">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}K`} />
              <YAxis dataKey="category" type="category" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="budget" name="Budget" fill="rgba(255,255,255,0.08)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#EA824E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2">
            <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-2.5 h-2.5 rounded-sm bg-white/10" />Budget</div>
            <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-2.5 h-2.5 rounded-sm bg-amber" />Actual</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

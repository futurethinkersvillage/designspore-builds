"use client";

import { motion } from "framer-motion";
import {
  Crown, ArrowUp, ArrowDown, Star, Users, Check,
  CurrencyDollar, TrendUp, UserMinus, CalendarBlank,
} from "@phosphor-icons/react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar,
} from "recharts";

/* ── Data ─────────────────────────────────────────────────────────── */

const tiers = [
  {
    name: "Explorer", price: "$48/mo", members: 142, color: "#F2EDE8",
    accent: "bg-white/10 text-white/60", ring: "ring-white/20",
    benefits: ["Community access", "Newsletter", "Event discounts", "Village map"],
  },
  {
    name: "Builder", price: "$97/mo", members: 68, color: "#38387F",
    accent: "bg-indigo/15 text-blue-400", ring: "ring-indigo/40",
    benefits: ["Everything in Explorer", "Maker space access", "Voting rights", "Skill workshops", "Booking priority"],
  },
  {
    name: "Steward", price: "$197/mo", members: 28, color: "#EA824E",
    accent: "bg-amber/15 text-amber", ring: "ring-amber/40",
    benefits: ["Everything in Builder", "Revenue share (2%)", "Mentoring program", "Private events", "Co-working space", "Governance council"],
  },
  {
    name: "Elder", price: "$497/mo", members: 9, color: "#73516F",
    accent: "bg-mauve/15 text-purple-300", ring: "ring-mauve/40",
    benefits: ["Everything in Steward", "Founding status", "Strategic advisory", "Land use input", "Annual retreat", "Legacy naming"],
  },
];

const distribution = [
  { name: "Explorer", value: 142, color: "#F2EDE8" },
  { name: "Builder", value: 68, color: "#38387F" },
  { name: "Steward", value: 28, color: "#EA824E" },
  { name: "Elder", value: 9, color: "#73516F" },
];

const monthlyGrowth = [
  { month: "Jul", explorer: 98, builder: 42, steward: 18, elder: 6 },
  { month: "Aug", explorer: 105, builder: 45, steward: 19, elder: 6 },
  { month: "Sep", explorer: 108, builder: 48, steward: 20, elder: 7 },
  { month: "Oct", explorer: 112, builder: 50, steward: 21, elder: 7 },
  { month: "Nov", explorer: 115, builder: 52, steward: 22, elder: 7 },
  { month: "Dec", explorer: 118, builder: 54, steward: 23, elder: 8 },
  { month: "Jan", explorer: 120, builder: 56, steward: 24, elder: 8 },
  { month: "Feb", explorer: 124, builder: 58, steward: 24, elder: 8 },
  { month: "Mar", explorer: 128, builder: 60, steward: 25, elder: 8 },
  { month: "Apr", explorer: 132, builder: 63, steward: 26, elder: 9 },
  { month: "May", explorer: 138, builder: 65, steward: 27, elder: 9 },
  { month: "Jun", explorer: 142, builder: 68, steward: 28, elder: 9 },
];

const revenueByTier = [
  { tier: "Explorer", revenue: 6816 },
  { tier: "Builder", revenue: 6596 },
  { tier: "Steward", revenue: 5516 },
  { tier: "Elder", revenue: 4473 },
];

const benefitsUsage = [
  { benefit: "Newsletter", usage: 94 },
  { benefit: "Event Discounts", usage: 78 },
  { benefit: "Booking Priority", usage: 72 },
  { benefit: "Maker Space", usage: 65 },
  { benefit: "Voting Rights", usage: 61 },
  { benefit: "Skill Workshops", usage: 58 },
  { benefit: "Co-working Space", usage: 45 },
  { benefit: "Revenue Share", usage: 100 },
];

const churnData = [
  { month: "Jul", rate: 4.2 }, { month: "Aug", rate: 3.8 },
  { month: "Sep", rate: 3.5 }, { month: "Oct", rate: 4.1 },
  { month: "Nov", rate: 3.2 }, { month: "Dec", rate: 3.9 },
  { month: "Jan", rate: 2.8 }, { month: "Feb", rate: 3.1 },
  { month: "Mar", rate: 2.6 }, { month: "Apr", rate: 2.4 },
  { month: "May", rate: 2.2 }, { month: "Jun", rate: 2.1 },
];

const renewals = [
  { name: "James Whittaker", tier: "Elder", date: "Jun 18", amount: "$497" },
  { name: "Sarah Chen", tier: "Steward", date: "Jun 20", amount: "$197" },
  { name: "Chris Delaney", tier: "Explorer", date: "Jun 22", amount: "$48" },
  { name: "Priya Sharma", tier: "Explorer", date: "Jun 24", amount: "$48" },
  { name: "Lucas Martins", tier: "Builder", date: "Jun 25", amount: "$97" },
  { name: "Hannah Fischer", tier: "Builder", date: "Jun 28", amount: "$97" },
  { name: "Omar Hassan", tier: "Explorer", date: "Jun 29", amount: "$48" },
  { name: "Sophia Russo", tier: "Explorer", date: "Jun 30", amount: "$48" },
];

const stats = [
  { label: "Total Members", value: "247", trend: "+12%", trendUp: true, icon: Users },
  { label: "Monthly MRR", value: "$23,401", trend: "+9.4%", trendUp: true, icon: CurrencyDollar },
  { label: "Avg Lifetime", value: "14.2 mo", trend: "+2.1", trendUp: true, icon: TrendUp },
  { label: "Monthly Churn", value: "2.1%", trend: "-0.3%", trendUp: true, icon: UserMinus },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-white">{p.name}: {typeof p.value === "number" && p.value > 100 ? `$${p.value.toLocaleString()}` : p.value}</p>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function MembershipPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Membership <span className="italic">System</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">Tiers, benefits, retention, and growth analytics</p>
      </div>

      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5">
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

      {/* Tier cards */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiers.map((t) => (
          <motion.div key={t.name} variants={fadeUp} className={`rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 ring-1 ${t.ring}`}>
            <div className="flex items-center gap-2 mb-3">
              <Crown size={16} weight="fill" style={{ color: t.color }} />
              <span className="text-sm font-medium text-white">{t.name}</span>
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium ${t.accent}`}>{t.members} members</span>
            </div>
            <div className="text-2xl font-semibold text-white mb-4">{t.price}</div>
            <div className="space-y-2">
              {t.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs text-white/50">
                  <Check size={10} weight="bold" className="text-amber shrink-0" /> {b}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row: Distribution + Revenue by Tier */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Member Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={distribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={0}>
                {distribution.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-white/50">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Monthly Revenue by Tier</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByTier}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="tier" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(1)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="revenue" fill="#EA824E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Growth chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Membership Growth (Stacked)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyGrowth}>
            <defs>
              <linearGradient id="gExplorer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F2EDE8" stopOpacity={0.3} /><stop offset="100%" stopColor="#F2EDE8" stopOpacity={0} /></linearGradient>
              <linearGradient id="gBuilder" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38387F" stopOpacity={0.3} /><stop offset="100%" stopColor="#38387F" stopOpacity={0} /></linearGradient>
              <linearGradient id="gSteward" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EA824E" stopOpacity={0.3} /><stop offset="100%" stopColor="#EA824E" stopOpacity={0} /></linearGradient>
              <linearGradient id="gElder" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#73516F" stopOpacity={0.3} /><stop offset="100%" stopColor="#73516F" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="elder" stackId="1" stroke="#73516F" fill="url(#gElder)" />
            <Area type="monotone" dataKey="steward" stackId="1" stroke="#EA824E" fill="url(#gSteward)" />
            <Area type="monotone" dataKey="builder" stackId="1" stroke="#38387F" fill="url(#gBuilder)" />
            <Area type="monotone" dataKey="explorer" stackId="1" stroke="#F2EDE8" fill="url(#gExplorer)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Benefits Usage + Churn */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Benefits Usage</h2>
          <div className="space-y-3">
            {benefitsUsage.map((b) => (
              <div key={b.benefit}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/50">{b.benefit}</span>
                  <span className="text-xs font-medium text-white">{b.usage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-amber/70" style={{ width: `${b.usage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-1">Monthly Churn Rate</h2>
          <p className="text-xs text-white/30 mb-4">Trending down — 2.1% this month</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={churnData}>
              <defs>
                <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#AF695E" stopOpacity={0.3} /><stop offset="100%" stopColor="#AF695E" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 6]} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="rate" stroke="#AF695E" strokeWidth={2} fill="url(#churnGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Upcoming Renewals */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white">Upcoming Renewals</h2>
          <CalendarBlank size={14} className="text-white/25" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 text-left text-xs uppercase text-white/30 font-medium">Member</th>
                <th className="pb-3 text-left text-xs uppercase text-white/30 font-medium">Tier</th>
                <th className="pb-3 text-left text-xs uppercase text-white/30 font-medium">Renewal</th>
                <th className="pb-3 text-right text-xs uppercase text-white/30 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {renewals.map((r, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 text-sm text-white/70">{r.name}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      r.tier === "Elder" ? "bg-mauve/15 text-purple-300" :
                      r.tier === "Steward" ? "bg-amber/15 text-amber" :
                      r.tier === "Builder" ? "bg-indigo/15 text-blue-400" :
                      "bg-white/10 text-white/50"
                    }`}>{r.tier}</span>
                  </td>
                  <td className="py-3 text-xs text-white/40">{r.date}</td>
                  <td className="py-3 text-right text-sm font-medium text-white">{r.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

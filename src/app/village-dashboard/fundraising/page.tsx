"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CurrencyDollar, ChartPieSlice, Handshake, Rocket,
  Timer, ArrowUp, TrendUp, Users, CalendarBlank,
  CheckCircle, Clock, Briefcase, Compass,
  PaintBrush, Wrench, Code, Trophy, Flask, MapTrifold, Plus,
  MapPin, Tree, Mountains, Drop, Lightning, Path, Ruler,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import AgentDrawer from "@/components/dashboard/AgentDrawer";
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

/* ── Inline data ───────────────────────────────────────────────────── */

const stats = [
  { label: "Total Raised", value: "$2.4M", icon: CurrencyDollar, sub: "Since inception" },
  { label: "Current Round", value: "$750K", icon: TrendUp, sub: "68% of target" },
  { label: "Runway", value: "14 mo", icon: Timer, sub: "At current burn" },
  { label: "Active Campaigns", value: "4", icon: Rocket, sub: "2 closing soon" },
];

const campaigns = [
  { name: "Cabin Expansion Round", type: "Equity", goal: 500000, raised: 340000, daysLeft: 45, status: "Active" },
  { name: "BC Green Infrastructure Grant", type: "Grant", goal: 150000, raised: 150000, daysLeft: 0, status: "Approved" },
  { name: "Community Builder Crowdfund", type: "Crowdfund", goal: 75000, raised: 48000, daysLeft: 22, status: "Active" },
  { name: "Strategic Angel Round", type: "Equity", goal: 200000, raised: 175000, daysLeft: 12, status: "Closing Soon" },
];

const fundingSources = [
  { name: "Angel", value: 35, color: "#EA824E" },
  { name: "Grants", value: 25, color: "#38387F" },
  { name: "Crowdfunding", value: 20, color: "#AF695E" },
  { name: "Revenue", value: 15, color: "#73516F" },
  { name: "Other", value: 5, color: "rgba(255,255,255,0.15)" },
];

const monthlyInflow = [
  { month: "May", amount: 62000 }, { month: "Jun", amount: 88000 },
  { month: "Jul", amount: 75000 }, { month: "Aug", amount: 45000 },
  { month: "Sep", amount: 120000 }, { month: "Oct", amount: 95000 },
  { month: "Nov", amount: 68000 }, { month: "Dec", amount: 52000 },
  { month: "Jan", amount: 85000 }, { month: "Feb", amount: 110000 },
  { month: "Mar", amount: 220000 }, { month: "Apr", amount: 175000 },
];

const grants = [
  { grantor: "BC Rural Development Fund", amount: "$150K", status: "Approved", deadline: "Jun 30, 2026", nextReport: "Jul 15, 2026" },
  { grantor: "Canada Rural Innovation", amount: "$200K", status: "In Review", deadline: "Aug 15, 2026", nextReport: "—" },
  { grantor: "Clean Energy BC", amount: "$75K", status: "Applied", deadline: "Jul 31, 2026", nextReport: "—" },
  { grantor: "Columbia Basin Trust", amount: "$50K", status: "Disbursed", deadline: "—", nextReport: "Sep 1, 2026" },
  { grantor: "TNRD Community Grant", amount: "$25K", status: "Approved", deadline: "May 15, 2026", nextReport: "Jun 1, 2026" },
  { grantor: "Western Diversification", amount: "$180K", status: "In Review", deadline: "Sep 30, 2026", nextReport: "—" },
  { grantor: "BC Housing Innovation", amount: "$120K", status: "Applied", deadline: "Oct 15, 2026", nextReport: "—" },
  { grantor: "Environment Canada", amount: "$90K", status: "Applied", deadline: "Nov 1, 2026", nextReport: "—" },
];

const investors = [
  { name: "James Whittaker", amount: "$200K", date: "Jan 2025" },
  { name: "Elena Vasquez", amount: "$150K", date: "Mar 2025" },
  { name: "Thomas Park", amount: "$100K", date: "May 2025" },
  { name: "Anika Patel", amount: "$85K", date: "Jun 2025" },
  { name: "Marcus Chen", amount: "$75K", date: "Aug 2025" },
  { name: "Sarah Lindqvist", amount: "$60K", date: "Sep 2025" },
  { name: "David Okafor", amount: "$50K", date: "Oct 2025" },
  { name: "Rachel Kim", amount: "$45K", date: "Nov 2025" },
  { name: "Ben Morrison", amount: "$40K", date: "Dec 2025" },
  { name: "Yuki Tanaka", amount: "$35K", date: "Jan 2026" },
  { name: "Chris Delaney", amount: "$25K", date: "Feb 2026" },
  { name: "Mira Johal", amount: "$15K", date: "Mar 2026" },
];

const capTable = [
  { name: "Founders", value: 55, color: "#EA824E" },
  { name: "Angels", value: 20, color: "#38387F" },
  { name: "Strategic", value: 15, color: "#AF695E" },
  { name: "ESOP", value: 10, color: "#73516F" },
];

/* ── Village Grants & Initiatives ─────────────────────────────── */

type InitiativeCategory = "Art" | "Tools & Systems" | "Hackathons" | "X-Prize Bounties" | "Research" | "Infrastructure";
type InitiativeStatus = "Active" | "Fully Funded" | "Awarded" | "Completed";

interface Initiative {
  id: string;
  title: string;
  description: string;
  category: InitiativeCategory;
  village: string;
  raised: number;
  goal: number;
  contributors: number;
  status: InitiativeStatus;
  deadline?: string;
}

const initiativeCategoryStyle: Record<InitiativeCategory, { bg: string; text: string; border: string; icon: ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }> }> = {
  "Art":              { bg: "bg-amber/10",        text: "text-amber",        border: "border-amber/25",        icon: PaintBrush },
  "Tools & Systems":  { bg: "bg-emerald-500/10",  text: "text-emerald-400",  border: "border-emerald-500/25",  icon: Wrench },
  "Hackathons":       { bg: "bg-indigo-500/10",   text: "text-indigo-400",   border: "border-indigo-500/25",   icon: Code },
  "X-Prize Bounties": { bg: "bg-[#C4614A]/10",    text: "text-[#C4614A]",    border: "border-[#C4614A]/25",    icon: Trophy },
  "Research":         { bg: "bg-blue-500/10",     text: "text-blue-400",     border: "border-blue-500/25",     icon: Flask },
  "Infrastructure":   { bg: "bg-[#9B7FA0]/10",    text: "text-[#9B7FA0]",    border: "border-[#9B7FA0]/25",    icon: MapTrifold },
};

const initiativeStatusBadge: Record<InitiativeStatus, string> = {
  "Active":       "bg-amber/15 text-amber",
  "Fully Funded": "bg-emerald-500/15 text-emerald-400",
  "Awarded":      "bg-blue-500/15 text-blue-400",
  "Completed":    "bg-white/[0.08] text-white/55",
};

const initiatives: Initiative[] = [
  {
    id: "permaculture-edu",
    title: "Permaculture Education Series",
    description: "12-week curriculum + recorded workshops, free for all village members and open-source for the network.",
    category: "Art",
    village: "Wells Gray Village",
    raised: 4500, goal: 8000, contributors: 23,
    status: "Active", deadline: "Jul 30, 2026",
  },
  {
    id: "sensor-toolkit",
    title: "Open-Source Sensor Toolkit",
    description: "Affordable IoT kit (soil, weather, energy) under $80. Hardware specs, firmware, and assembly guides released CC-BY-SA.",
    category: "Tools & Systems",
    village: "Network-wide",
    raised: 12000, goal: 15000, contributors: 47,
    status: "Active", deadline: "Aug 15, 2026",
  },
  {
    id: "village-os-hackathon",
    title: "Village OS Hackathon — Q3 2026",
    description: "72-hour distributed build sprint. Teams ship modules, integrations, or governance tools. $10K in prizes.",
    category: "Hackathons",
    village: "Network-wide",
    raised: 25000, goal: 25000, contributors: 89,
    status: "Fully Funded", deadline: "Sep 12, 2026",
  },
  {
    id: "cabin-xprize",
    title: "Affordable Cabin Design X-Prize",
    description: "$50K bounty for a winterized cabin design under $25K materials, replicable in 6 weeks by a 4-person crew.",
    category: "X-Prize Bounties",
    village: "Wells Gray Village",
    raised: 50000, goal: 50000, contributors: 12,
    status: "Awarded",
  },
  {
    id: "land-stewardship-mural",
    title: "Indigenous Land Stewardship Mural",
    description: "Collaboration with Simpcw First Nation artists — large-scale mural on the community pavilion honouring stewardship traditions.",
    category: "Art",
    village: "Wells Gray Village",
    raised: 2800, goal: 3500, contributors: 31,
    status: "Active", deadline: "Jun 22, 2026",
  },
  {
    id: "compost-research",
    title: "Black Soldier Fly Composting Trial",
    description: "12-month research trial measuring food-waste-to-soil conversion at small village scale. Open data, peer-reviewable.",
    category: "Research",
    village: "Riverside Co-op",
    raised: 1200, goal: 4000, contributors: 8,
    status: "Active", deadline: "Oct 1, 2026",
  },
  {
    id: "solar-greenhouse-bounty",
    title: "Solar Greenhouse Design Bounty",
    description: "Open call for a year-round greenhouse design powered entirely by passive solar + small battery. Best 3 share $15K.",
    category: "X-Prize Bounties",
    village: "Network-wide",
    raised: 15000, goal: 20000, contributors: 6,
    status: "Active", deadline: "Nov 15, 2026",
  },
  {
    id: "trail-mapping",
    title: "Trail Network GPS Mapping",
    description: "Volunteer-led mapping of 18 km of trails on the property — published as open GIS data and printed wayfinding maps.",
    category: "Infrastructure",
    village: "Wells Gray Village",
    raised: 3000, goal: 3000, contributors: 17,
    status: "Completed",
  },
  {
    id: "mesh-wifi-hackathon",
    title: "Off-Grid Mesh Wifi Hackathon",
    description: "Build resilient community wifi using LoRa + WiFi-mesh hardware. Best implementation gets adopted across 3 partner villages.",
    category: "Hackathons",
    village: "Terraluna Ecovillage",
    raised: 8500, goal: 10000, contributors: 34,
    status: "Active", deadline: "Aug 28, 2026",
  },
];

const initiativeStats = {
  awarded: initiatives.filter((i) => i.status === "Awarded" || i.status === "Completed").reduce((sum, i) => sum + i.raised, 0),
  active:  initiatives.filter((i) => i.status === "Active" || i.status === "Fully Funded").length,
  contributors: initiatives.reduce((sum, i) => sum + i.contributors, 0),
  villages: new Set(initiatives.map((i) => i.village)).size,
};

/* ── Land Pool ─────────────────────────────────────────────────── */

type ParcelStatus = "Pool Forming" | "Active" | "Closing Soon" | "Acquired";
type ParcelFeature = "Water Rights" | "River Access" | "Hydro Nearby" | "Road Access" | "Year-Round Stream" | "Ocean Views" | "Existing Cabin" | "Mature Forest" | "Mountain Views" | "Lake Access" | "Borders Crown Land" | "Southern Exposure" | "Adjacent Old Growth" | "Ranching Infra";

interface LandParcel {
  id: string;
  title: string;
  location: string;
  province: string;
  acres: number;
  price: number;
  pooled: number;
  contributors: number;
  minContribution: number;
  status: ParcelStatus;
  vision: string;
  steward: string;
  features: ParcelFeature[];
  /** Tailwind gradient classes for the placeholder image */
  gradient: string;
}

const featureIcon: Record<ParcelFeature, ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }>> = {
  "Water Rights":        Drop,
  "River Access":        Drop,
  "Hydro Nearby":        Lightning,
  "Road Access":         Path,
  "Year-Round Stream":   Drop,
  "Ocean Views":         Drop,
  "Existing Cabin":      Tree,
  "Mature Forest":       Tree,
  "Mountain Views":      Mountains,
  "Lake Access":         Drop,
  "Borders Crown Land":  Tree,
  "Southern Exposure":   Lightning,
  "Adjacent Old Growth": Tree,
  "Ranching Infra":      Path,
};

const parcelStatusBadge: Record<ParcelStatus, string> = {
  "Pool Forming": "bg-white/[0.08] text-white/65",
  "Active":       "bg-amber/15 text-amber",
  "Closing Soon": "bg-[#C4614A]/15 text-[#C4614A]",
  "Acquired":     "bg-emerald-500/15 text-emerald-400",
};

const parcels: LandParcel[] = [
  {
    id: "slocan-valley",
    title: "Slocan Valley Acreage",
    location: "Slocan Valley",
    province: "BC",
    acres: 47,
    price: 480000,
    pooled: 312000,
    contributors: 23,
    minContribution: 5000,
    status: "Active",
    vision: "Food forest village for 15–20 members focused on perennial agriculture and seed-saving.",
    steward: "Mira Johal",
    features: ["River Access", "Water Rights", "Hydro Nearby", "Road Access"],
    gradient: "from-emerald-900 via-emerald-700 to-teal-600",
  },
  {
    id: "lillooet-riverside",
    title: "Lillooet Riverside Plot",
    location: "Lillooet",
    province: "BC",
    acres: 28,
    price: 320000,
    pooled: 185000,
    contributors: 14,
    minContribution: 7500,
    status: "Pool Forming",
    vision: "Off-grid permaculture homestead with arid-climate water harvesting focus.",
    steward: "Marcus Rivera",
    features: ["River Access", "Southern Exposure", "Existing Cabin"],
    gradient: "from-amber-900 via-orange-800 to-stone-700",
  },
  {
    id: "mabou-coastal",
    title: "Mabou Highlands Coastal",
    location: "Mabou",
    province: "NS",
    acres: 65,
    price: 510000,
    pooled: 445000,
    contributors: 31,
    minContribution: 5000,
    status: "Closing Soon",
    vision: "Coastal arts and crafts village — studios, residencies, summer programming.",
    steward: "Hannah Forsberg",
    features: ["Ocean Views", "Mature Forest", "Year-Round Stream", "Road Access"],
    gradient: "from-blue-900 via-cyan-800 to-slate-700",
  },
  {
    id: "watson-lake",
    title: "Watson Lake Wilderness Quarter",
    location: "Watson Lake",
    province: "YT",
    acres: 160,
    price: 290000,
    pooled: 87000,
    contributors: 8,
    minContribution: 10000,
    status: "Pool Forming",
    vision: "Northern wilderness retreat — small footprint, deep ecology, winter-tested infrastructure.",
    steward: "James Whittaker",
    features: ["Borders Crown Land", "Lake Access", "Mature Forest"],
    gradient: "from-indigo-950 via-slate-800 to-stone-900",
  },
  {
    id: "port-renfrew",
    title: "Port Renfrew Forest Plot",
    location: "Port Renfrew",
    province: "BC",
    acres: 22,
    price: 410000,
    pooled: 410000,
    contributors: 18,
    minContribution: 0,
    status: "Acquired",
    vision: "Old-growth stewardship + tiny-home village. Construction begins Spring 2026.",
    steward: "Anika Patel",
    features: ["Adjacent Old Growth", "Year-Round Stream", "Road Access"],
    gradient: "from-emerald-950 via-green-900 to-emerald-800",
  },
  {
    id: "tatla-lake",
    title: "Tatla Lake Plateau",
    location: "Tatla Lake",
    province: "BC",
    acres: 92,
    price: 385000,
    pooled: 145000,
    contributors: 11,
    minContribution: 7500,
    status: "Active",
    vision: "High-plateau ranch village blending livestock, hay production, and remote-work cabins.",
    steward: "Chris Delaney",
    features: ["Mountain Views", "Ranching Infra", "Road Access", "Water Rights"],
    gradient: "from-stone-800 via-amber-900 to-yellow-900",
  },
];

const parcelStats = {
  listed: parcels.length,
  totalPooled: parcels.reduce((sum, p) => sum + p.pooled, 0),
  active: parcels.filter((p) => p.status === "Active" || p.status === "Pool Forming" || p.status === "Closing Soon").length,
  acquired: parcels.filter((p) => p.status === "Acquired").length,
};

/* ── Tabs ──────────────────────────────────────────────────────── */

type FundraisingTab = "capital" | "grants" | "land";

const tabs: { key: FundraisingTab; label: string; subtitle: string }[] = [
  { key: "capital", label: "Capital",  subtitle: "Campaign tracking, grant pipeline, and investor relations" },
  { key: "grants",  label: "Grants",   subtitle: "Bounties and funded initiatives across the village network" },
  { key: "land",    label: "Land",     subtitle: "Pool capital with others to acquire land and start a new village" },
];

const milestones = [
  { name: "Site Preparation", progress: 100 },
  { name: "Foundation & Utilities", progress: 75 },
  { name: "Cabin Construction", progress: 35 },
  { name: "Interior Fitout", progress: 0 },
  { name: "Landscaping", progress: 0 },
];

/* ── Helpers ─────────────────────────────────────────────────────── */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const typeBadge: Record<string, string> = {
  Equity: "bg-indigo/20 text-blue-400",
  Grant: "bg-emerald-500/15 text-emerald-400",
  Crowdfund: "bg-amber/15 text-amber",
};

const statusBadge: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400",
  "Closing Soon": "bg-amber/15 text-amber",
  Approved: "bg-blue-500/15 text-blue-400",
};

const grantStatusBadge: Record<string, string> = {
  Applied: "bg-white/10 text-white/50",
  "In Review": "bg-amber/15 text-amber",
  Approved: "bg-emerald-500/15 text-emerald-400",
  Disbursed: "bg-blue-500/15 text-blue-400",
};

function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("");
}

function InflowTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-warm-dark/95 border border-white/10 px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="text-white font-medium">{fmt(payload[0].value)}</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function FundraisingPage() {
  const [agentOpen, setAgentOpen] = useState(false);
  const [tab, setTab] = useState<FundraisingTab>("capital");
  const activeTabMeta = tabs.find((t) => t.key === tab)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
            <span className="italic">Fundraising</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">
            {activeTabMeta.subtitle}
          </p>
        </div>
        <button
          onClick={() => setAgentOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber/25 bg-amber/10 text-xs font-medium text-amber hover:opacity-80 transition-opacity self-start shrink-0"
        >
          <Compass size={13} weight="fill" /> Ask Orion
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] -mt-2 overflow-x-auto scrollbar-subtle">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                active ? "text-white" : "text-white/45 hover:text-white/70"
              }`}
            >
              {t.label}
              {active && (
                <motion.div
                  layoutId="fundraising-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── CAPITAL TAB ─────────────────────────────────────────────── */}
      {tab === "capital" && (
        <div className="space-y-6">

      {/* Stats row */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5">
                <s.icon size={14} weight="fill" className="text-amber" />
              </div>
            </div>
            <div className="text-xl font-semibold text-white lg:text-2xl">{s.value}</div>
            <p className="mt-1 text-xs text-white/30">{s.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Campaigns */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Active Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-xs uppercase text-white/30">
                <th className="pb-3 text-left font-medium">Campaign</th>
                <th className="pb-3 text-left font-medium">Type</th>
                <th className="pb-3 text-right font-medium">Goal</th>
                <th className="pb-3 text-right font-medium">Raised</th>
                <th className="pb-3 text-left font-medium pl-4 w-40">Progress</th>
                <th className="pb-3 text-right font-medium">Days Left</th>
                <th className="pb-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const pct = Math.round((c.raised / c.goal) * 100);
                return (
                  <tr key={c.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-sm text-white/80">{c.name}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeBadge[c.type]}`}>{c.type}</span>
                    </td>
                    <td className="py-3 text-sm text-white/60 text-right">{fmt(c.goal)}</td>
                    <td className="py-3 text-sm text-white font-medium text-right">{fmt(c.raised)}</td>
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full bg-amber" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-white/40 w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-white/50 text-right">{c.daysLeft > 0 ? c.daysLeft : "—"}</td>
                    <td className="py-3 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge[c.status]}`}>{c.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Funding Sources donut + Monthly Inflow bar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-6">
        {/* Funding Sources */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Funding Sources</h2>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={fundingSources} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={2} stroke="none">
                  {fundingSources.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              {fundingSources.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name} {s.value}%
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Monthly Inflow */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Monthly Inflow</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyInflow}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip content={<InflowTooltip />} />
              <Bar dataKey="amount" fill="#EA824E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Grant Tracker */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Grant Tracker</h2>
        <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
          <table className="w-full min-w-[700px]">
            <thead className="sticky top-0 bg-[#0F0D14]">
              <tr className="text-xs uppercase text-white/30">
                <th className="pb-3 text-left font-medium">Grantor</th>
                <th className="pb-3 text-right font-medium">Amount</th>
                <th className="pb-3 text-left font-medium pl-4">Status</th>
                <th className="pb-3 text-left font-medium">Deadline</th>
                <th className="pb-3 text-left font-medium">Next Report</th>
              </tr>
            </thead>
            <tbody>
              {grants.map((g) => (
                <tr key={g.grantor} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 text-sm text-white/80">{g.grantor}</td>
                  <td className="py-3 text-sm text-white font-medium text-right">{g.amount}</td>
                  <td className="py-3 pl-4">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${grantStatusBadge[g.status]}`}>{g.status}</span>
                  </td>
                  <td className="py-3 text-xs text-white/50">{g.deadline}</td>
                  <td className="py-3 text-xs text-white/50">{g.nextReport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Investor Relations */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white">Investor Relations</h2>
          <span className="text-xs text-white/30">{investors.length} investors</span>
        </div>
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {investors.map((inv) => (
            <motion.div key={inv.name} variants={fadeUp} className="rounded-xl border border-white/[0.04] bg-white/[0.03] p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber/15 text-xs font-semibold text-amber">
                {initials(inv.name)}
              </div>
              <p className="text-xs text-white/70 truncate">{inv.name}</p>
              <p className="text-sm font-semibold text-white mt-0.5">{inv.amount}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{inv.date}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Cap Table + Milestone Progress (still part of Capital tab) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-6">
        {/* Cap Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-5">Cap Table</h2>
          <div className="h-8 rounded-full overflow-hidden flex">
            {capTable.map((seg) => (
              <div key={seg.name} className="h-full transition-all" style={{ width: `${seg.value}%`, backgroundColor: seg.color }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            {capTable.map((seg) => (
              <div key={seg.name} className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: seg.color }} />
                <span className="text-xs text-white/50">{seg.name}</span>
                <span className="text-xs font-medium text-white">{seg.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Milestone Progress */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-5">Milestone Progress</h2>
          <div className="space-y-4">
            {milestones.map((m) => (
              <div key={m.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/60">{m.name}</span>
                  <span className="text-xs font-medium text-white">{m.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all ${m.progress === 100 ? "bg-emerald-500/70" : m.progress > 0 ? "bg-amber" : "bg-white/[0.06]"}`}
                    style={{ width: `${Math.max(m.progress, 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

        </div>
      )}

      {/* ── GRANTS TAB ──────────────────────────────────────────────── */}
      {tab === "grants" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 lg:p-6"
        >
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
            <div>
              <h2 className="text-base font-medium text-white">Village Grants &amp; Initiatives</h2>
              <p className="mt-1 text-xs text-white/40">
                Funded projects across the network — art, tools, hackathons, bounties, research
              </p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber/25 bg-amber/10 text-xs font-medium text-amber hover:opacity-80 transition-opacity self-start shrink-0">
              <Plus size={13} weight="bold" /> Submit Initiative
            </button>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-5">
            {[
              { label: "Total Awarded",  value: fmt(initiativeStats.awarded) },
              { label: "Active",         value: initiativeStats.active.toString() },
              { label: "Contributors",   value: initiativeStats.contributors.toString() },
              { label: "Villages",       value: initiativeStats.villages.toString() },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-wider text-white/35">{s.label}</div>
                <div className="text-base font-semibold text-white mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Initiative grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
          >
            {initiatives.map((init) => {
              const cat = initiativeCategoryStyle[init.category];
              const CatIcon = cat.icon;
              const pct = Math.min(Math.round((init.raised / init.goal) * 100), 100);
              const isComplete = init.status === "Awarded" || init.status === "Completed" || init.status === "Fully Funded";
              return (
                <motion.div
                  key={init.id}
                  variants={fadeUp}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 flex flex-col hover:bg-white/[0.05] hover:border-white/[0.1] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium ${cat.bg} ${cat.text} ${cat.border}`}>
                      <CatIcon size={10} weight="fill" />
                      {init.category}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${initiativeStatusBadge[init.status]}`}>
                      {init.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white/90 leading-snug mb-1.5">{init.title}</h3>
                  <p className="text-xs text-white/45 leading-relaxed line-clamp-3 mb-3 flex-1">{init.description}</p>

                  <div className="text-[10px] text-white/30 mb-3">
                    <span className="uppercase tracking-wider">From</span>{" "}
                    <span className="text-white/55 font-medium">{init.village}</span>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-white">{fmt(init.raised)}</span>
                        <span className="text-[11px] text-white/40">of {fmt(init.goal)}</span>
                      </div>
                      <span className="text-[10px] text-white/45">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isComplete ? "bg-emerald-500/70" : "bg-amber"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/45">
                      <Users size={11} weight="fill" />
                      <span>{init.contributors} {init.category === "X-Prize Bounties" ? "sponsors" : "contributors"}</span>
                    </div>
                    {init.status === "Active" || init.status === "Fully Funded" ? (
                      <button className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${cat.bg} ${cat.text} hover:opacity-80 transition-opacity`}>
                        {init.status === "Active" ? "Contribute" : "View"}
                      </button>
                    ) : (
                      <span className="text-[11px] text-white/30 italic">Closed</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}

      {/* ── LAND TAB ────────────────────────────────────────────────── */}
      {tab === "land" && (
        <div className="space-y-6">
          {/* Hero / intro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-950/40 via-white/[0.03] to-white/[0.02] p-5 lg:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-lg bg-emerald-500/15 p-1.5">
                    <Tree size={14} weight="fill" className="text-emerald-400" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/80 font-medium">
                    Land Acquisition Pool
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-light text-white lg:text-3xl">
                  Pool capital. Acquire land. <span className="italic text-emerald-300/90">Start a village.</span>
                </h2>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">
                  Every parcel below has a small group already forming. Contribute toward shared ownership,
                  vote on the vision, and become a founding member of a new node in the village network.
                </p>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-400 hover:opacity-80 transition-opacity self-start shrink-0">
                <Plus size={13} weight="bold" /> List a Parcel
              </button>
            </div>

            {/* Pool stats */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mt-5">
              {[
                { label: "Parcels Listed",  value: parcelStats.listed.toString() },
                { label: "Total Pooled",    value: fmt(parcelStats.totalPooled) },
                { label: "Active Pools",    value: parcelStats.active.toString() },
                { label: "Acquired",        value: parcelStats.acquired.toString() },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-white/35">{s.label}</div>
                  <div className="text-base font-semibold text-white mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Parcel grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {parcels.map((p) => {
              const pct = Math.min(Math.round((p.pooled / p.price) * 100), 100);
              const isAcquired = p.status === "Acquired";
              return (
                <motion.div
                  key={p.id}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden flex flex-col hover:border-white/[0.12] transition-colors"
                >
                  {/* Image / gradient banner */}
                  <div className={`h-32 bg-gradient-to-br ${p.gradient} relative`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${parcelStatusBadge[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1 text-[10px] text-white/75">
                        <MapPin size={10} weight="fill" />
                        <span className="font-medium">{p.location}, {p.province}</span>
                      </div>
                      <h3 className="text-base font-semibold text-white leading-tight mt-0.5">{p.title}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Acreage + price */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.05]">
                      <div className="flex items-center gap-1.5 text-xs text-white/65">
                        <Ruler size={11} weight="fill" className="text-white/45" />
                        <span className="font-medium">{p.acres} acres</span>
                      </div>
                      <div className="text-sm font-semibold text-white">{fmt(p.price)}</div>
                    </div>

                    {/* Vision */}
                    <p className="text-xs text-white/55 leading-relaxed mb-3 flex-1">
                      {p.vision}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.features.slice(0, 4).map((f) => {
                        const FIcon = featureIcon[f];
                        return (
                          <span key={f} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/55">
                            <FIcon size={9} weight="fill" />
                            {f}
                          </span>
                        );
                      })}
                    </div>

                    {/* Steward */}
                    <div className="text-[10px] text-white/35 mb-3">
                      <span className="uppercase tracking-wider">Steward</span>{" "}
                      <span className="text-white/65 font-medium">{p.steward}</span>
                    </div>

                    {/* Pool progress */}
                    <div className="mb-3">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-white">{fmt(p.pooled)}</span>
                          <span className="text-[11px] text-white/40">of {fmt(p.price)}</span>
                        </div>
                        <span className="text-[10px] text-white/45">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isAcquired ? "bg-emerald-500/80" : "bg-amber"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                        <Users size={11} weight="fill" />
                        <span>
                          {p.contributors} {isAcquired ? "founders" : "in pool"}
                          {p.minContribution > 0 && !isAcquired && (
                            <span className="text-white/30"> · {fmt(p.minContribution)} min</span>
                          )}
                        </span>
                      </div>
                      {isAcquired ? (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/15 text-emerald-400 inline-flex items-center gap-1">
                          <CheckCircle size={11} weight="fill" /> Acquired
                        </span>
                      ) : (
                        <button className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                          Join Pool
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 lg:p-6"
          >
            <h3 className="text-sm font-medium text-white mb-4">How land pools work</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              {[
                { step: "01", title: "Find a parcel", body: "Browse listings or submit your own. Each has a steward and an emerging vision." },
                { step: "02", title: "Join the pool", body: "Contribute capital. Your share becomes equity in a co-op holding the land." },
                { step: "03", title: "Vote on the vision", body: "Pool members shape the buildout — zoning, structures, governance, fees." },
                { step: "04", title: "Move on the land", body: "When fully funded, the co-op closes the deal and construction begins." },
              ].map((s) => (
                <div key={s.step} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="text-[10px] font-mono tracking-wider text-emerald-400/70 mb-2">{s.step}</div>
                  <div className="text-sm font-medium text-white mb-1">{s.title}</div>
                  <p className="text-xs text-white/45 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <AgentDrawer agentId="orion" isOpen={agentOpen} onClose={() => setAgentOpen(false)} />
    </div>
  );
}

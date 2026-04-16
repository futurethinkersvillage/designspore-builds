"use client";

import { motion } from "framer-motion";
import {
  UsersThree, MapPin, Star, ArrowUp, MagnifyingGlass, Sparkle,
} from "@phosphor-icons/react";
import { useState } from "react";
import AgentDrawer from "@/components/dashboard/AgentDrawer";

/* ── Data ─────────────────────────────────────────────────────────── */

const memberStats = [
  { label: "Total Members", value: "247", trend: "+12%", trendUp: true },
  { label: "Active This Month", value: "89", trend: "+8", trendUp: true },
  { label: "New This Quarter", value: "23", trend: "+23", trendUp: true },
  { label: "Skill Categories", value: "42", trend: "+4", trendUp: true },
];

const members = [
  { name: "Mike Gilliland", role: "Founder", skills: ["Building", "Tech", "Leadership"], location: "Clearwater, BC", tier: "Elder", joined: "2023", active: true, initials: "MG" },
  { name: "Euvie Ivanova", role: "Co-founder", skills: ["Design", "Strategy", "Wellness"], location: "Clearwater, BC", tier: "Elder", joined: "2023", active: true, initials: "EI" },
  { name: "Sarah Chen", role: "Community Manager", skills: ["Facilitation", "Admin", "Events"], location: "Vancouver, BC", tier: "Steward", joined: "2024", active: true, initials: "SC" },
  { name: "Marcus Rivera", role: "Lead Builder", skills: ["Carpentry", "Construction"], location: "Portland, OR", tier: "Steward", joined: "2024", active: true, initials: "MR" },
  { name: "Elena Vasquez", role: "Farm Director", skills: ["Permaculture", "Teaching"], location: "San José, CR", tier: "Builder", joined: "2024", active: true, initials: "EV" },
  { name: "Yuki Tanaka", role: "Village Chef", skills: ["Cooking", "Fermentation"], location: "Tokyo, JP", tier: "Builder", joined: "2024", active: true, initials: "YT" },
  { name: "Ben Morrison", role: "Trail Guide", skills: ["Outdoors", "First Aid"], location: "Calgary, AB", tier: "Builder", joined: "2024", active: true, initials: "BM" },
  { name: "Anika Patel", role: "Tech Lead", skills: ["Software", "IoT", "Solar"], location: "Mumbai, IN", tier: "Steward", joined: "2024", active: true, initials: "AP" },
  { name: "David Okafor", role: "Renewable Energy", skills: ["Solar", "Electrical"], location: "Lagos, NG", tier: "Builder", joined: "2025", active: true, initials: "DO" },
  { name: "Rachel Kim", role: "Yoga Instructor", skills: ["Wellness", "Teaching"], location: "Seoul, KR", tier: "Builder", joined: "2025", active: true, initials: "RK" },
  { name: "Thomas Park", role: "Architect", skills: ["Design", "Planning"], location: "Berlin, DE", tier: "Steward", joined: "2024", active: false, initials: "TP" },
  { name: "Mira Johal", role: "Herbalist", skills: ["Farming", "Medicine"], location: "Surrey, BC", tier: "Builder", joined: "2025", active: true, initials: "MJ" },
  { name: "Chris Delaney", role: "Musician", skills: ["Music", "Events"], location: "Dublin, IE", tier: "Explorer", joined: "2025", active: true, initials: "CD" },
  { name: "Lena Björk", role: "Teacher", skills: ["Education", "Crafts"], location: "Stockholm, SE", tier: "Builder", joined: "2025", active: false, initials: "LB" },
  { name: "James Whittaker", role: "Investor", skills: ["Finance", "Strategy"], location: "London, UK", tier: "Elder", joined: "2024", active: true, initials: "JW" },
  { name: "Priya Sharma", role: "Artist", skills: ["Art", "Design", "Crafts"], location: "Jaipur, IN", tier: "Explorer", joined: "2025", active: true, initials: "PS" },
  { name: "Lucas Martins", role: "Developer", skills: ["Tech", "Automation"], location: "São Paulo, BR", tier: "Builder", joined: "2025", active: true, initials: "LM" },
  { name: "Hannah Fischer", role: "Beekeeper", skills: ["Farming", "Biology"], location: "Zurich, CH", tier: "Builder", joined: "2025", active: true, initials: "HF" },
  { name: "Omar Hassan", role: "Chef", skills: ["Cooking", "Culture"], location: "Amman, JO", tier: "Explorer", joined: "2025", active: false, initials: "OH" },
  { name: "Sophia Russo", role: "Writer", skills: ["Communication", "Teaching"], location: "Rome, IT", tier: "Explorer", joined: "2026", active: true, initials: "SR" },
  { name: "Kai Nakamura", role: "Carpenter", skills: ["Building", "Furniture"], location: "Kyoto, JP", tier: "Builder", joined: "2025", active: true, initials: "KN" },
  { name: "Ingrid Larsen", role: "Nurse", skills: ["Health", "Wellness"], location: "Oslo, NO", tier: "Steward", joined: "2024", active: true, initials: "IL" },
  { name: "Roberto Silva", role: "Farmer", skills: ["Agriculture", "Animals"], location: "Lisbon, PT", tier: "Builder", joined: "2025", active: true, initials: "RS" },
  { name: "Zara Williams", role: "Designer", skills: ["Design", "Branding"], location: "Melbourne, AU", tier: "Explorer", joined: "2026", active: true, initials: "ZW" },
];

const tierAvatarStyles: Record<string, string> = {
  Elder: "bg-mauve/25 text-purple-300 ring-1 ring-mauve/40",
  Steward: "bg-amber/20 text-amber ring-1 ring-amber/40",
  Builder: "bg-indigo/20 text-blue-400 ring-1 ring-indigo/40",
  Explorer: "bg-white/10 text-white/50 ring-1 ring-white/20",
};

const tierBadgeStyles: Record<string, string> = {
  Elder: "bg-mauve/15 text-purple-300",
  Steward: "bg-amber/15 text-amber",
  Builder: "bg-indigo/15 text-blue-400",
  Explorer: "bg-white/10 text-white/40",
};

const skillCategories = ["Building", "Farming", "Tech", "Cooking", "Teaching", "Design", "Admin", "Health"];

const leaderboard = [
  { name: "Elena Vasquez", hours: 847, proposals: 3, events: 12 },
  { name: "Marcus Rivera", hours: 792, proposals: 2, events: 4 },
  { name: "Ben Morrison", hours: 634, proposals: 1, events: 8 },
  { name: "Anika Patel", hours: 518, proposals: 4, events: 6 },
  { name: "Sarah Chen", hours: 489, proposals: 2, events: 22 },
];

const tierTabs = ["All", "Explorer", "Builder", "Steward", "Elder"];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

/* ── Page ─────────────────────────────────────────────────────────── */

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [agentOpen, setAgentOpen] = useState(false);
  const filtered = activeTab === "All" ? members : members.filter((m) => m.tier === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
            Village <span className="italic">Members</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">Directory, skills matrix, and community network</p>
        </div>
        <button
          onClick={() => setAgentOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-xs font-medium text-blue-400 hover:opacity-80 transition-opacity self-start shrink-0"
        >
          <Sparkle size={13} weight="fill" /> Ask Iris
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {memberStats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5">
            <div className="text-xs text-white/40 mb-2">{s.label}</div>
            <div className="text-xl font-semibold text-white">{s.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400"><ArrowUp size={10} weight="bold" />{s.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 text-sm w-full sm:w-64">
          <MagnifyingGlass size={16} className="shrink-0" />
          <span className="text-xs">Search members...</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tierTabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === t ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Member grid */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((m) => (
          <motion.div key={m.name} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 hover:bg-white/[0.06] transition-colors cursor-pointer">
            <div className="flex items-start gap-3 mb-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${tierAvatarStyles[m.tier]}`}>
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-white truncate">{m.name}</span>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.active ? "bg-emerald-400" : "bg-white/20"}`} />
                </div>
                <div className="text-xs text-white/40 truncate">{m.role}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {m.skills.map((s) => (
                <span key={s} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/40">{s}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-white/25">
                <MapPin size={9} weight="fill" /> {m.location.split(",")[0]}
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${tierBadgeStyles[m.tier]}`}>{m.tier}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Skills matrix + Leaderboard */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* Skills matrix */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Skills Matrix — Top Members</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="pb-3 text-left text-white/30 font-medium w-28">Member</th>
                  {skillCategories.map((s) => (
                    <th key={s} className="pb-3 text-center text-white/30 font-medium text-[10px]">{s.slice(0,4)}.</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.slice(0, 10).map((m) => (
                  <tr key={m.name} className="border-b border-white/[0.04]">
                    <td className="py-2 text-white/60 truncate max-w-[7rem]">{m.name.split(" ")[0]}</td>
                    {skillCategories.map((cat) => {
                      const has = m.skills.some((s) => s.toLowerCase().includes(cat.toLowerCase().slice(0, 5)));
                      const partial = !has && Math.random() > 0.6;
                      return (
                        <td key={cat} className="py-2 text-center">
                          {has ? (
                            <div className="w-5 h-5 rounded bg-amber/30 mx-auto" />
                          ) : partial ? (
                            <div className="w-5 h-5 rounded bg-amber/10 mx-auto" />
                          ) : (
                            <div className="w-5 h-5 rounded bg-white/[0.03] mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-3 h-3 rounded bg-amber/30" />High proficiency</div>
            <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-3 h-3 rounded bg-amber/10" />Some skills</div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Top Contributors</h2>
          <div className="space-y-0">
            {leaderboard.map((l, i) => (
              <div key={l.name} className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i === 0 ? "bg-amber/20 text-amber" : i === 1 ? "bg-white/10 text-white/60" : i === 2 ? "bg-terracotta/20 text-terracotta" : "bg-white/[0.04] text-white/30"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white/80">{l.name}</div>
                  <div className="text-xs text-white/30">{l.proposals} proposals · {l.events} events</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{l.hours}</div>
                  <div className="text-[10px] text-white/25">hours</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <AgentDrawer agentId="iris" isOpen={agentOpen} onClose={() => setAgentOpen(false)} />
    </div>
  );
}

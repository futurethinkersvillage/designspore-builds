"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Scales, Compass, Plant, Hammer, GlobeHemisphereWest, Sparkle,
  Robot, ArrowRight, CheckCircle, Clock, Warning, Wrench,
  Megaphone, Users, Leaf, CurrencyDollar, Star, Plus, Download,
  ShieldCheck, Flask, MapPin, Lightning, ChatTeardrop,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { agentsList, councilActivity } from "@/lib/data/dashboard/agents";
import type { AgentAccent, AgentStatus, ActionType } from "@/lib/data/dashboard/agents";
import { sharedSkills, skillStats } from "@/lib/data/dashboard/shared-skills";
import type { SkillCategory, SkillVerification } from "@/lib/data/dashboard/shared-skills";

/* ── Icon map ───────────────────────────────────────────────────────── */

const iconMap: Record<string, ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }>> = {
  Scales, Compass, Plant, Hammer, GlobeHemisphereWest, Sparkle,
};

/* ── Accent + status maps ───────────────────────────────────────────── */

const accentMap: Record<AgentAccent, { bg: string; text: string; border: string }> = {
  indigo:     { bg: "bg-indigo-500/10",  text: "text-indigo-400",  border: "border-indigo-500/20"  },
  amber:      { bg: "bg-amber/10",       text: "text-amber",       border: "border-amber/20"       },
  emerald:    { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  terracotta: { bg: "bg-[#C4614A]/10",   text: "text-[#C4614A]",   border: "border-[#C4614A]/20"   },
  mauve:      { bg: "bg-[#9B7FA0]/10",   text: "text-[#9B7FA0]",   border: "border-[#9B7FA0]/20"   },
  blue:       { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20"    },
};

const statusMap: Record<AgentStatus, { label: string; dot: string; pulse: boolean }> = {
  active:           { label: "Active",         dot: "bg-emerald-400", pulse: false },
  idle:             { label: "Idle",           dot: "bg-white/20",    pulse: false },
  thinking:         { label: "Thinking…",      dot: "bg-amber",       pulse: true  },
  "needs-approval": { label: "Needs Approval", dot: "bg-[#C4614A]",   pulse: true  },
};

const actionTypeIcon: Record<ActionType, ComponentType<{ size?: number; className?: string }>> = {
  resolved:  CheckCircle,
  approval:  Warning,
  created:   Wrench,
  action:    Users,
  logged:    Leaf,
  sent:      Megaphone,
  published: GlobeHemisphereWest,
};

const modelBadge: Record<string, string> = {
  opus:    "bg-amber/10 text-amber border-amber/20",
  sonnet:  "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  haiku:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const globalStats = [
  { label: "Active Agents", value: "6 / 6", icon: Robot },
  { label: "Actions Today", value: "47", icon: CheckCircle },
  { label: "Pending Approvals", value: "3", icon: Warning },
  { label: "Cost This Month", value: "$124", icon: CurrencyDollar },
];

/* ── Skill Library maps ─────────────────────────────────────────────── */

const skillCategoryStyle: Record<SkillCategory, { bg: string; text: string; border: string; icon: ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }> }> = {
  "Governance":       { bg: "bg-indigo-500/10",  text: "text-indigo-400",  border: "border-indigo-500/20",  icon: Scales },
  "Communications":   { bg: "bg-amber/10",       text: "text-amber",       border: "border-amber/20",       icon: ChatTeardrop },
  "Operations":       { bg: "bg-[#C4614A]/10",   text: "text-[#C4614A]",   border: "border-[#C4614A]/20",   icon: Wrench },
  "Land & Energy":    { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: Lightning },
  "People & Culture": { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    icon: Sparkle },
  "Network":          { bg: "bg-[#9B7FA0]/10",   text: "text-[#9B7FA0]",   border: "border-[#9B7FA0]/20",   icon: GlobeHemisphereWest },
};

const verificationStyle: Record<SkillVerification, { label: string; bg: string; text: string; icon: ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }> }> = {
  verified:     { label: "Verified",     bg: "bg-emerald-500/10",  text: "text-emerald-400",  icon: ShieldCheck },
  community:    { label: "Community",    bg: "bg-white/[0.06]",    text: "text-white/55",     icon: Users },
  experimental: { label: "Experimental", bg: "bg-amber/10",        text: "text-amber",        icon: Flask },
};

const skillFilterCategories: ("All" | SkillCategory)[] = [
  "All", "Governance", "Communications", "Operations", "Land & Energy", "People & Culture", "Network",
];

/* ── Animations ──────────────────────────────────────────────────────── */

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const staggerSlow = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function AgentsPage() {
  const [skillFilter, setSkillFilter] = useState<"All" | SkillCategory>("All");

  const filteredSkills = sharedSkills.filter((s) => skillFilter === "All" || s.category === skillFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          The <span className="italic">Council</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Wells Gray Village — AI agent fleet managing village operations
        </p>
      </div>

      {/* Global stats */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
      >
        {globalStats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 lg:p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-white/40">{s.label}</span>
                <div className="rounded-lg bg-amber/10 p-1.5">
                  <Icon size={14} className="text-amber" />
                </div>
              </div>
              <div className="text-xl font-semibold text-white lg:text-2xl">{s.value}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Agent grid */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {agentsList.map((agent) => {
          const Icon = iconMap[agent.iconName] ?? Robot;
          const ac = accentMap[agent.accent];
          const st = statusMap[agent.status];
          const maxModules = 3;
          const visibleModules = agent.modules.slice(0, maxModules);
          const extraModules = agent.modules.length - maxModules;

          return (
            <motion.div
              key={agent.id}
              variants={fadeUp}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 flex flex-col gap-4 hover:border-white/[0.1] transition-colors duration-300"
            >
              {/* Top row */}
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 ${ac.bg}`}>
                  <Image
                    src={agent.imgSrc}
                    alt={agent.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    onError={() => {}}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-semibold text-white">{agent.name}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${ac.bg} ${ac.text} ${ac.border}`}>
                      {agent.archetype}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${modelBadge[agent.model]}`}>
                      {agent.model}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 truncate">{agent.role}</p>
                </div>
              </div>

              {/* Voice quote */}
              <p className="text-xs italic text-white/30 leading-relaxed border-l-2 border-white/[0.06] pl-3">
                &ldquo;{agent.voice}&rdquo;
              </p>

              {/* Module chips */}
              <div className="flex flex-wrap gap-1.5">
                {visibleModules.map((mod) => (
                  <span key={mod} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] text-white/40 border border-white/[0.06]">
                    {mod}
                  </span>
                ))}
                {extraModules > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] text-white/30 border border-white/[0.06]">
                    +{extraModules} more
                  </span>
                )}
              </div>

              {/* Status + stats */}
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot} ${st.pulse ? "animate-pulse" : ""}`} />
                  <span className="text-xs text-white/50">{st.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>{agent.actionsToday} actions today</span>
                  {agent.pendingApprovals > 0 && (
                    <span className="text-[#C4614A]">{agent.pendingApprovals} pending</span>
                  )}
                </div>
              </div>

              {/* Last active + view link */}
              <div className="flex items-center justify-between -mt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-white/25">
                  <Clock size={11} />
                  {agent.lastActive}
                </div>
                <Link
                  href={`/agents/${agent.id}`}
                  className={`flex items-center gap-1 text-xs font-medium transition-colors ${ac.text} opacity-60 hover:opacity-100`}
                >
                  View agent
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Skill Library */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 lg:p-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
          <div>
            <h2 className="text-base font-medium text-white">Skill Library</h2>
            <p className="mt-1 text-xs text-white/40">
              Community-built capabilities you can install on any compatible agent
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber/25 bg-amber/10 text-xs font-medium text-amber hover:opacity-80 transition-opacity self-start shrink-0">
            <Plus size={13} weight="bold" /> Share a Skill
          </button>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-5">
          {[
            { label: "Skills", value: skillStats.total.toString() },
            { label: "Total Installs", value: skillStats.totalInstalls.toString() },
            { label: "Contributors", value: skillStats.contributors.toString() },
            { label: "Verified", value: skillStats.verified.toString() },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2.5">
              <div className="text-[10px] uppercase tracking-wider text-white/35">{s.label}</div>
              <div className="text-base font-semibold text-white mt-0.5">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {skillFilterCategories.map((c) => {
            const active = skillFilter === c;
            const isAll = c === "All";
            const Icon = isAll ? null : skillCategoryStyle[c as SkillCategory].icon;
            return (
              <button
                key={c}
                onClick={() => setSkillFilter(c)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? "bg-white/[0.10] text-white border border-white/[0.18]"
                    : "bg-white/[0.04] text-white/55 border border-white/[0.06] hover:text-white/85 hover:bg-white/[0.07]"
                }`}
              >
                {Icon && <Icon size={12} weight="fill" />}
                {c}
              </button>
            );
          })}
        </div>

        {/* Skills grid */}
        <motion.div
          variants={staggerSlow}
          initial="hidden"
          animate="visible"
          key={skillFilter}
          className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredSkills.map((skill) => {
            const cat = skillCategoryStyle[skill.category];
            const CatIcon = cat.icon;
            const ver = verificationStyle[skill.verification];
            const VerIcon = ver.icon;
            const installedAgents = agentsList.filter((a) => skill.installedOn.includes(a.id));
            return (
              <motion.div
                key={skill.id}
                variants={fadeUp}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 flex flex-col hover:bg-white/[0.05] hover:border-white/[0.1] transition-colors"
              >
                {/* Top: category + verification */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium ${cat.bg} ${cat.text} ${cat.border}`}>
                    <CatIcon size={10} weight="fill" />
                    {skill.category}
                  </div>
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${ver.bg} ${ver.text}`}>
                    <VerIcon size={9} weight="fill" />
                    {ver.label}
                  </div>
                </div>

                {/* Name + description */}
                <h3 className="text-sm font-semibold text-white/90 leading-snug mb-1.5">{skill.name}</h3>
                <p className="text-xs text-white/45 leading-relaxed line-clamp-3 mb-3 flex-1">{skill.description}</p>

                {/* Author */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-[9px] font-medium text-white/70 shrink-0">
                    {skill.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-white/65 leading-tight truncate">{skill.author}</div>
                    <div className="flex items-center gap-1 text-[10px] text-white/35 mt-0.5">
                      <MapPin size={9} weight="fill" />
                      <span className="truncate">{skill.authorVillage}</span>
                    </div>
                  </div>
                </div>

                {/* Installed-on agent avatars */}
                {installedAgents.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider shrink-0">Installed on</span>
                    <div className="flex -space-x-1.5">
                      {installedAgents.map((a) => {
                        const aac = accentMap[a.accent];
                        return (
                          <Link
                            key={a.id}
                            href={`/agents/${a.id}`}
                            title={a.name}
                            className={`w-5 h-5 rounded-full overflow-hidden border-2 border-[#0F0D14] ring-1 ring-white/10 hover:ring-2 hover:ring-white/30 transition-all ${aac.bg}`}
                          >
                            <Image src={a.imgSrc} alt={a.name} width={20} height={20} className="w-full h-full object-cover" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer: stats + install button */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-3 text-[11px] text-white/45">
                    <span className="flex items-center gap-1">
                      <Download size={11} weight="fill" />
                      {skill.installs}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Star size={11} weight="fill" className="text-amber" />
                      <span className="text-white/65">{skill.rating.toFixed(1)}</span>
                    </span>
                  </div>
                  <button className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium ${cat.bg} ${cat.text} hover:opacity-80 transition-opacity`}>
                    <Plus size={11} weight="bold" />
                    Install
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredSkills.length === 0 && (
          <div className="py-12 text-center text-sm text-white/35">
            No skills match this filter.
          </div>
        )}
      </motion.div>

      {/* Recent Council Activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-medium text-white">Recent Council Activity</h2>
          <span className="text-xs text-white/25">Last 8 actions</span>
        </div>
        <div className="space-y-0">
          {councilActivity.map((item, i) => {
            const TypeIcon = actionTypeIcon[item.type as ActionType];
            const ac = accentMap[item.accent as AgentAccent];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.04, duration: 0.35 }}
                className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0"
              >
                <div className={`mt-0.5 shrink-0 ${ac.text}`}>
                  <TypeIcon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[11px] font-semibold ${ac.text}`}>{item.agent}</span>
                    <span className={`inline-flex px-1.5 py-0 rounded text-[9px] uppercase tracking-wide ${ac.bg} ${ac.text} opacity-70`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{item.action}</p>
                </div>
                <span className="text-[10px] text-white/25 shrink-0">{item.time}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

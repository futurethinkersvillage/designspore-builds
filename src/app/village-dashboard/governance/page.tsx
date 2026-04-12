"use client";

import { motion } from "framer-motion";
import {
  Scales, FileText, ChartBar,
  CheckCircle, XCircle, Minus, Clock,
  ShieldCheck, Users, Gavel, ThumbsUp,
  ArrowRight, Robot, Sparkle,
  Brain, ChatsCircle,
} from "@phosphor-icons/react";

/* ── Inline data ───────────────────────────────────────────────────── */

const stats = [
  { label: "Participation Rate", value: "78%", icon: Users },
  { label: "Avg Resolution", value: "4.2 days", icon: Clock },
  { label: "Proposals This Quarter", value: "12", icon: FileText },
  { label: "Consent Rate", value: "85%", icon: ThumbsUp },
];

const proposals = [
  {
    title: "Solar Array Expansion — Phase 2",
    proposer: "Elena V.",
    forVotes: 142,
    against: 18,
    abstain: 12,
    status: "Open",
    desc: "Expand the existing solar installation with 40 additional panels to reach 90% energy self-sufficiency by Q4 2026.",
    aiAnalysis: {
      impact: "High Impact",
      insight: "Similar to Solar Battery Expansion (Jan '26) which passed 68%. Strong precedent.",
      sentiment: "green",
    },
  },
  {
    title: "Community Garden Expansion to Plot D",
    proposer: "Marcus C.",
    forVotes: 98,
    against: 34,
    abstain: 8,
    status: "Open",
    desc: "Clear and prepare the southeastern plot for 12 additional raised beds with drip irrigation and companion planting zones.",
    aiAnalysis: {
      impact: "Medium Impact",
      insight: "Against votes trending slightly higher than initial garden proposal. Monitor objections.",
      sentiment: "amber",
    },
  },
  {
    title: "Updated Work-Stay Compensation Policy",
    proposer: "Sarah L.",
    forVotes: 67,
    against: 45,
    abstain: 22,
    status: "Under Review",
    desc: "Revise work-stay arrangements to include a stipend increase and flexible hour allocation for skill-based contributions.",
    aiAnalysis: {
      impact: "High Impact",
      insight: "Consent gap flagged — 33% against exceeds 20% threshold. Objection may be paramount.",
      sentiment: "red",
    },
  },
  {
    title: "Quiet Hours Extension to 10pm",
    proposer: "Ben M.",
    forVotes: 156,
    against: 8,
    abstain: 4,
    status: "Open",
    desc: "Move quiet hours start time from 11pm to 10pm across all residential zones to improve rest quality for early-shift volunteers.",
    aiAnalysis: {
      impact: "Low Impact",
      insight: "No objections flagged in community chat. Strong candidate for lazy consensus.",
      sentiment: "green",
    },
  },
  {
    title: "Village Marketplace Launch",
    proposer: "Anika P.",
    forVotes: 112,
    against: 28,
    abstain: 15,
    status: "Open",
    desc: "Open a weekly Saturday marketplace for residents and local artisans, with 10% proceeds funding community events.",
    aiAnalysis: {
      impact: "Medium Impact",
      insight: "High engagement in comment thread. 3 domain experts have endorsed the proposal.",
      sentiment: "green",
    },
  },
  {
    title: "Emergency Fund Increase to $50K",
    proposer: "James W.",
    forVotes: 134,
    against: 12,
    abstain: 6,
    status: "Under Review",
    desc: "Raise the community emergency reserve from $30K to $50K to cover two months of critical operations during unforeseen events.",
    aiAnalysis: {
      impact: "High Impact",
      insight: "Finance committee advice sought and incorporated. Objection risk is low per pattern analysis.",
      sentiment: "green",
    },
  },
];

const proposalHistory = [
  { title: "Sauna Operating Hours Change", outcome: "Passed", date: "Mar 28, 2026", participation: 82, margin: "+74%" },
  { title: "Composting Facility Upgrade", outcome: "Passed", date: "Mar 15, 2026", participation: 79, margin: "+61%" },
  { title: "Guest Policy Amendment", outcome: "Passed", date: "Mar 2, 2026", participation: 85, margin: "+52%" },
  { title: "Alcohol on Common Grounds", outcome: "Rejected", date: "Feb 22, 2026", participation: 91, margin: "-28%" },
  { title: "Pet Limit Increase to 3", outcome: "Rejected", date: "Feb 10, 2026", participation: 88, margin: "-12%" },
  { title: "Solar Battery Expansion", outcome: "Passed", date: "Jan 30, 2026", participation: 76, margin: "+68%" },
  { title: "Tool Library Membership Fee", outcome: "Withdrawn", date: "Jan 18, 2026", participation: 45, margin: "—" },
  { title: "Coworking Space Booking System", outcome: "Passed", date: "Jan 5, 2026", participation: 80, margin: "+71%" },
  { title: "Winter Road Maintenance Budget", outcome: "Passed", date: "Dec 20, 2025", participation: 83, margin: "+88%" },
  { title: "Noise Bylaw Amendment", outcome: "Passed", date: "Dec 8, 2025", participation: 90, margin: "+56%" },
  { title: "Vehicle Parking Reallocation", outcome: "Rejected", date: "Nov 25, 2025", participation: 74, margin: "-8%" },
  { title: "Community Kitchen Renovation", outcome: "Passed", date: "Nov 12, 2025", participation: 86, margin: "+77%" },
  { title: "Monthly Potluck Mandate", outcome: "Passed", date: "Oct 30, 2025", participation: 72, margin: "+64%" },
  { title: "Fireworks Ban — Year-round", outcome: "Passed", date: "Oct 15, 2025", participation: 93, margin: "+82%" },
];

const disputes = [
  { caseNo: "2026-014", parties: "Resident A vs Resident B", mediator: "Sarah Lindqvist", status: "In Mediation", priority: "Medium", daysOpen: 8, desc: "Noise complaint near Cabin 4" },
  { caseNo: "2026-012", parties: "Resident C vs Resident D", mediator: "James Whittaker", status: "In Mediation", priority: "Low", daysOpen: 14, desc: "Shared tool damage dispute" },
  { caseNo: "2026-015", parties: "Resident E vs Resident F", mediator: "Elena Vasquez", status: "Filed", priority: "Medium", daysOpen: 3, desc: "Garden boundary disagreement" },
  { caseNo: "2026-011", parties: "Resident G vs Community", mediator: "Ben Morrison", status: "Resolved", priority: "Low", daysOpen: 21, desc: "Pet policy violation" },
];

const agreements = [
  { category: "Safety", title: "Quiet Hours Policy", adopted: "Jun 2024", reviewed: "Jan 2026" },
  { category: "Community", title: "Pet Policy", adopted: "Aug 2024", reviewed: "Mar 2026" },
  { category: "Operations", title: "Tool Sharing Protocol", adopted: "Sep 2024", reviewed: "Dec 2025" },
  { category: "Community", title: "Guest Guidelines", adopted: "Jun 2024", reviewed: "Feb 2026" },
  { category: "Safety", title: "Fire Safety Plan", adopted: "May 2024", reviewed: "Nov 2025" },
  { category: "Environment", title: "Water Conservation Rules", adopted: "Jul 2024", reviewed: "Jan 2026" },
  { category: "Environment", title: "Waste Management Protocol", adopted: "Jul 2024", reviewed: "Oct 2025" },
  { category: "Operations", title: "Conflict Resolution Process", adopted: "Jun 2024", reviewed: "Mar 2026" },
  { category: "Community", title: "Membership Code of Conduct", adopted: "May 2024", reviewed: "Feb 2026" },
  { category: "Operations", title: "Building Standards", adopted: "Aug 2024", reviewed: "Dec 2025" },
  { category: "Environment", title: "Land Use Agreement", adopted: "May 2024", reviewed: "Jan 2026" },
];

const govMetrics = [
  { label: "Total Votes Cast", value: "1,847", icon: ChartBar },
  { label: "Active Agreements", value: "11", icon: ShieldCheck },
  { label: "Disputes Resolved This Year", value: "8", icon: Gavel },
  { label: "Community Satisfaction", value: "91%", icon: ThumbsUp },
];

const governanceModels = [
  {
    name: "Consent Decision-Making",
    desc: "A proposal passes unless someone raises a paramount objection. Focuses on 'good enough for now, safe to try'.",
    badge: "Active",
    badgeStyle: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    cardStyle: "border-emerald-500/20 bg-emerald-500/[0.04]",
    icon: Scales,
    iconStyle: "bg-emerald-500/15 text-emerald-400",
  },
  {
    name: "Advice Process",
    desc: "Anyone can make a decision after seeking advice from affected parties and domain experts. No approval needed.",
    badge: "Available",
    badgeStyle: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    cardStyle: "border-white/[0.06] bg-white/[0.04]",
    icon: ChatsCircle,
    iconStyle: "bg-blue-500/15 text-blue-400",
  },
  {
    name: "Lazy Consensus",
    desc: "Proposals posted to the community for 72 hours. Silence = consent. Used for low-stakes decisions.",
    badge: "Available",
    badgeStyle: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    cardStyle: "border-white/[0.06] bg-white/[0.04]",
    icon: Clock,
    iconStyle: "bg-blue-500/15 text-blue-400",
  },
];

const aiSuggestedPrompts = [
  "Summarize active proposals",
  "Which proposals have the highest conflict risk?",
  "What's our consent rate trend?",
];

const aiMessages = [
  {
    role: "user",
    text: "Summarize active proposals",
  },
  {
    role: "ai",
    text: "There are 6 active proposals this cycle. The strongest consent signal is on Quiet Hours Extension (94% for) — this is a candidate for lazy consensus resolution. The highest conflict risk is Updated Work-Stay Compensation Policy, where the against-vote rate exceeds the 20% paramount objection threshold. Solar Array Expansion has strong historical precedent and is likely to pass without objections.",
  },
  {
    role: "user",
    text: "What's our consent rate trend?",
  },
  {
    role: "ai",
    text: "Your consent rate has held at 83–87% over the last 3 quarters — a healthy signal for a community of this size. The slight dip in Q1 2026 correlates with the two compensation-related proposals, which typically generate more structured objections. No systemic governance issues detected. Recommend reviewing objection patterns for policy proposals specifically.",
  },
];

/* ── Helpers ─────────────────────────────────────────────────────── */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const proposalStatusBadge: Record<string, string> = {
  Open: "bg-emerald-500/15 text-emerald-400",
  "Under Review": "bg-amber/15 text-amber",
};

const outcomeBadge: Record<string, string> = {
  Passed: "bg-emerald-500/15 text-emerald-400",
  Rejected: "bg-red-500/15 text-red-400",
  Withdrawn: "bg-white/10 text-white/50",
};

const disputeStatusBadge: Record<string, string> = {
  Filed: "bg-blue-500/15 text-blue-400",
  "In Mediation": "bg-amber/15 text-amber",
  Resolved: "bg-emerald-500/15 text-emerald-400",
};

const disputePriorityBadge: Record<string, string> = {
  High: "bg-red-500/15 text-red-400",
  Medium: "bg-amber/15 text-amber",
  Low: "bg-white/10 text-white/50",
};

const agreementCatBadge: Record<string, string> = {
  Safety: "bg-red-500/15 text-red-400",
  Community: "bg-blue-500/15 text-blue-400",
  Environment: "bg-emerald-500/15 text-emerald-400",
  Operations: "bg-amber/15 text-amber",
};

const sentimentDot: Record<string, string> = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("");
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
          Governance &amp; <span className="italic">Resolution</span>
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Proposals, voting, disputes, and community agreements
        </p>
      </div>

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
          </motion.div>
        ))}
      </motion.div>

      {/* Governance Toolkit + AI Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-5 xl:gap-6"
      >
        {/* Governance Toolkit — 3 cols */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={14} weight="fill" className="text-white/40" />
            <h2 className="text-sm font-medium text-white">Governance Toolkit</h2>
            <span className="ml-auto text-[10px] text-white/30">Active model highlighted</span>
          </div>
          {governanceModels.map((m) => (
            <div
              key={m.name}
              className={`rounded-2xl border p-4 flex items-start gap-4 ${m.cardStyle}`}
            >
              <div className={`shrink-0 rounded-xl p-2.5 ${m.iconStyle.split(" ").slice(0, 1).join(" ")}`}>
                <m.icon size={18} weight="fill" className={m.iconStyle.split(" ").slice(1).join(" ")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-medium text-white/80">{m.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${m.badgeStyle}`}>{m.badge}</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Governance Assistant — 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0a0812] flex flex-col overflow-hidden" style={{ minHeight: 340 }}>
          {/* Panel header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]">
            <div className="rounded-lg bg-violet-500/20 p-1.5">
              <Robot size={13} weight="fill" className="text-violet-400" />
            </div>
            <span className="text-xs font-medium text-white/70">AI Governance Assistant</span>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
            </span>
          </div>

          {/* Suggested prompts */}
          <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5">
            {aiSuggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-[10px] text-violet-300 hover:bg-violet-500/20 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat thread */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
            {aiMessages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-violet-500/20 border border-violet-500/20 px-3 py-2 max-w-[85%]">
                    <p className="text-[11px] text-violet-200 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2">
                  <div className="shrink-0 mt-0.5 rounded-full bg-violet-500/20 p-1">
                    <Robot size={10} weight="fill" className="text-violet-400" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/[0.06] px-3 py-2 max-w-[90%]">
                    <p className="text-[11px] text-white/60 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              <input
                type="text"
                placeholder="Ask about proposals, trends, or conflicts…"
                className="flex-1 bg-transparent text-[11px] text-white/50 placeholder:text-white/20 outline-none"
                readOnly
              />
              <button className="shrink-0 rounded-lg bg-violet-500/20 p-1.5 text-violet-400">
                <ArrowRight size={11} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Proposals */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
        <h2 className="text-sm font-medium text-white mb-4">Active Proposals</h2>
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {proposals.map((p) => {
            const total = p.forVotes + p.against + p.abstain;
            const forPct = Math.round((p.forVotes / total) * 100);
            const againstPct = Math.round((p.against / total) * 100);
            return (
              <motion.div key={p.title} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-medium text-white leading-snug pr-3">{p.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${proposalStatusBadge[p.status]}`}>{p.status}</span>
                </div>
                {/* Proposer */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber/15 text-[9px] font-semibold text-amber">
                    {initials(p.proposer)}
                  </div>
                  <span className="text-xs text-white/40">{p.proposer}</span>
                </div>
                {/* Description */}
                <p className="text-xs text-white/30 leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
                {/* Vote bar */}
                <div className="h-2 rounded-full overflow-hidden flex mb-2">
                  <div className="h-full bg-emerald-500/70" style={{ width: `${forPct}%` }} />
                  <div className="h-full bg-red-500/70" style={{ width: `${againstPct}%` }} />
                  <div className="h-full bg-white/10 flex-1" />
                </div>
                {/* Vote counts */}
                <div className="flex items-center gap-3 text-[10px] mb-3">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle size={10} weight="fill" /> {p.forVotes} For
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <XCircle size={10} weight="fill" /> {p.against} Against
                  </span>
                  <span className="flex items-center gap-1 text-white/30">
                    <Minus size={10} weight="bold" /> {p.abstain} Abstain
                  </span>
                </div>
                {/* AI Analysis chip */}
                <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.07] px-3 py-2 flex items-start gap-2">
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    <Sparkle size={10} weight="fill" className="text-violet-400" />
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${sentimentDot[p.aiAnalysis.sentiment]}`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-medium text-violet-300 mr-1.5">{p.aiAnalysis.impact}</span>
                    <span className="text-[10px] text-white/35 leading-relaxed">{p.aiAnalysis.insight}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Proposal History */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Proposal History</h2>
        <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-xs uppercase text-white/30 border-b border-white/[0.06]">
                <th className="py-2.5 text-left font-medium">Title</th>
                <th className="py-2.5 text-left font-medium">Outcome</th>
                <th className="py-2.5 text-left font-medium">Date</th>
                <th className="py-2.5 text-right font-medium">Participation</th>
                <th className="py-2.5 text-right font-medium">Margin</th>
              </tr>
            </thead>
            <tbody>
              {proposalHistory.map((h, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 text-xs text-white/70">{h.title}</td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${outcomeBadge[h.outcome]}`}>{h.outcome}</span>
                  </td>
                  <td className="py-2.5 text-xs text-white/40">{h.date}</td>
                  <td className="py-2.5 text-xs text-white/50 text-right">{h.participation}%</td>
                  <td className="py-2.5 text-xs text-right">
                    <span className={h.margin.startsWith("+") ? "text-emerald-400" : h.margin.startsWith("-") ? "text-red-400" : "text-white/30"}>
                      {h.margin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Dispute Resolution + Community Agreements */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-6">
        {/* Dispute Resolution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <h2 className="text-sm font-medium text-white mb-4">Dispute Resolution</h2>
          <div className="space-y-3">
            {disputes.map((d) => (
              <div key={d.caseNo} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white/60">#{d.caseNo}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${disputeStatusBadge[d.status]}`}>{d.status}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${disputePriorityBadge[d.priority]}`}>{d.priority}</span>
                  </div>
                  <span className="text-[10px] text-white/25">{d.daysOpen} days open</span>
                </div>
                <p className="text-xs text-white/70 mb-2">{d.desc}</p>
                <div className="flex items-center justify-between text-[10px] text-white/30">
                  <span>{d.parties}</span>
                  <span>Mediator: {d.mediator}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Community Agreements */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Community Agreements</h2>
            <span className="text-xs text-white/30">{agreements.length} ratified</span>
          </div>
          <div className="space-y-0 max-h-[440px] overflow-y-auto">
            {agreements.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors px-1">
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ${agreementCatBadge[a.category]}`}>
                  {a.category}
                </span>
                <span className="flex-1 text-xs text-white/70 truncate">{a.title}</span>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] text-white/30">Adopted {a.adopted}</p>
                  <p className="text-[10px] text-white/20">Reviewed {a.reviewed}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Governance Stats */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {govMetrics.map((m) => (
          <motion.div key={m.label} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber/10">
              <m.icon size={18} weight="fill" className="text-amber" />
            </div>
            <div className="text-xl font-semibold text-white lg:text-2xl">{m.value}</div>
            <p className="mt-1 text-xs text-white/40">{m.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Scales, Handshake, FileText, ChartBar,
  CheckCircle, XCircle, Minus, Clock,
  ShieldCheck, Users, Gavel, ThumbsUp,
  CalendarBlank, ArrowRight,
} from "@phosphor-icons/react";

/* ── Inline data ───────────────────────────────────────────────────── */

const stats = [
  { label: "Participation Rate", value: "78%", icon: Users },
  { label: "Avg Resolution", value: "4.2 days", icon: Clock },
  { label: "Proposals This Quarter", value: "12", icon: FileText },
  { label: "Consent Rate", value: "85%", icon: ThumbsUp },
];

const proposals = [
  { title: "Solar Array Expansion — Phase 2", proposer: "Elena V.", forVotes: 142, against: 18, abstain: 12, status: "Open", desc: "Expand the existing solar installation with 40 additional panels to reach 90% energy self-sufficiency by Q4 2026." },
  { title: "Community Garden Expansion to Plot D", proposer: "Marcus C.", forVotes: 98, against: 34, abstain: 8, status: "Open", desc: "Clear and prepare the southeastern plot for 12 additional raised beds with drip irrigation and companion planting zones." },
  { title: "Updated Work-Stay Compensation Policy", proposer: "Sarah L.", forVotes: 67, against: 45, abstain: 22, status: "Under Review", desc: "Revise work-stay arrangements to include a stipend increase and flexible hour allocation for skill-based contributions." },
  { title: "Quiet Hours Extension to 10pm", proposer: "Ben M.", forVotes: 156, against: 8, abstain: 4, status: "Open", desc: "Move quiet hours start time from 11pm to 10pm across all residential zones to improve rest quality for early-shift volunteers." },
  { title: "Village Marketplace Launch", proposer: "Anika P.", forVotes: 112, against: 28, abstain: 15, status: "Open", desc: "Open a weekly Saturday marketplace for residents and local artisans, with 10% proceeds funding community events." },
  { title: "Emergency Fund Increase to $50K", proposer: "James W.", forVotes: 134, against: 12, abstain: 6, status: "Under Review", desc: "Raise the community emergency reserve from $30K to $50K to cover two months of critical operations during unforeseen events." },
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
                <div className="flex items-center gap-3 text-[10px]">
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
            <thead className="sticky top-0 bg-[#0F0D14]">
              <tr className="text-xs uppercase text-white/30">
                <th className="pb-3 text-left font-medium">Title</th>
                <th className="pb-3 text-left font-medium">Outcome</th>
                <th className="pb-3 text-left font-medium">Date</th>
                <th className="pb-3 text-right font-medium">Participation</th>
                <th className="pb-3 text-right font-medium">Margin</th>
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

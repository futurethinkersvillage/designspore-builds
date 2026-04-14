"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scales, FileText, ChartBar,
  CheckCircle, XCircle, Minus, Clock,
  ShieldCheck, Users, Gavel, ThumbsUp,
  Sparkle, Brain, ChatsCircle,
  Warning, CaretRight, Hourglass,
  FloppyDisk, BellRinging, GitMerge, Check,
} from "@phosphor-icons/react";

/* ── Existing data ─────────────────────────────────────────────────── */

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
    forVotes: 142, against: 18, abstain: 12,
    status: "Open",
    desc: "Expand the existing solar installation with 40 additional panels to reach 90% energy self-sufficiency by Q4 2026.",
    aiAnalysis: { impact: "High Impact", insight: "Similar to Solar Battery Expansion (Jan '26) which passed 68%. Strong precedent.", sentiment: "green" },
  },
  {
    title: "Community Garden Expansion to Plot D",
    proposer: "Marcus C.",
    forVotes: 98, against: 34, abstain: 8,
    status: "Open",
    desc: "Clear and prepare the southeastern plot for 12 additional raised beds with drip irrigation and companion planting zones.",
    aiAnalysis: { impact: "Medium Impact", insight: "Against votes cluster around water usage and workload allocation.", sentiment: "amber" },
    amendmentSuggestion: {
      cluster: "water usage and workload allocation",
      draft: "Limit initial expansion to 6 beds in Phase 1, with Phase 2 conditional on a community water audit completing before June 2026. Assign a 2-person maintenance crew with rotating membership.",
    },
  },
  {
    title: "Updated Work-Stay Compensation Policy",
    proposer: "Sarah L.",
    forVotes: 67, against: 45, abstain: 22,
    status: "Integration Round",
    desc: "Revise work-stay arrangements to include a stipend increase and flexible hour allocation for skill-based contributions.",
    aiAnalysis: { impact: "High Impact", insight: "Consent gap flagged — 33% against exceeds 20% threshold. Objection may be paramount.", sentiment: "red" },
    integration: {
      objector: "James W.",
      objection: "The flat stipend increase does not account for skill levels — unskilled labour would be compensated the same as licensed trades, which creates inequity and budget risk.",
      proposerIntent: "Make work-stay more attractive and fair by recognising that skill-based contributions currently go undercompensated.",
      amendments: [
        { id: "a1", text: "Introduce a 3-tier skill rate: General (current), Skilled Trade (1.4x), Licensed Professional (1.8x). Budget ceiling stays unchanged via hour reallocation." },
        { id: "a2", text: "Keep flat stipend but add a quarterly skill-recognition bonus funded from marketplace proceeds, reviewed by the finance committee." },
        { id: "a3", text: "Split into two proposals — one for general work-stay (quick pass), one for skilled compensation (longer consultation)." },
      ],
    },
  },
  {
    title: "Quiet Hours Extension to 10pm",
    proposer: "Ben M.",
    forVotes: 156, against: 8, abstain: 4,
    status: "Open",
    desc: "Move quiet hours start time from 11pm to 10pm across all residential zones to improve rest quality for early-shift volunteers.",
    aiAnalysis: { impact: "Low Impact", insight: "94% consent signal. No objections in community chat. Candidate for lazy consensus fast-track.", sentiment: "green" },
  },
  {
    title: "Village Marketplace Launch",
    proposer: "Anika P.",
    forVotes: 112, against: 28, abstain: 15,
    status: "Open",
    desc: "Open a weekly Saturday marketplace for residents and local artisans, with 10% proceeds funding community events.",
    aiAnalysis: { impact: "Medium Impact", insight: "High engagement in comment thread. 3 domain experts have endorsed the proposal.", sentiment: "green" },
  },
  {
    title: "Emergency Fund Increase to $50K",
    proposer: "James W.",
    forVotes: 134, against: 12, abstain: 6,
    status: "Open",
    desc: "Raise the community emergency reserve from $30K to $50K to cover two months of critical operations during unforeseen events.",
    aiAnalysis: { impact: "High Impact", insight: "Finance committee advice sought and incorporated. Objection risk is low per pattern analysis.", sentiment: "green" },
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

/* ── AI Delegate data ─────────────────────────────────────────────── */

const myValueProfile = [
  { label: "Environmental Stewardship", score: 92 },
  { label: "Inclusive Community", score: 88 },
  { label: "Economic Fairness", score: 85 },
  { label: "Privacy & Autonomy", score: 78 },
  { label: "Transparency", score: 70 },
];

const delegateCandidates = [
  { name: "Elena Vasquez", avatar: "EV", role: "Operations Lead", alignment: 91 },
  { name: "Priya Mehta", avatar: "PM", role: "Farm Lead", alignment: 87 },
  { name: "Marcus Chen", avatar: "MC", role: "Community Circle", alignment: 82 },
  { name: "Sarah Lindqvist", avatar: "SL", role: "Steward", alignment: 79 },
];

const myPendingProposals = [
  {
    title: "Solar Array Expansion — Phase 2",
    proposer: "Elena V.",
    aiRecommendation: "consent" as const,
    aiReasoning: "Aligns with your Environmental Stewardship value (92%). Moving village to 90% self-sufficiency directly matches the energy goal you endorsed in onboarding. Precedent: Solar Battery Expansion (Jan '26) passed 68% with no integration issues.",
    forPct: 89, againstPct: 8,
  },
  {
    title: "Community Garden Expansion to Plot D",
    proposer: "Marcus C.",
    aiRecommendation: "abstain" as const,
    aiReasoning: "Mixed signal. Environmental Stewardship (92%) supports expansion, but 25% against cluster around water usage — a resource concern that aligns with values you hold. Abstaining lets the community resolve the water issue before committing.",
    forPct: 71, againstPct: 25,
  },
  {
    title: "Emergency Fund Increase to $50K",
    proposer: "James W.",
    aiRecommendation: "consent" as const,
    aiReasoning: "Strong alignment with Transparency and Economic Fairness values. Finance committee advice was incorporated. Raising reserve to $50K improves community resilience — consistent with your preference for security over short-term surplus distribution.",
    forPct: 88, againstPct: 8,
  },
];

/* ── Toolkit data ──────────────────────────────────────────────────── */

const toolkitTabs = [
  {
    key: "consent",
    label: "Consent Decision-Making",
    badge: "Active",
    badgeStyle: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    icon: Scales,
    desc: "A proposal passes unless someone raises a paramount objection — 'good enough for now, safe to try'. Objections must identify a specific harm, not just a preference.",
  },
  {
    key: "advice",
    label: "Advice Process",
    badge: "Available",
    badgeStyle: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    icon: ChatsCircle,
    desc: "Anyone can make a decision after seeking advice from affected parties and domain experts. No approval vote needed — just documented consultation.",
  },
  {
    key: "lazy",
    label: "Lazy Consensus",
    badge: "Available",
    badgeStyle: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    icon: Hourglass,
    desc: "Low-stakes proposals posted for 72 hours. Silence equals consent. Anyone can raise a concern to pause and trigger a full consent round.",
  },
];

const adviceConsultees = [
  { name: "Priya M.", role: "Farm Lead", status: "Responded", advice: "Supports the upgrade but recommends the Jora 400 model — handles our winter temps better. Budget allows for it.", avatar: "PM" },
  { name: "James W.", role: "Treasurer", status: "Responded", advice: "Budget is available in Q2 operations fund. Flag it before month-end so it appears in the next board summary.", avatar: "JW" },
  { name: "Elena V.", role: "Operations", status: "Pending", advice: null, avatar: "EV" },
];

const lazyItems = [
  { title: "Add recycling bins to the main lodge entrance", proposer: "Anika P.", hoursLeft: 68, total: 72, concerns: 0 },
  { title: "Move Tuesday community dinner to 6:30pm", proposer: "Marcus C.", hoursLeft: 24, total: 72, concerns: 1 },
  { title: "Install a whiteboard in the coworking space", proposer: "Ben M.", hoursLeft: 4, total: 72, concerns: 0 },
];

/* ── Helpers ───────────────────────────────────────────────────────── */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

const proposalStatusBadge: Record<string, string> = {
  Open: "bg-emerald-500/15 text-emerald-400",
  "Under Review": "bg-amber/15 text-amber",
  "Integration Round": "bg-orange-500/15 text-orange-400",
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

/* ── Toolkit components ────────────────────────────────────────────── */

function ConsentDemo() {
  const [vote, setVote] = useState<null | "consent" | "abstain" | "object">(null);
  const [objStep, setObjStep] = useState(0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-medium text-white/80">Quiet Hours Extension to 10pm</p>
            <p className="text-[11px] text-white/35 mt-0.5">Proposed by Ben M. · Closes in 38 hrs</p>
          </div>
          <span className="rounded-full px-2 py-0.5 text-[10px] bg-emerald-500/15 text-emerald-400">Open</span>
        </div>
        <p className="text-[11px] text-white/40 leading-relaxed mb-3">
          Move quiet hours start time from 11pm to 10pm across all residential zones.
        </p>
        <div className="h-1.5 rounded-full overflow-hidden flex mb-2">
          <div className="h-full bg-emerald-500/60" style={{ width: "93%" }} />
          <div className="h-full bg-red-500/60" style={{ width: "5%" }} />
          <div className="h-full bg-white/10 flex-1" />
        </div>
        <div className="flex gap-3 text-[10px] mb-4">
          <span className="text-emerald-400">156 Consent</span>
          <span className="text-red-400">8 Object</span>
          <span className="text-white/30">4 Abstain</span>
        </div>
        {vote === null && (
          <div className="flex gap-2">
            <button onClick={() => setVote("consent")} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors">
              <CheckCircle size={13} weight="fill" /> Consent
            </button>
            <button onClick={() => setVote("abstain")} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-[11px] font-medium text-white/40 hover:bg-white/[0.07] transition-colors">
              <Minus size={13} weight="bold" /> Abstain
            </button>
            <button onClick={() => { setVote("object"); setObjStep(1); }} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 py-2 text-[11px] font-medium text-orange-400 hover:bg-orange-500/20 transition-colors">
              <Warning size={13} weight="fill" /> Object
            </button>
          </div>
        )}
        {vote === "consent" && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2">
            <CheckCircle size={14} weight="fill" className="text-emerald-400 shrink-0" />
            <p className="text-[11px] text-emerald-300">Your consent is recorded. Proposal now at 94% — strong candidate for early resolution.</p>
          </div>
        )}
        {vote === "abstain" && (
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
            <Minus size={14} weight="bold" className="text-white/40 shrink-0" />
            <p className="text-[11px] text-white/40">Abstention recorded. You will not be counted for or against.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {vote === "object" && objStep > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-orange-500/25 bg-orange-500/[0.07] p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Brain size={12} className="text-orange-400" />
              <span className="text-[11px] font-medium text-orange-300">AI Objection Qualifier</span>
              <span className="text-[10px] text-orange-400/50 ml-auto">Ensures objections identify real harm, not preference</span>
            </div>
            {objStep === 1 && (
              <div>
                <p className="text-[11px] text-white/60 mb-3">Does this cause direct harm to the community or individuals — or is it a personal preference?</p>
                <div className="flex gap-2">
                  <button onClick={() => setObjStep(2)} className="flex-1 rounded-lg border border-orange-500/25 bg-orange-500/10 py-1.5 text-[11px] text-orange-300 hover:bg-orange-500/20 transition-colors">Direct harm</button>
                  <button onClick={() => setObjStep(3)} className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] py-1.5 text-[11px] text-white/40 hover:bg-white/[0.07] transition-colors">Personal preference</button>
                </div>
              </div>
            )}
            {objStep === 2 && (
              <div>
                <p className="text-[11px] text-white/60 mb-3">Which members or domains are specifically affected, and have you spoken with them?</p>
                <textarea className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[11px] text-white/60 placeholder:text-white/20 outline-none resize-none" rows={2} placeholder="Describe who is affected and your prior consultation..." />
                <button onClick={() => setObjStep(4)} className="mt-2 w-full rounded-lg border border-orange-500/30 bg-orange-500/15 py-1.5 text-[11px] font-medium text-orange-300 hover:bg-orange-500/25 transition-colors">Submit Paramount Objection</button>
              </div>
            )}
            {objStep === 3 && (
              <div className="rounded-lg border border-amber/20 bg-amber/[0.07] px-3 py-2.5">
                <p className="text-[11px] text-amber/80 leading-relaxed">This sounds like a preference rather than a paramount objection. Consider leaving a comment on the proposal instead — objections are reserved for harms that prevent the community from moving forward safely.</p>
                <button onClick={() => { setVote(null); setObjStep(0); }} className="mt-2 text-[10px] text-white/30 hover:text-white/50 transition-colors">Go back</button>
              </div>
            )}
            {objStep === 4 && (
              <div className="rounded-lg border border-orange-500/25 bg-orange-500/10 px-3 py-2.5">
                <p className="text-[11px] text-orange-300 font-medium mb-1">Paramount objection filed.</p>
                <p className="text-[10px] text-white/40">This proposal enters an Integration Round. AI will help both parties find an amendment that resolves the harm.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdviceDemo() {
  const [step, setStep] = useState(1);
  const [decisionText, setDecisionText] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${step >= s ? "bg-blue-500/30 text-blue-300" : "bg-white/[0.06] text-white/30"}`}>{s}</div>
            {s < 3 && <div className={`h-px w-8 transition-colors ${step > s ? "bg-blue-500/40" : "bg-white/[0.06]"}`} />}
          </div>
        ))}
        <span className="ml-2 text-[10px] text-white/30">
          {step === 1 ? "Identify who to consult" : step === 2 ? "Gather advice" : "Record your decision"}
        </span>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
        <p className="text-[11px] font-medium text-white/70 mb-0.5">Decision: Purchase a new composting system</p>
        <p className="text-[10px] text-white/30">Maker: Marcus C. · Budget: $3,200 · Affects: Farm, Waste, Operations</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkle size={11} className="text-blue-400" />
              <span className="text-[10px] text-blue-300">AI identified 3 people you should consult</span>
            </div>
            <div className="space-y-2">
              {adviceConsultees.map((c) => (
                <div key={c.name} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-semibold text-blue-300">{c.avatar}</div>
                  <div className="flex-1">
                    <p className="text-[11px] font-medium text-white/70">{c.name}</p>
                    <p className="text-[10px] text-white/30">{c.role}</p>
                  </div>
                  <BellRinging size={13} className="text-blue-400/60 shrink-0" />
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mt-3 w-full rounded-lg border border-blue-500/25 bg-blue-500/10 py-2 text-[11px] font-medium text-blue-300 hover:bg-blue-500/20 transition-colors">
              Notify Consultees
            </button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
            {adviceConsultees.map((c) => (
              <div key={c.name} className={`rounded-xl border p-3 ${c.status === "Responded" ? "border-blue-500/20 bg-blue-500/[0.05]" : "border-white/[0.06] bg-white/[0.03]"}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[9px] font-semibold text-blue-300">{c.avatar}</div>
                  <span className="text-[11px] font-medium text-white/70">{c.name}</span>
                  <span className="text-[10px] text-white/25">· {c.role}</span>
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-medium ${c.status === "Responded" ? "bg-blue-500/15 text-blue-400" : "bg-white/10 text-white/30"}`}>{c.status}</span>
                </div>
                {c.advice
                  ? <p className="text-[11px] text-white/50 leading-relaxed pl-8">{c.advice}</p>
                  : <p className="text-[11px] text-white/25 italic pl-8">Awaiting response...</p>
                }
              </div>
            ))}
            <button onClick={() => setStep(3)} className="w-full rounded-lg border border-blue-500/25 bg-blue-500/10 py-2 text-[11px] font-medium text-blue-300 hover:bg-blue-500/20 transition-colors">
              I have considered all advice
            </button>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {!saved ? (
              <>
                <p className="text-[11px] text-white/40 mb-2">Record your final decision. It will be logged with the advice thread and visible to all members.</p>
                <textarea
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-[11px] text-white/60 placeholder:text-white/20 outline-none resize-none focus:border-blue-500/40 transition-colors"
                  rows={3}
                  placeholder="I will purchase the Jora 400 composter for $3,100. Following Priya's model recommendation and James's budget confirmation..."
                  value={decisionText}
                  onChange={(e) => setDecisionText(e.target.value)}
                />
                <button onClick={() => setSaved(true)} className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/15 py-2 text-[11px] font-medium text-blue-300 hover:bg-blue-500/25 transition-colors">
                  <FloppyDisk size={12} weight="fill" /> Record Decision
                </button>
              </>
            ) : (
              <div className="rounded-xl border border-blue-500/25 bg-blue-500/[0.08] px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={13} weight="fill" className="text-blue-400" />
                  <span className="text-[11px] font-medium text-blue-300">Decision recorded and logged</span>
                </div>
                <p className="text-[10px] text-white/35">Members can view the full advice thread and your decision in governance history. No vote needed.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LazyDemo() {
  const [raised, setRaised] = useState<number[]>([]);

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-white/35 leading-relaxed mb-3">
        These proposals are in silent review. Silence equals consent at the deadline. Raise a concern to pause and trigger a full consent round.
      </p>
      {lazyItems.map((p, i) => {
        const pct = ((p.total - p.hoursLeft) / p.total) * 100;
        const isRaised = raised.includes(i);
        const isAlmostDone = p.hoursLeft <= 6;
        return (
          <div key={i} className={`rounded-xl border p-3.5 transition-colors ${isRaised ? "border-orange-500/25 bg-orange-500/[0.06]" : isAlmostDone ? "border-violet-500/25 bg-violet-500/[0.06]" : "border-white/[0.06] bg-white/[0.03]"}`}>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-[11px] font-medium text-white/75 leading-snug">{p.title}</p>
              {isAlmostDone && !isRaised && (
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] bg-violet-500/20 text-violet-300 border border-violet-500/20">Closing soon</span>
              )}
              {isRaised && (
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] bg-orange-500/20 text-orange-300 border border-orange-500/20">Paused</span>
              )}
            </div>
            <p className="text-[10px] text-white/30 mb-2">by {p.proposer}</p>
            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden mb-1.5">
              <div className={`h-full rounded-full transition-all ${isRaised ? "bg-orange-500/50" : isAlmostDone ? "bg-violet-500/60" : "bg-violet-500/40"}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/25">
                {isRaised ? "Paused — entering consent round" : `${p.hoursLeft}h remaining · ${p.concerns} concern${p.concerns !== 1 ? "s" : ""}`}
              </span>
              {!isRaised && (
                <button onClick={() => setRaised([...raised, i])} className="text-[10px] text-orange-400/70 hover:text-orange-400 transition-colors border border-orange-500/20 rounded-lg px-2 py-0.5 hover:bg-orange-500/10">
                  Raise concern
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IntegrationRound({ proposal }: { proposal: typeof proposals[number] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  if (!proposal.integration) return null;
  const { integration } = proposal;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.05] p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="rounded-xl bg-orange-500/15 p-2">
          <GitMerge size={16} weight="fill" className="text-orange-400" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-white">Integration Round</h2>
          <p className="text-[11px] text-white/35">An objection has been raised — AI is facilitating a resolution</p>
        </div>
        <span className="ml-auto rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-1 text-[10px] font-medium text-orange-300">Active</span>
      </div>

      <p className="text-xs font-medium text-white/60 mb-3">{proposal.title}</p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mb-4">
        <div className="rounded-xl border border-blue-500/15 bg-blue-500/[0.06] p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[9px] font-semibold text-blue-300">SL</div>
            <span className="text-[10px] font-medium text-blue-300">Proposer Intent</span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed">{integration.proposerIntent}</p>
        </div>
        <div className="rounded-xl border border-orange-500/15 bg-orange-500/[0.06] p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[9px] font-semibold text-orange-300">JW</div>
            <span className="text-[10px] font-medium text-orange-300">Objector Concern · {integration.objector}</span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed">{integration.objection}</p>
        </div>
      </div>

      {!confirmed ? (
        <>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkle size={11} weight="fill" className="text-violet-400" />
            <span className="text-[11px] font-medium text-violet-300">3 AI-drafted amendments — select the one that resolves the concern</span>
          </div>
          <div className="space-y-2 mb-3">
            {integration.amendments.map((a) => (
              <button key={a.id} onClick={() => setSelected(a.id)} className={`w-full text-left rounded-xl border p-3 transition-all ${selected === a.id ? "border-violet-500/40 bg-violet-500/10" : "border-white/[0.06] bg-white/[0.03] hover:border-violet-500/20 hover:bg-violet-500/[0.04]"}`}>
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 h-3.5 w-3.5 rounded-full border shrink-0 flex items-center justify-center ${selected === a.id ? "border-violet-500 bg-violet-500" : "border-white/20"}`}>
                    {selected === a.id && <Check size={8} weight="bold" className="text-white" />}
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">{a.text}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button disabled={!selected} onClick={() => setConfirmed(true)} className="flex-1 rounded-xl border border-violet-500/30 bg-violet-500/15 py-2 text-[11px] font-medium text-violet-300 disabled:opacity-30 hover:bg-violet-500/25 transition-all">
              Adopt Amendment
            </button>
            <button className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[11px] text-white/40 hover:bg-white/[0.07] transition-colors">
              Request Mediation
            </button>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-violet-500/25 bg-violet-500/[0.08] px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={13} weight="fill" className="text-violet-400" />
            <span className="text-[11px] font-medium text-violet-300">Amendment adopted — proposal re-enters consent round</span>
          </div>
          <p className="text-[10px] text-white/35">James W. has been notified. If the objection is resolved, the proposal will pass in the next 24-hour window.</p>
        </motion.div>
      )}
    </motion.div>
  );
}

function AmendmentSuggester({ proposal }: { proposal: typeof proposals[number] }) {
  const [open, setOpen] = useState(false);
  const [adopted, setAdopted] = useState(false);
  if (!proposal.amendmentSuggestion) return null;
  const s = proposal.amendmentSuggestion;
  const total = proposal.forVotes + proposal.against + proposal.abstain;
  const againstPct = Math.round((proposal.against / total) * 100);

  return (
    <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.06] mt-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-3 py-2 text-left">
        <Sparkle size={10} weight="fill" className="text-violet-400 shrink-0" />
        <span className="text-[10px] font-medium text-violet-300 flex-1">
          {adopted ? "Amendment adopted" : `${againstPct}% against — AI has a suggested amendment`}
        </span>
        <CaretRight size={10} className={`text-violet-400/50 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      <AnimatePresence>
        {open && !adopted && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-3 pb-3 space-y-2">
              <p className="text-[10px] text-white/35">Against votes cluster around <span className="text-white/50">{s.cluster}</span>. Suggested amendment:</p>
              <div className="rounded-lg border border-violet-500/15 bg-violet-500/[0.08] p-2.5">
                <p className="text-[11px] text-white/55 leading-relaxed">{s.draft}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setAdopted(true); setOpen(false); }} className="flex-1 rounded-lg border border-violet-500/25 bg-violet-500/10 py-1.5 text-[10px] font-medium text-violet-300 hover:bg-violet-500/20 transition-colors">
                  Adopt and Re-submit
                </button>
                <button onClick={() => setOpen(false)} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[10px] text-white/30 hover:bg-white/[0.06] transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {open && adopted && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-3 pb-3">
              <p className="text-[10px] text-violet-300/70">Amendment queued for re-submission. Affected members will be notified.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── AI Delegate components ────────────────────────────────────────── */

function AIDelegate({ p }: { p: typeof myPendingProposals[number] }) {
  const [mode, setMode] = useState<"default" | "vote" | "delegate">("default");
  const [done, setDone] = useState<string | null>(null);

  const recStyles = {
    consent: { border: "border-emerald-500/20 bg-emerald-500/[0.06]", text: "text-emerald-300", icon: "text-emerald-400", label: "Consent" },
    abstain: { border: "border-amber/20 bg-amber/[0.06]", text: "text-amber", icon: "text-amber", label: "Abstain" },
    object: { border: "border-orange-500/20 bg-orange-500/[0.06]", text: "text-orange-300", icon: "text-orange-400", label: "Object" },
  }[p.aiRecommendation];

  if (done) {
    return (
      <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2">
          <CheckCircle size={13} weight="fill" className="text-emerald-400 shrink-0" />
          <span className="text-xs text-white/40 flex-1 truncate">{p.title}</span>
          <span className="text-[10px] text-white/20 shrink-0 ml-2">{done}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-3">
          <p className="text-sm font-medium text-white leading-snug">{p.title}</p>
          <p className="text-xs text-white/35 mt-0.5">Proposed by {p.proposer}</p>
        </div>
        <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] bg-amber/10 text-amber border border-amber/20">Vote needed</span>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden flex mb-1.5">
        <div className="h-full bg-emerald-500/60" style={{ width: `${p.forPct}%` }} />
        <div className="h-full bg-red-500/60" style={{ width: `${p.againstPct}%` }} />
        <div className="h-full bg-white/10 flex-1" />
      </div>
      <div className="flex gap-3 text-[10px] mb-4">
        <span className="text-emerald-400">{p.forPct}% For</span>
        <span className="text-red-400">{p.againstPct}% Against</span>
        <span className="text-white/25">{100 - p.forPct - p.againstPct}% Abstain</span>
      </div>

      <div className={`rounded-xl border p-3 mb-3 ${recStyles.border}`}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Brain size={11} weight="fill" className={recStyles.icon} />
          <span className={`text-[10px] font-medium ${recStyles.text}`}>AI Delegate recommends: {recStyles.label}</span>
        </div>
        <p className="text-[11px] text-white/45 leading-relaxed">{p.aiReasoning}</p>
      </div>

      {mode === "default" && (
        <div className="flex gap-2">
          <button
            onClick={() => setDone(`AI voted: ${recStyles.label}`)}
            className="flex-1 rounded-xl border border-violet-500/25 bg-violet-500/10 py-2 text-[11px] font-medium text-violet-300 hover:bg-violet-500/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkle size={11} weight="fill" /> AI Votes
          </button>
          <button
            onClick={() => setMode("vote")}
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-[11px] font-medium text-white/50 hover:bg-white/[0.07] transition-colors"
          >
            Vote Myself
          </button>
          <button
            onClick={() => setMode("delegate")}
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-[11px] font-medium text-white/50 hover:bg-white/[0.07] transition-colors flex items-center justify-center gap-1.5"
          >
            <Users size={11} /> Delegate
          </button>
        </div>
      )}

      {mode === "vote" && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex gap-2">
              <button onClick={() => setDone("You voted: Consent")} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                <CheckCircle size={12} weight="fill" /> Consent
              </button>
              <button onClick={() => setDone("You voted: Abstain")} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-[11px] font-medium text-white/40 hover:bg-white/[0.07] transition-colors">
                <Minus size={12} weight="bold" /> Abstain
              </button>
              <button onClick={() => setDone("Objection filed")} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 py-2 text-[11px] font-medium text-orange-400 hover:bg-orange-500/20 transition-colors">
                <Warning size={12} weight="fill" /> Object
              </button>
            </div>
            <button onClick={() => setMode("default")} className="w-full text-[10px] text-white/20 hover:text-white/40 transition-colors">Back</button>
          </motion.div>
        </AnimatePresence>
      )}

      {mode === "delegate" && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <p className="text-[10px] text-white/30 mb-2">Delegate to a member with similar values:</p>
            {delegateCandidates.map((c) => (
              <button
                key={c.name}
                onClick={() => setDone(`Delegated to ${c.name}`)}
                className="w-full flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 hover:border-violet-500/25 hover:bg-violet-500/[0.05] transition-colors text-left"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/15 text-[9px] font-semibold text-violet-300 shrink-0">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-white/70">{c.name}</p>
                  <p className="text-[10px] text-white/30">{c.role}</p>
                </div>
                <span className="text-[10px] text-violet-400/70 shrink-0">{c.alignment}% aligned</span>
              </button>
            ))}
            <button onClick={() => setMode("default")} className="w-full text-[10px] text-white/20 hover:text-white/40 transition-colors">Back</button>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function MyGovernanceView() {
  const [showValueEditor, setShowValueEditor] = useState(false);

  return (
    <div className="space-y-6">
      {/* Participation Score + Value Profile */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Score */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 flex flex-col items-center text-center">
          <p className="text-xs text-white/40 mb-3">Participation Integrity</p>
          <div className="relative flex items-center justify-center mb-3">
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
              <circle
                cx="44" cy="44" r="36" fill="none" stroke="rgb(234,130,78)" strokeWidth="7"
                strokeDasharray={`${(76 / 100) * 226.2} 226.2`}
                strokeLinecap="round"
                transform="rotate(-90 44 44)"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-2xl font-bold text-white">76</div>
              <div className="text-[9px] text-white/30">/100</div>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-400 mb-2">+4 this month</span>
          <p className="text-[10px] text-white/25 leading-relaxed">Engagement quality, amendment accuracy, objection relevance</p>
        </div>

        {/* Value Profile */}
        <div className="md:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-white">My Value Profile</h3>
              <p className="text-[11px] text-white/35 mt-0.5">How your AI delegate votes on your behalf</p>
            </div>
            <button
              onClick={() => setShowValueEditor(!showValueEditor)}
              className="text-[10px] text-amber/70 hover:text-amber transition-colors border border-amber/20 rounded-lg px-2.5 py-1 hover:bg-amber/[0.06]"
            >
              {showValueEditor ? "Done" : "Edit Values"}
            </button>
          </div>
          <div className="space-y-3">
            {myValueProfile.map((v) => (
              <div key={v.label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-white/50">{v.label}</span>
                  <span className="text-white/35">{v.score}%</span>
                </div>
                {showValueEditor ? (
                  <input
                    type="range" min={0} max={100} defaultValue={v.score}
                    className="w-full h-1.5 rounded-full cursor-pointer"
                    style={{ accentColor: "#EA824E" }}
                  />
                ) : (
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-amber/60" style={{ width: `${v.score}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Votes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-medium text-white">Proposals Needing Your Vote</h2>
          <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[10px] text-amber border border-amber/20">{myPendingProposals.length}</span>
        </div>
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
          {myPendingProposals.map((p) => (
            <AIDelegate key={p.title} p={p} />
          ))}
        </motion.div>
      </div>

      {/* Community Constitution */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h3 className="text-sm font-medium text-white mb-1">Community Constitution</h3>
        <p className="text-xs text-white/35 mb-4">Ratified values that guide all decisions. AI delegate votes are filtered through these principles.</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Land Stewardship First", desc: "Environmental impact considered in all land-affecting decisions.", category: "Environment" },
            { title: "Transparency by Default", desc: "Finances, decisions, and conflicts are visible to all active members.", category: "Governance" },
            { title: "Minimum Viable Governance", desc: "Use the simplest process that resolves the issue. Avoid bureaucracy.", category: "Process" },
            { title: "Consent Over Consensus", desc: "Proposals pass unless someone identifies a specific harm — not just disagreement.", category: "Process" },
            { title: "Regenerative Economics", desc: "Revenue models must support ecological and social regeneration.", category: "Economy" },
            { title: "Radical Welcome", desc: "The community actively removes barriers to participation for all members.", category: "Community" },
          ].map((pr) => (
            <div key={pr.title} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <div className="flex items-start gap-2">
                <ShieldCheck size={11} className="text-amber/60 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-white/70">{pr.title}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 leading-relaxed">{pr.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [mainView, setMainView] = useState<"my" | "village">("my");
  const integrationProposal = proposals.find((p) => p.status === "Integration Round")!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
            Governance and <span className="italic">Resolution</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">Proposals, voting, disputes, and community agreements</p>
        </div>
        <div className="flex rounded-xl border border-white/[0.06] bg-white/[0.04] p-1 gap-1 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setMainView("my")}
            className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${mainView === "my" ? "bg-amber/15 text-amber" : "text-white/40 hover:text-white/60"}`}
          >
            My Governance
          </button>
          <button
            onClick={() => setMainView("village")}
            className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${mainView === "village" ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/60"}`}
          >
            Village View
          </button>
        </div>
      </div>

      {/* Stats — always visible */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40">{s.label}</span>
              <div className="rounded-lg bg-amber/10 p-1.5"><s.icon size={14} weight="fill" className="text-amber" /></div>
            </div>
            <div className="text-xl font-semibold text-white lg:text-2xl">{s.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* View content */}
      <AnimatePresence mode="wait">
        {mainView === "my" && (
          <motion.div key="my" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <MyGovernanceView />
          </motion.div>
        )}

        {mainView === "village" && (
          <motion.div key="village" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-6">

            {/* Governance Toolkit */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden">
              <div className="flex items-center gap-1 px-5 pt-4 pb-0 border-b border-white/[0.06] overflow-x-auto">
                <div className="flex items-center gap-1.5 mr-3 shrink-0">
                  <Brain size={13} weight="fill" className="text-white/35" />
                  <span className="text-xs font-medium text-white/50">Governance Toolkit</span>
                </div>
                {toolkitTabs.map((tab, i) => {
                  const isActive = activeTab === i;
                  return (
                    <button key={tab.key} onClick={() => setActiveTab(i)}
                      className={`relative flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${isActive ? "text-white" : "text-white/40 hover:text-white/60"}`}>
                      <tab.icon size={13} weight={isActive ? "fill" : "regular"} />
                      {tab.label}
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${tab.badgeStyle}`}>{tab.badge}</span>
                      {isActive && (
                        <motion.div layoutId="toolkit-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber rounded-full" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="p-5">
                <p className="text-xs text-white/40 leading-relaxed mb-4 max-w-2xl">{toolkitTabs[activeTab].desc}</p>
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    {activeTab === 0 && <ConsentDemo />}
                    {activeTab === 1 && <AdviceDemo />}
                    {activeTab === 2 && <LazyDemo />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            <IntegrationRound proposal={integrationProposal} />

            {/* Active Proposals */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <h2 className="text-sm font-medium text-white mb-4">Active Proposals</h2>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {proposals.filter((p) => p.status !== "Integration Round").map((p) => {
                  const total = p.forVotes + p.against + p.abstain;
                  const forPct = Math.round((p.forVotes / total) * 100);
                  const againstPct = Math.round((p.against / total) * 100);
                  return (
                    <motion.div key={p.title} variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-medium text-white leading-snug pr-3">{p.title}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${proposalStatusBadge[p.status]}`}>{p.status}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber/15 text-[9px] font-semibold text-amber">{initials(p.proposer)}</div>
                        <span className="text-xs text-white/40">{p.proposer}</span>
                      </div>
                      <p className="text-xs text-white/30 leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
                      <div className="h-2 rounded-full overflow-hidden flex mb-2">
                        <div className="h-full bg-emerald-500/70" style={{ width: `${forPct}%` }} />
                        <div className="h-full bg-red-500/70" style={{ width: `${againstPct}%` }} />
                        <div className="h-full bg-white/10 flex-1" />
                      </div>
                      <div className="flex items-center gap-3 text-[10px] mb-3">
                        <span className="flex items-center gap-1 text-emerald-400"><CheckCircle size={10} weight="fill" /> {p.forVotes} For</span>
                        <span className="flex items-center gap-1 text-red-400"><XCircle size={10} weight="fill" /> {p.against} Against</span>
                        <span className="flex items-center gap-1 text-white/30"><Minus size={10} weight="bold" /> {p.abstain} Abstain</span>
                      </div>
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
                      <AmendmentSuggester proposal={p} />
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Proposal History */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/[0.06]">
                <h2 className="text-sm font-medium text-white">Proposal History</h2>
              </div>
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#1a1725]">
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-white/30">Title</th>
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-white/30">Outcome</th>
                      <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-white/30">Date</th>
                      <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-white/30">Participation</th>
                      <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-white/30">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {proposalHistory.map((h, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3 text-xs text-white/70">{h.title}</td>
                        <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${outcomeBadge[h.outcome]}`}>{h.outcome}</span></td>
                        <td className="px-5 py-3 text-xs text-white/40">{h.date}</td>
                        <td className="px-5 py-3 text-xs text-white/50 text-right">{h.participation}%</td>
                        <td className="px-5 py-3 text-xs text-right">
                          <span className={h.margin.startsWith("+") ? "text-emerald-400" : h.margin.startsWith("-") ? "text-red-400" : "text-white/30"}>{h.margin}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Disputes + Agreements */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
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

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                  <h2 className="text-sm font-medium text-white">Community Agreements</h2>
                  <span className="text-xs text-white/30">{agreements.length} ratified</span>
                </div>
                <div className="max-h-[440px] overflow-y-auto divide-y divide-white/[0.04]">
                  {agreements.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5 px-5 hover:bg-white/[0.02] transition-colors">
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ${agreementCatBadge[a.category]}`}>{a.category}</span>
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

            {/* Gov metrics */}
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

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

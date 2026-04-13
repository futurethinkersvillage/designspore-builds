"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Scales, FileText, ChartBar,
  CheckCircle, XCircle, Minus, Clock,
  ShieldCheck, Users, Gavel, ThumbsUp,
  ArrowRight, Robot, Sparkle,
  Brain, ChatsCircle, Warning, UserCircle,
  Timer, Eye, ChatDots, Check, PaperPlaneTilt,
  HandWaving, Megaphone, Question,
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
    aiAnalysis: { impact: "High Impact", insight: "Similar to Solar Battery Expansion (Jan '26) which passed 68%. Strong precedent.", sentiment: "green" },
  },
  {
    title: "Community Garden Expansion to Plot D",
    proposer: "Marcus C.",
    forVotes: 98,
    against: 34,
    abstain: 8,
    status: "Open",
    desc: "Clear and prepare the southeastern plot for 12 additional raised beds with drip irrigation and companion planting zones.",
    aiAnalysis: { impact: "Medium Impact", insight: "Against votes trending slightly higher than initial garden proposal. Monitor objections.", sentiment: "amber" },
  },
  {
    title: "Updated Work-Stay Compensation Policy",
    proposer: "Sarah L.",
    forVotes: 67,
    against: 45,
    abstain: 22,
    status: "Under Review",
    desc: "Revise work-stay arrangements to include a stipend increase and flexible hour allocation for skill-based contributions.",
    aiAnalysis: { impact: "High Impact", insight: "Consent gap flagged — 33% against exceeds 20% threshold. Objection may be paramount.", sentiment: "red" },
  },
  {
    title: "Quiet Hours Extension to 10pm",
    proposer: "Ben M.",
    forVotes: 156,
    against: 8,
    abstain: 4,
    status: "Open",
    desc: "Move quiet hours start time from 11pm to 10pm across all residential zones to improve rest quality for early-shift volunteers.",
    aiAnalysis: { impact: "Low Impact", insight: "No objections flagged in community chat. Strong candidate for lazy consensus.", sentiment: "green" },
  },
  {
    title: "Village Marketplace Launch",
    proposer: "Anika P.",
    forVotes: 112,
    against: 28,
    abstain: 15,
    status: "Open",
    desc: "Open a weekly Saturday marketplace for residents and local artisans, with 10% proceeds funding community events.",
    aiAnalysis: { impact: "Medium Impact", insight: "High engagement in comment thread. 3 domain experts have endorsed the proposal.", sentiment: "green" },
  },
  {
    title: "Emergency Fund Increase to $50K",
    proposer: "James W.",
    forVotes: 134,
    against: 12,
    abstain: 6,
    status: "Under Review",
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

const aiSuggestedPrompts = [
  "Summarize active proposals",
  "Which proposals have the highest conflict risk?",
  "What's our consent rate trend?",
];

const aiMessages = [
  { role: "user", text: "Summarize active proposals" },
  { role: "ai", text: "There are 6 active proposals this cycle. The strongest consent signal is on Quiet Hours Extension (94% for) — this is a candidate for lazy consensus resolution. The highest conflict risk is Updated Work-Stay Compensation Policy, where the against-vote rate exceeds the 20% paramount objection threshold. Solar Array Expansion has strong historical precedent and is likely to pass without objections." },
  { role: "user", text: "What's our consent rate trend?" },
  { role: "ai", text: "Your consent rate has held at 83–87% over the last 3 quarters — a healthy signal for a community of this size. The slight dip in Q1 2026 correlates with the two compensation-related proposals, which typically generate more structured objections. No systemic governance issues detected. Recommend reviewing objection patterns for policy proposals specifically." },
];

/* ── Governance toolkit tab data ─────────────────────────────────── */

const toolkitTabs = [
  { id: "consent", label: "Consent Decision-Making", icon: Scales, badge: "Active", badgeStyle: "bg-emerald-500/20 text-emerald-400" },
  { id: "advice", label: "Advice Process", icon: ChatsCircle, badge: "Available", badgeStyle: "bg-blue-500/15 text-blue-400" },
  { id: "lazy", label: "Lazy Consensus", icon: Timer, badge: "Available", badgeStyle: "bg-blue-500/15 text-blue-400" },
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

/* ── Consent Decision-Making tab ──────────────────────────────────── */

function ConsentTab() {
  const [vote, setVote] = useState<"consent" | "abstain" | "object" | null>(null);
  const [objectionText, setObjectionText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const memberVotes = [
    { name: "Elena V.", vote: "consent" },
    { name: "Marcus R.", vote: "consent" },
    { name: "Yuki T.", vote: "abstain" },
    { name: "Ben M.", vote: "consent" },
    { name: "Anika P.", vote: "consent" },
    { name: "Sarah C.", vote: "object", objection: "Need to see cost breakdown before I can consent." },
    { name: "James W.", vote: "consent" },
    { name: "Rachel K.", vote: "consent" },
  ];

  return (
    <div className="space-y-4">
      {/* How it works */}
      <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3">
        <p className="text-xs text-emerald-400/80 leading-relaxed">
          <span className="font-medium text-emerald-400">How it works:</span> A proposal passes unless someone raises a <span className="italic">paramount objection</span> — a concern that would genuinely harm the community or violate core agreements. "I don't love it" is not an objection. "This will cause real harm" is.
        </p>
      </div>

      {/* Active proposal */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/15 text-[10px] font-bold text-amber">EP</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-white">Solar Array Expansion — Phase 2</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Open · 4 days left</span>
            </div>
            <p className="text-xs text-white/40 mt-0.5">Proposed by Elena V. · Apr 9, 2026</p>
          </div>
        </div>
        <p className="text-xs text-white/50 leading-relaxed mb-4">
          Expand the existing solar installation with 40 additional panels to reach 90% energy self-sufficiency by Q4 2026. Budget: $28,400 from capital reserve. Installation by Marcus R.'s team.
        </p>

        {/* Process steps */}
        <div className="flex items-center gap-1 mb-4 text-[10px] text-white/30 flex-wrap">
          {["1. Posted", "2. Open for Consent", "3. Integration Round", "4. Decision"].map((step, i) => (
            <span key={step} className="flex items-center gap-1">
              <span className={`rounded-full px-2 py-0.5 ${i === 1 ? "bg-emerald-500/20 text-emerald-400 font-medium" : "bg-white/[0.04]"}`}>{step}</span>
              {i < 3 && <span className="text-white/20">→</span>}
            </span>
          ))}
        </div>

        {/* Member response grid */}
        <div className="mb-4">
          <p className="text-[10px] text-white/30 mb-2">Community responses ({memberVotes.length} of 28 replied)</p>
          <div className="flex flex-wrap gap-1.5">
            {memberVotes.map((mv) => (
              <div key={mv.name} className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] ${
                mv.vote === "consent" ? "bg-emerald-500/15 text-emerald-400" :
                mv.vote === "abstain" ? "bg-white/[0.06] text-white/40" :
                "bg-red-500/15 text-red-400"
              }`}>
                {mv.vote === "consent" && <Check size={9} weight="bold" />}
                {mv.vote === "abstain" && <Minus size={9} weight="bold" />}
                {mv.vote === "object" && <Warning size={9} weight="fill" />}
                {mv.name.split(" ")[0]}
              </div>
            ))}
            <div className="flex items-center rounded-full bg-white/[0.03] border border-dashed border-white/[0.1] px-2 py-1 text-[10px] text-white/20">
              +20 pending
            </div>
          </div>
        </div>

        {/* Existing objection */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Warning size={11} weight="fill" className="text-red-400 shrink-0" />
            <span className="text-[10px] font-medium text-red-400">Objection raised — Sarah C.</span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed">"Need to see cost breakdown before I can consent."</p>
          <p className="text-[10px] text-white/25 mt-1">→ Integration round scheduled: Apr 15, 6pm</p>
        </div>

        {/* Your vote */}
        {!submitted ? (
          <div>
            <p className="text-[10px] text-white/40 mb-2 font-medium uppercase tracking-wider">Your Response</p>
            <div className="flex gap-2 flex-wrap mb-3">
              <button
                onClick={() => setVote("consent")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all border ${
                  vote === "consent" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-white/[0.04] border-white/[0.06] text-white/50 hover:border-emerald-500/30 hover:text-emerald-400"
                }`}
              >
                <CheckCircle size={13} weight={vote === "consent" ? "fill" : "regular"} /> Consent
              </button>
              <button
                onClick={() => setVote("abstain")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all border ${
                  vote === "abstain" ? "bg-white/10 border-white/20 text-white/70" : "bg-white/[0.04] border-white/[0.06] text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                <Minus size={13} weight="bold" /> Abstain
              </button>
              <button
                onClick={() => setVote("object")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all border ${
                  vote === "object" ? "bg-red-500/15 border-red-500/30 text-red-400" : "bg-white/[0.04] border-white/[0.06] text-white/50 hover:border-red-500/20 hover:text-red-400"
                }`}
              >
                <Warning size={13} weight={vote === "object" ? "fill" : "regular"} /> Raise Objection
              </button>
            </div>
            {vote === "object" && (
              <div className="mb-3">
                <textarea
                  value={objectionText}
                  onChange={e => setObjectionText(e.target.value)}
                  placeholder="Describe your paramount objection — what specific harm would this cause? The community will discuss this in an integration round."
                  className="w-full rounded-xl border border-red-500/20 bg-red-500/[0.05] px-3 py-2 text-xs text-white/60 placeholder:text-white/20 outline-none resize-none"
                  rows={3}
                />
              </div>
            )}
            {vote && (
              <button
                onClick={() => setSubmitted(true)}
                className="flex items-center gap-1.5 rounded-xl bg-amber/15 border border-amber/25 px-4 py-2 text-xs font-medium text-amber hover:bg-amber/25 transition-colors"
              >
                <PaperPlaneTilt size={12} weight="fill" /> Submit Response
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 flex items-center gap-3">
            <CheckCircle size={16} weight="fill" className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-medium text-emerald-400">Response recorded</p>
              <p className="text-[10px] text-white/40 mt-0.5">
                {vote === "consent" && "Your consent has been registered. You'll be notified when the decision is finalised."}
                {vote === "abstain" && "Abstention noted. You'll be notified of the outcome."}
                {vote === "object" && "Objection submitted. An integration round has been requested."}
              </p>
            </div>
            <button onClick={() => { setVote(null); setSubmitted(false); }} className="ml-auto text-[10px] text-white/30 hover:text-white/50">Reset demo</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Advice Process tab ───────────────────────────────────────────── */

function AdviceTab() {
  const [checkedIds, setCheckedIds] = useState<number[]>([0, 2]);
  const [readyToDecide, setReadyToDecide] = useState(false);

  const advisors = [
    { id: 0, name: "Elena V.", role: "Farm Director", reason: "Affected — composting area borders Plot C", checked: true, advice: "Go ahead, but install a proper liner to prevent leaching into the neighbouring beds. I can help source one." },
    { id: 1, name: "Marcus R.", role: "Lead Builder", reason: "Domain expert — construction & infrastructure", checked: false, advice: null },
    { id: 2, name: "Ben M.", role: "Trail Guide", reason: "Affected — trail access passes through area", checked: true, advice: "Fine with me. Just make sure the access path stays clear during install." },
    { id: 3, name: "James W.", role: "Steward / Finance", reason: "Budget approval for materials >$500", checked: false, advice: null },
  ];

  const toggle = (id: number) => setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-500/15 bg-blue-500/[0.04] px-4 py-3">
        <p className="text-xs text-blue-400/80 leading-relaxed">
          <span className="font-medium text-blue-400">How it works:</span> Anyone can make any decision — but must first seek advice from people who are <span className="italic">affected</span> by it and those with <span className="italic">domain expertise</span>. You don't need approval; you need genuine input.
        </p>
      </div>

      {/* Your proposed decision */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber/15 text-[9px] font-bold text-amber">MG</div>
          <span className="text-xs font-medium text-white">Your Decision</span>
          <span className="text-[10px] text-white/30">— Mike G.</span>
        </div>
        <p className="text-sm text-white/70 mt-2 mb-3 leading-relaxed">
          "Install a three-bin composting system on the east side of Garden Area C, using reclaimed timber from the workshop scrap pile. Estimated cost: $180 in hardware."
        </p>
        <div className="flex flex-wrap gap-2 text-[10px] text-white/30">
          <span className="rounded-full bg-white/[0.04] px-2 py-0.5">Impact area: Farm</span>
          <span className="rounded-full bg-white/[0.04] px-2 py-0.5">Budget: $180</span>
          <span className="rounded-full bg-white/[0.04] px-2 py-0.5">Timeline: This week</span>
        </div>
      </div>

      {/* Advice checklist */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">Advice Sought From</p>
          <span className="text-[10px] text-white/30">{checkedIds.length}/{advisors.length} consulted</span>
        </div>
        <div className="space-y-2">
          {advisors.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border p-3 transition-all ${checkedIds.includes(a.id) ? "border-blue-500/20 bg-blue-500/[0.04]" : "border-white/[0.06] bg-white/[0.03]"}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggle(a.id)}
                  className={`mt-0.5 shrink-0 flex h-4 w-4 items-center justify-center rounded border transition-all ${checkedIds.includes(a.id) ? "bg-blue-500/30 border-blue-500/50 text-blue-400" : "border-white/20 hover:border-blue-500/30"}`}
                >
                  {checkedIds.includes(a.id) && <Check size={9} weight="bold" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-white/80">{a.name}</span>
                    <span className="text-[10px] text-white/30">{a.role}</span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-0.5">{a.reason}</p>
                  {checkedIds.includes(a.id) && a.advice && (
                    <div className="mt-2 rounded-lg bg-white/[0.04] px-2.5 py-2 border-l-2 border-blue-500/30">
                      <p className="text-[11px] text-white/50 leading-relaxed italic">"{a.advice}"</p>
                    </div>
                  )}
                  {checkedIds.includes(a.id) && !a.advice && (
                    <p className="text-[10px] text-amber/60 mt-1.5">⏳ Waiting for response…</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision button */}
      {!readyToDecide ? (
        <button
          onClick={() => setReadyToDecide(true)}
          disabled={checkedIds.length < 3}
          className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            checkedIds.length >= 3
              ? "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
              : "bg-white/[0.03] border border-white/[0.06] text-white/20 cursor-not-allowed"
          }`}
        >
          <HandWaving size={14} weight="fill" />
          {checkedIds.length < 3 ? `Consult ${3 - checkedIds.length} more before deciding` : "I've received enough advice — proceed with decision"}
        </button>
      ) : (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 flex items-start gap-3">
          <CheckCircle size={16} weight="fill" className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-emerald-400">Decision logged</p>
            <p className="text-[10px] text-white/40 mt-0.5">Your decision has been recorded with the advice you received. It will appear in the community log. Affected parties have been notified.</p>
          </div>
          <button onClick={() => setReadyToDecide(false)} className="text-[10px] text-white/30 hover:text-white/50 shrink-0">Reset</button>
        </div>
      )}
    </div>
  );
}

/* ── Lazy Consensus tab ───────────────────────────────────────────── */

function LazyTab() {
  const [userAction, setUserAction] = useState<"silence" | "consent" | "concern" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const lazyProposals = [
    {
      title: "Move Tuesday farm team meeting to 7:00 AM",
      proposer: "Elena V.",
      posted: "Apr 11",
      expiresIn: "38h 14m",
      expiresPct: 47,
      seen: 18,
      total: 28,
      explicitConsents: 6,
      concerns: 0,
      risk: "Low",
    },
    {
      title: "Add 'No phones at the dinner table' to guest guidelines",
      proposer: "Yuki T.",
      posted: "Apr 12",
      expiresIn: "61h 02m",
      expiresPct: 15,
      seen: 9,
      total: 28,
      explicitConsents: 2,
      concerns: 1,
      risk: "Low",
    },
  ];

  const p = lazyProposals[0];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-500/15 bg-blue-500/[0.04] px-4 py-3">
        <p className="text-xs text-blue-400/80 leading-relaxed">
          <span className="font-medium text-blue-400">How it works:</span> Low-stakes decisions are posted for <span className="font-medium text-blue-300">72 hours</span>. Silence means consent. Anyone can explicitly consent or raise a concern to pause the proposal. Perfect for operational changes that don't need a full vote.
        </p>
      </div>

      {/* Active lazy proposals */}
      <div className="space-y-3">
        {lazyProposals.map((lp, idx) => (
          <div key={idx} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-sm font-medium text-white/80 leading-snug">{lp.title}</p>
                <p className="text-[10px] text-white/30 mt-0.5">Proposed by {lp.proposer} · Posted {lp.posted}</p>
              </div>
              <span className="shrink-0 rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-medium text-amber whitespace-nowrap">
                ⏱ {lp.expiresIn}
              </span>
            </div>

            {/* Timer bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-white/25 mb-1">
                <span>Time elapsed</span>
                <span>{lp.expiresPct}% of 72h</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-amber/50" style={{ width: `${lp.expiresPct}%` }} />
              </div>
            </div>

            {/* Engagement */}
            <div className="flex items-center gap-4 text-[10px] flex-wrap">
              <span className="flex items-center gap-1 text-white/40"><Eye size={10} /> {lp.seen}/{lp.total} viewed</span>
              <span className="flex items-center gap-1 text-emerald-400"><Check size={10} weight="bold" /> {lp.explicitConsents} explicit consents</span>
              {lp.concerns > 0 ? (
                <span className="flex items-center gap-1 text-amber"><Warning size={10} weight="fill" /> {lp.concerns} concern raised</span>
              ) : (
                <span className="flex items-center gap-1 text-white/25"><Minus size={10} weight="bold" /> No concerns</span>
              )}
              <span className={`rounded-full px-2 py-0.5 font-medium ${lp.risk === "Low" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber/15 text-amber"}`}>{lp.risk} risk</span>
            </div>
          </div>
        ))}
      </div>

      {/* Your response to first proposal */}
      {!submitted ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/30 mb-3">
            Your response to: "{p.title}"
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => setUserAction("silence")}
              className={`rounded-xl px-3 py-2.5 text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                userAction === "silence" ? "bg-white/10 border-white/25 text-white/80" : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:border-white/15"
              }`}
            >
              <Minus size={14} weight="bold" />
              <span>Stay silent</span>
              <span className="text-[9px] opacity-60">= consent</span>
            </button>
            <button
              onClick={() => setUserAction("consent")}
              className={`rounded-xl px-3 py-2.5 text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                userAction === "consent" ? "bg-emerald-500/20 border-emerald-500/35 text-emerald-400" : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:border-emerald-500/20"
              }`}
            >
              <CheckCircle size={14} weight={userAction === "consent" ? "fill" : "regular"} />
              <span>Explicitly consent</span>
              <span className="text-[9px] opacity-60">speeds it up</span>
            </button>
            <button
              onClick={() => setUserAction("concern")}
              className={`rounded-xl px-3 py-2.5 text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                userAction === "concern" ? "bg-amber/15 border-amber/30 text-amber" : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:border-amber/20"
              }`}
            >
              <Question size={14} weight={userAction === "concern" ? "fill" : "regular"} />
              <span>Raise concern</span>
              <span className="text-[9px] opacity-60">pauses timer</span>
            </button>
          </div>
          {userAction === "concern" && (
            <textarea
              placeholder="What's your concern? This will pause the proposal and open a short discussion thread."
              className="w-full rounded-xl border border-amber/20 bg-amber/[0.04] px-3 py-2 text-xs text-white/60 placeholder:text-white/20 outline-none resize-none mb-3"
              rows={2}
            />
          )}
          {userAction && (
            <button
              onClick={() => setSubmitted(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber/15 border border-amber/25 px-4 py-2 text-xs font-medium text-amber hover:bg-amber/25 transition-colors"
            >
              <PaperPlaneTilt size={12} weight="fill" />
              {userAction === "silence" ? "Do nothing — let time pass" : userAction === "concern" ? "Submit concern" : "Record my explicit consent"}
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 flex items-start gap-3">
          <CheckCircle size={16} weight="fill" className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-emerald-400">Response recorded</p>
            <p className="text-[10px] text-white/40 mt-0.5">
              {userAction === "silence" && "Noted. If no concerns are raised before the timer expires, the proposal passes automatically."}
              {userAction === "consent" && "Explicit consent recorded. This helps the proposal pass faster if enough members respond early."}
              {userAction === "concern" && "Concern submitted. The 72-hour timer is paused. Elena V. will be notified and can address your concern or request a fuller discussion."}
            </p>
          </div>
          <button onClick={() => { setUserAction(null); setSubmitted(false); }} className="text-[10px] text-white/30 hover:text-white/50 shrink-0">Reset</button>
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function GovernancePage() {
  const [activeToolTab, setActiveToolTab] = useState("consent");

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
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} weight="fill" className="text-white/40" />
            <h2 className="text-sm font-medium text-white">Governance Toolkit</h2>
          </div>

          {/* Tab selector */}
          <div className="flex gap-1 mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1">
            {toolkitTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeToolTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveToolTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/[0.08] text-white shadow-sm"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  <Icon size={13} weight={isActive ? "fill" : "regular"} />
                  <span className="hidden sm:inline truncate">{tab.label.split(" ")[0]}{tab.label.split(" ").length > 2 ? "…" : " " + tab.label.split(" ").slice(1).join(" ")}</span>
                  {isActive && tab.id === "consent" && (
                    <span className="hidden lg:inline rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] text-emerald-400 ml-0.5">Active</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeToolTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeToolTab === "consent" && <ConsentTab />}
              {activeToolTab === "advice" && <AdviceTab />}
              {activeToolTab === "lazy" && <LazyTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI Governance Assistant — 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0a0812] flex flex-col overflow-hidden" style={{ minHeight: 340 }}>
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]">
            <div className="rounded-lg bg-violet-500/20 p-1.5">
              <Robot size={13} weight="fill" className="text-violet-400" />
            </div>
            <span className="text-xs font-medium text-white/70">AI Governance Assistant</span>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
            </span>
          </div>
          <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5">
            {aiSuggestedPrompts.map((prompt) => (
              <button key={prompt} className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-[10px] text-violet-300 hover:bg-violet-500/20 transition-colors cursor-pointer">
                {prompt}
              </button>
            ))}
          </div>
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
          <div className="px-4 py-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              <input type="text" placeholder="Ask about proposals, trends, or conflicts…" className="flex-1 bg-transparent text-[11px] text-white/50 placeholder:text-white/20 outline-none" readOnly />
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
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Proposal History */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Proposal History</h2>
        <div className="overflow-x-auto">
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
                  <td className="py-2.5"><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${outcomeBadge[h.outcome]}`}>{h.outcome}</span></td>
                  <td className="py-2.5 text-xs text-white/40">{h.date}</td>
                  <td className="py-2.5 text-xs text-white/50 text-right">{h.participation}%</td>
                  <td className="py-2.5 text-xs text-right">
                    <span className={h.margin.startsWith("+") ? "text-emerald-400" : h.margin.startsWith("-") ? "text-red-400" : "text-white/30"}>{h.margin}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Dispute Resolution + Community Agreements */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-6">
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

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Community Agreements</h2>
            <span className="text-xs text-white/30">{agreements.length} ratified</span>
          </div>
          <div className="space-y-0">
            {agreements.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors px-1">
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scroll, PencilSimple, FloppyDisk, X, Check, Sparkle,
  GitBranch, Clock, ArrowSquareOut,
} from "@phosphor-icons/react";
import AgentDrawer from "@/components/dashboard/AgentDrawer";

/* ── Document content ──────────────────────────────────────────────── */

const docs = {
  Soul: {
    version: "3.2",
    updated: "April 12, 2026",
    author: "Iris",
    content: `# Wells Gray Village Soul

## Who We Are
Wells Gray Village is a regenerative intentional community on 400 acres of BC interior wilderness. We are 247 people building a model for how humans can live in right relationship with land, each other, and the future.

## Why We Exist
We exist to demonstrate that a different way of living is not only possible — it is already here. We combine Indigenous land ethics, modern cooperative economics, and open-source technology to build something worth inheriting.

## What We Believe
- Land and community are inseparable
- Every decision echoes seven generations forward
- Technology amplifies human values — for better or worse
- Conflict is an invitation to deeper understanding
- Abundance flows from sharing, not accumulation

## How We Work
We practice Sociocracy 3.0, consent-based governance, and radical financial transparency. Our AI Council agents are governed by this soul — they are here to amplify human wisdom, never to replace it.

## Who We Welcome
Anyone willing to contribute, to be changed by community, and to take responsibility for the land they live on.`,
  },

  Constitution: {
    version: "3.2",
    updated: "April 12, 2026",
    author: "Marcus Chen",
    content: `# Wells Gray Village Constitution
Adopted: January 2025 · Version 3.2

## Article I — Membership
Every member agrees to:
- Contribute meaningfully (minimum 8 hours per month for full members)
- Participate in governance (consent rounds, tension logging)
- Uphold the Village Soul
- Respect land, infrastructure, and each person

Member tiers: Explorer → Builder → Steward → Elder

## Article II — Decision Making
We use S3 consent-based process:
- Any member may raise a tension
- Any tension may become a proposal
- Proposals pass when no member has a paramount objection
- Decisions are logged, reviewable, and revisable

## Article III — Resources
All shared resources are held in collective stewardship. Private resources may be held in designated personal spaces. The land itself is never individually owned.

## Article IV — Conflict Resolution
1. Direct conversation (within 48 hours)
2. Peer mediation (request to council)
3. Circle facilitation (full governance circle)
4. External mediation (network-sourced mediator)

## Article V — AI Governance
The Village Council AI agents are:
- Governed by this Constitution and the Village Soul
- Accountable to the full membership
- Never permitted to make binding decisions without human consent
- Subject to quarterly soul review and amendment by the community`,
  },

  Patterns: {
    version: "3.1",
    updated: "March 3, 2026",
    author: "General Circle",
    content: `# Governance Patterns — Wells Gray Village
Based on Sociocracy 3.0 · Adapted for village context

## Consent Decision Making
We use consent (no paramount objection) rather than consensus. A proposal passes when no member can articulate a specific, evidence-based reason why it would cause harm to the village or its purpose.

## Proposal Process
1. Tension identified — logged by any member
2. Driver clarified — what need is unmet?
3. Proposal drafted — by proposer and any interested members
4. Consent round — council hears objections
5. Amendments — integrate valid objections
6. Decision logged — with context and rationale

## S3 Circles
Wells Gray operates five nested circles:
- General Circle (all members, strategic decisions)
- Operations Circle (day-to-day management)
- Finance Circle (budget, capital, fundraising)
- Land & Farm Circle (agriculture, infrastructure, energy)
- Community Circle (membership, events, culture)

Each circle is double-linked: a representative from each sub-circle sits in the circle above.

## Tension Logging
Any member may log a tension at any time. Sage monitors the tensions board and surfaces patterns. Tensions without a proposed resolution within 30 days are brought to the General Circle.

## Advice Process
For decisions below threshold (under $500, reversible, single-domain), any member may act after seeking advice from those affected. No consent round required.

## Lazy Consent
For low-stakes, time-sensitive proposals: posted for 48 hours. Silence = consent. Any objection restarts the full process.`,
  },

  "AI Reasoning": {
    version: "2.0",
    updated: "March 3, 2026",
    author: "Village Council",
    content: `# AI Decision Reasoning — Wells Gray Village Council
How the Village Council agents reason and what they may decide independently

## Principles

### Human Sovereignty, Always
No agent makes a binding decision without a human in the loop. Agents propose, flag, summarize, and recommend. Humans decide and act.

### Scope Defines Autonomy
Each agent has a defined scope. Actions within scope and below the approval threshold may be taken autonomously. Actions outside scope or above threshold require explicit human approval.

### Explain Before Acting
Before any consequential action, the agent explains what it is about to do and why, and waits for confirmation unless operating in routine monitoring mode.

### Conflict = Pause
If an action would affect another agent's domain, or if an agent is uncertain, it pauses and flags for council review.

## Autonomy Thresholds
- Read, monitor, summarize — Full autonomy
- Log a tension or event — Full autonomy
- Send a notification — Autonomy (Sage, Iris)
- Create a draft document — Autonomy, marked as draft
- Create a task or work order — Autonomy (Forge)
- Reassign a task to a person — Requires approval
- Publish to community channel — Requires approval
- Any financial transaction — Requires approval
- Any change to member status — Requires approval
- Any change to soul or constitution docs — Requires council vote`,
  },

  Changelog: {
    version: null,
    updated: "April 12, 2026",
    author: null,
    content: `# Soul Changelog — Wells Gray Village

## Version 3.2 — April 12, 2026
Proposed by: Iris (soul keeper) on behalf of Mia Clarke
Passed: General Circle consent round

Changes:
- Added 'Food Sovereignty' to Village Soul values
- Clarified lazy consent timeline from 72 hours to 48 hours
- Updated AI autonomy threshold for task creation (was 'requires approval', now 'autonomy')
- Minor clarifications to Article II decision-making language

## Version 3.1 — March 3, 2026
Proposed by: Marcus Chen (member)
Passed: General Circle consent round

Changes:
- Added S3 Circles section to Governance Patterns
- Added Article V (AI Governance) to Constitution
- Updated membership contribution minimum from 10 to 8 hours per month
- Published AI Reasoning document (v2.0) for the first time

## Version 3.0 — January 15, 2026
Proposed by: Founding circle
Passed: Founding circle consent

Changes:
- Initial publication of SOUL.md, CONSTITUTION.md, GOVERNANCE_PATTERNS.md
- Established Village Council AI agent framework
- Published to GitHub as open-source template for other villages`,
  },
};

type DocKey = keyof typeof docs;
const DOC_KEYS = Object.keys(docs) as DocKey[];

/* ── Section parser ─────────────────────────────────────────────────── */

interface Section { title: string; lines: string[] }

function parseSections(content: string): { heading: string; sections: Section[] } {
  const lines = content.split("\n");
  let heading = "";
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      heading = line.slice(2);
    } else if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.slice(3), lines: [] };
    } else if (line.startsWith("### ")) {
      current?.lines.push(`**${line.slice(4)}**`);
    } else if (current && line !== "") {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return { heading, sections };
}

function renderLine(line: string, i: number) {
  const isBullet = line.startsWith("- ");
  const isNumbered = /^\d+\./.test(line);

  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, j) =>
      p.startsWith("**") ? (
        <strong key={j} className="text-white/85 font-semibold">
          {p.slice(2, -2)}
        </strong>
      ) : (
        p
      )
    );
  };

  if (isBullet) {
    return (
      <li key={i} className="flex items-start gap-2 text-sm text-white/55 leading-relaxed">
        <span className="text-white/20 mt-1.5 shrink-0">·</span>
        <span>{formatInline(line.slice(2))}</span>
      </li>
    );
  }
  if (isNumbered) {
    const [num, ...rest] = line.split(". ");
    return (
      <li key={i} className="flex items-start gap-2 text-sm text-white/55 leading-relaxed">
        <span className="text-white/25 font-mono text-xs mt-0.5 w-4 shrink-0">{num}.</span>
        <span>{formatInline(rest.join(". "))}</span>
      </li>
    );
  }
  return (
    <p key={i} className="text-sm text-white/55 leading-relaxed">
      {formatInline(line)}
    </p>
  );
}

/* ── Animations ──────────────────────────────────────────────────────── */

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function SoulPage() {
  const [activeDoc, setActiveDoc] = useState<DocKey>("Soul");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [drafts, setDrafts] = useState<Record<DocKey, string>>(
    Object.fromEntries(DOC_KEYS.map((k) => [k, docs[k].content])) as Record<DocKey, string>
  );
  const [irisOpen, setIrisOpen] = useState(false);

  const current = docs[activeDoc];
  const draftContent = drafts[activeDoc];

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTabChange = (key: DocKey) => {
    setActiveDoc(key);
    setEditing(false);
  };

  const { heading, sections } = parseSections(draftContent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-white lg:text-4xl">
            Village <span className="italic">Soul</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">
            The living documents that govern Wells Gray Village and its AI council
          </p>
        </div>
        <div className="flex items-center gap-2 self-start shrink-0">
          <a
            href="https://github.com/futurethinkersvillage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowSquareOut size={12} /> Open Source
          </a>
          <button
            onClick={() => setIrisOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Sparkle size={13} weight="fill" /> Ask Iris
          </button>
        </div>
      </div>

      {/* Meta bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3"
      >
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Scroll size={13} className="text-amber" weight="fill" />
          <span className="text-amber font-medium">Wells Gray Village</span>
        </div>
        <span className="text-white/15">·</span>
        <div className="flex items-center gap-1.5 text-xs text-white/35">
          <GitBranch size={12} />
          v{current.version ?? "—"}
        </div>
        <span className="text-white/15">·</span>
        <div className="flex items-center gap-1.5 text-xs text-white/35">
          <Clock size={12} />
          Last updated {current.updated}
        </div>
        {current.author && (
          <>
            <span className="text-white/15">·</span>
            <span className="text-xs text-white/35">by {current.author}</span>
          </>
        )}
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-white/25">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          Open Source · MIT License
        </div>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-white/[0.06] overflow-x-auto">
        {DOC_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
              activeDoc === key ? "text-white" : "text-white/35 hover:text-white/60"
            }`}
          >
            {key}
            {activeDoc === key && (
              <motion.div
                layoutId="soul-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Edit controls */}
      <div className="flex items-center justify-between -mt-2">
        <p className="text-xs text-white/25 font-mono">
          {activeDoc === "Changelog" ? "CHANGELOG.md" : activeDoc === "AI Reasoning" ? "DECISION_REASONING.md" : `${activeDoc.toUpperCase().replace(" ", "_")}.md`}
        </p>
        <div className="flex items-center gap-2">
          {saved && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-xs text-emerald-400"
            >
              <Check size={12} /> Saved
            </motion.span>
          )}
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/[0.06] transition-colors"
              >
                <X size={12} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-amber/25 bg-amber/10 text-amber hover:bg-amber/20 transition-colors"
              >
                <FloppyDisk size={12} /> Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/[0.06] transition-colors"
            >
              <PencilSimple size={12} /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Document content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDoc}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {editing ? (
            <textarea
              value={drafts[activeDoc]}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, [activeDoc]: e.target.value }))
              }
              className="w-full h-[560px] rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-sm text-white/70 font-mono leading-relaxed resize-none outline-none focus:border-white/[0.15] transition-colors"
            />
          ) : (
            <div className="space-y-4">
              {heading && (
                <div className="rounded-2xl border border-amber/15 bg-amber/[0.04] px-5 py-4">
                  <h2 className="font-serif text-xl font-light text-white/90">{heading}</h2>
                </div>
              )}
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
                {sections.map((section) => (
                  <motion.div
                    key={section.title}
                    variants={fadeUp}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5"
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-amber/70 mb-3">
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.lines.map((line, i) => renderLine(line, i))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
        <p className="text-xs text-white/20">
          These documents are the intellectual property of no one — they belong to the village.
        </p>
        <a
          href="https://github.com/futurethinkersvillage"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-white/25 hover:text-white/40 transition-colors"
        >
          Fork this template <ArrowSquareOut size={11} />
        </a>
      </div>

      <AgentDrawer agentId="iris" isOpen={irisOpen} onClose={() => setIrisOpen(false)} />
    </div>
  );
}

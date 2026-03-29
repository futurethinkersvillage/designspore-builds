"use client";

import { useState } from "react";
import Link from "next/link";
import { type Module, tierConfig, categoryLabels, creditsForModule } from "@/lib/modules";
import TierBadge from "./TierBadge";

interface ModuleCardProps {
  module: Module;
  isActivated?: boolean;
}

export default function ModuleCard({ module: mod, isActivated }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group relative flex flex-col bg-card border rounded-2xl transition-all duration-200 ${
        isActivated
          ? "border-gold/30 ring-1 ring-gold/10"
          : "border-white/[0.07] hover:border-white/[0.14]"
      }`}
    >
      {/* Main card content */}
      <div className="p-5 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <TierBadge tier={mod.tier} creditOnly recurring={mod.recurring} />
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
              {categoryLabels[mod.category]}
            </span>
          </div>
          {isActivated && (
            <span className="shrink-0 text-[10px] uppercase tracking-widest text-gold font-semibold">
              Active
            </span>
          )}
        </div>

        {/* Name + problem */}
        <h3 className="text-base font-semibold text-white mb-1 group-hover:text-gold/90 transition-colors">
          {mod.name}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
          {mod.problemHeadline}
        </p>

        {/* Expandable detail */}
        {expanded && (
          <div className="mt-4 space-y-4 border-t border-white/[0.06] pt-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-1">The Problem</p>
              <p className="text-sm text-white/60 leading-relaxed">{mod.problemDescription}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-1">What We Build</p>
              <p className="text-sm text-white/60 leading-relaxed">{mod.serviceMechanism}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-1">The Outcome</p>
              <p className="text-sm text-white/60 leading-relaxed">{mod.businessOutcome}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-2">Deliverables</p>
              <ul className="space-y-1">
                {mod.includedDeliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="text-gold/60 mt-0.5 shrink-0">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3 border-t border-white/[0.05] pt-4 mt-auto">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1"
          aria-expanded={expanded}
        >
          {expanded ? "Less info" : "Learn more"}
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <Link
          href={`/modules/${mod.id}`}
          className={isActivated
            ? "shrink-0 px-3.5 py-1.5 bg-white/[0.05] text-white/40 text-xs font-semibold rounded-lg transition-colors"
            : "shrink-0 px-3.5 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold rounded-lg transition-colors"
          }
        >
          {isActivated ? "In queue" : "Add to queue →"}
        </Link>
      </div>
    </div>
  );
}

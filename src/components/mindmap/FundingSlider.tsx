"use client";

import { motion } from "framer-motion";
import { CurrencyDollar } from "@phosphor-icons/react";
import { useMapStore, FUNDING_TIERS } from "@/lib/mindmap/store";
import { phaseLabelForTier } from "@/lib/mindmap/status";

function label(t: number) {
  return t >= 50 ? "$50M+" : `$${t}M`;
}

/** Left-docked vertical funding rail: one tab per tier. Selecting a tier lights
 *  every node at or below that funding level. */
export function FundingSlider() {
  const funding = useMapStore((s) => s.funding);
  const setFunding = useMapStore((s) => s.setFunding);
  const map = useMapStore((s) => s.map);

  const branches = map.nodes.filter((n) => n.kind === "branch");
  const fundedBranches = branches.filter((n) => (n.tier ?? 3) <= funding).length;
  const totalBranches = branches.length;
  const unlockedHere = branches.filter((n) => (n.tier ?? 3) === funding).map((n) => n.label);
  const isBase = FUNDING_TIERS.indexOf(funding) === 0;

  return (
    <div className="pointer-events-auto flex w-[176px] flex-col rounded-2xl border border-[#ea824e]/20 bg-[#161616]/85 p-3 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-md">
      <div className="mb-2 flex items-center gap-1.5 px-1">
        <CurrencyDollar size={16} weight="bold" className="text-[#ea824e]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#b3a8aa]">
          Funding level
        </span>
      </div>

      {/* Vertical tier tabs (top = today / $3M, bottom = full vision / $50M+) */}
      <div className="flex flex-col gap-1">
        {FUNDING_TIERS.map((t) => {
          const active = t === funding;
          const unlocked = t <= funding;
          return (
            <button
              key={t}
              onClick={() => setFunding(t)}
              className="group relative flex items-center justify-between overflow-hidden rounded-lg border px-3 py-2 text-left transition-colors"
              style={{
                background: active
                  ? "transparent"
                  : unlocked
                    ? "rgba(234,130,78,0.10)"
                    : "rgba(255,255,255,0.02)",
                borderColor: active
                  ? "transparent"
                  : unlocked
                    ? "rgba(234,130,78,0.30)"
                    : "rgba(255,255,255,0.06)",
              }}
            >
              {/* Sliding amber highlight that glides between tiers */}
              {active && (
                <motion.div
                  layoutId="funding-active"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(234,130,78,0.95), rgba(242,168,120,0.9))",
                  }}
                />
              )}
              {/* tab accent bar */}
              <span
                className="absolute left-0 top-1/2 z-10 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-all"
                style={{ background: active ? "#1a1720" : unlocked ? "#ea824e" : "transparent" }}
              />
              <div className="relative z-10 flex flex-col leading-tight">
                <span
                  className="font-display text-[23px] font-semibold leading-none"
                  style={{ color: active ? "#1a1720" : unlocked ? "#f2a878" : "#8a7f86" }}
                >
                  {label(t)}
                </span>
                <span
                  className="mt-0.5 font-mono text-[9.5px] uppercase tracking-wide"
                  style={{
                    color: active
                      ? "rgba(26,23,32,0.7)"
                      : unlocked
                        ? "rgba(242,168,120,0.65)"
                        : "rgba(138,127,134,0.7)",
                  }}
                >
                  {phaseLabelForTier(t)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 border-t border-white/5 px-1 pt-2.5">
        <div className="font-mono text-[10.5px] text-[#b3a8aa]">
          <span className="text-[#f2a878]">{fundedBranches}</span>/{totalBranches} branches active
        </div>
        {/* Fixed height so the rail never resizes/jumps between tiers, while
            still fitting the longest case (the $3M tier's three branch names). */}
        <div className="mt-1.5 h-[66px] overflow-hidden text-[11.5px] leading-snug">
          <div className="text-[#8a7f86]">{isBase ? "Operating now" : "Unlocks here"}</div>
          <motion.div
            key={funding}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#f2a878]"
          >
            {unlockedHere.join(" · ") || "—"}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

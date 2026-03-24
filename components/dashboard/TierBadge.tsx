import { tierConfig, type ModuleTier } from "@/lib/modules";

const colorMap: Record<string, string> = {
  gold:  "bg-gold/10 text-gold border-gold/20",
  blue:  "bg-blue-500/10 text-blue-300 border-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

export default function TierBadge({ tier, showCredits }: { tier: ModuleTier; showCredits?: boolean }) {
  const cfg = tierConfig[tier];
  const classes = colorMap[cfg.color] ?? colorMap.gold;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${classes}`}>
      {cfg.label}
      {showCredits && (
        <span className="opacity-60">· {cfg.credits === 4 ? "Full month" : `${cfg.credits} credit${cfg.credits > 1 ? "s" : ""}`}</span>
      )}
    </span>
  );
}

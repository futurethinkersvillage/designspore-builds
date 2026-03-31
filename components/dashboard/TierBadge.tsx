import { tierConfig, type ModuleTier } from "@/lib/modules";

const colorMap: Record<string, string> = {
  gold:  "bg-gold/10 text-gold border-gold/20",
  blue:  "bg-blue-500/10 text-blue-300 border-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

interface TierBadgeProps {
  tier: ModuleTier;
  recurring?: boolean;
  /** @deprecated creditOnly is now the only mode — kept for compat */
  creditOnly?: boolean;
  /** @deprecated unused */
  showCredits?: boolean;
}

export default function TierBadge({ tier, recurring }: TierBadgeProps) {
  const cfg = tierConfig[tier];
  const classes = colorMap[cfg.color] ?? colorMap.gold;
  const label = recurring
    ? `↻ ${cfg.credits} credit${cfg.credits > 1 ? "s" : ""}/mo`
    : `${cfg.credits} credit${cfg.credits > 1 ? "s" : ""}`;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${classes}`}>
      {label}
    </span>
  );
}

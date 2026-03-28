interface AllocationMeterProps {
  creditsUsed: number;
  creditsTotal: number;
  compact?: boolean;
}

export default function AllocationMeter({ creditsUsed, creditsTotal, compact }: AllocationMeterProps) {
  const remaining = Math.max(creditsTotal - creditsUsed, 0);

  const hint =
    remaining >= 4 ? "1 Flagship, 2 Core, or 4 Quick Wins available"
    : remaining === 3 ? "1 Core + 1 Quick Win, or 3 Quick Wins available"
    : remaining === 2 ? "1 Core or 2 Quick Wins available"
    : remaining === 1 ? "1 Quick Win available"
    : "Full — queue resets next month";

  return (
    <div className={compact ? "flex items-center gap-3" : "w-full"}>
      {/* Dot track */}
      <div className="flex gap-1.5 items-center">
        {Array.from({ length: creditsTotal }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              compact ? "w-2.5 h-2.5" : "w-3 h-3"
            } ${
              i < creditsUsed
                ? "bg-gold"
                : "bg-white/[0.1] border border-white/[0.08]"
            }`}
          />
        ))}
      </div>

      {!compact && (
        <div className="flex items-baseline justify-between mt-2">
          <p className="text-[11px] text-white/30">{hint}</p>
          <p className="text-[11px] text-white/40 tabular-nums">
            {remaining} of {creditsTotal} credits left
          </p>
        </div>
      )}

      {compact && (
        <span className="text-xs text-white/40 tabular-nums">
          {remaining}/{creditsTotal} credits
        </span>
      )}
    </div>
  );
}

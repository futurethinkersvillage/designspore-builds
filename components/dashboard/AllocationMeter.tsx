interface AllocationMeterProps {
  creditsUsed: number;
  creditsTotal: number;
  compact?: boolean;
}

export default function AllocationMeter({ creditsUsed, creditsTotal, compact }: AllocationMeterProps) {
  const remaining = Math.max(creditsTotal - creditsUsed, 0);

  const hint =
    remaining >= 4 ? `${remaining} credits available`
    : remaining === 3 ? "3 credits available"
    : remaining === 2 ? "2 credits available"
    : remaining === 1 ? "1 credit available"
    : "Full — queue resets next month";

  return (
    <div className={compact ? "flex items-center gap-3" : "w-full"}>
      {/* Dot track */}
      <div className="flex gap-1.5 items-center">
        {Array.from({ length: creditsTotal }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              compact ? "w-5 h-1.5" : "w-3 h-3"
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

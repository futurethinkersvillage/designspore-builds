interface AllocationMeterProps {
  used: number;
  total: number;
}

export default function AllocationMeter({ used, total }: AllocationMeterProps) {
  const remaining = total - used;
  const pct = Math.min((used / total) * 100, 100);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm text-white/50">Monthly allocation</span>
        <span className="text-sm font-semibold text-white tabular-nums">
          {fmt(remaining)}{" "}
          <span className="text-white/40 font-normal">remaining</span>
        </span>
      </div>
      <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background:
              pct >= 90
                ? "#ef4444"
                : pct >= 70
                ? "#f59e0b"
                : "var(--color-gold, #C9A227)",
          }}
        />
      </div>
      <p className="text-[11px] text-white/30 mt-1.5 tabular-nums">
        {fmt(used)} of {fmt(total)} used this month
      </p>
    </div>
  );
}

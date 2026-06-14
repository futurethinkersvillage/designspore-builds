"use client";

import { useEffect, useState } from "react";

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // ms
  decimals?: number;
  className?: string;
}

/** Counts up from 0 to `value` once, when scrolled/rendered into view. */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1200,
  decimals = 0,
  className,
}: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

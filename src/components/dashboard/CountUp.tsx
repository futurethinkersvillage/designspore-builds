"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 1400): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

interface CountUpProps {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Use toLocaleString formatting (adds commas). Default true. */
  localize?: boolean;
}

export default function CountUp({
  to,
  duration = 1400,
  prefix = "",
  suffix = "",
  localize = true,
}: CountUpProps) {
  const count = useCountUp(to, duration);
  const formatted = localize ? count.toLocaleString() : count.toString();
  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}

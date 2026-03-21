"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;      // e.g. "$79M+"
  className?: string;
}

function parseNumber(raw: string): { prefix: string; number: number; suffix: string } {
  const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: raw };
  return { prefix: match[1], number: parseFloat(match[2]), suffix: match[3] };
}

export default function CountUp({ value, className = "" }: Props) {
  const { prefix, number, suffix } = parseNumber(value);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 60;
          const increment = number / steps;
          let current = 0;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            // Ease-out curve
            const progress = 1 - Math.pow(1 - step / steps, 3);
            current = number * progress;
            setDisplay(Math.round(current));
            if (step >= steps) {
              setDisplay(number);
              clearInterval(timer);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [number]);

  const formatted = Number.isInteger(number)
    ? display.toString()
    : display.toFixed(1);

  return (
    <span ref={ref} className={`num ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

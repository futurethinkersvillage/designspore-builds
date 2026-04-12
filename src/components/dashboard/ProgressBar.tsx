"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  label?: string;
  color?: string;
}

const colorMap: Record<string, string> = {
  amber:      "bg-amber",
  indigo:     "bg-indigo",
  terracotta: "bg-terracotta",
  mauve:      "bg-mauve",
  emerald:    "bg-emerald-500",
  red:        "bg-red-500",
};

export default function ProgressBar({ value, label, color = "amber" }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const barColor = colorMap[color] ?? "bg-amber";

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-white/50">{label}</span>
          <span className="text-sm font-medium text-white/70">{clampedValue}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </div>
  );
}

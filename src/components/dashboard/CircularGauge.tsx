"use client";

import { motion } from "framer-motion";

interface CircularGaugeProps {
  value: number;
  label: string;
  size?: number;
  color?: string;
}

const colorHex: Record<string, string> = {
  amber:      "#EA824E",
  indigo:     "#38387F",
  terracotta: "#AF695E",
  mauve:      "#73516F",
  emerald:    "#10B981",
};

export default function CircularGauge({ value, label, size = 120, color = "amber" }: CircularGaugeProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;
  const strokeColor = colorHex[color] ?? colorHex.amber;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold text-white">{clampedValue}%</span>
        </div>
      </div>
      <span className="text-sm text-white/50 mt-2">{label}</span>
    </motion.div>
  );
}

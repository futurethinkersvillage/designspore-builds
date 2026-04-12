"use client";

import { type ComponentType } from "react";
import { motion } from "framer-motion";

interface FeedItem {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  time: string;
  color?: string;
}

interface ActivityFeedProps {
  items: FeedItem[];
}

const dotColor: Record<string, string> = {
  amber:      "bg-amber",
  indigo:     "bg-indigo",
  terracotta: "bg-terracotta",
  mauve:      "bg-mauve",
  emerald:    "bg-emerald-500",
  red:        "bg-red-500",
};

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="relative space-y-0">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const color = dotColor[item.color ?? "amber"] ?? "bg-amber";
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="relative flex items-start gap-3 py-3"
          >
            {/* Timeline line */}
            {idx < items.length - 1 && (
              <div className="absolute left-[11px] top-[30px] bottom-0 w-px bg-white/[0.06]" />
            )}
            {/* Dot */}
            <div className={`relative z-10 mt-1 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ${color}/20`}>
              <Icon size={12} className={`${color === "bg-amber" ? "text-amber" : color === "bg-emerald-500" ? "text-emerald-500" : color === "bg-terracotta" ? "text-terracotta" : color === "bg-indigo" ? "text-indigo" : color === "bg-mauve" ? "text-mauve" : "text-amber"}`} />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/70 leading-snug">{item.label}</p>
              <p className="text-xs text-white/30 mt-0.5">{item.time}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

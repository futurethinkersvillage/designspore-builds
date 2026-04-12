"use client";

import { type ComponentType } from "react";
import { ArrowUp, ArrowDown } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }>;
}

export default function StatCard({ label, value, trend, trendUp, icon: Icon }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden group hover:bg-white/[0.06] transition-colors duration-300"
    >
      {/* Icon */}
      <div className="absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full bg-amber/20">
        <Icon size={20} weight="fill" className="text-amber" />
      </div>

      {/* Value */}
      <p className="text-2xl font-semibold text-white mt-1">{value}</p>

      {/* Label */}
      <p className="text-sm text-white/50 mt-1">{label}</p>

      {/* Trend */}
      <div className="flex items-center gap-1 mt-3">
        {trendUp ? (
          <ArrowUp size={14} weight="bold" className="text-emerald-400" />
        ) : (
          <ArrowDown size={14} weight="bold" className="text-terracotta" />
        )}
        <span
          className={`text-xs font-medium ${
            trendUp ? "text-emerald-400" : "text-terracotta"
          }`}
        >
          {trend}
        </span>
      </div>

      {/* Subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-amber/[0.03] to-transparent" />
    </motion.div>
  );
}

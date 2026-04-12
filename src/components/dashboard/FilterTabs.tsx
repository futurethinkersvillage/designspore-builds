"use client";

import { motion } from "framer-motion";

interface FilterTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03]">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive ? "text-white" : "text-white/40 hover:text-white/60"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="filter-tab-active"
                className="absolute inset-0 bg-white/10 rounded-lg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}

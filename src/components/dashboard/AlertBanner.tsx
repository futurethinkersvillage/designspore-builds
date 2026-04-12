"use client";

import { useState, type ComponentType } from "react";
import { X, Warning, Info, WarningCircle } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

type Variant = "warning" | "info" | "danger";

interface AlertBannerProps {
  message: string;
  variant: Variant;
  icon?: ComponentType<{ size?: number; weight?: "regular" | "fill"; className?: string }>;
}

const variantStyles: Record<Variant, { bg: string; border: string; text: string; defaultIcon: ComponentType<{ size?: number; weight?: "regular" | "fill"; className?: string }> }> = {
  warning: {
    bg: "bg-amber/10",
    border: "border-amber/20",
    text: "text-amber",
    defaultIcon: Warning,
  },
  info: {
    bg: "bg-indigo/10",
    border: "border-indigo/30",
    text: "text-blue-400",
    defaultIcon: Info,
  },
  danger: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    defaultIcon: WarningCircle,
  },
};

export default function AlertBanner({ message, variant, icon }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);
  const styles = variantStyles[variant];
  const Icon = icon ?? styles.defaultIcon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.25 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${styles.bg} ${styles.border}`}
        >
          <Icon size={18} weight="fill" className={`shrink-0 ${styles.text}`} />
          <p className={`flex-1 text-sm ${styles.text}`}>{message}</p>
          <button
            onClick={() => setVisible(false)}
            className="shrink-0 p-1 rounded-lg hover:bg-white/[0.06] transition-colors text-white/30 hover:text-white/60"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

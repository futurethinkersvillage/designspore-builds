"use client";

type Variant = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusBadgeProps {
  status: string;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber/15 text-amber",
  danger:  "bg-red-500/15 text-red-400",
  info:    "bg-indigo/15 text-blue-400",
  neutral: "bg-white/10 text-white/50",
};

export default function StatusBadge({ status, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {status}
    </span>
  );
}

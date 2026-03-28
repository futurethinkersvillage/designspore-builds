"use client";

import { useState, useTransition } from "react";
import { setUserTier, setUserActive } from "@/app/actions/admin";
import type { PLANS } from "@/lib/subscription";

interface Props {
  user: {
    id: string; name: string | null; email: string | null; businessName: string | null;
    subscriptionTier: string | null; isActive: boolean; createdAt: Date | null;
  };
  plans: typeof PLANS;
}

export default function AdminUserRow({ user, plans }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(user.isActive);
  const [tier, setTier] = useState(user.subscriptionTier ?? "starter");

  function toggleActive() {
    startTransition(async () => {
      await setUserActive(user.id, !isActive);
      setIsActive(!isActive);
    });
  }

  function changeTier(newTier: string) {
    startTransition(async () => {
      await setUserTier(user.id, newTier);
      setTier(newTier);
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 bg-raised border border-white/[0.05] rounded-xl px-5 py-3 flex-wrap">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white truncate">{user.name ?? user.email}</p>
        <p className="text-xs text-white/30 truncate">{user.email} · {user.businessName}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        {/* Tier select */}
        <select
          value={tier}
          onChange={(e) => changeTier(e.target.value)}
          disabled={isPending}
          className="bg-card border border-white/[0.08] text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none"
        >
          {Object.entries(plans).map(([key, plan]) => (
            <option key={key} value={key}>{plan.label}</option>
          ))}
        </select>

        {/* Active toggle */}
        <button
          onClick={toggleActive}
          disabled={isPending}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-50 ${
            isActive
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-white/[0.05] text-white/40 border-white/[0.08] hover:text-white"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </button>
      </div>
    </div>
  );
}

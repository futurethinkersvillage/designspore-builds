"use client";

import { useState, useTransition } from "react";
import { toggleAutopilot } from "@/app/actions/account";
import { useRouter } from "next/navigation";

export default function AutopilotToggle({
  enabled,
  isDemo,
}: {
  enabled: boolean;
  isDemo?: boolean;
}) {
  const [on, setOn] = useState(enabled);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggle() {
    const next = !on;
    setOn(next); // optimistic

    if (isDemo) return; // demo: just toggle visually

    startTransition(async () => {
      const result = await toggleAutopilot(next);
      if (!result.success) setOn(!next); // revert on failure
      else router.refresh();
    });
  }

  return (
    <div className={`rounded-2xl border p-5 transition-all ${
      on ? "border-gold/20 bg-gold/[0.03]" : "border-white/[0.06] bg-raised"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">Autopilot</p>
            {on && (
              <span className="text-[10px] uppercase tracking-widest text-gold font-semibold border border-gold/30 rounded-full px-1.5 py-0.5">
                On
              </span>
            )}
          </div>
          <p className="text-xs text-white/40 max-w-sm leading-relaxed">
            {on
              ? "Mike picks the highest-impact services for your business each month and keeps your queue filled automatically."
              : "Let Mike curate your queue. He'll choose the highest-impact services and manage everything month to month."}
          </p>
        </div>

        {/* Toggle switch */}
        <button
          onClick={toggle}
          disabled={isPending}
          className={`shrink-0 relative w-11 h-6 rounded-full transition-colors duration-200 ${
            on ? "bg-gold" : "bg-white/[0.1]"
          } ${isPending ? "opacity-50" : ""}`}
          role="switch"
          aria-checked={on}
          aria-label="Toggle autopilot"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              on ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { activateModule, cancelActivation } from "@/app/actions/modules";
import type { ModuleTier } from "@/lib/modules";

interface ActivateButtonProps {
  moduleId: string;
  moduleName: string;
  tier: ModuleTier;
  creditsNeeded: number;
  isActivated: boolean;
  isDemo?: boolean;
  // Demo queue callbacks — passed in from server page when isDemo=true
  isQueued?: boolean;
  onDemoAdd?: () => void;
  onDemoRemove?: () => void;
}

export default function ActivateButton({
  moduleId,
  moduleName,
  tier,
  creditsNeeded,
  isActivated,
  isDemo = false,
  isQueued,
  onDemoAdd,
  onDemoRemove,
}: ActivateButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  // ── Demo mode ────────────────────────────────────────────────────────
  if (isDemo) {
    if (isQueued) {
      return (
        <button
          onClick={onDemoRemove}
          className="w-full px-5 py-3 bg-white/[0.06] border border-white/[0.08] text-white/50 text-sm rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
        >
          Remove from queue
        </button>
      );
    }
    return (
      <button
        onClick={onDemoAdd}
        className="w-full px-5 py-3 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
      >
        Add to queue
      </button>
    );
  }

  // ── Live result state ─────────────────────────────────────────────────
  if (result) {
    return (
      <div
        className={`rounded-xl px-5 py-4 text-sm ${
          result.success
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}
      >
        {result.message}
      </div>
    );
  }

  // ── Already activated ─────────────────────────────────────────────────
  if (isActivated) {
    return (
      <div className="px-5 py-3 rounded-xl bg-emerald-500/10 text-emerald-300 text-sm font-medium border border-emerald-500/20 text-center">
        ✓ Queued this month
      </div>
    );
  }

  // ── Confirm dialog ────────────────────────────────────────────────────
  if (showConfirm) {
    return (
      <div className="border border-gold/20 rounded-2xl p-5 bg-gold/[0.04] space-y-4">
        <div>
          <p className="text-sm font-semibold text-white mb-1">Add to queue?</p>
          <p className="text-sm text-white/50">
            <strong className="text-white">{moduleName}</strong> will use{" "}
            <strong className="text-gold">
              {creditsNeeded} credit{creditsNeeded > 1 ? "s" : ""}
            </strong>
            . It'll be scheduled for the earliest available month.
          </p>
          <p className="text-xs text-white/30 mt-2">
            We'll reach out within 1–2 business days once it's your active month.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              startTransition(async () => {
                const res = await activateModule(moduleId);
                setResult({
                  success: res.success,
                  message: res.success
                    ? res.message
                    : (res as { error: string }).error,
                });
                setShowConfirm(false);
              });
            }}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {isPending ? "Adding…" : "Add to queue"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="px-4 py-2.5 bg-white/[0.06] text-white/50 text-sm rounded-xl hover:bg-white/[0.1] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Default CTA ───────────────────────────────────────────────────────
  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-full px-5 py-3 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
    >
      Add to queue
    </button>
  );
}

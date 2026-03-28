"use client";

import { useState, useTransition } from "react";
import { activateModule, cancelActivation } from "@/app/actions/modules";
import { tierConfig, type ModuleTier } from "@/lib/modules";

interface ActivateButtonProps {
  moduleId: string;
  moduleName: string;
  tier: ModuleTier;
  creditsNeeded: number;
  creditsRemaining: number;
  isActivated: boolean;
  isDemo?: boolean;
}

export default function ActivateButton({
  moduleId,
  moduleName,
  tier,
  creditsNeeded,
  creditsRemaining,
  isActivated,
  isDemo = false,
}: ActivateButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const canAfford = creditsRemaining >= creditsNeeded;
  const tierCfg = tierConfig[tier];

  function handleActivate() {
    if (isDemo) {
      setResult({ success: true, message: "Demo mode — activations are not saved." });
      setShowConfirm(false);
      return;
    }
    startTransition(async () => {
      const res = await activateModule(moduleId);
      setResult({ success: res.success, message: res.success ? res.message : (res as { error: string }).error });
      setShowConfirm(false);
    });
  }

  if (result) {
    return (
      <div className={`rounded-xl px-5 py-4 text-sm ${result.success ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
        {result.message}
      </div>
    );
  }

  if (isActivated) {
    return (
      <div className="flex items-center gap-3">
        <span className="flex-1 px-5 py-3 rounded-xl bg-emerald-500/10 text-emerald-300 text-sm font-medium border border-emerald-500/20 text-center">
          ✓ Activated this month
        </span>
      </div>
    );
  }

  if (!canAfford) {
    return (
      <div className="px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/30 text-sm text-center">
        Not enough credits — needs {creditsNeeded}, you have {creditsRemaining}
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="border border-gold/20 rounded-2xl p-5 bg-gold/[0.04] space-y-4">
        <div>
          <p className="text-sm font-semibold text-white mb-1">Confirm activation</p>
          <p className="text-sm text-white/50">
            Activating <strong className="text-white">{moduleName}</strong> will use{" "}
            <strong className="text-gold">{creditsNeeded} credit{creditsNeeded > 1 ? "s" : ""}</strong>{" "}
            ({tierCfg.label}) from your {creditsRemaining}-credit balance this month.
          </p>
          <p className="text-xs text-white/30 mt-2">
            We'll be in touch within 1–2 business days to kick things off.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleActivate}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {isPending ? "Activating…" : "Yes, activate"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="px-4 py-2.5 bg-white/[0.06] text-white/50 text-sm rounded-xl hover:bg-white/[0.1] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-full px-5 py-3 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
    >
      Activate this month
    </button>
  );
}

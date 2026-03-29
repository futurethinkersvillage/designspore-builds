"use client";

import { useState, useTransition } from "react";
import { cancelActivation } from "@/app/actions/modules";
import { useRouter } from "next/navigation";

export default function CancelActivationButton({
  moduleId,
  periodMonth,
}: {
  moduleId: string;
  periodMonth: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelActivation(moduleId, periodMonth);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  if (error) {
    return <span className="text-xs text-red-400">{error}</span>;
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/40">Remove?</span>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors disabled:opacity-50"
        >
          {isPending ? "Removing…" : "Yes, remove"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-white/30 hover:text-white transition-colors"
        >
          Keep
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-white/25 hover:text-red-400 transition-colors"
    >
      Cancel
    </button>
  );
}

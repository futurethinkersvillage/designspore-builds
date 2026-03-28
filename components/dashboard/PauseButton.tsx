"use client";

import { useState, useTransition } from "react";
import { pauseSubscription, unpauseSubscription } from "@/app/actions/account";

export default function PauseButton({ isPaused, isDemo }: { isPaused: boolean; isDemo: boolean }) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(isPaused);
  const [msg, setMsg] = useState<string | null>(null);

  function handle() {
    if (isDemo) { setMsg("Demo mode — changes are not saved."); return; }
    startTransition(async () => {
      const res = optimistic ? await unpauseSubscription() : await pauseSubscription();
      if (res.success) setOptimistic(!optimistic);
      setMsg(res.success ? res.message : (res as { error: string }).error);
    });
  }

  return (
    <div className="shrink-0 text-right space-y-1">
      <button
        onClick={handle}
        disabled={pending}
        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 ${
          optimistic
            ? "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20"
            : "bg-white/[0.06] text-white/50 hover:bg-white/[0.1] border border-white/[0.08]"
        }`}
      >
        {pending ? "…" : optimistic ? "Unpause" : "Pause plan"}
      </button>
      {msg && <p className="text-xs text-white/30">{msg}</p>}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { updateActivationStatus, addProgressUpdate } from "@/app/actions/admin";
import TierBadge from "./TierBadge";
import type { ModuleTier } from "@/lib/modules";

const NEXT_STATUSES: Record<string, string[]> = {
  pending:   ["active", "cancelled"],
  active:    ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

interface Props {
  activation: {
    id: string; status: string | null; periodMonth: string;
    progressUpdate: string | null; activatedAt: Date | null;
  };
  moduleName: string;
  tier: ModuleTier;
  clientName: string;
}

export default function AdminActivationRow({ activation, moduleName, tier, clientName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [localProgress, setLocalProgress] = useState(activation.progressUpdate ?? "");

  const status = activation.status ?? "pending";
  const nextStatuses = NEXT_STATUSES[status] ?? [];

  function changeStatus(newStatus: string) {
    startTransition(async () => {
      await updateActivationStatus(activation.id, newStatus as "active" | "completed" | "cancelled");
    });
  }

  function submitNote() {
    startTransition(async () => {
      await addProgressUpdate(activation.id, note);
      setLocalProgress(note);
      setNote("");
      setShowNote(false);
    });
  }

  return (
    <div className="bg-raised border border-white/[0.06] rounded-xl px-5 py-4 space-y-3">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {tier && <TierBadge tier={tier} />}
          <div>
            <p className="text-sm font-semibold text-white">{moduleName}</p>
            <p className="text-xs text-white/40">{clientName} · {activation.periodMonth}</p>
          </div>
        </div>

        {/* Status actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {nextStatuses.map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              disabled={isPending}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-50 capitalize
                bg-white/[0.05] border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.1]"
            >
              → {s}
            </button>
          ))}
          <button
            onClick={() => setShowNote((v) => !v)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gold/20 text-gold/60 hover:text-gold bg-gold/[0.05] hover:bg-gold/[0.1] transition-colors"
          >
            {showNote ? "Cancel" : "Add note"}
          </button>
        </div>
      </div>

      {/* Current progress update */}
      {localProgress && (
        <p className="text-xs text-emerald-300/70 bg-emerald-500/[0.06] border border-emerald-500/10 rounded-lg px-3 py-2">
          📝 {localProgress}
        </p>
      )}

      {/* Note input */}
      {showNote && (
        <div className="flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Client-visible progress update…"
            className="flex-1 bg-card border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2 placeholder-white/20 focus:outline-none focus:border-gold/40"
          />
          <button
            onClick={submitNote}
            disabled={!note.trim() || isPending}
            className="px-3 py-2 bg-gold text-dark text-xs font-semibold rounded-lg disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

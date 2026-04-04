"use client";

import { useState, useTransition } from "react";
import { respondToCustomModule } from "@/app/actions/admin";

interface Props {
  request: {
    id: string;
    description: string;
    createdAt: Date | null;
  };
  clientName: string;
  clientEmail: string;
}

export default function AdminCustomModuleRow({ request, clientName, clientEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [credits, setCredits] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function submit(status: "scoped" | "declined") {
    startTransition(async () => {
      await respondToCustomModule(
        request.id,
        status,
        response,
        status === "scoped" && credits ? parseInt(credits) : undefined
      );
      setDone(true);
    });
  }

  if (done) return null;

  return (
    <div className="bg-raised border border-purple-500/20 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-purple-300 font-semibold mb-1">{clientName} · {clientEmail}</p>
          <p className="text-sm text-white leading-relaxed">{request.description}</p>
          {request.createdAt && (
            <p className="text-xs text-white/25 mt-1">{new Date(request.createdAt).toLocaleDateString()}</p>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="shrink-0 px-3 py-1.5 text-xs border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
        >
          {open ? "Close" : "Respond"}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.06] pt-3 space-y-3">
          <div>
            <label className="text-xs text-white/40 block mb-1">Message to client</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={3}
              placeholder="e.g. This looks like a great fit — I'd estimate 2 credits for this. Want me to add it to your queue?"
              className="w-full bg-dark border border-white/[0.08] text-white text-sm rounded-xl px-3 py-2 placeholder-white/20 focus:outline-none focus:border-gold/50 resize-none"
            />
          </div>
          <div className="flex items-end gap-3">
            <div className="w-32">
              <label className="text-xs text-white/40 block mb-1">Credit estimate</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                min={1}
                max={20}
                placeholder="e.g. 2"
                className="w-full bg-dark border border-white/[0.08] text-white text-sm rounded-xl px-3 py-2 placeholder-white/20 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => submit("scoped")}
                disabled={isPending || !response.trim()}
                className="flex-1 px-3 py-2 bg-gold text-dark text-xs font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 transition-colors"
              >
                Send estimate
              </button>
              <button
                onClick={() => submit("declined")}
                disabled={isPending || !response.trim()}
                className="px-3 py-2 border border-white/[0.08] text-white/40 hover:text-white text-xs rounded-xl transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

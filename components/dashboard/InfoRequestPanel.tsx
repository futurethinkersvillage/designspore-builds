"use client";

import { useState, useTransition } from "react";
import { respondToInfoRequest } from "@/app/actions/requests";
import { useRouter } from "next/navigation";

type InfoRequest = {
  id: string;
  message: string;
  moduleId: string | null;
  dueDate: Date | null;
  createdAt: Date | null;
};

export default function InfoRequestPanel({
  requests,
  moduleNames,
}: {
  requests: InfoRequest[];
  moduleNames: Record<string, string>;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-white">Mike needs something from you</h2>
        <p className="text-sm text-white/40">Please respond so we can keep your projects moving.</p>
      </div>
      {requests.map((req) => (
        <InfoRequestCard key={req.id} request={req} moduleName={req.moduleId ? moduleNames[req.moduleId] : undefined} />
      ))}
    </section>
  );
}

function InfoRequestCard({ request, moduleName }: { request: InfoRequest; moduleName?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!response.trim()) return;
    startTransition(async () => {
      const result = await respondToInfoRequest(request.id, response);
      if (result.success) {
        setSubmitted(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl px-5 py-4">
        <p className="text-sm text-emerald-300">Response sent. Thanks!</p>
      </div>
    );
  }

  return (
    <div className="bg-raised border border-gold/20 rounded-xl px-5 py-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
          <span className="text-xs text-gold font-bold">M</span>
        </div>
        <div className="flex-1 min-w-0">
          {moduleName && (
            <p className="text-xs text-gold/60 mb-1">Re: {moduleName}</p>
          )}
          <p className="text-sm text-white">{request.message}</p>
          {request.dueDate && (
            <p className="text-xs text-white/30 mt-1">
              Needed by {new Date(request.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={3}
          placeholder="Your response…"
          className="w-full bg-dark border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 resize-none transition-colors"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isPending || !response.trim()}
          className="px-4 py-2 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {isPending ? "Sending…" : "Send Response"}
        </button>
      </form>
    </div>
  );
}

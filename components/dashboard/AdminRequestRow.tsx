"use client";

import { useState, useTransition } from "react";
import { updateChangeRequestStatus, generateTaskFile } from "@/app/actions/requests";
import { useRouter } from "next/navigation";

type Status = "new" | "in-review" | "in-progress" | "resolved" | "closed";

const STATUS_OPTIONS: Status[] = ["new", "in-review", "in-progress", "resolved", "closed"];

const STATUS_STYLES: Record<string, string> = {
  new:          "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  "in-review":  "bg-blue-500/10 text-blue-300 border-blue-500/20",
  "in-progress":"bg-purple-500/10 text-purple-300 border-purple-500/20",
  resolved:     "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  closed:       "bg-white/[0.06] text-white/30 border-white/[0.08]",
};

const PRIORITY_STYLES: Record<string, string> = {
  low:    "text-white/40",
  medium: "text-yellow-300",
  high:   "text-red-300 font-bold",
};

const TYPE_LABELS: Record<string, string> = {
  "content-change": "Content",
  "design-tweak":   "Design",
  "bug-issue":      "Bug",
  "new-feature":    "Feature",
};

export default function AdminRequestRow({
  request,
  clientName,
  clientEmail,
  moduleName,
}: {
  request: {
    id: string;
    type: string;
    priority: string;
    status: string;
    title: string;
    description: string;
    pageUrl: string | null;
    adminNotes: string | null;
    clientUpdate: string | null;
    taskFilePath: string | null;
    createdAt: Date | null;
  };
  clientName: string | null;
  clientEmail: string | null;
  moduleName?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<Status>(request.status as Status);
  const [clientUpdate, setClientUpdate] = useState(request.clientUpdate ?? "");
  const [adminNotes, setAdminNotes] = useState(request.adminNotes ?? "");
  const [saved, setSaved] = useState(false);
  const [taskMsg, setTaskMsg] = useState<string | null>(null);

  function handleSave() {
    startTransition(async () => {
      await updateChangeRequestStatus(request.id, status, clientUpdate, adminNotes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  }

  return (
    <div className={`bg-raised border rounded-xl transition-all ${
      request.priority === "high" ? "border-red-500/20" : "border-white/[0.06]"
    }`}>
      {/* Summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold ${PRIORITY_STYLES[request.priority] ?? ""}`}>
                {request.priority.toUpperCase()}
              </span>
              <span className="text-xs text-white/30">{TYPE_LABELS[request.type] ?? request.type}</span>
              {moduleName && <span className="text-xs text-gold/50">{moduleName}</span>}
            </div>
            <p className="text-sm font-medium text-white truncate">{request.title}</p>
            <p className="text-xs text-white/30 mt-0.5">
              {clientName ?? clientEmail} ·{" "}
              {new Date(request.createdAt!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border capitalize ${STATUS_STYLES[status]}`}>
              {status.replace("-", " ")}
            </span>
            <span className="text-white/30 text-sm">{expanded ? "▲" : "▼"}</span>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06] pt-4">
          <div>
            <p className="text-xs text-white/30 mb-1">Description</p>
            <p className="text-sm text-white/70 leading-relaxed">{request.description}</p>
            {request.pageUrl && (
              <a href={request.pageUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-gold/60 hover:text-gold transition-colors mt-1 block">
                {request.pageUrl}
              </a>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <p className="text-xs text-white/30">Status</p>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all capitalize ${
                    status === s ? STATUS_STYLES[s] : "border-white/[0.08] text-white/30 hover:text-white"
                  }`}
                >
                  {s.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Client update */}
          <div className="space-y-1">
            <p className="text-xs text-white/30">Update for client (visible to them)</p>
            <textarea
              value={clientUpdate}
              onChange={(e) => setClientUpdate(e.target.value)}
              rows={2}
              placeholder="E.g. Working on this now, expect it done by Friday…"
              className="w-full bg-dark border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 resize-none transition-colors"
            />
          </div>

          {/* Admin notes */}
          <div className="space-y-1">
            <p className="text-xs text-white/30">Internal notes (not visible to client)</p>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              placeholder="Notes for yourself or for agents…"
              className="w-full bg-dark border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 resize-none transition-colors"
            />
          </div>

          {/* Task file path */}
          {request.taskFilePath && (
            <p className="text-xs text-white/30 font-mono">{request.taskFilePath}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-4 py-2 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
            </button>
            <button
              onClick={() => {
                startTransition(async () => {
                  const res = await generateTaskFile(request.id);
                  setTaskMsg(res.success ? res.message : res.error);
                  setTimeout(() => setTaskMsg(null), 4000);
                  if (res.success) router.refresh();
                });
              }}
              disabled={isPending}
              className="px-4 py-2 border border-white/[0.08] text-white/50 hover:text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {request.taskFilePath ? "Regenerate task file" : "Generate task file"}
            </button>
            {taskMsg && <p className="text-xs text-white/50 font-mono">{taskMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

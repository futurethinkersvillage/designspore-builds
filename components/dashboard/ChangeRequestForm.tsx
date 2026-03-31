"use client";

import { useState, useTransition } from "react";
import { submitChangeRequest } from "@/app/actions/requests";
import { useRouter } from "next/navigation";

type ChangeType = "content-change" | "design-tweak" | "bug-issue" | "new-feature";
type Priority = "low" | "medium" | "high";

const TYPE_OPTIONS: { value: ChangeType; label: string; description: string }[] = [
  { value: "content-change", label: "Content Change", description: "Update text, images, or other content" },
  { value: "design-tweak", label: "Design Tweak", description: "Visual or layout adjustment" },
  { value: "bug-issue", label: "Bug / Issue", description: "Something is broken or not working" },
  { value: "new-feature", label: "New Feature", description: "Add new functionality" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-white/50 border-white/20 bg-white/[0.04]" },
  { value: "medium", label: "Medium", color: "text-yellow-300 border-yellow-500/30 bg-yellow-500/[0.06]" },
  { value: "high", label: "High", color: "text-red-300 border-red-500/30 bg-red-500/[0.06]" },
];

export default function ChangeRequestForm({
  activeModules,
  isDemo = false,
}: {
  activeModules: { id: string; name: string }[];
  isDemo?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<ChangeType>("content-change");
  const [priority, setPriority] = useState<Priority>("medium");
  const [moduleId, setModuleId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageUrl, setPageUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isDemo) return;
    setError(null);
    startTransition(async () => {
      const result = await submitChangeRequest({
        moduleId: moduleId || undefined,
        type,
        priority,
        title,
        description,
        pageUrl: pageUrl || undefined,
      });
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <div className="text-4xl">✓</div>
        <p className="text-xl font-semibold text-white">Request submitted</p>
        <p className="text-sm text-white/40">Mike will review it and get back to you shortly.</p>
        <button
          onClick={() => { setSubmitted(false); setTitle(""); setDescription(""); setPageUrl(""); }}
          className="mt-4 text-xs text-gold/60 hover:text-gold transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Type */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-white/30 font-semibold">
          Type of change
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                type === opt.value
                  ? "border-gold/40 bg-gold/[0.06] text-white"
                  : "border-white/[0.08] bg-raised text-white/60 hover:border-white/20 hover:text-white"
              }`}
            >
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs text-white/40 mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-white/30 font-semibold">
          Priority
        </label>
        <div className="flex gap-2">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPriority(opt.value)}
              className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all ${
                priority === opt.value ? opt.color : "border-white/[0.08] text-white/30 hover:text-white/60"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Related service (optional) */}
      {activeModules.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/30 font-semibold">
            Related service <span className="text-white/20 normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className="w-full bg-raised border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/30 transition-colors"
          >
            <option value="">Select a service…</option>
            {activeModules.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Page URL */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-white/30 font-semibold">
          Page URL <span className="text-white/20 normal-case tracking-normal font-normal">(if website-related)</span>
        </label>
        <input
          type="url"
          value={pageUrl}
          onChange={(e) => setPageUrl(e.target.value)}
          placeholder="https://yourdomain.com/specific-page"
          className="w-full bg-raised border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 transition-colors"
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-white/30 font-semibold">
          Title
        </label>
        <input
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of what you need…"
          className="w-full bg-raised border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 transition-colors"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-white/30 font-semibold">
          Description
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you'd like changed, why, and any relevant details…"
          rows={5}
          className="w-full bg-raised border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={isDemo || isPending || !title.trim() || !description.trim()}
        className="px-6 py-3 bg-gold text-dark font-semibold text-sm rounded-xl hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isDemo ? "Sign up to submit requests" : isPending ? "Submitting…" : "Submit Request"}
      </button>
    </form>
  );
}

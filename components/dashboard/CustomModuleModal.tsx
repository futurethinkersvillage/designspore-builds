"use client";

import { useState, useTransition, useRef } from "react";
import { submitCustomModule } from "@/app/actions/modules";

interface Props {
  onClose: () => void;
  onMatchFound: (moduleId: string, moduleName: string) => void;
}

export default function CustomModuleModal({ onClose, onMatchFound }: Props) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await submitCustomModule(description);
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (result.matched) {
        onMatchFound(result.moduleId, result.moduleName);
        return;
      }
      setSubmitted(true);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-card border border-white/[0.08] rounded-2xl p-8 space-y-6 shadow-2xl">
        {submitted ? (
          <>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto">
                <span className="text-gold text-xl">✓</span>
              </div>
              <h2 className="text-xl font-bold text-white">Request submitted.</h2>
              <p className="text-sm text-white/50 leading-relaxed">
                Mike will review it and get back to you with a credit estimate within 1–2 business days.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Request a custom service</h2>
              <p className="text-sm text-white/50 leading-relaxed">
                Don't see what you need? Describe it and Mike will evaluate it, estimate the credit cost, and get back to you. We can build almost anything.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                What do you want built?
              </label>
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="e.g. A chatbot for my website that can answer common questions about my services and pricing, and book consultations automatically…"
                className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors resize-none leading-relaxed"
              />
              <div className="flex justify-between">
                {error && <p className="text-xs text-red-400">{error}</p>}
                <p className="text-xs text-white/20 ml-auto">{description.length}/1000</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-sm text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending || description.trim().length < 20}
                className="flex-1 px-4 py-2.5 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 transition-colors"
              >
                {isPending ? "Checking…" : "Submit request →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

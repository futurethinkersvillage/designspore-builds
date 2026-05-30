"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Eye } from "@phosphor-icons/react";

type Status = "idle" | "sending" | "solved" | "wrong" | "error";

export function SolveForm({ word, hint }: { word: string; hint: string }) {
  const [answer, setAnswer] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || !email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/otherworld/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, answer, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) setStatus("solved");
      else if (res.status === 422) setStatus("wrong");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "solved") {
    return (
      <div className="rounded-2xl border border-amber/40 bg-amber/10 p-8 text-center">
        <CheckCircle weight="fill" size={44} className="mx-auto text-amber" />
        <h3 className="mt-4 font-serif text-2xl text-white">Solved.</h3>
        <p className="mt-2 text-white/70">
          Your camping code is on its way to{" "}
          <span className="text-amber">{email}</span>. Check your inbox (and your
          spam folder, just in case).
        </p>
        <p className="mt-4 text-sm text-white/50">
          See you on the land. Bring something to make.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="mb-2 block text-sm uppercase tracking-[0.2em] text-white/50">
          Your answer
        </label>
        <input
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (status === "wrong") setStatus("idle");
          }}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="what is it?"
          className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-lg text-white placeholder:text-white/30 focus:border-amber focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm uppercase tracking-[0.2em] text-white/50">
          Where do we send your code?
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="you@email.com"
          className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-lg text-white placeholder:text-white/30 focus:border-amber focus:outline-none"
        />
      </div>

      {status === "wrong" && (
        <p className="text-sm text-terracotta">
          Not quite. The forest keeps its secrets — try again.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-terracotta">
          Something went sideways on our end. Give it another go in a moment.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex items-center justify-center gap-2 rounded-full bg-amber px-7 py-4 font-medium text-warm-dark transition hover:brightness-110 disabled:opacity-50"
      >
        {status === "sending" ? "Checking…" : "Solve it"}
        {status !== "sending" && <ArrowRight weight="bold" size={18} />}
      </button>

      {hint && (
        <div className="text-center">
          {showHint ? (
            <p className="text-sm italic text-white/50">{hint}</p>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70"
            >
              <Eye size={15} /> Need a hint?
            </button>
          )}
        </div>
      )}
    </form>
  );
}

"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Eye, Sparkle } from "@phosphor-icons/react";

type Phase = "guess" | "email" | "done";

export function SolveForm({ word, hints }: { word: string; hints: string[] }) {
  const [answer, setAnswer] = useState("");
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("guess");
  const [busy, setBusy] = useState(false);
  // How many clues are revealed. Each wrong guess earns one; the visitor can
  // also ask for one without guessing.
  const [revealed, setRevealed] = useState(0);
  const [note, setNote] = useState<"" | "wrong" | "error" | "emailError">("");

  async function guess(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || busy) return;
    setBusy(true);
    setNote("");
    try {
      const res = await fetch("/api/otherworld/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, answer }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.correct) {
        setPhase("email");
      } else if (res.status === 422) {
        setRevealed((n) => Math.min(n + 1, hints.length)); // earn a clue
        setNote("wrong");
      } else {
        setNote("error");
      }
    } catch {
      setNote("error");
    } finally {
      setBusy(false);
    }
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setNote("");
    try {
      const res = await fetch("/api/otherworld/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, answer, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) setPhase("done");
      else setNote("emailError");
    } catch {
      setNote("emailError");
    } finally {
      setBusy(false);
    }
  }

  if (phase === "done") {
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

  if (phase === "email") {
    return (
      <form onSubmit={sendCode} className="flex flex-col gap-4">
        <div className="rounded-2xl border border-amber/40 bg-amber/10 p-6 text-center">
          <Sparkle weight="fill" size={32} className="mx-auto text-amber" />
          <h3 className="mt-3 font-serif text-2xl text-white">You cracked it.</h3>
          <p className="mt-1 text-sm text-white/60">
            Where should we send your free-camping code?
          </p>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="you@email.com"
          autoFocus
          className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-lg text-white placeholder:text-white/30 focus:border-amber focus:outline-none"
        />
        {note === "emailError" && (
          <p className="text-sm text-terracotta">
            That didn&apos;t send — check the address and try again.
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-full bg-amber px-7 py-4 font-medium text-warm-dark transition hover:brightness-110 disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send my code"}
          {!busy && <ArrowRight weight="bold" size={18} />}
        </button>
      </form>
    );
  }

  // phase === "guess"
  const allRevealed = revealed >= hints.length;
  return (
    <form onSubmit={guess} className="flex flex-col gap-4">
      <div>
        <label className="mb-2 block text-sm uppercase tracking-[0.2em] text-white/50">
          Your guess
        </label>
        <input
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (note === "wrong" || note === "error") setNote("");
          }}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="what is it?"
          className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-lg text-white placeholder:text-white/30 focus:border-amber focus:outline-none"
        />
      </div>

      {note === "wrong" && (
        <p className="text-sm text-terracotta">
          {allRevealed
            ? "Not quite. Sit with it — the answer is closer than it feels."
            : "Not quite — but here's a clue to bring you closer."}
        </p>
      )}
      {note === "error" && (
        <p className="text-sm text-terracotta">
          Something went sideways on our end. Give it another go in a moment.
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex items-center justify-center gap-2 rounded-full bg-amber px-7 py-4 font-medium text-warm-dark transition hover:brightness-110 disabled:opacity-50"
      >
        {busy ? "Checking…" : "Guess"}
        {!busy && <ArrowRight weight="bold" size={18} />}
      </button>

      {hints.length > 0 && (
        <div className="flex flex-col items-center gap-2 text-center">
          {hints.slice(0, revealed).map((h, i) => (
            <p key={i} className="text-sm italic text-white/60">
              <span className="not-italic text-amber/70">Clue {i + 1}:</span> {h}
            </p>
          ))}
          {!allRevealed && (
            <button
              type="button"
              onClick={() => setRevealed((n) => n + 1)}
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60"
            >
              <Eye size={14} /> Stuck? Reveal a clue
            </button>
          )}
        </div>
      )}
    </form>
  );
}

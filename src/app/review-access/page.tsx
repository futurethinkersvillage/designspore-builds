"use client";

import { useState, FormEvent } from "react";

// Says nothing about what's behind it: this file ships in the public JS bundle.
export default function ReviewAccessPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/review-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.assign("/prize-review");
        return;
      }
      setError("Incorrect password.");
      setPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <section className="flex min-h-[100dvh] items-center justify-center bg-warm-dark px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="mb-8 text-center font-serif text-4xl font-light text-white">Private</h1>
        <label htmlFor="password" className="block text-xs font-medium uppercase tracking-[0.15em] text-white/50">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white outline-none focus:border-amber/60"
        />
        {error && <p className="text-sm text-terracotta">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-xl bg-amber px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Checking…" : "Open"}
        </button>
      </form>
    </section>
  );
}

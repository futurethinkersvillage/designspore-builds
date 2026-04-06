"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/deck";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/investor-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[100dvh] bg-warm-dark flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo / Brand */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber mb-4">
            Investor Access
          </p>
          <h1 className="font-serif text-5xl font-light text-white">
            Portal<span className="italic text-amber">.Place</span>
          </h1>
          <p className="mt-3 text-sm text-white/40">
            This area is restricted to qualified investors.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-[0.15em] text-white/40 mb-2"
            >
              Access Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-white/20 text-sm outline-none transition-all focus:border-amber/60 focus:bg-white/8"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-terracotta"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl bg-amber px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying…" : "Access Investor Materials"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/25 leading-relaxed">
          Don&apos;t have access?{" "}
          <a
            href="mailto:contact@futurethinkers.org"
            className="text-white/40 underline underline-offset-2 hover:text-white/60 transition-colors"
          >
            Contact us
          </a>
          .
        </p>
      </motion.div>
    </section>
  );
}

export default function InvestorLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

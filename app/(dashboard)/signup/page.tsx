"use client";

import { useActionState } from "react";
import { signupWithCredentials } from "@/app/actions/auth";
import Link from "next/link";

const businessTypes = [
  { value: "trades", label: "Trades / Construction" },
  { value: "home-services", label: "Home Services" },
  { value: "medical", label: "Medical / Health" },
  { value: "legal", label: "Legal" },
  { value: "real-estate", label: "Real Estate" },
  { value: "consulting", label: "Consulting" },
  { value: "agencies", label: "Agency" },
  { value: "coaching", label: "Coaching" },
  { value: "e-commerce", label: "E-Commerce" },
  { value: "hospitality", label: "Hospitality" },
  { value: "b2b-services", label: "B2B Services" },
  { value: "other", label: "Other" },
];

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupWithCredentials, null);

  const isSuccess =
    state?.error?.startsWith("Account created") ?? false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-darker px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-3">
            Client Portal
          </p>
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-outfit, var(--font-sans))" }}
          >
            Request Access
          </h1>
          <p className="text-sm text-white/40">
            Submit your details and Mike will activate your account within 24 hours.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center bg-gold/10 border border-gold/20 rounded-xl p-6">
            <p className="text-gold font-semibold mb-1">Request received!</p>
            <p className="text-sm text-white/60">{state?.error}</p>
            <Link
              href="/login"
              className="inline-block mt-4 text-sm text-white/40 hover:text-white transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Jane Smith"
              />
              {state?.fieldErrors?.name && (
                <p className="text-xs text-red-400 mt-1">
                  {state.fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="you@example.com"
              />
              {state?.fieldErrors?.email && (
                <p className="text-xs text-red-400 mt-1">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="At least 8 characters"
              />
              {state?.fieldErrors?.password && (
                <p className="text-xs text-red-400 mt-1">
                  {state.fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Business Name
              </label>
              <input
                name="businessName"
                type="text"
                required
                className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Acme Plumbing"
              />
              {state?.fieldErrors?.businessName && (
                <p className="text-xs text-red-400 mt-1">
                  {state.fieldErrors.businessName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Business Type
              </label>
              <select
                name="businessType"
                required
                className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors appearance-none"
              >
                <option value="" disabled selected>
                  Select your industry
                </option>
                {businessTypes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {state?.fieldErrors?.businessType && (
                <p className="text-xs text-red-400 mt-1">
                  {state.fieldErrors.businessType}
                </p>
              )}
            </div>

            {state?.error && !isSuccess && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-gold text-dark text-sm font-semibold py-3 rounded-xl hover:bg-gold-light disabled:opacity-50 transition-colors"
            >
              {pending ? "Submitting…" : "Request Access"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-white/30 mt-6">
          Already have access?{" "}
          <Link
            href="/login"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

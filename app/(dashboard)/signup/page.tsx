"use client";

import { useState, useTransition } from "react";
import { signupAndCheckout } from "@/app/actions/auth";
import { PLANS } from "@/lib/subscription";
import Link from "next/link";
import { CardColumn } from "@/components/PromptGridBackground";

const PLAN_KEYS = ["starter", "growth", "scale"] as const;
type SignupPlan = typeof PLAN_KEYS[number];

const planColors: Record<SignupPlan, string> = {
  starter: "border-gold/40 ring-gold/10 text-gold",
  growth:  "border-blue-500/40 ring-blue-500/10 text-blue-300",
  scale:   "border-purple-500/40 ring-purple-500/10 text-purple-300",
};

const planBgSelected: Record<SignupPlan, string> = {
  starter: "bg-gold/[0.06]",
  growth:  "bg-blue-500/[0.06]",
  scale:   "bg-purple-500/[0.06]",
};

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
  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<SignupPlan>("starter");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    formData.set("plan", selectedPlan);
    startTransition(async () => {
      const result = await signupAndCheckout(formData);
      if (!result.success) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        if (result.error) setError(result.error);
        return;
      }
      window.location.href = result.checkoutUrl;
    });
  }

  return (
    <div className="h-screen flex bg-darker overflow-hidden">
      {/* Left cards */}
      <div className="hidden lg:block flex-1 min-w-0 pointer-events-none select-none">
        <CardColumn side="left" />
      </div>

      {/* Center form */}
      <div className="relative w-full max-w-2xl shrink-0 border-x border-white/[0.06] bg-darker overflow-y-auto">
        <div className="px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-3">
              Client Portal
            </p>
            <h1 className="text-3xl font-bold text-white mb-2">
              Get Started
            </h1>
            <p className="text-sm text-white/40">
              Choose a plan, create your account, and check out — you&apos;ll have access immediately after payment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Plan selector */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Choose your plan</p>
              <div className="space-y-2">
                {PLAN_KEYS.map((key) => {
                  const p = PLANS[key];
                  const isSelected = selectedPlan === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlan(key)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? `${planColors[key]} ring-1 ${planBgSelected[key]}`
                          : "border-white/[0.08] text-white/60 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? planColors[key] : "border-white/20"
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-current" />}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-white/70"}`}>
                              {p.label}
                            </p>
                            <p className="text-xs text-white/40 mt-0.5">{p.monthlyCredits} credits/mo</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-base font-bold tabular-nums ${isSelected ? planColors[key] : "text-white/40"}`}>
                            ${p.monthlyBudget.toLocaleString()}
                            <span className="text-xs font-normal text-white/30">/mo</span>
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-white/25">
                All plans include a one-time $500 onboarding fee (covers discovery, roadmap, and your website rebuild).
              </p>
            </div>

            {/* Account details */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">Your details</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Jane Smith"
                  />
                  {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Business Name</label>
                  <input
                    name="businessName"
                    type="text"
                    required
                    className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Acme Plumbing"
                  />
                  {fieldErrors.businessName && <p className="text-xs text-red-400 mt-1">{fieldErrors.businessName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="you@example.com"
                />
                {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="At least 8 characters"
                />
                {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Business Type</label>
                <select
                  name="businessType"
                  required
                  className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                >
                  <option value="" disabled>Select your industry</option>
                  {businessTypes.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {fieldErrors.businessType && <p className="text-xs text-red-400 mt-1">{fieldErrors.businessType}</p>}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gold text-dark text-sm font-semibold py-3.5 rounded-xl hover:bg-gold-light disabled:opacity-50 transition-colors"
            >
              {isPending ? "Setting up your account…" : `Continue to payment — ${PLANS[selectedPlan].label}`}
            </button>

            <p className="text-xs text-white/25 text-center">
              You&apos;ll be taken to Stripe to complete payment. Your portal opens immediately after.
            </p>
          </form>

          <p className="text-center text-sm text-white/30 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right cards */}
      <div className="hidden lg:block flex-1 min-w-0 pointer-events-none select-none">
        <CardColumn side="right" />
      </div>
    </div>
  );
}

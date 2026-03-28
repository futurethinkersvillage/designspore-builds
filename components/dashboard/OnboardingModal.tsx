"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "@/app/actions/account";
import { tierConfig, MONTHLY_CREDITS } from "@/lib/modules";

const STEPS = [
  {
    title: "Welcome to your portal.",
    body: "This is where you choose what gets built each month. You have a monthly credit allowance — spend it on the services that move your business forward.",
  },
  {
    title: "Pick your tier.",
    body: "Services come in three tiers — Flagship (full month), Core (2 per month), and Quick Win (up to 4 per month). Mix and match however you like within your credits.",
    visual: true,
  },
  {
    title: "Queue ahead.",
    body: "You can activate services for future months too — plan your next 3 months in one sitting so nothing slips through the cracks.",
  },
  {
    title: "We handle everything.",
    body: "Once you activate a service, our team gets notified immediately and reaches out within 1–2 business days. You'll see live updates right here.",
  },
];

export default function OnboardingModal({ userName }: { userName?: string | null }) {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function finish() {
    startTransition(async () => {
      await completeOnboarding();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-card border border-white/[0.08] rounded-2xl p-8 space-y-6 shadow-2xl">
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-gold" : "bg-white/[0.08]"}`} />
          ))}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">
            {step === 0 && userName ? `Welcome, ${userName.split(" ")[0]}.` : current.title}
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">{current.body}</p>

          {/* Tier visual on step 2 */}
          {current.visual && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {([1, 2, 3] as const).map((tier) => {
                const cfg = tierConfig[tier];
                const colorClass = tier === 1 ? "border-gold/20 text-gold" : tier === 2 ? "border-blue-500/20 text-blue-300" : "border-emerald-500/20 text-emerald-300";
                return (
                  <div key={tier} className={`border rounded-xl p-3 text-center ${colorClass}`}>
                    <p className="text-xs font-semibold">{cfg.label}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">
                      {cfg.credits === 4 ? "1/mo" : cfg.credits === 2 ? "2/mo" : "4/mo"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2.5 text-sm text-white/40 hover:text-white transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={isLast ? finish : () => setStep(s => s + 1)}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-gold text-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {isPending ? "…" : isLast ? "Get started →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

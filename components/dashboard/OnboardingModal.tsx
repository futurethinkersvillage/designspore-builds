"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "@/app/actions/account";
const STEPS = [
  {
    title: "Welcome to your portal.",
    body: "This is where you choose what gets built each month. You have a monthly credit allowance — spend it on the services that move your business forward.",
  },
  {
    title: "Services have a credit cost.",
    body: "Each service costs 1, 2, or 4 credits depending on scope. Mix and match however you like within your monthly allowance.",
    visual: true,
  },
  {
    title: "Queue ahead.",
    body: "You can activate services for future months too — plan your next 3 months in one sitting so nothing slips through the cracks.",
  },
  {
    title: "We handle everything.",
    body: "Once you activate a service, Mike gets notified immediately and reaches out within 1–2 business days. You'll see live updates right here in your portal.",
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
      <div className="relative w-full max-w-md bg-card border border-white/[0.08] rounded-2xl p-8 space-y-6 shadow-2xl">
        {/* Skip / close */}
        <button
          onClick={finish}
          disabled={isPending}
          className="absolute top-4 right-4 text-white/25 hover:text-white/60 transition-colors text-sm"
          aria-label="Skip tour"
        >
          Skip
        </button>

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

          {/* Credit cost examples on step 2 */}
          {current.visual && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {([
                { credits: 1, example: "Focused service", color: "border-emerald-500/20 text-emerald-300" },
                { credits: 2, example: "Standard service", color: "border-blue-500/20 text-blue-300" },
                { credits: 4, example: "Full build", color: "border-gold/20 text-gold" },
              ] as const).map(({ credits, example, color }) => (
                <div key={credits} className={`border rounded-xl p-3 text-center ${color}`}>
                  <p className="text-xs font-semibold">{credits} credit{credits > 1 ? "s" : ""}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{example}</p>
                </div>
              ))}
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

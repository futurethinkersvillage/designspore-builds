"use client";

import { useState, useTransition } from "react";
import { createCreditTopupCheckout } from "@/app/actions/account";

const PACKS = [
  { credits: 1 as const, label: "1 Quick Win", price: "$375", description: "One focused win added to this month" },
  { credits: 2 as const, label: "2 Core Credits", price: "$750", description: "Core-tier service or two quick wins" },
  { credits: 4 as const, label: "4 Credits", price: "$1,500", description: "Full month of capacity, one-time" },
];

export default function BuyCreditsButton({ isDemo }: { isDemo?: boolean }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto px-5 py-2.5 border border-gold/30 text-gold hover:bg-gold/[0.06] text-sm font-semibold rounded-xl transition-colors"
      >
        + Buy More Credits
      </button>
    );
  }

  return (
    <div className="bg-raised border border-white/[0.06] rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Buy More Credits</p>
        <button
          onClick={() => setOpen(false)}
          className="text-white/30 hover:text-white transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>
      <p className="text-xs text-white/40">
        Top up your allocation for this billing cycle. One-time charge — no subscription changes.
      </p>
      <div className="space-y-2">
        {PACKS.map((pack) => (
          <button
            key={pack.credits}
            disabled={isPending || isDemo}
            onClick={() => {
              if (isDemo) return;
              startTransition(() => createCreditTopupCheckout(pack.credits));
            }}
            className={`w-full flex items-center justify-between gap-4 p-4 border border-white/[0.08] hover:border-gold/30 hover:bg-gold/[0.03] rounded-xl text-left transition-all ${
              isPending || isDemo ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-white">{pack.label}</p>
              <p className="text-xs text-white/40">{pack.description}</p>
            </div>
            <span className="text-sm font-bold text-gold shrink-0">{pack.price}</span>
          </button>
        ))}
      </div>
      {isDemo && (
        <p className="text-xs text-white/30 text-center">Purchase disabled in demo mode.</p>
      )}
    </div>
  );
}

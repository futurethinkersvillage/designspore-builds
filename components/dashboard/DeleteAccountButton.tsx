"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/app/actions/account";
import { signOut } from "next-auth/react";

type Step = "idle" | "warn1" | "warn2" | "confirm";

export default function DeleteAccountButton() {
  const [step, setStep] = useState<Step>("idle");
  const [isPending, startTransition] = useTransition();

  if (step === "idle") {
    return (
      <button
        onClick={() => setStep("warn1")}
        className="text-sm text-red-400/50 hover:text-red-400 transition-colors"
      >
        Delete account
      </button>
    );
  }

  if (step === "warn1") {
    return (
      <div className="bg-red-500/[0.05] border border-red-500/20 rounded-2xl p-5 space-y-4">
        <p className="text-sm font-semibold text-red-400">Are you sure you want to delete your account?</p>
        <p className="text-xs text-white/50">
          This will permanently remove your account and cancel all pending services.
          Your website and AI systems will continue running until Mike is notified, but
          no further work will be scheduled.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setStep("warn2")}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
          >
            I understand, continue
          </button>
          <button
            onClick={() => setStep("idle")}
            className="px-4 py-2 text-sm text-white/40 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (step === "warn2") {
    return (
      <div className="bg-red-500/[0.05] border border-red-500/30 rounded-2xl p-5 space-y-4">
        <p className="text-sm font-semibold text-red-400">This cannot be undone.</p>
        <p className="text-xs text-white/50">
          All your data — activations, queue history, settings — will be permanently deleted.
          If you have an active subscription, please email{" "}
          <a href="mailto:hello@designspore.co" className="text-gold/60 hover:text-gold">
            hello@designspore.co
          </a>{" "}
          to cancel billing first.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setStep("confirm")}
            className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Yes, delete everything
          </button>
          <button
            onClick={() => setStep("idle")}
            className="px-4 py-2 text-sm text-white/40 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Final confirmation
  return (
    <div className="bg-red-500/[0.08] border border-red-500/40 rounded-2xl p-5 space-y-4">
      <p className="text-sm font-semibold text-red-300">Final confirmation — are you absolutely certain?</p>
      <p className="text-xs text-red-400/70">
        Clicking "Delete my account" below will immediately and permanently delete your account.
        There is no undo.
      </p>
      <div className="flex gap-3">
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await deleteAccount();
              await signOut({ callbackUrl: "/" });
            });
          }}
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-500 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Deleting…" : "Delete my account"}
        </button>
        <button
          onClick={() => setStep("idle")}
          className="px-4 py-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

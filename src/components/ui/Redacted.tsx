"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((r) => r.startsWith(name + "="))
      ?.split("=")[1] ?? null
  );
}

/* ─── NDA Modal ─────────────────────────────────────────────────── */
function NdaModal({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/investor-nda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      if (!res.ok) throw new Error("Server error");
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="font-serif text-2xl font-light text-gray-900 mb-1">
          Sign NDA to reveal
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          By providing your details you agree to keep this information
          confidential. We&apos;ll send a copy to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nda-name"
              className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="nda-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              autoComplete="name"
            />
          </div>

          <div>
            <label
              htmlFor="nda-email"
              className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="nda-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              autoComplete="email"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#EA824E] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Agree & Reveal Figures"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Redacted wrapper ──────────────────────────────────────────── */
export function Redacted({ children }: { children: React.ReactNode }) {
  const [signed, setSigned] = useState(true); // optimistic: assume signed until hydrated
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSigned(getCookie("investor_nda") === "1");

    const handler = () => setSigned(true);
    window.addEventListener("nda-signed", handler);
    return () => window.removeEventListener("nda-signed", handler);
  }, []);

  // Before hydration or when signed: render content normally
  if (!mounted || signed) return <>{children}</>;

  return (
    <>
      <span className="relative inline-block align-middle">
        {/* Blurred content — visible on print regardless */}
        <span
          aria-hidden="true"
          className="select-none blur-[5px] print:blur-none print:opacity-0"
        >
          {children}
        </span>
        {/* Screen-only unlock button overlay */}
        <span className="absolute inset-0 flex items-center justify-center print:hidden">
          <button
            onClick={() => setModalOpen(true)}
            className="rounded bg-gray-900/85 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm whitespace-nowrap hover:bg-gray-900 transition-colors"
          >
            🔒 Sign NDA
          </button>
        </span>
        {/* Print-only placeholder */}
        <span className="hidden print:inline text-gray-400 text-[10px] italic">
          [NDA Required]
        </span>
      </span>

      {mounted &&
        modalOpen &&
        createPortal(
          <NdaModal
            onSuccess={() => {
              setModalOpen(false);
              setSigned(true);
              window.dispatchEvent(new CustomEvent("nda-signed"));
            }}
            onClose={() => setModalOpen(false)}
          />,
          document.body
        )}
    </>
  );
}

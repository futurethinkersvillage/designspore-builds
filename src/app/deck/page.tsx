"use client";

import { useEffect, useRef } from "react";

/**
 * Investor deck — served as a self-contained static bundle at /deck-v2/index.html
 * (built from the wgv-deck2 project) and shown full-screen via iframe.
 * Gated by middleware (PROTECTED_PATHS includes "/deck", which also covers
 * "/deck-v2/*"). The membership pricing inside must never be public.
 */
export default function DeckPage() {
  const ref = useRef<HTMLIFrameElement>(null);

  // Focus the iframe so keyboard arrow navigation works immediately.
  useEffect(() => {
    const id = window.setTimeout(() => ref.current?.focus(), 200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <iframe
      ref={ref}
      src="/deck-v2/index.html"
      title="Portal.Place — Wells Gray Village · Investor Briefing"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        border: 0,
        background: "#0F0E12",
      }}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-screen wrapper for a self-contained static deck bundle (/deckN/index.html),
 * shown via iframe. Forwards the parent query string (?ref=, utm) into the iframe
 * so in-deck analytics can attribute engagement to the right Mission Control contact.
 * Gated + chrome-free via middleware. Membership pricing inside must not be public.
 */
export default function DeckFrame({ src }: { src: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [full, setFull] = useState(src);

  useEffect(() => {
    setFull(src + window.location.search);
    const id = window.setTimeout(() => ref.current?.focus(), 250);
    return () => window.clearTimeout(id);
  }, [src]);

  return (
    <iframe
      ref={ref}
      src={full}
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

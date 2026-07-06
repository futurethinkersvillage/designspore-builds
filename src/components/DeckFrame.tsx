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
    // carry the parent's ?query and #slide into the iframe so /deck#5 opens slide 5
    // (merge cleanly so a versioned src like ".../index.html?v=3" stays valid)
    const parentQuery = window.location.search.slice(1); // drop leading "?"
    const merged = parentQuery
      ? src + (src.includes("?") ? "&" : "?") + parentQuery
      : src;
    setFull(merged + window.location.hash);
    const id = window.setTimeout(() => ref.current?.focus(), 250);
    return () => window.clearTimeout(id);
  }, [src]);

  // Keep the shareable parent URL (portal.place/deck#N) in sync with the slide.
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data && e.data.t === "deckslide" && typeof e.data.n === "number") {
        history.replaceState(null, "", "#" + e.data.n);
      }
    }
    function onHash() {
      const n = parseInt(window.location.hash.slice(1)) || 1;
      ref.current?.contentWindow?.postMessage({ t: "deckgoto", n }, window.location.origin);
    }
    window.addEventListener("message", onMsg);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("message", onMsg);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

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

"use client";

/**
 * /map — full-screen interactive development map.
 *
 * The map itself is a self-contained Leaflet app served as a static asset at
 * /landmap/index.html (public/landmap/), embedded here via a full-bleed iframe.
 * This keeps the mapping stack (Leaflet + GeoJSON) fully isolated from the
 * Next.js/React render tree. The middleware tags /map as a full-screen route so
 * the global Nav/Footer/Chat are not rendered around it.
 *
 * We forward the parent query string + hash into the iframe so URL flags like
 * ?place / ?align and deep-links reach the inner app, and set allow="autoplay"
 * so the inner concept-video iframes can autoplay (nested-iframe permission).
 */
import { useEffect, useState } from "react";

export default function MapPage() {
  const [src, setSrc] = useState("/landmap/index.html");
  useEffect(() => {
    // forward parent query flags (?place/?align) + a cache-buster so the iframe
    // never serves a stale cached index.html, then the deep-link hash
    const params = new URLSearchParams(window.location.search);
    params.set("cb", String(Date.now()));
    setSrc("/landmap/index.html?" + params.toString() + window.location.hash);
  }, []);
  return (
    <iframe
      src={src}
      title="Wells Gray Golf & RV Resort — Development Map"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
}

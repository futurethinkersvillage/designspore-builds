"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline/next"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

const SCENE_URL = "https://prod.spline.design/wb5-rJ36pCqpK1Ur/scene.splinecode";

export default function SplineHero() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: loaded ? 1 : 0, transition: "opacity 1.2s ease" }}
      aria-hidden="true"
    >
      <Spline
        scene={SCENE_URL}
        onLoad={() => setLoaded(true)}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

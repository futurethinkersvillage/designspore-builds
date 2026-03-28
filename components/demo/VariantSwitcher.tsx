"use client";

import { useState, useEffect } from "react";
import DesignVariantA from "./DesignVariantA";
import DesignVariantB from "./DesignVariantB";
import type { DemoConfig } from "@/lib/demo-config";

type Config = DemoConfig & { address?: string; portalDemoUrl?: string; heroImageUrl?: string };

export default function VariantSwitcher({ config }: { config: Config }) {
  const [variant, setVariant] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("ds-variant");
    if (stored) {
      const v = parseInt(stored);
      setVariant(v);
      document.documentElement.dataset.theme = v === 3 ? "light" : "dark";
    }

    const handler = (e: Event) => {
      const v = (e as CustomEvent<number>).detail;
      setVariant(v);
      localStorage.setItem("ds-variant", String(v));
      document.documentElement.dataset.theme = v === 3 ? "light" : "dark";
    };

    window.addEventListener("ds-variant-change", handler);
    return () => window.removeEventListener("ds-variant-change", handler);
  }, []);

  if (variant === 2) return <DesignVariantB config={config} />;
  // Variant 3 = light mode — reuses Design A layout, theme applied via data-theme="light"
  return <DesignVariantA config={config} />;
}

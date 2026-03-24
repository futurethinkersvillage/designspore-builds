"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const variants = [
  { label: "A — Dark Editorial", href: "/variant-a" },
  { label: "B — Warm Light", href: "/variant-b" },
  { label: "C — Bold Type (active)", href: "/" },
];

export function VariantSwitcher() {
  const path = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 z-[9998] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/80 px-2 py-1.5 shadow-2xl backdrop-blur-md">
        <span className="px-3 text-[10px] font-medium uppercase tracking-widest text-white/30">
          Design
        </span>
        <div className="h-4 w-px bg-white/15" />
        {variants.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
              path === v.href
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

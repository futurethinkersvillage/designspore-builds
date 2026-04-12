"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on full-screen tour or dashboard
  if (pathname === "/tour" || pathname === "/investor-print" || pathname.startsWith("/village-dashboard")) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-amber/80 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-amber hover:scale-105 active:scale-95"
    >
      <ArrowUp size={16} weight="bold" />
    </button>
  );
}

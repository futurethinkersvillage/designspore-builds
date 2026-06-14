"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DotsThreeOutline, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "@/lib/data/dashboard/nav";

// The four sections surfaced directly in the bottom tab bar. Chosen to tell the
// smart-village story at a glance: overview, IoT, energy, community. Everything
// else lives one tap away under "More".
const primaryHrefs = ["/", "/farm", "/energy", "/members"];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Pathname is the rewritten internal path (/village-dashboard/...) on the
  // server but the short path (/ or /farm) in the browser via the subdomain
  // rewrite. Normalise to short form for comparison + href building.
  const isInternalPath = pathname.startsWith("/village-dashboard");
  const shortPathname = isInternalPath
    ? pathname.replace("/village-dashboard", "") || "/"
    : pathname;

  const isActive = (href: string) =>
    href === "/" ? shortPathname === "/" : shortPathname.startsWith(href);

  const buildHref = (href: string) => {
    if (!isInternalPath) return href;
    return href === "/" ? "/village-dashboard" : `/village-dashboard${href}`;
  };

  const primaryItems = primaryHrefs
    .map((h) => navItems.find((i) => i.href === h))
    .filter((i): i is (typeof navItems)[number] => Boolean(i));

  // "More" reads as active whenever the current page isn't a primary tab.
  const moreActive = !primaryHrefs.some((h) =>
    h === "/" ? shortPathname === "/" : shortPathname.startsWith(h)
  );

  return (
    <>
      {/* Bottom tab bar — mobile only */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.06] bg-warm-dark/90 backdrop-blur-xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5">
          {primaryItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={buildHref(item.href)}
                className="relative flex flex-col items-center justify-center gap-1 py-2.5"
              >
                {active && (
                  <motion.span
                    layoutId="bottomnav-active"
                    className="absolute top-0 h-[3px] w-8 rounded-full bg-amber"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative">
                  <Icon
                    size={22}
                    weight={active ? "fill" : "regular"}
                    className={active ? "text-amber" : "text-white/45"}
                  />
                  {item.badge && !active && (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-amber text-[9px] font-bold text-warm-dark leading-none">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10px] font-medium leading-none ${
                    active ? "text-amber" : "text-white/45"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More */}
          <button
            onClick={() => setMoreOpen(true)}
            className="relative flex flex-col items-center justify-center gap-1 py-2.5"
            aria-label="More sections"
          >
            {moreActive && (
              <motion.span
                layoutId="bottomnav-active"
                className="absolute top-0 h-[3px] w-8 rounded-full bg-amber"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <DotsThreeOutline
              size={22}
              weight={moreActive ? "fill" : "regular"}
              className={moreActive ? "text-amber" : "text-white/45"}
            />
            <span
              className={`text-[10px] font-medium leading-none ${
                moreActive ? "text-amber" : "text-white/45"
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* "More" bottom sheet — full section list */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="lg:hidden fixed bottom-0 inset-x-0 z-50 max-h-[80vh] overflow-y-auto scrollbar-subtle rounded-t-3xl border-t border-white/[0.08] bg-warm-dark"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
            >
              {/* Grab handle + header */}
              <div className="sticky top-0 bg-warm-dark px-5 pt-3 pb-3 z-10">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/15" />
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-serif font-semibold text-white">
                    All Sections
                  </h2>
                  <button
                    onClick={() => setMoreOpen(false)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Section grid */}
              <div className="grid grid-cols-3 gap-2 px-4 pt-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={buildHref(item.href)}
                      onClick={() => setMoreOpen(false)}
                      className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-4 text-center transition-colors ${
                        active
                          ? "border-amber/30 bg-amber/10"
                          : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <Icon
                        size={24}
                        weight={active ? "fill" : "regular"}
                        className={active ? "text-amber" : "text-white/55"}
                      />
                      <span
                        className={`text-[11px] font-medium leading-tight ${
                          active ? "text-amber" : "text-white/70"
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="absolute top-2 right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-amber/20 text-[9px] font-bold text-amber leading-none">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

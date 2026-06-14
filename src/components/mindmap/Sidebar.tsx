"use client";

import { useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkle, PlayCircle, BookOpen, ArrowUpRight } from "@phosphor-icons/react";
import { useMapStore } from "@/lib/mindmap/store";
import { CountUp } from "./CountUp";

// Panel content staggers in when a node opens.
const panelContainer = {
  hidden: { opacity: 0, x: 16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { when: "beforeChildren" as const, staggerChildren: 0.045, delayChildren: 0.03 },
  },
  exit: { opacity: 0, x: -12, transition: { duration: 0.15 } },
};
const panelItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 380, damping: 30 } },
};
// The header image zooms/settles in (reads like the photo expanding into the panel).
const imageItem = {
  hidden: { opacity: 0, scale: 1.14 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 30 } },
};

const OVERVIEW_STATS: { value: number; suffix?: string; prefix?: string; label: string }[] = [
  { value: 400, label: "acres owned" },
  { value: 5, suffix: "+", label: "years operating" },
  { value: 10, suffix: "M+", label: "podcast downloads" },
  { value: 6, prefix: "$", suffix: "M", label: "bridge round" },
];

export function Sidebar() {
  const hoveredId = useMapStore((s) => s.hoveredId);
  const selectedId = useMapStore((s) => s.selectedId);
  const map = useMapStore((s) => s.map);
  const openVideo = useMapStore((s) => s.openVideo);
  const setView = useMapStore((s) => s.setView);

  const selectedNode = useMemo(
    () => (selectedId ? map.nodes.find((n) => n.id === selectedId) : undefined),
    [map, selectedId],
  );
  // Only a clicked SUB-NODE (leaf) pins the panel and opens the wide drawer.
  // Branches stay hover-driven — clicking one just explores its sub-items.
  const pinnedLeafId = selectedNode?.kind === "leaf" ? selectedNode.id : null;
  const pinned = !!pinnedLeafId;
  // When a leaf is pinned, freeze the panel to it (hover no longer changes focus).
  // Otherwise hover drives it, falling back to the explored branch.
  const activeId = pinnedLeafId ?? hoveredId ?? selectedId;
  const node = useMemo(() => map.nodes.find((n) => n.id === activeId), [map, activeId]);

  const parent = useMemo(
    () => (node?.parentId ? map.nodes.find((n) => n.id === node.parentId) : undefined),
    [map, node],
  );

  // Re-fit the map after the drawer width transition settles.
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 320);
    return () => clearTimeout(t);
  }, [pinned]);

  const accent = node?.color ?? "#ea824e";

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col overflow-hidden border-l border-[#ea824e]/12 bg-[#161616]/90 backdrop-blur-md transition-[width] duration-300 ease-out ${
        pinned ? "w-[34vw] min-w-[420px]" : "w-[360px]"
      }`}
    >
      <div
        className="h-1 w-full transition-colors"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
      <AnimatePresence mode="wait">
        {!node ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center px-8 text-center"
          >
            <Sparkle size={34} weight="duotone" color="#ea824e" />
            {map.tagline && (
              <p className="mt-3 font-display text-[19px] italic leading-relaxed text-[#faf8f4]">
                {map.tagline}
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-[#b3a8aa]">
              Hover a branch to peek, or click it to rotate the map and explore its sub-items.
            </p>
            <div className="mt-8 grid w-full grid-cols-2 gap-3">
              {OVERVIEW_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-[#ea824e]/15 bg-white/[0.02] px-3 py-3"
                >
                  <CountUp
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    className="font-display text-3xl font-semibold text-[#f2a878]"
                  />
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wide text-[#b3a8aa]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            {map.walkthrough && (
              <button
                onClick={() => openVideo(map.walkthrough!.url, map.walkthrough!.title)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ea824e]/30 bg-[#ea824e]/10 px-4 py-3 text-[13px] font-medium text-[#f2a878] transition-colors hover:bg-[#ea824e]/20"
              >
                <PlayCircle size={18} weight="fill" /> Watch the 45-min walkthrough
              </button>
            )}
            <button
              onClick={() => setView("read")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] font-medium text-[#d8cfc8] transition-colors hover:border-[#ea824e]/30 hover:text-[#f2a878]"
            >
              <BookOpen size={18} weight="duotone" /> Read the full vision as a document
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={activeId}
            variants={panelContainer}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-1 flex-col overflow-y-auto px-6 py-5"
          >
            {node.image && (
              <motion.div
                variants={imageItem}
                className="relative mb-4 -mx-6 -mt-5 h-56 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={node.image}
                  alt={node.label}
                  className="h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none -mt-56 h-56"
                  style={{
                    background: `linear-gradient(180deg, transparent 40%, #161616 100%)`,
                  }}
                />
              </motion.div>
            )}
            <motion.div variants={panelItem}>
              {parent && node.kind === "leaf" && (
                <div className="mb-2 text-xs text-[#b3a8aa]">
                  in <span style={{ color: parent.color }}>{parent.label}</span>
                </div>
              )}
              <h2 className="font-display text-3xl font-semibold leading-tight text-[#faf8f4]">
                {node.label}
              </h2>
              {node.sublabel && (
                <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#b3a8aa]">
                  {node.sublabel}
                </div>
              )}
            </motion.div>

            {node.detail && (
              <motion.p
                variants={panelItem}
                className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#d8cfc8]"
              >
                {node.detail}
              </motion.p>
            )}
            {node.body &&
              node.body.split(/\n\n+/).map((para, i) => (
                <motion.p
                  key={i}
                  variants={panelItem}
                  className="mt-2.5 text-[12.5px] leading-relaxed text-[#b3a8aa]"
                >
                  {para}
                </motion.p>
              ))}

            {node.gallery && node.gallery.length > 0 && (
              <motion.div variants={panelItem} className="mt-4 grid grid-cols-2 gap-2">
                {node.gallery.map((src) => (
                  <div key={src} className="overflow-hidden rounded-lg border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-24 w-full object-cover" />
                  </div>
                ))}
              </motion.div>
            )}

            {node.moreLink && (
              <motion.a
                variants={panelItem}
                href={node.moreLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full border border-[#ea824e]/30 bg-[#ea824e]/10 px-3.5 py-1.5 text-[12px] font-medium text-[#f2a878] transition-colors hover:bg-[#ea824e]/20"
              >
                {node.moreLink.label}
                <ArrowUpRight size={13} weight="bold" />
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

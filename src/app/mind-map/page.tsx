"use client";

import "./mindmap.css";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react";
import { MindMapCanvas } from "@/components/mindmap/MindMapCanvas";
import { Sidebar } from "@/components/mindmap/Sidebar";
import { ReadView } from "@/components/mindmap/ReadView";
import { Toolbar } from "@/components/mindmap/Toolbar";
import { FundingSlider } from "@/components/mindmap/FundingSlider";
import { Loader } from "@/components/mindmap/Loader";
import { VideoModal } from "@/components/mindmap/VideoModal";
import { useMapStore } from "@/lib/mindmap/store";

/** Render the title with "Portal.Place" set in italic amber, matching the artifact. */
function renderTitle(title: string) {
  const token = "Portal.Place";
  const parts = title.split(token);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <em className="italic text-[#f2a878]">{token}</em>}
    </span>
  ));
}

export default function MindMapPage() {
  const map = useMapStore((s) => s.map);
  const view = useMapStore((s) => s.view);

  return (
    <MotionConfig reducedMotion="user">
      <div className="mindmap app-bg grain flex h-screen flex-col overflow-hidden text-[#faf8f4]">
        <Loader />
        <VideoModal />
        {/* Header */}
        <header className="z-10 flex items-center justify-between border-b border-[#ea824e]/12 bg-[#161616]/80 px-6 py-3 backdrop-blur-md">
          <div>
            <Link
              href="/"
              className="mb-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a7f86] transition-colors hover:text-[#f2a878]"
            >
              <ArrowLeft size={11} weight="bold" /> Portal.Place
            </Link>
            <h1 className="font-display text-2xl font-medium leading-tight text-[#faf8f4]">
              {renderTitle(map.title)}
            </h1>
          </div>
          <Toolbar />
        </header>

        {/* Body */}
        <div className="flex min-h-0 flex-1">
          <main className="relative min-w-0 flex-1">
            {/* Map stays mounted (so it doesn't re-bloom on every toggle); the Read
                view crossfades over it. */}
            <MindMapCanvas />
            {view === "map" && (
              <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2">
                <FundingSlider />
              </div>
            )}
            <AnimatePresence>
              {view === "read" && (
                <motion.div
                  key="read"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="app-bg absolute inset-0 z-20 overflow-hidden"
                >
                  <ReadView />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          {view === "map" && <Sidebar />}
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-center gap-1 border-t border-[#ea824e]/12 bg-[#161616]/80 px-6 py-2 backdrop-blur-md">
          {map.footerLead && (
            <div className="text-[11px] italic text-[#8a7f86]">{map.footerLead}</div>
          )}
          <div className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ea824e]/70">
            {map.entities?.map((e, i) => (
              <span key={e} className="flex items-center gap-2">
                {i > 0 && <span className="text-[#ea824e]/40">·</span>}
                <span>{e}</span>
              </span>
            ))}
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}

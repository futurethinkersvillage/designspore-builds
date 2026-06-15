"use client";

import "@/app/mind-map/mindmap.css";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { ArrowRight, ArrowsOut } from "@phosphor-icons/react";
import { MindMapCanvas } from "@/components/mindmap/MindMapCanvas";
import { Sidebar } from "@/components/mindmap/Sidebar";
import { ReadView } from "@/components/mindmap/ReadView";
import { Toolbar } from "@/components/mindmap/Toolbar";
import { FundingSlider } from "@/components/mindmap/FundingSlider";
import { VideoModal } from "@/components/mindmap/VideoModal";
import { useMapStore } from "@/lib/mindmap/store";

/** The Portal.Place vision mind map, embedded inline in the homepage between the
 *  hero/marquee and the trailer. Fully interactive (zoom via controls / pinch);
 *  page scroll passes through. A fullscreen escape hatch links to /mind-map. */
export function VisionMapSection() {
  const view = useMapStore((s) => s.view);

  return (
    <section className="bg-warm-dark py-20 lg:py-28">
      <div className="mx-auto max-w-[1500px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[760px] px-6 text-center"
        >
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-amber">
            The whole picture
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Explore the <span className="italic">Vision.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[56ch] text-[15px] leading-relaxed text-white/65 lg:mt-8 lg:text-sm lg:text-white/60">
            Eight branches, one village. Click any branch to dig in — or drag through the
            funding phases to see what exists today versus the full vision.
          </p>
        </motion.div>
      </div>

      {/* Interactive map (desktop / tablet) — full-bleed, edge to edge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-12 hidden lg:block"
      >
        <div className="mindmap app-bg grain relative overflow-hidden border-y border-[#ea824e]/15 text-[#faf8f4]">
            <MotionConfig reducedMotion="user">
              <VideoModal />

              {/* Top bar: search + Map/Read toggle, plus a fullscreen link */}
              <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-4 py-3">
                <Link
                  href="/mind-map"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#ea824e]/25 bg-[#161616]/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#b3a8aa] backdrop-blur-md transition-colors hover:border-[#ea824e]/50 hover:text-[#f2a878]"
                >
                  <ArrowsOut size={12} weight="bold" /> Fullscreen
                </Link>
                <Toolbar />
              </div>

              {/* Body: canvas + funding rail + sidebar */}
              <div className="relative flex h-[78vh] max-h-[820px] min-h-[560px]">
                <main className="relative min-w-0 flex-1">
                  <MindMapCanvas embedded />
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
            </MotionConfig>
          </div>
        </motion.div>

        {/* Mobile: a teaser that opens the full interactive map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-10 max-w-[640px] px-6 lg:hidden"
        >
          <Link
            href="/mind-map"
            className="group block overflow-hidden rounded-3xl border border-[#ea824e]/20 bg-[#101010] p-8 text-center"
          >
            <p className="font-serif text-2xl font-light italic text-white">
              The interactive vision map
            </p>
            <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-white/60">
              Best explored full-screen — eight branches you can open, with a slider that
              reveals each phase of the build.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-medium text-white transition-all group-active:scale-[0.98]">
              Open the map
              <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMapStore } from "@/lib/mindmap/store";
import { statusForTier } from "@/lib/mindmap/status";
import type { MapNode } from "@/lib/mindmap/types";
import { CountUp } from "./CountUp";

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`;
}
function tierLabel(t: number) {
  return t >= 50 ? "$50M+" : `$${t}M`;
}

const STATS = [
  { value: 400, label: "acres owned" },
  { value: 5, suffix: "+", label: "years operating" },
  { value: 10, suffix: "M+", label: "podcast downloads" },
  { value: 6, prefix: "$", suffix: "M", label: "bridge round" },
];

const CLOSERS: { title: string; body: string }[] = [
  {
    title: "Roadmap",
    body: "Phase 1 — complete (land + core infrastructure, operating 5+ years). $6M bridge (Phase 2) — larger maker space, residency program, community center, gazebo → coworking/café, long-term 50-amp RV sites, secure land, Phase 3 prep. $20M (Phase 3) — residential housing, second property, regenerative farm, network marketing. $50M+ — full network: forest-school campus, Village Stack rollout, consulting & licensing across regions.",
  },
  {
    title: "Business model",
    body: "Memberships (~$48/mo) · stays & programs (immersions from $2,200/mo, forest school $495–$595/mo, retreats, festivals, work-stays) · local fabrication (CNC cabins & tiny homes) · glamping/cabin partnerships · Village Stack as a licensable tech layer · Smart Village consulting · Design Spore AI + media services.",
  },
  {
    title: "Team & partners",
    body: "Mike Gilliland (Strategy & Media) and Euvie Ivanova (Programs & Culture), founders of Future Thinkers; seasonal team of 6–20. Partners: Carbide 3D, xTool (CNC/laser), HypeDome (geodesic), The Bunkie / CabinCo (prefab).",
  },
];

/** Branch banner with scroll-linked parallax on the photo. */
function BranchBanner({
  b,
  i,
  scrollRef,
}: {
  b: MapNode;
  i: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollRef,
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-26, 26]);
  const status = statusForTier(b.tier ?? 3);
  const accent = b.color ?? "#ea824e";

  return (
    <div
      ref={ref}
      className="relative h-44 w-full overflow-hidden rounded-2xl"
      style={{ border: `1px solid ${hexA(accent, 0.3)}` }}
    >
      {b.image && (
        <motion.img
          src={b.image}
          alt={b.label}
          style={{ y }}
          className="absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 20%, rgba(23,20,29,0.65) 60%, #161616 100%)`,
        }}
      />
      <div className="absolute bottom-0 left-0 p-5">
        <div className="mb-1 flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide"
            style={{ background: hexA(accent, 0.9), color: "#1a1720" }}
          >
            {b.sublabel}
          </span>
          <span
            className="flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide"
            style={{ background: hexA(status.color, 0.18), color: status.color }}
          >
            {status.label} · {status.phase} · {tierLabel(b.tier ?? 3)}
          </span>
        </div>
        <h2 className="font-display text-3xl font-semibold text-[#faf8f4]">
          {String(i + 1).padStart(2, "0")} · {b.label}
        </h2>
      </div>
    </div>
  );
}

export function ReadView() {
  const map = useMapStore((s) => s.map);
  const branches = map.nodes.filter((n) => n.kind === "branch");
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-8 py-12">
        {/* Header */}
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#ea824e]/90">
          {map.eyebrow}
        </div>
        <h1 className="mt-2 font-display text-5xl font-medium leading-tight text-[#faf8f4]">
          The <em className="italic text-[#f2a878]">Portal.Place</em> Vision
        </h1>
        {map.tagline && (
          <p className="mt-3 max-w-2xl font-display text-[19px] italic leading-relaxed text-[#b3a8aa]">
            {map.tagline}
          </p>
        )}

        {/* The Ask */}
        <div className="mt-6 rounded-2xl border border-[#ea824e]/25 bg-[#ea824e]/[0.06] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ea824e]">
            The ask — live round
          </div>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#d8cfc8]">
            <span className="font-display text-xl font-semibold text-[#f2a878]">
              $6M bridge round
            </span>{" "}
            — secured by land, 5 years operating, led by proven founders. The $3M near-term
            milestone secures the land, funds Phase 3 permitting, and builds the maker space for
            cabin manufacturing and the artist residency.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3 text-center"
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

        {/* Branches */}
        <div className="mt-12 space-y-12">
          {branches.map((b, i) => {
            const leaves = map.nodes.filter((l) => l.parentId === b.id);
            return (
              <motion.section
                key={b.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", stiffness: 240, damping: 28 }}
              >
                {/* Branch banner with parallax */}
                <BranchBanner b={b} i={i} scrollRef={scrollRef} />

                {b.detail && (
                  <p className="mt-4 text-[15px] leading-relaxed text-[#d8cfc8]">{b.detail}</p>
                )}

                {/* Sub-items with writeups */}
                <div className="mt-5 space-y-4">
                  {leaves.map((l) => (
                    <div
                      key={l.id}
                      className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.015] p-3"
                    >
                      {l.image && (
                        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={l.image} alt={l.label} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div
                          className="font-display text-[17px] font-semibold leading-tight"
                          style={{ color: "#faf8f4" }}
                        >
                          {l.label}
                        </div>
                        {(l.body ?? l.detail ?? "").split(/\n\n+/).map((para, i) => (
                          <p key={i} className="mt-1.5 text-[12.5px] leading-relaxed text-[#b3a8aa]">
                            {para}
                          </p>
                        ))}
                        {l.moreLink && (
                          <a
                            href={l.moreLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-[11.5px] font-medium text-[#f2a878] hover:underline"
                          >
                            {l.moreLink.label} ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Closing sections */}
        <div className="mt-14 space-y-7 border-t border-white/10 pt-10">
          {CLOSERS.map((c) => (
            <div key={c.title}>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ea824e]">
                {c.title}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-[#d8cfc8]">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#ea824e]/70">
          {map.entities?.join(" · ")}
        </div>
      </div>
    </div>
  );
}

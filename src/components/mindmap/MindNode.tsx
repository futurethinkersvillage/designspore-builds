"use client";

import { memo, useRef, useState, useEffect } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";
import {
  Mountains,
  Users,
  Cpu,
  ShareNetwork,
  Hammer,
  GraduationCap,
  Robot,
  Compass,
  Campfire,
  House,
  CaretRight,
  LockSimple,
  type Icon,
} from "@phosphor-icons/react";
import type { MindNodeData } from "@/lib/mindmap/layout";

const ICONS: Record<string, Icon> = {
  mountains: Mountains,
  users: Users,
  cpu: Cpu,
  share: ShareNetwork,
  hammer: Hammer,
  graduation: GraduationCap,
  robot: Robot,
  compass: Compass,
  campfire: Campfire,
  house: House,
};

const hiddenHandle = "!h-1.5 !w-1.5 !min-w-0 !border-0 !bg-transparent !opacity-0";

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function tierLabel(t: number) {
  return t >= 50 ? "$50M+" : `$${t}M`;
}

function MindNodeComponent({ data }: NodeProps) {
  const { node, dimmed, highlighted, tier, funded, appearDelay } = data as MindNodeData;
  const color = node.color ?? "#ea824e";
  const IconCmp = node.icon ? ICONS[node.icon] : undefined;

  // One-shot entrance: the constellation "blooms" out from the core on mount.
  // After the entrance settles, drop the delay so hover/tap stay snappy.
  const enteredRef = useRef(false);
  const markEntered = () => {
    enteredRef.current = true;
  };
  const enterDelay = enteredRef.current ? 0 : appearDelay ?? 0;

  // Funding "unlock" ripple: flash a glow when this node crosses from
  // unfunded → funded (i.e., the funding slider rises past its tier).
  const prevFunded = useRef(funded);
  const [rippleKey, setRippleKey] = useState(0);
  useEffect(() => {
    if (funded && !prevFunded.current) setRippleKey((k) => k + 1);
    prevFunded.current = funded;
  }, [funded]);
  const ripple = rippleKey > 0 && (
    <motion.span
      key={rippleKey}
      className="pointer-events-none absolute inset-0 z-10"
      initial={{ opacity: 0.45 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ background: `radial-gradient(circle, ${hexA(color, 0.55)}, transparent 70%)` }}
    />
  );

  // Combined opacity: locked (unfunded) wins, then focus-dimming, else full.
  const nodeOpacity = !funded ? 0.26 : dimmed ? 0.34 : 1;
  const nodeFilter = !funded ? "grayscale(0.7)" : "none";

  const Handles = (
    <>
      <Handle type="target" position={Position.Top} className={hiddenHandle} />
      <Handle type="source" position={Position.Bottom} className={hiddenHandle} />
    </>
  );

  const baseTransition = { type: "spring" as const, stiffness: 300, damping: 24 };

  if (node.kind === "root") {
    return (
      <motion.div
        className="relative flex h-[164px] w-[164px] flex-col items-center justify-center rounded-full text-center"
        initial={{ scale: 0.5 }}
        animate={{
          scale: highlighted ? 1.06 : 1,
          opacity: nodeOpacity,
        }}
        whileTap={{ scale: 0.95 }}
        onAnimationComplete={markEntered}
        transition={{ ...baseTransition, delay: enterDelay }}
        style={{
          filter: nodeFilter,
          background:
            "radial-gradient(circle at 50% 40%, rgba(244,178,132,0.95), rgba(234,130,78,0.82) 55%, rgba(175,105,94,0.55))",
          boxShadow: `0 0 60px 6px ${hexA(color, highlighted ? 0.7 : 0.45)}, inset 0 0 24px rgba(255,255,255,0.25)`,
          border: "1px solid rgba(255,255,255,0.35)",
        }}
      >
        {/* Pulsing aura (CSS animation — compositor-friendly, doesn't block screenshots) */}
        <span
          className="aura-pulse pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 0 1px ${hexA(color, 0.5)}` }}
        />
        {IconCmp && <IconCmp size={33} weight="duotone" color="#1a1720" />}
        <div className="mt-1 font-display text-[23px] font-semibold leading-tight text-[#1a1720]">
          {node.label}
        </div>
        {node.sublabel && (
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2a1a14]">
            {node.sublabel}
          </div>
        )}
        {Handles}
      </motion.div>
    );
  }

  if (node.kind === "branch") {
    return (
      <motion.div
        className="relative flex h-[170px] w-[276px] cursor-pointer flex-col overflow-hidden rounded-2xl"
        initial={{ scale: 0.62 }}
        animate={{
          scale: highlighted ? 1.04 : 1,
          y: highlighted ? -5 : 0,
          opacity: nodeOpacity,
          boxShadow: highlighted
            ? `0 16px 40px ${hexA(color, 0.5)}`
            : `0 6px 22px rgba(0,0,0,0.45)`,
        }}
        whileTap={{ scale: 0.97 }}
        onAnimationComplete={markEntered}
        transition={{ ...baseTransition, delay: enterDelay }}
        style={{
          filter: nodeFilter,
          background: "rgba(16,18,12,0.92)",
          border: `1px solid ${hexA(color, highlighted ? 0.95 : 0.45)}`,
        }}
      >
        {/* Image header */}
        <div className="relative h-[88px] w-full shrink-0 overflow-hidden">
          {node.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={node.image}
              alt={node.label}
              className="h-full w-full object-cover"
              draggable={false}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${hexA(color, 0.1)} 0%, rgba(16,18,12,0.15) 45%, rgba(16,18,12,0.96) 100%)`,
            }}
          />
          {/* Tier chip */}
          <div
            className="absolute right-2 top-2 flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[8px] font-semibold tracking-wide"
            style={{
              background: funded ? hexA(color, 0.95) : "rgba(20,22,16,0.9)",
              color: funded ? "#1a1720" : hexA(color, 0.98),
              border: `1px solid ${hexA(color, 0.6)}`,
            }}
          >
            {!funded && <LockSimple size={8} weight="bold" />}
            {tierLabel(tier)}
          </div>
        </div>

        {/* Text body: icon + title, vertically centered in the remaining space */}
        <div className="flex flex-1 items-center gap-2.5 px-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md"
            style={{ background: hexA(color, 0.95) }}
          >
            {IconCmp && <IconCmp size={24} weight="duotone" color="#1a1720" />}
          </div>
          <div className="min-w-0">
            <div className="line-clamp-2 font-display text-[20px] font-semibold leading-[1.1] text-[#faf8f4]">
              {node.label}
            </div>
            {node.sublabel && (
              <div className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-[#b3a8aa]">
                {node.sublabel}
              </div>
            )}
          </div>
        </div>

        {/* Subtle "open" affordance, brightening on hover. */}
        <motion.div
          className="absolute bottom-2 right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full"
          style={{ background: hexA(color, highlighted ? 0.95 : 0.4), color: "#1a1720" }}
          animate={{ scale: highlighted ? 1 : 0.85 }}
          transition={baseTransition}
        >
          <CaretRight size={12} weight="bold" />
        </motion.div>
        {ripple}
        {Handles}
      </motion.div>
    );
  }

  return null;
}

export const MindNode = memo(MindNodeComponent);

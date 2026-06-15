"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  useReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMapStore } from "@/lib/mindmap/store";
import { computeLayout, fitTargets } from "@/lib/mindmap/layout";
import { MindNode } from "./MindNode";
import { RadialEdge } from "./RadialEdge";

const nodeTypes = { mind: MindNode };
const edgeTypes = { radial: RadialEdge };

interface FlowProps {
  /** Embedded in a scrolling page: let the wheel scroll the page (zoom via
   *  controls / pinch) instead of trapping scroll to zoom the canvas. */
  embedded?: boolean;
}

function Flow({ embedded = false }: FlowProps) {
  const map = useMapStore((s) => s.map);
  const hoveredId = useMapStore((s) => s.hoveredId);
  const selectedId = useMapStore((s) => s.selectedId);
  const query = useMapStore((s) => s.query);
  const funding = useMapStore((s) => s.funding);

  const setHovered = useMapStore((s) => s.setHovered);
  const selectNode = useMapStore((s) => s.selectNode);

  const rf = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Hide the canvas until the first successful fit so the unfitted (top-left)
  // state is never visible.
  const [fitted, setFitted] = useState(false);

  const { nodes, edges } = useMemo(
    () => computeLayout(map, { hoveredId, selectedId, funding }),
    [map, hoveredId, selectedId, funding],
  );

  // Stable signal for the *set* of visible nodes (mount + explore/collapse).
  const nodeIdsKey = nodes.map((n) => n.id).join(",");

  // Center + size the constellation in whatever space the container currently
  // has. Bounds come from getNodesBounds (explicit node dims), with the left
  // padded for the funding rail and the bottom for clearance.
  const doFit = useCallback(
    (duration: number) => {
      const el = wrapperRef.current;
      // Skip until the container actually has a size — otherwise the fit lands
      // at the top-left origin (the embed measures its height/width late).
      if (!el || el.clientWidth === 0 || el.clientHeight === 0) return;
      const ids = new Set(fitTargets(map));
      const target = rf.getNodes().filter((n) => ids.has(n.id));
      if (target.length === 0) return;
      const raw = rf.getNodesBounds(target);
      if (!Number.isFinite(raw.width) || raw.width === 0) return;
      const railPad = 290;
      const bottomPad = 24;
      rf.fitBounds(
        { x: raw.x - railPad, y: raw.y, width: raw.width + railPad, height: raw.height + bottomPad },
        { duration, padding: 0.04 },
      );
      setFitted(true);
    },
    [map, rf],
  );

  // Re-fit on mount, when the node set changes, whenever the container resizes,
  // and — crucially for the embed — when it scrolls into view. We deliberately do
  // NOT gate on useNodesInitialized: the layout sets explicit node width/height,
  // so React Flow skips DOM measurement and `nodesInitialized` never flips true
  // in production builds. getNodesBounds works from the explicit dims, so doFit
  // self-guards on container size + node presence instead.
  useEffect(() => {
    const timers = [0, 120, 450, 900, 1600].map((ms, i) =>
      setTimeout(() => doFit(i === 0 ? 0 : 350), ms),
    );
    const ro = new ResizeObserver(() => doFit(200));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && doFit(300)),
      { threshold: 0.1 },
    );
    if (wrapperRef.current) {
      ro.observe(wrapperRef.current);
      io.observe(wrapperRef.current);
    }
    const onResize = () => doFit(200);
    window.addEventListener("resize", onResize);
    // Safety net: never leave the canvas hidden even if every fit attempt bailed.
    const reveal = setTimeout(() => setFitted(true), 1800);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(reveal);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [nodeIdsKey, doFit]);

  // Search: select the matching branch so its panel opens.
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = map.nodes.find(
      (n) =>
        n.kind === "branch" &&
        (n.label.toLowerCase().includes(q) ||
          n.sublabel?.toLowerCase().includes(q) ||
          n.detail?.toLowerCase().includes(q) ||
          n.bullets?.some((b) => b.toLowerCase().includes(q))),
    );
    if (match) selectNode(match.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, map]);

  const onNodeClick: NodeMouseHandler = (_e, node) => {
    const n = map.nodes.find((x) => x.id === node.id);
    if (!n) return;
    // Click a branch to open its panel (toggle); click the core to clear focus.
    if (n.kind === "branch") selectNode(selectedId === n.id ? null : n.id);
    else selectNode(null);
  };

  return (
    <div
      ref={wrapperRef}
      className="h-full w-full"
      style={{ opacity: fitted ? 1 : 0, transition: "opacity 0.45s ease" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={(_e, n) => setHovered(n.id)}
        onNodeMouseLeave={() => setHovered(null)}
        onPaneClick={() => {
          // Clicking empty space clears the focused branch (back to the overview).
          selectNode(null);
          setHovered(null);
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        zoomOnScroll={!embedded}
        preventScrolling={!embedded}
        minZoom={0.2}
        maxZoom={2.2}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        {/* Render only after the first fit — before the viewport is sized the
            dots pattern computes NaN coordinates (harmless dev warnings). */}
        {fitted && (
          <Background
            variant={BackgroundVariant.Dots}
            gap={28}
            size={1}
            color="rgba(234,130,78,0.10)"
          />
        )}
        <Controls
          showInteractive={false}
          className="!border-none !bg-[#232323]/80 !shadow-lg [&_button]:!border-[#ea824e]/20 [&_button]:!bg-[#272727] [&_button]:!fill-[#ea824e] [&_button:hover]:!bg-[#313131]"
        />
      </ReactFlow>
    </div>
  );
}

export function MindMapCanvas({ embedded = false }: FlowProps) {
  return (
    <ReactFlowProvider>
      <Flow embedded={embedded} />
    </ReactFlowProvider>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  useReactFlow,
  useNodesInitialized,
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
  const nodesInitialized = useNodesInitialized();

  const { nodes, edges } = useMemo(
    () => computeLayout(map, { hoveredId, selectedId, funding }),
    [map, hoveredId, selectedId, funding],
  );

  // Stable signal for the *set* of visible nodes (mount + explore/collapse).
  const nodeIdsKey = nodes.map((n) => n.id).join(",");

  // Fit the viewport on mount and whenever the explored branch changes. Bounds
  // come from explicit node dimensions via getNodesBounds + fitBounds, which do
  // NOT depend on the ResizeObserver (robust on first paint).
  useEffect(() => {
    // Wait until React Flow has measured the nodes — in embedded / late-sized
    // containers the fixed-delay retries can all fire before measurement.
    if (!nodesInitialized) return;
    const ids = new Set(fitTargets(map));
    const target = nodes.filter((n) => ids.has(n.id));
    if (target.length === 0) return;
    const raw = rf.getNodesBounds(target);
    // Reserve space on the LEFT for the funding rail (shifts content right) and a
    // little bottom clearance, so the whole constellation reads large and legible.
    const railPad = 290;
    const bottomPad = 24;
    const bounds = {
      x: raw.x - railPad,
      y: raw.y,
      width: raw.width + railPad,
      height: raw.height + bottomPad,
    };
    const padding = 0.04;
    // Retry a few times so the fit lands even if measurement settles late.
    const timers = [80, 400, 900].map((ms, i) =>
      setTimeout(() => rf.fitBounds(bounds, { duration: i === 0 ? 700 : 300, padding }), ms),
    );
    const onResize = () => rf.fitBounds(bounds, { duration: 200, padding });
    window.addEventListener("resize", onResize);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeIdsKey, nodesInitialized, rf]);

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
      {/* Render only after measurement — before the viewport is measured the
          dots pattern computes NaN coordinates (harmless dev warnings). */}
      {nodesInitialized && (
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
  );
}

export function MindMapCanvas({ embedded = false }: FlowProps) {
  return (
    <ReactFlowProvider>
      <Flow embedded={embedded} />
    </ReactFlowProvider>
  );
}

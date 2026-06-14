"use client";

import { useEffect, useMemo } from "react";
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

function Flow() {
  const map = useMapStore((s) => s.map);
  const hoveredId = useMapStore((s) => s.hoveredId);
  const selectedId = useMapStore((s) => s.selectedId);
  const exploreId = useMapStore((s) => s.exploreId);
  const query = useMapStore((s) => s.query);
  const funding = useMapStore((s) => s.funding);

  const setHovered = useMapStore((s) => s.setHovered);
  const selectNode = useMapStore((s) => s.selectNode);
  const explore = useMapStore((s) => s.explore);
  const exitExplore = useMapStore((s) => s.exitExplore);

  const rf = useReactFlow();

  const { nodes, edges } = useMemo(
    () => computeLayout(map, { hoveredId, selectedId, exploreId, funding }),
    [map, hoveredId, selectedId, exploreId, funding],
  );

  // Stable signal for the *set* of visible nodes (mount + explore/collapse).
  const nodeIdsKey = nodes.map((n) => n.id).join(",");

  // Fit the viewport on mount and whenever the explored branch changes. Bounds
  // come from explicit node dimensions via getNodesBounds + fitBounds, which do
  // NOT depend on the ResizeObserver (robust on first paint).
  useEffect(() => {
    const ids = new Set(fitTargets(map, exploreId));
    const target = nodes.filter((n) => ids.has(n.id));
    if (target.length === 0) return;
    const raw = rf.getNodesBounds(target);
    // Reserve space on the LEFT for the funding rail (shifts content right) and a
    // little bottom clearance. With the slider no longer pinned to the bottom, the
    // overview can use minimal padding so cards render large and legible.
    const railPad = 290;
    const bottomPad = exploreId ? 110 : 24;
    const bounds = {
      x: raw.x - railPad,
      y: raw.y,
      width: raw.width + railPad,
      height: raw.height + bottomPad,
    };
    const padding = exploreId ? 0.1 : 0.04;
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
  }, [nodeIdsKey, exploreId, rf]);

  // Search: open the matching branch (or the parent branch of a matching sub-item).
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = map.nodes.find(
      (n) =>
        n.kind !== "root" &&
        (n.label.toLowerCase().includes(q) ||
          n.sublabel?.toLowerCase().includes(q) ||
          n.detail?.toLowerCase().includes(q)),
    );
    if (!match) return;
    const branchId = match.kind === "leaf" ? match.parentId : match.id;
    if (branchId && branchId !== exploreId) explore(branchId);
    if (match.kind === "leaf") selectNode(match.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, map]);

  const onNodeClick: NodeMouseHandler = (_e, node) => {
    const n = map.nodes.find((x) => x.id === node.id);
    if (!n) return;
    if (n.kind === "branch") explore(n.id); // rotate to bottom + grid its sub-items
    else if (n.kind === "leaf") selectNode(n.id);
    else exitExplore(); // clicking the core returns to the symmetric overview
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
        // Clicking off: if a sub-node is pinned, just un-pin it (stay in the
        // explored branch); otherwise collapse back to the overview.
        const sel = map.nodes.find((x) => x.id === selectedId);
        if (sel?.kind === "leaf" && exploreId) {
          selectNode(exploreId);
        } else {
          exitExplore();
        }
        setHovered(null);
      }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      minZoom={0.2}
      maxZoom={2.2}
      proOptions={{ hideAttribution: true }}
      className="bg-transparent"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={28}
        size={1}
        color="rgba(234,130,78,0.10)"
      />
      <Controls
        showInteractive={false}
        className="!border-none !bg-[#232323]/80 !shadow-lg [&_button]:!border-[#ea824e]/20 [&_button]:!bg-[#272727] [&_button]:!fill-[#ea824e] [&_button:hover]:!bg-[#313131]"
      />
    </ReactFlow>
  );
}

export function MindMapCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

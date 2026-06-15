import type { Node as RFNode, Edge as RFEdge } from "@xyflow/react";
import type { MindMap, MapNode } from "./types";

export interface MindNodeData extends Record<string, unknown> {
  node: MapNode;
  dimmed: boolean;
  highlighted: boolean;
  /** Effective funding tier ($M) for this node. */
  tier: number;
  /** Whether the current funding level covers this node. */
  funded: boolean;
  /** Seconds to delay the one-shot entrance animation (radial bloom stagger). */
  appearDelay: number;
}

export type MindRFNode = RFNode<MindNodeData>;

// Node footprints (used for centering + fitView). Positions are computed as
// centers, then converted to top-left for React Flow.
const SIZE = {
  root: { w: 164, h: 164 },
  branch: { w: 276, h: 170 },
} as const;

// Elliptical constellation — wider than tall so the overall shape reads
// landscape (and the vertical spacing between branches is tighter/more even).
const RADIUS_X = 430;
const RADIUS_Y = 280;

const rad = (deg: number) => (deg * Math.PI) / 180;

interface InteractionState {
  hoveredId: string | null;
  /** A clicked branch (null = symmetric overview). Dims the other branches. */
  selectedId: string | null;
  funding: number;
}

export function computeLayout(
  map: MindMap,
  ui: InteractionState,
): { nodes: MindRFNode[]; edges: RFEdge[] } {
  const branches = map.nodes.filter((n) => n.kind === "branch");
  const effectiveTier = (node: MapNode): number => node.tier ?? 3;

  const n = branches.length;
  // First branch at the top (-90°); the rest sweep evenly around the core.
  const baseAngle = (i: number) => -90 + i * (360 / n);

  // A selected branch focuses the map (dims the others). Only branches focus.
  const selected = branches.find((b) => b.id === ui.selectedId)?.id ?? null;

  const positions = new Map<string, { x: number; y: number }>();
  positions.set("root", { x: 0, y: 0 });
  branches.forEach((b, i) => {
    const angle = rad(baseAngle(i));
    positions.set(b.id, { x: Math.cos(angle) * RADIUS_X, y: Math.sin(angle) * RADIUS_Y });
  });

  // Entrance stagger: core first, then branches sweep outward.
  const delayOf = new Map<string, number>();
  delayOf.set("root", 0);
  branches.forEach((b, i) => delayOf.set(b.id, 0.1 + i * 0.05));

  const nodes: MindRFNode[] = [];
  const edges: RFEdge[] = [];

  for (const node of map.nodes) {
    const pos = positions.get(node.id);
    if (!pos) continue;

    const size = SIZE[node.kind as "root" | "branch"];
    const dimmed = !!selected && node.kind === "branch" && node.id !== selected;

    const tier = effectiveTier(node);
    const funded = tier <= ui.funding;

    nodes.push({
      id: node.id,
      type: "mind",
      position: { x: pos.x - size.w / 2, y: pos.y - size.h / 2 },
      width: size.w,
      height: size.h,
      data: {
        node,
        dimmed,
        highlighted: ui.hoveredId === node.id || ui.selectedId === node.id,
        tier,
        funded,
        appearDelay: delayOf.get(node.id) ?? 0,
      },
      draggable: false,
      selectable: true,
    });

    // Core → branch spokes.
    if (node.kind === "branch") {
      const edgeDimmed = !!selected && node.id !== selected;
      let opacity = edgeDimmed ? 0.12 : 0.7;
      if (!funded) opacity = Math.min(opacity, 0.12);
      edges.push({
        id: `e-root-${node.id}`,
        source: "root",
        target: node.id,
        type: "radial",
        style: {
          stroke: node.color ?? "#dcab56",
          strokeWidth: 2,
          opacity,
        },
      });
    }
  }

  return { nodes, edges };
}

/** Ids to fit the viewport to — the whole constellation (core + branches). */
export function fitTargets(map: MindMap): string[] {
  return map.nodes.filter((n) => n.kind !== "leaf").map((n) => n.id);
}

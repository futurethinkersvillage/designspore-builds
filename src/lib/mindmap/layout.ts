import type { Node as RFNode, Edge as RFEdge } from "@xyflow/react";
import type { MindMap, MapNode } from "./types";

export interface MindNodeData extends Record<string, unknown> {
  node: MapNode;
  dimmed: boolean;
  highlighted: boolean;
  expanded: boolean;
  hasChildren: boolean;
  childCount: number;
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
  leaf: { w: 316, h: 196 },
} as const;

// Elliptical constellation — wider than tall so the overall shape reads
// landscape (and the vertical spacing between branches is tighter/more even).
const RADIUS_X = 430;
const RADIUS_Y = 280;
// Sub-item grid (shown below the explored branch, which is rotated to the bottom).
const GRID_COLW = 356;
const GRID_ROWH = 228;
const GRID_TOP_GAP = 215; // clearance below the branch card so row 1 doesn't overlap it

const rad = (deg: number) => (deg * Math.PI) / 180;

interface InteractionState {
  hoveredId: string | null;
  selectedId: string | null;
  /** Branch rotated to the bottom + gridded out (null = symmetric overview). */
  exploreId: string | null;
  funding: number;
}

/** Grid of leaves below the explored branch, each row centered. Capped at two
 *  rows: up to 3 columns normally, widening to 4 columns when there are >6. */
function placeGrid(
  leafIds: string[],
  bx: number,
  by: number,
): Map<string, { x: number; y: number }> {
  const out = new Map<string, { x: number; y: number }>();
  const m = leafIds.length;
  const cols = m <= 3 ? m : m > 6 ? 4 : 3;
  const top = by + GRID_TOP_GAP;
  leafIds.forEach((id, k) => {
    const row = Math.floor(k / cols);
    const countInRow = Math.min(cols, m - row * cols);
    const idxInRow = k - row * cols;
    out.set(id, {
      x: bx + (idxInRow - (countInRow - 1) / 2) * GRID_COLW,
      y: top + row * GRID_ROWH,
    });
  });
  return out;
}

export function computeLayout(
  map: MindMap,
  ui: InteractionState,
): { nodes: MindRFNode[]; edges: RFEdge[] } {
  const branches = map.nodes.filter((n) => n.kind === "branch");
  const branchTier = new Map<string, number>();
  branches.forEach((b) => branchTier.set(b.id, b.tier ?? 3));
  const effectiveTier = (node: MapNode): number =>
    node.tier ?? (node.parentId ? branchTier.get(node.parentId) ?? 3 : 3);

  const n = branches.length;
  const explore = ui.exploreId;
  // Rotate the constellation so the explored branch sits at the bottom (90°).
  // CSS transitions on the nodes animate the glide (reliable, compositor-driven).
  const baseAngle = (i: number) => -90 + i * (360 / n);
  const exploreIdx = explore ? branches.findIndex((b) => b.id === explore) : -1;
  const offset = exploreIdx >= 0 ? 90 - baseAngle(exploreIdx) : 0;

  const positions = new Map<string, { x: number; y: number }>();
  positions.set("root", { x: 0, y: 0 });

  branches.forEach((b, i) => {
    const angle = rad(baseAngle(i) + offset);
    const bx = Math.cos(angle) * RADIUS_X;
    const by = Math.sin(angle) * RADIUS_Y;
    positions.set(b.id, { x: bx, y: by });

    // Only the explored branch reveals its sub-items, gridded out below it.
    if (b.id === explore) {
      const leaves = map.nodes.filter((l) => l.parentId === b.id);
      placeGrid(
        leaves.map((l) => l.id),
        bx,
        by,
      ).forEach((p, id) => positions.set(id, p));
    }
  });

  // Entrance stagger: core first, then branches sweep outward, then (when
  // exploring) the sub-item grid blooms in.
  const delayOf = new Map<string, number>();
  delayOf.set("root", 0);
  branches.forEach((b, i) => delayOf.set(b.id, 0.1 + i * 0.05));
  if (explore) {
    // Sub-nodes rotate/sweep in coinciding with the branch's rotation (start ~now,
    // light cascade) rather than after it.
    map.nodes
      .filter((l) => l.parentId === explore)
      .forEach((l, k) => delayOf.set(l.id, k * 0.045));
  }

  const nodes: MindRFNode[] = [];
  const edges: RFEdge[] = [];

  for (const node of map.nodes) {
    const pos = positions.get(node.id);
    if (!pos) continue; // hidden leaf — not rendered

    const size = SIZE[node.kind];
    const children = map.nodes.filter((c) => c.parentId === node.id);

    // When exploring, dim every branch except the explored one.
    const dimmed = !!explore && node.kind === "branch" && node.id !== explore;

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
        expanded: node.id === explore,
        hasChildren: children.length > 0,
        childCount: children.length,
        tier,
        funded,
        appearDelay: delayOf.get(node.id) ?? 0,
      },
      draggable: false,
      selectable: true,
    });

    // Only draw the core→branch spokes (the grid sits visually below its branch).
    if (node.kind === "branch") {
      const edgeDimmed = !!explore && node.id !== explore;
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

/** Ids to fit the viewport to. Overview = whole map; explore = zoom into the
 *  explored branch + its sub-item grid so the sub-nodes fill the window. */
export function fitTargets(map: MindMap, exploreId: string | null): string[] {
  if (!exploreId) return map.nodes.filter((n) => n.kind !== "leaf").map((n) => n.id);
  const leafIds = map.nodes.filter((l) => l.parentId === exploreId).map((l) => l.id);
  return [exploreId, ...leafIds];
}

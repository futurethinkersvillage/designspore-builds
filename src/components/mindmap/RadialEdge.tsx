"use client";

import { useEffect, useState } from "react";
import { useInternalNode, type EdgeProps, type InternalNode } from "@xyflow/react";

// Edges that have already played their draw-in animation this session.
const DRAWN = new Set<string>();

interface Pt {
  x: number;
  y: number;
}

function dims(n: InternalNode): { w: number; h: number } {
  // Prefer measured, but fall back to the explicitly-set dimensions so edges
  // render even when the ResizeObserver hasn't measured yet.
  return {
    w: n.measured?.width ?? n.width ?? 0,
    h: n.measured?.height ?? n.height ?? 0,
  };
}

function centerOf(n: InternalNode): Pt {
  const { w, h } = dims(n);
  return {
    x: n.internals.positionAbsolute.x + w / 2,
    y: n.internals.positionAbsolute.y + h / 2,
  };
}

/** Point on the node's perimeter in the direction of `toward`. */
function borderPoint(n: InternalNode, toward: Pt, circular: boolean): Pt {
  const { w, h } = dims(n);
  const c = centerOf(n);
  const dx = toward.x - c.x;
  const dy = toward.y - c.y;
  const len = Math.hypot(dx, dy) || 1;

  if (circular) {
    const r = w / 2;
    return { x: c.x + (dx / len) * r, y: c.y + (dy / len) * r };
  }
  // Rectangle intersection: scale the direction vector to the nearest edge.
  const hw = w / 2;
  const hh = h / 2;
  const scale = 1 / Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh || 1);
  return { x: c.x + dx * scale, y: c.y + dy * scale };
}

/**
 * Floating, gently curved connector: attaches to the point on each node's
 * perimeter facing the other node, so connections distribute around the
 * perimeter rather than a single fixed handle.
 */
export function RadialEdge({ id, source, target, style, data }: EdgeProps) {
  // Play the draw-in animation only the first time this edge appears.
  const [drawing, setDrawing] = useState(!DRAWN.has(id));
  useEffect(() => {
    if (!DRAWN.has(id)) {
      const t = setTimeout(() => {
        DRAWN.add(id);
        setDrawing(false);
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [id]);

  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) return null;

  const sCircular = sourceNode.type === "mind" && (sourceNode.data as { node?: { kind?: string } })?.node?.kind === "root";
  const tCircular = targetNode.type === "mind" && (targetNode.data as { node?: { kind?: string } })?.node?.kind === "root";

  const sCenter = centerOf(sourceNode);
  const tCenter = centerOf(targetNode);
  const s = borderPoint(sourceNode, tCenter, sCircular);
  const t = borderPoint(targetNode, sCenter, tCircular);

  let d: string;
  if ((data as { elbow?: boolean } | undefined)?.elbow) {
    // Org-chart style limb: out from the branch, down the spine, into the leaf.
    const midX = s.x + (t.x - s.x) * 0.5;
    const r = 10; // corner rounding
    const downSign = t.y >= s.y ? 1 : -1;
    const goRight = t.x >= s.x;
    d =
      `M ${s.x} ${s.y} ` +
      `L ${midX - (goRight ? r : -r)} ${s.y} ` +
      `Q ${midX} ${s.y} ${midX} ${s.y + downSign * r} ` +
      `L ${midX} ${t.y - downSign * r} ` +
      `Q ${midX} ${t.y} ${midX + (goRight ? r : -r)} ${t.y} ` +
      `L ${t.x} ${t.y}`;
  } else {
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const mx = (s.x + t.x) / 2;
    const my = (s.y + t.y) / 2;
    const perp = 0.1;
    const c1x = mx - dy * perp;
    const c1y = my + dx * perp;
    d = `M ${s.x} ${s.y} Q ${c1x} ${c1y} ${t.x} ${t.y}`;
  }

  return (
    <path
      d={d}
      className={`react-flow__edge-path${drawing ? " rf-draw" : ""}`}
      pathLength={1}
      style={{ fill: "none", strokeLinecap: "round", transition: "opacity 0.3s ease", ...style }}
    />
  );
}

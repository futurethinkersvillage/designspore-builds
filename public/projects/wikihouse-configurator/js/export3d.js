// 3D-print export: binary STL at a chosen scale factor.
//
// Two modes:
//  - "building": exports exactly what is on screen (current view mode) as one STL.
//  - "blocks":   exports a print plate of UNIQUE detailed blocks (panels pre-merged
//                per block — one solid per block, ready to print and assemble like
//                the real system), laid out in a grid, plus a quantity list.
//
// Scale: model metres × 1000 / N  (1:N). STL units are interpreted as mm by slicers.

import * as THREE from "three";
import { loadDetailed } from "./blocks.js";

// ---------- binary STL writer ----------
// Appends into `out` (never spread — detailed blocks have 100k+ triangles and
// push(...huge) overflows the call stack).
function appendTriangles(out, geom, matrix) {
  const g = geom.index ? geom.toNonIndexed() : geom;
  const pos = g.attributes.position;
  const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  for (let i = 0; i < pos.count; i += 3) {
    for (let k = 0; k < 3; k++) {
      v[k].fromBufferAttribute(pos, i + k);
      if (matrix) v[k].applyMatrix4(matrix);
    }
    out.push([v[0].clone(), v[1].clone(), v[2].clone()]);
  }
}

function writeSTL(triangles, scaleMm) {
  const n = triangles.length;
  const buf = new ArrayBuffer(84 + n * 50);
  const dv = new DataView(buf);
  const header = "WikiHouse configurator export";
  for (let i = 0; i < header.length; i++) dv.setUint8(i, header.charCodeAt(i));
  dv.setUint32(80, n, true);
  let o = 84;
  const ab = new THREE.Vector3(), cb = new THREE.Vector3(), nrm = new THREE.Vector3();
  for (const [a, b, c] of triangles) {
    cb.subVectors(c, b); ab.subVectors(a, b); nrm.crossVectors(cb, ab).normalize();
    dv.setFloat32(o, nrm.x, true); dv.setFloat32(o + 4, nrm.y, true); dv.setFloat32(o + 8, nrm.z, true); o += 12;
    for (const p of [a, b, c]) {
      dv.setFloat32(o, p.x * scaleMm, true);
      dv.setFloat32(o + 4, p.z * scaleMm, true);   // swap: three Y-up -> STL Z-up
      dv.setFloat32(o + 8, p.y * scaleMm, true);
      o += 12;
    }
    dv.setUint16(o, 0, true); o += 2;
  }
  return buf;
}

function download(buf, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([buf], { type: "model/stl" }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------- building mode: what you see is what you print ----------
const SKIP_KINDS = new Set(["furniture", "art", "rug", "plant"]);

export function exportBuildingSTL(buildingGroup, scaleN, { includeInterior = false } = {}) {
  const tris = [];
  buildingGroup.updateMatrixWorld(true);
  buildingGroup.traverse((m) => {
    if (!m.isMesh || !m.visible) return;
    // a parent (e.g. stair group) may be hidden even if the child mesh isn't
    for (let p = m.parent; p; p = p.parent) if (p.visible === false) return;
    const kind = m.userData.kind;
    if (!includeInterior && kind && SKIP_KINDS.has(kind)) return;
    appendTriangles(tris, m.geometry, m.matrixWorld);
  });
  if (!tris.length) return { ok: false, reason: "nothing to export" };
  const buf = writeSTL(tris, 1000 / scaleN);
  download(buf, `wikihouse-building_1-${scaleN}.stl`);
  return { ok: true, triangles: tris.length, bytes: buf.byteLength };
}

// ---------- blocks mode: unique detailed blocks on a print plate ----------
export async function exportBlockPlateSTL(result, scaleN, onProgress = () => {}) {
  // unique bids actually used in this build, with quantities
  const counts = new Map();
  for (const p of result.pieces) {
    if (p.bid) counts.set(p.bid, (counts.get(p.bid) || 0) + 1);
  }
  const bids = [...counts.keys()].sort();
  const loaded = [];
  const missing = [];
  for (const bid of bids) {
    onProgress(`loading ${bid}…`);
    const geom = await loadDetailed(bid);
    if (geom) loaded.push({ bid, geom }); else missing.push(bid);
  }
  if (!loaded.length) return { ok: false, reason: "no detailed block geometry available (GLBs are a local feature)", missing };

  // grid layout with gaps, blocks upright, base on plate
  const s = 1000 / scaleN;           // metres -> print mm
  const gapMm = 8;
  const perRow = Math.ceil(Math.sqrt(loaded.length));
  const tris = [];
  let x = 0, z = 0, rowMax = 0, col = 0;
  const m4 = new THREE.Matrix4();
  const items = [];
  for (const { bid, geom } of loaded) {
    geom.computeBoundingBox();
    const bb = geom.boundingBox;
    const w = (bb.max.x - bb.min.x), d = (bb.max.z - bb.min.z), h = (bb.max.y - bb.min.y);
    const wMm = w * s, dMm = d * s;
    m4.makeTranslation(x / s - bb.min.x, -bb.min.y, z / s - bb.min.z);
    appendTriangles(tris, geom, m4);
    items.push({ bid, qty: counts.get(bid), printedMm: [wMm, dMm, h * s].map((v) => +v.toFixed(1)) });
    rowMax = Math.max(rowMax, dMm);
    col++;
    if (col >= perRow) { col = 0; x = 0; z += rowMax + gapMm; rowMax = 0; }
    else x += wMm + gapMm;
  }
  onProgress("writing STL…");
  const buf = writeSTL(tris, s);
  download(buf, `wikihouse-blocks_1-${scaleN}.stl`);
  // quantity list as CSV
  const csv = ["block,qty,printed_w_mm,printed_d_mm,printed_h_mm",
    ...items.map((i) => `${i.bid},${i.qty},${i.printedMm.join(",")}`),
    "", `scale,1:${scaleN}`,
    missing.length ? `not_included_approximated,${missing.join(" ")}` : ""].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `wikihouse-blocks_1-${scaleN}_quantities.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  return { ok: true, blocks: loaded.length, missing, triangles: tris.length, bytes: buf.byteLength };
}

export function printedSizeText(metrics, scaleN) {
  const L = (metrics.outerL * 1000) / scaleN;
  const W = (metrics.outerW * 1000) / scaleN;
  const H = (metrics.ridgeHeight * 1000) / scaleN;
  const ply = 18 / scaleN;
  return `${L.toFixed(0)} × ${W.toFixed(0)} × ${H.toFixed(0)} mm · ply ≈ ${ply.toFixed(2)} mm`;
}

// Data layer: loads the manifest for the ACTIVE system only. Switching systems
// swaps the manifest, spec and GLB cache wholesale — nothing carries over, so
// there is no cross-contamination between systems.

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { SYSTEMS, DEFAULT_SYSTEM } from "./systems.js";

export let MANIFEST = null;
export let SYSTEM = null;          // active profile object from SYSTEMS
export const SPEC = {
  module: 0.6,
  wallDepth: 0.25,
  floorThickness: 0.45,
  roofDeck: 0.32,
  wallHeights: {},
  spans: {},
  spanCols: {},
};

export async function loadSystem(systemId = DEFAULT_SYSTEM) {
  SYSTEM = SYSTEMS[systemId];
  const res = await fetch(`blocks-${systemId}.json`);
  MANIFEST = await res.json();
  if (MANIFEST.system !== systemId) {
    throw new Error(`manifest system mismatch: ${MANIFEST.system} != ${systemId}`);
  }
  SPEC.wallDepth = SYSTEM.wallDepth;
  SPEC.wallHeights = SYSTEM.wallHeights;
  SPEC.spans = {};
  SPEC.spanCols = {};
  for (const [code, mm] of Object.entries(MANIFEST.spans_mm)) {
    const internal = (Math.round((mm - 130) / 300) * 300) / 1000;
    SPEC.spans[code] = internal;
    SPEC.spanCols[code] = Math.round(internal / SPEC.module);
  }
  glbCache.clear(); // GLBs are per-system (assets/glb/<system>/...)
  return MANIFEST;
}

export function block(id) {
  return (MANIFEST && MANIFEST.blocks[id]) || null;
}

export function hasBlock(id) {
  return !!(MANIFEST && MANIFEST.blocks[id]);
}

// Aggregate stats over a family of block ids (prefix match) within the active system.
export function familyAvg(prefix) {
  const rows = Object.entries(MANIFEST.blocks).filter(([id]) => id.startsWith(prefix));
  if (!rows.length) return { sheets: 2, insulation: 1 };
  const sheets = rows.reduce((a, [, r]) => a + (r.sheets_est || r.sheets || 0), 0) / rows.length;
  const insulation = rows.reduce((a, [, r]) => a + (r.insulation_m2 || 0), 0) / rows.length;
  return { sheets, insulation };
}

export const OPENING_WIDTH = { win1: 1, win2: 2, door: 2 };

// ---------- detailed geometry (per-system GLBs) ----------
const gltfLoader = new GLTFLoader();
const glbCache = new Map(); // bid -> Promise<BufferGeometry|null>

export function loadDetailed(bid) {
  const key = `${SYSTEM.id}/${bid}`;
  if (!glbCache.has(key)) {
    glbCache.set(key, new Promise((resolve) => {
      gltfLoader.load(
        `assets/glb/${SYSTEM.id}/${bid}.glb`,
        (gltf) => {
          let geom = null;
          gltf.scene.traverse((o) => { if (o.isMesh && !geom) geom = o.geometry; });
          if (geom) geom.computeVertexNormals();
          resolve(geom);
        },
        undefined,
        () => resolve(null)
      );
    }));
  }
  return glbCache.get(key);
}

// Procedural CNC-plywood furniture, modelled after flat-pack designs from
// Opendesk / AtFAB / Obrary / 3axis (slotted birch-ply panels). Each builder
// returns a THREE.Group with its base at y=0, centred in x/z, sized to (w,d,h).
// This authentically represents CNC furniture (flat plywood panels) rather than
// downloading mismatched upholstered models.

import * as THREE from "three";

const PLY = new THREE.MeshStandardMaterial({ color: "#d9bd8f", roughness: 0.72, metalness: 0 });
const PLY_DK = new THREE.MeshStandardMaterial({ color: "#c2a066", roughness: 0.75 });
const METAL = new THREE.MeshStandardMaterial({ color: "#2b2b2b", roughness: 0.5, metalness: 0.4 });
const POT = new THREE.MeshStandardMaterial({ color: "#9c5a3c", roughness: 0.9 });
const LEAF = new THREE.MeshStandardMaterial({ color: "#4a7a45", roughness: 0.9 });
const T = 0.035; // plywood panel thickness (exaggerated for visibility)

function fabric(color) { return new THREE.MeshStandardMaterial({ color: color || "#7a8a6d", roughness: 0.95 }); }

function panel(g, x, y, z, sx, sy, sz, mat = PLY) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  g.add(m);
  return m;
}
function cyl(g, x, y, z, r, h, mat, seg = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  g.add(m);
  return m;
}

const builders = {
  // AtFAB-style dining table: solid top on two A-frame ply leg panels
  table(w, d, h, accent) {
    const g = new THREE.Group();
    panel(g, 0, h - T / 2, 0, w, T, d);
    for (const sx of [-1, 1]) {
      panel(g, sx * (w / 2 - 0.18), (h - T) / 2, 0, T * 1.4, h - T, d * 0.82);
    }
    panel(g, 0, h * 0.45, 0, w - 0.5, T, T * 1.4); // stretcher
    return g;
  },
  desk(w, d, h, accent) {
    const g = new THREE.Group();
    panel(g, 0, h - T / 2, 0, w, T, d);
    for (const sx of [-1, 1]) panel(g, sx * (w / 2 - T), h / 2, 0, T, h - T, d);
    panel(g, 0, h * 0.62, -d / 2 + T, w - 2 * T, h * 0.42, T); // modesty back
    return g;
  },
  chair(w, d, h, accent) {
    const g = new THREE.Group();
    const seatH = Math.min(0.45, h * 0.52);
    panel(g, 0, seatH, 0, w, T, d);                       // seat
    panel(g, 0, seatH + (h - seatH) / 2, -d / 2 + T, w, h - seatH, T); // back
    for (const sx of [-1, 1]) panel(g, sx * (w / 2 - T), seatH / 2, 0, T, seatH, d); // side legs
    return g;
  },
  stool(w, d, h, accent) {
    const g = new THREE.Group();
    panel(g, 0, h - T / 2, 0, w, T, d);                   // seat
    panel(g, 0, (h - T) / 2, 0, T, h - T, d * 0.9);       // crossed ply legs
    panel(g, 0, (h - T) / 2, 0, w * 0.9, h - T, T);
    return g;
  },
  bed(w, d, h, accent) {
    // w = length (x), d = width (z)
    const g = new THREE.Group();
    const deck = 0.28;
    panel(g, 0, deck, 0, w, T, d);                        // platform
    panel(g, -w / 2 + T / 2, deck + 0.28, 0, T, 0.55, d); // headboard
    for (const sz of [-1, 1]) panel(g, 0, deck - 0.06, sz * (d / 2 - T / 2), w, 0.16, T); // rails
    panel(g, 0.05, deck + 0.13, 0, w - 0.12, 0.2, d - 0.12, fabric(accent || "#c9c2b4")); // mattress
    panel(g, -w / 2 + 0.35, deck + 0.27, 0, 0.45, 0.1, d * 0.7, fabric("#eae4d6")); // pillow
    return g;
  },
  sofa(w, d, h, accent) {
    const g = new THREE.Group();
    panel(g, 0, 0.2, 0, w, 0.4, d);                       // ply base
    panel(g, 0, 0.55, -d / 2 + T, w, 0.5, T);             // back panel
    for (const sx of [-1, 1]) panel(g, sx * (w / 2 - T), 0.42, 0, T, 0.5, d); // arms
    const fab = fabric(accent);
    panel(g, 0, 0.47, 0.06, w - 0.16, 0.14, d - 0.28, fab); // seat cushion
    panel(g, 0, 0.66, -d / 2 + 0.1, w - 0.16, 0.3, 0.12, fab); // back cushion
    return g;
  },
  shelf(w, d, h, accent) {
    const g = new THREE.Group();
    for (const sx of [-1, 1]) panel(g, sx * (w / 2 - T / 2), h / 2, 0, T, h, d);
    const n = Math.max(3, Math.round(h / 0.42));
    for (let i = 0; i <= n; i++) panel(g, 0, (i / n) * (h - T) + T / 2, 0, w - T, T, d);
    panel(g, 0, h / 2, -d / 2 + T / 3, w - 2 * T, h - T, T / 3, PLY_DK); // thin back
    return g;
  },
  kitchen(w, d, h, accent) {
    const g = new THREE.Group();
    panel(g, 0, (h - 0.08) / 2, 0, w, h - 0.08, d, PLY);   // base cabinets
    panel(g, 0, h - 0.04, 0, w, 0.08, d, PLY_DK);          // counter
    panel(g, w * 0.28, h - 0.03, 0, 0.5, 0.05, d * 0.6, METAL); // sink recess
    cyl(g, w * 0.28, h + 0.06, -d * 0.2, 0.02, 0.16, METAL);     // tap
    panel(g, 0, h + 0.6, -d / 2 + 0.16, w, 0.55, 0.32, PLY);     // upper cabinets
    return g;
  },
  bathroom(w, d, h, accent) {
    const g = new THREE.Group();
    panel(g, 0, h / 2, -d / 2 + T / 2, w, h, T);            // back
    for (const sx of [-1, 1]) panel(g, sx * (w / 2 - T / 2), h / 2, 0, T, h, d); // sides
    panel(g, 0, h - T / 2, 0, w, T, d);                    // roof
    panel(g, w * 0.25, h * 0.5, d / 2 - T / 2, w * 0.45, h * 0.95, T, PLY_DK); // door
    return g;
  },
  stove(w, d, h, accent) {
    const g = new THREE.Group();
    cyl(g, 0, 0.5, 0, 0.22, 0.7, METAL);                   // body
    for (const a of [0, 1, 2, 3]) {
      const ang = (a / 4) * Math.PI * 2;
      panel(g, Math.cos(ang) * 0.16, 0.07, Math.sin(ang) * 0.16, 0.04, 0.14, 0.04, METAL);
    }
    cyl(g, 0, 1.15, 0, 0.06, 0.9, METAL);                  // flue
    return g;
  },
  plant(w, d, h, accent) {
    const g = new THREE.Group();
    cyl(g, 0, 0.15, 0, 0.16, 0.3, POT);                    // pot
    cyl(g, 0, 0.7, 0, 0.02, 0.8, PLY_DK);                  // stem
    for (const s of [0.55, 0.75, 0.95]) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22 * (1.1 - s), 8, 6), LEAF);
      leaf.position.set((s - 0.75) * 0.4, h * s, 0);
      g.add(leaf);
    }
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), LEAF);
    crown.position.set(0, h * 0.95, 0); g.add(crown);
    return g;
  },
  rug(w, d, h, accent) {
    const g = new THREE.Group();
    panel(g, 0, 0.01, 0, w, 0.02, d, fabric(accent || "#a5583f"));
    return g;
  },
};

export function buildFurniture(model, w, d, h, accent) {
  const b = builders[model] || builders.table;
  return b(w, d, h, accent);
}

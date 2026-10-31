// Parked RVs, placed on the real ones in the drone photo (tools/find_rvs.py + picks by eye). Three kinds:
//   trailer (travel trailer, 6–9 m), fifth (fifth-wheel with the raised nose, 9–12 m), motorhome (class C, 7–10 m).
// variant = kind, size = length in metres. From the campground photos (Campsite/16, 20210706, 20210713, FB_IMG_1707008582481):
// a rounded cream body with a coloured swoosh, dark skirt, framed windows, an entry door, a slide-out, a rolled or open
// awning, roof AC + vents, jacks and propane on the tongue. One merged mesh per RV: there are ~30 of them.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = { name: 'RV', footprint: [2.5, 8], height: 3.4, notes: 'Origin = centre of the footprint; long axis along z, front (hitch / cab) toward +z.' };

const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 });
const C = hex => new THREE.Color(hex);
const CREAM = C(0xefe9db), ROOF = C(0xd9d7d0), SKIRT = C(0x35373b), GLASS = C(0x1a1f27), FRAME = C(0x8d8f90), TYRE = C(0x141414), HUB = C(0xb9bcbd), FABRIC = C(0xe6e2d6), PROPANE = C(0xe8e8e4), RED = C(0xb33a2a);
const ACCENTS = [C(0x7a4a2e), C(0x7c2f2a), C(0x4f6368), C(0x8d6a3f), C(0x2f3f58)];

export function build({ lod = 'high', variant = 'trailer', size } = {}) {
  const kind = variant || 'trailer', hi = lod !== 'low';
  const L = size || ({ trailer: 7.5, fifth: 10.5, motorhome: 8.5 })[kind] || 7.5, W = 2.45, H = kind === 'fifth' ? 3.3 : 3.0, floor = 0.55;
  const seed = Math.round(L * 37), accent = ACCENTS[seed % ACCENTS.length], awningOpen = seed % 3 === 0, parts = [];
  const add = (geo, col) => {
    const g = geo.index ? geo.toNonIndexed() : geo;
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
    const n = g.attributes.position.count, c = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) col.toArray(c, i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(c, 3)); parts.push(g); return g;
  };
  const box = (col, w, h, d, x, y, z, ry = 0, rz = 0) => { const g = new THREE.BoxGeometry(w, h, d); if (rz) g.rotateZ(rz); if (ry) g.rotateY(ry); g.translate(x, y, z); return add(g, col); };

  // the side silhouette, extruded across the width: rounded back and front, the fifth-wheel's overhanging nose, the cab + bunk
  const b = -L / 2, f = L / 2, s = new THREE.Shape(), R = 0.32;
  let bodyEnd;
  s.moveTo(b + 0.12, floor);
  if (kind === 'fifth') {
    bodyEnd = f - 2.0;
    s.lineTo(bodyEnd, floor); s.lineTo(bodyEnd, 1.5); s.lineTo(f - 0.15, 1.5); s.quadraticCurveTo(f + 0.05, 1.6, f, 2.1); s.lineTo(f - 0.35, H - 0.2); s.quadraticCurveTo(f - 0.5, H, f - 0.9, H);
  } else if (kind === 'motorhome') {
    bodyEnd = f - 1.9;
    s.lineTo(f - 0.05, floor); s.lineTo(f, 1.05); s.lineTo(f - 0.5, 1.2); s.lineTo(f - 1.0, 1.95); s.lineTo(f - 0.55, 2.05); s.quadraticCurveTo(f - 0.4, 2.6, f - 1.1, H);
  } else {
    bodyEnd = f - 1.2;
    s.lineTo(bodyEnd, floor); s.lineTo(bodyEnd + 0.02, H - 0.6); s.quadraticCurveTo(bodyEnd, H, bodyEnd - 0.55, H);
  }
  s.lineTo(b + R, H); s.quadraticCurveTo(b, H, b, H - R); s.lineTo(b, floor + 0.1); s.closePath();
  add(new THREE.ExtrudeGeometry(s, { depth: W - 0.12, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2, curveSegments: 6 }).rotateY(-Math.PI / 2).translate(W / 2 - 0.06, 0, 0), CREAM);
  const span = bodyEnd - b, mid = (b + bodyEnd) / 2;
  box(ROOF, W - 0.2, 0.06, span - 0.4, 0, H + 0.04, mid);
  box(SKIRT, W + 0.03, 0.28, span, 0, floor + 0.14, mid);

  for (const sd of [-1, 1]) {
    const x = sd * (W / 2 + 0.02);
    // the swoosh: a long band, a thin line over it, a rising fin near the back
    box(accent, 0.03, 0.3, span * 0.92, x, floor + 0.62, mid);
    box(accent, 0.03, 0.12, span * 0.6, x, floor + 0.86, b + span * 0.35);
    box(accent, 0.03, 0.9, 0.34, x, floor + 1.05, b + 0.9);
    // framed windows
    const n = Math.max(2, Math.floor(span / 2.6));
    for (let k = 0; k < n; k++) {
      const z = b + 1.5 + k * (span - 2) / Math.max(1, n - 1) * 0.92;
      box(FRAME, 0.03, 0.74, 1.08, x, floor + 1.55, z); box(GLASS, 0.04, 0.62, 0.96, x + sd * 0.005, floor + 1.55, z);
    }
  }
  box(FRAME, 1.3, 0.62, 0.03, 0, floor + 1.55, b - 0.05); box(GLASS, 1.18, 0.5, 0.04, 0, floor + 1.55, b - 0.06);
  for (const sd of [-1, 1]) box(RED, 0.22, 0.1, 0.03, sd * 0.9, floor + 0.3, b - 0.05);

  // curbside: entry door, steps, a slide-out box, the awning
  const cx = W / 2 + 0.03, dz = b + span * 0.68;
  box(CREAM, 0.04, 1.95, 0.72, cx, floor + 1.0, dz); box(FRAME, 0.05, 2.02, 0.05, cx, floor + 1.0, dz - 0.38); box(FRAME, 0.05, 2.02, 0.05, cx, floor + 1.0, dz + 0.38); box(GLASS, 0.05, 0.42, 0.4, cx + 0.005, floor + 1.55, dz);
  box(SKIRT, 0.7, 0.05, 0.62, cx + 0.34, 0.26, dz); box(SKIRT, 0.4, 0.05, 0.62, cx + 0.18, 0.5, dz);
  if (span > 6) {
    const sz = b + span * 0.32, sl = Math.min(3.2, span * 0.35);
    box(CREAM, 0.42, 1.55, sl, cx + 0.2, floor + 1.15, sz); box(accent, 0.44, 0.1, sl + 0.02, cx + 0.2, floor + 0.46, sz); box(ROOF, 0.5, 0.05, sl + 0.05, cx + 0.2, floor + 1.95, sz); box(GLASS, 0.03, 0.6, sl * 0.55, cx + 0.42, floor + 1.25, sz);
  }
  const az = mid + 0.3, al = Math.min(span - 1.6, 5.2);
  box(FABRIC, 0.14, 0.14, al, cx + 0.05, H - 0.32, az);
  if (awningOpen) {
    box(FABRIC, 2.3, 0.03, al, cx + 1.15, H - 0.5, az, 0, -0.16);
    for (let i = 0; i < 5; i++) box(accent, 2.3, 0.035, 0.22, cx + 1.15, H - 0.49, az - al / 2 + 0.4 + i * (al - 0.8) / 4, 0, -0.16);
    for (const e of [-1, 1]) box(FRAME, 0.04, 2.3, 0.04, cx + 2.2, 1.15, az + e * (al / 2 - 0.05));
  }

  // on the roof
  box(ROOF, 0.78, 0.26, 1.0, 0, H + 0.2, b + span * 0.55); box(C(0xbfbdb5), 0.6, 0.08, 0.8, 0, H + 0.36, b + span * 0.55);
  box(ROOF, 0.5, 0.12, 0.5, 0.4, H + 0.12, b + span * 0.25); box(SKIRT, 0.12, 0.3, 0.12, -0.6, H + 0.2, b + span * 0.3);

  if (kind === 'motorhome') {
    box(GLASS, W - 0.3, 0.62, 0.05, 0, 1.56, f - 0.74); for (const sd of [-1, 1]) box(GLASS, 0.04, 0.5, 0.8, sd * (W / 2 + 0.02), 1.52, f - 1.3);
    box(SKIRT, W + 0.02, 0.3, 0.1, 0, 0.72, f + 0.02); for (const sd of [-1, 1]) box(C(0xf4eeda), 0.32, 0.16, 0.04, sd * 0.8, 0.98, f + 0.02);
  } else if (kind === 'fifth') {
    box(SKIRT, W - 0.1, 0.5, 0.05, 0, 2.5, f - 0.22); for (const sd of [-1, 1]) box(accent, 0.03, 0.26, 1.7, sd * (W / 2 + 0.03), 2.05, f - 1.0);
    for (const sd of [-1, 1]) box(SKIRT, 0.1, 1.45, 0.1, sd * 0.7, 0.72, f - 1.3);   // landing legs
    box(SKIRT, 1.5, 0.08, 0.3, 0, 0.04, f - 1.3);
  } else {
    // A-frame tongue, jack, two propane bottles
    for (const sd of [-1, 1]) box(SKIRT, 0.09, 0.09, 1.45, sd * 0.32, 0.5, bodyEnd + 0.6, sd * -0.42);
    box(SKIRT, 0.08, 0.5, 0.08, 0, 0.25, bodyEnd + 1.05);
    for (const sd of [-1, 1]) add(new THREE.CylinderGeometry(0.16, 0.16, 0.56, 10).translate(sd * 0.2, 0.86, bodyEnd + 0.4), PROPANE);
  }

  // wheels with a wheel well + hub; stabiliser jacks at the back
  const wheelZ = kind === 'motorhome' ? [b + 1.6, f - 1.25] : [mid - 0.42, mid + 0.42];
  for (const z of wheelZ) for (const sd of [-1, 1]) {
    box(SKIRT, 0.05, 0.55, 1.0, sd * (W / 2 + 0.01), 0.72, z);
    add(new THREE.CylinderGeometry(0.36, 0.36, 0.24, hi ? 14 : 8).rotateZ(Math.PI / 2).translate(sd * (W / 2 - 0.08), 0.36, z), TYRE);
    add(new THREE.CylinderGeometry(0.17, 0.17, 0.26, 10).rotateZ(Math.PI / 2).translate(sd * (W / 2 - 0.08), 0.36, z), HUB);
  }
  for (const sd of [-1, 1]) box(SKIRT, 0.08, 0.5, 0.08, sd * 0.9, 0.3, b + 0.5);

  const g = new THREE.Group(); g.add(new THREE.Mesh(mergeGeometries(parts), mat));
  return g;
}

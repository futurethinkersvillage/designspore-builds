// The 120-person event gazebo by the Top House (Wells Gray Golf & RV Resort).
// Regular octagon (~13 m across the knee walls, ~14.1 m across the eaves), knee-high board walls on seven
// sides with the SE side open as the entrance, 6x6 posts with Y knee braces, a deep painted fascia band,
// a cedar-shingle hip roof rising to an open clerestory cupola with its own shingled octagonal cap.
// Stone fire pit in the middle, picnic tables around it.
import * as THREE from 'three';

export const meta = {
  name: 'Event Gazebo',
  layer: 'public_areas',
  match: 0, // public_areas feature 0: 10-vertex ~octagon, area 166 m², 13 m NW of the "Gazebo" photo point
  footprint: [14.4, 14.4], // eaves across the corners ~15.3, across the flats 14.1; slab + entry pad included
  height: 8.2,
  place: { x: -569.61, y: -225.09, rotY: 0.6615 }, // entrance (open side) faces bearing ~142° (SE)
  sources: [
    'Gazebo/clubhouse_1.22.1.png (drone, from NE: roof/cupola/open SE side)',
    'Gazebo/05.jpg (ground: knee wall, posts, braces, fascia, cupola)',
    'Gazebo/PXL_20240914_233415406.PANO-EDIT.jpg (ground from SE: entrance side + slab)',
    'Gazebo/Gazebo Interior.jpg, Gazebo Interior 2.jpg (ceiling, fire pit, tables)',
    'Gazebo/Gazebo View.jpg, PXL_20240605_014332126 (from above/W: roof proportions)',
  ],
  notes: 'See models/notes/gazebo.md',
};

const TAU = Math.PI * 2, C8 = Math.cos(Math.PI / 8), T8 = Math.tan(Math.PI / 8);

// ---------- small procedural textures (cached per page) ----------
const texCache = {};
function canvasTex(key, w, h, draw) {
  if (!texCache[key]) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
    texCache[key] = t;
  }
  return texCache[key];
}
function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function shingleTex() {
  return canvasTex('gz_shingle', 256, 256, (g, w, h) => {
    const r = rnd(7); g.fillStyle = '#76604f'; g.fillRect(0, 0, w, h);
    const rows = 8, rh = h / rows;
    for (let i = 0; i < rows; i++) {
      const off = (i % 2) * 16;
      for (let x = -off; x < w; x += 32) {
        const v = 0.93 + r() * 0.12;
        g.fillStyle = `rgb(${Math.round(150 * v)},${Math.round(122 * v)},${Math.round(98 * v)})`;
        g.fillRect(x + 1, i * rh + 1, 30, rh - 2);
      }
      g.fillStyle = 'rgba(50,38,28,0.45)'; g.fillRect(0, i * rh + rh - 3, w, 3);
    }
  });
}
function boardTex(key, base, groove) {
  return canvasTex(key, 128, 64, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 16) { g.fillStyle = groove; g.fillRect(x, 0, 2, h); g.fillStyle = 'rgba(255,230,200,0.08)'; g.fillRect(x + 2, 0, 2, h); }
  });
}
function ceilingTex() {
  return canvasTex('gz_ceiling', 128, 128, (g, w, h) => {
    const r = rnd(3); g.fillStyle = '#c99a63'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 8) { const v = 0.9 + r() * 0.18; g.fillStyle = `rgba(${Math.round(205 * v)},${Math.round(158 * v)},${Math.round(104 * v)},1)`; g.fillRect(0, y, w, 7); g.fillStyle = 'rgba(90,55,25,0.5)'; g.fillRect(0, y + 7, w, 1); }
  });
}
function withRepeat(t, rx, ry) { const c = t.clone(); c.repeat.set(rx, ry); c.needsUpdate = true; return c; }

// ---------- geometry helpers ----------
function box(parent, mat, w, h, d, x, y, z, ry = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
}
// Octagonal frustum/ring with flat faces centred on ±X/±Z. a0/a1 = apothems (bottom/top).
function oct(a0, a1, h, open = true, mat) {
  const g = new THREE.CylinderGeometry(a1 / C8, a0 / C8, h, 8, 1, open, Math.PI / 8);
  return new THREE.Mesh(g, mat);
}
// beam between two points (square section)
function beam(parent, mat, p0, p1, s) {
  const d = new THREE.Vector3().subVectors(p1, p0), L = d.length();
  const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, L), mat);
  m.position.copy(p0).addScaledVector(d, 0.5); m.lookAt(p1); parent.add(m); return m;
}
const dirOf = (phi) => new THREE.Vector3(Math.sin(phi), 0, Math.cos(phi));

// dimensions (m)
const F = 0.15;            // top of concrete slab
const A_SLAB = 6.85;       // slab apothem
const A_WALL = 6.5;        // outer face of knee wall / post line
const WALL_H = 1.0;        // knee wall height above slab
const PLATE_Y = 2.9;       // top of posts / underside of fascia band
const A_BAND = 7.0, BAND_H = 0.48;
const A_EAVE = 7.08;       // roof edge apothem (polygon area -> 14.1 m across flats)
const ROOF_TOP = 5.5, A_TOP = 2.9;            // main roof meets the cupola curb
const A_IN = 2.75;         // inner (cupola) post ring
const CUP_POST_TOP = 6.25, A_CBAND = 3.1, CBAND_H = 0.28, A_CEAVE = 3.22, CUP_RISE = 1.5;

export function build({ lod = 'high' } = {}) {
  const hi = lod !== 'low';
  const g = new THREE.Group(); g.name = 'gazebo';

  // faded salmon-brown stain, not saturated orange (photos: Gazebo/05.jpg, clubhouse_1.22.1.png)
  const paint = new THREE.MeshStandardMaterial({ color: 0xa8705a, roughness: 0.85 });
  const wallMat = new THREE.MeshStandardMaterial({ color: hi ? 0xffffff : 0xae7260, roughness: 0.85,
    map: hi ? withRepeat(boardTex('gz_board', '#b27760', '#8d5a47'), 5.4 / 2.0, 1) : null });
  const bandMat = new THREE.MeshStandardMaterial({ color: hi ? 0xffffff : 0xae7260, roughness: 0.85, side: THREE.DoubleSide, flatShading: true,
    map: hi ? withRepeat(boardTex('gz_board', '#b27760', '#8d5a47'), 8 * 2 * A_BAND * T8 / 2.0, 1) : null });
  const slant = Math.hypot(A_EAVE - A_TOP, ROOF_TOP - PLATE_Y - BAND_H);
  const roofMat = new THREE.MeshStandardMaterial({ color: hi ? 0xffffff : 0x8c705a, roughness: 0.95, flatShading: true,
    map: hi ? withRepeat(shingleTex(), 8 * 2, slant / 1.6) : null });
  const cupRoofMat = new THREE.MeshStandardMaterial({ color: hi ? 0xffffff : 0x8c705a, roughness: 0.95, flatShading: true,
    map: hi ? withRepeat(shingleTex(), 8, 2.3 / 1.6) : null });
  const ceilMat = new THREE.MeshStandardMaterial({ color: hi ? 0xffffff : 0xc4945e, roughness: 0.9, side: THREE.BackSide, flatShading: true,
    map: hi ? withRepeat(ceilingTex(), 16, 3) : null });
  const concrete = new THREE.MeshStandardMaterial({ color: 0xa3a099, roughness: 1, flatShading: true });
  const capMat = new THREE.MeshStandardMaterial({ color: 0x86735f, roughness: 0.95 });

  // --- slab (entrance = face 0 = +Z). No entry pad: the photos (Gazebo/05.jpg, clubhouse_1.22.1.png) show it sits on
  // gravel with just a low concrete curb ---
  const slab = oct(A_SLAB, A_SLAB, F, false, concrete); slab.position.y = F / 2; g.add(slab);

  // --- knee walls on 7 faces (face 0 open) + cap rail ---
  const sW = 2 * (A_WALL - 0.07) * T8 + 0.12;
  for (let k = 1; k < 8; k++) {
    const phi = k * Math.PI / 4, n = dirOf(phi);
    box(g, wallMat, sW, WALL_H, 0.14, n.x * (A_WALL - 0.07), F + WALL_H / 2, n.z * (A_WALL - 0.07), phi);
    if (hi) box(g, paint, sW + 0.06, 0.06, 0.24, n.x * (A_WALL - 0.08), F + WALL_H + 0.03, n.z * (A_WALL - 0.08), phi);
  }

  // --- outer posts (8 corners) + knee braces + top plate ---
  const Rpost = (A_WALL - 0.09) / C8;
  for (let k = 0; k < 8; k++) {
    const th = Math.PI / 8 + k * Math.PI / 4, v = dirOf(th);
    box(g, paint, 0.18, PLATE_Y - F, 0.18, v.x * Rpost, (PLATE_Y + F) / 2, v.z * Rpost, th);
    if (hi) {
      const v2 = dirOf(th + Math.PI / 4);
      beam(g, paint, new THREE.Vector3(v.x * Rpost, PLATE_Y - 0.1, v.z * Rpost), new THREE.Vector3(v2.x * Rpost, PLATE_Y - 0.1, v2.z * Rpost), 0.18);
      for (const s of [-1, 1]) { // Y braces in the plane of both adjacent faces
        const vn = dirOf(th + s * Math.PI / 4);
        const tdir = new THREE.Vector3(vn.x - v.x, 0, vn.z - v.z).normalize();
        const p0 = new THREE.Vector3(v.x * Rpost, PLATE_Y - 0.8, v.z * Rpost).addScaledVector(tdir, 0.06);
        const p1 = new THREE.Vector3(v.x * Rpost, PLATE_Y - 0.15, v.z * Rpost).addScaledVector(tdir, 0.72);
        beam(g, paint, p0, p1, 0.11);
      }
    }
  }
  if (!hi) { const plate = oct(A_WALL - 0.09, A_WALL - 0.09, 0.2, true, bandMat); plate.position.y = PLATE_Y - 0.1; g.add(plate); }

  // --- fascia band + main hip roof (shingles above, wood ceiling below) ---
  const band = oct(A_BAND, A_BAND, BAND_H, true, bandMat); band.position.y = PLATE_Y + BAND_H / 2; g.add(band);
  const y0 = PLATE_Y + BAND_H, rh = ROOF_TOP - y0;
  const roof = oct(A_EAVE, A_TOP, rh, true, roofMat); roof.position.y = y0 + rh / 2; g.add(roof);
  const ceil = oct(A_BAND - 0.05, A_TOP - 0.05, rh, true, ceilMat); ceil.position.y = y0 + rh / 2 - 0.14; g.add(ceil);
  // flat soffit under the band, from the post line out to the fascia
  const sofMat = new THREE.MeshStandardMaterial({ color: 0x9e6a55, roughness: 0.9, side: THREE.DoubleSide, flatShading: true });
  const sof = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2((A_WALL - 0.25) / C8, 0), new THREE.Vector2((A_BAND - 0.01) / C8, 0)], 8, Math.PI / 8), sofMat);
  sof.position.y = PLATE_Y + 0.005; g.add(sof);
  if (hi) for (let k = 0; k < 8; k++) { // hip caps
    const v = dirOf(Math.PI / 8 + k * Math.PI / 4);
    beam(g, capMat, new THREE.Vector3(v.x * A_EAVE / C8, y0 + 0.03, v.z * A_EAVE / C8), new THREE.Vector3(v.x * A_TOP / C8, ROOF_TOP + 0.03, v.z * A_TOP / C8), 0.1);
  }

  // --- inner post ring carrying the cupola ---
  const Rin = A_IN / C8;
  for (let k = 0; k < 8; k++) {
    const th = Math.PI / 8 + k * Math.PI / 4, v = dirOf(th);
    box(g, paint, 0.18, CUP_POST_TOP - F, 0.18, v.x * Rin, (CUP_POST_TOP + F) / 2, v.z * Rin, th);
    if (hi) {
      beam(g, paint, new THREE.Vector3(v.x * Rpost, PLATE_Y - 0.05, v.z * Rpost), new THREE.Vector3(v.x * Rin, ROOF_TOP - 0.3, v.z * Rin), 0.16); // hip rafter
      const v2 = dirOf(th + Math.PI / 4);
      beam(g, paint, new THREE.Vector3(v.x * Rin, ROOF_TOP - 0.35, v.z * Rin), new THREE.Vector3(v2.x * Rin, ROOF_TOP - 0.35, v2.z * Rin), 0.18); // ring beam
      for (const s of [-1, 1]) {
        const vn = dirOf(th + s * Math.PI / 4);
        const tdir = new THREE.Vector3(vn.x - v.x, 0, vn.z - v.z).normalize();
        beam(g, paint, new THREE.Vector3(v.x * Rin, ROOF_TOP - 1.05, v.z * Rin).addScaledVector(tdir, 0.06), new THREE.Vector3(v.x * Rin, ROOF_TOP - 0.42, v.z * Rin).addScaledVector(tdir, 0.65), 0.1);
      }
    }
  }
  const curb = oct(A_TOP + 0.02, A_TOP + 0.02, 0.22, true, bandMat); curb.position.y = ROOF_TOP + 0.05; g.add(curb);

  // --- open clerestory: 3 bays per face ---
  const Rc = (A_IN + 0.1) / C8;
  for (let k = 0; k < 8; k++) {
    const th = Math.PI / 8 + k * Math.PI / 4, v = dirOf(th), v2 = dirOf(th + Math.PI / 4);
    for (let i = 0; i < (hi ? 3 : 1); i++) {
      const t = i / 3, px = (v.x + (v2.x - v.x) * t) * Rc, pz = (v.z + (v2.z - v.z) * t) * Rc;
      box(g, paint, 0.14, CUP_POST_TOP - ROOF_TOP + 0.05, 0.14, px, (CUP_POST_TOP + ROOF_TOP) / 2, pz, th);
    }
  }
  const cband = oct(A_CBAND, A_CBAND, CBAND_H, true, bandMat); cband.position.y = CUP_POST_TOP + CBAND_H / 2; g.add(cband);
  const cy0 = CUP_POST_TOP + CBAND_H;
  const croof = oct(A_CEAVE, 0.001, CUP_RISE, true, cupRoofMat); croof.position.y = cy0 + CUP_RISE / 2; g.add(croof);
  const cceil = oct(A_CBAND - 0.05, 0.001, CUP_RISE, true, ceilMat); cceil.position.y = cy0 + CUP_RISE / 2 - 0.12; g.add(cceil);
  if (hi) {
    for (let k = 0; k < 8; k++) {
      const v = dirOf(Math.PI / 8 + k * Math.PI / 4);
      beam(g, capMat, new THREE.Vector3(v.x * A_CEAVE / C8, cy0 + 0.03, v.z * A_CEAVE / C8), new THREE.Vector3(0, cy0 + CUP_RISE + 0.03, 0), 0.09);
    }
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35, 6), capMat); fin.position.y = cy0 + CUP_RISE + 0.15; g.add(fin);
  }

  // --- furniture: stone fire pit + picnic tables (close-up stops only) ---
  if (hi) {
    const stone = new THREE.MeshStandardMaterial({ color: 0x8c8378, roughness: 1, flatShading: true });
    const pit = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.8, 0.5, 12), stone); pit.position.y = F + 0.25; g.add(pit);
    const ash = new THREE.Mesh(new THREE.CircleGeometry(0.55, 12), new THREE.MeshStandardMaterial({ color: 0x2c2724, roughness: 1 }));
    ash.rotation.x = -Math.PI / 2; ash.position.y = F + 0.51; g.add(ash);
    const tbl = new THREE.MeshStandardMaterial({ color: 0x8e5a44, roughness: 0.9 });
    const table = (x, z, ry) => {
      const t = new THREE.Group(); t.name = 'picnic_table'; t.position.set(x, F, z); t.rotation.y = ry; g.add(t);
      box(t, tbl, 2.4, 0.06, 0.75, 0, 0.76, 0);
      box(t, tbl, 2.4, 0.05, 0.26, 0, 0.45, 0.6); box(t, tbl, 2.4, 0.05, 0.26, 0, 0.45, -0.6);
      box(t, tbl, 0.08, 0.74, 1.45, 0.85, 0.37, 0); box(t, tbl, 0.08, 0.74, 1.45, -0.85, 0.37, 0);
    };
    for (let k = 1; k < 8; k++) {
      const phi = k * Math.PI / 4, n = dirOf(phi);
      table(n.x * 4.6, n.z * 4.6, phi);
      if (k % 2 === 0 && k !== 4) { const m = dirOf(phi); table(m.x * 2.4, m.z * 2.4, phi + Math.PI / 2); }
    }
  }
  return g;
}

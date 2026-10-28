// Planned zome cabin (Portal.Place creekside + lakeside cabin sites). Concept only, not built yet.
// The Trillium Domes zome from Mike's purchased plans: a 10-fold polar zonohedron cut six rings below the apex
// (five rows of rhombi z1…z5 over a row of half panels at the base); the doorway replaces one of the ten base sections.
// Grey clad panels, tall glazed door in a dark portal frame, triangular windows, skylight, flue, low timber deck.
// Units metres, origin = ground-level centre of the footprint (deck + steps), +Y up, door faces +Z.
import * as THREE from 'three';

export const meta = {
  name: 'Zome cabin (planned)', layer: ['cabins', 'lake_cabins'], match: 'polygon centroid, door toward the path',
  footprint: [5.3, 7.2], height: 3.92,
  sources: [
    'D:/Dropbox/Wells Gray Resort/Photos/Concept Images/Village Concept/Building Concepts/Zomes/Replace_cabins_with_zomes_2K_202607280940*.jpeg',
    'D:/Dropbox/Wells Gray Resort/Photos/Concept Images/Village Concept/Building Concepts/Zomes/Replace_cabins_with_zomes_2K_202607280941.jpeg',
    'D:/Dropbox/Wells Gray Resort/Photos/Concept Images/Village Concept/Building Concepts/Zomes/Geometric_zome_dwellings_in_forest_20261024152204.jpg',
    'data/layers.json cabins (7 x 8 m sites) + lake_cabins (6 x 8 m sites)',
  ],
  notes: 'Concept design. Trillium 10-fold zonohedral shell (planar kite/rhombus panels), 5.3 m across, apex 3.9 m above ground (flue to 4.5 m), on a 0.35 m deck with 2 steps. ' +
    'Fits the smaller 6 x 8 m lakeside site (creekside sites are 7 x 8) with the door on a 6/7 m side. build() -> Group (body + emissive glass); ' +
    'buildMerged() -> one BufferGeometry (position/normal/color/glow, groups 0 body, 1 glass) for InstancedMesh; ' +
    'mergedMaterials() -> [body, glass] materials to use with it.',
};

// ---- shape parameters -------------------------------------------------------------------------------------
const N = 10;           // fold symmetry: 10 generating vectors (Trillium plans: 10 z1 panels, 18° base mitres)
const M0 = 4;           // ring m = N − k, k = rings below the apex; the plans cut at k = 6 → m = 4
const DECK_H = 0.35;    // deck top above ground
// Trillium 5 m plan: strut length L and generator elevation α. Ring k (below the apex) has radius
// L·cosα·sin(18k°)/sin18° and sits (6 − k)·L·sinα above the base (plan p.3–5, 11).
const TL = 0.994, TA = 37.25 * Math.PI / 180;
const ringR = k => TL * Math.cos(TA) * Math.sin(k * Math.PI / N) / Math.sin(Math.PI / N);
const RMAX = ringR(5);  // widest ring (2.561 m)
const R_BASE = ringR(6);
const PHI0 = -2 * Math.PI / N;   // a base edge (where the door goes) dead ahead (+Z); shell mirror-symmetric about x = 0
const RING = (() => {
  const rho = {}, y = {};
  for (let m = M0; m <= N; m++) { const k = N - m; rho[m] = ringR(k); y[m] = DECK_H + (6 - k) * TL * Math.sin(TA); }
  return { rho, y };
})();
const DECK_FRONT = RMAX + 1.3;   // front deck edge (before re-centring)
const DECK_BACK = -2.2;
const DECK_HALF_W = 2.45;
const STEP_D = 0.32, STEP_W = 1.7;
const Z_FRONT = DECK_FRONT + 2 * STEP_D;
const Z_SHIFT = -(Z_FRONT - RMAX) / 2;   // re-centre the footprint (steps .. shell back) on the origin
const DOOR = { hw: 0.6, top: DECK_H + 2.12, zf: RMAX + 0.11, zb: 1.55 };   // glass plane clears the ring-4 front vertex

// ---- colours ------------------------------------------------------------------------------------------------
const C = {
  shell: new THREE.Color('#a2a5a7'), seam: new THREE.Color('#6a6d70'), frame: new THREE.Color('#2f3336'),
  portal: new THREE.Color('#3b3f43'), glass: new THREE.Color('#7d5a38'), sky: new THREE.Color('#62707a'),
  deck: new THREE.Color('#8a6a4b'), fascia: new THREE.Color('#74563b'), gap: new THREE.Color('#3a2c21'),
  flue: new THREE.Color('#2b2c2e'), lamp: new THREE.Color('#ffe2b0'),
};

function hash(i) { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

// ---- geometry accumulator ---------------------------------------------------------------------------------
function makeBuf() {
  const b = { pos: [], col: [], glow: [] };
  const v3 = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
  // planar convex polygon; `out` = any vector pointing to the visible side (winding fixed to face it)
  b.poly = (pts, color, glow = 0, out = null) => {
    e1.subVectors(pts[1], pts[0]); e2.subVectors(pts[2], pts[0]); v3.crossVectors(e1, e2);
    if (out && v3.dot(out) < 0) pts = pts.slice().reverse();
    for (let i = 1; i < pts.length - 1; i++) for (const p of [pts[0], pts[i], pts[i + 1]]) {
      b.pos.push(p.x, p.y, p.z); b.col.push(color.r, color.g, color.b); b.glow.push(glow);
    }
  };
  // axis-aligned box, faces listed in `skip` ('-y','+y','-x','+x','-z','+z') are omitted
  b.box = (x0, x1, y0, y1, z0, z1, color, skip = ['-y'], sideColor = color) => {
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const F = {
      '+y': [[V(x0, y1, z0), V(x1, y1, z0), V(x1, y1, z1), V(x0, y1, z1)], V(0, 1, 0)],
      '-y': [[V(x0, y0, z0), V(x1, y0, z0), V(x1, y0, z1), V(x0, y0, z1)], V(0, -1, 0)],
      '+x': [[V(x1, y0, z0), V(x1, y1, z0), V(x1, y1, z1), V(x1, y0, z1)], V(1, 0, 0)],
      '-x': [[V(x0, y0, z0), V(x0, y1, z0), V(x0, y1, z1), V(x0, y0, z1)], V(-1, 0, 0)],
      '+z': [[V(x0, y0, z1), V(x1, y0, z1), V(x1, y1, z1), V(x0, y1, z1)], V(0, 0, 1)],
      '-z': [[V(x0, y0, z0), V(x1, y0, z0), V(x1, y1, z0), V(x0, y1, z0)], V(0, 0, -1)],
    };
    for (const k in F) if (!skip.includes(k)) b.poly(F[k][0], k === '+y' ? color : sideColor, 0, F[k][1]);
  };
  return b;
}

// ---- the zonohedral shell -----------------------------------------------------------------------------------
function ringV(m, k) {
  const y = RING.y[Math.min(m, N)];
  if (m >= N) return new THREE.Vector3(0, y, 0);
  const R = RING.rho[m];
  const phi = (2 * k + m - 1) * Math.PI / N + PHI0;
  return new THREE.Vector3(R * Math.sin(phi), y, R * Math.cos(phi));
}

// list of faces: { pts (outer, CCW-ish), m, k, kind: 'tri'|'rhomb' }
function shellFaces() {
  const F = [];
  for (let m = M0; m <= N - 1; m++) for (let k = 0; k < N; k++) {
    const top = ringV(m + 1, k), L = ringV(m, k), R = ringV(m, k + 1);
    if (m === M0) F.push({ pts: [L, R, top], m, k, kind: 'tri' });
    else F.push({ pts: [ringV(m - 1, k + 1), R, top, L], m, k, kind: 'rhomb' });
  }
  for (const f of F) {
    f.c = f.pts.reduce((a, p) => a.add(p), new THREE.Vector3()).multiplyScalar(1 / f.pts.length);
    f.ang = Math.atan2(f.c.x, f.c.z);
    const n = new THREE.Vector3().subVectors(f.pts[1], f.pts[0]).cross(new THREE.Vector3().subVectors(f.pts[2], f.pts[0])).normalize();
    if (n.dot(new THREE.Vector3(f.c.x, 0.25 * f.c.y, f.c.z)) < 0) n.negate();
    f.n = n;
  }
  return F;
}

// panel with a chamfered seam; raise > 0 pillows the panel out, < 0 recesses it (glass)
function panel(b, pts, n, color, edgeColor, seam, raise, glow = 0) {
  const c = pts.reduce((a, p) => a.clone().add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length);
  let inr = Infinity;   // distance from centroid to nearest edge
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], d = new THREE.Vector3().subVectors(pts[(i + 1) % pts.length], a).normalize();
    const ac = new THREE.Vector3().subVectors(c, a);
    inr = Math.min(inr, ac.sub(d.multiplyScalar(ac.dot(d))).length());
  }
  const s = Math.max(0.2, 1 - seam / inr);
  const inner = pts.map(p => p.clone().sub(c).multiplyScalar(s).add(c).addScaledVector(n, raise));
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    b.poly([pts[i], pts[j], inner[j], inner[i]], edgeColor, 0, n);
  }
  b.poly(inner, color, glow, n);
}

function addShell(b, lod) {
  const faces = shellFaces();
  // windows: upper triangles of two mid-height rhombi either side of the door, one at the back;
  // skylight: one top-row rhombus toward the front-right
  const near = (m, a) => faces.filter(f => f.m === m).reduce((best, f) =>
    Math.abs(Math.atan2(Math.sin(f.ang - a), Math.cos(f.ang - a))) < Math.abs(Math.atan2(Math.sin(best.ang - a), Math.cos(best.ang - a))) ? f : best);
  const win = new Set([near(6, 1.2), near(6, -1.2), near(6, Math.PI)]);
  const sky = new Set([near(8, 0.5)]);
  const hi = lod !== 'low';
  for (const f of faces) {
    const t = hash(f.m * 17 + f.k * 3);
    const tone = 0.9 + 0.18 * t + (f.m === M0 ? -0.05 : 0);
    const col = C.shell.clone().multiplyScalar(tone);
    if (t > 0.85) col.lerp(new THREE.Color('#9a958c'), 0.35);       // a few warmer panels
    const seamCol = col.clone().multiplyScalar(0.72);
    if (sky.has(f)) {
      if (hi) panel(b, f.pts, f.n, C.sky, C.frame, 0.07, -0.02);
      else b.poly(f.pts, C.sky, 0, f.n);
      continue;
    }
    if (win.has(f)) {
      // rhombus = lower triangle (cladding) + upper triangle (window)
      const [B, R, T, L] = f.pts;
      if (hi) { panel(b, [B, R, L], f.n, col, seamCol, 0.045, 0.012); panel(b, [L, R, T], f.n, C.glass, C.frame, 0.08, -0.035, 1); }
      else { b.poly([B, R, L], col, 0, f.n); b.poly([L, R, T], C.glass, 1, f.n); }
      continue;
    }
    if (hi) panel(b, f.pts, f.n, col, seamCol, 0.028, 0.008);
    else b.poly(f.pts, col, 0, f.n);
  }
  // apex cap
  const apex = ringV(N, 0), capY = apex.y + 0.08;
  if (hi) {
    const ring = [];
    for (let k = 0; k < N; k++) ring.push(ringV(N - 1, k).clone().lerp(apex, 0.82).setY(apex.y - 0.1));
    for (let k = 0; k < N; k++) {
      const a = ring[k], c = ring[(k + 1) % N], out = new THREE.Vector3(a.x + c.x, 0.5, a.z + c.z);
      b.poly([a, c, new THREE.Vector3(0, capY, 0)], C.frame, 0, out);
    }
  }
  return faces;
}

// z of the shell's front surface (facet plane through the +Z column) at height y
function shellFrontZ(y) {
  let m = M0; while (m < N - 1 && RING.y[m + 1] < y) m++;
  const f = Math.min(1, Math.max(0, (y - RING.y[m]) / (RING.y[m + 1] - RING.y[m]))), R = mm => RING.rho[mm];
  return (R(m) * (1 - f) + R(m + 1) * f) * Math.cos(Math.PI / N);
}

// ---- door portal ------------------------------------------------------------------------------------------
function addDoor(b, lod) {
  const { hw, top, zf, zb } = DOOR, y0 = DECK_H, V = (x, y, z) => new THREE.Vector3(x, y, z);
  const hi = lod !== 'low';
  // door dormer: vertical cheeks + a sloped hood that folds back into the shell, clad like the shell
  const rise = 0.62, yr = top + rise, zr = shellFrontZ(yr) - 0.06;
  const clad = C.shell.clone().multiplyScalar(0.97), cladDk = C.shell.clone().multiplyScalar(0.9);
  for (const sx of [-1, 1]) {
    const x = sx * hw, o = V(sx, 0, 0);
    b.poly([V(x, y0, zb), V(x, y0, zf), V(x, top, zf), V(x, top, zb)], cladDk, 0, o);
    b.poly([V(x, top, zf), V(x, yr, zr), V(x, top, zr)], cladDk, 0, o);
  }
  b.poly([V(-hw, top, zf), V(hw, top, zf), V(hw, yr, zr), V(-hw, yr, zr)], clad, 0, V(0, 1, 0.3));
  if (hi) b.box(-hw - 0.03, hw + 0.03, top - 0.02, top + 0.04, zf - 0.04, zf + 0.05, C.frame, ['-y', '-z']); // drip edge
  const fw = 0.08, gz = zf - 0.06;    // frame width, glass plane
  const xi0 = -hw + fw, xi1 = hw - fw, yi0 = y0 + 0.04, yi1 = top - fw;
  const out = V(0, 0, 1);
  // front frame ring
  b.poly([V(-hw, y0, zf), V(xi0, y0, zf), V(xi0, top, zf), V(-hw, top, zf)], C.frame, 0, out);
  b.poly([V(xi1, y0, zf), V(hw, y0, zf), V(hw, top, zf), V(xi1, top, zf)], C.frame, 0, out);
  b.poly([V(xi0, yi1, zf), V(xi1, yi1, zf), V(xi1, top, zf), V(xi0, top, zf)], C.frame, 0, out);
  if (hi) {
    // reveals
    b.poly([V(xi0, yi0, zf), V(xi0, yi1, zf), V(xi0, yi1, gz), V(xi0, yi0, gz)], C.frame, 0, V(1, 0, 0));
    b.poly([V(xi1, yi0, zf), V(xi1, yi1, zf), V(xi1, yi1, gz), V(xi1, yi0, gz)], C.frame, 0, V(-1, 0, 0));
    b.poly([V(xi0, yi1, zf), V(xi1, yi1, zf), V(xi1, yi1, gz), V(xi0, yi1, gz)], C.frame, 0, V(0, -1, 0));
    // door leaf + sidelight split by a mullion, threshold
    const mx = 0.16;
    b.poly([V(xi0, yi0, gz), V(mx - 0.025, yi0, gz), V(mx - 0.025, yi1, gz), V(xi0, yi1, gz)], C.glass, 1, out);
    b.poly([V(mx + 0.025, yi0, gz), V(xi1, yi0, gz), V(xi1, yi1, gz), V(mx + 0.025, yi1, gz)], C.glass, 1, out);
    b.box(mx - 0.025, mx + 0.025, yi0, yi1, gz - 0.01, gz + 0.03, C.frame, ['-y', '+y', '-z']);
    b.box(xi0, xi1, y0, yi0, gz, zf, C.frame, ['-y', '-z']);
    b.box(mx - 0.09, mx - 0.065, y0 + 0.95, y0 + 1.25, gz + 0.03, gz + 0.06, C.seam, ['-y', '-z']);  // pull handle
    // wall lamp on the right of the portal
    b.box(hw + 0.02, hw + 0.1, top - 0.55, top - 0.35, zf - 0.25, zf - 0.13, C.lamp, ['-x'], C.frame);
    const lb = b.pos.length / 3;  // the lamp box (5 faces = 30 vertices) glows
    for (let i = lb - 30; i < lb; i++) b.glow[i] = 1;
  } else {
    b.poly([V(xi0, yi0, gz), V(xi1, yi0, gz), V(xi1, yi1, gz), V(xi0, yi1, gz)], C.glass, 1, out);
    b.poly([V(-hw, y0, zf), V(hw, y0, zf), V(hw, yi0, zf), V(-hw, yi0, zf)], C.frame, 0, out);
  }
}

// ---- deck, steps, flue ----------------------------------------------------------------------------------------
function addDeck(b, lod) {
  const hi = lod !== 'low', w = DECK_HALF_W;
  if (!hi) {
    b.box(-w, w, 0, DECK_H, DECK_BACK, DECK_FRONT, C.deck, ['-y'], C.fascia);
    b.box(-STEP_W / 2, STEP_W / 2, 0, DECK_H / 2, DECK_FRONT, DECK_FRONT + 2 * STEP_D, C.deck, ['-y', '-z'], C.fascia);
    return;
  }
  // substructure: dark top (shows in the board gaps) + fascia
  b.box(-w, w, 0, DECK_H - 0.006, DECK_BACK, DECK_FRONT, C.gap, ['-y'], C.fascia);
  // boards run left-right, only where they can be seen (front + sides of the shell)
  const bw = 0.145, gap = 0.012;
  let i = 0;
  for (let z = DECK_FRONT; z > DECK_BACK + 0.01; z -= bw + gap, i++) {
    const z0 = Math.max(DECK_BACK, z - bw), tone = 0.88 + 0.22 * hash(i * 7.3);
    const col = C.deck.clone().multiplyScalar(tone);
    const V = (x, zz) => new THREE.Vector3(x, DECK_H, zz);
    b.poly([V(-w, z0), V(w, z0), V(w, z), V(-w, z)], col, 0, new THREE.Vector3(0, 1, 0));
  }
  // nosing board on the front edge
  b.box(-w - 0.02, w + 0.02, DECK_H - 0.12, DECK_H + 0.01, DECK_FRONT - 0.02, DECK_FRONT + 0.03, C.deck.clone().multiplyScalar(0.85), ['-y', '-z'], C.fascia);
  // two treads
  const s = STEP_W / 2;
  b.box(-s, s, 0, DECK_H * 2 / 3, DECK_FRONT, DECK_FRONT + STEP_D, C.deck.clone().multiplyScalar(0.95), ['-y', '-z'], C.fascia);
  b.box(-s, s, 0, DECK_H / 3, DECK_FRONT + STEP_D, DECK_FRONT + 2 * STEP_D, C.deck.clone().multiplyScalar(1.02), ['-y', '-z'], C.fascia);
}

function addFlue(b, lod) {
  const seg = lod === 'low' ? 6 : 8, r = 0.075, x = -0.9, z = -0.9, y0 = DECK_H + 2.6, y1 = DECK_H + 3.95;
  for (let i = 0; i < seg; i++) {
    const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
    const p = (a, y) => new THREE.Vector3(x + r * Math.sin(a), y, z + r * Math.cos(a));
    b.poly([p(a0, y0), p(a1, y0), p(a1, y1), p(a0, y1)], C.flue, 0, new THREE.Vector3(Math.sin((a0 + a1) / 2), 0, Math.cos((a0 + a1) / 2)));
    if (lod !== 'low') {   // rain cap
      const q = (a, y, rr) => new THREE.Vector3(x + rr * Math.sin(a), y, z + rr * Math.cos(a));
      b.poly([q(a0, y1 + 0.06, 0.17), q(a1, y1 + 0.06, 0.17), new THREE.Vector3(x, y1 + 0.16, z)], C.flue, 0, new THREE.Vector3(Math.sin(a0), 1, Math.cos(a0)));
      b.poly([q(a0, y1 + 0.06, 0.17), q(a1, y1 + 0.06, 0.17), new THREE.Vector3(x, y1 + 0.06, z)], C.flue, 0, new THREE.Vector3(0, -1, 0));
    }
  }
}

// ---- assembly -----------------------------------------------------------------------------------------------
function assemble(lod) {
  const b = makeBuf();
  addShell(b, lod); addDoor(b, lod); addDeck(b, lod); addFlue(b, lod);
  // split into body / glass, centre the footprint, flat normals
  const out = { body: { pos: [], col: [] }, glass: { pos: [], col: [] } };
  for (let t = 0; t < b.pos.length / 9; t++) {
    const g = b.glow[t * 3] ? out.glass : out.body;
    for (let v = 0; v < 3; v++) {
      const i = (t * 3 + v) * 3;
      g.pos.push(b.pos[i], b.pos[i + 1], b.pos[i + 2] + Z_SHIFT); g.col.push(b.col[i], b.col[i + 1], b.col[i + 2]);
    }
  }
  const geo = part => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(part.pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(part.col, 3));
    g.computeVertexNormals();   // non-indexed -> flat facets
    return g;
  };
  return { body: geo(out.body), glass: geo(out.glass) };
}

// Mike's Trillium Domes zome plans (D:/Dropbox/ALLPLANSBUNDLE-TrilliumDomes+3D/AllZomesBundle-TrilliumDomes+3D, metric
// PDFs p.0): widest diameter × height (shell). The geometry above is the 9-fold, 5-row Trillium zome at 5 m; the
// larger plans keep the same panel layout, so other sizes scale it (shell width and height separately).
const shellOf = (L, a) => ({ r: L * Math.cos(a) / Math.sin(Math.PI / N), h: 6 * L * Math.sin(a) });
export const SIZES = {   // strut length + generator angle per plan; 7.5 m is the 6 m plan scaled by 1.2246
  '5m': shellOf(0.994, 37.25 * Math.PI / 180), '6m': shellOf(1.162, 33.05 * Math.PI / 180), '7.5m': shellOf(1.423, 33.05 * Math.PI / 180),
};
function sizeScale(size) { const s = SIZES[size] || SIZES['5m'], b = SIZES['5m']; return [s.r / b.r, s.h / b.h]; }

export function mergedMaterials() {
  return [
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.62, metalness: 0.12 }),
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.25, metalness: 0.0, emissive: 0xffaa55, emissiveIntensity: 0.85 }),
  ];
}

export function build({ lod = 'high', size = '5m' } = {}) {
  const { body, glass } = assemble(lod);
  const [sx, sy] = sizeScale(size); body.scale(sx, sy, sx); glass.scale(sx, sy, sx);
  const [mb, mg] = mergedMaterials();
  const g = new THREE.Group(); g.name = 'zome';
  const a = new THREE.Mesh(body, mb); a.name = 'zome_body';
  const c = new THREE.Mesh(glass, mg); c.name = 'zome_glass'; c.castShadow = false;
  g.add(a, c);
  return g;
}

// One BufferGeometry: position / normal / color + `glow` (1 on glazing and lamp).
// groups: 0 = body, 1 = glass -> new THREE.InstancedMesh(buildMerged(), mergedMaterials(), count)
// (or ignore the groups and use a single vertexColors material; glazing is a warm light colour either way).
export function buildMerged({ lod = 'high', size = '5m' } = {}) {
  const { body, glass } = assemble(lod);
  const [sx, sy] = sizeScale(size); body.scale(sx, sy, sx); glass.scale(sx, sy, sx);
  const nb = body.attributes.position.count, ng = glass.attributes.position.count;
  const g = new THREE.BufferGeometry();
  for (const k of ['position', 'normal', 'color']) {
    const arr = new Float32Array((nb + ng) * 3);
    arr.set(body.attributes[k].array, 0); arr.set(glass.attributes[k].array, nb * 3);
    g.setAttribute(k, new THREE.BufferAttribute(arr, 3));
  }
  const glow = new Float32Array(nb + ng); glow.fill(1, nb);
  g.setAttribute('glow', new THREE.BufferAttribute(glow, 1));
  g.addGroup(0, nb, 0); g.addGroup(nb, ng, 1);
  g.computeBoundingBox(); g.computeBoundingSphere();
  body.dispose(); glass.dispose();
  return g;
}

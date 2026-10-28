// Horse Corrals — the board-fenced pens in the trees between the festival field and the event space.
// Fence line follows the public_areas polygon (≈32.6 × 9.4 m). From the drone mosaic: the NE ~20 m is a 2 × 3 grid of
// pens (a long central divider + cross fences), the SW end runs into the tree canopy (modelled as one open paddock).
// Fence style from Horse Corrals/01.jpg: wide horizontal planks (pallet-board look) on square posts, ~1.5 m tall,
// Z-braced board gates; weathered to tan-grey in the later drone imagery. Black water tubs in two pens.
// Posts, boards and gate pieces are InstancedMeshes (one draw call each).
import * as THREE from 'three';

export const meta = {
  name: 'Horse Corrals',
  layer: 'public_areas',
  match: 2, // public_areas feature 2: 4-vertex quad 32.6 × 9.4 m, centroid (-196.9, -209.3), NW of the event space
  footprint: [33.6, 9.6],
  height: 1.6,
  place: { x: -196.86, y: -209.29, rotY: 0.6489 }, // long axis bearing ~53° (NE); +Z (gated side) faces SE onto the field
  sources: [
    'Photos/Horse Corrals/01.jpg (plank fence + Z-braced gate, ~1.5 m, trees behind)',
    'Photos/Horse Corrals/02.jpg, Horses in the Field.jpg, Horses.HEIC (context only)',
    'landmap drone tiles z19/z20 (2 × 3 grid of pens with pale weathered rails at the NE end of the polygon, SW end under trees)',
  ],
  notes: 'See models/notes/horse_corrals.md',
};

// polygon in model-local metres (x = NE along the long axis, z = SE), CCW as in layers.json
const POLY = [[-16.48, -4.76], [16.17, -4.68], [17.11, 4.68], [-16.8, 4.76]];
const BACK = [POLY[0], POLY[1]], FRONT = [POLY[3], POLY[2]], SW = [POLY[0], POLY[3]], NE = [POLY[1], POLY[2]];
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const atX = (e, x) => lerp(e[0], e[1], (x - e[0][0]) / (e[1][0] - e[0][0])); // point on a long edge at local x
const atZ = (e, z) => lerp(e[0], e[1], (z - e[0][1]) / (e[1][1] - e[0][1])); // point on a short edge at local z
const GRID_X0 = -3.2, CROSS = [-3.2, 3.4, 10.0];        // pen grid starts here; cross fences
const BOARD_Y = [0.28, 0.58, 0.88, 1.18, 1.46], BH = 0.19, POST_H = 1.62;

// runs: [a, b, side(+1/-1 board offset along the run's left normal), gates: [[t centre (m from a), width]]]
function runs() {
  const mid = atZ(NE, 0), midW = [GRID_X0, 0];
  const R = [
    [BACK[0], BACK[1], -1, []],
    [FRONT[0], FRONT[1], 1, [[6.3, 3.0], [16.3 - 0.0, 3.0], [23.0, 3.0], [29.6, 3.0]]],
    [SW[0], SW[1], -1, [[4.7, 3.0]]],
    [NE[0], NE[1], 1, []],
    [midW, mid, 1, [[3.3, 2.6], [9.9, 2.6], [16.5, 2.6]]],
  ];
  for (const x of CROSS) { R.push([atX(BACK, x), [x, 0], 1, []]); R.push([[x, 0], atX(FRONT, x), 1, []]); }
  return R;
}

export function build({ lod = 'high' } = {}) {
  const hi = lod !== 'low';
  const g = new THREE.Group();
  const posts = [], boards = [], gates = [];
  const m4 = (x, y, z, sx, sy, sz, ry, rz = 0) => new THREE.Matrix4().compose(V3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, rz, 'YXZ')), V3(sx, sy, sz));
  for (const [a, b, side, gs] of runs()) {
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
    const ry = Math.atan2(-dz, dx);                    // rotates local +x onto the run direction
    const nx = -uz * side, nz = ux * side;             // board offset direction
    const P = t => [a[0] + ux * t, a[1] + uz * t];
    if (!hi) {                                          // low: long boards per run, posts every ~6 m
      const n = Math.max(1, Math.round(L / 6));
      for (let i = 0; i <= n; i++) { const [x, z] = P((L * i) / n); posts.push(m4(x, POST_H / 2 - 0.4, z, 0.16, POST_H + 0.4, 0.16, ry)); }
      for (const y of [0.4, 0.9, 1.4]) { const [x, z] = P(L / 2); boards.push(m4(x + nx * 0.09, y, z + nz * 0.09, L, 0.22, 0.04, ry)); }
      continue;
    }
    // post stations: ends, gate jambs, fill ≤ 2.4 m
    const cuts = [0, L]; const gap = [];
    for (const [c, w] of gs) { cuts.push(c - w / 2, c + w / 2); gap.push([c - w / 2, c + w / 2]); }
    cuts.sort((p, q) => p - q);
    const st = [];
    for (let i = 0; i < cuts.length - 1; i++) {
      const s0 = cuts[i], s1 = cuts[i + 1], n = Math.max(1, Math.ceil((s1 - s0) / 2.4));
      for (let k = 0; k < n; k++) st.push(s0 + ((s1 - s0) * k) / n);
    }
    st.push(L);
    for (const t of st) { const [x, z] = P(t); const jamb = gap.some(([p, q]) => Math.abs(t - p) < 0.01 || Math.abs(t - q) < 0.01); const s = jamb ? 0.18 : 0.14; posts.push(m4(x, POST_H / 2 - 0.4 + (jamb ? 0.05 : 0), z, s, POST_H + 0.4 + (jamb ? 0.1 : 0), s, ry)); }
    for (let i = 0; i < st.length - 1; i++) {
      const t0 = st[i], t1 = st[i + 1], tm = (t0 + t1) / 2, len = t1 - t0 + 0.12;
      const inGate = gap.some(([p, q]) => tm > p && tm < q);
      const [x, z] = P(tm);
      if (!inGate) { for (const y of BOARD_Y) boards.push(m4(x + nx * 0.09, y, z + nz * 0.09, len, BH, 0.035, ry)); continue; }
      // Z-braced board gate, closed, hung just outside the line
      const gw = t1 - t0 - 0.1, ox = x + nx * 0.14, oz = z + nz * 0.14;
      for (const y of [0.3, 0.62, 0.94, 1.26]) gates.push(m4(ox, y, oz, gw, 0.17, 0.035, ry));
      const [x0, z0] = P(t0 + 0.12), [x1, z1] = P(t1 - 0.12);
      for (const [sx, sz] of [[x0, z0], [x1, z1]]) gates.push(m4(sx + nx * 0.17, 0.78, sz + nz * 0.17, 0.12, 1.15, 0.035, ry));
      const diag = Math.atan2(0.96, gw - 0.24), dl = Math.hypot(0.96, gw - 0.24);
      gates.push(m4(ox + nx * 0.03, 0.78, oz + nz * 0.03, dl, 0.12, 0.035, ry, diag));
    }
  }
  const unit = new THREE.BoxGeometry(1, 1, 1);
  const mkInst = (list, color, rough, seed, vary) => {
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: rough });
    const im = new THREE.InstancedMesh(unit, mat, list.length);
    let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const c = new THREE.Color(), base = new THREE.Color(color), fresh = new THREE.Color(0xb98d5c), grey = new THREE.Color(0x9a948a);
    list.forEach((m, i) => {
      im.setMatrixAt(i, m);
      c.copy(base).lerp(r() < 0.5 ? fresh : grey, r() * vary).multiplyScalar(0.9 + r() * 0.16); im.setColorAt(i, c);
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.castShadow = im.receiveShadow = true; return im;
  };
  g.add(mkInst(posts, 0x7f7466, 0.95, 3, 0.4));
  g.add(mkInst(boards, 0xa38c6c, 0.9, 7, 0.7));
  if (gates.length) g.add(mkInst(gates, 0xab9070, 0.9, 9, 0.6));
  if (hi) { // black water tubs (one per front pen row + paddock)
    const tub = new THREE.MeshStandardMaterial({ color: 0x1f1f21, roughness: 0.6 });
    const water = new THREE.MeshStandardMaterial({ color: 0x3d4a50, roughness: 0.1, metalness: 0.2 });
    for (const [x, z] of [[1.0, 3.3], [12.0, -3.4], [-12.0, 3.0]]) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.48, 0.45, 14, 1, true), tub); t.position.set(x, 0.22, z); g.add(t);
      const w = new THREE.Mesh(new THREE.CircleGeometry(0.52, 14), water); w.rotation.x = -Math.PI / 2; w.position.set(x, 0.38, z); g.add(w);
    }
  }
  return g;
}
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

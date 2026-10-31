// Geodesic glamping dome on its deck — Wells Gray Golf & RV Resort (Portal.Place).
// The dome is a hex-cell ("Goldberg") dome: the dual of a 3-frequency icosphere, cut flat at the base so the
// bottom row is half-cells, sitting on a black base ring. Each cell is a puffy quilted grey cushion behind clear
// PVC (light welded seams between cells); a band of clear cells (panoramic window) looks onto the open deck.
// The door is a flat framed panel in a small dormer on the far side, with a black step at the deck edge.
// Deck: 7 × 10 m natural pine platform, dome at one end, open end with rug + two red Adirondack chairs and a
// closed cantilever umbrella. Origin = ground centre of the deck; +Z = the dome door side (faces NE on site).
import * as THREE from 'three';

export const meta = {
  name: 'Geodesic glamping dome + deck',
  slug: 'dome',
  layer: 'accomodations_for_rent',
  match: 5,
  footprint: [7.0, 10.0],
  height: 3.1,
  // x/y = local site metres (x east, y north) of the polygon centroid; rotY = three.js rotation.y.
  // Model +Z (door) -> NE along the deck's long axis (bearing ~47°); open deck/window end -> SW.
  place: { x: -152.66, y: -151.76, rotY: 2.314 },
  sources: [
    'Photos/Drone Shots/Dome Birds eye.JPG (top-down: deck 10×7, dome Ø≈5 m at NE end, door dormer + step on NE side, chairs/rug at SW end; FlightYaw -47° gives orientation)',
    'Photos/Dome/Dome2.jpeg, Dome at Night with beautiful view.jpg (big rectangular deck, black base ring, closed umbrella, red chairs)',
    'Photos/Dome/PXL_20240824_024017241-EDIT.jpg (fresh pine deck, umbrella, clear lower cells)',
    'Photos/Dome/PXL_20240518_204102480~2.jpg (cell pattern, door frame; older octagon platform)',
    'Photos/Dome/PXL_20240519_0135*.jpg, PXL_20240801_175245752-EDIT.jpg (interior: clear panoramic window toward deck/creek)',
  ],
  notes: 'Dome Ø≈5.0 m (base ring), cells = dual of 3V icosphere (~15 cells round the base). '
    + 'Polygon 5 matches the drone deck size/orientation, but the ortho shows the deck ~10 m NE of it '
    + '(≈ x -144, y -146) and the drone GPS puts the dome near x -149, y -160 — placement follows the polygon.',
};

const DECK_W = 7.0, DECK_L = 10.0, DECK_H = 0.3;
const FREQ = 3;
const RING_H = 0.28, R = 2.45, DOME_Z = 1.55;   // dome centre sits 1.55 m toward +Z from deck centre
const DOOR_HW = 0.5, DOOR_HD = 2.0;             // door dormer half-width + height (the shell is cut away inside it)
const SHELL_ROT = -Math.PI / 4;                 // Mike 2026-10-28: the panel pattern turns 45° clockwise
const UP = new THREE.Vector3(0, 1, 0);
// the dormer's footprint through the shell, in the shell's own (unturned) frame: |x| < half-width, y < height, z > 0
const DOOR_CUT = [[1, 0, 0, -DOOR_HW], [-1, 0, 0, -DOOR_HW], [0, 1, 0, -DOOR_HD], [0, 0, -1, 0]];
const toDoor = v => v.applyAxisAngle(UP, SHELL_ROT);

// Remove the parts of a mesh that fall inside a convex region (inside = every plane a·x+b·y+c·z+d < 0), slicing
// triangles exactly on the planes and interpolating every attribute, so the cut edge meets the dormer with no gap.
function cutConvex(geo, planes, toFrame) {
  const src = geo.index ? geo.toNonIndexed() : geo, names = Object.keys(src.attributes), A = names.map(n => src.attributes[n]);
  const out = names.map(() => []), pos = src.attributes.position;
  const vert = i => ({ d: A.map(a => Array.from(a.array.slice(i * a.itemSize, (i + 1) * a.itemSize))), q: toFrame(new THREE.Vector3().fromBufferAttribute(pos, i)) });
  const side = (v, p) => p[0] * v.q.x + p[1] * v.q.y + p[2] * v.q.z + p[3];
  const mix = (a, b, t) => ({ d: a.d.map((x, k) => x.map((v, c) => v + (b.d[k][c] - v) * t)), q: a.q.clone().lerp(b.q, t) });
  const clip = (poly, p, sgn) => {        // keep sgn·side >= 0
    const r = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], sa = sgn * side(a, p), sb = sgn * side(b, p);
      if (sa >= 0) r.push(a);
      if ((sa >= 0) !== (sb >= 0)) r.push(mix(a, b, sa / (sa - sb)));
    }
    return r;
  };
  const emit = poly => { for (let t = 1; t < poly.length - 1; t++) for (const v of [poly[0], poly[t], poly[t + 1]]) v.d.forEach((x, k) => out[k].push(...x)); };
  for (let i = 0; i < pos.count; i += 3) {
    const tri = [vert(i), vert(i + 1), vert(i + 2)];
    if (planes.some(p => tri.every(v => side(v, p) >= 0))) { emit(tri); continue; }   // wholly outside one plane
    // outside = (outside plane 0) + (inside 0, outside 1) + (inside 0 and 1, outside 2) + …
    for (let k = 0; k < planes.length; k++) {
      let poly = tri;
      for (let j = 0; j < k && poly.length >= 3; j++) poly = clip(poly, planes[j], -1);
      if (poly.length >= 3) poly = clip(poly, planes[k], 1);
      if (poly.length >= 3) emit(poly);
    }
  }
  const g = new THREE.BufferGeometry();
  names.forEach((n, k) => g.setAttribute(n, new THREE.Float32BufferAttribute(out[k], A[k].itemSize)));
  return g;
}

// ---------- geodesic (Goldberg) cells ----------
function goldbergCells(freq) {
  const h = 1 / Math.sqrt(5), r = 2 / Math.sqrt(5), base = [[0, 1, 0]];
  for (let k = 0; k < 5; k++) { const a = k * 2 * Math.PI / 5; base.push([r * Math.cos(a), h, r * Math.sin(a)]); }
  for (let k = 0; k < 5; k++) { const a = (k + 0.5) * 2 * Math.PI / 5; base.push([r * Math.cos(a), -h, r * Math.sin(a)]); }
  base.push([0, -1, 0]);
  const F = [];
  for (let k = 0; k < 5; k++) {
    const U = 1 + k, U1 = 1 + (k + 1) % 5, L = 6 + k, L1 = 6 + (k + 1) % 5;
    F.push([0, U, U1], [U, L, U1], [U1, L, L1], [L, 11, L1]);
  }
  const V = base.map(p => new THREE.Vector3(...p));
  const verts = [], key = new Map(), tris = [];
  const vid = (p) => {
    p.normalize(); const k = `${p.x.toFixed(5)},${p.y.toFixed(5)},${p.z.toFixed(5)}`;
    if (!key.has(k)) { key.set(k, verts.length); verts.push(p.clone()); } return key.get(k);
  };
  for (const f of F) {
    let [A, B, C] = f.map(i => V[i]);
    const n = new THREE.Vector3().subVectors(B, A).cross(new THREE.Vector3().subVectors(C, A));
    if (n.dot(new THREE.Vector3().add(A).add(B).add(C)) < 0) [B, C] = [C, B];
    const P = (i, j) => vid(new THREE.Vector3().addScaledVector(A, (freq - i - j) / freq)
      .addScaledVector(B, i / freq).addScaledVector(C, j / freq));
    for (let i = 0; i < freq; i++) for (let j = 0; j < freq - i; j++) {
      tris.push([P(i, j), P(i + 1, j), P(i, j + 1)]);
      if (i + j < freq - 1) tris.push([P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)]);
    }
  }
  const cent = tris.map(t => new THREE.Vector3().add(verts[t[0]]).add(verts[t[1]]).add(verts[t[2]]).normalize());
  const inc = verts.map(() => []);
  tris.forEach((t, i) => t.forEach(v => inc[v].push(i)));
  return verts.map((v, i) => {
    const t1 = new THREE.Vector3(0, 1, 0).cross(v); if (t1.lengthSq() < 1e-6) t1.set(1, 0, 0); t1.normalize();
    const t2 = new THREE.Vector3().crossVectors(v, t1);
    const cs = inc[i].map(fi => cent[fi]);
    cs.sort((a, b) => Math.atan2(a.clone().sub(v).dot(t2), a.clone().sub(v).dot(t1))
      - Math.atan2(b.clone().sub(v).dot(t2), b.clone().sub(v).dot(t1)));
    return { c: v.clone(), corners: cs };
  });
}

// clip a cell polygon (unit sphere) to y >= 0; points on the cut are pushed out to the base circle
function clipBase(poly) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    if (a.y >= 0) out.push(a.clone());
    if ((a.y >= 0) !== (b.y >= 0)) {
      const t = a.y / (a.y - b.y), p = a.clone().lerp(b, t); p.y = 0;
      p.setLength(1); out.push(p);
    }
  }
  return out;
}

function plankTexture(base, line, boards = 16, size = 256) {
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const g = cv.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, size, size);
  const bw = size / boards;
  for (let i = 0; i < boards; i++) {
    const s = 0.9 + ((i * 37) % 11) / 55;  // per-board tone
    g.fillStyle = `rgba(${s > 1 ? 255 : 0},${s > 1 ? 240 : 0},${s > 1 ? 210 : 0},${Math.abs(s - 1) * 0.9})`;
    g.fillRect(0, i * bw, size, bw);
    g.fillStyle = line; g.fillRect(0, i * bw, size, Math.max(1, bw * 0.08));
    // a few butt joints
    g.fillRect(((i * 71) % size), i * bw, 2, bw);
  }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

function box(w, h, d, mat, x, y, z, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); parent.add(m); return m;
}

function adirondack(mat, lod) {
  const c = new THREE.Group();
  if (lod === 'low') { box(0.7, 0.9, 0.8, mat, 0, 0.45, 0, c); return c; }
  // front of the chair faces -Z (local): seat slopes down toward the back, a tall fan of back slats reclines
  // backward, wide flat arms (PXL_20240801_175245752-EDIT.jpg)
  for (let i = 0; i < 5; i++) {                       // seat slats, front edge higher
    const s = box(0.56, 0.03, 0.09, mat, 0, 0.4 - i * 0.025, -0.26 + i * 0.11, c); s.rotation.x = 0.2;
  }
  [-0.22, -0.11, 0, 0.11, 0.22].forEach((x, i) => {  // back slats, the middle ones tallest
    const h = 0.85 + (2 - Math.abs(i - 2)) * 0.06;
    const s = box(0.085, h, 0.025, mat, x * (1 + 0.15), 0.3 + h / 2 * Math.cos(0.42), 0.26 + h / 2 * Math.sin(0.42), c);
    s.rotation.x = 0.42; s.rotation.z = -x * 0.35;
  });
  box(0.58, 0.05, 0.03, mat, 0, 0.62, 0.42, c);                                                         // back rail
  box(0.13, 0.03, 0.8, mat, -0.37, 0.6, 0.0, c); box(0.13, 0.03, 0.8, mat, 0.37, 0.6, 0.0, c);          // arms
  box(0.05, 0.58, 0.07, mat, -0.33, 0.29, -0.3, c); box(0.05, 0.58, 0.07, mat, 0.33, 0.29, -0.3, c);    // front legs
  const rl = box(0.05, 0.1, 0.8, mat, -0.3, 0.2, 0.1, c); rl.rotation.x = 0.3;                          // rear runners
  const rr = box(0.05, 0.1, 0.8, mat, 0.3, 0.2, 0.1, c); rr.rotation.x = 0.3;
  return c;
}

export function build({ lod = 'high' } = {}) {
  const hi = lod !== 'low';
  const g = new THREE.Group(); g.name = 'dome';

  // ---------- deck ----------
  const rim = new THREE.MeshStandardMaterial({ color: 0x8a4e34, roughness: 0.9 });
  const deckTop = hi
    ? new THREE.MeshStandardMaterial({ map: (() => { const t = plankTexture('#9a5a3c', 'rgba(50,25,15,0.55)'); t.repeat.set(1, DECK_L / (16 * 0.14)); return t; })(), roughness: 0.85 })
    : new THREE.MeshStandardMaterial({ color: 0x9a5a3c, roughness: 0.9 });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(DECK_W, DECK_H, DECK_L), [rim, rim, deckTop, rim, rim, rim]);
  deck.position.y = DECK_H / 2; g.add(deck);
  if (hi) { // sleepers showing under the rim, read at close range
    const dark = new THREE.MeshStandardMaterial({ color: 0x5d4c3a, roughness: 1 });
    for (const x of [-3.2, 0, 3.2]) box(0.14, 0.06, DECK_L - 0.2, dark, x, 0.03, 0, g);
  }

  const domeStart = g.children.length;   // everything added from here to the open-deck section is the dome itself

  // ---------- base ring ----------
  const black = new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.6 });
  const yb = DECK_H + RING_H;
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.07, R + 0.07, RING_H, hi ? 24 : 12, 1, true), black);
  ring.position.set(0, DECK_H + RING_H / 2, DOME_Z); g.add(ring);
  const lip = new THREE.Mesh(new THREE.RingGeometry(R - 0.12, R + 0.07, hi ? 24 : 12), black);
  lip.rotation.x = -Math.PI / 2; lip.position.set(0, yb, DOME_Z); g.add(lip);
  const floorM = new THREE.MeshStandardMaterial({ color: 0x4f4036, roughness: 0.8 });   // dark stained plywood (Dome Interior.jpg)
  const fl = new THREE.Mesh(new THREE.CircleGeometry(R - 0.1, hi ? 20 : 10), floorM);
  fl.rotation.x = -Math.PI / 2; fl.position.set(0, yb + 0.005, DOME_Z); g.add(fl);

  // ---------- dome shell ----------
  const cells = goldbergCells(FREQ);
  // rotate cells about Y so a column of cells is centred on the door (+Z) and window (-Z)
  const spin = new THREE.Matrix4().makeRotationY(Math.PI / 10);
  const pos = [], col = [], idx = [], cpos = [];
  const C = (hex) => new THREE.Color(hex);
  // glossy white translucent panels in the photos (Dome1/Dome2.jpeg), not grey
  const cCentre = C(0xf6f7f6), cMid = C(0xeef0ef), cEdge = C(0xe1e4e5), cSeam = C(0xfbfbfa), cFrame = C(0xf2f3f3);
  const push = (v, c) => { pos.push(v.x, v.y, v.z); col.push(c.r, c.g, c.b); return pos.length / 3 - 1; };
  const S = (u, r) => u.clone().normalize().multiplyScalar(r);
    let nClear = 0;
  const ledPolys = [];
  for (const cell of cells) {
    const c0 = cell.c.clone().applyMatrix4(spin);
    if (c0.y < -0.2) continue;
    let poly = cell.corners.map(p => p.clone().applyMatrix4(spin));
    if (poly.some(p => p.y < 0)) poly = clipBase(poly);
    if (poly.length < 3 || Math.max(...poly.map(p => p.y)) < 0.02) continue;
    const p = poly.reduce((a, b) => a.add(b), new THREE.Vector3()).normalize();
    const ctr = c0.y > 0.05 ? c0 : p;
    const az = Math.atan2(ctr.x, -ctr.z);              // 0 = facing -Z (open deck)
    const clear = Math.abs(az) < 1.15 && ctr.y < 0.62;   // panoramic window band facing the open deck
    const k = poly.length;
    const tone = 0.97 + ((cells.indexOf(cell) * 53) % 7) / 100;
    if (!hi) {
      if (clear) { // flat transparent pane
        const b = cpos.length / 3; cpos.push(...S(ctr, R).toArray());
        for (let i = 0; i < k; i++) cpos.push(...S(poly[i], R).toArray());
        // stored as fan later
        cpos.push(NaN, k, b); // marker (k, base) — unpacked below
        nClear++; continue;
      }
      const ci = push(poly.reduce((a, q) => a.add(S(q, R)), new THREE.Vector3()).divideScalar(k), cCentre.clone().multiplyScalar(tone));
      const ei = poly.map(q => push(S(q, R), cEdge));
      for (let i = 0; i < k; i++) idx.push(ci, ei[i], ei[(i + 1) % k]);
      continue;
    }
    ledPolys.push(poly);
    const seam = poly.map(q => push(S(q, R - 0.015), clear ? cFrame : cSeam));
    const qn = poly.map(q => ctr.clone().lerp(q, 0.88));
    if (clear) {
      const ed = qn.map(q => push(S(q, R - 0.005), cFrame));
      for (let i = 0; i < k; i++) { const j = (i + 1) % k; idx.push(seam[i], seam[j], ed[j], seam[i], ed[j], ed[i]); }
      const b = cpos.length / 3; cpos.push(...S(ctr, R - 0.005).toArray());
      for (let i = 0; i < k; i++) cpos.push(...S(qn[i], R - 0.005).toArray());
      cpos.push(NaN, k, b); nClear++;
      continue;
    }
    // flat panels (Mike 2026-10-29: the real ones are fairly flat, not puffy): every point on the plane of the
    // panel's corners, only the seams sit on the sphere
    const Cq = poly.map(q => S(q, R + 0.005)), Cc = Cq.reduce((a, b) => a.clone().add(b), new THREE.Vector3()).divideScalar(k);
    const ed = Cq.map(q => push(Cc.clone().lerp(q, 0.88), cEdge.clone().multiplyScalar(tone)));
    const md = Cq.map(q => push(Cc.clone().lerp(q, 0.5), cMid.clone().multiplyScalar(tone)));
    const ci = push(Cc, cCentre.clone().multiplyScalar(tone));
    for (let i = 0; i < k; i++) {
      const j = (i + 1) % k;
      idx.push(seam[i], seam[j], ed[j], seam[i], ed[j], ed[i]);
      idx.push(ed[i], ed[j], md[j], ed[i], md[j], md[i]);
      idx.push(ci, md[i], md[j]);
    }
  }
  const shellGeo = new THREE.BufferGeometry();
  shellGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  shellGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  shellGeo.setIndex(idx); shellGeo.computeVertexNormals();
  const shellCut = cutConvex(shellGeo, DOOR_CUT, toDoor);   // no panels inside the door dormer
  const shellMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.22, metalness: 0.05, side: THREE.DoubleSide, emissive: 0xfff4e6, emissiveIntensity: 0.12 });
  shellMat.userData.noSurface = true;   // no board/shingle lines on the panels
  shellMat.shadowSide = THREE.BackSide;
  const shell = new THREE.Mesh(shellCut, shellMat); shell.name = 'dome_shell'; shell.position.set(0, yb, DOME_Z); g.add(shell);

  // clear panes (unpack fans)
  const cp = [], ci2 = [];
  { let i = 0; const raw = cpos; const pts = [];
    // raw holds groups: centre, k corners, then marker (NaN, k, base)
    let start = 0;
    for (i = 0; i < raw.length; i += 3) {
      if (Number.isNaN(raw[i])) {
        const k = raw[i + 1]; const grp = raw.slice(start, i);
        const b = cp.length / 3; cp.push(...grp);
        for (let j = 0; j < k; j++) ci2.push(b, b + 1 + j, b + 1 + (j + 1) % k);
        start = i + 3;
      }
    }
  }
  const paneGeo = new THREE.BufferGeometry();
  paneGeo.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)); paneGeo.setIndex(ci2); paneGeo.computeVertexNormals();
  const paneMat = new THREE.MeshStandardMaterial({ color: 0x8fa3b4, roughness: 0.08, metalness: 0.5, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false });
  const panes = new THREE.Mesh(cutConvex(paneGeo, DOOR_CUT, toDoor), paneMat); panes.position.set(0, yb, DOME_Z); panes.renderOrder = 2; g.add(panes);
  // Mike (2026-10-28): only the shell's panel pattern (and its clear window band) turns 45° clockwise; the door,
  // deck and furniture stay where they are
  shell.rotation.y = panes.rotation.y = SHELL_ROT;

  // ---------- RGB LED strips (Mike 2026-10-29) ----------
  // One strip on every seam where two panels meet: each shared edge once (no doubling), none along the base where
  // the panels meet the ring. The real dome has LED strings on its seams (PXL_20240519_0134*.jpg). Drawn as discrete
  // LEDs (~10 cm apart) running one WLED-style effect Mike picked (2026-10-29) from a set of five: a smooth
  // purple-pink rising wave. Clock = the film's time (globalThis.FT_TIME, set in land.js) so recordings
  // are repeatable; wall time in the model preview.
  if (hi) {
    const seen = new Set(), P = [], D = [], Ld = [], Ac = [], I = [], RL = R + 0.012, HWD = 0.024, SEG = 4, PITCH = 0.1;
    const k3 = v => `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
    let led = 0;
    for (const poly of ledPolys) for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      if (a.y < 0.01 && b.y < 0.01) continue;                       // base edge, sits on the ring
      const ka = k3(a), kb = k3(b), key = ka < kb ? ka + '|' + kb : kb + '|' + ka;
      if (seen.has(key)) continue; seen.add(key);
      const n = Math.max(2, Math.round(a.angleTo(b) * RL / PITCH)), base = P.length / 3;
      for (let s = 0; s <= SEG; s++) {
        const p = a.clone().lerp(b, s / SEG).normalize(), t = b.clone().sub(a).normalize();
        const side = new THREE.Vector3().crossVectors(t, p).normalize().multiplyScalar(HWD);
        const c = p.clone().multiplyScalar(RL);
        for (const sg of [1, -1]) {
          P.push(c.x + side.x * sg, c.y + side.y * sg, c.z + side.z * sg); D.push(p.x, p.y, p.z);
          Ld.push(led + (s / SEG) * n); Ac.push(sg);
        }
      }
      for (let s = 0; s < SEG; s++) { const q = base + s * 2; I.push(q, q + 1, q + 3, q, q + 3, q + 2); }
      led += n + 1;
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); lg.setAttribute('aDir', new THREE.Float32BufferAttribute(D, 3));
    lg.setAttribute('aLed', new THREE.Float32BufferAttribute(Ld, 1)); lg.setAttribute('aAcross', new THREE.Float32BufferAttribute(Ac, 1));
    lg.setIndex(I);
    const lm = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 } }]),
      vertexShader: `attribute vec3 aDir; attribute float aLed; attribute float aAcross;
        varying vec3 vDir; varying float vLed; varying float vAcross;
        #include <fog_pars_vertex>
        void main() { vDir = aDir; vLed = aLed; vAcross = aAcross;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `uniform float uTime; varying vec3 vDir; varying float vLed; varying float vAcross;
        #include <fog_pars_fragment>
        vec3 hsv(float h, float s, float v) { vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); return v * mix(vec3(1.0), k, s); }
        void main() {
          // the smooth purple-pink "rising wave" Mike picked: soft bands of blue→violet→pink rolling up the dome
          float az = atan(vDir.x, vDir.z) / 6.2831853, w = 0.5 + 0.5 * sin(vDir.y * 9.0 - uTime * 3.0);
          vec3 c = hsv(fract(0.55 + 0.3 * w + az * 0.2), 1.0, 0.2 + 0.8 * w);
          float led = 1.0 - smoothstep(0.22, 0.42, abs(fract(vLed) - 0.5));     // a bright dot per LED
          float across = 1.0 - smoothstep(0.35, 1.0, abs(vAcross));
          float lum = max(max(c.r, c.g), c.b);                                    // unlit LEDs fade out, not dark dashes
          gl_FragColor = vec4(c * (0.45 + 1.1 * led), across * (0.55 + 0.45 * led) * mix(0.15, 1.0, smoothstep(0.08, 0.5, lum)));
          #include <fog_fragment>
        }`,
      fog: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
    });
    lm.userData.noSurface = true;
    const leds = new THREE.Mesh(cutConvex(lg, DOOR_CUT, toDoor), lm); leds.name = 'dome_leds'; leds.renderOrder = 3;
    leds.onBeforeRender = () => { lm.uniforms.uTime.value = globalThis.FT_TIME ? globalThis.FT_TIME.value : performance.now() / 1000; };
    shell.add(leds);
  }

  // ---------- door dormer (+Z) ----------
  const frameM = new THREE.MeshStandardMaterial({ color: 0xb3b9c0, roughness: 0.4, metalness: 0.12, side: THREE.DoubleSide });
  frameM.userData.noSurface = true;   // smooth aluminium, no siding lines
  const glassM = new THREE.MeshStandardMaterial({ color: 0x4a5661, roughness: 0.1, metalness: 0.55 });
  const HW = DOOR_HW, HD = DOOR_HD, ZF = R + 0.09;
  const zs = (x, y) => Math.sqrt(Math.max(0, R * R - x * x - y * y));
  {
    const P = [], I = [];
    const v = (x, y, z) => { P.push(x, y, z); return P.length / 3 - 1; };
    const ys = hi ? [0, 0.6, 1.2, 1.7, HD] : [0, 1.0, HD];
    for (const sx of [-HW, HW]) {          // side cheeks: from front plane back into the sphere
      const f = ys.map(y => v(sx, y, ZF)), b = ys.map(y => v(sx, y, zs(sx, y) - 0.02));
      for (let i = 0; i < ys.length - 1; i++) I.push(f[i], b[i], b[i + 1], f[i], b[i + 1], f[i + 1]);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(I); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, frameM); m.position.set(0, yb, DOME_Z); g.add(m);
    // dormer roof: clear panel (reads dark from the drone shot), slight fall to the front
    const RP = [], RI = [], xs = hi ? [-HW, -0.25, 0, 0.25, HW] : [-HW, 0, HW];
    xs.forEach(x => RP.push(x, HD, ZF + 0.03, x, HD, zs(x, HD) - 0.02));
    for (let i = 0; i < xs.length - 1; i++) { const a = 2 * i; RI.push(a, a + 2, a + 3, a, a + 3, a + 1); }
    const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(RP, 3));
    rg.setIndex(RI); rg.computeVertexNormals();
    const roofM = new THREE.MeshStandardMaterial({ color: 0x46525d, roughness: 0.15, metalness: 0.5, side: THREE.DoubleSide });
    const rm = new THREE.Mesh(rg, roofM); rm.position.set(0, yb, DOME_Z); g.add(rm);
    const front = box(2 * HW + 0.06, HD + 0.04, 0.05, frameM, 0, yb + HD / 2, DOME_Z + ZF, g);
    const gl = box(2 * HW - 0.16, HD - 0.16, 0.02, glassM, 0, yb + HD / 2 - 0.02, DOME_Z + ZF + 0.03, g);
    if (hi) box(0.03, 0.18, 0.03, black, HW - 0.14, yb + 1.0, DOME_Z + ZF + 0.05, g); // handle
    // the inside face of the door (Mike 2026-10-29: it has to read from inside the dome too)
    box(2 * HW - 0.16, HD - 0.16, 0.02, glassM, 0, yb + HD / 2 - 0.02, DOME_Z + ZF - 0.03, g);
    if (hi) box(0.03, 0.18, 0.03, black, HW - 0.14, yb + 1.0, DOME_Z + ZF - 0.05, g);
  }
  box(0.9, 0.18, 0.42, black, 0, DECK_H + 0.09, DOME_Z + ZF + 0.34, g);               // black step

  // ---------- interior (seen through the panoramic window) ----------
  // Laid out from Dome Interior.jpg (taken just inside the door, looking in: the opaque wall on the left, the clear
  // window band ahead-right) and PXL_20240519_014325376 (the same room seen through the window). Coordinates are
  // from the dome centre, door = +Z, window band centred 45° clockwise of -Z (toward +X/-Z):
  //  - queen bed with its head against the left (-X) wall, foot toward the room; black knit throw across the foot
  //    with a tray, wine bottle + two glasses; pillows + the "stay awhile" cushion at the head
  //  - nightstand + white lamp at the far corner of the head
  //  - small round table in a floor-length black cloth with a lantern, just inside the clear band straight ahead,
  //    a black chair with a cushion either side of it facing the table
  //  - grey shag rug along the foot of the bed (the dreamcatcher is left out: it poked through the shell)
  if (hi) {
    const inner = new THREE.Group(); inner.position.set(0, yb, DOME_Z);
    const M = (color, rough = 0.85, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra });
    const white = M(0xeeeeea), linen = M(0xf4f3ef, 0.95), knit = M(0x262626, 1), wood = M(0x1f1a17, 0.7), cush = M(0xb8b2a8, 0.95);
    const cyl = (r1, r2, h, mat, x, y, z, seg = 14) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat); o.position.set(x, y, z); inner.add(o); return o; };
    // bed: long axis along X, head at x ≈ -2.05, foot at x ≈ -0.05
    const bx = -1.05, bz = -0.05;
    box(2.0, 0.32, 1.6, M(0x8d8a86), bx, 0.16, bz, inner);
    box(1.98, 0.2, 1.68, linen, bx, 0.42, bz, inner);
    for (const z of [-0.4, 0.4]) box(0.4, 0.16, 0.72, white, bx - 0.78, 0.6, bz + z, inner);
    const sa = box(0.12, 0.36, 0.6, white, bx - 0.55, 0.68, bz + 0.25, inner); sa.rotation.z = -0.35;   // "stay awhile"
    box(0.62, 0.05, 1.74, knit, bx + 0.62, 0.54, bz, inner);                                             // black knit throw
    cyl(0.22, 0.22, 0.02, M(0x9a9da0, 0.3, { metalness: 0.7 }), bx + 0.55, 0.575, bz - 0.3);              // tray
    cyl(0.04, 0.04, 0.3, M(0x3a1414, 0.2), bx + 0.6, 0.73, bz - 0.4, 8);                                   // wine
    const glass = M(0xdfe8ee, 0.05, { transparent: true, opacity: 0.45 });
    for (const dz of [-0.2, -0.1]) cyl(0.035, 0.025, 0.16, glass, bx + 0.45 + dz, 0.665, bz - 0.25 + dz, 8);
    // a nightstand + lamp either side of the head, mirrored about the bed's centre line (Mike 2026-10-29)
    const shade = M(0xf6efe0, 0.9, { emissive: 0xffd9a0, emissiveIntensity: 0.6 });
    for (const nz of [bz - 1.2, bz + 1.2]) {
      box(0.4, 0.5, 0.38, wood, -1.55, 0.25, nz, inner);
      cyl(0.06, 0.08, 0.2, white, -1.55, 0.6, nz, 10);
      cyl(0.1, 0.12, 0.24, shade, -1.55, 0.82, nz, 12);
    }
    // grey shag rug square to the foot of the bed, centred on it
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.0), M(0x7d7c7a, 1)); rug.rotation.x = -Math.PI / 2; rug.position.set(bx + 1.0 + 0.7, 0.012, bz); inner.add(rug);
    // small dresser with a coffee maker, just left of the door seen from inside (Mike 2026-10-29); front faces the
    // dome centre, set in far enough that its back corners clear the curved wall
    {
      const dr = new THREE.Group(), dd = new THREE.Vector2(0.49, 0.87).normalize().multiplyScalar(1.95);
      dr.position.set(dd.x, 0, dd.y); dr.rotation.y = Math.atan2(dd.x, dd.y); inner.add(dr);   // local front = -Z
      const body = M(0xd9d2c5, 0.7), seam = M(0xb9b1a3, 0.8), knob = M(0x3a3a3a, 0.4, { metalness: 0.6 });
      box(0.8, 0.74, 0.42, body, 0, 0.37, 0, dr); box(0.84, 0.03, 0.45, body, 0, 0.755, 0, dr);
      for (const y of [0.17, 0.4, 0.62]) { box(0.74, 0.19, 0.012, seam, 0, y, -0.216, dr); for (const x of [-0.2, 0.2]) box(0.05, 0.025, 0.025, knob, x, y, -0.23, dr); }
      const blk = M(0x1b1b1d, 0.45);
      box(0.2, 0.34, 0.24, blk, -0.15, 0.94, 0.02, dr);                                                       // coffee maker
      box(0.2, 0.06, 0.3, blk, -0.15, 1.08, -0.01, dr);                                                       // its hood
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.16, 12), M(0xcfd8de, 0.05, { transparent: true, opacity: 0.4 })); pot.position.set(-0.15, 0.86, -0.12); dr.add(pot);
      const brew = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.08, 12), M(0x2a160c, 0.3)); brew.position.set(-0.15, 0.82, -0.12); dr.add(brew);
      for (const x of [0.12, 0.26]) { const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.1, 10), white); mug.position.set(x, 0.82, -0.05); dr.add(mug); }
    }
    // round table in a floor-length black cloth with a lantern, a chair either side facing it
    const tx = 0.15, tz = -1.75;
    cyl(0.34, 0.42, 0.74, knit, tx, 0.37, tz, 16);
    box(0.14, 0.26, 0.14, M(0x1a1a1a, 0.5, { metalness: 0.4 }), tx, 0.87, tz, inner);
    box(0.09, 0.16, 0.09, M(0xffc77a, 0.5, { emissive: 0xffb45c, emissiveIntensity: 0.9 }), tx, 0.87, tz, inner);
    for (const [cx, cz, ry] of [[tx - 0.6, tz + 0.1, -Math.PI / 2], [tx + 0.6, tz + 0.1, Math.PI / 2]]) {   // chairs face -Z unrotated
      const ch = new THREE.Group(); ch.position.set(cx, 0, cz); ch.rotation.y = ry; inner.add(ch);
      box(0.42, 0.05, 0.42, wood, 0, 0.45, 0, ch); box(0.38, 0.04, 0.38, cush, 0, 0.49, 0, ch);
      for (const [lx, lz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) box(0.035, 0.45, 0.035, wood, lx, 0.225, lz, ch);
      for (const lx of [-0.18, 0.18]) box(0.035, 0.45, 0.035, wood, lx, 0.7, 0.18, ch);
      box(0.4, 0.12, 0.03, wood, 0, 0.86, 0.18, ch);
    }
    g.add(inner);
  }

  // Mike (2026-10-27): the dome sits rotated 90° clockwise on its deck; (2026-10-28) now 90° counterclockwise from
  // that. Turn only the dome (shell, door, step, interior) about its own centre; the deck and furniture stay put.
  const pivot = new THREE.Group(); pivot.position.set(0, 0, DOME_Z); pivot.rotation.y = 0;
  for (const o of g.children.slice(domeStart)) { o.position.z -= DOME_Z; pivot.add(o); }
  g.add(pivot);

  // ---------- open deck: rug, chairs, umbrella (-Z end) ----------
  const red = new THREE.MeshStandardMaterial({ color: 0xc42222, roughness: 0.6 });
  if (hi) {
    const rugM = new THREE.MeshStandardMaterial({ color: 0x8e9398, roughness: 1 });
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.4), rugM);
    rug.rotation.x = -Math.PI / 2; rug.position.set(0, DECK_H + 0.006, -2.6); g.add(rug);
  }
  // Mike (2026-10-29): the little black table sits between the two chairs, chairs spread so nothing clips
  for (const [x, ry] of [[-0.88, 0.15], [0.88, -0.15]]) {
    const ch = adirondack(red, lod); ch.position.set(x, DECK_H, -2.7); ch.rotation.y = ry; g.add(ch);
  }
  if (hi) { // closed cantilever umbrella on its weighted cross base (NW side of the deck)
    const pole = new THREE.MeshStandardMaterial({ color: 0x2a2a2c, roughness: 0.5, metalness: 0.4 });
    const canvasM = new THREE.MeshStandardMaterial({ color: 0xebe8e1, roughness: 0.85 });
    // Mike (2026-10-29): stand further out on the deck, clear of the dome; the canopy hangs entirely beside the
    // pole (centre 1.6 m out on the arm, radius 1.45) so it never cuts through its own stand, shading the chairs
    const ux = 2.9, uz = -2.6, off = 1.6;
    box(1.0, 0.1, 0.22, black, ux, DECK_H + 0.05, uz, g); box(0.22, 0.1, 1.0, black, ux, DECK_H + 0.05, uz, g);
    box(0.07, 2.85, 0.07, pole, ux, DECK_H + 1.425, uz, g);
    box(off + 0.05, 0.05, 0.05, pole, ux - off / 2, DECK_H + 2.82, uz, g);                         // arm
    box(0.05, 0.1, 0.05, pole, ux - off, DECK_H + 2.75, uz, g);                                    // hanger
    const can = new THREE.Mesh(new THREE.ConeGeometry(1.45, 0.55, 8, 1, true), new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.85, side: THREE.DoubleSide }));
    can.position.set(ux - off, DECK_H + 2.45, uz); g.add(can);
    // the little black side table, between the chairs
    const tbl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 14), black); tbl.position.set(0, DECK_H + 0.55, -2.75); g.add(tbl);
    box(0.05, 0.53, 0.05, pole, 0, DECK_H + 0.265, -2.75, g);
    box(0.36, 0.03, 0.36, black, 0, DECK_H + 0.015, -2.75, g);
  }
  return g;
}

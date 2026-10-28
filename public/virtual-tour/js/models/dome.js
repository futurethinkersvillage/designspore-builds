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
  // front of the chair faces -Z (local)
  const seat = box(0.56, 0.05, 0.6, mat, 0, 0.36, 0.02, c); seat.rotation.x = -0.12;
  const back = box(0.58, 0.95, 0.04, mat, 0, 0.78, 0.36, c); back.rotation.x = -0.38;
  box(0.1, 0.03, 0.78, mat, -0.36, 0.58, -0.02, c); box(0.1, 0.03, 0.78, mat, 0.36, 0.58, -0.02, c);   // arms
  box(0.05, 0.58, 0.07, mat, -0.33, 0.29, -0.3, c); box(0.05, 0.58, 0.07, mat, 0.33, 0.29, -0.3, c);    // front legs
  const rl = box(0.05, 0.08, 0.75, mat, -0.3, 0.2, 0.12, c); rl.rotation.x = 0.35;
  const rr = box(0.05, 0.08, 0.75, mat, 0.3, 0.2, 0.12, c); rr.rotation.x = 0.35;
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
  const floorM = new THREE.MeshStandardMaterial({ color: 0x77706a, roughness: 0.9 });
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
  const BUL = 0.075;
  let nClear = 0;
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
      const ci = push(S(ctr, R + 0.04), cCentre.clone().multiplyScalar(tone));
      const ei = poly.map(q => push(S(q, R), cEdge));
      for (let i = 0; i < k; i++) idx.push(ci, ei[i], ei[(i + 1) % k]);
      continue;
    }
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
    const ed = qn.map(q => push(S(q, R + 0.005), cEdge.clone().multiplyScalar(tone)));
    const md = poly.map(q => push(S(ctr.clone().lerp(q, 0.5), R + BUL * 0.78), cMid.clone().multiplyScalar(tone)));
    const ci = push(S(ctr, R + BUL), cCentre.clone().multiplyScalar(tone));
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
  const shellMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.22, metalness: 0.05, side: THREE.DoubleSide, emissive: 0xfff4e6, emissiveIntensity: 0.12 });
  shellMat.userData.noSurface = true;   // no board/shingle lines on the panels
  shellMat.shadowSide = THREE.BackSide;
  const shell = new THREE.Mesh(shellGeo, shellMat); shell.position.set(0, yb, DOME_Z); g.add(shell);

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
  const panes = new THREE.Mesh(paneGeo, paneMat); panes.position.set(0, yb, DOME_Z); panes.renderOrder = 2; g.add(panes);

  // ---------- door dormer (+Z) ----------
  const frameM = new THREE.MeshStandardMaterial({ color: 0xb3b9c0, roughness: 0.4, metalness: 0.12, side: THREE.DoubleSide });
  const glassM = new THREE.MeshStandardMaterial({ color: 0x4a5661, roughness: 0.1, metalness: 0.55 });
  const HW = 0.5, HD = 2.0, ZF = R + 0.09;
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
  }
  box(0.9, 0.18, 0.42, black, 0, DECK_H + 0.09, DOME_Z + ZF + 0.34, g);               // black step

  // ---------- interior (seen through the panoramic window) ----------
  if (hi) {
    const white = new THREE.MeshStandardMaterial({ color: 0xe9e9e6, roughness: 0.8 });
    box(1.65, 0.55, 2.05, white, 0.95, yb + 0.28, DOME_Z + 0.1, g);
    box(1.7, 0.04, 0.6, black, 0.95, yb + 0.57, DOME_Z - 0.55, g);                    // black throw
    box(1.65, 0.9, 0.08, white, 0.95, yb + 0.45, DOME_Z + 1.15, g);                   // headboard/pillows
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.72, 10), black);
    t.position.set(-1.0, yb + 0.36, DOME_Z - 1.0); g.add(t);
  }

  // Mike (2026-10-27): the dome sits rotated 90° clockwise on its deck. Turn only the dome (shell, door, step,
  // interior) about its own centre; the deck and the furniture on it were already right.
  const pivot = new THREE.Group(); pivot.position.set(0, 0, DOME_Z); pivot.rotation.y = -Math.PI / 2;
  for (const o of g.children.slice(domeStart)) { o.position.z -= DOME_Z; pivot.add(o); }
  g.add(pivot);

  // ---------- open deck: rug, chairs, umbrella (-Z end) ----------
  const red = new THREE.MeshStandardMaterial({ color: 0xc42222, roughness: 0.6 });
  if (hi) {
    const rugM = new THREE.MeshStandardMaterial({ color: 0x8e9398, roughness: 1 });
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), rugM);
    rug.rotation.x = -Math.PI / 2; rug.position.set(0, DECK_H + 0.006, -2.6); g.add(rug);
  }
  for (const [x, ry] of [[-0.55, 0.15], [0.6, -0.15]]) {
    const ch = adirondack(red, lod); ch.position.set(x, DECK_H, -2.7); ch.rotation.y = ry; g.add(ch);
  }
  if (hi) { // closed cantilever umbrella on its weighted cross base (NW side of the deck)
    const pole = new THREE.MeshStandardMaterial({ color: 0x2a2a2c, roughness: 0.5, metalness: 0.4 });
    const canvasM = new THREE.MeshStandardMaterial({ color: 0xebe8e1, roughness: 0.85 });
    const ux = 2.75, uz = -0.9;
    box(1.0, 0.1, 0.22, black, ux, DECK_H + 0.05, uz, g); box(0.22, 0.1, 1.0, black, ux, DECK_H + 0.05, uz, g);
    box(0.07, 2.5, 0.07, pole, ux, DECK_H + 1.25, uz, g);
    const arm = box(1.05, 0.05, 0.05, pole, ux - 0.45, DECK_H + 2.62, uz, g); arm.rotation.z = -0.25;
    // open, as in the photos (Dome1.jpeg): a wide white canopy hanging from the arm
    const can = new THREE.Mesh(new THREE.ConeGeometry(1.45, 0.55, 8, 1, true), new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.85, side: THREE.DoubleSide }));
    can.position.set(ux - 0.95, DECK_H + 2.45, uz); g.add(can);
    box(0.06, 0.4, 0.06, pole, ux - 0.95, DECK_H + 2.5, uz, g);
    // a small round table under it
    const tbl = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.04, 14), black); tbl.position.set(ux - 0.95, DECK_H + 0.72, uz); g.add(tbl);
    box(0.05, 0.7, 0.05, pole, ux - 0.95, DECK_H + 0.36, uz, g);
  }
  return g;
}

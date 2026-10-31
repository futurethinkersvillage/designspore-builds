// PLANNED: the event gazebo (js/models/gazebo.js) converted into a co-working café. This module is an OVERLAY: build()
// returns only the new parts, in gazebo.js's own frame, and is meant to be added at exactly the gazebo's placement
// (same origin = ground-level centre, same rotY; entrance = face 0 = +Z, the café is at the back = face 4 = -Z).
//   - glazing: black-steel framed glass set 7 cm inside the post line (apothem 6.22) on the 7 knee walls, from the
//     cap rail to under the plate; a glazed double door + sidelights in the open entrance bay; and glass in the open
//     clerestory (apothem 2.62) so the room is really closed in.
//   - cafe: counter with espresso machine, grinder, pastry case and till; back bar along the back knee wall with
//     open shelving and a chalkboard menu.
//   - furniture: two long shared tables (faces 2 and 6), window counters with stools (faces 1 and 7), 2-top café
//     tables, a lounge by the back right (rug, 2 armchairs, side table, floor lamp), a low bookshelf (face 5), and a
//     wood stove standing on the old stone fire pit (it becomes a raised hearth), flue up into the cupola.
//   - laptops: laptops, desk lamps, mugs, small plants on the tables / counters.   - lights: pendants.
// setStage(group, k) plays the conversion (k 0..1). clearGazebo(gazeboGroup, k) shrinks away gazebo.js's picnic
// tables as the new furniture arrives (it only scales the existing 'picnic_table' groups; gazebo.js is untouched).
import * as THREE from 'three';

export const meta = {
  name: 'Gazebo co-working café (planned)',
  footprint: [13.5, 13.5],   // glazing line ~12.44 across the flats; everything sits inside the gazebo
  height: 7.9,               // stove flue tip, under the cupola cap
  place: { x: -597, y: -226, rotY: 0.6615 },   // = engine.js PLACE.gazebo; always use the gazebo's own placement
  notes: 'Overlay on js/models/gazebo.js at the identical placement (same origin/rotation; entrance +Z). Sub-groups: ' +
    'glazing, cafe, furniture, laptops, lights. setStage(group,k): glazing 0-0.35, furniture 0.25-0.6, cafe 0.45-0.75, ' +
    'laptops 0.65-0.9, lights 0.8-1.0. Call clearGazebo(gazeboGroup,k) too so the old picnic tables shrink away ' +
    '(k 0.15-0.3); the stone fire pit stays and becomes the wood stove hearth.',
};

// ---- gazebo.js dimensions (keep in sync) ----
const C8 = Math.cos(Math.PI / 8), T8 = Math.tan(Math.PI / 8);
const F = 0.15, WALL_H = 1.0, PLATE_Y = 2.9;
const CAP_TOP = F + WALL_H + 0.06;      // top of the knee-wall cap rail (1.21)
const AG = 6.22;                         // glazing plane apothem: just inside the posts (inner faces ~6.28) and braces (6.36)
const HEAD_Y = PLATE_Y - 0.2;            // underside of the plate beam (2.70)
const AGC = 2.62, CL_Y0 = 5.36, CL_Y1 = 6.6;   // clerestory glazing: inside the inner posts, main ceiling edge -> cupola ceiling
// main ceiling (gazebo.js 'ceil'): apothem 6.95 at y 3.24 rising to apothem 2.85 at y 5.36
const ceilY = a => 3.24 + (6.95 - a) * (2.12 / 4.10);

// ---------- textures ----------
const texCache = {};
function canvasTex(key, w, h, draw) {
  if (!texCache[key]) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    texCache[key] = t;
  }
  return texCache[key];
}
function menuTex() {
  return canvasTex('gc_menu', 384, 448, (g, w, h) => {
    g.fillStyle = '#262b28'; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 60; i++) g.fillRect(Math.random() * w, Math.random() * h, 40, 2);
    g.fillStyle = '#efece4'; g.textAlign = 'center';
    g.font = 'bold 44px Georgia, serif'; g.fillText('COFFEE', w / 2, 62);
    g.fillRect(70, 78, w - 140, 2);
    g.font = '24px Georgia, serif'; g.textAlign = 'left';
    const items = [['Espresso', '3.50'], ['Americano', '4.00'], ['Cappuccino', '5.00'], ['Latte', '5.50'], ['London Fog', '5.25'], ['Drip', '3.00'], ['Hot chocolate', '4.50']];
    items.forEach(([n, p], i) => { g.fillText(n, 40, 125 + i * 38); g.textAlign = 'right'; g.fillText(p, w - 40, 125 + i * 38); g.textAlign = 'left'; });
    g.textAlign = 'center'; g.font = 'italic 24px Georgia, serif'; g.fillStyle = '#e8c48a';
    g.fillText('baked here daily', w / 2, 410);
  });
}
function rugTex() {
  return canvasTex('gc_rug', 256, 128, (g, w, h) => {
    g.fillStyle = '#a3896a'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#7b5a43'; g.fillRect(8, 8, w - 16, h - 16);
    g.fillStyle = '#b8a283'; g.fillRect(16, 16, w - 32, h - 32);
    for (let x = 24; x < w - 24; x += 22) { g.fillStyle = (x / 22) % 2 < 1 ? '#8c6b50' : '#5e6a5a'; g.fillRect(x, 24, 10, h - 48); }
  });
}

// ---------- geometry helpers (geometries cached, shared) ----------
const geoCache = new Map();
const gget = (key, make) => { if (!geoCache.has(key)) geoCache.set(key, make()); return geoCache.get(key); };
const r3 = v => Math.round(v * 1000);
function box(parent, mat, w, h, d, x, y, z, ry = 0) {
  const m = new THREE.Mesh(gget(`b${r3(w)},${r3(h)},${r3(d)}`, () => new THREE.BoxGeometry(w, h, d)), mat);
  m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
}
function cyl(parent, mat, rt, rb, h, x, y, z, seg = 12, open = false) {
  const m = new THREE.Mesh(gget(`c${r3(rt)},${r3(rb)},${r3(h)},${seg},${open}`, () => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open)), mat);
  m.position.set(x, y, z); parent.add(m); return m;
}
function plane(parent, mat, w, h, x, y, z, ry = 0) {
  const m = new THREE.Mesh(gget(`p${r3(w)},${r3(h)}`, () => new THREE.PlaneGeometry(w, h)), mat);
  m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
}
function blob(parent, mat, r, x, y, z, sx = 1, sy = 1, sz = 1) {
  const m = new THREE.Mesh(gget(`i${r3(r)}`, () => new THREE.IcosahedronGeometry(r, 0)), mat);
  m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.set(x * 7, z * 5, y * 3); parent.add(m); return m;
}
// a frame turned to face k (local +Z = outward normal of face k, local +X = along the face)
function faceFrame(parent, k) { const f = new THREE.Group(); f.rotation.y = k * Math.PI / 4; parent.add(f); return f; }
// a stage unit: one thing that appears as a piece. mode 'rise' (grows up from its pivot), 'grow' (scale 0.72->1 + fade),
// 'drop' (pendant: cord pays out from the ceiling pivot, head follows)
function unit(parent, name, t0, t1, mode, x = 0, y = 0, z = 0, ry = 0) {
  const u = new THREE.Group(); u.name = name; u.position.set(x, y, z); u.rotation.y = ry;
  u.userData.stage = { t0, t1, mode }; parent.add(u); return u;
}

// ---------- materials ----------
function mats(hi) {
  const S = (o) => new THREE.MeshStandardMaterial(o);
  const ns = m => { m.userData.noSurface = true; return m; };
  const glow = (color, emissive, intensity) => { const m = S({ color, emissive, emissiveIntensity: intensity, roughness: 0.6 }); m.userData.noSurface = true; m.userData.glow = true; return m; };
  return {
    glass: ns(S({ color: 0xc4d8de, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.25, depthWrite: false, side: THREE.DoubleSide })),
    steel: ns(S({ color: 0x1e1f21, roughness: 0.45, metalness: 0.55 })),
    fir: S({ color: 0xb98a5c, roughness: 0.75 }),           // new interior trim / counter cladding, natural fir
    oak: S({ color: 0xc29a68, roughness: 0.6 }),            // table tops, shelves
    walnut: S({ color: 0x6b4a33, roughness: 0.55 }),        // counter top, chairs
    leather: S({ color: 0x8a5232, roughness: 0.55 }),
    wool: S({ color: 0x6f7666, roughness: 0.95 }),
    stone: S({ color: 0x8c8378, roughness: 1, flatShading: true }),
    slate: ns(S({ color: 0x3e3d3b, roughness: 0.8 })),
    stainless: ns(S({ color: 0xd2d3d4, roughness: 0.3, metalness: 0.35 })),
    alu: ns(S({ color: 0xbfc2c6, roughness: 0.35, metalness: 0.3 })),
    screen: ns(S({ color: 0x1b2633, emissive: 0x9fbad6, emissiveIntensity: 0.35, roughness: 0.2 })),
    ceramic: ns(S({ color: 0xebe5da, roughness: 0.35 })),
    terracotta: S({ color: 0xa55f3f, roughness: 0.9 }),
    leaf: ns(S({ color: 0x4d6b38, roughness: 0.8, flatShading: true })),
    leaf2: ns(S({ color: 0x3e5a2f, roughness: 0.8, flatShading: true })),
    kraft: S({ color: 0x9c7a55, roughness: 0.95 }),
    pastry: ns(S({ color: 0xc58d4a, roughness: 0.7 })),
    pastry2: ns(S({ color: 0x8a5a33, roughness: 0.7 })),
    bulb: glow(0xf3ead8, 0xffc27a, 0.6),
    opal: glow(0xf4efe6, 0xffd6a0, 0.5),
    fire: glow(0x2a1a10, 0xff7a2a, 0.6),
    menu: ns(S({ map: hi ? menuTex() : null, color: hi ? 0xffffff : 0x262b28, roughness: 0.9 })),
    rug: ns(S({ map: hi ? rugTex() : null, color: hi ? 0xffffff : 0x9a8468, roughness: 1 })),
    books: [0x7a3b2e, 0x2f4a5c, 0xd6c7a1, 0x47613e, 0x8f7a4e, 0x3a3436].map(c => S({ color: c, roughness: 0.8 })),
  };
}

// ---------- furniture pieces (all built so the user LOOKS toward -Z; rotate by ry to face elsewhere) ----------
function chair(p, M, hi) {
  box(p, M.walnut, 0.44, 0.035, 0.42, 0, 0.45, 0);
  if (hi) {
    for (const sx of [-0.19, 0.19]) for (const sz of [-0.18, 0.18]) box(p, M.steel, 0.025, 0.45, 0.025, sx, 0.225, sz);
    for (const sx of [-0.19, 0.19]) box(p, M.steel, 0.025, 0.42, 0.025, sx, 0.68, 0.19);
    box(p, M.walnut, 0.42, 0.14, 0.025, 0, 0.8, 0.2);
  } else box(p, M.steel, 0.4, 0.45, 0.38, 0, 0.22, 0);
}
function stool(p, M, hi) {
  cyl(p, M.walnut, 0.18, 0.18, 0.04, 0, 0.74, 0, hi ? 16 : 8);
  if (hi) {
    for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2; box(p, M.steel, 0.025, 0.72, 0.025, Math.sin(a) * 0.15, 0.36, Math.cos(a) * 0.15); }
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; const b = box(p, M.steel, 0.21, 0.02, 0.02, Math.sin(a) * 0.106, 0.28, Math.cos(a) * 0.106); b.rotation.y = a + Math.PI / 2; }
  } else cyl(p, M.steel, 0.03, 0.03, 0.72, 0, 0.36, 0, 6);
}
function armchair(p, M, hi) {
  box(p, M.leather, 0.8, 0.2, 0.75, 0, 0.32, 0);          // seat cushion block
  box(p, M.leather, 0.8, 0.5, 0.16, 0, 0.62, 0.3);        // back
  if (hi) {
    for (const sx of [-0.34, 0.34]) box(p, M.leather, 0.13, 0.22, 0.72, sx, 0.52, 0.01);   // arms
    for (const sx of [-0.33, 0.33]) for (const sz of [-0.3, 0.3]) box(p, M.walnut, 0.04, 0.22, 0.04, sx, 0.11, sz);
  }
}
function laptop(p, M) {
  box(p, M.alu, 0.32, 0.016, 0.22, 0, 0.008, 0);
  const lid = new THREE.Group(); lid.position.set(0, 0.016, -0.108); lid.rotation.x = -0.26; p.add(lid);
  box(lid, M.alu, 0.32, 0.21, 0.008, 0, 0.105, 0);
  plane(lid, M.screen, 0.29, 0.18, 0, 0.11, 0.0045);
}
function mug(p, M) { cyl(p, M.ceramic, 0.04, 0.036, 0.09, 0, 0.045, 0, 10); box(p, M.ceramic, 0.012, 0.05, 0.035, 0.045, 0.048, 0); }
function potPlant(p, M, s = 1) {
  cyl(p, M.terracotta, 0.07 * s, 0.055 * s, 0.12 * s, 0, 0.06 * s, 0, 10);
  blob(p, M.leaf, 0.09 * s, 0.02 * s, 0.17 * s, 0, 1.1, 0.8, 1);
  blob(p, M.leaf2, 0.08 * s, -0.04 * s, 0.2 * s, 0.03 * s, 0.9, 1.1, 0.9);
  blob(p, M.leaf, 0.07 * s, 0.03 * s, 0.24 * s, -0.03 * s, 1, 1, 1);
}
function floorPlant(p, M) {
  cyl(p, M.terracotta, 0.22, 0.17, 0.42, 0, 0.21, 0, 14);
  cyl(p, M.walnut, 0.015, 0.02, 0.9, 0, 0.8, 0, 5);
  [[0.12, 1.0, 0.05], [-0.1, 1.15, -0.06], [0.05, 1.3, 0.1], [-0.05, 1.42, 0], [0.1, 1.2, -0.12], [-0.13, 0.95, 0.1]]
    .forEach(([x, y, z], i) => blob(p, i % 2 ? M.leaf : M.leaf2, 0.17, x, y, z, 1, 0.75, 1));
}
function deskLamp(p, M) {
  cyl(p, M.steel, 0.07, 0.08, 0.02, 0, 0.01, 0, 12);
  box(p, M.steel, 0.015, 0.42, 0.015, 0, 0.22, 0.04);
  box(p, M.steel, 0.015, 0.015, 0.22, 0, 0.42, -0.06);
  const sh = cyl(p, M.steel, 0.025, 0.09, 0.11, 0, 0.38, -0.16, 12, true); sh.material = M.steelDS;
  const d = new THREE.Mesh(gget('disc07', () => new THREE.CircleGeometry(0.075, 12)), M.bulb); d.rotation.x = Math.PI / 2; d.position.set(0, 0.34, -0.16); p.add(d);
}

// ---------- build ----------
export function build({ lod = 'high' } = {}) {
  const hi = lod !== 'low';
  const M = mats(hi);
  M.steelDS = M.steel.clone(); M.steelDS.side = THREE.DoubleSide;
  const g = new THREE.Group(); g.name = 'gazebo_cafe';
  const G = {};
  for (const n of ['glazing', 'cafe', 'furniture', 'laptops', 'lights']) { G[n] = new THREE.Group(); G[n].name = n; g.add(G[n]); }

  // ===== glazing =====
  const hw = AG * T8;                       // half-width of a face at the glazing line (2.576)
  const winH = HEAD_Y - (CAP_TOP + 0.06);   // glass height between sill rail and head
  const order = [1, 7, 2, 6, 3, 5, 4];      // fill in from the entrance round to the back
  order.forEach((k, i) => {
    const f = faceFrame(G.glazing, k);
    const t0 = 0.0 + i * 0.03, u = unit(f, `window_${k}`, t0, t0 + 0.14, 'rise', 0, CAP_TOP, 0);
    const y0 = 0.06;                                               // glass bottom, above the steel sill
    box(u, M.fir, 2 * (AG - 0.12) * T8, 0.04, 0.22, 0, -0.02, AG - 0.01);   // interior fir sill board on the knee wall
    box(u, M.steel, 2 * hw, 0.06, 0.1, 0, 0.03, AG);               // sill
    plane(u, M.glass, 2 * hw, winH, 0, y0 + winH / 2, AG);
    box(u, M.steel, 2 * hw, 0.06, 0.1, 0, y0 + winH + 0.03, AG);   // head
    box(u, M.fir, 2 * hw, PLATE_Y - HEAD_Y - 0.06, 0.12, 0, y0 + winH + 0.06 + (PLATE_Y - HEAD_Y - 0.06) / 2, AG);   // fir header up to the soffit
    for (const x of hi ? [-hw, -hw / 3, hw / 3, hw] : [-hw, hw]) box(u, M.steel, 0.05, winH, 0.08, x, y0 + winH / 2, AG);
    if (hi) box(u, M.steel, 2 * hw, 0.04, 0.06, 0, 2.32 - CAP_TOP, AG);   // transom bar (awning vents above)
  });
  { // entrance bay (face 0): sidelights + glazed double doors, floor to plate
    const f = faceFrame(G.glazing, 0), u = unit(f, 'entrance_doors', 0.16, 0.32, 'rise', 0, F, 0);
    const top = HEAD_Y - F, dH = 2.25, dW = 0.92, sideW = hw - dW - 0.02;
    box(u, M.steel, 2 * hw, 0.06, 0.1, 0, top + 0.03, AG);
    box(u, M.fir, 2 * hw, PLATE_Y - HEAD_Y - 0.06, 0.12, 0, top + 0.06 + (PLATE_Y - HEAD_Y - 0.06) / 2, AG);
    box(u, M.steel, 2 * hw, 0.05, 0.08, 0, dH + 0.025, AG);        // door head / transom bar right across
    plane(u, M.glass, 2 * hw, top - dH - 0.05, 0, (top + dH + 0.05) / 2, AG);   // transom glass
    box(u, M.steel, 2 * dW + 0.06, 0.01, 0.3, 0, 0.005, AG);       // threshold plate
    for (const s of [-1, 1]) {
      const cx = s * (dW + 0.02 + sideW / 2);
      box(u, M.steel, 0.06, top, 0.1, s * hw, top / 2, AG);          // corner jamb
      box(u, M.steel, 0.06, dH, 0.1, s * (dW + 0.02), dH / 2, AG);   // door jamb
      box(u, M.steel, sideW, 0.28, 0.06, cx, 0.14, AG);              // kick panel
      plane(u, M.glass, sideW, dH - 0.28, cx, 0.28 + (dH - 0.28) / 2, AG);
      if (hi) box(u, M.steel, sideW, 0.04, 0.06, cx, 1.1, AG);       // mid rail
      // door leaf
      const lx = s * (dW / 2 + 0.01);
      for (const ex of [-1, 1]) box(u, M.steel, 0.07, dH - 0.02, 0.05, lx + ex * (dW / 2 - 0.035), dH / 2, AG);
      box(u, M.steel, dW, 0.07, 0.05, lx, dH - 0.045, AG); box(u, M.steel, dW, 0.2, 0.05, lx, 0.11, AG);
      plane(u, M.glass, dW - 0.14, dH - 0.29, lx, 0.21 + (dH - 0.29) / 2, AG);
      if (hi) for (const zz of [AG + 0.06, AG - 0.06]) {           // oak pull bars, both sides
        box(u, M.oak, 0.035, 0.75, 0.035, s * 0.12, 1.05, zz);
        for (const yy of [0.75, 1.35]) box(u, M.steel, 0.02, 0.02, 0.05, s * 0.12, yy, (zz + AG) / 2);
      }
    }
  }
  { // clerestory: glass ring inside the inner posts, closing the open cupola, + a trim ring meeting the main ceiling
    const u = unit(G.glazing, 'clerestory', 0.22, 0.35, 'rise', 0, CL_Y0, 0);
    const ring = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2((AGC - 0.03) / C8, 0), new THREE.Vector2(2.9 / C8, 0)], 8, Math.PI / 8), M.fir);
    ring.material = M.fir.clone(); ring.material.side = THREE.DoubleSide; ring.position.y = 0.005; u.add(ring);
    const h = CL_Y1 - CL_Y0, w = AGC * T8;
    for (let k = 0; k < 8; k++) {
      const f = faceFrame(u, k);
      plane(f, M.glass, 2 * w, h, 0, h / 2, AGC);
      box(f, M.steel, 2 * w, 0.05, 0.07, 0, 0.025, AGC); box(f, M.steel, 0.05, h, 0.07, w, h / 2, AGC);
      if (hi) box(f, M.steel, 0.04, h, 0.06, 0, h / 2, AGC);
    }
  }

  // ===== furniture =====
  const furn = [];   // [build fn] collected first, then timed evenly across 0.25..0.6
  const addF = (name, parent, x, z, ry, fn) => furn.push({ name, parent, x, z, ry, fn });
  for (const k of [2, 6]) {   // long shared work tables on the east/west faces, tangential, 3 chairs a side
    const f = faceFrame(G.furniture, k);
    addF(`long_table_${k}`, f, 0, 4.5, 0, u => {
      box(u, M.oak, 3.2, 0.045, 0.95, 0, 0.75 - 0.0225, 0);
      for (const x of [-1.3, 1.3]) {
        box(u, M.steel, 0.06, 0.7, 0.06, x, 0.36, -0.36); box(u, M.steel, 0.06, 0.7, 0.06, x, 0.36, 0.36);
        box(u, M.steel, 0.06, 0.05, 0.8, x, 0.7, 0); if (hi) box(u, M.steel, 0.06, 0.04, 0.8, x, 0.02, 0);
      }
      if (hi) box(u, M.steel, 2.6, 0.05, 0.05, 0, 0.18, 0);
    });
    for (const x of [-1.0, 0, 1.0]) {
      addF(`chair`, f, x, 5.2, 0, u => chair(u, M, hi));
      addF(`chair`, f, x, 3.8, Math.PI, u => chair(u, M, hi));
    }
  }
  for (const k of [1, 7]) {   // window counters along the glass, 4 stools each
    const f = faceFrame(G.furniture, k);
    addF(`window_counter_${k}`, f, 0, 6.06, 0, u => {
      box(u, M.oak, 4.6, 0.045, 0.5, 0, 1.0 - 0.0225, 0);
      if (hi) for (const x of [-1.9, 0, 1.9]) { box(u, M.steel, 0.04, 0.3, 0.04, x, 0.82, 0.27); box(u, M.steel, 0.04, 0.04, 0.4, x, 0.95, 0.09); }
    });
    for (const x of [-1.65, -0.55, 0.55, 1.65]) addF('stool', f, x, 5.35, Math.PI, u => stool(u, M, hi));
    // a 2-top in front of the counter
    addF(`two_top_${k}`, f, 0, 3.75, 0, u => {
      cyl(u, M.oak, 0.36, 0.36, 0.035, 0, 0.74, 0, hi ? 20 : 10); cyl(u, M.steel, 0.025, 0.025, 0.72, 0, 0.36, 0, 6);
      cyl(u, M.steel, 0.22, 0.22, 0.02, 0, 0.01, 0, hi ? 14 : 8);
    });
    addF('chair', f, -0.62, 3.75, -Math.PI / 2, u => chair(u, M, hi));
    addF('chair', f, 0.62, 3.75, Math.PI / 2, u => chair(u, M, hi));
  }
  { // lounge, back right (face 3): rug, two armchairs angled toward each other and the stove, side table, floor lamp
    const f = faceFrame(G.furniture, 3);
    addF('rug', f, 0, 4.6, 0, u => box(u, M.rug, 2.7, 0.012, 1.9, 0, 0.006, 0));
    addF('armchair', f, -0.75, 4.85, -0.35, u => armchair(u, M, hi));
    addF('armchair', f, 0.75, 4.85, 0.35, u => armchair(u, M, hi));
    addF('side_table', f, 0, 5.25, 0, u => { cyl(u, M.walnut, 0.25, 0.25, 0.03, 0, 0.5, 0, 16); cyl(u, M.steel, 0.02, 0.02, 0.5, 0, 0.25, 0, 6); cyl(u, M.steel, 0.16, 0.16, 0.015, 0, 0.008, 0, 12); });
    addF('floor_lamp', f, 1.45, 5.6, 0, u => {
      cyl(u, M.steel, 0.14, 0.15, 0.025, 0, 0.012, 0, 12); cyl(u, M.steel, 0.012, 0.012, 1.45, 0, 0.73, 0, 6);
      const sh = cyl(u, M.steelDS, 0.12, 0.2, 0.22, 0, 1.5, 0, 14, true);
      const d = new THREE.Mesh(gget('disc15', () => new THREE.CircleGeometry(0.15, 12)), M.bulb); d.rotation.x = Math.PI / 2; d.position.set(0, 1.42, 0); u.add(d);
    });
    if (hi) addF('floor_plant', f, -1.6, 5.75, 0, u => floorPlant(u, M));
  }
  { // low bookshelf under the windows (face 5) + a 2-top + a plant
    const f = faceFrame(G.furniture, 5);
    addF('bookshelf', f, 0, 6.12, 0, u => {
      const L = 3.6, H = 0.88, D = 0.32;
      box(u, M.fir, L, 0.03, D, 0, H, 0); box(u, M.fir, L, 0.03, D, 0, 0.05, 0); box(u, M.fir, L, 0.025, D, 0, 0.46, 0);
      for (const x of [-L / 2, -L / 6, L / 6, L / 2]) box(u, M.fir, 0.03, H, D, x, H / 2, 0);
      box(u, M.fir, L, H, 0.02, 0, H / 2, D / 2 - 0.01);
      if (hi) {
        let s = 3;
        for (const yb of [0.065, 0.475]) {
          let x = -L / 2 + 0.05;
          while (x < L / 2 - 0.12) {
            s = (s * 16807) % 2147483647; const r = s / 2147483647;
            if (Math.abs(x + L / 6) < 0.05 || Math.abs(x - L / 6) < 0.05) { x += 0.06; continue; }
            if (r < 0.12) { x += 0.25; continue; }   // gaps
            const w = 0.12 + r * 0.12, h = 0.24 + ((r * 7) % 1) * 0.12;
            box(u, M.books[Math.floor(r * 60) % 6], w, h, 0.22, x + w / 2, yb + h / 2, -0.02);
            x += w + 0.008;
          }
        }
      }
    });
    addF('two_top_5', f, 0, 4.2, 0, u => {
      cyl(u, M.oak, 0.36, 0.36, 0.035, 0, 0.74, 0, hi ? 20 : 10); cyl(u, M.steel, 0.025, 0.025, 0.72, 0, 0.36, 0, 6);
      cyl(u, M.steel, 0.22, 0.22, 0.02, 0, 0.01, 0, hi ? 14 : 8);
    });
    addF('chair', f, -0.62, 4.2, -Math.PI / 2, u => chair(u, M, hi));
    addF('chair', f, 0.62, 4.2, Math.PI / 2, u => chair(u, M, hi));
    if (hi) addF('floor_plant', f, 2.1, 5.5, 0, u => floorPlant(u, M));
  }
  if (hi) { const f = faceFrame(G.furniture, 0); addF('floor_plant', f, -1.75, 5.6, 0, u => floorPlant(u, M)); addF('floor_plant', f, 1.75, 5.6, 0, u => floorPlant(u, M)); }
  // wood stove on the old stone fire pit (pit top at F + 0.5): slate hearth cap, stove, flue into the cupola apex
  addF('wood_stove', G.furniture, 0, 0, 0, u => {
    const y = F + 0.5;
    if (!hi) cyl(u, M.stone, 0.75, 0.8, 0.5, 0, F + 0.25, 0, 10);   // gazebo.js only has the stone pit at lod high
    cyl(u, M.slate, 0.83, 0.83, 0.04, 0, y + 0.02, 0, hi ? 24 : 12);
    for (const sx of [-0.2, 0.2]) for (const sz of [-0.17, 0.17]) box(u, M.steel, 0.05, 0.12, 0.05, sx, y + 0.1, sz);
    box(u, M.steel, 0.56, 0.6, 0.48, 0, y + 0.46, 0);
    box(u, M.steel, 0.62, 0.03, 0.54, 0, y + 0.775, 0);
    plane(u, M.fire, 0.36, 0.28, 0, y + 0.45, 0.242);
    if (hi) box(u, M.steel, 0.44, 0.04, 0.03, 0, y + 0.66, 0.25);
    cyl(u, M.steel, 0.075, 0.075, 7.85 - (y + 0.79), 0, (7.85 + y + 0.79) / 2, 0, 10);
    if (hi) { // log rack beside the hearth
      const lr = new THREE.Group(); lr.position.set(1.15, F, 0.55); lr.rotation.y = -0.6; u.add(lr);
      for (const sx of [-0.3, 0.3]) { box(lr, M.steel, 0.03, 0.5, 0.03, sx, 0.25, -0.15); box(lr, M.steel, 0.03, 0.5, 0.03, sx, 0.25, 0.15); box(lr, M.steel, 0.03, 0.03, 0.33, sx, 0.02, 0); }
      for (let i = 0; i < 7; i++) { const l = cyl(lr, M.kraft, 0.055, 0.055, 0.55, 0, 0.09 + Math.floor(i / 3) * 0.1, -0.11 + (i % 3) * 0.11 + (i > 5 ? 0.05 : 0), 7); l.rotation.z = Math.PI / 2; }
    }
  });
  furn.forEach((it, i) => {
    const t0 = 0.25 + (i / Math.max(1, furn.length - 1)) * (0.6 - 0.25 - 0.1);
    const u = unit(it.parent, it.name, t0, t0 + 0.1, it.name.startsWith('rug') ? 'rise' : 'grow', it.x, F, it.z, it.ry);
    it.fn(u);
  });
  // stove pieces were built in floor-relative coords from y = F; undo the unit's lift for the stove
  G.furniture.children.find(c => c.name === 'wood_stove').position.y = 0;
  // and the log rack inside it sits at F already: fine (stove unit at 0)

  // ===== café (back, face 4 = -Z) =====
  const cafeItems = [];
  const addC = (name, x, y, z, ry, mode, fn) => cafeItems.push({ name, x, y, z, ry, mode, fn });
  const CT = F + 1.05;   // counter top
  addC('cafe_counter', 0, F, -4.25, 0, 'rise', u => {
    box(u, M.fir, 3.4, 0.96, 0.56, 0, 0.48 + 0.04, 0);
    box(u, M.steel, 3.36, 0.04, 0.5, 0, 0.02, 0.0);                 // recessed steel plinth
    box(u, M.walnut, 3.55, 0.05, 0.7, 0, 1.025, 0.04);
    if (hi) { box(u, M.steel, 3.3, 0.03, 0.03, 0, 0.2, 0.38); for (const x of [-1.5, 0, 1.5]) box(u, M.steel, 0.03, 0.03, 0.12, x, 0.2, 0.33); }   // foot rail
  });
  addC('back_bar', 0, F, -6.07, 0, 'rise', u => {
    box(u, M.fir, 4.6, 0.86, 0.52, 0, 0.45, 0);
    box(u, M.walnut, 4.64, 0.04, 0.56, 0, 0.9, 0);
    if (hi) {
      box(u, M.stainless, 0.6, 0.7, 0.02, -1.6, 0.42, 0.265); box(u, M.stainless, 0.6, 0.7, 0.02, -0.95, 0.42, 0.265);   // under-counter fridges
      box(u, M.stainless, 0.5, 0.02, 0.38, 1.3, 0.925, 0);                                                            // sink
      box(u, M.steel, 0.02, 0.2, 0.02, 1.3, 1.02, -0.15);
    }
  });
  if (hi) addC('shelving', 0, F + 0.92, -6.07, 0, 'rise', u => {
    for (const sx of [-1, 1]) {
      for (const x of [0.75, 2.05]) box(u, M.steel, 0.03, 1.55, 0.03, sx * x, 0.775, -0.1);
      for (const y of [0.55, 1.0, 1.45]) box(u, M.oak, 1.4, 0.035, 0.26, sx * 1.4, y, 0);
    }
    // jars, bean bags, cups on the shelves
    let s = 11; const rr = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (const sx of [-1, 1]) for (const y of [0.57, 1.02, 1.47]) {
      let x = 0.85; while (x < 1.95) {
        const r = rr(), X = sx * x;
        if (r < 0.35) { cyl(u, M.glass, 0.06, 0.06, 0.2, X, y + 0.1, 0, 8); cyl(u, M.pastry2, 0.055, 0.055, 0.12, X, y + 0.06, 0, 8); x += 0.16; }
        else if (r < 0.65) { box(u, M.kraft, 0.13, 0.24, 0.09, X, y + 0.12, 0); x += 0.17; }
        else if (r < 0.85) { for (let i = 0; i < 4; i++) cyl(u, M.ceramic, 0.045, 0.035, 0.06, X, y + 0.03 + i * 0.055, 0, 8); x += 0.14; }
        else { potPlant(u, M, 0.9); u.children.slice(-4).forEach(c => { c.position.x += X; c.position.y += y; }); x += 0.2; }
      }
    }
  });
  addC('menu_board', 0, F + 0.92, -6.12, 0, 'grow', u => {
    box(u, M.walnut, 1.06, 1.26, 0.04, 0, 0.66, 0);
    plane(u, M.menu, 0.96, 1.16, 0, 0.66, 0.021);
  });
  addC('espresso_machine', -0.85, CT, -4.3, 0, 'grow', u => {   // group heads toward the barista (-Z side)
    box(u, M.stainless, 0.74, 0.4, 0.5, 0, 0.2 + 0.05, 0.02);
    box(u, M.steel, 0.74, 0.05, 0.56, 0, 0.025, 0);
    box(u, M.steel, 0.76, 0.02, 0.5, 0, 0.46, 0.02);
    if (hi) for (const x of [-0.18, 0.18]) {
      cyl(u, M.stainless, 0.045, 0.045, 0.05, x, 0.24, -0.27, 10);
      const h = box(u, M.steel, 0.03, 0.03, 0.15, x, 0.22, -0.36);
      for (let i = 0; i < 2; i++) cyl(u, M.ceramic, 0.04, 0.035, 0.08, -0.25 + i * 0.12 + x * 0.1, 0.51, 0.02 + i * 0.08, 8);
    }
    if (hi) { const w = cyl(u, M.stainless, 0.012, 0.012, 0.18, 0.32, 0.2, -0.3, 6); w.rotation.x = 0.4; }
  });
  addC('grinder', -0.2, CT, -4.35, 0, 'grow', u => {
    box(u, M.steel, 0.18, 0.32, 0.28, 0, 0.16, 0);
    cyl(u, M.glass, 0.09, 0.05, 0.22, 0, 0.43, 0, 10); if (hi) cyl(u, M.pastry2, 0.07, 0.05, 0.1, 0, 0.37, 0, 10);
  });
  addC('pastry_case', 1.05, CT, -4.22, 0, 'grow', u => {
    box(u, M.walnut, 0.95, 0.06, 0.52, 0, 0.03, 0);
    box(u, M.glass, 0.93, 0.42, 0.5, 0, 0.27, 0);
    if (hi) {
      box(u, M.steel, 0.95, 0.02, 0.52, 0, 0.49, 0);
      for (const x of [-0.465, 0.465]) for (const z of [-0.25, 0.25]) box(u, M.steel, 0.02, 0.42, 0.02, x, 0.27, z);
      box(u, M.glass, 0.9, 0.01, 0.46, 0, 0.27, 0);
      for (let i = 0; i < 6; i++) for (const lvl of [0.08, 0.3]) {
        const m = new THREE.Mesh(gget('pastry', () => new THREE.SphereGeometry(0.045, 8, 6)), (i + (lvl > 0.1)) % 2 ? M.pastry : M.pastry2);
        m.scale.set(1.2, 0.55, 0.9); m.position.set(-0.36 + i * 0.145, lvl, 0.05 * ((i % 2) * 2 - 1)); u.add(m);
      }
    }
  });
  addC('till', 0.35, CT, -4.1, Math.PI, 'grow', u => {
    cyl(u, M.steel, 0.06, 0.07, 0.02, 0, 0.01, 0, 10); box(u, M.steel, 0.025, 0.2, 0.025, 0, 0.11, 0);
    const t = new THREE.Group(); t.position.set(0, 0.24, 0); t.rotation.x = -0.6; u.add(t);
    box(t, M.steel, 0.26, 0.18, 0.015, 0, 0, 0); plane(t, M.screen, 0.24, 0.16, 0, 0, 0.008);
  });
  if (hi) {
    addC('brewer', 0.4, F + 0.92, -6.1, 0, 'grow', u => { box(u, M.stainless, 0.3, 0.55, 0.32, 0, 0.275, 0); cyl(u, M.glass, 0.08, 0.08, 0.2, 0, 0.12, 0.1, 10); });
    addC('cup_stacks', -0.55, F + 0.92, -6.05, 0, 'grow', u => { for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) cyl(u, M.ceramic, 0.045, 0.035, 0.06, -0.1 + j * 0.1, 0.03 + i * 0.055, 0, 8); });
    addC('pitchers', -1.4, CT, -4.15, 0, 'grow', u => { cyl(u, M.stainless, 0.045, 0.05, 0.1, 0, 0.05, 0, 10); cyl(u, M.stainless, 0.045, 0.05, 0.1, 0.12, 0.05, 0.03, 10); });
    addC('counter_plant', -1.45, CT, -4.4, 0, 'grow', u => potPlant(u, M, 1.2));
  }
  cafeItems.forEach((it, i) => {
    const t0 = 0.45 + (i / Math.max(1, cafeItems.length - 1)) * (0.75 - 0.45 - 0.1);
    it.fn(unit(G.cafe, it.name, t0, t0 + 0.1, it.mode, it.x, it.y, it.z, it.ry));
  });

  // ===== laptops, lamps, mugs, plants (on tables and counters) =====
  const lt = [];
  const addL = (name, parent, x, y, z, ry, fn) => lt.push({ name, parent, x, y, z, ry, fn });
  const TT = F + 0.75;
  for (const k of [2, 6]) {
    const f = faceFrame(G.laptops, k);
    [[-1.0, 1], [0, 1], [1.0, 0], [-1.0, 0], [0, 0], [1.0, 1]].forEach(([x, outer], i) => {
      if (!hi && i % 2) return;
      const zz = outer ? 4.5 + 0.2 : 4.5 - 0.2, ry = outer ? 0 : Math.PI;
      if (i !== 2 && i !== 3) addL('laptop', f, x + (i % 3 - 1) * 0.05, TT, zz, ry + (i % 2 ? 0.12 : -0.08), u => laptop(u, M));
      if (hi && i % 2 === 0) addL('mug', f, x + 0.28, TT, zz + (outer ? 0.08 : -0.08), 0, u => mug(u, M));
    });
    addL('desk_lamp', f, -1.45, TT, 4.5, Math.PI / 2, u => deskLamp(u, M));
    addL('desk_lamp', f, 1.45, TT, 4.5, -Math.PI / 2, u => deskLamp(u, M));
    if (hi) addL('table_plant', f, 0.5, TT, 4.5, 0, u => potPlant(u, M));
  }
  for (const k of [1, 7]) {
    const f = faceFrame(G.laptops, k), CY = F + 1.0;
    addL('laptop', f, -1.65, CY, 6.0, Math.PI, u => laptop(u, M));
    addL('laptop', f, 0.55, CY, 6.0, Math.PI + 0.1, u => laptop(u, M));
    if (hi) { addL('mug', f, -1.3, CY, 5.95, 0, u => mug(u, M)); addL('mug', f, 1.65, CY, 6.0, 0, u => mug(u, M)); addL('table_plant', f, 2.15, CY, 6.12, 0, u => potPlant(u, M)); }
    addL('laptop', f, 0.1, F + 0.758, 3.75, Math.PI / 2, u => laptop(u, M));
    if (hi) addL('mug', f, -0.18, F + 0.758, 3.65, 0, u => mug(u, M));
  }
  { const f = faceFrame(G.laptops, 5); if (hi) { addL('mug', f, -0.12, F + 0.758, 4.1, 0, u => mug(u, M)); addL('mug', f, 0.15, F + 0.758, 4.3, 0, u => mug(u, M)); addL('book_open', f, 0.1, F + 0.758, 4.05, 0.3, u => box(u, M.ceramic, 0.3, 0.02, 0.21, 0, 0.01, 0)); } }
  { const f = faceFrame(G.laptops, 3); addL('table_lamp', f, 0.05, F + 0.515, 5.25, 0, u => {
      cyl(u, M.ceramic, 0.06, 0.07, 0.22, 0, 0.11, 0, 10);
      cyl(u, M.opal, 0.1, 0.13, 0.16, 0, 0.3, 0, 14);
    });
    if (hi) addL('mug', f, -0.12, F + 0.515, 5.15, 0, u => mug(u, M)); }
  lt.forEach((it, i) => {
    const t0 = 0.65 + (i / Math.max(1, lt.length - 1)) * (0.9 - 0.65 - 0.08);
    it.fn(unit(it.parent, it.name, t0, t0 + 0.08, 'grow', it.x, it.y, it.z, it.ry));
  });

  // ===== pendant lights =====
  const pend = [];
  const addP = (parent, x, z, a, hang, kind) => pend.push({ parent, x, z, a, hang, kind });
  for (const k of [2, 6]) { const f = faceFrame(G.lights, k); for (const x of [-1.0, 0, 1.0]) addP(f, x, 4.5, 4.5, F + 1.95, 'dome'); }
  for (const k of [1, 7]) { const f = faceFrame(G.lights, k); for (const x of [-1.1, 1.1]) addP(f, x, 5.9, 5.9, F + 2.1, 'dome'); addP(f, 0, 3.75, 3.75, F + 1.9, 'dome'); }
  { const f = faceFrame(G.lights, 5); addP(f, 0, 4.2, 4.2, F + 1.9, 'dome'); }
  for (const x of [-1.1, 0, 1.1]) addP(G.lights, x, -4.25, 4.25, F + 2.05, 'globe');
  pend.forEach((p, i) => {
    if (!hi && i % 2) return;
    const top = ceilY(p.a) + 0.02, L = top - p.hang;
    const t0 = 0.8 + (i / Math.max(1, pend.length - 1)) * 0.1;
    const u = unit(p.parent, 'pendant', t0, t0 + 0.08, 'drop', p.x, top, p.z);
    u.userData.stage.L = L;
    const cord = new THREE.Mesh(gget('cord', () => new THREE.BoxGeometry(0.012, 1, 0.012).translate(0, -0.5, 0)), M.steel);
    cord.name = 'cord'; cord.scale.y = L; u.add(cord);
    if (hi) cyl(u, M.steel, 0.05, 0.05, 0.03, 0, -0.015, 0, 8);   // ceiling canopy
    const head = new THREE.Group(); head.name = 'head'; head.position.y = -L; u.add(head);
    if (p.kind === 'globe') {
      const s = new THREE.Mesh(gget('globe', () => new THREE.SphereGeometry(0.16, hi ? 16 : 8, hi ? 12 : 6)), M.opal); s.position.y = -0.16; head.add(s);
      cyl(head, M.steel, 0.04, 0.04, 0.04, 0, -0.01, 0, 8);
    } else {
      const sh = cyl(head, M.steelDS, 0.04, 0.22, 0.2, 0, -0.1, 0, hi ? 18 : 10, true);
      const b = new THREE.Mesh(gget('bulb', () => new THREE.SphereGeometry(0.055, 10, 8)), M.bulb); b.position.y = -0.15; head.add(b);
    }
  });

  // per-unit material clones so each piece can fade on its own
  g.traverse(o => {
    if (!o.userData.stage) return;
    const map = new Map();
    o.traverse(m => {
      if (!m.isMesh) return;
      let c = map.get(m.material);
      if (!c) {
        c = m.material.clone();
        Object.assign(c.userData, { baseOpacity: c.opacity, baseTransparent: c.transparent, baseEmissive: c.emissiveIntensity });
        map.set(m.material, c);
      }
      m.material = c;
    });
  });
  return g;
}

// ---------- staging ----------
const clamp01 = v => Math.min(1, Math.max(0, v));
const ease = t => t * t * (3 - 2 * t);
export function setStage(group, k) {
  const lightE = ease(clamp01((k - 0.85) / 0.15));
  group.traverse(o => {
    const s = o.userData.stage; if (!s) return;
    const e = ease(clamp01((k - s.t0) / (s.t1 - s.t0)));
    o.visible = e > 0.002;
    if (s.mode === 'rise') o.scale.set(1, Math.max(e, 0.002), 1);
    else if (s.mode === 'drop') {
      for (const c of o.children) {
        if (c.name === 'cord') c.scale.y = Math.max(s.L * e, 0.001);
        if (c.name === 'head') c.position.y = -s.L * e;
      }
    } else o.scale.setScalar(0.72 + 0.28 * e);
    o.traverse(m => {
      if (!m.isMesh) return;
      const mat = m.material, u = mat.userData;
      if (u.baseOpacity === undefined) return;
      const wantT = u.baseTransparent || e < 0.999;
      if (mat.transparent !== wantT) { mat.transparent = wantT; mat.needsUpdate = true; }
      mat.opacity = wantT ? u.baseOpacity * e : 1;
      if (u.glow) mat.emissiveIntensity = u.baseEmissive * lightE;
    });
  });
}

// Shrink away gazebo.js's picnic tables (its 'picnic_table' groups) as the café furniture arrives (k 0.15..0.3).
// Pass the gazebo model (or any ancestor). Only scale/visibility change; nothing is removed.
export function clearGazebo(gazebo, k) {
  const e = ease(clamp01((k - 0.15) / 0.15));
  gazebo.traverse(o => {
    if (o.name !== 'picnic_table') return;
    const s = Math.max(1 - e, 0.001);
    o.scale.set(s, s, s); o.visible = e < 0.999;
  });
}

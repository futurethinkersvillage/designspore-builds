// Shower houses (Wells Gray Golf & RV Resort). Two very different buildings, one module, variant = 'main' | 'field'.
//  main  - the Main Shower House by the office/RV loop: ~13 x 7.4 m orange-red vertical-channel-sided washroom with a
//          side-gable brown shingle roof (~28°) that breaks to a flatter pitch over a full-length front porch;
//          red 6x6 posts with knee braces, two-rail red railing, double stair in the middle, white doors + notice
//          boards, small high windows at the back; the porch deck wraps round the NE end as one low deck on short
//          posts over soil/cobble beds, and a long grey-boarded access ramp runs out from that NE deck to the lot;
//          NE gable: wide window + small upright window up in the gable.
//  field - the Field Shower House by the lake field: a 2.4 x 3.6 m silver-panel shower pod (white aluminium trim,
//          steel door + louvred transom, recessed service alcove behind a white lattice screen, small window) under a
//          green ribbed-metal gable roof (27°) on a cedar beam frame, the door wall UNDER THE GABLE; in line with it
//          along the ridge, a timber picnic pavilion (six cedar posts + knee braces, raised deck, counter rail, 32° roof).
// Units metres, origin = ground-level centre of the footprint, +Y up, main entrance faces +Z.
import * as THREE from 'three';

export const meta = {
  name: 'Shower House',
  layer: 'bathroom_shower_house',
  match: [1, 0], // 1 = 'Main Shower House' (L-ish 6-vertex polygon), 0 = 'Field Shower House'
  footprint: [16.0, 12.3], // main (roof + NE walkway + stairs); field: [11.9, 5.1]
  height: 6.3, // main incl. stove pipe; field 4.0
  variants: {
    main: { footprint: [16.0, 12.3], height: 6.3, entrance: 'porch faces SE (bearing ~145°), toward the gravel lot' },
    field: { footprint: [11.9, 5.1], height: 4.0, entrance: 'pod door faces NW (+X, under its gable), away from the pavilion; pod at the NW end, pavilion at the SE end' },
  },
  place: [
    { x: -80.52, y: 66.01, rotY: 0.618, variant: 'main' },
    { x: -99.94, y: -138.79, rotY: 2.173, variant: 'field' },
  ],
  sources: [
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/Shower House.jpg, 20210620_172133-EDIT.jpg (main: porch front, stairs, posts, doors, SW gable)',
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/21.jpg, wellsgraygolf20.PNG (main: front 3/4 from S, NE end deck)',
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/20210926_142035.jpg (main: back wall windows, back door, round gable vent)',
    'assets/pano/shower_360.jpg (main, newest: NE end - access ramp off the NE deck, deck on posts over soil/cobble beds, wide NE window, gable window, orange-red paint)',
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/Shower House in Field.jpg, PXL_20220517_214234191-EDIT.jpg (field, current 2022 layout)',
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/20210621_172427-EDIT.jpg (field, 2021: pod window end + pavilion detail)',
    'data/ortho.webp around (-87, -131) (field: both roofs, ridges NNW-SSE, spacing)',
    'data/layers.json bathroom_shower_house features 1 (Main) and 0 (Field); pano_points "Shower House"',
  ],
  notes: 'See models/notes/shower_house.md. Outhouses (bathroom_shower_house 2-7) are NOT modelled here.',
};

// ---------------------------------------------------------------- textures (cached)
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
const rgb = (r, g, b, v = 1) => `rgb(${Math.round(r * v)},${Math.round(g * v)},${Math.round(b * v)})`;

function sidingTex() { // orange-red vertical channel siding (360 photo: ~rgb 147,80,60 in overcast light), 6 boards per 1.2 m tile
  return canvasTex('sh_siding2', 192, 128, (g, w, h) => {
    const r = rnd(3), bw = w / 6;
    for (let i = 0; i < 6; i++) {
      g.fillStyle = rgb(230, 128, 92, 0.94 + r() * 0.08); g.fillRect(i * bw, 0, bw, h);
      g.fillStyle = 'rgba(96,38,20,0.55)'; g.fillRect(i * bw, 0, 3, h);
      g.fillStyle = 'rgba(255,190,150,0.2)'; g.fillRect(i * bw + 3, 0, 2, h);
    }
  });
}
function deckRedTex() { // main: decking painted the same orange-red as the building, boards ~0.1 m
  return canvasTex('sh_deckred', 64, 64, (g, w, h) => {
    const r = rnd(18);
    for (let x = 0; x < w; x += 8) { g.fillStyle = rgb(196, 112, 84, 0.82 + r() * 0.16); g.fillRect(x, 0, 7, h); g.fillStyle = '#4a2a1e'; g.fillRect(x + 7, 0, 1, h); }
  });
}
function rampTex() { // main: weathered grey ramp boards laid across the ramp
  return canvasTex('sh_ramp', 64, 64, (g, w, h) => {
    const r = rnd(19);
    for (let x = 0; x < w; x += 8) { g.fillStyle = rgb(196, 188, 178, 0.85 + r() * 0.14); g.fillRect(x, 0, 7, h); g.fillStyle = '#6a645c'; g.fillRect(x + 7, 0, 1, h); }
  });
}
function wideWindowTex() { // main NE gable: wide single window, white frame (~1.55 x 0.7 m)
  return canvasTex('sh_winwide', 128, 58, (g, w, h) => {
    g.fillStyle = '#f2f3f1'; g.fillRect(0, 0, w, h);
    const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, '#5f7f9a'); grd.addColorStop(0.5, '#22303c'); grd.addColorStop(1, '#3d5160');
    g.fillStyle = grd; g.fillRect(6, 6, w - 12, h - 12);
    g.fillStyle = 'rgba(220,235,245,0.18)'; g.beginPath(); g.moveTo(14, h - 6); g.lineTo(40, 6); g.lineTo(52, 6); g.lineTo(26, h - 6); g.fill();
  });
}
function gableWindowTex() { // main NE gable peak: small upright window, white frame + centre mullion (~0.4 x 0.6 m)
  return canvasTex('sh_wingable', 40, 60, (g, w, h) => {
    g.fillStyle = '#f2f3f1'; g.fillRect(0, 0, w, h);
    for (const x0 of [5, 22]) { const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, '#7f949e'); grd.addColorStop(1, '#2c3a44'); g.fillStyle = grd; g.fillRect(x0, 5, 13, h - 10); }
  });
}
function shingleTex() {
  return canvasTex('sh_shingle', 256, 256, (g, w, h) => {
    const r = rnd(7); g.fillStyle = '#4c3b32'; g.fillRect(0, 0, w, h);
    const rows = 10, rh = h / rows;
    for (let i = 0; i < rows; i++) {
      let x = -(i % 2) * 20 - r() * 10;
      while (x < w) { const tw = 14 + r() * 26; g.fillStyle = rgb(98, 78, 64, 0.8 + r() * 0.3); g.fillRect(x + 1, i * rh + 1, tw - 2, rh - 2); x += tw; }
      g.fillStyle = 'rgba(30,22,16,0.6)'; g.fillRect(0, i * rh + rh - 3, w, 3);
    }
  });
}
function soffitTex() {
  return canvasTex('sh_soffit', 64, 64, (g, w, h) => {
    const r = rnd(9);
    for (let x = 0; x < w; x += 8) { g.fillStyle = rgb(196, 150, 96, 0.85 + r() * 0.2); g.fillRect(x, 0, 8, h); g.fillStyle = 'rgba(60,40,20,0.4)'; g.fillRect(x, 0, 1, h); }
  });
}
function metalTex() { // green ribbed metal roofing (field), ribs every 0.3 m (tile 0.9 m)
  return canvasTex('sh_metal2', 96, 32, (g, w, h) => {
    g.fillStyle = '#1f7a64'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 32) {
      g.fillStyle = '#4aa58b'; g.fillRect(x, 0, 3, h); g.fillStyle = '#145243'; g.fillRect(x + 3, 0, 3, h);
      g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(x + 12, 0, 2, h); g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(x + 22, 0, 2, h);
    }
  });
}
function gableSheetTex() { // the same green panels run vertically on the gable triangles (ribs every 0.23 m, tile 0.92 m)
  return canvasTex('sh_gsheet', 64, 32, (g, w, h) => {
    g.fillStyle = '#17604c'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 16) { g.fillStyle = '#2c7c64'; g.fillRect(x, 0, 2, h); g.fillStyle = '#0e4033'; g.fillRect(x + 2, 0, 2, h); }
  });
}
function polyTex() { // brushed silver aluminium-faced panels of the shower pod (tile 1.2 x 2.4 m, lighter at the top)
  return canvasTex('sh_poly2', 64, 128, (g, w, h) => {
    const r = rnd(12), grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#dfe2e0'); grd.addColorStop(0.55, '#c9cdca'); grd.addColorStop(1, '#aeb3b0');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x++) { g.fillStyle = `rgba(${r() < 0.5 ? '90,100,98' : '255,255,255'},${0.04 + r() * 0.06})`; g.fillRect(x, 0, 1, h); }
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(0, h * 0.18, w, h * 0.12);
  });
}
function timberTex() { // rough-sawn cedar
  return canvasTex('sh_timber', 64, 64, (g, w, h) => {
    const r = rnd(4); g.fillStyle = '#b98c5c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '120,80,45' : '220,180,130'},0.25)`; g.fillRect(0, r() * h, w, 1); }
  });
}
function deckTex() {
  return canvasTex('sh_deck', 64, 64, (g, w, h) => {
    const r = rnd(8);
    for (let x = 0; x < w; x += 8) { g.fillStyle = rgb(150, 124, 94, 0.85 + r() * 0.2); g.fillRect(x, 0, 7, h); g.fillStyle = '#4a3a2a'; g.fillRect(x + 7, 0, 1, h); }
  });
}
function doorTex(key, body, frame) { // plain slab door with a small sign / vent
  return canvasTex(key, 64, 140, (g, w, h) => {
    g.fillStyle = frame; g.fillRect(0, 0, w, h); g.fillStyle = body; g.fillRect(4, 4, w - 8, h - 4);
    g.fillStyle = 'rgba(0,0,0,0.08)'; g.fillRect(4, 70, w - 8, 2);
    g.fillStyle = '#3b6fa8'; g.fillRect(22, 30, 20, 14);
    g.fillStyle = '#555'; g.fillRect(48, 74, 8, 4);
  });
}
function steelDoorTex() { // pod door 0.85 x 2.15 m: louvred transom over a brushed stainless slab, black sign plate, lever
  return canvasTex('sh_steel2', 64, 162, (g, w, h) => {
    const r = rnd(5);
    g.fillStyle = '#f2f3f0'; g.fillRect(0, 0, w, h);                         // white aluminium frame
    g.fillStyle = '#b9bdbb'; g.fillRect(4, 3, w - 8, 22);                     // louvre box
    for (let y = 5; y < 24; y += 3) { g.fillStyle = '#7e8381'; g.fillRect(6, y, w - 12, 1); g.fillStyle = '#e4e6e4'; g.fillRect(6, y + 1, w - 12, 1); }
    const grd = g.createLinearGradient(0, 0, w, 0); grd.addColorStop(0, '#9fa4a2'); grd.addColorStop(0.5, '#c3c7c5'); grd.addColorStop(1, '#a3a8a6');
    g.fillStyle = grd; g.fillRect(5, 29, w - 10, h - 30);                     // slab
    for (let x = 5; x < w - 5; x++) { g.fillStyle = `rgba(${r() < 0.5 ? '70,75,74' : '255,255,255'},${r() * 0.08})`; g.fillRect(x, 29, 1, h - 30); }
    g.fillStyle = '#1d1d1d'; g.fillRect(24, 46, 12, 10); g.fillStyle = '#dcdcdc'; g.fillRect(28, 49, 4, 4); // sign plate
    g.fillStyle = '#5c605e'; g.fillRect(49, 88, 5, 16); g.fillStyle = '#e8e8e6'; g.fillRect(44, 92, 10, 3);  // lock + lever
  });
}
function podWindowTex() { // small two-pane window, white frame (0.5 x 0.9 m)
  return canvasTex('sh_podwin', 64, 128, (g, w, h) => {
    g.fillStyle = '#f4f5f3'; g.fillRect(0, 0, w, h);
    for (const [y0, y1] of [[8, 60], [68, 120]]) {
      const grd = g.createLinearGradient(0, y0, w, y1); grd.addColorStop(0, '#7d9aa1'); grd.addColorStop(0.6, '#3e5a62'); grd.addColorStop(1, '#55717a');
      g.fillStyle = grd; g.fillRect(8, y0, w - 16, y1 - y0);
    }
    g.fillStyle = 'rgba(230,240,245,0.25)'; g.fillRect(12, 12, 8, 44);
  });
}
function windowTex() {
  return canvasTex('sh_window', 64, 64, (g, w, h) => {
    g.fillStyle = '#f2f3f1'; g.fillRect(0, 0, w, h);
    const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, '#6c7a82'); grd.addColorStop(0.55, '#26313a'); grd.addColorStop(1, '#3a4650');
    g.fillStyle = grd; g.fillRect(6, 6, w - 12, h - 12);
    g.fillStyle = 'rgba(220,235,245,0.22)'; g.beginPath(); g.moveTo(8, h - 8); g.lineTo(30, 8); g.lineTo(38, 8); g.lineTo(16, h - 8); g.fill();
  });
}
function boardsTex() { // notice boards: cork + posters + maps
  return canvasTex('sh_boards', 128, 64, (g, w, h) => {
    const r = rnd(21); g.fillStyle = '#6b4a30'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8a77a'; g.fillRect(3, 3, w - 6, h - 6);
    const cols = ['#f4f1e6', '#e9e3c8', '#6aa3c8', '#e7e7e7', '#9cc28a', '#f0d36b'];
    for (let i = 0; i < 9; i++) { g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(6 + r() * (w - 34), 6 + r() * (h - 30), 14 + r() * 16, 12 + r() * 14); }
  });
}
function latticeTex() { // white vinyl lattice panel with a frame (~8 diamonds across)
  return canvasTex('sh_lattice2', 128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.strokeStyle = '#f4f4f2'; g.lineWidth = 5;
    for (let i = -w; i < 2 * w; i += 16) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke();
      g.beginPath(); g.moveTo(i, h); g.lineTo(i + h, 0); g.stroke();
    }
    g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
  });
}
function ventTex() { // round gable vent
  return canvasTex('sh_vent', 64, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.fillStyle = '#e8e6df'; g.beginPath(); g.arc(32, 32, 30, 0, 7); g.fill();
    g.fillStyle = '#3a3532'; g.beginPath(); g.arc(32, 32, 24, 0, 7); g.fill();
    for (let y = 12; y < 54; y += 6) { g.fillStyle = '#8e8a84'; g.fillRect(10, y, 44, 2); }
  });
}

// ---------------------------------------------------------------- mesh kit: collect triangles per material, merge
class Kit {
  constructor() { this.b = new Map(); }
  _buf(mat) { let o = this.b.get(mat); if (!o) { o = { p: [], n: [], uv: [] }; this.b.set(mat, o); } return o; }
  poly(mat, pts, uv = null, want = null) {
    let n = new THREE.Vector3().subVectors(pts[1], pts[0]).cross(new THREE.Vector3().subVectors(pts[2], pts[0])).normalize();
    if (want && n.dot(want) < 0) { pts = pts.slice().reverse(); if (uv) uv = uv.slice().reverse(); n.negate(); }
    const o = this._buf(mat), tile = mat.userData.tile || [1, 1];
    const U = uv || pts.map(p => {
      if (Math.abs(n.y) > 0.75) return [p.x / tile[0], p.z / tile[1]];
      if (Math.abs(n.x) > Math.abs(n.z)) return [p.z / tile[0], p.y / tile[1]];
      return [p.x / tile[0], p.y / tile[1]];
    });
    for (let i = 1; i < pts.length - 1; i++) for (const k of [0, i, i + 1]) {
      o.p.push(pts[k].x, pts[k].y, pts[k].z); o.n.push(n.x, n.y, n.z); o.uv.push(U[k][0], U[k][1]);
    }
  }
  quad(mat, a, b, c, d, uv, want) { this.poly(mat, [a, b, c, d], uv, want); }
  box(mat, sx, sy, sz, x, y, z, { ry = 0, rx = 0, rz = 0, faces = {} } = {}) {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(1, 1, 1));
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const P = (i, j, k) => new THREE.Vector3(i * hx, j * hy, k * hz).applyMatrix4(m);
    const F = [
      ['px', [P(1, -1, 1), P(1, -1, -1), P(1, 1, -1), P(1, 1, 1)]],
      ['nx', [P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1)]],
      ['py', [P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1), P(-1, 1, -1)]],
      ['ny', [P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)]],
      ['pz', [P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)]],
      ['nz', [P(1, -1, -1), P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1)]],
    ];
    for (const [k, pts] of F) { const fm = faces[k] === undefined ? mat : faces[k]; if (fm) this.poly(fm, pts); }
  }
  // stick between two points, square section s (posts, braces, rails)
  stick(mat, a, b, s, { ends = false } = {}) {
    const d = new THREE.Vector3().subVectors(b, a), L = d.length(), c = a.clone().addScaledVector(d, 0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    const m = new THREE.Matrix4().compose(c, q, new THREE.Vector3(1, 1, 1));
    const P = (i, j, k) => new THREE.Vector3(i * s / 2, j * L / 2, k * s / 2).applyMatrix4(m);
    const sides = [[P(1, -1, 1), P(1, -1, -1), P(1, 1, -1), P(1, 1, 1)], [P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1)],
      [P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)], [P(1, -1, -1), P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1)]];
    if (ends) sides.push([P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1), P(-1, 1, -1)]);
    for (const f of sides) this.poly(mat, f);
  }
  decal(mat, w, h, x, y, z, ry = 0) {
    const c = Math.cos(ry), s = Math.sin(ry), hw = w / 2, hh = h / 2;
    const P = (u, v) => new THREE.Vector3(x + u * c, y + v, z - u * s);
    this.quad(mat, P(-hw, -hh), P(hw, -hh), P(hw, hh), P(-hw, hh), [[0, 0], [1, 0], [1, 1], [0, 1]]);
  }
  cyl(mat, r, h, x, y, z, seg = 8) {
    for (let i = 0; i < seg; i++) {
      const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
      const p = (a, yy) => new THREE.Vector3(x + Math.cos(a) * r, yy, z + Math.sin(a) * r);
      this.quad(mat, p(a0, y), p(a0, y + h), p(a1, y + h), p(a1, y), null, new THREE.Vector3(Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)));
    }
    const top = []; for (let i = 0; i < seg; i++) { const a = i / seg * Math.PI * 2; top.push(new THREE.Vector3(x + Math.cos(a) * r, y + h, z + Math.sin(a) * r)); }
    this.poly(mat, top, null, new THREE.Vector3(0, 1, 0));
  }
  // roof extruded along X from a Z-Y top-surface polyline; slab thickness t; bargeboards at both ends
  roof(prof, x0, x1, t, top, under, edge, { tileU = 2, tileV = 1.4, dd = 0.06, ridgeCap = null } = {}) {
    let acc = 0;
    for (let i = 0; i < prof.length - 1; i++) {
      const [za, ya] = prof[i], [zb, yb] = prof[i + 1];
      const L = Math.hypot(zb - za, yb - ya), dz = zb - za, dy = yb - ya;
      const up = dz > 0 ? new THREE.Vector3(0, dz, -dy) : new THREE.Vector3(0, -dz, dy);
      const A = V(x0, ya, za), B = V(x1, ya, za), C = V(x1, yb, zb), Dd = V(x0, yb, zb);
      this.quad(top, A, B, C, Dd, [[x0 / tileU, acc / tileV], [x1 / tileU, acc / tileV], [x1 / tileU, (acc + L) / tileV], [x0 / tileU, (acc + L) / tileV]], up);
      const lo = (p) => V(p.x, p.y - t, p.z);
      this.quad(under, lo(A), lo(B), lo(C), lo(Dd), null, up.clone().negate());
      for (const [x, s] of [[x0, -1], [x1, 1]]) // bargeboard on the end, dropping dd below the slab
        this.quad(edge, V(x, ya, za), V(x, yb, zb), V(x, yb - t - dd, zb), V(x, ya - t - dd, za), null, V(s, 0, 0));
      acc += L;
    }
    for (const [i, s] of [[0, -1], [prof.length - 1, 1]]) { // eave fascias
      const [z, y] = prof[i];
      this.quad(edge, V(x0, y, z), V(x1, y, z), V(x1, y - t - dd, z), V(x0, y - t - dd, z), null, V(0, 0, s * Math.sign(prof[prof.length - 1][0] - prof[0][0])));
    }
    if (ridgeCap) { // cap on the highest vertex
      let hi = 0; prof.forEach((p, i) => { if (p[1] > prof[hi][1]) hi = i; });
      this.box(ridgeCap, x1 - x0 + 0.02, 0.05, 0.26, (x0 + x1) / 2, prof[hi][1] + 0.01, prof[hi][0], { faces: { ny: false } });
    }
  }
  build(name) {
    const g = new THREE.Group(); g.name = name;
    for (const [mat, o] of this.b) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(o.p, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(o.n, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(o.uv, 2));
      geo.computeBoundingSphere();
      const m = new THREE.Mesh(geo, mat); m.name = mat.name; g.add(m);
    }
    return g;
  }
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function mat(name, color, { map = null, tile = [1, 1], rough = 0.85, metal = 0, side = THREE.FrontSide, alphaTest = 0 } = {}) {
  const m = new THREE.MeshStandardMaterial({ name, color, map, roughness: rough, metalness: metal, side, alphaTest, transparent: false });
  m.userData.tile = tile; return m;
}

// ================================================================= MAIN SHOWER HOUSE
// local: +X = NE along the building, +Z = SE (porch / entrance side)
function buildMain(hi) {
  const k = new Kit();
  const siding = mat('siding', 0xffffff, { map: sidingTex(), tile: [1.2, 1.2] });
  siding.emissive.setHex(0xffffff); siding.emissiveMap = siding.map; siding.emissiveIntensity = 0.2;   // the gable faces away from the film's sun; the photo's overcast shows it this orange (Mike 10-31)
  const red = mat('redtrim', 0xcf6c48, { rough: 0.8 }); red.emissive.setHex(0xcf6c48); red.emissiveIntensity = 0.2;
  const shingle = mat('shingle', 0xffffff, { map: shingleTex(), tile: [2, 1.4], rough: 0.95 });
  const soffit = mat('soffit', 0xffffff, { map: soffitTex(), tile: [0.6, 0.6] });
  const conc = mat('concrete', 0x9a9890, { rough: 1 });
  const soil = mat('soil', 0x6e6356, { rough: 1 });
  const soilD = mat('soilshade', 0x3e372f, { rough: 1 });
  const cobble = mat('cobble', 0xbcb6ab, { rough: 0.9 });
  const deck = mat('deck', 0xffffff, { map: deckRedTex(), tile: [0.8, 0.8] });
  const rampM = mat('ramp', 0xffffff, { map: rampTex(), tile: [1.1, 1.1], rough: 0.9 });
  const rampE = mat('rampedge', 0x9c958b, { rough: 0.9 });
  const matM = mat('mat', 0x2b2b2b, { rough: 1 });
  const stairM = mat('stairs', 0x6f6a64, { rough: 0.9 });
  const doorW = mat('doorW', 0xffffff, { map: doorTex('sh_doorw', '#f3f2ec', '#e2e0d8'), rough: 0.5 });
  const win = mat('window', 0xffffff, { map: windowTex(), rough: 0.35 });
  const winWide = mat('windowwide', 0xffffff, { map: wideWindowTex(), rough: 0.35 });
  const winGable = mat('windowgable', 0xffffff, { map: gableWindowTex(), rough: 0.35 });
  const boards = mat('boards', 0xffffff, { map: boardsTex() });
  const white = mat('white', 0xeeeeea, { rough: 0.6 });
  const black = mat('black', 0x2a2a2a, { rough: 0.5, metal: 0.4 });
  const vent = mat('vent', 0xffffff, { map: ventTex(), alphaTest: 0.5 });
  const flash = mat('flashing', 0xd9d6cf, { rough: 0.5, metal: 0.3 });

  const XW = -7.5, XE = 5.5;          // gable end walls (SW, NE)
  const ZB = -5.5, ZF = 1.9;          // back / front wall
  const FL = 0.7, WT = 3.6, FOUND = 0.25; // floor, wall top, foundation band top
  const ZR = (ZB + ZF) / 2, P1 = Math.tan(28 * Math.PI / 180), P2 = Math.tan(12 * Math.PI / 180);
  const ridgeY = WT + (ZF - ZR) * P1;   // ridge at wall-plane height (underside line)
  const L = 0.15, T = 0.14;            // roof lift above plate, thickness
  const ZPE = 4.8;                     // porch roof eave
  const ZD = 4.6;                      // front edge of porch deck
  const len = XE - XW, dep = ZF - ZB;

  // ---- foundation + walls
  k.box(conc, len + 0.04, FOUND, dep + 0.04, (XW + XE) / 2, FOUND / 2, (ZB + ZF) / 2, { faces: { ny: false, py: false } });
  k.box(siding, len, WT - FOUND, dep, (XW + XE) / 2, (WT + FOUND) / 2, (ZB + ZF) / 2, { faces: { ny: false, py: false } });
  for (const [x, s] of [[XW, -1], [XE, 1]]) // gable triangles in siding
    k.poly(siding, [V(x, WT, ZB), V(x, WT, ZF), V(x, ridgeY, ZR)], null, V(s, 0, 0));
  if (hi) for (const x of [XW, XE]) for (const z of [ZB, ZF]) // corner boards
    k.box(red, 0.12, WT - FOUND, 0.12, x, (WT + FOUND) / 2, z, { faces: { py: false, ny: false } });

  // ---- roof: main (back slope + front slope) breaking to the flatter porch roof
  const yt = (z) => z <= ZR ? WT + L + (z - ZB) * P1 : (z <= ZF ? WT + L + (ZF - z) * P1 : WT + L - (z - ZF) * P2);
  const prof = [[ZB - 0.5, yt(ZB - 0.5)], [ZR, yt(ZR)], [ZF, yt(ZF)], [ZPE, yt(ZPE)]];
  k.roof(prof, XW - 0.5, XE + 0.5, T, shingle, soffit, red, { ridgeCap: mat('cap', 0x5e4a3e, { rough: 0.95 }) });
  if (hi) k.box(flash, len + 1.0, 0.03, 0.14, (XW + XE) / 2, yt(ZF) + 0.01, ZF, { faces: { ny: false } }); // pitch-break flashing

  // ---- decks: porch deck + the deck along the NE end (one level), both sitting low on short red posts over
  // soil beds strewn with cobbles (360 photo) - no solid skirt, just a red rim board under the deck edge.
  const XS0 = -2.0, XS1 = 2.55;        // stair opening (two flights either side of the middle post)
  const XW2 = 9.0, ZBK = -7.0, ZC = 1.7; // NE deck outer edge, back edge (wraps to the back-door landing), and the corner its rail angles back from to the porch (all solved from the 360)
  const RIM = 0.24, HB = 0.2, RUN = 1.3; // rim board depth; soil bed height at the deck edge and run out to grade
  const rimY = FL - 0.06 - RIM / 2, rimB = FL - 0.06 - RIM;
  k.box(deck, len, 0.12, ZD - ZF, (XW + XE) / 2, FL - 0.06, (ZF + ZD) / 2, { faces: { ny: false } });
  k.poly(deck, [V(XE, FL, ZD), V(XW2, FL, ZC), V(XW2, FL, ZBK), V(XE, FL, ZBK)], null, V(0, 1, 0));
  k.box(deck, 1.4, 0.12, 0.6, XE - 0.7, FL - 0.06, ZB - 0.3, { faces: { ny: false } }); // landing at the back door
  k.box(red, XE - XW + 0.08, RIM, 0.05, (XW + XE) / 2, rimY, ZD + 0.02, { faces: { ny: false } });            // front rim
  k.quad(red, V(XE, FL - 0.06, ZD + 0.02), V(XW2 + 0.02, FL - 0.06, ZC), V(XW2 + 0.02, rimB, ZC), V(XE, rimB, ZD + 0.02), null, V(0.54, 0, 0.84));   // the angled rim
  k.box(red, 0.05, RIM, ZD - ZF, XW - 0.02, rimY, (ZF + ZD) / 2, { faces: { ny: false } });                   // SW end rim
  k.box(red, 0.05, RIM, ZC - ZBK + 0.04, XW2 + 0.02, rimY, (ZC + ZBK) / 2, { faces: { ny: false } });         // NE outer rim
  k.box(red, XW2 - XE + 1.4, RIM, 0.05, (XW2 + XE - 1.4) / 2, rimY, ZBK - 0.02, { faces: { ny: false } });    // back rim
  // shaded soil under the decks, soil beds sloping out from the deck edges, cobbles
  k.poly(soilD, [V(XW, HB, ZF), V(XE, HB, ZF), V(XE, HB, ZD), V(XW, HB, ZD)], null, V(0, 1, 0));
  k.poly(soilD, [V(XE - 1.4, HB, ZBK), V(XW2, HB, ZBK), V(XW2, HB, ZC), V(XE, HB, ZD), V(XE, HB, ZB), V(XE - 1.4, HB, ZB)], null, V(0, 1, 0));
  const beds = [ // [start, end, outward] along the deck edge
    [V(XW, 0, ZD), V(XS0 - 0.15, 0, ZD), V(0, 0, 1)], [V(XS1 + 0.15, 0, ZD), V(XE, 0, ZD), V(0, 0, 1)],
    [V(XW, 0, ZF - 0.3), V(XW, 0, ZD), V(-1, 0, 0)],   // (the NE side is the garden bed, addSetting)
  ];
  const rc = rnd(31);
  for (const [a, b, o] of beds) {
    k.quad(soil, V(a.x, HB, a.z), V(b.x, HB, b.z), V(b.x + o.x * RUN, 0, b.z + o.z * RUN), V(a.x + o.x * RUN, 0, a.z + o.z * RUN), null, V(o.x, 1, o.z));
    if (!hi) continue;
    const L = a.distanceTo(b), n = Math.round(L / 0.45);
    for (let i = 0; i < n; i++) { // cobbles on the slope, thicker toward the toe
      const t = rc(), d = RUN * (0.25 + 0.85 * Math.sqrt(rc())), s = 0.1 + rc() * 0.14;
      const x = a.x + (b.x - a.x) * t + o.x * d, z = a.z + (b.z - a.z) * t + o.z * d;
      k.box(cobble, s, s * 0.55, s * 0.8, x, Math.max(0, HB * (1 - d / RUN)) + s * 0.18, z, { ry: rc() * 3, faces: { ny: false } });
    }
  }
  for (const [p, o1, o2] of [[V(XW, 0, ZD), V(0, 0, 1), V(-1, 0, 0)]]) // bed corners
    k.poly(soil, [V(p.x, HB, p.z), V(p.x + o1.x * RUN, 0, p.z + o1.z * RUN), V(p.x + o2.x * RUN, 0, p.z + o2.z * RUN)], null, V(0, 1, 0));
  for (const [p, o, s] of [[V(XS0 - 0.15, 0, ZD), V(0, 0, 1), V(1, 0, 0)], [V(XS1 + 0.15, 0, ZD), V(0, 0, 1), V(-1, 0, 0)],
    [V(XW, 0, ZF - 0.3), V(-1, 0, 0), V(0, 0, -1)]]) // bed ends
    k.poly(soil, [V(p.x, 0, p.z), V(p.x, HB, p.z), V(p.x + o.x * RUN, 0, p.z + o.z * RUN)], null, s);
  if (hi) { // short posts under the deck edges, visible in the gap between rim board and soil
    const up = (x, z) => k.box(red, 0.09, rimB - HB + 0.02, 0.09, x, (rimB + HB) / 2, z, { faces: { py: false, ny: false } });
    for (let x = XW + 0.1; x < XE; x += 1.75) if (x < XS0 - 0.2 || x > XS1 + 0.2) up(x, ZD - 0.08);
    up(XW2 - 0.08, ZC - 0.08);
    for (let z = ZC - 1.85; z > ZBK; z -= 1.75) up(XW2 - 0.08, z);
    up(XW2 - 0.08, ZBK + 0.08); up(XW + 0.08, (ZF + ZD) / 2);
  }
  const posts = []; for (let i = 0; i < 6; i++) posts.push(XW + 0.15 + i * (len - 0.3) / 5);
  const ZP = ZD - 0.15, beamTop = yt(ZP) - T - 0.02, beamBot = beamTop - 0.2;
  for (const x of posts) k.box(red, 0.15, beamBot - FL, 0.15, x, (FL + beamBot) / 2, ZP, { faces: { ny: false, py: false } });
  k.box(red, len + 0.3, beamTop - beamBot, 0.16, (XW + XE) / 2, (beamTop + beamBot) / 2, ZP);
  if (hi) {
    for (const x of posts) for (const s of [-1, 1]) {
      if ((x === posts[0] && s < 0) || (x === posts[5] && s > 0)) continue;
      k.stick(red, V(x + s * 0.07, beamBot - 0.55, ZP), V(x + s * 0.62, beamBot, ZP), 0.09);
    }
    // gable-end porch beams back to the wall (open ends) + end braces
    for (const x of [posts[0], posts[5]]) k.box(red, 0.14, 0.18, ZP - ZF, x, beamBot + 0.09, (ZF + ZP) / 2, { faces: { ny: red } });
  }
  // railings: top + mid rail, front (except the stairs) and the SW end
  const railY = [FL + 0.95, FL + 0.45];
  // the top rail is a wide flat cap board in the photos; dy = rise along a sloping run (the ramp)
  const cap = (a, b) => { const d = V(b.x - a.x, 0, b.z - a.z).normalize(), n = V(-d.z, 0, d.x).multiplyScalar(0.07), up = V(0, 1, 0), c = [V().copy(a).add(n), V().copy(b).add(n), V().copy(b).sub(n), V().copy(a).sub(n)];
    k.poly(red, c, null, up); for (const [p, q, s] of [[c[0], c[1], n], [c[2], c[3], n.clone().negate()]]) k.quad(red, p, q, V(q.x, q.y - 0.05, q.z), V(p.x, p.y - 0.05, p.z), null, s); };
  const rail = (a, b) => { for (const y of railY) k.stick(red, V(a.x, y, a.z), V(b.x, y, b.z), hi ? 0.07 : 0.09); if (hi) cap(V(a.x, railY[0] + 0.05, a.z), V(b.x, railY[0] + 0.05, b.z)); };
  rail(V(posts[0], 0, ZP), V(XS0, 0, ZP)); rail(V(XS1, 0, ZP), V(posts[5], 0, ZP));
  rail(V(posts[0], 0, ZP), V(posts[0], 0, ZF));
  if (hi) for (const x of [-5.0, -3.6]) k.stick(red, V(x, FL, ZP), V(x, FL + 0.95, ZP), 0.08); // a few balusters
  // double stair: 3 risers of FL/3, treads 0.3, red stringers + 3 handrails
  const nR = 3, rh = FL / nR;
  for (let i = 0; i < nR; i++) {
    const z0 = ZD + i * 0.3, y = FL - (i + 1) * rh;
    k.box(stairM, XS1 - XS0, rh, 0.32, (XS0 + XS1) / 2, y + rh / 2, z0 + 0.16, { faces: { ny: false } });
  }
  k.box(conc, XS1 - XS0 + 0.4, 0.08, 0.6, (XS0 + XS1) / 2, 0.04, ZD + nR * 0.3 + 0.25, { faces: { ny: false } });
  const zEnd = ZD + nR * 0.3;
  for (const x of [XS0, (XS0 + XS1) / 2 - 0.15, XS1]) {
    k.stick(red, V(x, FL + 0.95, ZP), V(x, 0.9, zEnd), hi ? 0.07 : 0.09);
    if (hi) { k.stick(red, V(x, 0, zEnd), V(x, 0.95, zEnd), 0.08); k.stick(red, V(x, FL, ZD), V(x, 0, zEnd), 0.06); }
  }

  // ---- NE deck railing (front end, outer edge with the ramp opening, back) + rubber mats at the ramp head
  const RZ = -2.85, RW = 0.62;         // ramp centre line (z, solved from the 360) and half-width to the rail centres
  const xr = XW2 - 0.05, zr = ZBK + 0.05;
  rail(V(posts[5], 0, ZP), V(xr, 0, ZC));
  rail(V(xr, 0, ZC), V(xr, 0, RZ + RW)); rail(V(xr, 0, RZ - RW), V(xr, 0, zr));
  rail(V(xr, 0, zr), V(XE - 0.5, 0, zr));
  for (const z of [ZC, RZ + RW, RZ - RW, -5.2, zr]) k.stick(red, V(xr, rimB, z), V(xr, FL + 1.0, z), 0.1);
  if (hi) { for (const [x, z] of [[(posts[5] + xr) / 2, (ZP + ZC) / 2], [XE + 0.4, zr]]) k.stick(red, V(x, rimB, z), V(x, FL + 1.0, z), 0.1);
    k.box(conc, 0.34, 0.2, 0.34, xr, 0.1, -5.2, { faces: { ny: false } }); }   // the concrete foot under the corner post in the photo
  k.box(stairM, 0.9, FL / 2, 0.6, XE - 1.0, FL / 4, ZB - 0.9, { faces: { ny: false } }); // back steps
  if (hi) { k.box(matM, 0.85, 0.015, 1.2, XW2 - 0.6, FL + 0.008, RZ); k.box(matM, 0.85, 0.015, 1.1, XW2 - 0.6, FL + 0.008, -4.6); }

  // ---- access ramp (the "platform" onto the deck, 360 photo): grey boards laid across, red posts + two rails each
  // side, running straight out from the NE deck's outer edge to the ground. Short and steep: 3.5 m (solved from the 360;
  // it was 6.5 m and looked huge, Mike 10-31, frame 1272); three posts a side.
  const RL = 3.5, RX1 = XW2 + RL, RY1 = 0.06, rz0 = RZ - 0.56, rz1 = RZ + 0.56;
  const rY = (x) => FL + (RY1 - FL) * (x - XW2) / RL;
  k.quad(rampM, V(XW2, FL, rz0), V(RX1, RY1, rz0), V(RX1, RY1, rz1), V(XW2, FL, rz1), null, V(0, 1, 0));
  for (const z of [rz0, rz1]) // side stringers
    k.quad(rampE, V(XW2, FL + 0.02, z), V(RX1, RY1 + 0.02, z), V(RX1, RY1 - 0.18, z), V(XW2, FL - 0.18, z), null, V(0, 0, Math.sign(z - RZ)));
  k.quad(rampE, V(RX1, RY1, rz0), V(RX1, RY1, rz1), V(RX1, 0, rz1), V(RX1, 0, rz0), null, V(1, 0, 0));
  for (const s of [-1, 1]) {
    const z = RZ + s * RW;
    for (let i = 0; i <= 2; i++) { const x = XW2 + 0.08 + (RL - 0.16) * i / 2; k.stick(red, V(x, rY(x) - 0.2, z), V(x, rY(x) + 1.0, z), hi ? 0.09 : 0.1); }
    for (const dy of hi ? [0.95, 0.45] : [0.95]) k.stick(red, V(XW2, FL + dy, z), V(RX1 - 0.05, rY(RX1 - 0.05) + dy, z), hi ? 0.07 : 0.09);
    if (hi) cap(V(XW2, FL + 1.0, z), V(RX1 - 0.05, rY(RX1 - 0.05) + 1.0, z));
  }

  // ---- front wall: ice/vending box, two white doors, notice boards, small high windows, white panel
  const zf = ZF + 0.02;
  k.box(white, 0.75, 1.75, 0.6, -6.3, FL + 0.875, ZF + 0.32, { faces: { ny: false } });
  k.decal(doorW, 0.9, 2.05, -4.3, FL + 1.025, zf);
  k.decal(doorW, 0.9, 2.05, 2.0, FL + 1.025, zf);
  k.decal(white, 0.6, 2.05, 3.25, FL + 1.025, zf);
  k.decal(boards, 1.9, 0.95, -2.2, FL + 1.35, zf);
  k.decal(boards, 1.1, 0.8, 0.5, FL + 1.35, zf);
  k.decal(win, 0.7, 0.45, -2.5, FL + 2.35, zf); k.decal(win, 0.7, 0.45, -1.2, FL + 2.35, zf); k.decal(win, 0.7, 0.45, 0.6, FL + 2.35, zf);
  // ---- SW gable end: two tall narrow windows near the front, round vent at the peak
  k.decal(win, 0.4, 1.0, XW - 0.02, FL + 1.6, 0.3, -Math.PI / 2);
  k.decal(win, 0.4, 1.0, XW - 0.02, FL + 1.6, 1.1, -Math.PI / 2);
  k.decal(vent, 0.5, 0.5, XW - 0.03, ridgeY - 0.65, ZR, -Math.PI / 2);
  // NE gable end (360 photo): one wide window right of centre, a small upright window high in the gable, two small signs
  k.decal(winWide, 1.55, 0.7, XE + 0.02, 2.62, -3.57, Math.PI / 2);
  k.decal(winGable, 0.4, 0.6, XE + 0.03, WT + 0.75, ZR + 0.25, Math.PI / 2);
  if (hi) for (const z of [1.75, -1.68, -5.2]) k.decal(white, 0.24, 0.3, XE + 0.02, 2.62, z, Math.PI / 2);
  // ---- back wall (faces -Z): four small square windows, two taller windows, back door near the NE end, ICE sign
  const zb = ZB - 0.02;
  for (const x of [4.2, 3.2, 2.0, 0.8]) k.decal(win, 0.55, 0.55, x, 2.8, zb, Math.PI);
  for (const x of [-2.3, -4.2]) k.decal(win, 0.7, 1.05, x, 2.6, zb, Math.PI);
  k.decal(doorW, 0.9, 2.05, 4.9, FL + 1.025, zb, Math.PI);
  if (hi) k.decal(white, 0.45, 0.32, -2.4, 1.55, zb, Math.PI);
  // ---- roof: stove pipe near the SW end, plumbing vents behind the ridge
  k.cyl(black, 0.09, 0.9, -6.3, yt(ZR + 0.8) - 0.05, ZR + 0.8, hi ? 8 : 5);
  if (hi) for (const x of [-1.5, 1.0, 2.6]) k.cyl(black, 0.045, 0.32, x, yt(ZR - 0.6) - 0.03, ZR - 0.6, 6);
  return { k };
}

// ================================================================= FIELD SHOWER HOUSE
// local: +X = NW (pod end, the pod door faces +X under its gable), -X = SE (pavilion), +Z = NE.
// Read off the drone ortho (data/ortho.webp): two green gable roofs in a row, ridges both along X (~NNW-SSE),
// roof centres ~3.3 m NW and ~3.7 m SE of the placement point, the pavilion ~0.6 m further NE.
// Photos: the pod's door wall is a LONG wall under the gable (door near the NE corner, a recessed service alcove
// behind a white lattice, then a small two-pane window); the short NE/SW ends are plain panels; the roof sits on
// a cedar beam frame on the pod (rafter tails under the eaves, a post in the alcove), ~0.75 m overhang at the back.
function buildField(hi) {
  const k = new Kit();
  const metal = mat('metal', 0xffffff, { map: metalTex(), tile: [0.9, 1], rough: 0.78, metal: 0 });
  const trimG = mat('gable', 0x1d6a54, { rough: 0.5, metal: 0.1 });            // rake / fascia flashing, ridge cap
  const sheet = mat('gablesheet', 0xffffff, { map: gableSheetTex(), tile: [0.92, 1], rough: 0.55 });
  const timber = mat('timber', 0xffffff, { map: timberTex(), tile: [1, 1] });
  const panel = mat('poly', 0xffffff, { map: polyTex(), tile: [1.2, 2.4], rough: 0.4 });
  const white = mat('white', 0xf3f3f0, { rough: 0.55 });
  const steel = mat('steeldoor', 0xffffff, { map: steelDoorTex(), rough: 0.4 });
  const win = mat('window', 0xffffff, { map: podWindowTex(), rough: 0.3 });
  const dark = mat('alcove', 0x2e3130, { rough: 0.9 });
  const box = mat('grey', 0xdcddd9, { rough: 0.6 });
  const deck = mat('deck', 0xffffff, { map: deckTex(), tile: [0.8, 0.8] });
  const rim = mat('rim', 0x6b5437, { rough: 0.9 });
  const lattice = mat('lattice', 0xffffff, { map: latticeTex(), alphaTest: 0.5, side: THREE.DoubleSide });
  const table = mat('table', 0x8a6e4e, { rough: 0.9 });
  const iron = mat('iron', 0x1f1f1f, { rough: 0.5, metal: 0.4 });
  const T = 0.06; // roof sheet + purlin thickness

  // gable roof with its ridge along X at z = zc; eave half-width hz, eave top ye, pitch tangent tn
  const gableRoof = (x0, x1, zc, hz, ye, tn) => {
    const ridge = ye + hz * tn;
    k.roof([[zc - hz, ye], [zc, ridge], [zc + hz, ye]], x0, x1, T, metal, timber, trimG, { tileU: 0.9, tileV: 1, dd: 0.05, ridgeCap: trimG });
    return ridge;
  };
  // green sheathed gable at x (outward normal sign s), from the beam top yb up under the roof sheet
  const gableEnd = (x, s, zc, half, yb, tn, ridge) => {
    const top = ridge - T - 0.02, h = Math.min(half, (top - yb) / tn), yu = top - h * tn;
    const pts = yu - yb > 0.02
      ? [V(x, yb, zc - h), V(x, yb, zc + h), V(x, yu, zc + h), V(x, top, zc), V(x, yu, zc - h)]
      : [V(x, yb, zc - h), V(x, yb, zc + h), V(x, top, zc)];
    k.poly(sheet, pts, null, V(s, 0, 0));
    if (hi) k.poly(sheet, pts.map(p => V(p.x - s * 0.01, p.y, p.z)), null, V(-s, 0, 0)); // inside face
  };
  // exposed rafters under the roof sheet, every ~0.6 m between x0 and x1
  const rafters = (x0, x1, zc, hz, ye, ridge) => {
    const n = Math.max(2, Math.round((x1 - x0) / 0.6));
    for (let i = 0; i <= n; i++) {
      const x = x0 + (x1 - x0) * i / n;
      for (const s of [-1, 1]) k.stick(timber, V(x, ridge - T - 0.05, zc), V(x, ye - T - 0.05, zc + s * (hz - 0.04)), 0.06);
    }
  };

  // ---- shower pod (+X end): 2.4 (X) x 3.6 (Z) m, door wall facing +X
  const PX0 = 2.4, PX1 = 4.8, ZC = -0.15, PZ = 1.8, PB = 0.16, PH = 2.45;
  const Zp = ZC + PZ, Zm = ZC - PZ;                // NE end (door side) and SW end (window side)
  const AD = 0.55, A0 = Zp - 1.1, A1 = A0 - 0.85;  // service alcove: depth, NE edge, SW edge
  const DZc = Zp - 0.525, WZc = (A1 + Zm) / 2;     // door and window centres
  k.box(white, PX1 - PX0 + 0.06, PB - 0.05, 2 * PZ + 0.06, (PX0 + PX1) / 2, 0.05 + (PB - 0.05) / 2, ZC, { faces: { ny: false } }); // white skid
  k.box(dark, PX1 - PX0 - 0.1, 0.05, 2 * PZ - 0.1, (PX0 + PX1) / 2, 0.025, ZC, { faces: { ny: false, py: false } });               // blocking under it
  k.box(panel, PX1 - AD - PX0, PH - PB, 2 * PZ, (PX0 + PX1 - AD) / 2, (PH + PB) / 2, ZC, { faces: { ny: false } });
  for (const [za, zb] of [[A0, Zp], [Zm, A1]])
    k.box(panel, AD, PH - PB, zb - za, PX1 - AD / 2, (PH + PB) / 2, (za + zb) / 2, { faces: { ny: false, nx: false } });
  // white aluminium trim: corners, alcove edges, top + bottom channels
  const vt = (x, z) => k.box(white, 0.06, PH - PB, 0.06, x, (PH + PB) / 2, z, { faces: { py: false, ny: false } });
  for (const [x, z] of [[PX0, Zp], [PX0, Zm], [PX1, Zp], [PX1, Zm], [PX1, A0], [PX1, A1]]) vt(x, z);
  k.box(white, PX1 - PX0 + 0.07, 0.08, 2 * PZ + 0.07, (PX0 + PX1) / 2, PH - 0.04, ZC);
  if (hi) {
    k.box(white, PX1 - PX0 + 0.07, 0.07, 2 * PZ + 0.07, (PX0 + PX1) / 2, PB + 0.035, ZC, { faces: { ny: false } });
    vt(PX0 - 0.005, ZC); vt(PX1 - AD, A0 - 0.03); vt(PX1 - AD, A1 + 0.03);
  }
  k.decal(steel, 0.85, 2.15, PX1 + 0.035, PB + 0.06 + 1.075, DZc, Math.PI / 2);  // steel door + louvred transom
  k.decal(win, 0.5, 0.9, PX1 + 0.035, 1.75, WZc, Math.PI / 2);                    // small two-pane window
  k.decal(lattice, 1.15, 1.2, PX1 + 0.14, 0.62, A0 - 0.575, Math.PI / 2);         // freestanding lattice screen
  if (hi) {
    const ax = PX1 - AD; // alcove back wall: panel box, meter/heater boxes, conduit, hose bib
    k.box(box, 0.14, 0.48, 0.34, ax + 0.07, 2.0, A0 - 0.3);
    k.box(box, 0.12, 0.3, 0.22, ax + 0.06, 1.45, A1 + 0.2);
    k.stick(white, V(ax + 0.03, 1.76, A0 - 0.22), V(ax + 0.03, 0.6, A0 - 0.22), 0.03);
    k.stick(white, V(ax + 0.03, 1.76, A0 - 0.38), V(ax + 0.03, 0.9, A0 - 0.5), 0.025);
    k.box(trimG, 0.08, 0.08, 0.08, ax + 0.04, 0.85, A1 + 0.25);
    k.box(dark, 0.6, 0.02, 0.9, PX1 + 0.4, 0.01, DZc);                             // rubber mat at the door
  }
  k.box(timber, 0.11, PH + 0.2 - PB, 0.11, PX1 - 0.07, (PH + 0.2 + PB) / 2, A0 - 0.07, { faces: { ny: false } }); // cedar post in the alcove

  // pod roof: cedar beam frame on the pod, ridge along X, 27° pitch
  const tP = Math.tan(27 * Math.PI / 180);
  const RX0 = PX0 - 0.75, RX1 = PX1 + 0.15, RH = PZ + 0.35, BT = PH + 0.2;      // roof plan + beam top
  const yeP = BT + 0.12 + T - (RH - PZ - 0.04) * tP;
  for (const s of [-1, 1]) k.box(timber, RX1 - RX0 - 0.06, 0.2, 0.14, (RX0 + RX1) / 2, BT - 0.1, ZC + s * (PZ + 0.04)); // eave beams
  for (const x of [RX1 - 0.09, RX0 + 0.09]) k.box(timber, 0.14, 0.2, 2 * RH - 0.12, x, BT - 0.1, ZC);                    // gable headers
  const ridgeP = gableRoof(RX0, RX1, ZC, RH, yeP, tP);
  gableEnd(RX1 - 0.03, 1, ZC, RH - 0.06, BT, tP, ridgeP);
  gableEnd(RX0 + 0.03, -1, ZC, RH - 0.06, BT, tP, ridgeP);
  if (hi) rafters(RX0 + 0.15, RX1 - 0.15, ZC, RH, yeP, ridgeP);

  // ---- picnic pavilion (-X end): raised deck, six cedar posts with knee braces, counter rail, 32° green roof
  const QX = -3.7, QZ = 0.45, DX = 2.2, DZ = 1.8, DH = 0.35;
  k.box(deck, 2 * DX, 0.05, 2 * DZ, QX, DH - 0.025, QZ, { faces: { ny: false } });
  k.box(rim, 2 * DX - 0.04, DH - 0.05, 2 * DZ - 0.04, QX, (DH - 0.05) / 2, QZ, { faces: { py: false, ny: false } });
  const pXs = [QX - DX + 0.15, QX, QX + DX - 0.15], pZ = DZ - 0.15, QBT = DH + 2.45; // posts + beam top
  for (const x of pXs) for (const s of [-1, 1]) k.box(timber, 0.15, QBT - DH, 0.15, x, (QBT + DH) / 2, QZ + s * pZ, { faces: { py: false, ny: false } });
  for (const s of [-1, 1]) k.box(timber, 2 * DX + 0.2, 0.24, 0.16, QX, QBT - 0.12, QZ + s * pZ);            // eave beams
  for (const x of hi ? pXs : [pXs[0], pXs[2]]) k.box(timber, 0.12, 0.2, 2 * pZ + 0.16, x, QBT - 0.1, QZ);  // tie beams
  const tQ = Math.tan(32 * Math.PI / 180), QH = DZ + 0.5, QX0 = QX - DX - 0.45, QX1 = QX + DX + 0.45;
  const yeQ = QBT + 0.12 + T - (QH - pZ) * tQ;
  const ridgeQ = gableRoof(QX0, QX1, QZ, QH, yeQ, tQ);
  gableEnd(pXs[2] + 0.07, 1, QZ, pZ + 0.08, QBT, tQ, ridgeQ);
  gableEnd(pXs[0] - 0.07, -1, QZ, pZ + 0.08, QBT, tQ, ridgeQ);
  if (hi) {
    rafters(QX0 + 0.2, QX1 - 0.2, QZ, QH, yeQ, ridgeQ);
    k.box(timber, QX1 - QX0 - 0.2, 0.2, 0.12, QX, ridgeQ - T - 0.16, QZ);                                   // ridge beam
    for (const x of pXs) for (const s of [-1, 1]) {                                                        // knee braces
      const z = QZ + s * pZ, y0 = QBT - 0.24 - 0.62, y1 = QBT - 0.24;
      for (const d of [-1, 1]) if (!((x === pXs[0] && d < 0) || (x === pXs[2] && d > 0)))
        k.stick(timber, V(x + d * 0.07, y0, z), V(x + d * 0.66, y1, z), 0.09);
      k.stick(timber, V(x, y0, z - s * 0.07), V(x, y1, z - s * 0.66), 0.09);
    }
    // counter rail (~0.95 m above the deck) along both long sides and the NW end; the SE end is open with a step
    const yr = DH + 0.95;
    for (const s of [-1, 1]) {
      k.box(timber, 2 * DX - 0.3, 0.05, 0.24, QX, yr, QZ + s * (pZ - 0.02));
      k.box(timber, 2 * DX - 0.3, 0.1, 0.05, QX, yr - 0.08, QZ + s * pZ);
    }
    k.box(timber, 0.24, 0.05, 2 * pZ, pXs[2] - 0.02, yr, QZ);
    k.box(timber, 0.05, 0.1, 2 * pZ, pXs[2], yr - 0.08, QZ);
    k.box(timber, 0.36, 0.18, 1.3, QX - DX - 0.18, 0.09, QZ, { faces: { ny: false } });                     // step
    // wooden picnic table, a cast-iron park bench along the NE rail, a black BBQ in the SE corner
    const tx = QX + 0.35, tz = QZ - 0.35;
    k.box(table, 1.8, 0.05, 0.75, tx, DH + 0.75, tz);
    for (const s of [-1, 1]) {
      k.box(table, 1.8, 0.04, 0.26, tx, DH + 0.45, tz + s * 0.55);
      for (const e of [-1, 1]) k.stick(table, V(tx + e * 0.7, DH, tz + s * 0.75), V(tx + e * 0.7, DH + 0.74, tz + s * 0.12), 0.06);
    }
    const bx = QX + 0.9, bz = QZ + pZ - 0.4;
    k.box(table, 1.5, 0.04, 0.42, bx, DH + 0.45, bz);
    k.box(table, 1.5, 0.3, 0.04, bx, DH + 0.72, bz + 0.2, { rx: -0.15 });
    for (const e of [-1, 1]) k.box(iron, 0.06, 0.8, 0.46, bx + e * 0.72, DH + 0.4, bz + 0.02);
    k.box(iron, 0.65, 0.5, 0.45, QX - 1.5, DH + 0.75, QZ + 1.2);
    k.box(iron, 0.65, 0.05, 0.45, QX - 1.5, DH + 0.35, QZ + 1.2);
    for (const e of [-1, 1]) k.stick(iron, V(QX - 1.5 + e * 0.28, DH, QZ + 1.2), V(QX - 1.5 + e * 0.28, DH + 0.5, QZ + 1.2), 0.04);
  } else {
    k.box(table, 1.8, 0.75, 1.6, QX + 0.35, DH + 0.375, QZ - 0.35, { faces: { ny: false } });
  }
  return { k };
}

// ================================================================= build
// The garden bed along the NE deck, either side of the ramp (shower_360; Mike 10-31, frame 1272: "an actual garden bed"):
// dug dark soil edged with river cobbles (their band sits where the photo's does), planted in loose rows: broad-leaved
// perennials, ornamental grass and flowering clumps. Then the spruce at the deck's back corner and two giants behind the roof.
export function plantGeo(kind) {   // one plant, ~1 m across, as coloured leaf blades that arch out from the crown
  const p = [], c = [], n = [], rn = rnd(kind === 'leafy' ? 11 : kind === 'grass' ? 23 : 37);
  const dark = kind === 'grass' ? [0.17, 0.25, 0.1] : [0.06, 0.15, 0.06], light = kind === 'grass' ? [0.42, 0.47, 0.2] : [0.2, 0.36, 0.13];
  const blades = kind === 'heads' ? 0 : kind === 'leafy' ? 11 : kind === 'grass' ? 46 : 14;
  for (let i = 0; i < blades; i++) {
    const az = i * 2.4 + rn() * 0.5, ca = Math.cos(az), sa = Math.sin(az);
    const L = kind === 'leafy' ? 0.3 + rn() * 0.14 : kind === 'grass' ? 0.2 + rn() * 0.18 : 0.22 + rn() * 0.1;
    const up = kind === 'grass' ? 0.38 + rn() * 0.24 : kind === 'leafy' ? 0.24 + rn() * 0.12 : 0.18, W = kind === 'leafy' ? 0.11 : kind === 'grass' ? 0.01 : 0.05;
    const S = 5; let prev = null;
    for (let j = 0; j <= S; j++) {
      const u = j / S, r = L * u, y = up * (Math.sin(u * 1.75)) * (kind === 'grass' ? 1 : 1), w = W * (kind === 'grass' ? 1 - u : Math.sin(Math.PI * Math.min(u * 1.08 + 0.05, 1)));
      const cx = ca * r, cz = sa * r, l = [cx - sa * w, y, cz + ca * w], m = [cx + sa * w, y, cz - ca * w], col = dark.map((d, q) => d + (light[q] - d) * u);
      if (prev) for (const [v, k] of [[prev[0], prev[2]], [prev[1], prev[2]], [m, col], [prev[0], prev[2]], [m, col], [l, col]]) { p.push(...v); c.push(...k); n.push(ca * 0.25, 0.95, sa * 0.25); }
      prev = [l, m, col];
    }
  }
  if (kind === 'flower' || kind === 'heads') for (let i = 0; i < 7; i++) {   // stems (with the leaves) + daisy heads above them (their own mesh: the instance tints only the petals)
    const az = i * 2.4, r = 0.05 + (i % 3) * 0.1, x = Math.cos(az) * r, z = Math.sin(az) * r, y = 0.36 + (i % 4) * 0.06, g = [0.12, 0.24, 0.09];
    if (kind === 'flower') { for (const [v, k] of [[[x - 0.007, 0.02, z], g], [[x + 0.007, 0.02, z], g], [[x, y, z], g]]) { p.push(...v); c.push(...k); n.push(0, 0.9, 0.4); } continue; }
    for (let a = 0; a < 9; a++) {
      const a0 = a / 9 * 6.283, a1 = (a + 1) / 9 * 6.283, R = 0.05 + (a % 2) * 0.016;
      for (const [v, k] of [[[x, y + 0.012, z], [0.35, 0.24, 0.1]], [[x + Math.cos(a0) * R, y, z + Math.sin(a0) * R], [1, 1, 1]], [[x + Math.cos(a1) * R, y, z + Math.sin(a1) * R], [1, 1, 1]]]) { p.push(...v); c.push(...k); n.push(0, 1, 0); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(n, 3));
  return g;
}
function addSetting(g, hi) {
  const XW2 = 9.0, RZ = -2.85, Z0 = -7.6, Z1 = 2.2, R = 2.45;   // deck's outer edge, ramp line; the bed runs along the deck between Z0..Z1, R out from it
  const edge = (x, z) => Math.hypot(Math.max(x - XW2, 0), Math.max(Z0 - z, 0, z - Z1));   // distance out from the deck's edge
  const onRamp = (x, z, m = 0.72) => x > XW2 - 0.2 && x < XW2 + 3.6 && Math.abs(z - RZ) < m;
  const lump = (x, z) => 0.022 * (Math.sin(x * 7.3 + z * 2.1) + Math.sin(z * 9.1 - x * 3.7)) + 0.012 * Math.sin(x * 23 + z * 19);
  const rise = (x, z) => { const u = Math.min(1, edge(x, z) / R); return 0.14 * (1 - u * u * u * u) + lump(x, z) * (1 - u); };
  const r0 = rnd(77);
  // soil: dark, dug, with clods and a little grit, a touch paler toward the edge
  const soilTex = canvasTex('sh_soil', 512, 512, (x, w, h) => {
    x.fillStyle = '#3d2e23'; x.fillRect(0, 0, w, h); const r = rnd(5);
    for (let i = 0; i < 9000; i++) { const v = r(), s = 1 + r() * 5; x.fillStyle = v < 0.5 ? `rgba(26,18,13,${0.2 + r() * 0.5})` : `rgba(${98 + r() * 30},${78 + r() * 22},${58 + r() * 18},${0.15 + r() * 0.35})`; x.beginPath(); x.ellipse(r() * w, r() * h, s, s * (0.5 + r() * 0.5), r() * 3, 0, 7); x.fill(); }
    for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(${150 + r() * 50},${142 + r() * 45},${128 + r() * 40},.8)`; x.beginPath(); x.arc(r() * w, r() * h, 0.8 + r() * 1.8, 0, 7); x.fill(); }
  });
  const soil = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, map: soilTex }); soil.userData.noSurface = true;
  const x0 = XW2 - 0.4, x1 = XW2 + R + 0.5, z0 = Z0 - R - 0.5, z1 = Z1 + R + 0.5, nx = hi ? 56 : 14, nz = hi ? 240 : 40;
  const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0, nx, nz).rotateX(-Math.PI / 2), P = geo.attributes.position, UV = geo.attributes.uv;
  const C = new Float32Array(P.count * 3), cIn = new THREE.Color(0xffffff), cOut = new THREE.Color(0xd8c9a8), cc = new THREE.Color();
  for (let i = 0; i < P.count; i++) {
    const x = (x0 + x1) / 2 + P.getX(i), z = (z0 + z1) / 2 + P.getZ(i); P.setX(i, x); P.setZ(i, z); UV.setXY(i, x / 2.2, z / 2.2);
    const d = edge(x, z); P.setY(i, d < R + 0.12 ? rise(x, z) : -0.2);
    cc.copy(cIn).lerp(cOut, Math.pow(Math.min(1, d / R), 3)); C.set([cc.r, cc.g, cc.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(C, 3)); geo.computeVertexNormals();
  const bed = new THREE.Mesh(geo, soil); bed.name = 'garden_soil'; g.add(bed);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), col = new THREE.Color(), pos = new THREE.Vector3(), sc = new THREE.Vector3();
  // river cobbles: rounded, mixed sizes and colours, a band two or three stones wide round the bed + along the ramp
  const CC = [0xb9b3a7, 0xd6d0c4, 0x8f8a80, 0xa89a84, 0xe4dfd4, 0x77736b, 0xbfa98c], stones = [];
  for (let i = 0; i < (hi ? 26000 : 3000) && stones.length < (hi ? 900 : 140); i++) {
    const x = x0 + r0() * (x1 - x0), z = z0 + r0() * (z1 - z0), d = edge(x, z), a = R - 0.32 - Math.abs(Math.sin(z * 1.7) * 0.1);
    if (onRamp(x, z, 0.62)) continue;
    const band = Math.abs(d - a) < 0.2 + Math.sin(z * 2.9) * 0.08, byRamp = x > XW2 && x < XW2 + R && Math.abs(Math.abs(z - RZ) - 0.82) < 0.1 && r0() < 0.45;
    if (d <= 0 || !(band || byRamp)) continue;
    stones.push([x, rise(x, z), z, 0.04 + Math.pow(r0(), 2.2) * 0.09]);
  }
  const st = new THREE.InstancedMesh(new THREE.SphereGeometry(1, hi ? 10 : 6, hi ? 7 : 4), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 }), stones.length);
  stones.forEach(([x, y, z, r], i) => { e.set(r0() * 0.5, r0() * 6, r0() * 0.5); q.setFromEuler(e); m4.compose(pos.set(x, y + r * 0.34, z), q, sc.set(r * (0.9 + r0() * 0.5), r * 0.62, r * (0.75 + r0() * 0.3))); st.setMatrixAt(i, m4); st.setColorAt(i, col.set(CC[Math.floor(r0() * CC.length)]).multiplyScalar(1.9)); });
  st.name = 'garden_cobbles'; g.add(st);
  // planting: loose rows parallel to the deck (a gap for the ramp); taller at the back, by the deck
  const rows = [[0.5, 'grass'], [1.05, 'leafy'], [1.58, 'flower']], spots = { grass: [], leafy: [], flower: [] };
  for (const [d, first] of rows) for (let z = Z0 - 0.2; z < Z1 + 0.2; z += 0.68) {
    const zz = z + (r0() - 0.5) * 0.24, xx = XW2 + d + (r0() - 0.5) * 0.2;
    if (onRamp(xx, zz, 1.15) || r0() < 0.12) continue;
    const kind = r0() < 0.68 ? first : ['grass', 'leafy', 'flower'][Math.floor(r0() * 3)];
    spots[kind].push([xx, rise(xx, zz), zz, 0.6 + r0() * 0.42]);
  }
  const FLOWERS = [0xf0c63c, 0xe9e4d6, 0xd9708c, 0xb377c9, 0xe88a3c];
  for (const kind of ['grass', 'leafy', 'flower']) {
    const list = spots[kind]; if (!list.length) continue;
    const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }); mat.userData.noSurface = true;   // unlit, gradient baked in: lit double-sided blades go black underneath
    const inst = new THREE.InstancedMesh(plantGeo(kind), mat, list.length), heads = kind === 'flower' ? new THREE.InstancedMesh(plantGeo('heads'), mat, list.length) : null;
    list.forEach(([x, y, z, k], i) => {
      m4.compose(pos.set(x, y, z), q.setFromEuler(e.set(0, r0() * 6.283, 0)), sc.setScalar(k)); inst.setMatrixAt(i, m4);
      inst.setColorAt(i, col.setScalar(0.85 + r0() * 0.3));
      if (heads) { heads.setMatrixAt(i, m4); heads.setColorAt(i, col.set(FLOWERS[Math.floor(Math.abs(Math.sin(z * 0.8)) * 4.99)])); }   // one colour to a clump, in drifts along the row
    });
    inst.name = 'garden_' + kind; g.add(inst); if (heads) { heads.name = 'garden_flower_heads'; g.add(heads); }
  }
  // spruces: the one behind the deck's back corner, the giants behind the gable, seen in the 360 (the forest keep-out clears the rest)
  const trunk = new THREE.MeshStandardMaterial({ color: 0x3f3226, roughness: 1 }), needles = [0x2c4f33, 0x335a39, 0x28482f].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 1, flatShading: true, side: THREE.DoubleSide }));
  for (const [x, z, H, w, low] of [[8.5, -8.2, 13, 2.6, 0.01], [-9.6, -6.7, 21, 3.4, 0.14], [-11.2, -12.3, 24, 3.6, 0.14]]) {   // (the near one is bushy right to the ground in the photo)
    const t = new THREE.Group(); t.position.set(x, 0, z); g.add(t);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(H * 0.006, H * 0.016, H * 0.5, 6), trunk); c.position.y = H * 0.25; t.add(c);
    const tiers = hi ? 24 : 4;
    for (let i = 0; i < tiers; i++) {
      const k = i / (tiers - 1), r = w * (1 - k * 0.9), h = H * (hi ? 0.1 : 0.27) * (1 - k * 0.35);
      const cg = new THREE.ConeGeometry(r, h, hi ? 16 : 6, 1, hi);
      if (hi) { const cp = cg.attributes.position; for (let v = 0; v < cp.count; v++) if (cp.getY(v) < 0) { const f = 0.62 + 0.38 * ((v + i) % 2), dr = 1 + 0.16 * Math.sin(v * 2.3 + i * 1.7); cp.setXYZ(v, cp.getX(v) * f * dr, cp.getY(v) - (1 - f) * h * 0.5, cp.getZ(v) * f * dr); } cg.computeVertexNormals(); }   // branch tips, not a smooth skirt
      const cone = new THREE.Mesh(cg, needles[i % 3]); cone.position.y = H * low + (H * (0.88 - low)) * k + h / 2 - h * 0.15; cone.rotation.y = i * 0.9; t.add(cone);
    }
  }
}

export function build({ lod = 'high', variant = 'main' } = {}) {
  const hi = lod !== 'low';
  if (variant === 'field') return buildField(hi).k.build('shower_house_field');
  const g = buildMain(hi).k.build('shower_house_main');
  addSetting(g, hi);
  return g;
}

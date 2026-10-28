// Shower houses (Wells Gray Golf & RV Resort). Two very different buildings, one module, variant = 'main' | 'field'.
//  main  - the Main Shower House by the office/RV loop: ~13 x 7.4 m red vertical-channel-sided washroom with a
//          side-gable brown shingle roof (~28°) that breaks to a flatter pitch over a full-length front porch;
//          red 6x6 posts with knee braces, two-rail red railing, double stair in the middle, raised deck on a
//          gravel berm, white doors + notice boards, small high windows at the back, walkway along the NE end.
//  field - the Field Shower House by the lake field: a silver polycarbonate-panel shower pod (white aluminium trim,
//          steel door, white lattice screen) under a green ribbed-metal gable roof on cedar posts, in line with a
//          timber picnic pavilion (cedar posts + knee braces, deck, green metal roof).
// Units metres, origin = ground-level centre of the footprint, +Y up, main entrance faces +Z.
import * as THREE from 'three';

export const meta = {
  name: 'Shower House',
  layer: 'bathroom_shower_house',
  match: [1, 0], // 1 = 'Main Shower House' (L-ish 6-vertex polygon), 0 = 'Field Shower House'
  footprint: [16.0, 12.3], // main (roof + NE walkway + stairs); field: [13.9, 8.3]
  height: 6.3, // main incl. stove pipe; field 3.7
  variants: {
    main: { footprint: [16.0, 12.3], height: 6.3, entrance: 'porch faces SE (bearing ~145°), toward the gravel lot' },
    field: { footprint: [13.9, 8.3], height: 3.7, entrance: 'pod door faces NE; pod at the NW end, pavilion at the SE end' },
  },
  place: [
    { x: -80.52, y: 66.01, rotY: 0.618, variant: 'main' },
    { x: -99.94, y: -138.79, rotY: 2.173, variant: 'field' },
  ],
  sources: [
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/Shower House.jpg, 20210620_172133-EDIT.jpg (main: porch front, stairs, posts, doors, SW gable)',
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/21.jpg, wellsgraygolf20.PNG (main: front 3/4 from S, NE end deck)',
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/20210926_142035.jpg (main: back wall windows, back door, round gable vent)',
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/Shower House in Field.jpg, PXL_20220517_214234191-EDIT.jpg (field, current 2022 layout)',
    'D:/Dropbox/Wells Gray Resort/Photos/Shower Houses/20210621_172427-EDIT.jpg (field, 2021: pod + pavilion detail)',
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

function sidingTex() { // red vertical channel siding, 6 boards per 1.2 m tile
  return canvasTex('sh_siding', 192, 128, (g, w, h) => {
    const r = rnd(3), bw = w / 6;
    for (let i = 0; i < 6; i++) {
      g.fillStyle = rgb(196, 82, 50, 0.93 + r() * 0.1); g.fillRect(i * bw, 0, bw, h);
      g.fillStyle = 'rgba(70,20,10,0.65)'; g.fillRect(i * bw, 0, 3, h);
      g.fillStyle = 'rgba(255,170,130,0.18)'; g.fillRect(i * bw + 3, 0, 2, h);
    }
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
function metalTex() { // green ribbed metal roofing, ribs every 0.3 m (tile 0.9 m)
  return canvasTex('sh_metal', 96, 32, (g, w, h) => {
    g.fillStyle = '#2b7a5c'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 32) {
      g.fillStyle = '#3f9474'; g.fillRect(x, 0, 3, h); g.fillStyle = '#17503b'; g.fillRect(x + 3, 0, 3, h);
      g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(x + 14, 0, 2, h);
    }
  });
}
function polyTex() { // silver twin-wall polycarbonate / aluminium panels (tile 1.2 x 2.4 m)
  return canvasTex('sh_poly', 64, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, '#d9dcdb'); grd.addColorStop(1, '#bcc1c0');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let x = 2; x < w; x += 4) { g.fillStyle = 'rgba(80,90,90,0.10)'; g.fillRect(x, 0, 1, h); }
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
function steelDoorTex() {
  return canvasTex('sh_steel', 64, 150, (g, w, h) => {
    g.fillStyle = '#f1f2f0'; g.fillRect(0, 0, w, h); g.fillStyle = '#7b7f7c'; g.fillRect(5, 22, w - 10, h - 26);
    g.fillStyle = '#d6d8d6'; g.fillRect(8, 3, w - 16, 16);
    for (let y = 5; y < 18; y += 3) { g.fillStyle = '#8c908d'; g.fillRect(9, y, w - 18, 1); }
    g.fillStyle = '#c9c9c4'; g.fillRect(48, 80, 6, 10);
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
function latticeTex() {
  return canvasTex('sh_lattice', 64, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.strokeStyle = '#f4f4f2'; g.lineWidth = 5;
    for (let i = -w; i < 2 * w; i += 16) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke();
      g.beginPath(); g.moveTo(i, h); g.lineTo(i + h, 0); g.stroke();
    }
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
  const red = mat('redtrim', 0xb24a2b, { rough: 0.8 });
  const shingle = mat('shingle', 0xffffff, { map: shingleTex(), tile: [2, 1.4], rough: 0.95 });
  const soffit = mat('soffit', 0xffffff, { map: soffitTex(), tile: [0.6, 0.6] });
  const conc = mat('concrete', 0x9a9890, { rough: 1 });
  const gravel = mat('gravel', 0x85807a, { rough: 1 });
  const deck = mat('deck', 0xffffff, { map: deckTex(), tile: [0.8, 0.8] });
  const stairM = mat('stairs', 0x6f6a64, { rough: 0.9 });
  const doorW = mat('doorW', 0xffffff, { map: doorTex('sh_doorw', '#f3f2ec', '#e2e0d8'), rough: 0.5 });
  const win = mat('window', 0xffffff, { map: windowTex(), rough: 0.35 });
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

  // ---- porch deck, skirt, gravel berm, posts, beam, braces, railings, stairs
  const XS0 = -2.0, XS1 = 2.55;        // stair opening (two flights either side of the middle post)
  k.box(deck, len, 0.12, ZD - ZF, (XW + XE) / 2, FL - 0.06, (ZF + ZD) / 2, { faces: { ny: false } });
  k.box(siding, len, FL - 0.12, 0.04, (XW + XE) / 2, (FL - 0.12) / 2, ZD - 0.02, { faces: { ny: false, py: false, nz: false } });
  k.box(siding, 0.04, FL - 0.12, ZD - ZF, XW + 0.02, (FL - 0.12) / 2, (ZF + ZD) / 2, { faces: { ny: false, py: false, px: false } });
  k.box(red, len + 0.06, 0.16, 0.05, (XW + XE) / 2, FL - 0.1, ZD + 0.01, { faces: { ny: false } }); // deck fascia
  // gravel berms in front of the skirt (the photos show rock piled against it)
  for (const [a, b] of [[XW - 0.6, XS0 - 0.1], [XS1 + 0.1, XE + 0.3]]) {
    const h = FL - 0.15, o = 1.3;
    k.quad(gravel, V(a, h, ZD + 0.03), V(b, h, ZD + 0.03), V(b, 0, ZD + o), V(a, 0, ZD + o), null, V(0, 1, 1));
    for (const [x, s] of [[a, -1], [b, 1]]) k.poly(gravel, [V(x, 0, ZD), V(x, h, ZD + 0.03), V(x, 0, ZD + o)], null, V(s, 0, 0));
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
  const rail = (a, b) => { for (const y of railY) k.stick(red, V(a.x, y, a.z), V(b.x, y, b.z), hi ? 0.07 : 0.09); };
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

  // ---- NE walkway: deck along the NE end from the porch to a back landing, with railing
  const XW2 = XE + 2.0;
  k.box(deck, XW2 - XE, 0.12, ZD - (ZB - 0.6), (XE + XW2) / 2, FL - 0.06, (ZD + ZB - 0.6) / 2, { faces: { ny: false } });
  k.box(siding, 0.04, FL - 0.12, ZD - (ZB - 0.6), XW2 - 0.02, (FL - 0.12) / 2, (ZD + ZB - 0.6) / 2, { faces: { ny: false, py: false, nx: false } });
  k.box(deck, 1.4, 0.12, 0.6, XE - 0.7, FL - 0.06, ZB - 0.3, { faces: { ny: false } }); // landing at the back door
  rail(V(XW2 - 0.05, 0, ZD - 0.1), V(XW2 - 0.05, 0, ZB - 0.55));
  rail(V(XW2 - 0.05, 0, ZB - 0.55), V(XE - 1.4, 0, ZB - 0.55));
  rail(V(XE + 0.05, 0, ZD - 0.1), V(XW2 - 0.05, 0, ZD - 0.1));
  if (hi) for (const z of [ZD - 0.1, 0, -3, ZB - 0.55]) k.stick(red, V(XW2 - 0.05, 0, z), V(XW2 - 0.05, FL + 1.0, z), 0.1);
  k.box(stairM, 0.9, FL / 2, 0.6, XE - 1.0, FL / 4, ZB - 0.9, { faces: { ny: false } }); // back steps

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
  // NE gable end: small window high near the back
  k.decal(win, 0.6, 0.42, XE + 0.02, 2.9, -4.2, Math.PI / 2);
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
// local: +X = NW (pod end), -X = SE (pavilion), +Z = NE (pod door side)
function buildField(hi) {
  const k = new Kit();
  const metal = mat('metal', 0xffffff, { map: metalTex(), tile: [0.9, 1], rough: 0.6, metal: 0.15 });
  const gableM = mat('gable', 0x1f5f48, { rough: 0.5, metal: 0.3 });
  const under = mat('under', 0xffffff, { map: timberTex(), tile: [1, 1] });
  const timber = mat('timber', 0xffffff, { map: timberTex(), tile: [1, 1] });
  const poly = mat('poly', 0xffffff, { map: polyTex(), tile: [1.2, 2.4], rough: 0.45, metal: 0.2 });
  const white = mat('white', 0xf1f1ee, { rough: 0.6 });
  const steel = mat('steeldoor', 0xffffff, { map: steelDoorTex(), rough: 0.5, metal: 0.2 });
  const win = mat('window', 0xffffff, { map: windowTex(), rough: 0.35 });
  const dark = mat('alcove', 0x3a3d3e, { rough: 0.9 });
  const grey = mat('grey', 0x9a9d9c, { rough: 0.6 });
  const deck = mat('deck', 0xffffff, { map: deckTex(), tile: [0.8, 0.8] });
  const lattice = mat('lattice', 0xffffff, { map: latticeTex(), alphaTest: 0.5, side: THREE.DoubleSide });
  const table = mat('table', 0x7d6b55, { rough: 0.9 });
  const pitch = Math.tan(22 * Math.PI / 180);

  // gable roof on posts helper: x0..x1 along ridge, half-depth hz, eave height ye (top surface)
  const shelter = (x0, x1, hz, ye, postXs, postZ, postBase, withPosts = true) => {
    const ridge = ye + hz * pitch;
    k.roof([[-hz, ye], [0, ridge], [hz, ye]], x0, x1, 0.08, metal, under, gableM, { tileU: 0.9, tileV: 1, dd: 0.04, ridgeCap: gableM });
    for (const [x, s] of [[x0, -1], [x1, 1]]) // sheathed green gable triangles, set in 0.25 m
      k.poly(gableM, [V(x + -s * 0.25, ye - 0.12, -hz + 0.35), V(x - s * 0.25, ye - 0.12, hz - 0.35), V(x - s * 0.25, ridge - 0.12, 0)], null, V(s, 0, 0));
    const beamY = ye - 0.08 - 0.12;
    for (const z of [-postZ, postZ]) k.box(timber, x1 - x0 - 0.3, 0.2, 0.12, (x0 + x1) / 2, beamY - 0.1 + 0.1, z);
    for (const x of postXs) {
      if (withPosts) for (const z of [-postZ, postZ]) k.box(timber, 0.13, beamY - 0.1 - postBase, 0.13, x, (beamY - 0.1 + postBase) / 2, z, { faces: { py: false, ny: false } });
      if (hi) k.box(timber, 0.1, 0.16, 2 * postZ, x, beamY + 0.02, 0); // tie beams
    }
    if (hi) k.box(timber, x1 - x0 - 0.3, 0.14, 0.1, (x0 + x1) / 2, ridge - 0.25, 0); // ridge beam
    return { ridge, beamY };
  };

  // ---- shower pod (+X end)
  const PX0 = 2.6, PX1 = 5.6, PZ = 1.2, PB = 0.15, PH = 2.45; // body extents, skid, top
  k.box(white, PX1 - PX0 + 0.1, PB, 2 * PZ + 0.1, (PX0 + PX1) / 2, PB / 2, 0, { faces: { ny: false } });
  const AX = 4.9, AZ = 0.6;   // alcove at the +X/+Z corner (0.7 wide, 0.6 deep)
  k.box(poly, AX - PX0, PH - PB, 2 * PZ, (PX0 + AX) / 2, (PH + PB) / 2, 0, { faces: { ny: false } });
  k.box(poly, PX1 - AX, PH - PB, PZ + AZ, (AX + PX1) / 2, (PH + PB) / 2, (AZ - PZ) / 2, { faces: { ny: false } });
  k.box(dark, PX1 - AX, PH - PB, 0.02, (AX + PX1) / 2, (PH + PB) / 2, AZ + 0.011, { faces: { ny: false, py: false } }); // alcove back
  k.box(white, PX1 - AX, 0.06, PZ - AZ, (AX + PX1) / 2, PH - 0.03, (AZ + PZ) / 2); // alcove header
  // white aluminium trim: corners, panel joints, top/bottom channels
  const vt = (x, z) => k.box(white, 0.07, PH - PB, 0.07, x, (PH + PB) / 2, z, { faces: { py: false, ny: false } });
  for (const [x, z] of [[PX0, PZ], [PX0, -PZ], [PX1, -PZ], [PX1, AZ], [AX, PZ], [AX, AZ]]) vt(x, z);
  if (hi) {
    for (const x of [3.4, 4.15]) { vt(x, PZ + 0.005); vt(x, -PZ - 0.005); }
    vt(PX1 + 0.005, -0.3); vt(PX0 - 0.005, 0);
    k.box(white, PX1 - PX0 + 0.08, 0.07, 2 * PZ + 0.08, (PX0 + PX1) / 2, PH - 0.03, 0, { faces: { ny: false } });
    k.box(white, PX1 - PX0 + 0.08, 0.08, 2 * PZ + 0.08, (PX0 + PX1) / 2, PB + 0.04, 0, { faces: { ny: false, py: false } });
  }
  k.decal(steel, 0.82, 2.15, 3.9, PB + 1.1, PZ + 0.02);                 // door + louvred transom (NE side)
  k.decal(win, 0.42, 0.55, PX1 + 0.02, 1.85, -0.5, Math.PI / 2);         // small window, NW gable end
  k.decal(lattice, PX1 - AX + 0.1, 1.15, (AX + PX1) / 2, PB + 0.6, PZ - 0.02); // lattice screen in front of alcove
  if (hi) {
    k.box(grey, 0.3, 0.4, 0.12, AX + 0.3, 1.9, AZ + 0.08);   // electrical / water heater boxes in the alcove
    k.box(grey, 0.2, 0.25, 0.1, AX + 0.12, 1.5, AZ + 0.07);
    k.box(dark, 0.9, 0.02, 0.6, 3.9, 0.01, PZ + 0.45);      // rubber mat at the door
  }
  // roof frame sits on the pod (no posts visible in the 2022 photos): beams on the pod top, ~0.5 m overhangs
  shelter(2.1, 6.1, 1.65, 2.82, [PX0 + 0.1, (PX0 + PX1) / 2, PX1 - 0.1], PZ - 0.06, 0, false);

  // ---- picnic pavilion (-X end): deck, cedar frame with knee braces, counter rail, tables
  const DX0 = -6.0, DX1 = -1.6, DZ = 1.8, DH = 0.3;
  k.box(deck, DX1 - DX0, DH, 2 * DZ, (DX0 + DX1) / 2, DH / 2, 0, { faces: { ny: false } });
  const pXs = [DX0 + 0.15, (DX0 + DX1) / 2, DX1 - 0.15], pZ = DZ - 0.15;
  const { beamY } = shelter(DX0 - 0.45, DX1 + 0.45, 2.2, 2.85, pXs, pZ, DH);
  if (hi) {
    for (const x of pXs) for (const z of [-pZ, pZ]) {
      for (const s of [-1, 1]) if (!((x === pXs[0] && s < 0) || (x === pXs[2] && s > 0)))
        k.stick(timber, V(x + s * 0.06, beamY - 0.75, z), V(x + s * 0.6, beamY - 0.12, z), 0.09);
      k.stick(timber, V(x, beamY - 0.75, z - Math.sign(z) * 0.06), V(x, beamY - 0.12, z - Math.sign(z) * 0.6), 0.09);
    }
    // counter rail along the SW side and ends at ~1.05 m above the deck
    k.box(timber, DX1 - DX0 - 0.3, 0.05, 0.25, (DX0 + DX1) / 2, DH + 1.05, -pZ);
    for (const x of [pXs[0], pXs[2]]) k.box(timber, 0.25, 0.05, pZ * 2, x, DH + 1.05, 0);
    // two picnic tables + a BBQ
    for (const x of [-4.8, -2.8]) {
      k.box(table, 0.8, 0.05, 1.8, x, DH + 0.75, 0.1);
      for (const s of [-1, 1]) k.box(table, 0.28, 0.04, 1.8, x + s * 0.55, DH + 0.45, 0.1);
      for (const s of [-1, 1]) k.box(table, 0.06, 0.72, 0.06, x, DH + 0.37, 0.1 + s * 0.75);
    }
    k.box(mat('bbq', 0x262626, { rough: 0.5, metal: 0.5 }), 0.6, 1.0, 0.5, -3.8, DH + 0.5, -1.25);
  } else {
    for (const x of [-4.8, -2.8]) k.box(table, 1.4, 0.75, 1.8, x, DH + 0.375, 0.1, { faces: { ny: false } });
  }
  return { k };
}

// ================================================================= build
export function build({ lod = 'high', variant = 'main' } = {}) {
  const hi = lod !== 'low';
  if (variant === 'field') return buildField(hi).k.build('shower_house_field');
  return buildMain(hi).k.build('shower_house_main');
}

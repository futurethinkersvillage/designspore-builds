// Rental Bunk Cabins (Wells Gray Golf & RV Resort): three identical 14 x 16 ft sheds in a row on the field
// between the Sauna and the Dome. Painted red-orange plywood panel walls (horizontal panel joint at mid-height,
// vertical joints + corner boards), a steep ~35° front-gable roof in brown asphalt shingles with red bargeboards
// and ~0.45 m overhangs, natural-pine board-and-batten gables with two red louvred vents each, a white 6-panel
// door centred in the front gable, one white slider window high in the back wall, on concrete blocks, wood step.
// Units metres, origin = ground-level centre of the wall footprint, +Y up, door faces +Z.
import * as THREE from 'three';

export const meta = {
  name: 'Bunk Cabin',
  layer: 'accomodations_for_rent',
  match: [4, 3, 2], // the row of three ~4.5 x 5 m polygons running NE -> SW toward the Dome (feature 5)
  footprint: [4.3, 4.9], // walls; roof overhangs make it 5.2 x 5.7
  height: 4.35,
  // door gable faces SE (bearing ~138°), toward the open field; ridge runs NW-SE, cabins stand side by side
  place: [
    { x: -101.80, y: -78.09, rotY: 0.713, variant: 'a' },
    { x: -116.81, y: -100.16, rotY: 0.736, variant: 'b' },
    { x: -138.49, y: -126.98, rotY: 0.712, variant: 'c' },
  ],
  sources: [
    'D:/Dropbox/Wells Gray Resort/Photos/Cabins/01.jpg (front elevation: door, panel joints, gable vents, blocks, step)',
    'D:/Dropbox/Wells Gray Resort/Photos/Cabins/02.jpg + Cabin.jpg (back: slider window, gable lamp box, eaves)',
    'D:/Dropbox/Wells Gray Resort/Photos/Cabins/05.jpg (front 3/4, side wall joints, overhangs)',
    'D:/Dropbox/Wells Gray Resort/Photos/Cabins/DJI_0280.JPG (drone: row of three toward the Dome, roof colour)',
    'D:/Dropbox/Wells Gray Resort/Photos/Cabins/3 cabins.jpg, Cabins.jpg (row layout, doors all facing the field)',
    'data/layers.json accomodations_for_rent features 4, 3, 2',
  ],
  notes: 'See models/notes/bunk_cabin.md. The three cabins look identical in every photo; variant is accepted ' +
    "('a' | 'b' | 'c') but only changes nothing structural (kept for the placement contract).",
};

// ---------------------------------------------------------------- dimensions
const W = 4.3, D = 4.9;          // wall footprint (X across the gable, Z along the ridge)
const Y0 = 0.22;                 // underside of the cabin (sits on concrete blocks)
const H = 2.62;                  // top of walls
const PITCH = Math.tan(35 * Math.PI / 180);
const OV_E = 0.45, OV_R = 0.4;   // eave / rake overhang
const RT = 0.14;                 // roof thickness (vertical)
const LIFT = 0.15;               // roof top surface above wall top at the wall line

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

function paintTex() { // painted plywood: flat colour with faint mottling (tile 2.4 m)
  return canvasTex('bc_paint', 128, 128, (g, w, h) => {
    const r = rnd(11); g.fillStyle = '#cc5a34'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '90,30,15' : '230,120,80'},0.05)`; g.fillRect(r() * w, r() * h, 2 + r() * 8, 1 + r() * 3); }
  });
}
function pineTex() { // natural pine board-and-batten, boards ~0.15 m (tile 1.2 m)
  return canvasTex('bc_pine', 256, 128, (g, w, h) => {
    const r = rnd(5), bw = w / 8; // warm tan pine
    for (let i = 0; i < 8; i++) {
      const v = 0.86 + r() * 0.2; g.fillStyle = rgb(222, 182, 124, v); g.fillRect(i * bw, 0, bw, h);
      for (let k = 0; k < 6; k++) { g.fillStyle = 'rgba(120,80,40,0.18)'; g.fillRect(i * bw + r() * bw, 0, 1, h); }
      if (r() < 0.5) { g.fillStyle = 'rgba(95,60,30,0.5)'; g.beginPath(); g.ellipse(i * bw + bw / 2, r() * h, 2, 3, 0, 0, 7); g.fill(); }
    }
    for (let i = 0; i < 8; i++) { // battens
      g.fillStyle = 'rgba(70,45,22,0.55)'; g.fillRect(i * bw - 1, 0, 2, h);
      g.fillStyle = rgb(196, 152, 98); g.fillRect(i * bw + 1, 0, 5, h);
      g.fillStyle = 'rgba(60,38,18,0.45)'; g.fillRect(i * bw + 6, 0, 2, h);
    }
  });
}
function shingleTex() { // brown laminated asphalt shingles (tile 2.0 x 1.4 m, 10 courses)
  return canvasTex('bc_shingle', 256, 256, (g, w, h) => {
    const r = rnd(7); g.fillStyle = '#6a5446'; g.fillRect(0, 0, w, h);
    const rows = 10, rh = h / rows;
    for (let i = 0; i < rows; i++) {
      let x = -(i % 2) * 20 - r() * 10;
      while (x < w) {
        const tw = 14 + r() * 26, v = 0.82 + r() * 0.3;
        g.fillStyle = rgb(122, 98, 80, v); g.fillRect(x + 1, i * rh + 1, tw - 2, rh - 2);
        x += tw;
      }
      g.fillStyle = 'rgba(35,25,18,0.6)'; g.fillRect(0, i * rh + rh - 3, w, 3);
    }
  });
}
function soffitTex() {
  return canvasTex('bc_soffit', 64, 64, (g, w, h) => {
    const r = rnd(9);
    for (let x = 0; x < w; x += 8) { g.fillStyle = rgb(176, 136, 88, 0.85 + r() * 0.2); g.fillRect(x, 0, 8, h); g.fillStyle = 'rgba(60,40,20,0.4)'; g.fillRect(x, 0, 1, h); }
  });
}
function doorTex() { // white steel 6-panel door
  return canvasTex('bc_door', 64, 152, (g, w, h) => {
    g.fillStyle = '#eef0ee'; g.fillRect(0, 0, w, h);
    const panel = (x, y, pw, ph) => {
      g.fillStyle = '#d9dcda'; g.fillRect(x, y, pw, ph);
      g.fillStyle = '#ffffff'; g.fillRect(x + 2, y + 2, pw - 4, ph - 4);
      g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(x, y + ph - 2, pw, 2); g.fillRect(x + pw - 2, y, 2, ph);
    };
    panel(8, 8, 21, 34); panel(35, 8, 21, 34);
    panel(8, 50, 21, 44); panel(35, 50, 21, 44);
    panel(8, 102, 21, 42); panel(35, 102, 21, 42);
    g.fillStyle = '#5a5a5a'; g.beginPath(); g.arc(54, 80, 2.6, 0, 7); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 0, 1, h); g.fillRect(w - 1, 0, 1, h);
  });
}
function louverTex() { // red louvred gable vent
  return canvasTex('bc_louver', 64, 96, (g, w, h) => {
    g.fillStyle = '#a5432a'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#8b3620'; g.fillRect(6, 6, w - 12, h - 12);
    for (let y = 9; y < h - 8; y += 7) { g.fillStyle = '#b8502f'; g.fillRect(7, y, w - 14, 4); g.fillStyle = 'rgba(40,10,5,0.6)'; g.fillRect(7, y + 4, w - 14, 2); }
  });
}
function windowTex() { // white vinyl horizontal slider
  return canvasTex('bc_window', 128, 96, (g, w, h) => {
    g.fillStyle = '#f2f3f1'; g.fillRect(0, 0, w, h);
    const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, '#5d6b72'); grd.addColorStop(0.5, '#28323a'); grd.addColorStop(1, '#3c4850');
    g.fillStyle = grd; g.fillRect(9, 9, w / 2 - 12, h - 18); g.fillRect(w / 2 + 3, 9, w / 2 - 12, h - 18);
    g.fillStyle = 'rgba(220,235,245,0.25)'; g.beginPath(); g.moveTo(12, h - 12); g.lineTo(40, 12); g.lineTo(52, 12); g.lineTo(24, h - 12); g.fill();
  });
}

// ---------------------------------------------------------------- mesh kit: collect triangles per material, merge
class Kit {
  constructor() { this.b = new Map(); }
  _buf(mat) { let o = this.b.get(mat); if (!o) { o = { p: [], n: [], uv: [] }; this.b.set(mat, o); } return o; }
  // planar polygon (convex, CCW seen from outside); uv: array of [u,v] or null -> projected (metres / tile)
  poly(mat, pts, uv = null, want = null) {
    let n = new THREE.Vector3().subVectors(pts[1], pts[0]).cross(new THREE.Vector3().subVectors(pts[2], pts[0])).normalize();
    if (want && n.dot(want) < 0) { pts = pts.slice().reverse(); if (uv) uv = uv.slice().reverse(); n.negate(); }
    const o = this._buf(mat);
    const tile = mat.userData.tile || [1, 1];
    const U = uv || pts.map(p => {
      if (Math.abs(n.y) > 0.75) return [p.x / tile[0], p.z / tile[1]];
      if (Math.abs(n.x) > Math.abs(n.z)) return [p.z / tile[0], p.y / tile[1]];
      return [p.x / tile[0], p.y / tile[1]];
    });
    for (let i = 1; i < pts.length - 1; i++) for (const k of [0, i, i + 1]) {
      o.p.push(pts[k].x, pts[k].y, pts[k].z); o.n.push(n.x, n.y, n.z); o.uv.push(U[k][0], U[k][1]);
    }
  }
  quad(mat, a, b, c, d, uv) { this.poly(mat, [a, b, c, d], uv); }
  // axis box (optionally rotated about Y by ry around its centre); faces: {px,nx,py,ny,pz,nz} material or false
  box(mat, sx, sy, sz, x, y, z, { ry = 0, faces = {}, rx = 0 } = {}) {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, 0)), new THREE.Vector3(1, 1, 1));
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
  // textured rectangle facing +Z (or rotated about Y by ry) at centre (x,y,z), uv 0..1
  decal(mat, w, h, x, y, z, ry = 0) {
    const c = Math.cos(ry), s = Math.sin(ry), hw = w / 2, hh = h / 2;
    const P = (u, v) => new THREE.Vector3(x + u * c, y + v, z - u * s);
    this.quad(mat, P(-hw, -hh), P(hw, -hh), P(hw, hh), P(-hw, hh), [[0, 0], [1, 0], [1, 1], [0, 1]]);
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
function mat(name, color, { map = null, tile = [1, 1], rough = 0.85, metal = 0, side = THREE.FrontSide } = {}) {
  const m = new THREE.MeshStandardMaterial({ name, color, map, roughness: rough, metalness: metal, side });
  m.userData.tile = tile; return m;
}

// ---------------------------------------------------------------- build
export function build({ lod = 'high', variant = 'a' } = {}) {
  const hi = lod !== 'low';
  const k = new Kit();
  const paint = mat('paint', 0xffffff, { map: paintTex(), tile: [2.4, 2.4] });
  const trim = mat('trim', 0xb44c2c, { rough: 0.8 });
  const pine = mat('pine', 0xffffff, { map: pineTex(), tile: [1.2, 0.6] });
  const shingle = mat('shingle', 0xffffff, { map: shingleTex(), tile: [2.0, 1.4], rough: 0.95 });
  const soffit = mat('soffit', 0xffffff, { map: soffitTex(), tile: [0.6, 0.6] });
  const door = mat('door', 0xffffff, { map: doorTex(), rough: 0.5 });
  const louver = mat('louver', 0xffffff, { map: louverTex() });
  const glass = mat('window', 0xffffff, { map: windowTex(), rough: 0.35 });
  const block = mat('block', 0x9d9a94, { rough: 1 });
  const deck = mat('step', 0x8a7a66, { rough: 0.95 });
  const dark = mat('dark', 0x2c2420, { rough: 0.9 });

  const hw = W / 2, hd = D / 2;
  // ---- concrete blocks (corners + mid-sides) and the wall box
  if (hi) for (const [bx, bz] of [[-1, -1], [1, -1], [-1, 1], [1, 1], [-1, 0], [1, 0]])
    k.box(block, 0.4, Y0, 0.2, bx * (hw - 0.22), Y0 / 2, bz * (hd - 0.12), { faces: { ny: false } });
  else k.box(block, W - 0.3, Y0, D - 0.3, 0, Y0 / 2, 0, { faces: { ny: false } });
  k.box(paint, W, H - Y0, D, 0, (Y0 + H) / 2, 0, { faces: { py: false, ny: hi ? paint : false } });

  // ---- gable triangles (natural pine), front and back
  const apex = H + hw * PITCH;
  k.poly(pine, [V(-hw, H, hd), V(hw, H, hd), V(0, apex, hd)]);
  k.poly(pine, [V(hw, H, -hd), V(-hw, H, -hd), V(0, apex, -hd)]);
  if (hi) { // red band between painted wall and pine gable, both ends
    k.box(trim, W + 0.04, 0.1, 0.035, 0, H + 0.02, hd + 0.012);
    k.box(trim, W + 0.04, 0.1, 0.035, 0, H + 0.02, -hd - 0.012);
  }

  // ---- roof: two slabs, shingle top, pine soffit underneath, red bargeboard/fascia edges
  const xe = hw + OV_E, ze = hd + OV_R;
  const yTop = (x) => H + LIFT + (hw - Math.abs(x)) * PITCH;
  const ridgeTop = yTop(0), eaveTop = yTop(xe);
  const slopeLen = Math.hypot(xe, ridgeTop - eaveTop);
  for (const s of [1, -1]) {
    const t0 = V(0, ridgeTop, ze), t1 = V(0, ridgeTop, -ze), t2 = V(s * xe, eaveTop, -ze), t3 = V(s * xe, eaveTop, ze);
    const b = (p) => V(p.x, p.y - RT, p.z);
    const top = s > 0 ? [t0, t3, t2, t1] : [t1, t2, t3, t0];
    const uvT = s > 0 ? [[ze / 2, slopeLen / 1.4], [ze / 2, 0], [-ze / 2, 0], [-ze / 2, slopeLen / 1.4]]
      : [[-ze / 2, slopeLen / 1.4], [-ze / 2, 0], [ze / 2, 0], [ze / 2, slopeLen / 1.4]];
    k.quad(shingle, ...top, uvT.map(([u, v]) => [u, v]));
    const bot = s > 0 ? [b(t1), b(t2), b(t3), b(t0)] : [b(t0), b(t3), b(t2), b(t1)];
    k.quad(soffit, ...bot, [[0, 0], [slopeLen / 0.6, 0], [slopeLen / 0.6, 2 * ze / 0.6], [0, 2 * ze / 0.6]]);
    // eave fascia
    k.quad(trim, ...(s > 0 ? [b(t3), b(t2), t2, t3] : [b(t2), b(t3), t3, t2]));
    // rake bargeboards (front and back), a bit deeper than the slab
    const dd = 0.08;
    const fr = [V(0, ridgeTop - RT - dd, ze), V(s * xe, eaveTop - RT - dd, ze), V(s * xe, eaveTop, ze), V(0, ridgeTop, ze)];
    k.quad(trim, ...(s > 0 ? fr : [fr[1], fr[0], fr[3], fr[2]]));
    const bk = fr.map(p => V(p.x, p.y, -ze));
    k.quad(trim, ...(s > 0 ? [bk[1], bk[0], bk[3], bk[2]] : bk));
    if (hi) { // underside strip of the bargeboard
      const down = V(0, -1, 0);
      k.poly(trim, [V(0, ridgeTop - RT - dd, ze - 0.04), V(s * xe, eaveTop - RT - dd, ze - 0.04), V(s * xe, eaveTop - RT - dd, ze), V(0, ridgeTop - RT - dd, ze)], null, down);
      k.poly(trim, [V(0, ridgeTop - RT - dd, -ze), V(s * xe, eaveTop - RT - dd, -ze), V(s * xe, eaveTop - RT - dd, -ze + 0.04), V(0, ridgeTop - RT - dd, -ze + 0.04)], null, down);
    }
  }
  // ridge cap
  k.box(mat('cap', 0x6a5446, { rough: 0.95 }), 0.24, 0.05, 2 * ze + 0.02, 0, ridgeTop + 0.005, 0, { faces: { ny: false } });

  // ---- front gable end: door, step, vents
  k.decal(door, 0.86, 2.03, 0, Y0 + 0.06 + 1.015, hd + 0.03);
  k.decal(louver, 0.4, 0.6, -0.5, H + 0.6, hd + 0.01);
  k.decal(louver, 0.4, 0.6, 0.5, H + 0.6, hd + 0.01);
  k.box(deck, 1.0, 0.13, 0.6, 0, 0.065, hd + 0.36, { faces: { ny: false } });
  // ---- back: slider window high in the wall, vents, small lamp box at the peak
  k.decal(glass, 1.1, 0.8, 0, 2.03, -hd - 0.02, Math.PI);
  k.decal(louver, 0.4, 0.6, 0.5, H + 0.6, -hd - 0.01, Math.PI);
  k.decal(louver, 0.4, 0.6, -0.5, H + 0.6, -hd - 0.01, Math.PI);

  if (hi) {
    // panel joints / trim boards on the painted walls (proud 2 cm)
    const jy = 1.46;                                    // horizontal joint all round (8 ft sheet + rim)
    k.box(trim, W + 0.05, 0.05, 0.03, 0, jy, hd + 0.012, { faces: { ny: false } });
    k.box(trim, W + 0.05, 0.05, 0.03, 0, jy, -hd - 0.012, { faces: { ny: false } });
    k.box(trim, 0.03, 0.05, D + 0.05, hw + 0.012, jy, 0, { faces: { ny: false } });
    k.box(trim, 0.03, 0.05, D + 0.05, -hw - 0.012, jy, 0, { faces: { ny: false } });
    const vy = (Y0 + H) / 2, vh = H - Y0;
    for (const sx of [-1, 1]) {                         // corner boards
      k.box(trim, 0.09, vh, 0.03, sx * (hw - 0.03), vy, hd + 0.014, { faces: { py: false, ny: false } });
      k.box(trim, 0.09, vh, 0.03, sx * (hw - 0.03), vy, -hd - 0.014, { faces: { py: false, ny: false } });
      k.box(trim, 0.03, vh, 0.09, sx * (hw + 0.014), vy, hd - 0.03, { faces: { py: false, ny: false } });
      k.box(trim, 0.03, vh, 0.09, sx * (hw + 0.014), vy, -hd + 0.03, { faces: { py: false, ny: false } });
      k.box(trim, 0.03, vh, 0.05, sx * (hw + 0.012), vy, 0, { faces: { py: false, ny: false } }); // side mid joint
      k.box(trim, 0.05, vh, 0.03, sx * 0.47, vy, hd + 0.012, { faces: { py: false, ny: false } }); // door-side joints
    }
    k.box(trim, 0.05, jy - Y0, 0.03, 0, (Y0 + jy) / 2, -hd - 0.012, { faces: { py: false, ny: false } }); // back lower joint
    // white window trim + sill on the back, threshold under the door
    k.box(mat('white', 0xeeeeea, { rough: 0.6 }), 1.2, 0.05, 0.06, 0, 1.6, -hd - 0.03);
    k.box(dark, 0.9, 0.05, 0.05, 0, Y0 + 0.04, hd + 0.02);
    // lamp box at the back gable peak
    k.box(dark, 0.3, 0.4, 0.14, 0, H + 0.86, -hd - 0.07);
    k.box(mat('lamp', 0xf3e7c4, { rough: 0.4 }), 0.12, 0.16, 0.02, 0, H + 0.86, -hd - 0.15);
    // exposed rafter tails under the side eaves
    for (const sx of [-1, 1]) for (let i = 0; i < 5; i++) {
      const z = -hd + 0.25 + i * (D - 0.5) / 4, x = sx * (hw + OV_E / 2 - 0.02);
      k.box(soffit, OV_E - 0.06, 0.1, 0.05, x, yTop(x) - RT - 0.05, z, { faces: { py: false } });
    }
    // grey service box low on the right side wall near the back corner
    k.box(mat('grey', 0x8d8f8e, { rough: 0.6 }), 0.04, 0.16, 0.12, hw + 0.03, 0.62, -hd + 0.5);
  }
  const g = k.build('bunk_cabin');
  g.userData.variant = variant;
  return g;
}

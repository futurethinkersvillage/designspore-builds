// Bottom House — the older lived-in house in the middle of the property (west of the golf fairways, at the fork of the
// farm road), with the RV lean-to and outhouse ~30 m NNE of it. Rebuilt 2026-10-29 from close drone obliques
// (D:/Maps/Golf Course, 2025-09-14 orbit). One storey + loft, SIDE-GABLED with the ridge along the long NE–SW axis and an
// ASYMMETRIC roof: a short steep slope over the SE (driveway / parking) wall and a long shallower slope that carries on
// over a full-length recessed porch on the NW side (porch on square posts, raised deck, no railing). Orange stained
// board-and-batten, white window trim, mottled tan-brown laminate shingles with two box vents and an electrical mast,
// satellite dish + propane tank + meter on the SW gable, and a small metal shed-roofed lean-to on the NE gable end.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  name: 'Bottom House',
  layer: 'utility_buildings',
  match: 'Bottom House', // utility_buildings feature Name = "Bottom House" (quad 10.4 × 7.6 m, long axis NE–SW)
  footprint: [11.3, 9.2], // roof incl. gable overhangs + NE lean-to × SE eave → NW porch fascia
  height: 6.7,
  place: { x: -234.94, y: 20.2, rotY: 0.9146 }, // polygon centroid; +z = the SE eave wall facing the driveway / parked cars (bearing ~128°)
  sources: [
    'D:/Maps/Golf Course/DJI_20250914102333_0282_D.JPG (+0275–0287: SE eave wall straight on: 3 windows, sign, vents, mast, NE lean-to)',
    'D:/Maps/Golf Course/DJI_20250914102518_0302_D.JPG (+0290–0310: SW gable: asymmetric roof, NW porch, dish, propane tank, meter)',
    'D:/Maps/Golf Course/DJI_20250828124738_0253_D.JPG (60 m oblique: house south of the RV lean-to + outhouse, cars on the SE side)',
    'Drone Shots/wellsgraygolf6.PNG (old oblique aerial: orange gable among the trees, brown roof)',
    'landmap drone tiles z20 (brown roof, ridge NE–SW, parking SE)',
  ],
  notes: 'See models/notes/bottom_house.md. The Photos/Cottage folder is the Top House, not this one.',
};

// ---------------------------------------------------------------- shared helpers
const texCache = {};
function canvasTex(key, w, h, draw, rep = 1) {
  if (!texCache[key]) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
    t.repeat.set(1 / rep, 1 / rep); texCache[key] = t;
  }
  return texCache[key];
}
function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
// board-and-batten, 1.2 m tile, battens every 0.3 m
function battenTex(key, base) {
  return canvasTex(key, 128, 128, (g, w, h) => {
    const r = rnd(11); g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 4) { g.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,220,190'},${0.025 + r() * 0.03})`; g.fillRect(x, 0, 4, h); }
    for (let x = 0; x < w; x += 32) {
      g.fillStyle = 'rgba(255,215,180,0.20)'; g.fillRect(x, 0, 4, h);
      g.fillStyle = 'rgba(40,10,0,0.30)'; g.fillRect(x + 4, 0, 2, h);
    }
  }, 1.2);
}
// asphalt shingles, 1 m tile, 8 courses
function shingleTex(key, rgb, vr = 0.26) {
  return canvasTex(key, 128, 128, (g, w, h) => {
    const r = rnd(5); g.fillStyle = `rgb(${rgb})`; g.fillRect(0, 0, w, h);
    const rows = 8, rh = h / rows, [R, G, B] = rgb.split(',').map(Number);
    for (let i = 0; i < rows; i++) {
      const off = (i % 2) * 8;
      for (let x = -off; x < w; x += 16) {
        const v = 1 - vr / 2 + r() * vr;
        g.fillStyle = `rgb(${Math.round(R * v)},${Math.round(G * v)},${Math.round(B * v)})`; g.fillRect(x + 1, i * rh + 1, 15, rh - 1);
      }
      g.fillStyle = 'rgba(25,18,12,0.5)'; g.fillRect(0, i * rh + rh - 2, w, 2);
    }
  }, 1);
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
class Parts {
  constructor() { this.m = new Map(); }
  add(key, geo) { if (!this.m.has(key)) this.m.set(key, []); this.m.get(key).push(geo.index ? geo.toNonIndexed() : geo); }
  build(mats) {
    const g = new THREE.Group();
    for (const [k, list] of this.m) {
      list.forEach(x => { if (!x.attributes.uv) x.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(x.attributes.position.count * 2), 2)); });
      const mesh = new THREE.Mesh(mergeGeometries(list, false), mats[k]); mesh.name = k; g.add(mesh);
    }
    return g;
  }
}
// planar polygon: origin o, in-plane axes eu, ev (normal = eu × ev), 2D points in metres (uv = metres)
function poly(o, eu, ev, pts) {
  let area = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; area += a[0] * b[1] - b[0] * a[1]; }
  const P = area < 0 ? pts.slice().reverse() : pts;
  const tris = THREE.ShapeUtils.triangulateShape(P.map(p => new THREE.Vector2(p[0], p[1])), []);
  const pos = [], uv = [];
  for (const t of tris) for (const i of t) {
    const [u, v] = P[i]; const p = o.clone().addScaledVector(eu, u).addScaledVector(ev, v);
    pos.push(p.x, p.y, p.z); uv.push(u, v);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals(); return geo;
}
// planar quad from 4 corners (counter-clockwise seen from the front face); uv in metres
function quad(a, b, c, d) {
  const eu = b.clone().sub(a).normalize(), n = b.clone().sub(a).cross(d.clone().sub(a)).normalize(), ev = n.clone().cross(eu);
  const p2 = p => { const q = p.clone().sub(a); return [q.dot(eu), q.dot(ev)]; };
  return poly(a, eu, ev, [a, b, c, d].map(p2));
}
// thin slab from 4 top corners (CCW from above): top, underside (offset down by t), and four edge faces
function slab(parts, a, b, c, d, t, topK, botK, edgeK) {
  const dn = V(0, -t, 0), A = a.clone().add(dn), B = b.clone().add(dn), C = c.clone().add(dn), D = d.clone().add(dn);
  parts.add(topK, quad(a, b, c, d)); parts.add(botK, quad(A, D, C, B));
  parts.add(edgeK, quad(A, B, b, a)); parts.add(edgeK, quad(B, C, c, b)); parts.add(edgeK, quad(C, D, d, c)); parts.add(edgeK, quad(D, A, a, d));
}
// box with its own basis: size [along eu, along up, along en]
function obox(parts, k, center, size, eu = V(1, 0, 0), en = V(0, 0, 1), up = UP) {
  const g = new THREE.BoxGeometry(size[0], size[1], size[2]);
  g.applyMatrix4(new THREE.Matrix4().makeBasis(eu, up, en).setPosition(center)); parts.add(k, g);
}
function box(parts, k, x0, x1, y0, y1, z0, z1) { obox(parts, k, V((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), [x1 - x0, y1 - y0, z1 - z0]); }
// a wall frame: origin on the wall plane, horizontal axis eu, outward normal en
const wallFrame = (o, eu, en) => ({ o, eu, en });
const onWall = (f, u, v, out = 0) => f.o.clone().addScaledVector(f.eu, u).addScaledVector(UP, v).addScaledVector(f.en, out);
// window: dark glass + white trim (+ optional sill); hi=false → glass only
function windowOn(parts, f, u, v0, w, h, hi, opt = {}) {
  const trim = opt.trim || 'trim', tw = 0.09;
  const g = quad(onWall(f, u - w / 2, v0, 0.03), onWall(f, u + w / 2, v0, 0.03), onWall(f, u + w / 2, v0 + h, 0.03), onWall(f, u - w / 2, v0 + h, 0.03));
  parts.add('glass', g);
  if (!hi) return;
  obox(parts, trim, onWall(f, u, v0 + h + tw / 2, 0.04), [w + 2 * tw, tw, 0.06], f.eu, f.en);
  obox(parts, trim, onWall(f, u, v0 - tw / 2, 0.05), [w + 2 * tw + 0.06, tw, 0.09], f.eu, f.en);
  obox(parts, trim, onWall(f, u - w / 2 - tw / 2, v0 + h / 2, 0.04), [tw, h, 0.06], f.eu, f.en);
  obox(parts, trim, onWall(f, u + w / 2 + tw / 2, v0 + h / 2, 0.04), [tw, h, 0.06], f.eu, f.en);
  if (opt.mullion) obox(parts, trim, onWall(f, u, v0 + h * opt.mullion, 0.04), [w, 0.05, 0.05], f.eu, f.en);
  if (opt.vm) obox(parts, trim, onWall(f, u, v0 + h / 2, 0.04), [0.06, h, 0.05], f.eu, f.en); // vertical mullion (slider)
}
function doorOn(parts, f, u, v0, w, h, hi, lite = true) {
  obox(parts, 'door', onWall(f, u, v0 + h / 2, 0.03), [w, h, 0.05], f.eu, f.en);
  if (!hi) return;
  if (lite) parts.add('glass', quad(onWall(f, u - 0.22, v0 + h * 0.55, 0.06), onWall(f, u + 0.22, v0 + h * 0.55, 0.06), onWall(f, u + 0.22, v0 + h * 0.9, 0.06), onWall(f, u - 0.22, v0 + h * 0.9, 0.06)));
  obox(parts, 'trim', onWall(f, u, v0 + h + 0.05, 0.04), [w + 0.2, 0.1, 0.06], f.eu, f.en);
  obox(parts, 'trim', onWall(f, u - w / 2 - 0.05, v0 + h / 2, 0.04), [0.1, h, 0.06], f.eu, f.en);
  obox(parts, 'trim', onWall(f, u + w / 2 + 0.05, v0 + h / 2, 0.04), [0.1, h, 0.06], f.eu, f.en);
}
// simple railing along a straight run (top rail, bottom rail, balusters)
function railing(parts, k, a, b, y0, hgt, n) {
  const d = b.clone().sub(a), L = d.length(), eu = d.normalize(), en = UP.clone().cross(eu).negate();
  const mid = a.clone().add(b).multiplyScalar(0.5);
  obox(parts, k, mid.clone().setY(y0 + hgt), [L, 0.07, 0.12], eu, en);
  obox(parts, k, mid.clone().setY(y0 + 0.12), [L, 0.06, 0.06], eu, en);
  for (let i = 0; i <= n; i++) {
    const p = a.clone().addScaledVector(eu, (L * i) / n); const s = i === 0 || i === n ? 0.1 : 0.045;
    obox(parts, k, p.setY(y0 + hgt / 2), [s, hgt, s], eu, en);
  }
}

// ---------------------------------------------------------------- the house
// Local frame: x along the ridge / long axis (NE = +x), z = SE (+, driveway side) / NW (-, porch side), y up. Ground = 0.
const X0 = -5.4, X1 = 4.2, W = X1 - X0;            // body 9.6 m long
const XA = X1 + 1.2;                               // NE lean-to (metal shed roof)
const ZF = 4.3, ZN = -2.5, D = ZF - ZN;            // SE eave wall, NW wall (under the porch roof): body 6.8 m deep
                                                   // (Mike 10-29: wider than the first rebuild — the SW gable in DJI_..0302 is
                                                   // much wider than the porch; this also makes room for the NE door)
const ZP = -4.22, ZE = -4.5;                       // porch post line, porch fascia
const ZR = 1.3;                                    // ridge: 3 m in from the SE wall, 5.8 m from the porch fascia
const EF = 3.0, H = 6.55, EP = 2.75;               // SE wall top, ridge, porch fascia height
const FL = 0.4, OH = 0.35, GO = 0.3;               // floor / porch deck, SE eave overhang, gable overhang
const sS = (H - EF) / (ZF - ZR), sN = (H - EP) / (ZR - ZE);   // SE ~50°, NW ~33°
const yS = z => H - (z - ZR) * sS, yN = z => H - (ZR - z) * sN;
const G = -0.5;                                    // walls run below grade so the house sits on sloping terrain

export function build({ lod = 'high' } = {}) {
  const hi = lod !== 'low';
  const P = new Parts();
  const mats = {
    wall: new THREE.MeshStandardMaterial({ color: 0xffffff, map: battenTex('bh_bb2', '#c8622f'), roughness: 0.88 }),
    roof: new THREE.MeshStandardMaterial({ color: 0xffffff, map: shingleTex('bh_sh3', '142,116,92', 0.42), roughness: 0.93 }),
    redtrim: new THREE.MeshStandardMaterial({ color: 0xb4532a, roughness: 0.8 }),
    deck: new THREE.MeshStandardMaterial({ color: 0x8c4c2d, roughness: 0.85 }),
    soffit: new THREE.MeshStandardMaterial({ color: 0x9c5a35, roughness: 0.9, side: THREE.DoubleSide }),
    trim: new THREE.MeshStandardMaterial({ color: 0xf1efe8, roughness: 0.7 }),
    door: new THREE.MeshStandardMaterial({ color: 0xeeece6, roughness: 0.6 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x27323a, roughness: 0.15, metalness: 0.3 }),
    found: new THREE.MeshStandardMaterial({ color: 0x5e5751, roughness: 0.95 }),
    white: new THREE.MeshStandardMaterial({ color: 0xe9e9e4, roughness: 0.5 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x9a9ea3, roughness: 0.45, metalness: 0.5 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x3a3b3d, roughness: 0.6, metalness: 0.3 }),
  };

  // --- body walls (orange board-and-batten), skirt down to G
  const fF = wallFrame(V(X0, 0, ZF), V(1, 0, 0), V(0, 0, 1));     // SE eave wall (u: SW → NE)
  const fN = wallFrame(V(X1, 0, ZN), V(-1, 0, 0), V(0, 0, -1));   // NW wall under the porch (u: NE → SW)
  const fW = wallFrame(V(X0, 0, ZN), V(0, 0, 1), V(-1, 0, 0));    // SW gable (u: NW → SE)
  const fE = wallFrame(V(X1, 0, ZF), V(0, 0, -1), V(1, 0, 0));    // NE gable (u: SE → NW)
  const hN = yN(ZN);
  P.add('wall', poly(fF.o.clone().setY(G), fF.eu, UP, [[0, 0], [W, 0], [W, EF - G], [0, EF - G]]));
  P.add('wall', poly(fN.o.clone().setY(G), fN.eu, UP, [[0, 0], [W, 0], [W, hN - G], [0, hN - G]]));
  P.add('wall', poly(fW.o.clone().setY(G), fW.eu, UP, [[0, 0], [D, 0], [D, EF - G], [ZR - ZN, H - G], [0, hN - G]]));
  P.add('wall', poly(fE.o.clone().setY(G), fE.eu, UP, [[0, 0], [D, 0], [D, hN - G], [ZF - ZR, H - G], [0, EF - G]]));
  if (hi) {
    // dark sill band at the bottom of the siding
    box(P, 'found', X0 - 0.03, X1 + 0.03, G, 0.1, ZF - 0.02, ZF + 0.03);
    box(P, 'found', X0 - 0.03, X0 + 0.02, G, 0.1, ZN, ZF);
    box(P, 'found', X1 - 0.02, X1 + 0.03, G, 0.1, ZN, ZF);
    // corner boards + the horizontal belly band across each gable at eave height
    for (const [x, z] of [[X0, ZF], [X1, ZF], [X0, ZN], [X1, ZN]]) box(P, 'redtrim', x - 0.07, x + 0.07, 0.05, z === ZF ? EF : hN, z - 0.07, z + 0.07);
    for (const f of [fW, fE]) obox(P, 'redtrim', onWall(f, D / 2, EF - 0.02, 0.04), [D + 0.1, 0.16, 0.07], f.eu, f.en);
  }

  // --- roof: short steep SE slope + long NW slope running on over the porch, gable overhangs
  const RX0 = X0 - GO, RX1 = X1 + GO, t = 0.15, l = 0.02, zS = ZF + OH;
  slab(P, V(RX0, H + l, ZR), V(RX0, yS(zS) + l, zS), V(RX1, yS(zS) + l, zS), V(RX1, H + l, ZR), t, 'roof', 'soffit', 'redtrim');
  slab(P, V(RX1, H + l, ZR), V(RX1, EP + l, ZE), V(RX0, EP + l, ZE), V(RX0, H + l, ZR), t, 'roof', 'soffit', 'redtrim');
  if (hi) {
    // fascia + rake boards (orange)
    const fas = (a, b, hgt = 0.2) => {
      const d = b.clone().sub(a), L = d.length(), eu = d.normalize(); const en = UP.clone().cross(eu).negate();
      const up = en.clone().cross(eu); obox(P, 'redtrim', a.clone().add(b).multiplyScalar(0.5).addScaledVector(up, -0.06), [L, hgt, 0.05], eu, en, up);
    };
    fas(V(RX1 + 0.03, yS(zS), zS + 0.03), V(RX0 - 0.03, yS(zS), zS + 0.03));
    fas(V(RX0 - 0.03, EP, ZE - 0.03), V(RX1 + 0.03, EP, ZE - 0.03), 0.24);
    for (const x of [RX0 - 0.03, RX1 + 0.03]) { fas(V(x, H, ZR), V(x, yS(zS), zS)); fas(V(x, H, ZR), V(x, EP, ZE)); }
    obox(P, 'roof', V((RX0 + RX1) / 2, H + 0.1, ZR), [RX1 - RX0, 0.08, 0.32]);            // ridge cap
    for (const x of [X0 + 1.2, X0 + 8.3]) {                                              // two box vents high on the SE slope
      const z = ZR + 0.55; box(P, 'white', x - 0.2, x + 0.2, yS(z) - 0.1, yS(z) + 0.2, z - 0.2, z + 0.2);
    }
    const pv = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8); pv.translate(X0 + 4.6, yS(ZR + 1.3) + 0.15, ZR + 1.3); P.add('dark', pv); // plumbing vent
    const mast = new THREE.CylinderGeometry(0.045, 0.045, 3.0, 8); mast.translate(X1 - 0.35, 1.85, ZF + 0.14); P.add('metal', mast); // service mast through the eave
    box(P, 'dark', X1 - 0.5, X1 - 0.2, 3.3, 3.4, ZF + 0.08, ZF + 0.2);
  }

  // --- NW porch: deck the full length, square support posts, beam, steps toward the yard (open, no railing)
  box(P, 'deck', X0, X1, -0.4, FL, ZP - 0.15, ZN);
  const nPost = 5;
  for (let i = 0; i < nPost; i++) {
    const x = X0 + 0.1 + (W - 0.2) * i / (nPost - 1);
    box(P, 'redtrim', x - 0.09, x + 0.09, FL, yN(ZP) - 0.12, ZP - 0.09, ZP + 0.09);
  }
  if (hi) {
    box(P, 'redtrim', X0, X1, yN(ZP) - 0.36, yN(ZP) - 0.12, ZP - 0.08, ZP + 0.08);
    // no railing (Mike 10-29: the real porch is open between its support posts)
    box(P, 'deck', -0.75, 0.95, -0.3, 0.22, ZP - 0.55, ZP - 0.15);                          // two steps
    box(P, 'deck', -0.75, 0.95, -0.3, 0.04, ZP - 0.85, ZP - 0.55);
  }

  // --- NE lean-to (siding walls, metal shed roof) tucked against the gable at the SE corner
  const LZ0 = ZF - 2.6, LZ1 = ZF - 0.15, LH0 = 2.45, LH1 = 2.15;
  P.add('wall', poly(V(X1, G, LZ1), V(1, 0, 0), UP, [[0, 0], [XA - X1, 0], [XA - X1, LH1 - G], [0, LH0 - G]]));
  P.add('wall', poly(V(XA, G, LZ1), V(0, 0, -1), UP, [[0, 0], [LZ1 - LZ0, 0], [LZ1 - LZ0, LH1 - G], [0, LH1 - G]]));
  P.add('wall', poly(V(XA, G, LZ0), V(-1, 0, 0), UP, [[0, 0], [XA - X1, 0], [XA - X1, LH0 - G], [0, LH1 - G]]));
  slab(P, V(X1, LH0 + 0.1, LZ0 - 0.15), V(X1, LH0 + 0.1, LZ1 + 0.2), V(XA + 0.15, LH1 + 0.06, LZ1 + 0.2), V(XA + 0.15, LH1 + 0.06, LZ0 - 0.15), 0.05, 'metal', 'metal', 'metal');

  // --- openings
  // SE wall (as seen from the driveway): slider left, small bathroom window + "private residence" sign, slider right
  windowOn(P, fF, 1.8, 1.65, 1.2, 1.08, hi, { vm: true });
  windowOn(P, fF, 5.1, 2.3, 0.42, 0.45, hi);
  windowOn(P, fF, 7.6, 1.7, 1.1, 1.0, hi, { vm: true });
  // NW wall under the porch: door + windows
  doorOn(P, fN, 4.4, FL, 0.9, 2.05, hi);
  windowOn(P, fN, 1.9, 1.3, 1.1, 1.1, hi, { vm: true });
  windowOn(P, fN, 6.6, 1.3, 1.2, 1.1, hi, { vm: true });
  windowOn(P, fN, 8.7, 1.35, 0.6, 1.1, hi);
  // SW gable: narrow window by the porch corner
  windowOn(P, fW, 0.75, 1.2, 0.55, 1.15, hi);
  // NE gable: the side door in the middle of the wall, right beside the pump-house lean-to (Mike 10-29), a window
  // toward the porch end + loft window
  doorOn(P, fE, D / 2, FL, 0.9, 2.05, hi);
  box(P, 'deck', X1, X1 + 0.9, -0.3, FL, ZF - D / 2 - 0.65, ZF - D / 2 + 0.65);                    // step at the door
  windowOn(P, fE, D - 1.3, 1.35, 0.9, 1.0, hi);
  windowOn(P, fE, ZF - ZR, 3.7, 0.65, 0.8, hi);

  // --- SW gable + SE wall clutter: sign, gas line, meter, propane tank, satellite dish, hose
  if (hi) {
    obox(P, 'white', onWall(fF, 5.1, 1.85, 0.04), [0.4, 0.5, 0.03], fF.eu, fF.en);                 // PRIVATE RESIDENCE sign
    obox(P, 'dark', onWall(fF, 3.4, 1.25, 0.06), [0.05, 0.75, 0.05], fF.eu, fF.en);                // gas line
    obox(P, 'dark', onWall(fF, 3.55, 1.6, 0.06), [0.3, 0.05, 0.05], fF.eu, fF.en);
    obox(P, 'metal', onWall(fW, 1.65, 1.45, 0.07), [0.3, 0.38, 0.14], fW.eu, fW.en);               // meter
    const tx = X0 - 0.5, tz = ZN + 3.05;
    const tank = new THREE.CylinderGeometry(0.37, 0.37, 1.1, 12); tank.translate(tx, 0.55, tz); P.add('white', tank);
    const cap = new THREE.SphereGeometry(0.37, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2); cap.translate(tx, 1.1, tz); P.add('white', cap);
    const dz = ZN + 4.55, dy = 3.6;                                                                 // dish high on the gable, SE side
    const dish = new THREE.CylinderGeometry(0.33, 0.24, 0.08, 12); dish.rotateZ(Math.PI / 2.3); dish.rotateY(-0.35); dish.translate(X0 - 0.5, dy, dz); P.add('white', dish);
    box(P, 'metal', X0 - 0.45, X0, dy - 0.04, dy + 0.04, dz - 0.04, dz + 0.04);
    const hose = new THREE.TorusGeometry(0.22, 0.035, 6, 14); hose.translate(X0 + 0.0, 0.5, ZF + 0.12); P.add('dark', hose);
  }
  return P.build(mats);
}

// Bottom House — the older lived-in farmhouse in the middle of the property (west of the golf fairways, at the fork
// of the farm road), with a lean-to and outhouse ~30 m NNE of it. One storey on a low foundation: a FRONT-GABLED
// main block (gable end with a white door facing the yard / driveway to the SE) plus a lower cross-gabled wing on
// the SW side. Red stained board-and-batten like the rest of the resort, brown asphalt shingles, small front stoop.
// Evidence is thin (no ground photos found) — form and colour come from the drone mosaic + one oblique aerial.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  name: 'Bottom House',
  layer: 'utility_buildings',
  match: 'Bottom House', // utility_buildings feature Name = "Bottom House" (quad 10.4 × 7.6 m, long axis NE–SW)
  footprint: [10.8, 7.6],
  height: 4.9,
  place: { x: -234.94, y: 20.2, rotY: 0.9146 }, // polygon centroid; front gable + door face bearing ~128° (SE)
  sources: [
    'landmap drone tiles z20 (brown shingled cross-gabled roof, main ridge NW–SE, lower wing on the W, cars parked SE)',
    'Drone Shots/wellsgraygolf6.PNG (oblique aerial: red gable end with white door, darker low wing to its left)',
    'Esri World Imagery z18 (building sits on the plan polygon, lean-to 30 m NNE)',
  ],
  notes: 'See models/notes/bottom_house.md. Drone mosaic shows this house ~27 m N / 6 m W of the plan polygon; placed on the polygon.',
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
function shingleTex(key, rgb) {
  return canvasTex(key, 128, 128, (g, w, h) => {
    const r = rnd(5); g.fillStyle = `rgb(${rgb})`; g.fillRect(0, 0, w, h);
    const rows = 8, rh = h / rows, [R, G, B] = rgb.split(',').map(Number);
    for (let i = 0; i < rows; i++) {
      const off = (i % 2) * 8;
      for (let x = -off; x < w; x += 16) {
        const v = 0.86 + r() * 0.26;
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
// Local frame: x along the long axis (NE = +x), z front(+, SE)/back(-), y up.
const MX0 = -0.9, MX1 = 4.9, MZ0 = -3.45, MZ1 = 3.45;   // main block walls (5.8 × 6.9)
const WX0 = -5.2, WZ0 = -3.45, WZ1 = 1.55;               // SW wing walls (4.3 × 5.0), shares the main SW wall
const FND = 0.35, EM = 2.95, PM = 0.7, OHm = 0.35;       // foundation, main eave height, pitch, overhang
const MXC = (MX0 + MX1) / 2, HM = EM + (MX1 - MX0) / 2 * PM;
const EW = 2.7, PW = 0.62, WZC = (WZ0 + WZ1) / 2, HW = EW + (WZ1 - WZ0) / 2 * PW;

export function build({ lod = 'high' } = {}) {
  const hi = lod !== 'low';
  const P = new Parts();
  const mats = {
    wall: new THREE.MeshStandardMaterial({ color: 0xffffff, map: battenTex('bh_bb', '#a3492b'), roughness: 0.9 }),
    roof: new THREE.MeshStandardMaterial({ color: 0xffffff, map: shingleTex('bh_sh', '126,102,80'), roughness: 0.94 }),
    roof2: new THREE.MeshStandardMaterial({ color: 0xffffff, map: shingleTex('bh_sh2', '96,80,66'), roughness: 0.94 }),
    redtrim: new THREE.MeshStandardMaterial({ color: 0x96432a, roughness: 0.8 }),
    deck: new THREE.MeshStandardMaterial({ color: 0x7e6a55, roughness: 0.9 }),
    soffit: new THREE.MeshStandardMaterial({ color: 0x8a4a30, roughness: 0.9, side: THREE.DoubleSide }),
    trim: new THREE.MeshStandardMaterial({ color: 0xeeece4, roughness: 0.7 }),
    door: new THREE.MeshStandardMaterial({ color: 0xf2f1ec, roughness: 0.6 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x27323a, roughness: 0.15, metalness: 0.3 }),
    found: new THREE.MeshStandardMaterial({ color: 0x6b655e, roughness: 0.95 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x2e2e30, roughness: 0.5, metalness: 0.5 }),
  };
  const G = -0.5; // walls run below grade so the house sits on sloping terrain

  // --- main block walls: front + back gable ends, NE + SW eave walls
  const fMF = wallFrame(V(MX0, 0, MZ1), V(1, 0, 0), V(0, 0, 1));
  const fMB = wallFrame(V(MX1, 0, MZ0), V(-1, 0, 0), V(0, 0, -1));
  const fME = wallFrame(V(MX1, 0, MZ1), V(0, 0, -1), V(1, 0, 0));
  const mw = MX1 - MX0, md = MZ1 - MZ0;
  const gable = (w, e, h) => [[0, 0], [w, 0], [w, e - G], [w / 2, h - G], [0, e - G]];
  P.add('wall', poly(fMF.o.clone().setY(G), fMF.eu, UP, gable(mw, EM, HM)));
  P.add('wall', poly(fMB.o.clone().setY(G), fMB.eu, UP, gable(mw, EM, HM)));
  P.add('wall', poly(fME.o.clone().setY(G), fME.eu, UP, [[0, 0], [md, 0], [md, EM - G], [0, EM - G]]));
  // SW main wall: full height in front of the wing, and the strip above the wing eave
  P.add('wall', poly(V(MX0, G, WZ1), V(0, 0, 1), UP, [[0, 0], [MZ1 - WZ1, 0], [MZ1 - WZ1, EM - G], [0, EM - G]]));
  P.add('wall', poly(V(MX0, EW, MZ0), V(0, 0, 1), UP, [[0, 0], [WZ1 - MZ0, 0], [WZ1 - MZ0, EM - EW], [0, EM - EW]]));

  // --- wing walls (ridge along x, gable end facing SW)
  const ww = MX0 - WX0, wd = WZ1 - WZ0;
  const fWF = wallFrame(V(WX0, 0, WZ1), V(1, 0, 0), V(0, 0, 1));
  const fWB = wallFrame(V(MX0, 0, WZ0), V(-1, 0, 0), V(0, 0, -1));
  const fWW = wallFrame(V(WX0, 0, WZ0), V(0, 0, 1), V(-1, 0, 0));
  P.add('wall', poly(fWF.o.clone().setY(G), fWF.eu, UP, [[0, 0], [ww, 0], [ww, EW - G], [0, EW - G]]));
  P.add('wall', poly(fWB.o.clone().setY(G), fWB.eu, UP, [[0, 0], [ww, 0], [ww, EW - G], [0, EW - G]]));
  P.add('wall', poly(fWW.o.clone().setY(G), fWW.eu, UP, gable(wd, EW, HW)));
  if (hi) { // foundation band
    box(P, 'found', MX0 - 0.03, MX1 + 0.03, G, FND, MZ1 - 0.02, MZ1 + 0.03);
    box(P, 'found', MX1 - 0.02, MX1 + 0.03, G, FND, MZ0, MZ1);
    box(P, 'found', MX0 - 0.03, MX1 + 0.03, G, FND, MZ0 - 0.03, MZ0 + 0.02);
    box(P, 'found', WX0 - 0.03, MX0, G, FND, WZ1 - 0.02, WZ1 + 0.03);
    box(P, 'found', WX0 - 0.03, MX0, G, FND, WZ0 - 0.03, WZ0 + 0.02);
    box(P, 'found', WX0 - 0.03, WX0 + 0.02, G, FND, WZ0, WZ1);
  }

  // --- roofs
  const t = 0.13, l = 0.02;
  const mx0 = MX0 - OHm, mx1 = MX1 + OHm, ye = EM - OHm * PM, mz0 = MZ0 - OHm, mz1 = MZ1 + OHm;
  slab(P, V(MXC, HM + l, mz1), V(mx1, ye + l, mz1), V(mx1, ye + l, mz0), V(MXC, HM + l, mz0), t, 'roof', 'soffit', 'redtrim');
  slab(P, V(MXC, HM + l, mz0), V(mx0, ye + l, mz0), V(mx0, ye + l, mz1), V(MXC, HM + l, mz1), t, 'roof', 'soffit', 'redtrim');
  const wz0 = WZ0 - 0.3, wz1 = WZ1 + 0.3, wye = EW - 0.3 * PW, wx0 = WX0 - 0.3, wx1 = MX0 + 0.05;
  slab(P, V(wx0, HW + l, WZC), V(wx0, wye + l, wz1), V(wx1, wye + l, wz1), V(wx1, HW + l, WZC), t, 'roof2', 'soffit', 'redtrim');
  slab(P, V(wx1, HW + l, WZC), V(wx1, wye + l, wz0), V(wx0, wye + l, wz0), V(wx0, HW + l, WZC), t, 'roof2', 'soffit', 'redtrim');
  if (hi) {
    obox(P, 'roof', V(MXC, HM + 0.09, 0), [0.3, 0.08, mz1 - mz0]);
    obox(P, 'roof2', V((wx0 + wx1) / 2, HW + 0.09, WZC), [wx1 - wx0, 0.08, 0.28]);
    for (const z of [mz1 + 0.02, mz0 - 0.02]) for (const s of [-1, 1]) { // rake boards on the main gables
      const a = V(MXC, HM - 0.05, z), b = V(s < 0 ? mx0 : mx1, ye - 0.05, z);
      const d = b.clone().sub(a), L = d.length(), eu = d.normalize(), en = V(0, 0, Math.sign(z));
      obox(P, 'redtrim', a.clone().add(b).multiplyScalar(0.5), [L, 0.2, 0.05], eu, en, en.clone().cross(eu));
    }
    const sp = new THREE.CylinderGeometry(0.1, 0.1, 1.1, 8); sp.translate(MXC + 1.2, HM - 0.3, -1.6); P.add('metal', sp); // stovepipe
  }

  // --- front stoop: small deck + steps + railings at the gable-end door
  const DX0 = MXC - 0.2, DX1 = MXC + 2.2;
  box(P, 'deck', DX0, DX1, G, FND + 0.05, MZ1, MZ1 + 1.5);
  if (hi) {
    box(P, 'deck', DX0 + 0.5, DX1 - 0.5, G, 0.2, MZ1 + 1.5, MZ1 + 1.85);
    railing(P, 'deck', V(DX0, 0, MZ1 + 0.05), V(DX0, 0, MZ1 + 1.45), FND + 0.05, 0.9, 4);
    railing(P, 'deck', V(DX1, 0, MZ1 + 0.05), V(DX1, 0, MZ1 + 1.45), FND + 0.05, 0.9, 4);
  }

  // --- openings
  doorOn(P, fMF, MXC - MX0 + 1.0, FND + 0.05, 0.9, 2.05, hi);   // white front door, right of the gable centre
  windowOn(P, fMF, 1.3, 1.2, 1.1, 1.2, hi, { mullion: 0.5 });
  windowOn(P, fMF, mw / 2, 3.35, 0.55, 0.7, hi);                 // small attic window in the gable
  windowOn(P, fME, 1.5, 1.2, 1.2, 1.2, hi, { mullion: 0.5 });
  windowOn(P, fME, md - 1.6, 1.3, 0.8, 1.0, hi);
  windowOn(P, fMB, mw / 2, 1.3, 1.0, 1.1, hi);
  windowOn(P, fWF, ww / 2, 1.2, 1.1, 1.1, hi);                   // wing front
  windowOn(P, fWW, wd / 2, 1.2, 1.0, 1.1, hi);                   // wing SW gable end
  doorOn(P, fWB, ww - 1.2, FND, 0.85, 2.0, hi, true);           // back door off the wing
  return P.build(mats);
}

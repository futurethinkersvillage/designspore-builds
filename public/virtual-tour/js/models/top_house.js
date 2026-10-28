// Top House — the red board-and-batten cottage at the west end of Wells Gray Golf & RV Resort, beside the
// event gazebo and the two RVs (Maker RV / Office RV). 1½ storeys: side-gabled main roof with an ASYMMETRIC gable
// (short steep back slope, long front slope) that kicks out at the front wall into a shallower full-width porch roof
// on four square posts. Brown asphalt shingles, red-orange stained board-and-batten, white window trim + white door,
// red painted porch deck with a concrete step, a small raised side deck + door at the back of the east wall,
// two upper bedroom windows high in the east gable, satellite dish + propane tank on the west side.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  name: 'Top House',
  layer: 'utility_buildings',
  match: 'Top House', // utility_buildings feature Name = "Top House" (4-vertex quad 8.6 × 11.3 m)
  footprint: [8.6, 11.3], // roof incl. 0.4 m gable overhangs × back eave → front porch fascia
  height: 6.75,
  place: { x: -602.06, y: -241.04, rotY: 0.5404 }, // polygon centroid; porch/front door faces bearing ~149° (SSE)
  sources: [
    'Photos/Cottage/01.jpg, wellsgraygolf10.PNG (front + east side: porch, kicked roof, upper gable windows, side deck)',
    'Photos/Cottage/02.jpg = portal-place landmap/photos/tophouse-1.jpg (straight-on front: 4 posts, door, 3 windows)',
    'Photos/Cottage/14.jpg (west gable: asymmetric gable, short steep back slope, propane tank, dish)',
    'Drone Shots/wellsgraygolf6.PNG (oblique: house beside the octagonal gazebo, brown roof, red walls)',
    'landmap drone tiles z20 (roof 8.5 × ~12 m, ridge ~3.5 m from the back edge, red side deck on the NE)',
  ],
  notes: 'See models/notes/top_house.md. Drone mosaic is shifted ~33 m W of the plan layers here; placed on the plan polygon.',
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
// Local frame: x across the front (east = +x), z front(+)/back(-), y up. Ground = 0.
const W = 7.6, X0 = -W / 2, X1 = W / 2;          // body width (25')
const ZB = -5.25, ZF = 3.35;                      // back wall, front wall (body 8.6 m deep)
const ZP = 5.45, ZE = 5.62;                       // porch post line, porch fascia
const EB = 3.4, EF = 3.55, H = 6.6, ZR = ZB + 3.2; // back eave, front-wall roof line, ridge height + position
const OH = 0.4;                                    // gable + back-eave overhang
const FL = 0.45;                                   // floor / porch deck level
const sF = (H - EF) / (ZF - ZR), sB = (H - EB) / (ZR - ZB);   // front 29°, back 45°
const yFront = z => H - (z - ZR) * sF, yBack = z => H - (ZR - z) * sB;
const yPorch = z => EF - (z - ZF) * (EF - 2.98) / (ZE - ZF);

export function build({ lod = 'high' } = {}) {
  const hi = lod !== 'low';
  const P = new Parts();
  const mats = {
    wall: new THREE.MeshStandardMaterial({ color: 0xffffff, map: battenTex('th_bb', '#b3552f'), roughness: 0.88 }),
    roof: new THREE.MeshStandardMaterial({ color: 0xffffff, map: shingleTex('th_sh', '122,101,84'), roughness: 0.93 }),
    redtrim: new THREE.MeshStandardMaterial({ color: 0xa24a2a, roughness: 0.8 }),
    deck: new THREE.MeshStandardMaterial({ color: 0x8f4529, roughness: 0.85 }),
    soffit: new THREE.MeshStandardMaterial({ color: 0xe6dfcf, roughness: 0.9, side: THREE.DoubleSide }),
    trim: new THREE.MeshStandardMaterial({ color: 0xf1efe8, roughness: 0.7 }),
    door: new THREE.MeshStandardMaterial({ color: 0xf4f3ee, roughness: 0.6 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x27323a, roughness: 0.15, metalness: 0.3 }),
    concrete: new THREE.MeshStandardMaterial({ color: 0xa9a59c, roughness: 0.95 }),
    found: new THREE.MeshStandardMaterial({ color: 0x5e5751, roughness: 0.95 }),
    white: new THREE.MeshStandardMaterial({ color: 0xe9e9e4, roughness: 0.5 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x8d9096, roughness: 0.5, metalness: 0.4 }),
  };

  // --- body walls (board-and-batten), skirt down to -0.5 so it sits on sloping ground
  const fF = wallFrame(V(X0, 0, ZF), V(1, 0, 0), V(0, 0, 1));
  const fB = wallFrame(V(X1, 0, ZB), V(-1, 0, 0), V(0, 0, -1));
  const fE = wallFrame(V(X1, 0, ZF), V(0, 0, -1), V(1, 0, 0));
  const fW = wallFrame(V(X0, 0, ZB), V(0, 0, 1), V(-1, 0, 0));
  P.add('wall', poly(fF.o.clone().setY(-0.5), fF.eu, UP, [[0, 0], [W, 0], [W, EF + 0.5], [0, EF + 0.5]]));
  P.add('wall', poly(fB.o.clone().setY(-0.5), fB.eu, UP, [[0, 0], [W, 0], [W, EB + 0.5], [0, EB + 0.5]]));
  const D = ZF - ZB, ur = ZF - ZR; // east gable: u runs front→back
  P.add('wall', poly(fE.o.clone().setY(-0.5), fE.eu, UP, [[0, 0], [D, 0], [D, EB + 0.5], [ur, H + 0.5], [0, EF + 0.5]]));
  P.add('wall', poly(fW.o.clone().setY(-0.5), fW.eu, UP, [[0, 0], [D, 0], [D, EF + 0.5], [D - ur, H + 0.5], [0, EB + 0.5]]));
  // dark foundation band
  if (hi) {
    box(P, 'found', X0 - 0.03, X1 + 0.03, -0.5, 0.18, ZB - 0.03, ZB + 0.02);
    box(P, 'found', X1 - 0.02, X1 + 0.03, -0.5, 0.18, ZB, ZF);
    box(P, 'found', X0 - 0.03, X0 + 0.02, -0.5, 0.18, ZB, ZF);
  }

  // --- main roof: front slope (ridge → front wall) and back slope (ridge → back eave), 0.4 m gable overhangs
  const RX0 = X0 - OH, RX1 = X1 + OH, t = 0.14, lift = 0.02;
  const zBe = ZB - OH;
  slab(P, V(RX0, H + lift, ZR), V(RX0, EF + lift, ZF), V(RX1, EF + lift, ZF), V(RX1, H + lift, ZR), t, 'roof', 'redtrim', 'redtrim');
  slab(P, V(RX1, H + lift, ZR), V(RX1, yBack(zBe) + lift, zBe), V(RX0, yBack(zBe) + lift, zBe), V(RX0, H + lift, ZR), t, 'roof', 'redtrim', 'redtrim');
  // porch roof: shallower kick from the front wall out over the posts
  slab(P, V(RX0, EF + lift, ZF), V(RX0, yPorch(ZE), ZE), V(RX1, yPorch(ZE), ZE), V(RX1, EF + lift, ZF), 0.12, 'roof', 'soffit', 'redtrim');
  if (hi) {
    // fascia boards (red): back eave, porch front, rakes
    const fas = (a, b, k = 'redtrim', hgt = 0.22) => {
      const d = b.clone().sub(a), L = d.length(), eu = d.normalize(); let en = UP.clone().cross(eu).negate();
      const up = en.clone().cross(eu); obox(P, k, a.clone().add(b).multiplyScalar(0.5).addScaledVector(up, -0.06), [L, hgt, 0.05], eu, en, up);
    };
    fas(V(RX0 - 0.03, yBack(zBe), zBe - 0.03), V(RX1 + 0.03, yBack(zBe), zBe - 0.03));
    fas(V(RX1 + 0.03, yPorch(ZE), ZE + 0.03), V(RX0 - 0.03, yPorch(ZE), ZE + 0.03), 'redtrim', 0.26);
    for (const x of [RX0 - 0.03, RX1 + 0.03]) {
      fas(V(x, H, ZR), V(x, EF, ZF)); fas(V(x, EF, ZF), V(x, yPorch(ZE), ZE)); fas(V(x, H, ZR), V(x, yBack(zBe), zBe));
    }
    // ridge cap
    obox(P, 'roof', V(0, H + 0.1, ZR), [RX1 - RX0, 0.08, 0.3]);
  }

  // --- porch: red deck, rim, 4 posts, beam, ceiling, east-end railing, concrete step
  box(P, 'deck', X0, X1, -0.4, FL, ZF, ZP + 0.15);
  const posts = [X0 + 0.1, -1.25, 0.95, X1 - 0.1];
  for (const x of posts) box(P, 'redtrim', x - 0.1, x + 0.1, FL, yPorch(ZP) - 0.12, ZP - 0.1, ZP + 0.1);
  if (hi) {
    box(P, 'redtrim', X0, X1, yPorch(ZP) - 0.34, yPorch(ZP) - 0.1, ZP - 0.09, ZP + 0.09);
    railing(P, 'redtrim', V(X1 - 0.08, 0, ZF + 0.1), V(X1 - 0.08, 0, ZP - 0.12), FL, 0.95, 7);
    box(P, 'concrete', -1.0, 0.8, -0.3, 0.22, ZP + 0.15, ZP + 1.05);
  }

  // --- openings
  doorOn(P, fF, 3.7, FL, 0.9, 2.05, hi);                  // front door (white, 9-lite)
  windowOn(P, fF, 0.85, 1.25, 0.58, 1.3, hi);             // two narrow windows left of the door
  windowOn(P, fF, 1.95, 1.25, 0.58, 1.3, hi);
  windowOn(P, fF, 6.15, 1.1, 1.15, 1.42, hi);             // big window right of the door
  windowOn(P, fE, 3.0, 1.2, 0.52, 1.35, hi);              // east wall: tall pair, middle-front
  windowOn(P, fE, 3.75, 1.2, 0.52, 1.35, hi);
  windowOn(P, fE, ur - 0.4, 3.75, 0.55, 0.95, hi);        // east gable: upstairs pair under the ridge
  windowOn(P, fE, ur + 0.35, 3.75, 0.55, 0.95, hi);
  doorOn(P, fE, D - 1.0, 0.62, 0.86, 2.0, hi);            // side door onto the deck
  windowOn(P, fW, D - 1.0, 1.2, 0.52, 1.35, hi);          // west wall: narrow window near the front
  windowOn(P, fW, D - 4.3, 1.25, 1.0, 1.2, hi);
  windowOn(P, fW, D - ur, 4.0, 0.6, 0.8, hi);             // small upstairs gable window (west)
  windowOn(P, fB, 2.0, 1.3, 1.0, 1.15, hi);               // back wall
  windowOn(P, fB, 5.6, 1.3, 1.0, 1.15, hi);

  // --- east side deck at the back corner (raised, red, railing) + small shed awning over the side door
  const DX = X1 + 2.4, DZ0 = ZB + 0.1, DZ1 = ZB + 2.9;
  box(P, 'deck', X1, DX, -0.4, 0.6, DZ0, DZ1);
  if (hi) {
    railing(P, 'redtrim', V(X1, 0, DZ0), V(DX, 0, DZ0), 0.6, 0.95, 6);
    railing(P, 'redtrim', V(DX, 0, DZ0), V(DX, 0, DZ1 - 0.9), 0.6, 0.95, 4);
    railing(P, 'redtrim', V(X1, 0, DZ1), V(DX - 1.0, 0, DZ1), 0.6, 0.95, 3);
    box(P, 'deck', DX - 0.95, DX - 0.05, -0.3, 0.3, DZ1, DZ1 + 0.35);   // step down
    const zc = ZF - (D - 1.0);
    slab(P, V(X1, 3.05, zc - 0.85), V(X1, 3.05, zc + 0.85), V(X1 + 1.0, 2.8, zc + 0.85), V(X1 + 1.0, 2.8, zc - 0.85), 0.08, 'roof', 'soffit', 'redtrim');
  }

  // --- west side: propane tank, meter, satellite dish
  if (hi) {
    const tank = new THREE.CylinderGeometry(0.37, 0.37, 1.15, 12); tank.translate(X0 - 0.5, 0.7, -2.6); P.add('white', tank);
    const cap = new THREE.SphereGeometry(0.37, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2); cap.translate(X0 - 0.5, 1.27, -2.6); P.add('white', cap);
    box(P, 'metal', X0 - 0.12, X0, 1.3, 1.65, 1.0, 1.3);
    const dish = new THREE.CylinderGeometry(0.33, 0.25, 0.08, 12); dish.rotateZ(Math.PI / 2.4); dish.rotateY(-0.5); dish.translate(X0 - 0.45, 4.6, ZR + 0.9); P.add('white', dish);
    box(P, 'metal', X0 - 0.4, X0, 4.55, 4.6, ZR + 0.85, ZR + 0.95);
  }
  return P.build(mats);
}

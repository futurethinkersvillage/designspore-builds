// The landscape of the zome village (data/village.json, tools/village_design.py): flower beds at the steps, fire circles, the green,
// a play court, shared vegetable beds, path lamps and benches, small parking bays beside the homes, a dock on the lake.
// All instanced. Local metres (x = east, y = north, three z = -north). Planned; none of it exists yet.
import * as THREE from 'three';
import { plantGeo } from './shower_house.js';

const RAD = { acorn: 1.65, z5: 2.6, z6: 3.25, z75: 3.95, z9: 4.7 };
const typ = p => ['z75', 'z9', 'z5', 'z6', 'acorn'].find(k => p.includes(k));
const H = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

export function build({ V, ground, level, lod = 'high' }) {
  const group = new THREE.Group(); group.name = 'village_land';
  const hi = lod !== 'low', dm = new THREE.Object3D(), col = new THREE.Color();
  const lists = new Map();
  const add = (kind, x, y, sx, sy, sz, ry, c, lift = 0, base = null) => { if (!lists.has(kind)) lists.set(kind, []); lists.get(kind).push([x, (base ?? ground(x, y)) + lift, y, sx, sy, sz, ry, c]); };
  const FLOW = [0xf0c63c, 0xe9e4d6, 0xd9708c, 0xb377c9, 0xe88a3c, 0x8fb4e0];
  const bed = (x, y, w, d, ry, i) => {   // dug soil with a loose row of plants
    // (r1103: the soil slab read as a door-high dark tub on the graded pads; the plants alone make the bed)
    const n = Math.max(8, Math.round(w * d * 5)), c = Math.cos(ry), s = Math.sin(ry);
    for (let k = 0; k < n; k++) { const u = (H(i * 7 + k) - 0.5) * w * 0.8, v = (H(i * 11 + k * 3) - 0.5) * d * 0.8, px = x + u * c + v * s, py = y + u * s - v * c, q = H(i + k * 0.37);
      add(q < 0.45 ? 'leafy' : q < 0.7 ? 'grass' : 'flower', px, py, 0.7 + q * 0.4, 0.7 + q * 0.4, 0.7 + q * 0.4, k, q < 0.7 ? 0xffffff : FLOW[(i + (k >> 2)) % FLOW.length], 0.02); }
  };
  V.zomes.forEach((z, i) => {
    const R = RAD[typ(z.plan)], fx = Math.sin(z.rotY), fy = -Math.cos(z.rotY), lx = -fy, ly = fx;
    if (R > 2) for (const s of [-1, 1]) bed(z.x + fx * (R + 0.6) + lx * s * (R * 0.8 + 0.7), z.y + fy * (R + 0.6) + ly * s * (R * 0.8 + 0.7), 2.4, 1.1, z.rotY + s * 0.5, i * 2 + (s > 0));
    if (R > 3 && H(i) > 0.4) bed(z.x - fy * (R + 1.8) * (H(i + 0.3) > 0.5 ? 1 : -1), z.y + fx * (R + 1.8) * (H(i + 0.3) > 0.5 ? 1 : -1), 3, 1.3, z.rotY + 1.4, i + 90);
  });
  V.courts.forEach((c, ci) => {
    const ringIn = (c.ring || c.r / 2) * 0.72;
    if (c.kind === 'court' || c.kind === 'green') {   // fire circle: stone ring, four log benches; flowers round it
      add('stone', c.x, c.y, 1, 1, 1, 0, 0x6a655c, 0.14); add('ember', c.x, c.y, 1, 1, 1, 0, 0x2a211b, 0.12);
      for (let k = 0; k < 4; k++) { const a = k * 1.57 + ci; add('logbench', c.x + Math.cos(a) * 3, c.y + Math.sin(a) * 3, 1, 1, 1, -a, 0x6d4d33, 0.26); }
      const ringN = c.kind === 'green' ? 12 : 6;
      for (let k = 0; k < ringN; k++) { const a = k / ringN * 6.283 + ci, r = ringIn * (c.kind === 'green' ? 1.1 : 1); bed(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r, 2.6, 1.1, -a + 1.57, ci * 40 + k); }
    }
    if (c.kind === 'green') for (let k = 0; k < 6; k++) { const a = k * 1.05 + 0.3, r = ringIn * 0.68, px = c.x + Math.cos(a) * r, py = c.y + Math.sin(a) * r; add('table', px, py, 1, 1, 1, a, 0x8a6a4a, 0.76); for (const s of [-1, 1]) add('seat', px + Math.sin(a) * 0.7 * s, py - Math.cos(a) * 0.7 * s, 1, 1, 1, a, 0x8a6a4a, 0.44); }
    if (c.kind === 'play') { add('sand', c.x, c.y, 1, 1, 1, 0.3, 0xcdbb96, 0.1); for (const s of [-1, 1]) add('swingpost', c.x + s * 1.8, c.y, 1, 1, 1, 0, 0x8a6a4a, 1.2); add('swingbar', c.x, c.y, 1, 1, 1, 0, 0x8a6a4a, 2.4); }
    if (c.kind === 'veg') for (let r0 = 0; r0 < 3; r0++) for (let k = 0; k < 2; k++) { const px = c.x + (k - 0.5) * 3.6, py = c.y + (r0 - 1) * 2.4; add('rbed', px, py, 1, 1, 1, 0.3, 0x7a5a3e, 0.25); for (let j = 0; j < 7; j++) add(j % 2 ? 'leafy' : 'grass', px + (j - 3) * 0.42 * Math.cos(0.3), py - (j - 3) * 0.42 * Math.sin(0.3), 0.55, 0.55, 0.55, j, 0xffffff, 0.48); }
  });
  // lamps every 14 m on the main paths, a bench now and then
  let n = 0;
  for (const p of V.paths) { if (p.kind === 'spur') continue; let d = 0; for (let i = 1; i < p.pts.length; i++) { const [ax, ay] = p.pts[i - 1], [bx, by] = p.pts[i], l = Math.hypot(bx - ax, by - ay); d += l; if (d >= 14) { d = 0; n++; const nx = (by - ay) / (l || 1), ny = -(bx - ax) / (l || 1), s = n % 2 ? 1 : -1, px = bx + nx * s * (p.w / 2 + 0.5), py = by + ny * s * (p.w / 2 + 0.5); add('lamppost', px, py, 1, 1, 1, 0, 0x2b2b2e, 0.65); add('lampglow', px, py, 1, 1, 1, 0, 0xffe2b0, 1.35); if (n % 5 === 0) add('logbench', bx - nx * s * (p.w / 2 + 0.9), by - ny * s * (p.w / 2 + 0.9), 1, 1, 1, Math.atan2(bx - ax, by - ay) + 1.57, 0x6d4d33, 0.26); } } }
  // a small parking bay beside each group of homes (Mike 11-02)
  { const CARS = [0x8d9194, 0x2f3a4a, 0xd6d4cc, 0x6a2f28, 0x3b4a3a];
    (V.parking || []).forEach((k, pi) => { const c = Math.cos(k.ang), s = Math.sin(k.ang);
      for (let q = 0; q < k.n; q++) { if (H(pi * 9 + q) > 0.75) continue; const u = (q - (k.n - 1) / 2) * 3, x = k.x + u * c, y = k.y - u * s, col0 = CARS[(pi + q) % CARS.length]; add('carbody', x, y, 1, 1, 1, k.ang, col0, 0.55); add('carcab', x, y, 1, 1, 1, k.ang, 0x23282c, 1.15); } }); }
  const R = (w, h, d) => new THREE.BoxGeometry(w, h, d), Cy = (a, b, h, s = 12) => new THREE.CylinderGeometry(a, b, h, hi ? s : 6);
  const GEO = { soil: new THREE.CylinderGeometry(0.55, 0.6, 0.2, 12), stone: new THREE.TorusGeometry(1.1, 0.24, 6, 14).rotateX(Math.PI / 2), ember: Cy(0.95, 0.95, 0.06), logbench: Cy(0.2, 0.22, 2.2, 8).rotateZ(Math.PI / 2), table: R(0.8, 0.06, 1.9), seat: R(0.28, 0.05, 1.9), sand: new THREE.CylinderGeometry(4.5, 4.7, 0.15, 18), swingpost: Cy(0.05, 0.06, 2.4, 6), swingbar: R(3.8, 0.08, 0.08), rbed: R(3.0, 0.5, 1.2), lamppost: Cy(0.035, 0.05, 1.3, 6), lampglow: new THREE.SphereGeometry(0.11, 8, 6), carbody: R(1.8, 0.7, 4.4), carcab: R(1.6, 0.6, 2.2), cart: R(1.2, 0.55, 2.3), cartroof: R(1.25, 0.05, 1.7), railpost: Cy(0.07, 0.08, 1, 6), signpost: Cy(0.07, 0.09, 2.4, 6), signboard: R(1.5, 0.7, 0.05) };
  ['leafy', 'grass', 'flower'].forEach(k => { GEO[k] = plantGeo(k); });
  const solid = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }); solid.userData.noSurface = true;
  const plantM = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, color: 0xe8e8e0 }), glow = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const headsGeo = plantGeo('heads');
  for (const [k, list] of lists) {
    const isPlant = ['leafy', 'grass', 'flower'].includes(k), m = new THREE.InstancedMesh(GEO[k], k === 'lampglow' ? glow : isPlant ? plantM : solid, list.length);
    list.forEach(([x, y, z, sx, sy, sz, ry, c], i) => { dm.position.set(x, y, -z); dm.rotation.set(0, ry, 0); dm.scale.set(sx, sy, sz); dm.updateMatrix(); m.setMatrixAt(i, dm.matrix); m.setColorAt(i, isPlant ? col.setScalar(1) : col.set(c)); });
    m.frustumCulled = false; m.name = 'v_' + k; group.add(m);
    if (k === 'flower') { const h = new THREE.InstancedMesh(headsGeo, plantM, list.length); list.forEach(([x, y, z, sx, sy, sz, ry, c], i) => { dm.position.set(x, y, -z); dm.rotation.set(0, ry, 0); dm.scale.set(sx, sy, sz); dm.updateMatrix(); h.setMatrixAt(i, dm.matrix); h.setColorAt(i, col.set(c)); }); h.frustumCulled = false; group.add(h); }
  }
  // the dock
  { const { x, y } = V.dock, L = 14, W = 2.4, wood = new THREE.MeshStandardMaterial({ color: 0x8a7458, roughness: 0.9 }); wood.userData.noSurface = true;
    const top = new THREE.Mesh(R(L, 0.12, W), wood); top.position.set(x - L / 2 + 2, level + 0.5, -y); group.add(top);
    for (let k = 0; k <= 5; k++) for (const s of [-1, 1]) { const p = new THREE.Mesh(Cy(0.09, 0.09, 1.6, 6), wood); p.position.set(x + 2 - k * L / 5, level, -y + s * W / 2); group.add(p); } }
  return group;
}

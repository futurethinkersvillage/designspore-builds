// The life on the planned farm (Mike 10-30: "add a lot more detail to the farm"), laid over farm_concept.js from the same
// site-plan layers: crop rows on every bed (lettuce, kale, carrots, tomatoes on stakes, corn, squash, flowers), plants
// inside the greenhouses, a post-and-rail fence following the beds, and the working bits round the barn: tractor, hay
// bales, compost bays, rain tank, chicken coop and run, beehives, scarecrow, wheelbarrow, picnic table, a dock on the pond.
// Local metres (x = east, y = north, three z = -north), draped with `ground(x, y)`.
import * as THREE from 'three';

const polys = f => f.t === 'Polygon' ? [f.c] : f.t === 'MultiPolygon' ? f.c : [];
const centre = r => [0, 1].map(k => r.slice(0, -1).reduce((a, p) => a + p[k], 0) / (r.length - 1));
const M = (color, rough = 0.85, metal = 0) => { const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, flatShading: true }); m.userData.noSurface = true; return m; };

// a ring's long axis: centre, unit direction, length, width
function axis(r) {
  const c = centre(r); let e = [1, 0], L = 0;
  for (let i = 0; i < r.length - 1; i++) { const d = [r[i + 1][0] - r[i][0], r[i + 1][1] - r[i][1]], l = Math.hypot(d[0], d[1]); if (l > L) { L = l; e = [d[0] / l, d[1] / l]; } }
  const n = [-e[1], e[0]]; let a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9;
  for (const [x, y] of r) { const u = (x - c[0]) * e[0] + (y - c[1]) * e[1], v = (x - c[0]) * n[0] + (y - c[1]) * n[1]; a0 = Math.min(a0, u); a1 = Math.max(a1, u); b0 = Math.min(b0, v); b1 = Math.max(b1, v); }
  return { c, e, n, a0, a1, b0, b1 };
}

export function build({ L, ground, lod = 'high' }) {
  const g = new THREE.Group(); g.name = 'farm_details';
  const hi = lod !== 'low', core = r => centre(r)[0] < -440;
  const rs = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const leaves = [], fruit = [], sticks = [];   // [x, y(height), z, sx, sy, sz, colour]
  const COL = { lettuce: 0xa8d860, kale: 0x4f8a58, carrot: 0x9acb55, beet: 0x74a04a, tomato: 0x5f9a48, corn: 0xb4c85a, squash: 0x6aa548, stake: 0x8a6a48, red: 0xc8392c, orange: 0xe8872c, yellow: 0xf0c83a, pink: 0xe2557a, purple: 0x9a5fc8, white: 0xf3efe2, stalk: 0xa8b35a };

  // one row of a crop along a bed: from (x0,y0) in direction e, length len
  const row = (crop, x0, y0, e, len, top) => {
    const step = { lettuce: 0.55, kale: 0.7, carrot: 0.28, beet: 0.4, tomato: 0.9, corn: 0.5, squash: 1.3, flowers: 0.4 }[crop] * (hi ? 1 : 2.2);
    for (let d = 0; d < len; d += step) {
      const x = x0 + e[0] * d + (rs() - 0.5) * 0.08, y = y0 + e[1] * d + (rs() - 0.5) * 0.08, h = ground(x, y) + top, k = 0.8 + rs() * 0.4;
      if (crop === 'lettuce') leaves.push([x, h + 0.1, y, 0.24 * k, 0.15 * k, 0.24 * k, COL.lettuce]);
      else if (crop === 'kale') leaves.push([x, h + 0.28, y, 0.27 * k, 0.32 * k, 0.27 * k, COL.kale]);
      else if (crop === 'carrot') leaves.push([x, h + 0.14, y, 0.09 * k, 0.17 * k, 0.09 * k, COL.carrot]);
      else if (crop === 'beet') { leaves.push([x, h + 0.14, y, 0.15 * k, 0.16 * k, 0.15 * k, COL.beet]); if (rs() < 0.5) fruit.push([x, h + 0.05, y, 0.06, 0.05, 0.06, 0x7a2340]); }
      else if (crop === 'tomato') {
        sticks.push([x, h + 0.7, y, 0.03, 1.4, 0.03, COL.stake]); leaves.push([x, h + 0.65, y, 0.28 * k, 0.55 * k, 0.28 * k, COL.tomato]);
        for (let i = 0; i < 4; i++) fruit.push([x + (rs() - 0.5) * 0.4, h + 0.35 + rs() * 0.7, y + (rs() - 0.5) * 0.4, 0.05, 0.05, 0.05, COL.red]);
      } else if (crop === 'corn') {
        sticks.push([x, h + 0.85, y, 0.035, 1.7, 0.035, COL.stalk]); leaves.push([x, h + 1.0, y, 0.2 * k, 0.5 * k, 0.2 * k, COL.corn]); fruit.push([x, h + 1.8, y, 0.04, 0.12, 0.04, 0xd8c070]);
      } else if (crop === 'squash') {
        leaves.push([x, h + 0.16, y, 0.48 * k, 0.2 * k, 0.48 * k, COL.squash]); if (rs() < 0.6) fruit.push([x + (rs() - 0.5) * 0.5, h + 0.12, y + (rs() - 0.5) * 0.5, 0.14, 0.11, 0.14, COL.orange]);
      } else {
        leaves.push([x, h + 0.14, y, 0.14 * k, 0.16 * k, 0.14 * k, 0x5f8a3f]);
        fruit.push([x, h + 0.32, y, 0.07, 0.05, 0.07, [COL.orange, COL.yellow, COL.pink, COL.purple, COL.white, COL.red][Math.floor(rs() * 6)]]);
      }
    }
  };
  const CROPS = ['lettuce', 'kale', 'carrot', 'tomato', 'beet', 'corn', 'lettuce', 'squash', 'carrot', 'flowers', 'kale', 'tomato'];
  const plantBed = (r, top, i) => {
    const a = axis(r), w = a.b1 - a.b0, len = a.a1 - a.a0 - 0.5; if (len < 1.2) return;
    const crop = CROPS[i % CROPS.length], rows = Math.max(1, Math.min(4, Math.floor(w / ({ tomato: 0.9, corn: 0.5, squash: 1.2, kale: 0.7 }[crop] || 0.42))));
    for (let k = 0; k < rows; k++) {
      const off = a.b0 + w * (k + 0.5) / rows, x0 = a.c[0] + a.e[0] * (a.a0 + 0.25) + a.n[0] * off, y0 = a.c[1] + a.e[1] * (a.a0 + 0.25) + a.n[1] * off;
      row(crop, x0, y0, a.e, len, top);
    }
  };
  (L.farm_market_garden || []).forEach((f, i) => polys(f).forEach(p => plantBed(p[0], 0.32, i)));
  (L.farm_mandala_garden || []).forEach((f, i) => polys(f).forEach(p => plantBed(p[0], 0.38, i + 5)));
  // greenhouse rows: three lines of plants under each hoop
  for (const f of L.farm_greenhouses || []) for (const p of polys(f)) {
    if (!core(p[0])) continue;
    const a = axis(p[0]), w = a.b1 - a.b0, len = a.a1 - a.a0 - 1.5;
    for (const q of [0.22, 0.5, 0.78]) { const off = a.b0 + w * q, x0 = a.c[0] + a.e[0] * (a.a0 + 0.75) + a.n[0] * off, y0 = a.c[1] + a.e[1] * (a.a0 + 0.75) + a.n[1] * off; row(q === 0.5 ? 'kale' : 'tomato', x0, y0, a.e, len, 0.05); }
  }

  // ---- post-and-rail fence following the beds, both sides, with gaps as gates ----
  const posts = [], rails = [];
  {
    const pts = (L.farm_market_garden || []).flatMap(f => polys(f).flatMap(p => core(p[0]) ? p[0] : []));
    if (pts.length) {
      const ys = pts.map(p => p[1]), y0 = Math.min(...ys) - 6, y1 = Math.max(...ys) + 6, sides = [[], []];
      for (let y = y0; y <= y1; y += 4) {
        const near = pts.filter(p => Math.abs(p[1] - y) < 12); if (!near.length) continue;
        sides[0].push([Math.min(...near.map(p => p[0])) - 4, y]); sides[1].push([Math.max(...near.map(p => p[0])) + 4, y]);
      }
      for (const s of sides) s.forEach(([x, y], i) => {
        posts.push([x, ground(x, y) + 0.6, y]);
        const b = s[i + 1]; if (!b || i % 12 === 6) return;   // a gate every ~50 m
        rails.push([x, y, b[0], b[1], 0.55], [x, y, b[0], b[1], 1.0]);
      });
    }
  }

  // ---- write the instanced lots ----
  const dummy = new THREE.Object3D(), col = new THREE.Color();
  const inst = (list, geo, mat) => {
    if (!list.length) return;
    const m = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach(([x, y, z, sx, sy, sz, c], i) => { dummy.position.set(x, y, -z); dummy.rotation.set(0, (i * 2.399) % 6.28, 0); dummy.scale.set(sx, sy, sz); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); m.setColorAt(i, col.set(c)); });
    m.frustumCulled = false; g.add(m);
  };
  const white = M(0xffffff);
  inst(leaves, new THREE.IcosahedronGeometry(1, 0), white);
  inst(fruit, new THREE.IcosahedronGeometry(1, 0), M(0xffffff, 0.6));
  inst(sticks, new THREE.BoxGeometry(1, 1, 1), white);
  const wood = M(0x8a6f50);
  if (posts.length) { const m = new THREE.InstancedMesh(new THREE.BoxGeometry(0.11, 1.2, 0.11), wood, posts.length); posts.forEach(([x, y, z], i) => { dummy.position.set(x, y, -z); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); }); m.frustumCulled = false; g.add(m); }
  if (rails.length) {
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.06, 0.05), wood, rails.length);
    rails.forEach(([x0, y0, x1, y1, h], i) => {
      const a = new THREE.Vector3(x0, ground(x0, y0) + h, -y0), b = new THREE.Vector3(x1, ground(x1, y1) + h, -y1), d = b.clone().sub(a);
      dummy.position.copy(a).addScaledVector(d, 0.5); dummy.scale.set(d.length(), 1, 1); dummy.rotation.set(0, 0, 0); dummy.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), d.clone().normalize()); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix);
    });
    m.frustumCulled = false; g.add(m);
  }
  if (!hi) return g;

  // ---- the working bits ----
  const box = (p, m, w, h, d, x, y, z, ry = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.rotation.y = ry; p.add(o); return o; };
  const cyl = (p, m, r, h, x, y, z, rot = null) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 14), m); o.position.set(x, y, z); if (rot) o.rotation[rot] = Math.PI / 2; p.add(o); return o; };
  const at = (x, y, ry = 0) => { const o = new THREE.Group(); o.position.set(x, ground(x, y), -y); o.rotation.y = ry; g.add(o); return o; };
  const barnR = (L.farm_buildings || []).flatMap(f => polys(f).map(p => p[0])).find(core), B = barnR ? centre(barnR) : [-525, -100];
  const red = M(0xa8392c, 0.6), black = M(0x1c1c1e, 0.9), steel = M(0x9aa0a6, 0.5, 0.5), hay = M(0xd2b35a, 1), oak = M(0x9a7a52), soil = M(0x3a2a1c, 1), green = M(0x356b45, 0.6), whiteP = M(0xeeeae0, 0.8), blue = M(0x4f7fa8, 0.5);

  // tractor beside the barn
  { const t = at(B[0] + 13, B[1] - 2, 0.5);
    box(t, red, 1.1, 0.8, 2.3, 0, 1.0, 0); box(t, red, 0.9, 0.5, 1.2, 0, 1.4, 0.3); box(t, black, 1.0, 1.0, 0.9, 0, 1.75, -0.6); box(t, steel, 0.1, 0.7, 0.1, 0.25, 1.9, 0.8);
    for (const s of [-1, 1]) { cyl(t, black, 0.7, 0.4, s * 0.8, 0.7, -0.8, 'z'); cyl(t, black, 0.38, 0.28, s * 0.72, 0.38, 1.0, 'z'); } }
  // hay bales, round and stacked
  for (let i = 0; i < 6; i++) cyl(at(B[0] + 16 + (i % 3) * 1.8, B[1] + 7 + Math.floor(i / 3) * 1.9), hay, 0.75, 1.2, 0, 0.75, 0, 'z');
  // compost bays (three-bin, timber slats, dark heaps)
  { const c = at(B[0] - 14, B[1] + 4, 0.2);
    for (let i = 0; i < 3; i++) { const x = (i - 1) * 2; for (const s of [-1, 1]) box(c, oak, 0.08, 1.0, 1.8, x + s * 0.95, 0.5, 0); box(c, oak, 1.9, 1.0, 0.08, x, 0.5, -0.9); const h = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1), soil); h.position.set(x, 0.42, 0); h.scale.y = 0.65; c.add(h); } }
  // rain tank + gutter down-pipe
  { const r = at(B[0] + 8, B[1] + 11); cyl(r, blue, 1.1, 2.2, 0, 1.1, 0); cyl(r, steel, 0.05, 2.2, 0.9, 2.4, 0); }
  // chicken coop and wire run
  { const c = at(B[0] - 12, B[1] - 12, 0.9);
    box(c, oak, 2.2, 1.2, 1.6, 0, 1.0, 0); const roof = box(c, green, 2.5, 0.08, 1.9, 0, 1.75, 0); roof.rotation.z = 0.2; box(c, whiteP, 0.5, 0.6, 0.02, 0.5, 0.95, 0.81);
    for (const [x, z] of [[-1, -0.7], [1, -0.7], [-1, 0.7], [1, 0.7]]) box(c, oak, 0.1, 0.5, 0.1, x, 0.25, z);
    const wire = new THREE.MeshStandardMaterial({ color: 0x8a8f94, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }); wire.userData.noSurface = true;
    for (const [w, d, x, z] of [[4, 0.03, 3.1, 2], [4, 0.03, 3.1, -2], [0.03, 4, 5.1, 0]]) box(c, wire, w, 1.4, d, x, 0.7, z);
    for (let i = 0; i < 9; i++) { const k = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 0), i % 3 ? whiteP : M(0xa0622e)); k.position.set(1.6 + rs() * 3.2, 0.16, (rs() - 0.5) * 3.4); k.scale.z = 1.3; c.add(k); } }
  // beehives by the mandala, bright boxes in a row
  const man = (L.farm_mandala_garden || []).flatMap(f => polys(f).map(p => p[0])).filter(core).map(centre);
  if (man.length) {
    const mc = [man.reduce((a, p) => a + p[0], 0) / man.length, man.reduce((a, p) => a + p[1], 0) / man.length];
    { const h = at(mc[0] + 24, mc[1] - 4, 0.3); [whiteP, M(0xe8c23a, 0.7), blue, whiteP, M(0xe2857a, 0.7)].forEach((m, i) => { box(h, oak, 0.6, 0.2, 0.6, i * 1.1, 0.1, 0); box(h, m, 0.5, 0.6, 0.5, i * 1.1, 0.5, 0); box(h, whiteP, 0.6, 0.06, 0.6, i * 1.1, 0.83, 0); }); }
    // scarecrow
    { const s = at(mc[0] - 3, mc[1] + 34); box(s, oak, 0.08, 2.0, 0.08, 0, 1.0, 0); box(s, oak, 1.5, 0.07, 0.07, 0, 1.45, 0); box(s, red, 0.55, 0.65, 0.22, 0, 1.3, 0); const hd = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18, 1), hay); hd.position.y = 1.85; s.add(hd); cyl(s, M(0x6a4a2a), 0.24, 0.05, 0, 2.0, 0); cyl(s, M(0x6a4a2a), 0.12, 0.2, 0, 2.1, 0); }
    // picnic table + wheelbarrow
    { const p = at(mc[0] + 22, mc[1] + 16, 0.5); box(p, oak, 0.8, 0.06, 2, 0, 0.76, 0); for (const s of [-1, 1]) { box(p, oak, 0.28, 0.05, 2, s * 0.62, 0.45, 0); box(p, oak, 1.5, 0.06, 0.08, 0, 0.4, s * 0.7); box(p, oak, 0.08, 0.78, 0.08, 0, 0.38, s * 0.7); } }
    { const w = at(mc[0] - 14, mc[1] + 10, 1.0); box(w, green, 0.7, 0.3, 1.0, 0, 0.55, 0); const dirt = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 1), soil); dirt.position.y = 0.68; dirt.scale.set(1, 0.45, 1.3); w.add(dirt); cyl(w, black, 0.2, 0.08, 0, 0.2, 0.72, 'z'); for (const s of [-1, 1]) { box(w, oak, 0.05, 0.05, 1.5, s * 0.25, 0.45, -0.3); box(w, steel, 0.04, 0.4, 0.04, s * 0.25, 0.2, -0.3); } }
  }
  // a little dock on the pond
  const pond = (L.farm_pond || []).flatMap(f => polys(f).map(p => p[0])).find(core);
  if (pond) {
    const a = axis(pond), edge = [a.c[0] + a.e[0] * a.a0, a.c[1] + a.e[1] * a.a0], gy = ground(edge[0], edge[1]);
    const d = new THREE.Group(); d.position.set(edge[0], gy + 0.25, -edge[1]); d.rotation.y = Math.atan2(a.e[0], a.e[1]) + Math.PI; g.add(d);
    box(d, oak, 1.4, 0.08, 5, 0, 0.05, 2.0); for (const s of [-1, 1]) for (const z of [0.2, 2, 4.2]) box(d, oak, 0.1, 0.8, 0.1, s * 0.6, -0.25, z);
  }
  return g;
}

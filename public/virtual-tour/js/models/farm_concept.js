// The planned farm (concept only, nothing here is built yet), generated from the farm_* site-plan layers:
// greenhouses (hoop houses with a soft interior glow), the barn, market-garden beds, the mandala keyhole beds with
// the herb spiral, the pond, the two swales and the food forest (fruit trees + understory).
// Everything is built in the site's local metres (x = east, y = north, three.js z = -north) and draped on the ground
// with `ground(x, y)`. Each vertex carries its ground height (aBase) and a 0..1 order (aOrder), so a chapter can
// grow the farm out of the ground in sequence with one uniform: group.userData.uGrow.value (0 = flat/hidden, 1.25 = all up).
// Amber outlines of every feature (the "drawing" before it materializes) are in group.userData.outline.
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

export const meta = {
  name: 'Farm (planned, concept)',
  layer: ['farm_greenhouses', 'farm_buildings', 'farm_market_garden', 'farm_mandala_garden', 'farm_herb_spiral', 'farm_pond', 'farm_swales', 'farm_food_forest', 'farmland'],
  match: 'built directly from the layer polygons (world coordinates); not placed by placeModel',
  footprint: [390, 525], height: 8,
  sources: ['data/layers.json farm_* layers'],
  notes: 'Concept. build({ L, ground, order, lod, origin }) -> Group in local metres. Without L it loads data/layers.json and ' +
    'builds the core farm (x < -440) centred on the origin for the model preview. userData: { uGrow, outline, materials }.',
};

// layers for the preview (the chapter passes ctx.L)
const LAYERS = await fetch(new URL('../../data/layers.json', import.meta.url)).then(r => r.json()).catch(() => null);

const polys = f => f.t === 'Polygon' ? [f.c] : f.t === 'MultiPolygon' ? f.c : [];
const C = s => new THREE.Color(s);
const COL = {
  soil: C('#4a3526'), soilTop: C('#5c4330'), straw: C('#9a8058'),
  crops: [C('#6f9a45'), C('#7aa448'), C('#5f8a40'), C('#88a24e'), C('#94a656'), C('#6c9446')],
  ghFrame: C('#d9d4cc'), ghSill: C('#5a4636'), plant: C('#5d8a3c'),
  barn: C('#b2634b'), barnDark: C('#6e3a2f'), roof: C('#6b5848'), trim: C('#efe6da'), door: C('#4a2c24'),
  stone: C('#9c958a'), stone2: C('#857e74'), herb: [C('#6a8f4a'), C('#7f7aa8'), C('#8fa25a')],
  rim: C('#7b6a55'), reed: C('#7d8a48'), berm: C('#6a6a3c'), shrub: [C('#4f6d34'), C('#5e7a3a'), C('#6b7f3c')],
  trunk: C('#5a4030'), crown: [C('#5f7f37'), C('#6c8a3b'), C('#557535'), C('#7a8c3e')],
  glow: C('#ffcf96'),
};
const hash = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// ---- geometry accumulator: one per material ----
function acc() {
  const a = { pos: [], col: [], base: [], ord: [] };
  a.tri = (p, q, r, c, base, ord) => {
    for (const v of [p, q, r]) { a.pos.push(v[0], v[1], v[2]); a.col.push(c.r, c.g, c.b); a.base.push(base); a.ord.push(ord); }
  };
  a.quad = (p, q, r, s, c, base, ord) => { a.tri(p, q, r, c, base, ord); a.tri(p, r, s, c, base, ord); };
  a.geo = () => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(a.pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(a.col, 3));
    g.setAttribute('aBase', new THREE.Float32BufferAttribute(a.base, 1));
    g.setAttribute('aOrder', new THREE.Float32BufferAttribute(a.ord, 1));
    g.computeVertexNormals();
    return g;
  };
  return a;
}

// grow out of the ground in order: every material shares uGrow
function growable(mat, uGrow, extraFrag = '') {
  mat.onBeforeCompile = sh => {
    sh.uniforms.uGrow = uGrow;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uGrow; attribute float aBase; attribute float aOrder; varying float vG; varying vec3 vWp;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float g = clamp((uGrow - aOrder) / 0.22, 0.0, 1.0); g = g * g * (3.0 - 2.0 * g); vG = g;
        transformed.y = aBase + (transformed.y - aBase) * max(g, 0.002);
        vWp = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vG; varying vec3 vWp;\nfloat fh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\nfloat fn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(fh(i),fh(i+vec2(1,0)),f.x),mix(fh(i+vec2(0,1)),fh(i+vec2(1,1)),f.x),f.y);}')
      .replace('#include <color_fragment>', `#include <color_fragment>\n${extraFrag}`)
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\nif (vG < 0.02) discard;');
  };
  return mat;
}

// remove near-duplicate and nearly collinear points from a ring (closed, last == first in GeoJSON)
function simplify(ring, tol = 0.12) {
  let r = ring.slice(0, -1).filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 0.3);
  let changed = true;
  while (changed && r.length > 4) {
    changed = false;
    for (let i = 0; i < r.length && r.length > 4; i++) {
      const a = r[(i - 1 + r.length) % r.length], b = r[i], c = r[(i + 1) % r.length];
      const L = Math.hypot(c[0] - a[0], c[1] - a[1]) || 1;
      const d = Math.abs((c[0] - a[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (c[1] - a[1])) / L;
      if (d < tol) { r.splice(i, 1); changed = true; i--; }
    }
  }
  return r;
}
const centroidOf = r => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length];

export function build({ L = LAYERS, ground = () => 0, order = null, lod = 'high', origin = null } = {}) {
  const preview = !order && origin === null && L === LAYERS;
  const O = origin || (preview ? [-480, -5] : [0, 0]);
  const keep = c => !preview || c[0] < -440;                      // preview: the core farm only
  const ord = order || ((x, y) => THREE.MathUtils.clamp((y + 130) / 260, 0, 1));
  const P = (x, y, h) => [x - O[0], h, -(y - O[1])];               // local metres -> three
  const uGrow = { value: preview ? 2 : 1.25 };
  const A = { solid: acc(), crop: acc(), glass: acc(), glow: acc(), water: acc() };
  const lines = [];
  const outline = (ring, lift = 0.6) => {                        // draped amber linework, densified to follow the ground
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i], b = ring[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 5));
      for (let k = 0; k < n; k++) {
        const p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n], q = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n];
        lines.push(...P(p[0], p[1], ground(p[0], p[1]) + lift), ...P(q[0], q[1], ground(q[0], q[1]) + lift));
      }
    }
  };
  const circle = (c, r, n = 20) => Array.from({ length: n + 1 }, (_, k) => [c[0] + r * Math.cos(k / n * 6.2832), c[1] + r * Math.sin(k / n * 6.2832)]);

  // box in a local frame: centre (cx, cy) ground h0, axis angle ang (radians, x-axis along u), half sizes hu, hv, y0..y1
  const box = (a, cx, cy, ang, hu, hv, y0, y1, col, base, o, top = col) => {
    const cu = Math.cos(ang), su = Math.sin(ang);
    const w = (u, v, y) => P(cx + u * cu - v * su, cy + u * su + v * cu, y);
    const c = [[-hu, -hv], [hu, -hv], [hu, hv], [-hu, hv]];
    a.quad(w(...c[0], y1), w(...c[3], y1), w(...c[2], y1), w(...c[1], y1), top, base, o);
    for (let i = 0; i < 4; i++) { const p = c[i], q = c[(i + 1) % 4]; a.quad(w(...p, y0), w(...q, y0), w(...q, y1), w(...p, y1), col, base, o); }
  };
  const blob = (a, x, y, r, h, col, base, o, detail = 0, seed = 0) => {   // icosahedron crown / shrub
    const g = new THREE.IcosahedronGeometry(1, detail).toNonIndexed(), p = g.attributes.position;
    for (let i = 0; i < p.count; i += 3) {
      const v = [0, 1, 2].map(k => { const j = i + k, s = 1 + (hash(seed + j * 0.37) - 0.5) * 0.16; return P(x + p.getX(j) * r * s, y - p.getZ(j) * r * s, base + h + p.getY(j) * h * 0.75 * s); });
      const sh = 0.86 + 0.28 * hash(seed * 3.1 + i);
      a.tri(v[0], v[1], v[2], col.clone().multiplyScalar(sh), base, o);
    }
  };

  // ---- raised beds (market garden + mandala keyholes): soil sides, crop tops ----
  const bed = (ring, h, seed) => {
    const r = simplify(ring);
    if (r.length < 3) return;
    const c = centroidOf(r); if (!keep(c)) return;
    const o = ord(c[0], c[1]);
    const gs = r.map(p => ground(p[0], p[1]));
    const fresh = hash(seed * 1.7) < 0.14;
    const top = fresh ? COL.soilTop : COL.crops[Math.floor(hash(seed) * COL.crops.length)];
    const idx = THREE.ShapeUtils.triangulateShape(r.map(p => new THREE.Vector2(p[0], p[1])), []);
    for (const [i, j, k] of idx) {
      const v = [i, j, k].map(n => P(r[n][0], r[n][1], gs[n] + h));
      // shapes come back CCW for CCW input; make every top face point up
      const up = (v[1][0] - v[0][0]) * (v[2][2] - v[0][2]) - (v[1][2] - v[0][2]) * (v[2][0] - v[0][0]);
      if (up < 0) A.crop.tri(v[0], v[1], v[2], top, (gs[i] + gs[j] + gs[k]) / 3, o); else A.crop.tri(v[0], v[2], v[1], top, (gs[i] + gs[j] + gs[k]) / 3, o);
    }
    for (let i = 0; i < r.length; i++) {
      const n = (i + 1) % r.length;
      A.solid.quad(P(r[i][0], r[i][1], gs[i] - 0.15), P(r[n][0], r[n][1], gs[n] - 0.15), P(r[n][0], r[n][1], gs[n] + h), P(r[i][0], r[i][1], gs[i] + h), COL.soil, gs[i], o);
    }
  };
  (L.farm_market_garden || []).forEach((f, i) => polys(f).forEach(p => bed(p[0], 0.32, i + 1)));
  (L.farm_mandala_garden || []).forEach((f, i) => polys(f).forEach(p => { bed(p[0], 0.38, 100 + i); outline(p[0]); }));

  // the plan puts greenhouse 3 on top of the mandala + herb spiral: leave it out (noted for Mike)
  const spiral = (L.farm_herb_spiral || []).flatMap(f => polys(f).map(p => centroidOf(p[0])));
  const overlapsSpiral = c => spiral.some(q => Math.hypot(c[0] - q[0], c[1] - q[1]) < 10);
  // ---- greenhouses: hoop houses, translucent skin that glows warm from inside ----
  for (const f of L.farm_greenhouses || []) for (const p of polys(f)) {
    const r = p[0], c = centroidOf(r.slice(0, -1)); if (!keep(c) || overlapsSpiral(c)) continue;
    const e1 = [r[1][0] - r[0][0], r[1][1] - r[0][1]], e2 = [r[2][0] - r[1][0], r[2][1] - r[1][1]];
    const l1 = Math.hypot(...e1), l2 = Math.hypot(...e2);
    const [ax, len, wid] = l1 >= l2 ? [e1, l1, l2] : [e2, l2, l1];
    const ang = Math.atan2(ax[1], ax[0]), cu = Math.cos(ang), su = Math.sin(ang);
    const g0 = Math.max(...r.map(q => ground(q[0], q[1]))), o = ord(c[0], c[1]);
    const R = wid / 2 - 0.15, H = 3.6, NS = lod === 'high' ? 12 : 8;
    const w = (u, v, y) => P(c[0] + u * cu - v * su, c[1] + u * su + v * cu, y);
    const arc = (k, rr = R, hh = H) => { const a = Math.PI * k / NS; return [rr * Math.cos(a), g0 + 0.35 + hh * Math.sin(a)]; };
    const hl = len / 2 - 0.2;
    box(A.solid, c[0], c[1], ang, hl + 0.1, R + 0.1, g0 - 0.3, g0 + 0.35, COL.ghSill, g0, o);      // timber sill
    for (let k = 0; k < NS; k++) {
      const [v0, y0] = arc(k), [v1, y1] = arc(k + 1);
      A.glass.quad(w(-hl, v0, y0), w(hl, v0, y0), w(hl, v1, y1), w(-hl, v1, y1), COL.trim, g0, o);
      A.glass.tri(w(hl, 0, g0 + 0.35), w(hl, v0, y0), w(hl, v1, y1), COL.trim, g0, o);
      A.glass.tri(w(-hl, 0, g0 + 0.35), w(-hl, v1, y1), w(-hl, v0, y0), COL.trim, g0, o);
    }
    const ribs = Math.round(len / (lod === 'high' ? 2.4 : 4.5));
    for (let i = 0; i <= ribs; i++) {
      const u = -hl + 2 * hl * i / ribs;
      for (let k = 0; k < NS; k++) {
        const [v0, y0] = arc(k, R + 0.04, H + 0.04), [v1, y1] = arc(k + 1, R + 0.04, H + 0.04);
        A.solid.quad(w(u - 0.07, v0, y0), w(u + 0.07, v0, y0), w(u + 0.07, v1, y1), w(u - 0.07, v1, y1), COL.ghFrame, g0, o);
      }
    }
    // inside: a warm-lit floor and three rows of plants
    A.glow.quad(w(-hl, -R, g0 + 0.37), w(-hl, R, g0 + 0.37), w(hl, R, g0 + 0.37), w(hl, -R, g0 + 0.37), COL.glow, g0, o);
    for (const v of [-R * 0.62, 0, R * 0.62]) box(A.crop, c[0] - v * su, c[1] + v * cu, ang, hl - 1.2, 0.45, g0 + 0.35, g0 + 1.0, COL.ghSill, g0, o, COL.plant);
    outline([...r]);
  }

  // ---- the barn: red board walls, charcoal gable roof, big doors on the east gable, a lit hayloft window ----
  for (const f of L.farm_buildings || []) for (const p of polys(f)) {
    const r = p[0], c = centroidOf(r.slice(0, -1)); if (!keep(c)) continue;
    const e1 = [r[1][0] - r[0][0], r[1][1] - r[0][1]], e2 = [r[2][0] - r[1][0], r[2][1] - r[1][1]];
    const l1 = Math.hypot(...e1), l2 = Math.hypot(...e2);
    const [ax, len, wid] = l1 >= l2 ? [e1, l1, l2] : [e2, l2, l1];
    const ang = Math.atan2(ax[1], ax[0]), cu = Math.cos(ang), su = Math.sin(ang);
    const g0 = Math.max(...r.map(q => ground(q[0], q[1]))), o = ord(c[0], c[1]);
    const hu = len / 2, hv = wid / 2, eave = g0 + 4.4, ridge = g0 + 8.2;
    const w = (u, v, y) => P(c[0] + u * cu - v * su, c[1] + u * su + v * cu, y);
    box(A.solid, c[0], c[1], ang, hu, hv, g0 - 0.6, eave, COL.barn, g0, o, COL.roof);
    for (const s of [-1, 1]) {   // gable triangles + roof planes (with overhang)
      A.solid.tri(w(s * hu, -hv, eave), w(s * hu, hv, eave), w(s * hu, 0, ridge), COL.barn, g0, o);
      A.solid.tri(w(s * hu, hv, eave), w(s * hu, -hv, eave), w(s * hu, 0, ridge), COL.barn, g0, o);
      const ov = 0.6, vv = s * (hv + ov), yy = eave - ov * (ridge - eave) / hv;
      A.solid.quad(w(-hu - 0.5, vv, yy), w(hu + 0.5, vv, yy), w(hu + 0.5, 0, ridge + 0.05), w(-hu - 0.5, 0, ridge + 0.05), COL.roof, g0, o);
    }
    const east = Math.cos(ang) >= 0 ? 1 : -1, ue = east * (hu + 0.06);
    box(A.solid, c[0] + ue * cu, c[1] + ue * su, ang, 0.05, 2.1, g0, g0 + 3.6, COL.door, g0, o, COL.door);           // doors
    box(A.solid, c[0] + ue * cu, c[1] + ue * su, ang, 0.08, 2.3, g0 + 3.6, g0 + 3.8, COL.trim, g0, o);                // lintel
    A.glow.quad(w(ue + east * 0.04, -0.8, g0 + 5.0), w(ue + east * 0.04, 0.8, g0 + 5.0), w(ue + east * 0.04, 0.8, g0 + 6.4), w(ue + east * 0.04, -0.8, g0 + 6.4), COL.glow, g0, o);
    outline([...r]);
  }

  // ---- herb spiral: a stone wall coiling up to ~1.3 m, herbs on top ----
  for (const f of L.farm_herb_spiral || []) for (const p of polys(f)) {
    const ring = p[0], c0 = centroidOf(ring), c = [c0[0], c0[1]]; if (!keep(c)) continue;
    const g0 = ground(c[0], c[1]), o = ord(c[0], c[1]), N = lod === 'high' ? 46 : 26, turns = 2.2;
    for (let i = 0; i < N; i++) {
      const t = i / N, th = t * turns * 6.2832, rr = 3.6 * (1 - t) + 0.5, h = 0.35 + 1.0 * t;
      const x = c[0] + rr * Math.cos(th), y = c[1] + rr * Math.sin(th), seg = (turns * 6.2832 / N) * rr * 0.55 + 0.25;
      box(A.solid, x, y, th + Math.PI / 2, seg, 0.28, g0 - 0.2, g0 + h, i % 2 ? COL.stone : COL.stone2, g0, o, COL.herb[i % 3]);
      if (lod === 'high' && i % 4 === 1) blob(A.solid, x - 0.4 * Math.cos(th), y - 0.4 * Math.sin(th), 0.45, 0.2, COL.herb[i % 3], g0 + h - 0.1, o, 0, i);
    }
    outline(circle(c, 4.4));
  }

  // ---- pond: flat water held by a low earth-and-stone rim, reeds at the edge ----
  for (const f of L.farm_pond || []) for (const p of polys(f)) {
    const r = simplify(p[0], 0.05), c = centroidOf(r); if (!keep(c)) continue;
    const o = ord(c[0], c[1]), gs = r.map(q => ground(q[0], q[1])), wl = Math.max(...gs) + 0.12;
    const idx = THREE.ShapeUtils.triangulateShape(r.map(q => new THREE.Vector2(q[0], q[1])), []);
    for (const [i, j, k] of idx) {
      const v = [i, j, k].map(n => P(r[n][0], r[n][1], wl));
      const up = (v[1][0] - v[0][0]) * (v[2][2] - v[0][2]) - (v[1][2] - v[0][2]) * (v[2][0] - v[0][0]);
      A.water.tri(v[0], up < 0 ? v[1] : v[2], up < 0 ? v[2] : v[1], COL.trim, wl, o);
    }
    for (let i = 0; i < r.length; i++) {        // rim: from the water's edge out 1.6 m to the ground
      const n = (i + 1) % r.length, out = q => { const d = [q[0] - c[0], q[1] - c[1]], l = Math.hypot(...d); return [q[0] + d[0] / l * 1.6, q[1] + d[1] / l * 1.6]; };
      const a = out(r[i]), b = out(r[n]);
      A.solid.quad(P(r[i][0], r[i][1], wl + 0.18), P(a[0], a[1], ground(a[0], a[1]) - 0.1), P(b[0], b[1], ground(b[0], b[1]) - 0.1), P(r[n][0], r[n][1], wl + 0.18), i % 3 ? COL.rim : COL.stone2, gs[i], o);
      A.solid.quad(P(r[i][0], r[i][1], wl - 0.4), P(r[i][0], r[i][1], wl + 0.18), P(r[n][0], r[n][1], wl + 0.18), P(r[n][0], r[n][1], wl - 0.4), COL.stone, gs[i], o);
      if (lod === 'high' && i % 2 === 0) blob(A.solid, (r[i][0] * 0.8 + a[0] * 0.2), (r[i][1] * 0.8 + a[1] * 0.2), 0.5, 0.45, COL.reed, wl, o, 0, i + 50);
    }
    outline([...r, r[0]]);
  }

  // ---- swales: low earth berms on contour with a hedge of shrubs on the downhill side ----
  for (const f of L.farm_swales || []) {
    const l = f.c; if (!keep(centroidOf(l))) continue;
    for (let i = 0; i < l.length - 1; i++) {
      const a = l[i], b = l[i + 1], d = [b[0] - a[0], b[1] - a[1]], len = Math.hypot(...d), nx = -d[1] / len * 1.3, ny = d[0] / len * 1.3;
      const ga = ground(a[0], a[1]), gb = ground(b[0], b[1]), o = ord(a[0], a[1]);
      const ha = i === 0 ? 0.15 : 0.6, hb = i === l.length - 2 ? 0.15 : 0.6;
      A.solid.quad(P(a[0] + nx, a[1] + ny, ga - 0.1), P(b[0] + nx, b[1] + ny, gb - 0.1), P(b[0], b[1], gb + hb), P(a[0], a[1], ga + ha), COL.berm, ga, o);
      A.solid.quad(P(a[0], a[1], ga + ha), P(b[0], b[1], gb + hb), P(b[0] - nx, b[1] - ny, gb - 0.1), P(a[0] - nx, a[1] - ny, ga - 0.1), COL.berm, ga, o);
      for (let s = 0; s < len; s += 3.6) {
        const x = a[0] + d[0] * s / len - nx * 1.6, y = a[1] + d[1] * s / len - ny * 1.6;
        blob(A.solid, x, y, 1.0, 0.8, COL.shrub[Math.floor(hash(x) * 3)], ground(x, y) - 0.2, ord(x, y), 0, x + y);
      }
    }
    lines.length; outline(l, 0.8);
  }

  // ---- food forest: fruit trees on the canopy circles, berry shrubs on the understory spots ----
  for (const f of L.farm_food_forest || []) for (const p of polys(f)) {
    const r = p[0], c = centroidOf(r.slice(0, -1)); if (!keep(c)) continue;
    const ext = Math.max(...r.map(q => Math.hypot(q[0] - c[0], q[1] - c[1])));
    const g0 = ground(c[0], c[1]), o = ord(c[0], c[1]), s = hash(c[0] * 0.3 + c[1]);
    if (f.p?.kind === 'canopy') {
      const cr = Math.min(ext, 6) * 0.62, th = 2.0;
      box(A.solid, c[0], c[1], s * 6, 0.18, 0.18, g0 - 0.2, g0 + th + 0.6, COL.trunk, g0, o);
      blob(A.solid, c[0], c[1], cr, cr * 0.85, COL.crown[Math.floor(s * 4)], g0 + th + cr * 0.55, o, lod === 'high' ? 1 : 0, s * 99);
      outline(circle(c, ext, 16));
    } else {
      blob(A.solid, c[0], c[1], Math.min(ext, 2) * 0.75, 0.7, COL.shrub[Math.floor(s * 3)], g0 - 0.1, o, 0, s * 77);
    }
  }

  // farmland boundary: drawing only
  for (const f of L.farmland || []) for (const p of polys(f)) if (!preview) outline(p[0], 0.9);

  // ---- materials ----
  const cropFrag = `{ vec2 q = vWp.xz; float m = fn(q * 1.7) * 0.55 + fn(q * 4.3) * 0.3 + fn(q * 0.35) * 0.15;
      float rz = vWp.z / 0.8, aa = clamp(1.0 - fwidth(rz) * 1.6, 0.0, 1.0);
      float rows = mix(0.55, smoothstep(0.2, 0.62, abs(fract(rz) - 0.5) * 2.0), aa);
      diffuseColor.rgb *= (0.6 + 0.55 * rows) * (0.78 + 0.42 * m); }`;
  const materials = {
    solid: growable(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide, flatShading: true }), uGrow),
    crop: growable(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true, side: THREE.DoubleSide }), uGrow, cropFrag),
    glass: growable(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, transparent: true, opacity: 0.5, depthWrite: false,
      side: THREE.DoubleSide, emissive: 0xffb36b, emissiveIntensity: 0.35 }), uGrow),
    glow: growable(new THREE.MeshBasicMaterial({ vertexColors: true }), uGrow),
    water: growable(new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: 0x1d3a42, roughness: 0.08, metalness: 0.35, emissive: 0x0b1c22, emissiveIntensity: 0.7 }), uGrow,
      '{ float m = fn(vWp.xz * 0.8) * 0.5 + fn(vWp.xz * 2.3) * 0.5; diffuseColor.rgb *= 0.85 + 0.3 * m; }'),
  };
  const group = new THREE.Group(); group.name = 'farm_concept';
  for (const k of ['crop', 'solid', 'water', 'glow', 'glass']) {
    if (!A[k].pos.length) continue;
    const m = new THREE.Mesh(A[k].geo(), materials[k]); m.name = `farm_${k}`; m.frustumCulled = false;
    if (k === 'glass') m.renderOrder = 2;
    group.add(m);
  }
  const lg = new LineSegmentsGeometry(); lg.setPositions(lines);
  const lm = new LineMaterial({ color: 0xEA824E, linewidth: 2, transparent: true, opacity: preview ? 0 : 0, depthTest: false, depthWrite: false });
  const ol = new LineSegments2(lg, lm); ol.renderOrder = 20; ol.frustumCulled = false; ol.visible = !preview;
  group.add(ol);
  group.userData = { uGrow, outline: ol, materials };
  return group;
}

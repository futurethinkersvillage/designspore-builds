// Trees (placed from the imagery) and existing buildings (extruded footprints). Both sit on the displayed ground
// and grow only where the land has turned real, via the shared cut + reveal uniforms.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { U, REVEAL_GLSL } from './land.js';
import { polysOf } from './sheet.js';

// aBase = (east, north, true ground height). Grows the local geometry from y = 0 and drops it onto the shown ground.
function risingMaterial(mat, instanced) {
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\n${REVEAL_GLSL}\nuniform float uTreeFade;
attribute vec3 aBase;\nvarying float vGrow;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float grow = smoothstep(0.9, 1.0, revealAt(aBase.xy, aBase.z)) * step(aBase.z, uCut + 0.5);
        ${instanced ? 'grow *= uTreeFade;' : ''}
        vGrow = grow;
        ${instanced ? 'transformed.y *= max(grow, 0.0001);' : 'transformed.y = aBase.z + (transformed.y - aBase.z) * max(grow, 0.0001);'}`)
      .replace('#include <project_vertex>', `
        vec4 mvPosition = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        mvPosition.y += displayH(aBase.z) - aBase.z;
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vGrow;')
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\nif (vGrow < 0.002) discard;');
  };
  return mat;
}

// Wells Gray conifers are spruce and lodgepole pine: tall and SKINNY (crown width ~a quarter of the height).
// Both shapes are 1 m tall with the base at y = 0; per-tree height comes from the instance scale.
const paintGeo = (g, c) => { const col = new Float32Array(g.attributes.position.count * 3); for (let i = 0; i < col.length; i += 3) col.set(c, i); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g; };
const mergeTree = parts => mergeGeometries(parts.map(([g, c]) => { g = g.index ? g.toNonIndexed() : g; g.deleteAttribute('uv'); return paintGeo(g, c); }));
// shaggy, uneven branch tips instead of clean cones (reviewers: "cartoon cones"): every vertex pushed in/out by a
// hash of its own position, so the copies of a vertex on neighbouring faces move together (no cracks)
function shag(g, amt = 0.35, minY = 0.1) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (y < minY) continue;
    const h = Math.sin(Math.round(x * 1e4) * 12.9898 + Math.round(y * 1e4) * 78.233 + Math.round(z * 1e4) * 37.719) * 43758.5453;
    const k = 1 + (h - Math.floor(h) - 0.5) * 2 * amt;
    p.setXYZ(i, x * k, y + (k - 1) * 0.02, z * k);
  }
  g.computeVertexNormals(); return g;
}
function treeGeometry() {
  // spruce: narrow spire of many short, drooping whorls down to near the ground
  const parts = [[new THREE.CylinderGeometry(0.012, 0.022, 0.16, 5).translate(0, 0.08, 0), [0.3, 0.21, 0.15]]];
  const tiers = [[0.14, 0.2, 0.06, 0.82], [0.13, 0.19, 0.16, 0.88], [0.118, 0.18, 0.26, 0.92], [0.104, 0.17, 0.36, 0.96],
    [0.09, 0.16, 0.46, 1.0], [0.076, 0.15, 0.56, 1.04], [0.06, 0.14, 0.66, 1.08], [0.044, 0.13, 0.76, 1.12], [0.026, 0.14, 0.86, 1.15]];
  tiers.forEach(([r, h, y, k], i) => parts.push([new THREE.ConeGeometry(r, h, 9, 1, true).rotateY(i * 0.7).translate(0, y + h / 2, 0), [k, k, k]]));
  return shag(mergeTree(parts), 0.32);
}
function roundTreeGeometry() {
  // lodgepole pine: tall bare trunk, a short, ragged crown up top
  return shag(mergeTree([
    [new THREE.CylinderGeometry(0.01, 0.02, 0.62, 5).translate(0, 0.31, 0), [0.34, 0.24, 0.17]],
    [new THREE.ConeGeometry(0.1, 0.22, 9, 1, true).translate(0, 0.58, 0), [0.92, 0.92, 0.92]],
    [new THREE.ConeGeometry(0.085, 0.22, 9, 1, true).rotateY(0.6).translate(0, 0.7, 0), [1.0, 1.0, 1.0]],
    [new THREE.ConeGeometry(0.06, 0.24, 9, 1, true).rotateY(1.3).translate(0, 0.82, 0), [1.08, 1.08, 1.08]],
  ]), 0.38, 0.5);
}
function broadleafGeometry() {
  // aspen / cottonwood / birch: pale trunk, a loose rounded crown of a few lumpy clusters (riparian + meadow edges)
  const blob = (r, x, y, z, k) => [new THREE.IcosahedronGeometry(r, 2).translate(x, y, z), [k, k, k]];
  return shag(mergeTree([
    [new THREE.CylinderGeometry(0.014, 0.024, 0.6, 6).translate(0, 0.3, 0), [1.7, 1.65, 1.5]],
    blob(0.15, 0, 0.62, 0, 0.95), blob(0.11, 0.08, 0.78, 0.03, 1.05), blob(0.1, -0.07, 0.74, -0.05, 1.0), blob(0.08, 0.02, 0.9, -0.02, 1.12),
  ]), 0.22, 0.45);
}

function inPoly(x, y, ring) {
  let ins = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}

// Tree spots from colour: dark, green-dominant pixels. Drone photo where it covers, Esri near mosaic elsewhere.
// clear = [[x, y, r], …] keep-out circles (buildings); isWater(x, y) keeps trees out of creeks and lakes.
export function placeTrees({ heightAt, droneSample, nearSample, L, isWater = () => false, clear = [], half = 2300, spacing = 5.5, max = 140000, seed = 7 }) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  // the golf course keeps its trees (Mike: they belong there); water and buildings don't get any
  const avoid = [...(L.lakes || []), ...(L.utility_buildings || []), ...(L.accomodations_for_rent || []),
    ...(L.public_areas || []), ...(L.bathroom_shower_house || [])].flatMap(f => polysOf(f).map(p => p[0]));
  const boxes = avoid.map(r => { let a = [1e9, 1e9, -1e9, -1e9]; for (const [x, y] of r) a = [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)]; return [a, r]; });
  const out = [];
  for (let y = -half; y < half; y += spacing) for (let x = -half; x < half; x += spacing) {
    const px = x + (rnd() - 0.5) * spacing, py = y + (rnd() - 0.5) * spacing;
    // thin out toward the edge of the tree zone so it never ends in a hard line (a "fence" or a carpet edge)
    const edge = (half - Math.hypot(px, py)) / 1300;   // long, soft falloff: no visible ring where the 3D forest ends
    if (edge <= 0 || rnd() > edge * edge) continue;
    const c = droneSample(px, py) || nearSample(px, py);
    if (!c) continue;
    // canopy is dark and not yellow-green (golf grass in shade is ~[99,114,20]; conifer canopy ~[23,34,19])
    const [r, g, b] = c, lum = (r + g + b) / 3;
    const treeish = lum < 56 && lum > 8 && g >= r && b > g * 0.35;
    if (!treeish || rnd() > 0.9) continue;
    if (clear.some(([cx, cy, cr]) => (px - cx) ** 2 + (py - cy) ** 2 < cr * cr)) continue;
    if (isWater(px, py) || isWater(px + 4, py) || isWater(px - 4, py) || isWater(px, py + 4) || isWater(px, py - 4)) continue;
    if (boxes.some(([a, ring]) => px > a[0] - 3 && px < a[2] + 3 && py > a[1] - 3 && py < a[3] + 3 && inPoly(px, py, ring))) continue;
    out.push(px, py, heightAt(px, py), 16 + rnd() * 18, rnd(), (r << 16) | (g << 8) | b); // keep the imagery colour
  }
  // over budget: thin evenly (never stop part-way, which leaves a hard line where the trees end)
  const n = out.length / 6;
  if (n > max) {
    const keep = [];
    for (let i = 0; i < n; i++) if (rnd() < max / n) keep.push(...out.slice(i * 6, i * 6 + 6));
    return keep;
  }
  return out;
}

// spots = flat [x, y, groundH, height, rnd, rgb] per tree. Two shapes so the forest isn't a field of identical cones;
// each tree takes its colour from the imagery under it, so the 3D forest matches the photo it stands on.
const FOLIAGE = new THREE.Color(0x2c4424);
export function makeTrees(spots) {
  const group = new THREE.Group();
  const all = []; for (let i = 0; i < spots.length; i += 6) all.push(spots.slice(i, i + 6));
  // lighter, yellower canopy in the photo = aspen / cottonwood / birch; the dark rest = spruce + lodgepole pine
  const broad = t => { const r = (t[5] >> 16) & 255, g = (t[5] >> 8) & 255, b = t[5] & 255; return (r + g + b) / 3 > 38 && g > b * 1.9 && r > b * 1.3; };
  const kinds = [[treeGeometry(), all.filter(t => !broad(t) && t[4] >= 0.3)], [roundTreeGeometry(), all.filter(t => !broad(t) && t[4] < 0.3)],
    [broadleafGeometry(), all.filter(broad)]];
  const m = new THREE.Matrix4(), col = new THREE.Color(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (const [geo, list] of kinds) {
    if (geo.attributes.uv) geo.deleteAttribute('uv');
    const n = list.length, base = new Float32Array(n * 3);
    // a faint green self-light so low sun / dusk never turns the near trees into black cut-outs (reviewers, cut 6)
    const mesh = new THREE.InstancedMesh(geo, risingMaterial(new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x101a0e }), true), n);
    list.forEach(([x, y, h, ht, r, rgb], i) => {
      base.set([x, y, h], i * 3);
      const w = 0.82 + ((r * 7919) % 1) * 0.36, round = geo !== kinds[0][0];
      q.setFromEuler(e.set(0, r * 6.28, 0));
      m.compose(new THREE.Vector3(x, h, -y), q, new THREE.Vector3(ht * w, ht, ht * w));
      mesh.setMatrixAt(i, m);
      col.setRGB(((rgb >> 16) & 255) / 255, ((rgb >> 8) & 255) / 255, (rgb & 255) / 255, THREE.SRGBColorSpace).multiplyScalar(1.3 + r * 0.5)
        .lerp(FOLIAGE, 0.18);   // canopy pixels are near-black in shade: pull toward a real conifer green
      mesh.setColorAt(i, col);
    });
    geo.setAttribute('aBase', new THREE.InstancedBufferAttribute(base, 3));
    mesh.frustumCulled = false;
    group.add(mesh);
  }
  return group;
}

const HEIGHTS = { 'Top House': 7, 'Bottom House': 6.5, 'Shop': 5, 'Wood Shop': 4.5, 'Mill': 4, 'Electrical House': 3,
  'Shipping Container 1': 2.6, 'Shipping Container 2': 2.6, 'Maker RV': 3.4, 'Office RV': 3.4, 'LeanTo': 3, 'Shop LeanTo': 3, 'Lake Storage': 3 };

export function makeBuildings(L, heightAt) {
  const geos = [];
  for (const name of ['utility_buildings', 'accomodations_for_rent', 'public_areas', 'bathroom_shower_house']) {
    for (const f of L[name] || []) {
      const h = HEIGHTS[f.p.Name] || (name === 'public_areas' ? 5 : 3.6);
      for (const poly of polysOf(f)) {
        const ring = poly[0];
        if (ring.length < 3) continue;
        const cx = ring.reduce((a, p) => a + p[0], 0) / ring.length, cy = ring.reduce((a, p) => a + p[1], 0) / ring.length;
        const gh = Math.min(...ring.map(p => heightAt(p[0], p[1])));
        const shape = new THREE.Shape(ring.map(p => new THREE.Vector2(p[0], p[1])));
        const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, gh, 0); // extrusions are already non-indexed
        g.setAttribute('aBase', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3).map((_, i) => [cx, cy, gh][i % 3]), 3));
        geos.push(g);
      }
    }
  }
  const mat = risingMaterial(new THREE.MeshLambertMaterial({ color: 0xe9e1d3 }), false);
  const mesh = new THREE.Mesh(mergeGeometries(geos), mat);
  mesh.frustumCulled = false;
  return mesh;
}

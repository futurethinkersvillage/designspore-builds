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
// a whorl of branches, not a clean cone: the rim alternates long drooping branch tips and short gaps (10-31: next to the
// real 360s the trees read as cartoon cones)
function branchTier(r, h, seg) {
  const g = new THREE.ConeGeometry(r, h, seg, 1, true), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i); if (y > 0) continue;
    const x = p.getX(i), z = p.getZ(i), odd = Math.round(Math.atan2(z, x) / (2 * Math.PI / seg)) & 1;
    p.setXYZ(i, x * (odd ? 0.74 : 1.06), y + (odd ? h * 0.12 : -h * 0.1), z * (odd ? 0.74 : 1.06));
  }
  return g;
}
// branch tips catch the light, the inside of each tier sits in shade: multiplies the tint by how far out from the axis a vertex is
function tipShade(g, minY = 0.2) {
  const p = g.attributes.position, c = g.attributes.color;
  let i = 0; for (; i < p.count; i++) {
    const y = p.getY(i); if (y < minY) continue;
    const tierR = 0.15 * (1.08 - y), d = Math.hypot(p.getX(i), p.getZ(i)) / Math.max(tierR, 0.01), k = 0.5 + 0.85 * Math.min(d, 1.1);
    c.setXYZ(i, c.getX(i) * k, c.getY(i) * k, c.getZ(i) * k);
  }
  return g;
}
// smooth normals pointing away from the crown's core: the tree shades as one soft volume instead of flat facets
function volume(g, cy = null, keep = 0) {
  const p = g.attributes.position, n = g.attributes.normal, v = new THREE.Vector3(), f = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (cy === null) v.set(x, Math.hypot(x, z) * 0.7 + 0.004, z); else v.set(x, y - cy, z);
    v.normalize(); if (keep) { f.set(n.getX(i), n.getY(i), n.getZ(i)); v.addScaledVector(f, keep).normalize(); } n.setXYZ(i, v.x, v.y, v.z);
  }
  return g;
}
// leaf clumps: each face a little lighter or darker, so a crown never reads as a smooth ball
function mottle(g) {
  const c = g.attributes.color, p = g.attributes.position;
  for (let i = 0; i < p.count; i += 3) {
    if (p.getY(i) < 0.45) continue;
    const h = Math.sin(p.getX(i) * 913.1 + p.getY(i) * 517.7 + p.getZ(i) * 271.3) * 43758.5453, k = 0.72 + 0.56 * (h - Math.floor(h));
    for (let j = 0; j < 3; j++) c.setXYZ(i + j, c.getX(i + j) * k, c.getY(i + j) * k, c.getZ(i + j) * k);
  }
  return g;
}
function treeGeometry() {
  // spruce: narrow spire of many short, drooping whorls down to near the ground
  const parts = [[new THREE.CylinderGeometry(0.012, 0.022, 0.16, 5).translate(0, 0.08, 0), [0.3, 0.21, 0.15]]];
  const tiers = [[0.14, 0.2, 0.06, 0.82], [0.13, 0.19, 0.16, 0.88], [0.118, 0.18, 0.26, 0.92], [0.104, 0.17, 0.36, 0.96],
    [0.09, 0.16, 0.46, 1.0], [0.076, 0.15, 0.56, 1.04], [0.06, 0.14, 0.66, 1.08], [0.044, 0.13, 0.76, 1.12], [0.026, 0.14, 0.86, 1.15]];
  tiers.forEach(([r, h, y, k], i) => parts.push([branchTier(r, h, 12).rotateY(i * 0.7).translate(0, y + h / 2, 0), [k, k, k]]));
  return volume(tipShade(shag(mergeTree(parts), 0.18), 0.2));
}
function roundTreeGeometry() {
  // lodgepole pine: tall bare trunk, a short, ragged crown up top
  return volume(tipShade(shag(mergeTree([
    [new THREE.CylinderGeometry(0.01, 0.02, 0.62, 5).translate(0, 0.31, 0), [0.34, 0.24, 0.17]],
    [branchTier(0.1, 0.16, 12).translate(0, 0.54, 0), [0.92, 0.92, 0.92]],
    [branchTier(0.095, 0.16, 12).rotateY(0.6).translate(0, 0.62, 0), [0.96, 0.96, 0.96]],
    [branchTier(0.08, 0.16, 12).rotateY(1.3).translate(0, 0.72, 0), [1.0, 1.0, 1.0]],
    [branchTier(0.06, 0.16, 10).rotateY(2.1).translate(0, 0.82, 0), [1.08, 1.08, 1.08]],
    [branchTier(0.035, 0.14, 8).rotateY(2.9).translate(0, 0.92, 0), [1.12, 1.12, 1.12]],
  ]), 0.2, 0.5), 0.44));
}
function broadleafGeometry() {
  // aspen / cottonwood / birch: pale trunk, a loose rounded crown of a few lumpy clusters (riparian + meadow edges)
  const blob = (r, x, y, z, k) => [new THREE.IcosahedronGeometry(r, 2).translate(x, y, z), [k, k, k]];
  return mottle(volume(shag(mergeTree([
    // trunk tint cancels the aspen leaf colour it is multiplied by: pale grey-white bark (i7: lime 'bamboo poles')
    [new THREE.CylinderGeometry(0.014, 0.024, 0.6, 6).translate(0, 0.3, 0), [2.6, 1.45, 6.0]],
    blob(0.15, 0, 0.62, 0, 0.95), blob(0.11, 0.08, 0.78, 0.03, 1.05), blob(0.1, -0.07, 0.74, -0.05, 1.0), blob(0.08, 0.02, 0.9, -0.02, 1.12),
  ]), 0.22, 0.45), 0.7, 0.9));
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
// canopy = { rect, res, w, h, data } (data/canopy.png, learned from the labelled spots — tools/ground_classes.py):
// over the drone survey trees go exactly where the photo shows canopy, ~4.5 m apart so the crowns close up like
// the real forest; the colour rule only fills in beyond the survey.
const CANOPY_INSET = 0.75;
export function placeTrees({ heightAt, droneSample, nearSample, L, isWater = () => false, clear = [], half = 2300, spacing = 5.5, max = 140000, seed = 7, canopy = null }) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  // the golf course keeps its trees (Mike: they belong there); water and buildings don't get any
  const avoid = [...(L.lakes || []), ...(L.utility_buildings || []), ...(L.accomodations_for_rent || []),
    // the planned farm's beds, greenhouses, barn, mandala and pond (i7: trees stood on the bed ends)
    ...['farm_market_garden', 'farm_greenhouses', 'farm_buildings', 'farm_mandala_garden', 'farm_pond'].flatMap(n => L[n] || []),
    ...(L.public_areas || []), ...(L.bathroom_shower_house || [])].flatMap(f => polysOf(f).map(p => p[0]));
  const boxes = avoid.map(r => { let a = [1e9, 1e9, -1e9, -1e9]; for (const [x, y] of r) a = [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)]; return [a, r]; });
  const out = [];
  const inSurvey = (x, y) => canopy && x > canopy.rect[0] && x < canopy.rect[2] && y > canopy.rect[1] && y < canopy.rect[3]
    && canopy.data[(Math.floor((canopy.rect[3] - y) / canopy.res) * canopy.w + Math.floor((x - canopy.rect[0]) / canopy.res))] !== undefined
    && canopy.cover[(Math.floor((canopy.rect[3] - y) / canopy.res) * canopy.w + Math.floor((x - canopy.rect[0]) / canopy.res))];
  const canopyAt = (x, y) => canopy.data[Math.floor((canopy.rect[3] - y) / canopy.res) * canopy.w + Math.floor((x - canopy.rect[0]) / canopy.res)] > 127;
  // the survey's real treetops (tools/treetops.py, Mike 10-31: "exact positions"): each at its measured spot and height. The height map stops at 25.5 m, so those vary upward
  const tops5 = {}, nearTop = (x, y) => { const a = Math.floor(x / 6), b = Math.floor(y / 6); for (let i = -1; i < 2; i++) for (let j = -1; j < 2; j++) for (const [p, q] of tops5[`${a + i},${b + j}`] || []) if ((x - p) ** 2 + (y - q) ** 2 < 30) return true; return false; };
  if (canopy?.tops) for (const [px, py, h0] of canopy.tops) {
    if (clear.some(([qx, qy, qr]) => (px - qx) ** 2 + (py - qy) ** 2 < 0.36 * qr * qr) || isWater(px, py)) continue;   // a measured tree only gives way to what's really under it, not to a keep-out margin
    const c = droneSample(px, py) || nearSample(px, py) || [40, 60, 30];
    (tops5[`${Math.floor(px / 6)},${Math.floor(py / 6)}`] ??= []).push([px, py]);
    out.push(px, py, heightAt(px, py), h0 >= 25 ? 25 + rnd() * 9 : h0, rnd(), (c[0] << 16) | (c[1] << 8) | c[2]);
  }
  if (canopy) {
    const sp = 7, [cx0, cy0, cx1, cy1] = canopy.rect;   // 7 m apart, big trees (Mike 10-29, twice: way too dense)
    for (let y = cy0 + sp / 2; y < cy1; y += sp) for (let x = cx0 + sp / 2; x < cx1; x += sp) {
      const px = x + (rnd() - 0.5) * sp * 0.8, py = y + (rnd() - 0.5) * sp * 0.8;
      if (!inSurvey(px, py) || !canopyAt(px, py) || nearTop(px, py)) continue;   // the canopy map fills in only where no measured tree stands
      // how deep inside the canopy this spot is (0.75 m steps, 8 directions): edge trees are sized so their crown
      // (radius ≈ 0.14 × height) stays inside the real canopy, the way forest edges taper to smaller trees
      let depth = 0;
      for (let rr = 0.75; rr <= 4.5; rr += 0.75) {
        let ok = true;
        for (let k = 0; k < 8 && ok; k++) ok = canopyAt(px + Math.cos(k * 0.785) * rr, py + Math.sin(k * 0.785) * rr);
        if (!ok) break; depth = rr;
      }
      if (depth < CANOPY_INSET) continue;
      const maxH = (depth + 0.6) / 0.14;
      if (clear.some(([qx, qy, qr]) => (px - qx) ** 2 + (py - qy) ** 2 < qr * qr)) continue;
      if (isWater(px, py)) continue;
      const c = droneSample(px, py) || nearSample(px, py) || [40, 60, 30];
      out.push(px, py, heightAt(px, py), Math.min(20 + rnd() * 14, maxH), rnd(), (c[0] << 16) | (c[1] << 8) | c[2]);
    }
  }
  // the creek banks: the canopy map under-reads these (the 360s show spruce and cottonwood right along Hemp Creek, Mike
  // 10-30: trees missing), so any dark-green spot 6–22 m from flowing water gets a tree too
  if (canopy?.cls) {
    const sp = 9, [cx0, cy0, cx1, cy1] = canopy.rect, clsAt = (x, y) => canopy.cls[Math.floor((canopy.rect[3] - y) / canopy.res) * canopy.w + Math.floor((x - canopy.rect[0]) / canopy.res)];
    for (let y = cy0 + sp; y < cy1 - sp; y += sp) for (let x = cx0 + sp; x < cx1 - sp; x += sp) {
      const px = x + (rnd() - 0.5) * sp * 0.8, py = y + (rnd() - 0.5) * sp * 0.8;
      if (!inSurvey(px, py) || canopyAt(px, py) || clsAt(px, py) === 9 || clsAt(px, py) === 8 || isWater(px, py)) continue;
      let near = false, tooNear = false;
      for (let k = 0; k < 8; k++) { if (clsAt(px + Math.cos(k * 0.785) * 18, py + Math.sin(k * 0.785) * 18) === 9) near = true; if (clsAt(px + Math.cos(k * 0.785) * 5, py + Math.sin(k * 0.785) * 5) === 9) tooNear = true; }
      if (!near || tooNear) continue;
      const c = droneSample(px, py) || nearSample(px, py); if (!c) continue;
      if (!(c[1] > c[0] * 1.06 && c[1] > c[2] * 1.03 && (c[0] + c[1] + c[2]) / 3 < 95)) continue;
      if (clear.some(([qx, qy, qr]) => (px - qx) ** 2 + (py - qy) ** 2 < qr * qr)) continue;
      if (boxes.some(([b, r]) => px > b[0] && px < b[2] && py > b[1] && py < b[3] && inPoly(px, py, r))) continue;
      out.push(px, py, heightAt(px, py), 13 + rnd() * 13, rnd(), (c[0] << 16) | (c[1] << 8) | c[2]);
    }
  }
  for (let y = -half; y < half; y += spacing) for (let x = -half; x < half; x += spacing) {
    const px = x + (rnd() - 0.5) * spacing, py = y + (rnd() - 0.5) * spacing;
    if (inSurvey(px, py)) continue;   // the canopy map decides there
    // thin out toward the edge of the tree zone so it never ends in a hard line (a "fence" or a carpet edge)
    const edge = (half - Math.hypot(px, py)) / 1300;   // long, soft falloff: no visible ring where the 3D forest ends
    if (edge <= 0 || rnd() > edge * edge) continue;
    const c = droneSample(px, py) || nearSample(px, py);
    if (!c) continue;
    // canopy is dark and not yellow-green (golf grass in shade is ~[99,114,20]; conifer canopy ~[23,34,19])
    const [r, g, b] = c, lum = (r + g + b) / 3;
    // off the survey only clearly dark-GREEN forest (the satellite's hill shadows and dark grass made trees on open
    // hillsides and fields — Mike 10-29)
    const treeish = lum < 48 && lum > 10 && g > r * 1.08 && g > b * 1.05 && b > g * 0.35;
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
  // One forest everywhere (Mike 10-29: different-looking trees inside the property line; "they're mostly pine"). The
  // valley is Interior Cedar–Hemlock / Douglas-fir country: mostly lodgepole pine, then Douglas-fir / hybrid spruce,
  // with aspen / birch / cottonwood only where the canopy is clearly yellow-green broadleaf. The same rule and the
  // same colours apply on and off the drone survey (the autumn drone photo and the summer satellite photo no longer
  // set the look), so the property line doesn't show.
  const broad = t => { const r = (t[5] >> 16) & 255, g = (t[5] >> 8) & 255, b = t[5] & 255; return (r + g + b) / 3 > 70 && g > b * 2.1 && r > g * 0.82; };
  const kinds = [[roundTreeGeometry(), all.filter(t => !broad(t) && t[4] < 0.65)], [treeGeometry(), all.filter(t => !broad(t) && t[4] >= 0.65)]];   // pines only (Mike 10-31): the broadleaf spots stay empty
  const SPECIES = [new THREE.Color(0x35552e), new THREE.Color(0x274632)];   // (darker: the drone video's spruce read almost black-green)
  //   // pine, fir/spruce
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
      // the species colour, varied a little per tree (the photo's colour no longer tints the trees)
      const k = kinds.findIndex(kk => kk[0] === geo);
      col.copy(SPECIES[k]).multiplyScalar(0.85 + r * 0.35);
      mesh.setColorAt(i, col);
    });
    geo.setAttribute('aBase', new THREE.InstancedBufferAttribute(base, 3));
    mesh.frustumCulled = false;
    group.add(mesh);
    // a soft dark pool under the crown, thrown a little away from the sun: it sets the tree on the ground (i17: everything floated)
    const sg = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
    const sc = document.createElement('canvas'); sc.width = sc.height = 64; const sx = sc.getContext('2d'), gr = sx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.65)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sx.fillStyle = gr; sx.fillRect(0, 0, 64, 64);
    const smat = risingMaterial(new THREE.MeshBasicMaterial({ color: 0x0a0f08, alphaMap: new THREE.CanvasTexture(sc), transparent: true, opacity: 0.42, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), true);
    const sm = new THREE.InstancedMesh(sg, smat, n), sb = new Float32Array(n * 3);
    list.forEach(([x, y, h, ht], i) => { sb.set([x, y, h], i * 3); const w = ht * 0.42 + 2; m.compose(new THREE.Vector3(x + ht * 0.05, h + 0.35, -y), q.identity(), new THREE.Vector3(w, 0.001 * ht + 1, w)); sm.setMatrixAt(i, m); });
    sg.setAttribute('aBase', new THREE.InstancedBufferAttribute(sb, 3));
    sm.frustumCulled = false; sm.renderOrder = 1; group.add(sm);
  }
  return group;
}

// boulders in and along the creek (i16-i18: 'a painted blue lake'; the real creek is rock and gravel bars). spots = [x, y, h, r]
export function makeRocks(spots) {
  const geo = shag(new THREE.IcosahedronGeometry(1, 1).toNonIndexed(), 0.28, -9);
  geo.deleteAttribute('uv');
  const mesh = new THREE.InstancedMesh(geo, risingMaterial(new THREE.MeshLambertMaterial({ color: 0xffffff }), true), spots.length), base = new Float32Array(spots.length * 3);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), c = new THREE.Color();
  spots.forEach(([x, y, h, r], i) => {
    base.set([x, y, h], i * 3); const k = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    q.setFromEuler(e.set(k * 3, k * 40, k * 2)); m.compose(new THREE.Vector3(x, h + r * 0.12, -y), q, new THREE.Vector3(r * (0.9 + k * 0.5), r * (0.5 + k * 0.3), r * (1.1 - k * 0.3))); mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, c.setRGB(0.3 + k * 0.22, 0.29 + k * 0.2, 0.27 + k * 0.18));
  });
  geo.setAttribute('aBase', new THREE.InstancedBufferAttribute(base, 3));
  mesh.frustumCulled = false; return mesh;
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

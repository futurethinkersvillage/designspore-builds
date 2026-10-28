// The shared world: terrain + drawing/real ground shader, imagery, drone photo, water, trees, existing buildings,
// sky, the aerial 360°, the plan linework and the floating callouts. Timelines (main.js for checkpoint 1, and the
// chapter modules in js/chapters/) drive it; they never rebuild it.
import * as THREE from 'three';
import { drawSheets } from './sheet.js';
import { makeLand, heightSampler, U, H0 } from './land.js';
import { buildMosaic, tileCount } from './imagery.js';
import { placeTrees, makeTrees, makeBuildings } from './objects.js';
import { makePano, makeSky } from './pano.js';
import { makePlanned } from './planned.js';
import { makeWaterMask } from './water.js';
import { makeLandCover } from './landcover.js';
import { addSurfaceDetail, glows } from './surface.js';
import { makeLabels } from './labels.js';
import { polysOf } from './sheet.js';
import { build as buildFarm } from './models/farm_concept.js';

// The aerial pano: where the drone was and which way the photo's left edge faces. Registered against the drone
// orthophoto with tools/pano_register.py (heading agrees with the DEM skyline fit, tools/pano_align.py: 206.5°).
// The map's pin for this pano is ~150 m off.
export function panoConfig(MOBILE, Q) {
  const PANO = { url: MOBILE ? 'assets/pano/aerial.jpg' : 'assets/pano/aerial_6k.jpg', yaw0: 207.05, at: [-72, 53], agl: 549 };
  if (Q.has('panoFit')) { const [x, y, a, w] = Q.get('panoFit').split(',').map(Number); Object.assign(PANO, { at: [x, y], agl: a, yaw0: w }); } // tools/pano_fit.mjs
  return PANO;
}

const srgb = c => new THREE.Color().setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace);
function canvasTex(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

async function load({ style, MOBILE, progress, FAST }) {
  let loaded = 0, total = 1;
  const tick = (n = 1) => { loaded += n; progress?.(Math.min(1, loaded / total)); };
  const get = (u, t = 'json') => fetch(u).then(r => { if (!r.ok) throw new Error(u); return r[t](); });
  const cameras = await fetch('data/cameras.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : {}).catch(() => ({}));   // camera paths saved from the editor
  const [meta, L, nearBuf, farBuf, water] = await Promise.all([get('data/meta.json'), get('data/layers.json'),
    get('data/terrain_near.f32', 'arrayBuffer'), get('data/terrain_far.f32', 'arrayBuffer'), get('data/water.json')]);
  const near = new Float32Array(nearBuf), far = new Float32Array(farBuf);
  const nearZoom = MOBILE ? 15 : 16, nearHalf = 2500, farZoom = 12, farHalf = 20000;
  total = 4 + tileCount(meta.merc_near, nearHalf, nearZoom) + tileCount(meta.merc_far, farHalf, farZoom) + (MOBILE || FAST ? 0 : tileCount(meta.merc_near, 1300, 17));
  tick(2);
  const droneImg = new Image(); droneImg.src = 'data/ortho.webp';
  await droneImg.decode(); tick();
  const dc = document.createElement('canvas'); dc.width = droneImg.width; dc.height = droneImg.height;
  const dctx = dc.getContext('2d', { willReadFrequently: true }); dctx.drawImage(droneImg, 0, 0);
  const dd = dctx.getImageData(0, 0, dc.width, dc.height).data, o = meta.ortho;
  const droneSample = (x, y) => {
    const px = Math.floor((x - o.x0) / o.res), py = Math.floor((o.y1 - y) / o.res);
    if (px < 0 || py < 0 || px >= dc.width || py >= dc.height) return null;
    const i = (py * dc.width + px) * 4; return dd[i + 3] > 200 ? [dd[i], dd[i + 1], dd[i + 2]] : null;
  };
  const sheets = await drawSheets(L, style); tick();
  const [nearM, farM, midM] = await Promise.all([buildMosaic(meta.merc_near, nearHalf, nearZoom, tick), buildMosaic(meta.merc_far, farHalf, farZoom, tick),
    MOBILE || FAST ? null : buildMosaic(meta.merc_near, 1300, 17, tick)]);  // z17 around the property: crisper fly-over ground
  return { meta, L, near, far, droneImg, droneSample, sheets, nearM, farM, midM, water, cameras };
}

export async function createEngine({ style, canvas, REC, MOBILE, Q, progress }) {
  const FAST = Q.has('fast'); // ?fast=1: quicker previews while developing (no z17 imagery, fewer trees)
  const D = await load({ style, MOBILE, progress, FAST });
  const heightAt = heightSampler(D.meta, D.near, D.far);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: REC });
  renderer.setPixelRatio(REC ? 1 : Math.min(devicePixelRatio, MOBILE ? 1.5 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 10, 100000);
  camera.rotation.order = 'YXZ';

  const droneTex = new THREE.Texture(D.droneImg); droneTex.colorSpace = THREE.SRGBColorSpace; droneTex.anisotropy = 16; droneTex.needsUpdate = true;
  const land = makeLand({ meta: D.meta, near: D.near, far: D.far, droneTex,
    sheetTex: canvasTex(D.sheets.sheet), overlayTex: canvasTex(D.sheets.overlay), furnitureTex: canvasTex(D.sheets.furniture) });
  land.setImagery(D.nearM, D.farM, D.midM);
  const wm = makeWaterMask(D.water, D.L, { res: MOBILE ? 4 : 2 }); land.setWater(wm);
  // zoom-20 drone patches (0.09 m) over the three close-up areas: west (gazebo, farm), campground core, north-east
  if (!MOBILE && !FAST && !Q.has('nohi')) {
    const HI = [[-690, -420, -310, 110], [-215, 35, -215, 150], [-75, 170, 170, 390]];
    const url = (z, x, y) => `assets/drone20/${x}/${y}.webp`;
    land.setHi(await Promise.all(HI.map(b => buildMosaic(D.meta.merc_near, 0, 20, null, { bounds: b, url, clear: true, noSample: true }))));
  }
  { const lc = makeLandCover({ meta: D.meta, L: D.L, droneSample: D.droneSample, waterCanvas: wm.tex.image, waterRect: wm.rect, res: MOBILE ? 2 : 1 }); land.setLand(lc.tex, lc.rect); }
  // no trees standing in water: read the mask back (blue channel = water)
  const wc = wm.tex.image, wd = wc.getContext('2d').getImageData(0, 0, wc.width, wc.height).data, wres = (wm.rect.z - wm.rect.x) / wc.width;
  const isWater = (x, y) => { const i = Math.floor((wm.rect.w - y) / wres) * wc.width + Math.floor((x - wm.rect.x) / wres); return wd[i * 4 + 2] > 60; };
  // match the drone photo's colour to the satellite imagery around it (70% of the way), so it doesn't look pasted on
  {
    const a = [0, 0, 0], b = [0, 0, 0]; let n = 0; const o = D.meta.ortho;
    for (let y = o.y0; y < o.y1; y += 12) for (let x = o.x0; x < o.x1; x += 12) {
      const d = D.droneSample(x, y), e = D.nearM.sample(x, y);
      if (!d || !e) continue; for (let k = 0; k < 3; k++) { a[k] += d[k]; b[k] += e[k]; } n++;
    }
    if (n > 100) U.uDroneGain.value.set(...a.map((v, k) => 1 + (b[k] / v - 1) * 0.4));   // 40% toward the satellite's colour (70% dulled the greens)
  }
  scene.add(land.group);

  // ---- detailed building models (js/models/*.js) ----
  // Placed where the DRONE SURVEY shows each building. The site plan's building outlines were drawn loosely and sit
  // up to ~40 m off the drone photo (golf, lake and ponds match it well); positions read off the drone ortho
  // (tools: build/zoompick.py) override each model's meta.place. Rotation stays from the model's own notes.
  const PLACE = {
    gazebo: [{ x: -597, y: -226, rotY: 0.6615 }],
    top_house: [{ x: -636, y: -242, rotY: 0.5404 }],
    bottom_house: [{ x: -240, y: 44, rotY: 0.9146 }],
    office: [{ x: -79, y: 103, rotY: 0.639 }],
    dome: [{ x: -145, y: -146, rotY: 2.314 }],
    // bunk cabins turned 90° counter-clockwise from the agent's guess (Mike, 2026-10-27: that's the way they face)
    bunk_cabin: [{ x: -107, y: -86, rotY: 0.713 + Math.PI / 2, variant: 'a' }, { x: -119, y: -100, rotY: 0.736 + Math.PI / 2, variant: 'b' }, { x: -131, y: -115, rotY: 0.712 + Math.PI / 2, variant: 'c' }],
    // sauna: exactly where Mike's QGIS project has it ('For Rent' layer, Type = Sauna; the drone survey predates it),
    // door toward the creek (NW)
    sauna: [{ x: -94.3, y: -61.3, rotY: -2.356 }],
    shower_house: [{ x: -80.5, y: 66, rotY: 0.618, variant: 'main' }, { x: -94, y: -132, rotY: 2.173, variant: 'field' }],
  };
  const EXISTING = ['gazebo', 'top_house', 'bottom_house', 'office', 'dome', 'bunk_cabin', 'shower_house', 'sauna', 'horse_corrals'];
  const siteC = n => (D.L[n] || []).flatMap(f => polysOf(f).map(p => { const r = p[0]; return [r.reduce((a, q) => a + q[0], 0) / r.length, r.reduce((a, q) => a + q[1], 0) / r.length]; }));
  const clear = [...Object.entries(PLACE).flatMap(([k, ps]) => ps.map(p => [p.x, p.y, k === 'gazebo' ? 11 : 8])),
    ...siteC('cabins').map(c => [...c, 7]), ...siteC('lake_cabins').map(c => [...c, 7]), ...siteC('maker_space').map(c => [...c, 16]), ...siteC('event_gazebo').map(c => [...c, 12]),
    // nor in the planned farm's beds, greenhouses, barn, mandala and pond (the food forest keeps its trees)
    ...siteC('farm_market_garden').map(c => [...c, 12]), ...siteC('farm_greenhouses').map(c => [...c, 20]), ...siteC('farm_buildings').map(c => [...c, 10]),
    ...siteC('farm_mandala_garden').map(c => [...c, 9]), ...siteC('farm_pond').map(c => [...c, 28])]; // no trees standing in the buildings
  const spots = placeTrees({ heightAt, droneSample: D.droneSample, nearSample: D.nearM.sample, L: D.L, isWater, clear, half: MOBILE ? 1600 : 2900, spacing: MOBILE ? 8 : 6, max: MOBILE ? 35000 : FAST ? 50000 : 170000 });
  const trees = makeTrees(spots); trees.visible = !Q.has('notrees'); scene.add(trees);
  const blocks = makeBuildings(D.L, heightAt); scene.add(blocks); // simple extruded footprints; chapters swap in the detailed models

  const hemi = new THREE.HemisphereLight(0xdfe9ff, 0x4a4632, 1.1); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.copy(U.uSunDir.value).multiplyScalar(1000); scene.add(sun);

  const sky = makeSky(); scene.add(sky.mesh);
  const PANO = panoConfig(MOBILE, Q);
  const pano = makePano(PANO.url, PANO.yaw0); scene.add(pano.mesh);
  pano.mat.uniforms.uDissolve.value = style.pano === 'dolly' ? 1 : 0;
  const panoPos = new THREE.Vector3(PANO.at[0], heightAt(PANO.at[0], PANO.at[1]) + PANO.agl, -PANO.at[1]);
  const planned = makePlanned(D.L, heightAt, style.planGlow, style.pill); scene.add(planned.group);
  const labels = makeLabels(D.L, heightAt, { existing: '#F2EDE8', planned: style.planned }); scene.add(labels.group);

  // ---- style constants on the shared uniforms ----
  const colors = {
    paper: srgb(style.paper), horizon: new THREE.Color('#dfe6e8'), skyTop: new THREE.Color('#3f6fa8'),
    drawHorizon: new THREE.Color(style.sky ? style.sky[1] : '#F2E4DA'), drawTop: new THREE.Color(style.sky ? style.sky[0] : '#73516F'),
  };
  U.uPaper.value.copy(colors.paper); U.uEdge.value.copy(srgb(style.edge));
  U.uContourCol.value.set(style.contourCol || '#EA824E'); U.uContourIdxCol.value.set(style.contourIdxCol || style.contourCol || '#EA824E');
  if (style.tideGlow) U.uTideGlow.value.set(style.tideGlow);
  U.uContour.value = style.contour; U.uContourIndex.value = style.contourIndex; U.uHill.value = style.hillshade;
  U.uRevealMode.value = { wipe: 0, radial: 1, height: 2, contour: 3 }[style.reveal];
  U.uStep.value = style.stepped ? 8 : 0;

  const models = {};
  async function placeModel(slug, { lod = 'high', at, visible = true } = {}) {
    if (models[slug] && (!at || models[slug].userData.persistent)) { models[slug].visible = visible; return models[slug]; } // already in the world (persistent ones are never re-placed)
    if (models[slug]) { scene.remove(models[slug]); }
    const mod = await import(`./models/${slug}.js`);
    const places = at || PLACE[slug] || (Array.isArray(mod.meta.place) ? mod.meta.place : mod.meta.place ? [mod.meta.place] : []);
    const group = new THREE.Group(); group.name = slug;
    for (const pl of places) {
      const o = mod.build({ lod, variant: pl.variant, size: pl.size });
      o.position.set(pl.x, heightAt(pl.x, pl.y), -pl.y); o.rotation.y = pl.rotY || 0;
      group.add(o);
    }
    addSurfaceDetail(group);   // boards, shingles, grain and weathering for close-ups
    group.visible = visible; scene.add(group); models[slug] = group;
    return group;
  }
  // zomes on every planned cabin site (creekside + lakeside), door toward the site's long axis
  async function placeZomes({ lod = 'low', which = ['cabins', 'lake_cabins'] } = {}) {
    const at = [];
    for (const name of which) for (const f of D.L[name] || []) for (const poly of polysOf(f)) {
      const r = poly[0]; const c = [r.reduce((a, p) => a + p[0], 0) / r.length, r.reduce((a, p) => a + p[1], 0) / r.length];
      const e = [r[1][0] - r[0][0], r[1][1] - r[0][1]];
      at.push({ x: c[0], y: c[1], rotY: Math.atan2(e[0], e[1]), size: name === 'cabins' ? '6m' : '5m' }); // Trillium sizes that fit the 7 m / 6 m wide sites
    }
    return placeModel('zome', { lod, at });
  }

  // every existing building as its detailed model; the old extruded footprint blocks stay hidden (Mike: use the models)
  blocks.visible = false;
  await Promise.all(EXISTING.map(slug => placeModel(slug, { lod: MOBILE ? 'low' : 'high' })));

  // ---- the persistent world (Mike, 2026-10-27): every building — real or planned — appears once the land turns
  // real in chapter 1 and then stays put for the whole film; only the night festival brings in new things.
  // Ground height exactly on the terrain mesh triangles (heightAt is bilinear, which floats/sinks things a little).
  const groundAt = (() => {
    const m = D.meta.terrain_near, a = D.near, n = m.size;
    return (x, y) => {
      const c = (x + m.half) / m.res, r = (m.half - y) / m.res;
      const i = Math.min(Math.max(Math.floor(r), 0), n - 2), j = Math.min(Math.max(Math.floor(c), 0), n - 2);
      const fx = c - j, fy = r - i, A = a[i * n + j], B = a[i * n + j + 1], Cc = a[(i + 1) * n + j], Dd = a[(i + 1) * n + j + 1];
      return (fx + fy <= 1 ? A + (B - A) * fx + (Cc - A) * fy : Dd + (Cc - Dd) * (1 - fx) + (B - Dd) * (1 - fy)) - H0;
    };
  })();
  const AMBER = new THREE.Color('#EA824E'), CREAM = new THREE.Color('#F2E8DC');
  // planned things read as an architect's concept model: warm card-white with amber edge linework (never as built)
  function conceptLook(group) {
    const done = new Map();
    const edgeMat = new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.55 });   // thin, not a peach wash at distance
    group.traverse(o => {
      if (!o.isMesh || o.isInstancedMesh || o.userData.noConcept) return;
      const swap = m => {
        if (done.has(m)) return done.get(m);
        if (glows(m) || m.transparent) { done.set(m, m); return m; }   // keep glass / glow as is
        const c = m.clone();
        if (c.color) c.color.lerp(CREAM, 0.88);   // all one card-white (decks + doors too): a model, not a product
        if (c.emissive) { c.emissive.copy(CREAM); c.emissiveIntensity = 0.22; }   // stays card-white on its shaded side (read grey before)
        if (c.map) c.map = null; c.vertexColors = false;
        done.set(m, c); return c;
      };
      o.material = Array.isArray(o.material) ? o.material.map(swap) : swap(o.material);
      if (o.geometry.attributes.position.count < 60000) {
        const e = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 28), edgeMat); e.raycast = () => {};
        o.add(e);
      }
    });
    group.userData.concept = true;
  }
  const radialTex = stops => {
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(([o, col]) => gr.addColorStop(o, col));
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  };
  // zomes on every planned cabin site, seated on the real slope: a timber skirt fills the gap, a soft contact shadow below
  const zomes = await placeZomes({ lod: MOBILE ? 'low' : 'high' });
  {
    const skirtMat = new THREE.MeshStandardMaterial({ color: 0x3a2c21, roughness: 0.95 });
    const shadowMat = new THREE.MeshBasicMaterial({ map: radialTex([[0, 'rgba(0,0,0,0.6)'], [0.55, 'rgba(0,0,0,0.35)'], [1, 'rgba(0,0,0,0)']]),
      transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    for (const z of zomes.children) {
      const x = z.position.x, y = -z.position.z, a = z.rotation.y, cu = Math.cos(a), su = Math.sin(a);
      const at = (u, v) => [x + u * cu + v * su, y - (-u * su + v * cu)];
      const hs = [[-2.5, -3.6], [2.5, -3.6], [2.5, 3.6], [-2.5, 3.6], [0, 0]].map(([u, v]) => groundAt(...at(u, v)));
      const top = Math.max(...hs), low = Math.min(...hs);
      z.position.y = top - 0.04;
      const drop = top - low + 0.3;
      const sk = new THREE.Mesh(new THREE.BoxGeometry(4.5, drop, 5.2), skirtMat); sk.position.set(0, 0.3 - drop / 2, -0.3); sk.userData.noConcept = true; z.add(sk);
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(10, 12, 5, 6).rotateX(-Math.PI / 2), shadowMat);
      const pp = sh.geometry.attributes.position;
      for (let i = 0; i < pp.count; i++) { const [gx, gy] = at(pp.getX(i), pp.getZ(i)); pp.setY(i, groundAt(gx, gy) + 0.12 - z.position.y); }
      sh.userData.noConcept = true; z.add(sh);
    }
  }
  const maker = await placeModel('maker_space', { lod: MOBILE ? 'low' : 'high' });
  const farm = buildFarm({ L: D.L, ground: groundAt, lod: MOBILE ? 'low' : 'high' });
  farm.userData.uGrow.value = 1.25; farm.userData.outline.material.opacity = 0; scene.add(farm); models.farm_concept = farm;
  // the new event gazebo (no model yet): a simple concept octagon pavilion on its plan footprint
  {
    const f = D.L.event_gazebo?.[0];
    if (f) {
      const r = polysOf(f)[0][0], c = [r.reduce((a, p) => a + p[0], 0) / r.length, r.reduce((a, p) => a + p[1], 0) / r.length];
      const rad = Math.max(...r.map(p => Math.hypot(p[0] - c[0], p[1] - c[1]))) * 0.85;
      const g = new THREE.Group(); g.position.set(c[0], groundAt(c[0], c[1]), -c[1]);
      const wood = new THREE.MeshStandardMaterial({ color: 0x9a7650, roughness: 0.85 }), roof = new THREE.MeshStandardMaterial({ color: 0x5b4636, roughness: 0.8 });
      const slab = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.3, 8), wood); slab.position.y = 0.15; g.add(slab);
      for (let k = 0; k < 8; k++) { const t = k / 8 * Math.PI * 2; const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), wood); post.position.set(Math.cos(t) * rad * 0.92, 1.9, Math.sin(t) * rad * 0.92); g.add(post); }
      const rf = new THREE.Mesh(new THREE.ConeGeometry(rad * 1.12, 2.6, 8), roof); rf.position.y = 4.8; g.add(rf);
      scene.add(g); models.event_gazebo = g;
    }
  }
  // Mike (10-28) retired the "planned must read as concept" rule: planned models keep their own materials now.
  // conceptLook stays available (exported) in case a chapter wants it back.
  for (const g of [zomes, maker, farm, models.event_gazebo].filter(Boolean)) addSurfaceDetail(g);
  for (const g of Object.values(models)) g.userData.persistent = true;
  const glass = []; zomes.traverse(o => { if (o.material && !Array.isArray(o.material) && glows(o.material)) glass.push(o.material); });
  glass.forEach(m => { m.emissiveIntensity = 0.42; });   // a soft warm glaze, not lit windows of a built village (chapters may raise it at night)
  const PERSIST0 = { farmGlass: farm.userData.materials.glass.emissiveIntensity, zomeGlass: glass.map(m => m.emissiveIntensity) };
  // chapters may tweak these persistent things; the film puts them back at every chapter change
  function resetPersistent() {
    for (const g of Object.values(models)) if (g.userData.persistent) { g.visible = true; g.children.forEach(o => o.scale.set(1, 1, 1)); }
    farm.userData.outline.material.opacity = 0; farm.userData.uGrow.value = 1.25;
    farm.userData.materials.glass.emissiveIntensity = PERSIST0.farmGlass;
    glass.forEach((m, i) => { m.emissiveIntensity = PERSIST0.zomeGlass[i]; });
  }

  // Everything already real, risen and lit like late afternoon: the state every chapter after 2 starts from.
  function realWorld() {
    Object.assign(U.uCut, { value: 5000 }); U.uExag.value = 1; U.uReveal.value = 1; U.uFinish.value = 1; U.uTide.value = 5000;
    U.uPaperShade.value = 0; U.uFurniture.value = 0; U.uPlanOverlay.value = 0; U.uTreeFade.value = 1; U.uGrade.value = 0;
    U.uFog.value.copy(colors.horizon); U.uFogDensity.value = 0.000012; U.uSkyTop.value.copy(colors.skyTop);
    sky.mat.uniforms.uOpacity.value = 1; sky.mat.uniforms.uHorizon.value.copy(colors.horizon); sky.mat.uniforms.uTop.value.copy(colors.skyTop);
    renderer.setClearColor(colors.horizon);
    pano.mesh.visible = false;
  }

  const tmp2 = new THREE.Vector2();
  const resize = () => {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    pano.mat.uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
  };
  addEventListener('resize', resize); resize();
  await pano.ready;

  // Keep the flight corridor clear: drop (once, at load) any tree within r metres of a camera position the film
  // passes through. Nothing shrinks or pops on screen; the trees just aren't planted where the lens flies.
  // Only trees the lens would actually hit go: within r metres sideways AND tall enough to reach the camera.
  // (It was 90 m in 3D distance, which stripped real spruce stands around the campground — cut-6 photo check.)
  function clearTreesNear(points, r = 12) {
    const m = new THREE.Matrix4(), p = new THREE.Vector3(), zero = new THREE.Matrix4().makeScale(0, 0, 0), r2 = r * r;
    scene.traverse(o => {
      if (!o.isInstancedMesh || o.count < 500) return;
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, m); p.setFromMatrixPosition(m);
        for (const c of points) { const dx = p.x - c.x, dz = p.z - c.z; if (dx * dx + dz * dz < r2 && c.y < p.y + 40) { o.setMatrixAt(i, zero); break; } }
      }
      o.instanceMatrix.needsUpdate = true;
    });
  }

  return {
    cameras: D.cameras, clearTreesNear, groundAt, resetPersistent, conceptLook, zomeGlass: glass,
    THREE, U, H0, D, L: D.L, meta: D.meta, heightAt, scene, camera, renderer, style, colors,
    land, trees, blocks, sky, sun, hemi, pano, PANO, panoPos, planned, labels, models, placeModel, placeZomes, realWorld,
    // ground height as currently displayed (it rises with the cut) — matches displayH() in the shaders
    shown: h => Math.min(h, U.uCut.value) * U.uExag.value,
    bufferSize: () => renderer.getDrawingBufferSize(tmp2),
    render: () => { sky.mesh.position.copy(camera.position); pano.mesh.position.copy(camera.position); renderer.render(scene, camera); },
  };
}

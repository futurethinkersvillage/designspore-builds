// The shared world: terrain + drawing/real ground shader, imagery, drone photo, water, trees, existing buildings,
// sky, the aerial 360°, the plan linework and the floating callouts. Timelines (main.js for checkpoint 1, and the
// chapter modules in js/chapters/) drive it; they never rebuild it.
import * as THREE from 'three';
import { drawSheets } from './sheet.js';
import { makeLand, heightSampler, U, H0 } from './land.js';
import { buildMosaic, tileCount } from './imagery.js';
import { REAL_LAKE } from './mirror.js';
import { placeTrees, makeTrees, makeBuildings, makeRocks } from './objects.js';
import { makePano, makeSky } from './pano.js';
import { makePlanned } from './planned.js';
import { makeWaterMask } from './water.js';
import { makeLandCover } from './landcover.js';
import { loadGround } from './ground.js';
import { addSurfaceDetail, glows } from './surface.js';
import { makeLabels } from './labels.js';
import { polysOf } from './sheet.js';
import { build as buildFarm } from './models/farm_concept.js';
import { build as buildFarmDetails } from './models/farm_details.js';

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
  const placements = await fetch('data/placements.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : {}).catch(() => ({}));   // model positions set by hand in the placer (js/placer.js)
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
  return { meta, L, near, far, droneImg, droneSample, sheets, nearM, farM, midM, water, cameras, placements };
}

export async function createEngine({ style, canvas, REC, MOBILE, Q, progress }) {
  const V = await fetch('data/village.json').then(r => r.json());   // the zome village's master plan (tools/village_design.py)
  const FAST = Q.has('fast'); // ?fast=1: quicker previews while developing (no z17 imagery, fewer trees)
  const D = await load({ style, MOBILE, progress, FAST });
  const heightAt = heightSampler(D.meta, D.near, D.far);
  // The site plan's hole 4 (and the farm drawn on it) sits ~20 m east of the real mown fairway and turned ~3°
  // (Mike, 10-28; measured on the drone photo: build/topdown/hole4_fits.jpg). Move the core farm onto the real
  // fairway: rotate -3.3° (bearing) about the hole's middle, then 20 m west. The 2D sheet keeps the plan as drawn.
  const farmFix = (x, y) => {
    // (10-29, Mike: "still a few metres off") turned 0.6° less and 4 m further west: the south end now clears the
    // pond (~6 m west), the north end moves ~2 m — checked over the drone photo (build/acc/farm_align.jpg)
    // (10-30, measured on the class map) the real fairway's axis leans 1.36° east going north, centre x = -495.8 at y = 0;
    // the plan's beds sit at +3.43°: turned 4.79° so they lie square across the fairway (the old -2.7° turned them away to 6°)
    const t = 4.79 * Math.PI / 180, s = Math.sin(t), c = Math.cos(t), px = -481.8, py = -25.6, dx = x - px, dy = y - py;
    return [px + dx * c + dy * s - 30.3, py - dx * s + dy * c + 8];   // + 8 m north (Mike 10-29, frame 3710: "pushed up or forward a bit")
  };
  {
    const ring = r => r.map(p => farmFix(p[0], p[1]));
    const core = r => r.reduce((a, p) => a + p[0], 0) / r.length < -440;   // the strip on hole 4; the north strip + food forest stay
    for (const n of ['farm_market_garden', 'farm_greenhouses', 'farm_buildings', 'farm_mandala_garden', 'farm_herb_spiral', 'farm_pond']) {
      for (const f of D.L[n] || []) {
        if (f.t === 'Polygon' && core(f.c[0])) f.c = f.c.map(ring);
        else if (f.t === 'MultiPolygon') f.c = f.c.map(poly => core(poly[0]) ? poly.map(ring) : poly);
      }
    }
    // (Mike 10-30, screenshot) the plan's 'north strip' (long thin beds and a swale running 700 m east at y ~170) is gone: it
    // lay across the open fairways as garbage. The top beds, which fanned out over the wetland, are replaced by clean rows
    // that fill the end of the hole, square to its axis (x = -495.8 + 0.0237 y), up to y 198.
    const cy = r => r.reduce((a, p) => a + p[1], 0) / r.length, cx = r => r.reduce((a, p) => a + p[0], 0) / r.length;
    const keep = r => cx(r) < -440 && cy(r) <= 138;
    D.L.farm_market_garden = (D.L.farm_market_garden || []).flatMap(f => { const ps = f.t === 'Polygon' ? [f.c] : f.c; return ps.filter(p => keep(p[0])).map(c => ({ ...f, t: 'Polygon', c })); });
    D.L.farm_swales = (D.L.farm_swales || []).filter(f => { const l = f.t === 'LineString' ? f.c : (f.t === 'Polygon' ? f.c[0] : f.c[0]?.[0] || f.c[0]); return cx(l) < -440; });
    for (let y = 141; y <= 198; y += 6.1) {
      const xc = -495.8 + 0.0237 * y, hw = 21 - Math.max(0, y - 175) * 0.25, e = [Math.cos(0.0237), -Math.sin(0.0237)], n = [Math.sin(0.0237), Math.cos(0.0237)], P = (u, v) => [xc + e[0] * u + n[0] * v, y + e[1] * u + n[1] * v];
      D.L.farm_market_garden.push({ t: 'Polygon', p: { kind: 'bed' }, c: [[P(-hw, -2.1), P(hw, -2.1), P(hw, 2.1), P(-hw, 2.1), P(-hw, -2.1)]] });
    }
    for (const f of D.L.farm_labels || []) if (f.t === 'Point' && f.c[0] < -440) f.c = farmFix(f.c[0], f.c[1]);
  }

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
  // clean-realism ground (style A): CC0 materials over the ground-type map; ?photoground keeps the old photo look
  let ground = null;
  if (!MOBILE && !Q.has('photoground')) { ground = await loadGround(); land.setGround(ground); }
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
    office: [{ x: -99.5, y: 111.5, rotY: 0.639 }],   // beside the forest-school playground (Mike, 10-28; it had the shower house's spot)
    dome: [{ x: -145, y: -146, rotY: 2.314 }],
    // bunk cabins turned 90° counter-clockwise from the agent's guess (Mike, 2026-10-27: that's the way they face)
    bunk_cabin: [{ x: -107, y: -86, rotY: 0.713 + Math.PI / 2, variant: 'a' }, { x: -119, y: -100, rotY: 0.736 + Math.PI / 2, variant: 'b' }, { x: -131, y: -115, rotY: 0.712 + Math.PI / 2, variant: 'c' }],
    // sauna: exactly where Mike's QGIS project has it ('For Rent' layer, Type = Sauna; the drone survey predates it),
    // door toward the creek (NW)
    sauna: [{ x: -94.3, y: -61.3, rotY: -2.356 }],
    // ---- real things picked on the drone photo (10-28; Mike: model what's up close, verified with photos) ----
    rv: [{ x: -20, y: 212.5, rotY: -2.269, variant: 'fifth', size: 11 }, { x: -38, y: 192.5, rotY: -2.304, variant: 'fifth', size: 10.5 }, { x: -50, y: 179, rotY: -1.047, variant: 'trailer', size: 7 }, { x: -18, y: 160.6, rotY: -2.094, variant: 'trailer', size: 8.5 }, { x: 10, y: 191, rotY: -2.618, variant: 'trailer', size: 7.5 }, { x: -58.3, y: 145.5, rotY: -2.897, variant: 'trailer', size: 6 }, { x: -79.7, y: -110.9, rotY: -0.803, variant: 'trailer', size: 9 }],   // parked RVs on their real spots in the campground (tools/find_rvs.py + picks; none by the shop — Mike: no junk there)
    shed: [{ x: -42.5, y: -11.5, rotY: -0.436, variant: 'workshop' }, { x: -48, y: -48, rotY: -0.628, variant: 'shop' },
      { x: -36, y: -113.5, rotY: -1.571, variant: 'storage' }, { x: -79, y: -58.5, rotY: -1.5, variant: 'woodshed' }],   // the plan's building layer is ~20 m off: these sit on the real roofs
    footbridge: [{ x: -93.2, y: -21.7, rotY: -2.164, size: 15 }],   // the concrete road bridge over Hemp Creek N of the sauna: 15 m deck NW–SE across the creek, on the drone photo (10-29)
    entrance_sign: [{ x: -697, y: -211, rotY: -0.64 }],   // at the highway turn-off: drone video 0:00, facing the road; survey shows it at the driveway mouth
    props: [{ x: -80.1, y: 134.5, rotY: 0, variant: 'trampoline' }, { x: -83.7, y: 130.6, rotY: 0, variant: 'tetherball' }, { x: -85, y: 123.4, rotY: 0.5, variant: 'fort' }, { x: -71.4, y: 133.6, rotY: -0.744, variant: 'logs', size: 20 }, { x: -89.4, y: 115.6, rotY: 0.471, variant: 'golfcart' }, { x: -87, y: 116.5, rotY: 0.471, variant: 'golfcart' }, { x: -84.9, y: 117.4, rotY: 0.471, variant: 'golfcart' }, { x: -83.1, y: 118.3, rotY: 0.471, variant: 'golfcart' }, { x: -19.3, y: 225.2, rotY: 0.0, variant: 'picnic' }, { x: -11.2, y: 225.2, rotY: 0.7, variant: 'picnic' }, { x: -15.2, y: 220, rotY: 1.4, variant: 'picnic' }, { x: -31.9, y: 196.9, rotY: 2.1, variant: 'picnic' }, { x: -8.3, y: 203.9, rotY: 2.8, variant: 'picnic' }, { x: -4.8, y: 183.1, rotY: 0.36, variant: 'picnic' }, { x: 20, y: 209, rotY: 1.06, variant: 'picnic' }, { x: 25.2, y: 228.7, rotY: 1.76, variant: 'picnic' }, { x: 17.1, y: 203.3, rotY: 2.46, variant: 'picnic' }, { x: -7.9, y: 169.3, rotY: 0.02, variant: 'picnic' }, { x: -15.2, y: 175, rotY: 0.72, variant: 'picnic' }, { x: -80.5, y: -53.5, rotY: 0.2, variant: 'picnic' }, { x: -94.5, y: 133, rotY: 2.6075, variant: 'golfnet', size: 38 }, { x: 4, y: 286, rotY: 3.4, variant: 'outhouse' }, { x: -620, y: -212, rotY: 0.6615, variant: 'washroom' }, { x: -497, y: 200, rotY: 0, variant: 'flagpin' }, { x: -428, y: 135, rotY: 0, variant: 'flagpin' }, { x: -530, y: -222, rotY: 0, variant: 'flagpin' }, { x: -128, y: -154, rotY: 0.9, variant: 'picnic' }, { x: -131, y: -147, rotY: 0, variant: 'firepit', scale: 0.7 }, { x: -96, y: 106, rotY: 0.8, variant: 'quonset' }, { x: -640, y: -232, rotY: 0.93, variant: 'parkedrv' }, { x: -636, y: -229, rotY: 0.93, variant: 'parkedrv' }, { x: -74.4, y: 143.5, rotY: 0.6, variant: 'pit' }, { x: -71.2, y: 140.9, rotY: 0.6, variant: 'pit' }, { x: -66, y: 152, rotY: 0.6, variant: 'pit' }, { x: -63.5, y: 149.5, rotY: 0.6, variant: 'pit' }, { x: -58.5, y: 153.5, rotY: 2.2, variant: 'binshed' }, { x: -216.1, y: 72.2, rotY: 2.786, variant: 'leanto' }, { x: -222.5, y: 61.7, rotY: 1.15, variant: 'redouthouse' }, { x: -205.6, y: 56, rotY: 1.28, variant: 'logs', size: 10 }, { x: -550.5, y: -174.5, rotY: 1.97, variant: 'cartbridge' }],   // playground, golf carts by the office, logs, picnic tables on the loop pads, the bench by the sauna woodshed
    // from the sauna 360 (10-29): chair deck right by the photographer, chairs facing the creek (WSW); the boulder line
    // runs along the far side of the road from the bridge approach east; one big rock at the deck's corner
    sauna_setting: [{ x: -98.8, y: -57.6, rotY: -2.356, variant: 'deck' }, { x: -95, y: -46.5, rotY: 1.22, variant: 'boulders', size: 18 },
      { x: -97.6, y: -54.7, rotY: 0, variant: 'boulders', size: 0.1 }],
    shower_house: [{ x: -79, y: 103, rotY: 0.639, variant: 'main' }, { x: -94, y: -132, rotY: 2.173, variant: 'field' }],   // main = the long building with decks + ramps on the drone photo (Mike, 10-28; was on empty gravel)
  };
  // the village replaces the plan's two rows: everything that reads the sites (map, sheet, keep-outs) follows
  { const oct = z => { const r = []; for (let k = 0; k <= 8; k++) r.push([z.x + Math.cos(k * 0.785) * 5, z.y + Math.sin(k * 0.785) * 5]); return { t: 'Polygon', p: {}, c: [r] }; };
    D.L.cabins = V.zomes.filter(z => z.hamlet !== 'Lake Quarter').map(oct); D.L.lake_cabins = V.zomes.filter(z => z.hamlet === 'Lake Quarter').map(oct);
    PLACE.zomepad = V.zomes.map(z => ({ x: z.x, y: z.y })); }
  // hand placements from the in-scene placer override the coded ones: { slug: { index: { x, y, rotY } } }
  for (const [slug, byI] of Object.entries(D.placements || {})) for (const [i, v] of Object.entries(byI)) if (PLACE[slug]?.[i]) Object.assign(PLACE[slug][i], v);
  PLACE.shed.splice(2, 1);   // the storage building beside the village goes with the development (Mike 11-01, frame 5677)
  PLACE.rv = PLACE.rv.filter(r => r.y < 100);   // RVs stand on the plan's numbered sites, not where they were on survey day (Mike 11-01: a clusterfuck)
  for (const [x, y, rotY, size] of [[-91.5, -109, 0.55, 1], [-75, -99, 0.55, 2]]) PLACE.props.push({ x, y, rotY, variant: 'shelter', size });   // the two covered tent sites (Mike 11-01, video 5:10)
  PLACE.rv = PLACE.rv.filter(r => Math.hypot(r.x + 79.7, r.y + 110) > 12 || r.y > -100);
  // RVs parked on ~45 % of the plan's RV sites (i8: the '45 RV sites' card sat over an empty loop; the drone photo shows
  // it busy). Long axis along each site's longest edge; never within 9 m of the RVs placed by hand above.
  {
    const zomeSites = ['cabins', 'lake_cabins'].flatMap(n => D.L[n] || []).flatMap(f => polysOf(f).map(q => { const r = q[0]; return [0, 1].map(k => r.reduce((a, p) => a + p[k], 0) / r.length); }));
    const hand = PLACE.rv.slice(), h = i => Math.abs(Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1;
    ['full_service_rv_sites', 'power_water_rv_sites', 'regular_rv_sites'].flatMap(n => D.L[n] || []).flatMap(f => polysOf(f).map(q => q[0])).forEach((r, i) => {
      const c = [0, 1].map(k => r.slice(0, -1).reduce((a, q) => a + q[k], 0) / (r.length - 1));
      if (![[0, 0], [4, 0], [-4, 0], [0, 4], [0, -4]].some(([dx, dy]) => isWater(c[0] + dx, c[1] + dy) || [6, 8, 9].includes(ground?.classAt(c[0] + dx, c[1] + dy)))) {   // every site has its table, fire ring and service post (Mike 10-31: scour the photos)
        const sd = Math.floor(h(i + 0.9) * 9) + 1, far = zomeSites.every(([x, y]) => Math.hypot(x - c[0], y - c[1]) >= 13);
        if (far) { let e = [0, 0]; for (let k = 0; k < r.length - 1; k++) { const d = [r[k + 1][0] - r[k][0], r[k + 1][1] - r[k][1]]; if (Math.hypot(...d) > Math.hypot(...e)) e = d; } const el = Math.hypot(...e) || 1, sd2 = h(i + 0.2) > 0.5 ? 1 : -1; PLACE.props.push({ x: c[0] + e[1] / el * 5 * sd2, y: c[1] - e[0] / el * 5 * sd2, rotY: Math.atan2(e[0], e[1]), variant: 'campsite', size: sd }); }   // beside the RV, not under it
      }
      if (h(i) > 0.62) return;
      if (hand.some(q => Math.hypot(q.x - c[0], q.y - c[1]) < 9)) return;
      if (zomeSites.some(([x, y]) => Math.hypot(x - c[0], y - c[1]) < 13)) return;   // never on a planned zome site (Mike 10-30)
      // not on or by water, nor in the forest (i8: one landed on the creek)
      if ([[0, 0], [5, 0], [-5, 0], [0, 5], [0, -5]].some(([dx, dy]) => isWater(c[0] + dx, c[1] + dy) || [6, 8, 9].includes(ground?.classAt(c[0] + dx, c[1] + dy)))) return;
      let e = [0, 0]; for (let k = 0; k < r.length - 1; k++) { const d = [r[k + 1][0] - r[k][0], r[k + 1][1] - r[k][1]]; if (Math.hypot(...d) > Math.hypot(...e)) e = d; }
      const big = h(i + 0.5) > 0.6;
      PLACE.rv.push({ x: c[0], y: c[1], rotY: Math.atan2(e[0], e[1]) + (r[0][0] * e[1] - r[0][1] * e[0] > 0 ? Math.PI : 0), variant: big ? 'fifth' : 'trailer', size: big ? 10 : 6.5 + 2 * h(i + 0.7) });
    });
  }
  // Level building pads (Mike 10-29: the ground under the gazebo and the top house sloped and clipped through them):
  // the terrain grid (10 m) is flattened to each building's mean ground height inside its footprint and blended back
  // over the next ~12 m, before anything is placed — so models, trees and the ground all agree.
  {
    const PADR = { zomepad: 2, entrance_sign: 12, gazebo: 9, top_house: 9, bottom_house: 8, office: 7, dome: 7, shower_house: 9, sauna: 3, bunk_cabin: 4, shed: 7, maker_space: 15 };
    const m = D.meta.terrain_near, a = D.near, n = m.size, res = m.res, orig = Float32Array.from(a);
    const sample = (x, y) => { const c = (x + m.half) / res, r = (m.half - y) / res, i = Math.floor(r), j = Math.floor(c), fx = c - j, fy = r - i;
      return (orig[i * n + j] * (1 - fx) + orig[i * n + j + 1] * fx) * (1 - fy) + (orig[(i + 1) * n + j] * (1 - fx) + orig[(i + 1) * n + j + 1] * fx) * fy; };
    for (const [slug, R] of Object.entries(PADR)) for (const pl of PLACE[slug] || (slug === 'maker_space' ? [{ x: -32.5, y: 320 }] : [])) {   // (the Maker Space is placed by its own meta, not PLACE)
      if (pl.variant === 'storage') continue;
      let hsum = 0, hn = 0;
      for (let dy = -R; dy <= R; dy += R / 2) for (let dx = -R; dx <= R; dx += R / 2) { hsum += sample(pl.x + dx, pl.y + dy); hn++; }
      const hp = hsum / hn, inner = R + 4, outer = R + 16;
      const j0 = Math.floor((pl.x - outer + m.half) / res), j1 = Math.ceil((pl.x + outer + m.half) / res);
      const i0 = Math.floor((m.half - pl.y - outer) / res), i1 = Math.ceil((m.half - pl.y + outer) / res);
      for (let i = Math.max(0, i0); i <= Math.min(n - 1, i1); i++) for (let j = Math.max(0, j0); j <= Math.min(n - 1, j1); j++) {
        const x = -m.half + j * res, y = m.half - i * res, d = Math.hypot(x - pl.x, y - pl.y);
        const w = d <= inner ? 1 : d >= outer ? 0 : 1 - (d - inner) / (outer - inner);
        if (w > 0) a[i * n + j] = a[i * n + j] * (1 - w * w * (3 - 2 * w)) + hp * (w * w * (3 - 2 * w));
      }
    }
    land.refreshNear();
  }
  // the lake: one surface. Bed dug under it, bank raised to meet it, on the terrain grid, before anything is placed (Mike 11-01, frame 5831)
  let lakeLevel = 0;
  { const m = D.meta.terrain_near, a = D.near, n = m.size, res = m.res, rawAt = (x, y) => { const c = (x + m.half) / res, r = (m.half - y) / res, i = Math.floor(r), j = Math.floor(c), fx = c - j, fy = r - i; return (a[i * n + j] * (1 - fx) + a[i * n + j + 1] * fx) * (1 - fy) + (a[(i + 1) * n + j] * (1 - fx) + a[(i + 1) * n + j + 1] * fx) * fy; };
    const hs = REAL_LAKE.map(([x, y]) => rawAt(x, y)).sort((p, q) => p - q), L = hs[Math.floor(hs.length * 0.3)];
    const inside = (x, y) => { let c = false; for (let i = 0, j = REAL_LAKE.length - 1; i < REAL_LAKE.length; j = i++) { const [xi, yi] = REAL_LAKE[i], [xj, yj] = REAL_LAKE[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    const edge = (x, y) => Math.min(...REAL_LAKE.map(q => Math.hypot(q[0] - x, q[1] - y)));
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = -m.half + j * res, y = m.half - i * res; if (x < -120 || x > 60 || y < -340 || y > -140) continue;
      const d = edge(x, y); if (inside(x, y)) a[i * n + j] = L - 0.8; else if (d < 15) a[i * n + j] = L - 0.3; else if (d < 34) a[i * n + j] = Math.max(a[i * n + j], L + 0.15 + (d - 15) * 0.02); }
    land.refreshNear?.(); lakeLevel = L; }
  const EXISTING = ['gazebo', 'top_house', 'bottom_house', 'office', 'dome', 'bunk_cabin', 'shower_house', 'sauna', 'horse_corrals',
    'rv', 'shed', 'footbridge', 'sauna_setting', 'props', 'entrance_sign'];
  const siteC = n => (D.L[n] || []).flatMap(f => polysOf(f).map(p => { const r = p[0]; return [r.reduce((a, q) => a + q[0], 0) / r.length, r.reduce((a, q) => a + q[1], 0) / r.length]; }));
  // keep-out per model: half its size + a crown radius (Mike 10-29: trees intersected the 3D models)
  const CLEARR = { gazebo: 14, top_house: 12, bottom_house: 12, office: 11, dome: 11, shower_house: 13, sauna: 7, bunk_cabin: 7, shed: 11,
    rv: 8, props: 5, sauna_setting: 6, horse_corrals: 22, footbridge: 11 };
  const clear = [...Object.entries(PLACE).flatMap(([k, ps]) => ps.map(p => [p.x, p.y, CLEARR[k] || 9])),
    ...siteC('cabins').map(c => [...c, 11]), ...siteC('lake_cabins').map(c => [...c, 11]),   // room round each zome site (i3: rows hidden in trees)
    ...V.courts.map(c => [c.x, c.y, c.r * 0.72]), ...V.paths.flatMap(p => p.kind === 'spur' ? [] : p.pts.filter((_, i) => i % 3 === 0).map(q => [q[0], q[1], 2.8])), [(V.lot[0][0] + V.lot[2][0]) / 2, (V.lot[0][1] + V.lot[2][1]) / 2, 24],
    ...siteC('maker_space').map(c => [...c, 22]), ...siteC('event_gazebo').map(c => [...c, 12]),
    [-22, 302, 9],   // the Maker Space's south-east approach: a spruce there blocked ch08's end frame (i9)
    // nor in the planned farm's beds, greenhouses, barn, mandala and pond (the food forest keeps its trees)
    ...siteC('farm_market_garden').map(c => [...c, 12]), ...siteC('farm_greenhouses').map(c => [...c, 20]), ...siteC('farm_buildings').map(c => [...c, 10]),
    ...siteC('farm_mandala_garden').map(c => [...c, 9]), ...siteC('farm_pond').map(c => [...c, 28])]; // no trees standing in the buildings
  // the learned canopy map over the survey (tools/ground_classes.py): trees where the photo shows canopy
  const canopy = await (async () => {
    try {
      const [gj, im] = await Promise.all([fetch('data/groundclass.json').then(r => r.json()), new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = 'data/canopy.png'; })]);
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0);
      const px = g.getImageData(0, 0, im.width, im.height).data, n = im.width * im.height, data = new Uint8Array(n), cover = new Uint8Array(n);
      const cls = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = 'data/groundclass.png'; });
      g.drawImage(cls, 0, 0); const cp = g.getImageData(0, 0, im.width, im.height).data;
      const clsMap = new Uint8Array(n); for (let k = 0; k < n; k++) clsMap[k] = cp[k * 4];
      for (let k = 0; k < n; k++) { data[k] = px[k * 4]; cover[k] = cp[k * 4] !== 255 ? 1 : 0; }   // cover = inside the survey
      const [tops, chm] = await Promise.all([fetch('data/treetops.json').then(r => r.json()).catch(() => null), new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = 'data/chm.png'; })]);
      let measured = null;
      if (tops && chm) { g.clearRect(0, 0, im.width, im.height); g.drawImage(chm, 0, 0); const ch = g.getImageData(0, 0, im.width, im.height).data;
        measured = (x, y) => { const k = Math.floor((gj.rect[3] - y) / gj.res) * im.width + Math.floor((x - gj.rect[0]) / gj.res); return ch[k * 4 + 3] > 0; }; }
      let open = null, nearCreek = null;
      if (tops && chm) { const ch2 = g.getImageData(0, 0, im.width, im.height).data, at = (x, y) => Math.floor((gj.rect[3] - y) / gj.res) * im.width + Math.floor((x - gj.rect[0]) / gj.res);
        open = (x, y) => { const k = at(x, y) * 4; return ch2[k + 3] > 0 && ch2[k] < 30; };   // the height map covers this spot and says under 3 m: open ground, no tree (Mike 11-01: field trees wrong)
        nearCreek = (x, y) => { for (let a = 0; a < 8; a++) for (const d of [8, 16, 26]) { const k = at(x + Math.cos(a * 0.785) * d, y + Math.sin(a * 0.785) * d); if (clsMap[k] === 9) return true; } return false; }; }
      return { rect: gj.rect, res: gj.res, w: im.width, h: im.height, data, cover, cls: clsMap, tops: tops?.trees, topsBounds: tops?.bounds, measured, open, nearCreek };
    } catch { return null; }
  })();
  const spots = placeTrees({ canopy, heightAt, droneSample: D.droneSample, nearSample: D.nearM.sample, L: D.L, isWater, clear, half: MOBILE ? 1600 : 2900, spacing: MOBILE ? 10 : 8, max: MOBILE ? 35000 : FAST ? 50000 : 170000 });
  const trees = makeTrees(spots); trees.visible = !Q.has('notrees'); scene.add(trees);
  if (ground?.classAt) {
    const rocks = [], hh = (x, y, k) => { const v = Math.sin(x * 12.99 + y * 78.23 + k) * 43758.5453; return v - Math.floor(v); };
    for (let x = -360; x < 260; x += 2.5) for (let y = -360; y < 460; y += 2.5) {
      if (Math.hypot(x + 93.2, y + 21.7) < 13) continue;   // clear of the footbridge
      const cl = ground.classAt(x, y);
      if (cl === 8 || cl === undefined) continue;
      const wet = cl === 9 || isWater(x, y);
      if (cl === 9 && hh(x, y, 1) < 0.035) rocks.push([x, y, heightAt(x, y), 0.35 + hh(x, y, 2) * 0.7]);   // (Mike 11-01: rocks thrown everywhere: keep a few in the creek, none on paths or banks)
    }
    if (rocks.length) scene.add(makeRocks(rocks.slice(0, 5000)));
    // from the drone video: reeds round the golf ponds (15:00-15:24), red-osier shrubs along the creek's cobble banks (0:40-1:10)
    const reeds = [], shrubs = [];
    for (let x = -600; x < 130; x += 1.4) for (let y = -300; y < 330; y += 1.4) {
      const cl = ground.classAt(x, y); if (cl === undefined || cl === 255) continue;
      if (cl === 8) { let edge = false; for (let k = 0; k < 8 && !edge; k++) edge = ground.classAt(x + Math.cos(k * 0.785) * 3, y + Math.sin(k * 0.785) * 3) !== 8; if (edge && x < -150 && hh(x, y, 5) < 0.55) reeds.push([x, y, heightAt(x, y)]); }
    }
    const stems = (n, rr, h) => { const p = []; for (let a = 0; a < n; a++) { const t = a * 2.4, r = rr * (0.3 + (a % 4) * 0.25), c = Math.cos(t), s = Math.sin(t), w = 0.02 + h * 0.012; p.push(c * r * 0.25 - s * w, 0, s * r * 0.25 + c * w, c * r * 0.25 + s * w, 0, s * r * 0.25 - c * w, c * r, h * (0.75 + (a % 3) * 0.12), s * r); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); return g; };
    const dm = new THREE.Object3D();
    for (const [list, geo, col, sc] of [[reeds, stems(14, 0.55, 1.5), 0x8a8452, 1], [shrubs, stems(22, 0.8, 1.5), 0x8e3a30, 1.2]]) {
      if (!list.length) continue;
      const mat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }), im = new THREE.InstancedMesh(geo, mat, Math.min(list.length, 9000));
      for (let i = 0; i < im.count; i++) { const [x, y, h] = list[i]; dm.position.set(x, h + 0.3, -y); dm.rotation.y = hh(x, y, 7) * 6.28; dm.scale.setScalar(sc * (0.7 + hh(x, y, 8) * 0.7)); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); }
      im.frustumCulled = false; scene.add(im);
    }
  }
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
      if (!at && PLACE[slug]) o.userData.place = { slug, i: PLACE[slug].indexOf(pl) };   // so the placer can move it
      group.add(o);
    }
    addSurfaceDetail(group);   // boards, shingles, grain and weathering for close-ups
    group.visible = visible; scene.add(group); models[slug] = group;
    return group;
  }
  // zomes on every planned cabin site (creekside + lakeside), door toward the site's long axis
  async function placeZomes({ lod = 'low', which = ['cabins', 'lake_cabins'] } = {}) {
    void which;
    const at = V.zomes.map(z => ({ x: z.x, y: z.y, rotY: z.rotY, variant: `${z.plan}|${z.finish}|${z.tour ? 1 : 0}` }));
    const g = await placeModel('zome_site', { lod, at }); models.zome = g; delete models.zome_site;
    return g;
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
      const K = (z.userData.baseOut || 5) / 5;   // sized to this zome
      const hs = [[-2.5 * K, -2.5 * K], [2.5 * K, -2.5 * K], [2.5 * K, 3.6 * K], [-2.5 * K, 3.6 * K], [0, 0]].map(([u, v]) => groundAt(...at(u, v)));
      const top = Math.max(...hs), low = Math.min(...hs);
      z.position.y = top - 0.04;
      const drop = top - low + 0.3;
      const sk = new THREE.Mesh(new THREE.BoxGeometry(4.2 * K, drop, 4.2 * K), skirtMat); sk.position.set(0, 0.3 - drop / 2, 0); sk.userData.noConcept = true; z.add(sk);
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(10 * K, 11 * K, 5, 6).rotateX(-Math.PI / 2), shadowMat);
      const pp = sh.geometry.attributes.position;
      for (let i = 0; i < pp.count; i++) { const [gx, gy] = at(pp.getX(i), pp.getZ(i)); pp.setY(i, groundAt(gx, gy) + 0.12 - z.position.y); }
      sh.userData.noConcept = true; z.add(sh);
    }
  }
  // one mesh per material for all the zomes: ~1,000 draw calls made the zome shots the slowest in the film (the sites stay as empty anchors for ch10's window halos)
  const zomeMerged = new THREE.Group(); zomeMerged.name = 'zome_merged';
  {
    const { mergeGeometries } = await import('three/addons/utils/BufferGeometryUtils.js'), byMat = new Map();
    zomes.updateMatrixWorld(true);
    zomes.traverse(o => { if (!o.isMesh) return; (byMat.has(o.material) ? byMat : byMat.set(o.material, [])).get(o.material).push(o); });
    for (const [mat, list] of byMat) {
      const m = new THREE.Mesh(mergeGeometries(list.map(o => { const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); return g.applyMatrix4(o.matrixWorld); })), mat);
      m.name = list[0].name; m.renderOrder = list[0].renderOrder; m.frustumCulled = false; zomeMerged.add(m); list.forEach(o => { o.visible = false; });
    }
    scene.add(zomeMerged); models.zome_merged = zomeMerged;
  }
  { const VL = await import('./models/village_land.js'); const vl = VL.build({ V, ground: groundAt, level: lakeLevel - H0, lod: MOBILE ? 'low' : 'high' }); scene.add(vl); models.village_land = vl; }
  const maker = await placeModel('maker_space', { lod: MOBILE ? 'low' : 'high' });
  const farm = buildFarm({ L: D.L, ground: groundAt, lod: MOBILE ? 'low' : 'high' });
  farm.userData.uGrow.value = 1.25; farm.userData.outline.material.opacity = 0; scene.add(farm); models.farm_concept = farm;
  farm.add(buildFarmDetails({ L: D.L, ground: groundAt, lod: MOBILE ? 'low' : 'high' }));   // crops, fence, tractor, coop… (Mike 10-30)
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
  for (const g of [zomeMerged, maker, farm, models.event_gazebo].filter(Boolean)) addSurfaceDetail(g);
  for (const g of Object.values(models)) g.userData.persistent = true;
  const glass = []; zomeMerged.traverse(o => { if (o.material && !Array.isArray(o.material) && (glows(o.material) || o.name === 'glass') && !glass.includes(o.material)) glass.push(o.material); });
  glass.forEach(m => { m.emissiveIntensity = 0.42; });   // a soft warm glaze, not lit windows of a built village (chapters may raise it at night)
  const PERSIST0 = { farmGlass: farm.userData.materials.glass.emissiveIntensity, zomeGlass: glass.map(m => m.emissiveIntensity) };
  // chapters may tweak these persistent things; the film puts them back at every chapter change
  // Trees hidden inside an area for one chapter only (Mike 10-29: the festival grounds cleared at night, but the real
  // forest stays in the 'here today' shots). treesIn(rings) -> id; hideTrees(id, on); resetPersistent shows them again.
  const treeSets = [];
  function treesIn(rings) { treeSets.push({ rings, on: false, saved: [] }); return treeSets.length - 1; }
  function hideTrees(id, on) {
    const S = treeSets[id]; if (!S || S.on === on) return;
    S.on = on;
    if (!on) { for (const [o, i, mm] of S.saved) { o.setMatrixAt(i, mm); o.instanceMatrix.needsUpdate = true; } S.saved = []; return; }
    const inside = (x, y, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    const box = S.rings.map(r => r.reduce((a, [x, y]) => [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)], [1e9, 1e9, -1e9, -1e9]));
    const m = new THREE.Matrix4(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
    trees.traverse(o => {   // the trees only (the art's LED strings are big instanced meshes too)
      if (!o.isInstancedMesh || o.count < 500) return;
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, m); const x = m.elements[12], y = -m.elements[14];
        if (m.elements[5] === 0) continue;
        if (S.rings.some((r, k) => x > box[k][0] && x < box[k][2] && y > box[k][1] && y < box[k][3] && inside(x, y, r))) { S.saved.push([o, i, m.clone()]); o.setMatrixAt(i, zero); }
      }
      o.instanceMatrix.needsUpdate = true;
    });
  }

  function resetPersistent() {
    U.uEdge.value.copy(srgb(style.edge));   // ch12 dims the tide line; every other chapter starts from the brand amber
    for (const S of treeSets) hideTrees(treeSets.indexOf(S), false);
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
  // Hide trees the lens would pass through or brush: the camera path is resampled every 2 m (sparse samples left
  // whole trees standing between them on fast moves), and a tree goes when the camera passes within its crown
  // radius + a margin while lower than the tree top + 8 m (cut 10: dense canopy-map forest filled the ch08 shop shot).
  function clearTreesNear(points, r = 12) {
    const dense = [];
    for (let k = 0; k < points.length; k++) {
      const a = points[k], b = points[k + 1] || a, n = Math.max(1, Math.ceil(a.distanceTo(b) / 2));
      for (let j = 0; j < n; j++) dense.push(a.clone().lerp(b, j / n));
    }
    const m = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
    const cell = 40, grid = new Map(), key = (x, z) => `${Math.floor(x / cell)},${Math.floor(z / cell)}`;
    for (const c of dense) { const k = key(c.x, c.z); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(c); }
    trees.traverse(o => {   // the trees only (the art's LED strings are big instanced meshes too)
      if (!o.isInstancedMesh || o.count < 500) return;
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, m); m.decompose(p, q, sc);
        if (sc.y === 0) continue;
        const rr = r < 10 ? Math.min(0.16 * sc.y + 2, r + 1) : Math.max(r, 0.18 * sc.y + 7), top = p.y + sc.y + 8, gx = Math.floor(p.x / cell), gz = Math.floor(p.z / cell);
        let hit = false;
        for (let ax = gx - 1; ax <= gx + 1 && !hit; ax++) for (let az = gz - 1; az <= gz + 1 && !hit; az++) {
          for (const c of grid.get(`${ax},${az}`) || []) { const dx = p.x - c.x, dz = p.z - c.z; if (dx * dx + dz * dz < rr * rr && c.y < top) { hit = true; break; } }
        }
        if (hit) o.setMatrixAt(i, zero);
      }
      o.instanceMatrix.needsUpdate = true;
    });
  }

  return {
    village: V, get lakeLevel() { return lakeLevel - H0; }, cameras: D.cameras, clearTreesNear, treesIn, hideTrees, groundAt, resetPersistent, conceptLook, zomeGlass: glass, farmFix,
    THREE, U, H0, D, L: D.L, meta: D.meta, heightAt, scene, camera, renderer, style, colors,
    land, trees, blocks, sky, sun, hemi, pano, PANO, panoPos, planned, labels, models, placeModel, placeZomes, realWorld, PLACE, ground,
    // ground height as currently displayed (it rises with the cut) — matches displayH() in the shaders
    shown: h => Math.min(h, U.uCut.value) * U.uExag.value,
    bufferSize: () => renderer.getDrawingBufferSize(tmp2),
    render: () => { sky.mesh.position.copy(camera.position); pano.mesh.position.copy(camera.position); renderer.render(scene, camera); },
  };
}

// Chapter 10 · Places to stay — down the creekside zomes, then on to the lakeside rows, at golden hour with warm
// light in the windows. Zomes are a CONCEPT (nothing built yet): the caption and the callouts say so.
import { furnish } from '../models/boho_decor.js';
import * as THREE from 'three';
import { lakeMirror } from '../mirror.js';

const shore3 = V => V.dock.x + 26;
export const meta = { id: 'ch10', title: 'The zome village', seconds: 58, animated: false, blend: 5.5 / 58 };

let cuts = [];
let rig, cap, cap2, capA, capB, capC, dip, vign, cards = [], glass = [], halos = [], G = {};
function meshGround(ctx) {   // ground height exactly as the terrain mesh draws it (same triangles)
  const m = ctx.meta.terrain_near, a = ctx.D.near, n = m.size, H0 = ctx.H0;
  return (x, y) => {
    const c = (x + m.half) / m.res, r = (m.half - y) / m.res;
    const i = Math.min(Math.max(Math.floor(r), 0), n - 2), j = Math.min(Math.max(Math.floor(c), 0), n - 2);
    const fx = c - j, fy = r - i, A = a[i * n + j], B = a[i * n + j + 1], Cc = a[(i + 1) * n + j], D = a[(i + 1) * n + j + 1];
    return (fx + fy <= 1 ? A + (B - A) * fx + (Cc - A) * fy : D + (Cc - D) * (1 - fx) + (B - D) * (1 - fy)) - H0;
  };
}
function card(text, sub, color) {   // flat, face-up callout (js/labels.js language)
  const s = 4, fs = 30 * s, sfs = 15 * s, pad = 14 * s, c = document.createElement('canvas'), g = c.getContext('2d');
  const t = text.toUpperCase().split('').join(' '), st = sub.toUpperCase().split('').join(' ');
  g.font = `600 ${fs}px Inter`; const tw = g.measureText(t).width; g.font = `500 ${sfs}px Inter`; const sw = g.measureText(st).width;
  c.width = Math.ceil(Math.max(tw, sw) + pad * 2); c.height = Math.ceil(fs + sfs + 48 * s);
  const grd = g.createLinearGradient(0, 0, c.width, 0); grd.addColorStop(0, 'rgba(26,23,32,0.66)'); grd.addColorStop(1, 'rgba(26,23,32,0)');
  g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
  const y0 = fs + 6 * s; g.fillStyle = color; g.font = `600 ${fs}px Inter`; g.fillText(t, pad, y0);
  g.fillRect(0, y0 + 10 * s, Math.max(tw, sw) + pad * 1.6, 2.2 * s);
  g.globalAlpha = 0.8; g.font = `500 ${sfs}px Inter`; g.fillText(st, pad, y0 + 20 * s + sfs);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16;
  const w = c.width / c.height, yl = (y0 + 11 * s) / c.height;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 1).translate(w / 2, 0.5 - yl, 0),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; m.renderOrder = 22;
  return m;
}
const radial = (stops) => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
};

export async function setup(ctx) {
  const { rig: R, scene } = ctx, ground = meshGround(ctx);
  const zomes = ctx.models.zome;   // the persistent zomes (engine.js seats them on the slope with skirt + shadow)
  vign = document.getElementById('vignette');
  // a soft fill from the camera's side: the low sun is ahead of the lens here, so everything read as black lumps (i11)
  { const l = new THREE.DirectionalLight(0xffe2c4, 2.3); l.position.set(700, 350, -350); ctx.scene.add(l); ctx.scene.add(l.target); }
  const haloTex = radial([[0, 'rgba(255,214,150,1)'], [0.25, 'rgba(255,170,90,0.55)'], [1, 'rgba(255,140,60,0)']]);
  glass = ctx.zomeGlass;
  zomes.updateMatrixWorld(true);
  if (!ctx.MOBILE) lakeMirror(ctx, ctx.L.lakes[0].c[0][0]);
  for (const z of zomes.children) {   // warm window halos: this chapter's own sprites, so they leave with it
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
    halo.position.copy(z.localToWorld(new THREE.Vector3(0, 1.5, 2.3))); halo.scale.set(5, 5, 1); scene.add(halo); halos.push(halo.material);
  }

  // Mike 11-02: the whole creekside zone, then a temporary cross-section at each stop: the camera stays outside at an angle, the near half of the zome slides away to show its
  // furnished interior, closes up again, and the tour moves on. Inside his zones only: creekside north to south, then lakeside.
  const V = ctx.village, sites = ctx.models.zome.children, D2R = Math.PI / 180, S = meta.seconds;
  const stop = n => { const i = V.zomes.findIndex(z => z.tour === n), z = V.zomes[i], fx = Math.sin(z.rotY), fy = -Math.cos(z.rotY), hd = (Math.atan2(-fx, -fy) / D2R + 360) % 360, type = z.plan.includes('z75') ? 3.95 : z.plan.includes('z9') ? 4.7 : z.plan.includes('z6') ? 3.25 : 2.6;
    return { i, x: z.x, y: z.y, hd: hd + 32, floorY: 0.35, gy: sites[i].position.y, R: type, plan: z.plan, site: sites[i] }; };
  const T1 = stop(1), T2 = stop(2), T3 = stop(3);
  const look = (s, t0, t1) => { const F = s.R * 3.3, gh = s.gy + 1.1; return [[t0 / S, s.x, s.y, gh, F * 1.25, s.hd, -24, 42], [(t0 + 1.2) / S, s.x, s.y, gh, F, s.hd, -24, 42], [t1 / S, s.x + 0.02, s.y, gh, F * 0.96, s.hd, -23, 42]]; };
  rig = R.makeRig([
    [0.0 / S, 55, 120, ground(55, 120), 420, 72, -38, 46],                  // the whole creekside zone, the hook of the hill above it
    [5.5 / S, 55, 120, ground(55, 120), 390, 72, -40, 46],                  // (the film's blend lands here)
    [9.0 / S, T1.x, T1.y, ground(T1.x, T1.y), 90, T1.hd, -34, 46],
    ...look(T1, 11, 20.5),
    [24.5 / S, T2.x, T2.y + 24, ground(T2.x, T2.y + 24), 80, T2.hd - 8, -30, 46],     // on down the zone to the Commons
    ...look(T2, 27, 37),
    [41.5 / S, 10, -225, ctx.lakeLevel, 150, 95, -24, 46],                 // south to the lake, from over the water
    ...look(T3, 44.5, 52.5),
    [56 / S, shore3(V) - 6, -238, ctx.lakeLevel + 3, 95, 82, -13, 46],   // from over the water: the beach, the row of zomes, the hill behind
    [58 / S, shore3(V) - 6, -240, ctx.lakeLevel + 3, 90, 82, -12, 46],
  ]);
  // the opened zomes: furnished, with their own materials so one plane can cut just that zome
  cuts = [T1, T2, T3].map((T, n) => {
    furnish(T.site, T.plan, T.R, T.floorY);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 1e5), seen = new Map(), fw = new THREE.Vector3(Math.sin(T.hd * D2R), 0, -Math.cos(T.hd * D2R)).normalize();
    plane.normal.copy(fw); plane.userData = {};
    const SHELL = new Set(['shingle', 'ply', 'timber', 'trim', 'pc', 'glass', 'wood']);
    T.site.traverse(o => { if (!o.isMesh || o.userData.noConcept || !SHELL.has(o.name)) return; if (!seen.has(o.material)) { const m = o.material.clone(); m.clippingPlanes = [plane]; m.side = THREE.DoubleSide; seen.set(o.material, m); } o.material = seen.get(o.material); });
    return { T, plane, fw, centre: new THREE.Vector3(T.x, T.gy + 1, -T.y), win: [[11, 20.5], [27, 37], [44.5, 52.5]][n] };
  });

  // golden hour (ch09 ends here) easing a little deeper toward dusk for ch11
  const U = ctx.U, sky = ctx.sky.mat.uniforms;
  G = {
    sun: [new THREE.Vector3(-0.93, 0.2, -0.3).normalize(), new THREE.Vector3(-0.95, 0.12, -0.3).normalize()],
    light: [new THREE.Vector3(1.0, 0.76, 0.54), new THREE.Vector3(0.9, 0.64, 0.48)],
    top: [new THREE.Color('#5a5b8c'), new THREE.Color('#4a4a80')], hz: [new THREE.Color('#f0c39a'), new THREE.Color('#eba77f')],
    fog: [new THREE.Color('#e7b98f'), new THREE.Color('#d99a78')], sunC: [new THREE.Color('#ffb26b'), new THREE.Color('#ff9a55')],
    sunI: [2.9, 2.6],   // a stronger warm key (reviewer: flat light, not golden hour)
    hemiS: [new THREE.Color('#b9a7c4'), new THREE.Color('#a493b8')], hemiG: [new THREE.Color('#4a3a2c'), new THREE.Color('#3e3028')], hemiI: [0.95, 0.8],
  };

  cap = document.createElement('div'); cap.className = 'cap';
  cap.innerHTML = '<div class="eyebrow">Places to stay<span style="margin-left:14px;padding:3px 9px;border:1px solid #EA824E;border-radius:99px;color:#EA824E;letter-spacing:.16em">Planned</span></div>' +
    '<h1>The zome village</h1><p style="font:400 clamp(15px,1.5vw,19px)/1.45 Inter,sans-serif;margin:12px 0 0;max-width:30em;opacity:.92">Along the creek and round the lake, grouped by colour: shared halls, cabins, family homes and work-stay.</p>';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap);
  // the lakeside row gets its own line (i7: after the cut the only text was a small card)
  cap2 = document.createElement('div'); cap2.className = 'cap';
  cap2.innerHTML = '<div class="eyebrow">Places to stay<span style="margin-left:14px;padding:3px 9px;border:1px solid #EA824E;border-radius:99px;color:#EA824E;letter-spacing:.16em">Planned</span></div>' +
    '<h1 style="white-space:nowrap">Lakeside</h1><p style="font:400 clamp(15px,1.5vw,19px)/1.45 Inter,sans-serif;margin:12px 0 0;max-width:30em;opacity:.92">Cabins looking over the beach, a spa, a sauna and a dock.</p>';
  cap2.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap2);
  const say = (eyebrow, h) => { const d = document.createElement('div'); d.className = 'cap'; d.innerHTML = `<div class="eyebrow">${eyebrow}</div><h1>${h}</h1>`; d.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40)); ctx.hud.appendChild(d); return d; };
  capA = say('A creekside cabin', 'Home, simply furnished.'); capB = say('The Commons', 'A café, and room<br>to work and meet.'); capC = say('The bathhouse', 'A hot tub under<br>the panels.');
  for (const T of [T1, T2, T3]) { const l = new THREE.PointLight(0xffdfb8, 9, 16, 1.2); l.position.set(T.x, T.gy + 3, -T.y); scene.add(l); }
  // the dip: a full-screen brand-dark veil
  dip = document.createElement('div'); dip.style.cssText = 'position:absolute;inset:0;background:#1A1720;opacity:0;pointer-events:none';
  ctx.hud.insertBefore(dip, ctx.hud.firstChild);
}

export function update(t, ctx) {
  const { U, rig: R, sky, sun, hemi } = ctx, s = R.seg, k = s(t, 0.3, 1);
  const L = (pair, out) => out.copy(pair[0]).lerp(pair[1], k), N = pair => pair[0] + (pair[1] - pair[0]) * k;
  L(G.sun, U.uSunDir.value).normalize(); sun.position.copy(U.uSunDir.value).multiplyScalar(1000); sky.mat.uniforms.uSun.value.copy(U.uSunDir.value).setY(-0.16).normalize();
  L(G.light, U.uLight.value); L(G.top, sky.mat.uniforms.uTop.value); U.uSkyTop.value.copy(sky.mat.uniforms.uTop.value);
  L(G.hz, sky.mat.uniforms.uHorizon.value); L(G.fog, U.uFog.value); ctx.renderer.setClearColor(U.uFog.value);
  L(G.sunC, sun.color); sun.intensity = N(G.sunI); L(G.hemiS, hemi.color); L(G.hemiG, hemi.groundColor); hemi.intensity = N(G.hemiI);
  vign.style.opacity = 0.8 + 0.1 * k;
  U.uWaterAmt.value = 1;   // (i8: held at 0.3 the creek read as an isolated pond; the class map's creek is accurate)

  rig.apply(ctx.camera, t);

  const glow = 0.55 + 0.6 * k;   // windows warm up as the light goes (gently: 2.6 read as a lit-up blob)
  for (const m of glass) m.emissiveIntensity = glow;
  for (const m of halos) m.opacity = 0.12 + 0.14 * k;   // (i11: read as small fires)

  const cam = ctx.camera, lens = Math.tan(cam.fov * Math.PI / 360), tilt = Math.min(1 / Math.max(Math.abs(Math.sin(cam.rotation.x)), 0.42), 2.3);
  for (const c of cards) {
    c.m.rotation.set(-Math.PI / 2, 0, 0); c.m.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), cam.rotation.y);   // face-up, text square to the view
    const op = s(t, c.a, c.a + 0.06) * (1 - s(t, c.b - 0.06, c.b));
    c.m.visible = c.pin.visible = op > 0.002;
    const kk = cam.position.distanceTo(c.m.position) * lens * c.sz;
    c.m.scale.set(kk, kk * tilt, 1); c.m.material.opacity = op; c.pin.material.opacity = op * 0.8;
  }
  const sec = t * meta.seconds, line = (c, a, b) => { c.style.opacity = s(sec, a, a + 0.8) - s(sec, b, b + 0.8); };
  line(cap, 5, 9); line(capA, 13, 19.5); line(capB, 29, 36); line(capC, 46.5, 51.5); cap2.style.opacity = s(sec, 54, 55);
  for (const c of cuts) { const [a, b] = c.win, open = s(sec, a + 1.6, a + 3.2) * (1 - s(sec, b - 1.6, b)), dist = c.T.R + 2 - open * (c.T.R + 2.1);   // the plane sweeps from in front of the zome to just past its middle
    c.plane.normal.copy(c.fw); c.plane.constant = open > 0.001 ? -c.fw.dot(c.centre) + dist : 1e5; }
  dip.style.opacity = 0;   // (Mike 10-30: no cut to the lakeside zomes — the camera flies there)   // ~0.5 s down, ~0.5 s up; dark through the move
  cap.style.transform = `translateY(${(1 - s(t, 0.06, 0.2)) * 14}px)`;
}

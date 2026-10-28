// Chapter 9 · Growing food — a low golden-hour pass from the real permaculture garden over the planned farm.
// The farm is a CONCEPT: it draws itself as amber linework, then grows out of the ground ahead of the camera.
import * as THREE from 'three';
import { build as buildFarm } from '../models/farm_concept.js';

export const meta = { id: 'ch09', title: 'Growing food', seconds: 12, animated: false };

let rig, cap, farm, vign, cards = [], G = {};
// flat, face-up callout card (same language as js/labels.js): spaced caps, hairline, small sub-line
function card(text, sub, color) {
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
  const h = 1, w = c.width / c.height, yl = (y0 + 11 * s) / c.height;
  const geo = new THREE.PlaneGeometry(w, h).translate(w / 2, h / 2 - yl, 0);   // origin = the hairline's left end
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; m.renderOrder = 22;
  return m;
}
// ground height exactly as the terrain mesh draws it (same triangles), so nothing floats or sinks
function meshGround(ctx) {
  const m = ctx.meta.terrain_near, a = ctx.D.near, n = m.size, H0 = ctx.H0;
  return (x, y) => {
    const c = (x + m.half) / m.res, r = (m.half - y) / m.res;
    const i = Math.min(Math.max(Math.floor(r), 0), n - 2), j = Math.min(Math.max(Math.floor(c), 0), n - 2);
    const fx = c - j, fy = r - i, A = a[i * n + j], B = a[i * n + j + 1], Cc = a[(i + 1) * n + j], D = a[(i + 1) * n + j + 1];
    return (fx + fy <= 1 ? A + (B - A) * fx + (Cc - A) * fy : D + (Cc - D) * (1 - fx) + (B - D) * (1 - fy)) - H0;
  };
}

export async function setup(ctx) {
  const { rig: R, L, scene } = ctx;
  const ground = meshGround(ctx);
  // growth order follows the flight: south (barn, greenhouses) to north (beds, pond), then the north strip and food forest
  const order = (x, y) => x < -440 ? THREE.MathUtils.clamp((y + 130) / 300, 0, 0.85) : THREE.MathUtils.clamp(0.8 + (x + 440) / 1500 + (y - 170) / 1200, 0.8, 1);
  farm = ctx.models.farm_concept;   // the persistent farm (engine.js); it no longer grows out of the ground here
  // the real buildings at the start of the pass, as detailed models (the simple blocks would read as white boxes)
  await Promise.all([ctx.placeModel('top_house'), ctx.placeModel('gazebo')]);
  ctx.blocks.visible = false;
  vign = document.getElementById('vignette');

  const gh = (x, y, d = 2) => ground(x, y) + d;
  const F = (t, x, y, fh, hd, pt) => { const [fx, fy] = ctx.farmFix(x, y); return [t, fx, fy, gh(fx, fy), fh, hd, pt, 48]; };
  rig = R.makeRig([
    // the real permaculture garden is held just after the film's blend (t < 0.3), then on to the planned farm
    [0.00, -612, -215, gh(-612, -215), 90, 36, -26, 48],
    [0.32, -612, -215, gh(-612, -215), 80, 32, -26, 48],
    // (the farm sits on the real fairway now: engine farmFix moves the plan coordinates)
    F(0.52, -528, -128, 100, 26, -24),
    F(0.68, -490, -76, 74, 9, -24),
    F(0.84, -479, -8, 74, 3, -24),
    F(1.00, -471, 60, 110, 7, -28),   // wider at the end: beds, mandala and pond together
  ]);
  // callouts: [anchor, text, sub, real?, offset east/north, lift, t in, t out]
  const real = '#F2EDE8', plan = '#EA824E';
  cards = [
    [[-615, -218], 'Permaculture garden', 'Here today', real, [8, 6], 4, 0.24, 0.48],
    [[-501, -105], 'Barn', 'Planned', plan, [-14, 2], 5, 0.44, 0.6],
    [[-469, -105], 'Greenhouses', 'Planned', plan, [10, 14], 4, 0.6, 0.76],   // after the barn card (they overlapped)
    [[-478, -44], 'Mandala garden', 'Planned', plan, [7, 3], 3, 0.66, 0.86],
    [[-466, 20], 'Market garden', 'Planned', plan, [8, 0], 3, 0.76, 0.96],
    [[-472, 81], 'Pond', 'Planned', plan, [8, 4], 3, 0.86, 1.01],
  ].map(([at, text, sub, col, off, lift, a, b]) => {
    if (text !== 'Permaculture garden') at = ctx.farmFix(at[0], at[1]);   // planned farm pieces moved onto the real fairway
    const m = card(text, sub, col), gy = ground(at[0], at[1]);
    m.position.set(at[0] + off[0], gy + lift, -(at[1] + off[1]));
    const pin = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(at[0], gy + 0.5, -at[1]), m.position.clone()]),
      new THREE.LineBasicMaterial({ color: col, transparent: true, depthTest: false, depthWrite: false }));
    pin.renderOrder = 21; scene.add(m, pin);
    return { m, pin, a, b };
  });

  // golden-hour targets (from the engine's late-afternoon state)
  const U = ctx.U, sky = ctx.sky.mat.uniforms;
  G = {
    sun0: U.uSunDir.value.clone(), sun1: new THREE.Vector3(-0.93, 0.2, -0.3).normalize(),
    light0: U.uLight.value.clone(), light1: new THREE.Vector3(1.0, 0.76, 0.54),
    top0: sky.uTop.value.clone(), top1: new THREE.Color('#5a5b8c'),
    hz0: sky.uHorizon.value.clone(), hz1: new THREE.Color('#f0c39a'),
    fog0: U.uFog.value.clone(), fog1: new THREE.Color('#e7b98f'),
    sunC0: ctx.sun.color.clone(), sunC1: new THREE.Color('#ffb26b'), sunI0: ctx.sun.intensity, sunI1: 2.3,
    hemiS0: ctx.hemi.color.clone(), hemiS1: new THREE.Color('#b9a7c4'), hemiG0: ctx.hemi.groundColor.clone(), hemiG1: new THREE.Color('#4a3a2c'),
    hemiI0: ctx.hemi.intensity, hemiI1: 0.7,
  };

  cap = document.createElement('div'); cap.className = 'cap';
  cap.innerHTML = '<div class="eyebrow">Growing food<span style="margin-left:14px;padding:3px 9px;border:1px solid #EA824E;border-radius:99px;color:#EA824E;letter-spacing:.16em">Planned</span></div>' +
    '<h1>Growing food</h1><p style="font:400 clamp(15px,1.5vw,19px)/1.45 Inter,sans-serif;margin:12px 0 0;max-width:30em;opacity:.92">Greenhouses, a market garden and a barn: food grown on the land for the people who live and learn here.</p>';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap);
}

export function update(t, ctx) {
  const { U, rig: R, sky, sun, hemi } = ctx, s = R.seg, k = s(t, 0, 0.45);
  // golden hour eases in
  U.uSunDir.value.copy(G.sun0).lerp(G.sun1, k).normalize();
  sun.position.copy(U.uSunDir.value).multiplyScalar(1000);
  sky.mat.uniforms.uSun.value.copy(U.uSunDir.value);
  U.uLight.value.copy(G.light0).lerp(G.light1, k);
  sky.mat.uniforms.uTop.value.copy(G.top0).lerp(G.top1, k); U.uSkyTop.value.copy(sky.mat.uniforms.uTop.value);
  sky.mat.uniforms.uHorizon.value.copy(G.hz0).lerp(G.hz1, k);
  U.uFog.value.copy(G.fog0).lerp(G.fog1, k); ctx.renderer.setClearColor(U.uFog.value);
  sun.color.copy(G.sunC0).lerp(G.sunC1, k); sun.intensity = G.sunI0 + (G.sunI1 - G.sunI0) * k;
  hemi.color.copy(G.hemiS0).lerp(G.hemiS1, k); hemi.groundColor.copy(G.hemiG0).lerp(G.hemiG1, k);
  hemi.intensity = G.hemiI0 + (G.hemiI1 - G.hemiI0) * k;

  vign.style.opacity = 0.35 + 0.45 * k;
  rig.apply(ctx.camera, t);

  // the farm: drawing first, then it grows up ahead of the camera
  const ud = farm.userData, db = ctx.bufferSize();
  ud.outline.material.resolution.set(db.x, db.y);
  ud.outline.material.opacity = 0;   // the farm is shown as real now (concept rule retired): no amber outline streaking over the trees
  ud.materials.glass.emissiveIntensity = 0.25 + 0.55 * k;

  const cam = ctx.camera, lens = Math.tan(cam.fov * Math.PI / 360);
  for (const c of cards) {
    c.m.rotation.set(-Math.PI / 2, 0, 0); c.m.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), cam.rotation.y);   // face-up, text square to the view
    const op = s(t, c.a, c.a + 0.06) * (1 - s(t, c.b - 0.06, c.b));
    c.m.visible = c.pin.visible = op > 0.002;
    const d = cam.position.distanceTo(c.m.position), k = d * lens * 0.24;   // bigger (they were unreadable)
    const tilt = Math.min(1 / Math.max((cam.position.y - c.m.position.y) / d, 0.3), 1.8);   // the real view angle onto the card (capped: more reads as standing)
    c.m.scale.set(k, k * tilt, 1); c.m.material.opacity = op; c.pin.material.opacity = op * 0.8;
  }
  cap.style.opacity = s(t, 0.08, 0.2) - s(t, 0.88, 0.98);
  cap.style.transform = `translateY(${(1 - s(t, 0.12, 0.26)) * 14}px)`;
}

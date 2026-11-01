// Chapter 10 · Places to stay — down the creekside zomes, then on to the lakeside rows, at golden hour with warm
// light in the windows. Zomes are a CONCEPT (nothing built yet): the caption and the callouts say so.
import * as THREE from 'three';
import { lakeMirror } from '../mirror.js';

const shore3 = V => V.dock.x + 26;
export const meta = { id: 'ch10', title: 'The zome village', seconds: 62, animated: false, blend: 5.5 / 62 };

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

  // from far back over the golf course, the whole village at once (Mike 11-01), down the main path, and into three zomes on foot
  const V = ctx.village, sites = ctx.models.zome.children, D2R = Math.PI / 180, S = 62;
  const stop = n => { const i = V.zomes.findIndex(z => z.tour === n), z = V.zomes[i], fx = Math.sin(z.rotY), fy = -Math.cos(z.rotY), hd = (Math.atan2(-fx, -fy) / D2R + 360) % 360, gy = sites[i].position.y, type = z.plan.includes('z75') ? 3.95 : z.plan.includes('z6') ? 3.25 : 2.6;
    return { x: z.x, y: z.y, fx, fy, hd, floor: gy + 0.35, R: type }; };
  const walk = (s, t0, look) => { const out = 8, door = s.R + 0.3, inK = s.R < 3 ? 0 : 0.42, inX = s.x + s.fx * s.R * inK, inY = s.y + s.fy * s.R * inK, eye = s.floor + 1.6, K = (sec, x, y, h, hd, p) => [sec / S, x, y, h, 0.01, hd, p, 60];
    return [K(t0, s.x + s.fx * (s.R + out), s.y + s.fy * (s.R + out), eye + 1.6, s.hd, -8), K(t0 + 1.6, s.x + s.fx * door, s.y + s.fy * door, eye, s.hd, -2), K(t0 + 2.8, inX, inY, eye, s.hd, -3), K(t0 + 5, inX, inY, eye, s.hd - look, -5), K(t0 + 7.2, inX, inY, eye, s.hd + look, -4), K(t0 + 8.4, inX, inY, eye, s.hd, -2), K(t0 + 9.6, s.x + s.fx * door, s.y + s.fy * door, eye, s.hd, -2), K(t0 + 11, s.x + s.fx * (s.R + out), s.y + s.fy * (s.R + out), eye + 1.6, s.hd, -8)]; };
  const T1 = stop(1), T2 = stop(2), T3 = stop(3);
  rig = R.makeRig([
    [0.0, 30, -60, ground(30, -60), 520, 96, -23, 46],                 // the whole village, hill behind it, creek before it
    [5.5, 30, -60, ground(30, -60), 460, 98, -24, 46],                 // (the film's blend lands here)
    [9.5, 34, -40, ground(34, -40), 240, 118, -30, 46],                // over the creek, the hamlets separate
    [13.5, 34, 10, ground(34, 10), 90, 165, -24, 48],                  // down over Creek Terrace, looking along the main path
    ...walk(T1, 16, 62),
    [29.5, 32, -88, ground(32, -88) + 4, 130, 182, -27, 50],            // along the path to the Commons
    ...walk(T2, 31, 70),
    [44, 25, -168, ground(25, -168) + 4, 130, 190, -26, 50],            // on south to the lake
    ...walk(T3, 45.5, 55),
    [58.5, shore3(V), -225, ctx.lakeLevel + 6, 90, 262, -14, 48],      // the lake walk, the water beyond
    [62, shore3(V) - 1, -228, ctx.lakeLevel + 5, 80, 262, -13, 48],
  ].map(k => k));

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
    '<h1>The zome village</h1><p style="font:400 clamp(15px,1.5vw,19px)/1.45 Inter,sans-serif;margin:12px 0 0;max-width:30em;opacity:.92">Six hamlets round a shared commons. Cars stop at the gate: everything past it is on foot.</p>';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap);
  // the lakeside row gets its own line (i7: after the cut the only text was a small card)
  cap2 = document.createElement('div'); cap2.className = 'cap';
  cap2.innerHTML = '<div class="eyebrow">Places to stay<span style="margin-left:14px;padding:3px 9px;border:1px solid #EA824E;border-radius:99px;color:#EA824E;letter-spacing:.16em">Planned</span></div>' +
    '<h1 style="white-space:nowrap">The Lake Quarter</h1><p style="font:400 clamp(15px,1.5vw,19px)/1.45 Inter,sans-serif;margin:12px 0 0;max-width:30em;opacity:.92">Cabins on the shore, a spa, a sauna and a dock.</p>';
  cap2.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap2);
  const say = (eyebrow, h) => { const d = document.createElement('div'); d.className = 'cap'; d.innerHTML = `<div class="eyebrow">${eyebrow}</div><h1>${h}</h1>`; d.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40)); ctx.hud.appendChild(d); return d; };
  capA = say('A private cabin · planned', 'Home, on a shared court.'); capB = say('The Commons · planned', 'Eat, work and meet<br>under one roof.'); capC = say('The bathhouse · planned', 'A hot tub under<br>the panels.');
  for (const T of [T1, T2, T3]) { const l = new THREE.PointLight(0xffdfb8, 3.5, 14, 1.2); l.position.set(T.x, T.floor + 3.1, -T.y); scene.add(l); }
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
  line(cap, 5.5, 12); line(capA, 17.5, 26); line(capB, 32.5, 41); line(capC, 46.5, 55); cap2.style.opacity = s(sec, 57.5, 58.5);
  dip.style.opacity = 0;   // (Mike 10-30: no cut to the lakeside zomes — the camera flies there)   // ~0.5 s down, ~0.5 s up; dark through the move
  cap.style.transform = `translateY(${(1 - s(t, 0.06, 0.2)) * 14}px)`;
}

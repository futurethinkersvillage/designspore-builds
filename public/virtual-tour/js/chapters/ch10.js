// Chapter 10 · Places to stay — down the creekside zomes, then on to the lakeside rows, at golden hour with warm
// light in the windows. Zomes are a CONCEPT (nothing built yet): the caption and the callouts say so.
import * as THREE from 'three';

export const meta = { id: 'ch10', title: 'Places to stay', seconds: 12, animated: false };

let rig, cap, vign, cards = [], glass = [], halos = [], G = {};
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
  const haloTex = radial([[0, 'rgba(255,214,150,1)'], [0.25, 'rgba(255,170,90,0.55)'], [1, 'rgba(255,140,60,0)']]);
  glass = ctx.zomeGlass;
  zomes.updateMatrixWorld(true);
  for (const z of zomes.children) {   // warm window halos: this chapter's own sprites, so they leave with it
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
    halo.position.copy(z.localToWorld(new THREE.Vector3(0, 1.5, 2.3))); halo.scale.set(5, 5, 1); scene.add(halo); halos.push(halo.material);
  }

  // start at a creekside zome's door, rise along the row, then settle on the lakeside zomes by the water
  rig = R.makeRig([
    [0.00, 96, 214, ground(96, 214) + 2, 26, 208, -12, 48],
    [0.45, 60, 150, ground(60, 150) + 2, 70, 205, -20, 48],
    // up and over the hill between the two rows (it hid the zomes for ~2 s when the camera stayed low)
    [0.72, 30, -60, ground(30, -60), 300, 220, -34, 48],
    [1.00, -2, -242, ground(-2, -242) + 2, 75, 250, -20, 48],   // lakeside row with the lake beyond (W)
  ]);
  const plan = '#EA824E';
  cards = [
    [[95, 236], 'Creekside zomes', '38 sites · planned', [10, 6], 10, 0.0, 0.42],
    [[34, -262], 'Lakeside zomes', '31 sites · planned', [8, -6], 4, 0.62, 1.01],   // on the open lawn beside the row, off the lake
  ].map(([at, text, sub, off, lift, a, b]) => {
    const m = card(text, sub, plan), gy = ground(at[0], at[1]);
    m.position.set(at[0] + off[0], gy + lift, -(at[1] + off[1]));
    const pin = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(at[0], gy + 4.5, -at[1]), m.position.clone()]),
      new THREE.LineBasicMaterial({ color: plan, transparent: true, depthTest: false, depthWrite: false }));
    pin.renderOrder = 21; scene.add(m, pin);
    return { m, pin, a, b };
  });

  // golden hour (ch09 ends here) easing a little deeper toward dusk for ch11
  const U = ctx.U, sky = ctx.sky.mat.uniforms;
  G = {
    sun: [new THREE.Vector3(-0.93, 0.2, -0.3).normalize(), new THREE.Vector3(-0.95, 0.12, -0.3).normalize()],
    light: [new THREE.Vector3(1.0, 0.76, 0.54), new THREE.Vector3(0.9, 0.64, 0.48)],
    top: [new THREE.Color('#5a5b8c'), new THREE.Color('#4a4a80')], hz: [new THREE.Color('#f0c39a'), new THREE.Color('#eba77f')],
    fog: [new THREE.Color('#e7b98f'), new THREE.Color('#d99a78')], sunC: [new THREE.Color('#ffb26b'), new THREE.Color('#ff9a55')],
    sunI: [2.9, 2.6],   // a stronger warm key (reviewer: flat light, not golden hour)
    hemiS: [new THREE.Color('#b9a7c4'), new THREE.Color('#a493b8')], hemiG: [new THREE.Color('#4a3a2c'), new THREE.Color('#3e3028')], hemiI: [0.55, 0.48],
  };

  cap = document.createElement('div'); cap.className = 'cap';
  cap.innerHTML = '<div class="eyebrow">Places to stay<span style="margin-left:14px;padding:3px 9px;border:1px solid #EA824E;border-radius:99px;color:#EA824E;letter-spacing:.16em">Planned</span></div>' +
    '<h1>Places to stay</h1><p style="font:400 clamp(15px,1.5vw,19px)/1.45 Inter,sans-serif;margin:12px 0 0;max-width:30em;opacity:.92">Zomes for builders, founders and families, plugged into the campground’s existing power and water.</p>';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap);
}

export function update(t, ctx) {
  const { U, rig: R, sky, sun, hemi } = ctx, s = R.seg, k = s(t, 0.3, 1);
  const L = (pair, out) => out.copy(pair[0]).lerp(pair[1], k), N = pair => pair[0] + (pair[1] - pair[0]) * k;
  L(G.sun, U.uSunDir.value).normalize(); sun.position.copy(U.uSunDir.value).multiplyScalar(1000); sky.mat.uniforms.uSun.value.copy(U.uSunDir.value);
  L(G.light, U.uLight.value); L(G.top, sky.mat.uniforms.uTop.value); U.uSkyTop.value.copy(sky.mat.uniforms.uTop.value);
  L(G.hz, sky.mat.uniforms.uHorizon.value); L(G.fog, U.uFog.value); ctx.renderer.setClearColor(U.uFog.value);
  L(G.sunC, sun.color); sun.intensity = N(G.sunI); L(G.hemiS, hemi.color); L(G.hemiG, hemi.groundColor); hemi.intensity = N(G.hemiI);
  vign.style.opacity = 0.8 + 0.1 * k;
  U.uWaterAmt.value = 0.3 + 0.7 * s(t, 0.45, 0.7);   // the atlas creek line runs metres off the photo: keep it faint up close

  rig.apply(ctx.camera, t);

  const glow = 0.55 + 0.6 * k;   // windows warm up as the light goes (gently: 2.6 read as a lit-up blob)
  for (const m of glass) m.emissiveIntensity = glow;
  for (const m of halos) m.opacity = 0.35 + 0.35 * k;

  const cam = ctx.camera, lens = Math.tan(cam.fov * Math.PI / 360), tilt = Math.min(1 / Math.max(Math.abs(Math.sin(cam.rotation.x)), 0.42), 2.3);
  for (const c of cards) {
    c.m.rotation.set(-Math.PI / 2, 0, 0); c.m.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), cam.rotation.y);   // face-up, text square to the view
    const op = s(t, c.a, c.a + 0.06) * (1 - s(t, c.b - 0.06, c.b));
    c.m.visible = c.pin.visible = op > 0.002;
    const kk = cam.position.distanceTo(c.m.position) * lens * 0.15;
    c.m.scale.set(kk, kk * tilt, 1); c.m.material.opacity = op; c.pin.material.opacity = op * 0.8;
  }
  cap.style.opacity = s(t, 0.06, 0.18) - s(t, 0.9, 0.99);
  cap.style.transform = `translateY(${(1 - s(t, 0.06, 0.2)) * 14}px)`;
}

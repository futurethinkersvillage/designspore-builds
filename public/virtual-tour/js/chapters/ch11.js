// Chapter 11 — Festival grounds & light. Dusk to night over the meadow south of the lake: the stage, festival
// camping and the discovery trail's 16 art landings glow in brand colours. All of it is PLANNED (concept).
import * as THREE from 'three';

export const meta = { id: 'ch11', title: 'Festival grounds & light', seconds: 12, animated: true };

const AMBER = new THREE.Color('#EA824E'), TERRA = new THREE.Color('#AF695E'), MAUVE = new THREE.Color('#73516F');
let rig, cap1, cap2, tag, lines, glows = [], stars, stageMats = [], cards = [];

// flat, face-up callout card on a pin (same look as labels.js): amber title + "PLANNED · CONCEPT"
function card(text, sub) {
  const s = 4, fs = 30 * s, sfs = 15 * s, pad = 14 * s, c = document.createElement('canvas'), g = c.getContext('2d');
  const t = text.toUpperCase().split('').join(' '), st = sub.toUpperCase().split('').join(' ');
  g.font = `600 ${fs}px Inter`; const tw = g.measureText(t).width; g.font = `500 ${sfs}px Inter`; const sw = g.measureText(st).width;
  c.width = Math.ceil(Math.max(tw, sw) + pad * 2); c.height = Math.ceil(fs + sfs + 48 * s); const y0 = fs + 6 * s;
  const grd = g.createLinearGradient(0, 0, c.width, 0); grd.addColorStop(0, 'rgba(26,23,32,0.66)'); grd.addColorStop(1, 'rgba(26,23,32,0)');
  g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#EA824E';
  g.font = `600 ${fs}px Inter`; g.fillText(t, pad, y0); g.fillRect(0, y0 + 10 * s, Math.max(tw, sw) + pad * 1.6, 2.2 * s);
  g.globalAlpha = 0.75; g.font = `500 ${sfs}px Inter`; g.fillText(st, pad, y0 + 20 * s + sfs);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16;
  const h = 46 * c.height / (fs + 30 * s), w = h * c.width / c.height;
  const geo = new THREE.PlaneGeometry(w, h).translate(w / 2, -h * (y0 + 11 * s) / c.height + h / 2, 0);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; m.renderOrder = 24; return m;
}

function glowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.12, 'rgba(255,255,255,0.75)');
  r.addColorStop(0.4, 'rgba(255,255,255,0.18)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export async function setup(ctx) {
  const { L, heightAt, scene, rig: R } = ctx;
  const tex = glowTex();
  // ---- amber plan linework: festival outline, stage, camp plots, the trail (dotted) ----
  const pos = [];
  const seg = (a, b) => {
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 8));
    for (let k = 0; k < n; k++) {
      const p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n], q = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n];
      pos.push(p[0], heightAt(...p) + 2, -p[1], q[0], heightAt(...q) + 2, -q[1]);
    }
  };
  const ring = r => { for (let i = 0; i < r.length - 1; i++) seg(r[i], r[i + 1]); };
  const mkLines = (fill, opacity) => {
    pos.length = 0; fill();
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const m = new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
    const l = new THREE.LineSegments(lg, m); l.renderOrder = 20; l.frustumCulled = false; l.userData.k = opacity; scene.add(l); return l;
  };
  lines = [
    mkLines(() => { for (const n of ['festival_grounds', 'event_space']) for (const f of L[n]) ring(f.c[0]); }, 0.85),
    mkLines(() => { for (const f of L.camp_plots) ring(f.c[0]); }, 0.16),   // 204 plots: a faint grid, not a hatch
    mkLines(() => { for (const f of L.discovery_trail) for (let i = 0; i < f.c.length - 1; i += 2) seg(f.c[i], f.c[i + 1]); }, 0.7),
  ];
  // stars, faded in with the night (kept centred on the camera in update)
  const sp = [];
  for (let i = 0; i < 1400; i++) {
    const u = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, v = Math.abs(Math.sin(i * 78.233) * 12543.123) % 1;
    const az = u * Math.PI * 2, el = Math.asin(0.08 + 0.92 * v);
    sp.push(Math.cos(el) * Math.sin(az) * 9000, Math.sin(el) * 9000, Math.cos(el) * Math.cos(az) * 9000);
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xf2ede8, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false }));
  stars.renderOrder = -1; stars.frustumCulled = false; scene.add(stars);

  // ---- lights: sprites with additive blending ----
  const add = (x, y, lift, size, color, on, kind) => {
    const m = new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const s = new THREE.Sprite(m); s.position.set(x, heightAt(x, y) + lift, -y); s.scale.setScalar(size); s.renderOrder = 23;
    scene.add(s); glows.push({ s, size, on, kind, ph: (x * 0.37 + y * 0.11) % 6.28 });
  };
  // light installation = a soft vertical column of light (sprite stretched upward)
  const beamTex = (() => {
    const c = document.createElement('canvas'); c.width = 32; c.height = 256; const g = c.getContext('2d');
    const v = g.createLinearGradient(0, 256, 0, 0); v.addColorStop(0, 'rgba(255,255,255,1)'); v.addColorStop(0.35, 'rgba(255,255,255,.45)'); v.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = v; g.fillRect(0, 0, 32, 256);
    const h = g.createLinearGradient(0, 0, 32, 0); h.addColorStop(0, 'rgba(0,0,0,1)'); h.addColorStop(0.5, 'rgba(0,0,0,0)'); h.addColorStop(1, 'rgba(0,0,0,1)');
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = h; g.fillRect(0, 0, 32, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const beam = (x, y, w, hgt, color, on) => {
    const m = new THREE.SpriteMaterial({ map: beamTex, color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const s = new THREE.Sprite(m); s.center.set(0.5, 0); s.position.set(x, heightAt(x, y), -y); s.scale.set(w, hgt, 1); s.renderOrder = 23;
    scene.add(s); glows.push({ s, size: 0, on, kind: 'beam', ph: (x * 0.21 + y * 0.17) % 6.28 });
  };
  // a pool of light on the ground: a small grid draped on the terrain, additive
  const poolTex = glowTex();
  const pool = (x, y, r, color, on) => {
    const geo = new THREE.PlaneGeometry(2 * r, 2 * r, 8, 8).rotateX(-Math.PI / 2), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, heightAt(x + p.getX(i), y - p.getZ(i)) + 1.5);
    geo.translate(x, 0, -y);
    const m = new THREE.MeshBasicMaterial({ map: poolTex, color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const s = new THREE.Mesh(geo, m); s.renderOrder = 18; scene.add(s); glows.push({ s, size: 0, on, kind: 'pool', ph: 0 });
  };
  // stage
  add(-193, -242, 10, 120, AMBER, 0.28, 'stage'); add(-193, -242, 5, 40, new THREE.Color('#ffd9b0'), 0.30, 'stage');
  // festival lanterns over the camp plots
  L.camp_plots.forEach((f, i) => {
    if (i % 3) return; const r = f.c[0];
    const c = [r.reduce((a, p) => a + p[0], 0) / r.length, r.reduce((a, p) => a + p[1], 0) / r.length];
    add(c[0], c[1], 5, 14, i % 2 ? AMBER : TERRA, 0.34 + 0.26 * ((-c[1] - 330) / 480), 'lantern');   // lantern-sized, coming on one by one
  });
  // art landings: mauve / terracotta / amber installations, lit along the trail
  L.landings.forEach((f, i) => {
    const col = [AMBER, TERRA, MAUVE][i % 3], d = Math.hypot(f.c[0] - 40, f.c[1] + 40);
    const on = 0.48 + 0.3 * d / 800;
    add(f.c[0], f.c[1], 16, 90, col, on, 'landing'); add(f.c[0], f.c[1], 12, 18, new THREE.Color('#ffd2a8'), on, 'core');
    beam(f.c[0], f.c[1], 14 + (i % 4) * 4, 70 + (i % 5) * 14, col, on);
    pool(f.c[0], f.c[1], 60, col, on);
  });
  pool(-193, -242, 70, AMBER, 0.28);
  const stage = await ctx.placeModel('festival_stage'); stage.renderOrder = 19;
  // callouts: [east, north, lift, text, sub, in, out]
  const lm = n => L.landings.find(f => f.p.name === n).c;
  for (const [x, y, lift, text, sub, a, b] of [
    [-193, -242, 45, 'Stage', 'Planned', 0.28, 0.6],
    [-60, -560, 40, 'Festival camping', 'Planned', 0.22, 0.6],
    [...lm('Lantern Grove'), 60, 'Lantern Grove', 'Art landing · planned', 0.56, 0.93],
    [...lm('Moss Cathedral'), 60, 'Moss Cathedral', 'Art landing · planned', 0.62, 0.93],
    [462, 10, 70, 'Discovery trail', '16 art landings · planned', 0.68, 0.93],
  ]) {
    const gy = heightAt(x, y), m = card(text, sub); m.position.set(x + 25, gy + lift, -y - 0); scene.add(m);
    const pg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, gy + 2, -y), new THREE.Vector3(x + 25, gy + lift, -y)]);
    const pin = new THREE.Line(pg, new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    pin.renderOrder = 24; scene.add(pin); cards.push({ m, pin, a, b });
  }
  stageMats = []; stage.traverse(o => { if (o.material) { o.material.userData.k = o.material.opacity; stageMats.push(o.material); } });

  rig = R.makeRig([
    // one steady move (reviewer: push-in, pull-back and a 60° swing read as a bob + whip): heading turns one way,
    // the frame only widens, ending on the stage, the grounds and the landings together
    [0.00, -90, -420, 35, 640, 200, -18, 42],
    [0.40, -110, -330, 40, 700, 182, -22, 42],
    [0.75, -20, -300, 55, 860, 158, -27, 42],
    [1.00, 40, -290, 70, 1020, 142, -31, 42],
  ]);

  const mk = (eyebrow, h) => {
    const d = document.createElement('div'); d.className = 'cap';
    d.innerHTML = `<div class="eyebrow">${eyebrow}</div><h1>${h}</h1>`;
    d.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40)); ctx.hud.appendChild(d); return d;
  };
  cap1 = mk('Culture is infrastructure', 'Art isn’t a late amenity.<br>It’s Phase 1.');
  cap2 = mk('Festival grounds · 35 acres · stage · 16 art landings', 'Art festivals in 2027.');
  tag = document.createElement('div');
  tag.style.cssText = 'position:absolute;top:22px;right:22px;font:600 11px/1 Inter,sans-serif;letter-spacing:.22em;color:#EA824E;border:1px solid rgba(234,130,78,.7);padding:8px 12px;border-radius:2px;background:rgba(26,23,32,.55);opacity:0';
  tag.textContent = 'PLANNED'; tag.style.display = 'none'; ctx.hud.appendChild(tag);
}

export function update(t, ctx) {
  const { U, sky, sun, hemi, renderer, rig: { seg } } = ctx;
  rig.apply(ctx.camera, t);
  const n = seg(t, 0.0, 0.5);   // 0 dusk -> 1 night
  const dusk = new THREE.Vector3(0.4, 0.29, 0.31), night = new THREE.Vector3(0.13, 0.12, 0.2);   // blue hour, not black (reviewers)
  U.uLight.value.copy(dusk).lerp(night, Math.pow(n, 0.8));
  const hz = new THREE.Color('#c27a5c').lerp(new THREE.Color('#73516F'), seg(t, 0, 0.25)).lerp(new THREE.Color('#231d33'), seg(t, 0.15, 0.5));
  const top = new THREE.Color('#38387F').lerp(new THREE.Color('#0d0b16'), n);
  sky.mat.uniforms.uHorizon.value.copy(hz); sky.mat.uniforms.uTop.value.copy(top); sky.mat.uniforms.uOpacity.value = 1;
  sky.mat.uniforms.uSun.value.set(-0.9, -0.2, 0.3).normalize();   // sun below the horizon: no disc
  U.uSkyTop.value.copy(top); U.uFog.value.copy(hz); U.uFogDensity.value = 0.00004; renderer.setClearColor(hz);
  sun.color.set('#ff9a66'); sun.intensity = 0.8 * (1 - n) + 0.03;
  hemi.color.set('#8a7fb8'); hemi.groundColor.set('#1a1720'); hemi.intensity = 0.45 * (1 - n) + 0.17;
  for (const c of cards) {
    const k = THREE.MathUtils.clamp(ctx.camera.position.distanceTo(c.m.position) * Math.tan(ctx.camera.fov * Math.PI / 360) / 520, 0.35, 3);
    const tilt = Math.min(1 / Math.max(Math.abs(Math.sin(ctx.camera.rotation.x)), 0.42), 2.3);
    c.m.scale.set(k, k * tilt, 1); c.m.rotation.z = ctx.camera.rotation.y;   // flat + face-up, turned to read along the view
    const op = seg(t, c.a, c.a + 0.06) * (1 - seg(t, c.b, c.b + 0.06));
    c.m.material.opacity = op; c.pin.material.opacity = op * 0.7; c.m.visible = c.pin.visible = op > 0.001;
  }
  lines.forEach((l, i) => { l.material.opacity = l.userData.k * seg(t, 0.04 + i * 0.06, 0.2 + i * 0.06) * (1 - 0.35 * seg(t, 0.55, 0.8)); });
  stars.position.copy(ctx.camera.position); stars.material.opacity = 0.8 * seg(t, 0.3, 0.6);
  for (const g of glows) {
    const on = seg(t, g.on, g.on + 0.14), fl = 0.9 + 0.1 * Math.sin(U.uTime.value * 3.1 + g.ph);   // ~1.7 s fade, never a pop
    // close to the lens the stacked additive glows blow out to white: ease them down near the camera
    const near = g.kind === 'pool' ? 1 : seg(ctx.camera.position.distanceTo(g.s.position), 300, 820);
    g.s.material.opacity = on * fl * near * ({ lantern: 0.8, pool: 0.6, beam: 0.85, core: 0.65 }[g.kind] || 1);
    g.s.visible = on > 0.001;
  }
  const sm = seg(t, 0.2, 0.34);   // the stage draws itself in as a lit blueprint
  for (const m of stageMats) m.opacity = m.userData.k * sm;
  cap1.style.opacity = seg(t, 0.18, 0.28) - seg(t, 0.52, 0.6);
  cap2.style.opacity = seg(t, 0.56, 0.64);   // crossfades with the first line: never a gap
  tag.style.opacity = seg(t, 0.05, 0.15);
}

// ch12 reuses this chapter's night lights over the flattening land
export function parts() { return { glows, lines, stars, stageMats, cards, caps: [cap1, cap2, tag] }; }

// Chapter 11 — Festival grounds & light. Dusk to night over the meadow south of the lake: the stage, festival
// camping and the discovery trail's 16 art landings glow in brand colours. All of it is PLANNED.
// (Mike 10-29) a punch-in on the grounds, then down onto the trail and along it past the art up close, across to the
// lit stage, where 'Art festivals in 2027' lands and ch12 rises out; the grounds are cleared of trees while it plays.
import * as THREE from 'three';
import { polysOf } from '../sheet.js';

const FACE = 25 * Math.PI / 180;   // the way the stage faces, as a math angle from east
export const meta = { id: 'ch11', title: 'Festival grounds & light', seconds: 24, animated: true };

const AMBER = new THREE.Color('#EA824E'), TERRA = new THREE.Color('#AF695E'), MAUVE = new THREE.Color('#73516F');
let landingFloor, landingBits = [], landingMats = [], rig, cap1, cap2, cap3, cap4, tag, lines, glows = [], stars, stageMats = [], cards = [], stage = null, stageGY = 0, STAGE, art = [], treeSet, meadow, forestFloor, camp, crowd2, trail2;

// flat, face-up callout card on a pin (same look as labels.js): amber title + "PLANNED · CONCEPT"
function card(text, sub) {
  const s = 4, fs = 30 * s, sfs = 20 * s, pad = 14 * s, c = document.createElement('canvas'), g = c.getContext('2d');
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
  // the thousands of small lamps as one draw call each kind, not a sprite apiece (the trail glide ran at 88 ms a frame)
  const small = { path: { p: [], c: [], size: 3.2 }, bulb: { p: [], c: [], size: 1.1 } };
  const add = (x, y, lift, size, color, on, kind) => {
    if (small[kind]) { small[kind].p.push(x, heightAt(x, y) + lift, -y); small[kind].c.push(color.r, color.g, color.b); return; }
    const m = new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: kind === 'path' || kind === 'bulb' || kind === 'core' });   // big halos over the trees: tree cut-outs tore them into 'flames' (i12)
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
    const m = new THREE.SpriteMaterial({ map: beamTex, color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false });
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
  // stage (the halo is kept small: the real stage rig carries the light now)
  add(-203, -241, 10, 60, AMBER, 0.12, 'stage'); add(-203, -241, 5, 24, new THREE.Color('#ffd9b0'), 0.12, 'stage');
  // festival lanterns over the camp plots
  L.camp_plots.forEach((f, i) => {
    if (i % 3) return; const r = f.c[0];
    const c = [r.reduce((a, p) => a + p[0], 0) / r.length, r.reduce((a, p) => a + p[1], 0) / r.length];
    add(c[0], c[1], 5, 14, i % 2 ? AMBER : TERRA, 0.12 + 0.12 * ((-c[1] - 330) / 480), 'lantern');   // lantern-sized, coming on one by one
  });
  // art landings: mauve / terracotta / amber installations, lit along the trail (all on before the camera flies it)
  L.landings.forEach((f, i) => {
    const col = [AMBER, TERRA, MAUVE][i % 3], d = Math.hypot(f.c[0] - 40, f.c[1] + 40);
    const on = 0.16 + 0.12 * d / 800;
    add(f.c[0], f.c[1], 16, 55, col, on, 'landing'); add(f.c[0], f.c[1], 12, 18, new THREE.Color('#ffd2a8'), on, 'core');
    beam(f.c[0], f.c[1], 14 + (i % 4) * 4, 70 + (i % 5) * 14, col, on);
    pool(f.c[0], f.c[1], 32, col, on);
  });
  // path lights every 9 m along the whole trail (Mike 10-29: "that hiking trail line should be more visible … so we
  // can continue to track it"): small warm lamps that read as a dotted line of light from far away and as lamps up close
  for (const f of L.discovery_trail) {
    const c = f.c; let carry = 0;
    for (let i = 0; i < c.length - 1; i++) {
      const [ax, ay] = c[i], [bx, by] = c[i + 1], len = Math.hypot(bx - ax, by - ay);
      for (let s = carry; s < len; s += 9) { const k = s / len; add(ax + (bx - ax) * k, ay + (by - ay) * k, 1.0, 3, new THREE.Color('#ffc890'), 0.2 + 0.05 * ((i * 7) % 10) / 10, 'path'); }
      carry = (carry - len) % 9; if (carry < 0) carry += 9;
    }
  }
  // festoon strings fanned out from the stage over the audience meadow: warm bulbs every 2 m on a sagging line
  const SP = [-203, -241];   // the stage faces out of the pocket, bearing 65°
  for (let k = -3; k <= 3; k++) {
    const a = FACE + k * 0.2;   // fan of 7 strings, 11° apart
    for (let d = 16; d <= 70; d += 2) {   // from the deck's front edge out (i8: bulbs ran across the deck)
      const u = (d - 16) / 54, sag = 7 - 3 * Math.sin(Math.PI * u);
      add(SP[0] + Math.cos(a) * d, SP[1] + Math.sin(a) * d, sag, 0.75, new THREE.Color(k % 2 ? '#ffd7a0' : '#ffb27a'), 0.14 + 0.01 * Math.abs(k), 'bulb');
    }
  }
  pool(-203, -241, 70, AMBER, 0.12);
  const smallReady = () => { for (const [kind, S] of Object.entries(small)) { if (!S.p.length) continue; const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(S.p, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(S.c, 3)); const pts = new THREE.Points(g, new THREE.PointsMaterial({ map: tex, size: S.size, vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); pts.frustumCulled = false; pts.renderOrder = 23; pts.scale.setScalar(1); scene.add(pts); glows.push({ s: pts, size: 0, on: kind === 'path' ? 0.22 : 0.15, kind, ph: 0 }); } };
  // the planned event pavilion stood black in the night meadow (i9): warm light inside it
  { const l = new THREE.PointLight(0xffc890, 220, 40, 2); l.position.set(-140, heightAt(-140, -278) + 3, 278); scene.add(l); add(-140, -278, 9, 26, new THREE.Color('#ffc890'), 0.1, 'lantern'); const l2 = new THREE.PointLight(0xffd8b0, 300, 60, 2); l2.position.set(-140, heightAt(-140, -278) + 16, 278); scene.add(l2); }
  // the crowd in front of the stage: dark figures fanned over the meadow (i12)
  {
    const pts = []; let sd = 5; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    while (pts.length < (ctx.MOBILE ? 150 : 620)) { const d = 13 + 45 * Math.sqrt(rnd()), a = FACE + (rnd() - 0.5) * 1.15 * (1 - 0.3 * d / 58); pts.push([-203 + Math.cos(a) * d, -241 + Math.sin(a) * d]); }
    crowd2 = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.2, 1.05, 2, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), pts.length);
    const dm = new THREE.Object3D(), cc = new THREE.Color(), c0 = new THREE.Color(0x2e2029), c1 = new THREE.Color(0x14111a);   // lit by the stage, falling off to the back (i17: barely visible)
    pts.forEach(([x, y], i) => { dm.position.set(x, ctx.groundAt(x, y) + 0.85, -y); dm.scale.set(1, 0.85 + rnd() * 0.3, 1); dm.updateMatrix(); crowd2.setMatrixAt(i, dm.matrix); crowd2.setColorAt(i, cc.copy(c0).lerp(c1, Math.min(1, (Math.hypot(x + 193, y + 242) - 13) / 40))); });
    crowd2.frustumCulled = false; scene.add(crowd2);
    const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 8, 6), crowd2.material, pts.length);
    pts.forEach(([x, y], i) => { dm.position.set(x, ctx.groundAt(x, y) + 1.72, -y); dm.scale.setScalar(1); dm.updateMatrix(); heads.setMatrixAt(i, dm.matrix); heads.setColorAt(i, cc.copy(c0).lerp(c1, Math.min(1, (Math.hypot(x + 193, y + 242) - 13) / 40))); }); heads.frustumCulled = false; crowd2.add(heads); crowd2.position.set(0, 0, 0);
  }   // (above the roof: i11, it read as a black hole)
  // the grounds around the crowd (Mike 11-02: more detail): market stalls in an arc behind it, a bar, flags, light towers, picnic tables
  {
    const box = (w, h, d) => new THREE.BoxGeometry(w, h, d), solid = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, emissive: c, emissiveIntensity: 0.12 });
    const place = (geo, mat, x, y, up, ry = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, ctx.groundAt(x, y) + up, -y); m.rotation.y = ry; scene.add(m); return m; };
    const ARC = (d, a) => [-203 + Math.cos(FACE + a) * d, -241 + Math.sin(FACE + a) * d], CANVAS = [0xd9c6a0, 0xb5532e, 0xd19a3a, 0x2f6f6b, 0xe8ddc8, 0x8c3b2f];
    for (let k = 0; k < 13; k++) { const a = -0.95 + k * 0.158, [x, y] = ARC(78, a), ry = Math.PI / 2 - (FACE + a) + Math.PI / 2;
      place(box(4.6, 2.2, 3.4), solid(0x6b5a44), x, y, 1.1, ry);
      const top = place(new THREE.ConeGeometry(3.6, 1.5, 4), solid(CANVAS[k % 6]), x, y, 2.95, ry + Math.PI / 4);
      place(box(4.2, 0.9, 0.5), solid(0x8a6a4a), x - Math.cos(FACE + a) * 2, y - Math.sin(FACE + a) * 2, 0.45, ry);
      add(x - Math.cos(FACE + a) * 2.2, y - Math.sin(FACE + a) * 2.2, 2.3, 7, new THREE.Color('#ffd7a0'), 0.16 + k * 0.004, 'lantern'); }
    for (let k = 0; k < 16; k++) { const a = -1.2 + k * 0.16, [x, y] = ARC(62 + (k % 2) * 3, a); place(new THREE.CylinderGeometry(0.05, 0.06, 7, 6), solid(0x3a3128), x, y, 3.5); const f = place(new THREE.PlaneGeometry(1.1, 2.6), new THREE.MeshStandardMaterial({ color: CANVAS[k % 6], side: THREE.DoubleSide, emissive: CANVAS[k % 6], emissiveIntensity: 0.2 }), x + 0.55, y, 5.6, k * 0.4); }
    for (const a of [-0.9, 0.9]) { const [x, y] = ARC(46, a); place(new THREE.CylinderGeometry(0.2, 0.3, 11, 8), solid(0x26262a), x, y, 5.5); place(box(1.8, 0.8, 0.6), solid(0x1b1b1f), x, y, 11, Math.PI / 2 - FACE); add(x, y, 11, 16, new THREE.Color('#fff1da'), 0.2, 'lantern'); }
    { const [x, y] = ARC(66, 1.32); place(box(9, 2.6, 3), solid(0x7a5233), x, y, 1.3, 0.4); place(box(10, 0.2, 5), solid(0x4a3322), x, y, 3.3, 0.4); add(x, y, 3, 12, new THREE.Color('#ffcf90'), 0.2, 'lantern'); }
    for (let k = 0; k < 14; k++) { const a = -0.7 + k * 0.11, [x, y] = ARC(70 + (k % 3) * 1.5 - 4, a); place(box(2, 0.08, 0.9), solid(0x8a6a4a), x, y, 0.76, k * 0.5); place(box(2, 0.06, 0.3), solid(0x8a6a4a), x + 0.7, y, 0.46, k * 0.5); place(box(2, 0.06, 0.3), solid(0x8a6a4a), x - 0.7, y, 0.46, k * 0.5); }
  }
  // this chapter's own stage, not the engine's shared model (Mike 10-30, ~frame 5062: ch11 and ch12 shared one object, so
  // the film's chapter switch hid it and ch12 showed it again — it popped)
  STAGE = await import('../models/festival_stage.js');
  { const pl = STAGE.meta.place; stage = STAGE.build({ lod: ctx.MOBILE ? 'low' : 'high' }); stage.position.set(pl.x, heightAt(pl.x, pl.y), -pl.y); stage.rotation.y = pl.rotY; scene.add(stage); stageGY = heightAt(pl.x, pl.y); }

  // (round-1 art pieces removed — Mike 10-29: "pretty low quality"; the landings show as light beacons until round 2)
  const lm = n => L.landings.find(f => f.p.name === n).c;
  art = [];

  // callouts: [east, north, lift, text, sub, in, out, side offset]
  // the trail flight: Kindling Circle → Firefly Bend along the trail's second branch, flown north-west
  const T1 = L.discovery_trail[1].c, cum = [0];
  for (let i = 1; i < T1.length; i++) cum.push(cum[i - 1] + Math.hypot(T1[i][0] - T1[i - 1][0], T1[i][1] - T1[i - 1][1]));
  const at = s => { s = Math.max(0, Math.min(cum[cum.length - 1], s)); let i = 1; while (i < cum.length - 1 && cum[i] < s) i++; const k = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1); return [T1[i - 1][0] + (T1[i][0] - T1[i - 1][0]) * k, T1[i - 1][1] + (T1[i][1] - T1[i - 1][1]) * k]; };
  const S0 = 382, S1 = 0, TA = 0.479, TB = 0.646;   // (i7: the glide ran 6.6 s of dark blur — shorter now)   // arc length (m) along the branch, and when the flight runs
  const tOf = s => TA + (TB - TA) * (S0 - s) / (S0 - S1);
  // one card at a time, on alternating sides (i7: Lantern Grove and Firefly Bend overlapped, 30 m apart — one card now)
  const landingCards = [['Moss Cathedral', 300, 215]]   // (i11: two, ~2 s each — the four at ~0.6 s never read)
    .map(([n, s0, s1]) => [...lm(n), 14, n, 'Art landing · planned', tOf(s0), tOf(s1), 14]);   // (i9: all on the right — the left ones sat on the trail headline)   // (i8: lift 14, in once the camera is level)
  for (const [x, y, lift, text, sub, a, b, off = 25] of [
    [-203, -241, 45, 'Stage', 'Planned', 0.28, 0.36],
    [-203, -241, 13, 'Stage', 'Planned', 0.85, 1.01, 12],
  ]) {
    const gy = heightAt(x, y), m = card(text, sub); m.position.set(x + off, gy + lift, -y); scene.add(m);
    const pg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, gy + 2, -y), new THREE.Vector3(x + off, gy + lift, -y)]);
    const pin = new THREE.Line(pg, new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    pin.renderOrder = 24; scene.add(pin); cards.push({ m, pin, a, b, near: lift < 20 });
  }
  stageMats = [];   // (the stage is a solid model now; ch12 hides it as the land flattens)

  // festival grounds cleared of trees while the festival plays (the real forest stays in the 'here today' chapters)
  const fgRings = L.festival_grounds.flatMap(f => polysOf(f).map(p => p[0]));
  // (+ the stage's own plot and the audience meadow in front of it, which sit just outside the grounds' outline)
  // Mike 11-02: no trees come down out here. Only the stage's own plot and the crowd in front of it stay clear.
  const crowd = Array.from({ length: 24 }, (_, i) => { const a = i / 24 * Math.PI * 2; return [-203 + Math.cos(FACE) * 28 + Math.cos(a) * 34, -241 + Math.sin(FACE) * 28 + Math.sin(a) * 34]; });
  treeSet = ctx.treesIn([crowd]);
  // …and the ground there reads as an open mown meadow, not the aerial photo of the forest that stood on it: a grass
  // sheet draped on the terrain, cut to the grounds' outline by an alpha mask
  {
    const b = fgRings.flat().reduce((a, [x, y]) => [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)], [1e9, 1e9, -1e9, -1e9]);
    const w = b[2] - b[0], h = b[3] - b[1], cv = document.createElement('canvas'); cv.width = 512; cv.height = Math.round(512 * h / w);
    const g = cv.getContext('2d'), X = x => (x - b[0]) / w * cv.width, Y = y => (b[3] - y) / h * cv.height;
    const img = g.createImageData(cv.width, cv.height);
    for (let i = 0; i < img.data.length; i += 4) {   // meadow greens with mown bands and a little noise
      const px = (i / 4) % cv.width, py = Math.floor(i / 4 / cv.width), n = Math.sin(px * 0.9) * Math.sin(py * 1.3) * 6 + (Math.sin(px * 0.11 + py * 0.07) > 0 ? 7 : 0) + ((px * 7919 + py * 104729) % 13);
      const v = 10 * Math.sin(px * 0.031 + Math.sin(py * 0.017) * 2) * Math.sin(py * 0.023 + px * 0.006);   // broad patches: taller grass, worn paths
      img.data[i] = 62 + n + v * 0.8; img.data[i + 1] = 92 + n * 1.2 + v; img.data[i + 2] = 44 + n * 0.5 + v * 0.3; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    g.globalCompositeOperation = 'destination-in'; g.filter = 'blur(9px)'; g.fillStyle = '#fff';   // a soft, feathered edge (i7: hard straight edges)
    for (const r of fgRings) { g.beginPath(); r.forEach(([x, y], i) => i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y))); g.fill(); }
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const nx = Math.ceil(w / 4), ny = Math.ceil(h / 4), geo = new THREE.PlaneGeometry(w, h, nx, ny).rotateX(-Math.PI / 2), P = geo.attributes.position;
    for (let i = 0; i < P.count; i++) { const x = b[0] + w / 2 + P.getX(i), y = b[1] + h / 2 - P.getZ(i); P.setX(i, x); P.setZ(i, -y); P.setY(i, ctx.groundAt(x, y) + 0.25); }
    geo.computeVertexNormals();
    meadow = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.02, depthWrite: true }));   // lit like the land (uLight) in update
    meadow.renderOrder = 2; meadow.visible = false;   // (Mike 11-02: the field keeps its own look)
  }
  // the campground on the meadow, plot by plot (Mike 10-30), with a small fire glow at each pit
  {
    const CAMP = await import('../models/festival_camp.js');
    camp = CAMP.build({ L, ground: ctx.groundAt, lod: ctx.MOBILE ? 'low' : 'high' }); scene.add(camp.group);
    for (const [x, y] of camp.fires) add(x, y, 0.7, 5, new THREE.Color('#ff9a52'), 0.14 + 0.1 * Math.abs(Math.sin(x * 7.3 + y)), 'bulb');
  }
  // the landing the camera stops on, as a real clearing: a sharp moss-and-needle floor, ferns, rocks, fallen logs (i17: a smeared ground and a blank plate)
  {
    const [lx, ly] = lm('Moss Cathedral'), cv = document.createElement('canvas'); cv.width = cv.height = 512; const g = cv.getContext('2d');
    g.fillStyle = '#39402a'; g.fillRect(0, 0, 512, 512);
    let sd = 23; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 90; i++) { const x = rnd() * 512, y = rnd() * 512, r = 14 + rnd() * 46, gr = g.createRadialGradient(x, y, 0, x, y, r), mo = rnd() > 0.4; gr.addColorStop(0, mo ? 'rgba(92,120,52,.7)' : 'rgba(104,78,50,.7)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
    for (let i = 0; i < 5200; i++) { const x = rnd() * 512, y = rnd() * 512, a = rnd() * Math.PI, l = 3 + rnd() * 11, k = rnd(); g.strokeStyle = k < 0.5 ? `rgba(${132 + rnd() * 40},${98 + rnd() * 26},${58},.55)` : k < 0.8 ? `rgba(${44},${36},${26},.6)` : `rgba(${88},${124 + rnd() * 30},${58},.6)`; g.lineWidth = 0.7 + rnd() * 1.3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.anisotropy = 16;
    const R0 = 72, N = 60, pos = [], uv = [], fe = [], idx = [];
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) { const x = lx + (i / N - 0.5) * 2 * R0, y = ly + (j / N - 0.5) * 2 * R0, d = Math.hypot(x - lx, y - ly); pos.push(x, ctx.groundAt(x, y) + 0.38, -y); uv.push(x / 9, y / 9); fe.push(1 - Math.min(1, Math.max(0, (d - R0 * 0.6) / (R0 * 0.38)))); }
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + N + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setAttribute('fe', new THREE.Float32BufferAttribute(fe, 1)); geo.setIndex(idx);
    const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    m.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float fe; varying float vFe;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvFe = fe;'); sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vFe;').replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.a *= vFe;'); };
    landingFloor = new THREE.Mesh(geo, m); landingFloor.renderOrder = 4; scene.add(landingFloor);
    const spots = n => Array.from({ length: n }, () => { const a = rnd() * 6.283, d = 8 + rnd() * 52; return [lx + Math.cos(a) * d, ly + Math.sin(a) * d, rnd()]; }), dm = new THREE.Object3D();
    const inst = (geo, mat, list, set) => { const o = new THREE.InstancedMesh(geo, mat, list.length); list.forEach((v, i) => { set(v); dm.updateMatrix(); o.setMatrixAt(i, dm.matrix); }); o.frustumCulled = false; scene.add(o); landingBits.push(o); };
    landingMats = [new THREE.MeshBasicMaterial({ color: 0x3f6a32 }), new THREE.MeshBasicMaterial({ color: 0x77726a }), new THREE.MeshBasicMaterial({ color: 0x3a2a1e })];
    const fern = new THREE.BufferGeometry(); { const p = []; for (let a = 0; a < 7; a++) { const c = Math.cos(a * 0.9), s = Math.sin(a * 0.9), l = 0.55 + (a % 3) * 0.14; p.push(-s * 0.05, 0, c * 0.05, s * 0.05, 0, -c * 0.05, c * l, 0.42 + (a % 2) * 0.1, s * l); } fern.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); }
    landingMats[0].side = THREE.DoubleSide;
    inst(fern, landingMats[0], spots(1100), ([x, y, k]) => { dm.position.set(x, ctx.groundAt(x, y) + 0.36, -y); dm.rotation.set(0, k * 40, 0); dm.scale.setScalar(0.7 + k * 0.9); });
    inst(new THREE.DodecahedronGeometry(0.5, 0), landingMats[1], spots(46), ([x, y, k]) => { dm.position.set(x, ctx.groundAt(x, y) + 0.45, -y); dm.rotation.set(k * 3, k * 6, k * 2); dm.scale.set(0.5 + k * 1.4, 0.4 + k * 0.7, 0.6 + k); });
    inst(new THREE.CylinderGeometry(0.22, 0.3, 7, 7).rotateZ(Math.PI / 2), landingMats[2], spots(7), ([x, y, k]) => { dm.position.set(x, ctx.groundAt(x, y) + 0.6, -y); dm.rotation.set(0, k * 6.28, 0.04); dm.scale.set(0.7 + k * 0.6, 1, 1); });
  }
  // the trail as a real footpath: earth ribbon, lantern posts, timber landings with fire bowls (Mike 10-30)
  { const TR = await import('../models/festival_trail.js'); trail2 = TR.build({ L, ground: ctx.groundAt, lod: ctx.MOBILE ? 'low' : 'high' }); scene.add(trail2.group); }
  // a crisp forest floor along the flown branch of the trail (i9: off the survey the ground is the blurry low-res
  // photo, which read as murk on the glide): a strip ~90 m wide draped on the terrain, needle-litter texture tiled every
  // 6 m, feathered at its sides and ends; shown only in the festival chapters
  {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
    g.fillStyle = '#39452a'; g.fillRect(0, 0, 256, 256);   // moss green: mostly grass-coloured, as the rest of the land now
    let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 2600; i++) {   // needles, twigs, a little moss
      const x = rnd() * 256, y = rnd() * 256, a = rnd() * Math.PI, l = 3 + rnd() * 9, k = rnd();
      g.strokeStyle = k < 0.2 ? `rgba(${110 + rnd() * 40},${88 + rnd() * 25},${48 + rnd() * 15},.45)` : k < 0.45 ? `rgba(${40 + rnd() * 20},${50 + rnd() * 15},${30},.6)` : `rgba(${72},${108 + rnd() * 30},${50},.55)`;
      g.lineWidth = 0.8 + rnd() * 1.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.anisotropy = 8;
    // a draped grid round the whole flown branch, faded by distance from the path (a ribbon this wide folded over itself on the bends: hard edges)
    const R = 300, step = 6, xs = T1.map(p => p[0]), ys = T1.map(p => p[1]), x0 = Math.min(...xs) - R, x1 = Math.max(...xs) + R, y0 = Math.min(...ys) - R, y1 = Math.max(...ys) + R;
    const nx = Math.ceil((x1 - x0) / step), ny = Math.ceil((y1 - y0) / step), pos = [], uv = [], al = [], idx = [];
    const dist = (x, y) => { let d = 1e9; for (let i = 0; i < T1.length - 1; i += 2) { const [ax, ay] = T1[i], [bx, by] = T1[Math.min(i + 2, T1.length - 1)], ex = bx - ax, ey = by - ay, u = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey || 1))); d = Math.min(d, Math.hypot(x - ax - ex * u, y - ay - ey * u)); } return d; };
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const x = x0 + i * step, y = y0 + j * step; pos.push(x, ctx.groundAt(x, y) + 0.3, -y); uv.push(x / 6, y / 6); al.push(Math.min(1, Math.max(0, (R - dist(x, y)) / 50))); }
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = j * (nx + 1) + i, b = a + nx + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setAttribute('fe', new THREE.Float32BufferAttribute(al, 1)); geo.setIndex(idx);
    const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    m.onBeforeCompile = sh => {   // the 'fe' attribute carries the edge feather (alpha)
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float fe; varying float vFe;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvFe = fe;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vFe;').replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.a *= vFe;');
    };
    forestFloor = new THREE.Mesh(geo, m); forestFloor.renderOrder = 3; scene.add(forestFloor);
  }

  smallReady();
  // [t, east, north, height, frameH, heading°, pitch°, fov°] — the whole chapter looks north-west: toward the stage's
  // front, along the trail and back at the campus, so no move needs a big turn (Mike 10-29 frame list)
  const gA = ctx.groundAt, O = [-62, -398];
  // Mike 11-02: no trail close-ups (no art that doesn't exist). From the view over the grounds the camera pans across to the trails, then moves to the stage.
  const pose = (t, cx, cy, ch, hd, pitch, frame, fov) => { const d = frame / (2 * Math.tan(fov * Math.PI / 360)), c = Math.cos(pitch * Math.PI / 180), s = Math.sin(pitch * Math.PI / 180), a = hd * Math.PI / 180, x = cx + Math.sin(a) * c * d, y = cy + Math.cos(a) * c * d; return [t, x, y, ch + s * d, frame, hd, pitch, fov]; };
  const CX = 150, CY = -650, CH = 215;
  rig = R.makeRig([
    pose(0.00, CX, CY, CH, 322, -26, 340, 46),
    pose(0.22, CX, CY, CH, 320, -25, 330, 46),     // hold: dusk falls over the grounds
    pose(0.42, CX, CY, CH, 40, -17, 420, 46),      // pan across to the hiking trails, same spot
    pose(0.54, CX, CY, CH, 42, -17, 420, 46),
    [0.78, -203 + 200, -241 + 90, gA(-203, -241) + 30, 200, 246, -18, 50],
    [0.88, -203, -241, gA(-203, -241) + 7, 44, 245, -8, 50],
    [1.00, -203, -241, gA(-203, -241) + 7, 38, 245, -8, 50],
  ]);

  const mk = (eyebrow, h) => {
    const d = document.createElement('div'); d.className = 'cap';
    d.innerHTML = `<div class="eyebrow">${eyebrow}</div><h1>${h}</h1>`;
    d.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40)); ctx.hud.appendChild(d); return d;
  };
  cap1 = mk('Festival grounds', 'Art isn’t a late amenity.<br>It starts now.');
  cap2 = mk('Festival grounds · stage · art trails', 'Art festivals in 2027.');
  // the trail gets its own line while the camera glides along it (i8: 18 s with no words)
  cap3 = mk('The discovery trail', 'Hiking and art trails<br>through the forest.');
  cap4 = mk('Festival camping', 'Tents and vans,<br>plot by plot.');
  tag = document.createElement('div');
  tag.style.cssText = 'position:absolute;top:22px;right:22px;font:600 11px/1 Inter,sans-serif;letter-spacing:.22em;color:#EA824E;border:1px solid rgba(234,130,78,.7);padding:8px 12px;border-radius:2px;background:rgba(26,23,32,.55);opacity:0';
  tag.textContent = 'PLANNED'; tag.style.display = 'none'; ctx.hud.appendChild(tag);
}

export function update(t, ctx) {
  const { U, sky, sun, hemi, renderer, rig: { seg } } = ctx;
  rig.apply(ctx.camera, t);
  ctx.hideTrees(treeSet, true);
  const n = seg(t, 0.56, 0.8);   // golden dusk over the camp and the trail, so their detail reads; night arrives for the stage (10-31)
  const dusk = new THREE.Vector3(0.92, 0.72, 0.62), night = new THREE.Vector3(0.17, 0.18, 0.31);   // (i8: dusk 25 % brighter: the overview was muddy)   // blue hour, not black (reviewers); cooler, not a dimmed photo (i3)
  U.uLight.value.copy(dusk).lerp(night, Math.pow(n, 0.8));   // the forest floor drops back on the trail glide so the lamps carry it (i7)
  if (meadow) { const l = U.uLight.value; meadow.material.color.setRGB(l.x * 1.15, l.y * 1.15, l.z * 1.15); }
  if (camp) camp.setLight(U.uLight.value, seg(t, 0.05, 0.3));
  if (trail2) trail2.setLight(U.uLight.value);
  if (landingFloor) { const l = U.uLight.value; landingFloor.material.color.setRGB(l.x * 1.5 + 0.06, l.y * 1.5 + 0.05, l.z * 1.3 + 0.03); landingMats.forEach(m => m.color.setHex(m === landingMats[0] ? 0x3f6a32 : m === landingMats[1] ? 0x77726a : 0x3a2a1e).multiply(new THREE.Color(l.x * 1.3 + 0.05, l.y * 1.3 + 0.05, l.z * 1.2 + 0.04))); }
  if (forestFloor) { const l = U.uLight.value; forestFloor.material.color.setRGB(l.x * 1.5, l.y * 1.4, l.z * 1.1); }   // warmer: lit by the trail lamps
  const hz = new THREE.Color('#c27a5c').lerp(new THREE.Color('#73516F'), seg(t, 0.3, 0.58)).lerp(new THREE.Color('#231d33'), seg(t, 0.56, 0.8));
  const top = new THREE.Color('#38387F').lerp(new THREE.Color('#0d0b16'), n);
  sky.mat.uniforms.uHorizon.value.copy(hz); sky.mat.uniforms.uTop.value.copy(top); sky.mat.uniforms.uOpacity.value = 1;
  sky.mat.uniforms.uSun.value.set(-0.9, -0.2, 0.3).normalize();   // sun below the horizon: no disc
  U.uSkyTop.value.copy(top); U.uFog.value.copy(hz); U.uFogDensity.value = 0.00004; renderer.setClearColor(hz);
  sun.color.set('#ff9a66'); sun.intensity = 0.8 * (1 - n) + 0.03;
  hemi.color.set('#8a7fb8'); hemi.groundColor.set('#1a1720'); hemi.intensity = 0.95 * (1 - n) + 0.2;
  const cam = ctx.camera;
  for (const c of cards) {
    const dist = cam.position.distanceTo(c.m.position);
    // far cards keep their old size; close ones (the trail landings, the stage up close) are drawn larger so they read
    const k = THREE.MathUtils.clamp(dist * Math.tan(cam.fov * Math.PI / 360) / 520 * (c.near ? 1.6 : 1), c.near ? 0.03 : 0.35, 3);
    const tilt = Math.min(1 / Math.max(Math.abs(Math.sin(cam.rotation.x)), 0.42), 2.3);
    c.m.scale.set(k, k * tilt, 1); c.m.rotation.z = cam.rotation.y;   // flat + face-up, turned to read along the view
    // close cards fade before the lens reaches them (i6: a landing card swelled across the frame as it passed under)
    const op = seg(t, c.a, c.a + 0.03) * (1 - seg(t, c.b, c.b + 0.03)) * (c.near ? seg(dist, 35, 70) : 1);
    c.m.material.opacity = op; c.pin.material.opacity = op * 0.7; c.m.visible = c.pin.visible = op > 0.001;
  }
  // plan linework (drawn over everything) reads from high up only: out for the low flight, back for the wide end
  const high = 1 - seg(t, 0.36, 0.45);
  lines.forEach((l, i) => { l.material.opacity = l.userData.k * (i === 2 ? seg(t, 0.2, 0.28) : seg(t, 0.02 + i * 0.03, 0.09 + i * 0.03)) * high * (i === 1 ? 0.7 : 1); });
  stars.position.copy(cam.position); stars.material.opacity = 0.8 * seg(t, 0.66, 0.82);
  for (const g of glows) {
    const on = seg(t, g.on, g.on + 0.06), fl = 0.9 + 0.1 * Math.sin(U.uTime.value * 3.1 + g.ph);   // ~1.8 s fade, never a pop
    // close to the lens the big stacked additive halos blow out to white: ease those down near the camera; the small
    // lamps (path, bulbs, cores) stay on so the art and the trail read up close
    const d = cam.position.distanceTo(g.s.position);
    const near = g.kind === 'pool' ? 0.25 + 0.75 * seg(d, 40, 170) : g.kind === 'path' || g.kind === 'bulb' ? 1 : g.kind === 'core' || g.kind === 'beam' ? seg(d, 10, 40) : g.kind === 'landing' ? seg(d, 40, 120) : seg(d, 260, 760);   // (i8: the beacons had faded out at exactly the glide's range)
    const dive = g.kind === 'beam' ? 1 - seg(t, 0.36, 0.42) + seg(t, 0.66, 0.72) : 1;   // (i9: the dive flew through a beam)
    g.s.material.opacity = on * fl * near * dive * ({ lantern: 0.4, pool: 0.18, beam: 0.85, core: 0.4, path: 0.45, bulb: 0.95 }[g.kind] || 0.55);
    g.s.visible = on > 0.001 && near > 0.001;
  }
  const show = seg(t, 0.0, 0.08);   // the stage glows from the first frame (i9)
  if (stage) STAGE.update(stage, U.uTime.value, show);
  for (const a of art) a.mod.update?.(a.o, U.uTime.value);
  cap1.style.opacity = seg(t, 0.04, 0.07) - seg(t, 0.2, 0.23);   // in with the overview (i7: 2.4 s with no words)
  cap2.style.opacity = seg(t, 0.8, 0.84);   // on the approach and the stage hold (i9, i11)
  cap4.style.opacity = 0;
  cap3.style.opacity = seg(t, 0.42, 0.45) - seg(t, 0.56, 0.59);   // from the start of the dive (i9)
  tag.style.opacity = seg(t, 0.05, 0.15);
}

// ch12 reuses this chapter's night lights over the flattening land
export function parts() { return { glows, lines, stars, stageMats, cards, stage, stageGY, art, meadow, forestFloor, landingFloor, landingBits, camp, crowd2, trail2, caps: [cap1, cap2, cap3, cap4, tag], treeSet }; }

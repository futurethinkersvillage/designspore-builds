// Full-screen 3D viewer for the Zome Range page: orbit around a zome, or walk around it and through its door.
// Walking uses the same shell, floor and furniture data as the floor plans, so you can't walk through walls or beds.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { build, setClip, setDusk, zome } from './models/zome_types.js';
import { planById } from './models/zome_plans.js';
import { inPoly } from './models/zome_geom.js';
import { KINDS } from './models/zome_furniture.js';

const D = Math.PI / 180;
const rnd = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

function grassTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#979c7a'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) { const x = rnd(i) * 512, y = rnd(i + 1e4) * 512, t = rnd(i + 2e4); g.strokeStyle = t > 0.6 ? 'rgba(165,172,120,.4)' : t > 0.3 ? 'rgba(112,124,84,.42)' : 'rgba(185,175,130,.28)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2 * (rnd(i + 3e4) - 0.5), y - 3 - rnd(i + 4e4) * 5); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(30, 30); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

// ---- where a person can stand -----------------------------------------------------------------------------------------
function makeWalker(Z, plan) {
  const solid = (plan?.items || []).filter(i => { const K = KINDS[i.k]; return i.y === undefined && i.k !== 'wall' && !K.soft && !K.arc; });
  const walls = (plan?.items || []).filter(i => i.k === 'wall');
  const arcs = (plan?.items || []).filter(i => KINDS[i.k]?.arc);
  const R = 0.22;   // shoulder clearance
  const hitItem = (x, z) => solid.some(i => {
    const K = KINDS[i.k], r = (i.r || 0) * D, dx = x - i.x, dz = z - i.z, lx = dx * Math.cos(r) - dz * Math.sin(r), lz = dx * Math.sin(r) + dz * Math.cos(r), w = (i.w || K.w) / 2 + R, d = (i.d || K.d) / 2 + R;
    return K.round ? Math.hypot(lx, lz) < w : Math.abs(lx) < w && Math.abs(lz) < d;
  });
  const hitArc = (x, z) => arcs.some(a => { const rr = Math.hypot(x - a.x, z - a.z), az = Math.atan2(x - a.x, z - a.z) / D; return rr > a.r0 - R && rr < a.r1 + R && az > Math.min(a.a0, a.a1) && az < Math.max(a.a0, a.a1); });
  const hitWall = (x, z) => walls.some(w => {
    const [ax, az] = w.a, [bx, bz] = w.b, l2 = (bx - ax) ** 2 + (bz - az) ** 2, u = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / l2));
    if (w.door !== undefined && Math.abs(u - w.door) * Math.sqrt(l2) < (w.dw || 0.8) / 2 - 0.12) return false;
    return Math.hypot(x - ax - u * (bx - ax), z - az - u * (bz - az)) < R + 0.05;
  });
  // solid shell seen from outside: test shoulders at a few heights against the outer skin
  const outer = Z.planes.map(p => ({ n: p.n, d: p.d + Z.inset + Z.o + 0.28 }));
  const inShell = (x, z) => [0.35, 1.0, 1.7].some(y => outer.every(p => p.n[0] * x + p.n[1] * (y + Z.floorY) + p.n[2] * z <= p.d));
  const I = Z.info;
  const land = Z.info.landing;
  const steps = { x: Math.min(1.5, 2 * land.x * 0.72) / 2, z1: land.z1 + 0.28 * Math.max(1, Math.round(Z.floorY / 0.17)) };
  const onLanding = (x, z) => (Math.abs(x) < land.x && z > land.z0 && z < land.z1) || (Math.abs(x) < steps.x && z >= land.z1 && z < steps.z1);
  // door A's recessed porch sits inside the shell's outline
  const inPorch = (x, z) => Z.door === 'A' && z > I.A.zp && z < I.A.Zo + 1.0 && Math.abs(x) < I.A.W2 + (I.A.Xo - I.A.W2) * Math.min(1, Math.max(0, (z - I.A.zp) / (I.A.Zo - I.A.zp))) - 0.12;
  const dW = (Z.door === 'A' ? I.doorW : I.doorW) / 2 - 0.08, dZ = I.doorZ;

  const can = (px, pz, x, z, loft) => {
    if (loft) { return inPoly(x, z, loft.poly) && Math.max(0, Z.ceilAt(x, z) - loft.y) > 0.75; }
    const was = Z.inFloor(px, pz), now = Z.inFloor(x, z);
    if (was !== now) {   // only the doorway joins inside to outside
      const t = (dZ - pz) / ((z - pz) || 1e-6), cx = px + (x - px) * t;
      if (!(t >= -0.5 && t <= 1.5 && Math.abs(cx) < dW)) return false;
    }
    if (now) return !hitItem(x, z) && !hitWall(x, z) && !hitArc(x, z) && Z.headroom(x, z) > 1.2;
    if (inPorch(x, z)) return true;
    if (Z.door !== 'A' && Math.abs(x) < (Z.door === 'B' ? I.B.X : I.C.Xf) && z > dZ - 0.02) return true;   // in front of the dormer wall, the shell has been cut away
    return !inShell(x, z);
  };
  const height = (x, z, loft) => {
    if (loft) return loft.y;
    return Z.inFloor(x, z) || onLanding(x, z) || inPorch(x, z) ? Z.floorY : 0;
  };
  const start = () => [0, steps.z1 + 2.6];
  return { can, height, start, inside: (x, z) => Z.inFloor(x, z) };
}

// ---- the viewer -----------------------------------------------------------------------------------------------------
export function openViewer(spec) {
  const plan = spec.id ? planById(spec.id) : null;
  const type = plan ? plan.type : spec.type, door = plan ? plan.door : spec.door;
  const opts = plan ? { type, door, plan, glass: plan.glass || null, glaze: plan.glaze || [], sky: !!plan.sky, finish: 'slate', doorOpen: true } : { type, door, finish: spec.finish || 'slate', glass: spec.glass || null, glaze: [], sky: false, doorOpen: true };
  const Z = zome(type, door), rad = Z.R(5), walker = makeWalker(Z, plan);

  const el = document.createElement('div'); el.className = 'v3d'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', `${spec.name} in 3D`);
  el.innerHTML = `<div class="v3d-bar"><div class="v3d-name"><b></b><small>Planned concept</small></div><div class="v3d-btns"><button type="button" data-a="orbit" aria-pressed="true">Orbit</button><button type="button" data-a="walk" aria-pressed="false">Walk</button><button type="button" data-a="roof" aria-pressed="false">Lift roof</button><button type="button" data-a="loft" aria-pressed="false" ${plan?.loft ? '' : 'hidden'}>Go to loft</button><button type="button" data-a="dusk" aria-pressed="false">Dusk</button><button type="button" data-a="close" class="v3d-x">Close</button></div></div><p class="v3d-help"></p><div class="v3d-stick" hidden><i></i></div><p class="v3d-err" hidden></p>`;
  el.querySelector('.v3d-name b').textContent = spec.name;
  document.body.append(el); document.documentElement.classList.add('v3d-open');
  const help = el.querySelector('.v3d-help'), stick = el.querySelector('.v3d-stick'), knob = stick.querySelector('i');
  const touch = matchMedia('(pointer: coarse)').matches;
  const HELP = { orbit: touch ? 'Drag to turn. Pinch to zoom.' : 'Drag to turn. Scroll to zoom. Right-drag to move.', walk: touch ? 'Left stick to walk. Drag anywhere else to look.' : 'W A S D or arrows to walk, Shift to hurry. Drag to look.' };

  let R;
  try { R = new THREE.WebGLRenderer({ antialias: !touch, powerPreference: 'high-performance' }); }
  catch { const e = el.querySelector('.v3d-err'); e.hidden = false; e.textContent = 'This browser could not start 3D. The renders and drawings on the page show the same model.'; el.querySelector('[data-a=close]').onclick = () => { el.remove(); document.documentElement.classList.remove('v3d-open'); }; return; }
  R.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 2));
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.toneMapping = THREE.ACESFilmicToneMapping; R.outputColorSpace = THREE.SRGBColorSpace; R.localClippingEnabled = true;
  el.prepend(R.domElement); R.domElement.className = 'v3d-canvas';

  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(42, 1, 0.05, 500);
  const hemi = new THREE.HemisphereLight(0xcfdff0, 0x5a5340, 1.25), amb = new THREE.AmbientLight(0xfff1dc, 0.3), sun = new THREE.DirectionalLight(0xfff0d8, 2.7);
  sun.castShadow = true; sun.shadow.mapSize.set(touch ? 1024 : 2048, touch ? 1024 : 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  { const c = sun.shadow.camera, r = rad + 6; c.left = -r; c.right = r; c.top = r; c.bottom = -r; c.near = 1; c.far = 120; }
  sun.position.set(rad * 2.6 + 8, rad * 4 + 14, rad * 3 + 12); scene.add(hemi, amb, sun, sun.target);
  const lamps = []; { const n = Math.max(1, Math.round(rad / 1.7)); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + 0.5, r = n > 1 ? rad * 0.5 : 0, l = new THREE.PointLight(0xffc88a, 0.35 * rad * 1.6, rad * 3, 1.6); l.position.set(r * Math.sin(a), Z.floorY + Math.min(2.2, Z.stats.shellH * 0.5), r * Math.cos(a)); scene.add(l); lamps.push(l); } }

  const domeG = new THREE.SphereGeometry(190, 32, 64), dome = new THREE.Mesh(domeG, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, toneMapped: false })); scene.add(dome);
  const gndM = new THREE.MeshStandardMaterial({ map: grassTex(), roughness: 1 }), gnd = new THREE.Mesh(new THREE.CircleGeometry(180, 48), gndM); gnd.rotation.x = -Math.PI / 2; gnd.receiveShadow = true; scene.add(gnd);
  const model = build(opts); scene.add(model);
  const mood = dusk => {
    const st = (dusk ? ['#141f3a', '#5e5a80', '#d8a488'] : ['#4a86c4', '#a9cce6', '#e9eeec']).map(c => new THREE.Color(c)), p = domeG.attributes.position, col = [];
    for (let i = 0; i < p.count; i++) { const k = Math.max(0, p.getY(i) / 190), c = k < 0.16 ? st[2].clone().lerp(st[1], k / 0.16) : st[1].clone().lerp(st[0], (k - 0.16) / 0.84); col.push(c.r, c.g, c.b); }
    domeG.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const f = dusk ? 0xd8a488 : 0xe9eeec; scene.background = new THREE.Color(f); scene.fog = new THREE.Fog(f, 30, 92);
    hemi.intensity = dusk ? 0.55 : 1.25; sun.intensity = dusk ? 0.3 : 2.7; sun.color.set(dusk ? 0xffb58a : 0xfff0d8); amb.intensity = dusk ? 0.12 : 0.3; for (const l of lamps) l.intensity = (dusk ? 1.4 : 0.35) * rad * 1.6;
    setDusk(dusk); R.toneMappingExposure = dusk ? 1.05 : 0.92;
  };
  mood(false); setClip([]);

  const orbit = new OrbitControls(cam, R.domElement);
  orbit.enableDamping = true; orbit.dampingFactor = 0.08; orbit.target.set(0, Z.Y(0) * 0.42, 0.15); orbit.minDistance = 1.5; orbit.maxDistance = rad * 9 + 8; orbit.maxPolarAngle = Math.PI * 0.495;
  const a0 = 26 * D, e0 = 14 * D, d0 = rad * 3.3 + 3; cam.position.set(orbit.target.x + d0 * Math.cos(e0) * Math.sin(a0), orbit.target.y + d0 * Math.sin(e0), orbit.target.z + d0 * Math.cos(e0) * Math.cos(a0));

  let mode = 'orbit', loft = null, yaw = 0, pitch = 0, px = 0, pz = 0, py = 1.6, dusk = false, roof = false, running = true, raf = 0;
  const keys = new Set(), joy = { id: null, x: 0, z: 0, cx: 0, cy: 0 };
  const btn = a => el.querySelector(`[data-a=${a}]`);
  const setMode = m => {
    mode = m; orbit.enabled = m === 'orbit'; btn('orbit').setAttribute('aria-pressed', m === 'orbit'); btn('walk').setAttribute('aria-pressed', m === 'walk');
    help.textContent = HELP[m]; stick.hidden = !(m === 'walk' && touch);
    if (m === 'walk') {
      [px, pz] = walker.start(); yaw = 0; pitch = 0; loft = null; btn('loft').setAttribute('aria-pressed', false); py = walker.height(px, pz, null) + 1.62; cam.fov = 62; cam.updateProjectionMatrix();
    } else { cam.fov = 42; cam.updateProjectionMatrix(); cam.position.set(orbit.target.x + d0 * Math.cos(e0) * Math.sin(a0), orbit.target.y + d0 * Math.sin(e0), orbit.target.z + d0 * Math.cos(e0) * Math.cos(a0)); orbit.update(); }
  };
  const clip = () => setClip(roof ? [new THREE.Plane(new THREE.Vector3(0, -1, 0), Z.floorY + (plan?.loft ? Math.min(plan.loft.deckH + 1.25, Math.max(plan.loft.deckH + 0.72, Z.stats.shellH * 0.76)) : Math.min(2.2, Z.stats.shellH * 0.62)))] : []);
  el.querySelector('.v3d-btns').addEventListener('click', e => {
    const a = e.target.dataset?.a; if (!a) return;
    if (a === 'close') return close();
    if (a === 'orbit' || a === 'walk') return setMode(a);
    if (a === 'roof') { roof = !roof; btn('roof').setAttribute('aria-pressed', roof); clip(); if (roof && mode === 'walk') setMode('orbit'); }
    if (a === 'dusk') { dusk = !dusk; btn('dusk').setAttribute('aria-pressed', dusk); mood(dusk); }
    if (a === 'loft' && plan?.loft) {
      if (mode !== 'walk') setMode('walk');
      loft = loft ? null : plan.loft; btn('loft').setAttribute('aria-pressed', !!loft); btn('loft').textContent = loft ? 'Back down' : 'Go to loft';
      if (loft) { px = 0; pz = plan.loft.zFront - 0.3; yaw = Math.PI; pitch = -0.28; } else { px = 0; pz = plan.loft.zFront + 0.9; yaw = 0; let t = 0; while (!walker.can(px, pz, px, pz, null) && t++ < 40) pz += 0.1; }
    }
  });

  // ---- looking + walking input
  let look = null;
  const dom = R.domElement;
  const down = e => {
    if (mode !== 'walk' || look) return;
    look = { id: e.pointerId, x: e.clientX, y: e.clientY }; dom.setPointerCapture?.(e.pointerId);
  };
  const moveP = e => { if (!look || e.pointerId !== look.id) return; yaw -= (e.clientX - look.x) * 0.0042; pitch = Math.max(-1.3, Math.min(1.3, pitch - (e.clientY - look.y) * 0.0042)); look.x = e.clientX; look.y = e.clientY; };
  const up = e => { if (look && e.pointerId === look.id) look = null; };
  dom.addEventListener('pointerdown', down); dom.addEventListener('pointermove', moveP); dom.addEventListener('pointerup', up); dom.addEventListener('pointercancel', up);
  const stickDown = e => { e.preventDefault(); const r = stick.getBoundingClientRect(); joy.id = e.pointerId; joy.cx = r.left + r.width / 2; joy.cy = r.top + r.height / 2; stick.setPointerCapture(e.pointerId); stickMove(e); };
  const stickMove = e => { if (e.pointerId !== joy.id) return; let dx = e.clientX - joy.cx, dy = e.clientY - joy.cy; const m = Math.hypot(dx, dy), max = 46; if (m > max) { dx *= max / m; dy *= max / m; } joy.x = dx / max; joy.z = dy / max; knob.style.transform = `translate(${dx}px,${dy}px)`; };
  const stickUp = e => { if (e.pointerId !== joy.id) return; joy.id = null; joy.x = joy.z = 0; knob.style.transform = ''; };
  stick.addEventListener('pointerdown', stickDown); stick.addEventListener('pointermove', stickMove); stick.addEventListener('pointerup', stickUp); stick.addEventListener('pointercancel', stickUp);
  const kd = e => { if (e.key === 'Escape') return close(); if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault(); keys.add(e.code); }, ku = e => keys.delete(e.code);
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  const size = () => { const w = el.clientWidth, h = el.clientHeight; R.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  addEventListener('resize', size); size();

  let last = performance.now();
  const frame = now => {
    if (!running) return; raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (mode === 'orbit') orbit.update();
    else {
      const f = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) - joy.z, s = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0) + joy.x, turn = (keys.has('ArrowLeft') ? 1 : 0) - (keys.has('ArrowRight') ? 1 : 0);
      yaw += turn * dt * 1.6;
      const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 3.2 : 1.7) * dt, len = Math.hypot(f, s) || 1, gain = Math.min(1, Math.hypot(f, s));
      if (f || s) {
        const mx = (-Math.sin(yaw) * f + Math.cos(yaw) * s) / len * speed * gain, mz = (-Math.cos(yaw) * f - Math.sin(yaw) * s) / len * speed * gain;
        if (walker.can(px, pz, px + mx, pz + mz, loft)) { px += mx; pz += mz; }
        else if (walker.can(px, pz, px + mx, pz, loft)) px += mx;
        else if (walker.can(px, pz, px, pz + mz, loft)) pz += mz;
      }
      const base = walker.height(px, pz, loft), inside = loft || walker.inside(px, pz);
      const eye = inside ? Math.min(1.62, Z.ceilAt(px, pz) - base - 0.1) : 1.62;
      py += (base + Math.max(0.55, eye) - py) * Math.min(1, dt * 7);
      cam.position.set(px, py, pz); cam.rotation.order = 'YXZ'; cam.rotation.set(pitch, yaw, 0);
    }
    R.render(scene, cam);
  };
  setMode('orbit'); raf = requestAnimationFrame(frame);

  function close() {
    running = false; cancelAnimationFrame(raf);
    removeEventListener('keydown', kd); removeEventListener('keyup', ku); removeEventListener('resize', size);
    orbit.dispose(); setClip([]); setDusk(false);
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); }); gndM.map.dispose(); gndM.dispose(); R.dispose(); R.forceContextLoss?.();
    el.remove(); document.documentElement.classList.remove('v3d-open'); spec.returnFocus?.focus();
  }
  btn('close').focus();
  return { close, _test: { walker, Z, setMode, state: () => ({ px, pz, py, yaw, mode, loft: !!loft }), press: k => keys.add(k), release: k => keys.delete(k) } };
}

// The festival campground (Mike 10-30: "add a lot more detail to the festival camping grounds"): every plot of the plan's
// camp_plots layer gets a mix of bell tents, dome tents, camper vans, trailers and shade canopies, with camp chairs, a fire
// pit and flags. Unlit materials tinted per frame by the chapter's light (setLight), tents brighter: lit from inside.
// All instanced. Local metres (x = east, y = north, three z = -north).
import * as THREE from 'three';

const ringOf = f => (f.t === 'Polygon' ? f.c : f.c[0])[0];

export function build({ L, ground, lod = 'high' }) {
  const group = new THREE.Group(); group.name = 'festival_camp';
  const hi = lod !== 'low';
  const h = i => Math.abs(Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1;
  const lists = { bellBody: [], bellTop: [], dome: [], van: [], cab: [], trailer: [], roof: [], pole: [], chair: [], pit: [], flag: [] };
  const fires = [];
  const TENT = [0xf1e9d6, 0xe8dcc0, 0xf4efe4], DOME = [0x8f6a45, 0x4f6f5f, 0x8a4a38, 0x56687f, 0xa88f5a, 0xcfc7b4, 0x5f5a6f], CANOPY = [0xe2dac6, 0xc9bfa6, 0xd6c8a8, 0x9aa58a],   /* canvas colours: saturated squares read as confetti from the air (Mike) */ VAN = [0xe6e4dc, 0x3f8f8a, 0xd8743c, 0xc9c5ba, 0x4f6fa8], FLAG = [0xEA824E, 0xAF695E, 0x73516F, 0xf2c23a, 0x2f8f8a];
  const put = (list, x, y, sx, sy, sz, ry, c, lift = 0) => list.push([x, ground(x, y) + lift, y, sx, sy, sz, ry, c]);

  const worn = [];
  (L.camp_plots || []).forEach((f, i) => {
    const r = ringOf(f), n = r.length - 1;
    const c = [0, 1].map(k => r.slice(0, n).reduce((a, p) => a + p[k], 0) / n);
    worn.push([c[0], ground(c[0], c[1]) + 0.32, c[1], 15 + h(i + 0.6) * 5, 1, 13 + h(i + 0.7) * 5, h(i) * 3, 0]);
    let e = [1, 0], len = 0; for (let k = 0; k < n; k++) { const d = [r[k + 1][0] - r[k][0], r[k + 1][1] - r[k][1]], l = Math.hypot(...d); if (l > len) { len = l; e = [d[0] / l, d[1] / l]; } }
    const m = [-e[1], e[0]], ry = Math.atan2(e[0], e[1]) + (h(i + 0.43) - 0.5) * 1.4;
    const ju = (h(i + 0.13) - 0.5) * 5, jv = (h(i + 0.19) - 0.5) * 5;   // each plot's camp sits off-centre: no grid (i11)
    const P = (u, v) => [c[0] + e[0] * (u + ju) + m[0] * (v + jv), c[1] + e[1] * (u + ju) + m[1] * (v + jv)];
    const kind = h(i), a = h(i + 0.31), b = h(i + 0.57), col = list => list[Math.floor(h(i + 0.77) * list.length)];
    const dome = (u, v, s, j) => { const [x, y] = P(u, v); put(lists.dome, x, y, s, s * 0.8, s * 1.15, ry + j, DOME[Math.floor(h(i + j * 3 + 0.9) * DOME.length)]); };
    const bell = (u, v, s) => { const [x, y] = P(u, v); put(lists.bellBody, x, y, s, 1, s, 0, col(TENT), 0.45); put(lists.bellTop, x, y, s, 1, s, 0, col(TENT), 2.0); };
    if (kind < 0.3) { bell(-2.5 + a * 2, -1.5 + b * 3, 1); if (b > 0.4) dome(3.2, -2.5 + a * 3, 1.2, 0.4); if (a > 0.6) dome(3.4, 2.8, 1.0, 1.1); }
    else if (kind < 0.55) { dome(-3.5, -2.5, 1.4, 0.2); dome(0.4, 2.6, 1.2, 0.9); dome(3.6, -2.2, 1.3, 1.7); if (a > 0.5) dome(-3.2, 3, 1.0, 2.3); }
    else if (kind < 0.77) {
      const [x, y] = P(-1.5 + a * 2, 1.2); put(lists.van, x, y, 1, 1, 1, ry, col(VAN), 1.3); const [cx, cy] = P(-1.5 + a * 2 + 2.9, 1.2); put(lists.cab, cx, cy, 1, 1, 1, ry, col(VAN), 0.95);
      if (b > 0.5) dome(-2, -3, 1.1, 0.6);
    } else if (kind < 0.9) {
      const [x, y] = P(-0.5, 1.4); put(lists.trailer, x, y, 1, 1, 1, ry, 0xe6e4dc, 1.55);
      if (b > 0.5) dome(2.5, -3, 1.1, 0.6);
    } else { bell(0, 2.4, 1.15); }
    // a shade canopy on many plots
    if (h(i + 0.11) > 0.45) {
      const [x, y] = P(-3.5 + a * 2, -2.8); put(lists.roof, x, y, 1, 1, 1, ry, CANOPY[Math.floor(a * CANOPY.length)], 2.4);
      if (hi) for (const [du, dv] of [[-1.7, -1.7], [1.7, -1.7], [-1.7, 1.7], [1.7, 1.7]]) { const [px, py] = P(-3.5 + a * 2 + du, -2.8 + dv); put(lists.pole, px, py, 1, 2.4, 1, 0, 0x8a8f94, 1.2); }
    }
    // fire pit with chairs round it, on most plots
    if (h(i + 0.23) > 0.3) {
      const [x, y] = P(1 + b * 2, -0.5); put(lists.pit, x, y, 1, 1, 1, 0, 0x2a2622, 0.15); fires.push([x, y]);
      if (hi) for (let k = 0; k < 4; k++) { const t = k * 1.57 + a, [qx, qy] = [x + Math.cos(t) * 1.4, y + Math.sin(t) * 1.4]; put(lists.chair, qx, qy, 1, 1, 1, -t, FLAG[(i + k) % FLAG.length], 0.4); }
    }
    // flags on tall poles so the camp reads from the air
    if (h(i + 0.37) > 0.72) { const [x, y] = P(-5.5, 5); put(lists.pole, x, y, 1.6, 7, 1.6, 0, 0x8a8f94, 3.5); put(lists.flag, x, y, 1, 1, 1, ry, col(FLAG), 6.3); }
  });

  // the festival street: marquees and food stalls on an arc behind the crowd, facing the stage; a wide gravel lane from the
  // street down the middle of the camp; a timber gate with banners where it meets the grounds; toilet blocks along it
  const SP = [-193, -242], lane = [], marqBody = [], marqTop = [], stall = [], stallTop = [], loo = [], banner = [];
  for (let k = -9; k <= 9; k++) {
    const a = -Math.PI / 4 + k * 0.105, r = 72 + (k % 2) * 3, x = SP[0] + Math.cos(a) * r, y = SP[1] + Math.sin(a) * r, gy = ground(x, y);
    if (k % 3 === 0) { marqBody.push([x, gy + 1.15, y, 1.3, 1, 1.3, -a, 0xd9cfbc]); marqTop.push([x, gy + 3.35, y, 1.3, 1, 1.3, -a, 0xd9cfbc]); }
    else { stall.push([x, gy + 1.2, y, 1, 1, 1, -a + Math.PI / 2, FLAG[(k + 9) % FLAG.length]]); stallTop.push([x, gy + 2.55, y, 1, 1, 1, -a + Math.PI / 2, 0xf2ece0]); }
  }
  const plots = (L.camp_plots || []).map(f => { const r = ringOf(f); return [0, 1].map(k => r.reduce((a, p) => a + p[k], 0) / r.length); });
  if (plots.length) {
    const mx = plots.reduce((a, p) => a + p[0], 0) / plots.length, my = plots.reduce((a, p) => a + p[1], 0) / plots.length;
    const far = plots.reduce((b, p) => (p[1] < b[1] ? p : b), plots[0]);
    const s = [SP[0] + 60, SP[1] - 60], ex = far[0] - s[0], ey = far[1] - s[1], L0 = Math.hypot(ex, ey), a0 = Math.atan2(ex, ey);
    for (let d = 0; d < L0; d += 8) { const x = s[0] + ex * d / L0, y = s[1] + ey * d / L0; lane.push([x, ground(x, y) + 0.3, y, 1, 1, 1, a0, 0xa89a80]); if (Math.round(d / 8) % 12 === 6) loo.push([x + Math.cos(a0) * 9, ground(x, y) + 1.15, y - Math.sin(a0) * 9, 1, 1, 1, a0, 0x3f6f8a]); if (Math.round(d / 8) % 6 === 3) { const fx = x - Math.cos(a0) * 6, fy = y + Math.sin(a0) * 6; put(lists.pole, fx, fy, 1.6, 7, 1.6, 0, 0x8a8f94, 3.5); put(lists.flag, fx, fy, 1, 1, 1, a0, FLAG[Math.round(d) % FLAG.length], 6.3); } }
    void mx; void my;
    const gx = s[0] + ex * 8 / L0, gy2 = s[1] + ey * 8 / L0; for (const o of [-6, 6]) { const px = gx + Math.cos(a0) * o, py = gy2 - Math.sin(a0) * o; put(lists.pole, px, py, 6, 6, 6, 0, 0x8a6a48, 3); } banner.push([gx, ground(gx, gy2) + 5.7, gy2, 1, 1, 1, a0, 0xEA824E]);
  }
  const dummy = new THREE.Object3D(), col = new THREE.Color();
  const tentM = new THREE.MeshBasicMaterial({ color: 0xffffff }), gearM = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const inst = (list, geo, mat) => {
    if (!list.length) return;
    const m = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach(([x, y, z, sx, sy, sz, ry, c], i) => { dummy.position.set(x, y, -z); dummy.rotation.set(0, ry, 0); dummy.scale.set(sx, sy, sz); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); m.setColorAt(i, col.set(c)); });
    m.frustumCulled = false; group.add(m);
  };
  // what sets a camp on the ground from the air: trodden grass round each plot, a soft shadow under everything that stands
  const softTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, '#fff'); g.addColorStop(0.55, '#999'); g.addColorStop(1, '#000'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const plane = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const wornM = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaMap: softTex, transparent: true, opacity: 0.55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  const shadM = new THREE.MeshBasicMaterial({ color: 0x0b0d08, alphaMap: softTex, transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const shad = [];
  for (const [list, w, d] of [[lists.bellBody, 7, 7], [lists.dome, 4, 4.5], [lists.van, 4, 6.5], [lists.trailer, 4.5, 9.5], [lists.roof, 5.4, 5.4], [marqBody, 9, 9], [stall, 6, 5], [loo, 7, 3.2]])
    for (const [x, y, z, sx, , sz, ry] of list) shad.push([x + 0.5, ground(x, z) + 0.36, z - 0.3, w * sx, 1, d * sz, ry, 0]);
  inst(worn, plane, wornM); inst(shad, plane, shadM);
  group.children.forEach(o => { o.renderOrder = 3; });
  inst(lists.bellBody, new THREE.CylinderGeometry(2.3, 2.3, 0.9, hi ? 12 : 8), tentM);
  inst(lists.bellTop, new THREE.ConeGeometry(2.45, 2.2, hi ? 12 : 8), tentM);
  inst(lists.dome, new THREE.SphereGeometry(1.2, hi ? 10 : 7, hi ? 6 : 4, 0, Math.PI * 2, 0, Math.PI / 2), tentM);
  inst(lists.van, new THREE.BoxGeometry(2.0, 2.0, 4.2), gearM);
  inst(lists.cab, new THREE.BoxGeometry(1.9, 1.3, 1.4), gearM);
  inst(lists.trailer, new THREE.BoxGeometry(2.4, 2.6, 7.2), gearM);
  inst(lists.roof, new THREE.BoxGeometry(3.8, 0.1, 3.8), gearM);
  inst(lists.pole, new THREE.CylinderGeometry(0.04, 0.04, 1, 5), gearM);
  inst(lists.chair, new THREE.BoxGeometry(0.5, 0.8, 0.5), gearM);
  inst(lists.pit, new THREE.CylinderGeometry(0.55, 0.6, 0.3, 10), gearM);
  inst(lists.flag, new THREE.BoxGeometry(0.04, 0.8, 1.4), gearM);
  // the lane: one ribbon draped on the ground, not a row of boxes that stepped up the slope
  const laneM = new THREE.MeshBasicMaterial({ color: 0xffffff, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  if (lane.length > 1) {
    const pos = [], idx = [], a0 = lane[0][6], nx = Math.cos(a0), ny = -Math.sin(a0);
    lane.forEach(([x, , y], i) => { for (const o of [-2.6, 2.6]) { const w = o * (1 + 0.14 * Math.sin(i * 1.7 + o)), px = x + nx * w, py = y + ny * w; pos.push(px, ground(px, py) + 0.34, -py); } if (i) { const q = (i - 1) * 2; idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); laneM.side = THREE.DoubleSide;
    const m = new THREE.Mesh(g, laneM); m.frustumCulled = false; m.renderOrder = 3; group.add(m);
  }
  inst(marqBody, new THREE.CylinderGeometry(2.4, 2.4, 2.3, 8), tentM);
  inst(marqTop, new THREE.ConeGeometry(2.7, 2.1, 8), tentM);
  inst(stall, new THREE.BoxGeometry(3.6, 2.4, 2.6), gearM);
  inst(stallTop, new THREE.BoxGeometry(4.2, 0.14, 3.4), tentM);
  inst(loo, new THREE.BoxGeometry(5, 2.3, 1.3), gearM);
  inst(banner, new THREE.BoxGeometry(12.6, 1.2, 0.15), gearM);

  return {
    group, fires,
    // call each frame with the chapter's land light: tents glow softly from inside, gear stays at land level
    setLight(l, inside = 1) {
      tentM.color.setRGB(l.x * 0.85 + 0.2 * inside, l.y * 0.85 + 0.15 * inside, l.z * 0.85 + 0.08 * inside);
      gearM.color.setRGB(l.x * 0.9, l.y * 0.9, l.z * 0.9);
      laneM.color.setRGB(l.x * 0.42, l.y * 0.38, l.z * 0.28);
      wornM.color.setRGB(l.x * 0.34, l.y * 0.36, l.z * 0.16);
    },
  };
}

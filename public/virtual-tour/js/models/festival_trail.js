// The discovery trail as a real path through the forest (Mike 10-30: "still looks like crap"): a packed-earth footpath draped
// on the ground along the plan's trail, lantern posts every 9 m, and at each of the 16 landings a timber platform with benches,
// a fire bowl and a ring of lanterns, ready for the art. setLight(land light) tints it with the night.
// Local metres (x = east, y = north, three z = -north).
import * as THREE from 'three';

const lineOf = f => f.t === 'LineString' ? [f.c] : f.t === 'MultiLineString' ? f.c : [];

export function build({ L, ground, lod = 'high' }) {
  const group = new THREE.Group(); group.name = 'festival_trail';
  const hi = lod !== 'low', lamps = [];
  const earth = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true }), timber = new THREE.MeshBasicMaterial({ color: 0xffffff, map: (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#b08a5e'; x.fillRect(0, 0, 256, 256); let sd = 9; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 12; i++) { const k = 0.8 + rnd() * 0.3; x.fillStyle = `rgb(${176 * k},${138 * k},${94 * k})`; x.fillRect(0, i * 21.3, 256, 20); x.fillStyle = 'rgba(40,26,14,.8)'; x.fillRect(0, i * 21.3 + 20, 256, 1.6); for (let j = 0; j < 14; j++) { x.fillStyle = 'rgba(80,54,30,.25)'; x.fillRect(rnd() * 256, i * 21.3 + rnd() * 20, 30 + rnd() * 60, 1); } } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; })() }), post = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const glowM = new THREE.MeshBasicMaterial({ color: 0xffd9a0, toneMapped: false });

  // ---- the path: a ribbon 2.4 m wide, verge colour at its edges ----
  for (const f of L.discovery_trail || []) for (const l of lineOf(f)) {
    const pts = []; for (let i = 0; i < l.length - 1; i++) { const n = Math.max(1, Math.ceil(Math.hypot(l[i + 1][0] - l[i][0], l[i + 1][1] - l[i][1]) / 3)); for (let k = 0; k < n; k++) pts.push([l[i][0] + (l[i + 1][0] - l[i][0]) * k / n, l[i][1] + (l[i + 1][1] - l[i][1]) * k / n]); }
    pts.push(l[l.length - 1]);
    const pos = [], col = [], idx = [];
    pts.forEach((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = (b[1] - a[1]) / d, ny = -(b[0] - a[0]) / d;
      [-1.4, -0.8, 0.8, 1.4].forEach((o, j) => { const x = p[0] + nx * o, y = p[1] + ny * o; pos.push(x, ground(x, y) + 0.5, -y); const c = j === 0 || j === 3 ? [0.3, 0.27, 0.18] : [0.5, 0.4, 0.27]; col.push(...c); });
      if (i < pts.length - 1) for (let j = 0; j < 3; j++) { const q = i * 4 + j; idx.push(q, q + 4, q + 1, q + 1, q + 4, q + 5); }
    });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx);
    const m = new THREE.Mesh(g, earth); m.material.side = THREE.DoubleSide; m.frustumCulled = false; group.add(m);
    let carry = 0, side = 1;
    for (let i = 0; i < l.length - 1; i++) {
      const [ax, ay] = l[i], [bx, by] = l[i + 1], len = Math.hypot(bx - ax, by - ay);
      for (let s = carry; s < len; s += 9) { const k = s / len, nx = (by - ay) / (len || 1), ny = -(bx - ax) / (len || 1); side = -side; const x = ax + (bx - ax) * k + nx * 1.7 * side, y = ay + (by - ay) * k + ny * 1.7 * side; lamps.push([x, y]); }
      carry = (carry - len) % 9; if (carry < 0) carry += 9;
    }
  }

  // ---- landings: timber deck, benches, fire bowl, lanterns round it ----
  const decks = [], planks = [], bowls = [], bench = [];
  for (const f of L.landings || []) {
    const [x, y] = f.c, gy = ground(x, y); decks.push([x, gy + 0.3, y]);
    bowls.push([x, gy + 0.72, y]);
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; lamps.push([x + Math.cos(a) * 6.2, y + Math.sin(a) * 6.2]); if (k % 2 === 0) bench.push([x + Math.cos(a + 0.5) * 4, gy + 0.72, y + Math.sin(a + 0.5) * 4, -a - 0.5]); }
  }
  const dm = new THREE.Object3D();
  const inst = (list, geo, mat, set) => { if (!list.length) return null; const m = new THREE.InstancedMesh(geo, mat, list.length); list.forEach((v, i) => { set(v); dm.updateMatrix(); m.setMatrixAt(i, dm.matrix); }); m.frustumCulled = false; group.add(m); return m; };
  inst(decks, new THREE.CylinderGeometry(5.6, 5.8, 0.5, 10), timber, ([x, h, y]) => { dm.position.set(x, h, -y); dm.rotation.set(0, 0, 0); dm.scale.set(1, 1, 1); });
  inst(bowls, new THREE.CylinderGeometry(0.75, 0.4, 0.4, 10), post, ([x, h, y]) => { dm.position.set(x, h, -y); dm.rotation.set(0, 0, 0); dm.scale.set(1, 1, 1); });
  inst(bowls, new THREE.ConeGeometry(0.42, 0.9, 7), glowM, ([x, h, y]) => { dm.position.set(x, h + 0.6, -y); dm.rotation.set(0, 0, 0); dm.scale.set(1, 1, 1); });
  inst(bench, new THREE.BoxGeometry(2.4, 0.42, 0.5), post, ([x, h, y, r]) => { dm.position.set(x, h, -y); dm.rotation.set(0, r, 0); dm.scale.set(1, 1, 1); });
  void planks;
  const P = lamps.map(([x, y]) => [x, ground(x, y), y]);
  inst(P, new THREE.CylinderGeometry(0.05, 0.07, 1.5, hi ? 6 : 4), post, ([x, h, y]) => { dm.position.set(x, h + 0.75, -y); dm.rotation.set(0, 0, 0); dm.scale.set(1, 1, 1); });
  inst(P, new THREE.BoxGeometry(0.24, 0.3, 0.24), glowM, ([x, h, y]) => { dm.position.set(x, h + 1.6, -y); dm.rotation.set(0, 0, 0); dm.scale.set(1, 1, 1); });

  return {
    group, lamps,
    setLight(l) {
      earth.color.setRGB(l.x * 0.8 + 0.06, l.y * 0.8 + 0.045, l.z * 0.8 + 0.025);   // lit a little by its lamps
      timber.color.setRGB(l.x * 0.62 + 0.05, l.y * 0.62 + 0.04, l.z * 0.62 + 0.03);
      post.color.setRGB(l.x * 0.5 + 0.03, l.y * 0.5 + 0.03, l.z * 0.5 + 0.03);
    },
  };
}

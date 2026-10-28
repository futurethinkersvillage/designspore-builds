// Salmon run: three huge sockeye salmon (≈9 m long) drawn in LED light on steel rod outlines, strung along one leap
// arc over a 22 m "river" of rippling blue-teal light on the ground. The leap lights fish to fish, travelling
// upstream. Wells Gray rivers are salmon country.
import * as THREE from 'three';

export const meta = { name: 'Salmon run', footprint: [24, 10], height: 9, notes: 'Art trail, creatures & wonder. Concept.' };

// salmon side profile, unit length, nose at x = 1: back + belly curves, tail fork, dorsal + adipose fins
function profile(n) {
  const back = [], belly = [];
  for (let i = 0; i <= n; i++) {
    const x = 0.12 + 0.88 * i / n, w = Math.sin(Math.PI * Math.pow((x - 0.12) / 0.88, 0.7));
    back.push(new THREE.Vector2(x, 0.15 * w + 0.015)); belly.push(new THREE.Vector2(x, -0.12 * w));
  }
  const tail = [new THREE.Vector2(0.13, 0.03), new THREE.Vector2(0, 0.14), new THREE.Vector2(0.05, 0), new THREE.Vector2(0, -0.13), new THREE.Vector2(0.13, -0.02)];
  const dorsal = [new THREE.Vector2(0.52, 0.15), new THREE.Vector2(0.45, 0.24), new THREE.Vector2(0.4, 0.14)];
  return { lines: [back, belly, tail, dorsal] };
}

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0x1e1d20, roughness: 0.6, metalness: 0.7 });
  const leds = [], fill = [], P = profile(lod === 'low' ? 40 : 80), LEN = 9;
  // three fish along one arc: rising out of the river, at the top, diving back in
  const FISH = [{ x: -8, y: 1.6, pitch: 0.55 }, { x: 0, y: 4.6, pitch: 0 }, { x: 8, y: 1.6, pitch: -0.55 }];
  FISH.forEach((F, f) => {
    const cp = Math.cos(F.pitch), sp = Math.sin(F.pitch);
    const place = v => { const lx = (v.x - 0.5) * LEN, ly = v.y * LEN; return new THREE.Vector3(F.x + lx * cp - ly * sp, F.y + lx * sp + ly * cp, 0); };
    for (const line of P.lines) {
      const pts = line.map(place);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 2, 0.06, 5), steel));
      // LEDs every ~12 cm along the rod
      const curve = new THREE.CatmullRomCurve3(pts), n = Math.round(curve.getLength() / 0.12);
      for (let i = 0; i <= n; i++) { const u = i / n, v = line[Math.min(line.length - 1, Math.round(u * (line.length - 1)))]; leds.push({ p: curve.getPoint(u), f, s: v.x }); }
    }
    // a soft body of sparse dimmer LEDs inside the outline (scales)
    for (let i = 0; i < 260; i++) {
      const x = 0.15 + 0.82 * ((i * 0.618) % 1), w = Math.sin(Math.PI * Math.pow((x - 0.12) / 0.88, 0.7)), y = (((i * 0.7548) % 1) * 0.25 - 0.11) * w;
      fill.push({ p: place(new THREE.Vector2(x, y)).setZ((i % 2 ? 1 : -1) * 0.05), f, s: x });
    }
    leds.push({ p: place(new THREE.Vector2(0.9, 0.04)).setZ(0.12), f, s: 1, eye: true });
    const foot = place(new THREE.Vector2(0.45, -0.1)), stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, foot.y, 6), steel);
    stalk.position.set(foot.x, foot.y / 2, 0); g.add(stalk);
  });
  const river = [];
  for (let i = 0; i < (lod === 'low' ? 600 : 1600); i++) {
    const x = -12 + (i * 0.6180339 % 1) * 24, w = 2.0 + Math.sin(x * 0.4) * 0.7;
    river.push(new THREE.Vector3(x, 0.05, Math.sin(x * 0.25) * 1.2 + ((i * 0.7548776) % 1 - 0.5) * 2 * w));
  }
  const mk = (list, r) => { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), list.length);
    const m = new THREE.Matrix4(); list.forEach((l, i) => { const p = l.p || l; m.makeTranslation(p.x, p.y, p.z); im.setMatrixAt(i, m); }); g.add(im); return im; };
  g.userData = { ledMesh: mk(leds, 0.075), fillMesh: mk(fill, 0.05), rivMesh: mk(river, 0.055), leds, fill, river, N: FISH.length };
  return g;
}

const SALMON = new THREE.Color('#ff5a3c'), AMBER = new THREE.Color('#EA824E'), CREAM = new THREE.Color('#fff0d8'), DEEP = new THREE.Color('#2a3a9a'), TEAL = new THREE.Color('#3fd6c8'), c = new THREE.Color();
export function update(g, t) {
  const { ledMesh, fillMesh, rivMesh, leds, fill, river, N } = g.userData;
  const head = (t * 0.3) % 1.3 * N;   // the leap travels fish to fish, upstream (left to right)
  const lit = (f, s) => Math.max(0.25, Math.min(1, (head - f) * 1.4 - (1 - s) * 0.8));
  leds.forEach((l, i) => ledMesh.setColorAt(i, l.eye ? c.copy(CREAM) : c.copy(AMBER).lerp(SALMON, l.s).multiplyScalar(0.55 + 0.9 * lit(l.f, l.s))));
  fill.forEach((l, i) => fillMesh.setColorAt(i, c.copy(SALMON).multiplyScalar(0.18 + 0.35 * lit(l.f, l.s))));
  river.forEach((p, i) => { const r = 0.5 + 0.5 * Math.sin(p.x * 1.3 - t * 2.2 + Math.sin(p.z * 2.1 + t) * 1.2);
    rivMesh.setColorAt(i, c.copy(DEEP).lerp(TEAL, r).multiplyScalar(0.4 + 0.7 * r)); });
  ledMesh.instanceColor.needsUpdate = fillMesh.instanceColor.needsUpdate = rivMesh.instanceColor.needsUpdate = true;
}

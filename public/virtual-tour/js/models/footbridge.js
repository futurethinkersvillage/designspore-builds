// The road bridge over Hemp Creek just north of the sauna, as the sauna 360 shows it: a flat, pale concrete slab
// carrying the gravel road, low curbs, and rope rails strung between short yellow posts along both sides, the rails
// running on past the east end along the road approach. Long axis along z; the east (yard) end is at -z.
import * as THREE from 'three';

export const meta = { name: 'Creek road bridge', footprint: [4.6, 18], height: 1.0, notes: 'Origin = mid-span at bank level, deck along z, approach rails at -z.' };

export function build({ lod = 'high', size = 10 } = {}) {
  const g = new THREE.Group(), L = size, W = 5.0, TOP = 0.7, APPROACH = 4;   // 5 m wide, a road deck (drone photo)
  const concrete = new THREE.MeshStandardMaterial({ color: 0xaaa69c, roughness: 0.95 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x7c776d, roughness: 1 });
  const yellow = new THREE.MeshStandardMaterial({ color: 0xe0b51c, roughness: 0.6 });
  const rope = new THREE.MeshStandardMaterial({ color: 0xd9d2bf, roughness: 0.9 });
  const box = (w, h, d, x, y, z, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); g.add(o); return o; };
  box(W, 0.4, L, 0, TOP - 0.2, 0, concrete);                                   // deck slab
  for (const s of [-1, 1]) box(0.25, 0.18, L, s * (W / 2 - 0.125), TOP + 0.09, 0, concrete);   // curbs
  for (const e of [-1, 1]) box(W + 0.6, 1.4, 0.8, 0, TOP - 0.9, e * (L / 2 - 0.2), dark);     // abutments into the banks
  // yellow posts along both sides, from the far end of the bridge back along the road approach, with two sagging
  // rope rails between them
  const z0 = -L / 2 - APPROACH, z1 = L / 2, n = Math.round((z1 - z0) / 2.4);
  for (const s of [-1, 1]) {
    const x = s * (W / 2 + 0.25), zs = [];
    for (let i = 0; i <= n; i++) {
      const z = z0 + i * (z1 - z0) / n, y0 = z < -L / 2 ? 0 : TOP;           // on the bank before the deck starts
      zs.push([z, y0]);
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 10), yellow); p.position.set(x, y0 + 0.5, z); g.add(p);
    }
    if (lod === 'low') continue;
    for (const h of [0.55, 0.9]) for (let i = 0; i < zs.length - 1; i++) {
      const [za, ya] = zs[i], [zb, yb] = zs[i + 1];
      const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(x, ya + h, za), new THREE.Vector3(x, (ya + yb) / 2 + h - 0.18, (za + zb) / 2), new THREE.Vector3(x, yb + h, zb));
      g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 8, 0.012, 4), rope));
    }
  }
  return g;
}

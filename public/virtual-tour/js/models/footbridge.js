// The timber footbridge over Hemp Creek just north of the sauna (seen in the sauna 360: weathered grey plank deck,
// posts and two handrails, resting on log abutments). Long axis along z.
import * as THREE from 'three';

export const meta = { name: 'Creek footbridge', footprint: [1.8, 13], height: 1.8, notes: 'Origin = mid-span at bank level, deck along z.' };

export function build({ lod = 'high', size = 13 } = {}) {
  const g = new THREE.Group(), L = size;
  const timber = new THREE.MeshStandardMaterial({ color: 0x8f877c, roughness: 0.95 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x5a5148, roughness: 0.95 });
  const span = (w, h, d, x, y, z, m = timber) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); g.add(o); };
  // stringers + plank deck, with a slight camber
  for (const s of [-1, 1]) span(0.18, 0.35, L, s * 0.7, 0.45, 0, dark);
  const n = lod === 'low' ? 12 : Math.round(L / 0.22);
  for (let i = 0; i < n; i++) { const z = -L / 2 + (i + 0.5) * L / n, y = 0.68 + 0.18 * (1 - (2 * z / L) ** 2); span(1.6, 0.06, L / n - 0.025, 0, y, z); }
  // posts and handrails each side
  const posts = Math.round(L / 1.6);
  for (const s of [-1, 1]) {
    for (let i = 0; i <= posts; i++) { const z = -L / 2 + i * L / posts, y = 0.68 + 0.18 * (1 - (2 * z / L) ** 2); span(0.1, 1.0, 0.1, s * 0.78, y + 0.5, z); }
    span(0.08, 0.1, L, s * 0.78, 0.68 + 1.0 + 0.09, 0); span(0.06, 0.08, L, s * 0.78, 0.68 + 0.5, 0);
  }
  // log abutments at both banks
  for (const e of [-1, 1]) { const log = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 2.1, 8), dark); log.rotation.z = Math.PI / 2; log.position.set(0, 0.25, e * (L / 2 - 0.3)); g.add(log); }
  return g;
}

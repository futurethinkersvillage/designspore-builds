// What sits around the sauna in its photos (Sauna/Sauna.jpg, the sauna 360): a small timber deck with three red
// Adirondack chairs toward the creek, and the line of big boulders edging the gravel road.
// variant 'deck' (origin = deck centre) or 'boulders' (origin = start of the line, running along +z for `size` m).
import * as THREE from 'three';

export const meta = { name: 'Sauna deck + boulders', footprint: [3, 3], height: 1.1, notes: 'Real, small set dressing.' };

function chair(red) {
  const g = new THREE.Group(), b = (w, h, d, x, y, z, rx = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), red); o.position.set(x, y, z); o.rotation.x = rx; g.add(o); };
  b(0.7, 0.05, 0.65, 0, 0.38, 0, -0.12);              // seat
  b(0.7, 0.9, 0.05, 0, 0.75, -0.38, -0.38);           // slanted back
  for (const s of [-1, 1]) { b(0.1, 0.04, 0.8, s * 0.38, 0.6, 0.02); b(0.06, 0.6, 0.06, s * 0.36, 0.3, 0.3); b(0.06, 0.4, 0.06, s * 0.36, 0.2, -0.3); }
  return g;
}

export function build({ lod = 'high', variant = 'deck', size = 14 } = {}) {
  const g = new THREE.Group();
  if (variant === 'boulders') {
    const rock = new THREE.MeshStandardMaterial({ color: 0x9a958d, roughness: 1, flatShading: true });
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let z = 0; z <= size; z += 1.3 + rnd() * 0.5) {
      const r = 0.45 + rnd() * 0.35, o = new THREE.Mesh(new THREE.IcosahedronGeometry(r, lod === 'low' ? 0 : 1), rock);
      o.scale.set(1.2, 0.75, 1); o.position.set((rnd() - 0.5) * 0.4, r * 0.55, z); o.rotation.y = rnd() * 3; g.add(o);
    }
    return g;
  }
  const deck = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 3.2), new THREE.MeshStandardMaterial({ color: 0x8a7a66, roughness: 0.95 }));
  deck.position.y = 0.12; g.add(deck);
  const red = new THREE.MeshStandardMaterial({ color: 0xc8261e, roughness: 0.6 });
  [[-0.95, 0.2, 0.3], [0, 0.45, 0], [0.95, 0.2, -0.3]].forEach(([x, z, ry]) => { const c = chair(red); c.position.set(x, 0.2, z); c.rotation.y = ry; g.add(c); });
  return g;
}

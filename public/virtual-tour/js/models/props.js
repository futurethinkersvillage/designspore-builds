// Small real things seen up close in the campground (placed on the drone photo, checked against Playground/Kids on
// Trampoline.jpg, the shower-house 360 and Campsite.JPG): the in-ground trampoline, the tetherball pole, the little
// play fort, golf carts, picnic tables and the log bumpers along the road. variant = kind; size = length for 'logs'.
import * as THREE from 'three';

export const meta = { name: 'Campground props', footprint: [5, 5], height: 2.5, notes: 'Origin = ground centre; long things along z.' };

const M = (color, rough = 0.8, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
const wood = M(0x8a6a4a, 0.9), steel = M(0x6f7378, 0.5, 0.5), blue = M(0x1d55b8, 0.6), black = M(0x161616, 0.7), white = M(0xeeeeea, 0.5), red = M(0xa63a2a, 0.8);
const box = (g, m, w, h, d, x, y, z, ry = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.rotation.y = ry; g.add(o); return o; };

export function build({ lod = 'high', variant = 'picnic', size = 10 } = {}) {
  const g = new THREE.Group(), seg = lod === 'low' ? 10 : 24;
  if (variant === 'trampoline') {          // in-ground: a black mat in a blue padded ring, safety-net poles
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.18, 6, seg * 2), blue); ring.rotation.x = Math.PI / 2; ring.position.y = 0.12; g.add(ring);
    const mat = new THREE.Mesh(new THREE.CircleGeometry(2.15, seg * 2), black); mat.rotation.x = -Math.PI / 2; mat.position.y = 0.06; g.add(mat);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; box(g, steel, 0.06, 2.2, 0.06, Math.cos(a) * 2.4, 1.1, Math.sin(a) * 2.4); }
    const net = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 1.9, seg * 2, 1, true), new THREE.MeshStandardMaterial({ color: 0x222226, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
    net.position.y = 1.15; g.add(net);
  } else if (variant === 'tetherball') {
    const pit = new THREE.Mesh(new THREE.CircleGeometry(2.2, seg), M(0xb59a74, 1)); pit.rotation.x = -Math.PI / 2; pit.position.y = 0.03; g.add(pit);
    box(g, steel, 0.08, 3, 0.08, 0, 1.5, 0); const ball = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), M(0xe8c23a, 0.5)); ball.position.set(0.3, 1.8, 0); g.add(ball);
  } else if (variant === 'fort') {         // small timber play fort with a slide
    for (const x of [-1.2, 1.2]) for (const z of [-1, 1]) box(g, wood, 0.12, 2.4, 0.12, x, 1.2, z);
    box(g, wood, 2.6, 0.1, 2.2, 0, 1.2, 0); box(g, red, 2.8, 0.08, 2.4, 0, 2.45, 0);
    const slide = box(g, M(0x2f8a3c, 0.5), 0.6, 0.06, 2.4, 0, 0.65, 2.0); slide.rotation.x = 0.5;
  } else if (variant === 'golfcart') {
    box(g, white, 1.2, 0.5, 2.4, 0, 0.55, 0); box(g, M(0x2a2a2a, 0.6), 1.0, 0.45, 0.6, 0, 0.95, -0.2);
    box(g, white, 1.25, 0.06, 1.7, 0, 1.95, -0.1);
    for (const s of [-1, 1]) for (const z of [-0.85, 0.85]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 10), black); w.rotation.z = Math.PI / 2; w.position.set(s * 0.6, 0.22, z); g.add(w); }
    for (const s of [-1, 1]) for (const z of [-0.85, 0.7]) box(g, steel, 0.04, 1.1, 0.04, s * 0.55, 1.4, z);
  } else if (variant === 'logs') {         // log bumpers end to end along +z
    for (let z = 0; z < size; z += 3.1) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 3, 8), M(0x9a8f80, 0.95)); l.rotation.x = Math.PI / 2; l.position.set(0, 0.18, z + 1.5); g.add(l); }
  } else {                                  // picnic table
    box(g, wood, 0.8, 0.06, 1.8, 0, 0.76, 0);
    for (const s of [-1, 1]) { box(g, wood, 0.28, 0.05, 1.8, s * 0.62, 0.45, 0); box(g, wood, 1.5, 0.06, 0.08, 0, 0.4, s * 0.7); box(g, wood, 0.08, 0.78, 0.08, 0, 0.38, s * 0.7); }
  }
  return g;
}

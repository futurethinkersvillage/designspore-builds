// Simple gabled outbuildings for the real roofs the site plan had misplaced (picked on the drone photo, 10-28):
// the workshop, the shop, the storage building by the containers, and the dark shed behind the sauna.
// variant = one of VARIANTS below. Long axis along z; doors on the +z gable.
import * as THREE from 'three';

export const meta = { name: 'Shed / workshop', footprint: [7, 12], height: 5, notes: 'Origin = ground centre, long axis along z.' };

export const VARIANTS = {
  workshop: { w: 6.5, d: 12, h: 3.2, roof: 0x8a9096, wall: 0x7a5a40 },   // grey metal roof, stained boards
  shop:     { w: 7, d: 14, h: 3.6, roof: 0xc9ccce, wall: 0x8c6a4c },     // the long white/grey roof
  storage:  { w: 10, d: 16, h: 4.2, roof: 0xb7bcc0, wall: 0x9a8a78 },    // big storage building by the containers
  darkshed: { w: 4, d: 5, h: 2.6, roof: 0x3a2e28, wall: 0x4a3a30 },      // behind the sauna
};

export function build({ lod = 'high', variant = 'workshop' } = {}) {
  const v = VARIANTS[variant] || VARIANTS.workshop, g = new THREE.Group();
  const wall = new THREE.MeshStandardMaterial({ color: v.wall, roughness: 0.9 });
  const roofM = new THREE.MeshStandardMaterial({ color: v.roof, roughness: 0.45, metalness: 0.35, side: THREE.DoubleSide });
  const body = new THREE.Mesh(new THREE.BoxGeometry(v.w, v.h, v.d), wall); body.position.y = v.h / 2; g.add(body);
  // gable roof: two sloped planes + triangular gable ends, 0.4 m overhang
  const rise = v.w * 0.32, half = v.w / 2 + 0.4, slope = Math.hypot(half, rise), ang = Math.atan2(rise, half);
  for (const s of [-1, 1]) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(slope, v.d + 0.8), roofM);
    p.rotation.set(-Math.PI / 2, 0, 0); p.rotateY(s * ang); p.position.set(s * half / 2, v.h + rise / 2, 0); g.add(p);
  }
  const tri = new THREE.Shape([new THREE.Vector2(-v.w / 2, 0), new THREE.Vector2(v.w / 2, 0), new THREE.Vector2(0, rise)]);
  for (const s of [-1, 1]) { const t = new THREE.Mesh(new THREE.ShapeGeometry(tri), wall); t.position.set(0, v.h, s * v.d / 2); if (s < 0) t.rotation.y = Math.PI; g.add(t); }
  if (lod !== 'low') {   // a big door on the front gable, a window on each side
    const dark = new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.8 });
    const door = new THREE.Mesh(new THREE.BoxGeometry(Math.min(3, v.w * 0.45), Math.min(2.6, v.h * 0.8), 0.05), dark);
    door.position.set(0, Math.min(2.6, v.h * 0.8) / 2, v.d / 2 + 0.03); g.add(door);
    for (const s of [-1, 1]) { const win = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 1.2), dark); win.position.set(s * (v.w / 2 + 0.03), v.h * 0.6, 0); g.add(win); }
  }
  return g;
}

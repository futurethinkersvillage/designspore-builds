// Lake Storage shed (utility_buildings "Lake Storage"): a plain gable shed by the lake. Seen in the Lake & Field 360°
// (DomeLake1) as cream walls under a green metal roof. Simple massing only; written for chapter 5.
import * as THREE from 'three';

export const meta = {
  name: 'Lake Storage shed', slug: 'lake_storage', layer: 'utility_buildings', match: 'Lake Storage',
  footprint: [7, 9.5], height: 4.6,
  // quad centroid; long axis bearing ~140° -> rotY = π − 140°
  place: { x: -32.5, y: -158.1, rotY: 0.698 },
  sources: ['tour/DomeLake1_blended_fused-2-1.jpg'],
  notes: 'Wall height, pitch and door are guesses; colours from the 360°.',
};

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group();
  const W = 6.6, D = 9.1, H = 3.0, R = 1.6;
  const wall = new THREE.MeshStandardMaterial({ color: 0xe6e0d0, roughness: 0.85 });
  const roof = new THREE.MeshStandardMaterial({ color: 0x3f6b4c, roughness: 0.55, metalness: 0.2, side: THREE.DoubleSide });
  const trim = new THREE.MeshStandardMaterial({ color: 0x2f5039, roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), wall); body.position.y = H / 2; g.add(body);
  // gable ends
  const tri = new THREE.Shape([new THREE.Vector2(-W / 2, 0), new THREE.Vector2(W / 2, 0), new THREE.Vector2(0, R)]);
  for (const s of [-1, 1]) {
    const m = new THREE.Mesh(new THREE.ShapeGeometry(tri), wall); m.position.set(0, H, s * D / 2); if (s < 0) m.rotation.y = Math.PI; g.add(m);
  }
  // roof: two thin slabs with a small overhang
  const ov = 0.35, ang = Math.atan2(R, W / 2), len = Math.hypot(W / 2, R) + ov;
  for (const s of [-1, 1]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(len, 0.1, D + 2 * ov), roof);
    p.rotation.z = -s * ang;
    p.position.set(s * (W / 4 + ov / 2 * Math.cos(ang) - 0.05), H + R / 2 - ov / 2 * Math.sin(ang) + 0.06, 0); g.add(p);
  }
  // roll-up door on the +Z gable, and a ridge cap
  const door = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.6), trim); door.position.set(0, 1.3, D / 2 + 0.01); g.add(door);
  if (lod === 'high') {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, D + 2 * ov), trim); cap.position.y = H + R + 0.02; g.add(cap);
  }
  return g;
}

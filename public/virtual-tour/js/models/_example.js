// Reference for building modules (not a real building). Contract every module in js/models/ follows:
//   export const meta = { name, layer, match, footprint: [w, d], height, sources: [...], notes }
//   export function build({ lod = 'high' } = {}) -> THREE.Group
// Units are metres. Origin = ground-level centre of the footprint, +Y up, main entrance faces +Z.
// Procedural geometry + flat / vertex colours or small CanvasTextures only (no external files).
import * as THREE from 'three';

export const meta = {
  name: 'Example shed', layer: null, match: null, footprint: [6, 4], height: 4,
  sources: [], notes: 'Format reference only.',
};

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group();
  const wall = new THREE.MeshStandardMaterial({ color: 0x9c7a55, roughness: 0.9 });
  const roof = new THREE.MeshStandardMaterial({ color: 0x3d3a3a, roughness: 0.7 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(6, 2.6, 4), wall); body.position.y = 1.3; g.add(body);
  const r = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 3.4, 1.4, 4, 1), roof);
  r.rotation.y = Math.PI / 4; r.scale.set(1.25, 1, 0.85); r.position.y = 2.6 + 0.7; g.add(r);
  return g;
}

// Parked RVs, placed on the real ones in the drone photo (tools/find_rvs.py + picks by eye). Three kinds:
//   trailer (travel trailer, 6–9 m), fifth (fifth-wheel with the raised nose, 9–12 m), motorhome (class C, 7–10 m).
// variant = kind, size = length in metres. White fibreglass with a grey band, dark windows, black tyres.
import * as THREE from 'three';

export const meta = { name: 'RV', footprint: [2.5, 8], height: 3.4, notes: 'Origin = centre of the footprint; long axis along z, front (hitch / cab) toward +z.' };

const white = new THREE.MeshStandardMaterial({ color: 0xf1efe9, roughness: 0.55 });
const band = new THREE.MeshStandardMaterial({ color: 0x6d6f74, roughness: 0.6 });
const glass = new THREE.MeshStandardMaterial({ color: 0x1d2128, roughness: 0.2, metalness: 0.3 });
const tyre = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.9 });
const roofM = new THREE.MeshStandardMaterial({ color: 0xd9d7d0, roughness: 0.8 });

function box(g, m, w, h, d, x, y, z) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); g.add(o); return o; }

export function build({ lod = 'high', variant = 'trailer', size } = {}) {
  const g = new THREE.Group(), kind = variant || 'trailer';
  const L = size || ({ trailer: 7.5, fifth: 10.5, motorhome: 8.5 })[kind] || 7.5, W = 2.45, H = kind === 'fifth' ? 3.3 : 3.0;
  const floor = 0.55, bodyL = kind === 'fifth' ? L - 1.6 : kind === 'motorhome' ? L - 1.8 : L - 1.2;
  const zc = -L / 2 + bodyL / 2;                       // body starts at the back (-z)
  box(g, white, W, H - floor, bodyL, 0, floor + (H - floor) / 2, zc);
  box(g, roofM, W - 0.1, 0.08, bodyL - 0.2, 0, H + 0.04, zc);
  box(g, band, W + 0.02, 0.22, bodyL, 0, floor + 0.85, zc);                     // the grey side stripe
  if (lod !== 'low') {                                  // a run of dark windows down each side + a back window
    for (const s of [-1, 1]) for (let k = 0; k < Math.max(2, Math.floor(bodyL / 2.6)); k++)
      box(g, glass, 0.03, 0.55, 0.9, s * (W / 2 + 0.01), floor + 1.6, -L / 2 + 1.2 + k * 2.6);
    box(g, glass, 1.2, 0.5, 0.03, 0, floor + 1.6, -L / 2 - 0.01);
  }
  if (kind === 'fifth') {                               // the raised nose over the truck bed
    box(g, white, W, 1.3, 1.9, 0, H - 0.65, -L / 2 + bodyL + 0.75);
  } else if (kind === 'motorhome') {                    // cab + the over-cab bunk
    box(g, white, W, 1.5, 1.9, 0, 0.55 + 0.75, L / 2 - 0.95);
    box(g, glass, W - 0.2, 0.6, 0.05, 0, 1.55, L / 2 + 0.01);
    box(g, white, W, 0.9, 1.4, 0, H - 0.45, L / 2 - 1.2);
  } else {                                              // A-frame hitch
    box(g, band, 0.12, 0.12, 1.2, 0, 0.45, L / 2 - 0.6);
  }
  const wheelZ = kind === 'motorhome' ? [-L / 2 + 1.6, L / 2 - 1.2] : [zc - 0.4, zc + 0.5];
  for (const z of wheelZ) for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, lod === 'low' ? 8 : 14), tyre);
    w.rotation.z = Math.PI / 2; w.position.set(s * (W / 2 - 0.1), 0.36, z); g.add(w);
  }
  return g;
}

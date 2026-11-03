// Bohemian furnishing for the zomes the tour opens up (Mike 11-02): rugs, floor cushions, hanging plants, rattan pendants, a woven wall hanging; and the café's coffee bar with
// an espresso machine, mugs on the tables. Local metres of one zome: floor at y = 0, door towards +z, R = the zome's radius. All planned.
import * as THREE from 'three';
import { plantGeo } from './shower_house.js';

const H = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const TONES = [0xb5532e, 0xd19a3a, 0x2f6f6b, 0x8c3b2f, 0xc9b48a, 0x5d4a76];
const mat = (color, rough = 0.9, extra = {}) => { const m = new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra }); m.userData.noSurface = true; return m; };
const mesh = (g, m, x, y, z, ry = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.rotation.y = ry; return o; };

function wovenTexture(seed) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 256; const g = c.getContext('2d');
  for (let y = 0; y < 256; y += 16) { g.fillStyle = '#' + TONES[(seed + (y >> 4)) % TONES.length].toString(16).padStart(6, '0'); g.fillRect(0, y, 128, 16); if ((y >> 4) % 3 === 0) { g.fillStyle = '#efe4cf'; for (let x = 0; x < 128; x += 16) { g.beginPath(); g.moveTo(x, y + 16); g.lineTo(x + 8, y + 2); g.lineTo(x + 16, y + 16); g.fill(); } } }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function rug(g, r, x, z, seed) {
  [[1, TONES[seed % 6]], [0.8, 0xefe4cf], [0.72, TONES[(seed + 2) % 6]], [0.42, 0xefe4cf], [0.34, TONES[(seed + 1) % 6]]].forEach(([k, c], i) => g.add(mesh(new THREE.CylinderGeometry(r * k, r * k, 0.012, 28), mat(c, 1), x, 0.012 + i * 0.006, z)));
}
function cushion(g, x, z, c) { const o = mesh(new THREE.SphereGeometry(0.34, 12, 8), mat(c, 1), x, 0.14, z); o.scale.y = 0.42; g.add(o); }
function hanger(g, x, z, y, i) {
  const rope = mat(0xb9a584, 1); g.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.4, 4), rope, x, y + 0.72, z));
  g.add(mesh(new THREE.CylinderGeometry(0.15, 0.1, 0.2, 10), mat(i % 2 ? 0xb5532e : 0xe4d8c2), x, y, z));
  const leaves = new THREE.Mesh(plantGeo('leafy'), new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })); leaves.position.set(x, y - 0.02, z); leaves.scale.setScalar(0.62); leaves.rotation.y = i; g.add(leaves);
  const down = leaves.clone(); down.position.y = y - 0.42; down.scale.set(0.42, 0.62, 0.42); down.rotation.set(Math.PI, i * 2, 0); g.add(down);
}
function pendant(g, x, z, y) {
  g.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.2, 4), mat(0x2b2622), x, y + 0.65, z));
  const shade = mesh(new THREE.SphereGeometry(0.26, 12, 8, 0, 6.3, 0, 1.75), mat(0xb88a4a, 1, { side: THREE.DoubleSide }), x, y, z); g.add(shade);
  const glow = new THREE.MeshBasicMaterial({ color: 0xffd9a0, toneMapped: false }); g.add(mesh(new THREE.SphereGeometry(0.07, 8, 6), glow, x, y - 0.06, z));
}
function basketPlant(g, x, z, i) {
  g.add(mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.3, 10), mat(0xb88a4a), x, 0.15, z));
  const p = new THREE.Mesh(plantGeo('leafy'), new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })); p.position.set(x, 0.28, z); p.scale.setScalar(1.25); p.rotation.y = i; g.add(p);
}
function wallHanging(g, R, a, seed) {
  const x = Math.sin(a) * R * 0.86, z = Math.cos(a) * R * 0.86;
  const o = mesh(new THREE.PlaneGeometry(0.9, 1.5), new THREE.MeshStandardMaterial({ map: wovenTexture(seed), roughness: 1, side: THREE.DoubleSide }), x, 1.35, z, a + Math.PI); o.material.userData.noSurface = true; g.add(o);
}
function mug(g, x, y, z, c = 0xefe4cf) { g.add(mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.09, 10), mat(c, 0.5), x, y + 0.045, z)); }
function table(g, x, z, seed) {
  const wood = mat(0x8a5e3a, 0.8); g.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.04, 16), wood, x, 0.74, z)); g.add(mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.72, 8), mat(0x2b2622), x, 0.37, z));
  mug(g, x + 0.16, 0.76, z + 0.08, TONES[seed % 6]); mug(g, x - 0.14, 0.76, z - 0.1); g.add(mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.1, 8), mat(0xb5532e), x, 0.81, z + 0.02));
  for (const a of [0.6, 3.4]) g.add(mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.45, 10), mat(TONES[(seed + 3) % 6], 1), x + Math.cos(a + seed) * 0.72, 0.23, z + Math.sin(a + seed) * 0.72));
}
function coffeeBar(g, R) {
  const z = -R * 0.56, top = 1.02, wood = mat(0x6b4427, 0.75), steel = mat(0xc4c7c9, 0.3, { metalness: 0.8 }), black = mat(0x1f1d1c, 0.5);
  g.add(mesh(new THREE.BoxGeometry(2.8, 1, 0.62), wood, 0, 0.5, z)); g.add(mesh(new THREE.BoxGeometry(2.92, 0.05, 0.72), mat(0xe4d8c2, 0.5), 0, top, z));
  // espresso machine: body, drip tray, group heads, steam wand, cups warming on top
  g.add(mesh(new THREE.BoxGeometry(0.72, 0.42, 0.44), steel, -0.55, top + 0.25, z)); g.add(mesh(new THREE.BoxGeometry(0.74, 0.04, 0.5), black, -0.55, top + 0.05, z + 0.02));
  for (const s of [-0.18, 0.18]) { g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 10), black, -0.55 + s, top + 0.16, z + 0.2)); }
  g.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.26, 5), steel, -0.1, top + 0.2, z + 0.2));
  for (let i = 0; i < 6; i++) mug(g, -0.8 + (i % 3) * 0.22, top + 0.46, z - 0.08 + (i >> 1) * 0.0 + (i > 2 ? 0.14 : 0));
  g.add(mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.2, 10), black, 0.08, top + 0.14, z - 0.05)); g.add(mesh(new THREE.CylinderGeometry(0.1, 0.05, 0.14, 10), mat(0x8a5e3a, 0.4), 0.08, top + 0.3, z - 0.05));   // grinder + beans
  for (let i = 0; i < 3; i++) g.add(mesh(new THREE.SphereGeometry(0.07, 8, 6), mat([0xcf8a3a, 0xdab26a, 0x9c5f30][i]), 0.55 + i * 0.16, top + 0.08, z));   // pastries
  for (let i = 0; i < 3; i++) g.add(mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.62, 10), mat(0x2b2622), -0.8 + i * 0.8, 0.31, z + 0.72));   // stools
}
export function furnish(site, plan, R, floorY) {
  const g = new THREE.Group(); g.name = 'boho'; g.position.y = floorY; const seed = plan.length;
  const cafe = plan.includes('cafe');
  rug(g, R * 0.42, 0, cafe ? R * 0.2 : 0, seed);
  if (cafe) { coffeeBar(g, R); [[-R * 0.45, R * 0.05], [R * 0.45, R * 0.02], [0, R * 0.42], [-R * 0.55, R * 0.45], [R * 0.55, R * 0.45]].forEach(([x, z], i) => table(g, x, z, seed + i)); }
  else { for (let i = 0; i < 5; i++) { const a = i * 1.26 + 0.5, r = R * 0.44; cushion(g, Math.cos(a) * r, Math.sin(a) * r, TONES[(seed + i) % 6]); } g.add(mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 14), mat(0x7a5233), 0, 0.3, 0)); g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 6), mat(0x4a3322), 0, 0.15, 0)); mug(g, 0.1, 0.32, 0.05); }
  const top = Math.min(2.4, R * 0.72);
  [0.6, 1.9, 3.3, 4.6, 5.6].forEach((a, i) => hanger(g, Math.cos(a) * R * 0.62, Math.sin(a) * R * 0.62, top - 0.25 + H(i + seed) * 0.25, i));
  pendant(g, 0, 0, top + 0.1); if (R > 3.5) { pendant(g, R * 0.35, R * 0.25, top); pendant(g, -R * 0.35, R * 0.25, top); }
  basketPlant(g, Math.cos(2.5) * R * 0.76, Math.sin(2.5) * R * 0.76, seed); basketPlant(g, Math.cos(0.3) * R * 0.76, Math.sin(0.3) * R * 0.76, seed + 2);
  wallHanging(g, R, 2.2, seed); wallHanging(g, R, -2.2, seed + 3);
  site.add(g); return g;
}

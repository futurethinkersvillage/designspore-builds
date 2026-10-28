// Light tunnel: a 34 m walk-through (and fly-through) nave of 16 pointed steel arches, each traced with a dense LED
// strip. Colour waves roll through the arches from one end to the other: amber -> mauve -> indigo -> teal.
// Pointed (lancet) arches, not circles, so it never reads as a ring/portal.
import * as THREE from 'three';

export const meta = { name: 'Light tunnel', footprint: [8, 34], height: 7.2, notes: 'Art trail, geometry & light. Fly-through along +Z. Concept.' };

const N_ARCH = 16, SPACING = 2.2, HALF_W = 3.4, H = 7.0;
// lancet arch: each side is a circular arc (radius R, centre on the far side) from its foot up to the shared apex;
// s in 0..1 runs left foot -> apex -> right foot
const R = 2 * HALF_W * 0.95, A_MAX = Math.acos((R - HALF_W) / R);
function archPoint(s) {
  const side = s < 0.5 ? -1 : 1, a = (s < 0.5 ? s * 2 : (1 - s) * 2) * A_MAX;   // 0 at the foot, A_MAX at the apex
  return new THREE.Vector3(side * (HALF_W - R + R * Math.cos(a)), 0.3 + (H - 0.3) * Math.sin(a) / Math.sin(A_MAX), 0);
}

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0x1f1d22, roughness: 0.65, metalness: 0.65 });
  const per = lod === 'low' ? 60 : 130, leds = [];
  for (let a = 0; a < N_ARCH; a++) {
    const z = (a - (N_ARCH - 1) / 2) * SPACING, pts = [];
    for (let i = 0; i <= 48; i++) pts.push(archPoint(i / 48).setZ(z));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.09, 6), steel));
    for (let i = 0; i <= per; i++) { const p = archPoint(i / per); p.z = z + 0.12; leds.push({ p, a, s: i / per }); }
  }
  // two low steel rails along the floor tie the arches together
  for (const x of [-HALF_W, HALF_W]) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, (N_ARCH - 1) * SPACING), steel); r.position.set(x, 0.3, 0); g.add(r);
  }
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), leds.length);
  const m = new THREE.Matrix4(); leds.forEach((l, i) => { m.makeTranslation(l.p.x, l.p.y, l.p.z); mesh.setMatrixAt(i, m); });
  g.add(mesh);
  g.userData = { mesh, leds };
  return g;
}

const STOPS = ['#EA824E', '#c46aa8', '#5450c8', '#3fd6c8', '#EA824E'].map(s => new THREE.Color(s)), c = new THREE.Color();
export function update(g, t) {
  const { mesh, leds } = g.userData;
  for (let i = 0; i < leds.length; i++) {
    const l = leds[i];
    // a colour wave travels along the tunnel; a bright pulse chases up each arch to the apex
    const w = (l.a / N_ARCH - t * 0.12) % 1, k = ((w % 1) + 1) % 1 * (STOPS.length - 1), j = Math.floor(k);
    c.copy(STOPS[j]).lerp(STOPS[j + 1], k - j);
    const apex = 1 - Math.abs(l.s - 0.5) * 2, pulse = Math.max(0, Math.sin((apex - t * 0.8 + l.a * 0.15) * 6.283));
    c.multiplyScalar(0.75 + 0.9 * pulse * pulse);   // always lit; the pulse runs brighter
    mesh.setColorAt(i, c);
  }
  mesh.instanceColor.needsUpdate = true;
}

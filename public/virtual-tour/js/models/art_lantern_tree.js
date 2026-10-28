// Lantern tree: a 10 m blackened-steel tree whose branching limbs carry ~500 small warm LED lanterns. At night the
// steel disappears and the crown reads as a cloud of slowly breathing amber light, with mauve/teal twinkles.
import * as THREE from 'three';

export const meta = { name: 'Lantern tree', footprint: [12, 12], height: 10.5, notes: 'Art trail, nature giants. Concept.' };

function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group(), rnd = rng(11);
  const steel = new THREE.MeshStandardMaterial({ color: 0x1d1b1e, roughness: 0.7, metalness: 0.6 });
  const tips = [], wrap = [];
  // recursive limbs: each limb a tapered tube, splitting 2-3 ways, bending up and out
  const limb = (from, dir, len, rad, depth) => {
    const to = from.clone().addScaledVector(dir, len);
    const mid = from.clone().lerp(to, 0.5).add(new THREE.Vector3((rnd() - 0.5) * len * 0.25, len * 0.08, (rnd() - 0.5) * len * 0.25));
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 6, rad, 6), steel));
    // a fine LED wrap spirals along every limb, so the tree's shape reads against the night sky
    const turns = Math.max(2, Math.round(len * 2.2));
    for (let k = 0; k <= turns * 6; k++) { const u = k / (turns * 6), p = curve.getPoint(u), a = u * turns * 6.283;
      wrap.push(p.add(new THREE.Vector3(Math.cos(a) * rad * 1.15, 0, Math.sin(a) * rad * 1.15))); }
    if (depth === 0) { tips.push(to); return; }
    const n = depth > 2 ? 2 : 3;
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, tilt = 0.35 + rnd() * 0.5;
      const d = dir.clone().multiplyScalar(0.55).add(new THREE.Vector3(Math.cos(a) * tilt, 0.35 + rnd() * 0.3, Math.sin(a) * tilt)).normalize();
      limb(to, d, len * (0.62 + rnd() * 0.15), rad * 0.62, depth - 1);
    }
  };
  limb(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 3.6, 0.32, lod === 'low' ? 3 : 4);
  // lanterns: hung along every tip twig and scattered through the crown, on short drops
  const pts = [];
  for (const t of tips) for (let k = 0; k < 6; k++) pts.push(t.clone().add(new THREE.Vector3((rnd() - 0.5) * 1.6, -rnd() * 1.4, (rnd() - 0.5) * 1.6)));
  const lamp = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), pts.length);
  const glow = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }), pts.length);
  const m = new THREE.Matrix4();
  pts.forEach((p, i) => { m.makeTranslation(p.x, p.y, p.z); lamp.setMatrixAt(i, m); glow.setMatrixAt(i, m); });
  const vine = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 5, 3), new THREE.MeshBasicMaterial({ color: 0xffffff }), wrap.length);
  wrap.forEach((p, i) => { m.makeTranslation(p.x, p.y, p.z); vine.setMatrixAt(i, m); });
  g.add(lamp, glow, vine);
  g.userData = { lamp, glow, vine, wrap, pts, ph: pts.map(() => rnd() * 6.283), kind: pts.map(() => rnd()) };
  return g;
}

const AMBER = new THREE.Color('#EA824E'), CREAM = new THREE.Color('#ffe2b8'), MAUVE = new THREE.Color('#c07ab8'), TEAL = new THREE.Color('#5fe0d0'), c = new THREE.Color();
export function update(g, t) {
  const { lamp, glow, pts, ph, kind } = g.userData;
  for (let i = 0; i < pts.length; i++) {
    // a slow breath rising up the crown, with a few lanterns that twinkle in mauve/teal
    const breath = 0.55 + 0.45 * Math.sin(t * 0.9 - pts[i].y * 0.55 + ph[i] * 0.3);
    if (kind[i] > 0.9) c.copy(kind[i] > 0.95 ? MAUVE : TEAL).multiplyScalar(0.5 + 0.5 * Math.max(0, Math.sin(t * 2.3 + ph[i])));
    else c.copy(CREAM).lerp(AMBER, 0.5 + 0.5 * Math.sin(ph[i])).multiplyScalar(0.45 + 0.75 * breath);
    lamp.setColorAt(i, c); glow.setColorAt(i, c);
  }
  const { vine, wrap } = g.userData;
  for (let i = 0; i < wrap.length; i++) {   // a slow warm pulse climbing the limbs, feeding the lanterns
    const k = 0.5 + 0.5 * Math.sin(wrap[i].y * 1.6 - t * 1.4);
    vine.setColorAt(i, c.copy(AMBER).multiplyScalar(0.25 + 0.55 * k * k));
  }
  vine.instanceColor.needsUpdate = true;
  lamp.instanceColor.needsUpdate = glow.instanceColor.needsUpdate = true;
}

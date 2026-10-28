// Reference for art installations (Burning Man-style, LED-lit, seen at night along the Discovery Trail).
// Contract: export meta + build({ lod }) -> THREE.Group, origin at ground centre, metres, +Y up; optional
// update(group, t) animates the LEDs (t = seconds). LEDs = MeshBasicMaterial / high-emissive colours that the bloom
// pass makes glow; keep the structure dark (steel, timber) so the light carries the shape. No external files.
import * as THREE from 'three';

export const meta = { name: 'Example LED arch', footprint: [6, 2], height: 5, notes: 'Format reference only.' };

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0x2b2b30, roughness: 0.6, metalness: 0.7 });
  const leds = [];
  const n = lod === 'low' ? 24 : 60;
  for (let i = 0; i <= n; i++) {
    const a = Math.PI * i / n, x = -3 * Math.cos(a), y = 4.6 * Math.sin(a);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    led.position.set(x, y + 0.2, 0); g.add(led); leds.push(led);
  }
  const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(leds.map(l => l.position.clone().setZ(-0.12))), 64, 0.05, 6), steel);
  g.add(tube);
  g.userData.leds = leds;
  return g;
}

// a slow chase of warm amber to magenta along the arch
const c = new THREE.Color();
export function update(g, t) {
  g.userData.leds.forEach((led, i) => {
    const k = 0.5 + 0.5 * Math.sin(t * 2.2 - i * 0.35);
    led.material.color.copy(c.setHSL(0.07 + 0.82 * k, 0.95, 0.35 + 0.35 * k));
  });
}

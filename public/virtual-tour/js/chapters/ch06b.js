// The gazebo's future (moved here 11-02: it's future development, so it follows the title in ch07): with the camera nearly still, today's gazebo converts into the planned
// co-working café (js/models/gazebo_cafe.js): glazing, furniture, café counter, laptops, lights.
import * as CAFE from '../models/gazebo_cafe.js';
export const meta = { id: 'ch06b', title: 'Co-working café', seconds: 13, animated: true, blend: 0.02, cut: true };   // r1103b: cross-fade from the ledger map onto the gazebo, no plunge
let DUSKH, DUSKT, glowL, SUN0 = 1, HEMI0 = 1, rig, capCafe, cafe, gzObj, tables = [];
export async function setup(ctx) {
  const { THREE, rig: R, heightAt } = ctx;
  SUN0 = ctx.sun.intensity; HEMI0 = ctx.hemi.intensity; DUSKH = new THREE.Color('#e8a878'); DUSKT = new THREE.Color('#4a4a80');
  const G = { x: -597, y: -226 }, h = heightAt(G.x, G.y), gp = ctx.PLACE.gazebo[0];
  glowL = new THREE.PointLight(0xffc78a, 0, 28, 1.6); glowL.position.set(G.x, h + 2.6, -G.y); ctx.scene.add(glowL);
  const gz = await ctx.placeModel('gazebo'); gzObj = gz.children[0];
  cafe = CAFE.build({ lod: ctx.MOBILE ? 'low' : 'high' });
  cafe.position.set(gp.x, heightAt(gp.x, gp.y), -gp.y); cafe.rotation.y = gp.rotY || 0;
  CAFE.setStage(cafe, 0); cafe.visible = false; ctx.scene.add(cafe);
  rig = R.makeRig([
    [0.00, G.x, G.y, h + 1.8, 40, 330, -16, 48],
    [0.28, G.x - 1.4, G.y - 0.6, h + 1.8, 16, 334, -8, 50],
    [1.00, G.x - 2.7, G.y - 1.2, h + 1.8, 15, 336, -6, 50],
  ]);
  capCafe = document.createElement('div'); capCafe.className = 'cap';
  capCafe.innerHTML = '<div class="eyebrow">The gazebo</div><h1>A co-working café.</h1>';
  capCafe.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40)); ctx.hud.appendChild(capCafe);
}
export function update(t, ctx) {
  const s = ctx.rig.seg;
  ctx.U.uWaterAmt.value = 0.3;
  rig.apply(ctx.camera, t);
  const k = s(t, 0.3, 0.68);   // in stages: glazing, furniture, café, laptops, lights; then a real hold on the finished café
  CAFE.setStage(cafe, k); cafe.visible = k > 0.001;
  if (gzObj) CAFE.clearGazebo(gzObj, s(t, 0.42, 0.52));
  const on = s(t, 0.66, 0.8); if (on > 0) cafe.traverse(m => { const u = m.material?.userData; if (u?.glow) m.material.emissiveIntensity = u.baseEmissive * on * 22; });
  const dusk = s(t, 0.64, 0.86); ctx.U.uLight.value.set(1 - 0.3 * dusk, 1 - 0.4 * dusk, 1 - 0.45 * dusk); ctx.sun.intensity = SUN0 * (1 - 0.35 * dusk); ctx.hemi.intensity = HEMI0 * (1 - 0.3 * dusk); glowL.intensity = 260 * on;
  capCafe.style.opacity = s(t, 0.36, 0.42);
  capCafe.style.transform = `translateY(${(1 - s(t, 0.36, 0.46)) * 14}px)`;
}

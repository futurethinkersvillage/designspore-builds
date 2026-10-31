// Chapter 6 — The gazebo: the heart. A low flight west across the golf / disc-golf fairways, past the real
// permaculture garden and Top House, to the 120-person event gazebo; then, with the camera nearly still, the gazebo converts into the planned co-working café (js/models/gazebo_cafe.js:
// glazing, furniture, café counter, laptops, lights — Mike 10-29; replaces the old orange concept boxes).
import * as CAFE from '../models/gazebo_cafe.js';

export const meta = { id: 'ch06', title: 'The gazebo: the heart', seconds: 14, animated: true, blendTurn: true };   // the blend's slerp flipped direction at frame 3144: one 114° jump

let DUSKH, DUSKT, glowL, SUN0 = 1, HEMI0 = 1, rig, cap, capCafe, tag, photo, cafe, gzObj, tables = [];

function el(html, css) { const d = document.createElement('div'); d.innerHTML = html; if (css) d.style.cssText = css; return d; }

export async function setup(ctx) {
  const { THREE, rig: R, heightAt } = ctx;
  SUN0 = ctx.sun.intensity; HEMI0 = ctx.hemi.intensity; DUSKH = new THREE.Color('#e8a878'); DUSKT = new THREE.Color('#4a4a80');
  glowL = new THREE.PointLight(0xffc78a, 0, 28, 1.6); glowL.position.set(-597, heightAt(-597, -226) + 2.6, 226); ctx.scene.add(glowL);
  const gz = await ctx.placeModel('gazebo');
  tables = []; gz.traverse(o => { if (o.name === 'picnic_table') tables.push(o); });   // cleared away as the café draws in
  await ctx.placeModel('top_house');
  ctx.blocks.visible = false;
  const G = { x: -597, y: -226, rotY: 0.6615 }, h = heightAt(G.x, G.y); // where the drone survey shows it (engine.js PLACE)

  // ---- the planned co-working café, laid over the gazebo exactly where the gazebo stands ----
  const gp = ctx.PLACE.gazebo[0];
  cafe = CAFE.build({ lod: ctx.MOBILE ? 'low' : 'high' });
  cafe.position.set(gp.x, heightAt(gp.x, gp.y), -gp.y); cafe.rotation.y = gp.rotY || 0;
  CAFE.setStage(cafe, 0); cafe.visible = false; ctx.scene.add(cafe);
  gzObj = gz.children[0];

  // [t, east, north, height, frameH, heading°, pitch°, fov°]
  // in over the fairways to the open side (faces SE), then a hold on the gazebo as it is today, then — camera almost
  // still — it converts into the café. (Mike 10-30: "we don't need the gazebo 360 image … it looks bad": no photo stop.)
  rig = R.makeRig([
    [0.00, -540, -205, h + 10, 90, 250, -22, 45],
    [0.36, G.x, G.y, h + 1.8, 16, 330, -9, 50],    // the open front
    [0.62, G.x - 1.4, G.y - 0.6, h + 1.8, 15.5, 334, -8, 50],    // hold: today's gazebo, the first line reads
    [1.00, G.x - 2.7, G.y - 1.2, h + 1.8, 15, 336, -6, 50],    // a slow push while it converts; the building sits right of the caption
  ]);

  const mark = h => ctx.markImg(h);
  cap = el('<div class="eyebrow">The heart · here today</div><h1 style="white-space:nowrap;font-size:clamp(30px,4vw,56px)">The 120-person gazebo</h1>' +
    '<p style="font:400 15px/1.45 Inter,sans-serif;margin:12px 0 0;opacity:.9">Weddings, meetups, celebrations and community dinners.</p>');
  cap.className = 'cap'; cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', mark(40)); ctx.hud.appendChild(cap);
  capCafe = el('<div class="eyebrow">Next</div><h1>Ready to become<br>a co-working café.</h1>');
  capCafe.className = 'cap'; capCafe.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', mark(40)); ctx.hud.appendChild(capCafe);
  photo = el('<img src="assets/pano/ch06_gazebo_interior.jpg" alt="" style="display:block;width:100%;height:100%;object-fit:cover">' +
    '<div style="position:absolute;left:0;top:100%;margin-top:8px;font:500 10px/1 Inter,sans-serif;letter-spacing:.18em;color:#F2EDE8;text-transform:uppercase">Inside the gazebo · photo</div>',
    'position:absolute;right:max(16px,4vw);top:18vh;width:min(34vw,420px);aspect-ratio:4/3;border:1px solid rgba(242,237,232,.7);box-shadow:0 18px 50px rgba(0,0,0,.45);opacity:0');
  ctx.hud.appendChild(photo);
  tag = el('PLANNED', 'display:none;position:absolute;right:max(16px,3vw);top:max(16px,3vh);font:600 11px/1 Inter,sans-serif;letter-spacing:.18em;color:#EA824E;border:1px solid #EA824E;padding:7px 10px;border-radius:2px;background:rgba(26,23,32,.55);opacity:0');
  ctx.hud.appendChild(tag);
}

export function update(t, ctx) {
  const s = ctx.rig.seg;
  ctx.U.uWaterAmt.value = 0.3;
  rig.apply(ctx.camera, t);
  cap.style.opacity = s(t, 0.34, 0.39) - s(t, 0.6, 0.63);   // on the hold
  cap.style.transform = `translateY(${(1 - s(t, 0.34, 0.42)) * 14}px)`;
  photo.style.opacity = 0;
  // the conversion plays while the camera holds: glazing, furniture, café, laptops, then the lights come on
  const k = s(t, 0.6, 0.85);   // ~3 s, in stages: glazing, furniture, café, laptops, lights; then a real hold on the finished café (i12)
  CAFE.setStage(cafe, k); cafe.visible = k > 0.001;
  if (gzObj) CAFE.clearGazebo(gzObj, s(t, 0.68, 0.76));   // today's tables make way as the new furniture arrives (no empty-deck beat)
  // the lights come on visibly (i3 review: the pendants stayed dark in daylight): warm glow ×3 at the end
  const on = s(t, 0.82, 0.92); if (on > 0) cafe.traverse(m => { const u = m.material?.userData; if (u?.glow) m.material.emissiveIntensity = u.baseEmissive * on * 22; });   // (i7: ×3 barely showed)
  // the evening comes on as the lights do, so they actually read (i12)
  const dusk = s(t, 0.8, 0.95); ctx.U.uLight.value.set(1 - 0.3 * dusk, 1 - 0.4 * dusk, 1 - 0.45 * dusk); ctx.sun.intensity = SUN0 * (1 - 0.35 * dusk); ctx.hemi.intensity = HEMI0 * (1 - 0.3 * dusk); glowL.intensity = 260 * on; { const u = ctx.sky.mat.uniforms; u.uHorizon.value.copy(ctx.colors.horizon).lerp(DUSKH, dusk); u.uTop.value.copy(ctx.colors.skyTop).lerp(DUSKT, dusk); ctx.U.uFog.value.copy(u.uHorizon.value); }
  capCafe.style.opacity = s(t, 0.64, 0.68);
  capCafe.style.transform = `translateY(${(1 - s(t, 0.64, 0.71)) * 14}px)`;
  tag.style.opacity = 0;
}

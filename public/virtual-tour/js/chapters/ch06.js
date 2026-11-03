// Chapter 6 — The gazebo: the heart. A low flight west across the golf / disc-golf fairways, past the real
// permaculture garden and Top House, to the 120-person event gazebo; then, with the camera nearly still, the gazebo converts into the planned co-working café (js/models/gazebo_cafe.js:
// glazing, furniture, café counter, laptops, lights — Mike 10-29; replaces the old orange concept boxes).
import * as CAFE from '../models/gazebo_cafe.js';

export const meta = { id: 'ch06', title: 'The gazebo: the heart', seconds: 27, animated: true, blend: 0.02, cut: true };   // r1103b: cross-fade straight onto the pond (the glide in was 6 s with no subject)   // the blend's slerp flipped direction at frame 3144: one 114° jump
let rig, cap, tag, photo, gzObj, tables = [];

function el(html, css) { const d = document.createElement('div'); d.innerHTML = html; if (css) d.style.cssText = css; return d; }

export async function setup(ctx) {
  const { THREE, rig: R, heightAt } = ctx;
  const gz = await ctx.placeModel('gazebo');
  tables = []; gz.traverse(o => { if (o.name === 'picnic_table') tables.push(o); });   // cleared away as the café draws in
  await ctx.placeModel('top_house');
  ctx.blocks.visible = false;
  const G = { x: -597, y: -226, rotY: 0.6615 }, h = heightAt(G.x, G.y); // where the drone survey shows it (engine.js PLACE)

  gzObj = gz.children[0];

  // [t, east, north, height, frameH, heading°, pitch°, fov°]
  // in over the fairways to the open side (faces SE), then a hold on the gazebo as it is today, then — camera almost
  // still — it converts into the café. (Mike 10-30: "we don't need the gazebo 360 image … it looks bad": no photo stop.)
  const SG = ctx.PLACE.entrance_sign[0], sh = heightAt(SG.x, SG.y) + 2.7;
  rig = R.makeRig([
    // the drone's view of the pond on the course (video 15:05), the gazebo's next-door neighbour: stop, the footage dissolves in and out over the hold (js/clips.js)
    [0.00, -500, -190, ctx.groundAt(-500, -190), 52, 28, -24, 50],
    [0.28, -500, -190, ctx.groundAt(-500, -190), 52, 28, -24, 50],
    [0.51, -500, -190, ctx.groundAt(-500, -190), 52, 28, -24, 50],
    [0.62, G.x, G.y, h + 1.8, 16, 330, -9, 50],    // the open front
    [0.82, G.x - 1.4, G.y - 0.6, h + 1.8, 15.5, 334, -8, 50],    // hold: today's gazebo, and the real one in use
    [0.92, SG.x, SG.y, sh, 11, 36.7, -3, 40],   // on to the sign at the gate
    [1.00, SG.x, SG.y, sh, 10.4, 36.7, -3, 40],
  ]);
  ctx.clearTreesInView(R.views(rig, 0, 1, 0.02), 1.6, 0.45);   // no cone looming at the lens (corners included) on the way to the gazebo and the sign (r1103b: trunks filled the frame at 23 s)
  const mark = h => ctx.markImg(h);
  cap = el('<div class="eyebrow">The heart · here today</div><h1 style="white-space:nowrap;font-size:clamp(30px,4vw,56px)">The 120-person gazebo</h1>' +
    '<p style="font:400 15px/1.45 Inter,sans-serif;margin:12px 0 0;opacity:.9">Weddings, meetups, celebrations and community dinners.</p>');
  cap.className = 'cap'; cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', mark(40)); ctx.hud.appendChild(cap);
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
  cap.style.opacity = s(t, 0.6, 0.63) - s(t, 0.82, 0.85);
  cap.style.transform = `translateY(${(1 - s(t, 0.6, 0.66)) * 14}px)`;
  photo.style.opacity = 0; tag.style.opacity = 0;
  if (gzObj) CAFE.clearGazebo(gzObj, 0);
}

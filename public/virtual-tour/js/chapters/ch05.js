// Chapter 5 — The dome & the lake (real). Swing south from the bunk-cabin row to the geodesic glamping dome on the
// field by the private lake, settle on it, and show a real photo from inside the dome (a framed photo, not a pano:
// the Lake & Field 360° could not be registered convincingly, see models/notes/ch05.md).
import { makeBuildings } from '../objects.js';

export const meta = { id: 'ch05', title: 'The dome & the lake', seconds: 12, animated: true };

// The dome sits where the drone photo shows it (the plan polygon is ~10 m SW of it; models/notes/dome.md).
const DOME = { x: -144.5, y: -145.5, rotY: 2.314 };
let rig, cap, photo, myBlocks, vignette;

function el(html, css) { const d = document.createElement('div'); d.innerHTML = html; if (css) d.style.cssText = css; return d; }

export async function setup(ctx) {
  const { rig: R, placeModel, heightAt, L } = ctx;
  await placeModel('dome');   // the persistent dome (engine.js PLACE)
  await placeModel('bunk_cabin');
  await placeModel('sauna');
  // (lake_storage shed removed — Mike: no extra structure by the lake)
  // the shared footprint blocks, minus the ones the detailed models replace (accommodations 2–5), two small
  // unidentified 3 × 5 m pads (6, 7: tents?, a box would misstate them) and the open
  // picnic area west of the dome (public_areas 2), which is not a building
  const L2 = { ...L,
    accomodations_for_rent: (L.accomodations_for_rent || []).filter((_, i) => ![2, 3, 4, 5, 6, 7].includes(i)),
    utility_buildings: (L.utility_buildings || []).filter(f => f.p.Name !== 'Lake Storage'),
    public_areas: (L.public_areas || []).filter((_, i) => i !== 2) };
  myBlocks = makeBuildings(L2, heightAt); myBlocks.visible = false; ctx.scene.add(myBlocks);

  const h = heightAt(DOME.x, DOME.y);
  // [t, east, north, height, frameH, heading°, pitch°, fov°]
  // close on the dome, looking in through its panoramic window (faces NW), then ease back to show the lake beyond (SE)
  const gA = ctx.groundAt, DX = -145, DY = -146;
  // close on the dome, then rise and turn out to an overview of the swimming lake. (No 360° here: the Lake & Field
  // photo is from the dome's earlier spot — Mike, 10-28.)
  // (the film's blend covers t < 0.3: the dome beat comes after it, so the interior photo isn't half-faded)
  rig = R.makeRig([
    [0.00, DX, DY, gA(DX, DY) + 2, 60, 300, -30, 45],
    [0.30, DX, DY, gA(DX, DY) + 1.6, 18, 316, -11, 45],
    [0.50, DX, DY, gA(DX, DY) + 1.6, 16, 322, -10, 45],
    [0.74, -110, -182, gA(-110, -182), 140, 58, -30, 46],
    [1.00, -40, -236, gA(-40, -236), 230, 118, -42, 48],
  ]);

  cap = el('<div class="eyebrow">Here today</div><h1>The dome &amp; the lake</h1>' +
    '<p style="font:400 15px/1.45 Inter,sans-serif;margin:12px 0 0;opacity:.9;letter-spacing:.01em">A geodesic glamping dome on the field by our private lake.</p>');
  cap.className = 'cap';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap);
  vignette = document.getElementById('vignette');

  // framed real photo: inside the dome
  photo = el(`<div style="overflow:hidden;border-radius:3px;box-shadow:0 18px 60px rgba(10,8,14,.55),0 0 0 1px rgba(242,237,232,.18)">
      <img src="assets/pano/ch05_dome_interior.jpg" alt="Inside the glamping dome" style="display:block;width:100%;aspect-ratio:4/3;object-fit:cover;transform-origin:62% 55%"></div>
    <div style="margin-top:10px;font:500 10.5px/1.3 Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#F2EDE8;opacity:.85;text-shadow:0 1px 8px rgba(0,0,0,.5)">Inside the dome · photo</div>`,
    'position:absolute;right:max(16px,5vw);top:max(16px,10vh);width:min(34vw,460px);opacity:0;will-change:opacity,transform');
  ctx.hud.appendChild(photo);
  await new Promise(r => { const i = photo.querySelector('img'); if (i.complete) r(); else { i.onload = r; i.onerror = r; } });
}

export function update(t, ctx) {
  const { rig: R, U } = ctx;
  ctx.blocks.visible = false; myBlocks.visible = false;
  rig.apply(ctx.camera, t);
  U.uWaterAmt.value = 1 - 0.8 * R.seg(t, 0.1, 0.4);   // the atlas creek lines sit metres off the photo up close
  ctx.labels.update(0, 0, ctx.shown, ctx.camera);
  ctx.planned.update(0, 1, 1, false);
  if (vignette) vignette.style.opacity = 0.85;   // warm-dark edges: the brand mood over the real land
  cap.style.opacity = R.seg(t, 0.08, 0.2) - R.seg(t, 0.88, 0.97);
  cap.style.transform = `translateY(${(1 - R.seg(t, 0.08, 0.24)) * 14}px)`;
  const p = R.seg(t, 0.3, 0.35) - R.seg(t, 0.46, 0.5);   // inside the dome, while the camera is at its door (~1.5 s, opaque)
  photo.style.opacity = p;
  photo.style.transform = `translateY(${(1 - R.seg(t, 0.28, 0.38)) * 18}px)`;
  photo.querySelector('img').style.transform = `scale(${1.04 + 0.06 * R.seg(t, 0.28, 0.5)})`;
}

// Chapter 5 — The dome & the lake (real). Swing south from the bunk-cabin row to the geodesic glamping dome on the
// field by the private lake, settle on it, and show a real photo from inside the dome (a framed photo, not a pano:
// the Lake & Field 360° could not be registered convincingly, see models/notes/ch05.md).
import { makeBuildings } from '../objects.js';

import { lakeMirror } from '../mirror.js';
export const meta = { id: 'ch05', title: 'The dome & the lake', seconds: 22, animated: true };

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
    // (i8: 316–322 looked at the dome's BACK — its door, steps and deck face NE) from the door side, looking SW
    [0.00, DX, DY, gA(DX, DY) + 2, 60, 300, -30, 45],   // back on the panoramic-window + chair side (Mike 10-30)
    [0.30, DX, DY, gA(DX, DY) + 1.6, 18, 316, -11, 45],
    [0.54, DX, DY, gA(DX, DY) + 1.6, 16, 322, -10, 45],   // held until the inside photo has gone
    // one eased pull-back and rise along the arrival line until the camera hangs over the lake, the water in the
    // foreground and the dome beyond it (i3: no second leg, no drift, no big turn; i4: the planned lake-shore zome
    // rows are behind the camera here, not filling a 'here today' frame), then a hold
    // (i7: the old end hung over the lake looking away from it) a short rise to a frame with the lake in the middle
    // distance and the dome beside it, from the lake's south-east shore; then held
    // (i8) then a short rise and a 60° turn left to look south past the dome to the lake: dome in front, water beyond
    // (i10: the old end had the dome behind the camera) one slow orbit round the dome, from its door side to its far side,
    // until the lake sits beyond it
    // Mike 11-02 (frame ~2900): the old swoop went behind trees. One straight rise on the dome's far side: the dome below, the whole lake beyond it
    [0.82, -108, -176, gA(-108, -176), 118, 122, -27, 44],
    [1.00, -106, -178, gA(-106, -178), 112, 122, -27, 44],
  ]);

  // the end frame's near trees, off the lens (i13: trunks filled the right third)
  if (!ctx.MOBILE) lakeMirror(ctx, ctx.L.lakes[0].c[0][0]);
  ctx.clearTreesNear([[-208, -113], [-192, -122], [-176, -130], [-160, -138]].map(([x, y]) => new ctx.THREE.Vector3(x, 0, -y)), 5);   // the sight line over the dome to the lake
  ctx.clearTreesNear([0, 12, 24, 36, 48].map(d => { const x = DX - 73 + 0.83 * d + 12, y = DY + 50 - 0.56 * d - 12; return new ctx.THREE.Vector3(x, gA(x, y) + 5, -y); }), 6);   // (grid review 11-01: 24 m took out the creek line Mike wants)
  // dandelions round the deck (Dome/PXL_20240518_203625592, Dome1)
  {
    const { THREE } = ctx; let sd = 3; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647, dm = new THREE.Object3D();
    const flower = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.07, 0), new THREE.MeshBasicMaterial({ color: 0xf2cf30 }), 700);
    const spot = () => { for (;;) { const a = rnd() * 6.283, r = 7.5 + 26 * Math.sqrt(rnd()), x = DX + Math.cos(a) * r, y = DY + Math.sin(a) * r; if (r > 8) return [x, y]; } };
    for (let i = 0; i < 700; i++) { const [x, y] = spot(); dm.position.set(x, gA(x, y) + 0.34, -y); dm.scale.setScalar(1); dm.rotation.set(0, 0, 0); dm.updateMatrix(); flower.setMatrixAt(i, dm.matrix); }
    flower.frustumCulled = false; ctx.scene.add(flower);
  }
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
    'position:absolute;left:max(16px,5vw);top:max(16px,10vh);width:min(33vw,460px);opacity:0;will-change:opacity,transform');   // top-left: clear of the dome (i3)
  ctx.hud.appendChild(photo);
  await new Promise(r => { const i = photo.querySelector('img'); if (i.complete) r(); else { i.onload = r; i.onerror = r; } });
}

export function update(t, ctx) {
  const { rig: R, U } = ctx;
  ctx.blocks.visible = false; myBlocks.visible = false;
  rig.apply(ctx.camera, t);
  U.uWaterAmt.value = 1;   // (i7: turning it down drained the lake into a brown pit; the creek is the class map now)
  ctx.labels.update(0, 0, ctx.shown, ctx.camera);
  ctx.planned.update(0, 1, 1, false);
  if (vignette) vignette.style.opacity = 0.5;   // warm-dark edges: the brand mood over the real land
  cap.style.opacity = R.seg(t, 0.08, 0.2) - R.seg(t, 0.28, 0.32) + R.seg(t, 0.8, 0.84);   // (i9: back sooner — 3 s with nothing on screen)   // on the arrival, off for the inside photo, back on the final hold
  cap.style.transform = `translateY(${(1 - R.seg(t, 0.08, 0.24)) * 14}px)`;
  const p = R.seg(t, 0.45, 0.48) - R.seg(t, 0.51, 0.54);   // inside the dome, while the camera is at its door (~2 s opaque; i7: 1.5 s was too short)
  photo.style.opacity = p;
  photo.style.transform = `translateY(${(1 - R.seg(t, 0.44, 0.5)) * 18}px)`;
  photo.querySelector('img').style.transform = `scale(${1.04 + 0.06 * R.seg(t, 0.28, 0.5)})`;
}

// Chapter 6 — The gazebo: the heart. A low flight west across the golf / disc-golf fairways, past the real
// permaculture garden and Top House, to the 120-person event gazebo. A framed real photo shows the inside today;
// then a co-working café is drawn into it as amber linework — clearly a CONCEPT (the café does not exist yet).
import { panoStop } from '../panostop.js';

export const meta = { id: 'ch06', title: 'The gazebo: the heart', seconds: 13, animated: true };

let rig, cap, capCafe, tag, photo, cafe, pano, tables = [], cafeMats = [];

function el(html, css) { const d = document.createElement('div'); d.innerHTML = html; if (css) d.style.cssText = css; return d; }

export async function setup(ctx) {
  const { THREE, rig: R, heightAt } = ctx;
  const gz = await ctx.placeModel('gazebo');
  tables = []; gz.traverse(o => { if (o.name === 'picnic_table') tables.push(o); });   // cleared away as the café draws in
  await ctx.placeModel('top_house');
  ctx.blocks.visible = false;
  const G = { x: -597, y: -226, rotY: 0.6615 }, h = heightAt(G.x, G.y); // where the drone survey shows it (engine.js PLACE)

  // ---- café concept: counter, long tables with benches, pendant lights — amber edges over a faint glassy fill ----
  cafe = new THREE.Group(); cafe.position.set(G.x, h + 0.25, -G.y); cafe.rotation.y = G.rotY;
  const amber = new THREE.Color('#EA824E');
  const add = (w, hh, d, x, y, z) => {
    const geo = new THREE.BoxGeometry(w, hh, d);
    const fill = new THREE.MeshBasicMaterial({ color: amber, transparent: true, opacity: 0, depthWrite: false });
    const edge = new THREE.LineBasicMaterial({ color: amber, transparent: true, opacity: 0 });
    const m = new THREE.Mesh(geo, fill), e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge);
    const o = new THREE.Group(); o.position.set(x, y + hh / 2, z); o.add(m, e); cafe.add(o);
    fill.userData.k = 0.32; edge.userData.k = 1; cafeMats.push(fill, edge);   // a fuller amber body so the café reads on the grey floor
  };
  add(5.2, 1.1, 0.9, 0, 0, -4.6);                       // coffee counter at the back
  add(1.6, 1.9, 0.6, 2.9, 0, -5.2);                     // espresso / shelving
  for (const z of [-1.6, 0.6, 2.8]) for (const x of [-3, 3]) {
    add(2.6, 0.75, 0.9, x, 0, z);                       // long work tables
    add(2.6, 0.45, 0.32, x, 0, z - 0.75); add(2.6, 0.45, 0.32, x, 0, z + 0.75); // benches
  }
  for (const x of [-3, 0, 3]) add(0.5, 0.35, 0.5, x, 2.55, 0.6);   // pendant lamps
  ctx.scene.add(cafe);

  // [t, east, north, height, frameH, heading°, pitch°, fov°]
  // in over the fairways to the open side (faces SE), into the real 360° photo taken inside, a slow look around,
  // then back out under the eave where the café concept draws into the 3D gazebo
  pano = await panoStop(ctx, 'gazebo');
  rig = R.makeRig([
    [0.00, -540, -205, h + 10, 90, 250, -22, 45],
    [0.30, G.x, G.y, h + 3, 26, 318, -14, 45],
    pano.key(0.40, 296, -10),
    pano.key(0.43, 300, -10),
    pano.key(0.61, 362, -8),    // a real look around (~60°), level horizon
    // out under the eave while the photo still covers the screen (it sits at infinity), then it fades: never inside the beams
    [0.66, G.x, G.y, h + 2, 13, 366, -9, 45],
    [1.00, G.x, G.y, h + 1.8, 9, 370, -6, 45],   // a slow push in under the eave while the café draws
  ]);

  const mark = h => ctx.markImg(h);
  cap = el('<div class="eyebrow">The heart · here today</div><h1>The 120-person gazebo</h1>' +
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
  cap.style.opacity = s(t, 0.3, 0.38) - s(t, 0.58, 0.64);   // after the blend; gone before the photo dissolves out
  cap.style.transform = `translateY(${(1 - s(t, 0.08, 0.2)) * 14}px)`;
  pano.set(s(t, 0.34, 0.42) * (1 - s(t, 0.67, 0.76)));   // the real inside (replaces the old framed photo)
  photo.style.opacity = 0;
  const draw = s(t, 0.68, 0.88);           // café draws in, piece by piece
  cafe.children.forEach((o, i) => {
    const k = s(draw, i / cafe.children.length * 0.7, i / cafe.children.length * 0.7 + 0.3);
    o.scale.set(1, Math.max(k, 0.001), 1);
    o.children.forEach(c => { c.material.opacity = c.material.userData.k * k; });
  });
  cafe.visible = draw > 0.001;
  // today's picnic tables are taken away while the real photo still covers the screen (scaling them read as debris)
  tables.forEach(o => { o.visible = t < 0.69; });
  capCafe.style.opacity = s(t, 0.74, 0.84);
  capCafe.style.transform = `translateY(${(1 - s(t, 0.74, 0.86)) * 14}px)`;
  tag.style.opacity = s(t, 0.7, 0.78);   // with the first amber lines, not before
}

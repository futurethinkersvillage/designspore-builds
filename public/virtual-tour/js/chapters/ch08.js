// Chapter 8 — Frontier hands, AI-native minds. In to the planned Maker Space, a hold on the building, then through the
// open door and round the inside: CNC, lasers, the 3D-printer wall, the woodshop, the tool wall, the coworking tables.

export const meta = { id: 'ch08', title: 'Frontier hands, AI-native minds', seconds: 28, animated: false };

let rig, capPlan, capIn, tag, maker, outline, stations = [];

export async function setup(ctx) {
  const { THREE, rig: R, heightAt, L } = ctx;
  ctx.blocks.visible = false;
  ctx.clearTreesNear([[-36, 280], [-34, 295], [-33, 262], [-30, 250]].map(([x, y]) => new THREE.Vector3(x, 0, -y)), 14);   // the lead-in (i18: blurred spruce across the opening)
  maker = await ctx.placeModel('maker_space');
  // amber footprint the concept rises out of
  const f = L.maker_space[0], ring = (f.t === 'Polygon' ? f.c : f.c[0])[0];
  const pts = ring.map(p => new THREE.Vector3(p[0], heightAt(p[0], p[1]) + 0.6, -p[1]));
  outline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#EA824E', transparent: true, depthTest: false }));
  outline.renderOrder = 20; ctx.scene.add(outline);

  const ms = [-32.5, 320], hm = heightAt(ms[0], ms[1]), floor = hm + 0.2, eye = floor + 1.7;
  // [t, east, north, height, frameH, heading°, pitch°, fov°] (frameH 0 = the camera exactly there)
  // (Mike 10-30: the 'work-stays' shop stop is gone; "have the camera pan around the inside of the building") in to the
  // doors, a hold on the building, through the open west door, then one slow walk up the middle, panning right round:
  // the CNC + lasers, the printer wall, the woodshop, the tool wall, back to the coworking tables. (seconds / 24)
  rig = R.makeRig([
    [0.00, ms[0] - 4, ms[1] - 40, hm + 14, 60, 0, -18, 45],
    [0.16, ms[0] - 3, ms[1], hm + 4, 34, -4, -10, 45],
    [0.30, ms[0] - 0.4, ms[1] - 37.9, hm + 10.7, 0, -4, -10, 45],    // hold: the first line reads (~3.9 s); the same camera, held as a position so the walk in is one straight line (i18: shrink, then jump)
    [0.44, ms[0] - 3.4, ms[1] - 12.5, eye, 0, -15, -3, 62],  // in through the open door, the CNC + lasers either side
    [0.49, ms[0] - 1.6, ms[1] - 10, eye + 0.3, 0, -38, -5, 62],   // round the CNC, not through its gantry (i17)
    [0.55, ms[0] - 2.6, ms[1] - 7, eye, 0, -62, -4, 62],     // left to the 3D-printer wall…
    // …then one sweep, always clockwise, round the room
    [0.66, ms[0] - 3.4, ms[1] - 1, eye, 0, -20, -4, 62],   // the woodshop
    [0.75, ms[0] - 3.2, ms[1] + 2, eye, 0, 15, -3, 62],    // the plans on the back wall
    [0.83, ms[0] - 3, ms[1] + 3, eye, 0, 85, -3, 62],     // the tool wall, the mitre station, the lumber
    [0.90, ms[0] - 3, ms[1] + 3, eye, 0, 150, -4, 62],    // round to the coworking tables and the glass doors
    [1.00, ms[0] - 3, ms[1] + 3, eye, 0, 152, -4, 62],    // hold: the last line reads
  ]);

  const mk = (eyebrow, h1) => {
    const c = document.createElement('div'); c.className = 'cap';
    c.innerHTML = `<div class="eyebrow">${eyebrow}</div><h1>${h1}</h1>`;
    c.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
    ctx.hud.appendChild(c); return c;
  };
  capPlan = mk('Planned · the Maker Space', 'Frontier hands,<br>AI-native minds.');
  // a short line for each station on the walk (i12: 15 s of unlabelled machines)
  stations = [['CNC, lasers, 3D printers', 0.45, 0.62], ['Woodshop, robots, tools', 0.65, 0.85]].map(([text, a, b]) => {
    const c = mk('Inside the Maker Space', `<span style="font-size:clamp(24px,3vw,40px);white-space:nowrap">${text}</span>`); return { c, a, b };
  });
  capIn = mk('Inside the Maker Space', '<span style="white-space:nowrap">Wood, code and robots</span><br>under one roof.');
  tag = document.createElement('div');
  tag.style.cssText = 'position:absolute;right:max(16px,3vw);top:max(16px,3vh);font:600 11px/1 Inter,sans-serif;letter-spacing:.18em;color:#EA824E;border:1px solid #EA824E;padding:7px 10px;border-radius:2px;background:rgba(26,23,32,.55);opacity:0';
  tag.textContent = 'PLANNED'; tag.style.display = 'none'; ctx.hud.appendChild(tag);
  const sub = document.createElement('div');
  sub.style.cssText = 'margin-top:12px;font:400 17px/1.45 Inter,sans-serif;opacity:.9;max-width:34ch';
  sub.textContent = 'CNC, laser and 3D printing, open-source robots: build in the real world, and work fluently with AI.';
  capPlan.appendChild(sub);
}

export function update(t, ctx) {
  const { seg } = ctx.rig;
  rig.apply(ctx.camera, t);
  ctx.U.uWaterAmt.value = 0.35; // up close the atlas creek line sits off the real creek: keep it a hint
  // the maker space is part of the persistent world (concept look); it no longer pops up here
  outline.visible = false;   // no concept outline: planned things render as real buildings (Mike 10-28; cut 11 review)
  capPlan.style.opacity = seg(t, 0.16, 0.19) - seg(t, 0.28, 0.305);   // on the hold outside, gone before the move
  capPlan.style.transform = `translateY(${(1 - seg(t, 0.16, 0.21)) * 14}px)`;
  for (const k of stations) k.c.style.opacity = seg(t, k.a, k.a + 0.015) * (1 - seg(t, k.b - 0.015, k.b));
  capIn.style.opacity = seg(t, 0.895, 0.92);                           // on the last sweep inside, when it settles
  capIn.style.transform = `translateY(${(1 - seg(t, 0.895, 0.94)) * 14}px)`;
  tag.style.opacity = seg(t, 0.52, 0.6);
}

// Chapter 8 — Frontier hands, AI-native minds. First the small makerspace that exists today (the Shop / Wood Shop
// cluster), then a flight north to the planned Maker Space site, where the concept building rises out of its
// amber footprint with warm light and the kit showing through the open doors.
import { makeStatCard } from './ch03.js';

export const meta = { id: 'ch08', title: 'Frontier hands, AI-native minds', seconds: 13, animated: false };

let rig, capToday, capPlan, tag, maker, outline, shopCard;

export async function setup(ctx) {
  const { THREE, rig: R, heightAt, L } = ctx;
  ctx.blocks.visible = false;
  maker = await ctx.placeModel('maker_space');
  // amber footprint the concept rises out of
  const f = L.maker_space[0], ring = (f.t === 'Polygon' ? f.c : f.c[0])[0];
  const pts = ring.map(p => new THREE.Vector3(p[0], heightAt(p[0], p[1]) + 0.6, -p[1]));
  outline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#EA824E', transparent: true, depthTest: false }));
  outline.renderOrder = 20; ctx.scene.add(outline);

  const shop = [-45, -29];   // the real workshop (-42.5,-11.5) + shop (-48,-48) on the drone photo (the plan's spot was ~20 m off)
  const ms = [-32.5, 320], hs = heightAt(shop[0], shop[1]), hm = heightAt(ms[0], ms[1]);
  // [t, east, north, height, frameH, heading°, pitch°, fov°]
  // today's shop, then north over the creek to the planned Maker Space, ending at its open doors (they face south)
  rig = R.makeRig([
    // (the film's blend covers t < 0.3, so the shop is held just after it)
    // looking WSW at the shop: the creekside zome rows are behind the camera, so 'today' shows only what exists
    [0.00, shop[0], shop[1], hs + 3, 52, 250, -26, 45],
    [0.30, shop[0], shop[1], hs + 3, 46, 248, -24, 45],
    [0.44, shop[0], shop[1], hs + 3, 42, 246, -22, 45],
    [0.58, -47, 145, heightAt(-47, 145), 150, 330, -34, 45],   // up over the canopy (the low pass brushed huge near trees)
    [0.74, ms[0], ms[1], hm + 3, 56, 0, -22, 45],
    [1.00, ms[0] - 9, ms[1], hm + 2.5, 19, 0, -9, 45],   // building right of centre, clear of the caption
  ]);

  shopCard = makeStatCard(ctx, { at: [-44, -26], big: '', small: 'Today · the shop', heading: 248, lift: 3 });
  const mk = (eyebrow, h1) => {
    const c = document.createElement('div'); c.className = 'cap';
    c.innerHTML = `<div class="eyebrow">${eyebrow}</div><h1>${h1}</h1>`;
    c.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
    ctx.hud.appendChild(c); return c;
  };
  capToday = mk('Today · the shop', 'Where work-stays<br>build and fix things.');
  capPlan = mk('Planned · the Maker Space', 'Frontier hands,<br>AI-native minds.');
  tag = document.createElement('div');
  tag.style.cssText = 'position:absolute;right:max(16px,3vw);top:max(16px,3vh);font:600 11px/1 Inter,sans-serif;letter-spacing:.18em;color:#EA824E;border:1px solid #EA824E;padding:7px 10px;border-radius:2px;background:rgba(26,23,32,.55);opacity:0';
  tag.textContent = 'PLANNED'; tag.style.display = 'none'; ctx.hud.appendChild(tag);
  const sub = document.createElement('div');
  sub.style.cssText = 'margin-top:12px;font:400 15px/1.45 Inter,sans-serif;opacity:.9;max-width:34ch';
  sub.textContent = 'CNC, laser and 3D printing, open-source robots: build in the real world, and work fluently with AI.';
  capPlan.appendChild(sub);
}

export function update(t, ctx) {
  const { seg } = ctx.rig;
  rig.apply(ctx.camera, t);
  ctx.U.uWaterAmt.value = 0.35; // up close the atlas creek line sits off the real creek: keep it a hint
  // the maker space is part of the persistent world (concept look); it no longer pops up here
  outline.material.opacity = seg(t, 0.5, 0.6) * (1 - 0.6 * seg(t, 0.8, 0.9));
  shopCard.update(seg(t, 0.28, 0.36) * (1 - seg(t, 0.46, 0.52)), ctx.camera, 0.14);
  capToday.style.opacity = seg(t, 0.3, 0.36) - seg(t, 0.56, 0.62);
  capToday.style.transform = `translateY(${(1 - seg(t, 0.3, 0.38)) * 14}px)`;
  capPlan.style.opacity = seg(t, 0.6, 0.68);   // swaps up high over the canopy, not over the dark trees
  capPlan.style.transform = `translateY(${(1 - seg(t, 0.6, 0.72)) * 14}px)`;
  tag.style.opacity = seg(t, 0.52, 0.6);
}

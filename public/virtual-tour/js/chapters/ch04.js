// Chapter 4 — "Creek, sauna & forest school": a low glide north along Hemp Creek, from the row of bunk cabins past
// the cedar barrel sauna, up the creek to the forest-school playground by the campground. Everything here exists.
import { campWorld, makeStatCard } from './ch03.js';
import { panoStop } from '../panostop.js';

export const meta = { id: 'ch04', title: 'Creek, sauna & forest school', seconds: 13, animated: true };

let rig, cap, capCreek, blocks2, forest, cards, pano;
export async function setup(ctx) {
  const { rig: R, heightAt } = ctx;
  ({ blocks2, forest } = await campWorld(ctx));
  const g = (x, y, up = 0) => [x, y, heightAt(x, y) + up];
  const cab = g(-118, -102), sau = g(-104, -60), crk = g(-78, -5), fs = g(-65, 118);
  // cabins (doors face NE) -> right up to the sauna's porch (door faces NW, the creek) -> up the creek to forest school
  const gA = ctx.groundAt;
  // cabins -> down to the sauna and into the real 360° photo taken at its door -> turn to the creek and footbridge ->
  // the photo dissolves back and the camera rises up the creek to forest school
  pano = await panoStop(ctx, 'sauna');
  rig = R.makeRig([
    [0.00, -119, -100, gA(-119, -100) + 2, 42, 229, -18, 45],
    [0.28, -94.3, -61.3, gA(-94.3, -61.3) + 1.2, 16, 106, -12, 52],
    pano.key(0.40, 106, -6),
    pano.key(0.47, 104, -6),
    pano.key(0.70, 8, -3),
    [1.00, -82, 129, gA(-82, 129) + 2, 40, 340, -26, 45],   // the real forest-school playground (trampoline, fort), by the office
  ]);
  cards = [
    makeStatCard(ctx, { at: [-117, -100], big: '3', small: 'Bunk cabins', heading: 326, lift: 18 }),
    makeStatCard(ctx, { at: [-104.8, -59.2], big: '', small: 'Cedar sauna', heading: 342, lift: 14 }),
    makeStatCard(ctx, { at: [-78, 126], big: '', small: 'Forest school', heading: 350, lift: 3 }),   // low: seen from above, never mirrored
  ];
  // during the photo: name what we're looking at
  capCreek = document.createElement('div'); capCreek.className = 'cap';
  capCreek.innerHTML = '<div class="eyebrow">Creek, sauna &amp; forest school</div>' +
    '<h1 style="font-size:clamp(32px,4.6vw,60px);line-height:1.04">A cedar sauna<br>on Hemp Creek.</h1>';
  capCreek.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(capCreek);
  cap = document.createElement('div'); cap.className = 'cap';
  cap.innerHTML = '<div class="eyebrow">Creek, sauna &amp; forest school</div>' +
    '<h1 style="font-size:clamp(32px,4.6vw,60px);line-height:1.04">Kids’ forest school ran its<br>first summer in 2026.</h1>';   // (the work-stay line didn't fit this scene)
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap);
}

export function update(t, ctx) {
  const s = ctx.rig.seg;
  ctx.blocks.visible = false; blocks2.visible = false; ctx.trees.visible = true; forest.visible = false; // one forest for the whole film (no swapping)
  ctx.U.uWaterAmt.value = 0.25;   // the atlas creek line sits a few metres off the real one: keep it a hint
  rig.apply(ctx.camera, t);
  // the photo fades while the camera already climbs out (it sits at infinity, so the climb doesn't shift it)
  pano.set(s(t, 0.36, 0.45) * (1 - s(t, 0.71, 0.81)));
  cards[0].update(s(t, 0.0, 0.14) * (1 - s(t, 0.2, 0.28)), ctx.camera, 0.15);
  cards[1].update(0, ctx.camera, 0.12);   // the photo's own tag names the sauna
  cards[2].update(s(t, 0.7, 0.86), ctx.camera, 0.12);
  capCreek.style.opacity = s(t, 0.34, 0.42) - s(t, 0.68, 0.74);
  capCreek.style.transform = `translateY(${(1 - s(t, 0.34, 0.46)) * 14}px)`;
  cap.style.opacity = s(t, 0.74, 0.84);   // the forest-school line arrives with the playground
  cap.style.transform = `translateY(${(1 - s(t, 0.74, 0.86)) * 14}px)`;
}

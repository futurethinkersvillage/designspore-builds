// Chapter 4 — "Creek, sauna & forest school": a low glide north along Hemp Creek, from the row of bunk cabins past
// the cedar barrel sauna, up the creek to the forest-school playground by the campground. Everything here exists.
import { campWorld, makeStatCard } from './ch03.js';
import { panoStop } from '../panostop.js';

export const meta = { id: 'ch04', title: 'Creek, sauna & forest school', seconds: 25, animated: true, blend: 0.2 };   // the camera lands on the photo's spot (0.216) before it fades in (0.224) (Mike 10-31, frame 1767)

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
    [0.00, -105.4, -86, gA(-105.4, -86) + 2, 42, 57, -30, 45],   // already facing the sauna (NE): no swing round   // over the bunk cabins where Mike placed them, above the crowns (cut 11)
    [0.168, -81.45, -45.06, gA(-81.45, -45.06) + 1.2, 16, 123.3, -12, 52],   // the sauna where Mike placed it (10-29)
    // 360 rule (Mike 10-29: transitions while the camera moves are jarring): arrive and STOP on the photo spot, fade
    // the photo in while still, turn slowly, stop, fade it out while still, and only then move on
    pano.key(0.216, 123.3, -6),
    pano.key(0.34, 123.3, -6),    // still: the photo fades in, then the caption reads
    // (Mike 10-30: "360 photos should pan more … probably 180") a slow 180° pan LEFT, ~22°/s: from the sauna past the
    // red chairs and the bridge, then west down the creek (i7: the caption says "on Hemp Creek")
    pano.key(0.66, -56.7, -6),
    pano.key(0.712, -56.7, -6),   // still: the photo fades out
    // then ONE straight move north up the creek to the playground, turning only 60° (i3: a sideways sweep past the
    // domes and an empty fairway), and a hold there
    [0.80, -84, 40, gA(-84, 40) + 6, 30, -24, -14, 45],   // one level arc, no hop up and down (i15)   // (i8) up off the creek at once, not skimming the water
    [0.88, -80, 133, gA(-80, 133) + 1, 16, 25, -12, 45],   // (i12) low, looking across the fort at the trampoline     // the real forest-school playground (trampoline, fort), by the office
    [1.00, -80, 133, gA(-80, 133) + 1, 15, 25, -12, 45],     // hold while the forest-school line reads
  ]);
  cards = [
    makeStatCard(ctx, { at: [-101, -81], big: '3', small: 'Bunk cabins', heading: 42, lift: 4 }),   // (i7: it sat behind the lens)
    makeStatCard(ctx, { at: [-81.45, -45.06], big: '', small: 'Cedar sauna', heading: 342, lift: 14 }),
    makeStatCard(ctx, { at: [-76, 128], big: '', small: 'Forest school', heading: 30, lift: 2.5 }),   // low: seen from above, never mirrored
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
  pano.set(s(t, 0.224, 0.27) * (1 - s(t, 0.67, 0.71)));
  cards[0].update(0, ctx.camera, 0.15);   // (i15: skewed and unreadable)
  cards[1].update(0, ctx.camera, 0.12);   // the photo's own tag names the sauna
  cards[2].update(0, ctx.camera, 0.12);   // (i13: the caption names it; the card only cluttered the frame)
  capCreek.style.opacity = s(t, 0.24, 0.255) - s(t, 0.335, 0.35);   // read on the still photo (~2 s)
  capCreek.style.transform = `translateY(${(1 - s(t, 0.24, 0.29)) * 14}px)`;
  cap.style.opacity = s(t, 0.86, 0.89);   // (i9: ~3.5 s now)   // the forest-school line arrives as the camera settles on the playground
  cap.style.transform = `translateY(${(1 - s(t, 0.84, 0.9)) * 14}px)`;
}

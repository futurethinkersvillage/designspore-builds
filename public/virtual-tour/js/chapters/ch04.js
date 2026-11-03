// Chapter 4: the cedar sauna on Hemp Creek, then the three bunk cabins. Everything here exists. (Mike 11-02: the sauna 360 is out of the film; the file stays for reference.)
import { campWorld } from './ch03.js';
export const meta = { id: 'ch04', title: 'Sauna & cabins', seconds: 22, animated: true, blend: 0.16, blendTurn: true };
let rig, capH, capS, capC, blocks2, forest;
const makeCap = (ctx, eyebrow, html) => { const c = document.createElement('div'); c.className = 'cap'; c.innerHTML = `<div class="eyebrow">${eyebrow}</div><h1 style="font-size:clamp(32px,4.6vw,60px);line-height:1.04">${html}</h1>`; c.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40)); ctx.hud.appendChild(c); return c; };
export async function setup(ctx) {
  const { rig: R } = ctx, gA = ctx.groundAt;
  ({ blocks2, forest } = await campWorld(ctx));
  const S = [-81.5, -45.1], C = [-105.4, -86], RP = [-60, 58];   // the sauna barrel and the middle cabin as the scene places them (the row: -88,-62.5 / -105,-86 / -130,-118)
  ctx.clearTreesNear([0, 10, 20, 30].map(d => new ctx.THREE.Vector3(RP[0] - Math.sin(92 * Math.PI / 180) * d, 0, -(RP[1] - Math.cos(92 * Math.PI / 180) * d))), 11);   // nothing stands between the lens and the creek in the footage
  // keep the cabin row and the sauna's creek view clear of trunks
  const sight = (from, to) => ctx.clearTreesNear(Array.from({ length: 12 }, (_, i) => { const u = (i + 1) / 13; return new ctx.THREE.Vector3(from[0] + (to[0] - from[0]) * u, 0, -(from[1] + (to[1] - from[1]) * u)); }), 6);
  for (const cab of [[-88.2, -62.5], [-105.4, -86], [-129.9, -117.8]]) sight([-62, -119], cab);   // camera spot for the row
  sight([-64, -55], [-81.5, -45.1]); sight([-81.5, -45.1], [-98, -36]);   // to the barrel, and past it to the water
  rig = R.makeRig([
    // the drone's own view of the rapids (video 0:48): the camera arrives and stops, the footage dissolves in and out over the hold (js/clips.js)
    [0.00, RP[0], RP[1], gA(...RP), 24, 92, -38, 46],
    [0.17, RP[0], RP[1], gA(...RP), 24, 92, -38, 46],
    [0.34, RP[0], RP[1], gA(...RP), 24, 92, -38, 46],
    // r1103: one rising arc, no dive or whip; the sauna seen from the land side with Hemp Creek behind the barrel
    [0.48, -85, -5, gA(-85, -5) + 2, 52, 190, -34, 46],   // over the crowns (trees on the path itself are cleared below)
    [0.62, S[0], S[1], gA(...S) + 1.2, 18, 298, -12, 48],   // from the south-east, looking over the barrel to the creek; the nearest cabin stays out of frame on the left
    [0.75, S[0], S[1], gA(...S) + 1.2, 16, 300, -11, 48],   // hold on the sauna
    // the three cabins broadside from the meadow, all in one frame (Cabins/3 cabins.jpg); the row runs SW
    [0.86, C[0], C[1], gA(...C) + 2, 52, 307, -21, 46],
    [1.00, C[0], C[1], gA(...C) + 2, 50, 307, -20, 46],
  ]);
  ctx.clearTreesNear(Array.from({ length: 13 }, (_, i) => rig.at(0.5 + i * 0.01).pos), 10);   // the descent to the sauna passed through a crown
  capH = makeCap(ctx, 'Hemp Creek', 'The creek runs<br>past the campsites.');
  capS = makeCap(ctx, 'Sauna', 'A cedar sauna<br>on Hemp Creek.');
  capC = makeCap(ctx, 'Bunk cabins', 'Three bunk cabins,<br>booked all season.');
}
export function update(t, ctx) {
  const s = ctx.rig.seg;
  ctx.blocks.visible = false; blocks2.visible = false; ctx.trees.visible = true; forest.visible = false;
  ctx.U.uWaterAmt.value = 0.25;
  rig.apply(ctx.camera, t);
  capH.style.opacity = s(t, 0.2, 0.23) - s(t, 0.33, 0.36);
  capS.style.opacity = s(t, 0.62, 0.65) - s(t, 0.76, 0.79);
  capC.style.opacity = s(t, 0.85, 0.88);   // ~2.6 s on the held row
}

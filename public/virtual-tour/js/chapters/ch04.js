// Chapter 4: the cedar sauna on Hemp Creek, then the three bunk cabins. Everything here exists. (Mike 11-02: the sauna 360 is out of the film; the file stays for reference.)
import { campWorld } from './ch03.js';
export const meta = { id: 'ch04', title: 'Sauna & cabins', seconds: 22, animated: true, blend: 0.16, blendTurn: true };
let rig, capS, capC, blocks2, forest;
const makeCap = (ctx, eyebrow, html) => { const c = document.createElement('div'); c.className = 'cap'; c.innerHTML = `<div class="eyebrow">${eyebrow}</div><h1 style="font-size:clamp(32px,4.6vw,60px);line-height:1.04">${html}</h1>`; c.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40)); ctx.hud.appendChild(c); return c; };
export async function setup(ctx) {
  const { rig: R } = ctx, gA = ctx.groundAt;
  ({ blocks2, forest } = await campWorld(ctx));
  const S = [-81.45, -45.06], C = [-105.4, -86], RP = [-60, 58];
  ctx.clearTreesNear([0, 10, 20, 30].map(d => new ctx.THREE.Vector3(RP[0] - Math.sin(92 * Math.PI / 180) * d, 0, -(RP[1] - Math.cos(92 * Math.PI / 180) * d))), 11);   // nothing stands between the lens and the creek in the footage
  rig = R.makeRig([
    // the drone's own view of the rapids (video 0:48): the camera arrives and stops, the footage dissolves in and out over the hold (js/clips.js)
    [0.00, RP[0], RP[1], gA(...RP), 24, 92, -38, 46],
    [0.17, RP[0], RP[1], gA(...RP), 24, 92, -38, 46],
    [0.48, RP[0], RP[1], gA(...RP), 24, 92, -38, 46],
    [0.62, S[0], S[1], gA(...S) + 1.2, 19, 106, -13, 48],
    [0.76, S[0], S[1], gA(...S) + 1.2, 17, 108, -12, 48],   // hold on the sauna
    [0.90, C[0], C[1], gA(...C) + 2, 34, 222, -20, 46],     // on along the creek to the cabins' doors
    [1.00, C[0], C[1], gA(...C) + 2, 31, 222, -18, 46],
  ]);
  capS = makeCap(ctx, 'Sauna', 'A cedar sauna<br>on Hemp Creek.');
  capC = makeCap(ctx, 'Bunk cabins', 'Three bunk cabins,<br>booked all season.');
}
export function update(t, ctx) {
  const s = ctx.rig.seg;
  ctx.blocks.visible = false; blocks2.visible = false; ctx.trees.visible = true; forest.visible = false;
  ctx.U.uWaterAmt.value = 0.25;
  rig.apply(ctx.camera, t);
  capS.style.opacity = s(t, 0.62, 0.66) - s(t, 0.76, 0.79);
  capC.style.opacity = s(t, 0.91, 0.94);
}

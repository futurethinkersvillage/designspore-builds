// Chapter 12 — The place is here. The camera rises above the lit campus at night, turns straight down and the land
// sinks back into the warm-dark master-plan sheet (chapter 1 in reverse), with the festival lights still glowing on
// the paper. Close: the logo (official artwork), "The place is here.", mike@portal.place.
import * as THREE from 'three';
import * as ch11 from './ch11.js';
import { SQ } from '../sheet.js';

export const meta = { id: 'ch12', title: 'The place is here', seconds: 16, animated: true };

let rig, P, close, shade, TG0, base = [];

export async function setup(ctx) {
  const { rig: R, heightAt } = ctx;
  TG0 = ctx.U.uTideGlow.value.clone();
  await ch11.setup(ctx);            // the same night lights, stage and linework as chapter 11
  P = ch11.parts();
  for (const c of P.caps) c.style.display = 'none';
  for (const g of P.glows) base.push({ y: g.s.position.y, gy: g.s.position.y - (g.kind === 'pool' ? 0 : 0) });
  P.glows.forEach((g, i) => { const p = g.s.position; base[i] = { y: p.y, gy: g.kind === 'pool' ? 0 : heightAt(p.x, -p.z) }; });

  const aspect = innerWidth / innerHeight;
  const sheetFrame = aspect >= 1.2 ? Math.max(1800, 3120 / aspect) * 1.03 : Math.max(1900, 1600 / aspect);
  const shift = sheetFrame * aspect * 0.07, SHX = shift * Math.cos(SQ * Math.PI / 180), SHY = -shift * Math.sin(SQ * Math.PI / 180);   // the plan sits right of the words (i18)
  rig = R.makeRig([
    [0.00, -203, -241, ctx.groundAt(-203, -241) + 7, 38, 245, -8, 50],   // where chapter 11 ends: on the lit stage (heading 314 = -46)
    [0.12, -203, -241, ctx.groundAt(-203, -241) + 7, 60, 250, -24, 48],   // ease up off the stage first, then the long rise (Mike 10-29: back out to frame ~4600)
    // (retimed 10-28: the slow orbit dragged and the closing card held only ~2 s)
    [0.27, -120, -180, ctx.groundAt(-120, -180), 320, 300, -55, 44],   // (i7: 60 m → 1700 m in 3 s lurched) a waypoint on the climb
    // Mike 11-02: it reached its spot, then rotated and moved again in the last 100 frames. Square to the sheet by here, then only the lens changes
    [0.43, -SHX, -SHY, 60, sheetFrame * 0.9, SQ, -88, 38],
    [0.60, -SHX, -SHY, -135, sheetFrame, SQ, -90, 2.5],  // chapter 1's opening frame: long lens, flat sheet, squared to the parcel
    [1.00, -SHX, -SHY, -135, sheetFrame * 1.005, SQ, -90, 2.5],   // still (i15)
  ]);

  close = document.createElement('div');
  // in the sheet's empty west margin, clear of the plan, the scale bar and the title block
  close.style.cssText = 'position:absolute;left:max(16px,10.5vw);top:50%;transform:translateY(-58%);display:grid;justify-items:start;gap:18px;opacity:0;color:#F2EDE8;max-width:calc(100vw - 32px);z-index:1;' +
    'text-shadow:0 1px 14px rgba(26,23,32,.9)';
  close.innerHTML = `${ctx.markImg(78)}<div style="font:500 clamp(40px,5.6vw,80px)/0.98 Cormorant,Georgia,serif">The place<br>is here.</div>` +
    '<div style="font:500 18px/1 Inter,sans-serif;letter-spacing:.14em;color:#EA824E">MIKE@PORTAL.PLACE</div><div style="font:500 16px/1 Inter,sans-serif;letter-spacing:.2em;opacity:.8">PORTAL.PLACE</div>';
  shade = document.createElement('div');   // the words never sit on the plan's linework (i16)
  shade.style.cssText = 'position:absolute;inset:0;background:linear-gradient(90deg,#1A1720 0%,rgba(26,23,32,.9) 26%,rgba(26,23,32,0) 42%);opacity:0;pointer-events:none';
  ctx.hud.appendChild(shade);
  ctx.hud.appendChild(close);
}

export function update(t, ctx) {
  const { U, sky, renderer, colors, rig: { seg } } = ctx;
  ch11.update(1, ctx);              // full night, every light on (captions stay hidden)
  for (const m of ctx.zomeGlass || []) m.emissiveIntensity = 1.6;   // lit windows on the rise (i18: black beads)
  rig.apply(ctx.camera, t);

  // ---- chapter 1 in reverse: real -> drawing, risen -> flat ----
  const back = seg(t, 0.2, 0.52);                       // the tide recedes down the slopes
  U.uFinish.value = 1 - seg(t, 0.2, 0.26);
  U.uTide.value = t < 0.26 ? 2100 - 1400 * seg(t, 0.18, 0.26) : 700 - 740 * Math.pow(seg(t, 0.26, 0.5), 0.6);
  U.uCut.value = t < 0.48 ? 1960 - 1660 * seg(t, 0.26, 0.48) : 300 - 435 * seg(t, 0.48, 0.6);   // a longer settle (the quicker one read as a pop)
  U.uPaperShade.value = 1 - seg(t, 0.4, 0.56);   // shading gone before the paper is fully in
  U.uFurniture.value = seg(t, 0.5, 0.64);   // frame, title block, north arrow ease in (~2 s), no pop
  U.uReveal.value = 1; U.uExag.value = 1;
  // the receding tide keeps a faint edge, not chapter 1's glowing one (it read as burning paper here)
  U.uTideGlow.value.copy(colors.paper);   // no glowing edge on the receding tide (read as burning paper / a stray orange line)
  U.uEdge.value.copy(colors.paper).lerp(new THREE.Color('#EA824E'), 0.25);   // and the tide line itself faint (i8: a thick orange stroke)
  const skyT = 1 - seg(t, 0.24, 0.4);   // the dusk haze is gone before the sheet arrives (brand warm-dark, not mauve)
  sky.mat.uniforms.uOpacity.value = skyT;
  const hz = sky.mat.uniforms.uHorizon.value.clone().lerp(colors.drawHorizon, back);
  U.uFog.value.copy(colors.paper).lerp(hz, skyT); U.uFogDensity.value *= skyT;
  renderer.setClearColor(colors.paper.clone().lerp(hz, skyT));
  P.stars.material.opacity *= 1 - seg(t, 0.15, 0.32);

  // linework, stage and ground pools belong to the 3D land: gone before it flattens. The glows stay, on the paper.
  const keep = 1 - seg(t, 0.2, 0.3);
  for (const [i, l] of P.lines.entries()) l.material.opacity *= i === 2 ? 1 - seg(t, 0.4, 0.5) : keep;   // the trail line stays to track (Mike 10-29, frame 4600)
  for (const m of P.stageMats) m.opacity *= keep;
  for (const c of P.cards) c.m.visible = c.pin.visible = false;
  // the stage stays to the very end (Mike 10-30), riding down with the land as it flattens; its beams fade off the paper
  if (P.stage) { P.stage.position.y = ctx.shown(P.stageGY); const b = 1 - seg(t, 0.3, 0.45); for (const h of P.stage.userData.heads) h.beam.material.opacity *= b; }
  for (const a of P.art) a.o.visible = keep > 0.02;
  if (P.meadow) P.meadow.visible = keep > 0.02;
  if (P.forestFloor) P.forestFloor.visible = keep > 0.02;
  if (P.landingFloor) P.landingFloor.visible = keep > 0.02;
  for (const o of P.landingBits || []) o.visible = keep > 0.02;
  if (P.camp) P.camp.group.visible = t < 0.16;   // gone before the top-down view (i15: game tokens)
  if (P.crowd2) P.crowd2.visible = keep > 0.02;
  if (P.trail2) P.trail2.group.visible = keep > 0.02;
  if (ctx.models.maker_space) ctx.models.maker_space.visible = keep > 0.02;   // (i11: its roof was a black square on the final sheet)
  // a touch of moonlight on the climb so the campus under the lights still reads
  U.uLight.value.lerp(new THREE.Vector3(0.12, 0.115, 0.21), seg(t, 0.05, 0.2) * (1 - seg(t, 0.36, 0.5)));
  const grow = 1 + 0.9 * seg(t, 0.04, 0.26) * (1 - 0.6 * seg(t, 0.32, 0.55));   // glows hold their size on screen as we rise
  P.glows.forEach((g, i) => {
    if (g.size) g.s.scale.setScalar(g.size * grow);
    if (g.kind === 'pool' || g.kind === 'bulb') { g.s.material.opacity *= keep; return; }   // festoon bulbs go with the land; the trail's path lights stay
    const lift = base[i].y - base[i].gy;
    g.s.position.y = ctx.shown(base[i].gy) + lift * (1 - 0.8 * seg(t, 0.42, 0.6));
    if (g.kind === 'beam') g.s.material.opacity *= 1 - seg(t, 0.38, 0.55);
  });
  shade.style.opacity = seg(t, 0.62, 0.7);
  close.style.opacity = seg(t, 0.66, 0.72);   // (i9: ~1.5 s sooner)   // in by ~8.9 s: holds 3 s+
}

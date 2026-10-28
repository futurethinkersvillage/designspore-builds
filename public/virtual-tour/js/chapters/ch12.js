// Chapter 12 — The place is here. The camera rises above the lit campus at night, turns straight down and the land
// sinks back into the warm-dark master-plan sheet (chapter 1 in reverse), with the festival lights still glowing on
// the paper. Close: the logo (official artwork), "The place is here.", mike@portal.place.
import * as THREE from 'three';
import * as ch11 from './ch11.js';

export const meta = { id: 'ch12', title: 'The place is here', seconds: 12, animated: true };

let rig, P, close, TG0, base = [];

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
  rig = R.makeRig([
    [0.00, 40, -290, 70, 1020, 142, -31, 42],    // where chapter 11 ends
    // (retimed 10-28: the slow orbit dragged and the closing card held only ~2 s)
    [0.24, 30, -60, 60, 1700, 8, -84, 38],        // rising to nearly straight down, turning north-up early (a 90° swing late read as disorienting)
    [0.34, 0, 0, 30, sheetFrame * 0.98, 0, -90, 30],
    [0.58, 0, 0, -135, sheetFrame, 0, -90, 2.5],  // chapter 1's opening frame: long lens, flat sheet
    [1.00, 0, 0, -135, sheetFrame * 1.06, 0, -90, 2.5],
  ]);

  close = document.createElement('div');
  // in the sheet's empty west margin, clear of the plan, the scale bar and the title block
  close.style.cssText = 'position:absolute;left:max(16px,6.5vw);top:50%;transform:translateY(-58%);display:grid;justify-items:start;gap:18px;opacity:0;color:#F2EDE8;max-width:calc(100vw - 32px);' +
    'text-shadow:0 1px 14px rgba(26,23,32,.9)';
  close.innerHTML = `${ctx.markImg(78)}<div style="font:500 clamp(40px,5.6vw,80px)/0.98 Cormorant,Georgia,serif">The place<br>is here.</div>` +
    '<div style="font:500 13px/1 Inter,sans-serif;letter-spacing:.24em;color:#EA824E">MIKE@PORTAL.PLACE</div>';
  ctx.hud.appendChild(close);
}

export function update(t, ctx) {
  const { U, sky, renderer, colors, rig: { seg } } = ctx;
  ch11.update(1, ctx);              // full night, every light on (captions stay hidden)
  rig.apply(ctx.camera, t);

  // ---- chapter 1 in reverse: real -> drawing, risen -> flat ----
  const back = seg(t, 0.2, 0.52);                       // the tide recedes down the slopes
  U.uFinish.value = 1 - seg(t, 0.2, 0.26);
  U.uTide.value = t < 0.26 ? 2100 - 1400 * seg(t, 0.18, 0.26) : 700 - 740 * Math.pow(seg(t, 0.26, 0.5), 0.6);
  U.uCut.value = t < 0.48 ? 1960 - 1660 * seg(t, 0.26, 0.48) : 300 - 435 * seg(t, 0.48, 0.6);   // a longer settle (the quicker one read as a pop)
  U.uPaperShade.value = 1 - seg(t, 0.4, 0.56);   // shading gone before the paper is fully in
  U.uFurniture.value = seg(t, 0.54, 0.72);   // frame, title block, north arrow ease in (~2 s), no pop
  U.uReveal.value = 1; U.uExag.value = 1;
  // the receding tide keeps a faint edge, not chapter 1's glowing one (it read as burning paper here)
  U.uTideGlow.value.copy(colors.paper);   // no glowing edge on the receding tide (read as burning paper / a stray orange line)
  const skyT = 1 - seg(t, 0.24, 0.4);   // the dusk haze is gone before the sheet arrives (brand warm-dark, not mauve)
  sky.mat.uniforms.uOpacity.value = skyT;
  const hz = sky.mat.uniforms.uHorizon.value.clone().lerp(colors.drawHorizon, back);
  U.uFog.value.copy(colors.paper).lerp(hz, skyT); U.uFogDensity.value *= skyT;
  renderer.setClearColor(colors.paper.clone().lerp(hz, skyT));
  P.stars.material.opacity *= 1 - seg(t, 0.15, 0.32);

  // linework, stage and ground pools belong to the 3D land: gone before it flattens. The glows stay, on the paper.
  const keep = 1 - seg(t, 0.2, 0.3);
  for (const l of P.lines) l.material.opacity *= keep;
  for (const m of P.stageMats) m.opacity *= keep;
  // a touch of moonlight on the climb so the campus under the lights still reads
  U.uLight.value.lerp(new THREE.Vector3(0.12, 0.115, 0.21), seg(t, 0.05, 0.2) * (1 - seg(t, 0.36, 0.5)));
  const grow = 1 + 0.9 * seg(t, 0.04, 0.26) * (1 - 0.6 * seg(t, 0.32, 0.55));   // glows hold their size on screen as we rise
  P.glows.forEach((g, i) => {
    if (g.size) g.s.scale.setScalar(g.size * grow);
    if (g.kind === 'pool') { g.s.material.opacity *= keep; return; }
    const lift = base[i].y - base[i].gy;
    g.s.position.y = ctx.shown(base[i].gy) + lift * (1 - 0.8 * seg(t, 0.42, 0.6));
    if (g.kind === 'beam') g.s.material.opacity *= 1 - seg(t, 0.38, 0.55);
  });
  close.style.opacity = seg(t, 0.66, 0.74);   // in by ~8.9 s: holds 3 s+
}

// Checkpoint 1 (chapters 1–2) as a timeline over the shared world: the sheet → the land rising → the real land →
// the aerial 360° → Wells Gray Park. apply(p) is a pure function of p (0..1). Used by index.html and film.html.
import { makeRig, seg } from './rig.js';
import { SQ } from './sheet.js';

export function checkpoint1(E, { style, Q, REC, onResize, keys, cp1Seconds = 50 } = {}) {
  const $ = s => document.querySelector(s);
  const { U, camera, renderer, sky, pano, planned, labels, colors, PANO, panoPos } = E;
  const { paper, horizon, skyTop, drawHorizon, drawTop } = colors;

  // ---- camera path: [t, target east, north, height, visible frame height (m), heading°, pitch°, fov°] ----
  const pp = PANO.at, D2R = Math.PI / 180;
  let rig;
  const buildRig = () => {
    const aspect = innerWidth / innerHeight;
    const SHOWER_HEADING = (Math.atan2(-70 - pp[0], 102 - pp[1]) / D2R + 360) % 360, SHOWER_PITCH = -Math.atan2(panoPos.y - E.groundAt(-70, 102), Math.hypot(-70 - pp[0], 102 - pp[1])) / D2R;
    const sheetFrame = aspect >= 1.2 ? Math.max(1800, 3120 / aspect) * 1.03 : Math.max(1900, 1600 / aspect);
    rig = makeRig(keys || [
      // heading SQ (-2.6°): the parcel's long edges run 2.6° off true east–west, so the camera turns to square them
      // with the sheet's frame (Mike 10-29: "the property boundary is off-kilter"); sheet.js turns the frame to match
      [0.00, 0, 0, -135, sheetFrame * 1.12, SQ, -90, 2.5],
      [0.05, 0, 0, -135, sheetFrame, SQ, -90, 2.5],
      [0.17, 0, 0, 30, sheetFrame * 0.98, SQ, -90, 30],
      [0.34, -170, 220, 330, 1900, 12, -16, 44],  // high enough to clear the exaggerated hills, low enough to see the sky
      [0.52, -230, 20, 50, 1300, 338, -30, 46],   // the property itself: golf, lake, campground, planned linework
      [0.61, -220, 10, 50, 1200, 333, -31, 46],   // hold on it while the plan is up
      // arrive above the photo's viewpoint looking straight down at our land, hold while it becomes the photo,
      // then tilt up and pan across Wells Gray Park (north)
      [0.67, pp[0], pp[1], panoPos.y, 2 * 300 * Math.tan(28 * D2R), 345, -82, 56],
      [0.70, pp[0], pp[1], panoPos.y, 0, 345, -82, 56],
      [0.75, pp[0], pp[1], panoPos.y, 0, 345, -82, 56],   // frozen through the dissolve
      [0.86, pp[0], pp[1], panoPos.y, 0, 352, -8, 56],
      [0.965, pp[0], pp[1], panoPos.y, 0, 89, -5, 56],   // (Mike 10-30: pan more) a 97° sweep across the park, ~27°/s, then STOP
      [1.00, pp[0], pp[1], panoPos.y, 0, 89, -5, 56],
      // Mike 11-02: still in the photo, tilt all the way back down until it points at the shower house; only then to 3D
      [1.13, pp[0], pp[1], panoPos.y, 0, SHOWER_HEADING, SHOWER_PITCH, 56],
      [1.21, pp[0], pp[1], panoPos.y, 0, SHOWER_HEADING, SHOWER_PITCH, 56],   // still: the photo fades out here
    ]);
  };
  buildRig();
  addEventListener('resize', () => { buildRig(); onResize?.(); });

  const caps = { place: $('#cap-place'), park: $('#cap-park'), hint: $('#hint'), credit: $('#credit'), title: $('#sheet-title'), vignette: $('#vignette') };

  // the opening map explains itself (Mike 11-02): first what's here, then what's planned, each blinking with a big title, on a held sheet
  const bigT = document.createElement('div');
  bigT.style.cssText = 'position:fixed;left:0;right:0;top:9vh;text-align:center;pointer-events:none;opacity:0;color:#F2EDE8;text-shadow:0 2px 24px rgba(10,8,14,.9)';
  bigT.innerHTML = '<div class="k" style="font:600 clamp(11px,1.3vw,15px)/1 Inter,sans-serif;letter-spacing:.24em;text-transform:uppercase"></div><div class="h" style="font:500 clamp(36px,6.2vw,92px)/1.02 Cormorant,Georgia,serif;margin-top:12px"></div>';
  document.body.appendChild(bigT); caps.big = bigT;
  const HOLD_AT = 1.7, HOLD = 9, TAIL = 7;   // seconds: into the film, the held sheet, the added 360 tilt
  const clock = p => { const s = p * cp1Seconds; return s < HOLD_AT ? s / 34 : s < HOLD_AT + HOLD ? HOLD_AT / 34 : (s - HOLD) / 34; };
  const hold01 = p => Math.max(0, Math.min(1, (p * cp1Seconds - HOLD_AT) / HOLD));
  function apply(p0) {
    const k = hold01(p0), p = clock(p0);
    { const A = seg(k, 0.03, 0.09) * (1 - seg(k, 0.47, 0.52)), B = seg(k, 0.53, 0.59) * (1 - seg(k, 0.93, 0.99)), pulse = 0.5 + 0.5 * Math.cos(k * HOLD * 2 * Math.PI / 1.1);
      U.uMapEx.value = B * 0.85; U.uMapPl.value = A * 0.85;   // the other group steps back
      U.uMapPulse.value = (A + B) * pulse;   // the group being named blinks
      U.uMapPulseWhich.value = B > A ? 1 : 0;
      bigT.style.opacity = Math.max(A, B); bigT.style.display = REC && A + B < 0.01 ? 'none' : '';
      if (A > B) { bigT.querySelector('.k').textContent = 'Existing infrastructure'; bigT.querySelector('.k').style.color = '#F2EDE8'; bigT.querySelector('.h').textContent = 'What we already have'; }
      else { bigT.querySelector('.k').textContent = 'Future development'; bigT.querySelector('.k').style.color = '#EA824E'; bigT.querySelector('.h').textContent = 'What we plan to build'; } }
    // ---- land ----
    // ink / blueprint / night: the land rises as a drawing during the dolly zoom, then turns real.
    // survey: the land turns real as the cut passes it, so it rises later, once the camera has tilted to see it.
    U.uCut.value = style.reveal === 'height'
      ? (p < 0.40 ? -135 + 335 * seg(p, 0.24, 0.40) : 200 + 1760 * seg(p, 0.40, 0.56))
      : (p < 0.22 ? -135 + 435 * seg(p, 0.05, 0.22) : 300 + 1660 * seg(p, 0.22, 0.42)); // the valley, then the mountains as we tilt
    U.uSmooth.value = style.stepped ? seg(p, 0.44, 0.56) : 1;
    U.uTerraceLines.value = style.stepped ? 1 - U.uSmooth.value : 0;
    U.uReveal.value = seg(p, 0.30, 0.56);
    U.uFinish.value = seg(p, 0.50, 0.56);   // everything real before the plan layer arrives
    U.uPaperShade.value = seg(p, 0.08, 0.22);
    U.uFurniture.value = 1 - seg(p, 0.08, 0.16);   // gone before the push-in reaches the frame edge
    U.uPlanOverlay.value = style.plan3d ? 0 : seg(p, 0.40, 0.50); // brand palettes draw the plan in 3D instead (planned.js)
    U.uGrade.value = seg(p, 0.6, 0.72) * (1 - seg(p, 1.05, 1.12));   // back to the chapters' look behind the opaque photo: no pop at the hand-off
    U.uTreeFade.value = 1 - seg(p, 0.725, 0.75) + seg(p, 1.05, 1.12);   // only behind the photo (Mike 11-01, frame 710: all the trees vanished)   // trees seen from straight above read as black discs: gone before the hand-off
    U.uExag.value = 1;   // true heights all the way (Mike 11-02: the mountains shrank at frames 419-532 when this settled)
    U.uTide.value = p < 0.49 ? -40 + 740 * Math.pow(seg(p, 0.28, 0.49), 1.7) : 700 + 1400 * seg(p, 0.49, 0.555); // lingers on the valley floor
    const skyT = seg(p, 0.20, 0.36), realT = U.uFinish.value;
    const hz = drawHorizon.clone().lerp(horizon, realT);
    U.uFog.value.copy(paper).lerp(hz, skyT);
    U.uFogDensity.value = (0.000005 + 0.000007 * realT) * skyT; // lighter while it's a drawing so far ridges keep their shading
    sky.mat.uniforms.uOpacity.value = skyT;
    sky.mat.uniforms.uHorizon.value.copy(hz); sky.mat.uniforms.uTop.value.copy(drawTop).lerp(skyTop, realT);
    U.uSkyTop.value.copy(sky.mat.uniforms.uTop.value);
    U.uTime.value = REC ? p * 45 : performance.now() / 1000; // ripples: clip time when recording, wall time live
    renderer.setClearColor(paper.clone().lerp(hz, skyT));

    rig.apply(camera, p);

    // ---- the 360° photo ----
    let op = 0, iris = -1;
    if (style.pano === 'fade') op = seg(p, 0.685, 0.76);
    else if (style.pano === 'iris') { iris = Math.max(0, 1.3 * seg(p, 0.67, 0.775) - 0.03); op = iris > 0 ? 1 : 0; } // iris < 0 would mean "no mask"
    else op = seg(p, 0.70, 0.75); // dolly: dissolve only once the camera sits exactly where the drone was
    op *= 1 - seg(p, 1.14, 1.20);
    if (Q.has('panoAlpha')) { op = Number(Q.get('panoAlpha')); iris = -1; } // alignment check
    pano.mat.uniforms.uOpacity.value = op; pano.mat.uniforms.uIris.value = iris;
    pano.mat.uniforms.uWarm.value = 1 - seg(p, 0.75, 0.84);
    pano.mesh.visible = op > 0.001;

    // the detailed buildings rise with the real land (never stand on the flat sheet)
    const up = Math.max(seg(p, 0.40, 0.50), 0.001);
    for (const g of Object.values(E.models)) if (g.userData.persistent) { g.visible = up > 0.002; g.children.forEach(o => { o.scale.y = up; }); }

    // callouts step aside while the caption speaks, come back with the plan, leave before the hand-off
    const callouts = (1 - seg(p, 0.38, 0.41) + seg(p, 0.52, 0.55)) * (1 - seg(p, 0.62, 0.65));
    labels.update(callouts, callouts, E.shown, camera);
    const db = E.bufferSize();
    planned.update(style.plan3d ? seg(p, 0.53, 0.55) * (1 - seg(p, 0.62, 0.645)) : 0, db.x, db.y, false); // linework only: the callouts carry the names

    // ---- words ----
    caps.place.style.opacity = seg(p, 0.40, 0.44) - seg(p, 0.495, 0.525);       // says its piece before the callouts return
    caps.place.style.transform = `translateY(${(1 - seg(p, 0.40, 0.46)) * 14}px)`;
    caps.park.style.opacity = seg(p, 0.82, 0.87) - seg(p, 0.945, 0.965);   // once the tilt reaches the horizon
    caps.park.style.transform = `translateY(${(1 - seg(p, 0.82, 0.89)) * 14}px)`;
    caps.hint.style.opacity = 0.7 * (1 - seg(p, 0, 0.03));
    caps.title.style.opacity = 1 - seg(p, 0.06, 0.14);
    caps.vignette.style.opacity = seg(p, 0.36, 0.46) * (1 - seg(p, 0.7, 0.75));
    caps.credit.style.opacity = seg(p, 0.40, 0.50) * (1 - seg(p, 0.66, 0.69));
  }

  return { apply, caps, end: () => rig.at(1), get rig() { return rig; }, defaultKeys: () => (keys = null, buildRig(), rig.keys) };
}

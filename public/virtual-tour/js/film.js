// The whole film on one scroll: checkpoint 1 (sheet → land → 360°) then chapters 3–12, all on one shared world.
// Each chapter keeps the objects + captions it created in setup() to itself (shown only while it plays), starts from
// a clean "real world" state, and the camera blends from where the previous chapter ended.  film.html[?rec=1]
import * as THREE from 'three';
import { mergeStatic } from './merge_static.js';
import { makeClips } from './clips.js';
import { pickStyle } from './styles.js';
import { markImg } from './brand.js';
import { createEngine } from './engine.js';
import { checkpoint1 } from './cp1.js';
import * as rig from './rig.js';
import { rigFor } from './rig.js';
import { panoState } from './panostop.js';

// Mike 11-02: what's here (ch03-ch06), then the big turn to future development (ch07): the gazebo's café, maker space, village, festival. The farm is out.
const CHAPTERS = ['ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch06b', 'ch08', 'ch10', 'ch11', 'ch12'];
const FUTURE_FROM = 'ch07';
const CP1_SECONDS = 50;   // 34 + 9 on the opening map + 7 tilting the 360 back down
const BLEND = 0.3;    // share of a chapter spent easing the camera in from the previous chapter's last view
const DISSOLVE = 0.8; // seconds at a chapter's start: the last frame of the previous one dissolves away, the camera still (Mike 10-31: objects, light and captions all cut)

const Q = new URLSearchParams(location.search);
const REC = Q.has('rec');
const REVIEW = !REC && location.hostname === 'localhost' && !Q.has('noreview');   // Mike's comment tools (js/review.js): never on the public page
const style = pickStyle();
const MOBILE = !new URLSearchParams(location.search).has('hq') && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) && Math.min(screen.width, screen.height) < 700;   // a real phone only: the screen size alone misfired on a hidden pane and stripped the models (Mike 10-30)
if (REC) document.documentElement.classList.add('rec');
const $ = s => document.querySelector(s);
$('.ld-logo').innerHTML = markImg(72);
$('.st-logo').innerHTML = markImg(40);
document.querySelectorAll('.cap .eyebrow').forEach(e => e.insertAdjacentHTML('afterbegin', markImg(40)));

async function init() {
  const E = await createEngine({ style, canvas: $('#gl'), REC, MOBILE, Q, progress: f => { $('.ld-bar i').style.width = `${f * 100}%`; } });
  const { scene, camera, renderer, U, sun, hemi, sky } = E;
  let need = true;
  const cp1 = checkpoint1(E, { style, Q, REC, onResize: () => { need = true; }, keys: E.cameras.cp1?.keys, cp1Seconds: CP1_SECONDS });
  const hud = $('.hud');
  // a quiet legend for the whole tour: planned things (zomes, maker space, farm…) are often in view, so the key to
  // reading them is always on screen once the land is real
  const legend = document.createElement('div');
  legend.style.cssText = 'position:absolute;right:max(16px,3vw);bottom:max(16px,3vh);display:flex;align-items:center;gap:9px;font:500 10.5px/1 Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#F2EDE8;padding:8px 11px;border-radius:2px;background:rgba(26,23,32,.55);opacity:0;pointer-events:none';
  legend.innerHTML = '<span style="width:16px;height:11px;border:1.5px solid #EA824E;background:rgba(242,232,220,.55);border-radius:1px"></span>Concept · not yet built';
  legend.style.display = 'none';   // retired with the concept rule (Mike, 10-28)
  hud.appendChild(legend);

  // ---- snapshot of the shared state every chapter starts from ----
  const base = () => {
    E.realWorld();
    U.uLight.value.set(1, 1, 1); U.uWaterAmt.value = 1; U.uSunDir.value.copy(SUN0); U.uExag.value = 1;
    sun.color.copy(SUNC0); sun.intensity = SUNI0; sun.position.copy(SUN0).multiplyScalar(1000);
    hemi.color.copy(HEMIC0); hemi.groundColor.copy(HEMIG0); hemi.intensity = HEMII0;
    sky.mat.uniforms.uSun.value.copy(SUN0);
    E.labels.update(0, 0, E.shown, camera); { const b = E.bufferSize(); E.planned.update(0, b.x, b.y, false); }
    E.trees.visible = true; E.blocks.visible = false;
    E.resetPersistent(); U.uTideGlow.value.copy(TG0);
    caps0.forEach(c => { c.style.opacity = 0; });
    U.uMapEx.value = U.uMapPl.value = U.uMapPulse.value = 0;
  };
  const TG0 = U.uTideGlow.value.clone();
  const SUN0 = U.uSunDir.value.clone(), SUNC0 = sun.color.clone(), SUNI0 = sun.intensity;
  const HEMIC0 = hemi.color.clone(), HEMIG0 = hemi.groundColor.clone(), HEMII0 = hemi.intensity;
  const caps0 = Object.values(cp1.caps).filter(Boolean);
  const sharedModels = new Set(Object.values(E.models));

  // ---- load chapters, recording what each one adds to the scene and the HUD ----
  if (Q.has('keeptrees')) E.clearTreesNear = () => {};   // review only: the forest with no clearing (tools/visibility_review.mjs)
  const ctx = { ...E, rig, hud, markImg, REC };
  const chapters = [];
  for (const id of CHAPTERS) {
    // own module instance per chapter (?film=…): ch12 re-runs ch11's setup internally and must not steal ch11's state
    const mod = await import(`./chapters/${id}.js?film=${id}`);
    const sceneBefore = new Set(scene.children), hudBefore = new Set(hud.children);
    base();
    ctx.rig = rigFor(id, E.cameras);
    await mod.setup(ctx);
    const objs = scene.children.filter(o => !sceneBefore.has(o) && !sharedModels.has(o) && !o.userData.always);
    const els = [...hud.children].filter(e => !hudBefore.has(e));
    // the camera pose the chapter ends on (for the blend into the next one)
    mod.update(1, ctx);
    const endPose = { pos: camera.position.clone(), quat: camera.quaternion.clone(), fov: camera.fov };
    mod.update(0, ctx);
    const startPose = { pos: camera.position.clone(), quat: camera.quaternion.clone(), fov: camera.fov };
    objs.forEach(o => { o.userData.filmVisible = o.visible; o.visible = false; });
    // the chapter's captions live in one layer, so the film can show / fade them as a whole
    const wrap = document.createElement('div'); wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;display:none';
    els.forEach(e => wrap.appendChild(e)); hud.appendChild(wrap);
    chapters.push({ id, mod, objs, els, wrap, endPose, startPose, seconds: mod.meta.seconds || 12 });
  }
  // sample every chapter's camera path and clear trees from those corridors
  const path = [];
  // the lens's own path, plus its line of sight for 50 m (cut 10: in the new dense canopy the ch08 shop was hidden by
  // trees between the camera and the subject, not on the path)
  const fwd = new THREE.Vector3(), sight = [];
  for (const c of chapters) for (let t = 0; t <= 1.0001; t += 0.02) {
    base(); panoState.op = 0; c.mod.update(t, ctx); path.push(camera.position.clone());
    if (panoState.op > 0.01) continue;   // while a real 360 is up its own view shows, and the trees it pans past must stay
    camera.getWorldDirection(fwd); for (let d = 6; d <= 22; d += 4) sight.push(camera.position.clone().addScaledVector(fwd, d));
  }
  E.clearTreesNear(sight, 3);
  // the held shots keep their view clear: a pine right at the lens filled the frame (frames 2400, 5760)
  E.clearTreesNear(path, 6);
  // the whole-film trees don't stand in any camera's way either, on the chapters' paths or the blends between them
  if (ctx.photoTrees) {
    const flown = [...path]; chapters.forEach((c, k) => { if (k) for (let w = 0; w <= 1; w += 0.05) flown.push(chapters[k - 1].endPose.pos.clone().lerp(c.startPose.pos, w)); });
    const m = new THREE.Matrix4(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < ctx.photoTrees.count; i++) { ctx.photoTrees.getMatrixAt(i, m); const x = m.elements[12], z = m.elements[14], top = m.elements[13] + m.elements[5]; if (flown.some(p => p.y < top + 4 && Math.hypot(p.x - x, p.z - z) < 8)) ctx.photoTrees.setMatrixAt(i, zero); }
    ctx.photoTrees.instanceMatrix.needsUpdate = true;
  }
  const always = scene.children.filter(o => o.userData.always);
  const showAlways = on => always.forEach(o => { o.visible = on && (!o.userData.maxDist || camera.position.distanceTo(o.userData.centre) < o.userData.maxDist); if (o.userData.maxDist) U.uLakeMirror.value = o.visible ? 1 : 0; });
  const cp1End = (() => { cp1.apply(1); return { pos: camera.position.clone(), quat: camera.quaternion.clone(), fov: camera.fov }; })();

  // ---- global timeline: weights = seconds ----
  const total = CP1_SECONDS + chapters.reduce((a, c) => a + c.seconds, 0);
  let acc = CP1_SECONDS / total;
  const ranges = chapters.map(c => { const a = acc; acc += c.seconds / total; return [a, acc]; });
  let active = -2, prevWrap = null;
  const handoff = { k: -1, x: 1 };
  let syncLights = () => {};
  const show = i => {
    if (i === active) return;
    chapters.forEach((c, k) => {
      const on = k === i;
      c.objs.forEach(o => { o.visible = on ? o.userData.filmVisible : false; });
      c.wrap.style.display = on ? '' : 'none';
    });
    prevWrap = null;
    if (i >= 0) base();
    active = i;
  };

  const q = new THREE.Quaternion(), e0 = new THREE.Euler(), e1 = new THREE.Euler(), e2 = new THREE.Euler();
  function apply(p) {
    handoff.x = 1;
    if (p < CP1_SECONDS / total) { if (active !== -1) { show(-1); base(); } cp1.apply(p / (CP1_SECONDS / total)); legend.style.opacity = 0; showAlways(p > 0.9 * CP1_SECONDS / total); return; }   // (in behind the opaque aerial photo)
    const i = ranges.findIndex(([a, b]) => p <= b) ?? chapters.length - 1;
    const k = i < 0 ? chapters.length - 1 : i;
    show(k);
    const [a, b] = ranges[k], t = (p - a) / (b - a), c = chapters[k];
    U.uTime.value = REC ? p * total : performance.now() / 1000;
    panoState.op = 0; c.mod.update(t, ctx);
    // captions wait until the camera has arrived
    const blend = c.mod.meta.blend ?? BLEND;   // a chapter with a 360 stop has its camera arrive before the photo fades in (Mike 10-31, frame 1767)
    const capFade = rig.smooth(rig.clamp((t - blend * 0.8) / (blend * 0.4)));
    c.wrap.style.opacity = String(capFade);
    // legend: in once the 360° hands over to 3D, out as the finale turns back into the sheet
    legend.style.opacity = String((k === 0 ? rig.seg(t, 0.2, 0.35) : k === chapters.length - 1 ? 1 - rig.seg(t, 0.45, 0.55) : c.mod.meta.legend === false ? 0 : 1) * (1 - panoState.op));
    // ease the camera in from where the previous chapter (or the 360° ending) left it
    const hold = k ? DISSOLVE / c.seconds : 0;   // the camera waits out the dissolve
    if (t < hold) { handoff.k = k; handoff.x = rig.smooth(t / hold); }
    const shown = handoff.x < 1 ? chapters[k - 1].wrap : null;   // the last chapter's captions fade with its picture
    if (prevWrap && prevWrap !== shown) prevWrap.style.display = 'none';
    if (shown) { shown.style.display = ''; shown.style.opacity = String(1 - handoff.x); } prevWrap = shown;
    const u = rig.clamp((t - hold) / (blend - hold)), w = u * u * u * (u * (u * 6 - 15) + 10);   // smootherstep: no jolt at either end
    if (k === 0) E.pano.mesh.visible = false;   // the aerial photo has already faded out, with the camera still (cp1.js; Mike 10-31, frame 1025)
    if (w < 1) {
      const from = k === 0 ? cp1End : chapters[k - 1].endPose;
      const toPos = camera.position.clone(), toQuat = camera.quaternion.clone(), toFov = camera.fov;
      // arc up and over instead of skimming across: lift the midpoint by a share of the distance travelled
      const lift = (c.mod.meta.lift ?? 1) * Math.min(from.pos.distanceTo(toPos) * 0.18, 220) * Math.sin(Math.PI * w);
      camera.position.copy(from.pos).lerp(toPos, w); camera.position.y += lift;
      if (c.mod.meta.blendTurn) {   // a turn near 180°: heading + pitch, so the slerp can't flip direction half way ("bounces back") or roll
        e0.setFromQuaternion(from.quat, 'YXZ'); e1.setFromQuaternion(toQuat, 'YXZ');
        const wrap = a => ((a % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        e2.setFromQuaternion(c.startPose.quat, 'YXZ');   // which way round is settled once, from the chapter's first pose
        const dy = wrap(e2.y - e0.y) + wrap(e1.y - e2.y);
        e1.set(e0.x + (e1.x - e0.x) * w, e0.y + dy * w, 0, 'YXZ'); camera.quaternion.setFromEuler(e1);
      } else { q.copy(from.quat).slerp(toQuat, w); camera.quaternion.copy(q); }
      camera.fov = from.fov + (toFov - from.fov) * w; camera.near = 1; camera.far = 80000; camera.updateProjectionMatrix();
    }
    showAlways(true);
  }

  // ---- the dissolve: the previous chapter's last frame, held in a texture and drawn over the new chapter ----
  const size = new THREE.Vector2();
  let held = null, heldFor = -1;
  const overlayU = { map: { value: null }, a: { value: 0 } };
  const overlay = new THREE.Scene(), overlayCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  overlay.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: overlayU, transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
    vertexShader: 'varying vec2 vU; void main() { vU = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: 'uniform sampler2D map; uniform float a; varying vec2 vU; void main() { gl_FragColor = vec4(texture2D(map, vU).rgb, a); }' })));   // already display pixels: no tone mapping, no colour conversion
  overlay.children[0].frustumCulled = false;
  // upright phones: the shots are framed for a wide screen, so a tall one cut off signs, buildings and map labels at the sides. Widen the lens by up to a third.
  const widened = draw => {
    const a = camera.aspect; if (a >= 1) return draw();
    const f = camera.fov, k = 1 + 0.35 * Math.min(1, (1 - a) / 0.54);
    camera.fov = 2 * Math.atan(Math.tan(f * Math.PI / 360) * k) * 180 / Math.PI; camera.updateProjectionMatrix();
    draw();
    camera.fov = f; camera.updateProjectionMatrix();
  };
  const holdLastFrame = p => {
    const k = handoff.k; renderer.getDrawingBufferSize(size);
    if (!held || held.image.width !== size.x || held.image.height !== size.y) { held?.dispose(); held = new THREE.FramebufferTexture(size.x, size.y); overlayU.map.value = held; heldFor = -1; }
    if (heldFor === k) return;
    show(k - 1); panoState.op = 0; chapters[k - 1].mod.update(1, ctx); showAlways(true); syncLights(); widened(E.render);
    renderer.copyFramebufferToTexture(held); heldFor = k;
    apply(p);
  };
  const render = p => {
    if (handoff.x < 1) holdLastFrame(p);
    syncLights(); widened(E.render);
    if (handoff.x < 1) { const ac = renderer.autoClear; renderer.autoClear = false; overlayU.a.value = 1 - handoff.x; renderer.render(overlay, overlayCam); renderer.autoClear = ac; }
  };

  // scroll length follows the film's length
  $('#scroller').style.height = `${Math.round(total / 34 * 900)}vh`;

  // frame counter (Mike 10-29: "so that I can reference specific points of camera movement"): film time, frame at
  // 30 fps, the chapter and its own second. Shown on the scroll page, never in recordings; ?nocounter hides it.
  const counter = document.createElement('div');
  counter.style.cssText = 'position:fixed;left:10px;top:10px;z-index:60;font:600 12px/1.35 ui-monospace,Consolas,monospace;color:#F2EDE8;'
    + 'background:rgba(26,23,32,.78);border:1px solid rgba(234,130,78,.55);border-radius:4px;padding:5px 8px;pointer-events:none;white-space:pre';
  if (!REC && (Q.has('counter') || location.hostname === 'localhost')) document.body.appendChild(counter);   // public page: only with ?counter
  const cp1Share = CP1_SECONDS / total;
  // where we are in the story, all film long (Mike 11-02): what's here, then what's planned
  const status = document.createElement('div');
  status.style.cssText = 'position:fixed;top:max(14px,2.2vh);left:50%;transform:translateX(-50%);z-index:50;font:600 clamp(10px,1vw,12px)/1 Inter,sans-serif;letter-spacing:.2em;text-transform:uppercase;padding:9px 14px;border-radius:3px;background:rgba(26,23,32,.8);pointer-events:none;white-space:nowrap;transition:opacity .4s';
  document.body.appendChild(status);
  const futureAt = ranges[CHAPTERS.indexOf(FUTURE_FROM)][0], endAt = ranges[CHAPTERS.indexOf('ch12')][0], existingAt = cp1Share * 0.62;
  const clips = makeClips({ ranges, chapterIds: CHAPTERS, total, phone: MOBILE });
  const showStatus = p => { const fut = p >= futureAt; status.textContent = fut ? 'Future development' : 'Here today'; status.style.color = fut ? '#EA824E' : '#F2EDE8'; status.style.border = `1px solid ${fut ? '#EA824E' : 'rgba(242,237,232,.55)'}`; status.style.opacity = p > existingAt && p < endAt ? 1 : 0; };
  const showCounter = p => {
    const sec = p * total, f = Math.round(sec * 30);
    let where;
    if (p < cp1Share) where = `ch01–02  ${(p / cp1Share * CP1_SECONDS).toFixed(1)}s`;
    else { const i = Math.max(0, ranges.findIndex(([a, b]) => p <= b)), [a, b] = ranges[i], c = chapters[i]; where = `${c.id}  ${((p - a) / (b - a) * c.seconds).toFixed(1)}s of ${c.seconds}`; }
    counter.textContent = `frame ${String(f).padStart(4, '0')}   ${sec.toFixed(1)}s
${where}`;
  };
  let P = 0, drawn = -1;
  const frame = () => { if (need || P !== drawn || P > 0.33 * CP1_SECONDS / total) { apply(P); render(P); drawn = P; need = false; showCounter(P); showStatus(P); clips.update(P); } };
  { let was = 0, now = 0; for (const k of ['maker_space', 'props', 'office', 'dome', 'shower_house', 'footbridge', 'shed', 'gazebo', 'sauna', 'sauna_setting', 'bunk_cabin', 'entrance_sign', 'top_house', 'bottom_house', 'horse_corrals']) if (E.models[k]) { const [a, b] = mergeStatic(E.models[k], REVIEW); was += a; now += b; } console.log('merged', was, 'parts into', now); }
  // the lake's reflection draws the whole scene a second time: nothing far from the water can show in it, so it draws only the land, trees, zomes and dome
  if (ctx._lakeMirror) { const m = ctx._lakeMirror, box = new THREE.Box3(), mid = new THREE.Vector3(), far = [];
    for (const o of [...Object.values(E.models), ...chapters.flatMap(c => c.objs.filter(x => !x.isLight))]) { if (!o?.isObject3D || far.includes(o) || o === E.models.zome_merged || o === E.models.village_land || o === E.models.dome) continue; box.setFromObject(o); if (!box.isEmpty() && (o.userData.slug || Object.values(E.models).includes(o) || box.getCenter(mid).distanceTo(m.userData.centre) > 450 + box.getSize(mid.clone()).length() / 2)) far.push(o); }
    const draw = m.onBeforeRender; m.onBeforeRender = function (...a) { const was = far.map(o => o.visible); far.forEach(o => { o.visible = false; }); draw.apply(this, a); far.forEach((o, i) => { o.visible = was[i]; }); };
    console.log('mirror skips', far.length, 'models'); }
  // One fixed set of lights for the whole film: three rebuilds every shader when the number of lights changes, and chapter lights
  // switching on and off cost a first viewing about 50 s of freezes (tools/stall_check.mjs). The chapters' own lights stay as the
  // settings; only the fixed set is ever drawn with.
  const chapterLights = [];
  scene.traverse(o => { if (o.isLight && o !== sun && o !== hemi) { chapterLights.push(o); o.layers.set(31); } });
  const lit = o => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
  const most = { dir: 0, point: 0 };
  chapters.forEach((c, k) => { show(k); for (let t = 0; t <= 1.001; t += 0.1) { c.mod.update(t, ctx); const on = chapterLights.filter(lit); most.dir = Math.max(most.dir, on.filter(l => l.isDirectionalLight).length); most.point = Math.max(most.point, on.filter(l => l.isPointLight).length); } });
  const fixed = { dir: Array.from({ length: most.dir }, () => new THREE.DirectionalLight(0xffffff, 0)), point: Array.from({ length: most.point }, () => new THREE.PointLight(0xffffff, 0)) };
  [...fixed.dir, ...fixed.point].forEach(l => scene.add(l));
  const tgt = new THREE.Vector3();
  syncLights = () => {
    let d = 0, p = 0;
    for (const l of chapterLights) {
      if (l.intensity <= 0 || !lit(l)) continue;
      const f = l.isPointLight ? fixed.point[p++] : fixed.dir[d++];
      if (!f) continue;
      f.color.copy(l.color); f.intensity = l.intensity; l.updateWorldMatrix(true, false); f.position.setFromMatrixPosition(l.matrixWorld);
      if (l.isPointLight) { f.distance = l.distance; f.decay = l.decay; } else { l.target.updateWorldMatrix(true, false); f.position.sub(tgt.setFromMatrixPosition(l.target.matrixWorld)); }
    }
    for (; d < fixed.dir.length; d++) fixed.dir[d].intensity = 0;
    for (; p < fixed.point.length; p++) fixed.point[p].intensity = 0;
  };
  apply(0.5 * CP1_SECONDS / total); syncLights();
  // everything the film will ever draw is built while the loader is up, not at the moment it first appears: every shader, the lake mirror's own versions of them, every texture
  { const builds = [renderer.compileAsync(scene, camera)], rt = ctx._lakeMirror?.getRenderTarget();
    if (rt) { renderer.setRenderTarget(rt); builds.push(renderer.compileAsync(scene, camera)); renderer.setRenderTarget(null); }
    await Promise.all(builds);
    const seen = new Set(), send = t => { if (t?.isTexture && !seen.has(t) && t.image && !t.isRenderTargetTexture && !t.isFramebufferTexture && !t.isDepthTexture && !t.isVideoTexture) { seen.add(t); renderer.initTexture(t); } };
    scene.traverse(o => { for (const m of [o.material].flat()) { if (!m) continue; Object.values(m).forEach(send); if (m.uniforms) Object.values(m.uniforms).forEach(u => send(u.value)); } }); }
  // and one draw every few seconds of film behind the loader, so meshes reach the graphics card now too (the freeze at frame ~450 was 10,000 buffers at once)
  for (let t = 3; t < total; t += 6) { apply(t / total); syncLights(); E.render(); }
  apply(0); syncLights(); E.render();
  $('#loader').classList.add('done'); if (REC) $('#loader').style.display = 'none';
  if (REC) {
    window.FT = { render: async p => { P = p; need = true; frame(); await new Promise(r => requestAnimationFrame(r)); }, style: style.key, total, E, apply };
    window.FT_READY = true;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(x => lenis.raf(x * 1000)); gsap.ticker.lagSmoothing(0);
  ScrollTrigger.create({ trigger: '#scroller', start: 'top top', end: 'bottom bottom', onUpdate: s => { P = s.progress; } });
  renderer.setAnimationLoop(frame);
  if (REVIEW) (await import('./review.js')).review({ E, total, ranges, chapters, panoState, mirror: ctx._lakeMirror, Q, getP: () => P,
    setP: p => { lenis.scrollTo(p * (document.documentElement.scrollHeight - innerHeight), { immediate: true, force: true }); P = p; },
    draw: p => { apply(p); render(p); } });
}
init().catch(e => { console.error(e); $('.ld-note').textContent = 'Could not load: ' + e.message; });

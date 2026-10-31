// Runs ONE chapter module on its own:  chapters.html?c=ch03  (+ &rec=1 for the recorder, same FT API as film.html)
// The chapter gets the shared world (engine.js) already turned real, and drives it with its own local progress t 0..1.
import { pickStyle } from './styles.js';
import { markImg } from './brand.js';
import { createEngine } from './engine.js';
import { rigFor } from './rig.js';
import { checkpoint1 } from './cp1.js';
import { startEditor } from './editor.js';

const Q = new URLSearchParams(location.search);
const REC = Q.has('rec');
const style = pickStyle();
const MOBILE = !new URLSearchParams(location.search).has('hq') && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) && Math.min(screen.width, screen.height) < 700;   // a real phone only: the screen size alone misfired on a hidden pane and stripped the models (Mike 10-30)
if (REC) document.documentElement.classList.add('rec');
const $ = s => document.querySelector(s);
$('.ld-logo').innerHTML = markImg(72);

async function init() {
  const id = Q.get('c') || 'ch03', EDIT = Q.has('edit');
  let cp;
  // 'cp1' = chapters 1–2 (index.html's timeline), so the editor can work on it too
  const chapter = id === 'cp1' ? {
    meta: { id: 'cp1', title: 'The sheet → the land → the 360°', seconds: 34, animated: true },
    async setup(ctx) {
      const html = await fetch('cp1.html').then(r => r.text());   // the original chapter 1–2 page (was index.html)
      const doc = new DOMParser().parseFromString(html, 'text/html');
      $('#hud').innerHTML = doc.querySelector('.hud').innerHTML;
      document.querySelectorAll('.cap .eyebrow').forEach(e => e.insertAdjacentHTML('afterbegin', markImg(40)));
      const st = document.querySelector('.st-logo'); if (st) st.innerHTML = markImg(40);
      cp = checkpoint1(ctx, { style, Q, REC, keys: ctx.cameras.cp1?.keys });
    },
    update(t) { cp.apply(t); },
  } : await import(`./chapters/${id}.js`);
  document.title = `Portal.Place — ${chapter.meta.title}`;
  const E = await createEngine({ style, canvas: $('#gl'), REC, MOBILE, Q, progress: f => { $('.ld-bar i').style.width = `${f * 100}%`; } });
  if (id !== 'cp1') E.realWorld();
  E.labels.update(0, 0, E.shown, E.camera); E.planned.update(0, 1, 1, false);
  const ctx = { ...E, rig: rigFor(id, E.cameras), hud: $('#hud'), markImg, REC };
  await chapter.setup(ctx);

  let t = 0, drawn = -1, need = true;
  const frame = () => {
    if (need || t !== drawn || chapter.meta.animated) {
      E.U.uTime.value = REC ? t * (chapter.meta.seconds || 20) : performance.now() / 1000;
      chapter.update(t, ctx); E.render(); drawn = t; need = false;
    }
  };
  const path = [], sight = [], fwd = new E.THREE.Vector3();
  for (let s = 0; s <= 1.0001; s += 0.02) { chapter.update(s, ctx); path.push(E.camera.position.clone()); E.camera.getWorldDirection(fwd); for (let d = 6; d <= 90; d += 4) sight.push(E.camera.position.clone().addScaledVector(fwd, d)); }
  E.clearTreesNear(sight, 6);   // and its line of sight for 50 m
  E.clearTreesNear(path);   // no trees right in the lens's path (instead of shrinking them)
  chapter.update(0, ctx); E.renderer.compile(E.scene, E.camera); E.render();
  $('#loader').classList.add('done'); if (REC) $('#loader').style.display = 'none';
  // Walk-around view for checking models in place:  chapters.html?c=ch04&explore=-98.6,-60.1,0  (east, north in local
  // metres, start bearing°). Starts at eye height on that spot with the chapter's camera path off; drag = look around,
  // right-drag = pan, wheel = move in/out; click a real-world model to move or turn it (js/placer.js).
  if (Q.has('explore')) {
    const [x, y, b = 0] = Q.get('explore').split(',').map(Number);
    const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
    E.U.uTime.value = performance.now() / 1000; chapter.update(0.3, ctx);   // the chapter's world, before any 360 photo
    for (const s of ['#hud', '#scroller']) { const el = $(s); if (el) el.style.display = 'none'; }
    const cam = E.camera, r = b * Math.PI / 180;
    cam.position.set(x, E.groundAt(x, y) + 1.6, -y); cam.fov = 70; cam.near = 0.1; cam.updateProjectionMatrix();
    document.body.style.height = '100vh';   // the controls size their drag by this element; it has no height otherwise
    const orbit = new OrbitControls(cam, document.body);
    orbit.target.set(x + Math.sin(r) * 6, cam.position.y - 0.6, -y - Math.cos(r) * 6); orbit.update();
    E.renderer.setAnimationLoop(() => { E.U.uTime.value = performance.now() / 1000; orbit.update(); E.render(); });
    for (const s of ['.vignette', '#vignette', '#loader']) { const el = $(s); if (el) el.style.pointerEvents = 'none'; }   // clicks reach the scene
    const { startPlacer } = await import('./placer.js'); await startPlacer({ E, orbit });   // click a model to move / turn it
    return;
  }
  if (EDIT) {
    const getRig = () => id === 'cp1' ? cp.rig : rigFor.last[id];
    startEditor({
      E, id, getRig, seconds: chapter.meta.seconds || 12,
      update: tt => { E.U.uTime.value = performance.now() / 1000; chapter.update(tt, ctx); },
      defaultKeys: () => id === 'cp1' ? cp.defaultKeys() : getRig().defaultKeys,
    });
    return;
  }
  if (REC) {
    window.FT = { render: async p => { t = p; need = true; frame(); await new Promise(r => requestAnimationFrame(r)); }, style: style.key, chapter: id, E, draw: p => { t = p; need = true; frame(); } };
    window.FT_READY = true;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(x => lenis.raf(x * 1000)); gsap.ticker.lagSmoothing(0);
  ScrollTrigger.create({ trigger: '#scroller', start: 'top top', end: 'bottom bottom', onUpdate: s => { t = s.progress; } });
  E.renderer.setAnimationLoop(frame);
}
init().catch(e => { console.error(e); $('.ld-note').textContent = 'Could not load: ' + e.message; });

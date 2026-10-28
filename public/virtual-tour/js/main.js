// Portal.Place fly-through — checkpoint 1: the sheet, the land rising, the aerial 360°.
// Everything on screen is a pure function of one progress value p (0..1): scroll sets it, ?rec=1 lets a recorder set it.
// The world itself lives in engine.js; this file is only the checkpoint-1 timeline.
import * as THREE from 'three';
import { pickStyle } from './styles.js';
import { markImg } from './brand.js';
import { createEngine } from './engine.js';
import { checkpoint1 } from './cp1.js';

const Q = new URLSearchParams(location.search);
const REC = Q.has('rec');
const style = pickStyle();
const MOBILE = Math.min(screen.width, screen.height) < 700;
if (REC) document.documentElement.classList.add('rec');
document.querySelector('.ld-logo').innerHTML = markImg(72);
document.querySelector('.st-logo').innerHTML = markImg(40);
document.querySelectorAll('.cap .eyebrow').forEach(e => e.insertAdjacentHTML('afterbegin', markImg(40)));
const $ = s => document.querySelector(s);

async function init() {
  const bar = $('.ld-bar i');
  const E = await createEngine({ style, canvas: $('#gl'), REC, MOBILE, Q, progress: f => { bar.style.width = `${f * 100}%`; } });
  const { renderer, camera } = E;
  let need = true;
  const { apply } = checkpoint1(E, { style, Q, REC, onResize: () => { need = true; }, keys: E.cameras.cp1?.keys });

  let P = 0, shownP = -1;
  // re-render on scroll; keep animating while real water is on screen so the creeks flow
  const frame = () => { if (need || P !== shownP || (P > 0.33 && P < 0.76)) { apply(P); E.render(); shownP = P; need = false; } };

  // compile everything once so the first scroll doesn't hitch
  apply(0.75); renderer.compile(E.scene, camera); E.render();
  apply(0); E.render();
  $('#loader').classList.add('done');
  if (REC) $('#loader').style.display = 'none';

  if (REC) {
    window.FT = { render: async p => { P = p; need = true; frame(); await new Promise(r => requestAnimationFrame(r)); }, style: style.key };
    window.FT_READY = true;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  ScrollTrigger.create({ trigger: '#scroller', start: 'top top', end: 'bottom bottom', onUpdate: s => { P = s.progress; } });
  renderer.setAnimationLoop(frame);
}

init().catch(e => { console.error(e); $('.ld-note').textContent = 'Could not load: ' + e.message; });

// Chapter 7 — The build-up. A slow, steady push over the whole property. Every planned thing is already standing
// as a concept model (the persistent world, engine.js); here each phase in turn is traced in glowing amber on the
// land, its sites light up, and the ledger names it. Nothing pops in or out.
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

export const meta = { id: 'ch07', title: 'The build-up', seconds: 13, animated: false, legend: false };

// timed after the film's camera blend (t < 0.3), one phase every ~2 s
const PHASES = [
  { name: 'Phase 2', what: 'Maker space · creekside zomes', rings: ['maker_space'], sites: ['cabins'], t: [0.28, 0.43] },
  { name: 'Phase 3', what: 'Lakeside zomes · event gazebo', rings: ['event_gazebo'], sites: ['lake_cabins'], t: [0.43, 0.58] },
  { name: 'Phase 4', what: 'Festival grounds · stage · art trail', rings: ['festival_grounds', 'event_space'], lines: ['discovery_trail'], t: [0.58, 0.72] },
  { name: 'The farm', what: 'Greenhouses · barn · gardens', rings: ['farmland', 'farm_greenhouses', 'farm_buildings'], t: [0.72, 0.84] },
];

let rig, cap, tag, scrim, phaseEls = [], traces = [];
const polys = f => f.t === 'Polygon' ? [f.c] : f.t === 'MultiPolygon' ? f.c : [];
const lines = f => f.t === 'LineString' ? [f.c] : f.t === 'MultiLineString' ? f.c : [];

export async function setup(ctx) {
  const { THREE, rig: R, L, scene } = ctx, ground = ctx.groundAt;
  const AMBER = new THREE.Color('#EA824E');
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,190,120,1)'); gr.addColorStop(0.5, 'rgba(234,130,78,0.5)'); gr.addColorStop(1, 'rgba(234,130,78,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  for (const ph of PHASES) {
    // the phase's footprints, draped on the ground, drawn on progressively (drawRange) as the phase begins
    const pos = [];
    const seg = (a, b) => {
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6));
      for (let k = 0; k < n; k++) {
        const p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n], q = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n];
        pos.push(p[0], ground(p[0], p[1]) + 1.5, -p[1], q[0], ground(q[0], q[1]) + 1.5, -q[1]);
      }
    };
    for (const n of ph.rings) for (const f of L[n] || []) for (const p of polys(f)) { const r = p[0]; for (let i = 0; i < r.length - 1; i++) seg(r[i], r[i + 1]); }
    for (const n of ph.lines || []) for (const f of L[n] || []) for (const l of lines(f)) for (let i = 0; i < l.length - 1; i++) seg(l[i], l[i + 1]);
    // fat screen-space lines (reviewers: the 1 px outlines were lost against the green from this height)
    const geo = new LineSegmentsGeometry().setPositions(pos);
    const line = new LineSegments2(geo, new LineMaterial({ color: 0xEA824E, linewidth: 3.2, transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    line.renderOrder = 20; line.frustumCulled = false; scene.add(line);
    // a soft amber glow on every zome site in the phase
    const glows = [];
    for (const n of ph.sites || []) for (const f of L[n] || []) for (const p of polys(f)) {
      const r = p[0], c = [r.reduce((a, q) => a + q[0], 0) / r.length, r.reduce((a, q) => a + q[1], 0) / r.length];
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: AMBER, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
      s.position.set(c[0], ground(c[0], c[1]) + 3, -c[1]); s.scale.set(40, 40, 1); s.renderOrder = 19; scene.add(s); glows.push(s.material);
    }
    // and a broad glow over each footprint, so the phase reads from 1 km up
    for (const n of ph.rings) for (const f of L[n] || []) for (const p of polys(f)) {
      const r = p[0], c = [r.reduce((a, q) => a + q[0], 0) / r.length, r.reduce((a, q) => a + q[1], 0) / r.length];
      const rad = Math.max(...r.map(q => Math.hypot(q[0] - c[0], q[1] - c[1])));
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: AMBER, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
      // depthTest off: a big sprite cut by the hillside left ruler-straight edges; size capped (the farmland's washed a hillside)
      s.position.set(c[0], ground(c[0], c[1]) + 4, -c[1]); s.scale.setScalar(Math.min(Math.max(50, rad * 1.8), 160));
      s.renderOrder = 19; scene.add(s); glows.push(s.material);
    }
    traces.push({ ph, line, n: pos.length / 3, glows });
  }

  // one slow, steady push across the property: no swings
  const c = [-210, -110], h = ground(c[0], c[1]);
  rig = R.makeRig([
    [0.0, c[0], c[1] + 30, h, 1350, 12, -46, 42],
    [1.0, c[0] + 20, c[1] - 40, h, 920, 4, -50, 42],   // a little further in (the push read as a still)
  ]);

  const hud = ctx.hud;
  cap = document.createElement('div'); cap.className = 'cap';
  cap.innerHTML = '<div class="eyebrow">What we’re building</div><h1>Built in phases,<br>on land that’s ready.</h1>';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  hud.appendChild(cap);
  // a warm-dark scrim behind the headline (it sat on busy forest)
  scrim = document.createElement('div');
  scrim.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0;background:linear-gradient(to top right, rgba(26,23,32,.85) 0%, rgba(26,23,32,.45) 34%, rgba(26,23,32,0) 60%)';
  hud.insertBefore(scrim, cap);
  tag = document.createElement('div');
  tag.style.cssText = 'position:absolute;right:max(16px,3vw);top:max(16px,3vh);font:600 13px/1 Inter,sans-serif;letter-spacing:.18em;color:#EA824E;border:1px solid #EA824E;padding:9px 12px;border-radius:2px;background:#1A1720;opacity:0';
  tag.textContent = 'PLANNED'; tag.style.display = 'none'; hud.appendChild(tag);
  const ledger = document.createElement('div');
  ledger.style.cssText = 'position:absolute;left:max(16px,5vw);top:max(28px,9vh);display:grid;gap:12px;padding:16px 20px;background:rgba(26,23,32,.78);border-left:2px solid #EA824E;opacity:0';
  {   // where it starts: what is already here
    const el = document.createElement('div'); el.style.cssText = 'opacity:.6;color:#F2EDE8';
    el.innerHTML = '<div style="font:600 13px/1.2 Inter,sans-serif;letter-spacing:.2em;color:#F2EDE8;text-transform:uppercase">Phase 1 · today</div>'
      + '<div style="font:500 30px/1.15 Cormorant,Georgia,serif">RV park · golf · cabins · dome · gazebo</div>';
    ledger.appendChild(el);
  }
  for (const ph of PHASES) {
    const el = document.createElement('div');
    el.style.cssText = 'opacity:.35;color:#F2EDE8';
    el.innerHTML = `<div style="font:600 13px/1.2 Inter,sans-serif;letter-spacing:.2em;color:#EA824E;text-transform:uppercase">${ph.name}</div>`
      + `<div style="font:500 30px/1.15 Cormorant,Georgia,serif">${ph.what}</div>`;
    ledger.appendChild(el); phaseEls.push(el);
  }
  hud.appendChild(ledger); phaseEls.box = ledger;
}

export function update(t, ctx) {
  const { seg } = ctx.rig;
  rig.apply(ctx.camera, t);
  traces.forEach(({ ph, line, n, glows }, i) => {
    const on = seg(t, ph.t[0], ph.t[0] + 0.09), next = i < traces.length - 1 ? seg(t, ph.t[1], ph.t[1] + 0.06) : 0;
    line.geometry.instanceCount = Math.floor(n / 2 * on);   // traced on, segment by segment
    const db = ctx.bufferSize(); line.material.resolution.set(db.x, db.y);
    line.material.opacity = on * (1 - 0.55 * next);              // stays, dimmer, once the next phase starts
    const flash = on * (1 - seg(t, ph.t[0] + 0.09, ph.t[1]));   // brightest while its ledger row is the active one
    glows.forEach(m => { m.opacity = (0.1 + 0.16 * flash) * on * (1 - 0.45 * next); });   // a hint of light; the crisp outline is the plan (big glows read as fire)
    const el = phaseEls[i];
    el.style.opacity = String(0.58 + 0.42 * on * (1 - 0.35 * next));   // dim rows stay legible
  });
  // the ledger leaves as one piece (panel + text) before the headline comes in
  phaseEls.box.style.opacity = String(seg(t, 0.2, 0.28) * (1 - seg(t, 0.79, 0.81)));   // a short, clean exit
  cap.style.opacity = seg(t, 0.8, 0.86); scrim.style.opacity = seg(t, 0.78, 0.86);
  tag.style.opacity = seg(t, 0.22, 0.3);
}

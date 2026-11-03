// Chapter 7 — The build-up. A slow, steady push over the whole property. Every planned thing is already standing
// as a concept model (the persistent world, engine.js); here each phase in turn is traced in glowing amber on the
// land, its sites light up, and the ledger names it. Nothing pops in or out.
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

export const meta = { id: 'ch07', title: 'Future development', seconds: 21, animated: false, legend: false, capsFrom: 0 };   // the big title rides the climb (r1103: it never showed)

// timed after the film's camera blend (t < 0.3), one phase every ~2 s
const PHASES = [
  // at = where its label stands on the land; the camera leans toward it while it is the active row
  { name: 'Co-working café', rings: [], t: [0.24, 0.36], at: [-597, -226] },
  { name: 'Maker space', rings: ['maker_space'], t: [0.36, 0.48], at: [-30, 318] },
  { name: 'Creekside zomes', rings: ['creekside_cabin_boundary'], t: [0.48, 0.6], at: [60, 150] },
  { name: 'Lakeside zomes', rings: ['lake_cabins'], t: [0.6, 0.72], at: [30, -230] },
  { name: 'Festival grounds · stage · art trails', short: 'Festival', rings: ['festival_grounds', 'event_space'], lines: ['discovery_trail'], t: [0.72, 0.84], at: [-100, -420] },
];

let rig, cap, tag, scrim, big, phaseEls = [], traces = [], pins = [];
const polys = f => f.t === 'Polygon' ? [f.c] : f.t === 'MultiPolygon' ? f.c : [];
const lines = f => f.t === 'LineString' ? [f.c] : f.t === 'MultiLineString' ? f.c : [];

export async function setup(ctx) {
  const { THREE, rig: R, L, scene } = ctx, ground = ctx.groundAt;
  const AMBER = new THREE.Color('#EA824E');
  { const pp = (L.camp_plots || []).flatMap(polys).map(p => p[0][0]); if (pp.length) PHASES[4].at = [pp.reduce((a, q) => a + q[0], 0) / pp.length, pp.reduce((a, q) => a + q[1], 0) / pp.length]; }   // the pin on the meadow itself (i15)
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,190,120,1)'); gr.addColorStop(0.5, 'rgba(234,130,78,0.5)'); gr.addColorStop(1, 'rgba(234,130,78,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const fix = (n, r) => r;
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
    for (const n of ph.rings) for (const f of L[n] || []) for (const p of polys(f)) { const r = fix(n, p[0]); for (let i = 0; i < r.length - 1; i++) seg(r[i], r[i + 1]); }
    for (const n of ph.lines || []) for (const f of L[n] || []) for (const l of lines(f)) for (let i = 0; i < l.length - 1; i++) seg(l[i], l[i + 1]);
    // fat screen-space lines (reviewers: the 1 px outlines were lost against the green from this height)
    const geo = new LineSegmentsGeometry().setPositions(pos);
    const line = new LineSegments2(geo, new LineMaterial({ color: 0xEA824E, linewidth: 2.2, transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    line.renderOrder = 20; line.frustumCulled = false; scene.add(line);
    // a soft amber glow on every zome site in the phase
    const glows = [];
    for (const n of ph.sites || []) for (const f of L[n] || []) for (const p of polys(f)) {
      const r = p[0], c = [r.reduce((a, q) => a + q[0], 0) / r.length, r.reduce((a, q) => a + q[1], 0) / r.length];
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: AMBER, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
      s.position.set(c[0], ground(c[0], c[1]) + 3, -c[1]); s.scale.set(24, 24, 1); s.renderOrder = 19; scene.add(s); glows.push(s.material);   // a small dot per site (i7: 40 m glows smeared into 'fire')
    }
    // and a broad glow over each footprint, so the phase reads from 1 km up
    for (const n of ph.rings) for (const f of L[n] || []) for (const p of polys(f)) {
      const r = fix(n, p[0]), c = [r.reduce((a, q) => a + q[0], 0) / r.length, r.reduce((a, q) => a + q[1], 0) / r.length];
      const rad = Math.max(...r.map(q => Math.hypot(q[0] - c[0], q[1] - c[1])));
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: AMBER, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
      // depthTest off: a big sprite cut by the hillside left ruler-straight edges; size capped (the farmland's washed a hillside)
      s.position.set(c[0], ground(c[0], c[1]) + 4, -c[1]); s.scale.setScalar(Math.min(Math.max(50, rad * 1.8), 160));
      s.renderOrder = 19; scene.add(s); glows.push(s.material);
    }
    traces.push({ ph, line, n: pos.length / 3, glows });
  }

  // wide on the whole property, then a slight lean toward each phase as its row lights up (a short move, then a hold
  // while it reads), and back to a wide frame for the headline; the heading barely changes, so nothing swings
  const c = [-210, -110], h = ground(c[0], c[1]), K = [[0.0, c[0], c[1] + 30, h, 1000, 12, -46, 42], [0.16, c[0] + 4, c[1] + 14, h, 960, 10, -47, 42]];   // (i8: closer — the planned sites were specks)
  // each lean puts its phase at ~62 % across the screen, clear of the ledger panel on the left (i5: the farm's label sat
  // behind the panel): look point = the phase's label spot moved ~0.22 frame-widths west (screen-left at heading ~8°)
  const F = 880, west = 0.22 * F * 1.78;
  PHASES.forEach((ph, i) => {
    const hd = 9 - i * 0.6, r = [Math.cos(hd * Math.PI / 180), -Math.sin(hd * Math.PI / 180)];
    // half-way from the wide view's centre to that ideal (Mike: "shift slightly"): enough to clear the panel, short moves
    const f = 0.35, x = c[0] + f * (ph.at[0] - west * r[0] - c[0]), y = c[1] + f * (ph.at[1] - west * r[1] - c[1]);   // (i7: 0.55 read as swings)
    K.push([ph.t[0] + 0.05, x, y, h, F, hd, -48, 42], [ph.t[1] - 0.005, x, y, h, F, hd, -48, 42]);   // ~1.4 s move, then a still hold
  });
  { const l = K[K.length - 1]; K.push([1.0, ...l.slice(1)]); }   // the headline lands on the last lean: no extra move (i7)
  rig = R.makeRig(K);

  const hud = ctx.hud;
  // the turn in the story (Mike 11-02): everything before this is here today
  big = document.createElement('div');
  big.style.cssText = 'position:absolute;inset:0;display:grid;place-content:center;text-align:center;pointer-events:none;opacity:0;color:#F2EDE8;background:radial-gradient(ellipse at center,rgba(26,23,32,.72) 0%,rgba(26,23,32,.35) 55%,rgba(26,23,32,0) 80%)';
  big.innerHTML = '<div style="font:600 clamp(11px,1.3vw,15px)/1 Inter,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#EA824E">From here on, the plan</div><div style="font:500 clamp(44px,8vw,120px)/1 Cormorant,Georgia,serif;margin-top:14px">Future development</div>';
  hud.appendChild(big);
  cap = document.createElement('div'); cap.className = 'cap';
  cap.innerHTML = '<div class="eyebrow">Future development</div><h1>All of it on land<br>that’s ready.</h1>';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  hud.appendChild(cap);
  // a warm-dark scrim behind the headline (it sat on busy forest)
  scrim = document.createElement('div');
  scrim.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0;background:linear-gradient(to top right, rgba(26,23,32,.85) 0%, rgba(26,23,32,.45) 34%, rgba(26,23,32,0) 60%)';
  hud.insertBefore(scrim, cap);
  tag = document.createElement('div');
  tag.style.cssText = 'position:absolute;right:max(16px,3vw);top:max(16px,3vh);font:600 13px/1 Inter,sans-serif;letter-spacing:.18em;color:#EA824E;border:1px solid #EA824E;padding:9px 12px;border-radius:2px;background:#1A1720;opacity:0';
  tag.textContent = 'PLANNED'; tag.style.display = 'none'; hud.appendChild(tag);
  // the ledger (Mike 10-29: "hard to see that the text box is supposed to highlight the different projects"): the
  // active row is lit — amber wash, a solid accent bar and a filled amber label — rows already shown get a tick and
  // dim, rows still to come stay faint; the same label stands on the land over the phase's site
  const ledger = document.createElement('div');
  ledger.style.cssText = 'position:absolute;left:max(16px,4vw);top:max(28px,9vh);display:grid;gap:4px;padding:12px;background:rgba(26,23,32,.82);border-radius:4px;opacity:0;max-width:min(440px,calc(100vw - 32px))';
  const label = (text, solid) => `<span class="lbl" style="display:inline-block;font:700 15px/1 Inter,sans-serif;letter-spacing:.18em;text-transform:uppercase;padding:5px 8px 4px;border-radius:2px;border:1px solid #EA824E;${solid ? 'background:#EA824E;color:#1A1720' : 'color:#EA824E'}">${text}</span>`;
  {   // where it starts: what is already here
    const el = document.createElement('div'); el.style.cssText = 'opacity:.62;color:#F2EDE8;padding:8px 12px;border-left:4px solid transparent';
    el.innerHTML = '<div style="font:600 12px/1.2 Inter,sans-serif;letter-spacing:.2em;color:#F2EDE8;text-transform:uppercase">✓ Here today</div>'
      + '<div style="font:500 23px/1.15 Cormorant,Georgia,serif;margin-top:4px">RV park · golf · cabins · dome · gazebo</div>';
    ledger.appendChild(el);
  }
  for (const ph of PHASES) {
    const el = document.createElement('div');
    el.style.cssText = 'color:#F2EDE8;padding:8px 12px;border-left:4px solid transparent;border-radius:2px;transform-origin:left center';
    el.innerHTML = `<div><span class="tick" style="display:inline-block;width:0;overflow:hidden;white-space:nowrap;color:#EA824E;font:700 13px/1 Inter,sans-serif;vertical-align:middle">✓&nbsp;</span>${label(ph.name, false)}</div>`;
    ledger.appendChild(el); phaseEls.push(el);
    // the matching label on the land
    const pin = document.createElement('div');
    pin.style.cssText = 'position:absolute;left:0;top:0;transform:translate(-50%,-100%);opacity:0;pointer-events:none;display:grid;justify-items:center';
    pin.innerHTML = `${label(ph.short || ph.name, true)}<div style="width:2px;height:26px;background:#EA824E"></div><div style="width:9px;height:9px;border-radius:50%;background:#EA824E;box-shadow:0 0 0 4px rgba(234,130,78,.3)"></div>`;
    hud.appendChild(pin); pins.push(pin);
  }
  hud.appendChild(ledger); phaseEls.box = ledger;
}

export function update(t, ctx) {
  const { seg } = ctx.rig;
  rig.apply(ctx.camera, t);
  traces.forEach(({ ph, line, n, glows }, i) => {
    const t0 = ph.lit ?? ph.t[0], on = seg(t, t0, t0 + 0.09), next = i < traces.length - 1 ? seg(t, ph.t[1], ph.t[1] + 0.06) : 0;
    line.geometry.instanceCount = Math.floor(n / 2 * on);   // traced on, segment by segment
    const db = ctx.bufferSize(); line.material.resolution.set(db.x, db.y);
    line.material.opacity = on * (1 - 0.7 * next * (1 - seg(t, 0.84, 0.88)));   // all phases equal under the headline (i13)   // dims once the next phase starts; gone under the headline (i7)
    const flash = on * (1 - seg(t, ph.t[0] + 0.09, ph.t[1]));   // brightest while its ledger row is the active one
    glows.forEach(m => { m.opacity = (0.1 + 0.16 * flash) * on * (1 - 0.6 * next) * (1 - seg(t, 0.84, 0.88)); });   // a hint of light; the crisp outline is the plan (big glows read as fire)
    // row state: act = this row is the one being shown; done = shown already
    // row state: sharp handoff, the old row off before the new one comes on (i11)
    const off = i < traces.length - 1 ? seg(t, ph.t[1] - 0.012, ph.t[1]) : 0;
    const el = phaseEls[i], act = seg(t, t0, t0 + 0.012) * (1 - off), done = off;
    el.style.opacity = String(0.55 + 0.45 * act + 0.1 * done);   // (i9: faint rows were hard to read)
    el.style.background = `rgba(234,130,78,${0.2 * act})`;
    el.style.borderLeftColor = `rgba(234,130,78,${act})`;
    el.style.transform = `scale(${0.96 + 0.04 * act})`;
    const lbl = el.querySelector('.lbl'); lbl.style.background = act > 0.5 ? '#EA824E' : 'transparent'; lbl.style.color = act > 0.5 ? '#1A1720' : '#EA824E';
    el.querySelector('.tick').style.width = '0';   // a tick means built: only Phase 1 has one (i20)
    // the same label on the land, over the phase's site
    const pin = pins[i], v = new ctx.THREE.Vector3(ph.at[0], ctx.groundAt(ph.at[0], ph.at[1]) + 4, -ph.at[1]).project(ctx.camera);
    pin.style.left = `${(v.x + 1) / 2 * innerWidth}px`; pin.style.top = `${(1 - v.y) / 2 * innerHeight}px`;
    pin.style.opacity = String(act * (v.z < 1 ? 1 : 0) * (1 - seg(t, 0.84, 0.86)));
  });
  // the ledger leaves as one piece (panel + text) before the headline comes in
  phaseEls.box.style.opacity = String(seg(t, 0.2, 0.24) * (1 - seg(t, 0.84, 0.86)));   // a short, clean exit
  big.style.opacity = seg(t, 0.03, 0.07) * (1 - seg(t, 0.18, 0.22));
  cap.style.opacity = seg(t, 0.87, 0.9); scrim.style.opacity = seg(t, 0.86, 0.9);
  tag.style.opacity = seg(t, 0.22, 0.3);
}

// In-scene placer for the walk-around view (chapters.html?c=ch04&explore=x,y,heading). Mouse (Mike 2026-10-29):
// left = select a real-world model and drag it along the ground (or use its arrows / turning ring), right = orbit
// the view, middle = pan, wheel = in/out. Then Save. Saving writes
// data/placements.json through the dev server; the engine applies it over its coded PLACE table on every page, so
// the film, the chapters and the deployed tour all pick it up.
// Ground brush (10-29): B toggles painting; left-drag paints the chosen ground type (1–8, 0 = back to automatic),
// [ ] change the brush size; "Save ground" writes data/groundpaint.png (hand fixes over the automatic map).
// Keys: W move · E rotate · Esc deselect · Ctrl+Z undo the last change · Ctrl+S save
import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export async function startPlacer({ E, orbit }) {
  const { camera, scene, renderer, heightAt, PLACE } = E;
  const saved = await fetch('data/placements.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  const edits = JSON.parse(JSON.stringify(saved)), undo = [];
  let sel = null, dirty = false, drag = null, painting = false, stroke = null, groundDirty = false, brushId = 0, brushR = 3;
  const G = E.ground;
  orbit.mouseButtons = { LEFT: null, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE };   // left is for the models
  orbit.enableZoom = false; orbit.screenSpacePanning = true;

  // ---------- navigation that scales with what's under the cursor (Mike: drag + zoom were painfully slow) ----------
  // The controls orbit / pan around their target and size every step by the distance to it; a target a few metres
  // ahead made everything crawl. So each right/middle drag first moves the target out to the depth of the ground
  // under the cursor (the view doesn't jump), and the wheel flies toward / away from that ground point by a share of
  // the distance, so far things come up fast and near things slow down.
  const ndc = new THREE.Vector2(), r0 = new THREE.Raycaster();
  const groundUnder = (cx, cy) => {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set((cx - r.left) / r.width * 2 - 1, -(cy - r.top) / r.height * 2 + 1); r0.setFromCamera(ndc, camera);
    const o = r0.ray.origin, d = r0.ray.direction, above = t => o.y + d.y * t - heightAt(o.x + d.x * t, -(o.z + d.z * t));
    let a = 0, t = 0.5;
    while (t < 3000 && above(t) > 0) { a = t; t += 0.2 + t * 0.04; }
    if (t >= 3000) return null;
    for (let k = 0; k < 20; k++) { const m = (a + t) / 2; if (above(m) > 0) a = m; else t = m; }
    return { t, p: o.clone().addScaledVector(d, t), d: d.clone() };
  };
  document.addEventListener('pointerdown', e => {
    if (e.button !== 1 && e.button !== 2) return;
    const g = groundUnder(e.clientX, e.clientY); if (!g) return;
    const f = new THREE.Vector3(); camera.getWorldDirection(f);
    orbit.target.copy(camera.position).addScaledVector(f, Math.max(2, g.t)); orbit.update();
  }, true);
  document.addEventListener('wheel', e => {
    if (el.contains(e.target)) return;
    e.preventDefault();
    const g = groundUnder(e.clientX, e.clientY), d = g ? g.d : camera.getWorldDirection(new THREE.Vector3());
    const dist = g ? g.t : 60, step = Math.sign(e.deltaY) < 0 ? Math.max(0.3, dist * 0.22) : -Math.max(0.3, dist * 0.28);
    const mv = d.multiplyScalar(step); camera.position.add(mv); orbit.target.add(mv);
    const floor = heightAt(camera.position.x, -camera.position.z) + 0.6;
    if (camera.position.y < floor) { orbit.target.y += floor - camera.position.y; camera.position.y = floor; }   // never under the ground
    orbit.update();
  }, { passive: false });

  // ---------- panel ----------
  const css = document.createElement('style');
  css.textContent = `
  #pl{position:fixed;right:12px;top:12px;width:270px;z-index:50;background:rgba(26,23,32,.92);color:#F2EDE8;
    font:12px/1.45 Inter,system-ui,sans-serif;border:1px solid rgba(234,130,78,.5);border-radius:6px;padding:12px}
  #pl h3{margin:0 0 8px;font:600 11px/1 Inter;letter-spacing:.18em;text-transform:uppercase;color:#EA824E}
  #pl button{background:#2b2733;color:#F2EDE8;border:1px solid #4a4452;border-radius:4px;padding:5px 9px;font:12px Inter;cursor:pointer}
  #pl button:hover{border-color:#EA824E} #pl button.on{background:#EA824E;color:#1A1720;border-color:#EA824E}
  #pl .row{display:flex;gap:6px;align-items:center;margin:7px 0;flex-wrap:wrap} #pl .muted{color:#b5aeb9}
  #pl .sel{font:600 13px Inter;color:#F2EDE8} #pl .st{color:#EA824E}`;
  document.head.appendChild(css);
  const el = document.createElement('div'); el.id = 'pl';
  el.innerHTML = `<h3>Place models</h3>
    <div id="pl-sel" class="muted">Click a building or object to select it.</div>
    <div class="row"><button id="pl-move" class="on">Move (W)</button><button id="pl-rot">Rotate (E)</button><button id="pl-undo">Undo</button></div>
    <div class="row"><button id="pl-save">Save placements</button><span id="pl-st" class="st"></span></div>
    <div class="muted" style="margin-top:6px">Left-click a model to select it, left-drag to slide it along the ground
      (or use its arrows); Rotate shows a ring to turn it. Right-drag = orbit · middle-drag = pan · wheel = in/out.
      Saved moves show in the film and the live tour after the next deploy.</div>
    <div class="row" style="margin-top:10px"><span class="muted">Ground</span>
      <button data-gv="0" class="on">Painted</button><button data-gv="1">Drone</button><button data-gv="2">Satellite</button></div>
    <div id="pl-gr" style="display:${G ? 'block' : 'none'};margin-top:12px;border-top:1px solid #4a4452;padding-top:10px">
      <h3>Paint ground</h3>
      <div class="row"><button id="pl-paint">Paint (B)</button><span class="muted">size</span>
        <input id="pl-size" type="range" min="0.5" max="15" step="0.5" value="3" style="width:90px"><span id="pl-sz" class="muted">3 m</span></div>
      <div id="pl-sw" class="row"></div>
      <div class="row"><button id="pl-gsave">Save ground</button><span id="pl-gst" class="st"></span></div>
    </div>`;
  document.body.appendChild(el);
  const $ = s => el.querySelector(s);
  for (const e of ['pointerdown', 'wheel']) el.addEventListener(e, ev => ev.stopPropagation());
  // ground view toggle (Mike 10-29): painted materials / the drone photo / satellite only (G cycles)
  const setView = v => { E.U.uGroundView.value = v; el.querySelectorAll('[data-gv]').forEach(b => b.classList.toggle('on', +b.dataset.gv === v)); };
  el.querySelectorAll('[data-gv]').forEach(b => b.onclick = () => setView(+b.dataset.gv));
  addEventListener('keydown', e => { if (e.key === 'g' || e.key === 'G') setView((E.U.uGroundView.value + 1) % 3); });

  // ---------- gizmo ----------
  const tc = new TransformControls(camera, renderer.domElement);
  tc.setSpace('world'); tc.setSize(1.1); tc.setRotationSnap(THREE.MathUtils.degToRad(1));
  const helper = tc.getHelper ? tc.getHelper() : tc; scene.add(helper);
  const setMode = m => {
    tc.setMode(m); tc.showY = m === 'rotate'; tc.showX = tc.showZ = m === 'translate';
    $('#pl-move').classList.toggle('on', m === 'translate'); $('#pl-rot').classList.toggle('on', m === 'rotate');
  };
  setMode('translate');
  tc.addEventListener('dragging-changed', e => {
    orbit.enabled = !e.value;
    if (e.value && sel) undo.push({ o: sel, pos: sel.position.clone(), rot: sel.rotation.y });
    if (!e.value) record();
  });
  tc.addEventListener('objectChange', () => { if (sel) { sel.position.y = heightAt(sel.position.x, -sel.position.z); show(); } });

  const info = o => { const { slug, i } = o.userData.place, pl = PLACE[slug][i]; return { slug, i, pl }; };
  const show = () => {
    if (!sel) { $('#pl-sel').innerHTML = 'Click a building or object to select it.'; return; }
    const { slug, i, pl } = info(sel), deg = THREE.MathUtils.radToDeg(sel.rotation.y);
    $('#pl-sel').innerHTML = `<span class="sel">${slug}${pl.variant ? ' · ' + pl.variant : ''}</span> <span class="muted">#${i}</span><br>
      <span class="muted">east ${sel.position.x.toFixed(1)} m · north ${(-sel.position.z).toFixed(1)} m · turn ${deg.toFixed(0)}°</span>`;
  };
  const status = () => { $('#pl-st').textContent = dirty ? 'unsaved changes' : ''; };
  function record() {
    if (!sel) return;
    const { slug, i, pl } = info(sel), v = { x: +sel.position.x.toFixed(2), y: +(-sel.position.z).toFixed(2), rotY: +sel.rotation.y.toFixed(4) };
    Object.assign(pl, v); (edits[slug] ||= {})[i] = v; dirty = true; status(); show();
  }
  const select = o => { sel = o; if (o) tc.attach(o); else tc.detach(); show(); };

  // ---------- left: select, and drag the model along the ground ----------
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(), hit = new THREE.Vector3();
  const aim = e => { const r = renderer.domElement.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera); };
  const pick = () => {
    for (const h of ray.intersectObjects(Object.values(E.models).filter(g => g.visible), true)) {
      let o = h.object; while (o && !o.userData.place) o = o.parent;
      if (o) return { o, at: h.point };
    }
    return null;
  };
  // ---------- ground brush ----------
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.92, 1, 48), new THREE.MeshBasicMaterial({ color: 0xEA824E, transparent: true, opacity: 0.9, depthTest: false }));
  ring.rotation.x = -Math.PI / 2; ring.renderOrder = 30; ring.visible = false; scene.add(ring);
  const sw = n => { const m = G.means[n]; return `rgb(${[m.x, m.y, m.z].map(v => Math.round(255 * Math.pow(v, 1 / 2.2))).join(',')})`; };
  if (G) {
    const names = { lawn: 'Lawn', fairway: 'Fairway', worn: 'Worn grass', yard: 'Yard gravel', road: 'Gravel road', dirt: 'Dirt', forest: 'Forest floor', cobble: 'Creek cobbles' };
    $('#pl-sw').innerHTML = G.names.map((n, i) => `<button data-id="${i}" title="${i + 1}"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;background:${sw(i)}"></span>${names[n] || n}</button>`).join('')
      + `<button data-id="8" title="9"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;background:#2d5560"></span>Water</button>`
      + `<button data-id="255" title="0">Automatic</button>`;
    el.querySelectorAll('#pl-sw button').forEach(b => b.onclick = () => setBrush(+b.dataset.id));
  }
  const setBrush = id => { brushId = id; el.querySelectorAll('#pl-sw button').forEach(b => b.classList.toggle('on', +b.dataset.id === id)); };
  const setPaint = on => { painting = on && !!G; $('#pl-paint')?.classList.toggle('on', painting); ring.visible = false; if (painting) select(null); };
  const setSize = r => { brushR = Math.min(15, Math.max(0.5, r)); $('#pl-size').value = brushR; $('#pl-sz').textContent = `${brushR} m`; };
  if (G) { setBrush(0); $('#pl-paint').onclick = () => setPaint(!painting); $('#pl-size').oninput = e => setSize(+e.target.value); }
  const dab = p => { if (G.paintAt(p.x, -p.z, brushR, brushId)) { groundDirty = true; $('#pl-gst').textContent = 'unsaved ground'; } };
  document.addEventListener('pointermove', e => {
    if (!painting || el.contains(e.target)) { ring.visible = false; return; }
    const g = groundUnder(e.clientX, e.clientY); if (!g) { ring.visible = false; return; }
    ring.visible = true; ring.position.set(g.p.x, g.p.y + 0.15, g.p.z); ring.scale.setScalar(brushR);
    if (stroke) {   // fill the gap since the last dab so fast strokes stay continuous
      const d = g.p.distanceTo(stroke), n = Math.ceil(d / Math.max(0.25, brushR * 0.4));
      for (let k = 1; k <= n; k++) dab(stroke.clone().lerp(g.p, k / n));
      stroke = g.p.clone();
    }
  });
  document.addEventListener('pointerup', () => { stroke = null; });
  async function saveGround() {
    $('#pl-gst').textContent = 'saving…';
    const r = await fetch('api/groundpaint', { method: 'POST', body: await G.paintPNG() }).catch(() => null);
    if (r && r.ok) { groundDirty = false; $('#pl-gst').textContent = 'saved'; } else $('#pl-gst').textContent = 'save failed (dev server?)';
  }
  if (G) $('#pl-gsave').onclick = saveGround;

  document.addEventListener('pointerdown', e => {
    if (e.button === 0 && painting && !el.contains(e.target)) {   // painting takes the left button over from selecting
      const g = groundUnder(e.clientX, e.clientY); if (g) { stroke = g.p.clone(); dab(g.p); }
      return;
    }
    if (e.button !== 0 || tc.dragging || tc.axis || el.contains(e.target)) return;   // the gizmo handles its own drags
    aim(e); const p = pick(); select(p && p.o);
    if (!p) return;
    // slide on a level plane through the point you grabbed, so that point stays under the cursor
    const o = p.o; plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), p.at);
    drag = { off: o.position.clone().sub(p.at), y: p.at.y - o.position.y }; undo.push({ o, pos: o.position.clone(), rot: o.rotation.y });
  });
  document.addEventListener('pointermove', e => {
    if (!drag || !sel) return;
    aim(e); if (!ray.ray.intersectPlane(plane, hit) || hit.distanceTo(camera.position) > 400) return;   // not past the horizon
    sel.position.x = hit.x + drag.off.x; sel.position.z = hit.z + drag.off.z;
    sel.position.y = heightAt(sel.position.x, -sel.position.z); show();
  });
  document.addEventListener('pointerup', () => { if (drag) { drag = null; record(); } });

  // ---------- buttons + keys ----------
  const doUndo = () => {
    const u = undo.pop(); if (!u) return;
    select(u.o); u.o.position.copy(u.pos); u.o.rotation.y = u.rot; record();
  };
  async function save() {
    $('#pl-st').textContent = 'saving…';
    const r = await fetch('api/placements', { method: 'POST', body: JSON.stringify(edits) }).catch(() => null);
    if (r && r.ok) { dirty = false; $('#pl-st').textContent = 'saved'; } else $('#pl-st').textContent = 'save failed (dev server?)';
  }
  $('#pl-move').onclick = () => setMode('translate'); $('#pl-rot').onclick = () => setMode('rotate');
  $('#pl-undo').onclick = doUndo; $('#pl-save').onclick = save;
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); }
    else if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); doUndo(); }
    else if (e.key === 'w' || e.key === 'W') setMode('translate');
    else if (e.key === 'e' || e.key === 'E') setMode('rotate');
    else if (e.key === 'Escape') { select(null); setPaint(false); }
    else if (e.key === 'b' || e.key === 'B') setPaint(!painting);
    else if (painting && e.key === '[') setSize(brushR - (brushR > 3 ? 1 : 0.5));
    else if (painting && e.key === ']') setSize(brushR + (brushR >= 3 ? 1 : 0.5));
    else if (painting && /^[0-9]$/.test(e.key)) setBrush(e.key === '0' ? 255 : +e.key - 1);   // 1–8 ground, 9 water, 0 automatic
  });
  addEventListener('beforeunload', e => { if (dirty || groundDirty) { e.preventDefault(); e.returnValue = ''; } });
}

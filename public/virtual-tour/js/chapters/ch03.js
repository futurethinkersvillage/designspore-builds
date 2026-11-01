// Chapter 3 — "Six seasons in": the camera drops from the aerial to treetop height over the campground core
// (RV sites, office / check-in, main shower house) while the operating stats float in as flat 3D cards on pins.
// Everything shown here exists today.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeBuildings } from '../objects.js';
import { panoStop } from '../panostop.js';

// ---- a forest that stays standing near a low camera (the engine's trees shrink away inside ~420 m) ----
// Same spots and imagery colours as the engine's trees (read back from its instances); a finer conifer inside the
// campground / creek corridor, the engine's own simple shapes everywhere else. Shared by ch03 + ch04 via ctx.
function paint(g, c) { const col = new Float32Array(g.attributes.position.count * 3); for (let i = 0; i < col.length; i += 3) col.set(c, i); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g; }
function fineConifer() {
  const parts = [paint(new THREE.CylinderGeometry(0.03, 0.05, 0.22, 6).translate(0, 0.11, 0), [0.3, 0.21, 0.15])];
  const tiers = [[0.135, 0.3, 0.08, 0.86], [0.115, 0.28, 0.27, 0.94], [0.092, 0.25, 0.45, 1.0], [0.068, 0.22, 0.62, 1.06], [0.045, 0.2, 0.78, 1.12]]; // skinny spruce (Mike)
  for (const [r, h, y, k] of tiers) parts.push(paint(new THREE.ConeGeometry(r, h, 9, 1, true).translate(0, y + h / 2, 0), [k, k, k]));
  return mergeGeometries(parts.map(g => { g = g.index ? g.toNonIndexed() : g; g.deleteAttribute('uv'); return g; }));
}
// the photo's spruces: slim, dark, foliage nearly to the ground, tiers with branch tips, a thin trunk (unit height)
function photoConifer() {
  const parts = [paint(new THREE.CylinderGeometry(0.004, 0.012, 0.3, 6).translate(0, 0.15, 0), [0.16, 0.12, 0.09])];
  for (let i = 0; i < 12; i++) {
    const k = i / 11, r = 0.115 * (1 - k * 0.92), h = 0.13 * (1 - k * 0.4), g = new THREE.ConeGeometry(r, h, 14, 1, true), p = g.attributes.position, v = 0.8 + (i % 3) * 0.14;
    for (let j = 0; j < p.count; j++) if (p.getY(j) < 0) { const f = 0.66 + 0.34 * ((j + i) % 2); p.setXYZ(j, p.getX(j) * f, p.getY(j) - (1 - f) * h * 0.4, p.getZ(j) * f); }
    g.computeVertexNormals(); g.translate(0, 0.05 + k * 0.82 + h / 2, 0); g.rotateY(i * 0.9);
    parts.push(paint(g, [0.19 * v, 0.33 * v, 0.2 * v]));
  }
  return mergeGeometries(parts.map(g => { g = g.index ? g.toNonIndexed() : g; g.deleteAttribute('uv'); return g; }));
}
// open ground around the buildings we model (the drone photo is warped by up to ~30 m, so some tree spots land in them)
const GREEN = new THREE.Color(0x2f4a2a);
const CLEAR = [[-102, 74, 17], [-80, 66, 19], [-90, 88, 12], [-65, 118, 13], [-105, -59, 10], [-102, -78, 8], [-117, -100, 8],
  [-139, -127, 8], [-153, -152, 12], [-100, -139, 10], [-75, 52, 12]];
export function nearForest(ctx, box = [-260, -220, 80, 260]) {
  if (ctx._nearForest) return ctx._nearForest;
  const group = new THREE.Group(); const m = new THREE.Matrix4(), p = new THREE.Vector3(), c = new THREE.Color();
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  // trees right in front of the lens dissolve (dithered, no pop) instead of filling the frame with one cone
  mat.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>
varying float vNear;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
vNear = distance(cameraPosition, (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz);`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying float vNear;`)
      .replace('void main() {', `void main() {`); // no near-camera dissolve: trees stay put (Mike)
  };
  ctx.trees.children.forEach((src, k) => {
    const n = src.count, inBox = [], out = [];
    for (let i = 0; i < n; i++) { src.getMatrixAt(i, m); p.setFromMatrixPosition(m); const x = p.x, y = -p.z;
      if (CLEAR.some(([cx, cy, r]) => Math.hypot(x - cx, y - cy) < r)) continue;
      (x > box[0] && x < box[2] && y > box[1] && y < box[3] ? inBox : out).push(i); }
    const geoOut = src.geometry.clone(); geoOut.deleteAttribute('aBase');
    for (const [list, geo] of [[out, geoOut], [inBox, k === 0 ? fineConifer() : geoOut]]) {
      if (!list.length) continue;
      const im = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((i, j) => { src.getMatrixAt(i, m); im.setMatrixAt(j, m); if (src.instanceColor) { src.getColorAt(i, c); im.setColorAt(j, c.lerp(GREEN, 0.45).multiplyScalar(1.1)); } });
      im.frustumCulled = false; group.add(im);
    }
  });
  ctx.scene.add(group); ctx._nearForest = group;
  return group;
}

// ---- stat cards: flat, face-up cards on pins (same language as labels.js), sized to hold steady on screen ----
// Each card lies face-up and is turned once to the heading it's seen from (fixed orientation, not a billboard).
export function makeStatCard(ctx, { at, big, small, heading, lift = 30, off = [0, 0], color = '#F2EDE8' }) {
  const s = 4, c = document.createElement('canvas'), g = c.getContext('2d');
  const bigFs = 64 * s, smFs = 15 * s, pad = 16 * s;
  const st = small.toUpperCase().split('').join(' ');
  g.font = `500 ${bigFs}px Cormorant`; const bw = big ? g.measureText(big).width : 0;
  g.font = `500 ${smFs}px Inter`; const sw = g.measureText(st).width;
  c.width = Math.ceil(Math.max(bw, sw) + pad * 2.6); c.height = Math.ceil((big ? bigFs * 0.92 : 0) + smFs + 34 * s);
  const grd = g.createLinearGradient(0, 0, c.width, 0);
  grd.addColorStop(0, 'rgba(26,23,32,0.34)'); grd.addColorStop(0.75, 'rgba(26,23,32,0.12)'); grd.addColorStop(1, 'rgba(26,23,32,0)');
  g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = color;
  const yBig = big ? bigFs * 0.82 : 0;
  if (big) { g.font = `500 ${bigFs}px Cormorant`; g.fillText(big, pad, yBig + 4 * s); }
  const yLine = yBig + 14 * s;
  g.fillRect(0, yLine, Math.max(bw, sw) + pad * 1.8, 1.6 * s);
  g.globalAlpha = 0.86; g.font = `500 ${smFs}px Inter`; g.fillText(st, pad, yLine + smFs + 9 * s); g.globalAlpha = 1;
  const tex = new ctx.THREE.CanvasTexture(c); tex.colorSpace = ctx.THREE.SRGBColorSpace; tex.anisotropy = 16;
  const T = ctx.THREE, aspect = c.width / c.height, hl = yLine / c.height;
  // origin = the hairline's left end (the pin lands there); unit height, scaled per frame
  const geo = new T.PlaneGeometry(aspect, 1).translate(aspect / 2, -(hl - 0.5), 0);
  const mat = new T.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, side: T.DoubleSide, opacity: 0 });
  const card = new T.Mesh(geo, mat); card.renderOrder = 24; card.rotation.order = 'YXZ';
  card.rotation.set(-Math.PI / 2, -heading * Math.PI / 180, 0);
  const gy = ctx.heightAt(at[0], at[1]);
  const ring = new T.Mesh(new T.RingGeometry(1.6, 2.3, 40).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ color, transparent: true, depthTest: false, depthWrite: false, opacity: 0 }));
  ring.position.set(at[0], gy + 0.4, -at[1]); ring.renderOrder = 23;
  const pinGeo = new T.BufferGeometry(); pinGeo.setAttribute('position', new T.Float32BufferAttribute(new Float32Array(6), 3));
  const pin = new T.Line(pinGeo, new T.LineBasicMaterial({ color, transparent: true, depthTest: false, depthWrite: false, opacity: 0 }));
  pin.renderOrder = 23; pin.frustumCulled = false;
  const group = new T.Group(); group.add(card, ring, pin); ctx.scene.add(group);
  const top = new T.Vector3(at[0] + off[0], gy + lift, -(at[1] + off[1]));
  return {
    group,
    // op 0..1 (eased by the caller); the pin grows up from the ring, then the card settles onto it
    update(op, camera, screenFrac = 0.17) {
      group.visible = op > 0.002; if (!group.visible) return;
      const grow = Math.min(1, op * 1.6), cardOp = ctx.rig.smooth(Math.max(0, (op - 0.25) / 0.75));
      const p = pinGeo.attributes.position;
      p.setXYZ(0, at[0], gy + 0.4, -at[1]);
      p.setXYZ(1, at[0] + (top.x - at[0]) * grow, gy + 0.4 + (top.y - gy - 0.4) * grow, -at[1] + (top.z + at[1]) * grow);
      p.needsUpdate = true;
      card.position.set(top.x, top.y + (1 - cardOp) * 2.5, top.z);
      const d = camera.position.distanceTo(top), h = 2 * d * Math.tan(camera.fov * Math.PI / 360) * screenFrac;
      // foreshortening from the real view angle onto the card (the camera flies low now): stretch to stay readable
      const sinA = Math.abs(camera.position.y - top.y) / Math.max(d, 1e-3);
      const tilt = Math.min(1 / Math.max(sinA, 0.3), 1.8);   // capped: more stretch made the flat cards read as standing up
      card.scale.set(h, h * tilt, 1);
      ring.scale.setScalar(Math.max(1, d / 160));
      mat.opacity = cardOp; ring.material.opacity = grow * 0.35; pin.material.opacity = grow * 0.5;   // quiet anchor, the card is the point
    },
  };
}

// The campground world both chapters share (placed once, cached on ctx): the detailed models, the extruded
// footprints minus the ones a model replaces (and open areas that aren't buildings), and the near forest.
export function campWorld(ctx) {
  if (ctx._campWorld) return ctx._campWorld;
  ctx._campWorld = (async () => {
    const { placeModel, heightAt, L, scene } = ctx;
    await Promise.all(['office', 'shower_house', 'bunk_cabin', 'sauna', 'dome'].map(m => placeModel(m)));
    const drop = { public_areas: [1, 3, 4, 5, 6], bathroom_shower_house: [0, 1], accomodations_for_rent: [1, 2, 3, 4, 5, 6, 7] };
    const L2 = {};
    for (const k of ['utility_buildings', 'accomodations_for_rent', 'public_areas', 'bathroom_shower_house'])
      L2[k] = (L[k] || []).filter((_, i) => !(drop[k] || []).includes(i));
    const blocks2 = makeBuildings(L2, heightAt); scene.add(blocks2);
    blocks2.material.color.set(0x7d6a5c);   // the unmodelled sheds read as weathered wood, not white placeholders
    return { blocks2, forest: nearForest(ctx) };
  })();
  return ctx._campWorld;
}

export const meta = { id: 'ch03', title: 'Six seasons in', seconds: 25.25, animated: true, blend: 7.35 / 25.25, lift: 0, blendTurn: true };   // one straight descent, no arc
// film seconds -> the keys' own time (their fractions were written for a 19.5 s chapter): 4 s more for the descent from the
// aerial (Mike 10-31: it whipped round), 1.8 s more holding on the title. Then the camera arrives exactly as the hold begins.
const clock = t => { const x = t * meta.seconds; return x < 4 ? 0 : x < 7.35 ? (x - 4) / 3.35 * 0.172 : x < 12.35 ? 0.172 + (x - 7.35) / 5 * 0.166 : 0.338 + (x - 12.35) / 12.9 * 0.662; };

let rig, cap, capPan, blocks2, forest, pano;
// what the shower-house 360 sees that the survey's forest doesn't have here, as [heading, metres from the photo's spot, height]
// read off the photo, so the 3D and the photo match through the fades.
const PHOTO_TREES = [[164, 34, 24], [171, 44, 27], [177, 52, 22], [183, 56, 29], [189, 54, 26], [195, 60, 31], [201, 58, 28], [207, 62, 33], [213, 66, 30], [220, 70, 32],   // behind the house, past the RV
  [158, 28, 18], [152, 30, 20],   // the near ones, far left of the arrival view
  [8, 14, 24], [16, 11, 26], [28, 13, 20], [38, 15, 22]];   // the spruce + bush at the right of the view it ends on
export async function setup(ctx) {
  const { rig: R, heightAt } = ctx;
  ({ blocks2, forest } = await campWorld(ctx));

  const g = (x, y, up = 0) => [x, y, heightAt(x, y) + up];
  // high over the creek looking SW down the whole campground strip, then down to treetops at the office + shower house
  const A = g(-70, 10), B = g(-70, 60), C = g(-88, 70);
  // calm: one descending push over the campground, then down into the real 360° photo by the shower house, which
  // turns from the shower house to the office and the forest-school playground (Mike: get close, use the 360s)
  const gA = ctx.groundAt;
  pano = await panoStop(ctx, 'shower');
  ctx.clearTreesNear([[5, 122], [-8, 118], [-22, 114], [-36, 110]].map(([x, y]) => new THREE.Vector3(x, gA(x, y) + 22, -y)), 13);   // the title shot's sight line: pines filled its left side
  {
    const m = new THREE.Matrix4(), c = new THREE.Color(), im = new THREE.InstancedMesh(photoConifer(), new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }), PHOTO_TREES.length);
    PHOTO_TREES.forEach(([h, d, H], i) => { const a = h * Math.PI / 180, x = pano.at[0] + Math.sin(a) * d, y = pano.at[1] + Math.cos(a) * d; m.makeScale(H, H, H).setPosition(x, heightAt(x, y) - 0.2, -y); im.setMatrixAt(i, m); im.setColorAt(i, c.setScalar(0.85 + (i % 4) * 0.1)); });
    im.frustumCulled = false; im.userData.always = true; ctx.scene.add(im); ctx.photoTrees = im;   // the whole film (Mike 10-31: they vanished as ch04 began)
    ctx.clearTreesNear([40, 48, 56, 64].map(d => new THREE.Vector3(pano.at[0] + Math.sin(353.4 * Math.PI / 180) * d, 0, -(pano.at[1] + Math.cos(353.4 * Math.PI / 180) * d))), 4);   // the one tree standing where the photo has open ground
  }
  rig = R.makeRig([
    // camera economy (Mike 10-29: "superfluous camera movements, and camera timing"): ONE descent onto the campground,
    // a real HOLD while the title and the two cards read, then into the 360 photo with a slow, short look-around
    // (times in seconds / 19.5)
    [0.00, -45, 110, gA(-45, 110), 230, 255, -36, 45],   // already facing the way it will land: one turn, in the blend
    [0.172, -60, 105, gA(-60, 105), 66, 255, -30, 46],      // the campground: shower house, office, RV loop (i7: lower, so the push into the photo is short)
    [0.338, -61, 105, gA(-61, 105), 63, 254, -29, 46],      // hold while both stat cards read (i7: ~1 s each was too short)
    // one eased push (~1.8 s) straight to the photographer's spot, no intermediate key (i3: half a second of lurch)
    pano.key(0.431, 210, -9),   // facing the shower house — the camera STOPS here
    pano.key(0.492, 210, -9),   // still: the photo fades in (Mike 10-29: never fade while moving)
    // (Mike 10-30: "360 photos should pan more … probably 180") a slow 180° pan, clockwise: the shower house, the office
    // and golf carts, the forest-school playground, then round to the RVs and the trees (~22°/s)
    pano.key(0.903, 335, -3),   // (past here it is only a bush)
    pano.key(0.933, 335, -3),   // still: the photo fades out here, BEFORE the chapter ends (Mike 10-30: ~frame 1450 the
    pano.key(1.00, 335, -3),    // photo vanished mid-move as ch04 took over — a cut). Facing NE, as ch04 opens
  ]);

  cap = document.createElement('div'); cap.className = 'cap';
  cap.innerHTML = '<div class="eyebrow">Six seasons in</div><h1>A working resort</h1>' +
    // the numbers belong to the title (Mike 10-31, frame 1202: lying on the ground in perspective they looked out of place)
    '<div style="display:flex;margin-top:18px">' +
    [['45', 'RV sites'], ['~3,000', 'Guests a year']].map(([n, l], i) => `<div style="${i ? 'margin-left:26px;padding-left:26px;border-left:1px solid rgba(242,237,232,.45)' : ''}"><div style="font:500 clamp(30px,3.8vw,50px)/1 Cormorant,Georgia,serif">${n}</div><div style="margin-top:7px;font:500 11.5px/1.2 Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.9">${l}</div></div>`).join('') + '</div>';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap);
  // a line during the photo's pan (i12: 11 s without words), as it passes the office and the playground
  capPan = document.createElement('div'); capPan.className = 'cap';
  capPan.innerHTML = '<div class="eyebrow">The campground</div><h1 style="white-space:nowrap">Shower house, golf carts, playground</h1>';
  capPan.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(capPan);
}

export function update(t, ctx) {
  const s = ctx.rig.seg; t = clock(t);
  ctx.blocks.visible = false; blocks2.visible = false; ctx.trees.visible = true; forest.visible = false; // one forest for the whole film (no swapping)
  ctx.U.uWaterAmt.value = 1 - 0.8 * s(t, 0.12, 0.37);
  rig.apply(ctx.camera, t);
  // the photo is gone again before the chapter ends (the next chapter's blend starts from this spot in 3D)
  pano.set(s(t, 0.437, 0.487) * (1 - s(t, 0.94, 0.985)));
  cap.style.opacity = s(t, 0.148, 0.185) - s(t, 0.33, 0.35);   // off before the photo: the photo carries its own tag
  cap.style.transform = `translateY(${(1 - s(t, 0.135, 0.23)) * 14}px)`;
  capPan.style.opacity = s(t, 0.6, 0.64) - s(t, 0.84, 0.88);
}

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
  grd.addColorStop(0, 'rgba(26,23,32,0.66)'); grd.addColorStop(0.75, 'rgba(26,23,32,0.28)'); grd.addColorStop(1, 'rgba(26,23,32,0)');
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

export const meta = { id: 'ch03', title: 'Six seasons in', seconds: 12, animated: true };

let rig, cap, blocks2, forest, cards, pano;
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
  rig = R.makeRig([
    [0.00, -45, 110, gA(-45, 110), 280, 338, -38, 45],
    [0.42, -66, 84, gA(-66, 84) + 1, 80, 318, -24, 48],
    pano.key(0.60, 292, -5),
    pano.key(0.66, 294, -5),
    pano.key(0.86, 12, -3),
    // the photo fades while the camera climbs (it sits at infinity, so the climb doesn't shift it): no eye-level 3D
    [1.00, -64, 96, gA(-64, 96) + 1, 70, 20, -26, 48],
  ]);
  cards = [
    makeStatCard(ctx, { at: [-36, 104], big: '45', small: 'RV sites', heading: 334, lift: 3 }),   // headings = the camera's, so the text reads straight
    makeStatCard(ctx, { at: [-58, 92], big: '~3,000', small: 'Guests a year', heading: 322, lift: 2.5 }),
  ];

  cap = document.createElement('div'); cap.className = 'cap';
  cap.innerHTML = '<div class="eyebrow">Six seasons in</div><h1>A working resort</h1>' +
    '<div style="margin-top:14px;font:500 12.5px/1.5 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.9">RV &amp; golf · operating 6 seasons</div>';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap);
}

export function update(t, ctx) {
  const s = ctx.rig.seg;
  ctx.blocks.visible = false; blocks2.visible = false; ctx.trees.visible = true; forest.visible = false; // one forest for the whole film (no swapping)
  ctx.U.uWaterAmt.value = 1 - 0.8 * s(t, 0.2, 0.6);
  rig.apply(ctx.camera, t);
  // the photo is gone again before the chapter ends (the next chapter's blend starts from this spot in 3D)
  pano.set(s(t, 0.55, 0.64) * (1 - s(t, 0.86, 0.97)));
  cards[0].update(s(t, 0.08, 0.2) * (1 - s(t, 0.3, 0.36)), ctx.camera);    // one card at a time (they overlapped)
  cards[1].update(s(t, 0.36, 0.44) * (1 - s(t, 0.52, 0.58)), ctx.camera);
  cap.style.opacity = s(t, 0.22, 0.34) - s(t, 0.88, 0.97);
  cap.style.transform = `translateY(${(1 - s(t, 0.22, 0.38)) * 14}px)`;
}

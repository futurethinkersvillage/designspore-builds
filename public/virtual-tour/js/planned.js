// What's planned, drawn ON TOP of the real land: amber linework draped on the terrain + upright labels.
// Drawn without depth testing so trees never hide it — the plan stays readable after the drawing turns real.
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { polysOf, linesOf, centroid } from './sheet.js';

const OUTLINES = ['maker_space', 'event_gazebo', 'event_space', 'festival_grounds', 'farmland', 'farm_greenhouses', 'farm_buildings'];
const TRAILS = ['discovery_trail'];
const ZOMES = ['cabins', 'lake_cabins'];

export function makePlanned(L, heightAt, color, pill = { bg: 'rgba(43,43,98,0.9)', text: '#F2EDE8' }) {
  const pos = [];
  const lift = 3;
  const seg = (a, b) => {
    // densify so the line follows the ground
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 8));
    for (let k = 0; k < n; k++) {
      const p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n];
      const q = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n];
      pos.push(p[0], heightAt(p[0], p[1]) + lift, -p[1], q[0], heightAt(q[0], q[1]) + lift, -q[1]);
    }
  };
  const path = ring => { for (let i = 0; i < ring.length - 1; i++) seg(ring[i], ring[i + 1]); };
  for (const n of OUTLINES) for (const f of L[n] || []) for (const poly of polysOf(f)) path(poly[0]);
  for (const n of TRAILS) for (const f of L[n] || []) for (const l of linesOf(f)) {
    for (let i = 0; i < l.length - 1; i += 2) seg(l[i], l[Math.min(i + 1, l.length - 1)]); // dotted: every other step
  }
  for (const n of ZOMES) for (const f of L[n] || []) for (const poly of polysOf(f)) {
    const r = poly[0], c = [r.reduce((a, p) => a + p[0], 0) / r.length, r.reduce((a, p) => a + p[1], 0) / r.length];
    const circle = Array.from({ length: 13 }, (_, k) => [c[0] + 4.5 * Math.cos(k / 12 * Math.PI * 2), c[1] + 4.5 * Math.sin(k / 12 * Math.PI * 2)]);
    path(circle);
  }
  const geo = new LineSegmentsGeometry(); geo.setPositions(pos);
  const mat = new LineMaterial({ color, linewidth: 2.2, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
  const lines = new LineSegments2(geo, mat);
  lines.renderOrder = 20; lines.frustumCulled = false;

  // labels: upright pills that keep a constant size on screen
  const labels = new THREE.Group();
  const add = (at, text, rise) => {
    if (!at) return;
    const c = document.createElement('canvas'), g = c.getContext('2d'), fs = 44;
    g.font = `600 ${fs}px Inter`;
    const t = text.toUpperCase().split('').join(' '), w = Math.ceil(g.measureText(t).width) + 44, h = fs + 30;
    c.width = w; c.height = h;
    g.fillStyle = pill.bg; g.beginPath(); g.roundRect(0, 0, w, h, h / 2); g.fill();
    g.strokeStyle = color; g.lineWidth = 3; g.beginPath(); g.roundRect(1.5, 1.5, w - 3, h - 3, (h - 3) / 2); g.stroke();
    g.font = `600 ${fs}px Inter`; g.fillStyle = pill.text; g.textBaseline = 'middle'; g.fillText(t, 22, h / 2 + 2);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0, depthTest: false, depthWrite: false, sizeAttenuation: false }));
    const gy = heightAt(at[0], at[1]);
    s.center.set(0.5, 0); s.position.set(at[0], gy + rise, -at[1]);
    leaders.push(at[0], gy + 3, -at[1], at[0], gy + rise, -at[1]);   // a thin pin from the label down to its place
    s.userData.aspect = w / h; s.renderOrder = 21;
    labels.add(s);
  };
  const leaders = [];
  const cen = n => L[n]?.length ? centroid(L[n]) : null;
  // pins of different heights so the labels stack instead of piling up
  add(cen('maker_space'), 'Maker space', 170);
  add(cen('cabins'), 'Creekside zomes', 55);
  add(cen('farmland'), 'Farm', 115);
  add(cen('lake_cabins'), 'Lakeside zomes', 95);
  add(cen('festival_grounds'), 'Festival grounds', 90);
  add(cen('discovery_trail'), 'Art trail', 210);
  const pinGeo = new THREE.BufferGeometry(); pinGeo.setAttribute('position', new THREE.Float32BufferAttribute(leaders, 3));
  const pins = new THREE.LineSegments(pinGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
  pins.renderOrder = 20; pins.frustumCulled = false;

  const group = new THREE.Group(); group.add(lines, pins, labels);
  return {
    group,
    update(opacity, width, height, showPills = true) {
      mat.opacity = opacity; pins.material.opacity = opacity * 0.8; mat.resolution.set(width, height);
      const k = 0.032; // label height as a fraction of the screen
      labels.visible = pins.visible = showPills;
      for (const s of labels.children) { s.material.opacity = opacity; s.scale.set(k * s.userData.aspect, k, 1); }
      group.visible = opacity > 0.001;
    },
  };
}

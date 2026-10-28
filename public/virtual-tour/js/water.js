// Creeks, rivers and lakes as a "water mask" the ground shader reads (land.js): blue = water, red/green = the
// downstream direction (so ripples flow the right way; still water has none). Painting water into the ground,
// instead of separate meshes, keeps it exactly on the terrain at every height the land rises through.
// Data: BC Freshwater Atlas (data/water.json via tools/prep_water.py) + the site plan's lake and golf ponds.
import * as THREE from 'three';
import { polysOf } from './sheet.js';

// stream order -> width in metres (order 1 = the smallest headwater creeks)
const WIDTH = [0, 1.5, 2.2, 3.2, 4.5, 7, 12, 20, 26];

export function makeWaterMask(water, L, { half = 3000, res = 2 } = {}) {
  const n = Math.round(2 * half / res);
  const c = document.createElement('canvas'); c.width = c.height = n;
  const g = c.getContext('2d');
  const X = x => (x + half) / res, Y = y => (half - y) / res;
  g.lineCap = g.lineJoin = 'round';

  const fillPolys = rings => {
    g.fillStyle = 'rgb(128,128,255)'; // still water: no flow
    g.beginPath(); for (const ring of rings) ring.forEach((p, i) => i ? g.lineTo(X(p[0]), Y(p[1])) : g.moveTo(X(p[0]), Y(p[1]))); g.fill('evenodd');
  };
  for (const poly of water.lakes) fillPolys(poly);
  for (const poly of water.rivers) fillPolys(poly);
  // the site plan's lake (its 'ponds_water_avoid' layer is no-build buffers around water, not water)
  for (const f of L.lakes || []) for (const poly of polysOf(f)) fillPolys(poly);

  // streams, small first so big rivers draw on top; skip unnamed first-order gullies (mostly dry most of the year)
  const streams = water.streams.filter(s => s.o >= 2 || s.n).sort((a, b) => a.o - b.o);
  for (const s of streams) {
    g.lineWidth = Math.max(1, WIDTH[Math.min(s.o, 8)] / res);
    for (let i = 0; i < s.p.length - 1; i++) {
      const [a, b] = [s.p[i], s.p[i + 1]], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      g.strokeStyle = `rgb(${Math.round(128 + 127 * dx / l)},${Math.round(128 + 127 * dy / l)},255)`;
      g.beginPath(); g.moveTo(X(a[0]), Y(a[1])); g.lineTo(X(b[0]), Y(b[1])); g.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.anisotropy = 8;
  return { tex, rect: new THREE.Vector4(-half, -half, half, half) };
}

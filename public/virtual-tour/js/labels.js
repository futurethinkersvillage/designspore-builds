// Place names as flat 3D callouts: a small ring on the place, a thin pin up, and a label card lying face-up in the
// air (a horizontal plane, fixed orientation — it doesn't turn to the camera). Cards are sized in metres, so they
// read like print on the sheet and like signage floating over the land once it rises.
// Existing places in cream, planned ones in amber. Drawn on top (no depth test) so hills never cut them.
import * as THREE from 'three';
import { centroid } from './sheet.js';

const CARD_H = 46; // metres: card height in the world

function card(text, color, sub) {
  const s = 4, fs = 30 * s, subFs = 15 * s, padX = 14 * s;
  const c = document.createElement('canvas'), g = c.getContext('2d');
  const t = text.toUpperCase().split('').join(' '), st = sub ? sub.toUpperCase().split('').join(' ') : '';
  g.font = `600 ${fs}px Inter`; const tw = g.measureText(t).width;
  g.font = `500 ${subFs}px Inter`; const sw = sub ? g.measureText(st).width : 0;
  c.width = Math.ceil(Math.max(tw, sw) + padX * 2); c.height = Math.ceil(fs + (sub ? subFs + 18 * s : 0) + 30 * s);
  const y0 = fs + 6 * s;
  // soft dark plate so the text holds over bright ground, without reading as a box
  const grd = g.createLinearGradient(0, 0, c.width, 0);
  grd.addColorStop(0, 'rgba(26,23,32,0.62)'); grd.addColorStop(1, 'rgba(26,23,32,0.0)');
  g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = color; g.textBaseline = 'alphabetic';
  g.font = `600 ${fs}px Inter`; g.fillText(t, padX, y0);
  // hairline: the pin lands on its left end
  g.fillRect(0, y0 + 10 * s, Math.max(tw, sw) + padX * 1.6, 2.2 * s);
  if (sub) { g.globalAlpha = 0.72; g.font = `500 ${subFs}px Inter`; g.fillText(st, padX, y0 + 10 * s + subFs + 10 * s); g.globalAlpha = 1; }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16;
  const h = CARD_H * c.height / (fs + 30 * s), w = h * c.width / c.height;
  const geo = new THREE.PlaneGeometry(w, h).translate(w / 2, -h * (y0 + 11 * s) / c.height + h / 2, 0); // origin = hairline's left end
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; // face up; text reads west→east with north at the top
  m.renderOrder = 22;
  return m;
}

export function makeLabels(L, heightAt, { existing = '#F2EDE8', planned = '#EA824E' } = {}) {
  const P = name => (L.pano_points || []).find(f => (f.p.name || '').startsWith(name))?.c;
  const cen = n => L[n]?.length ? centroid(L[n]) : null;
  // [anchor, text, planned?, [offset east, north, lift] in metres]
  const spots = [
    [P('Gazebo'), 'Gazebo', 0, [-150, 40, 40]], [cen('golf_course'), 'Golf · disc golf', 0, [-330, 60, 40]],
    [P('Campsite'), 'Campground', 0, [60, 120, 60]], [P('The Dome'), 'Dome', 0, [-170, -40, 40]], [cen('lakes'), 'Lake', 0, [-190, -90, 40]],
    [cen('maker_space'), 'Maker space', 1, [70, 70, 90]], [cen('cabins'), 'Creekside zomes', 1, [110, -10, 30]],
    [cen('lake_cabins'), 'Lakeside zomes', 1, [110, -70, 30]], [cen('farmland'), 'Farm', 1, [-200, 120, 60]],
    [cen('festival_grounds'), 'Festival grounds', 1, [140, -60, 30]], [cen('discovery_trail'), 'Art trail', 1, [200, 150, 60]],
  ];
  const groups = [new THREE.Group(), new THREE.Group()], items = [[], []];
  for (const [at, text, kind, off] of spots) {
    if (!at) continue;
    const gy = heightAt(at[0], at[1]), lx = at[0] + off[0], ly = at[1] + off[1], lift = off[2];
    const m = card(text, kind ? planned : existing, kind ? 'Planned' : null);
    m.position.set(lx, gy + lift, -ly);
    const ringGeo = new THREE.RingGeometry(5, 7.5, 32).rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: kind ? planned : existing, transparent: true, depthTest: false, depthWrite: false }));
    ring.position.set(at[0], gy + 1, -at[1]); ring.renderOrder = 21;
    groups[kind].add(m, ring);
    items[kind].push({ m, ring, gy, lift, at, l: [lx, ly] });
  }
  const pins = [0, 1].map(k => {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(items[k].length * 6), 3));
    const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: k ? planned : existing, transparent: true, depthTest: false, depthWrite: false }));
    l.renderOrder = 21; l.frustumCulled = false; groups[k].add(l); return l;
  });
  const group = new THREE.Group(); group.add(...groups);
  return {
    group,
    // opacities for existing + planned callouts; shown(h) = ground height as currently displayed (rises with the cut)
    // camera + fov: cards stay flat and face up, but scale with distance so they hold a steady size on screen
    update(opExisting, opPlanned, shown, camera) {
      const lens = Math.tan(camera.fov * Math.PI / 360);
      // still flat and facing up, but stretched along its depth to offset the camera's tilt so it stays legible
      const tilt = Math.min(1 / Math.max(Math.abs(Math.sin(camera.rotation.x)), 0.42), 2.3);
      [opExisting, opPlanned].forEach((op, k) => {
        groups[k].visible = op > 0.001;
        if (!groups[k].visible) return;
        const pos = pins[k].geometry.attributes.position;
        items[k].forEach((it, i) => {
          const base = shown(it.gy);
          it.m.position.y = base + it.lift; it.ring.position.y = base + 1;
          const k = THREE.MathUtils.clamp(camera.position.distanceTo(it.m.position) * lens / 700, 0.35, 3);
          it.m.scale.set(k, k * tilt, 1); it.ring.scale.setScalar(Math.min(k, 1.5));
          it.m.material.opacity = op; it.ring.material.opacity = op * 0.9;
          pos.setXYZ(i * 2, it.at[0], base + 1, -it.at[1]); pos.setXYZ(i * 2 + 1, it.l[0], base + it.lift, -it.l[1]);
        });
        pos.needsUpdate = true; pins[k].material.opacity = op * 0.75;
      });
    },
  };
}

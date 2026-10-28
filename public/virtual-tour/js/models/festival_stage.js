// Planned festival stage (layer event_space). CONCEPT ONLY: drawn as a lit blueprint (amber edge lines over a dark,
// see-through body) so it never reads as built. Deck, back wall, a truss arch and a hanging lighting rig.
// Units metres, origin = ground-level centre, +Y up, the stage front (audience side) faces +Z.
import * as THREE from 'three';

export const meta = {
  name: 'Festival stage (planned)', layer: 'event_space', match: 'polygon centroid, front toward the meadow (SE)',
  footprint: [18, 12], height: 10,
  place: { x: -193, y: -242, rotY: Math.PI / 4 },
  sources: ['data/layers.json event_space (about 24 x 35 m)'],
  notes: 'Concept. Blueprint-wire look: amber EdgesGeometry lines + dark translucent fill + glowing deck edge. Not a design.',
};

export function build() {
  const g = new THREE.Group();
  const line = new THREE.LineBasicMaterial({ color: 0xEA824E, transparent: true, opacity: 0.95, fog: false });
  const body = new THREE.MeshBasicMaterial({ color: 0x1A1720, transparent: true, opacity: 0.55, depthWrite: false, fog: false });
  const deckGlow = new THREE.MeshBasicMaterial({ color: 0xffb07a, transparent: true, opacity: 0.85, fog: false });
  const box = (w, h, d, x, y, z, fill = body) => {
    const geo = new THREE.BoxGeometry(w, h, d).translate(x, y, z);
    g.add(new THREE.Mesh(geo, fill), new THREE.LineSegments(new THREE.EdgesGeometry(geo), line));
  };
  box(18, 1.4, 12, 0, 0.7, 0);                       // deck
  box(18, 0.12, 12, 0, 1.46, 0, deckGlow);            // lit stage floor
  box(18, 7, 0.4, 0, 4.9, -5.8);                      // back wall
  for (const x of [-8.6, 8.6]) for (const z of [-5.6, 5.6]) box(0.5, 9, 0.5, x, 4.5, z); // truss towers
  box(18, 0.6, 0.6, 0, 9.2, 5.6); box(18, 0.6, 0.6, 0, 9.2, -5.6);   // front + back truss beams
  box(0.6, 0.6, 12, -8.6, 9.2, 0); box(0.6, 0.6, 12, 8.6, 9.2, 0);
  for (let i = 0; i < 6; i++) box(0.5, 0.5, 0.7, -6 + i * 2.4, 8.6, 5.6, deckGlow); // lamps on the front truss
  return g;
}

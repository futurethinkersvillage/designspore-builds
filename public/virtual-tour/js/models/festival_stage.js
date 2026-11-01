// Planned festival stage (layer event_space), drawn as a real built stage (Mike 10-29: "model it up, and add a lot
// more lights and festival effects"; the concept-blueprint look is retired): a timber-clad deck with steps, black
// box-truss towers and a roof grid carrying a white tensile canopy, a big LED wall, line-array speakers, a
// and a lighting rig of moving heads whose beams the chapter animates (userData.heads).
// Units metres, origin = ground-level centre, +Y up, the stage front (audience side) faces +Z.
import * as THREE from 'three';

export const meta = {
  name: 'Festival stage (planned)', layer: 'event_space', match: 'polygon centroid, front toward the meadow (SE)',
  footprint: [20, 14], height: 13,
  place: { x: -193, y: -242, rotY: Math.PI / 4 },
  sources: ['data/layers.json event_space (about 24 x 35 m)'],
  notes: 'Planned. Mid-size festival stage. update(g, t, on) animates the LED wall and the moving-head beams.',
};

const BEAM_COLORS = [0xEA824E, 0xb46aa8, 0xd9785f, 0xffd18a, 0x6a5cd8, 0xc86a8a];   // brand: amber, mauve, terracotta, warm white, indigo, rose (i7: no cyan/green)

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group(), hi = lod !== 'low';
  const M = (color, rough = 0.8, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
  const deckM = M(0x3a2e26, 0.9), skirtM = M(0x141416, 0.95), truss = M(0x1b1c1f, 0.45, 0.6), canopyM = M(0xf2efe9, 0.7, 0, { side: THREE.DoubleSide });
  const spk = M(0x111113, 0.6, 0.2), grille = M(0x2a2b2e, 0.9);
  const box = (m, w, h, d, x, y, z, parent = g) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); parent.add(o); return o; };
  const W = 20, D = 14, HD = 1.6, HT = 11;

  // deck on a black skirt, timber top, two side stair sets
  box(skirtM, W, HD - 0.1, D, 0, (HD - 0.1) / 2, 0);
  box(deckM, W + 0.2, 0.1, D + 0.2, 0, HD, 0);
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) box(deckM, 1.6, 0.06, 0.35, s * (W / 2 + 0.9), 0.4 * (i + 1) - 0.03, D / 2 - 1 - i * 0.35);

  // box-truss: 4 towers + perimeter grid (each member = a lattice-looking dark box with edges)
  const member = (w, h, d, x, y, z) => { const o = box(truss, w, h, d, x, y, z); if (hi) o.add(new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry), new THREE.LineBasicMaterial({ color: 0x55585e }))); return o; };
  const TX = W / 2 - 0.3, TZ = D / 2 - 0.3;
  for (const x of [-TX, TX]) for (const z of [-TZ, TZ]) member(0.45, HT, 0.45, x, HT / 2, z);
  for (const z of [-TZ, TZ, 0]) member(W - 0.2, 0.45, 0.45, 0, HT, z);
  for (const x of [-TX, TX]) member(0.45, 0.45, D - 0.2, x, HT, 0);

  // lattice bracing on the towers and the grid, so the truss reads as truss, a front-of-house mix tent, festoon lights out over the crowd (i16: "a wire cage")
  if (hi) {
    const brM = new THREE.MeshBasicMaterial({ color: 0x4a4d52 }), dm = new THREE.Object3D(), br = [];
    for (const x of [-TX, TX]) for (const z of [-TZ, TZ]) for (let y = 0.4; y < HT - 0.6; y += 0.9) for (const [ox, oz, ry] of [[0.24, 0, 0], [-0.24, 0, 0], [0, 0.24, Math.PI / 2], [0, -0.24, Math.PI / 2]]) br.push([x + ox, y, z + oz, ry, Math.round(y * 10) % 2 ? 0.8 : -0.8]);
    for (const z of [-TZ, TZ, 0]) for (let x = -W / 2 + 0.6; x < W / 2 - 0.4; x += 0.9) for (const oy of [-0.24, 0.24]) br.push([x, HT + oy, z, Math.PI / 2, 0]);
    const bm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.035, 0.72, 0.035), brM, br.length);
    br.forEach(([x, y, z, ry, tilt], i) => { dm.position.set(x, y, z); dm.rotation.set(0, ry, tilt); dm.updateMatrix(); bm.setMatrixAt(i, dm.matrix); }); g.add(bm);
    const fz = D / 2 + 15, fx = 27,   /* out of the closing shot: its black roof cut across the corner */ tent = M(0x17181b, 0.9), desk = M(0x26282c, 0.6);
    for (const x of [-2.6, 2.6]) for (const z of [-2, 2]) box(truss, 0.09, 2.7, 0.09, fx + x, 1.35, fz + z);
    const fr = new THREE.Mesh(new THREE.ConeGeometry(4, 1.1, 4).rotateY(Math.PI / 4).scale(1, 1, 0.8), tent); fr.position.set(fx, 3.25, fz); g.add(fr);
    box(desk, 3.4, 1.0, 0.9, fx, 0.5, fz); const scr = new THREE.MeshBasicMaterial({ color: 0xffb27a, toneMapped: false }); box(scr, 0.8, 0.5, 0.03, fx - 0.8, 1.3, fz - 0.2); box(scr, 0.8, 0.5, 0.03, fx + 0.8, 1.3, fz - 0.2);
    const bulbs = [];
    for (const [px, back] of [[-W / 2 - 13, 0], [-W / 2 - 4, 8], [0, 12], [W / 2 + 4, 8], [W / 2 + 13, 0]]) {
      const pz = D / 2 + 34 - back; box(truss, 0.12, 7, 0.12, px, 3.5, pz);
      for (const s of [-1, 1]) for (let k = 0; k <= 22; k++) { const u = k / 22, ax = s * TX, ay = HT - 1, az = TZ; bulbs.push([ax + (px - ax) * u, ay + (7 - ay) * u - Math.sin(u * Math.PI) * 1.8, az + (pz - az) * u]); }
    }
    const bl = new THREE.InstancedMesh(new THREE.SphereGeometry(0.11, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffd9a0, toneMapped: false }), bulbs.length);
    bulbs.forEach(([x, y, z], i) => { dm.position.set(x, y, z); dm.rotation.set(0, 0, 0); dm.updateMatrix(); bl.setMatrixAt(i, dm.matrix); }); g.add(bl);
  }

  // tensile canopy: a saddle-shaped white membrane over the grid
  const cg = new THREE.PlaneGeometry(W + 2, D + 2.5, 24, 16).rotateX(-Math.PI / 2), cp = cg.attributes.position;
  for (let i = 0; i < cp.count; i++) { const x = cp.getX(i) / (W / 2 + 1), z = cp.getZ(i) / (D / 2 + 1.25); cp.setY(i, HT + 0.5 + 0.9 * (x * x - z * z) + 0.3 * z + 0.9); }
  cg.computeVertexNormals(); const canopy = new THREE.Mesh(cg, canopyM); canopy.position.z = 0.6; g.add(canopy);

  // LED wall on the back truss: an animated canvas texture (the chapter calls update)
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const wallM = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(13, 6.5), wallM); wall.position.set(0, HD + 4.1, -TZ + 0.35); g.add(wall);
  box(spk, 13.4, 6.9, 0.25, 0, HD + 4.1, -TZ + 0.18);

  // line arrays flown on the front towers + subs on the ground
  for (const s of [-1, 1]) {
    for (let i = 0; i < 6; i++) { const c = box(spk, 1.1, 0.42, 0.8, s * (TX + 0.9), HT - 1.3 - i * 0.44, TZ - 0.2); c.rotation.x = -0.05 * i; }
    for (let i = 0; i < 2; i++) box(grille, 1.3, 1.1, 1.1, s * (W / 2 - 1.6 - i * 1.4), 0.55, D / 2 + 0.8);
  }

  // the rig's own light on the deck, canopy and towers (the scene is near-dark at night; update sets intensity)
  const lights = [];
  for (const [x, y, z, c] of [[-5, HT - 1, 4, 0xffb27a], [5, HT - 1, 4, 0xd88cff], [0, 3, D / 2 + 6, 0xffd7b0]]) {
    const l = new THREE.PointLight(c, 0, 45, 2); l.position.set(x, y, z); g.add(l); lights.push(l);
  }

  // moving heads on the front + mid truss; each carries a soft additive beam cone (opacity / aim set by update)
  const heads = [];
  // a narrow shaft that fades out along its length (gradient map: bright at the lamp, black = nothing when additive)
  const beamGeo = new THREE.CylinderGeometry(0.12, 1.5, 34, 16, 1, true).translate(0, -17, 0);
  const gc = document.createElement('canvas'); gc.width = 4; gc.height = 128; const gx = gc.getContext('2d'), gg = gx.createLinearGradient(0, 0, 0, 128);
  gg.addColorStop(0, '#fff'); gg.addColorStop(0.3, '#666'); gg.addColorStop(0.6, '#000'); gx.fillStyle = gg; gx.fillRect(0, 0, 4, 128);   // gone well before the end: no bright ellipse where it meets the grass (i7)
  const beamTex = new THREE.CanvasTexture(gc);
  const n = hi ? 10 : 6;
  for (let i = 0; i < n; i++) {
    const x = -W / 2 + 1.6 + i * (W - 3.2) / (n - 1), z = i % 2 ? TZ : 0;
    const pivot = new THREE.Group(); pivot.position.set(x, HT - 0.5, z); g.add(pivot);
    box(M(0x0e0e10, 0.5, 0.3), 0.45, 0.55, 0.45, 0, 0, 0, pivot);
    const col = new THREE.Color(BEAM_COLORS[i % BEAM_COLORS.length]);
    const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: col, map: beamTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    beam.material.onBeforeCompile = sh => {
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vEdge;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvec3 bN = normalize(normalMatrix * normal), bV = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz); vEdge = abs(dot(bN, bV));');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vEdge;').replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.rgb *= pow(vEdge, 2.2) * 1.6;');
    };
    beam.renderOrder = 25; pivot.add(beam);
    heads.push({ pivot, beam, ph: i * 0.9, col });
  }
  // a warm wash on the deck
  const washM = new THREE.MeshBasicMaterial({ color: 0xffb07a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const wash = new THREE.Mesh(new THREE.PlaneGeometry(W - 1, D - 1).rotateX(-Math.PI / 2), washM); wash.position.y = HD + 0.08; g.add(wash);

  g.userData = { heads, wall: { cv, tex }, wash: washM, lights };
  return g;
}

// t = seconds, on = 0..1 (show intensity)
export function update(g, t, on = 1) {
  const { heads, wall, wash, lights } = g.userData;
  for (const l of lights) l.intensity = on * 900;
  for (const h of heads) {
    // slow sweeps: pan + tilt out over the crowd and up into the sky, in loose unison
    h.pivot.rotation.set(-(1.45 + 0.55 * Math.sin(t * 0.7 + h.ph)), 0, 0.6 * Math.sin(t * 0.45 + h.ph * 1.7));   // from down on the crowd to up past the canopy
    h.beam.material.opacity = on * (0.2 + 0.07 * Math.sin(t * 2.3 + h.ph));
  }
  wash.opacity = on * 0.35;
  // LED wall: drifting brand-colour bands with a soft horizon line
  const c = wall.cv.getContext('2d'), w = wall.cv.width, h = wall.cv.height;
  const gr = c.createLinearGradient(0, 0, w, h), k = (t * 0.08) % 1;
  // brand hues only (amber ↔ mauve ↔ indigo), drifting (i7: the rainbow screen was off-palette)
  const hue = a => { const p = (k + a) % 1, w = 0.5 - 0.5 * Math.cos(p * 2 * Math.PI); return 22 + (w < 0.5 ? w * 2 * (318 - 382) : (318 - 382) + (w - 0.5) * 2 * (250 - 318)); };
  gr.addColorStop(0, `hsl(${(hue(0) + 360) % 360},75%,${18 + 30 * on}%)`); gr.addColorStop(0.5, `hsl(${(hue(0.33) + 360) % 360},55%,${14 + 24 * on}%)`); gr.addColorStop(1, `hsl(${(hue(0.66) + 360) % 360},65%,${16 + 26 * on}%)`);
  c.fillStyle = gr; c.fillRect(0, 0, w, h);
  c.fillStyle = `rgba(255,215,170,${0.6 * on})`; for (let i = 0; i < 9; i++) c.fillRect(0, h * 0.62 + Math.sin(t * 1.3 + i) * 3 + i * 2, w, 1);
  c.fillStyle = `rgba(255,240,220,${0.9 * on})`; c.font = '600 44px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('2027', w / 2, h * 0.38);
  wall.tex.needsUpdate = true;
}

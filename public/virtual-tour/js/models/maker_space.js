// PLANNED Maker Space (concept): a timber workshop with a big glazed gable, two roll-up doors open and warm light
// inside, and a peek at the kit — CNC router table, laser cutter, a row of 3D printers, and a small robot arm on a bench.
// It is a concept, not a building that exists. Sized to the `maker_space` polygon (≈13 × 18 m, long axis north–south).
import * as THREE from 'three';

export const meta = {
  name: 'Maker Space (concept)', layer: 'maker_space', match: 0, footprint: [12, 17], height: 8.5,
  place: { x: -32.5, y: 320, rotY: 0 }, // gable + doors face +Z = south, toward the campus
  sources: ['Deck: "Frontier hands, AI-native minds"', 'OUTLINE.md ch. 8'],
  notes: 'Concept massing in Pacific-Northwest timber style. Emissive interior so it reads at dusk.',
};

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group();
  const W = 12, D = 17, Hw = 4.6, pitch = 3.6;
  const timber = new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.85 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2b2a30, roughness: 0.6, metalness: 0.2 });
  const roofM = new THREE.MeshStandardMaterial({ color: 0x3a3b40, roughness: 0.5, metalness: 0.35 });
  const glow = new THREE.MeshStandardMaterial({ color: 0xffc58a, emissive: 0xffa55a, emissiveIntensity: 1.1, roughness: 0.4 });
  const glass = new THREE.MeshStandardMaterial({ color: 0xfff0d6, emissive: 0xffb36b, emissiveIntensity: 0.8, transparent: true, opacity: 0.85 });
  const slab = new THREE.MeshStandardMaterial({ color: 0x8d8a83, roughness: 0.95 });

  // concrete apron + floor
  const pad = new THREE.Mesh(new THREE.BoxGeometry(W + 3, 0.25, D + 5), slab); pad.position.set(0, 0.12, 1.5); g.add(pad);

  // walls (long sides with a clerestory band of light)
  for (const s of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.3, Hw, D), timber); wall.position.set(s * W / 2, Hw / 2, 0); g.add(wall);
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.7, D - 2), glass); band.position.set(s * W / 2, Hw - 0.6, 0); g.add(band);
  }
  // back gable wall
  const back = new THREE.Mesh(new THREE.BoxGeometry(W, Hw, 0.3), timber); back.position.set(0, Hw / 2, -D / 2); g.add(back);
  const gableShape = new THREE.Shape([new THREE.Vector2(-W / 2, 0), new THREE.Vector2(W / 2, 0), new THREE.Vector2(0, pitch)]);
  const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: 0.3, bevelEnabled: false });
  const gb = new THREE.Mesh(gableGeo, timber); gb.position.set(0, Hw, -D / 2 - 0.15); g.add(gb);
  // front: glazed gable over two open roll-up doors, a timber post between them
  const gf = new THREE.Mesh(gableGeo, glass); gf.position.set(0, Hw, D / 2 - 0.15); g.add(gf);
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(W, 0.6, 0.35), timber); lintel.position.set(0, Hw - 0.3, D / 2); g.add(lintel);
  for (const x of [-W / 2 + 0.25, 0, W / 2 - 0.25]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, Hw, 0.4), timber); p.position.set(x, Hw / 2, D / 2); g.add(p); }
  for (const x of [-W / 4, W / 4]) { // rolled-up doors: a dark drum under the lintel
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, W / 2 - 0.9, 10).rotateZ(Math.PI / 2), dark);
    drum.position.set(x, Hw - 0.85, D / 2 - 0.1); g.add(drum);
  }
  // roof: two slabs with an overhang
  const rl = Math.hypot(W / 2 + 0.8, pitch + 0.5);
  for (const s of [-1, 1]) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(rl, 0.25, D + 1.6), roofM);
    r.position.set(s * (W / 4 + 0.2), Hw + pitch / 2 - 0.05, 0); r.rotation.z = -s * Math.atan2(pitch, W / 2); g.add(r);
  }
  // warm interior volume (reads through the open doors and clerestory)
  const inner = new THREE.Mesh(new THREE.BoxGeometry(W - 0.8, Hw - 0.5, D - 0.8), new THREE.MeshBasicMaterial({ color: 0x3a2618, side: THREE.BackSide }));
  inner.position.set(0, (Hw - 0.5) / 2 + 0.25, 0); g.add(inner);
  const lights = new THREE.Mesh(new THREE.BoxGeometry(W - 2, 0.12, D - 3), glow); lights.position.set(0, Hw - 0.45, 0); g.add(lights);

  if (lod === 'high') {
    // kit near the doors: CNC table, laser cutter, printer row, robot arm on a bench
    const steel = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.4, metalness: 0.6 });
    const ply = new THREE.MeshStandardMaterial({ color: 0xd8b98a, roughness: 0.8 });
    const cnc = new THREE.Group();
    const bed = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 1.5), steel); bed.position.y = 0.7; cnc.add(bed);
    const sheet = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 1.3), ply); sheet.position.y = 1.17; cnc.add(sheet);
    const gantry = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 1.6), dark); gantry.position.set(0.3, 1.5, 0); cnc.add(gantry);
    cnc.position.set(-W / 4, 0.25, D / 2 - 3); g.add(cnc);
    const laser = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 0.9), dark); laser.position.set(W / 4 + 1.2, 0.75, D / 2 - 2.5); g.add(laser);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.8), glow); lid.position.set(W / 4 + 1.2, 1.28, D / 2 - 2.5); g.add(lid);
    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 0.8), ply); bench.position.set(W / 4 - 1.0, 0.7, D / 2 - 4.2); g.add(bench);
    for (let i = 0; i < 4; i++) { const pr = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.45), steel); pr.position.set(W / 4 - 2.2 + i * 0.8, 1.4, D / 2 - 4.2); g.add(pr); }
    // a small robot arm: base, two links, gripper
    const arm = new THREE.Group(); arm.position.set(-W / 4 + 1.5, 1.15, D / 2 - 4.6);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.25, 12), dark); arm.add(base);
    const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.8, 0.14), new THREE.MeshStandardMaterial({ color: 0xea824e, roughness: 0.5 }));
    l1.position.set(0, 0.5, 0); l1.rotation.z = 0.35; arm.add(l1);
    const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.12), l1.material); l2.position.set(0.3, 0.9, 0); l2.rotation.z = -0.4; arm.add(l2);
    const benchArm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.8), ply); benchArm.position.set(-W / 4 + 1.5, 0.7, D / 2 - 4.6); g.add(benchArm);
    g.add(arm);
    // (no light-pool disc on the apron: in daylight it read as a stray beige oval — reviewers)
  }
  return g;
}

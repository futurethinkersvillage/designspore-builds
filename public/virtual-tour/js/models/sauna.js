// Wood-fired cedar barrel sauna by the creek — Wells Gray Golf & RV Resort (Portal.Place).
// Ø2.0 m × 2.5 m cedar barrel (≈70 staves) with two stainless bands, a dark shingle-membrane roof over the top
// ~105°, a 0.5 m front porch (staves run past the recessed glass door; a small bench each side; silver rim trim),
// a stainless chimney rising up the back wall from a square heat shield, sitting on two cradles on a
// 2.4 × 3.6 m timber platform (front landing), with a black deck box beside it.
// Origin = ground centre of the platform; +Z = door/porch side (faces west toward the creek on site).
import * as THREE from 'three';

export const meta = {
  name: 'Cedar barrel sauna',
  slug: 'sauna',
  layer: null,
  match: null,
  footprint: [2.4, 3.6],
  height: 3.7,
  // No sauna polygon exists (nearest feature, accomodations_for_rent #1 at 10.7 m, is a 10×7 m footprint —
  // far too big). Placed on the "Sauna" photo point; door faces ~W (bearing 270°) toward the creek, derived
  // from the evening-sun lighting in the June 2025 photos (back face in shade, front face sunlit at ~19:52 PDT).
  place: { x: -104.76, y: -59.22, rotY: -Math.PI / 2 },
  sources: [
    'Photos/Sauna/PXL_20250629_025949584-EDIT.jpg (back + side: chimney, heat shield, roof, bands, platform, deck box, creek behind)',
    'Photos/Sauna/PXL_20250629_030045918-EDIT.jpg (back view, creek to the side)',
    'Photos/Sauna/Sauna.jpg (front: porch, glass door, benches, silver rim trim, front landing on blocks)',
  ],
  notes: 'Placement is a best guess (no polygon; ortho predates the sauna). Size from photo proportions '
    + '(length ≈1.25× diameter, standard Ø2.0 m porch-model barrel). Winter-2024 photo shows it at an earlier site.',
};

const R = 1.0, LEN = 2.5, PORCH = 0.5;
const PLAT_W = 2.4, PLAT_L = 3.6, PLAT_H = 0.28;
const ZB = -1.45, ZF = ZB + LEN;          // barrel back / front rim (z)
const CY = PLAT_H + 0.16 + R;             // barrel axis height (sits on cradles)

function cedarTexture(boards = 8, w = 256, h = 64, vertical = true) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d');
  const tones = ['#d3a576', '#d9ad7f', '#cc9d6e', '#ddb488', '#d0a273', '#d6aa7b', '#c99a6b', '#dbb183'];
  const n = vertical ? w : h, bw = n / boards;
  for (let i = 0; i < boards; i++) {
    g.fillStyle = tones[i % tones.length];
    if (vertical) g.fillRect(i * bw, 0, bw, h); else g.fillRect(0, i * bw, w, bw);
    g.fillStyle = 'rgba(80,48,25,0.4)';
    if (vertical) g.fillRect(i * bw, 0, Math.max(1, bw * 0.07), h); else g.fillRect(0, i * bw, w, Math.max(1, bw * 0.07));
    // a knot or two
    g.fillStyle = 'rgba(110,60,30,0.5)';
    const kx = vertical ? i * bw + bw * 0.5 : (i * 53) % w, ky = vertical ? (i * 29) % h : i * bw + bw * 0.5;
    g.beginPath(); g.ellipse(kx, ky, 2, 3, 0, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

function box(w, h, d, mat, x, y, z, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); parent.add(m); return m;
}

export function build({ lod = 'high' } = {}) {
  const hi = lod !== 'low';
  const g = new THREE.Group(); g.name = 'sauna';
  const seg = hi ? 48 : 16;

  // ---------- platform ----------
  const timber = new THREE.MeshStandardMaterial({ color: 0xc0a47e, roughness: 0.9 });
  const timberDark = new THREE.MeshStandardMaterial({ color: 0x9a805f, roughness: 0.95 });
  let deckTop = timber;
  if (hi) {
    const t = cedarTexture(10, 256, 64, true); t.repeat.set(PLAT_W / 1.4, 1);
    deckTop = new THREE.MeshStandardMaterial({ map: t, color: 0xd2cbc0, roughness: 0.9 });
  }
  const plat = new THREE.Mesh(new THREE.BoxGeometry(PLAT_W, 0.2, PLAT_L), [timber, timber, deckTop, timber, timber, timber]);
  plat.position.y = PLAT_H - 0.1; g.add(plat);
  for (const x of [-PLAT_W / 2 + 0.1, PLAT_W / 2 - 0.1]) for (const z of [-PLAT_L / 2 + 0.1, 0, PLAT_L / 2 - 0.1])
    box(0.14, PLAT_H - 0.2 + 0.001, 0.14, timberDark, x, (PLAT_H - 0.2) / 2, z, g);       // blocks
  if (hi) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x55524d, roughness: 1 });
    box(0.9, 0.012, 0.55, mat, 0, PLAT_H + 0.006, ZF + 0.32, g);                         // door mat on landing
  }

  // ---------- cradles ----------
  for (const z of [ZB + 0.45, ZF - 0.65]) box(1.35, 0.4, 0.12, timberDark, 0, PLAT_H + 0.2, z, g);

  // ---------- barrel ----------
  const staveTex = hi ? cedarTexture(8, 256, 64, true) : null;
  if (staveTex) staveTex.repeat.set(9, 1);
  const cedar = new THREE.MeshStandardMaterial({ map: staveTex, color: hi ? 0xffffff : 0xc89766, roughness: 0.8, side: THREE.DoubleSide });
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(R, R, LEN, seg, 1, true), cedar);
  shell.rotation.x = Math.PI / 2; shell.position.set(0, CY, (ZB + ZF) / 2); g.add(shell);

  // end walls: back flush (3 cm in), front recessed by the porch depth; vertical boards
  const wallTex = hi ? cedarTexture(8, 256, 256, true) : null;
  if (wallTex) wallTex.repeat.set(1.6, 1);
  const wallM = new THREE.MeshStandardMaterial({ map: wallTex, color: hi ? 0xffffff : 0xc5935f, roughness: 0.8, side: THREE.DoubleSide });
  const back = new THREE.Mesh(new THREE.CircleGeometry(R - 0.005, seg), wallM);
  back.position.set(0, CY, ZB + 0.03); back.rotation.y = Math.PI; g.add(back);
  const front = new THREE.Mesh(new THREE.CircleGeometry(R - 0.005, seg), wallM);
  front.position.set(0, CY, ZF - PORCH); g.add(front);
  const endGrain = new THREE.MeshStandardMaterial({ color: 0xdcbd96, roughness: 0.85, side: THREE.DoubleSide });
  const backRim = new THREE.Mesh(new THREE.RingGeometry(R - 0.045, R, seg), endGrain);
  backRim.position.set(0, CY, ZB); g.add(backRim);
  const trim = new THREE.MeshStandardMaterial({ color: 0xc9cdd1, roughness: 0.35, metalness: 0.7, side: THREE.DoubleSide });
  const frontRim = new THREE.Mesh(new THREE.RingGeometry(R - 0.05, R + 0.012, seg), trim);
  frontRim.position.set(0, CY, ZF + 0.002); g.add(frontRim);

  // stainless bands
  const steel = new THREE.MeshStandardMaterial({ color: 0xdfe3e7, roughness: 0.28, metalness: 0.35 });
  if (hi) for (const z of [ZB + 0.45, ZF - 0.75]) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.008, R + 0.008, 0.035, seg, 1, true), steel);
    b.rotation.x = Math.PI / 2; b.position.set(0, CY, z); g.add(b);
  }

  // roof: dark membrane/shingle rows over the top (three rows, the top one lapping over the sides)
  const roofM = new THREE.MeshStandardMaterial({ color: 0x22272d, roughness: 0.55, metalness: 0.15, side: THREE.DoubleSide });
  const rows = hi ? [[-0.92, -0.28, R + 0.014], [0.28, 0.92, R + 0.014], [-0.33, 0.33, R + 0.026]] : [[-0.92, 0.92, R + 0.02]];
  for (const [a0, a1, rr] of rows) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, LEN + 0.06, hi ? 8 : 6, 1, true, Math.PI + a0, a1 - a0), roofM);
    c.rotation.x = Math.PI / 2; c.position.set(0, CY, (ZB + ZF) / 2); g.add(c);
  }
  if (hi) for (const [z, ry] of [[ZB - 0.031, Math.PI], [ZF + 0.031, 0]]) {      // black end flashing over the rims
    const f = new THREE.Mesh(new THREE.RingGeometry(R - 0.03, R + 0.035, 12, 1, Math.PI / 2 - 0.92, 1.84), roofM);
    f.position.set(0, CY, z); f.rotation.y = ry; g.add(f);
  }

  // ---------- porch: door, benches, slatted floor ----------
  const doorFrame = new THREE.MeshStandardMaterial({ color: 0xd9b07c, roughness: 0.7 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x2a2724, roughness: 0.08, metalness: 0.6 });
  const zw = ZF - PORCH;
  box(0.74, 1.72, 0.05, doorFrame, 0, CY - 0.83 + 0.86 + 0.02, zw + 0.025, g);
  box(0.6, 1.58, 0.03, glass, 0, CY - 0.83 + 0.86 + 0.02, zw + 0.05, g);
  if (hi) {
    box(0.025, 0.14, 0.03, steel, 0.24, CY + 0.02, zw + 0.075, g);                   // handle
    for (const s of [-1, 1]) {
      box(0.34, 0.04, 0.4, doorFrame, s * 0.62, CY - 0.2, zw + 0.24, g);              // bench seat
      box(0.05, 0.42, 0.05, doorFrame, s * 0.5, CY - 0.41, zw + 0.4, g);               // bench leg
    }
    box(1.05, 0.03, PORCH - 0.04, doorFrame, 0, CY - R + 0.2, zw + PORCH / 2, g);     // porch floor slats
  }

  // ---------- chimney up the back wall ----------
  const px = -0.15, pz = ZB - 0.14, pr = 0.075, yTop = CY + R + 1.0, yShield = CY - 0.32;
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(pr, pr, yTop - yShield, hi ? 12 : 6), steel);
  pipe.position.set(px, (yTop + yShield) / 2, pz); g.add(pipe);
  box(0.4, 0.34, 0.06, steel, px, yShield, ZB - 0.02, g);                             // square wall thimble / heat shield
  box(0.16, 0.16, 0.14, steel, px, yShield + 0.02, ZB - 0.08, g);                    // stub through the wall
  if (hi) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(pr + 0.03, pr + 0.015, 0.14, 12), steel);
    cap.position.set(px, yTop + 0.07, pz); g.add(cap);
    const lid = new THREE.Mesh(new THREE.ConeGeometry(pr + 0.06, 0.08, 12), steel);
    lid.position.set(px, yTop + 0.2, pz); g.add(lid);
    const def = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.22, 3), steel);         // drip deflector under shield
    def.rotation.x = Math.PI; def.position.set(px, yShield - 0.27, ZB - 0.06); g.add(def);
    box(0.05, 0.04, 0.16, steel, px, CY + 0.85, ZB - 0.07, g);                        // wall bracket
  }

  // ---------- black deck box beside the platform (wood / supplies) ----------
  if (hi) {
    const black = new THREE.MeshStandardMaterial({ color: 0x1d1d1f, roughness: 0.6 });
    box(0.6, 0.58, 1.15, black, -PLAT_W / 2 - 0.45, 0.29, ZB + 0.35, g);
    box(0.64, 0.05, 1.19, black, -PLAT_W / 2 - 0.45, 0.6, ZB + 0.35, g);
  }
  return g;
}

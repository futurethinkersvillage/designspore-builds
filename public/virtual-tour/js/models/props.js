// Small real things seen up close in the campground (placed on the drone photo, checked against Playground/Kids on
// Trampoline.jpg, the shower-house 360 and Campsite.JPG): the in-ground trampoline, the tetherball pole, the little
// play fort, golf carts, picnic tables and the log bumpers along the road. variant = kind; size = length for 'logs'.
import * as THREE from 'three';

export const meta = { name: 'Campground props', footprint: [5, 5], height: 2.5, notes: 'Origin = ground centre; long things along z.' };

const M = (color, rough = 0.8, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
const wood = M(0x8a6a4a, 0.9), steel = M(0x6f7378, 0.5, 0.5), blue = M(0x1d55b8, 0.6), black = M(0x161616, 0.7), white = M(0xeeeeea, 0.5), red = M(0xa63a2a, 0.8);
const box = (g, m, w, h, d, x, y, z, ry = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.rotation.y = ry; g.add(o); return o; };

export function build({ lod = 'high', variant = 'picnic', size = 10 } = {}) {
  const g = new THREE.Group(), seg = lod === 'low' ? 10 : 24;
  if (variant === 'trampoline') {
    // A standard 14 ft backyard trampoline on legs (Playground/Kids on Trampoline.jpg): black mat ~0.85 m up,
    // blue pad over the springs, galvanised top rail, safety net, and 8 W-shaped legs: two uprights from the rail down
    // to a straight base tube on the ground with a small rise in the middle.
    const H = 0.85, RR = 2.15, galv = M(0xb9bdc1, 0.45, 0.35);   // light galvanised tube, as in the photo
    const rail = new THREE.Mesh(new THREE.TorusGeometry(RR, 0.024, 6, seg * 3), galv); rail.rotation.x = Math.PI / 2; rail.position.y = H; g.add(rail);
    const mat = new THREE.Mesh(new THREE.CircleGeometry(1.84, seg * 2), black); mat.rotation.x = -Math.PI / 2; mat.position.y = H + 0.01; g.add(mat);
    const pad = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.24, seg * 3), blue); pad.rotation.x = -Math.PI / 2; pad.position.y = H + 0.05; g.add(pad);
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(2.24, 2.24, 0.12, seg * 3, 1, true), blue); skirt.position.y = H; g.add(skirt);
    for (let i = 0; i < 8; i++) {          // 8 legs (Mike 2026-10-29): the usual 4 plus one in each gap
      const a = Math.PI / 4 + i * Math.PI / 4, d = 0.22;
      const P1 = new THREE.Vector3(Math.cos(a - d) * RR, 0, Math.sin(a - d) * RR), P2 = new THREE.Vector3(Math.cos(a + d) * RR, 0, Math.sin(a + d) * RR);
      const at = (t, y) => P1.clone().lerp(P2, t).setY(y);
      const curve = new THREE.CatmullRomCurve3([at(0, H), at(0, 0.25), at(0.08, 0.04), at(0.3, 0.03), at(0.5, 0.15), at(0.7, 0.03), at(0.92, 0.04), at(1, 0.25), at(1, H)], false, 'centripetal');
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, lod === 'low' ? 16 : 48, 0.021, 6), galv));
    }
    // safety enclosure, back on (Mike 2026-10-29; a net shows in the shower-house 360): a foam-sleeved pole at each
    // leg, rising ~1.8 m above the mat, with a black mesh net hung inside the pad
    const sleeve = M(0x1d55b8, 0.7);
    for (let i = 0; i < 8; i++) {
      const a = Math.PI / 4 + i * Math.PI / 4 - 0.22, x = Math.cos(a) * 2.27, z = Math.sin(a) * 2.27;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.15, 8), galv); pole.position.set(x, H + 0.78, z); g.add(pole);
      const foam = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.55, 10), sleeve); foam.position.set(x, H + 0.95, z); g.add(foam);
    }
    const net = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1.75, seg * 3, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }));
    net.position.y = H + 0.92; g.add(net);
    const top = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.012, 4, seg * 3), black); top.rotation.x = Math.PI / 2; top.position.y = H + 1.8; g.add(top);
  } else if (variant === 'tetherball') {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.5, seg), blue); foot.position.y = 0.05; g.add(foot);   // reaches below the ground, so it sits on any slope (Mike 10-31, frame 2262); the worn patch is in data/groundpaint.png
    box(g, M(0x2a2a2c, 0.5, 0.4), 0.06, 3, 0.06, 0, 1.5, 0); const ball = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), M(0xe8c23a, 0.5)); ball.position.set(0.3, 1.8, 0); g.add(ball);
  } else if (variant === 'fort') {         // small timber play fort with a slide
    for (const x of [-1.2, 1.2]) for (const z of [-1, 1]) box(g, wood, 0.12, 2.4, 0.12, x, 1.2, z);
    box(g, wood, 2.6, 0.1, 2.2, 0, 1.2, 0); box(g, red, 2.8, 0.08, 2.4, 0, 2.45, 0);
    const slide = box(g, M(0x2f8a3c, 0.5), 0.6, 0.06, 2.4, 0, 0.65, 2.0); slide.rotation.x = 0.5;
  } else if (variant === 'golfcart') {
    box(g, white, 1.2, 0.5, 2.4, 0, 0.55, 0); box(g, M(0x2a2a2a, 0.6), 1.0, 0.45, 0.6, 0, 0.95, -0.2);
    box(g, white, 1.25, 0.06, 1.7, 0, 1.95, -0.1);
    for (const s of [-1, 1]) for (const z of [-0.85, 0.85]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 10), black); w.rotation.z = Math.PI / 2; w.position.set(s * 0.6, 0.22, z); g.add(w); }
    for (const s of [-1, 1]) for (const z of [-0.85, 0.7]) box(g, steel, 0.04, 1.1, 0.04, s * 0.55, 1.4, z);
  } else if (variant === 'golfnet') {      // the golf-ball net between the playground and the fairway (Mike 10-29; a
    // straight dark line of poles + netting on the drone photo): steel poles every ~5.5 m, ~8 m tall, black mesh,
    // a top cable and a bottom rail; runs from the origin along +z for `size` m
    const H = 8, n = Math.max(2, Math.round(size / 5.5)), netM = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.9, transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false });
    netM.userData.noSurface = true;
    for (let i = 0; i <= n; i++) { const z = i * size / n; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, H, 8), M(0x4f6a4a, 0.5, 0.3)); p.position.set(0, H / 2, z); g.add(p); }
    const net = new THREE.Mesh(new THREE.PlaneGeometry(size, H - 0.4), netM); net.rotation.y = Math.PI / 2; net.position.set(0, H / 2 + 0.2, size / 2); g.add(net);
    box(g, black, 0.03, 0.03, size, 0, H - 0.05, size / 2); box(g, black, 0.05, 0.08, size, 0, 0.12, size / 2);
  } else if (variant === 'garden') {       // the real permaculture garden by the gazebo (Garden and Food/Garden.jpg):
    // 3 × 3 raised timber beds on wood chips, rows of cabbage, kale and greens (i8: the card pointed at bare gravel)
    const chips = new THREE.Mesh(new THREE.PlaneGeometry(10, 15), M(0x7a5a3e, 1)); chips.rotation.x = -Math.PI / 2; chips.position.y = 0.03; g.add(chips);
    const soil = M(0x3b2a1e, 1), crops = [M(0x5f8a3a, 0.8), M(0x3f6a4a, 0.8), M(0x7a4a6a, 0.8), M(0x8aa04a, 0.8)];
    const leaf = new THREE.IcosahedronGeometry(0.22, 1);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const x = (i - 1) * 3, z = (j - 1) * 4.6;
      for (const s of [-1, 1]) { box(g, wood, 0.08, 0.45, 3.6, x + s * 0.6, 0.22, z); }
      for (const s of [-1, 1]) box(g, wood, 1.28, 0.45, 0.08, x, 0.22, z + s * 1.8);
      box(g, soil, 1.12, 0.36, 3.5, x, 0.2, z);
      const m = crops[(i * 3 + j) % 4], n = lod === 'low' ? 4 : 8;
      for (const dx of [-0.3, 0, 0.3]) for (let k = 0; k < n; k++) {
        const o = new THREE.Mesh(leaf, m); o.position.set(x + dx, 0.44, z - 1.55 + k * 3.1 / (n - 1)); o.scale.set(1, 0.7 + ((i + j + k) % 3) * 0.15, 1); g.add(o);
      }
    }
  } else if (variant === 'shelter') {      // the campground's red timber picnic shelter (Campsite/19.jpg, 20.jpg): six posts with
    // knee braces on gravel, a steep brown shingle gable with a boarded end, a picnic table and a stone fire ring under it
    // (rebuilt 10-31 from the same photos: four posts, not six; the gable boarded in with two dark red panels; open ground under it, a stove and two steel rings)
    const stain = M(0x9c3f28, 0.8), shingle = M(0x5f4c3f, 0.95), W = 4.2, D = 5.0, H = 2.55, R = 1.75, OX = 0.65, OZ = 0.55, slope = Math.atan2(R, W / 2 + OX), L0 = Math.hypot(W / 2 + OX, R);
    for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) {
      box(g, stain, 0.22, H, 0.22, x, H / 2, z);
      const along = box(g, stain, 0.12, 0.12, 1.25, x, H - 0.42, z - Math.sign(z) * 0.44); along.rotation.x = Math.sign(z) * 0.78;   // knee braces, both ways
      const across = box(g, stain, 1.25, 0.12, 0.12, x - Math.sign(x) * 0.44, H - 0.42, z); across.rotation.z = Math.sign(x) * 0.78;
    }
    for (const x of [-W / 2, W / 2]) box(g, stain, 0.2, 0.26, D + 0.5, x, H + 0.08, 0);   // plates along the eaves
    for (const z of [-D / 2, D / 2]) box(g, stain, W + 0.3, 0.24, 0.2, 0, H + 0.08, z);   // tie beams under the gables
    for (const s of [-1, 1]) { const r = box(g, shingle, L0 + 0.08, 0.1, D + OZ * 2, s * (W / 4 + OX / 2), H + 0.28 + R / 2 - OX * R / (W / 2 + OX) / 2, 0); r.rotation.z = -s * slope;
      for (const z of [-D / 2 - OZ, D / 2 + OZ]) { const f = box(g, stain, L0 + 0.1, 0.16, 0.05, s * (W / 4 + OX / 2), H + 0.21 + R / 2 - OX * R / (W / 2 + OX) / 2, z); f.rotation.z = -s * slope; } }
    { const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#a4623f'; x.fillRect(0, 0, 256, 128);   // vertical boards
      for (let i = 0; i < 16; i++) { x.fillStyle = `rgba(70,34,18,${0.25 + (i * 37 % 10) * 0.03})`; x.fillRect(i * 16, 0, 1.5, 128); }
      for (const px of [86, 142]) { x.fillStyle = '#6d2419'; x.fillRect(px, 62, 28, 36); x.strokeStyle = '#8a3524'; x.lineWidth = 2; x.strokeRect(px, 62, 28, 36); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const hw = W / 2 + 0.05, y0 = H + 0.2;
      for (const z of [-D / 2, D / 2]) { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute([-hw, y0, z, hw, y0, z, 0, y0 + R - 0.08, z], 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2)); geo.computeVertexNormals();
        g.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, side: THREE.DoubleSide }))); } }
    box(g, wood, 0.8, 0.06, 1.9, -0.4, 0.76, 0.1); for (const s of [-1, 1]) { box(g, wood, 0.28, 0.05, 1.9, -0.4 + s * 0.62, 0.45, 0.1); for (const z of [-0.55, 0.75]) { const leg = box(g, wood, 0.07, 0.86, 0.07, -0.4 + s * 0.22, 0.38, z); leg.rotation.z = -s * 0.5; } }
    const iron = M(0x2c2a28, 0.6, 0.4);   // two steel fire rings by the post, a black stove box out front
    for (const [x, z] of [[1.4, 1.9], [0.5, 2.15]]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.24, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0x4a3f38, roughness: 0.7, metalness: 0.4, side: THREE.DoubleSide })); r.position.set(x, 0.12, z); g.add(r); }
    box(g, iron, 0.55, 0.6, 0.45, -2.4, 0.4, 3.1); for (const [dx, dz] of [[-0.2, -0.16], [0.2, -0.16], [-0.2, 0.16], [0.2, 0.16]]) box(g, iron, 0.05, 0.12, 0.05, -2.4 + dx, 0.06, 3.1 + dz);
  } else if (variant === 'leanto' || variant === 'redouthouse') {   // the lean-to + outhouse by the Bottom House (drone video 19:16-19:22, roof sizes off the survey; its fence left out, Mike 11-01)
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#4a3a30'; x.fillRect(0, 0, 256, 256);
    let sd = 5; const rn = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let r = 0; r < 12; r++) for (let q = -1; q < 12; q++) { const v = 0.75 + rn() * 0.5; x.fillStyle = `rgb(${124 * v},${100 * v},${82 * v})`; x.fillRect((q + (r % 2) * 0.5) * 22, r * 22, 21, 19); }
    const st = new THREE.CanvasTexture(c); st.colorSpace = THREE.SRGBColorSpace; st.wrapS = st.wrapT = THREE.RepeatWrapping; st.anisotropy = 8; st.repeat.set(2.5, 2.5);
    const shingle = new THREE.MeshStandardMaterial({ map: st, roughness: 0.95 }), stain = M(0xa63a26, 0.8);
    const roof = (W, D, H, R, ox, oz) => {
      const a = Math.atan2(R, W / 2 + ox), L = Math.hypot(W / 2 + ox, R), cy = H + R / 2 - ox * R / (W / 2 + ox) / 2;
      for (const s of [-1, 1]) {
        const p = box(g, shingle, L + 0.1, 0.07, D + oz * 2, s * (W / 4 + ox / 2), cy, 0); p.rotation.z = -s * a;
        for (const e of [-1, 1]) { const f = box(g, stain, L + 0.1, 0.16, 0.05, s * (W / 4 + ox / 2), cy - 0.05, e * (D / 2 + oz)); f.rotation.z = -s * a; }
        const eave = box(g, stain, 0.05, 0.16, D + oz * 2, s * (W / 2 + ox), H - 0.04, 0);
      }
      return { a, L, cy };
    };
    const gable = (W, R, H, z) => { const t = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-W / 2, 0), new THREE.Vector2(W / 2, 0), new THREE.Vector2(0, R)]), { depth: 0.06, bevelEnabled: false }), stain); t.position.set(0, H, z); g.add(t); };
    if (variant === 'leanto') {
      // +z = the open gable; a gable roof on four red posts a side, boarded in above the tie beam, closed red back wall; a white and olive motorhome inside; a skylight on the -x slope
      const W = 3.6, D = 6.6, H = 2.6, R = 1.15, ox = 0.6, oz = 0.45;
      for (const s of [-1, 1]) { for (let i = 0; i < 4; i++) box(g, stain, 0.16, H + 0.5, 0.16, s * W / 2, (H - 0.5) / 2, -D / 2 + i * D / 3); box(g, stain, 0.14, 0.2, D, s * W / 2, H - 0.1, 0); }
      box(g, stain, W + 0.2, 0.28, 0.14, 0, H - 0.04, D / 2); gable(W, R, H, D / 2 - 0.03); gable(W, R, H, -D / 2 - 0.03);
      box(g, stain, W, H + 0.3, 0.1, 0, (H - 0.3) / 2, -D / 2);
      const r = roof(W, D, H, R, ox, oz);
      const sky = box(g, M(0xe8ecec, 0.3, 0.2), 0.8, 0.05, 1.1, -(W / 4 + ox / 2) - 0.1, r.cy + 0.1, 0.3); sky.rotation.z = r.a;
      const frame = box(g, M(0x2a2a2c, 0.6), 0.9, 0.04, 1.2, -(W / 4 + ox / 2) - 0.1, r.cy + 0.08, 0.3); frame.rotation.z = r.a;
      const cream = M(0xe9e6da, 0.6), olive = M(0xa9a24a, 0.6);
      box(g, cream, 2.3, 1.15, 5.7, 0, 1.75, -0.25); box(g, olive, 2.32, 0.75, 5.72, 0, 0.82, -0.25); box(g, M(0x1f2428, 0.3), 2.34, 0.42, 1.0, 0, 1.75, 2.1); box(g, M(0x1f2428, 0.3), 2.34, 0.4, 3.2, 0, 1.85, -0.9);
      for (const s of [-1, 1]) for (const z of [-1.6, 1.2]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.22, 12), black); w.rotation.z = Math.PI / 2; w.position.set(s * 1.1, 0.36, z); g.add(w); }
    } else {
      // +z = the door: dark door with a small window, vertical boards, a shingled gable on a skid with a dark mat in front
      const W = 1.3, D = 1.3, H = 2.05, R = 0.42;
      box(g, stain, W, H + 0.3, D, 0, (H + 0.3) / 2 - 0.2, 0);
      for (let i = 0; i < 6; i++) for (const z of [-D / 2 - 0.005, D / 2 + 0.005]) box(g, M(0x7a2a1c, 0.8), 0.015, H, 0.01, -W / 2 + (i + 0.5) * W / 6, H / 2, z);
      gable(W, R, H, D / 2 - 0.03); gable(W, R, H, -D / 2 - 0.03); roof(W, D, H, R, 0.2, 0.2);
      box(g, M(0x8f3222, 0.8), 0.74, 1.85, 0.04, 0, 1.0, D / 2 + 0.03); box(g, M(0x1b1d20, 0.3), 0.18, 0.46, 0.05, 0, 1.45, D / 2 + 0.04);
      box(g, M(0xb9b4a8, 0.9), W + 0.3, 0.3, D + 1.0, 0, -0.04, 0.35); box(g, M(0x23232a, 1), W - 0.1, 0.03, 0.55, 0, 0.12, D / 2 + 0.38);
    }
  } else if (variant === 'pit') {          // a horseshoe pit on the lawn by the tetherball (drone video 13:52, 14:30): sand in a timber frame, reaching below ground on a slope
    box(g, M(0xcbb994, 1), 1.5, 0.3, 2.4, 0, 0.0, 0);
    for (const s of [-1, 1]) { box(g, wood, 0.1, 0.34, 2.5, s * 0.78, 0.02, 0); box(g, wood, 1.66, 0.34, 0.1, 0, 0.02, s * 1.22); }
    box(g, M(0x4a4a4a, 0.5, 0.5), 0.03, 0.34, 0.03, 0, 0.3, 0);
  } else if (variant === 'binshed') {      // the slatted garbage shed + bins at the lawn's end (drone video 13:52): red slats, a sloped metal roof, grey bins
    const red2 = M(0xb0482a, 0.8), W = 3.4, D = 2.0;
    for (let i = 0; i < 6; i++) for (const [w, d, x, z] of [[W, 0.04, 0, -D / 2], [0.04, D, -W / 2, 0], [0.04, D, W / 2, 0]]) box(g, red2, w, 0.15, d, x, 0.3 + i * 0.26, z);
    for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) box(g, red2, 0.1, 2.1, 0.1, x, 1.0, z);
    const roof = box(g, M(0xc9ccc9, 0.45, 0.4), W + 0.5, 0.05, D + 0.8, 0, 2.1, 0); roof.rotation.x = 0.2;
    for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.9, 12), M(i === 1 ? 0x3c3f42 : 0x8d9194, 0.7)); b.position.set(-0.8 + i * 0.7, 0.45, D / 2 + 0.45); g.add(b); }
  } else if (variant === 'outhouse') {     // the pair of outhouses at the campground's edge (Campsite/14.jpg): one red with a dark
    // door panel, one cream with a white door, small gable roofs, on a dirt pad
    for (const [x, c, d] of [[-1.1, 0x8f3f2a, 0x3a2a24], [1.1, 0xe2d8c0, 0xf2eee4]]) {
      box(g, M(c, 0.85), 1.5, 2.2, 1.5, x, 1.1, 0); box(g, M(d, 0.7), 0.8, 1.8, 0.04, x, 0.95, 0.77);
      for (const s of [-1, 1]) { const r = box(g, M(0x4e3d30, 0.95), 1.05, 0.07, 1.9, x + s * 0.46, 2.42, 0); r.rotation.z = -s * 0.62; }
    }
  } else if (variant === 'washroom') {     // the little red washroom by the gazebo with two white doors (clubhouse_1.22.1.png)
    box(g, M(0xa8482e, 0.85), 3.6, 2.4, 2.2, 0, 1.2, 0);
    for (const x of [-0.85, 0.85]) box(g, white, 0.95, 2.0, 0.04, x, 1.02, 1.12);
    for (const s of [-1, 1]) { const r = box(g, M(0x56463a, 0.95), 2.3, 0.08, 2.8, s * 0.98, 2.72, 0); r.rotation.z = -s * 0.42; }
  } else if (variant === 'flagpin') {      // a flag on a green (Golf Course/06.jpg)
    box(g, white, 0.03, 2.2, 0.03, 0, 1.1, 0); box(g, M(0xf0c82a, 0.5), 0.5, 0.32, 0.02, 0.26, 2.04, 0);
  } else if (variant === 'firepit') {      // a steel fire bowl on the grass (Dome/PXL_20240519_014325376)
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.32, 0.3, 14), M(0x4a3a30, 0.8, 0.4)); b.position.y = 0.3; g.add(b);
  } else if (variant === 'quonset') {      // the black storage tent by the golf carts (Golf/wellsgray1.PNG)
    const t = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 7, 14, 1, false, -Math.PI / 2, Math.PI), M(0x1f1f22, 0.75)); t.rotation.z = Math.PI / 2; t.rotation.y = Math.PI / 2; t.position.y = 0.1; g.add(t);
  } else if (variant === 'campsite') {     // what every site has in the photos (Campsite/13, 12, 20211003_121227): a metal-frame picnic table in blue or grey, a steel fire ring, a blue-and-red service post. One merged mesh: 53 sites
    const k = Math.round(size), top = new THREE.Color(k % 3 === 1 ? 0xb9bcbc : 0x2c6d77), steel = new THREE.Color(0xb9bcbd), iron = new THREE.Color(0x26211d), ash = new THREE.Color(0x3a342e), parts = [];
    const add = (geo, col, x, y, z, rx = 0) => { if (rx) geo.rotateX(rx); geo.translate(x, y, z); const n = geo.attributes.position.count, c = new Float32Array(n * 3); for (let i = 0; i < n; i++) col.toArray(c, i * 3); geo.setAttribute('color', new THREE.BufferAttribute(c, 3)); parts.push(geo.index ? geo.toNonIndexed() : geo); };
    const b = (col, w, h, d, x, y, z, rx) => add(new THREE.BoxGeometry(w, h, d), col, x, y, z, rx);
    b(top, 1.85, 0.05, 0.75, 0, 0.76, 0);
    for (const z of [-0.72, 0.72]) b(top, 1.85, 0.04, 0.26, 0, 0.45, z);
    for (const x of [-0.6, 0.6]) { b(steel, 0.05, 0.05, 1.7, x, 0.43, 0); for (const s of [-1, 1]) b(steel, 0.05, 0.86, 0.05, x, 0.4, s * 0.3, s * 0.62); }
    add(new THREE.CylinderGeometry(0.46, 0.46, 0.28, 12), iron, 3.4, 0.14, 0.4);
    add(new THREE.CylinderGeometry(0.42, 0.42, 0.02, 12), ash, 3.4, 0.285, 0.4);
    b(new THREE.Color(0xeeeeea), 0.16, 0.9, 0.16, -2.6, 0.45, -2); b(new THREE.Color(0xe0642a), 0.14, 0.55, 0.14, -2.2, 0.27, -1.7);   // white post + orange marker (drone video 1:10)
    const count = parts.reduce((a, q) => a + q.attributes.position.count, 0), geo = new THREE.BufferGeometry();
    for (const [name, sz] of [['position', 3], ['normal', 3], ['color', 3]]) { const arr = new Float32Array(count * sz); let o = 0; for (const q of parts) { arr.set(q.attributes[name].array, o); o += q.attributes[name].array.length; } geo.setAttribute(name, new THREE.BufferAttribute(arr, sz)); }
    g.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.65 })));
  } else if (variant === 'logs') {         // log bumpers end to end along +z
    for (let z = 0; z < size; z += 3.1) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 3, 8), M(0xcfc6b4, 0.95)); l.rotation.x = Math.PI / 2; l.position.set(0, 0.18, z + 1.5); g.add(l); }
  } else {                                  // picnic table
    const top = M(0x2c6d77, 0.6), rail = M(0xb9bcbd, 0.5, 0.4);   // the campground's tables: teal tops on a steel frame (drone video 1:10, 13:30)
    box(g, top, 0.8, 0.06, 1.8, 0, 0.76, 0);
    for (const s of [-1, 1]) { box(g, top, 0.28, 0.05, 1.8, s * 0.62, 0.45, 0); box(g, rail, 1.5, 0.05, 0.05, 0, 0.4, s * 0.7); box(g, rail, 0.05, 0.78, 0.05, 0, 0.38, s * 0.7); }
  }
  return g;
}

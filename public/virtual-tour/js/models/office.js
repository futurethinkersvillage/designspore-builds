// Office / Pro Shop ("Campsite Check In | Pro Shop", "RV-Office") at Wells Gray Golf & RV Resort.
// Small red-orange lap-sided cabin with a side-gable galvanized metal roof, a steep front-gable entry bay
// (cream soffits, wood door with an arched cream glass panel, check-in sign, flagpole), a low grey deck with
// white plastic chairs, and an open timber picnic pavilion (metal gable roof, knee-braced posts, rail) attached
// to its left (west) gable end, where the RV-Office service window is.
import * as THREE from 'three';

export const meta = {
  name: 'Office / Pro Shop',
  layer: 'public_areas',
  match: 1, // public_areas feature 1: ~12.6 x 10.2 m quad, 10 m N of the "Office" photo point
  footprint: [12.0, 8.3], // office 6.4 x 6.0 + entry bay + front deck 1.9 m, pavilion 5.0 x 4.4 on the left
  height: 4.1, // ridge; flagpole tip 6.0
  place: { x: -101.9, y: 74.2, rotY: 0.639 }, // front (entry + deck) faces the long SE side of the polygon, bearing ~143°
  sources: [
    'Office/wellsgray7.PNG (front elevation: bay, door, sign, window, deck, pavilion left)',
    'Office/09.jpg + 08.jpg (front 3/4: bay gable + soffit, metal roof, flag)',
    'Office/Office Gazebo.PNG (pavilion from the back-left, RV-Office window wall)',
    'Office/wellsgray2.PNG, 10.jpg (pavilion interior/rail, RV-OFFICE sign + window)',
    'Golf/20210620_172716.jpg (right gable end with vent from the cart parking)',
    'Office/wellsgray12.PNG (office + pavilion seen from the shower house)',
  ],
  notes: 'See models/notes/office.md',
};

// ---------- textures ----------
const texCache = {};
function canvasTex(key, w, h, draw) {
  if (!texCache[key]) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
    texCache[key] = t;
  }
  return texCache[key];
}
// 1 texture tile = 1 m x 1 m (geometry UVs are in metres)
const lapTex = () => canvasTex('of_lap', 64, 128, (g, w, h) => {
  g.fillStyle = '#b5532f'; g.fillRect(0, 0, w, h);
  const n = 7; // ~14 cm exposure
  for (let i = 0; i < n; i++) {
    const y = Math.round(i * h / n);
    g.fillStyle = 'rgba(255,190,150,0.10)'; g.fillRect(0, y + 2, w, 4);
    g.fillStyle = '#82361f'; g.fillRect(0, y, w, 2);
  }
});
const ribTex = () => canvasTex('of_rib', 128, 16, (g, w, h) => {
  g.fillStyle = '#b9c1c4'; g.fillRect(0, 0, w, h);
  for (let x = 0; x < w; x += 26) { g.fillStyle = '#8f989c'; g.fillRect(x, 0, 3, h); g.fillStyle = '#d9dfe1'; g.fillRect(x + 3, 0, 2, h); }
});
const deckTex = () => canvasTex('of_deck', 128, 32, (g, w, h) => {
  g.fillStyle = '#8b7b68'; g.fillRect(0, 0, w, h);
  for (let x = 0; x < w; x += 16) { g.fillStyle = '#5f5446'; g.fillRect(x, 0, 2, h); }
});
function signTex(key, draw) { return canvasTex(key, 512, 128, draw); }

// ---------- helpers ----------
// replace UVs with planar metre coordinates (picked per face from its normal)
function worldUV(geo) {
  const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v;
    if (ax >= ay && ax >= az) { u = p.getZ(i); v = p.getY(i); } else if (ay >= az) { u = p.getX(i); v = p.getZ(i); } else { u = p.getX(i); v = p.getY(i); }
    uv[2 * i] = u; uv[2 * i + 1] = v;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return geo;
}
// axis-aligned box given by min/max corners, UVs in metres
function aabb(parent, mat, x0, y0, z0, x1, y1, z1) {
  const geo = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  const m = new THREE.Mesh(worldUV(geo), mat); parent.add(m); return m;
}
function box(parent, mat, w, h, d, x, y, z, ry = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
}
function tri(parent, mat, a, b, c) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3)); geo.computeVertexNormals();
  const m = new THREE.Mesh(worldUV(geo), mat); parent.add(m); return m;
}
function beam(parent, mat, p0, p1, s) {
  const d = new THREE.Vector3().subVectors(p1, p0), L = d.length();
  const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, L), mat); m.position.copy(p0).addScaledVector(d, 0.5); m.lookAt(p1); parent.add(m); return m;
}
// Gable roof (two slabs) with ridge through (rx, ry, rz). axis 'x' or 'z' = ridge direction.
// half = horizontal run from ridge to eave edge, rise = per metre slope (tan), len0/len1 = ridge extent.
function gableRoof(parent, mats, axis, rx, ry, rz, half, slope, len0, len1, t = 0.06) {
  const a = Math.atan(slope), L = half / Math.cos(a), len = len1 - len0;
  for (const s of [1, -1]) {
    const geo = new THREE.BoxGeometry(len, t, L).translate(len0 + len / 2, -t / 2, s * L / 2);
    worldUV(geo); geo.rotateX(s * a);
    if (axis === 'z') geo.rotateY(-Math.PI / 2);
    const m = new THREE.Mesh(geo, mats); m.position.set(rx, ry, rz); parent.add(m);
  }
}

// ---------- layout (m). +X = right when facing the entrance, +Z = front ----------
const BX0 = -0.7, BX1 = 5.7, BZ0 = -3.95, BZ1 = 2.05;   // office body
const EAVE = 2.75, RIDGE_Z = (BZ0 + BZ1) / 2, BODY_SLOPE = 0.42;
const RIDGE = EAVE + (BZ1 - BZ0) / 2 * BODY_SLOPE;      // 4.01
const BAYX0 = BX0, BAYX1 = BX0 + 2.8, BAYZ1 = BZ1 + 1.0; // entry bay (front gable)
const BAY_SLOPE = 0.9,  BAYC = (BAYX0 + BAYX1) / 2, BAY_RIDGE = EAVE + 1.4 * BAY_SLOPE;
const DECK_Z1 = BZ1 + 1.9, DECK_H = 0.16;
const PX0 = BX0 - 5.0, PX1 = BX0, PZ0 = RIDGE_Z - 2.2, PZ1 = RIDGE_Z + 2.2;  // pavilion
const P_DECK = 0.3, P_EAVE = P_DECK + 2.4, P_SLOPE = 0.55;

export function build({ lod = 'high' } = {}) {
  const hi = lod !== 'low';
  const g = new THREE.Group(); g.name = 'office';

  const siding = new THREE.MeshStandardMaterial({ color: hi ? 0xffffff : 0xb2512f, map: hi ? lapTex() : null, roughness: 0.85, side: THREE.DoubleSide });
  const trim = new THREE.MeshStandardMaterial({ color: 0x9e4229, roughness: 0.85 });
  const timber = new THREE.MeshStandardMaterial({ color: 0xa8492c, roughness: 0.85 });
  const metal = new THREE.MeshStandardMaterial({ color: hi ? 0xffffff : 0xb3bbbf, map: hi ? ribTex() : null, roughness: 0.55, metalness: 0.1 });
  const soffit = new THREE.MeshStandardMaterial({ color: 0xe3d3ad, roughness: 0.9 });
  const roofMats = [trim, trim, metal, soffit, trim, trim];           // box groups: +x -x +y -y +z -z
  const pavRoofMats = [trim, trim, metal, new THREE.MeshStandardMaterial({ color: 0x9a4a2e, roughness: 0.9 }), trim, trim];
  const deck = new THREE.MeshStandardMaterial({ color: hi ? 0xffffff : 0x8b7b68, map: hi ? deckTex() : null, roughness: 0.95 });
  const white = new THREE.MeshStandardMaterial({ color: 0xf0efe8, roughness: 0.6 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x353d42, roughness: 0.25, metalness: 0.2 });

  // ===== office body: walls + gable ends + roof =====
  aabb(g, siding, BX0, 0, BZ0, BX1, EAVE, BZ1);
  for (const x of [BX0, BX1]) tri(g, siding, [x, EAVE, BZ0], [x, EAVE, BZ1], [x, RIDGE, RIDGE_Z]);
  gableRoof(g, pavRoofMats, 'x', 0, RIDGE + 0.02, RIDGE_Z, (BZ1 - BZ0) / 2 + 0.38, BODY_SLOPE, BX0 - 0.3, BX1 + 0.3);
  if (hi) {
    box(g, metal, BX1 - BX0 + 0.62, 0.08, 0.3, (BX0 + BX1) / 2, RIDGE + 0.07, RIDGE_Z); // ridge cap
    for (const [x, z] of [[BX1, BZ1], [BX1, BZ0], [BX0, BZ0]]) box(g, trim, 0.12, EAVE, 0.12, x, EAVE / 2, z); // corner boards
  }

  // ===== entry bay (front gable) =====
  aabb(g, siding, BAYX0, 0, BZ1 - 0.05, BAYX1, EAVE, BAYZ1);
  tri(g, siding, [BAYX0, EAVE, BAYZ1], [BAYX1, EAVE, BAYZ1], [BAYC, BAY_RIDGE, BAYZ1]);
  gableRoof(g, roofMats, 'z', BAYC, BAY_RIDGE + 0.02, 0, 1.4 + 0.32, BAY_SLOPE, RIDGE_Z + 0.3, BAYZ1 + 0.45);
  if (hi) {
    // red rake fascia boards on the deep front overhang of the bay gable
    for (const sx of [-1, 1]) {
      const run = 1.4 + 0.32, zf = BAYZ1 + 0.44;
      const fb = beam(g, trim, new THREE.Vector3(BAYC, BAY_RIDGE - 0.06, zf), new THREE.Vector3(BAYC + sx * run, BAY_RIDGE - run * BAY_SLOPE - 0.06, zf), 1);
      fb.scale.set(0.05, 0.2, 1);
    }
    for (const x of [BAYX0, BAYX1]) box(g, trim, 0.12, EAVE, 0.12, x, EAVE / 2, BAYZ1); // corner boards
    // gable vent
    box(g, soffit, 0.42, 0.28, 0.04, BAYC, BAY_RIDGE - 0.5, BAYZ1 + 0.02);
    // door: wood with an arched cream glass panel + kick panel
    const doorW = new THREE.MeshStandardMaterial({ color: 0xb8673c, roughness: 0.7 });
    box(g, trim, 1.08, 2.18, 0.05, BAYC, 1.09 + DECK_H, BAYZ1 + 0.02);
    box(g, doorW, 0.92, 2.04, 0.06, BAYC, 1.02 + DECK_H, BAYZ1 + 0.03);
    box(g, new THREE.MeshStandardMaterial({ color: 0xe6d8b5, roughness: 0.5 }), 0.62, 0.86, 0.07, BAYC, 1.38 + DECK_H, BAYZ1 + 0.03);
    const arch = new THREE.Mesh(new THREE.CircleGeometry(0.31, 10, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0xe6d8b5, roughness: 0.5 }));
    arch.position.set(BAYC, 1.81 + DECK_H, BAYZ1 + 0.068); g.add(arch);
    // "CAMPSITE CHECK IN | PRO SHOP" board
    const sign = signTex('of_sign', (c, w, h) => {
      c.fillStyle = '#f2f0e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#1f5a3a'; c.fillRect(w * 0.53, 0, w * 0.47, h);
      c.strokeStyle = '#3a2a20'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = '#20302a'; c.font = 'bold 40px sans-serif'; c.fillText('CAMPSITE', w * 0.265, h * 0.31); c.fillText('CHECK IN', w * 0.265, h * 0.71);
      c.fillStyle = '#ffffff'; c.font = 'bold 42px sans-serif'; c.fillText('PRO SHOP', w * 0.765, h * 0.53);
    });
    box(g, new THREE.MeshStandardMaterial({ map: sign, roughness: 0.7 }), 1.3, 0.32, 0.04, BAYC, 2.3 + DECK_H, BAYZ1 + 0.04);
    // dark notice board left of the door, small white notices right
    box(g, new THREE.MeshStandardMaterial({ color: 0x3e3029, roughness: 0.8 }), 0.5, 0.55, 0.04, BAYX0 + 0.38, 1.55, BAYZ1 + 0.03);
    box(g, white, 0.3, 0.42, 0.02, BAYX1 - 0.48, 1.75, BAYZ1 + 0.02);
    box(g, white, 0.24, 0.3, 0.02, BAYX1 - 0.48, 1.25, BAYZ1 + 0.02);
    // flagpole off the bay's front-left corner, leaning out to the left, with a Canadian flag
    const top = new THREE.Vector3(BAYX0 - 0.75, 6.0, BAYZ1 - 0.2);
    beam(g, white, new THREE.Vector3(BAYX0 - 0.05, 2.1, BAYZ1 - 0.05), top, 0.05);
    const flag = canvasTex('of_flag', 64, 32, (c, w, h) => {
      c.fillStyle = '#d52b1e'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.fillRect(w / 4, 0, w / 2, h);
      c.fillStyle = '#d52b1e'; c.beginPath(); c.moveTo(32, 6); c.lineTo(38, 16); c.lineTo(35, 24); c.lineTo(29, 24); c.lineTo(26, 16); c.closePath(); c.fill();
    });
    const fm = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5), new THREE.MeshStandardMaterial({ map: flag, side: THREE.DoubleSide, roughness: 0.9 }));
    fm.position.set(top.x - 0.52, top.y - 0.3, top.z); fm.rotation.y = 0.25; g.add(fm);

    // ===== windows =====
    const win = (x, y, z, w, h, ry) => { // white frame + dark glass, on a wall facing ry
      const gw = new THREE.Group(); gw.position.set(x, y, z); gw.rotation.y = ry; g.add(gw);
      box(gw, white, w + 0.12, h + 0.12, 0.05, 0, 0, 0.02); box(gw, glass, w, h, 0.06, 0, 0, 0.03);
      box(gw, white, w, 0.04, 0.07, 0, 0, 0.035);
    };
    win(3.9, 1.45, BZ1, 0.55, 1.15, 0);                 // tall front window (right of the bay)
    win(4.6, 1.5, BZ0, 0.9, 0.8, Math.PI);              // back
    win(BX1, 1.5, -1.6, 0.8, 0.8, Math.PI / 2);         // right gable end
    box(g, soffit, 0.06, 0.4, 0.5, BX1 + 0.01, RIDGE - 0.55, RIDGE_Z);   // gable vents
    box(g, soffit, 0.06, 0.4, 0.5, BX0 - 0.01, RIDGE - 0.55, RIDGE_Z);
    // RV-Office service window on the left wall, forward of the pavilion, with its sign
    win(BX0, 1.55, (PZ1 + BAYZ1) / 2, 1.0, 0.85, -Math.PI / 2);
    const rv = signTex('of_rv', (c, w, h) => {
      c.fillStyle = '#e9e4bf'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2f5a35'; c.lineWidth = 10; c.strokeRect(6, 6, w - 12, h - 12);
      c.fillStyle = '#2f5a35'; c.font = 'bold 76px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('RV-OFFICE', w / 2, h / 2 + 2);
    });
    const rvm = box(g, new THREE.MeshStandardMaterial({ map: rv, roughness: 0.7 }), 1.0, 0.25, 0.03, BX0 - 0.02, 2.17, (PZ1 + BAYZ1) / 2, -Math.PI / 2);
    void rvm;
    // rules boards on the right gable end (cart parking side)
    box(g, white, 0.03, 0.6, 0.45, BX1 + 0.02, 1.5, 0.6); box(g, white, 0.03, 0.6, 0.45, BX1 + 0.02, 1.5, 1.25);
  }

  // ===== front deck =====
  aabb(g, deck, BX0, 0, BZ1, BX1 + 0.2, DECK_H, DECK_Z1);
  if (hi) {
    // planter + white plastic chairs + small table on the deck
    box(g, new THREE.MeshStandardMaterial({ color: 0x6d5a45, roughness: 0.9 }), 1.6, 0.4, 0.4, 3.9, DECK_H + 0.2, BZ1 + 0.25);
    box(g, new THREE.MeshStandardMaterial({ color: 0x4f7a3a, roughness: 1 }), 1.5, 0.25, 0.32, 3.9, DECK_H + 0.48, BZ1 + 0.25);
    const chair = (x, z, ry) => {
      const c = new THREE.Group(); c.position.set(x, DECK_H, z); c.rotation.y = ry; g.add(c);
      box(c, white, 0.5, 0.06, 0.48, 0, 0.44, 0); box(c, white, 0.5, 0.5, 0.05, 0, 0.72, -0.22);
      box(c, white, 0.04, 0.44, 0.44, 0.22, 0.22, 0); box(c, white, 0.04, 0.44, 0.44, -0.22, 0.22, 0); // side frames read as legs
    };
    chair(3.2, BZ1 + 0.9, 0.2); chair(4.7, BZ1 + 0.9, -0.2);
    box(g, new THREE.MeshStandardMaterial({ color: 0xa8582e, roughness: 0.8 }), 0.7, 0.45, 0.5, 3.95, DECK_H + 0.225, BZ1 + 1.05);
    box(g, new THREE.MeshStandardMaterial({ color: 0xa8582e, roughness: 0.8 }), 0.75, 0.42, 0.32, BAYX1 + 0.55, DECK_H + 0.21, BZ1 + 0.25); // bench
    box(g, new THREE.MeshStandardMaterial({ color: 0x3a3330, roughness: 1 }), 0.9, 0.02, 0.55, BAYC, DECK_H + 0.01, BAYZ1 + 0.4); // mat
  }

  // ===== pavilion (open timber picnic shelter) =====
  aabb(g, timber, PX0, 0, PZ0, PX1, P_DECK - 0.04, PZ1);                 // rim / skirt
  aabb(g, deck, PX0 + 0.02, P_DECK - 0.04, PZ0 + 0.02, PX1, P_DECK, PZ1 - 0.02);
  const postX = hi ? [PX0 + 0.15, (PX0 + PX1) / 2, PX1 - 0.12] : [PX0 + 0.15, PX1 - 0.12];
  for (const x of postX) for (const z of [PZ0 + 0.15, PZ1 - 0.15]) box(g, timber, 0.16, P_EAVE - P_DECK, 0.16, x, (P_EAVE + P_DECK) / 2, z);
  // plates along the eaves + tie beams across
  for (const z of [PZ0 + 0.15, PZ1 - 0.15]) aabb(g, timber, PX0, P_EAVE - 0.22, z - 0.09, PX1, P_EAVE, z + 0.09);
  const P_RIDGE = P_EAVE + 2.2 * P_SLOPE;
  gableRoof(g, pavRoofMats, 'x', 0, P_RIDGE + 0.02, RIDGE_Z, 2.2 + 0.35, P_SLOPE, PX0 - 0.35, PX1);
  // far gable end clad in lap siding above the tie beam (open below)
  tri(g, siding, [PX0 + 0.05, P_EAVE, PZ0], [PX0 + 0.05, P_EAVE, PZ1], [PX0 + 0.05, P_RIDGE, RIDGE_Z]);
  if (hi) {
    box(g, metal, PX1 - PX0 + 0.35, 0.08, 0.3, (PX0 + PX1 - 0.35) / 2, P_RIDGE + 0.07, RIDGE_Z); // ridge cap
    for (const x of postX) aabb(g, timber, x - 0.08, P_EAVE - 0.24, PZ0, x + 0.08, P_EAVE - 0.04, PZ1); // tie beams
    // knee braces: along the eave line and across
    for (const x of postX) for (const z of [PZ0 + 0.15, PZ1 - 0.15]) {
      const zi = z < RIDGE_Z ? 1 : -1;
      beam(g, timber, new THREE.Vector3(x, P_EAVE - 0.95, z), new THREE.Vector3(x, P_EAVE - 0.2, z + zi * 0.75), 0.1);
      for (const s of [-1, 1]) { const xe = x + s * 0.75; if (xe > PX0 && xe < PX1) beam(g, timber, new THREE.Vector3(x, P_EAVE - 0.95, z), new THREE.Vector3(xe, P_EAVE - 0.2, z), 0.1); }
    }
    // king post under the ridge on the far gable
    box(g, timber, 0.12, P_RIDGE - P_EAVE, 0.12, PX0 + 0.12, (P_RIDGE + P_EAVE) / 2, RIDGE_Z);
    // railing: far end, back side, and the outer half of the front side
    const rail = (x0, z0, x1, z1) => {
      const a = new THREE.Vector3(x0, P_DECK + 0.95, z0), b = new THREE.Vector3(x1, P_DECK + 0.95, z1);
      beam(g, timber, a, b, 0.09);
      const n = Math.max(2, Math.round(a.distanceTo(b) / 0.55));
      for (let i = 1; i < n; i++) { const t = i / n; box(g, timber, 0.06, 0.95, 0.06, x0 + (x1 - x0) * t, P_DECK + 0.475, z0 + (z1 - z0) * t); }
    };
    rail(PX0 + 0.15, PZ0 + 0.15, PX0 + 0.15, PZ1 - 0.15);
    rail(PX0 + 0.15, PZ0 + 0.15, PX1 - 0.12, PZ0 + 0.15);
    rail(PX0 + 0.15, PZ1 - 0.15, (PX0 + PX1) / 2, PZ1 - 0.15);
    // picnic table + BBQ + dark green plastic chairs
    const tbl = new THREE.MeshStandardMaterial({ color: 0x9a6a45, roughness: 0.9 });
    box(g, tbl, 2.0, 0.06, 0.8, -3.6, P_DECK + 0.75, RIDGE_Z); box(g, tbl, 0.08, 0.72, 0.7, -4.4, P_DECK + 0.36, RIDGE_Z); box(g, tbl, 0.08, 0.72, 0.7, -2.8, P_DECK + 0.36, RIDGE_Z);
    const green = new THREE.MeshStandardMaterial({ color: 0x2f4a3c, roughness: 0.8 });
    for (const [x, z] of [[-4.0, RIDGE_Z - 0.75], [-3.2, RIDGE_Z - 0.75], [-4.0, RIDGE_Z + 0.75], [-3.2, RIDGE_Z + 0.75]]) {
      box(g, green, 0.46, 0.45, 0.46, x, P_DECK + 0.22, z); box(g, green, 0.46, 0.45, 0.05, x, P_DECK + 0.67, z + (z < RIDGE_Z ? -0.21 : 0.21));
    }
    box(g, new THREE.MeshStandardMaterial({ color: 0x2b2b2d, roughness: 0.5 }), 1.1, 0.9, 0.55, PX1 - 0.7, P_DECK + 0.45, PZ0 + 0.55); // BBQ
  }
  return g;
}

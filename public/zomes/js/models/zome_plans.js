// Floor plans for the planned zome types (concept only). One data source drives the 2D plans and the 3D interiors.
// W(kind, az) puts an item with its back to the floor edge at that azimuth and slides it inward until it clears the sloped shell at its own height.
// F(kind, x, z, r) places it exactly. check() tests every item against the shell, the floor outline and each other.
import { zome, inPoly, TYPES } from './zome_geom.js';
import { KINDS, Buf, drawItem, drawLoft } from './zome_furniture.js';
const D = Math.PI / 180;

function rectCorners(it, m = 0) {
  const K = KINDS[it.k], w = (it.w || K.w) / 2 + m, d = (it.d || K.d) / 2 + m, r = (it.r || 0) * D, s = Math.sin(r), c = Math.cos(r);
  if (K.round) { const o = []; for (let a = 0; a < 16; a++) o.push([it.x + w * Math.sin(a * 22.5 * D), it.z + w * Math.cos(a * 22.5 * D)]); return o; }
  return [[-w, -d], [w, -d], [w, d], [-w, d], [0, -d], [w, 0], [0, d], [-w, 0]].map(([x, z]) => [it.x + x * c + z * s, it.z - x * s + z * c]);
}
const itemY = (it, Z) => (it.y !== undefined ? it.y : Z.floorY);
// The item's real drawn shape (headboards, monitors, chair backs, steps), as points in its own frame, so the shell test
// covers every part and every height, not just the top corners of its footprint. Flues are meant to go through the roof.
const NO_CLOUD = new Set(['ladder', 'shipstair', 'stair', 'tree', 'hanging', 'rug', 'mat', 'arcbench']);
const clouds = new Map();
function cloud(it, Z) {
  if (NO_CLOUD.has(it.k)) return null;
  const key = Z.type + Z.door + JSON.stringify({ ...it, x: 0, z: 0, r: 0, y: 0 });
  if (clouds.has(key)) return clouds.get(key);
  const B = new Buf();
  drawItem(B, { ...it, x: 0, z: 0, r: 0, y: Z.floorY }, Z);
  const seen = new Set(), pts = [], stove = it.k === 'woodstove' || it.k === 'saunastove';
  for (const name in B.b) {
    if (name === 'plant') continue;   // leaves may brush the panels
    const a = B.b[name].pos;
    for (let i = 0; i < a.length; i += 3) {
      const lx = a[i], ly = a[i + 1] - Z.floorY, lz = a[i + 2];
      if (stove && ly > 0.8) continue;
      const k = `${Math.round(lx / 0.03)},${Math.round(ly / 0.03)},${Math.round(lz / 0.03)}`;
      if (!seen.has(k)) { seen.add(k); pts.push([lx, ly, lz]); }
    }
  }
  clouds.set(key, pts);
  return pts;
}
// how far the drawn item pushes through the inside of the shell (m); 0 = clear
export function poke(it, Z) {
  const pts = cloud(it, Z); if (!pts) return 0;
  const y = itemY(it, Z), r = (it.r || 0) * D, s = Math.sin(r), c = Math.cos(r);
  let worst = 0;
  for (const [lx, ly, lz] of pts) {
    const x = it.x + lx * c + lz * s, z = it.z - lx * s + lz * c, yy = y + ly;
    if (yy < Z.y0 + 0.01 || Z.insideAt(x, yy, z)) continue;   // below the base ring the wall is the vertical base band (floor outline checks that)
    let pen = 0; for (const p of Z.planes) pen = Math.max(pen, p.n[0] * x + p.n[1] * yy + p.n[2] * z - p.d);
    worst = Math.max(worst, pen);
  }
  return worst;
}
function fits(it, Z, h) {
  const y = itemY(it, Z);
  const H = y + (h !== undefined ? h : it.low ? 0.3 : (KINDS[it.k].h || 0));
  for (const [x, z] of rectCorners(it)) { if (!Z.inFloor(x, z) && it.y === undefined) return false; if (!Z.insideAt(x, H, z)) return false; if (it.y !== undefined && !Z.insideAt(x, y + 0.02, z)) return false; }
  if (h === undefined && poke(it, Z) > 0.005) return false;
  return true;
}

// The way in: a door-wide strip straight in from the door, clear of furniture, and wider again for anything you sit on.
// Every door opens outward onto its deck, so the leaf's sweep has to land on the deck, not inside the room.
const SEATING = new Set(['sofa', 'sofabed', 'loveseat', 'armchair', 'chair', 'stool', 'bench', 'lounger', 'daybed']);
export function entryPath(Z) {
  const depth = Z.K === 7 ? 0.6 : Math.min(2.0, Math.max(1.15, 0.45 * Z.R(5)));
  return { hw: Math.max(Z.info.doorW, 0.8) / 2, z1: Z.info.doorZ, z0: Z.info.doorZ - depth, depth, seatPad: 0.3 };
}
export function doorLeaves(Z) {   // [hinge x, leaf width, direction the free edge points] for the outward swing
  const w = Z.info.doorW;
  return Z.door === 'A' ? [[-w / 2, w, 1]] : [[-w / 2, w / 2, 1], [w / 2, w / 2, -1]];
}

function kit(type, door) {
  const Z = zome(type, door), items = [];
  // F: exact placement, but if a corner would hit the sloped shell the item is drawn in toward the room centre until it clears
  const F = (k, x, z, r = 0, o = {}) => {
    const it = { k, x, z, r, ...o }; items.push(it);
    if (it.skip || it.a0 !== undefined || KINDS[k].soft || KINDS[k].plant && k !== 'bed_raised') return it;
    const to = o.to || [0, it.y !== undefined ? -0.4 : 0], L = Math.hypot(x - to[0], z - to[1]) || 1;
    const hh = it.low ? 0.3 : (k === 'stair' || k === 'shipstair' || k === 'ladder' ? 0.1 : undefined);
    for (let q = 0; q < Math.min(110, L / 0.01) && !fits(it, Z, hh); q++) { it.x -= (x - to[0]) / L * 0.01; it.z -= (z - to[1]) / L * 0.01; }   // never past the target
    return it;
  };
  const W = (k, az, o = {}) => {
    const K = KINDS[k], d = o.d || K.d, s = Math.sin(az * D), c = Math.cos(az * D), lat = o.lat || 0;
    const it = { k, r: az + 180, ...o }; delete it.lat;
    let rr = 0;
    for (let q = 0; q < 900; q += 1) { const t = Z.R(5) + 0.5 - q * 0.01; if (Z.inFloor(t * s, t * c)) { rr = t; break; } }
    for (let t = rr; t > d / 2; t -= 0.01) { it.x = t * s - lat * c; it.z = t * c + lat * s; if (fits(it, Z, o.checkH)) { rr = t; break; } rr = t; }
    it.x = (rr - (o.gap || 0)) * s - lat * c; it.z = (rr - (o.gap || 0)) * c + lat * s;
    items.push(it); return it;
  };
  const wall = (a, b, o = {}) => { const it = { k: 'wall', a, b, ...o }; items.push(it); return it; };
  // loft: floor plate running back from the straight open edge at zFront, clipped to the shell
  const loft = (y, zFront, o = {}) => {
    const pts = []; const clear = o.clear === undefined ? 0.03 : o.clear;
    const reach = (ax, az) => { let last = 0; for (let t = 0; t < Z.R(5) + 1; t += 0.01) { const x = t * ax, z = zFront + t * az; if (!Z.insideAt(x, Z.floorY + y + clear, z) || !Z.inFloor(x, z)) break; last = t; } return last; };
    for (let a = 90; a <= 270; a += 6) { const ax = Math.sin(a * D), az = Math.cos(a * D), t = reach(ax, az); pts.push([+(t * ax).toFixed(3), +(zFront + t * az).toFixed(3)]); }
    pts[0][1] = zFront; pts[pts.length - 1][1] = zFront;
    return { y: Z.floorY + y, deckH: y, zFront, poly: pts, stairGap: o.gap || null, posts: o.posts || null };
  };
  return { Z, F, W, wall, loft, items, y: h => Z.floorY + h };
}

function radial(F, k, n, r, a0 = 0, a1 = 360, o = {}) { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + (a1 - a0 === 360 ? 0 : 0.5)) / n; F(k, r * Math.sin(a * D), r * Math.cos(a * D), a + (o.flip ? 180 : 0), o); } }
function chairsAround(F, x, z, r, n, o = {}) { for (let i = 0; i < n; i++) { const a = (o.a0 || 0) + i * 360 / n; F('chair', x + r * Math.sin(a * D), z + r * Math.cos(a * D), a + 180); } }
function longTable(F, x, z, r, w, d, n) {   // table + n chairs a side
  F('table', x, z, r, { w, d });
  const s = Math.sin(r * D), c = Math.cos(r * D), step = w / n;
  for (let i = 0; i < n; i++) for (const side of [-1, 1]) { const lx = -w / 2 + (i + 0.5) * step, lz = side * (d / 2 + 0.27); F('chair', x + lx * c + lz * s, z - lx * s + lz * c, r + (side > 0 ? 180 : 0)); }
}

// ---- the plans ---------------------------------------------------------------------------------------------------------
// glass: null clad | 'all' every panel clear | 'upper' clear above the lower two rows | 'top' clear top rows only
const DEFS = [
  // ---------------------------------- ACORN 3 m ----------------------------------
  { id: 'acorn-sauna', type: 'acorn', name: 'Plan Sauna', use: 'Sauna', seats: 6, note: 'The use Trillium drew it for: curved bench sections screwed to the frame, stove opposite the door.', glaze: [[3, 90, 'home']],
    make: ({ F, W }) => { F('arcbench', 0, 0, 0, { a0: 52, a1: 142, r0: 0.72, r1: 1.2 }); F('arcbench', 0, 0, 0, { a0: -142, a1: -52, r0: 0.72, r1: 1.2 }); F('saunastove', 0, -0.72, 0); void W; } },
  { id: 'acorn-sleep', entryFill: true, type: 'acorn', name: 'Sleep Pod', use: 'Overnight pod', sleeps: 2, note: 'A double bed wall to wall across the widest flats. You step straight onto it: there is no other floor.', glaze: [[3, 162, 'home'], [3, -162, 'home']], sky: true,
    make: ({ F }) => { F('double', 0, -0.08, 90, { nohb: 1 }); } },
  { id: 'acorn-desk', type: 'acorn', name: 'Focus Pod', use: 'One-person office', seats: 1, note: 'One desk, one chair and a wall of shelves. Standing room only in the middle.', glaze: [[3, 90, 'home'], [3, -90, 'home']],
    make: ({ W }) => { W('desk', 180, { w: 1.2, d: 0.6 }); W('bookshelf', 90, { w: 0.8, h: 1.1 }); W('planter', -90); } },
  { id: 'acorn-tea', type: 'acorn', name: 'Tea Room', use: 'Tea / meditation', seats: 4, note: 'Sitting on the floor suits the low edge: every cushion has headroom for a seated person.', glaze: [[3, 162, 'tri'], [3, -162, 'tri']], sky: true,
    make: ({ F }) => { F('lowtable', 0, -0.28, 0, { w: 0.6, d: 0.6 }); F('cushion', 0, -0.8, 0, { w: 0.45, d: 0.45, col: '#b5603c' }); F('cushion', 0.68, -0.28, 90, { w: 0.5, d: 0.5, col: '#2f7f86' }); F('cushion', -0.68, -0.28, -90, { w: 0.5, d: 0.5, col: '#7d8f73' }); F('cushion', -0.72, 0.28, 0, { w: 0.4, d: 0.4, col: '#cfc4b0' }); } },
  { id: 'acorn-wash', type: 'acorn', name: 'Wash Pod', use: 'Shower + WC for a cluster of sites', note: 'The shower has to stand dead centre: that is the only place with 2 m of head height. WC and basin use the lower edges.', glaze: [[2, 0, 'tri']], sky: true,
    make: ({ F, W }) => { F('shower', 0, -0.32, 0, { w: 0.75, d: 0.75, to: [0, -0.32] }); W('toilet', 90); W('vanity', -90, { w: 0.55 }); } },
  // ---------------------------------- 5 m ----------------------------------
  { id: 'z5-guest', type: 'z5', name: 'Guest Studio', use: 'Couple, no kitchen or bath', sleeps: 2, seats: 2, note: 'The simple cabin: queen bed, two chairs, stove. Bath and meals at the shared buildings.', glaze: [[4, 72, 'home'], [4, -72, 'home'], [3, 162, 'tri'], [3, -162, 'tri']],
    make: ({ F, W }) => { W('queen', 180); F('rug', 0, 0.1, 0, { w: 1.8, d: 1.0 }); W('woodstove', 72, { w: 0.8, d: 0.8 }); W('wardrobe', -108); F('armchair', -1.4, 0.68, 120, { to: [-1.25, 0.2] }); F('armchair', 1.35, -0.5, -120, { col: '#2f7f86', to: [1.2, -0.3] }); W('bench', 36, { w: 1.0 }); } },
  { id: 'z5-ensuite', type: 'z5', name: 'Ensuite Cabin', use: 'Couple, self-contained', sleeps: 2, note: 'Queen on one side, bath on the other, kitchenette across the back. Shower sits inboard where the height is.', glaze: [[4, -72, 'home'], [4, -144, 'home'], [3, 18, 'tri']],
    make: ({ W, F, wall }) => {
      W('counter', 180, { w: 1.4, appl: ['sink', 'hob'] }); W('double', -90, { lat: 0.22 });
      wall([0.6, -1.3], [0.6, 1.02], { door: 0.76, dw: 0.72, swing: 1 }); wall([0.6, 1.02], [2.1, 1.02]); wall([0.6, -1.3], [2.0, -1.3]);
      F('shower', 1.1, -0.72, 0, { w: 0.8, d: 0.8, to: [1.1, -0.3] }); F('toilet', 1.85, 0.15, -90, { to: [1, 0] }); F('vanity', 1.45, 0.72, 180, { w: 0.6 }); } },
  { id: 'z5-loft', type: 'z5', name: 'Loft Nest', use: 'Couple + 2 on the sofa bed', sleeps: 4, note: 'Sleeping loft under the peak, reached by ladder. The loft is for sitting up, not standing: 1.5 m at its highest. Under the loft you get 1.88 m.', glaze: [[4, 72, 'home'], [4, -72, 'home'], [3, 18, 'tri'], [3, -18, 'tri']], sky: true,
    make: ({ W, F, loft, y }) => ({ loft: loft(2.06, 0.62, { gap: [0.85, 1.35] }), after() { W('counter', 180, { w: 2.0, appl: ['sink', 'hob'] }); W('fridge', 126, {}); F('ladder', 1.1, 0.84, 0, { top: 2.06 }); W('sofabed', -90, { w: 1.9 }); W('woodstove', -36, { w: 0.8, d: 0.8 }); F('double', 0, -0.4, 180, { y: y(2.06), low: 1, to: [0, 0.45] }); F('rug', -0.3, 1.15, 0, { w: 0.9, d: 0.7 }); } }) },
  { id: 'z5-bunk', type: 'z5', name: 'Bunkhouse', use: 'Work-stay crew or hostel', sleeps: 6, note: 'Three bunks against the flats, lockers between.  Bath at the shower house.', glaze: [[3, 54, 'tri'], [3, -54, 'tri'], [3, 162, 'tri'], [3, -162, 'tri']],
    make: ({ W, F }) => { W('bunk', 180); F('bunk', 1.4, -0.3, 0, { to: [0.95, -0.3] }); F('bunk', -1.4, -0.3, 0, { to: [-0.95, -0.3] }); W('cabinet', 36, { w: 0.8 }); W('cabinet', -36, { w: 0.8 }); F('rug', 0, 0.3, 0, { w: 1.0, d: 1.0 }); } },
  { id: 'z5-work', type: 'z5', name: 'Work Studio', use: 'Two desks + a daybed', sleeps: 1, seats: 2, note: 'Desks face the two rear windows; daybed for a nap or a guest.', glaze: [[4, 144, 'home'], [4, -144, 'home'], [4, -72, 'full']],
    make: ({ W, F }) => { W('desk', 144, { w: 1.3 }); W('desk', -144, { w: 1.3 }); F('daybed', 1.5, 0.15, 0, { to: [1.35, 0.15] }); W('bookshelf', -100, { w: 1.2 }); F('armchair', -1.4, 0.8, 135, { to: [-1.4, 0.2] }); W('planter', -36); } },
  { id: 'z5-therapy', type: 'z5', name: 'Treatment Room', use: 'Massage or bodywork', seats: 1, note: 'A table in the middle with 900 mm clear all round, so a practitioner can walk the full circle.', glaze: [[3, 54, 'tri'], [3, -54, 'tri']], sky: true,
    make: ({ W, F }) => { F('massage', 0, -0.52, 0, { to: [0, -0.52] }); W('cabinet', 144); W('bench', -144, { w: 1.0 }); F('stool', 0.8, -1.2, 0); W('planter', 72); W('planter', -72); F('rug', 0, -0.5, 0, { w: 2.0, d: 2.4, col: '#cfc4b0' }); } },

  // ---------------------------------- 6 m ----------------------------------
  { id: 'z6-onebed', type: 'z6', name: 'One-Bedroom Cabin', use: 'Couple, full kitchen + bath', sleeps: 4, seats: 4, note: 'A proper separate bedroom at the back. Living and galley up front, sofa bed for two more.', glaze: [[4, 144, 'home'], [4, -144, 'home'], [4, -72, 'full'], [4, 36, 'full'], [4, -36, 'full']],
    make: ({ W, F, wall }) => {
      wall([-2.85, -0.55], [2.85, -0.55], { door: 0.596, swing: 1 }); W('queen', 180); W('wardrobe', 126, { w: 1.0 });
      wall([1.05, -0.55], [1.05, 1.1], { door: 0.68, dw: 0.75 }); wall([1.05, 1.1], [2.72, 1.1]);
      F('shower', 1.52, -0.05, 0, { w: 0.85, d: 0.85 }); F('toilet', 2.4, 0.15, -90, { to: [1, 0.15] }); F('vanity', 2.3, 0.85, 180, { w: 0.6, to: [1.5, 0.85] });
      F('counter', -2.4, 0.1, 90, { w: 1.2, to: [0, 0.1] }); F('fridge', -2.4, 1.05, 90, { to: [0, 1.05] }); F('sofabed', -0.66, -0.06, 0, { w: 1.6, to: [-0.66, -0.06] }); F('ctable', -1.0, 0.72, 0, { w: 0.9, d: 0.5 }); F('rug', -0.75, 0.5, 0, { w: 1.8, d: 1.2 }); W('woodstove', 36, { w: 0.8, d: 0.8 }); } },
  { id: 'z6-loft', type: 'z6', name: 'Loft Cabin', use: 'Small family, open plan', sleeps: 4, seats: 4, note: 'The concept-render layout: kitchen and bath under a sleeping loft, tall living room in front. Loft has 1.79 m at its highest, under it 1.96 m.', glaze: [[4, 72, 'full'], [4, -72, 'full'], [4, 36, 'full'], [4, -36, 'full']], sky: true,
    make: ({ W, F, wall, loft, y }) => ({ loft: loft(2.14, 0.55, { gap: [1.3, 2.0] }), after() {
      W('counter', 180, { w: 2.2, appl: ['sink', 'hob'] }); W('fridge', 126);
      wall([-1.0, -1.3], [-1.0, 0.3], { door: 0.7, dw: 0.72 }); wall([-1.0, 0.3], [-2.75, 0.3]); wall([-1.0, -1.3], [-2.15, -1.3]);
      F('shower', -1.5, -0.8, 0, { w: 0.85, d: 0.85, to: [-1.1, -0.4] }); F('toilet', -2.4, -0.45, 90, { to: [-1, -0.45] }); F('vanity', -1.65, 0.05, 180, { w: 0.6 });
      F('shipstair', 1.65, 1.35, 0, { top: 2.14 }); F('sofa', -1.75, 0.78, 0, { w: 1.6, to: [-1.75, 0.78] }); F('rug', -1.45, 1.45, 0, { w: 1.3, d: 0.8 }); F('woodstove', -1.5, 1.95, 30, { w: 0.8, d: 0.8, to: [-1.3, 1.85] });
      F('double', -0.72, -0.41, 180, { y: y(2.14), low: 1, to: [-0.72, 0.2] }); F('double', 0.72, -0.41, 180, { y: y(2.14), low: 1, to: [0.72, 0.2] }); } }) },
  { id: 'z6-family', type: 'z6', name: 'Family Cabin', use: 'Parents + kids', sleeps: 4, seats: 2, note: 'Parents’ room and a kids’ bunk room side by side, bath and kitchen up front. A second bunk won’t fit: the sloped shell cuts its top corner off.', glaze: [[4, 108, 'home'], [4, -108, 'home'], [4, 36, 'full'], [4, -36, 'full'], [3, 18, 'tri']],
    make: ({ W, F, wall }) => {
      wall([-2.85, -0.35], [0.3, -0.35], { door: 0.8, swing: -1 }); wall([0.3, -0.35], [2.85, -0.35], { door: 0.15, swing: -1 }); wall([0.3, -0.35], [0.3, -2.85]);
      F('queen', -0.72, -1.42, 0, { to: [-0.72, -1.3] });
      F('bunk', 0.88, -1.42, 0, { to: [0.88, -1.0] }); W('cabinet', 126, { w: 0.7 });
      wall([1.2, -0.35], [1.2, 1.25], { door: 0.65, dw: 0.75 }); wall([1.2, 1.25], [2.55, 1.25]);
      F('shower', 1.62, 0.1, 0, { w: 0.8, d: 0.8 }); F('toilet', 2.45, 0.6, -90, { to: [1.3, 0.6] }); F('vanity', 1.6, 1.02, 180, { w: 0.5 });
      F('counter', -2.45, 0.45, 90, { w: 1.5, to: [0, 0.45] }); F('rtable', -1.1, 0.62, 0, { w: 0.9, d: 0.9 }); F('chair', -1.1, -0.06, 0); F('chair', -1.1, 1.3, 180); W('bench', -36, { w: 1.0 }); } },
  { id: 'z6-access', type: 'z6', name: 'Accessible Cabin', use: 'Wheelchair-friendly stay', sleeps: 2, seats: 2, note: 'No steps inside, a roll-in shower, 900 mm clear doors, 1.5 m turning circles at the bed, bath and kitchen. Needs a ramp in place of the plan’s entry steps.', glaze: [[4, 144, 'home'], [4, -144, 'home'], [4, -72, 'full'], [4, 36, 'full']], sky: true,
    make: ({ W, F, wall }) => {
      W('queen', 180);
      wall([0.8, -1.72], [0.8, 0.82], { door: 0.78, dw: 0.9 }); wall([0.8, 0.82], [2.72, 0.82]); wall([0.8, -1.72], [2.1, -1.72]);
      F('rollshower', 1.38, -1.0, 0, { w: 1.1, d: 1.0 }); F('toilet', 2.3, 0.15, -90, { to: [1, 0.15] }); F('vanity', 1.25, 0.58, 180, { w: 0.6 });
      W('counter', -90, { w: 1.9, h: 0.84 }); F('rtable', -1.15, 0.9, 0, { w: 0.85, d: 0.85 }); F('chair', -1.15, 0.22, 0); F('chair', -1.15, 1.58, 180); } },
  { id: 'z6-office', type: 'z6', name: 'Team Office', use: 'Five desks + meetings', seats: 9, note: 'Desks on the flats so everyone gets a window; round table for four in the tall middle.', glaze: [[4, 72, 'full'], [4, -72, 'full'], [4, 144, 'full'], [4, -144, 'full'], [4, 180, 'home']], sky: true,
    make: ({ W, F }) => { W('desk', 72); W('desk', -72); W('desk', 144); W('desk', -144); W('desk', 180, { w: 1.2 }); F('rtable', 0, -0.2, 0); F('chair', -0.85, -0.2, 90); F('chair', 0.85, -0.2, -90); F('chair', 0, -1.0, 0); W('counter', 36, { w: 1.3, appl: ['sink'] }); W('bookshelf', -36, { w: 1.3 }); } },
  { id: 'z6-yoga', type: 'z6', name: 'Movement Room', use: 'Yoga, 7 mats', seats: 7, note: 'Seven mats in a ring around the tall middle, with arms-up height at the head of each mat.', glaze: [[4, 108, 'full'], [4, -108, 'full'], [4, 180, 'full'], [4, 36, 'full'], [4, -36, 'full']], sky: true,
    make: ({ F, W }) => { radial(F, 'mat', 7, 1.82, 40, 320, { w: 0.6 }); W('bookshelf', 54, { w: 0.9, h: 0.9, gap: 0 }); F('planter', 0, 0.1, 0); } },

  // ---------------------------------- 7.5 m ----------------------------------
  { id: 'z75-twobed', type: 'z75', name: 'Two-Bedroom Home', use: 'Family or two couples', sleeps: 6, seats: 6, note: 'Two bedrooms along the back, bath between kitchen and living, great room under the peak (4.7 m).', glaze: [[5, 126, 'home'], [5, -126, 'home'], [5, 90, 'full'], [5, 54, 'full'], [5, -54, 'full'], [4, 162, 'full'], [4, -162, 'full']], sky: true,
    make: ({ W, F, wall }) => {
      wall([-3.48, -0.8], [3.48, -0.8], { door: 0.6, swing: -1 }); wall([0.3, -0.8], [0.3, -3.5], { door: 0.14, swing: -1 });
      F('queen', -1.2, -2.0, 0, { to: [-1.2, -0.9] }); F('queen', 1.3, -2.15, 0, { to: [1.3, -0.9] }); F('wardrobe', -2.6, -1.42, 90, { w: 1.0, to: [-1, -1.42] }); F('wardrobe', 2.65, -1.42, -90, { w: 1.0, to: [1, -1.42] });
      wall([-1.55, -0.8], [-1.55, 0.95], { door: 0.7, dw: 0.75, swing: 1 }); wall([-1.55, 0.95], [-3.48, 0.95]);
      F('shower', -2.0, -0.3, 0); F('toilet', -3.1, 0.1, 90); F('vanity', -2.75, 0.7, 180);
      F('counter', 3.08, 0.75, -90, { w: 1.6, to: [0, 0.75] }); F('fridge', 2.95, -0.42, -90, { to: [0, -0.42] }); F('island', 1.55, 0.6, -90, { w: 1.5 }); F('stool', 0.82, 0.2, -90); F('stool', 0.82, 1.0, -90);
      F('sofabed', -2.1, 1.45, 0, { w: 1.6, to: [-2.05, 1.45] }); F('ctable', -2.05, 2.35, 0, { w: 0.9, d: 0.5 }); F('rug', -1.95, 1.85, 0, { w: 1.3, d: 1.0 }); F('woodstove', 1.55, 2.7, 0, { w: 0.8, d: 0.8 }); } },
  { id: 'z75-loft', type: 'z75', name: 'Loft Home', use: 'Couple + guests in the loft', sleeps: 5, seats: 6, note: 'Main bedroom on the ground, a real stair up to a loft with standing room in the middle. Under-loft height 2.2 m.', glaze: [[5, 90, 'full'], [5, -90, 'full'], [5, 54, 'full'], [5, -54, 'full'], [4, 162, 'home']], sky: true,
    make: ({ W, F, wall, loft, y }) => ({ loft: loft(2.4, -0.3, { gap: [1.38, 2.32] }), after() {
      wall([-3.48, -0.5], [0.1, -0.5], { door: 0.8, swing: -1 }); wall([0.1, -0.5], [0.1, -3.5]);
      F('queen', -1.2, -2.0, 0, { to: [-1.2, -0.6] }); F('wardrobe', -2.85, -1.0, 90, { w: 1.0, to: [-1, -1] });
      wall([0.1, -1.95], [2.15, -1.95], { door: 0.45, dw: 0.75, swing: -1 }); F('shower', 0.65, -2.45, 0, { to: [0.6, -2] }); F('toilet', 1.55, -2.6, 0, { to: [1.5, -2] });
      F('counter', 1.3, -1.62, 0, { w: 2.0 }); F('fridge', 2.65, -1.0, -90, { to: [1, -1] }); F('island', 0.6, 0.15, 0, { w: 1.3 });
      F('stair', 1.85, 1.2, 0, { top: 2.4 }); longTable(F, -1.9, 0.65, 90, 1.8, 0.9, 3); F('armchair', -2.05, 2.3, 150, { to: [-1.9, 2.1] });
      F('double', -0.72, -1.3, 180, { y: y(2.4), low: 1, to: [-0.72, -0.6] }); F('single', 0.5, -1.3, 180, { y: y(2.4), low: 1, to: [0.5, -0.6] }); F('lowtable', 1.5, -0.72, 0, { y: y(2.4), w: 0.9, d: 0.5, to: [1.5, -0.6] }); F('cushion', 1.5, -1.25, 0, { y: y(2.4), w: 0.5, d: 0.5 }); } }) },
  { id: 'z75-family', type: 'z75', name: 'Family Home', use: 'Big family, 3 sleeping zones', sleeps: 8, seats: 8, note: 'Parents’ room, bunk room for four, sofa bed in the living room, table for eight.', glaze: [[5, 126, 'home'], [5, -126, 'home'], [5, 90, 'full'], [5, -90, 'full'], [5, 54, 'full'], [5, -54, 'full']], sky: true,
    make: ({ W, F, wall }) => {
      wall([-3.48, -0.95], [3.48, -0.95], { door: 0.34, swing: -1 }); wall([0, -0.95], [0, -3.65]);
      F('queen', -1.0, -2.0, 0, { to: [-1.0, -1.2] }); F('wardrobe', -2.6, -1.4, 90, { w: 0.9, to: [-1, -1.4] });
      F('bunk', 0.62, -2.2, 0, { to: [0.62, -1.2] }); F('bunk', 1.72, -2.2, 0, { to: [1.4, -1.2] }); F('cabinet', 2.6, -1.25, -90, { w: 0.6, to: [1.5, -1.25] });
      wall([1.75, -0.95], [1.75, 0.9], { door: 0.72, dw: 0.78 }); wall([1.75, 0.9], [3.45, 0.9]);
      F('shower', 2.25, -0.42, 0); F('toilet', 3.05, 0.05, -90); F('vanity', 2.55, 0.62, 180);
      F('counter', -3.08, 0.75, 90, { w: 1.6, to: [0, 0.75] }); F('fridge', -2.95, -0.42, 90, { to: [0, -0.42] }); longTable(F, -0.5, 0.45, 0, 2.2, 0.9, 3); F('sofabed', 2.3, 1.85, -90, { w: 1.6, to: [1.8, 1.85] }); F('rug', 1.5, 1.85, 90, { w: 1.4, d: 0.5 }); F('woodstove', -1.5, 2.65, 0, { w: 0.8, d: 0.8 }); } },
  { id: 'z75-cowork', type: 'z75', name: 'Coworking', use: '9 desks, a booth, coffee', seats: 13, note: 'Long shared table in the middle, wall desks on the flats, one call booth, a coffee bar by the door.', glaze: [[5, 90, 'full'], [5, -90, 'full'], [5, 126, 'full'], [5, -126, 'full'], [5, 162, 'full'], [5, -162, 'full']], sky: true,
    make: ({ W, F }) => { F('longdesk', 0, -0.2, 90, { w: 3.0 }); for (const s of [-1, 1]) for (const z of [-1.3, -0.2, 0.9]) F('chair', s * 0.7, z, -s * 90); W('desk', 90); W('desk', -90); W('desk', -126, { w: 1.3 }); W('booth', 126); W('bookshelf', 162, { w: 1.2 }); W('counter', 54, { w: 1.8, appl: ['sink', 'espresso'] }); W('sofa', -54, { w: 1.8 }); } },
  { id: 'z75-cafe', type: 'z75', name: 'Café', use: '20 seats + serving bar', seats: 20, note: 'Serving bar across the back, kitchen behind it, bistro tables round the glazed bays.', glaze: [[5, 90, 'full'], [5, -90, 'full'], [5, 54, 'full'], [5, -54, 'full']], sky: true,
    make: ({ F, W, wall }) => {
      wall([-2.45, -1.72], [2.45, -1.72], { h: 1.1 }); F('servebar', 0, -1.35, 0, { w: 2.4 }); F('counter', 0, -3.0, 0, { w: 2.2, appl: ['sink', 'hob'] }); F('fridge', -1.6, -2.5, 90); F('counter', 1.65, -2.25, -90, { w: 1.0, appl: ['espresso'] });
      for (const [x, z] of [[-2.55, -0.45], [2.55, -0.45], [-2.3, 1.35], [2.3, 1.35], [-0.95, 0.75], [0.95, 0.75]]) { F('bistro', x, z); F('chair', x - 0.6, z, 90); F('chair', x + 0.6, z, -90); }
      F('bench', -1.82, 2.75, 180, { w: 1.0 }); F('bench', 1.82, 2.75, 180, { w: 1.0 }); F('stool', -0.95, -0.72, 180); F('stool', 0, -0.72, 180); F('stool', 0.95, -0.72, 180); } },
  { id: 'z75-spa', type: 'z75', name: 'Spa Suite', use: 'Two treatment rooms + sauna', seats: 10, note: 'Two private treatment rooms at the back, a sauna cabin and a lounge. Nothing here needs plumbing beyond one shower.', glaze: [[5, 90, 'home'], [5, -90, 'home'], [5, 54, 'full'], [5, -54, 'full']], sky: true,
    make: ({ F, W, wall }) => {
      wall([-3.48, -1.0], [3.48, -1.0], { door: 0.3, swing: -1 }); wall([0, -1.0], [0, -3.65]);
      F('massage', -1.6, -2.0, 90, { to: [-1.4, -1.3] }); F('massage', 1.6, -2.0, 90, { to: [1.4, -1.3] }); F('cabinet', -0.27, -2.55, -90, { w: 0.8, d: 0.4, to: [-0.27, -2] }); F('cabinet', 0.27, -2.55, 90, { w: 0.8, d: 0.4, to: [0.27, -2] });
      wall([1.45, -1.0], [1.45, 0.0], { door: 0.5, dw: 0.7, swing: 1 }); wall([1.45, 0], [3.48, 0]); F('shower', 2.0, -0.5, 0); F('saunabox', -2.2, 0.15, 90, { to: [0, 0.15] });
      F('lounger', -0.75, 0.45, 0); F('lounger', 0.75, 0.45, 0); F('lounger', 2.35, 0.95, -90); F('towel', 1.6, 3.0, 0, { to: [1.5, 2.5] }); F('rug', 0, 0.45, 0, { w: 2.4, d: 1.4, col: '#cfc4b0' }); W('planter', -54, {}); } },
  // ---------------------------------- 9 m ----------------------------------
  { id: 'z9-threebed', type: 'z9', name: 'Three-Bedroom Home', use: 'Large household', sleeps: 8, seats: 8, note: 'Three bedrooms round the back, two baths, kitchen, table for eight, sofa bed. Everything is at full standing height: this zome’s walls stay above 2 m almost to the floor edge.', glaze: [[5, 144, 'home'], [5, -144, 'home'], [5, 180, 'home'], [5, 72, 'full'], [5, -72, 'full'], [5, 36, 'full'], [5, -36, 'full']], sky: true,
    make: ({ W, F, wall }) => {
      wall([-4.14, -1.2], [4.14, -1.2], { door: 0.5, swing: -1 }); wall([-1.35, -1.2], [-1.35, -4.1], { door: 0.1, swing: 1 }); wall([1.35, -1.2], [1.35, -4.1], { door: 0.1, swing: -1 });
      F('queen', 0, -3.0, 0); F('double', -2.15, -2.17, 0, { to: [-2.15, -1.3] }); F('double', 2.15, -2.17, 0, { to: [2.15, -1.3] });
      wall([-4.14, 0.75], [-2.0, 0.75]); wall([-2.0, -1.2], [-2.0, 0.75], { door: 0.3, dw: 0.75, swing: 1 }); F('shower', -2.55, -0.65, 0); F('toilet', -3.65, -0.3, 90); F('vanity', -3.2, 0.5, 180);
      wall([2.0, -1.2], [2.0, 0.75], { door: 0.3, dw: 0.75, swing: -1 }); wall([2.0, 0.75], [4.14, 0.75]); F('shower', 2.55, -0.65, 0); F('toilet', 3.65, -0.3, -90); F('vanity', 3.2, 0.5, 180);
      F('counter', -3.05, 1.72, 90, { w: 1.5, to: [0, 1.72] }); F('fridge', -2.1, 2.65, 180, { to: [-1.5, 2] }); F('island', -1.75, 1.55, 90, { w: 1.4 }); longTable(F, 0.2, 0.2, 0, 2.2, 0.9, 3); F('sofabed', 2.55, 1.95, -90, { w: 1.9 }); F('ctable', 1.45, 1.95, 90); F('rug', 1.6, 1.95, 90, { w: 2.0, d: 1.5 }); F('woodstove', 2.3, 3.6, 0, { w: 0.8, d: 0.8, to: [1.9, 3] }); } },
  { id: 'z9-mezz', type: 'z9', name: 'Mezzanine Home', use: 'Two bedrooms + big loft', sleeps: 8, seats: 8, note: 'A full mezzanine over the rear half with 2.3 m beneath and up to 3.1 m above it. Two bedrooms below, sleeping and office space above.', glaze: [[5, 72, 'full'], [5, -72, 'full'], [5, 36, 'full'], [5, -36, 'full'], [5, 144, 'home'], [5, -144, 'home']], sky: true,
    make: ({ W, F, wall, loft, y }) => ({ loft: loft(2.5, 0.2, { gap: [-3.4, -2.4] }), after() {
      wall([-1.3, 0.2], [-1.3, -4.1], { door: 0.1, swing: 1 }); wall([1.3, 0.2], [1.3, -4.1], { door: 0.1, swing: -1 });
      F('queen', -2.38, -0.8, 90, { to: [-2, -0.8] }); F('queen', 2.38, -0.8, -90, { to: [2, -0.8] });
      wall([-1.3, -2.55], [1.3, -2.55], { door: 0.5, dw: 0.75, swing: -1 }); F('shower', -0.65, -3.15, 0); F('toilet', 0.7, -3.6, 0);
      F('counter', 0, -2.2, 0, { w: 2.2 }); F('island', 0, -0.95, 0, { w: 1.6 }); F('stool', -0.45, -0.28, 0); F('stool', 0.45, -0.28, 0);
      F('stair', -2.95, 1.75, 0, { top: 2.5 }); longTable(F, 2.5, 1.2, 90, 1.8, 0.9, 3); F('sofa', -1.4, 1.05, 90, { w: 1.6 }); F('ctable', -0.35, 1.05, 90, { w: 0.9, d: 0.5 }); F('armchair', 0.55, 1.05, -90); F('rug', -0.4, 1.05, 90, { w: 1.6, d: 2.2 });
      F('queen', -1.2, -1.3, 180, { y: y(2.5), low: 1, to: [-1, -0.3] }); F('queen', 1.2, -1.3, 180, { y: y(2.5), low: 1, to: [1, -0.3] }); F('desk', 2.7, -0.7, -90, { y: y(2.5), to: [1.8, -0.7] }); } }) },
  { id: 'z9-great', type: 'z9', name: 'Great Room', use: 'One big room + a sleeping loft', sleeps: 6, seats: 10, note: 'The layout from the Portal.Place concept renders: kitchen along the back under a loft, sofas and a long table below the star skylight.', glaze: [[5, 90, 'full'], [5, -90, 'full'], [5, 72, 'full'], [5, -72, 'full'], [5, 36, 'full'], [5, -36, 'full']], sky: true,
    make: ({ W, F, wall, loft, y }) => ({ loft: loft(2.6, -0.8, { gap: [2.07, 3.03] }), after() {
      F('counter', 0, -3.62, 0, { w: 2.6 }); F('fridge', -1.75, -3.2, 0); wall([1.5, -3.75], [1.5, -1.95], { door: 0.6, dw: 0.75, swing: 1 }); F('toilet', 2.3, -3.1, -45); F('vanity', 2.15, -2.2, 180, { w: 0.6 });
      F('island', -0.25, -2.45, 0, { w: 1.8 }); F('stair', 2.55, 0.7, 0, { top: 2.6 });
      longTable(F, -2.3, -0.05, 90, 2.6, 1.0, 4); F('sofa', -0.05, -0.35, 0, { w: 2.2, col: '#2a3f57' }); F('sofabed', 1.55, 0.9, -90, { w: 1.8 }); F('armchair', -2.0, 1.95, 100, { col: '#b5603c' }); F('rug', -0.05, 0.5, 0, { w: 2.5, d: 1.9 }); F('ctable', -0.05, 0.75, 0, { w: 1.2, d: 0.6 }); W('woodstove', -54, {});
      F('queen', -0.95, -1.85, 180, { y: y(2.6), low: 1, to: [-0.95, -1.0] }); F('double', 1.3, -1.8, 180, { y: y(2.6), low: 1, to: [1.3, -1.0] }); } }) },
  { id: 'z9-class', type: 'z9', door: 'C', name: 'Classroom', use: '24 seats, screen, store', seats: 24, note: 'Uses the wide “Basic” doorway for moving gear. Screen on the back flat, curved rows facing it.', glaze: [[5, 72, 'full'], [5, -72, 'full'], [5, 108, 'home'], [5, -108, 'home']], sky: true,
    make: ({ F, W }) => { F('screen', 0, -3.9, 0, { w: 2.8 }); for (const [r, n, a] of [[3.5, 10, 52], [2.5, 8, 54], [1.5, 6, 58]]) for (let i = 0; i < n; i++) { const t = -a + 2 * a * i / (n - 1); F('chair', r * Math.sin(t * D), -3.4 + r * Math.cos(t * D), t + 180); } W('cabinet', 126, { w: 1.2 }); W('cabinet', -126, { w: 1.2 }); W('counter', -54, { w: 1.6, appl: ['sink'] }); W('bookshelf', 54, { w: 1.6 }); } },
  { id: 'z9-dining', type: 'z9', door: 'C', name: 'Dining Hall', use: '32 seats + kitchen', seats: 32, note: 'Commercial-style kitchen line across the back, four long tables. The wide doorway helps service and groups.', glaze: [[5, 72, 'full'], [5, -72, 'full'], [5, 36, 'full'], [5, -36, 'full']], sky: true,
    make: ({ F, wall }) => { wall([-3.2, -2.0], [3.2, -2.0], { h: 1.15 }); F('servebar', 0, -1.65, 0, { w: 2.8 }); F('counter', 0, -3.65, 0, { w: 2.6 }); F('counter', -2.3, -3.0, 45, { w: 1.2, appl: ['hob'] }); F('counter', 2.3, -3.0, -45, { w: 1.2, appl: ['sink'] }); F('fridge', -1.55, -2.45, 180); F('fridge', 1.55, -2.45, 180);
      longTable(F, -2.1, -0.15, 90, 2.4, 0.9, 4); longTable(F, 2.1, -0.15, 90, 2.4, 0.9, 4); longTable(F, -2.0, 2.1, 0, 1.6, 0.9, 2); longTable(F, 2.0, 2.1, 0, 1.6, 0.9, 2); longTable(F, 0, 0.05, 90, 2.0, 0.8, 3 ); } },
  { id: 'z9-maker', type: 'z9', name: 'Maker + Coworking', use: 'Long table, benches, printers', seats: 18, note: 'From the concept render: one long table under the peak, workbenches and printers round the edge. No zome-scale machinery: small tools only.', glaze: [[5, 72, 'full'], [5, -72, 'full'], [5, 108, 'full'], [5, -108, 'full'], [5, 36, 'full'], [5, -36, 'full']], sky: true,
    make: ({ W, F }) => { F('longdesk', -0.4, -0.2, 90, { w: 4.2, d: 1.1 }); for (const s of [-1, 1]) for (const z of [-1.8, -0.7, 0.4, 1.5]) F('chair', -0.4 + s * 0.78, z, -s * 90); W('workbench', 90); W('workbench', 54); W('workbench', 126); W('printer', 162); W('printer', -162); W('printer', 180, {lat:0}); W('desk', -90); W('desk', -126); W('desk', -54); } },
  { id: 'z9-yoga', type: 'z9', name: 'Practice Hall', use: 'Yoga or dance, 16 mats', seats: 16, note: 'A clear floor. Twelve mats in a ring with four inside it, props along the sides.', glaze: [[5, 72, 'full'], [5, -72, 'full'], [5, 144, 'full'], [5, -144, 'full'], [5, 36, 'full'], [5, -36, 'full']], sky: true,
    make: ({ F, W }) => { radial(F, 'mat', 12, 3.1, 28, 332); for (const a of [45, 135, 225, 315]) F('mat', 1.42 * Math.sin(a * D), 1.42 * Math.cos(a * D), a + 90, { col: '#b5603c' }); W('bookshelf', 90, { w: 1.6, h: 1.0 }); W('bookshelf', -90, { w: 1.6, h: 1.0 }); F('planter', 0, 0.1, 0); } },

  // ---------------------------------- TRANSPARENT ----------------------------------
  { id: 'gl-acorn-tub', entryFill: true, type: 'acorn', glass: 'all', group: 'Hot tub', name: 'Tub Acorn', use: 'Two-person hot tub', seats: 2, note: 'Nearly all floor is tub: 1.75 m across. You step from the door straight up onto the tub step.',
    make: ({ F }) => { F('hottub', 0, -0.3, 0, { w: 1.72, d: 1.72, nostep: 1 }); } },
  { id: 'gl-acorn-seed', type: 'acorn', glass: 'all', group: 'Garden', name: 'Seedling Acorn', use: 'Seed starting + herbs', note: 'Tiny propagation house: benches round the edge, hanging baskets in the middle.',
    make: ({ W, F }) => { W('potting', 90, { w: 0.85, d: 0.5 }); W('potting', -90, { w: 0.85, d: 0.5 }); W('bed_raised', 180, { w: 1.0, d: 0.5 }); F('hanging', 0, 0, 0); F('hanging', 0.25, -0.35, 0); F('hanging', -0.28, -0.3, 0); } },
  { id: 'gl-acorn-star', entryFill: true, type: 'acorn', glass: 'upper', group: 'Other', name: 'Star Pod', use: 'One-night stargazing bed', sleeps: 2, note: 'Solid lower rows for privacy, clear above the mattress. Same bed layout as the Sleep Pod.',
    make: ({ F }) => { F('double', 0, -0.08, 90, { nohb: 1 }); } },

  { id: 'gl-z5-garden', type: 'z5', glass: 'all', group: 'Garden', name: 'Kitchen Garden', use: 'Raised beds + potting', note: 'Raised beds on the flats, a walking loop, a potting bench. The tall middle holds a fig or dwarf citrus.',
    make: ({ W, F }) => { for (const a of [72, 108, 144, -72, -108, -144]) W('bed_raised', a, { w: 1.02, d: 0.7 }); W('potting', 180, { w: 1.0 }); F('tree', 0, -0.2, 0, { w: 1.0, d: 1.0, h: 2.9 }); F('hanging', 0.8, 0.8, 0); F('hanging', -0.8, 0.8, 0); } },
  { id: 'gl-z5-tub', type: 'z5', glass: 'all', group: 'Hot tub', name: 'Hot Tub Room', use: 'Six-person tub + changing', seats: 6, note: 'A 2.3 m cedar tub in the middle, bench, towel rack and space to change. Winter steam will need venting, which isn’t drawn yet.',
    make: ({ F, W }) => { F('hottub', 0, -0.62, 0, { w: 2.2, d: 2.2, nostep: 1, to: [0, -0.62] }); W('bench', 72, { w: 1.1 }); W('bench', -72, { w: 1.1 }); W('towel', 36); W('planter', -36); W('planter', 144); W('planter', -144); } },
  { id: 'gl-z5-star', type: 'z5', glass: 'upper', group: 'Other', name: 'Stargazer Suite', use: 'Sky-view bedroom', sleeps: 2, seats: 2, note: 'Lower two rows stay solid for privacy. Queen bed in the middle so the whole star pattern is overhead. A telescope for the dark Wells Gray sky.',
    make: ({ W, F }) => { F('queen', 0, -0.56, 0, { to: [0, -0.56] }); W('telescope', 72); W('armchair', -72, { col: '#2a3f57' }); W('woodstove', 108, { w: 0.8, d: 0.8 }); W('cabinet', -144, { w: 0.6 }); F('rug', 0, 0.55, 0, { w: 2.0, d: 1.0 }); } },
  { id: 'gl-z5-tea', type: 'z5', glass: 'all', group: 'Other', name: 'Forest Tea House', use: 'Sit-down tea for eight', seats: 8, note: 'Low table on a raised rug, cushions all round, a kettle counter at the back. Plants instead of walls.',
    make: ({ F, W }) => { F('rug', 0, -0.25, 0, { w: 2.5, d: 2.5, col: '#cfc4b0' }); F('lowtable', 0, -0.25, 0, { w: 1.2, d: 1.2 }); radial(F, 'cushion', 8, 1.08, 0, 360, {}); W('counter', 180, { w: 1.2, appl: ['espresso'] }); W('planter', 108); W('planter', -108); W('planter', 72); W('planter', -72); } },
  { id: 'gl-z5-jam', type: 'z5', glass: 'all', group: 'Other', name: 'Jam Room', use: 'Music in the trees', seats: 5, note: 'Piano, drums, amps. Not soundproof: polycarbonate leaks sound, so this one sits away from the sleeping cabins.',
    make: ({ W, F }) => { W('piano', -108); F('stool', -1.05, 0.05, 90 + 180); W('drums', 144); W('amp', 72); W('amp', -36, {}); F('rug', 0, -0.2, 0, { w: 2.2, d: 2.2, col: '#b5603c' }); F('chair', 1.1, 0.0, -135); F('chair', -0.45, -0.25, 150); } },
  { id: 'gl-z6-garden', type: 'z6', glass: 'all', group: 'Garden', name: 'Pond Garden', use: 'Beds, a small pond, potting bench', note: 'Beds on seven flats, a rock-edged pond in the tall middle, potting bench under the back panels.',
    make: ({ W, F }) => { for (const a of [72, 108, 144, -72, -108, -144, 36]) W('bed_raised', a, { w: 1.38, d: 0.75 }); W('potting', 180, { w: 1.3 }); F('pond', 0, -0.2, 0, { w: 1.7, d: 1.7 }); F('tree', 1.0, 1.05, 0, { w: 0.9, d: 0.9, h: 2.8 }); W('bench', -36, { w: 1.1 }); F('hanging', -1.1, 0.9, 0); F('hanging', -1.3, -1.1, 0); F('hanging', 1.3, -1.1, 0); } },
  { id: 'gl-z6-tub', type: 'z6', glass: 'all', group: 'Hot tub', name: 'Bathhouse', use: 'Tub, sauna + shower', seats: 10, note: 'The tub stays in the clear, the sauna cabin is a solid box inside the glass. Shower, cold rinse and loungers.',
    make: ({ F, W }) => { F('hottub', 1.0, -0.85, 0, { w: 2.1, d: 2.1, nostep: 1 }); F('saunabox', -1.2, -0.6, 90, { w: 1.6, d: 1.6, to: [-0.6, -0.4] }); F('shower', 1.05, 1.15, 0); F('lounger', -1.3, 1.2, 180, { to: [-1.2, 1.0] }); W('towel', 90, { lat: 0.8 }); W('planter', 144, { lat: -0.3 }); W('planter', -144); } },
  { id: 'gl-z6-dining', type: 'z6', glass: 'all', group: 'Other', name: 'Glass Dining Room', use: 'Dinner for ten', seats: 10, note: 'A long table under the sky, sideboard at the back, plants at the edges. A private-dining room for retreats.',
    make: ({ F, W }) => { longTable(F, 0, -0.82, 90, 2.6, 1.0, 5); W('counter', 180, { w: 1.6, appl: ['sink'] }); W('cabinet', 90, { w: 1.2 }); W('cabinet', -90, { w: 1.2 }); W('planter', 144); W('planter', -144); W('planter', 36); W('planter', -36); F('hanging', 1.2, 1.5, 0); F('hanging', -1.2, 1.5, 0); } },
  { id: 'gl-z6-yoga', type: 'z6', glass: 'upper', group: 'Other', name: 'Sunrise Studio', use: 'Yoga or sound baths', seats: 7, note: 'Solid lower rows keep it private from the path. Clear above, so you see treetops and sky rather than the neighbours.',
    make: ({ F, W }) => { radial(F, 'mat', 7, 1.82, 40, 320, { w: 0.6, col: '#7d8f73' }); W('bookshelf', 54, { w: 0.9, h: 0.9 }); F('planter', 0, 0.1, 0); } },
  { id: 'gl-z6-hearth', type: 'z6', glass: 'all', group: 'Other', name: 'Winter Lounge', use: 'Fireside room with a view', seats: 9, note: 'A gas fire bowl with a flue, sofas round it. Single-skin polycarbonate won’t hold much heat: this is a shoulder-season room unless double-walled sheet is used.',
    make: ({ F, W }) => { F('firebowl', 0, -0.25, 0, { w: 0.9, d: 0.9 }); F('sofa', 0, -1.95, 0, { w: 2.2, col: '#2a3f57' }); F('sofa', -1.5, -0.45, 90, { w: 1.9, col: '#7d8f73' }); F('sofa', 1.5, -0.45, -90, { w: 1.9, col: '#7d8f73' }); F('rug', 0, -0.4, 0, { w: 2.6, d: 2.6 }); F('armchair', -1.45, 1.12, 135, { to: [-1.45, 0.6] }); F('armchair', 1.45, 1.12, -135, { to: [1.45, 0.6] }); W('planter', 144); W('planter', -144); } },

  { id: 'gl-z75-garden', type: 'z75', glass: 'all', group: 'Garden', name: 'Hothouse', use: 'Concept-render garden', seats: 4, note: 'From the Portal.Place hothouse concept: cedar planters on every flat, a stone path, a central tree, and a table to sit at.',
    make: ({ W, F }) => { for (const a of [18, -18, 54, -54, 90, -90, 126, -126, 162, -162]) if (Math.abs(a) > 20) W('bed_raised', a, { w: 1.62, d: 0.85, tall: 0.75 }); F('tree', 0, -0.45, 0, { h: 3.8 }); F('bed_raised', -1.45, 0.75, 35, { w: 1.2, d: 0.8 }); F('bed_raised', 1.45, 0.75, -35, { w: 1.2, d: 0.8 }); F('potting', 0, 2.25, 180, { skip: 1 }); F('bistro', 0, 1.15, 0); F('chair', -0.6, 1.15, 90); F('chair', 0.6, 1.15, -90); F('hanging', -1.2, -1.9, 0); F('hanging', 1.2, -1.9, 0); F('hanging', -2.2, -0.2, 0); F('hanging', 2.2, -0.2, 0); } },
  { id: 'gl-z75-spa', type: 'z75', glass: 'all', group: 'Hot tub', name: 'Spa Hall', use: 'Big tub, plunge + sauna', seats: 14, note: 'A 2.8 m tub, a cold plunge beside it, sauna cabin, two showers and a row of loungers facing the view.',
    make: ({ F, W }) => { F('hottub', 0.45, -1.1, 0, { w: 2.8, d: 2.8, nostep: 1 }); F('plunge', 2.7, -0.2, 0, { to: [1.5, 0] }); F('saunabox', -2.25, -0.5, 90, { w: 1.7, d: 1.7, to: [-1.4, -0.5] }); F('shower', -2.45, 1.05, 90, { to: [-1.6, 1.05] }); F('shower', -1.5, 1.05, 90, { to: [-1.5, 1.05] }); F('lounger', 0, 1.12, 90); F('lounger', 2.2, 1.12, -90, { to: [1.6, 1.0] }); W('towel', -54); W('planter', 162); W('planter', -162); } },
  { id: 'gl-z75-art', type: 'z75', glass: 'all', group: 'Other', name: 'Art Studio', use: 'North-light painting studio', seats: 8, note: 'Even daylight from every side is what painters want. Six easels, a big table, a sink, storage.',
    make: ({ W, F }) => { for (const a of [55, 90, 125, -55, -90, -125]) F('easel', 2.65 * Math.sin(a * D), 2.65 * Math.cos(a * D), a + 180); F('table', 0, -0.2, 0, { w: 2.0, d: 1.1 }); W('counter', 162, { w: 1.5, appl: ['sink'], lat: 0.6 }); W('bookshelf', -162, { w: 1.6 }); F('stool', -0.5, 0.55, 0); F('stool', 0.5, 0.55, 0); F('stool', 0, -1.05, 180); } },
  { id: 'gl-z75-class', type: 'z75', glass: 'all', group: 'Other', name: 'Forest School Room', use: 'Winter classroom for kids', seats: 16, note: 'Kids’ tables in a horseshoe, mat corner, planter for growing things. For the forest school on cold or wet days (shoulder-season unless double-walled).',
    make: ({ F, W }) => { for (const [x, z, r] of [[-2.0, -0.4, 90], [2.0, -0.4, -90], [-1.1, -1.75, 35], [1.1, -1.75, -35]]) { F('kidtable', x, z, r); } for (const [x, z] of [[-2.0, 0.35], [-2.0, -1.15], [2.0, 0.35], [2.0, -1.15], [-0.65, -1.1], [-1.55, -2.4], [0.65, -1.1], [1.55, -2.4]]) F('stool', x, z, 0, { h: 0.34, w: 0.3, d: 0.3 }); F('rug', 0, 1.25, 0, { w: 2.6, d: 1.8, col: '#2f7f86' }); radial(F, 'cushion', 6, 0.78, 0, 360, {}); W('bookshelf', 162, { w: 1.2, h: 1.0 }); W('bed_raised', 54, { w: 1.4, d: 0.7 }); } },

  { id: 'gl-z9-garden', type: 'z9', glass: 'all', group: 'Garden', name: 'Botanic Commons', use: 'Garden + gathering room', seats: 16, note: 'A real tree in the middle with planting and seating under it. Pond, bench circle, a long potting table. Doors stay open most of the season.',
    make: ({ W, F }) => { for (const a of [90, -90, 126, -126, 162, -162]) W('bed_raised', a, { w: 1.95, d: 0.95, tall: 0.8 }); F('tree', 0, -0.6, 0, { w: 1.8, d: 1.8, h: 4.8 }); radial(F, 'bench', 6, 1.75, 25, 335, {}); F('pond', 2.6, 1.9, 0); F('potting', -2.6, 2.1, 145, { w: 1.5 }); F('hanging', -2.4, -1.6, 0); F('hanging', 2.4, -1.6, 0); F('hanging', 0, -2.6, 0); } },
  { id: 'gl-z9-cafe', type: 'z9', glass: 'all', group: 'Other', name: 'Garden Café', use: 'Café among planting, 24 seats', seats: 24, note: 'Bar on the back wall, bistro tables among planters. The café people will want to sit in during a sunny March.',
    make: ({ F, W }) => { F('servebar', 0, -3.0, 0, { w: 2.6 }); F('counter', 0, -3.72, 0, { w: 2.2, appl: ['espresso', 'sink'] }); for (const [x, z] of [[-2.1, -1.0], [2.1, -1.0], [0, -1.1], [-1.3, 0.75], [1.3, 0.75], [-3.1, 0.65], [3.1, 0.65], [0, 1.35]]) { F('bistro', x, z); F('chair', x - 0.6, z, 90); F('chair', x + 0.6, z, -90); F('chair', x, z - 0.6, 0); } W('bed_raised', 54, { w: 1.8, d: 0.75 }); W('bed_raised', -54, { w: 1.8, d: 0.75 }); W('bed_raised', 126, { w: 1.8, d: 0.75 }); W('bed_raised', -126, { w: 1.8, d: 0.75 }); F('hanging', -1.3, -2.0, 0); F('hanging', 1.3, -2.0, 0); } },
  { id: 'gl-z9-spa', type: 'z9', glass: 'all', group: 'Hot tub', name: 'Thermal Hall', use: 'Two tubs, plunge, sauna', seats: 24, note: 'The full bathing circuit: hot tub, warm tub, cold plunge, sauna cabin, showers, a rest area. Would need its own plumbing, drainage and venting.',
    make: ({ F, W }) => { F('hottub', -1.55, -1.6, 0, { w: 3.0, d: 3.0, nostep: 1 }); F('hottub', 1.75, -1.75, 0, { w: 2.2, d: 2.2, nostep: 1 }); F('plunge', 3.35, -0.2, 0); F('saunabox', -3.0, 1.2, 90, { to: [-1.5, 1.2] }); F('shower', 3.2, 1.55, -90); for (const x of [0, 0.85, 1.7]) F('lounger', x, 0.85, 0); F('towel', -1.6, 3.25, 0); W('planter', -162, { lat: 0.4 }); W('planter', 162, { lat: -0.4 }); W('planter', 54); } },
];

// ---- building + checking -----------------------------------------------------------------------------------------------
export function buildPlan(def) {
  const k = kit(def.type, def.door);
  const r = def.make(k);
  let loftDef = null;
  if (r && r.loft) { loftDef = r.loft; r.after(); }
  const items = k.items.filter(it => !it.skip && KINDS[it.k]);
  const Z = k.Z;
  return { ...def, door: Z.door, Z, items, loft: loftDef, sleeps: def.sleeps || 0, seats: def.seats || 0 };
}
let built = null;
export function allPlans() { if (!built) built = DEFS.map(buildPlan); return built; }
export function planById(id) { return allPlans().find(p => p.id === id); }

function samples(it) {
  const K = KINDS[it.k], w = (it.w || K.w), d = (it.d || K.d), r = (it.r || 0) * D, sn = Math.sin(r), c = Math.cos(r), o = [];
  for (let u = -0.48; u <= 0.48; u += 0.12) for (let q = -0.48; q <= 0.48; q += 0.12) {
    if (K.round && Math.hypot(u, q) > 0.5) continue;
    const lx = u * w, lz = q * d; o.push([it.x + lx * c + lz * sn, it.z - lx * sn + lz * c]);
  }
  return o;
}
function contains(it, x, z) {
  const K = KINDS[it.k], dx = x - it.x, dz = z - it.z, r = (it.r || 0) * D, sn = Math.sin(r), c = Math.cos(r);
  const lx = dx * c - dz * sn, lz = dx * sn + dz * c, w = (it.w || K.w) / 2, d = (it.d || K.d) / 2;
  return K.round ? Math.hypot(lx, lz) < w : Math.abs(lx) < w && Math.abs(lz) < d;
}
function overlap(a, b) { return samples(a).some(p => contains(b, p[0], p[1])) || samples(b).some(p => contains(a, p[0], p[1])); }

// every plan must pass: inside the floor, clear of the sloped shell at its own height, not overlapping, head height where it's needed
export function check(p) {
  const Z = p.Z, errs = [], warn = [];
  const solid = p.items.filter(i => { const K = KINDS[i.k]; return !K.soft && i.k !== 'wall' && !K.arc; });
  for (const it of p.items) {
    const K = KINDS[it.k];
    if (it.k === 'wall' || K.arc) continue;
    if (it.k === 'rug' || it.k === 'mat') { for (const [x, z] of rectCorners(it)) if (!Z.inFloor(x, z)) { errs.push(`${K.label} off the floor at ${x.toFixed(2)},${z.toFixed(2)}`); break; } continue; }
    if (it.k === 'hanging') continue;
    const h = it.k === 'tree' ? 0.5 : it.k === 'ladder' || it.k === 'shipstair' || it.k === 'stair' ? 0.1 : undefined;
    const pk = poke(it, Z);
    if (pk > 0.005) errs.push(`${K.label} at ${it.x.toFixed(2)},${it.z.toFixed(2)} pokes ${Math.round(pk * 1000)} mm through the shell`);
    else if (!fits(it, Z, h)) errs.push(`${K.label} at ${it.x.toFixed(2)},${it.z.toFixed(2)} (y${it.y !== undefined ? 'loft' : 0}) hits shell or leaves floor`);
    const y = itemY(it, Z), head = Z.ceilAt(it.x, it.z) - y;
    if (K.head && head < K.head) errs.push(`${K.label} has only ${head.toFixed(2)} m head (needs ${K.head})`);
    if (K.sitHead) {   // sit up against the pillows
      const r = (it.r || 0) * D, pl = -(it.d || K.d) / 2 + 0.4, px = it.x + pl * Math.sin(r), pz = it.z + pl * Math.cos(r), sh = Z.ceilAt(px, pz) - y - (it.low ? 0.3 : K.h);
      if (sh < 0.8) errs.push(`${K.label} sit-up height only ${sh.toFixed(2)} m`);
    }
    if (K.head === 2.0) for (const [x, z] of rectCorners(it).slice(0, 4)) if (Z.ceilAt(x, z) - y < 1.95) { warn.push(`${K.label} corner head ${(Z.ceilAt(x, z) - y).toFixed(2)}`); break; }
    if (p.loft && it.y !== undefined) for (const [x, z] of rectCorners(it).slice(0, 4)) if (!inPoly(x, z, p.loft.poly)) { errs.push(`${K.label} hangs off the loft at ${x.toFixed(2)},${z.toFixed(2)}`); break; }
    if (it.k === 'counter' || it.k === 'island' || it.k === 'servebar') {
      const r = (it.r || 0) * D, dd = (it.d || K.d) / 2 + 0.35, fx = it.x + dd * Math.sin(r), fz = it.z + dd * Math.cos(r), hh = Z.ceilAt(fx, fz) - y;
      if (hh < 1.9) warn.push(`${K.label} front only ${hh.toFixed(2)} m head`);
    }
  }
  for (let i = 0; i < solid.length; i++) for (let j = i + 1; j < solid.length; j++) {
    const a = solid[i], b = solid[j];
    if (itemY(a, Z) !== itemY(b, Z)) continue;
    if (overlap(a, b)) errs.push(`${KINDS[a.k].label} @${a.x.toFixed(2)},${a.z.toFixed(2)} overlaps ${KINDS[b.k].label} @${b.x.toFixed(2)},${b.z.toFixed(2)}`);
  }
  const mats = p.items.filter(i => i.k === 'mat');
  for (let i = 0; i < mats.length; i++) for (let j = i + 1; j < mats.length; j++) if (overlap(mats[i], mats[j])) errs.push(`Mats overlap at ${mats[i].x.toFixed(2)},${mats[i].z.toFixed(2)}`);
  if (p.loft) {   // the loft plate, rim, joists and rail must stay inside the shell too
    const B = new Buf(); drawLoft(B, p.loft, Z); let worst = 0;
    for (const name in B.b) { const a = B.b[name].pos; for (let i = 0; i < a.length; i += 3) { const x = a[i], y = a[i + 1], z = a[i + 2]; if (Z.insideAt(x, y, z)) continue; for (const pl of Z.planes) worst = Math.max(worst, pl.n[0] * x + pl.n[1] * y + pl.n[2] * z - pl.d); } }
    if (worst > 0.005) errs.push(`Loft pokes ${Math.round(worst * 1000)} mm through the shell`);
  }
  // the way in and the outward door
  {
    const E = entryPath(Z), inPath = (x, z, pad) => Math.abs(x) < E.hw + pad && z < E.z1 && z > E.z0 - pad;
    if (!p.entryFill) {
      for (const a of solid) {
        if (itemY(a, Z) !== Z.floorY) continue;
        const pad = SEATING.has(a.k) ? E.seatPad : 0;
        if (samples(a).some(([x, z]) => inPath(x, z, pad))) errs.push(`${KINDS[a.k].label} @${a.x.toFixed(2)},${a.z.toFixed(2)} is in the way in from the door`);
      }
      for (const w of p.items.filter(i => i.k === 'wall')) {
        const [ax, az] = w.a, [bx, bz] = w.b, L = Math.hypot(bx - ax, bz - az);
        for (let t = 0; t <= L; t += 0.05) {
          if (w.door !== undefined && Math.abs(t - w.door * L) < (w.dw || 0.8) / 2) continue;
          if (inPath(ax + (bx - ax) * t / L, az + (bz - az) * t / L, 0)) { errs.push('A partition crosses the way in from the door'); break; }
        }
      }
    }
    const L = Z.info.landing;
    for (const [hx, lw, dir] of doorLeaves(Z)) for (let g = 0; g <= 90; g += 10) {
      const x = hx + dir * lw * Math.cos(g * D), z = Z.info.doorZ + lw * Math.sin(g * D);
      if (Math.abs(x) > L.x + 1e-6 || z > L.z1 + 1e-6) { errs.push(`The door leaf swings off the deck at ${x.toFixed(2)},${z.toFixed(2)}`); break; }
    }
  }
  // items vs partitions: footprint must not straddle a wall
  for (const w of p.items.filter(i => i.k === 'wall')) {
    const seg = [w.a, w.b];
    for (const a of solid) {
      if (itemY(a, Z) !== Z.floorY) continue;
      const c = rectCorners(a).slice(0, 4);
      for (let i = 0; i < 4; i++) {
        const P = c[i], Q = c[(i + 1) % 4];
        const d1 = (seg[1][0] - seg[0][0]) * (P[1] - seg[0][1]) - (seg[1][1] - seg[0][1]) * (P[0] - seg[0][0]);
        const d2 = (seg[1][0] - seg[0][0]) * (Q[1] - seg[0][1]) - (seg[1][1] - seg[0][1]) * (Q[0] - seg[0][0]);
        const d3 = (Q[0] - P[0]) * (seg[0][1] - P[1]) - (Q[1] - P[1]) * (seg[0][0] - P[0]);
        const d4 = (Q[0] - P[0]) * (seg[1][1] - P[1]) - (Q[1] - P[1]) * (seg[1][0] - P[0]);
        if (d1 * d2 < 0 && d3 * d4 < 0) { errs.push(`${KINDS[a.k].label} @${a.x.toFixed(2)},${a.z.toFixed(2)} crosses a partition`); break; }
      }
    }
  }
  if (p.sleeps) { let n = 0; for (const it of p.items) n += KINDS[it.k].sleeps || 0; if (n < p.sleeps) errs.push(`sleeps ${p.sleeps} claimed, beds for ${n}`); if (n > p.sleeps) warn.push(`beds for ${n}, claims ${p.sleeps}`); }
  return { errs, warn };
}

// ---- SVG floor plan --------------------------------------------------------------------------------------------------------
// classes styled by the review page (light + dark): zs zone-ok zone-mid zone-low, wl wall, it item, lb label
const n2 = x => +x.toFixed(3);
const pth = pts => 'M' + pts.map(p => `${n2(p[0])} ${n2(p[1])}`).join('L') + 'Z';
const LABEL = { king: 'king', queen: 'queen', double: 'double', single: 'single', daybed: 'daybed', bunk: 'bunk', sofa: 'sofa', sofabed: 'sofa bed', loveseat: 'loveseat', table: '', rtable: '', counter: 'kitchen', island: 'island', fridge: 'fr', shower: 'shower', rollshower: 'roll-in shower', desk: 'desk', longdesk: 'shared table', bookshelf: 'shelves', wardrobe: 'closet', woodstove: 'stove', saunastove: 'stove', hottub: 'hot tub', plunge: 'plunge', saunabox: 'sauna', lounger: '', bed_raised: 'bed', potting: 'potting', massage: 'table', piano: 'piano', drums: 'drums', workbench: 'bench', printer: '3D', booth: 'booth', screen: 'screen', servebar: 'serving bar', stair: 'stairs', shipstair: 'stair', pond: 'pond', tree: 'tree', firebowl: 'fire', cabinet: '', kidtable: '', telescope: 'scope', towel: '' };

function itemSvg(it, opts = {}) {
  const K = KINDS[it.k];
  if (it.k === 'wall') {
    const [ax, az] = it.a, [bx, bz] = it.b, L = Math.hypot(bx - ax, bz - az), dx = (bx - ax) / L, dz = (bz - az) / L;
    if (it.door === undefined) return `<line class="pw" x1="${n2(ax)}" y1="${n2(az)}" x2="${n2(bx)}" y2="${n2(bz)}"/>`;
    const dw = it.dw || 0.8, c = it.door * L, s0 = c - dw / 2, s1 = c + dw / 2, sw = it.swing || 1;
    const nx = -dz * sw, nz = dx * sw, hx = ax + dx * s0, hz = az + dz * s0;
    const ox = hx + nx * dw, oz = hz + nz * dw, ex = ax + dx * s1, ez = az + dz * s1;
    return `<line class="pw" x1="${n2(ax)}" y1="${n2(az)}" x2="${n2(hx)}" y2="${n2(hz)}"/><line class="pw" x1="${n2(ex)}" y1="${n2(ez)}" x2="${n2(bx)}" y2="${n2(bz)}"/><line class="dl" x1="${n2(hx)}" y1="${n2(hz)}" x2="${n2(ox)}" y2="${n2(oz)}"/><path class="ds" d="M${n2(ox)} ${n2(oz)}A${dw} ${dw} 0 0 ${sw > 0 ? 1 : 0} ${n2(ex)} ${n2(ez)}"/>`;
  }
  if (K.arc) {
    const P = (a, r) => [it.x + r * Math.sin(a * D), it.z + r * Math.cos(a * D)];
    const a = P(it.a0, it.r0), b = P(it.a1, it.r0), c = P(it.a1, it.r1), d = P(it.a0, it.r1);
    const sweep = it.a1 > it.a0 ? 0 : 1;
    return `<path class="it" d="M${n2(a[0])} ${n2(a[1])}A${it.r0} ${it.r0} 0 0 ${sweep} ${n2(b[0])} ${n2(b[1])}L${n2(c[0])} ${n2(c[1])}A${it.r1} ${it.r1} 0 0 ${1 - sweep} ${n2(d[0])} ${n2(d[1])}Z"/>`;
  }
  const w = it.w || K.w, d = it.d || K.d, hw = w / 2, hd = d / 2;
  const tf = `translate(${n2(it.x)} ${n2(it.z)}) rotate(${n2(-(it.r || 0))})`;
  let g = '';
  const R = (x, y, ww, hh, cl = 'it', rx = 0) => `<rect class="${cl}" x="${n2(x)}" y="${n2(y)}" width="${n2(ww)}" height="${n2(hh)}"${rx ? ` rx="${rx}"` : ''}/>`;
  const L = (a, b, c, dd, cl = 'th') => `<line class="${cl}" x1="${n2(a)}" y1="${n2(b)}" x2="${n2(c)}" y2="${n2(dd)}"/>`;
  const C = (x, y, r, cl = 'it') => `<circle class="${cl}" cx="${n2(x)}" cy="${n2(y)}" r="${n2(r)}"/>`;
  switch (it.k) {
    case 'king': case 'queen': case 'double': case 'single': case 'daybed': {
      g = R(-hw, -hd, w, d); const n = w > 1.2 ? 2 : 1;
      for (let i = 0; i < n; i++) g += R(-hw + 0.06 + i * (w - 0.12) / n, -hd + 0.06, (w - 0.12) / n - 0.04, 0.32, 'th', 0.04);
      g += L(-hw, -hd + 0.52, hw, -hd + 0.52);
      break;
    }
    case 'bunk': g = R(-hw, -hd, w, d) + L(-hw, -hd, hw, hd) + L(hw, -hd, -hw, hd) + R(-hw + 0.08, -hd + 0.05, w - 0.16, 0.26, 'th', 0.04); break;
    case 'sofa': case 'sofabed': case 'loveseat': g = R(-hw, -hd, w, d, 'it', 0.05) + R(-hw + 0.04, -hd + 0.04, w - 0.08, 0.2, 'th', 0.03) + L(-hw + 0.18, -hd + 0.24, -hw + 0.18, hd) + L(hw - 0.18, -hd + 0.24, hw - 0.18, hd); break;
    case 'armchair': g = R(-hw, -hd, w, d, 'it', 0.08) + R(-hw + 0.1, -hd + 0.18, w - 0.2, d - 0.22, 'th', 0.04); break;
    case 'chair': case 'stool': g = R(-hw, -hd, w, d, 'it', 0.05) + (it.k === 'chair' ? L(-hw + 0.03, -hd + 0.06, hw - 0.03, -hd + 0.06) : ''); break;
    case 'rtable': case 'firebowl': case 'pond': case 'planter': case 'tree': case 'hanging': case 'cushion': g = C(0, 0, Math.max(hw, hd) * (it.k === 'tree' ? 0.45 : 1)) + (it.k === 'tree' ? C(0, 0, 0.72, 'dsh') : '') + (it.k === 'pond' ? C(0, 0, hw - 0.1, 'th') : ''); break;
    case 'hottub': g = C(0, 0, hw) + C(0, 0, hw - 0.1, 'wtr') + R(-0.5, hw, 1.0, 0.34); break;
    case 'plunge': g = R(-hw, -hd, w, d) + R(-hw + 0.08, -hd + 0.08, w - 0.16, d - 0.16, 'wtr'); break;
    case 'counter': case 'island': case 'servebar': { g = R(-hw, -hd, w, d); const ap = it.appl || (it.k === 'counter' ? ['sink', 'hob'] : []); ap.forEach((a, i) => { const lx = ap.length === 1 ? 0 : -hw + (i + 0.5) * w / ap.length; if (a === 'sink') g += R(lx - 0.24, -0.17, 0.48, 0.32, 'th', 0.03); if (a === 'hob') { for (const q of [[-0.14, -0.1], [0.14, -0.1], [-0.14, 0.1], [0.14, 0.1]]) g += C(lx + q[0], q[1], 0.08, 'th'); } }); break; }
    case 'fridge': g = R(-hw, -hd, w, d) + L(-hw, hd - 0.06, hw, hd - 0.06); break;
    case 'toilet': g = R(-0.19, -hd, 0.38, 0.18) + `<ellipse class="it" cx="0" cy="${n2(-hd + 0.42)}" rx="0.18" ry="0.25"/>`; break;
    case 'shower': case 'rollshower': g = R(-hw, -hd, w, d) + L(-hw, -hd, hw, hd) + L(hw, -hd, -hw, hd) + C(0, 0, 0.05, 'th'); break;
    case 'vanity': g = R(-hw, -hd, w, d) + `<ellipse class="th" cx="0" cy="0" rx="${n2(hw * 0.55)}" ry="${n2(hd * 0.55)}"/>`; break;
    case 'desk': g = R(-hw, -hd, w, d) + R(-0.24, hd + 0.05, 0.48, 0.48, 'th', 0.06); break;
    case 'bookshelf': case 'wardrobe': case 'cabinet': g = R(-hw, -hd, w, d) + L(-hw, 0, hw, 0); break;
    case 'woodstove': g = R(-hw, -hd, w, d, 'th') + R(-0.24, -0.2, 0.48, 0.42) + C(0, -0.02, 0.08, 'th'); break;
    case 'saunastove': g = R(-hw, -hd, w, d) + L(-hw, -hd, hw, hd) + L(hw, -hd, -hw, hd); break;
    case 'saunabox': g = R(-hw, -hd, w, d) + R(-hw + 0.06, -hd + 0.06, w - 0.12, 0.44, 'th') + R(-hw + 0.06, -hd + 0.5, 0.4, d - 0.6, 'th'); break;
    case 'bed_raised': g = R(-hw, -hd, w, d) + R(-hw + 0.05, -hd + 0.05, w - 0.1, d - 0.1, 'grn'); break;
    case 'stair': case 'shipstair': { g = R(-hw, -hd, w, d); const n = it.k === 'stair' ? 14 : 8; for (let i = 1; i < n; i++) g += L(-hw, -hd + i * d / n, hw, -hd + i * d / n); g += L(0, hd - 0.1, 0, -hd + 0.15, 'dl'); g += `<path class="dl" d="M-.1 ${n2(-hd + 0.3)}L0 ${n2(-hd + 0.15)}L.1 ${n2(-hd + 0.3)}"/>`; break; }
    case 'ladder': g = R(-0.24, -0.25, 0.48, 0.5) + L(-0.24, -0.1, 0.24, -0.1) + L(-0.24, 0.05, 0.24, 0.05); break;
    case 'mat': g = R(-hw, -hd, w, d, 'it', 0.03); break;
    case 'rug': return `<g transform="${tf}"><rect class="rg" x="${n2(-hw)}" y="${n2(-hd)}" width="${n2(w)}" height="${n2(d)}"/></g>`;
    default: g = R(-hw, -hd, w, d);
  }
  let label = LABEL[it.k];
  if (label && !opts.noLabel && Math.max(w, d) >= 0.8) {
    const fs = Math.min(0.17, Math.max(0.1, Math.min(w, d) * 0.3));
    const rot = (it.r || 0) % 360; const flat = Math.abs(((rot % 180) + 180) % 180 - 90) > 45 ? 0 : 90;   // keep labels readable
    const uncancel = (it.r || 0) - 0;
    void flat;
    g += `<text class="lb" transform="rotate(${n2(uncancel)})" font-size="${n2(fs)}" text-anchor="middle" dominant-baseline="central" x="0" y="0">${label}</text>`;
  }
  return `<g transform="${tf}">${g}</g>`;
}

export function planSvg(p) {
  const Z = p.Z, m = 0.55, R = Z.R(5) + (Z.door === 'A' ? 0.5 : 0.8);
  const fzMax = Math.max(Z.R(5), ...Z.floor.map(q => q[1]), ...(Z.porch || []).map(q => q[1])) + 0.5;
  const zMin = -Z.R(5) - m, zMax = fzMax + m + 0.35, xMin = -R - m + 0.2, xMax = R + m - 0.2;
  const W = xMax - xMin, H = zMax - zMin;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n2(xMin)} ${n2(zMin)} ${n2(W)} ${n2(H)}" role="img" aria-label="${p.name} floor plan, ${Z.T.name}">`;
  // headroom zones, from the shell itself
  s += `<path class="zone-low" d="${pth(Z.floor)}"/>`;
  s += `<path class="zone-mid" d="${pth(Z.contour(1.4))}"/>`;
  s += `<path class="zone-ok" d="${pth(Z.contour(2.0))}"/>`;
  // widest-ring outline and panel pattern seen from above, faint
  const wide = []; for (let a = 0; a <= 360; a += 36) wide.push([Z.R(5) * Math.sin((a + 18 * 5 + Z.phi0) * D), Z.R(5) * Math.cos((a + 18 * 5 + Z.phi0) * D)]);
  s += `<path class="ov" d="${pth(wide.slice(0, 10))}"/>`;
  for (const f of Z.kept) s += `<path class="pn" d="${pth(f.pts.map(q => [q[0], q[2]]))}"/>`;
  // windows / clear panels projected to plan
  const clearRows = p.glass === 'all' ? Infinity : p.glass === 'upper' ? Z.K - 2 : 0;
  if (p.glass) for (const f of Z.kept) if (f.row <= clearRows) s += `<path class="cl" d="${pth(f.pts.map(q => [q[0], q[2]]))}"/>`;
  for (const [row, az, kind] of p.glaze || []) {
    const c = Z.faces.filter(f => f.row === row).sort((a, b) => Math.abs(((a.th - az + 540) % 360) - 180) - Math.abs(((b.th - az + 540) % 360) - 180))[0];
    if (c) { const pts = (kind === 'tri' && c.full.length === 4 ? [c.full[3], c.full[1], c.full[0]] : c.full).map(q => [q[0], q[2]]); s += `<path class="wn" d="${pth(pts)}"/>`; }
  }
  if (p.sky) for (const f of Z.faces) if (f.row === 1) s += `<path class="wn" d="${pth(f.full.map(q => [q[0], q[2]]))}"/>`;
  // outer wall and porch
  if (Z.porch) s += `<path class="po" d="${pth(Z.porch)}"/>`;
  const fl = Z.floor;
  s += `<path class="wl" d="M${fl.map(q => `${n2(q[0])} ${n2(q[1])}`).join('L')}"/>`;
  // rugs under, furniture, partitions
  const soft = p.items.filter(i => i.k === 'rug');
  const ground = p.items.filter(i => i.k !== 'rug' && i.y === undefined);
  for (const it of soft) s += itemSvg(it);
  { const E = entryPath(Z); s += `<rect class="ep" x="${n2(-E.hw)}" y="${n2(E.z0)}" width="${n2(2 * E.hw)}" height="${n2(E.depth)}"/>`; }   // the way in, kept clear
  for (const it of ground) s += itemSvg(it);
  // entry door swing
  const dw = Z.info.doorW, dz = Z.info.doorZ;
  // every door swings out onto its deck
  for (const [hx, lw, dir] of doorLeaves(Z)) {
    const ex = hx + dir * lw;
    s += `<line class="dl" x1="${n2(hx)}" y1="${n2(dz)}" x2="${n2(hx)}" y2="${n2(dz + lw)}"/><path class="ds" d="M${n2(hx)} ${n2(dz + lw)}A${n2(lw)} ${n2(lw)} 0 0 ${dir > 0 ? 0 : 1} ${n2(ex)} ${n2(dz)}"/>`;
  }
  if (Z.door === 'A') { const A = Z.info.A; for (const sg of [-1, 1]) s += `<line class="wl" x1="${n2(sg * A.W2)}" y1="${n2(A.zp)}" x2="${n2(sg * A.Xo)}" y2="${n2(A.Zo)}"/>`; }
  if (Z.door === 'B') { const I = Z.info.B; s += `<path class="wl" d="M${n2(-I.X)} ${n2(I.dG)}L${n2(-I.hdr / 2)} ${n2(I.dG)}M${n2(I.hdr / 2)} ${n2(I.dG)}L${n2(I.X)} ${n2(I.dG)}"/>`; }
  if (Z.door === 'C') { const I = Z.info.C; s += `<path class="wl" d="M${n2(-I.Xf)} ${n2(I.dF)}L${n2(-I.W / 2)} ${n2(I.dF)}M${n2(I.W / 2)} ${n2(I.dF)}L${n2(I.Xf)} ${n2(I.dF)}"/>`; }
  // scale bar, dimension line
  const sbY = zMax - 0.22, sbX = xMin + 0.25;
  s += `<path class="sb" d="M${n2(sbX)} ${n2(sbY)}h1m0 -.05v.1m-1 -.1v.1"/><text class="dm" x="${n2(sbX + 0.5)}" y="${n2(sbY - 0.06)}" font-size=".14" text-anchor="middle">1 m</text>`;
  const r6 = Z.R(Z.K), dimX = n2(xMax - 0.3);
  s += `<text class="dm" x="${dimX}" y="${n2(sbY - 0.06)}" font-size=".14" text-anchor="end">widest ${(Z.stats.outerWidest).toFixed(2)} m · floor ${(2 * r6).toFixed(2)} m across</text>`;
  s += '</svg>';
  return s;
}

// loft plan: same scale, shell outline with loft plate and sit-up zone
export function loftSvg(p) {
  if (!p.loft) return '';
  const Z = p.Z, L = p.loft, m = 0.4;
  const xs = L.poly.map(q => q[0]), zs = L.poly.map(q => q[1]);
  const x0 = Math.min(...xs) - m, x1 = Math.max(...xs) + m, z0 = Math.min(...zs) - m, z1 = Math.max(...zs) + m + 0.15;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n2(x0)} ${n2(z0)} ${n2(x1 - x0)} ${n2(z1 - z0)}" role="img" aria-label="${p.name} loft plan">`;
  s += `<path class="zone-low" d="${pth(L.poly)}"/>`;
  const clip = h => { const pts = []; for (let a = 90; a <= 270; a += 4) { let last = 0; const ax = Math.sin(a * D), az = Math.cos(a * D); for (let t = 0; t < 7; t += 0.01) { const x = t * ax * 0.998, z = L.zFront - 0.015 + t * az; if (Z.ceilAt(x, z) - L.y < h || !inPoly(x, z, L.poly)) break; last = t; } pts.push([last * ax, L.zFront + last * az]); } pts[0][1] = L.zFront; pts[pts.length - 1][1] = L.zFront; return pts; };
  s += `<path class="zone-mid" d="${pth(clip(1.0))}"/><path class="zone-ok" d="${pth(clip(1.95))}"/>`;
  s += `<path class="wl" d="${pth(L.poly)}"/>`;
  for (const it of p.items) if (it.y !== undefined) s += itemSvg(it);
  const peak = Z.Y(0) - L.y - 0.1;
  s += `<text class="dm" x="${n2(x0 + 0.15)}" y="${n2(z1 - 0.1)}" font-size=".14">loft floor ${(L.deckH).toFixed(2)} m · ${peak.toFixed(2)} m clear at the peak · ${Z.polyArea(L.poly).toFixed(1)} m²</text>`;
  return s + '</svg>';
}

export { DEFS, TYPES };

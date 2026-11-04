// Geometry accumulator + the real-size furniture kit for the planned zome interiors (concept only).
// Each kit item has a real footprint in KINDS (metres); the floor plans draw the same footprint, so 2D and 3D agree.
// Item: { k, x, z, r (degrees about +Y, local +z = the side you use it from), w, d, ... }, x/z = centre of the footprint.
const D = Math.PI / 180;
export const hex = h => { const n = parseInt(h.slice(1), 16); const c = x => { x /= 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return [c(n >> 16 & 255), c(n >> 8 & 255), c(n & 255)]; };
export const shade = (c, s) => [c[0] * s, c[1] * s, c[2] * s];
export const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rnd = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

export const PAL = {
  oak: hex('#c9a06c'), oakDk: hex('#94693f'), birch: hex('#e2cda4'), walnut: hex('#6b4427'), cream: hex('#e9e1d2'), linen: hex('#cfc4b0'),
  char: hex('#34383c'), steel: hex('#b6bcc0'), white: hex('#f2f0ea'), teal: hex('#2f7f86'), rust: hex('#b5603c'), navy: hex('#2a3f57'),
  sage: hex('#7d8f73'), soil: hex('#3a2a1e'), stone: hex('#8a8880'), leaf: hex('#4e7a3a'), leaf2: hex('#3a6531'), leaf3: hex('#6d9440'), bloom: hex('#d65f7a'), bloom2: hex('#e6b13c'),
  water: hex('#3f9fb0'), black: hex('#191b1d'), cedar: hex('#a4683c'), redwood: hex('#7f4a2b'),
};

// ---- buffers ----------------------------------------------------------------------------------------------------
export class Buf {
  constructor() { this.b = {}; }
  bucket(name) { return this.b[name] || (this.b[name] = { pos: [], col: [], uv: [], nor: [] }); }
  tri(name, a, c1, c2, col) {
    const t = this.bucket(name);
    const ux = c1[0] - a[0], uy = c1[1] - a[1], uz = c1[2] - a[2], vx = c2[0] - a[0], vy = c2[1] - a[1], vz = c2[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    // planar UV in metres: v runs up the surface, u across it
    let ax, ay, az;
    if (Math.abs(ny) > 0.95) { ax = 1; ay = 0; az = 0; } else { const h = Math.hypot(nz, nx) || 1; ax = nz / h; ay = 0; az = -nx / h; }
    const bx = ny * az - nz * ay, by = nz * ax - nx * az, bz = nx * ay - ny * ax;
    for (const p of [a, c1, c2]) {
      t.pos.push(p[0], p[1], p[2]); t.nor.push(nx, ny, nz); t.col.push(col[0], col[1], col[2]);
      t.uv.push(p[0] * ax + p[1] * ay + p[2] * az, p[0] * bx + p[1] * by + p[2] * bz);
    }
  }
  // convex planar polygon. `out` = any vector toward the visible side
  poly(name, pts, col, out) {
    if (out) {
      const a = pts[0], b = pts[1];
      let c = pts[2], k = 2;
      let n = [0, 0, 0];
      while (k < pts.length) { c = pts[k++]; n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]; if (Math.hypot(...n) > 1e-9) break; }
      if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0) pts = pts.slice().reverse();
    }
    for (let i = 1; i < pts.length - 1; i++) this.tri(name, pts[0], pts[i], pts[i + 1], col);
  }
  // box in a rotated frame: local (x,z) offsets around (cx,cz), rotation r degrees
  obox(name, cx, cz, r, x0, x1, y0, y1, z0, z1, col, top = col, skipBottom = true) {
    const s = Math.sin(r * D), c = Math.cos(r * D);
    const W = (x, y, z) => [cx + x * c + z * s, y, cz - x * s + z * c];
    const O = (x, y, z) => [x * c + z * s, y, -x * s + z * c];
    this.poly(name, [W(x0, y1, z0), W(x1, y1, z0), W(x1, y1, z1), W(x0, y1, z1)], top, [0, 1, 0]);
    if (!skipBottom) this.poly(name, [W(x0, y0, z0), W(x1, y0, z0), W(x1, y0, z1), W(x0, y0, z1)], shade(col, 0.6), [0, -1, 0]);
    const side = shade(col, 0.92);
    this.poly(name, [W(x0, y0, z1), W(x1, y0, z1), W(x1, y1, z1), W(x0, y1, z1)], side, O(0, 0, 1));
    this.poly(name, [W(x0, y0, z0), W(x1, y0, z0), W(x1, y1, z0), W(x0, y1, z0)], side, O(0, 0, -1));
    this.poly(name, [W(x1, y0, z0), W(x1, y0, z1), W(x1, y1, z1), W(x1, y1, z0)], side, O(1, 0, 0));
    this.poly(name, [W(x0, y0, z0), W(x0, y0, z1), W(x0, y1, z1), W(x0, y1, z0)], side, O(-1, 0, 0));
  }
  box(name, x0, x1, y0, y1, z0, z1, col, top) { this.obox(name, 0, 0, 0, x0, x1, y0, y1, z0, z1, col, top || col); }
  cyl(name, x, z, y0, y1, r, seg, col, top = col, r1 = r) {
    for (let i = 0; i < seg; i++) {
      const a0 = i / seg * 2 * Math.PI, a1 = (i + 1) / seg * 2 * Math.PI;
      const p = (a, y, rr) => [x + rr * Math.sin(a), y, z + rr * Math.cos(a)];
      const m = (a0 + a1) / 2;
      this.poly(name, [p(a0, y0, r), p(a1, y0, r), p(a1, y1, r1), p(a0, y1, r1)], col, [Math.sin(m), 0.01, Math.cos(m)]);
      if (r1 > 0) this.poly(name, [[x, y1, z], p(a0, y1, r1), p(a1, y1, r1)], top, [0, 1, 0]);
    }
  }
  // low-poly ball, for foliage, stones, cushions
  ball(name, x, y, z, rx, ry, rz, col, seed = 0) {
    const V = [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
    const F = [[0, 4, 2], [0, 2, 5], [0, 5, 3], [0, 3, 4], [1, 2, 4], [1, 5, 2], [1, 3, 5], [1, 4, 3]];
    const nrm = a => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l]; };
    const emit = (a, b, c, depth) => {
      if (depth === 0) {
        const P = q => [x + q[0] * rx, y + q[1] * ry, z + q[2] * rz];
        const tone = 0.82 + 0.3 * rnd(seed + a[0] * 7 + b[1] * 5 + c[2] * 3);
        this.poly(name, [P(a), P(b), P(c)], shade(col, tone), [(a[0] + b[0] + c[0]), (a[1] + b[1] + c[1]), (a[2] + b[2] + c[2])]);
        return;
      }
      const ab = nrm([a[0] + b[0], a[1] + b[1], a[2] + b[2]]), bc = nrm([b[0] + c[0], b[1] + c[1], b[2] + c[2]]), ca = nrm([c[0] + a[0], c[1] + a[1], c[2] + a[2]]);
      emit(a, ab, ca, depth - 1); emit(ab, b, bc, depth - 1); emit(ca, bc, c, depth - 1); emit(ab, bc, ca, depth - 1);
    };
    for (const f of F) emit(V[f[0]], V[f[1]], V[f[2]], 1);
  }
}

// ---- footprint table ----------------------------------------------------------------------------------------------
// w across, d front-to-back, h top height; head = head height needed over the footprint (0 none); soft items don't count as collisions.
export const KINDS = {
  king: { w: 1.93, d: 2.03, h: 0.62, sleeps: 2, label: 'King bed', sitHead: 1.0 }, queen: { w: 1.52, d: 2.03, h: 0.62, sleeps: 2, label: 'Queen bed', sitHead: 1.0 }, double: { w: 1.37, d: 1.91, h: 0.6, sleeps: 2, label: 'Double bed', sitHead: 1.0 },
  single: { w: 0.97, d: 1.91, h: 0.6, sleeps: 1, label: 'Single bed', sitHead: 1.0 }, bunk: { w: 0.97, d: 1.91, h: 1.62, sleeps: 2, label: 'Bunk bed' }, daybed: { w: 0.85, d: 1.95, h: 0.5, sleeps: 1, label: 'Daybed', sitHead: 1.0 },
  sofa: { w: 2.0, d: 0.92, h: 0.82, label: 'Sofa' }, sofabed: { w: 2.0, d: 0.95, h: 0.82, sleeps: 2, label: 'Sofa bed' }, loveseat: { w: 1.45, d: 0.85, h: 0.8, label: 'Loveseat' }, armchair: { w: 0.8, d: 0.82, h: 0.8, label: 'Armchair' },
  chair: { w: 0.45, d: 0.45, h: 0.85, label: 'Chair' }, stool: { w: 0.36, d: 0.36, h: 0.65, label: 'Stool' }, cushion: { w: 0.62, d: 0.62, h: 0.14, soft: 1, label: 'Floor cushion' },
  table: { w: 1.8, d: 0.9, h: 0.75, label: 'Table' }, rtable: { w: 1.1, d: 1.1, h: 0.75, label: 'Round table', round: 1 }, ctable: { w: 1.0, d: 0.55, h: 0.42, label: 'Coffee table' }, lowtable: { w: 0.9, d: 0.9, h: 0.32, label: 'Low table' }, bistro: { w: 0.7, d: 0.7, h: 0.75, label: 'Bistro table' },
  counter: { w: 2.0, d: 0.62, h: 0.92, label: 'Kitchen' }, island: { w: 1.6, d: 0.85, h: 0.92, label: 'Island' }, fridge: { w: 0.62, d: 0.68, h: 1.78, label: 'Fridge', head: 1.85 }, servebar: { w: 2.4, d: 0.7, h: 1.05, label: 'Serving bar' },
  toilet: { w: 0.42, d: 0.7, h: 0.75, label: 'WC', head: 1.7 }, shower: { w: 0.9, d: 0.9, h: 2.0, label: 'Shower', head: 2.0 }, rollshower: { w: 1.5, d: 1.2, h: 0.04, soft: 1, label: 'Roll-in shower', head: 2.0 }, vanity: { w: 0.7, d: 0.45, h: 0.88, label: 'Basin' },
  desk: { w: 1.4, d: 0.7, h: 0.75, label: 'Desk', seat: 1 }, longdesk: { w: 3.2, d: 0.9, h: 0.75, label: 'Long table' }, bookshelf: { w: 1.2, d: 0.32, h: 1.5, label: 'Shelves' }, wardrobe: { w: 1.1, d: 0.6, h: 1.9, label: 'Wardrobe' }, cabinet: { w: 0.9, d: 0.45, h: 0.85, label: 'Cabinet' },
  bench: { w: 1.4, d: 0.42, h: 0.46, label: 'Bench' }, woodstove: { w: 0.9, d: 0.9, h: 0.75, label: 'Wood stove', flue: 1 }, saunastove: { w: 0.6, d: 0.6, h: 0.95, label: 'Sauna stove', flue: 1 }, arcbench: { w: 0, d: 0, h: 0.84, label: 'Sauna bench', arc: 1 },
  hottub: { w: 2.1, d: 2.1, h: 0.92, label: 'Hot tub', round: 1 }, plunge: { w: 0.95, d: 1.6, h: 1.0, label: 'Cold plunge' }, saunabox: { w: 1.9, d: 1.9, h: 2.05, label: 'Sauna cabin', head: 2.1 }, lounger: { w: 0.72, d: 1.9, h: 0.5, label: 'Lounger' }, towel: { w: 0.8, d: 0.25, h: 1.5, label: 'Towel rack' },
  bed_raised: { w: 1.4, d: 0.8, h: 0.62, label: 'Raised bed', plant: 1 }, bed_wedge: { w: 1.6, d: 0.8, h: 0.62, label: 'Raised bed', plant: 1 }, tree: { w: 1.5, d: 1.5, h: 3.6, label: 'Tree', round: 1, plant: 1 }, planter: { w: 0.55, d: 0.55, h: 1.1, label: 'Potted plant', round: 1, plant: 1 }, potting: { w: 1.6, d: 0.62, h: 0.92, label: 'Potting bench' }, pond: { w: 1.5, d: 1.5, h: 0.42, label: 'Pond', round: 1 }, hanging: { w: 0.5, d: 0.5, h: 0, soft: 1, label: 'Hanging plants', plant: 1 },
  mat: { w: 0.65, d: 1.9, h: 0.01, soft: 1, label: 'Mat' }, massage: { w: 0.75, d: 1.95, h: 0.75, label: 'Treatment table' }, rug: { w: 2.2, d: 1.6, h: 0.01, soft: 1, label: 'Rug' }, telescope: { w: 0.8, d: 0.8, h: 1.6, label: 'Telescope' }, piano: { w: 1.5, d: 0.6, h: 1.2, label: 'Piano' }, drums: { w: 1.5, d: 1.3, h: 1.05, label: 'Drum kit' }, amp: { w: 0.6, d: 0.35, h: 0.7, label: 'Amp' },
  easel: { w: 0.7, d: 0.7, h: 1.7, label: 'Easel' }, workbench: { w: 2.0, d: 0.85, h: 0.92, label: 'Workbench' }, printer: { w: 0.6, d: 0.6, h: 1.4, label: '3D printer' }, soaktub: { w: 1.7, d: 0.8, h: 0.6, label: 'Soaking tub' }, wheel: { w: 0.6, d: 0.7, h: 0.6, label: 'Pottery wheel' }, kiln: { w: 0.75, d: 0.75, h: 0.95, label: 'Kiln' }, booth: { w: 1.2, d: 1.2, h: 2.15, label: 'Phone booth', head: 2.2 }, screen: { w: 2.4, d: 0.12, h: 2.2, label: 'Screen' }, kidtable: { w: 1.2, d: 0.6, h: 0.55, label: 'Kids table' }, firebowl: { w: 0.8, d: 0.8, h: 0.42, label: 'Gas fire bowl', round: 1 },
  ladder: { w: 0.5, d: 0.5, h: 2.4, label: 'Ladder' }, shipstair: { w: 0.7, d: 1.6, h: 2.4, label: 'Ship’s stair' }, stair: { w: 0.95, d: 3.0, h: 2.6, label: 'Stairs' },
  wall: { label: 'Partition' }, idoor: { w: 0.8, d: 0.1, h: 0, soft: 1, label: 'Door' },
};

const TAU = Math.PI * 2;
// ---- drawing ----------------------------------------------------------------------------------------------------------
export function drawItem(B, it, Z) {
  const K = KINDS[it.k], y = (it.y !== undefined ? it.y : Z.floorY), x = it.x, z = it.z, r = it.r || 0;
  const w = it.w || K.w, d = it.d || K.d, hw = w / 2, hd = d / 2;
  const box = (x0, x1, y0, y1, z0, z1, col, top) => B.obox('furn', x, z, r, x0, x1, y + y0, y + y1, z0, z1, col, top || col);
  const s = Math.sin(r * D), c = Math.cos(r * D);
  const LX = (lx, lz) => x + lx * c + lz * s, LZ = (lx, lz) => z - lx * s + lz * c;
  const leg = (lx, lz, h, t, col) => box(lx - t, lx + t, 0, h, lz - t, lz + t, col);
  const col = it.col ? hex(it.col) : null;
  switch (it.k) {
    case 'king': case 'queen': case 'double': case 'single': case 'daybed': {
      const low = it.low ? 0.04 : it.k === 'daybed' ? 0.28 : 0.3;
      const cover = col || (rnd(x * 3 + z) > 0.5 ? PAL.cream : PAL.linen), throwCol = rnd(x + z * 5) > 0.5 ? PAL.teal : PAL.rust;
      box(-hw, hw, it.low ? 0 : 0.12, low, -hd, hd, PAL.oak);
      if (!it.low) for (const a of [-1, 1]) for (const b of [-1, 1]) leg(a * (hw - 0.05), b * (hd - 0.05), 0.12, 0.03, PAL.oakDk);
      box(-hw + 0.02, hw - 0.02, low, low + 0.24, -hd + 0.02, hd - 0.02, shade(PAL.white, 0.97));   // mattress
      box(-hw + 0.01, hw - 0.01, low + 0.04, low + 0.28, -hd + 0.5, hd - 0.01, cover);             // duvet
      box(-hw + 0.01, hw - 0.01, low + 0.04, low + 0.3, hd - 0.55, hd - 0.05, throwCol);            // throw across the foot
      if (it.k !== 'daybed' && !it.low && !it.nohb) box(-hw - 0.01, hw + 0.01, 0.12, 0.95, -hd - 0.04, -hd + 0.01, PAL.oakDk);   // headboard
      const n = w > 1.2 ? 2 : 1;
      for (let i = 0; i < n; i++) { const px = n === 1 ? 0 : (i ? 1 : -1) * w / 4; B.ball('furn', LX(px, -hd + 0.28), y + low + 0.33, LZ(px, -hd + 0.28), w / (n * 2.6), 0.08, 0.2, PAL.white, i); }
      break;
    }
    case 'bunk': {
      for (const a of [-1, 1]) for (const b of [-1, 1]) leg(a * (hw - 0.03), b * (hd - 0.03), K.h, 0.03, PAL.oakDk);
      for (const lvl of [0.28, 1.14]) {
        box(-hw, hw, lvl, lvl + 0.08, -hd, hd, PAL.oak);
        box(-hw + 0.03, hw - 0.03, lvl + 0.08, lvl + 0.24, -hd + 0.03, hd - 0.03, lvl < 0.5 ? PAL.navy : PAL.linen);
        B.ball('furn', x + 0 * c + (-hd + 0.26) * s, y + lvl + 0.28, z + (-hd + 0.26) * c, 0.3, 0.07, 0.17, PAL.white, lvl);
      }
      box(-hw, hw, 1.35, K.h, hd - 0.03, hd, PAL.oak);   // top rail
      for (let i = 0; i < 4; i++) { const ry = 0.3 + i * 0.28; box(hw - 0.03, hw + 0.01, ry, ry + 0.03, hd - 0.42, hd - 0.05, PAL.oakDk); }  // ladder rungs
      break;
    }
    case 'sofa': case 'sofabed': case 'loveseat': {
      const fab = col || PAL.navy;
      box(-hw, hw, 0.08, 0.42, -hd, hd, shade(fab, 0.85)); box(-hw, hw, 0.42, K.h, -hd, -hd + 0.2, fab);
      box(-hw, -hw + 0.17, 0.42, 0.62, -hd, hd, fab); box(hw - 0.17, hw, 0.42, 0.62, -hd, hd, fab);
      const n = w > 1.7 ? 3 : 2, cw = (w - 0.34) / n;
      for (let i = 0; i < n; i++) { const c0 = -hw + 0.17 + i * cw; box(c0 + 0.01, c0 + cw - 0.01, 0.42, 0.52, -hd + 0.2, hd - 0.01, shade(fab, 1.12)); }
      B.ball('furn', LX(-hw + 0.38, -hd + 0.32), y + 0.62, LZ(-hw + 0.38, -hd + 0.32), 0.18, 0.15, 0.09, PAL.rust, 2);
      break;
    }
    case 'armchair': {
      const fab = col || PAL.rust;
      for (const a of [-1, 1]) for (const b of [-1, 1]) leg(a * (hw - 0.06), b * (hd - 0.06), 0.2, 0.02, PAL.walnut);
      box(-hw + 0.05, hw - 0.05, 0.2, 0.42, -hd + 0.05, hd - 0.05, fab); box(-hw + 0.05, hw - 0.05, 0.42, K.h, -hd + 0.03, -hd + 0.15, fab);
      box(-hw, -hw + 0.08, 0.3, 0.58, -hd + 0.08, hd - 0.1, PAL.walnut); box(hw - 0.08, hw, 0.3, 0.58, -hd + 0.08, hd - 0.1, PAL.walnut);
      break;
    }
    case 'chair': case 'stool': {
      const tn = it.k === 'stool' ? K.h : 0.45, t = 0.015;
      for (const a of [-1, 1]) for (const b of [-1, 1]) leg(a * (hw - 0.04), b * (hd - 0.04), tn, t, PAL.walnut);
      box(-hw, hw, tn, tn + 0.03, -hd, hd, col || PAL.oak);
      if (it.k === 'chair') { box(-hw + 0.02, hw - 0.02, 0.62, K.h, -hd, -hd + 0.03, col || PAL.oakDk); leg(-hw + 0.04, -hd + 0.015, 0.7, t, PAL.walnut); leg(hw - 0.04, -hd + 0.015, 0.7, t, PAL.walnut); }
      break;
    }
    case 'cushion': B.ball('furn', x, y + 0.08, z, hw, 0.08, hd, col || PAL.rust, x); break;
    case 'table': case 'ctable': case 'lowtable': case 'desk': case 'longdesk': case 'bistro': case 'kidtable': {
      const h = (it.h || K.h), t = 0.035;
      box(-hw, hw, h - t, h, -hd, hd, col || PAL.oak);
      for (const a of [-1, 1]) for (const b of [-1, 1]) leg(a * (hw - 0.07), b * (hd - 0.07), h - t, 0.025, PAL.char);
      if (it.k === 'desk') {
        box(-0.25, 0.25, h + 0.1, h + 0.42, -hd + 0.18, -hd + 0.21, PAL.black); box(-0.04, 0.04, h, h + 0.1, -hd + 0.18, -hd + 0.21, PAL.char);
        // task chair
        const cz = hd + 0.3;
        B.cyl('furn', LX(0, cz), LZ(0, cz), y, y + 0.44, 0.03, 8, PAL.char);
        box(-0.24, 0.24, 0.44, 0.5, cz - 0.24, cz + 0.24, PAL.char); box(-0.2, 0.2, 0.62, 1.0, cz + 0.2, cz + 0.24, PAL.char);
      }
      if (it.k === 'longdesk') for (let i = 0; i < 3; i++) { const lx = -hw + 0.5 + i * (w - 1) / 2; box(lx - 0.18, lx + 0.18, h, h + 0.02, -0.14, 0.14, PAL.char); }
      break;
    }
    case 'rtable': {
      const h = K.h, rad = w / 2;
      B.cyl('furn', x, z, y, y + h - 0.03, 0.05, 10, PAL.char); B.cyl('furn', x, z, y, y + 0.03, 0.28, 12, PAL.char);
      B.cyl('furn', x, z, y + h - 0.035, y + h, rad, 24, col || PAL.oak);
      break;
    }
    case 'counter': case 'island': case 'potting': case 'workbench': case 'servebar': {
      const ct = it.k === 'potting' ? PAL.oakDk : it.k === 'workbench' ? PAL.oak : it.k === 'servebar' ? PAL.walnut : hex('#d9d6cf');
      const carc = it.k === 'potting' || it.k === 'workbench' ? PAL.oakDk : (col || PAL.char);
      const h = K.h, t = 0.035;
      if (it.k === 'potting' || it.k === 'workbench') {
        for (const a of [-1, 1]) for (const b of [-1, 1]) leg(a * (hw - 0.06), b * (hd - 0.06), h - t, 0.035, carc);
        box(-hw + 0.04, hw - 0.04, 0.22, 0.26, -hd + 0.05, hd - 0.05, carc);
      } else {
        box(-hw + 0.01, hw - 0.01, 0.08, h - t, -hd, hd - 0.03, carc); box(-hw + 0.02, hw - 0.02, 0, 0.08, -hd + 0.02, hd - 0.09, PAL.black);
        const n = Math.max(1, Math.round(w / 0.6));
        for (let i = 1; i < n; i++) { const lx = -hw + i * w / n; box(lx - 0.003, lx + 0.003, 0.1, h - t - 0.02, hd - 0.03, hd - 0.025, PAL.black); }
      }
      box(-hw, hw, h - t, h, -hd, hd, ct);
      const ap = it.appl || (it.k === 'counter' ? ['sink', 'hob'] : []);
      ap.forEach((a, i) => {
        const lx = ap.length === 1 ? 0 : -hw + (i + 0.5) * w / ap.length;
        if (a === 'sink') { box(lx - 0.25, lx + 0.25, h, h + 0.004, -0.18, 0.18, PAL.steel); B.cyl('furn', LX(lx, -hd + 0.09), LZ(lx, -hd + 0.09), y + h, y + h + 0.22, 0.012, 6, PAL.steel); }
        if (a === 'hob') { box(lx - 0.29, lx + 0.29, h, h + 0.006, -0.25, 0.25, PAL.black); for (const q of [[-0.14, -0.1], [0.14, -0.1], [-0.14, 0.1], [0.14, 0.1]]) B.cyl('furn', LX(lx + q[0], q[1]), LZ(lx + q[0], q[1]), y + h + 0.006, y + h + 0.012, 0.07, 10, PAL.char); }
        if (a === 'espresso') { box(lx - 0.28, lx + 0.28, h, h + 0.36, -0.2, 0.15, PAL.steel); }
      });
      if (it.k === 'potting') for (let i = 0; i < 5; i++) B.cyl('furn', LX(-hw + 0.25 + i * 0.28, -0.1), LZ(-hw + 0.25 + i * 0.28, -0.1), y + h, y + h + 0.13, 0.05, 8, PAL.rust, PAL.soil, 0.07);
      if (it.k === 'workbench') { box(-hw + 0.1, hw - 0.1, h + 0.25, h + 0.75, -hd + 0.01, -hd + 0.04, hex('#b89c70')); for (let i = 0; i < 7; i++) box(-hw + 0.2 + i * 0.24, -hw + 0.22 + i * 0.24, h + 0.35, h + 0.65, -hd + 0.04, -hd + 0.06, PAL.char); }
      break;
    }
    case 'fridge': box(-hw, hw, 0.02, K.h, -hd, hd, PAL.steel); box(-hw + 0.01, hw - 0.01, 1.1, 1.103, hd, hd + 0.003, PAL.char); box(hw - 0.08, hw - 0.05, 0.75, 1.45, hd, hd + 0.03, PAL.char); break;
    case 'toilet': {
      box(-0.19, 0.19, 0.42, 0.75, -hd, -hd + 0.18, PAL.white);
      B.cyl('furn', LX(0, 0.07), LZ(0, 0.07), y, y + 0.4, 0.14, 16, PAL.white, PAL.white, 0.19);
      break;
    }
    case 'shower': case 'rollshower': {
      if (it.k === 'shower') {
        box(-hw, hw, 0, 0.06, -hd, hd, PAL.stone);
        box(-hw, hw, 0.06, K.h, -hd, -hd + 0.02, hex('#dcd8cf')); box(-hw, -hw + 0.02, 0.06, K.h, -hd, hd, hex('#dcd8cf'));
        B.poly('pc', [[LX(hw, -hd), y + 0.06, LZ(hw, -hd)], [LX(hw, hd), y + 0.06, LZ(hw, hd)], [LX(hw, hd), y + K.h, LZ(hw, hd)], [LX(hw, -hd), y + K.h, LZ(hw, -hd)]], PAL.white);
        B.poly('pc', [[LX(-hw, hd), y + 0.06, LZ(-hw, hd)], [LX(hw, hd), y + 0.06, LZ(hw, hd)], [LX(hw, hd), y + K.h, LZ(hw, hd)], [LX(-hw, hd), y + K.h, LZ(-hw, hd)]], PAL.white);
      } else box(-hw, hw, 0, 0.012, -hd, hd, PAL.stone);
      box(-0.015, 0.015, 0.06, 2.0, -hd + 0.02, -hd + 0.05, PAL.steel); B.cyl('furn', LX(0, -hd + 0.2), LZ(0, -hd + 0.2), y + 1.98, y + 2.0, 0.1, 12, PAL.steel);
      break;
    }
    case 'vanity': box(-hw, hw, 0.1, 0.84, -hd, hd - 0.02, PAL.oak); box(-hw, hw, 0.84, K.h, -hd, hd, PAL.white); B.cyl('furn', LX(0, 0), LZ(0, 0), y + K.h, y + K.h + 0.1, 0.18, 14, PAL.white, PAL.steel, 0.2); break;
    case 'bookshelf': {
      const h = it.h || K.h;
      box(-hw, -hw + 0.025, 0, h, -hd, hd, PAL.oakDk); box(hw - 0.025, hw, 0, h, -hd, hd, PAL.oakDk);
      const n = Math.max(2, Math.round(h / 0.36));
      for (let i = 0; i <= n; i++) {
        const sy = i * (h - 0.03) / n;
        box(-hw, hw, sy, sy + 0.025, -hd, hd, PAL.oak);
        if (i < n) { let bx = -hw + 0.05, q = 0; while (bx < hw - 0.1) { const bw = 0.03 + rnd(i * 3 + q) * 0.05, bh = 0.18 + rnd(i * 7 + q) * 0.1; if (rnd(q * 2 + i) > 0.25) box(bx, bx + bw, sy + 0.025, sy + 0.025 + bh, -hd + 0.03, hd - 0.05, [PAL.rust, PAL.teal, PAL.navy, PAL.cream, PAL.sage, PAL.oakDk][q % 6]); bx += bw + 0.005; q++; } }
      }
      break;
    }
    case 'wardrobe': box(-hw, hw, 0.05, K.h, -hd, hd, PAL.birch); box(-0.004, 0.004, 0.07, K.h - 0.02, hd, hd + 0.003, PAL.walnut); box(-0.06, -0.04, 0.9, 1.1, hd, hd + 0.02, PAL.char); box(0.04, 0.06, 0.9, 1.1, hd, hd + 0.02, PAL.char); break;
    case 'cabinet': box(-hw, hw, 0.08, K.h, -hd, hd, PAL.oak); box(-hw + 0.02, hw - 0.02, 0.1, K.h - 0.02, hd, hd + 0.003, PAL.oakDk); break;
    case 'bench': { box(-hw, hw, 0.42, K.h, -hd, hd, col || PAL.oak); for (const a of [-1, 1]) box(a * (hw - 0.1) - 0.03, a * (hw - 0.1) + 0.03, 0, 0.42, -hd + 0.03, hd - 0.03, PAL.oakDk); break; }
    case 'woodstove': case 'saunastove': {
      if (it.k === 'woodstove') {
        box(-hw, hw, 0, 0.03, -hd, hd, PAL.stone);
        box(-0.24, 0.24, 0.25, 0.75, -0.2, 0.22, PAL.black); box(-0.17, 0.17, 0.32, 0.62, 0.22, 0.225, hex('#d9743a'));
        for (const a of [-1, 1]) for (const b of [-1, 1]) leg(a * 0.2, b * 0.16, 0.25, 0.015, PAL.black);
      } else {
        box(-hw + 0.02, hw - 0.02, 0, 0.62, -hd + 0.02, hd - 0.02, PAL.black); box(-0.14, 0.14, 0.14, 0.34, hd - 0.02, hd - 0.018, hex('#d9743a'));
        box(-hw, hw, 0.62, 0.66, -hd, hd, PAL.char);
        for (let i = 0; i < 26; i++) B.ball('furn', LX((rnd(i) - 0.5) * (w - 0.1), (rnd(i + 40) - 0.5) * (d - 0.1)), y + 0.68 + rnd(i + 70) * 0.2, LZ((rnd(i) - 0.5) * (w - 0.1), (rnd(i + 40) - 0.5) * (d - 0.1)), 0.05, 0.04, 0.05, PAL.stone, i);
      }
      const top = Math.min(Z.ceilAt(x, z) + 1.0, Z.apex[1] + 0.9);
      B.cyl('furn', x, z, y + 0.7, top, 0.075, 10, PAL.black);
      B.cyl('furn', x, z, top, top + 0.02, 0.17, 10, PAL.black, PAL.black); B.cyl('furn', x, z, top + 0.02, top + 0.14, 0.17, 10, PAL.black, PAL.black, 0.005);
      break;
    }
    case 'arcbench': {
      // Plan sauna benches: a curved run of slatted sections that screw into the frame. (a0..a1 azimuth, r0..r1 radius, x,z centre)
      const seg = 10, a0 = it.a0, a1 = it.a1;
      for (const [rr0, rr1, h] of [[it.r0, it.r1, 0.46], [it.r0 + (it.r1 - it.r0) * 0.45, it.r1, 0.84]]) {
        for (let i = 0; i < seg; i++) {
          const A = a0 + (a1 - a0) * i / seg, E = a0 + (a1 - a0) * (i + 1) / seg;
          const p = (a, rd, yy) => [x + rd * Math.sin(a * D), y + yy, z + rd * Math.cos(a * D)];
          const col2 = shade(PAL.cedar, 0.9 + rnd(i * 3) * 0.2);
          B.poly('furn', [p(A, rr0, h), p(E, rr0, h), p(E, rr1, h), p(A, rr1, h)], col2, [0, 1, 0]);
          B.poly('furn', [p(A, rr0, 0), p(E, rr0, 0), p(E, rr0, h), p(A, rr0, h)], shade(col2, 0.7), [Math.sin((A + E) / 2 * D) * -1, 0, Math.cos((A + E) / 2 * D) * -1]);
          for (let q = 1; q < 4; q++) { const rq = rr0 + (rr1 - rr0) * q / 4; const pa = p(A, rq - 0.004, h + 0.001), pb = p(E, rq - 0.004, h + 0.001), pc = p(E, rq + 0.004, h + 0.001), pd = p(A, rq + 0.004, h + 0.001); B.poly('furn', [pa, pb, pc, pd], shade(col2, 0.55), [0, 1, 0]); }
        }
      }
      break;
    }
    case 'hottub': {
      const rad = w / 2, seg = 36, top = y + K.h, wy = top - 0.09;
      const P = (a, rr, yy) => [x + rr * Math.sin(a), yy, z + rr * Math.cos(a)];
      for (let i = 0; i < seg; i++) {
        const a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU, m = (a0 + a1) / 2, stave = shade(PAL.cedar, 0.88 + rnd(i * 3) * 0.24);
        B.poly('furn', [P(a0, rad, y), P(a1, rad, y), P(a1, rad, top - 0.03), P(a0, rad, top - 0.03)], stave, [Math.sin(m), 0, Math.cos(m)]);
        B.poly('furn', [P(a0, rad - 0.06, wy - 0.02), P(a1, rad - 0.06, wy - 0.02), P(a1, rad - 0.06, top), P(a0, rad - 0.06, top)], shade(PAL.cedar, 0.72), [-Math.sin(m), 0, -Math.cos(m)]);
        B.poly('furn', [P(a0, rad - 0.06, top), P(a1, rad - 0.06, top), P(a1, rad + 0.035, top), P(a0, rad + 0.035, top)], PAL.oakDk, [0, 1, 0]);
        B.poly('furn', [P(a0, rad + 0.035, top - 0.03), P(a1, rad + 0.035, top - 0.03), P(a1, rad + 0.035, top), P(a0, rad + 0.035, top)], shade(PAL.oakDk, 0.85), [Math.sin(m), 0, Math.cos(m)]);
        B.poly('water', [[x, wy, z], P(a0, rad - 0.05, wy), P(a1, rad - 0.05, wy)], PAL.water, [0, 1, 0]);
      }
      for (const q of [0.22, 0.65]) { for (let i = 0; i < seg; i++) { const a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU, m = (a0 + a1) / 2; B.poly('furn', [P(a0, rad + 0.012, y + q), P(a1, rad + 0.012, y + q), P(a1, rad + 0.012, y + q + 0.03), P(a0, rad + 0.012, y + q + 0.03)], PAL.char, [Math.sin(m), 0, Math.cos(m)]); } }
      // bench inside, two jets of steam-free bubbles
      for (let i = 0; i < seg; i++) { const a0 = i / seg * TAU, a1 = (i + 1) / seg * TAU; if (i % 2) continue; B.poly('furn', [P(a0, rad - 0.34, wy - 0.26), P(a1, rad - 0.34, wy - 0.26), P(a1, rad - 0.06, wy - 0.26), P(a0, rad - 0.06, wy - 0.26)], shade(PAL.cedar, 0.6), [0, 1, 0]); }
      if (!it.nostep) { box(-0.5, 0.5, 0, 0.26, rad, rad + 0.34, PAL.oakDk); box(-0.5, 0.5, 0.26, 0.5, rad, rad + 0.17, PAL.oakDk); }
      break;
    }
    case 'plunge': { box(-hw, hw, 0, K.h, -hd, hd, PAL.cedar); box(-hw - 0.03, hw + 0.03, K.h - 0.03, K.h, -hd - 0.03, hd + 0.03, PAL.oakDk); B.poly('water', [[LX(-hw + 0.06, -hd + 0.06), y + K.h - 0.01, LZ(-hw + 0.06, -hd + 0.06)], [LX(hw - 0.06, -hd + 0.06), y + K.h - 0.01, LZ(hw - 0.06, -hd + 0.06)], [LX(hw - 0.06, hd - 0.06), y + K.h - 0.01, LZ(hw - 0.06, hd - 0.06)], [LX(-hw + 0.06, hd - 0.06), y + K.h - 0.01, LZ(-hw + 0.06, hd - 0.06)]], PAL.water, [0, 1, 0]); break; }
    case 'saunabox': {
      const cw = shade(PAL.cedar, 1.0), H = K.h;
      box(-hw, hw, 0, H, -hd, -hd + 0.06, cw); box(-hw, -hw + 0.06, 0, H, -hd, hd, cw); box(hw - 0.06, hw, 0, H, -hd, hd, cw); box(-hw, -0.34, 0, H, hd - 0.06, hd, cw); box(0.34, hw, 0, H, hd - 0.06, hd, cw); box(-0.34, 0.34, 1.95, H, hd - 0.06, hd, cw);
      for (let i = 0; i < 12; i++) { const yy = 0.17 * i; box(-hw - 0.002, hw + 0.002, yy, yy + 0.006, hd, hd + 0.002, shade(cw, 0.6)); }
      B.poly('glass', [[LX(-0.33, hd - 0.03), y + 0.02, LZ(-0.33, hd - 0.03)], [LX(0.33, hd - 0.03), y + 0.02, LZ(0.33, hd - 0.03)], [LX(0.33, hd - 0.03), y + 1.95, LZ(0.33, hd - 0.03)], [LX(-0.33, hd - 0.03), y + 1.95, LZ(-0.33, hd - 0.03)]], PAL.white);
      box(-hw + 0.06, hw - 0.06, 0, 0.46, -hd + 0.06, -hd + 0.5, PAL.birch); box(-hw + 0.06, hw - 0.06, 0, 0.9, -hd + 0.06, -hd + 0.42, PAL.birch);
      box(-hw + 0.06, -hw + 0.46, 0, 0.46, -hd + 0.06, hd - 0.1, PAL.birch);
      box(hw - 0.5, hw - 0.1, 0, 0.7, hd - 0.5, hd - 0.1, PAL.black);
      box(-hw, hw, H, H + 0.03, -hd, hd, cw);
      break;
    }
    case 'lounger': { for (const a of [-1, 1]) for (const b of [-1, 1]) leg(a * (hw - 0.05), b * (hd - 0.08), 0.28, 0.018, PAL.oakDk); box(-hw, hw, 0.28, 0.33, -hd + 0.55, hd, PAL.oak); box(-hw, hw, 0.33, 0.39, -hd + 0.55, hd - 0.01, PAL.cream); B.poly('furn', [[LX(-hw, -hd + 0.55), y + 0.33, LZ(-hw, -hd + 0.55)], [LX(hw, -hd + 0.55), y + 0.33, LZ(hw, -hd + 0.55)], [LX(hw, -hd), y + 0.72, LZ(hw, -hd)], [LX(-hw, -hd), y + 0.72, LZ(-hw, -hd)]], PAL.cream, [c * 0 + s * 1, 1, c]); break; }
    case 'towel': { for (const a of [-1, 1]) box(a * hw - 0.02, a * hw + 0.02, 0, K.h, -0.02, 0.02, PAL.oakDk); for (const yy of [0.6, 1.0, 1.4]) { box(-hw, hw, yy, yy + 0.03, -0.02, 0.02, PAL.oakDk); box(-hw + 0.08, hw - 0.08, yy - 0.32, yy + 0.03, 0.02, 0.05, yy > 1.2 ? PAL.white : yy > 0.8 ? PAL.teal : PAL.cream); } break; }
    case 'bed_raised': case 'bed_wedge': {
      const h = K.h, ring = PAL.cedar;
      for (let lvl = 0; lvl < 3; lvl++) { const yy = 0.21 * lvl, tone = shade(ring, 0.86 + rnd(x + lvl) * 0.2); box(-hw, hw, yy, yy + 0.2, hd - 0.04, hd, tone); box(-hw, hw, yy, yy + 0.2, -hd, -hd + 0.04, tone); box(-hw, -hw + 0.04, yy, yy + 0.2, -hd, hd, tone); box(hw - 0.04, hw, yy, yy + 0.2, -hd, hd, tone); }
      box(-hw + 0.04, hw - 0.04, 0, h - 0.04, -hd + 0.04, hd - 0.04, PAL.soil);
      const n = Math.round(w * d * 22);
      for (let i = 0; i < n; i++) {
        const q = x * 13 + z * 7 + i, lx = (rnd(q) - 0.5) * (w - 0.18), lz = (rnd(q + 50) - 0.5) * (d - 0.18), tall = 0.15 + rnd(q + 9) * (it.tall || 0.5), rad = 0.07 + rnd(q + 11) * 0.11;
        const cc = [PAL.leaf, PAL.leaf2, PAL.leaf3][i % 3];
        B.ball('plant', LX(lx, lz), y + h + tall * 0.5, LZ(lx, lz), rad, tall * 0.55, rad, rnd(q + 5) > 0.88 ? (i % 2 ? PAL.bloom : PAL.bloom2) : cc, q);
      }
      break;
    }
    case 'tree': {
      const H = Math.min(it.h || K.h, Z.ceilAt(x, z) - y - 0.15);
      B.cyl('furn', x, z, y, y + 0.5, 0.42, 16, PAL.cedar, PAL.soil, 0.46);
      B.cyl('furn', x, z, y + 0.45, y + H * 0.62, 0.07, 8, PAL.walnut, PAL.walnut, 0.035);
      for (let i = 0; i < 26; i++) { const a = i * 2.399, f = 0.3 + 0.7 * rnd(i), hh = H * (0.5 + 0.48 * rnd(i + 30)); B.ball('plant', x + Math.cos(a) * f * 0.72, y + hh, z + Math.sin(a) * f * 0.72, 0.24 + rnd(i + 3) * 0.18, 0.2, 0.24, [PAL.leaf, PAL.leaf3, PAL.leaf2][i % 3], i); }
      break;
    }
    case 'planter': { B.cyl('furn', x, z, y, y + 0.38, 0.19, 12, it.pot ? hex(it.pot) : PAL.rust, PAL.soil, 0.24); for (let i = 0; i < 12; i++) { const a = i * 2.399, f = 0.05 + 0.2 * rnd(i + x); B.ball('plant', x + Math.cos(a) * f, y + 0.5 + rnd(i) * 0.55, z + Math.sin(a) * f, 0.1 + rnd(i + 7) * 0.08, 0.14, 0.1, [PAL.leaf, PAL.leaf2, PAL.leaf3][i % 3], i + x); } break; }
    case 'hanging': { const yy = Math.min(Z.ceilAt(x, z) - 0.05, y + 2.4); B.cyl('furn', x, z, yy - 0.5, yy, 0.004, 4, PAL.char); B.cyl('furn', x, z, yy - 0.72, yy - 0.5, 0.13, 10, PAL.cream, PAL.soil, 0.16); for (let i = 0; i < 10; i++) { const a = i * 2.399; B.ball('plant', x + Math.cos(a) * 0.17, yy - 0.85 + rnd(i) * 0.4, z + Math.sin(a) * 0.17, 0.08, 0.15, 0.08, [PAL.leaf, PAL.leaf3][i % 2], i + z); } break; }
    case 'pond': { B.cyl('furn', x, z, y, y + 0.42, w / 2, 24, PAL.stone, PAL.char); B.cyl('water', x, z, y + 0.42, y + 0.422, w / 2 - 0.08, 24, PAL.water); for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; B.ball('furn', x + Math.cos(a) * (w / 2 - 0.02), y + 0.44, z + Math.sin(a) * (w / 2 - 0.02), 0.09 + rnd(i) * 0.04, 0.06, 0.09, PAL.stone, i); } break; }
    case 'mat': box(-hw, hw, 0, 0.012, -hd, hd, col || PAL.teal); break;
    case 'soaktub': box(-hw, hw, 0.05, K.h, -hd, hd, PAL.white); box(-hw + 0.1, hw - 0.1, 0, 0.05, -hd + 0.1, hd - 0.1, PAL.char); B.poly('water', [[LX(-hw + 0.07, -hd + 0.07), y + K.h - 0.06, LZ(-hw + 0.07, -hd + 0.07)], [LX(hw - 0.07, -hd + 0.07), y + K.h - 0.06, LZ(hw - 0.07, -hd + 0.07)], [LX(hw - 0.07, hd - 0.07), y + K.h - 0.06, LZ(hw - 0.07, hd - 0.07)], [LX(-hw + 0.07, hd - 0.07), y + K.h - 0.06, LZ(-hw + 0.07, hd - 0.07)]], PAL.water, [0, 1, 0]); break;
    case 'wheel': box(-hw, hw, 0, 0.42, -hd, hd, PAL.char); box(-hw - 0.04, hw + 0.04, 0.42, 0.47, -hd - 0.04, hd + 0.04, PAL.stone); B.cyl('furn', LX(0, 0.02), LZ(0, 0.02), y + 0.47, y + K.h, 0.17, 16, PAL.steel, PAL.linen); break;
    case 'kiln': B.cyl('furn', LX(0, 0), LZ(0, 0), y + 0.18, y + K.h, hw - 0.02, 8, PAL.steel, PAL.char); box(-hw + 0.08, hw - 0.08, 0, 0.18, -hd + 0.08, hd - 0.08, PAL.char); break;
    case 'massage': box(-hw, hw, 0.62, K.h, -hd, hd, PAL.cream); box(-hw + 0.05, hw - 0.05, 0.56, 0.62, -hd + 0.05, hd - 0.05, PAL.oak); for (const a of [-1, 1]) for (const b of [-1, 1]) leg(a * (hw - 0.09), b * (hd - 0.12), 0.56, 0.025, PAL.oakDk); break;
    case 'rug': { box(-hw, hw, 0, 0.012, -hd, hd, col || PAL.linen); box(-hw + 0.1, hw - 0.1, 0.012, 0.014, -hd + 0.1, hd - 0.1, shade(col || PAL.linen, 0.82)); box(-hw + 0.16, hw - 0.16, 0.014, 0.016, -hd + 0.16, hd - 0.16, col || PAL.linen); break; }
    case 'telescope': { const px = LX(0, 0), pz = LZ(0, 0); for (let i = 0; i < 3; i++) { const a = i * TAU / 3; const f = [px + Math.sin(a) * 0.38, y, pz + Math.cos(a) * 0.38], t = [px, y + 1.15, pz]; const p = (q, dx, dz) => [q[0] + dx, q[1], q[2] + dz]; B.poly('furn', [p(f, 0.02, 0), p(f, -0.02, 0), p(t, -0.02, 0), p(t, 0.02, 0)], PAL.char, [0, 0, 1]); B.poly('furn', [p(f, 0, 0.02), p(f, 0, -0.02), p(t, 0, -0.02), p(t, 0, 0.02)], PAL.char, [1, 0, 0]); } B.ball('furn', px + 0.06 * s, y + 1.3, pz + 0.06 * c, 0.16, 0.34, 0.16, PAL.white, 2); break; }
    case 'piano': box(-hw, hw, 0, K.h, -hd, -hd + 0.28, PAL.black); box(-hw, hw, 0.62, 0.72, -hd + 0.28, hd - 0.05, PAL.black); box(-hw + 0.04, hw - 0.04, 0.72, 0.725, -hd + 0.32, hd - 0.07, PAL.white); for (const a of [-1, 1]) leg(a * (hw - 0.05), hd - 0.08, 0.62, 0.03, PAL.black); break;
    case 'drums': for (const q of [[0, 0, 0.3, 0.42], [-0.4, 0.05, 0.16, 0.58], [0.4, 0.05, 0.16, 0.58], [-0.62, -0.3, 0.18, 0.72], [0.6, -0.32, 0.2, 0.5]]) B.cyl('furn', LX(q[0], q[1]), LZ(q[0], q[1]), y + q[3] - 0.22, y + q[3], q[2], 16, PAL.rust, PAL.white); for (const q of [[-0.7, 0.3, 0.95], [0.7, 0.28, 1.0]]) { B.cyl('furn', LX(q[0], q[1]), LZ(q[0], q[1]), y, y + q[2], 0.012, 6, PAL.steel); B.cyl('furn', LX(q[0], q[1]), LZ(q[0], q[1]), y + q[2], y + q[2] + 0.01, 0.2, 14, PAL.bloom2); } break;
    case 'amp': box(-hw, hw, 0, K.h, -hd, hd, PAL.black); B.poly('furn', [[LX(-0.2, hd + 0.002), y + 0.15, LZ(-0.2, hd + 0.002)], [LX(0.2, hd + 0.002), y + 0.15, LZ(0.2, hd + 0.002)], [LX(0.2, hd + 0.002), y + 0.55, LZ(0.2, hd + 0.002)], [LX(-0.2, hd + 0.002), y + 0.55, LZ(-0.2, hd + 0.002)]], PAL.char, [s, 0, c]); break;
    case 'easel': { for (const a of [-1, 1]) B.poly('furn', [[LX(a * 0.3, 0.15), y, LZ(a * 0.3, 0.15)], [LX(a * 0.34, 0.15), y, LZ(a * 0.34, 0.15)], [LX(a * 0.04, -0.02), y + 1.7, LZ(a * 0.04, -0.02)], [LX(0, -0.02), y + 1.7, LZ(0, -0.02)]], PAL.oak, [s, 0, c]); box(-0.34, 0.34, 0.75, 0.78, 0.04, 0.14, PAL.oak); B.poly('furn', [[LX(-0.3, 0.1), y + 0.78, LZ(-0.3, 0.1)], [LX(0.3, 0.1), y + 0.78, LZ(0.3, 0.1)], [LX(0.3, 0.02), y + 1.5, LZ(0.3, 0.02)], [LX(-0.3, 0.02), y + 1.5, LZ(-0.3, 0.02)]], [PAL.teal, PAL.bloom2, PAL.rust][Math.round(x * 3 + z * 7 + 300) % 3], [s, 0.2, c]); break; }
    case 'printer': box(-hw, hw, 0, 0.72, -hd, hd, PAL.oak); box(-hw + 0.06, hw - 0.06, 0.72, K.h, -hd + 0.06, hd - 0.06, PAL.char); B.poly('glass', [[LX(-hw + 0.06, hd - 0.058), y + 0.75, LZ(-hw + 0.06, hd - 0.058)], [LX(hw - 0.06, hd - 0.058), y + 0.75, LZ(hw - 0.06, hd - 0.058)], [LX(hw - 0.06, hd - 0.058), y + K.h - 0.05, LZ(hw - 0.06, hd - 0.058)], [LX(-hw + 0.06, hd - 0.058), y + K.h - 0.05, LZ(-hw + 0.06, hd - 0.058)]], PAL.white); break;
    case 'booth': { box(-hw, hw, 0, K.h, -hd, -hd + 0.05, PAL.teal); box(-hw, -hw + 0.05, 0, K.h, -hd, hd, PAL.teal); box(hw - 0.05, hw, 0, K.h, -hd, hd, PAL.teal); box(-hw, hw, K.h - 0.05, K.h, -hd, hd, PAL.teal); box(-hw + 0.1, hw - 0.1, 0.42, 0.46, -hd + 0.05, -hd + 0.5, PAL.oak); B.poly('glass', [[LX(-hw, hd - 0.02), y, LZ(-hw, hd - 0.02)], [LX(hw, hd - 0.02), y, LZ(hw, hd - 0.02)], [LX(hw, hd - 0.02), y + K.h, LZ(hw, hd - 0.02)], [LX(-hw, hd - 0.02), y + K.h, LZ(-hw, hd - 0.02)]], PAL.white); break; }
    case 'screen': box(-hw, hw, 0.5, K.h, 0, 0.04, PAL.white); for (const a of [-1, 1]) box(a * hw - 0.02, a * hw + 0.02, 0, K.h, -0.03, 0.05, PAL.char); break;
    case 'firebowl': B.cyl('furn', x, z, y, y + 0.42, 0.3, 18, PAL.char, PAL.black, w / 2); for (let i = 0; i < 16; i++) { const a = i * 2.399, f = rnd(i) * 0.26; B.ball('emit', x + Math.cos(a) * f, y + 0.46 + rnd(i + 3) * 0.2, z + Math.sin(a) * f, 0.05, 0.11, 0.05, hex('#ff9a3c'), i); } break;
    case 'ladder': { const top = it.top || K.h, lean = 0.28; for (const a of [-1, 1]) B.poly('furn', [[LX(a * 0.2, lean), y, LZ(a * 0.2, lean)], [LX(a * 0.24, lean), y, LZ(a * 0.24, lean)], [LX(a * 0.24, -lean), y + top + 0.25, LZ(a * 0.24, -lean)], [LX(a * 0.2, -lean), y + top + 0.25, LZ(a * 0.2, -lean)]], PAL.oak, [s, 0.3, c]); const n = Math.round(top / 0.28); for (let i = 1; i <= n; i++) { const f = i / (n + 0.9), lz = lean - 2 * lean * f; box(-0.21, 0.21, (top + 0.25) * f - 0.015, (top + 0.25) * f + 0.015, lz - 0.015, lz + 0.015, PAL.oakDk); } break; }
    case 'shipstair': case 'stair': {
      const top = it.top || K.h, n = Math.round(top / (it.k === 'stair' ? 0.185 : 0.21)), run = d / n;
      for (let i = 0; i < n; i++) {
        const yy = top * (i + 1) / n, lz = hd - run * i;   // climbs toward local −z
        box(-hw + 0.04, hw - 0.04, yy - 0.035, yy, lz - run - 0.02, lz, PAL.oak);
      }
      for (const a of [-1, 1]) {
        const xx = a * (hw - 0.02);
        B.poly('furn', [[LX(xx, hd), y, LZ(xx, hd)], [LX(xx, -hd), y + top - 0.25, LZ(xx, -hd)], [LX(xx, -hd), y + top, LZ(xx, -hd)], [LX(xx, hd), y + 0.25, LZ(xx, hd)]], PAL.oakDk, [a * c, 0, -a * s]);
        const rail = [[LX(xx, hd), y + 0.95, LZ(xx, hd)], [LX(xx, -hd), y + top + 0.9, LZ(xx, -hd)], [LX(xx, -hd), y + top + 0.94, LZ(xx, -hd)], [LX(xx, hd), y + 0.99, LZ(xx, hd)]];
        B.poly('furn', rail, PAL.char, [a * c, 0, -a * s]);
        for (const f of [0, 0.5, 1]) { const lz = hd - d * f, yb = top * f; B.obox('furn', LX(xx, lz), LZ(xx, lz), r, -0.012, 0.012, y + yb, y + yb + 0.95, -0.012, 0.012, PAL.char); }
      }
      break;
    }
  }
}

// lofts: a floor plate clipped to the shell + a railing along the open edge (zFront)
export function drawLoft(B, L, Z) {
  const y = L.y, t = 0.18;
  const pts = L.poly;
  const c = [0, 0]; for (const p of pts) { c[0] += p[0]; c[1] += p[1]; } c[0] /= pts.length; c[1] /= pts.length;
  const P = (p, yy) => [p[0], yy, p[1]];
  B.poly('floor', pts.map(p => P(p, y)), PAL.white, [0, 1, 0]);
  B.poly('furn', pts.map(p => P(p, y - 0.07)), PAL.oak, [0, -1, 0]);
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    B.poly('furn', [P(a, y - t), P(b, y - t), P(b, y), P(a, y)], PAL.oakDk, [(a[0] + b[0]) / 2 - c[0], 0, (a[1] + b[1]) / 2 - c[1]]);
  }
  // joists run front to back across the underside
  const xsAll = pts.map(p => p[0]), xMin = Math.min(...xsAll), xMax = Math.max(...xsAll);
  for (let jx = xMin + 0.2; jx < xMax - 0.1; jx += 0.41) {
    let zMin = L.zFront;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - jx) * (b[0] - jx) <= 0 && a[0] !== b[0]) zMin = Math.min(zMin, a[1] + (b[1] - a[1]) * (jx - a[0]) / (b[0] - a[0])); }
    if (L.zFront - zMin > 0.2) B.box('furn', jx - 0.02, jx + 0.02, y - t, y - 0.07, zMin + 0.05, L.zFront - 0.05, shade(PAL.oakDk, 1.05));
  }
  // front beam + posts, rail on the open edge
  const zF = L.zFront, xs = pts.filter(p => Math.abs(p[1] - zF) < 0.02).map(p => p[0]).sort((a, b) => a - b);
  if (xs.length >= 2) {
    const beam0 = xs[0], beam1 = xs[xs.length - 1];
    let x0 = beam0, x1 = beam1;   // the rail stops where the shell comes in at rail height
    while (x0 < 0 && !Z.insideAt(x0, y + 1.0, zF)) x0 += 0.01;
    while (x1 > 0 && !Z.insideAt(x1, y + 1.0, zF)) x1 -= 0.01;
    const gap = L.stairGap || null;
    const railSpan = (a, b) => {
      if (b - a < 0.05) return;
      B.box('furn', a, b, y + 0.95, y + 0.99, zF - 0.02, zF + 0.02, PAL.char);
      B.box('furn', a, b, y + 0.02, y + 0.05, zF - 0.012, zF + 0.012, PAL.char);
      const n = Math.max(1, Math.round((b - a) / 0.11));
      for (let i = 0; i <= n; i++) { const xp = a + (b - a) * i / n; B.box('furn', xp - 0.005, xp + 0.005, y + 0.03, y + 0.97, zF - 0.005, zF + 0.005, PAL.char); }
    };
    if (gap) { railSpan(x0, Math.min(gap[0], x1)); railSpan(Math.max(gap[1], x0), x1); } else railSpan(x0, x1);
    B.box('furn', beam0, beam1, y - t, y, zF - 0.1, zF, PAL.oakDk);
    const posts = L.posts || [beam0 + 0.25, beam1 - 0.25];
    for (const xp of posts) B.box('furn', xp - 0.06, xp + 0.06, Z.floorY, y - t, zF - 0.12, zF, PAL.oakDk);
  }
}

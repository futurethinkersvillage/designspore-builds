// Trillium Domes zome geometry for Mike's five purchased plans (concept / planned, nothing is built on the land yet).
// Pure maths, no three.js, so the floor plans and the 3D model read the same numbers.
// Units metres, +Y up, door faces +Z, azimuth measured from +Z toward +X.
//
// Every zome is a 10-fold polar zonohedron. Ring k (k = 0 at the apex) has radius Lc·sin(18k°)/sin18° and sits
// (K − k)·Ls above the base ring K, where L is the printed strut length, Lc = L·cosα, Ls = L·sinα.
// α is not printed: it comes from the printed panel mid lengths (mid_k = 2·Lc·sin(18k°)).
// That reproduces the printed base layouts (5 m 4877 vs 4870, 6 m 5996 vs 5996, Acorn 2574 vs 2567).
// 5 m + Acorn share α ≈ 37.2°, 6 / 7.5 / 9 m share α ≈ 33.0°, so they are genuinely different shapes.
//
// Non-beveled builds (6, 7.5, 9 m): square-edged panel frames touch on their inside edges, so the struts are the INSIDE
// surface and each panel stands out by the frame depth `o`, opening a V groove at every seam. That also explains the
// larger cover diameters: 7715 + 2×89 = 7893 vs 7874 printed, 9145 + 2×89 = 9323 vs 9296.
const D = Math.PI / 180;
const S18 = Math.sin(18 * D);

export const TYPES = {
  acorn: {
    key: 'acorn', name: 'Acorn', nominal: '3 m', imperial: '10′6″', L: 0.615, mids: [0.303, 0.578, 0.795, 0.935, 0.983], K: 7,
    o: 0.015, i: 0.09, baseH: 0.175, floorY: 0.32, method: 'beveled', frameDepth: 0.064,
    printed: { widest: 3.226, height: 2.896, surface: 25.5, floor: 5, baseOut: 2.574 }, doors: ['A'], defaultDoor: 'A',
    A: { W: 0.821, H: 1.959, cw: 0.761, cardS: 1.885, cardT: 2.005, awnTop: 0.583, awnBot: 1.037, awnH: 0.767, support: 1.0, baseX: 0.4675 },
    blurb: 'Six rows of rhombi carried past the widest ring, so the walls tuck back in at the base. Trillium drew this one as a sauna.',
    source: 'Zome_AcornSauna_metric-min.pdf',
  },
  z5: {
    key: 'z5', name: '5 m Zome', nominal: '5 m', imperial: '16′', L: 0.994, mids: [0.489, 0.93, 1.281, 1.507, 1.584], K: 6,
    o: 0, i: 0.09, baseH: 0.14, floorY: 0.35, method: 'beveled', frameDepth: 0.064,
    printed: { widest: 5.128, height: 3.748, surface: 45, floor: 15.4, baseOut: 4.877 }, doors: ['A'], defaultDoor: 'A',
    A: { W: 1.011, H: 2.032, cw: 0.719, cardS: 2.146, cardT: 2.196, awnTop: 1.19, awnBot: 1.661, awnH: 0.736, support: 1.454 },
    blurb: 'The steep one: same panel angles as the Acorn, stopped at the widest ring. Tall for its floor.',
    source: 'Zome_5m-min (1).pdf',
  },
  z6: {
    key: 'z6', name: '6 m Zome', nominal: '6 m', imperial: '20′', L: 1.162, mids: [0.602, 1.145, 1.576, 1.853, 1.948], K: 6,
    o: 0.0635, i: 0.02, baseH: 0.152, floorY: 0.35, method: 'non-beveled', frameDepth: 0.0635,
    printed: { widest: 6.436, height: 4.043, surface: 65, floor: 27, baseOut: 6.079 }, doors: ['A'], defaultDoor: 'A',
    A: { W: 1.015, H: 2.09, cw: 0.791, cardS: 2.169, cardT: 2.222, awnTop: 1.624, awnBot: 2.111, awnH: 0.757, support: 1.854 },
    blurb: 'Flatter panel angles than the 5 m, so a lower, wider dome. The only plan with a drawn window: a home-plate pane on a curb.',
    source: 'Zome_6m-min (1).pdf',
  },
  z75: {
    key: 'z75', name: '7.5 m Zome', nominal: '7.5 m', imperial: '25′', L: 1.423, mids: [0.737, 1.402, 1.929, 2.267, 2.384], K: 6,
    o: 0.089, i: 0.02, baseH: 0.121, floorY: 0.35, method: 'non-beveled', frameDepth: 0.089,
    printed: { widest: 7.874, height: 5.029, surface: 111, floor: 40, baseOut: 7.439 }, doors: ['B'], defaultDoor: 'B',
    B: { hdr: 1.905, trim: 2.032, wallD: 1.108, eave: 1.65, pitch: 33, ret: 0.59, deckW: 4.297, deckDepth: 1.203 },
    blurb: 'A framed gable dormer takes up two of the ten bays, with its own V-backed entry deck. Double-height room under the peak.',
    source: 'Zome 7.5m-min.pdf',
  },
  z9: {
    key: 'z9', name: '9 m Zome', nominal: '9 m', imperial: '30′', L: 1.686, mids: [0.873, 1.661, 2.286, 2.688, 2.826], K: 6,
    o: 0.089, i: 0.02, baseH: 0.153, floorY: 0.35, method: 'non-beveled', frameDepth: 0.089,
    printed: { widest: 9.296, height: 6.045, surface: 126, floor: 58, baseOut: 8.849 }, doors: ['B', 'C'], defaultDoor: 'B',
    B: { hdr: 2.126, trim: 2.032, wallD: 1.397, eave: 2.02, pitch: 33, ret: 0.648, deckW: 5.112, deckDepth: 1.423 },
    C: { W: 1.905, H: 1.994, frameW: 2.442, frameH: 2.892, side: 1.219, awnTop: 2.867, awnBot: 3.71, awnSlope: 1.386, deckW: 3.067, deckFront: 0.5 },
    blurb: 'The largest. Trillium ships two complete doorways for it: a gable dormer (“Fancy”) and a shed-roof awning (“Basic”). Both modelled.',
    source: 'Zome 9m-min.pdf',
  },
};
export const TYPE_KEYS = Object.keys(TYPES);
export const DOOR_NAMES = { A: 'Plan doorway: recessed door between plywood door cards, under an awning', B: 'Gable dormer (“Fancy” doorway)', C: 'Shed-roof awning (“Basic” doorway)' };

// ---- small vector helpers (arrays) -----------------------------------------------------------------------------
export const v = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(a[0], a[1], a[2]),
  norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
  mean: pts => { const s = [0, 0, 0]; for (const p of pts) { s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; } return [s[0] / pts.length, s[1] / pts.length, s[2] / pts.length]; },
};
const nd = a => { a = ((a + 180) % 360 + 360) % 360 - 180; return Math.abs(a + 180) < 1e-6 ? 180 : a; };

function inPoly(x, z, poly) {   // poly = [[x,z],...]
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c;
  }
  return c;
}
export { inPoly };

// ---- which panels each doorway removes, from each plan's component list --------------------------------------------
// keep: 'drop' whole panel gone, 'top' upper half stays, 'outer' the half away from the door axis stays.
const DOOR_OPS = {
  A6: [[6, 0, 'drop'], [5, 18, 'outer'], [4, 0, 'drop'], [3, 18, 'outer'], [2, 0, 'top']],   // 5 m, 6 m: z4half, 2 z5 half, z4, 2 z3 half vert, z2 half
  A7: [[7, 18, 'outer'], [6, 0, 'drop'], [5, 18, 'outer'], [4, 0, 'drop'], [3, 18, 'outer'], [2, 0, 'top']],   // Acorn: + 2 z3 quarter
  B: [[6, 18, 'drop'], [5, 0, 'drop'], [5, 36, 'outer'], [4, 18, 'drop'], [3, 0, 'drop']],   // 7.5 + 9 m Fancy: 44 regular panels + 2 z5.5
  C: [[6, 18, 'outer'], [5, 0, 'drop'], [4, 18, 'outer'], [3, 0, 'top']],                    // 9 m Basic: 46 regular panels, z3 half horiz, 2 z4 half vert, 2 z4.25
};

// ---- the model -------------------------------------------------------------------------------------------------------
const cache = new Map();
export function zome(typeKey, doorKey) {
  const T = TYPES[typeKey], door = doorKey || T.defaultDoor, id = typeKey + door;
  if (cache.has(id)) return cache.get(id);
  const { L, mids, K, o, i: inset, baseH, floorY } = T;
  const Lc = mids.map((m, n) => m / (2 * Math.sin((n + 1) * 18 * D))).reduce((a, b) => a + b, 0) / mids.length;
  const alpha = Math.acos(Lc / L), Ls = L * Math.sin(alpha);
  const phi0 = door === 'A' ? 18 : 0;
  const y0 = floorY + baseH;
  const R = k => Lc * Math.sin(k * 18 * D) / S18;
  const Y = k => y0 + (K - k) * Ls;
  const P = (k, az) => { const r = R(k); return [r * Math.sin(az * D), Y(k), r * Math.cos(az * D)]; };
  const apex = [0, Y(0), 0];

  // ---- faces ------------------------------------------------------------------------------------------------
  const ops = new Map();
  for (const [r, a, keep] of DOOR_OPS[door === 'A' ? 'A' + K : door]) { ops.set(r + '_' + nd(a), keep); ops.set(r + '_' + nd(-a), keep); }
  const faces = [];
  for (let row = 1; row <= K; row++) for (let j = 0; j < 10; j++) {
    const th = nd(36 * j + 18 * (row - 1) + phi0);
    const half = row === K;
    const top = P(row - 1, th), right = P(row, th + 18), left = P(row, th - 18);
    const bottom = half ? null : P(row + 1, th);
    const full = half ? [top, right, left] : [top, right, bottom, left];
    const c = v.mean(full);
    let n = v.norm(v.cross(v.sub(full[1], full[0]), v.sub(full[2], full[0])));
    if (v.dot(n, [c[0], 0.3 * (c[1] - Y(5)) + 0.2, c[2]]) < 0) n = v.mul(n, -1);
    const name = half ? 'half' : row === 6 ? 'z6' : 'z' + row;
    const f = { row, th, half, name, full, n, d: v.dot(n, full[0]), pts: full, keep: 'all', c };
    const keep = ops.get(row + '_' + nd(th));
    if (keep === 'drop') f.keep = 'drop', f.pts = [];
    else if (keep === 'top') { f.keep = 'top'; f.pts = [top, right, left]; }
    else if (keep === 'outer') {
      f.keep = 'outer';
      if (half) {
        // half-bay: the base corner on the door side is cut back to baseX (Acorn) or the bay midpoint (9 m Basic)
        const outer = th > 0 ? right : left, inner = th > 0 ? left : right;
        const X = T[door].baseX, t = X ? (Math.abs(outer[0]) - X) / Math.abs(outer[0] - inner[0]) : 0.5;
        f.pts = [top, outer, v.lerp(outer, inner, t)];
      } else f.pts = th > 0 ? [top, right, bottom] : [top, bottom, left];
    }
    faces.push(f);
  }
  const kept = faces.filter(f => f.keep !== 'drop');

  // ---- base ring + floor polygon ---------------------------------------------------------------------------------
  const ringK = [];
  for (let j = 0; j < 10; j++) ringK.push(P(K, 36 * j + 18 * K + phi0));
  ringK.sort((a, b) => Math.atan2(a[0], a[2]) - Math.atan2(b[0], b[2]));   // −180°..180°, the door is at 0°
  const az = p => Math.atan2(p[0], p[2]) / D;
  const back = ringK.filter(p => Math.abs(az(p)) > 37);    // always kept
  const posR = back.filter(p => az(p) > 0).sort((a, b) => az(a) - az(b));   // going away from the door on +X
  const posL = back.filter(p => az(p) < 0).sort((a, b) => az(b) - az(a));
  // floor outline runs from the door's +X side round the back to the −X side
  const around = [...posR, ...posL.slice().reverse()];
  const info = { door, floorY, y0 };
  let floor, porch = null;
  const baseBays = [];
  const pair = (a, b) => baseBays.push([a, b]);
  for (let n = 0; n < around.length - 1; n++) pair(around[n], around[n + 1]);

  if (door === 'A') {
    const A = T.A, W2 = A.W / 2;
    const Xo = R(4) * S18, Zo = R(4) * Math.cos(18 * D);
    const zp = Zo - Math.sqrt(Math.max(0, A.cw * A.cw - (Xo - W2) * (Xo - W2)));
    const r36 = P(K, 36);
    let Xb, Zb;
    if (K === 7) {   // Acorn: door axis on a base corner; 2 special base sections
      const c0 = P(K, 0), c36 = P(K, 36), t = A.baseX / c36[0];
      Xb = A.baseX; Zb = c0[2] + (c36[2] - c0[2]) * t;
      pair([Xb, y0, Zb], c36); pair([-Xb, y0, Zb], [-c36[0], y0, c36[2]]);
      const c72 = P(K, 72); pair(c36, c72); pair([-c36[0], y0, c36[2]], [-c72[0], y0, c72[2]]);
      floor = [[W2, zp], [Xb, Zb], [c36[0], c36[2]]];
    } else {         // 5 m, 6 m: door axis on a base bay; 9 base sections
      const c18 = P(K, 18); Xb = c18[0]; Zb = c18[2];
      const c54 = P(K, 54);
      pair(c18, c54); pair([-c18[0], y0, c18[2]], [-c54[0], y0, c54[2]]);
      floor = [[W2, zp], [Xb, Zb]];
    }
    for (const p of around) floor.push([p[0], p[2]]);
    if (K === 7) floor.push([-P(K, 36)[0], P(K, 36)[2]]);
    floor.push([-Xb, Zb], [-W2, zp]);
    info.A = { ...A, Xo, Zo, zp, Xb, Zb, W2 };
    info.doorW = A.W; info.doorH = A.H; info.doorZ = zp; info.doorCX = 0;
    porch = [[W2, zp], [Xb, Zb], [Xo, Zo], [-Xo, Zo], [-Xb, Zb], [-W2, zp]];
  } else if (door === 'B') {
    const B = T.B, X = R(K) * Math.sin(36 * D), Zc = R(K) * Math.cos(36 * D), dG = Zc + B.ret;
    const c36 = P(K, 36);
    pair(c36, P(K, 72)); pair([-c36[0], y0, c36[2]], [-P(K, 72)[0], y0, P(K, 72)[2]]);
    floor = [[X, dG], [c36[0], c36[2]]];
    const r72 = P(K, 72);
    floor.push([r72[0], r72[2]]);
    for (const p of around) if (Math.abs(az(p)) > 73) floor.push([p[0], p[2]]);
    floor.push([-r72[0], r72[2]], [-c36[0], c36[2]], [-X, dG]);
    // the printed wall panel D short side lands within 30 mm of ring 4, so the eave is tied to that ring
    const eaveY = Y(4), tp = Math.tan(B.pitch * D), apexY = eaveY + X * tp;
    const r2 = P(2, 0), r3 = P(3, 18), r4 = P(4, 36);
    // doors open outward, so the entry deck runs at least a leaf's width plus 150 mm past the wall (the plan prints deckDepth)
    const deckDepth = Math.max(B.deckDepth, dG - Zc + B.hdr / 2 + 0.15);
    info.B = { ...B, deckDepthPlan: B.deckDepth, deckDepth, X, Zc, dG, eaveY, apexY, r2, r3, r4 };
    info.doorW = B.hdr; info.doorH = B.trim; info.doorZ = dG; info.doorCX = 0;
    info.dormerPoly = [[X, dG], [X, Zc], [r3[0], r3[2]], [r2[0], r2[2]], [-r3[0], r3[2]], [-X, Zc], [-X, dG]];
    const n1 = v.norm(v.cross(v.sub([X, eaveY, dG], [0, apexY, dG]), v.sub(r2, [0, apexY, dG])));
    const nr = n1[1] < 0 ? v.mul(n1, -1) : n1;
    info.dormerCeil = (x, z) => {
      const ax = Math.abs(x);
      return apexY + (nr[0] * (0 - ax) + nr[2] * (dG - z)) / nr[1] - 0.14;
    };
    porch = [[B.deckW / 2, dG], [-B.deckW / 2, dG], [-B.deckW / 2, Zc + deckDepth], [B.deckW / 2, Zc + deckDepth]];
  } else {
    const C = T.C, r3 = P(3, 18), r5 = P(5, 18), c0 = P(K, 0), c36 = P(K, 36);
    const mid = v.lerp(c0, c36, 0.5);
    const dF = r3[2] + C.side, Xf = C.frameW / 2;
    pair(c36, P(K, 72)); pair([-c36[0], y0, c36[2]], [-P(K, 72)[0], y0, P(K, 72)[2]]);
    pair(mid, c36); pair([-mid[0], y0, mid[2]], [-c36[0], y0, c36[2]]);
    const r72 = P(K, 72);
    floor = [[Xf, dF], [mid[0], mid[2]], [c36[0], c36[2]], [r72[0], r72[2]]];
    for (const p of around) if (Math.abs(az(p)) > 73) floor.push([p[0], p[2]]);
    floor.push([-r72[0], r72[2]], [-c36[0], c36[2]], [-mid[0], mid[2]], [-Xf, dF]);
    const deckFront = Math.max(C.deckFront, C.W / 2 + 0.15);
    info.C = { ...C, deckFrontPlan: C.deckFront, deckFront, r3, r5, mid, dF, Xf };
    info.doorW = C.W; info.doorH = C.H; info.doorZ = dF; info.doorCX = 0;
    info.dormerPoly = [[Xf, dF], [mid[0], mid[2]], [r3[0], r3[2]], [-r3[0], r3[2]], [-mid[0], mid[2]], [-Xf, dF]];
    info.dormerCeil = () => floorY + C.frameH - 0.12;
    porch = [[C.deckW / 2, dF], [-C.deckW / 2, dF], [-C.deckW / 2, dF + deckFront], [C.deckW / 2, dF + deckFront]];
  }

  // ---- the landing outside the door (deck the door leaf swings over)
  if (door === 'A') { const A = info.A; info.landing = { x: Math.max(A.Xo, A.Xb) + 0.32, z0: A.zp - 0.02, z1: A.Zo + (K === 7 ? 0.62 : 0.72) }; }
  else if (door === 'B') info.landing = { x: info.B.deckW / 2, z0: info.B.dG, z1: info.B.Zc + info.B.deckDepth };
  else info.landing = { x: info.C.deckW / 2, z0: info.C.dF, z1: info.C.dF + info.C.deckFront };

  // ---- interior surface ----------------------------------------------------------------------------------------
  const planes = faces.map(f => ({ n: f.n, d: f.d - inset }));
  const up = planes.filter(p => p.n[1] > 0.02);
  const inDormer = (x, z) => info.dormerPoly ? inPoly(x, z, info.dormerPoly) : false;
  // height of the inside surface above a floor point (absolute y)
  const ceilAt = (x, z) => {
    let y = Infinity;
    for (const p of up) y = Math.min(y, (p.d - p.n[0] * x - p.n[2] * z) / p.n[1]);
    if (inDormer(x, z)) y = Math.max(y, Math.min(info.dormerCeil(x, z), Y(0)));
    return y;
  };
  // is point (absolute y) inside the shell skin?
  const insideAt = (x, y, z) => {
    if (y < floorY - 1e-6) return false;
    if (inDormer(x, z)) return y <= Math.max(info.dormerCeil(x, z), ceilAt(x, z));
    for (const p of planes) if (p.n[0] * x + p.n[1] * y + p.n[2] * z > p.d) return false;
    return true;
  };
  const inFloor = (x, z) => inPoly(x, z, floor);
  const headroom = (x, z) => ceilAt(x, z) - floorY;
  // plan-view outline of where the inside head height reaches h: ray-marched from the centre, clipped to the floor
  const contour = h => {
    const pts = [];
    for (let a = 0; a < 360; a += 1.5) {
      const s = Math.sin(a * D), c = Math.cos(a * D);
      let last = null;
      for (let r = 0; r < R(5) + 1.5; r += 0.01) {
        const x = r * s, z = r * c;
        if (!inFloor(x, z)) break;
        if (headroom(x, z) < h) break;
        last = [x, z];
      }
      if (last) pts.push(last);
    }
    return pts;
  };
  const polyArea = p => { let a = 0; for (let n = 0, m = p.length - 1; n < p.length; m = n++) a += p[m][0] * p[n][1] - p[n][0] * p[m][1]; return Math.abs(a) / 2; };
  const stats = {
    alphaDeg: alpha / D, Lc, Ls, rWide: R(5), rBase: R(K), apexY: Y(0), shellH: K * Ls,
    outerWidest: 2 * (R(5) + o), floorArea: polyArea(floor),
    area200: polyArea(contour(2.0)), area140: polyArea(contour(1.4)), maxHead: Y(0) - floorY - inset / Math.max(0.2, Math.sin(alpha)),
    totalHeight: Y(0) + o, heightFromDeck: Y(0) + o - floorY,
  };
  const out = { T, type: typeKey, door, K, L, Lc, Ls, alpha, o, inset, baseH, floorY, y0, R, Y, P, apex, faces, kept, baseBays, floor, porch, info, planes, ceilAt, insideAt, inFloor, headroom, contour, stats, phi0, polyArea };
  cache.set(id, out);
  return out;
}

// panel lookup for windows: row + azimuth (degrees, nearest match)
export function panelAt(Z, row, az) {
  let best = null, bd = 1e9;
  for (const f of Z.faces) if (f.row === row) { const d = Math.abs(nd(f.th - az)); if (d < bd) { bd = d; best = f; } }
  return best;
}

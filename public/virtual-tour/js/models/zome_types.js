// The five real Trillium zome types for Portal.Place (planned / concept, none exist on the land yet). Added alongside zome.js, which stays as it is.
// Each type is built from its own plan numbers in zome_geom.js: strut length, panel mid lengths, ring count, base bays and doorway.
// Build method and doorway differ by type: Acorn, 5 m and 6 m use the recessed door between plywood door cards under an awning; 7.5 m uses a gable dormer;
// 9 m ships both a gable dormer and a shed-roof awning. Finishes: clad (shingled panels, ply inside) or clear (polycarbonate between the real panel frames).
// Units metres, origin = centre of the floor at ground level, +Y up, door faces +Z.
// build({ type, door, finish, glass, glaze, sky, plan, lod, figure }) -> Group; buildMerged(opts) -> one BufferGeometry with material groups + materials.
import * as THREE from 'three';
import { TYPES, TYPE_KEYS, zome, panelAt, v } from './zome_geom.js';
import { Buf, PAL, hex, shade, mix, drawItem, drawLoft } from './zome_furniture.js';
export { TYPES, TYPE_KEYS, zome };

export const meta = {
  name: 'Trillium zome types (planned)', layer: [], match: 'not placed in the film yet',
  sources: ['D:/Dropbox/ALLPLANSBUNDLE-TrilliumDomes+3D/AllZomesBundle-TrilliumDomes+3D', 'D:/Dropbox/Wells Gray Resort/Photos/Concept Images/Village Concept/Building Concepts/Zomes'],
  notes: 'Concept only, nothing built. Five sizes from the purchased plans: Acorn 3 m, 5 m, 6 m, 7.5 m, 9 m.',
};

function hash(i) { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

export const FINISHES = {
  slate: { name: 'Slate shingle (Mike’s concept renders)', base: hex('#a6a9a8'), alt: hex('#83888b'), warm: hex('#b7aa95'), seam: hex('#2a2c2e'), wall: hex('#b98a5a'), trim: hex('#2f3336') },
  cedar: { name: 'Cedar shingle (Trillium plan covers)', base: hex('#a2583a'), alt: hex('#8a4730'), warm: hex('#b56a44'), seam: hex('#241813'), wall: hex('#e5dcc4'), trim: hex('#4a3423') },
};

// ---- canvas textures (real-world tile sizes, UVs are metres) --------------------------------------------------------
const texCache = {};
function canvasTex(key, size, tile, draw, color = true) {
  if (texCache[key]) return texCache[key];
  const c = document.createElement('canvas'); c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / tile, 1 / tile); t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  return (texCache[key] = t);
}
function shingleTex() {   // staggered courses of shingles, tile = 1.2 m: courses 150 mm, widths 150-300 mm
  return canvasTex('shingle', 1024, 1.2, (g, S) => {
    g.fillStyle = '#d8d8d8'; g.fillRect(0, 0, S, S);
    const rows = 8, rh = S / rows;
    for (let r = 0; r < rows; r++) {
      let x = -hash(r) * rh; let i = 0;
      while (x < S) {
        const w = rh * (1 + hash(r * 9 + i) * 1.1), t = 195 + hash(r * 3 + i * 7) * 60 | 0;
        g.fillStyle = `rgb(${t},${t},${t})`; g.fillRect(x, r * rh, w, rh);
        const gr = g.createLinearGradient(0, r * rh, 0, (r + 1) * rh);
        gr.addColorStop(0, 'rgba(0,0,0,0.32)'); gr.addColorStop(0.2, 'rgba(0,0,0,0.02)'); gr.addColorStop(1, 'rgba(255,255,255,0.1)');
        g.fillStyle = gr; g.fillRect(x, r * rh, w, rh);
        g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(x, r * rh, 2.5, rh);
        x += w; i++;
      }
    }
  });
}
function boardsTex(key, tile, boards, vertical, base, grain) {
  return canvasTex(key, 1024, tile, (g, S) => {
    g.fillStyle = base; g.fillRect(0, 0, S, S);
    const w = S / boards;
    for (let i = 0; i < boards; i++) {
      const t = 0.86 + hash(i * 3.1 + key.length) * 0.22;
      g.save();
      if (!vertical) { g.translate(S, 0); g.rotate(Math.PI / 2); }
      g.fillStyle = `rgba(0,0,0,${(1 - Math.min(t, 1)) * 0.9})`; g.fillRect(i * w, 0, w, S);
      if (t > 1) { g.fillStyle = `rgba(255,255,255,${(t - 1) * 0.8})`; g.fillRect(i * w, 0, w, S); }
      g.strokeStyle = grain; g.lineWidth = 1;
      for (let q = 0; q < 26; q++) { const x = i * w + hash(q * 5 + i) * w; g.globalAlpha = 0.12 + hash(q + i * 2) * 0.18; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 3, S * 0.3, x - 4, S * 0.6, x + hash(q) * 3, S); g.stroke(); }
      g.globalAlpha = 1; g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(i * w, 0, 2.5, S);
      g.restore();
    }
  });
}
const boardsVert = () => boardsTex('boards', 1.2, 8, true, '#e0d8c8', '#6d5a44');
const deckBoards = () => boardsTex('deck', 1.14, 8, false, '#a07c58', '#4a3524');
const floorBoards = () => boardsTex('floor', 2.4, 16, false, '#d6b288', '#7a5a38');
function plyTex() {
  return canvasTex('ply', 1024, 2.4, (g, S) => {
    g.fillStyle = '#efe2c8'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 300; i++) { const y = hash(i) * S; g.strokeStyle = `rgba(150,110,70,${0.04 + hash(i + 9) * 0.1})`; g.lineWidth = 1 + hash(i + 3) * 2; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(S * 0.3, y + 14 * (hash(i + 5) - 0.5), S * 0.6, y - 14 * (hash(i + 6) - 0.5), S, y); g.stroke(); }
  });
}

const matCache = {};
const CLIPPED = [];
function mat(key, make) { if (matCache[key]) return matCache[key]; const m = make(); matCache[key] = m; CLIPPED.push(m); return m; }
function materialFor(b) {
  const sd = THREE.DoubleSide;
  const S = o => new THREE.MeshStandardMaterial(o);
  switch (b) {
    case 'shingle': return mat(b, () => S({ vertexColors: true, map: shingleTex(), roughness: 0.82 }));
    case 'wood': return mat(b, () => S({ vertexColors: true, map: boardsVert(), roughness: 0.7, side: sd }));
    case 'deck': return mat(b, () => S({ vertexColors: true, map: deckBoards(), roughness: 0.85 }));
    case 'floor': return mat(b, () => S({ vertexColors: true, map: floorBoards(), roughness: 0.55 }));
    case 'ply': return mat(b, () => S({ vertexColors: true, map: plyTex(), roughness: 0.65 }));
    case 'pc': return mat(b, () => S({ color: 0xdfeee9, roughness: 0.18, metalness: 0, transparent: true, opacity: 0.24, side: sd, depthWrite: false }));
    case 'glass': return mat(b, () => S({ color: 0xbcd3d9, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.32, side: sd, depthWrite: false, emissive: 0xffb268, emissiveIntensity: 0 }));
    case 'water': return mat(b, () => S({ vertexColors: true, roughness: 0.12, metalness: 0.05, emissive: 0x1d6a78, emissiveIntensity: 0.45 }));
    case 'emit': return mat(b, () => S({ vertexColors: true, emissive: 0xff8a3c, emissiveIntensity: 1.6 }));
    case 'plant': return mat(b, () => S({ vertexColors: true, roughness: 0.75, flatShading: true }));
    default: return mat(b, () => S({ vertexColors: true, roughness: 0.68, side: b === 'furn' ? THREE.FrontSide : sd }));
  }
}
// shared clipping for cutaway renders + the dusk window glow
export function setClip(planes) { for (const m of CLIPPED) { m.clippingPlanes = planes; m.clipShadows = true; } }
export function setDusk(on) { materialFor('glass').emissiveIntensity = on ? 0.9 : 0; materialFor('pc').opacity = on ? 0.13 : 0.24; }

// ---- polygon helpers -------------------------------------------------------------------------------------------------
const off = (pts, n, h) => pts.map(p => v.add(p, v.mul(n, h)));
function insetPoly(pts, n, e) {   // planar convex polygon, each edge moved in by e
  const m = pts.length, c = v.mean(pts), res = [];
  const lines = [];
  for (let i = 0; i < m; i++) { const a = pts[i], b = pts[(i + 1) % m]; const d = v.norm(v.sub(b, a)); let t = v.cross(n, d); if (v.dot(t, v.sub(c, a)) < 0) t = v.mul(t, -1); lines.push({ p: v.add(a, v.mul(t, e)), d }); }
  for (let i = 0; i < m; i++) {
    const L1 = lines[(i + m - 1) % m], L2 = lines[i];
    const w = v.sub(L2.p, L1.p), cr = v.cross(L1.d, L2.d), den = v.dot(cr, cr);
    if (den < 1e-10) { res.push(L2.p); continue; }
    const t = v.dot(v.cross(w, L2.d), cr) / den;
    res.push(v.add(L1.p, v.mul(L1.d, t)));
  }
  return res;
}
function polyWithHole(B, bucket, outer, hole, n, col) {
  const c = outer[0], ex = v.norm(v.sub(outer[1], outer[0])), ey = v.cross(n, ex);
  const to2 = p => { const q = v.sub(p, c); return new THREE.Vector2(v.dot(q, ex), v.dot(q, ey)); };
  const O2 = outer.map(to2), H2 = hole.map(to2), all = [...outer, ...hole];
  const tris = THREE.ShapeUtils.triangulateShape(O2, [H2]);
  for (const t of tris) B.poly(bucket, [all[t[0]], all[t[1]], all[t[2]]], col, n);
}
function bar(B, bucket, a, b, n, w, depth, col, shift = 0) {   // timber strip along a→b, flat against a surface whose outward normal is n
  const d = v.norm(v.sub(b, a)), t = v.mul(v.cross(n, d), w / 2);
  const A = v.add(a, v.mul(n, shift)), E = v.add(b, v.mul(n, shift));
  const P = (q, s, h) => v.add(v.add(q, v.mul(t, s)), v.mul(n, h));
  B.poly(bucket, [P(A, -1, depth), P(A, 1, depth), P(E, 1, depth), P(E, -1, depth)], col, n);
  B.poly(bucket, [P(A, -1, 0), P(A, -1, depth), P(E, -1, depth), P(E, -1, 0)], shade(col, 0.8), v.mul(t, -1));
  B.poly(bucket, [P(A, 1, 0), P(A, 1, depth), P(E, 1, depth), P(E, 1, 0)], shade(col, 0.8), t);
}

// window opening in a panel, in the panel's plane. kind: 'full' whole rhombus, 'tri' upper triangle, 'home' Trillium's home-plate pane on its curb (6 m plan p.21-23)
function windowOutline(f, kind) {
  const [T, R, Bt, Lf] = f.full, n = f.n;
  if (f.half || kind === 'tri' && !Bt) return insetPoly(f.pts, n, 0.12);
  const m = 0.085;
  if (kind === 'full') return insetPoly([T, R, Bt, Lf], n, m);
  if (kind === 'tri') return insetPoly([Lf, R, T], n, m);
  // home plate: flat top, point down. Printed on the 6 m at 821 wide, 435 straight, 310 point, over a 1576-1948 mid length
  const M = v.lerp(Lf, R, 0.5), mid = v.len(v.sub(R, Lf));
  const ex = v.norm(v.sub(R, Lf)), ey = v.norm(v.sub(T, Bt));
  const vd = v.len(v.sub(T, Bt));
  const scale = Math.min(1, mid / 1.7, vd / 1.5);
  const W = 0.821 * scale * Math.max(1, mid / 1.948), S = 0.435 * scale, Pt = 0.31 * scale;
  const top = 0.1 * vd;
  const at = (x, y) => v.add(v.add(M, v.mul(ex, x)), v.mul(ey, y));
  return [at(-W / 2, top), at(W / 2, top), at(W / 2, top - S), at(0, top - S - Pt), at(-W / 2, top - S)];
}

// ---- shell -------------------------------------------------------------------------------------------------------------
function addClad(B, f, Z, F, winKind, hi) {
  const n = f.n, e = Z.o > 0 ? 0.006 : 0.014, h = Z.o > 0 ? Z.o : 0.015;
  const t = hash(f.row * 17 + f.th * 3.1);
  const col = t > 0.72 ? mix(F.base, F.warm, 0.7) : t < 0.28 ? mix(F.base, F.alt, 0.85) : shade(F.base, 0.96 + t * 0.1);
  const outer = off(insetPoly(f.pts, n, e), n, h);
  for (let i = 0; i < f.pts.length; i++) {
    const j = (i + 1) % f.pts.length;
    B.poly('trim', [f.pts[i], f.pts[j], outer[j], outer[i]], F.seam, n);
  }
  const inner = off(insetPoly(f.pts, n, 0.002), n, -Z.inset);
  const skin = PAL.white;
  const glassy = winKind && f.pts.length >= 3;
  if (!hi) { B.poly('shingle', outer, col, n); if (winKind) B.poly('glass', off(windowOutline(f, winKind), n, h + 0.002), PAL.white, n); return; }
  if (glassy) {
    const win = windowOutline(f, winKind), wo = off(win, n, h), wi = off(win, n, -Z.inset);
    polyWithHole(B, 'shingle', outer, wo, n, col);
    polyWithHole(B, 'ply', inner, wi, v.mul(n, -1), skin);
    // curb + reveal + frame around the pane
    const m = win.length;
    const fr = off(insetPoly(win, n, 0.05), n, h + 0.03);
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m, c = v.mean(win), out = v.sub(v.lerp(win[i], win[j], 0.5), c);
      B.poly('trim', [wi[i], wi[j], wo[j], wo[i]], PAL.birch, v.mul(out, -1));
      const wa = off([win[i]], n, h + 0.03)[0], wb = off([win[j]], n, h + 0.03)[0];
      B.poly('trim', [wo[i], wo[j], wb, wa], F.trim, out);
      B.poly('trim', [wa, wb, fr[j], fr[i]], F.trim, n);
    }
    B.poly('glass', fr, PAL.white, n);
  } else {
    B.poly('shingle', outer, col, n);
    B.poly('ply', inner, skin, v.mul(n, -1));
  }
  // the panel's frame reads inside as a timber line along every seam (concept interiors)
  for (let i = 0; i < f.pts.length; i++) {
    if (isCutEdge(f, i)) continue;
    const a = f.pts[i], b = f.pts[(i + 1) % f.pts.length];
    if (Z.door === 'A' && [a, b].some(q => q[2] > Z.info.A.zp && Math.abs(q[0]) < Z.info.A.Xo + 0.04)) continue;   // would poke through the door card
    bar(B, 'timber', off([a], n, -Z.inset)[0], off([b], n, -Z.inset)[0], v.mul(n, -1), 0.05, 0.022, PAL.oak);
  }
}

// the edge a doorway sawed through is hidden by the door cards / dormer walls, so it gets no trim line
function isCutEdge(f, i) {
  if (f.keep === 'top') return i === 1;
  if (f.keep !== 'outer') return false;
  if (f.half) return i === 2;
  return f.th > 0 ? i === 2 : i === 0;
}

// polycarbonate panel: the plan's own panel frame (38 mm wide, frame depth deep) with the sheet on its outside face
function addClear(B, f, Z, F) {
  const n = f.n, w = 0.038, fr = Z.o > 0 ? Z.o : 0, bk = Z.o > 0 ? 0 : -Z.T.frameDepth;
  const front = off(f.pts, n, fr), back = off(f.pts, n, bk);
  const iF = off(insetPoly(f.pts, n, w), n, fr), iB = off(insetPoly(f.pts, n, w), n, bk);
  const col = PAL.oak, c = v.mean(f.pts);
  for (let i = 0; i < f.pts.length; i++) {
    const j = (i + 1) % f.pts.length, out = v.sub(v.lerp(f.pts[i], f.pts[j], 0.5), c);
    B.poly('timber', [front[i], front[j], iF[j], iF[i]], col, n);
    B.poly('timber', [back[i], back[j], iB[j], iB[i]], shade(col, 0.9), v.mul(n, -1));
    B.poly('timber', [iF[i], iF[j], iB[j], iB[i]], shade(col, 0.82), v.mul(out, -1));
    B.poly('timber', [front[i], front[j], back[j], back[i]], shade(col, 0.72), out);
  }
  B.poly('pc', off(iF, n, -0.004), PAL.white, n);
}

function addApex(B, Z, F, clear) {
  const y = Z.apex[1] + Z.o / Math.max(0.2, Math.sin(Z.alpha)) * 0, r = 0.13 * Math.max(0.7, Z.T.L), cap = y + 0.07;
  B.cyl('trim', 0, 0, y - 0.1, cap - 0.02, r, 10, clear ? PAL.oakDk : F.trim, clear ? PAL.oakDk : F.trim, r * 0.9);
  B.cyl('trim', 0, 0, cap - 0.02, cap, r * 0.9, 10, F.trim, F.trim, 0.01);
  if (!clear) B.cyl('timber', 0, 0, y - 0.28, y - 0.2, r * 0.8, 10, PAL.oakDk, PAL.oakDk);
}

function addBaseAndDeck(B, Z, F, hi) {
  const y0 = Z.y0, fy = Z.floorY;
  // base sections: sheathed band round the bays that exist, per each plan's base layout
  for (const [a, b] of Z.baseBays) {
    const m = v.lerp(a, b, 0.5), out = v.norm([m[0], 0, m[2]]);
    const o = Z.o + 0.008, Lo = v.add(a, v.mul(out, o)), Ro = v.add(b, v.mul(out, o));
    const A = [Lo[0], fy, Lo[2]], E = [Ro[0], fy, Ro[2]], A2 = [Lo[0], y0 + 0.002, Lo[2]], E2 = [Ro[0], y0 + 0.002, Ro[2]];
    B.poly('wood', [A, E, E2, A2], shade(F.wall, 0.94), out);
    B.poly('trim', [A2, E2, [b[0], y0 + 0.002, b[2]], [a[0], y0 + 0.002, a[2]]], F.seam, [0, 1, 0]);
    if (hi) { const ia = v.add(a, v.mul(out, -Z.inset)), ib = v.add(b, v.mul(out, -Z.inset)); B.poly('ply', [[ia[0], fy, ia[2]], [ib[0], fy, ib[2]], [ib[0], y0, ib[2]], [ia[0], y0, ia[2]]], PAL.white, v.mul(out, -1)); }
  }
  // finished floor + platform: rim joists on pier blocks (the deck sheets in each plan)
  const fl = Z.floor;
  const tri = THREE.ShapeUtils.triangulateShape(fl.map(p => new THREE.Vector2(p[0], p[1])), []);
  const P = (p, yy) => [p[0], yy, p[1]];
  for (const t of tri) B.poly('floor', [P(fl[t[0]], fy), P(fl[t[1]], fy), P(fl[t[2]], fy)], PAL.white, [0, 1, 0]);
  const rimB = Math.max(0.1, fy - 0.2);
  const ring = [...Z.baseBays.flat().map(p => [p[0], p[2]])];
  const cx = 0, cz = 0;
  for (const [a, b] of Z.baseBays) {
    const m = v.lerp(a, b, 0.5), out = v.norm([m[0], 0, m[2]]), o = Z.o + 0.03;
    const A = v.add(a, v.mul(out, o)), E = v.add(b, v.mul(out, o));
    B.poly('wood', [[A[0], rimB, A[2]], [E[0], rimB, E[2]], [E[0], fy + 0.005, E[2]], [A[0], fy + 0.005, A[2]]], shade(F.wall, 0.7), out);
    B.poly('trim', [[a[0], rimB, a[2]], [b[0], rimB, b[2]], [cx, rimB, cz]], hex('#191a1b'), [0, -1, 0]);
    B.poly('trim', [[A[0], fy + 0.005, A[2]], [E[0], fy + 0.005, E[2]], [b[0], fy + 0.005, b[2]], [a[0], fy + 0.005, a[2]]], shade(F.wall, 0.82), [0, 1, 0]);
  }
  for (const p of ring) { const r = Math.hypot(p[0], p[1]); if (r > 0.1) B.box('trim', p[0] * 0.94 - 0.08, p[0] * 0.94 + 0.08, 0, rimB + 0.01, p[1] * 0.94 - 0.08, p[1] * 0.94 + 0.08, hex('#4a4744')); }
}

// steps + landing in front of the door
function addLanding(B, Z, x0, x1, zb, zf, hi, fill = true) {
  const y = Z.floorY - 0.004, rimB = Math.max(0.08, Z.floorY - 0.2);
  if (fill) B.poly('deck', [[x0, y, zb], [x1, y, zb], [x1, y, zf], [x0, y, zf]], PAL.white, [0, 1, 0]);
  const fas = hex('#6d5138');
  B.poly('trim', [[x0, rimB, zf], [x1, rimB, zf], [x1, y, zf], [x0, y, zf]], fas, [0, 0, 1]);
  B.poly('trim', [[x0, rimB, zb], [x0, rimB, zf], [x0, y, zf], [x0, y, zb]], fas, [-1, 0, 0]);
  B.poly('trim', [[x1, rimB, zb], [x1, rimB, zf], [x1, y, zf], [x1, y, zb]], fas, [1, 0, 0]);
  for (const [px, pz] of [[x0 + 0.1, zf - 0.1], [x1 - 0.1, zf - 0.1]]) B.box('trim', px - 0.06, px + 0.06, 0, rimB, pz - 0.06, pz + 0.06, hex('#4a4744'));
  const n = Math.max(1, Math.round(Z.floorY / 0.17)), sw = Math.min(1.5, (x1 - x0) * 0.72) / 2, sc = (x0 + x1) / 2;
  for (let i = 1; i <= n; i++) {
    const top = Z.floorY * (1 - i / (n + 1)), z0 = zf + (i - 1) * 0.28;
    B.obox('deck', 0, 0, 0, sc - sw, sc + sw, 0, top, z0, z0 + 0.28, PAL.white);
    B.obox('trim', 0, 0, 0, sc - sw - 0.002, sc + sw + 0.002, 0, top - 0.002, z0 + 0.27, z0 + 0.282, fas);
  }
}

function doorLeaf(B, cx, y0, H, W, z, F, opts = {}) {   // full-lite door + frame, dark frame as in the concepts
  const fw = 0.055, depth = 0.09, hx = W / 2;
  const fc = F.trim;
  const zb = z - depth, zf = z;
  B.obox('timber', 0, 0, 0, cx - hx, cx - hx + fw, y0, y0 + H, zb, zf, fc);
  B.obox('timber', 0, 0, 0, cx + hx - fw, cx + hx, y0, y0 + H, zb, zf, fc);
  B.obox('timber', 0, 0, 0, cx - hx, cx + hx, y0 + H - fw, y0 + H, zb, zf, fc);
  B.obox('timber', 0, 0, 0, cx - hx, cx + hx, y0, y0 + 0.02, zb, zf, hex('#191a1b'));
  const leaves = opts.leaves || 1, lw = (W - 2 * fw) / leaves;
  for (let l = 0; l < leaves; l++) {
    const x0 = cx - hx + fw + l * lw, x1 = x0 + lw, st = 0.05, zg = z - depth / 2;
    const t = F === FINISHES.cedar ? PAL.walnut : PAL.char;
    B.obox('timber', 0, 0, 0, x0, x0 + st, y0 + 0.02, y0 + H - fw, zg - 0.02, zg + 0.02, t);
    B.obox('timber', 0, 0, 0, x1 - st, x1, y0 + 0.02, y0 + H - fw, zg - 0.02, zg + 0.02, t);
    B.obox('timber', 0, 0, 0, x0, x1, y0 + H - fw - st, y0 + H - fw, zg - 0.02, zg + 0.02, t);
    B.obox('timber', 0, 0, 0, x0, x1, y0 + 0.02, y0 + 0.14, zg - 0.02, zg + 0.02, t);
    B.poly('glass', [[x0 + st, y0 + 0.14, zg], [x1 - st, y0 + 0.14, zg], [x1 - st, y0 + H - fw - st, zg], [x0 + st, y0 + H - fw - st, zg]], PAL.white, [0, 0, 1]);
    const hx2 = leaves === 2 ? (l === 0 ? x1 - st - 0.03 : x0 + st + 0.03) : x1 - st + 0.015;
    B.obox('timber', 0, 0, 0, hx2 - 0.012, hx2 + 0.012, y0 + 0.95, y0 + 1.25, zg + 0.02, zg + 0.05, PAL.steel);
  }
}

// Door type A (Acorn, 5 m, 6 m): door posts recessed behind two plywood door cards, header panel, awning on a support beam
function addDoorA(B, Z, F, hi) {
  const A = Z.info.A, fy = Z.floorY, { W2, Xo, Zo, zp, Xb, Zb } = A;
  const r2R = Z.P(2, 18), r2L = [-r2R[0], r2R[1], r2R[2]], r4R = Z.P(4, 18);
  const card = hex('#c9a170');
  const yS = fy + A.cardS, yT = fy + A.cardT;
  for (const s of [1, -1]) {
    const x1 = s * W2, x2 = s * Xo, xb = s * Xb;
    // the card, in the vertical plane from the post out to the hole in the shell
    const pts = [[x1, fy, zp]];
    if (Math.abs(Zb - Zo) > 0.02) {   // Acorn: the card steps in to follow the belly of the shell
      const yK = Z.Y(6);
      const tb = (Zb - zp) / (Zo - zp);
      pts.push([x1 + (x2 - x1) * tb, fy, Zb], [x2, yK, Zo]);
    } else pts.push([x2, fy, Zo]);
    pts.push([x2, yT, Zo], [x1, yS, zp]);
    const out = [s * (Zo - zp), 0, -s * (Xo - W2)];
    const offs = [0.0095, -0.0095];
    B.poly('wood', pts.map(p => [p[0] + offs[0] * out[0] * 3, p[1], p[2] + offs[0] * out[2] * 3]), card, [-s * (Zo - zp), 0, s * (Xo - W2)]);
    B.poly('wood', pts, shade(card, 0.9), out);
    // filler between the card top, the header panel and the kept z3 half
    const hb = [s * W2 * 1.08, fy + A.H + 0.06, zp];
    const tEdge = Math.min(1, Math.max(0, (yT - r4R[1]) / (r2R[1] - r4R[1])));
    const Q = v.lerp([s * r4R[0], r4R[1], r4R[2]], [s * r2R[0], r2R[1], r2R[2]], tEdge);
    B.poly('wood', [[x1, yS, zp], [x2, yT, Zo], Q], shade(F.base, 0.7));
    B.poly('shingle', [[x1, yS, zp], Q, [s * r2R[0], r2R[1], r2R[2]]], shade(F.base, 0.86), [s * 0.3, 0.6, 1]);
    B.poly('shingle', [[x1, yS, zp], [s * r2R[0], r2R[1], r2R[2]], hb], shade(F.base, 0.86), [s * 0.1, 0.5, 1]);
    void xb;
  }
  // header panel from the door head up to the kept half of z2
  const hbR = [W2 * 1.08, fy + A.H + 0.06, zp], hbL = [-W2 * 1.08, fy + A.H + 0.06, zp];
  B.poly('shingle', [hbL, hbR, r2R, r2L], shade(F.base, 0.92), [0, 0.5, 1]);
  B.poly('ply', [[hbL[0], hbL[1], hbL[2] - 0.08], [hbR[0], hbR[1], hbR[2] - 0.08], [r2R[0], r2R[1] - 0.07, r2R[2]], [r2L[0], r2L[1] - 0.07, r2L[2]]], PAL.white, [0, -0.5, -1]);
  B.obox('wood', 0, 0, 0, -W2 * 1.08, W2 * 1.08, fy + A.H, fy + A.H + 0.08, zp - 0.09, zp + 0.01, shade(card, 0.8));
  doorLeaf(B, 0, fy, A.H, A.W, zp, F);
  // awning: printed trapezoid on the support beam, sloping up into the shell
  const yF = yT + 0.02, ang = 26 * Math.PI / 180, run = A.awnH * Math.cos(ang), rise = A.awnH * Math.sin(ang), zF = Zo + 0.14;
  const a = [-A.awnBot / 2, yF, zF], b = [A.awnBot / 2, yF, zF], c = [A.awnTop / 2, yF + rise, zF - run], d = [-A.awnTop / 2, yF + rise, zF - run];
  const up = [0, 0.9, 0.44];
  B.poly('shingle', [a, b, c, d], shade(F.base, 0.86), up);
  B.poly('trim', [[a[0], yF - 0.05, zF], [b[0], yF - 0.05, zF], b, a], F.trim, [0, 0, 1]);
  B.poly('wood', [[a[0], yF - 0.05, zF], [b[0], yF - 0.05, zF], [c[0], yF + rise - 0.05, zF - run], [d[0], yF + rise - 0.05, zF - run]], shade(card, 0.7), [0, -1, 0]);
  B.obox('timber', 0, 0, 0, -A.support / 2, A.support / 2, yF - 0.14, yF - 0.05, Zo - 0.03, Zo + 0.05, PAL.oakDk);
  // porch floor + landing
  const lw = Math.max(Xo, Xb) + 0.32;
  addLanding(B, Z, -lw, lw, zp - 0.02, Zo + (Z.K === 7 ? 0.62 : 0.72), hi);
  // lamp
  if (hi) B.obox('emit', 0, 0, 0, Xo - 0.1, Xo - 0.03, fy + 1.75, fy + 1.92, Zo - 0.14, Zo - 0.06, hex('#ffe2b0'));
}

// Door type B (7.5 m, 9 m Fancy): gable dormer spanning two bays. Wall panels D + E, side returns, roof panels back to rings 4/3/2
function addDoorB(B, Z, F, hi) {
  const I = Z.info.B, fy = Z.floorY, { X, Zc, dG, eaveY, apexY, r2, r3, r4 } = I;
  const wall = F.wall;
  const front = dG;
  const hw = I.hdr / 2, top = fy + I.trim, hdrTop = top + 0.14;
  const out = [0, 0, 1];
  // wall panels D left/right of the opening
  for (const s of [1, -1]) {
    const yIn = eaveY + (X - hw) * Math.tan(I.pitch * Math.PI / 180);
    B.poly('wood', [[s * hw, fy, front], [s * X, fy, front], [s * X, eaveY, front], [s * hw, yIn, front]], wall, out);
    B.poly('wood', [[s * hw, fy, front - 0.14], [s * X, fy, front - 0.14], [s * X, eaveY, front - 0.14], [s * hw, yIn, front - 0.14]], shade(PAL.birch, 1), [0, 0, -1]);
    // side return (roof panel A in the plan's layout, drawn upright)
    B.poly('wood', [[s * X, fy, Zc], [s * X, fy, front], [s * X, eaveY, front], r4 && [s * r4[0], r4[1], r4[2]]], shade(wall, 0.92), [s, 0, 0]);
    B.poly('ply', [[s * (X - 0.12), fy, Zc], [s * (X - 0.12), fy, front - 0.14], [s * (X - 0.12), eaveY - 0.03, front - 0.14], [s * (X - 0.12), r4[1] - 0.03, Zc]], PAL.white, [-s, 0, 0]);
    // corner boards
    B.obox('timber', 0, 0, 0, s * X - 0.06, s * X + 0.03, fy, eaveY, front - 0.03, front + 0.03, F.trim);
    // roof, three facets back to the rings the plan's hole is cut to, shingled like the shell
    const Q = [s * (X + 0.09), eaveY - 0.06, front + 0.09], FP = [0, apexY + 0.05, front + 0.14], R4 = [s * r4[0], r4[1], r4[2]], R3 = [s * r3[0], r3[1], r3[2]], R2 = r2;
    const up = [s * 0.5, 0.8, 0.15], rc = shade(F.base, 0.94);
    const lift = p => [p[0], p[1] + 0.11, p[2]];
    B.poly('shingle', [lift(Q), lift(R4), lift(R3)], rc, up);
    B.poly('shingle', [lift(Q), lift(R3), lift(R2)], shade(rc, 1.02), up);
    B.poly('shingle', [lift(Q), lift(R2), lift(FP)], shade(rc, 0.96), up);
    B.poly('ply', [[s * (X - 0.12), eaveY - 0.04, front - 0.14], [s * r4[0], r4[1] - 0.03, r4[2]], [s * r3[0], r3[1] - 0.03, r3[2]]], PAL.white, [-s * 0.5, -0.8, 0]);
    B.poly('ply', [[s * (X - 0.12), eaveY - 0.04, front - 0.14], [s * r3[0], r3[1] - 0.03, r3[2]], [0, r2[1] - 0.03, r2[2]]], PAL.white, [-s * 0.5, -0.8, 0]);
    B.poly('ply', [[s * (X - 0.12), eaveY - 0.04, front - 0.14], [0, r2[1] - 0.03, r2[2]], [0, apexY - 0.14, front - 0.14]], PAL.white, [-s * 0.5, -0.8, 0]);
    // edge walls filling from the lifted roof down to the structure
    B.poly('trim', [Q, R4, lift(R4), lift(Q)], F.seam, [s, 0.1, 0]);
    // barge board on the gable
    const bb = 0.17;
    const q0 = [s * (X + 0.11), eaveY - 0.09, front + 0.15], q1 = [0, apexY + 0.03, front + 0.15];
    const bbo = [0, 0, 1];
    B.poly('timber', [q0, q1, [q1[0], q1[1] + bb, q1[2]], [q0[0], q0[1] + bb, q0[2]]], F.trim, bbo);
    B.poly('timber', [[s * (X + 0.11), eaveY - 0.09 + bb, front + 0.15], [0, apexY + 0.03 + bb, front + 0.15], [0, apexY + 0.03 + bb, front], [s * (X + 0.11), eaveY - 0.09 + bb, front]], F.trim, [0, 1, 0]);
    // door trimmers + wall-corner stud lines
    B.obox('timber', 0, 0, 0, s * hw - 0.045, s * hw + 0.045, fy, hdrTop, front - 0.14, front + 0.02, F.trim);
  }
  // header + the E gable above it: three lights between studs, as on the plan cover
  B.obox('timber', 0, 0, 0, -hw, hw, top, hdrTop, front - 0.14, front + 0.02, F.trim);
  const tanP = Math.tan(I.pitch * Math.PI / 180);
  const gy = x => eaveY + (X - Math.abs(x)) * tanP;   // the sloped wall top at x
  const gableZ = front - 0.06;
  // lower side panels above the header out to the door trimmer are the wall E
  const P = (x, y) => [x, y, front];
  const hg = hw;
  const yL = gy(hg);
  B.poly('glass', [[-hg, hdrTop, gableZ], [hg, hdrTop, gableZ], [hg, yL - 0.03, gableZ], [0, apexY - 0.04, gableZ], [-hg, yL - 0.03, gableZ]], PAL.white, out);
  for (const xs of [-hg, -hg / 2, 0, hg / 2, hg]) { const ty = Math.min(gy(xs), apexY); B.obox('timber', 0, 0, 0, xs - 0.03, xs + 0.03, hdrTop, ty, front - 0.09, front + 0.0, F.trim); }
  B.poly('trim', [P(-hg, yL), P(0, apexY), [0, apexY, front + 0.01], [-hg, yL, front + 0.01]], F.trim, [-0.5, 0.8, 0]);
  B.poly('trim', [P(hg, yL), P(0, apexY), [0, apexY, front + 0.01], [hg, yL, front + 0.01]], F.trim, [0.5, 0.8, 0]);
  doorLeaf(B, 0, fy, I.trim, I.hdr, front - 0.02, F, { leaves: 2 });
  // entry deck, drawn V-backed around the floor corner in the plan
  addLanding(B, Z, -I.deckW / 2, I.deckW / 2, front - 0.3, Zc + I.deckDepth, hi);
  if (hi) for (const s of [1, -1]) B.obox('emit', 0, 0, 0, s * (hw + 0.14) - 0.04, s * (hw + 0.14) + 0.04, fy + 1.9, fy + 2.08, front + 0.01, front + 0.08, hex('#ffe2b0'));
}

// Door type C (9 m Basic): framed wall on the front of a shallow box, with a wide shed awning
function addDoorC(B, Z, F, hi) {
  const I = Z.info.C, fy = Z.floorY, { r3, r5, mid, dF, Xf } = I;
  const wall = F.wall, top = fy + I.frameH, hw = I.W / 2, hTop = fy + I.H + 0.14;
  const out = [0, 0, 1];
  const yE = Math.max(top, r3[1]);
  for (const s of [1, -1]) {
    B.poly('wood', [[s * hw, fy, dF], [s * Xf, fy, dF], [s * Xf, top, dF], [s * hw, top, dF]], wall, out);
    B.poly('ply', [[s * hw, fy, dF - 0.1], [s * Xf, fy, dF - 0.1], [s * Xf, top - 0.1, dF - 0.1], [s * hw, top - 0.1, dF - 0.1]], PAL.white, [0, 0, -1]);
    const side = [[s * Xf, fy, dF], [s * mid[0], fy, mid[2]], [s * r5[0], r5[1], r5[2]], [s * r3[0], r3[1], r3[2]], [s * Xf, top, dF]];
    B.poly('wood', [side[0], side[1], side[2]], shade(wall, 0.92), [s, 0, 0]);
    B.poly('wood', [side[0], side[2], side[3]], shade(wall, 0.92), [s, 0, 0]);
    B.poly('wood', [side[0], side[3], side[4]], shade(wall, 0.92), [s, 0, 0]);
    B.obox('timber', 0, 0, 0, s * hw - 0.045, s * hw + 0.045, fy, top, dF - 0.1, dF + 0.015, F.trim);
    B.obox('timber', 0, 0, 0, s * Xf - 0.05, s * Xf + 0.03, fy, top, dF - 0.1, dF + 0.03, F.trim);
  }
  // header, then the five short studs with lights between them, as drawn on the plan's doorway sheet
  B.obox('timber', 0, 0, 0, -hw, hw, hTop - 0.14, hTop, dF - 0.1, dF + 0.015, F.trim);
  const gz = dF - 0.05;
  B.poly('glass', [[-hw, hTop, gz], [hw, hTop, gz], [hw, top, gz], [-hw, top, gz]], PAL.white, out);
  for (let i = 0; i < 5; i++) { const x = -hw + (i + 0.5) * I.W / 5; B.obox('timber', 0, 0, 0, x - 0.022, x + 0.022, hTop, top, dF - 0.09, dF, F.trim); }
  doorLeaf(B, 0, fy, I.H, I.W, dF - 0.02, F, { leaves: 2 });
  // sloped awning: printed bottom 3710, top 2867, fascia 205
  const yF = top + 0.02, zF = dF + 0.21, yB = Math.max(r3[1] + 0.32, yF + 0.26), zB = r3[2] - 0.05;
  const a = [-I.awnBot / 2, yF + 0.2, zF], b = [I.awnBot / 2, yF + 0.2, zF], c = [I.awnTop / 2, yB, zB], d = [-I.awnTop / 2, yB, zB];
  B.poly('shingle', [a, b, c, d], shade(F.base, 0.9), [0, 1, 0.3]);
  B.poly('timber', [[a[0], yF, zF], [b[0], yF, zF], b, a], F.trim, out);
  B.poly('ply', [[a[0], yF, zF], [b[0], yF, zF], [c[0], yB - 0.2, zB], [d[0], yB - 0.2, zB]], PAL.birch, [0, -1, 0]);
  for (const s of [1, -1]) B.poly('trim', [[s * I.awnBot / 2, yF, zF], [s * I.awnTop / 2, yB - 0.2, zB], [s * I.awnTop / 2, yB, zB], [s * I.awnBot / 2, yF + 0.2, zF]], F.trim, [s, 0, 0]);
  void yE;
  const fl = [[hw + 0.6, I.deckW / 2]];
  void fl;
  addLanding(B, Z, -I.deckW / 2, I.deckW / 2, mid[2] - 0.05, dF + I.deckFront, hi);
  if (hi) for (const s of [1, -1]) B.obox('emit', 0, 0, 0, s * (hw + 0.16) - 0.04, s * (hw + 0.16) + 0.04, fy + 1.85, fy + 2.03, dF + 0.01, dF + 0.08, hex('#ffe2b0'));
}

// ---- interior -----------------------------------------------------------------------------------------------------------
function addPartition(B, it, Z) {
  const [ax, az] = it.a, [bx, bz] = it.b, Y0 = Z.floorY, H = it.h || 2.3;
  const L = Math.hypot(bx - ax, bz - az), dx = (bx - ax) / L, dz = (bz - az) / L, nx = -dz, nz = dx, t = 0.05;
  const ceil = s => Math.min(Y0 + H, Z.ceilAt(ax + dx * s, az + dz * s) - 0.004);
  const col = PAL.white, trim = PAL.oak;
  const seg = (s0, s1, y0, topFn) => {
    const n = Math.max(1, Math.ceil((s1 - s0) / 0.2));
    for (let i = 0; i < n; i++) {
      const a = s0 + (s1 - s0) * i / n, b = s0 + (s1 - s0) * (i + 1) / n, ya = topFn(a), yb = topFn(b);
      if (ya <= y0 + 0.01 || yb <= y0 + 0.01) continue;
      const P = (s, sign, y) => [ax + dx * s + nx * t * sign, y, az + dz * s + nz * t * sign];
      B.poly('furn', [P(a, 1, y0), P(b, 1, y0), P(b, 1, yb), P(a, 1, ya)], col, [nx, 0, nz]);
      B.poly('furn', [P(a, -1, y0), P(b, -1, y0), P(b, -1, yb), P(a, -1, ya)], shade(col, 0.96), [-nx, 0, -nz]);
      B.poly('furn', [P(a, -1, ya), P(b, -1, yb), P(b, 1, yb), P(a, 1, ya)], trim, [0, 1, 0]);
      B.poly('furn', [P(a, 1, y0), P(a, -1, y0), P(a, -1, ya), P(a, 1, ya)], col, [-dx, 0, -dz]);
      B.poly('furn', [P(b, 1, y0), P(b, -1, y0), P(b, -1, yb), P(b, 1, yb)], col, [dx, 0, dz]);
    }
  };
  if (it.door !== undefined) {
    const dw = it.dw || 0.8, c = it.door * L, s0 = c - dw / 2, s1 = c + dw / 2, dh = 2.04;
    seg(0, s0, Y0, ceil); seg(s1, L, Y0, ceil);
    seg(s0, s1, Y0 + dh, ceil);
    // door leaf standing open into the room on the +n side
    const sw = it.swing || 1;
    const hx = ax + dx * s0, hz = az + dz * s0, ox = nx * sw, oz = nz * sw;
    const lf = [[hx, Y0 + 0.01, hz], [hx + ox * dw * 0.96, Y0 + 0.01, hz + oz * dw * 0.96], [hx + ox * dw * 0.96, Y0 + dh, hz + oz * dw * 0.96], [hx, Y0 + dh, hz]];
    B.poly('furn', lf, PAL.oak, [dx, 0, dz]); B.poly('furn', lf, shade(PAL.oak, 0.9), [-dx, 0, -dz]);
  } else seg(0, L, Y0, ceil);
}

function addPlan(B, plan, Z) {
  if (plan.loft) drawLoft(B, plan.loft, Z);
  for (const it of plan.items) {
    if (it.k === 'wall') addPartition(B, it, Z);
    else drawItem(B, it, Z);
  }
}

function addFigure(B, x, z, r, Z, tint) {   // scale figure 1.72 m, standing on the ground
  const y = 0, s = Math.sin(r * Math.PI / 180), c = Math.cos(r * Math.PI / 180);
  const L = (lx, lz) => [x + lx * c + lz * s, z - lx * s + lz * c];
  const shirt = hex('#4b5157'), skin = hex('#5a5f64'), pants = hex('#3d4247');
  for (const a of [-1, 1]) { const p = L(a * 0.09, 0); B.cyl('furn', p[0], p[1], y, y + 0.86, 0.058, 8, pants, pants, 0.075); const q = L(a * 0.215, 0); B.cyl('furn', q[0], q[1], y + 0.8, y + 1.4, 0.03, 8, shirt, shirt, 0.042); B.obox('furn', p[0], p[1], r, -0.05, 0.05, y, y + 0.06, -0.08, 0.14, PAL.black); }
  const m = L(0, 0);
  B.cyl('furn', m[0], m[1], y + 0.84, y + 1.46, 0.145, 10, shirt, shirt, 0.17);
  B.ball('furn', m[0], y + 1.46, m[1], 0.17, 0.05, 0.11, shirt);
  B.cyl('furn', m[0], m[1], y + 1.46, y + 1.54, 0.05, 8, skin);
  B.ball('furn', m[0], y + 1.61, m[1], 0.095, 0.115, 0.1, skin, 2);
  void tint;
}

// ---- assembly ---------------------------------------------------------------------------------------------------------------
function assemble({ type = 'z6', door, finish = 'slate', glass = null, glaze = [], sky = false, plan = null, lod = 'high', figure = false, interior = true } = {}) {
  const Z = zome(type, door), F = FINISHES[finish], B = new Buf(), hi = lod !== 'low';
  const win = new Map();
  for (const [row, az, kind] of glaze) { const f = panelAt(Z, row, az); if (f) win.set(f, kind || 'full'); }
  if (sky) for (const f of Z.faces) if (f.row === 1) win.set(f, 'full');
  const clearRows = glass === 'all' ? Infinity : glass === 'upper' ? Z.K - 2 : glass === 'top' ? 2 : 0;
  for (const f of Z.kept) {
    if (f.row <= clearRows) addClear(B, f, Z, F);
    else addClad(B, f, Z, F, win.get(f), hi);
  }
  addApex(B, Z, F, glass === 'all');
  addBaseAndDeck(B, Z, F, hi);
  if (Z.door === 'A') addDoorA(B, Z, F, hi);
  else if (Z.door === 'B') addDoorB(B, Z, F, hi);
  else addDoorC(B, Z, F, hi);
  if (plan && interior && hi) addPlan(B, plan, Z);
  if (figure && hi) {   // scale figure on the ground beside the steps
    const halfW = Z.door === 'A' ? Math.max(Z.info.A.Xo, Z.info.A.Xb) + 0.32 : Z.door === 'B' ? Z.info.B.deckW / 2 : Z.info.C.deckW / 2;
    const front = Z.door === 'A' ? Z.info.A.Zo + (Z.K === 7 ? 0.62 : 0.72) : Z.door === 'B' ? Z.info.B.Zc + Z.info.B.deckDepth : Z.info.C.dF + Z.info.C.deckFront;
    addFigure(B, -(halfW + 0.6), front - 0.15, -20, Z);
  }
  return { B, Z };
}

function toGeo(part) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(part.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(part.nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(part.col, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(part.uv, 2));
  return g;
}

const ORDER = ['shingle', 'wood', 'deck', 'floor', 'ply', 'timber', 'trim', 'furn', 'plant', 'water', 'emit', 'pc', 'glass'];
export function build(opts = {}) {
  const { B } = assemble(opts);
  const g = new THREE.Group(); g.name = 'zome_' + (opts.type || 'z6');
  for (const k of ORDER) {
    const p = B.b[k]; if (!p || !p.pos.length) continue;
    const m = new THREE.Mesh(toGeo(p), materialFor(k)); m.name = k;
    m.castShadow = k !== 'pc' && k !== 'glass' && k !== 'water' && k !== 'emit'; m.receiveShadow = k !== 'pc' && k !== 'glass';
    if (k === 'pc' || k === 'glass') m.renderOrder = 2;
    g.add(m);
  }
  return g;
}

// One BufferGeometry + material list, for InstancedMesh placement in the film later (groups follow ORDER).
export function buildMerged(opts = {}) {
  const { B } = assemble(opts);
  const keys = ORDER.filter(k => B.b[k] && B.b[k].pos.length);
  const pos = [], nor = [], col = [], uv = [];
  const g = new THREE.BufferGeometry(); let start = 0;
  const materials = [];
  keys.forEach((k, i) => { const p = B.b[k]; pos.push(...p.pos); nor.push(...p.nor); col.push(...p.col); uv.push(...p.uv); const n = p.pos.length / 3; g.addGroup(start, n, i); start += n; materials.push(materialFor(k)); });
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeBoundingBox(); g.computeBoundingSphere();
  return { geometry: g, materials };
}

// Structure geometry engine — geodesic domes, pentakis (Do-Deca) domes,
// truncated-icosahedron (bucky) domes, zomes (polar zonohedra), pyramids.
// All math is z-up, in feet; apex centered on the origin, ground at z=0.
//
// Construction model (per Trillium Domes plans): every face is a framed PANEL;
// panels are screwed face-to-face. Shared edges therefore carry two boards.
// Base rings are NOT flattened in Trillium models (flatten:false) — the wavy
// sphere truncation is leveled by tapered base/pony-wall sections instead.

// ---------- vec helpers ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const dist = (a, b) => len(sub(a, b));
const norm = (a) => scale(a, 1 / len(a));
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// ---------- shared post-processing ----------

function groupStruts(verts, edges, tol) {
  const groups = [];
  const struts = edges.map(([a, b]) => {
    const L = dist(verts[a], verts[b]);
    let g = groups.find((G) => Math.abs(G.length - L) < tol);
    if (!g) {
      g = { length: L, count: 0, sum: 0 };
      groups.push(g);
    }
    g.count++;
    g.sum += L;
    return { a, b, _g: g };
  });
  groups.sort((x, y) => y.length - x.length);
  groups.forEach((g, i) => {
    g.label = String.fromCharCode(65 + i);
    g.length = g.sum / g.count;
  });
  struts.forEach((s) => {
    s.group = s._g.label;
    delete s._g;
  });
  return { struts, strutGroups: groups };
}

function groupPanels(verts, faces, tol) {
  const groups = [];
  const panels = faces.map((f) => {
    const L = f.map((v, i) => dist(verts[v], verts[f[(i + 1) % f.length]]));
    const sig = [...L].sort((a, b) => a - b);
    let g = groups.find(
      (G) =>
        G.sig.length === sig.length &&
        G.sig.every((s, i) => Math.abs(s - sig[i]) < tol)
    );
    if (!g) {
      g = { sig, count: 0, sample: f, area: polyArea(verts, f) };
      groups.push(g);
    }
    g.count++;
    return { verts: f, _g: g };
  });
  groups.sort((x, y) => y.area - x.area);
  groups.forEach((g, i) => {
    g.label = "P" + (i + 1);
    g.shape =
      g.sig.length === 3 ? "triangle" :
      g.sig.length === 4 ? "quad" :
      g.sig.length === 5 ? "pentagon" :
      g.sig.length === 6 ? "hexagon" : g.sig.length + "-gon";
    // corner angles + edge details of the sample face (for miter tables)
    const f = g.sample;
    const n = f.length;
    g.corners = f.map((vi, i) => {
      const p = verts[vi];
      const u = norm(sub(verts[f[(i + 1) % n]], p));
      const w = norm(sub(verts[f[(i - 1 + n) % n]], p));
      return (Math.acos(Math.max(-1, Math.min(1, dot(u, w)))) * 180) / Math.PI;
    });
    g.edges = f.map((vi, i) => ({
      length: dist(verts[vi], verts[f[(i + 1) % n]]),
      m1: 90 - g.corners[i],            // saw miter "off 90°" at this end
      m2: 90 - g.corners[(i + 1) % n],  // and at the far end
    }));
  });
  panels.forEach((p) => {
    p.group = p._g.label;
    delete p._g;
  });
  return { panels, panelGroups: groups };
}

function polyArea(verts, f) {
  let A = 0;
  for (let i = 1; i < f.length - 1; i++) {
    const u = sub(verts[f[i]], verts[f[0]]);
    const v = sub(verts[f[i + 1]], verts[f[0]]);
    A += len(cross(u, v)) / 2;
  }
  return A;
}

// Average interior dihedral per strut group. Panel edges get rip-beveled at
// (180 − dihedral)/2 so mating panel frames sit flush.
function computeDihedrals(verts, struts, faces) {
  const edgeFaces = new Map();
  const key = (a, b) => (a < b ? a + "_" + b : b + "_" + a);
  for (const f of faces) {
    const n = faceNormal(verts, f);
    for (let i = 0; i < f.length; i++) {
      const k = key(f[i], f[(i + 1) % f.length]);
      if (!edgeFaces.has(k)) edgeFaces.set(k, []);
      edgeFaces.get(k).push(n);
    }
  }
  const byGroup = new Map();
  for (const s of struts) {
    const ns = edgeFaces.get(key(s.a, s.b));
    if (!ns || ns.length !== 2) continue;
    const d = Math.max(-1, Math.min(1, dot(ns[0], ns[1])));
    const dihedral = 180 - (Math.acos(d) * 180) / Math.PI;
    if (!byGroup.has(s.group)) byGroup.set(s.group, []);
    byGroup.get(s.group).push(dihedral);
  }
  const out = {};
  for (const [g, arr] of byGroup)
    out[g] = arr.reduce((a, b) => a + b, 0) / arr.length;
  return out;
}

function faceNormal(verts, f) {
  const u = sub(verts[f[1]], verts[f[0]]);
  const v = sub(verts[f[2]], verts[f[0]]);
  return norm(cross(u, v));
}

function boundaryLoop(faces) {
  const count = new Map();
  const key = (a, b) => (a < b ? a + "_" + b : b + "_" + a);
  for (const f of faces)
    for (let i = 0; i < f.length; i++) {
      const k = key(f[i], f[(i + 1) % f.length]);
      count.set(k, (count.get(k) || 0) + 1);
    }
  const adj = new Map();
  for (const [k, c] of count) {
    if (c !== 1) continue;
    const [a, b] = k.split("_").map(Number);
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a).push(b);
    adj.get(b).push(a);
  }
  if (adj.size === 0) return [];
  const start = adj.keys().next().value;
  const loop = [start];
  let prev = -1,
    cur = start;
  for (let guard = 0; guard <= adj.size; guard++) {
    const nexts = adj.get(cur).filter((v) => v !== prev);
    if (!nexts.length || nexts[0] === start) break;
    loop.push(nexts[0]);
    prev = cur;
    cur = nexts[0];
  }
  return loop;
}

// Base sections below the (possibly wavy) base loop, dropping to a level
// bottom plane — the Trillium tapered pony-wall/base-section approach.
// riserH = wall height measured at the HIGHEST base vertex (min section).
function addRiser(verts, loop, riserH) {
  if (riserH <= 0 || loop.length < 3) return null;
  let zLow = Infinity, zHigh = -Infinity;
  for (const vi of loop) {
    zLow = Math.min(zLow, verts[vi][2]);
    zHigh = Math.max(zHigh, verts[vi][2]);
  }
  // bottom plane sits riserH below the LOWEST ring vertex, so every section
  // is at least riserH tall and tapered sections absorb the ring waviness
  const zb = zLow - riserH;
  const bottomIdx = loop.map((vi) => {
    const v = verts[vi];
    verts.push([v[0], v[1], zb]);
    return verts.length - 1;
  });
  const panels = [];
  const studEdges = [];
  const plateEdges = [];
  const studHeights = [];
  for (let i = 0; i < loop.length; i++) {
    const j = (i + 1) % loop.length;
    studEdges.push([loop[i], bottomIdx[i]]);
    plateEdges.push([bottomIdx[i], bottomIdx[j]]);
    studHeights.push(verts[loop[i]][2] - zb);
    panels.push([loop[i], loop[j], bottomIdx[j], bottomIdx[i]]);
  }
  const segs = loop.map((vi, i) =>
    dist(verts[vi], verts[loop[(i + 1) % loop.length]])
  );
  const tapered = zHigh - zLow > 1e-4;
  return {
    count: loop.length, studH: riserH, segs, panels, bottomIdx,
    studEdges, plateEdges, studHeights, tapered,
    minH: riserH, maxH: riserH + (zHigh - zLow),
  };
}

function ground(verts) {
  let zmin = Infinity;
  for (const v of verts) zmin = Math.min(zmin, v[2]);
  for (const v of verts) v[2] -= zmin;
}

function edgesFromFaces(faces) {
  const eset = new Map();
  for (const f of faces)
    for (let i = 0; i < f.length; i++) {
      const a = f[i],
        b = f[(i + 1) % f.length];
      const k = a < b ? a + "_" + b : b + "_" + a;
      if (!eset.has(k)) eset.set(k, [Math.min(a, b), Math.max(a, b)]);
    }
  return [...eset.values()];
}

// Per-strut outward (bevel) direction + per-vertex outward normals.
function attachOrientation(verts, faces, struts) {
  let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const v of verts)
    for (let k = 0; k < 3; k++) {
      lo[k] = Math.min(lo[k], v[k]);
      hi[k] = Math.max(hi[k], v[k]);
    }
  const center = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
  const key = (a, b) => (a < b ? a + "_" + b : b + "_" + a);
  const eAcc = new Map();
  const vAcc = verts.map(() => [0, 0, 0]);
  for (const f of faces) {
    let n = faceNormal(verts, f);
    const c = f.reduce((s, vi) => add(s, verts[vi]), [0, 0, 0]).map((x) => x / f.length);
    if (dot(n, sub(c, center)) < 0) n = scale(n, -1);
    for (let i = 0; i < f.length; i++) {
      const k = key(f[i], f[(i + 1) % f.length]);
      if (!eAcc.has(k)) eAcc.set(k, [0, 0, 0]);
      eAcc.set(k, add(eAcc.get(k), n));
      vAcc[f[i]] = add(vAcc[f[i]], n);
    }
  }
  const radial = (vi) => {
    const d = sub(verts[vi], center);
    return len(d) > 1e-9 ? norm(d) : [0, 0, 1];
  };
  for (const s of struts) {
    const acc = eAcc.get(key(s.a, s.b));
    s.out =
      acc && len(acc) > 1e-9 ? norm(acc) : norm(add(radial(s.a), radial(s.b)));
  }
  return vAcc.map((n, vi) => (len(n) > 1e-9 ? norm(n) : radial(vi)));
}

// Shared shell pipeline: truncate a sphere-ish face set at a fraction, then
// group, orient, add base sections, and compute stats.
function finishShell(verts, faces, R, p, typeName, detail) {
  const cutZ = R * (1 - 2 * p.fraction);
  faces = faces.filter((f) => {
    const cz = f.reduce((s, vi) => s + verts[vi][2], 0) / f.length;
    return cz >= cutZ;
  });
  const used = [...new Set(faces.flat())];
  const remap = new Map(used.map((vi, i) => [vi, i]));
  const newVerts = used.map((vi) => [...verts[vi]]);
  faces = faces.map((f) => f.map((vi) => remap.get(vi)));

  const loop = boundaryLoop(faces);
  let zAvg = loop.reduce((s, vi) => s + newVerts[vi][2], 0) / (loop.length || 1);
  if (p.flatten !== false) {
    for (const vi of loop) newVerts[vi][2] = zAvg;
  }

  const edges = edgesFromFaces(faces);
  const wall = addRiser(newVerts, loop, p.riserFt || 0);
  ground(newVerts);

  const tol = R * 1e-4;
  const { struts, strutGroups } = groupStruts(newVerts, edges, tol);
  const { panels, panelGroups } = groupPanels(newVerts, faces, tol);
  const dihedrals = computeDihedrals(newVerts, struts, faces);
  const vertexNormals = attachOrientation(newVerts, faces, struts);

  const baseR = loop.length
    ? Math.max(...loop.map((vi) => Math.hypot(newVerts[vi][0], newVerts[vi][1])))
    : R;
  let zmax = 0, widest = 0;
  for (const vv of newVerts) {
    zmax = Math.max(zmax, vv[2]);
    widest = Math.max(widest, Math.hypot(vv[0], vv[1]));
  }
  const achieved = (R - zAvg) / (2 * R);

  return {
    verts: newVerts, struts, panels, strutGroups, panelGroups, dihedrals, wall,
    vertexNormals, faces,
    stats: {
      type: typeName,
      detail: detail(achieved),
      sphereDiameter: 2 * R,
      baseDiameter: 2 * baseR,
      widestDiameter: 2 * widest,
      height: zmax,
      floorArea: Math.PI * baseR * baseR,
      surfaceArea: panelGroups.reduce((s, g) => s + g.area * g.count, 0),
      panelCount: panels.length,
      boardCount: faces.reduce((s, f) => s + f.length, 0),
    },
  };
}

function fracLabel(f) {
  const opts = [
    [1 / 4, "1/4"], [3 / 8, "3/8"], [1 / 2, "1/2"], [5 / 8, "5/8"],
    [3 / 4, "3/4"], [7 / 8, "7/8"], [1, "full"],
  ];
  let best = opts[0];
  for (const o of opts) if (Math.abs(o[0] - f) < Math.abs(best[0] - f)) best = o;
  return Math.abs(best[0] - f) < 0.05 ? best[1] : f.toFixed(2);
}

// ---------- GEODESIC DOME (Class I icosa subdivision) ----------

function icosahedron() {
  const verts = [[0, 0, 1]];
  const zu = 1 / Math.sqrt(5);
  const r = 2 / Math.sqrt(5);
  for (let k = 0; k < 5; k++) {
    const a = (2 * Math.PI * k) / 5;
    verts.push([r * Math.cos(a), r * Math.sin(a), zu]);
  }
  for (let k = 0; k < 5; k++) {
    const a = (2 * Math.PI * k) / 5 + Math.PI / 5;
    verts.push([r * Math.cos(a), r * Math.sin(a), -zu]);
  }
  verts.push([0, 0, -1]);
  const faces = [];
  for (let k = 0; k < 5; k++) {
    const k2 = (k + 1) % 5;
    faces.push([0, 1 + k, 1 + k2]);
    faces.push([1 + k, 6 + k, 1 + k2]);
    faces.push([1 + k2, 6 + k, 6 + k2]);
    faces.push([6 + k, 11, 6 + k2]);
  }
  return { verts, faces };
}

export function buildDome(p) {
  const R = p.diameterFt / 2;
  const v = p.frequency;
  const ico = icosahedron();
  const verts = [];
  const vmap = new Map();
  const getV = (pt) => {
    const n = norm(pt);
    const k = n.map((x) => Math.round(x * 1e6)).join(",");
    if (vmap.has(k)) return vmap.get(k);
    verts.push(scale(n, R));
    vmap.set(k, verts.length - 1);
    return verts.length - 1;
  };
  const faces = [];
  for (const [ia, ib, ic] of ico.faces) {
    const A = ico.verts[ia], B = ico.verts[ib], C = ico.verts[ic];
    const idx = [];
    for (let i = 0; i <= v; i++) {
      idx.push([]);
      for (let j = 0; j <= i; j++) {
        const q = add(
          add(scale(A, (v - i) / v), scale(B, (i - j) / v)),
          scale(C, j / v)
        );
        idx[i].push(getV(q));
      }
    }
    for (let i = 1; i <= v; i++)
      for (let j = 0; j < i; j++) {
        faces.push([idx[i][j], idx[i][j + 1], idx[i - 1][j]]);
        if (j < i - 1)
          faces.push([idx[i][j + 1], idx[i - 1][j + 1], idx[i - 1][j]]);
      }
  }
  return finishShell(verts, faces, R, p,
    p.riserFt > 0.6 ? "Dome on pony wall" : "Geodesic dome",
    (a) => `${v}V, ${fracLabel(a)} sphere${p.riserFt > 0.6 ? ` + ${(p.riserFt).toFixed(1)}′ wall` : ""}`);
}

// ---------- PENTAKIS DOME (Trillium "Do-Deca-Dome") ----------
// Dodecahedron with each pentagon pyramidized to the sphere → 60 identical
// isosceles triangles; truncated at a fraction. Face-up orientation (a
// pentagon star sits at the apex, matching the plans' exploded view).

// Native-frame icosahedral direction sets (golden-ratio coordinates), plus a
// rotation aligning the icosa vertex (0,1,φ) with +z — this puts a dodeca
// pentagon (or bucky pentagon) flat on top, matching the Trillium plans.
const PHI = (1 + Math.sqrt(5)) / 2;

// Cyclic perms of (0,±1,±φ) — icosahedron VERTEX directions in the golden frame
function icoVertexDirs() {
  const d = [];
  for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) {
    d.push([0, s1, s2 * PHI]);
    d.push([s1, s2 * PHI, 0]);
    d.push([s2 * PHI, 0, s1]);
  }
  return d.map(norm);
}

// Odd perms of (0,±1,±φ) — 12 of the 20 icosa FACE-center directions
// (equivalently: cube-based dodecahedron face axes, with the cube corners
// (±1,±1,±1) making up the other 8 icosa face centers)
function oddVertexDirs() {
  const d = [];
  for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) {
    d.push([s1, 0, s2 * PHI]);
    d.push([0, s2 * PHI, s1]);
    d.push([s2 * PHI, s1, 0]);
  }
  return d.map(norm);
}

// rotate unit n0 onto +z
function rotOnto(n0) {
  const a = cross(n0, [0, 0, 1]);
  const s = len(a);
  const c = dot(n0, [0, 0, 1]);
  if (s < 1e-12) return (v) => (c > 0 ? v : [v[0], -v[1], -v[2]]);
  const k = norm(a);
  return (v) => {
    const kv = cross(k, v);
    const kdv = dot(k, v);
    return add(add(scale(v, c), scale(kv, s)), scale(k, kdv * (1 - c)));
  };
}

function ringAround(verts, nvec, k) {
  const ring = verts
    .map((v, i) => ({ i, d: dot(norm(v), nvec) }))
    .sort((a, b) => b.d - a.d)
    .slice(0, k)
    .map((x) => x.i);
  const p0 = verts[ring[0]];
  const e1 = norm(sub(p0, scale(nvec, dot(p0, nvec))));
  const e2 = cross(nvec, e1);
  ring.sort((a, b) => {
    const pa = verts[a], pb = verts[b];
    return Math.atan2(dot(pa, e2), dot(pa, e1)) - Math.atan2(dot(pb, e2), dot(pb, e1));
  });
  return ring;
}

export function buildPentakis(p) {
  const R = p.diameterFt / 2;
  const iphi = 1 / PHI;
  const raw = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1])
    raw.push([sx, sy, sz]);
  for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) {
    raw.push([0, s1 * iphi, s2 * PHI]);
    raw.push([s1 * iphi, s2 * PHI, 0]);
    raw.push([s2 * PHI, 0, s1 * iphi]);
  }
  const dverts = [];
  for (const v of raw)
    if (!dverts.some((w) => dist(v, w) < 1e-9)) dverts.push(v);
  // dodeca faces = pentagon rings around the odd-perm axes (same golden frame)
  const faces = oddVertexDirs().map((nvec) => ringAround(dverts, nvec, 5));
  const rot = rotOnto(norm([1, 0, PHI]));
  const verts = dverts.map((v) => scale(norm(rot(v)), R));
  const tfaces = [];
  for (const f of faces) {
    const c = f.reduce((s, vi) => add(s, verts[vi]), [0, 0, 0]);
    const apex = scale(norm(c), R);
    const ai = verts.length;
    verts.push(apex);
    for (let i = 0; i < 5; i++) tfaces.push([ai, f[i], f[(i + 1) % 5]]);
  }
  return finishShell(verts, tfaces, R, p, "Do-Deca dome",
    (a) => `pentakis dodecahedron, ${fracLabel(a)} cut`);
}

// ---------- BUCKY DOME (truncated icosahedron) ----------
// Pentagon + hexagon panels (soccer ball), pentagon-up, truncated.

export function buildBucky(p) {
  const R = p.diameterFt / 2;
  const raw = [];
  const push = (v) => {
    if (!raw.some((w) => dist(v, w) < 1e-9)) raw.push(v);
  };
  // even permutations of (0, ±1, ±3φ), (±1, ±(2+φ), ±2φ), (±φ, ±2, ±(2φ+1))
  const evenPerms = (a, b, c) => [[a, b, c], [b, c, a], [c, a, b]];
  for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) for (const s3 of [-1, 1]) {
    for (const [x, y, z] of evenPerms(0 * s1, 1 * s2, 3 * PHI * s3)) push([x, y, z]);
    for (const [x, y, z] of evenPerms(1 * s1, (2 + PHI) * s2, 2 * PHI * s3)) push([x, y, z]);
    for (const [x, y, z] of evenPerms(PHI * s1, 2 * s2, (2 * PHI + 1) * s3)) push([x, y, z]);
  }
  const verts0 = raw.map(norm);
  // pentagons around icosa vertex dirs (cyclic perms); hexagons around icosa
  // face centers (cube corners + odd perms) — all in the same golden frame
  const pentDirs = icoVertexDirs();
  const hexDirs = [...oddVertexDirs()];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1])
    hexDirs.push(norm([sx, sy, sz]));
  const faces = [];
  for (const nv of pentDirs) faces.push(ringAround(verts0, nv, 5));
  for (const nv of hexDirs) faces.push(ringAround(verts0, nv, 6));
  const rot = rotOnto(norm([0, 1, PHI]));
  const verts = verts0.map((v) => scale(norm(rot(v)), R));
  return finishShell(verts, faces, R, p, "Bucky dome",
    (a) => `truncated icosahedron, ${fracLabel(a)} cut`);
}

// ---------- ZOME (polar zonohedron) ----------

export function buildZome(p) {
  const n = p.sides;
  const b = Math.max(1, Math.min(p.bands, n - 2));
  const S = (i) => Math.sin((i * Math.PI) / n) / Math.sin(Math.PI / n);
  const rows = b + 1;
  const R = p.diameterFt / 2;
  const H = p.heightFt;
  const theta = Math.atan2(rows * R, H * S(rows));
  const L = R / (Math.sin(theta) * S(rows));

  const verts = [];
  const id = new Map();
  const V = (i, j) => {
    j = ((j % n) + n) % n;
    const k = i + "_" + (i === 0 ? 0 : j);
    if (id.has(k)) return id.get(k);
    const r = L * Math.sin(theta) * S(i);
    const a = (2 * Math.PI * (j + (i - 1) / 2)) / n;
    verts.push([r * Math.cos(a), r * Math.sin(a), -i * L * Math.cos(theta)]);
    id.set(k, verts.length - 1);
    return verts.length - 1;
  };

  const faces = [];
  for (let i = 0; i < b; i++)
    for (let j = 0; j < n; j++)
      faces.push([V(i, j), V(i + 1, j), V(i + 2, j - 1), V(i + 1, j - 1)]);
  for (let j = 0; j < n; j++) faces.push([V(b, j), V(b + 1, j), V(b + 1, j - 1)]);

  const edges = edgesFromFaces(faces);
  const ring = [];
  for (let j = 0; j < n; j++) ring.push(V(b + 1, j));
  const wall = addRiser(verts, ring, p.riserFt || 0);
  ground(verts);

  const tol = R * 1e-4;
  const { struts, strutGroups } = groupStruts(verts, edges, tol);
  const { panels, panelGroups } = groupPanels(verts, faces, tol);
  const dihedrals = computeDihedrals(verts, struts, faces);
  const vertexNormals = attachOrientation(verts, faces, struts);

  const bandInfo = [];
  for (let i = 0; i < b; i++) {
    const f = [V(i, 0), V(i + 1, 0), V(i + 2, n - 1), V(i + 1, n - 1)];
    const dLong = dist(verts[f[0]], verts[f[2]]);
    const dShort = dist(verts[f[1]], verts[f[3]]);
    let apexAngle = 2 * Math.atan2(dShort / 2, dLong / 2) * (180 / Math.PI);
    if (apexAngle > 90) apexAngle = 180 - apexAngle; // report the acute tip
    bandInfo.push({
      band: i + 1, dLong, dShort, apexAngle,
      miter: 90 - apexAngle, // saw setting "off 90°" for the tip corners
      count: n,
    });
  }

  let zmax = 0, widest = 0;
  for (const vv of verts) {
    zmax = Math.max(vv[2], zmax);
    widest = Math.max(widest, Math.hypot(vv[0], vv[1]));
  }
  const baseR = Math.hypot(verts[ring[0]][0], verts[ring[0]][1]);

  return {
    verts, struts, panels, strutGroups, panelGroups, dihedrals, wall, bandInfo,
    vertexNormals, faces,
    stats: {
      type: "Zome",
      detail: `${n}-sided, ${b} band${b > 1 ? "s" : ""} + base halves`,
      strutLength: L,
      tiltDeg: (theta * 180) / Math.PI,
      baseDiameter: 2 * baseR,
      widestDiameter: 2 * widest,
      height: zmax,
      floorArea: 0.5 * n * baseR * baseR * Math.sin((2 * Math.PI) / n),
      surfaceArea: panelGroups.reduce((s, g) => s + g.area * g.count, 0),
      panelCount: panels.length,
      boardCount: faces.reduce((s, f) => s + f.length, 0),
    },
  };
}

// ---------- PYRAMID ----------

export function buildPyramid(p) {
  const n = p.sides;
  const s = p.baseFt;
  const cr = s / (2 * Math.sin(Math.PI / n));
  const verts = [[0, 0, p.heightFt]];
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * k) / n + Math.PI / n;
    verts.push([cr * Math.cos(a), cr * Math.sin(a), 0]);
  }
  const faces = [];
  const edges = [];
  for (let k = 0; k < n; k++) {
    const a = 1 + k,
      b2 = 1 + ((k + 1) % n);
    faces.push([0, a, b2]);
    edges.push([0, a]);
    edges.push([a, b2]);
  }
  const ring = [];
  for (let k = 0; k < n; k++) ring.push(1 + k);
  const wall = addRiser(verts, ring, p.riserFt || 0);
  ground(verts);

  const tol = s * 1e-4;
  const { struts, strutGroups } = groupStruts(verts, edges, tol);
  const { panels, panelGroups } = groupPanels(verts, faces, tol);
  const dihedrals = computeDihedrals(verts, struts, faces);
  const vertexNormals = attachOrientation(verts, faces, struts);

  const apoth = cr * Math.cos(Math.PI / n);
  const slant = Math.hypot(apoth, p.heightFt);
  const hip = Math.hypot(cr, p.heightFt);
  const faceSlope = (Math.atan2(p.heightFt, apoth) * 180) / Math.PI;
  const hipSlope = (Math.atan2(p.heightFt, cr) * 180) / Math.PI;
  let zmax = 0;
  for (const vv of verts) zmax = Math.max(vv[2], zmax);

  return {
    verts, struts, panels, strutGroups, panelGroups, dihedrals, wall,
    vertexNormals, faces,
    pyramid: { slant, hip, faceSlope, hipSlope, baseEdge: s },
    stats: {
      type: "Pyramid",
      detail: `${n}-sided, ${faceSlope.toFixed(1)}° face slope`,
      baseDiameter: 2 * cr,
      widestDiameter: 2 * cr,
      height: zmax,
      floorArea: 0.5 * n * cr * cr * Math.sin((2 * Math.PI) / n),
      surfaceArea: panelGroups.reduce((sm, g) => sm + g.area * g.count, 0),
      panelCount: panels.length,
      boardCount: faces.reduce((s2, f) => s2 + f.length, 0),
    },
  };
}

export function build(params) {
  if (params.type === "zome") return buildZome(params);
  if (params.type === "pyramid") return buildPyramid(params);
  if (params.type === "pentakis") return buildPentakis(params);
  if (params.type === "bucky") return buildBucky(params);
  return buildDome(params);
}

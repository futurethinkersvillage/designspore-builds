// Structure geometry engine — geodesic domes, zomes (polar zonohedra), pyramids.
// All math is z-up, in feet; apex centered on the origin, ground at z=0.
// Output: { verts, struts:[{a,b,group}], panels:[{verts,group}], strutGroups,
//           panelGroups, dihedrals, wall, stats }

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
      g.sig.length === 4 ? "quad" : g.sig.length + "-gon";
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

// Average interior dihedral angle per strut group (edges with 2 faces).
// Bevel each mating panel edge at (180 − dihedral)/2 for tight seams.
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

// Ordered loop of boundary vertices (edges used by exactly one face)
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

// Vertical riser wall dropped from an ordered, planar base loop.
// Wall studs/plates/rectangles are kept OUT of the structural edge/panel lists
// (they'd pollute the strut length groups) and returned separately.
function addRiser(verts, loop, riserH) {
  if (riserH <= 0 || loop.length < 3) return null;
  const zBase = verts[loop[0]][2];
  const bottomIdx = loop.map((vi) => {
    const v = verts[vi];
    verts.push([v[0], v[1], zBase - riserH]);
    return verts.length - 1;
  });
  const panels = [];
  const studEdges = [];
  const plateEdges = [];
  for (let i = 0; i < loop.length; i++) {
    const j = (i + 1) % loop.length;
    studEdges.push([loop[i], bottomIdx[i]]);
    plateEdges.push([bottomIdx[i], bottomIdx[j]]);
    panels.push([loop[i], loop[j], bottomIdx[j], bottomIdx[i]]);
  }
  const segs = loop.map((vi, i) =>
    dist(verts[vi], verts[loop[(i + 1) % loop.length]])
  );
  return { count: loop.length, studH: riserH, segs, panels, bottomIdx, studEdges, plateEdges };
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

// ---------- GEODESIC DOME ----------

function icosahedron() {
  // vertex-at-top orientation, unit circumradius
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
  // p: {diameterFt (sphere), frequency, fraction (0..1), riserFt}
  const R = p.diameterFt / 2;
  const v = p.frequency;
  const ico = icosahedron();

  // Class-I subdivision of each face, projected to the sphere, deduped
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
  let faces = [];
  for (const [ia, ib, ic] of ico.faces) {
    const A = ico.verts[ia],
      B = ico.verts[ib],
      C = ico.verts[ic];
    const idx = [];
    for (let i = 0; i <= v; i++) {
      idx.push([]);
      for (let j = 0; j <= i; j++) {
        // barycentric A·(v−i)/v + B·(i−j)/v + C·j/v
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

  // Truncate: keep faces whose centroid sits above the requested cut plane.
  // (Standard practice — picks whole rows; 3V 5/8 and 3/8 come out right.)
  const cutZ = R * (1 - 2 * p.fraction);
  faces = faces.filter((f) => {
    const cz = (verts[f[0]][2] + verts[f[1]][2] + verts[f[2]][2]) / 3;
    return cz >= cutZ;
  });

  // compact vertex list
  const used = [...new Set(faces.flat())];
  const remap = new Map(used.map((vi, i) => [vi, i]));
  const newVerts = used.map((vi) => [...verts[vi]]);
  faces = faces.map((f) => f.map((vi) => remap.get(vi)));

  // Flatten the base ring onto one plane (the flat-base kit modification —
  // base strut/panel lengths shift slightly and get their own groups).
  const loop = boundaryLoop(faces);
  const zAvg = loop.reduce((s, vi) => s + newVerts[vi][2], 0) / (loop.length || 1);
  for (const vi of loop) newVerts[vi][2] = zAvg;

  const edges = edgesFromFaces(faces);
  const wall = addRiser(newVerts, loop, p.riserFt || 0);
  ground(newVerts);

  const tol = R * 1e-4;
  const { struts, strutGroups } = groupStruts(newVerts, edges, tol);
  const { panels, panelGroups } = groupPanels(newVerts, faces, tol);
  const dihedrals = computeDihedrals(newVerts, struts, faces);

  const deg = new Map();
  for (const e of edges) {
    deg.set(e[0], (deg.get(e[0]) || 0) + 1);
    deg.set(e[1], (deg.get(e[1]) || 0) + 1);
  }

  const baseR = loop.length
    ? Math.hypot(newVerts[loop[0]][0], newVerts[loop[0]][1])
    : R;
  let zmax = 0;
  for (const vv of newVerts) zmax = Math.max(zmax, vv[2]);
  const achieved = (R - zAvg) / (2 * R);

  return {
    verts: newVerts, struts, panels, strutGroups, panelGroups, dihedrals, wall,
    stats: {
      type: p.riserFt > 0 ? "Hybrid dome" : "Geodesic dome",
      detail: `${v}V, ${fracLabel(achieved)} sphere${p.riserFt > 0 ? ` on ${p.riserFt}′ wall` : ""}`,
      sphereDiameter: 2 * R,
      baseDiameter: 2 * baseR,
      height: zmax,
      floorArea: Math.PI * baseR * baseR,
      surfaceArea: panelGroups.reduce((s, g) => s + g.area * g.count, 0),
      hubCount: deg.size,
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

// ---------- ZOME (polar zonohedron) ----------
// n generators tilted θ from vertical, evenly fanned. Every frame strut is the
// same length L; rhombus panels vary per band. Building form = b full rhombus
// bands from the apex, then the next band cut at its side vertices, leaving
// half-rhombus triangles and a flat, planar n-gon base.

export function buildZome(p) {
  // p: {diameterFt (base ring), sides n, bands b, heightFt, riserFt}
  const n = p.sides;
  const b = Math.max(1, Math.min(p.bands, n - 2));
  const S = (i) => Math.sin((i * Math.PI) / n) / Math.sin(Math.PI / n);
  const rows = b + 1; // base ring row index
  const R = p.diameterFt / 2;
  const H = p.heightFt;
  // R = L sinθ S(rows); H = rows · L cosθ  →  tanθ = rows·R / (H·S(rows))
  const theta = Math.atan2(rows * R, H * S(rows));
  const L = R / (Math.sin(theta) * S(rows));

  // v(i,j) = g_j + … + g_{j+i−1}: radius L sinθ S(i), angle 2π(j+(i−1)/2)/n
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
  // band i rhombus: v(i,j) → +g_{j+i} → v(i+1,j); v(i,j) → +g_{j−1} → v(i+1,j−1);
  // both meet at v(i+2,j−1)
  for (let i = 0; i < b; i++)
    for (let j = 0; j < n; j++)
      faces.push([V(i, j), V(i + 1, j), V(i + 2, j - 1), V(i + 1, j - 1)]);
  // cut band b at its side vertices → top-half triangles, base ring = row b+1
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

  // per-band rhombus dimensions
  const bandInfo = [];
  for (let i = 0; i < b; i++) {
    const f = [V(i, 0), V(i + 1, 0), V(i + 2, n - 1), V(i + 1, n - 1)];
    const dLong = dist(verts[f[0]], verts[f[2]]);
    const dShort = dist(verts[f[1]], verts[f[3]]);
    const apexAngle = 2 * Math.atan2(dShort / 2, dLong / 2) * (180 / Math.PI);
    bandInfo.push({ band: i + 1, dLong, dShort, apexAngle, count: n });
  }

  let zmax = 0;
  for (const vv of verts) zmax = Math.max(zmax, vv[2]);
  const baseR = Math.hypot(verts[ring[0]][0], verts[ring[0]][1]);

  return {
    verts, struts, panels, strutGroups, panelGroups, dihedrals, wall, bandInfo,
    stats: {
      type: p.riserFt > 0 ? "Hybrid zome" : "Zome",
      detail: `${n}-sided, ${b} band${b > 1 ? "s" : ""} + base halves`,
      strutLength: L,
      tiltDeg: (theta * 180) / Math.PI,
      baseDiameter: 2 * baseR,
      height: zmax,
      floorArea: 0.5 * n * baseR * baseR * Math.sin((2 * Math.PI) / n),
      surfaceArea: panelGroups.reduce((s, g) => s + g.area * g.count, 0),
      hubCount: verts.length - (wall ? wall.bottomIdx.length : 0),
    },
  };
}

// ---------- PYRAMID ----------

export function buildPyramid(p) {
  // p: {baseFt (edge length), heightFt, sides, riserFt}
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
    edges.push([0, a]); // hip rafter
    edges.push([a, b2]); // base plate
  }
  const ring = [];
  for (let k = 0; k < n; k++) ring.push(1 + k);
  const wall = addRiser(verts, ring, p.riserFt || 0);
  ground(verts);

  const tol = s * 1e-4;
  const { struts, strutGroups } = groupStruts(verts, edges, tol);
  const { panels, panelGroups } = groupPanels(verts, faces, tol);
  const dihedrals = computeDihedrals(verts, struts, faces);

  const apoth = cr * Math.cos(Math.PI / n);
  const slant = Math.hypot(apoth, p.heightFt);
  const hip = Math.hypot(cr, p.heightFt);
  const faceSlope = (Math.atan2(p.heightFt, apoth) * 180) / Math.PI;
  const hipSlope = (Math.atan2(p.heightFt, cr) * 180) / Math.PI;
  let zmax = 0;
  for (const vv of verts) zmax = Math.max(vv[2], zmax);

  return {
    verts, struts, panels, strutGroups, panelGroups, dihedrals, wall,
    pyramid: { slant, hip, faceSlope, hipSlope, baseEdge: s },
    stats: {
      type: "Pyramid",
      detail: `${n}-sided, ${faceSlope.toFixed(1)}° face slope`,
      baseDiameter: 2 * cr,
      height: zmax,
      floorArea: 0.5 * n * cr * cr * Math.sin((2 * Math.PI) / n),
      surfaceArea: panelGroups.reduce((sm, g) => sm + g.area * g.count, 0),
      hubCount: verts.length - (wall ? wall.bottomIdx.length : 0),
    },
  };
}

export function build(params) {
  if (params.type === "zome") return buildZome(params);
  if (params.type === "pyramid") return buildPyramid(params);
  return buildDome(params); // dome + hybrid share the geodesic builder
}

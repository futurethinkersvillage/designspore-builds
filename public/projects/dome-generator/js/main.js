import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { build } from "./geometry.js";

const $ = (id) => document.getElementById(id);
const viewport = $("viewport");
const hoverEl = $("hover");

// ---------- state ----------

const state = {
  type: "dome", // dome | zome | pyramid | hybrid | pentakis | bucky
  units: "ft",
  diameter: 20,
  frequency: 3,
  fraction: 0.625,
  riser: 4,
  sides: 10,
  bands: 5,
  zheight: 20,
  pbase: 32,
  pheight: 20,
  psides: 4,
  stock: 12,
  depthIn: 1.5, // board depth (radial). 1.5 = per Trillium plans; deeper = insulation cavity
  boardWIn: 1.375, // board width in the panel plane (2x6 ripped in half)
  groupColors: false,
  showPanels: true,
  spin: true,
  trillium: null, // active Trillium plan key, or null for freeform
};

const THICK_FT = () => state.depthIn / 12;
const WIDTH_FT = () => state.boardWIn / 12;

function nominalLumber(depthIn) {
  const map = [[1.5, "2×6 ripped in half"], [3.5, "2×4"], [5.5, "2×6"], [7.25, "2×8"], [9.25, "2×10"], [11.25, "2×12"]];
  for (const [d, n] of map) if (Math.abs(depthIn - d) < 0.13) return n;
  return `${depthIn}″-deep (ripped)`;
}

// Generic quick presets (freeform)
const PRESETS = {
  "dome-20": { type: "dome", diameter: 20, frequency: 3, fraction: 0.625, riser: 0 },
  "dome-30": { type: "dome", diameter: 30, frequency: 4, fraction: 0.625, riser: 0 },
  "zome-20": { type: "zome", diameter: 20, sides: 10, bands: 5, zheight: 20 },
  "hyb-34": { type: "hybrid", diameter: 20, frequency: 3, fraction: 0.5, riser: 4 },
  "pyr-32": { type: "pyramid", pbase: 32, pheight: 20, psides: 4 },
};

// ---------- Trillium plans bundle — model registry ----------
// Parameters derived from the purchased plan PDFs. Dome diameters are set so
// generated panel edges match the printed panel schedules (via 3V/4V chord
// factors); zome D/H are solved from the printed strut length + widest
// diameter. Doors/windows are not modeled.
const TRILLIUM = {
  "t-dodeca10": {
    label: "Do-Deca-Dome — 10′ / 3 m",
    params: { type: "pentakis", diameter: 11.03, fraction: 0.6, riser: 0.15 },
    plan: { w: "10′ 1⅞″", h: "8′ 1³⁄₁₆″", note: "35 identical panels, sides 3′6⁷⁄₁₆″ · base 3′11¼″, bevel 11.1°" },
  },
  "t-3v12": {
    label: "12′8″ / 4 m — 5/8 3V on pony wall",
    params: { type: "dome", diameter: 12.93, frequency: 3, fraction: 0.625, riser: 2.2 },
    plan: { w: "12′ 8″", h: "9′ 10¾″", note: "hex 2′8″ / pent 2′3¹⁄₁₆″ · base 2′7⁵⁄₁₆″, bevel 6.5°" },
  },
  "t-3v15": {
    label: "15′ / 4.5 m — 5/8 3V “Bucky Ball”",
    params: { type: "dome", diameter: 15.73, frequency: 3, fraction: 0.625, riser: 0.75 },
    plan: { w: "15′ 4¹³⁄₁₆″", h: "10′ 0″", note: "hex 3′2¹⁵⁄₁₆″ / pent 2′8⅞″ · base 3′2¹⁄₁₆″, bevel 6.5°" },
  },
  "t-3v18": {
    label: "18′ / 5.5 m — 5/8 3V on pony wall",
    params: { type: "dome", diameter: 18.36, frequency: 3, fraction: 0.625, riser: 1.85 },
    plan: { w: "18′ 0″", h: "12′ 9³⁄₁₆″", note: "hex 3′9⁷⁄₁₆″ / pent 3′2⁷⁄₁₆″ · base 3′8½″, bevel 6.5°" },
  },
  "t-3v20": {
    label: "20′ / 6 m — 5/8 3V “Bucky Ball”",
    params: { type: "dome", diameter: 19.9, frequency: 3, fraction: 0.625, riser: 0.2 },
    plan: { w: "19′ 6″", h: "11′ 11½″", note: "hex 4′1¼″ / pent 3′5⅝″ · base 4′0³⁄₁₆″, bevel 6.5°" },
  },
  "t-barn23": {
    label: "Barn Dome — 23′ / 7 m, 3/8 4V",
    params: { type: "dome", diameter: 23.8, frequency: 4, fraction: 0.375, riser: 2.56 },
    plan: { w: "23′ 0⁹⁄₁₆″", h: "11′ 4½″", note: "plan hex 3′8¾″ / pent 2′10⅛″ / tri 3′8³⁄₁₆″, bevel 5.1°; plan uses a 4-length 4V breakdown (generated: standard Class I, dims ≈); 8′ door bay not modeled" },
  },
  "t-4v26": {
    label: "26′ / 8 m — 1/2 4V",
    params: { type: "dome", diameter: 26.0, frequency: 4, fraction: 0.5, riser: 0.12 },
    plan: { w: "26′ 3¹⁄₁₆″", h: "13′ 4⅜″", note: "plan hex 4′1⁵⁄₁₆″ / pent 3′1⅝″ / tri 4′0¹¹⁄₁₆″, bevel 5.1°; plan uses a 4-length 4V breakdown (generated: standard Class I, dims ≈); tapered base sections" },
  },
  "t-4v30": {
    label: "30′ / 9 m — 1/2 4V",
    params: { type: "dome", diameter: 29.4, frequency: 4, fraction: 0.5, riser: 0.14 },
    plan: { w: "29′ 4¾″", h: "14′ 11⅝″", note: "plan hex 4′7³⁄₁₆″ / pent 3′6″ / tri 4′6⁹⁄₁₆″, bevel 5.1°; plan uses a 4-length 4V breakdown (generated: standard Class I, dims ≈); tapered base sections" },
  },
  "t-4v40a": {
    label: "40′ / 12 m — Config One (low + 3′6″ wall)",
    params: { type: "dome", diameter: 38.3, frequency: 4, fraction: 0.375, riser: 3.55, depthIn: 5.5 },
    plan: { w: "38′ 1¼″", h: "18′ 6⅛″", note: "Deep Frame Method — full 2×6 on edge; 60 hex / 25 pent / 23 tri1 / 5 tri2 (4-length 4V; generated dims ≈)" },
  },
  "t-4v40b": {
    label: "40′ / 12 m — Config Two (5/8 + short wall)",
    params: { type: "dome", diameter: 38.3, frequency: 4, fraction: 0.625, riser: 1.0, depthIn: 5.5 },
    plan: { w: "38′ 5³⁄₁₆″", h: "26′ 5¼″", note: "Deep Frame Method — full 2×6 on edge; 114 hex / 30 pent / 34 tri1 / 14 tri2 (4-length 4V; generated dims ≈)" },
  },
  "t-bucky": {
    label: "Beginner Bucky Ball — 12′ / 3.6 m",
    params: { type: "bucky", diameter: 12.27, fraction: 0.62, riser: 0.45 },
    plan: { w: "12′ 0¹⁵⁄₁₆″", h: "10′ 1¹⁄₁₆″", note: "truncated icosahedron; ALL edges 2′5¹¹⁄₁₆″, one 19.8° rip bevel, miters 18° (pent) / 30° (hex)" },
  },
  "t-acorn": {
    label: "Acorn Zome — 10′6″ / 3.2 m",
    params: { type: "zome", diameter: 8.56, sides: 10, bands: 6, zheight: 8.31, riser: 0.6 },
    plan: { w: "10′ 7″", h: "9′ 6″", note: "all struts 2′0¼″; z1–z5 miters 61.5/34.1/9.7/8.6/15°" },
  },
  "t-z16": {
    label: "Zome — 16′ / 5 m",
    params: { type: "zome", diameter: 16.0, sides: 10, bands: 5, zheight: 11.81, riser: 0.46 },
    plan: { w: "16′ 9⅞″", h: "12′ 3⁹⁄₁₆″", note: "all struts 3′3⅛″; miters 61.5/34.1/9.7/8.6/15°" },
  },
  "t-z20": {
    label: "Zome — 20′ / 6 m",
    params: { type: "zome", diameter: 19.65, sides: 10, bands: 5, zheight: 12.51, riser: 0.5 },
    plan: { w: "21′ 1⅜″ o.f.", h: "13′ 3³⁄₁₆″", note: "all struts 3′9¾″; miters 60/31/4.7/15.6/23.8° (printed width is outside the non-beveled frame)" },
  },
  "t-z25": {
    label: "Zome — 25′ / 7.5 m",
    params: { type: "zome", diameter: 24.14, sides: 10, bands: 5, zheight: 15.18, riser: 0.55 },
    plan: { w: "25′ 10″ o.f.", h: "16′ 6″ (w/ deck)", note: "all struts 4′8″; miters 60/31/4.7/15.6/23.8°; non-beveled build" },
  },
  "t-z30": {
    label: "Zome — 30′ / 9 m",
    params: { type: "zome", diameter: 28.58, sides: 10, bands: 5, zheight: 18.05, riser: 0.55 },
    plan: { w: "30′ 6″ o.f.", h: "19′ 10″ (w/ deck)", note: "all struts 5′6⅜″; miters 60/31/4.7/15.6/23.8°; non-beveled build" },
  },
};

let result = null;

// ---------- units / formatting ----------

const FT = 0.3048;
function fmtLen(ft) {
  if (state.units === "m") {
    return ft * FT >= 10 ? (ft * FT).toFixed(2) + " m" : (ft * FT * 1000).toFixed(0) + " mm";
  }
  const neg = ft < 0 ? "-" : "";
  ft = Math.abs(ft);
  let sixteenths = Math.round(ft * 12 * 16);
  let whole = Math.floor(sixteenths / 16);
  let frac = sixteenths % 16;
  const f = Math.floor(whole / 12);
  const i = whole % 12;
  let fs = "";
  if (frac) {
    let n = frac, d = 16;
    while (n % 2 === 0) { n /= 2; d /= 2; }
    fs = ` ${n}/${d}`;
  }
  return `${neg}${f}′ ${i}${fs}″`;
}
function fmtArea(sqft) {
  return state.units === "m"
    ? (sqft * FT * FT).toFixed(1) + " m²"
    : sqft.toFixed(0) + " ft²";
}
function fmtBig(ft) {
  return state.units === "m" ? (ft * FT).toFixed(2) + " m" : ft.toFixed(1) + " ft";
}

// ---------- build params ----------

function buildParams() {
  if (state.type === "zome")
    return {
      type: "zome", diameterFt: state.diameter, sides: state.sides,
      bands: state.bands, heightFt: state.zheight,
      riserFt: state.trillium ? state.riser : 0,
    };
  if (state.type === "pyramid")
    return {
      type: "pyramid", baseFt: state.pbase, heightFt: state.pheight,
      sides: state.psides, riserFt: 0,
    };
  if (state.type === "pentakis" || state.type === "bucky")
    return {
      type: state.type, diameterFt: state.diameter, fraction: state.fraction,
      riserFt: state.riser, flatten: false,
    };
  return {
    type: "dome", diameterFt: state.diameter, frequency: state.frequency,
    fraction: state.fraction,
    riserFt: state.type === "hybrid" || state.trillium ? state.riser : 0,
    flatten: state.trillium ? false : true,
  };
}

// ---------- three.js ----------

let scene, camera, renderer, controls, structGroup;
let strutMeshes = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-2, -2);

const GROUP_COLORS = [
  0xe8a84c, 0x6ec1e4, 0x9ee493, 0xe4787f, 0xc39be4,
  0xe4d76e, 0x7fe4c3, 0xe4a4e0, 0xa4b8e4, 0xd9b18a,
];
const PANEL_COLORS = [
  0x3d5a80, 0x5f7470, 0x6d597a, 0x815b5b, 0x4f6d7a, 0x7a6c5d, 0x596869,
];

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x14171c);
  scene.fog = new THREE.Fog(0x14171c, 120, 320);

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
  camera.up.set(0, 0, 1);

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  viewport.appendChild(renderer.domElement);
  window.__dg = { get scene() { return scene; }, get camera() { return camera; },
    get renderer() { return renderer; }, get controls() { return controls; } };

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = state.spin;
  controls.autoRotateSpeed = 1.0;

  scene.add(new THREE.HemisphereLight(0xdfe4ee, 0x4a3a28, 1.5));
  scene.add(new THREE.AmbientLight(0xfff2e0, 0.45));
  const sun = new THREE.DirectionalLight(0xffe8c0, 2.4);
  sun.position.set(60, 40, 80);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x9db8ff, 0.9);
  fill.position.set(-50, -60, 30);
  scene.add(fill);

  const grid = new THREE.PolarGridHelper(60, 16, 12, 64, 0x2b323d, 0x232830);
  grid.rotation.x = Math.PI / 2;
  scene.add(grid);

  structGroup = new THREE.Group();
  scene.add(structGroup);

  const resize = () => {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  new ResizeObserver(resize).observe(viewport);
  resize();

  renderer.domElement.addEventListener("pointermove", (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    hoverEl.style.left = e.clientX - r.left + 14 + "px";
    hoverEl.style.top = e.clientY - r.top + 8 + "px";
  });
  renderer.domElement.addEventListener("pointerleave", () => {
    pointer.set(-2, -2);
    hoverEl.style.display = "none";
  });

  (function loop() {
    requestAnimationFrame(loop);
    controls.update();
    hover();
    renderer.render(scene, camera);
  })();
}

function hover() {
  if (pointer.x < -1.5) return;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(strutMeshes, false);
  if (hits.length) {
    const u = hits[0].object.userData;
    hoverEl.textContent = u.label;
    hoverEl.style.display = "block";
  } else {
    hoverEl.style.display = "none";
  }
}

// ---------- panelized frame construction ----------
// Per the Trillium builders method: every face is a framed panel of boards
// laid in the face plane. Each board's outer long edge lies on the face edge,
// bevel-ripped on the shared dihedral bisector plane so neighboring panels
// mate flush (seams read as doubled boards). Corners are pinwheel butt-miter
// joints: one end runs to the face corner cut flush along the next edge line,
// the other end butts into the inner face of the previous board.

const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

function faceFrameBoards(verts, f, outMap, W, D) {
  const n = f.length;
  const p0 = V3(verts[f[0]]);
  const nrm = new THREE.Vector3()
    .crossVectors(
      V3(verts[f[1]]).sub(p0.clone()),
      V3(verts[f[2]]).sub(p0.clone())
    )
    .normalize();
  const X = V3(verts[f[1]]).sub(p0.clone()).normalize();
  const Y = new THREE.Vector3().crossVectors(nrm, X);
  const to2 = (vi) => {
    const d = V3(verts[vi]).sub(p0);
    return [d.dot(X), d.dot(Y)];
  };
  let pts = f.map(to2);
  let idx = [...f];
  // ensure CCW
  let area = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    area += a[0] * b[1] - b[0] * a[1];
  }
  let normal = nrm.clone();
  if (area < 0) {
    pts = pts.reverse();
    idx = idx.reverse();
  }
  const lineInt = (P, d, Q, e) => {
    // P + t d = Q + s e
    const det = d[0] * e[1] - d[1] * e[0];
    if (Math.abs(det) < 1e-12) return null;
    const t = ((Q[0] - P[0]) * e[1] - (Q[1] - P[1]) * e[0]) / det;
    return [P[0] + t * d[0], P[1] + t * d[1]];
  };
  const edges = [];
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const d = [b[0] - a[0], b[1] - a[1]];
    const L = Math.hypot(d[0], d[1]);
    const dn = [d[0] / L, d[1] / L];
    const inw = [-dn[1], dn[0]]; // CCW → interior on the left
    edges.push({ a, b, d: dn, inw, L, va: idx[i], vb: idx[(i + 1) % n] });
  }
  const off = (e) => [e.a[0] + e.inw[0] * W, e.a[1] + e.inw[1] * W];
  const boards = [];
  for (let i = 0; i < n; i++) {
    const e = edges[i];
    const ePrev = edges[(i - 1 + n) % n];
    const eNext = edges[(i + 1) % n];
    const tailOut = lineInt(e.a, e.d, off(ePrev), ePrev.d) || e.a;
    const tailIn = lineInt(off(e), e.d, off(ePrev), ePrev.d) || off(e);
    const headOut = e.b;
    const headIn = lineInt(off(e), e.d, eNext.a, eNext.d) || [
      e.b[0] + e.inw[0] * W, e.b[1] + e.inw[1] * W,
    ];
    const to3 = (q) =>
      p0.clone().addScaledVector(X, q[0]).addScaledVector(Y, q[1]);
    // top quad (outer skin face, in the face plane)
    const tTO = to3(tailOut), tTI = to3(tailIn), tHO = to3(headOut), tHI = to3(headIn);
    // outward normal (radial test done upstream; nrm may point either way —
    // use the edge's `out` to detect): boards extend inward from face plane
    const key = e.va < e.vb ? e.va + "_" + e.vb : e.vb + "_" + e.va;
    const out = outMap.get(key) || null;
    let inwardN = normal.clone();
    if (out && inwardN.dot(out) > 0) inwardN.negate(); // inward = away from `out`
    else if (!out && inwardN.z > 0) inwardN.negate();
    const nOut = inwardN.clone().negate();
    const drop = (v) => v.clone().addScaledVector(inwardN, D);
    // beveled drop for the two outer verts: slide down the shared seam plane
    const bevDrop = (v) => {
      if (!out) return drop(v);
      const c = nOut.dot(out);
      if (c < 0.2) return drop(v);
      return v.clone().addScaledVector(out, -D / c);
    };
    const bTO = bevDrop(tTO), bHO = bevDrop(tHO);
    const bTI = drop(tTI), bHI = drop(tHI);
    boards.push({
      length: e.L,
      va: e.va, vb: e.vb,
      tris: [
        [tTO, tHO, tHI], [tTO, tHI, tTI], // top (outer skin side)
        [bTO, bHO, bHI], [bTO, bHI, bTI], // bottom (interior side)
        [tTO, tHO, bHO], [tTO, bHO, bTO], // outer beveled side
        [tTI, tHI, bHI], [tTI, bHI, bTI], // inner side
        [tTO, tTI, bTI], [tTO, bTI, bTO], // tail end (butt miter)
        [tHO, tHI, bHI], [tHO, bHI, bHO], // head end (flush cut)
      ],
    });
  }
  return boards;
}

function woodMaterials(n) {
  const mats = [];
  for (let i = 0; i < n; i++) {
    const c = new THREE.Color(0xc59a66);
    c.offsetHSL(0.004 * (i % 3) - 0.004, 0.03 * ((i * 7) % 3) - 0.03, 0.035 * ((i * 13) % 5) / 4 - 0.017);
    mats.push(new THREE.MeshStandardMaterial({
      color: c, roughness: 0.72, metalness: 0.02,
      side: THREE.DoubleSide, flatShading: true,
    }));
  }
  return mats;
}

function renderStructure() {
  structGroup.clear();
  strutMeshes = [];
  if (!result) return;
  const { verts, struts, panels, panelGroups, wall, vertexNormals } = result;
  const D = THICK_FT(), W = WIDTH_FT();

  // per-edge outward map for the bevel planes
  const outMap = new Map();
  for (const s of struts) {
    const k = s.a < s.b ? s.a + "_" + s.b : s.b + "_" + s.a;
    outMap.set(k, V3(s.out));
  }

  const woods = woodMaterials(7);
  const groupMats = {};
  const gi = new Map(panelGroups.map((g, i) => [g.label, i]));

  panels.forEach((p, pi) => {
    let mat;
    if (state.groupColors) {
      if (!groupMats[p.group])
        groupMats[p.group] = new THREE.MeshStandardMaterial({
          color: GROUP_COLORS[gi.get(p.group) % GROUP_COLORS.length],
          roughness: 0.6, side: THREE.DoubleSide, flatShading: true,
        });
      mat = groupMats[p.group];
    } else {
      mat = woods[pi % woods.length];
    }
    const boards = faceFrameBoards(verts, p.verts, outMap, W, D);
    for (const b of boards) {
      const pos = [];
      for (const t of b.tris)
        for (const v of t) pos.push(v.x, v.y, v.z);
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, mat);
      m.userData = { label: `${p.group} board — ${fmtLen(b.length)}` };
      structGroup.add(m);
      strutMeshes.push(m);
    }
  });

  // base sections / pony wall: studs (tapered heights) + plates
  if (wall) {
    const mat = woods[3];
    const up = new THREE.Vector3(0, 0, 1);
    wall.studEdges.forEach(([a, b], i) => {
      const top = V3(verts[a]), bot = V3(verts[b]);
      const h = top.z - bot.z;
      const outH = new THREE.Vector3(top.x, top.y, 0).normalize();
      const tan = up.clone().cross(outH).normalize();
      const geo = new THREE.BoxGeometry(W, D, h);
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(top).add(bot).multiplyScalar(0.5).addScaledVector(outH, -D / 2);
      m.setRotationFromMatrix(new THREE.Matrix4().makeBasis(tan, outH, up));
      m.userData = { label: `Wall stud — ${fmtLen(h)}` };
      structGroup.add(m);
      strutMeshes.push(m);
    });
    wall.plateEdges.forEach(([a, b]) => {
      const pa = V3(verts[a]), pb = V3(verts[b]);
      const seg = pb.clone().sub(pa);
      const segDir = seg.clone().normalize();
      const mid = pa.clone().add(pb).multiplyScalar(0.5);
      const outH = new THREE.Vector3(mid.x, mid.y, 0).normalize();
      const y = up.clone().cross(segDir).normalize();
      const geo = new THREE.BoxGeometry(seg.length(), D, 1.5 / 12);
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(mid).addScaledVector(outH, -D / 2).addScaledVector(up, 1.5 / 24);
      m.setRotationFromMatrix(new THREE.Matrix4().makeBasis(segDir, y, up));
      m.userData = { label: `Bottom plate — ${fmtLen(seg.length())}` };
      structGroup.add(m);
      strutMeshes.push(m);
    });
  }

  // skin panels
  if (state.showPanels) {
    const nrm = (vi) => V3(vertexNormals[vi]);
    const off = (vi) => V3(verts[vi]).addScaledVector(nrm(vi), 0.02);
    const addFace = (f, color) => {
      const pos = [];
      for (let i = 1; i < f.length - 1; i++)
        for (const vi of [f[0], f[i], f[i + 1]]) {
          const p = off(vi);
          pos.push(p.x, p.y, p.z);
        }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.computeVertexNormals();
      const mesh = new THREE.Mesh(
        g,
        new THREE.MeshStandardMaterial({
          color, transparent: true, opacity: 0.28,
          side: THREE.DoubleSide, roughness: 0.4, metalness: 0.05,
        })
      );
      structGroup.add(mesh);
    };
    const glaze = 0x9fb8c8;
    for (const p of panels)
      addFace(p.verts, state.groupColors
        ? PANEL_COLORS[gi.get(p.group) % PANEL_COLORS.length]
        : glaze);
    if (wall) for (const f of wall.panels) addFace(f, 0x8a7a60);
  }

  const H = result.stats.height;
  const Dd = Math.max(result.stats.widestDiameter || result.stats.baseDiameter, H) * 1.15;
  camera.position.set(Dd * 1.1, -Dd * 1.2, H * 0.9 + Dd * 0.25);
  controls.target.set(0, 0, H * 0.42);
  controls.update();
}

// ---------- BOM ----------

function allBoardLengths() {
  // one board per face edge (panelized: shared edges carry 2 boards)
  const { verts, panels, wall } = result;
  const L = [];
  for (const p of panels) {
    const f = p.verts;
    for (let i = 0; i < f.length; i++) {
      const a = verts[f[i]], b = verts[f[(i + 1) % f.length]];
      L.push(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
    }
  }
  if (wall) {
    for (const h of wall.studHeights) L.push(h);
    for (const s of wall.segs) L.push(s);
  }
  return L;
}

function computeBOM() {
  const { wall, stats } = result;
  const stockFt = state.stock;
  const cutWaste = 1 / 12;
  const pieces = allBoardLengths().map((l) => l + cutWaste).sort((a, b) => b - a);
  const strips = [];
  for (const p of pieces) {
    let placed = false;
    for (let i = 0; i < strips.length; i++)
      if (strips[i] + p <= stockFt) {
        strips[i] += p;
        placed = true;
        break;
      }
    if (!placed) strips.push(Math.min(p, stockFt));
  }
  const tooLong = pieces.filter((p) => p > stockFt).length;
  // each 2x stock board rips into two strips
  const rippedStock = Math.ceil(strips.length / 2);
  const boardCount = pieces.length;
  const panelArea = stats.surfaceArea + (wall ? wall.segs.reduce((s, x, i) => s + x * wall.studHeights[i % wall.studHeights.length], 0) : 0);
  const sheets = Math.ceil((panelArea * 1.15) / 32);
  const screws = Math.ceil((boardCount * 5) / 50) * 50;
  return { boardCount, strips: strips.length, rippedStock, tooLong, panelArea, sheets, screws };
}

function bevelForLength(L) {
  const { strutGroups, dihedrals } = result;
  const g = strutGroups.find((G) => Math.abs(G.length - L) < 0.01);
  if (!g) return "—";
  const d = dihedrals[g.label];
  return d ? ((180 - d) / 2).toFixed(1) + "°" : "0° (base)";
}

function renderBOM() {
  const { panelGroups, wall, stats, bandInfo, pyramid } = result;
  const bom = computeBOM();
  const t = state.trillium ? TRILLIUM[state.trillium] : null;

  $("stats").innerHTML = `
    ${t ? `<div class="row"><span>Trillium plan</span><b>${t.label}</b></div>
           <div class="row"><span>Plan size</span><b>${t.plan.w} × ${t.plan.h}</b></div>` : ""}
    <div class="row"><span>Structure</span><b>${stats.type}</b></div>
    <div class="row"><span>Spec</span><b>${stats.detail}</b></div>
    <div class="row"><span>Widest Ø</span><b>${fmtBig(stats.widestDiameter || stats.baseDiameter)}</b></div>
    <div class="row"><span>Base Ø</span><b>${fmtBig(stats.baseDiameter)}</b></div>
    <div class="row"><span>Height</span><b>${fmtBig(stats.height)}</b></div>
    <div class="row"><span>Floor area</span><b>${fmtArea(stats.floorArea)}</b></div>
    <div class="row"><span>Skin area</span><b>${fmtArea(stats.surfaceArea)}</b></div>
    ${stats.strutLength ? `<div class="row"><span>Strut length (all)</span><b>${fmtLen(stats.strutLength)}</b></div>` : ""}
    ${t ? `<div class="hint" style="margin-top:6px">Plan: ${t.plan.note}</div>` : ""}`;

  // panel schedule — the Trillium-style cut list
  let rows = "";
  for (const g of panelGroups) {
    // dedupe edges by (length, m1, m2) signature
    const seen = new Map();
    for (const e of g.edges) {
      const k = e.length.toFixed(3);
      if (!seen.has(k)) seen.set(k, { ...e, n: 0 });
      seen.get(k).n++;
    }
    const parts = [...seen.values()];
    rows += `<tr class="phead"><td colspan="4"><b>${g.label}</b> — ${g.shape} × ${g.count}
      &nbsp;<span class="dims">corners ${g.corners.map((c) => c.toFixed(1) + "°").join(" / ")}</span></td></tr>`;
    for (const e of parts)
      rows += `<tr><td class="dims">↳</td><td>${e.n * g.count} pcs</td>
        <td>${fmtLen(e.length)}</td>
        <td class="dims">miters ${e.m1.toFixed(1)}°/${e.m2.toFixed(1)}° · rip ${bevelForLength(e.length)}</td></tr>`;
  }
  if (wall) {
    rows += `<tr class="phead"><td colspan="4"><b>Base sections</b> × ${wall.count}${wall.tapered ? " (tapered — they level the wavy ring)" : ""}</td></tr>`;
    const hMin = Math.min(...wall.studHeights), hMax = Math.max(...wall.studHeights);
    rows += `<tr><td class="dims">↳</td><td>${wall.count} studs</td><td>${fmtLen(hMin)}${hMax - hMin > 0.01 ? " – " + fmtLen(hMax) : ""}</td><td class="dims">plumb cut</td></tr>`;
    rows += `<tr><td class="dims">↳</td><td>${wall.segs.length} plates</td><td>${fmtLen(wall.segs[0])}</td><td class="dims">miter ${(360 / wall.count / 2).toFixed(1)}° per end</td></tr>`;
  }
  $("struts").innerHTML = `<table><tbody>${rows}</tbody></table>
    <div class="hint">Panelized build: every face is a framed panel; shared edges carry a board from EACH panel
    (miters are saw settings off 90°; rip = long-edge bevel so mating panels sit flush).</div>`;

  // panels summary
  rows = "";
  for (const g of panelGroups) {
    const dims = g.sig.map((s) => fmtLen(s)).join(" · ");
    rows += `<tr><td>${g.label}</td><td>${g.count}</td><td>${g.shape}</td>
      <td class="dims">${dims}</td><td>${fmtArea(g.area)}</td></tr>`;
  }
  $("panels").innerHTML = `<table><thead><tr><th>Panel</th><th>Qty</th><th>Shape</th><th>Edge lengths</th><th>Area ea.</th></tr></thead><tbody>${rows}</tbody></table>`;

  if (bandInfo) {
    rows = "";
    for (const b of bandInfo)
      rows += `<tr><td>z${b.band}</td><td>${b.count}</td><td>${fmtLen(b.dLong)}</td>
        <td>${fmtLen(b.dShort)}</td><td>${b.apexAngle.toFixed(1)}°</td><td>${b.miter.toFixed(1)}°</td></tr>`;
    $("extra").innerHTML = `<h2>Rhombus bands (top → base)</h2>
      <table><thead><tr><th>Band</th><th>Qty</th><th>Long diag</th><th>Short diag</th><th>Tip angle</th><th>Tip miter</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="hint">Every zome strut is the same length — only panel angles change per band. Tip miter = saw setting off 90°.</div>`;
    $("extra").style.display = "";
  } else if (pyramid) {
    $("extra").innerHTML = `<h2>Pyramid geometry</h2>
      <div class="row"><span>Hip rafter</span><b>${fmtLen(pyramid.hip)}</b></div>
      <div class="row"><span>Face slant height</span><b>${fmtLen(pyramid.slant)}</b></div>
      <div class="row"><span>Face slope</span><b>${pyramid.faceSlope.toFixed(1)}°</b></div>
      <div class="row"><span>Hip slope</span><b>${pyramid.hipSlope.toFixed(1)}°</b></div>`;
    $("extra").style.display = "";
  } else {
    $("extra").style.display = "none";
  }

  $("materials").innerHTML = `
    <div class="row"><span>Panels</span><b>${stats.panelCount ?? "—"}</b></div>
    <div class="row"><span>Frame boards</span><b>${bom.boardCount}</b></div>
    <div class="row"><span>Board stock</span><b>${nominalLumber(state.depthIn)}</b></div>
    <div class="row"><span>2× stock @ ${state.stock}′ (ripped in half)</span><b>${bom.rippedStock}</b></div>
    ${bom.tooLong ? `<div class="row warn"><span>⚠ pieces longer than stock</span><b>${bom.tooLong}</b></div>` : ""}
    <div class="row"><span>Skin area (incl. wall)</span><b>${fmtArea(bom.panelArea)}</b></div>
    <div class="row"><span>4×8 sheets (+15% waste)</span><b>${bom.sheets}</b></div>
    <div class="row"><span>Screws (est.)</span><b>~${bom.screws}</b></div>`;
}

// ---------- exports ----------

function csvEscape(s) {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadText(name, text, mime = "text/plain") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: mime }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportCSV() {
  const { panelGroups, wall, stats } = result;
  const mm = (ft) => (ft * 304.8).toFixed(1);
  const t = state.trillium ? TRILLIUM[state.trillium] : null;
  const L = [];
  L.push(`${stats.type} — ${stats.detail}${t ? " — Trillium plan: " + t.label : ""}`);
  L.push(`Widest,${(stats.widestDiameter || stats.baseDiameter).toFixed(2)} ft,Height,${stats.height.toFixed(2)} ft,Floor,${stats.floorArea.toFixed(0)} sqft`);
  L.push("");
  L.push("PANEL SCHEDULE (panelized build - each face is a framed panel)");
  L.push("Panel,Qty,Shape,Edge,Pieces,Length,Length mm,Miter end1 deg,Miter end2 deg,Rip bevel");
  for (const g of panelGroups) {
    const seen = new Map();
    for (const e of g.edges) {
      const k = e.length.toFixed(3);
      if (!seen.has(k)) seen.set(k, { ...e, n: 0 });
      seen.get(k).n++;
    }
    let ei = 0;
    for (const e of seen.values()) {
      ei++;
      L.push([
        g.label, g.count, g.shape, "e" + ei, e.n * g.count,
        fmtLen(e.length), mm(e.length),
        e.m1.toFixed(1), e.m2.toFixed(1), bevelForLength(e.length),
      ].map(String).map(csvEscape).join(","));
    }
  }
  if (wall) {
    L.push("");
    L.push("BASE SECTIONS");
    const hMin = Math.min(...wall.studHeights), hMax = Math.max(...wall.studHeights);
    L.push(`Studs,${wall.count},height ${fmtLen(hMin)} to ${fmtLen(hMax)}`);
    L.push(`Plates,${wall.segs.length},${fmtLen(wall.segs[0])},miter ${(360 / wall.count / 2).toFixed(1)} deg per end`);
  }
  if (result.bandInfo) {
    L.push("");
    L.push("ZOME RHOMBUS BANDS (top to base)");
    L.push("Band,Qty,Long diag,Short diag,Tip angle deg,Tip miter deg");
    for (const b of result.bandInfo)
      L.push([`z${b.band}`, b.count, fmtLen(b.dLong), fmtLen(b.dShort), b.apexAngle.toFixed(1), b.miter.toFixed(1)].map(String).map(csvEscape).join(","));
  }
  const bom = computeBOM();
  L.push("");
  L.push("MATERIALS");
  L.push(`Board stock,${nominalLumber(state.depthIn)} (${state.depthIn} x ${state.boardWIn} in section)`);
  L.push(`Frame boards,${bom.boardCount}`);
  L.push(`2x stock at ${state.stock} ft (each rips into 2 strips),${bom.rippedStock}`);
  L.push(`4x8 sheets (+15% waste),${bom.sheets}`);
  L.push(`Screws (est),${bom.screws}`);
  downloadText(slug() + "-cutlist.csv", L.join("\n"), "text/csv");
}

function exportOBJ() {
  const { verts, panels, wall } = result;
  const L = ["# " + result.stats.type + " — " + result.stats.detail, "o structure"];
  for (const v of verts) L.push(`v ${v[0].toFixed(5)} ${v[2].toFixed(5)} ${(-v[1]).toFixed(5)}`);
  const face = (f) => L.push("f " + f.map((i) => i + 1).join(" "));
  for (const p of panels) face(p.verts);
  if (wall) for (const f of wall.panels) face(f);
  downloadText(slug() + ".obj", L.join("\n"), "model/obj");
}

function slug() {
  return (result.stats.type + "-" + Math.round(result.stats.baseDiameter) + "ft")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ---------- UI wiring ----------

function rebuild() {
  result = build(buildParams());
  renderStructure();
  renderBOM();
  syncLabels();
}

function syncLabels() {
  $("v_depth").textContent = `${state.depthIn}″`;
  $("v_diameter").textContent = fmtBig(state.diameter);
  $("v_frequency").textContent = state.frequency + "V";
  $("v_riser").textContent = fmtBig(state.riser);
  $("v_sides").textContent = state.sides;
  $("v_bands").textContent = state.bands;
  $("v_zheight").textContent = fmtBig(state.zheight);
  $("v_pbase").textContent = fmtBig(state.pbase);
  $("v_pheight").textContent = fmtBig(state.pheight);
  $("v_psides").textContent = state.psides;
  const bmax = state.sides - 2;
  const el = $("c_bands");
  el.max = bmax;
  if (state.bands > bmax) state.bands = bmax;
}

function showControls() {
  const t = state.type;
  document.querySelectorAll("[data-for]").forEach((el) => {
    el.style.display = el.dataset.for.split(" ").includes(t) ? "" : "none";
  });
  document.querySelectorAll(".modes button").forEach((b) =>
    b.classList.toggle("on", b.dataset.type === t)
  );
}

function clearTrillium() {
  state.trillium = null;
  $("c_trillium").value = "";
}

function bindRange(id, key) {
  $(id).addEventListener("input", (e) => {
    state[key] = parseFloat(e.target.value);
    clearTrillium();
    rebuild();
  });
}

function initUI() {
  document.querySelectorAll(".modes button").forEach((b) =>
    b.addEventListener("click", () => {
      state.type = b.dataset.type;
      clearTrillium();
      showControls();
      rebuild();
    })
  );

  // Trillium plan models
  const sel = $("c_trillium");
  for (const [key, m] of Object.entries(TRILLIUM)) {
    const o = document.createElement("option");
    o.value = key;
    o.textContent = m.label;
    (m.params.type === "zome" ? $("og_tzomes") : $("og_tdomes")).appendChild(o);
  }
  sel.addEventListener("change", (e) => {
    const m = TRILLIUM[e.target.value];
    if (!m) return;
    state.trillium = e.target.value;
    state.depthIn = 1.5; // most plans use 2x6 ripped in half…
    Object.assign(state, m.params); // …unless the plan specifies (40′ deep frame)
    showControls();
    pushStateToInputs();
    rebuild();
  });

  $("c_preset").addEventListener("change", (e) => {
    const p = PRESETS[e.target.value];
    if (!p) return;
    clearTrillium();
    Object.assign(state, p);
    showControls();
    pushStateToInputs();
    rebuild();
  });

  bindRange("c_diameter", "diameter");
  bindRange("c_frequency", "frequency");
  bindRange("c_riser", "riser");
  bindRange("c_sides", "sides");
  bindRange("c_bands", "bands");
  bindRange("c_zheight", "zheight");
  bindRange("c_pbase", "pbase");
  bindRange("c_pheight", "pheight");
  bindRange("c_psides", "psides");

  $("c_fraction").addEventListener("change", (e) => {
    state.fraction = parseFloat(e.target.value);
    clearTrillium();
    rebuild();
  });
  $("c_stock").addEventListener("change", (e) => {
    state.stock = parseFloat(e.target.value);
    renderBOM();
  });
  $("c_depth").addEventListener("input", (e) => {
    state.depthIn = parseFloat(e.target.value);
    renderStructure();
    renderBOM();
    syncLabels();
  });
  $("c_units").addEventListener("change", (e) => {
    state.units = e.target.value;
    renderBOM();
    syncLabels();
  });
  $("c_panels").addEventListener("change", (e) => {
    state.showPanels = e.target.checked;
    renderStructure();
  });
  $("c_colors").addEventListener("change", (e) => {
    state.groupColors = e.target.checked;
    renderStructure();
  });
  $("c_spin").addEventListener("change", (e) => {
    state.spin = e.target.checked;
    controls.autoRotate = state.spin;
  });

  $("b_csv").addEventListener("click", exportCSV);
  $("b_obj").addEventListener("click", exportOBJ);
  $("b_print").addEventListener("click", () => window.print());

  pushStateToInputs();
  showControls();
}

function pushStateToInputs() {
  $("c_depth").value = state.depthIn;
  $("c_diameter").value = state.diameter;
  $("c_frequency").value = state.frequency;
  $("c_fraction").value = String(state.fraction);
  $("c_riser").value = state.riser;
  $("c_sides").value = state.sides;
  $("c_bands").value = state.bands;
  $("c_zheight").value = state.zheight;
  $("c_pbase").value = state.pbase;
  $("c_pheight").value = state.pheight;
  $("c_psides").value = state.psides;
}

// debug/probe access
window.__dgState = state;
window.__dgRebuild = rebuild;
window.__dgResult = () => result;

initThree();
initUI();
rebuild();

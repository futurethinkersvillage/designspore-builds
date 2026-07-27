import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { build } from "./geometry.js";

const $ = (id) => document.getElementById(id);
const viewport = $("viewport");
const hoverEl = $("hover");

// ---------- state ----------

const state = {
  type: "dome", // dome | zome | pyramid | hybrid
  units: "ft", // ft | m
  // dome / hybrid
  diameter: 20, // ft — sphere Ø for domes, base ring Ø for zomes
  frequency: 3,
  fraction: 0.625,
  riser: 4, // hybrid wall height ft
  // zome
  sides: 10,
  bands: 5,
  zheight: 20,
  // pyramid
  pbase: 32,
  pheight: 20,
  psides: 4,
  // materials
  stock: 12, // lumber stock length ft
  depthIn: 3.5, // strut depth in inches (insulation cavity) — boards on edge
  groupColors: false,
  showPanels: true,
  spin: true,
};

const THICK_FT = 1.5 / 12; // 2x stock thickness

function nominalLumber(depthIn) {
  const map = [[3.5, "2×4"], [5.5, "2×6"], [7.25, "2×8"], [9.25, "2×10"], [11.25, "2×12"]];
  for (const [d, n] of map) if (Math.abs(depthIn - d) < 0.13) return n;
  return `1½″×${depthIn}″ (ripped)`;
}

// Trillium-inspired preset lineup
const PRESETS = {
  "dome-10": { type: "dome", diameter: 10, frequency: 2, fraction: 0.5, riser: 0 },
  "dome-15": { type: "dome", diameter: 15, frequency: 3, fraction: 0.625, riser: 0 },
  "dome-20": { type: "dome", diameter: 20, frequency: 3, fraction: 0.625, riser: 0 },
  "dome-26": { type: "dome", diameter: 26, frequency: 4, fraction: 0.5, riser: 0 },
  "dome-30": { type: "dome", diameter: 30, frequency: 4, fraction: 0.625, riser: 0 },
  "dome-40": { type: "dome", diameter: 40, frequency: 5, fraction: 0.5, riser: 0 },
  "zome-acorn": { type: "zome", diameter: 10.5, sides: 8, bands: 4, zheight: 12 },
  "zome-16": { type: "zome", diameter: 16, sides: 10, bands: 5, zheight: 16 },
  "zome-20": { type: "zome", diameter: 20, sides: 10, bands: 5, zheight: 20 },
  "zome-25": { type: "zome", diameter: 25, sides: 12, bands: 6, zheight: 24 },
  "zome-30": { type: "zome", diameter: 30, sides: 12, bands: 6, zheight: 28 },
  "zome-trellis": { type: "zome", diameter: 12, sides: 9, bands: 4, zheight: 13 },
  "hyb-simple": { type: "hybrid", diameter: 20, frequency: 3, fraction: 0.375, riser: 6 },
  "hyb-34": { type: "hybrid", diameter: 20, frequency: 3, fraction: 0.5, riser: 4 },
  "hyb-full": { type: "hybrid", diameter: 20, frequency: 3, fraction: 0.625, riser: 3 },
  "pyr-32": { type: "pyramid", pbase: 32, pheight: 20, psides: 4 },
};

let result = null; // last geometry build

// ---------- units / formatting ----------

const FT = 0.3048;
function fmtLen(ft) {
  if (state.units === "m") {
    return ft * FT >= 10 ? (ft * FT).toFixed(2) + " m" : (ft * FT * 1000).toFixed(0) + " mm";
  }
  const neg = ft < 0 ? "-" : "";
  ft = Math.abs(ft);
  let inchesTotal = ft * 12;
  let sixteenths = Math.round(inchesTotal * 16);
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
      bands: state.bands, heightFt: state.zheight, riserFt: 0,
    };
  if (state.type === "pyramid")
    return {
      type: "pyramid", baseFt: state.pbase, heightFt: state.pheight,
      sides: state.psides, riserFt: 0,
    };
  return {
    type: "dome", diameterFt: state.diameter, frequency: state.frequency,
    fraction: state.fraction, riserFt: state.type === "hybrid" ? state.riser : 0,
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
  grid.rotation.x = Math.PI / 2; // z-up
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
    hoverEl.textContent = `${u.group} — ${fmtLen(u.length)}`;
    hoverEl.style.display = "block";
  } else {
    hoverEl.style.display = "none";
  }
}

function groupColor(label) {
  const i = label.charCodeAt(0) - 65;
  return GROUP_COLORS[i % GROUP_COLORS.length];
}

// ---------- lumber solid construction ----------
// Boards run on edge (thickness in the shell surface, depth pointing inward),
// outer face flush with the panel plane (the bevel-rip orientation, s.out).
// Ends are cut on the bisector planes between angular neighbors at each hub,
// so all boards converge point-to-point in a hubless "starburst" joint —
// matching Trillium-style screw-together framing.

const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

function buildFans(verts, struts) {
  const fans = new Map(); // vi -> [{dir:Vector3 (away), si}]
  struts.forEach((s, si) => {
    const a = V3(verts[s.a]), b = V3(verts[s.b]);
    const d = b.clone().sub(a).normalize();
    if (!fans.has(s.a)) fans.set(s.a, []);
    if (!fans.has(s.b)) fans.set(s.b, []);
    fans.get(s.a).push({ dir: d.clone(), si });
    fans.get(s.b).push({ dir: d.clone().negate(), si });
  });
  return fans;
}

// bisector-plane normals for strut si's end at vertex vi, oriented toward it
function endPlanes(fan, si, nV) {
  if (fan.length < 2) return [];
  const e1 = new THREE.Vector3(1, 0, 0);
  if (Math.abs(e1.dot(nV)) > 0.9) e1.set(0, 1, 0);
  e1.addScaledVector(nV, -e1.dot(nV)).normalize();
  const e2 = nV.clone().cross(e1);
  const items = fan.map((f) => {
    const t = f.dir.clone().addScaledVector(nV, -f.dir.dot(nV));
    if (t.lengthSq() < 1e-12) t.copy(e1); // degenerate: strut along hub axis
    t.normalize();
    return { si: f.si, t, ang: Math.atan2(t.dot(e2), t.dot(e1)) };
  });
  items.sort((x, y) => x.ang - y.ang);
  const k = items.findIndex((it) => it.si === si);
  const me = items[k];
  const planes = [];
  for (const nb of [items[(k + 1) % items.length], items[(k - 1 + items.length) % items.length]]) {
    if (nb === me) continue;
    let b = me.t.clone().add(nb.t);
    if (b.lengthSq() < 1e-6) b = nV.clone().cross(me.t); // opposite neighbor → square cut
    b.normalize();
    const m = nV.clone().cross(b);
    if (m.dot(me.t) < 0) m.negate();
    planes.push(m);
  }
  return planes;
}

function strutSolid(A, B, out, planesA, planesB, t, d) {
  const u = B.clone().sub(A);
  const L = u.length();
  u.normalize();
  const w = u.clone().cross(out).normalize();
  // Ends are truncated short of the vertex (real kits lop the sharp point off,
  // leaving a small polygonal opening at each hub) — side faces still mate on
  // the neighbor bisector planes.
  const tc = Math.min(1.4 * t, 0.2 * L);
  const offs = [
    w.clone().multiplyScalar(t / 2),                            // TL (outer)
    w.clone().multiplyScalar(-t / 2),                           // TR (outer)
    w.clone().multiplyScalar(t / 2).addScaledVector(out, -d),   // BL (inner)
    w.clone().multiplyScalar(-t / 2).addScaledVector(out, -d),  // BR (inner)
  ];
  const endT = (planes, ua) =>
    offs.map((o) => {
      let t0 = tc;
      for (const m of planes) {
        const den = m.dot(ua);
        if (Math.abs(den) < 1e-6) continue;
        t0 = Math.max(t0, -m.dot(o) / den);
      }
      return Math.min(t0, 0.45 * L);
    });
  const tA = endT(planesA, u);
  const tB = endT(planesB, u.clone().negate());
  // blunt nose ridge on the strut centerline at the truncation plane
  const noseA_o = A.clone().addScaledVector(u, tc);
  const noseA_i = noseA_o.clone().addScaledVector(out, -d);
  const noseB_o = B.clone().addScaledVector(u, -tc);
  const noseB_i = noseB_o.clone().addScaledVector(out, -d);
  const pA = offs.map((o, i) => A.clone().add(o).addScaledVector(u, tA[i]));
  const pB = offs.map((o, i) => B.clone().add(o).addScaledVector(u, -tB[i]));

  const pos = [];
  const tri = (a, b, c) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  const quad = (a, b, c, dd) => { tri(a, b, c); tri(a, c, dd); };
  quad(pA[0], pB[0], pB[1], pA[1]); // outer face
  quad(pA[2], pB[2], pB[3], pA[3]); // inner face
  quad(pA[0], pB[0], pB[2], pA[2]); // left side
  quad(pA[1], pB[1], pB[3], pA[3]); // right side
  // end caps: bisector-mitred cheeks + blunt nose face
  quad(pA[0], noseA_o, noseA_i, pA[2]);
  quad(pA[1], noseA_o, noseA_i, pA[3]);
  quad(pB[0], noseB_o, noseB_i, pB[2]);
  quad(pB[1], noseB_o, noseB_i, pB[3]);

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
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
  const thk = THICK_FT, dep = state.depthIn / 12;

  const fans = buildFans(verts, struts);
  const nrm = (vi) => V3(vertexNormals[vi]);
  const woods = woodMaterials(7);
  const groupMats = {};

  struts.forEach((s, si) => {
    const A = V3(verts[s.a]), B = V3(verts[s.b]);
    const out = V3(s.out);
    const geo = strutSolid(
      A, B, out,
      endPlanes(fans.get(s.a), si, nrm(s.a)),
      endPlanes(fans.get(s.b), si, nrm(s.b)),
      thk, dep
    );
    let mat;
    if (state.groupColors) {
      if (!groupMats[s.group])
        groupMats[s.group] = new THREE.MeshStandardMaterial({
          color: groupColor(s.group), roughness: 0.6,
          side: THREE.DoubleSide, flatShading: true,
        });
      mat = groupMats[s.group];
    } else {
      mat = woods[(s.a * 31 + s.b * 17) % woods.length];
    }
    const m = new THREE.Mesh(geo, mat);
    m.userData = { group: s.group, length: A.distanceTo(B) };
    structGroup.add(m);
    strutMeshes.push(m);
  });

  // riser wall: studs + bottom plate as plain lumber boxes
  if (wall) {
    const mat = state.groupColors
      ? new THREE.MeshStandardMaterial({ color: 0xa89880, roughness: 0.6, flatShading: true })
      : woods[3];
    const up = new THREE.Vector3(0, 0, 1);
    for (const [a, b] of wall.studEdges) {
      const top = V3(verts[a]), bot = V3(verts[b]);
      const outH = new THREE.Vector3(top.x, top.y, 0).normalize();
      const tan = up.clone().cross(outH).normalize();
      const geo = new THREE.BoxGeometry(thk, dep, wall.studH);
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(top).add(bot).multiplyScalar(0.5).addScaledVector(outH, -dep / 2);
      m.setRotationFromMatrix(new THREE.Matrix4().makeBasis(tan, outH, up));
      m.userData = { group: "Stud", length: wall.studH };
      structGroup.add(m);
      strutMeshes.push(m);
    }
    wall.plateEdges.forEach(([a, b], i) => {
      const pa = V3(verts[a]), pb = V3(verts[b]);
      const seg = pb.clone().sub(pa);
      const segDir = seg.clone().normalize();
      const mid = pa.clone().add(pb).multiplyScalar(0.5);
      const outH = new THREE.Vector3(mid.x, mid.y, 0).normalize();
      const y = up.clone().cross(segDir).normalize(); // horizontal, ⊥ segment
      const geo = new THREE.BoxGeometry(seg.length(), dep, thk);
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(mid).addScaledVector(outH, -dep / 2).addScaledVector(up, thk / 2);
      m.setRotationFromMatrix(new THREE.Matrix4().makeBasis(segDir, y, up));
      m.userData = { group: "Plate", length: seg.length() };
      structGroup.add(m);
      strutMeshes.push(m);
    });
  }

  // panels — pushed slightly outward so they sit on the frame, no z-fighting
  if (state.showPanels) {
    const gi = new Map(panelGroups.map((g, i) => [g.label, i]));
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

  // frame camera
  const H = result.stats.height;
  const D = Math.max(result.stats.baseDiameter, H) * 1.15;
  camera.position.set(D * 1.1, -D * 1.2, H * 0.9 + D * 0.25);
  controls.target.set(0, 0, H * 0.42);
}

// ---------- BOM ----------

function computeBOM() {
  const { strutGroups, panelGroups, dihedrals, wall, stats } = result;

  // lumber packing: first-fit-decreasing into stock boards, 1″ per cut waste
  const stockFt = state.stock;
  const cutWaste = 1 / 12;
  const pieces = [];
  for (const g of strutGroups)
    for (let i = 0; i < g.count; i++) pieces.push(g.length + cutWaste);
  if (wall) {
    for (let i = 0; i < wall.count; i++) pieces.push(wall.studH + cutWaste);
    for (const s of wall.segs) pieces.push(s + cutWaste);
  }
  pieces.sort((a, b) => b - a);
  const boards = [];
  for (const p of pieces) {
    let placed = false;
    for (const b of boards)
      if (b + p <= stockFt) {
        boards[boards.indexOf(b)] = b + p;
        placed = true;
        break;
      }
    if (!placed) {
      if (p > stockFt) boards.push(stockFt); // strut longer than stock: 1 board each (flag below)
      else boards.push(p);
    }
  }
  const tooLong = pieces.filter((p) => p > stockFt).length;

  const strutCount = strutGroups.reduce((s, g) => s + g.count, 0) + (wall ? wall.count * 2 : 0);
  const panelArea = stats.surfaceArea + (wall ? wall.segs.reduce((s, x) => s + x, 0) * wall.studH : 0);
  const sheets = Math.ceil((panelArea * 1.15) / 32);
  const screws = Math.ceil((strutCount * 6) / 50) * 50;

  return { boards: boards.length, tooLong, strutCount, panelArea, sheets, screws };
}

function bevelOf(group) {
  const d = result.dihedrals[group.label];
  return d ? ((180 - d) / 2).toFixed(1) + "°" : "—";
}

function renderBOM() {
  const { strutGroups, panelGroups, wall, stats, bandInfo, pyramid } = result;
  const bom = computeBOM();

  // stats card
  $("stats").innerHTML = `
    <div class="row"><span>Structure</span><b>${stats.type}</b></div>
    <div class="row"><span>Spec</span><b>${stats.detail}</b></div>
    <div class="row"><span>Footprint Ø</span><b>${fmtBig(stats.baseDiameter)}</b></div>
    <div class="row"><span>Height</span><b>${fmtBig(stats.height)}</b></div>
    <div class="row"><span>Floor area</span><b>${fmtArea(stats.floorArea)}</b></div>
    <div class="row"><span>Skin area</span><b>${fmtArea(stats.surfaceArea)}</b></div>
    ${stats.strutLength ? `<div class="row"><span>Strut length (all)</span><b>${fmtLen(stats.strutLength)}</b></div>` : ""}
    ${stats.hubCount ? `<div class="row"><span>Joints/hubs</span><b>${stats.hubCount}</b></div>` : ""}`;

  // struts table
  let rows = "";
  for (const g of strutGroups)
    rows += `<tr><td><span class="dot" style="background:#${groupColor(g.label).toString(16).padStart(6, "0")}"></span>${g.label}</td>
      <td>${g.count}</td><td>${fmtLen(g.length)}</td><td>${bevelOf(g)}</td></tr>`;
  if (wall)
    rows += `<tr><td>Stud</td><td>${wall.count}</td><td>${fmtLen(wall.studH)}</td><td>—</td></tr>
      <tr><td>Plate</td><td>${wall.segs.length}</td><td>${fmtLen(wall.segs[0])}</td><td>—</td></tr>`;
  $("struts").innerHTML = `<table><thead><tr><th>Strut</th><th>Qty</th><th>Length</th><th>Edge bevel</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="hint">Bevel = angle to plane each mating panel edge for tight seams (screw-together, no hubs).</div>`;

  // panels table
  rows = "";
  for (const g of panelGroups) {
    const dims = g.sig.map((s) => fmtLen(s)).join(" · ");
    rows += `<tr><td>${g.label}</td><td>${g.count}</td><td>${g.shape}</td>
      <td class="dims">${dims}</td><td>${fmtArea(g.area)}</td></tr>`;
  }
  if (wall)
    rows += `<tr><td>Wall</td><td>${wall.count}</td><td>rect</td>
      <td class="dims">${fmtLen(wall.segs[0])} × ${fmtLen(wall.studH)}</td>
      <td>${fmtArea(wall.segs[0] * wall.studH)}</td></tr>`;
  $("panels").innerHTML = `<table><thead><tr><th>Panel</th><th>Qty</th><th>Shape</th><th>Edge lengths</th><th>Area ea.</th></tr></thead><tbody>${rows}</tbody></table>`;

  // zome band detail
  if (bandInfo) {
    rows = "";
    for (const b of bandInfo)
      rows += `<tr><td>${b.band}</td><td>${b.count}</td><td>${fmtLen(b.dLong)}</td>
        <td>${fmtLen(b.dShort)}</td><td>${b.apexAngle.toFixed(1)}°</td></tr>`;
    $("extra").innerHTML = `<h2>Rhombus bands (top → base)</h2>
      <table><thead><tr><th>Band</th><th>Qty</th><th>Long diag</th><th>Short diag</th><th>Tip angle</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="hint">Every frame strut in a zome is the same length — only the panel angles change per band.</div>`;
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

  // materials card
  $("materials").innerHTML = `
    <div class="row"><span>Frame pieces</span><b>${bom.strutCount}</b></div>
    <div class="row"><span>Frame lumber</span><b>${nominalLumber(state.depthIn)} on edge</b></div>
    <div class="row"><span>Boards needed (${state.stock}′)</span><b>${bom.boards}</b></div>
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
  const { strutGroups, panelGroups, wall, stats } = result;
  const mm = (ft) => (ft * 304.8).toFixed(1);
  const L = [];
  L.push(`${stats.type} — ${stats.detail}`);
  L.push(`Footprint,${stats.baseDiameter.toFixed(2)} ft,Height,${stats.height.toFixed(2)} ft,Floor,${stats.floorArea.toFixed(0)} sqft`);
  L.push("");
  L.push("CUT LIST — FRAME");
  L.push("Group,Qty,Length,Length (mm),Edge bevel");
  for (const g of strutGroups)
    L.push([g.label, g.count, fmtLen(g.length), mm(g.length), bevelOf(g)].map(String).map(csvEscape).join(","));
  if (wall) {
    L.push(["Stud", wall.count, fmtLen(wall.studH), mm(wall.studH), ""].map(String).map(csvEscape).join(","));
    L.push(["Plate", wall.segs.length, fmtLen(wall.segs[0]), mm(wall.segs[0]), ""].map(String).map(csvEscape).join(","));
  }
  L.push("");
  L.push("PANELS");
  L.push("Group,Qty,Shape,Edge lengths,Edges (mm),Area sqft");
  for (const g of panelGroups)
    L.push([
      g.label, g.count, g.shape,
      g.sig.map((s) => fmtLen(s)).join(" | "),
      g.sig.map((s) => mm(s)).join(" | "),
      g.area.toFixed(2),
    ].map(String).map(csvEscape).join(","));
  if (result.bandInfo) {
    L.push("");
    L.push("ZOME RHOMBUS BANDS (top to base)");
    L.push("Band,Qty,Long diag,Short diag,Tip angle deg");
    for (const b of result.bandInfo)
      L.push([b.band, b.count, fmtLen(b.dLong), fmtLen(b.dShort), b.apexAngle.toFixed(1)].map(String).map(csvEscape).join(","));
  }
  const bom = computeBOM();
  L.push("");
  L.push("MATERIALS");
  L.push(`Frame lumber,${nominalLumber(state.depthIn)} on edge (1.5 x ${state.depthIn} in)`);
  L.push(`Frame pieces,${bom.strutCount}`);
  L.push(`Boards at ${state.stock} ft,${bom.boards}`);
  L.push(`4x8 sheets (+15% waste),${bom.sheets}`);
  L.push(`Screws (est),${bom.screws}`);
  downloadText(slug() + "-cutlist.csv", L.join("\n"), "text/csv");
}

function exportOBJ() {
  const { verts, panels, wall } = result;
  const L = ["# " + result.stats.type + " — " + result.stats.detail, "o structure"];
  // y-up for viewers
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
  $("v_depth").textContent = `${state.depthIn}″ · ${nominalLumber(state.depthIn)}`;
  $("v_diameter").textContent = fmtBig(state.diameter);
  $("v_frequency").textContent = state.frequency + "V";
  $("v_riser").textContent = fmtBig(state.riser);
  $("v_sides").textContent = state.sides;
  $("v_bands").textContent = state.bands;
  $("v_zheight").textContent = fmtBig(state.zheight);
  $("v_pbase").textContent = fmtBig(state.pbase);
  $("v_pheight").textContent = fmtBig(state.pheight);
  $("v_psides").textContent = state.psides;
  // bands slider max depends on sides
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

function bindRange(id, key, post) {
  $(id).addEventListener("input", (e) => {
    state[key] = parseFloat(e.target.value);
    if (post) post();
    rebuild();
  });
}

function initUI() {
  // type buttons
  document.querySelectorAll(".modes button").forEach((b) =>
    b.addEventListener("click", () => {
      state.type = b.dataset.type;
      showControls();
      rebuild();
    })
  );

  // presets
  $("c_preset").addEventListener("change", (e) => {
    const p = PRESETS[e.target.value];
    if (!p) return;
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
  $("c_colors").addEventListener("change", (e) => {
    state.groupColors = e.target.checked;
    renderStructure();
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

initThree();
initUI();
rebuild();

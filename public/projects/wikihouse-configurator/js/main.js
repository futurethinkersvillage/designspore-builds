// Scene + render loop + piece meshes. Massing style: clean colour-coded blocks.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { loadSystem, loadDetailed } from "./blocks.js";
import { DEFAULT_SYSTEM } from "./systems.js";
import { initUI, onConfigChange, refresh, config } from "./ui.js";
import { roofingById, claddingById } from "./materials.js";
import { artCanvas } from "./interior.js";
import { buildFurniture } from "./furniture-models.js";

// CSS-string colours (THREE.Color accepts them)
const PALETTE = {
  floor: "#a87f4c",
  wall: "#dccaa9",
  endwall: "#cbbd93",
  corner: "#8f6f42",
  roof: "#5c6b7a",
  glass: "#7ec8f7",
  skyglass: "#8fd4ff",
  skycurb: "#33383f",
  door: "#c98a3b",
  stair: "#7a6a52",
  ground: "#2a3038",
};

let scene, camera, renderer, controls, buildingGroup;
let autoRotate = false;
let explodeAmount = 0;
const viewport = document.getElementById("viewport");
const hud = document.getElementById("hud");

init();

async function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#171b21");
  scene.fog = new THREE.Fog("#171b21", 60, 120);

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);
  camera.position.set(11, 8, 13);

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  viewport.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.6, 0);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2 - 0.02;
  controls.zoomToCursor = true; // wheel zooms toward the cursor, like Fusion 360
  setupFusionControls();

  // lights
  const sun = new THREE.DirectionalLight("#fff4e0", 2.6);
  sun.position.set(18, 24, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const d = 16;
  sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
  sun.shadow.camera.top = d; sun.shadow.camera.bottom = -d;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight("#bcd4ee", "#3a3226", 0.9));

  // ground
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(60, 64),
    new THREE.MeshStandardMaterial({ color: PALETTE.ground, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(60, 100, "#3a4250", "#242b35");
  grid.position.y = 0.002;
  scene.add(grid);

  buildingGroup = new THREE.Group();
  scene.add(buildingGroup);
  window.__dbg = {
    scene, controls,
    get group() { return buildingGroup; },
    get last() { return lastResult; },
    render: () => { controls.update(); renderer.render(scene, camera); },
    setView: (x, y, z, tx = 0, ty = 1.6, tz = 0) => {
      camera.position.set(x, y, z);
      controls.target.set(tx, ty, tz);
      controls.update();
      renderer.render(scene, camera);
    },
  };

  window.addEventListener("resize", onResize);
  new ResizeObserver(onResize).observe(viewport);
  onResize();

  await loadSystem(DEFAULT_SYSTEM);
  await initUI();
  onConfigChange(rebuild);
  hookViewControls();
  refresh();
  animate();
}

// Fusion 360 navigation: middle-drag = PAN, Shift+middle-drag = ORBIT, wheel = ZOOM.
// Left/right buttons don't move the camera (matching Fusion). We swap the middle
// button's action on Shift, and also enable left-drag orbit as a laptop-friendly
// convenience (Fusion-faithful for the middle button, forgiving for trackpads).
function setupFusionControls() {
  const apply = (shift) => {
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,               // convenience (Fusion uses MMB; left still orbits)
      MIDDLE: shift ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.PAN,
    };
  };
  apply(false);
  window.addEventListener("keydown", (e) => { if (e.key === "Shift") apply(true); });
  window.addEventListener("keyup", (e) => { if (e.key === "Shift") apply(false); });
  // Fusion pans/orbits with two-finger + modifier on trackpads; keep touch sane
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
}

function onResize() {
  const w = viewport.clientWidth || 800;
  const h = viewport.clientHeight || 600;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
}

// ---------- geometry builders ----------
const matCache = new Map();
function materialFor(kind, color) {
  const c = color || PALETTE[kind] || "#cccccc";
  const key = kind + "|" + c;
  if (!matCache.has(key)) {
    const opts = { color: c, roughness: 0.85, metalness: 0 };
    if (kind === "glass") Object.assign(opts, { transparent: true, opacity: 0.5, roughness: 0.1, metalness: 0.2, emissive: "#2a4a63", emissiveIntensity: 0.4 });
    if (kind === "skyglass") Object.assign(opts, { transparent: true, opacity: 0.75, roughness: 0.05, metalness: 0.3, emissive: "#4a86b8", emissiveIntensity: 0.6 });
    matCache.set(key, new THREE.MeshStandardMaterial(opts));
  }
  return matCache.get(key);
}

// finish colours from the active config (simple/massing view)
function pieceColor(kind) {
  if (kind === "roof") return roofingById(config.roofing).color;
  if (kind === "wall" || kind === "endwall" || kind === "corner") return claddingById(config.cladding).color;
  return null;
}

const artTexCache = new Map();
function artTexture(seed) {
  if (!artTexCache.has(seed)) {
    const tex = new THREE.CanvasTexture(artCanvas(seed));
    tex.needsUpdate = true;
    artTexCache.set(seed, tex);
  }
  return artTexCache.get(seed);
}

function stairGroup(p) {
  const g = new THREE.Group();
  const steps = 8;
  const mat = materialFor("stair");
  for (let i = 0; i < steps; i++) {
    const h = (p.sy) * ((i + 1) / steps);
    const box = new THREE.Mesh(new THREE.BoxGeometry(p.sx, 0.06, p.sz / steps), mat);
    box.castShadow = box.receiveShadow = true;
    box.position.set(0, h, -p.sz / 2 + (i + 0.5) * (p.sz / steps));
    g.add(box);
  }
  return g;
}

function gableTriGeometry(width, height, depth) {
  // triangle across Z (span), extruded along X (depth = piece thickness)
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(0, height);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  g.rotateY(Math.PI / 2);
  g.translate(-depth / 2, 0, 0);
  return g;
}

function skillionTriGeometry(width, rise, depth) {
  // right triangle: low at +Z (front), high at -Z (back).
  // After rotateY(90°) shape-x maps to world -Z, so the rise sits at +shape-x.
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(width / 2, rise);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  g.rotateY(Math.PI / 2);
  g.translate(-depth / 2, 0, 0);
  return g;
}

function pitchSlabGeometry(len, halfW, ridgeH, thick, sideSign) {
  // one pitch plane of a gable roof: from eave (z=sideSign*halfW, y=0) to ridge (z=0, y=ridgeH)
  const slope = Math.hypot(halfW, ridgeH);
  const g = new THREE.BoxGeometry(len, thick, slope + 0.15);
  const ang = Math.atan2(ridgeH, halfW);
  g.rotateX(sideSign * ang);
  g.translate(0, ridgeH / 2 + thick / 2 * Math.cos(ang), sideSign * halfW / 2);
  return g;
}

function skillionSlabGeometry(len, width, rise, thick) {
  const slope = Math.hypot(width, rise);
  const g = new THREE.BoxGeometry(len, thick, slope + 0.1);
  const ang = Math.atan2(rise, width);
  g.rotateX(ang);
  g.translate(0, rise / 2 + thick / 2, 0);
  return g;
}

function buildPiece(p) {
  let mesh;
  const t = 0.3; // roof slab thickness
  if (p.kind === "furniture") {
    mesh = buildFurniture(p.model, p.w, p.d, p.h, p.color);
    if (p.rotY) mesh.rotation.y = p.rotY;
    mesh.userData.base = new THREE.Vector3(p.x, p.y, p.z);
    mesh.userData.explodeDir = new THREE.Vector3(0, 0, 0);
    mesh.position.copy(mesh.userData.base);
    return mesh;
  }
  if (p.kind === "stair") {
    mesh = stairGroup(p);
  } else if (p.kind === "art") {
    const geom = new THREE.PlaneGeometry(p.sx, p.sy);
    mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ map: artTexture(p.seed || 1), roughness: 0.9 }));
  } else {
    let geom;
    switch (p.shape) {
      case "gableTri": geom = gableTriGeometry(p.sz, p.sy, p.sx); break;
      case "skillionTri": geom = skillionTriGeometry(p.sz, p.sy, p.sx); break;
      case "gablePitchL": geom = pitchSlabGeometry(p.sx, p.sz / 2, p.sy, t, -1); break;
      case "gablePitchR": geom = pitchSlabGeometry(p.sx, p.sz / 2, p.sy, t, 1); break;
      case "skillionSlab": geom = skillionSlabGeometry(p.sx, p.sz, p.sy, t); break;
      default: geom = new THREE.BoxGeometry(p.sx, p.sy, p.sz);
    }
    if (p.rotXslope) geom.rotateX(p.rotXslope);
    mesh = new THREE.Mesh(geom, materialFor(p.kind, p.color || pieceColor(p.kind)));
  }
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (p.rotY && p.kind === "furniture") mesh.rotation.y = p.rotY;
  mesh.userData.base = new THREE.Vector3(p.x, p.y, p.z);
  mesh.userData.explodeDir = new THREE.Vector3(p.ex || 0, p.ey || 0, p.ez || 0);
  mesh.position.copy(mesh.userData.base);
  return mesh;
}

// ---------- rebuild on config change ----------
let lastResult = null;
let buildGen = 0;
let detailedMode = false;
const detailedMat = new THREE.MeshStandardMaterial({ color: "#d8b98a", roughness: 0.8 });

export function rebuild(cfg, result) {
  if (!result) return; // ui always passes both
  lastResult = result;
  const gen = ++buildGen;
  buildingGroup.clear();
  const byGroup = new Map(); // grp/piece -> massing meshes, for detailed swap
  for (const p of result.pieces) {
    if (p.hidden && !detailedMode) continue;
    const mesh = p.hidden ? null : buildPiece(p);
    if (mesh) buildingGroup.add(mesh);
    if (detailedMode && (p.grp || p.bid)) {
      const key = p.grp || `solo-${byGroup.size}-${p.bid}-${p.x}-${p.z}`;
      if (!byGroup.has(key)) byGroup.set(key, { meshes: [], anchor: null });
      const g = byGroup.get(key);
      if (mesh) g.meshes.push(mesh);
      if (p.bid) g.anchor = p;
    }
  }
  if (detailedMode) {
    for (const { meshes, anchor } of byGroup.values()) {
      if (!anchor || !anchor.bid) continue;
      loadDetailed(anchor.bid).then((geom) => {
        if (!geom || gen !== buildGen) return;
        const dm = new THREE.Mesh(geom, detailedMat);
        dm.castShadow = dm.receiveShadow = true;
        dm.rotation.y = anchor.rotY || 0;
        const bx = anchor.anchorX !== undefined ? anchor.anchorX : anchor.x;
        dm.userData.base = new THREE.Vector3(bx, anchor.anchorY !== undefined ? anchor.anchorY : anchor.y, anchor.z);
        dm.userData.explodeDir = new THREE.Vector3(anchor.ex || 0, anchor.ey || 0, anchor.ez || 0);
        dm.position.copy(dm.userData.base);
        for (const m of meshes) m.visible = false;
        buildingGroup.add(dm);
        applyExplode();
        renderer.render(scene, camera);
      });
    }
  }
  applyExplode();
  if (renderer) renderer.render(scene, camera);
  const m = result.metrics;
  hud.textContent =
    `${m.outerW.toFixed(1)} × ${m.outerL.toFixed(1)} m  ·  ${m.floorArea.toFixed(0)} m² internal\n` +
    `ridge ${m.ridgeHeight.toFixed(1)} m  ·  ${m.totalBlocks} blocks`;
}

function applyExplode() {
  const k = explodeAmount * 2.2;
  for (const mesh of buildingGroup.children) {
    mesh.position.copy(mesh.userData.base).addScaledVector(mesh.userData.explodeDir, k);
    if (mesh.userData.explodeDir.y > 0) mesh.position.y += k * 0.6;
  }
}

function hookViewControls() {
  document.getElementById("explode").addEventListener("input", (e) => {
    explodeAmount = e.target.value / 100;
    document.getElementById("explodeLabel").textContent = e.target.value + "%";
    applyExplode();
  });
  document.getElementById("spinBtn").addEventListener("click", () => {
    autoRotate = !autoRotate;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.4;
  });
  document.getElementById("resetCam").addEventListener("click", () => {
    camera.position.set(11, 8, 13);
    controls.target.set(0, 1.6, 0);
  });
  // Detailed-blocks toggle is absent in the web build (GLB assets are local-only)
  document.getElementById("detailedChk")?.addEventListener("change", (e) => {
    detailedMode = e.target.checked;
    if (lastResult) rebuild(null, lastResult);
  });
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

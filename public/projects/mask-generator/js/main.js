import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const viewport = document.getElementById("viewport");
const hoverEl = document.getElementById("hover");
const statusEl = document.getElementById("status");
const $ = (id) => document.getElementById(id);

let scene, camera, renderer, controls;
let maskGroup;
let partMeshes = [];
let explode = 0;
let modelCenter = new THREE.Vector3();
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2(-2, -2);

// ---------- design state ----------

const PRESETS = {
  s:     { width: 145, height: 200, pd: 58, eyew: 38, eyeh: 20, nose: 40 },
  m:     { width: 160, height: 220, pd: 63, eyew: 42, eyeh: 22, nose: 45 },
  l:     { width: 175, height: 240, pd: 68, eyew: 46, eyeh: 24, nose: 50 },
  child: { width: 130, height: 180, pd: 52, eyew: 34, eyeh: 18, nose: 34 },
};

const state = {
  ...PRESETS.m,
  depth: 80, chin: 0.35, brow: 0.15, wall: 10,
  vents: true, strap: true,
  material: "ply6mm", bed: "800x400",
  strength: 12, mode: "carve",
  image_id: null, art_seed: null,
  output: "stacked",
};

function design() {
  const d = {
    mode: "mask",
    material: state.material,
    resolution: 240,
    bed: state.bed,
    mask: {
      face: {
        width_mm: state.width, height_mm: state.height, pd_mm: state.pd,
        eye_w_mm: state.eyew, eye_h_mm: state.eyeh,
        nose_clearance_mm: state.nose,
        mouth_vents: state.vents, vent_rows: 2, margin_mm: 18,
      },
      depth_mm: state.depth, wall_mm: state.wall,
      chin_taper: state.chin, brow_flat: state.brow,
      strap: state.strap ? "slots" : "none",
      dowels: 2, output: state.output,
    },
  };
  if (state.image_id) {
    d.mask.decoration = { image_id: state.image_id,
                          strength_mm: state.strength, mode: state.mode,
                          blur: 1.2 };
  }
  return d;
}

// ---------- controls wiring ----------

const SLIDERS = [
  ["width", "mm"], ["height", "mm"], ["pd", "mm"], ["eyew", "mm"],
  ["eyeh", "mm"], ["nose", "mm"], ["depth", "mm"], ["chin", ""],
  ["brow", ""], ["wall", "mm"], ["strength", "mm"],
];

function syncControls() {
  for (const [k] of SLIDERS) {
    const c = $("c_" + k);
    if (c) c.value = state[k];
  }
  updateVals();
  $("c_vents").checked = state.vents;
  $("c_strap").checked = state.strap;
  $("c_material").value = state.material;
  $("c_bed").value = state.bed;
  $("c_mode").value = state.mode;
}

function updateVals() {
  for (const [k, unit] of SLIDERS) {
    const v = $("v_" + k);
    if (v) v.textContent = `${state[k]}${unit ? " " + unit : ""}`;
  }
}

function wire() {
  for (const [k] of SLIDERS) {
    const c = $("c_" + k);
    if (!c) continue;
    c.addEventListener("input", () => {
      state[k] = parseFloat(c.value);
      updateVals();
      queueGenerate();
    });
  }
  $("c_vents").addEventListener("change", (e) => { state.vents = e.target.checked; queueGenerate(); });
  $("c_strap").addEventListener("change", (e) => { state.strap = e.target.checked; queueGenerate(); });
  $("c_material").addEventListener("change", (e) => { state.material = e.target.value; queueGenerate(); });
  $("c_bed").addEventListener("change", (e) => { state.bed = e.target.value; queueGenerate(); });
  $("c_mode").addEventListener("change", (e) => { state.mode = e.target.value; queueGenerate(); });
  document.querySelectorAll(".presets button").forEach((b) =>
    b.addEventListener("click", () => {
      Object.assign(state, PRESETS[b.dataset.preset]);
      syncControls();
      queueGenerate();
    }));
  for (const [id, mode] of [["m_stacked", "stacked"], ["m_eggcrate", "eggcrate"],
                            ["m_rotary", "rotary"]]) {
    $(id).addEventListener("click", () => {
      state.output = mode;
      document.querySelectorAll(".modes button").forEach((b) =>
        b.classList.toggle("on", b.id === id));
      queueGenerate();
    });
  }
  $("btn_art").addEventListener("click", generateArtwork);
  $("btn_vibe").addEventListener("click", interpretVibe);
  $("btn_noart").addEventListener("click", () => {
    state.image_id = null;
    $("artprev").style.display = "none";
    queueGenerate();
  });
  $("explode").addEventListener("input", (e) => {
    explode = parseFloat(e.target.value);
    applyExplode();
  });
}

// ---------- generation ----------

let genTimer = null, generating = false, queued = false;

function queueGenerate() {
  clearTimeout(genTimer);
  genTimer = setTimeout(generate, 350);
}

async function generate() {
  if (generating) { queued = true; return; }
  generating = true;
  statusEl.textContent = "generating…";
  try {
    const r = await (await fetch("api/generate", {
      method: "POST", body: JSON.stringify(design()) })).json();
    const err = $("err");
    if (r.error) {
      err.style.display = "block";
      err.textContent = r.error;
      statusEl.textContent = "engine error";
      return;
    }
    err.style.display = "none";
    buildScene(r.result);
    updatePanel(r.result, r.files || []);
    statusEl.textContent =
      `${r.result.stats.part_count} parts · ${r.result.stats.build_seconds}s`;
  } catch (e) {
    statusEl.textContent = "fetch failed: " + e.message;
  } finally {
    generating = false;
    if (queued) { queued = false; queueGenerate(); }
  }
}

async function generateArtwork() {
  const btn = $("btn_art");
  const prompt = $("c_vibe").value.trim() || "ornate ceremonial patterns";
  btn.disabled = true;
  btn.textContent = "generating…";
  try {
    const r = await (await fetch("api/artwork", {
      method: "POST", body: JSON.stringify({ prompt }) })).json();
    if (r.error) throw new Error(r.error);
    state.image_id = r.image_id;
    state.art_seed = r.seed;
    const img = $("artprev");
    img.src = r.url.replace(/^\//, "") + "?v=" + r.image_id;
    img.style.display = "block";
    queueGenerate();
  } catch (e) {
    $("err").style.display = "block";
    $("err").textContent = "artwork: " + e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = "Generate artwork";
  }
}

async function interpretVibe() {
  const btn = $("btn_vibe");
  const vibe = $("c_vibe").value.trim();
  if (!vibe) return;
  btn.disabled = true;
  btn.textContent = "thinking…";
  try {
    const r = await (await fetch("api/stylize", {
      method: "POST", body: JSON.stringify({ vibe }) })).json();
    if (r.error) throw new Error(r.error);
    const p = r.params || {};
    if (p.chin_taper != null) state.chin = p.chin_taper;
    if (p.brow_flat != null) state.brow = p.brow_flat;
    if (p.depth_mm != null) state.depth = p.depth_mm;
    if (p.wall_mm != null) state.wall = p.wall_mm;
    if (p.strength_mm != null) state.strength = p.strength_mm;
    if (p.mode) state.mode = p.mode;
    if (p.art_prompt) $("c_vibe").value = p.art_prompt;
    syncControls();
    queueGenerate();
  } catch (e) {
    $("err").style.display = "block";
    $("err").textContent = "stylize: " + e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = "Interpret vibe";
  }
}

// ---------- three.js scene (from the SculptGen viewer) ----------

init();
wire();
syncControls();
animate();
generate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#14171c");
  scene.fog = new THREE.Fog("#14171c", 1400, 3200);

  camera = new THREE.PerspectiveCamera(42, 1, 1, 8000);
  camera.position.set(240, 300, 420);

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  viewport.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 130, 0);
  controls.zoomToCursor = true;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE,
                            MIDDLE: THREE.MOUSE.PAN,
                            RIGHT: THREE.MOUSE.PAN };
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

  const sun = new THREE.DirectionalLight("#fff2dd", 2.4);
  sun.position.set(500, 700, 300);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const d = 500;
  sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
  sun.shadow.camera.top = d; sun.shadow.camera.bottom = -d;
  sun.shadow.camera.far = 3000;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight("#b9cde4", "#403428", 0.85));
  const rim = new THREE.DirectionalLight("#88a6ff", 0.5);
  rim.position.set(-400, 200, -400);
  scene.add(rim);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(1600, 72),
    new THREE.MeshStandardMaterial({ color: "#191d24", roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(1600, 64, "#2c333f", "#20252d");
  grid.position.y = 0.01;
  scene.add(grid);

  maskGroup = new THREE.Group();
  maskGroup.rotation.x = -Math.PI / 2;
  scene.add(maskGroup);

  window.addEventListener("resize", onResize);
  onResize();

  renderer.domElement.addEventListener("pointermove", (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    hoverEl.style.left = (e.clientX - r.left + 14) + "px";
    hoverEl.style.top = (e.clientY - r.top + 10) + "px";
  });

  window.__dbg = {
    scene, camera, controls, get parts() { return partMeshes; },
    render: () => renderer.render(scene, camera),
    setView(px, py, pz, tx, ty, tz) {
      camera.position.set(px, py, pz);
      controls.target.set(tx, ty, tz);
      controls.update();
      renderer.render(scene, camera);
    },
  };
}

function onResize() {
  const w = viewport.clientWidth || 800;
  const h = viewport.clientHeight || 600;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
}

const matCache = new Map();
function materialFor(color) {
  if (!matCache.has(color)) {
    matCache.set(color, new THREE.MeshStandardMaterial({
      color, roughness: 0.72, metalness: 0.0 }));
  }
  return matCache.get(color);
}
const edgeMat = new THREE.LineBasicMaterial({ color: "#3a2f22", transparent: true, opacity: 0.35 });

function buildScene(data) {
  for (const { mesh } of partMeshes) {
    maskGroup.remove(mesh);
    mesh.geometry.dispose();
  }
  partMeshes = [];
  const bbox = new THREE.Box3();

  for (const part of data.parts) {
    let geo;
    if (part.mesh) {
      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(
        part.mesh.vertices.flat(), 3));
      geo.setIndex(part.mesh.faces.flat());
      geo.computeVertexNormals();
    } else {
      const shape = new THREE.Shape(part.polygon.outer.map(([x, y]) => new THREE.Vector2(x, y)));
      for (const hole of part.polygon.holes) {
        shape.holes.push(new THREE.Path(hole.map(([x, y]) => new THREE.Vector2(x, y))));
      }
      geo = new THREE.ExtrudeGeometry(shape, {
        depth: part.thickness, bevelEnabled: false, curveSegments: 6 });
      geo.translate(0, 0, -part.thickness / 2);
    }

    const mesh = new THREE.Mesh(geo, materialFor("#d8a86a"));
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.position.fromArray(part.pos);
    mesh.quaternion.set(...part.quat);
    mesh.userData.part = part;
    if (!part.mesh) {
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), edgeMat));
    }
    maskGroup.add(mesh);

    let c2;
    if (part.mesh) {
      let cx = 0, cy = 0, cz = 0;
      for (const [vx, vy, vz] of part.mesh.vertices) { cx += vx; cy += vy; cz += vz; }
      const n = part.mesh.vertices.length || 1;
      c2 = { x: cx / n, y: cy / n, z: cz / n };
    } else {
      c2 = { ...polygonCentroid(part.polygon.outer), z: 0 };
    }
    const center = new THREE.Vector3(c2.x, c2.y, c2.z)
      .applyQuaternion(mesh.quaternion).add(mesh.position);
    partMeshes.push({ mesh, basePos: mesh.position.clone(), center, part });
    bbox.expandByPoint(center);
  }

  bbox.getCenter(modelCenter);
  const meta = data.region_meta?.mask || {};
  const h = (meta.plane_mm || [200, 250])[1];
  controls.target.set(0, h / 2, 0);
  applyExplode();
}

function polygonCentroid(ring) {
  let x = 0, y = 0;
  for (const [px, py] of ring) { x += px; y += py; }
  return { x: x / ring.length, y: y / ring.length };
}

function applyExplode() {
  const k = explode * 0.9;
  for (const { mesh, basePos, center } of partMeshes) {
    mesh.position.copy(basePos).addScaledVector(
      new THREE.Vector3().subVectors(center, modelCenter), k);
  }
}

// ---------- panel ----------

function updatePanel(data, files) {
  const s = data.stats;
  const m = data.region_meta?.mask || {};
  $("summary").innerHTML = `
    <div class="row"><span>Material</span><b>${data.material.name}</b></div>
    <div class="row"><span>Layers</span><b>${m.layers ?? "—"}</b></div>
    <div class="row"><span>Parts</span><b>${s.part_count}</b></div>
    <div class="row"><span>Mask depth</span><b>${m.depth_mm ?? "—"} mm</b></div>
    <div class="row"><span>Face</span><b>${(m.face_mm || []).join(" × ")} mm</b></div>
    <div class="row"><span>Est. sheet</span><b>${s.est_sheet_area_m2} m²</b></div>
    <div class="row"><span>Dowels</span><b>${(m.dowels || [])
      .map((d) => d.layers_through + "L").join(" · ") || "none"}</b></div>`;

  const dl = $("downloads");
  const svg = files.filter((f) => f.endsWith(".svg"));
  const dxf = files.filter((f) => f.endsWith(".dxf"));
  const rest = files.filter((f) => f.endsWith(".stl") || f.endsWith("cut_manifest.json"));
  const link = (f) => `<a href="${f.replace(/^\//, "")}" download>${f.split("/").pop()}</a>`;
  dl.innerHTML = [...svg, ...dxf, ...rest].map(link).join("") +
    `<div class="hint" style="margin-top:6px">SVG for laser · DXF for CAM
     (VCarve, Fusion). Red = cut, blue = engraved layer numbers,
     kerf-compensated. Glue layers in number order.</div>`;

  $("issues").textContent =
    (data.issues && data.issues.length) ? data.issues.join("\n") : "none — all fabricable";
}

// ---------- loop ----------

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(partMeshes.map((p) => p.mesh), false);
  if (hits.length) {
    const p = hits[0].object.userData.part;
    hoverEl.style.display = "block";
    hoverEl.textContent = `#${p.label} ${p.id}`;
  } else {
    hoverEl.style.display = "none";
  }
  renderer.render(scene, camera);
}

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const viewport = document.getElementById("viewport");
const hoverEl = document.getElementById("hover");
const statusEl = document.getElementById("status");

// region tints multiplied over a wood tone
const REGION_COLORS = ["#d8a86a", "#7fb7c9", "#b48ead", "#a3be8c", "#e0b56a", "#c97f7f"];

// Static mode: the published web build injects a manifest of pre-generated
// sculptures, so the viewer runs with no Python backend. Local dev leaves this
// undefined and talks to serve.py as usual.
const STATIC = window.SCULPTGEN_STATIC || null;
let staticId = STATIC ? STATIC.sculptures[0].id : null;

let scene, camera, renderer, controls;
let sculptGroup;            // Z-up engine coords live inside (rotated to Y-up)
let partMeshes = [];        // { mesh, basePos: Vector3(engine), center: Vector3(engine), part }
let lastVersion = 0;
let explode = 0;
let modelCenter = new THREE.Vector3();
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2(-2, -2);

init();
animate();
refresh(true);
if (!STATIC) setInterval(pollVersion, 900);

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#14171c");
  scene.fog = new THREE.Fog("#14171c", 1400, 3200);

  camera = new THREE.PerspectiveCamera(42, 1, 1, 8000);
  camera.position.set(430, 360, 430);

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  viewport.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 150, 0);
  controls.zoomToCursor = true;
  setupFusionControls();

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

  sculptGroup = new THREE.Group();
  sculptGroup.rotation.x = -Math.PI / 2;   // engine Z-up -> world Y-up
  scene.add(sculptGroup);

  window.addEventListener("resize", onResize);
  onResize();

  renderer.domElement.addEventListener("pointermove", (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    hoverEl.style.left = (e.clientX - r.left + 14) + "px";
    hoverEl.style.top = (e.clientY - r.top + 10) + "px";
  });

  document.getElementById("explode").addEventListener("input", (e) => {
    explode = parseFloat(e.target.value);
    applyExplode();
  });
  if (STATIC) {
    buildGallery();
  } else {
    document.getElementById("regen").addEventListener("click", () => refresh(true));
    document.getElementById("reseed").addEventListener("click", reseed);
  }

  window.__dbg = {
    scene, get parts() { return partMeshes; },
    render: () => renderer.render(scene, camera),
    snap,
  };
}

function setupFusionControls() {
  const apply = (shift) => {
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: shift ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.PAN,
    };
  };
  apply(false);
  window.addEventListener("keydown", (e) => { if (e.key === "Shift") apply(true); });
  window.addEventListener("keyup", (e) => { if (e.key === "Shift") apply(false); });
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

// ---------- data ----------

async function pollVersion() {
  try {
    const v = await (await fetch("/api/version")).json();
    if (v.design_mtime > lastVersion) {
      lastVersion = v.design_mtime;
      refresh(false);
    }
  } catch { /* server briefly away */ }
}

async function refresh(force) {
  statusEl.textContent = STATIC ? "loading…" : "generating…";
  try {
    const url = STATIC ? `sculptures/${staticId}.json`
                       : "/api/parts" + (force ? "?force=1" : "");
    const data = await (await fetch(url)).json();
    const err = document.getElementById("err");
    if (data.error) {
      err.style.display = "block";
      err.textContent = data.error;
      statusEl.textContent = "engine error";
      return;
    }
    err.style.display = "none";
    buildScene(data);
    updatePanel(data);
    statusEl.textContent = STATIC
      ? `${data.stats.part_count} parts`
      : `${data.stats.part_count} parts · ${data.stats.build_seconds}s`;
    // render + snapshot immediately — rAF is throttled in background tabs
    renderer.render(scene, camera);
    snap();
  } catch (e) {
    statusEl.textContent = "fetch failed: " + e.message;
  }
}

async function reseed() {
  const design = await (await fetch("/design.json")).json();
  design.seed = Math.floor(Math.random() * 100000);
  await fetch("/api/design", { method: "POST", body: JSON.stringify(design) });
  // version poll picks up the change
}

// ---------- scene build ----------

const matCache = new Map();
function materialFor(color) {
  if (!matCache.has(color)) {
    matCache.set(color, new THREE.MeshStandardMaterial({
      color, roughness: 0.72, metalness: 0.0,
    }));
  }
  return matCache.get(color);
}
const edgeMat = new THREE.LineBasicMaterial({ color: "#3a2f22", transparent: true, opacity: 0.35 });

function buildScene(data) {
  for (const { mesh } of partMeshes) {
    sculptGroup.remove(mesh);
    mesh.geometry.dispose();
  }
  partMeshes = [];

  const regionIndex = new Map((data.regions || []).map((r, i) => [r.id, i]));
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
        depth: part.thickness, bevelEnabled: false, curveSegments: 6,
      });
      geo.translate(0, 0, -part.thickness / 2);
    }

    const ci = regionIndex.get(part.region) ?? 0;
    const color = part.mesh ? "#555c66" : REGION_COLORS[ci % REGION_COLORS.length];
    const mesh = new THREE.Mesh(geo, materialFor(color));
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.position.fromArray(part.pos);
    mesh.quaternion.set(...part.quat);
    mesh.userData.part = part;

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 25), edgeMat);
    mesh.add(edges);

    sculptGroup.add(mesh);

    // engine-space center for explode direction
    let centroid2;
    if (part.mesh) {
      let cx = 0, cy = 0, cz = 0;
      for (const [vx, vy, vz] of part.mesh.vertices) { cx += vx; cy += vy; cz += vz; }
      const n = part.mesh.vertices.length;
      centroid2 = { x: cx / n, y: cy / n, z: cz / n };
    } else {
      centroid2 = { ...polygonCentroid(part.polygon.outer), z: 0 };
    }
    const center = new THREE.Vector3(centroid2.x, centroid2.y, centroid2.z)
      .applyQuaternion(mesh.quaternion).add(mesh.position);
    partMeshes.push({ mesh, basePos: mesh.position.clone(), center, part });
    bbox.expandByPoint(center);
  }

  bbox.getCenter(modelCenter);
  const height = data.size_mm?.height || 300;
  controls.target.set(0, height / 2, 0);
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

// ---------- static gallery (published build only) ----------

function buildGallery() {
  const host = document.getElementById("gallery");
  if (!host) return;
  host.innerHTML = STATIC.sculptures.map((s) => `
    <button class="gal${s.id === staticId ? " on" : ""}" data-id="${s.id}">
      <b>${s.name}</b><span>${s.blurb}</span>
    </button>`).join("");
  host.querySelectorAll("button.gal").forEach((b) => {
    b.addEventListener("click", () => {
      staticId = b.dataset.id;
      host.querySelectorAll("button.gal").forEach((o) =>
        o.classList.toggle("on", o.dataset.id === staticId));
      document.getElementById("explode").value = "0";
      explode = 0;
      refresh(false);
    });
  });
}

function updateDownloads(data) {
  const host = document.getElementById("downloads");
  if (!host || !STATIC) return;
  const s = STATIC.sculptures.find((x) => x.id === staticId) || {};
  const links = [];
  for (const sheet of s.sheets || []) {
    links.push(`<a href="${sheet}" download>${sheet.split("/").pop()}</a>`);
  }
  if (s.printed) links.push(`<a href="${s.printed}" download>printed_parts.3mf</a>`);
  host.innerHTML = links.length
    ? links.join("") + `<div class="hint" style="margin-top:6px">
        SVG = laser/CNC cut sheets (red cut · blue engraved labels, kerf-compensated).
        3MF = 3D-printed parts.</div>`
    : `<div class="hint">no cut files for this piece</div>`;
}

// ---------- panel ----------

function updatePanel(data) {
  const s = data.stats;
  document.getElementById("summary").innerHTML = `
    <div class="row"><span>Material</span><b>${data.material.name}</b></div>
    <div class="row"><span>Height</span><b>${data.size_mm.height} mm</b></div>
    <div class="row"><span>Seed</span><b>${data.seed}</b></div>
    <div class="row"><span>Parts</span><b>${s.part_count}</b></div>
    <div class="row"><span>Cut area</span><b>${(s.total_cut_area_mm2 / 1e6).toFixed(2)} m²</b></div>
    <div class="row"><span>Est. sheet</span><b>${s.est_sheet_area_m2} m²</b></div>`;

  const regionIndex = new Map((data.regions || []).map((r, i) => [r.id, i]));
  document.getElementById("regions").innerHTML = (data.regions || []).map((r) => {
    const meta = data.region_meta?.[r.id] || {};
    const c = REGION_COLORS[(regionIndex.get(r.id) ?? 0) % REGION_COLORS.length];
    const extra = meta.layers != null ? `${meta.layers} layers`
      : meta.ribs != null ? `${meta.ribs} ribs · ${(meta.hubs || []).length} hubs` : "";
    return `<div class="row"><span><span class="chip" style="background:${c}"></span>
      ${r.id} <span class="sub">· ${r.technique}</span></span>
      <b>${meta.parts ?? 0}<span class="sub"> parts ${extra ? "· " + extra : ""}</span></b></div>`;
  }).join("");

  const issuesEl = document.getElementById("issues");
  if (issuesEl) {
    issuesEl.textContent =
      (data.issues && data.issues.length) ? data.issues.join("\n") : "none — all fabricable";
  }
  updateDownloads(data);
}

// ---------- loop ----------

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(partMeshes.map(p => p.mesh), false);
  if (hits.length) {
    const p = hits[0].object.userData.part;
    hoverEl.style.display = "block";
    hoverEl.textContent = `#${p.label} ${p.id} (${p.technique})`;
  } else {
    hoverEl.style.display = "none";
  }

  renderer.render(scene, camera);
}

function snap() {
  if (STATIC) return;          // no backend to save to on the published build
  try {
    fetch("/snap", { method: "POST", body: renderer.domElement.toDataURL("image/jpeg", 0.9) });
  } catch { /* verification helper only */ }
}

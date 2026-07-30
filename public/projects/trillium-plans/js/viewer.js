// 3D panel viewer. Renders the structure the way it is actually built:
// every face is a framed panel of boards, not a wireframe of sticks.
// Board-solid construction is adapted from the dome-generator's faceFrameBoards().

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { fmtLen } from "./units.js";

const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

export const GROUP_COLORS = [
  "#e0a44e", "#5fb4d8", "#8fcf87", "#e07a82", "#b48ce0",
  "#d8c95f", "#6fd8bb", "#e09ad9", "#9ab0e0", "#cfa07e",
];

/**
 * Board solids for one face: each board's outer long edge lies on the face
 * edge and is bevel-ripped on the shared dihedral bisector plane, so mating
 * panels sit flush. Corners are pinwheel butt-miters — one end runs to the
 * face corner, the other butts into the inner face of the previous board.
 */
function faceFrameBoards(verts, f, outMap, W, D) {
  const n = f.length;
  const p0 = V3(verts[f[0]]);
  const nrm = new THREE.Vector3()
    .crossVectors(V3(verts[f[1]]).sub(p0.clone()), V3(verts[f[2]]).sub(p0.clone()))
    .normalize();
  const X = V3(verts[f[1]]).sub(p0.clone()).normalize();
  const Y = new THREE.Vector3().crossVectors(nrm, X);
  const to2 = (vi) => {
    const d = V3(verts[vi]).sub(p0);
    return [d.dot(X), d.dot(Y)];
  };
  let pts = f.map(to2);
  let idx = [...f];
  let area = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    area += a[0] * b[1] - b[0] * a[1];
  }
  const normal = nrm.clone();
  if (area < 0) { pts = pts.reverse(); idx = idx.reverse(); }

  const lineInt = (P, d, Q, e) => {
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
    edges.push({ a, b, d: dn, inw: [-dn[1], dn[0]], L, va: idx[i], vb: idx[(i + 1) % n] });
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
    const headIn = lineInt(off(e), e.d, eNext.a, eNext.d) ||
      [e.b[0] + e.inw[0] * W, e.b[1] + e.inw[1] * W];
    const to3 = (q) => p0.clone().addScaledVector(X, q[0]).addScaledVector(Y, q[1]);
    const tTO = to3(tailOut), tTI = to3(tailIn), tHO = to3(headOut), tHI = to3(headIn);
    const key = e.va < e.vb ? e.va + "_" + e.vb : e.vb + "_" + e.va;
    const out = outMap.get(key) || null;
    const inwardN = normal.clone();
    if (out && inwardN.dot(out) > 0) inwardN.negate();
    else if (!out && inwardN.z > 0) inwardN.negate();
    const nOut = inwardN.clone().negate();
    const drop = (v) => v.clone().addScaledVector(inwardN, D);
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
      tris: [
        [tTO, tHO, tHI], [tTO, tHI, tTI],
        [bTO, bHO, bHI], [bTO, bHI, bTI],
        [tTO, tHO, bHO], [tTO, bHO, bTO],
        [tTI, tHI, bHI], [tTI, bHI, bTI],
        [tTO, tTI, bTI], [tTO, bTI, bTO],
        [tHO, tHI, bHI], [tHO, bHI, bHO],
      ],
    });
  }
  return boards;
}

export class Viewer {
  constructor(host) {
    this.host = host;
    this.result = null;
    this.selected = null;
    this.explode = 0;
    this.showSkin = true;
    this.spin = true;
    this.onSelect = () => {};
    this.panelGroups3D = [];
    this.pickables = [];
    this._initScene();
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111419);
    this.scene.fog = new THREE.Fog(0x111419, 130, 340);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    this.camera.up.set(0, 0, 1);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.host.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.autoRotate = this.spin;
    this.controls.autoRotateSpeed = 0.9;

    this.scene.add(new THREE.HemisphereLight(0xdfe4ee, 0x4a3a28, 1.4));
    this.scene.add(new THREE.AmbientLight(0xfff2e0, 0.5));
    const sun = new THREE.DirectionalLight(0xffe8c0, 2.3);
    sun.position.set(60, 40, 80);
    this.scene.add(sun);
    const fill = new THREE.DirectionalLight(0x9db8ff, 0.85);
    fill.position.set(-50, -60, 30);
    this.scene.add(fill);

    this.grid = new THREE.PolarGridHelper(60, 16, 12, 64, 0x2a313c, 0x212630);
    this.grid.rotation.x = Math.PI / 2;
    this.scene.add(this.grid);

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-2, -2);

    this.hoverEl = document.createElement("div");
    this.hoverEl.className = "viewer-hover";
    this.host.appendChild(this.hoverEl);

    const resize = () => {
      const w = this.host.clientWidth, h = this.host.clientHeight;
      if (!w || !h) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    this._resize = resize;
    new ResizeObserver(resize).observe(this.host);
    resize();

    const el = this.renderer.domElement;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      this.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      this.hoverEl.style.left = e.clientX - r.left + 14 + "px";
      this.hoverEl.style.top = e.clientY - r.top + 10 + "px";
    });
    el.addEventListener("pointerleave", () => {
      this.pointer.set(-2, -2);
      this.hoverEl.style.display = "none";
    });
    el.addEventListener("click", () => {
      const hit = this._pick();
      this.select(hit ? hit.group : null);
      this.onSelect(this.selected);
    });

    const loop = () => {
      this._raf = requestAnimationFrame(loop);
      this.controls.update();
      this._hover();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  _pick() {
    if (this.pointer.x < -1.5) return null;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.pickables, false);
    return hits.length ? hits[0].object.userData : null;
  }

  _hover() {
    const u = this._pick();
    if (u) {
      this.hoverEl.textContent = u.label;
      this.hoverEl.style.display = "block";
      this.renderer.domElement.style.cursor = "pointer";
    } else {
      this.hoverEl.style.display = "none";
      this.renderer.domElement.style.cursor = "grab";
    }
  }

  setResult(result, opts = {}) {
    this.result = result;
    this.depthIn = opts.depthIn || 1.5;
    this.boardWIn = opts.boardWIn || 1.375;
    this.selected = null;
    this._rebuild();
    this.frame();
  }

  _rebuild() {
    this.root.clear();
    this.pickables = [];
    this.panelGroups3D = [];
    if (!this.result) return;
    const { verts, struts, panels, panelGroups, wall, vertexNormals } = this.result;
    const D = this.depthIn / 12, W = this.boardWIn / 12;

    const outMap = new Map();
    for (const s of struts) {
      const k = s.a < s.b ? s.a + "_" + s.b : s.b + "_" + s.a;
      outMap.set(k, V3(s.out));
    }
    const groupIndex = new Map(panelGroups.map((g, i) => [g.label, i]));
    this.groupMats = {};
    for (const g of panelGroups) {
      this.groupMats[g.label] = new THREE.MeshStandardMaterial({
        color: new THREE.Color(GROUP_COLORS[groupIndex.get(g.label) % GROUP_COLORS.length]),
        roughness: 0.62, metalness: 0.02, side: THREE.DoubleSide, flatShading: true,
      });
    }

    const centroid = (f) => {
      const c = new THREE.Vector3();
      for (const vi of f) c.add(V3(verts[vi]));
      return c.multiplyScalar(1 / f.length);
    };

    panels.forEach((p) => {
      const holder = new THREE.Group();
      const c = centroid(p.verts);
      // explode direction: outward from the shell axis, lifting with height
      const dir = new THREE.Vector3(c.x, c.y, c.z * 0.85).normalize();
      const boards = faceFrameBoards(verts, p.verts, outMap, W, D);
      const mat = this.groupMats[p.group];
      for (const b of boards) {
        const pos = [];
        for (const t of b.tris) for (const v of t) pos.push(v.x, v.y, v.z);
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        g.computeVertexNormals();
        const m = new THREE.Mesh(g, mat);
        m.userData = { group: p.group, label: `${p.group} · board ${fmtLen(b.length)}` };
        holder.add(m);
        this.pickables.push(m);
      }
      if (this.showSkin) {
        const pos = [];
        const f = p.verts;
        for (let i = 1; i < f.length - 1; i++)
          for (const vi of [f[0], f[i], f[i + 1]]) {
            const v = V3(verts[vi]).addScaledVector(V3(vertexNormals[vi]), 0.02);
            pos.push(v.x, v.y, v.z);
          }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        g.computeVertexNormals();
        const skin = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
          color: 0x9fb8c8, transparent: true, opacity: 0.22,
          side: THREE.DoubleSide, roughness: 0.35, metalness: 0.05,
        }));
        skin.userData.isSkin = true;
        holder.add(skin);
      }
      holder.userData = { group: p.group, dir };
      this.root.add(holder);
      this.panelGroups3D.push(holder);
    });

    if (wall) this._buildWall(wall, verts, W, D);
    this.setExplode(this.explode);
  }

  _buildWall(wall, verts, W, D) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xa4855e, roughness: 0.75, side: THREE.DoubleSide, flatShading: true,
    });
    const up = new THREE.Vector3(0, 0, 1);
    const holder = new THREE.Group();
    wall.studEdges.forEach(([a, b]) => {
      const top = V3(verts[a]), bot = V3(verts[b]);
      const h = top.z - bot.z;
      if (h <= 0) return;
      const outH = new THREE.Vector3(top.x, top.y, 0).normalize();
      const tan = up.clone().cross(outH).normalize();
      const m = new THREE.Mesh(new THREE.BoxGeometry(W, D, h), mat);
      m.position.copy(top).add(bot).multiplyScalar(0.5).addScaledVector(outH, -D / 2);
      m.setRotationFromMatrix(new THREE.Matrix4().makeBasis(tan, outH, up));
      m.userData = { group: "BASE", label: `Base section stud · ${fmtLen(h)}` };
      holder.add(m);
      this.pickables.push(m);
    });
    wall.plateEdges.forEach(([a, b]) => {
      const pa = V3(verts[a]), pb = V3(verts[b]);
      const seg = pb.clone().sub(pa);
      const dir = seg.clone().normalize();
      const mid = pa.clone().add(pb).multiplyScalar(0.5);
      const outH = new THREE.Vector3(mid.x, mid.y, 0).normalize();
      const y = up.clone().cross(dir).normalize();
      const m = new THREE.Mesh(new THREE.BoxGeometry(seg.length(), D, 1.5 / 12), mat);
      m.position.copy(mid).addScaledVector(outH, -D / 2).addScaledVector(up, 1.5 / 24);
      m.setRotationFromMatrix(new THREE.Matrix4().makeBasis(dir, y, up));
      m.userData = { group: "BASE", label: `Bottom plate · ${fmtLen(seg.length())}` };
      holder.add(m);
      this.pickables.push(m);
    });
    holder.userData = { group: "BASE", dir: new THREE.Vector3(0, 0, -1) };
    this.root.add(holder);
    this.panelGroups3D.push(holder);
  }

  setExplode(t) {
    this.explode = t;
    const scale = (this.result?.stats.baseDiameter || 20) * 0.45 * t;
    for (const h of this.panelGroups3D) {
      h.position.copy(h.userData.dir).multiplyScalar(scale);
    }
  }

  select(group) {
    this.selected = group === this.selected ? null : group;
    for (const h of this.panelGroups3D) {
      const on = !this.selected || h.userData.group === this.selected;
      h.traverse((o) => {
        if (!o.isMesh) return;
        if (o.userData.isSkin) { o.visible = this.showSkin && on; return; }
        o.material.transparent = !on;
        o.material.opacity = on ? 1 : 0.12;
        o.material.depthWrite = on;
      });
    }
    // materials are shared per group, so reset any group not currently dimmed
    if (!this.selected) {
      for (const m of Object.values(this.groupMats || {})) {
        m.transparent = false; m.opacity = 1; m.depthWrite = true;
      }
    }
  }

  setSkin(on) {
    this.showSkin = on;
    this._rebuild();
    this.select(this.selected);
  }

  setSpin(on) {
    this.spin = on;
    this.controls.autoRotate = on;
  }

  frame() {
    if (!this.result) return;
    const H = this.result.stats.height;
    const D = Math.max(this.result.stats.widestDiameter || this.result.stats.baseDiameter, H) * 1.15;
    this.camera.position.set(D * 1.05, -D * 1.15, H * 0.85 + D * 0.25);
    this.controls.target.set(0, 0, H * 0.42);
    this.controls.update();
    this._resize();
  }

  snapshot() {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL("image/png");
  }
}

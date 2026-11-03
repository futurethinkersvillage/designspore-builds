// PLANNED Maker Space (Mike 10-30: "add lots more detail … decorate with plans … woodworking tools and machines, 3d
// printers, laser cutter, cnc, coworking tables … a little bit bigger"). A modern timber workshop barn, 16 × 24 m:
// charcoal board-and-batten walls with cedar trim, a dark standing-seam roof with solar on the west slope, a glulam
// portal on the south gable: a glazed gable over two glass roll-up doors (west one open), a lit sign. Down the east
// side, a covered work yard. Inside (the camera goes in, ch08), in zones from the doors to the back wall:
//   front-west  digital fab: CNC router, second small CNC, two laser cutters, sheet goods
//   front-east  coworking: three long tables with laptops and chairs, whiteboard, pendant lamps, coffee bar
//   west wall   the 3D-printer wall: shelving, printers with parts in progress, filament spools
//   middle      woodshop: table saw + outfeed, bandsaw, drill press, jointer, planer, router table, lathe, workbenches
//   east wall   pegboard tool wall, mitre-saw station, lumber rack, clamps
//   back        robot-arm cell, electronics benches, assembly table, dust collector with ducts overhead
// Plans everywhere: blueprint sheets pinned to the walls, framed drawings, plans spread on the benches.
import * as THREE from 'three';

export const meta = {
  name: 'Maker Space (planned)', layer: 'maker_space', match: 0, footprint: [16, 24], height: 11,
  place: { x: -32.5, y: 320, rotY: 0 }, // gable + doors face +Z = south, toward the campus
  sources: ['Deck: "Frontier hands, AI-native minds"', 'OUTLINE.md ch. 8'],
  notes: 'Planned. Modern timber workshop barn with a full interior; ch08 flies inside.',
};

const M = (color, rough = 0.8, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });

// a drawing on a sheet: blueprint blue or cream paper with line work, one of a few kinds
function planTex(kind, blue) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 360; const g = c.getContext('2d');
  g.fillStyle = blue ? '#1c3f73' : '#efe7d4'; g.fillRect(0, 0, 512, 360);
  const ink = blue ? '#dfeaf7' : '#2a2a34'; g.strokeStyle = ink; g.fillStyle = ink; g.lineWidth = 2;
  g.strokeRect(10, 10, 492, 340); g.strokeRect(370, 290, 132, 60); g.font = '600 15px Arial';
  g.fillText(['ZOME CABIN', 'CNC PARTS', 'SITE PLAN', 'ROBOT ARM', 'TRUSS DETAIL', 'STOOL'][kind % 6], 380, 315); g.font = '11px Arial'; g.fillText('SHEET ' + (kind + 1) + ' · 1:20', 380, 335);
  const dim = (x0, y0, x1, y1) => { g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.fillRect(x0 - 2, y0 - 2, 4, 4); g.fillRect(x1 - 2, y1 - 2, 4, 4); g.lineWidth = 2; };
  g.beginPath();
  if (kind % 6 === 0) {            // zome elevation: stacked rhombi
    for (let r = 0; r < 5; r++) { const w = 150 - r * 26, y = 270 - r * 42; for (let i = -3; i <= 3; i++) { const x = 190 + i * w / 3; g.moveTo(x - w / 6, y); g.lineTo(x, y - 42); g.lineTo(x + w / 6, y); } }
    g.moveTo(30, 275); g.lineTo(350, 275); g.stroke(); dim(40, 300, 340, 300);
  } else if (kind % 6 === 1) {     // nested CNC parts with holes
    for (const [x, y, w, h] of [[30, 30, 150, 90], [200, 30, 140, 60], [30, 140, 90, 150], [140, 110, 200, 70], [140, 200, 110, 90], [270, 200, 80, 90]]) { g.rect(x, y, w, h); for (let k = 0; k < 3; k++) { g.moveTo(x + 14 + k * w / 3 + 5, y + 14); g.arc(x + 14 + k * w / 3, y + 14, 5, 0, 7); } }
    g.stroke();
  } else if (kind % 6 === 2) {     // site plan: curves, paths, a ring of plots
    g.moveTo(30, 300); g.bezierCurveTo(120, 200, 180, 280, 340, 40); g.moveTo(60, 60); g.bezierCurveTo(140, 90, 180, 150, 330, 170);
    for (let a = 0; a < 6.28; a += 0.42) { const x = 200 + Math.cos(a) * 80, y = 170 + Math.sin(a) * 60; g.rect(x - 7, y - 5, 14, 10); }
    g.stroke();
  } else if (kind % 6 === 3) {     // robot arm side view
    g.rect(120, 280, 110, 24); g.moveTo(175, 280); g.lineTo(150, 170); g.lineTo(270, 110); g.lineTo(330, 170); g.moveTo(161, 170); g.arc(150, 170, 11, 0, 7); g.moveTo(281, 110); g.arc(270, 110, 11, 0, 7); g.stroke(); dim(120, 320, 330, 320);
  } else if (kind % 6 === 4) {     // truss detail
    g.moveTo(30, 260); g.lineTo(190, 60); g.lineTo(350, 260); g.lineTo(30, 260); for (let i = 1; i < 6; i++) { const x = 30 + i * 53.3; g.moveTo(x, 260); g.lineTo(190 + (i - 3) * 20, 60 + Math.abs(i - 3) * 50); } g.stroke(); dim(30, 285, 350, 285);
  } else {                         // a stool: three views
    for (const x of [40, 150, 260]) { g.rect(x, 90, 80, 16); g.moveTo(x + 10, 106); g.lineTo(x + 2, 260); g.moveTo(x + 70, 106); g.lineTo(x + 78, 260); g.moveTo(x + 6, 190); g.lineTo(x + 74, 190); } g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group(), hi = lod !== 'low';
  const W = 16, D = 24, HW = 5.6, RISE = 5.2, OH = 0.8;          // width (x), depth (z), wall height, roof rise, overhang
  const slope = Math.atan2(RISE, W / 2), rafter = Math.hypot(W / 2 + OH, RISE + OH * Math.tan(slope));

  // ---- materials ----
  const clad = M(0x2f2d2c, 0.9); clad.userData.noSurface = true;            // charred / dark-stained boards
  const batten = M(0x262423, 0.85); batten.userData.noSurface = true;
  const cedar = M(0xa86a3e, 0.75), glulam = M(0xb57a48, 0.6);
  const roofM = M(0x4b4f55, 0.55, 0.2); roofM.userData.noSurface = true;    // standing-seam steel
  const rib = M(0x5a5e64, 0.5, 0.2); rib.userData.noSurface = true;
  const conc = M(0x9d9a94, 0.95); conc.userData.noSurface = true;
  const floorM = M(0xffffff, 0.4, 0.05); floorM.userData.noSurface = true;  // polished concrete: mottled, with saw cuts every 4 m (i18: flat grey)
  { const c = document.createElement('canvas'); c.width = 1024; c.height = 1024; const x = c.getContext('2d'); x.fillStyle = '#8c8579'; x.fillRect(0, 0, 1024, 1024);
    let sd = 31; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 160; i++) { const px = rnd() * 1024, py = rnd() * 1024, r = 40 + rnd() * 150, gr = x.createRadialGradient(px, py, 0, px, py, r), d = rnd() > 0.5; gr.addColorStop(0, d ? 'rgba(92,86,76,.28)' : 'rgba(176,168,154,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(px - r, py - r, r * 2, r * 2); }
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${rnd() > 0.5 ? '50,46,40' : '190,184,170'},${rnd() * 0.16})`; x.fillRect(rnd() * 1024, rnd() * 1024, 1 + rnd() * 2, 1 + rnd() * 2); }
    x.fillStyle = 'rgba(48,44,38,.7)'; for (let i = 1; i < 4; i++) x.fillRect(i * 256, 0, 2, 1024); for (let i = 1; i < 6; i++) x.fillRect(0, i * 170.6, 1024, 2);
    floorM.map = new THREE.CanvasTexture(c); floorM.map.colorSpace = THREE.SRGBColorSpace; floorM.map.anisotropy = 8; }
  const glass = new THREE.MeshStandardMaterial({ color: 0x9fb4bf, roughness: 0.08, metalness: 0.4, transparent: true, opacity: 0.3, depthWrite: false });
  const frameM = M(0x1d1d1f, 0.5, 0.4); frameM.userData.noSurface = true;
  const pv = M(0x1a2740, 0.25, 0.5); pv.userData.noSurface = true;
  const pvFrame = M(0xb9bdc2, 0.4, 0.7); pvFrame.userData.noSurface = true;
  const warm = new THREE.MeshStandardMaterial({ color: 0xfff1dc, emissive: 0xffd9a8, emissiveIntensity: 1.4 });
  const ply = M(0xd9bd8f, 0.8), steel = M(0x9aa0a6, 0.4, 0.6), dark = M(0x232326, 0.55, 0.3), orange = M(0xEA824E, 0.5), green = M(0x3f6a4a, 0.6), yellow = M(0xe8c23a, 0.6), red = M(0xb5392e, 0.55), blueM = M(0x2d5fa8, 0.55), white = M(0xe6e4de, 0.6), oak = M(0xb08a58, 0.7), machine = M(0x3f6f8a, 0.5, 0.2);
  for (const m of [ply, steel, dark, orange, green, yellow, red, blueM, white, oak, machine]) m.userData.noSurface = true;
  const box = (m, w, h, d, x, y, z, p = g) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); p.add(o); return o; };
  const cyl = (m, rt, rb, h, x, y, z, p = g, seg = 12) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y, z); p.add(o); return o; };

  // ---- ground: slab, front apron, east work yard, a short gravel path ----
  box(conc, W + 0.6, 0.22, D + 0.6, 0, 0.11, 0);
  box(conc, W, 0.16, 6, 0, 0.08, D / 2 + 3.3);
  box(conc, 5.4, 0.16, D, W / 2 + 2.9, 0.08, 0);
  box(M(0xa49580, 1), 3.2, 0.06, 6, -W / 4, 0.03, D / 2 + 9).material.userData.noSurface = true;

  // ---- walls (solid boards round the openings, battens every 0.42 m) ----
  const B = 0.2, winW = 1.8, winH = 3.0, winY = B + 1.1;
  const westWins = [-9, -4.5, 0, 4.5, 9], eastWins = [-9.5, 9.5], eastDoor = [-3.2, 3.2];
  const wallPanel = (len, h, x, z, y0 = B) => box(clad, 0.18, h, len, x, y0 + h / 2, z);
  const sideWall = (sx, wins, opening) => {
    const cuts = [...wins.map(z => [z - winW / 2, z + winW / 2, winY, winY + winH]), ...(opening ? [[opening[0], opening[1], B, B + 4.4]] : [])].sort((a, b) => a[0] - b[0]);
    let z0 = -D / 2;
    for (const [a, b, y0, y1] of cuts) {
      if (a > z0) wallPanel(a - z0, HW, sx, (z0 + a) / 2);
      if (y0 > B + 0.01) wallPanel(b - a, y0 - B, sx, (a + b) / 2);
      const top = HW + B - y1; if (top > 0.01) wallPanel(b - a, top, sx, (a + b) / 2, y1);
      z0 = b;
    }
    if (z0 < D / 2) wallPanel(D / 2 - z0, HW, sx, (z0 + D / 2) / 2);
    for (const z of wins) {
      box(glass, 0.04, winH, winW, sx, winY + winH / 2, z);
      for (const dz of [-winW / 2, 0, winW / 2]) box(frameM, 0.12, winH, 0.07, sx, winY + winH / 2, z + dz);
      for (const y of [winY, winY + winH]) box(frameM, 0.12, 0.07, winW + 0.07, sx, y, z);
      box(cedar, 0.3, 0.08, winW + 0.3, sx + Math.sign(sx) * 0.1, winY - 0.05, z);
    }
  };
  sideWall(-W / 2, westWins, null);
  sideWall(W / 2, eastWins, eastDoor);
  // the big sliding barn door, slid open along the east wall
  const door = new THREE.Group(); door.position.set(W / 2 + 0.16, B + 2.25, 6.4); g.add(door);
  box(cedar, 0.08, 4.5, 3.3, 0, 0, 0, door);
  for (const s of [-1, 1]) { const brace = box(glulam, 0.06, 0.16, 5.4, 0.05, 0, 0, door); brace.rotation.x = s * 0.94; }
  box(frameM, 0.1, 0.1, 8.5, W / 2 + 0.2, B + 4.6, 3.2);
  // back wall + gable
  box(clad, W, HW, 0.18, 0, B + HW / 2, -D / 2);
  const gableShape = new THREE.Shape([new THREE.Vector2(-W / 2, 0), new THREE.Vector2(W / 2, 0), new THREE.Vector2(0, RISE)]);
  const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: 0.18, bevelEnabled: false });
  const backG = new THREE.Mesh(gableGeo, clad); backG.position.set(0, B + HW, -D / 2 - 0.09); g.add(backG);
  {
    const pts = [];
    const blocked = (side, z, y) => side === 'w' ? westWins.some(c => Math.abs(z - c) < winW / 2 + 0.05 && y > winY && y < winY + winH)
      : eastWins.some(c => Math.abs(z - c) < winW / 2 + 0.05 && y > winY && y < winY + winH) || (z > eastDoor[0] - 0.05 && z < eastDoor[1] + 0.05 && y < B + 4.45);
    for (let z = -D / 2 + 0.21; z < D / 2; z += 0.42) for (const [side, x] of [['w', -W / 2 - 0.11], ['e', W / 2 + 0.11]]) {
      let y0 = B, run = false;
      for (let y = B; y <= B + HW + 0.001; y += 0.1) {
        const b = blocked(side, z, y) || y >= B + HW;
        if (!b && !run) { y0 = y; run = true; }
        if (b && run) { pts.push([x, (y0 + y) / 2, z, y - y0, Math.PI / 2]); run = false; }
      }
    }
    for (let x = -W / 2 + 0.21; x < W / 2; x += 0.42) { const top = HW + RISE * (1 - Math.abs(x) / (W / 2)); pts.push([x, B + top / 2, -D / 2 - 0.11, top, 0]); }
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 1, 0.05), batten, pts.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    pts.forEach(([x, y, z, h, ry], i) => { q.setFromEuler(e.set(0, ry, 0)); m4.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, h, 1)); im.setMatrixAt(i, m4); });
    g.add(im);
  }
  for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) box(cedar, 0.3, HW, 0.3, x, B + HW / 2, z);
  for (const s of [-1, 1]) box(cedar, 0.12, 0.3, D + 2 * OH, s * (W / 2 + OH * 0.9), B + HW - 0.05, 0);

  // ---- roof ----
  for (const s of [-1, 1]) {
    const slab = new THREE.Group(); slab.position.set(s * (W / 4 + OH / 2), B + HW + (RISE - OH * Math.tan(slope)) / 2 + 0.1, 0);
    slab.rotation.z = -s * slope; g.add(slab);
    box(roofM, rafter, 0.14, D + 2 * OH, 0, 0, 0, slab);
    box(cedar, rafter, 0.1, D + 2 * OH, 0, -0.12, 0, slab);
    const n = Math.floor((D + 2 * OH) / 0.5);
    const ribs = new THREE.InstancedMesh(new THREE.BoxGeometry(rafter, 0.05, 0.04), rib, n + 1), m4 = new THREE.Matrix4();
    for (let i = 0; i <= n; i++) { m4.makeTranslation(0, 0.09, -D / 2 - OH + i * 0.5); ribs.setMatrixAt(i, m4); }
    slab.add(ribs);
    if (s < 0 && hi) for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) {
      const px = -rafter / 2 + 1.1 + r * 1.85, pz = -D / 2 + 1.4 + c * 1.95;
      box(pvFrame, 1.75, 0.05, 1.85, px, 0.16, pz, slab); box(pv, 1.66, 0.06, 1.76, px, 0.17, pz, slab);
    }
  }
  box(roofM, 0.5, 0.18, D + 2 * OH, 0, B + HW + RISE + 0.02, 0);

  // ---- the south front ----
  const FZ = D / 2;
  for (const x of [-W / 2 + 0.25, 0, W / 2 - 0.25]) box(glulam, 0.45, HW, 0.5, x, B + HW / 2, FZ + 0.05);
  box(glulam, W + 0.4, 0.6, 0.55, 0, B + HW - 0.1, FZ + 0.05);
  for (const s of [-1, 1]) { const r = box(glulam, Math.hypot(W / 2, RISE) + 1.0, 0.45, 0.5, s * W / 4, B + HW + RISE / 2, FZ + 0.05); r.rotation.z = -s * slope; }
  const gl = new THREE.Mesh(gableGeo, glass); gl.position.set(0, B + HW, FZ - 0.05); g.add(gl);
  for (const x of [-6, -4, -2, 0, 2, 4, 6]) { const h = RISE * (1 - Math.abs(x) / (W / 2)); box(frameM, 0.08, h, 0.1, x, B + HW + h / 2, FZ); }
  box(frameM, W * 0.66, 0.08, 0.1, 0, B + HW + RISE * 0.34, FZ);
  const DH = 4.6, DW = 7.3, dxs = [-W / 4 - 0.05, W / 4 + 0.05];
  {
    const x = dxs[1];
    box(glass, DW, DH, 0.05, x, B + DH / 2, FZ);
    for (let i = 0; i <= 5; i++) box(frameM, DW, 0.07, 0.08, x, B + i * DH / 5, FZ + 0.03);
    for (let i = 0; i <= 6; i++) box(frameM, 0.07, DH, 0.08, x - DW / 2 + i * DW / 6, B + DH / 2, FZ + 0.03);
  }
  box(frameM, DW, 0.5, 0.6, dxs[0], B + DH + 0.26, FZ - 0.25);
  box(glass, W - 1, HW - DH - 0.6, 0.05, 0, B + DH + 0.5 + (HW - DH - 0.6) / 2 - 0.1, FZ);
  {
    const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 96; const c = cv.getContext('2d');
    c.fillStyle = '#ffe2bd'; c.font = '600 64px Inter, Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('M A K E R   S P A C E', 512, 50);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 0.7), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
    sign.position.set(0, B + HW - 0.1, FZ + 0.34); g.add(sign); sign.material.userData.stage = 5;
  }
  for (const x of [-W / 2 + 0.6, W / 2 - 0.6]) box(warm, 0.3, 0.08, 0.3, x, B + HW - 0.45, FZ + 0.3);

  // ---- covered work yard, east side ----
  {
    const YW = 5.0, x0 = W / 2, hIn = HW - 0.3, hOut = 3.6;
    for (let z = -D / 2 + 0.3; z <= D / 2 - 0.2; z += (D - 0.5) / 5) box(glulam, 0.25, hOut, 0.25, x0 + YW, B + hOut / 2, z);
    box(glulam, 0.25, 0.35, D, x0 + YW, B + hOut, 0);
    const len = Math.hypot(YW + 0.5, hIn - hOut), ang = Math.atan2(hIn - hOut, YW + 0.5);
    const lean = box(roofM, len, 0.12, D + 0.6, x0 + YW / 2 + 0.2, B + (hIn + hOut) / 2 + 0.15, 0); lean.rotation.z = ang;
    const leanS = box(cedar, len, 0.06, D + 0.6, x0 + YW / 2 + 0.2, B + (hIn + hOut) / 2 + 0.06, 0); leanS.rotation.z = ang;
    if (hi) {
      for (const z of [-8, -3, 8.5]) {
        box(glulam, 2.4, 0.12, 0.9, x0 + 2.6, B + 0.92, z); for (const dx of [-1.05, 1.05]) for (const dz of [-0.35, 0.35]) box(glulam, 0.1, 0.9, 0.1, x0 + 2.6 + dx, B + 0.45, z + dz);
        box(ply, 0.9, 0.35, 0.5, x0 + 2.4, B + 1.15, z); box(steel, 0.2, 0.15, 0.25, x0 + 3.7, B + 1.05, z - 0.3);
      }
      for (const z of [-11, -9.6, -8.2]) { box(dark, 0.12, 2.6, 0.12, x0 + 4.6, B + 1.3, z); for (const y of [0.6, 1.2, 1.8, 2.4]) box(dark, 0.8, 0.06, 0.08, x0 + 4.2, B + y, z); }
      for (const y of [0.66, 1.26, 1.86]) for (let k = 0; k < 4; k++) box(ply, 0.14, 0.05, 3.6, x0 + 4.4 - k * 0.17, B + y, -9.6);
      box(ply, 0.08, 1.22, 2.44, x0 + 4.4, B + 0.7, 5).rotation.z = 0.12;
      box(steel, 0.6, 0.9, 0.6, x0 + 4.2, B + 0.45, 3);
    }
  }

  // ---- inside ----
  box(floorM, W - 0.4, 0.04, D - 0.4, 0, B + 0.02, 0);
  // lining: warm plywood walls seen from inside (open at the glass front and at the top, so the trusses show)
  const plyTex = (rx, ry) => {   // 4 x 8 sheets: grain, seams, a screw line (i17: bare flat tan walls)
    const c = document.createElement('canvas'); c.width = 256; c.height = 512; const x = c.getContext('2d');
    x.fillStyle = '#b79a76'; x.fillRect(0, 0, 256, 512);
    let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 240; i++) { x.strokeStyle = rnd() > 0.5 ? `rgba(120,90,58,${0.05 + rnd() * 0.12})` : `rgba(226,200,160,${0.05 + rnd() * 0.12})`; x.lineWidth = 0.6 + rnd() * 2.4; const px = rnd() * 256; x.beginPath(); x.moveTo(px, 0); x.bezierCurveTo(px + rnd() * 14 - 7, 170, px + rnd() * 14 - 7, 340, px + rnd() * 10 - 5, 512); x.stroke(); }
    x.fillStyle = 'rgba(58,42,28,.55)'; x.fillRect(0, 0, 2, 512); x.fillRect(0, 0, 256, 2);
    x.fillStyle = 'rgba(70,52,34,.5)'; for (let i = 0; i < 9; i++) { x.fillRect(10, 28 + i * 56, 2, 2); x.fillRect(244, 28 + i * 56, 2, 2); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; return t;
  };
  let softTex; const softEdge = () => { if (softTex) return softTex; const c = document.createElement('canvas'); c.width = 64; c.height = 4; const x = c.getContext('2d'), gr = x.createLinearGradient(0, 0, 64, 0); gr.addColorStop(0, '#000'); gr.addColorStop(0.5, '#fff'); gr.addColorStop(1, '#000'); x.fillStyle = gr; x.fillRect(0, 0, 64, 4); return softTex = new THREE.CanvasTexture(c); };
  const lining = new THREE.MeshBasicMaterial({ color: 0xb79a76, side: THREE.BackSide });   // one even wall tone, lit by the room (i15: grey long wall, tan end wall)
  const liningLong = new THREE.MeshBasicMaterial({ map: plyTex((D - 0.5) / 1.22, (HW + 0.2) / 2.44), side: THREE.BackSide }), liningEnd = new THREE.MeshBasicMaterial({ map: plyTex((W - 0.5) / 1.22, (HW + 0.2) / 2.44), side: THREE.BackSide });
  const none = new THREE.MeshBasicMaterial({ visible: false });
  const inner = new THREE.Mesh(new THREE.BoxGeometry(W - 0.5, HW + 0.2, D - 0.5), [liningLong, liningLong, none, lining, none, liningEnd]); inner.position.set(0, B + (HW + 0.2) / 2, 0);
  g.add(inner);
  { // the walls fall off into shade at the floor and under the eaves
    const c = document.createElement('canvas'); c.width = 4; c.height = 128; const x = c.getContext('2d'), gr = x.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, '#6a6a6a'); gr.addColorStop(0.3, '#000'); gr.addColorStop(0.72, '#000'); gr.addColorStop(1, '#8a8a8a'); x.fillStyle = gr; x.fillRect(0, 0, 4, 128);
    const sh = new THREE.MeshBasicMaterial({ color: 0x1a120a, alphaMap: new THREE.CanvasTexture(c), transparent: true, side: THREE.BackSide, depthWrite: false });
    const o = new THREE.Mesh(new THREE.BoxGeometry(W - 0.52, HW + 0.18, D - 0.52), [sh, sh, none, none, none, sh]); o.position.copy(inner.position); g.add(o); }
  // daylight in the window openings and the east door, seen from inside
  const viewTex = new THREE.TextureLoader().load('data/window_view.jpg'); viewTex.colorSpace = THREE.SRGBColorSpace;   // the real view (Photos/Nature/20210626_191119; i17: painted cut-out trees)
  const sky = new THREE.MeshBasicMaterial({ map: viewTex }), IX = W / 2 - 0.27;   // the forest through the windows (i11: blank white)
  for (const z of westWins) { const p = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), sky); p.position.set(-IX, winY + winH / 2, z); p.rotation.y = Math.PI / 2; g.add(p); for (const dz of [-winW / 2, 0, winW / 2]) box(frameM, 0.04, winH, 0.06, -IX + 0.02, winY + winH / 2, z + dz); for (const y of [winY, winY + winH / 2, winY + winH]) box(frameM, 0.04, 0.06, winW, -IX + 0.02, y, z); }
  for (const z of eastWins) { const p = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), sky); p.position.set(IX, winY + winH / 2, z); p.rotation.y = -Math.PI / 2; g.add(p); for (const dz of [-winW / 2, 0, winW / 2]) box(frameM, 0.04, winH, 0.06, IX - 0.02, winY + winH / 2, z + dz); }
  { const p = new THREE.Mesh(new THREE.PlaneGeometry(eastDoor[1] - eastDoor[0], 4.4), new THREE.MeshBasicMaterial({ map: viewTex || (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 176; const x = c.getContext('2d'), v = x.createLinearGradient(0, 0, 0, 176); v.addColorStop(0, '#dbe9ef'); v.addColorStop(0.58, '#eef3ee'); v.addColorStop(0.6, '#3d5a38'); v.addColorStop(0.72, '#5a6b3f'); v.addColorStop(0.74, '#8f8a80'); v.addColorStop(1, '#a5a198'); x.fillStyle = v; x.fillRect(0, 0, 256, 176); x.fillStyle = '#2c4a30'; for (let i = 0; i < 14; i++) { const X = i * 19 + 4, h = 30 + (i * 37 % 26); x.beginPath(); x.moveTo(X - 9, 106); x.lineTo(X, 106 - h); x.lineTo(X + 9, 106); x.fill(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })() })); p.position.set(IX, B + 2.2, (eastDoor[0] + eastDoor[1]) / 2); p.rotation.y = -Math.PI / 2; g.add(p); }
  // the east opening reads as glazed doors, not a picture (i12)
  for (let i = 0; i <= 4; i++) box(frameM, 0.07, 4.4, 0.09, IX - 0.03, B + 2.2, eastDoor[0] + i * (eastDoor[1] - eastDoor[0]) / 4);
  for (const y of [0.02, 1.47, 2.93, 4.38]) box(frameM, 0.07, 0.09, eastDoor[1] - eastDoor[0], IX - 0.03, B + y, 0);
  // exposed roof trusses + ceiling boards, and the light rails
  const ceil = M(0xc9a57a, 0.8, 0, { side: THREE.DoubleSide });
  for (const s of [-1, 1]) { const c = box(ceil, Math.hypot(W / 2, RISE) - 0.1, 0.05, D - 0.5, s * W / 4, B + HW + RISE / 2 - 0.34, 0); c.rotation.z = -s * slope; }
  for (let z = -D / 2 + 2; z < D / 2 - 1; z += 4) {
    box(glulam, W - 0.5, 0.32, 0.18, 0, B + HW - 0.05, z);
    for (const s of [-1, 1]) { const r = box(glulam, Math.hypot(W / 2, RISE) - 0.2, 0.28, 0.16, s * W / 4, B + HW + RISE / 2 - 0.5, z); r.rotation.z = -s * slope; }
    box(glulam, 0.14, RISE - 0.6, 0.14, 0, B + HW + (RISE - 0.6) / 2, z);
  }
  for (const x of [-5, 0, 5]) { box(warm, 0.16, 0.06, D - 3, x, B + HW - 0.6, 0); box(dark, 0.2, 0.05, D - 3, x, B + HW - 0.55, 0); const pool = new THREE.Mesh(new THREE.PlaneGeometry(3.4, D - 2).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffd9a8, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, alphaMap: softEdge() })); pool.position.set(x, B + 0.05, 0); g.add(pool); }

  if (hi) {
    const I = new THREE.Group(); I.name = 'interior'; I.position.y = B; g.add(I);
    // soft contact shadows under everything that stands on the floor (i11: furniture floated, 'catalogue' look)
    const aoTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), r = x.createRadialGradient(32, 32, 6, 32, 32, 32); r.addColorStop(0, 'rgba(20,14,10,.62)'); r.addColorStop(0.7, 'rgba(20,14,10,.34)'); r.addColorStop(1, 'rgba(20,14,10,0)'); x.fillStyle = r; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const aoM = new THREE.MeshBasicMaterial({ map: aoTex, transparent: true, depthWrite: false });
    for (const [x, z, w, d] of [[-4.2, 8.2, 4.2, 2.9], [-6.7, 5.2, 1.8, 1.8], [-1.4, 9.6, 2.3, 1.8], [-1.4, 7.2, 2.3, 1.8], [2.5, 9, 3.6, 2.6], [2.5, 5.8, 3.6, 2.6], [5.8, 7.4, 3.6, 2.6], [-1.8, 1.5, 2.5, 2.0], [-1.8, 0.15, 2.5, 2.2], [1.6, 3.4, 1.1, 1.1], [3.0, 1.0, 0.9, 0.9], [-1.9, -2.4, 1.1, 2.7], [0.3, -2.5, 1.4, 1.7], [3.4, -2.3, 2.2, 1.0], [4.6, 3.2, 1.8, 1.4], [0, 0.6, 3.2, 1.8], [-3.8, -7.6, 2.2, 2.2], [-0.2, -6.8, 3.6, 2.3], [0.1, -10.6, 3.4, 1.7], [3.1, -10.6, 3.4, 1.7], [-6.8, -10.6, 1.6, 1.6], [W / 2 - 0.8, -7.6, 1.6, 7.6], [-W / 2 + 0.6, -6.4, 1.3, 4.2], [-W / 2 + 0.6, -2.7, 1.3, 4.2], [-W / 2 + 0.6, 1.0, 1.3, 4.2], [W / 2 - 0.8, -2.6, 1.4, 3.8], [W / 2 - 0.7, 5.6, 1.4, 3.2]]) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), aoM); s.position.set(x, 0.06, z); s.renderOrder = 1; I.add(s);
    }
    const legs = (w, d, h, x, z, m = dark, p = I) => { for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(m, 0.07, h, 0.07, x + sx * (w / 2 - 0.08), h / 2, z + sz * (d / 2 - 0.08), p); };
    const bench = (w, d, x, z, top = oak) => { box(top, w, 0.08, d, x, 0.92, z, I); legs(w, d, 0.88, x, z); box(dark, w - 0.2, 0.04, d - 0.2, x, 0.3, z, I); };
    const stool = (x, z) => { cyl(oak, 0.17, 0.17, 0.05, x, 0.68, z, I, 10); cyl(steel, 0.02, 0.03, 0.66, x, 0.33, z, I, 6); };
    const chair = (x, z, ry = 0) => { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; I.add(c); box(oak, 0.44, 0.05, 0.44, 0, 0.46, 0, c); box(oak, 0.44, 0.42, 0.04, 0, 0.72, -0.2, c); legs(0.44, 0.44, 0.45, 0, 0, dark, c); };

    // ---------- plans on the walls: pinned sheets and framed drawings ----------
    const sheet = (kind, blue, w, h, x, y, z, ry, framed = false) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: planTex(kind, blue), roughness: 0.85 })); m.material.userData.noSurface = true;
      m.position.set(x, y, z); m.rotation.y = ry; I.add(m);
      if (framed) { const b = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.12, h + 0.12), frameM); b.position.set(x - Math.sin(ry) * 0.012, y, z - Math.cos(ry) * 0.012); b.rotation.y = ry; I.add(b); }
    };
    const WX = W / 2 - 0.3, BZ = -D / 2 + 0.3;
    for (let i = 0; i < 7; i++) sheet(i, i % 2 === 0, 1.7, 1.2, -5.4 + i * 1.8, 3.35, BZ, 0);              // back wall, a long row
    for (let i = 0; i < 4; i++) sheet(i + 2, i % 2 === 1, 1.5, 1.05, -3.2 + i * 1.8, 1.95, BZ, 0, true);   // and framed below
    for (const [i, z] of [[0, -6.8], [1, -2.2], [2, 2.2], [3, 6.8]]) sheet(i, true, 1.5, 1.05, -WX, 3.6, z, Math.PI / 2);   // between the west windows, high
    for (const [i, z] of [[4, -7], [5, -5.2], [2, 5], [0, 7]]) sheet(i, i % 2 === 0, 1.6, 1.1, WX, 3.7, z, -Math.PI / 2, true);   // east wall

    // ---------- front-west: digital fab ----------
    const cnc = new THREE.Group(); cnc.position.set(-4.2, 0, 8.2); I.add(cnc);                              // 4×8 CNC router
    legs(3.0, 1.7, 0.8, 0, 0, steel, cnc); box(dark, 3.0, 0.12, 1.7, 0, 0.84, 0, cnc); box(ply, 2.9, 0.04, 1.55, 0, 0.92, 0, cnc);
    for (const dx of [-1.2, -0.6, 0, 0.6, 1.2]) box(oak, 0.42, 0.015, 1.3, dx, 0.95, 0, cnc);               // parts cut in the sheet
    for (const dz of [-0.92, 0.92]) { box(dark, 3.1, 0.1, 0.1, 0, 0.98, dz, cnc); box(dark, 0.18, 0.75, 0.12, 0.3, 1.3, dz, cnc); }
    box(dark, 0.18, 0.16, 1.95, 0.3, 1.68, 0, cnc); box(orange, 0.26, 0.48, 0.24, 0.3, 1.38, 0.15, cnc); cyl(steel, 0.05, 0.03, 0.2, 0.3, 1.05, 0.15, cnc, 8);
    box(dark, 0.5, 1.3, 0.35, 1.9, 0.65, -0.6, cnc); box(warm, 0.34, 0.24, 0.02, 1.9, 1.05, -0.42, cnc);    // control tower with a screen
    const miniCnc = new THREE.Group(); miniCnc.position.set(-6.7, 0, 5.2); I.add(miniCnc);                  // desktop CNC on a stand
    legs(1.0, 1.0, 0.8, 0, 0, dark, miniCnc); box(oak, 1.0, 0.05, 1.0, 0, 0.82, 0, miniCnc); box(steel, 0.8, 0.05, 0.8, 0, 0.88, 0, miniCnc); box(dark, 0.08, 0.5, 0.08, -0.38, 1.1, 0, miniCnc); box(dark, 0.08, 0.5, 0.08, 0.38, 1.1, 0, miniCnc); box(dark, 0.84, 0.08, 0.08, 0, 1.35, 0, miniCnc); box(orange, 0.12, 0.22, 0.12, 0.1, 1.2, 0, miniCnc);
    for (const [x, z] of [[-1.4, 9.6], [-1.4, 7.2]]) {                                                      // two laser cutters
      box(dark, 1.5, 0.95, 1.0, x, 0.48, z, I); box(warm, 1.25, 0.03, 0.7, x, 0.97, z, I);
      const lid = box(M(0x7a3f1c, 0.2, 0, { transparent: true, opacity: 0.55 }), 1.3, 0.34, 0.78, x, 1.15, z, I); lid.material.userData.noSurface = true; box(dark, 0.12, 0.2, 0.12, x + 0.62, 1.08, z - 0.4, I);
      cyl(steel, 0.07, 0.07, 1.6, x + 0.9, 1.3, z - 0.4, I, 8);
    }
    box(ply, 0.06, 1.22, 2.44, -7.5, 0.75, 8.8, I).rotation.z = 0.08; box(oak, 0.06, 1.22, 2.44, -7.43, 0.75, 8.8, I).rotation.z = 0.08;   // sheet goods against the wall

    // ---------- front-east: coworking ----------
    for (const [x, z] of [[2.5, 9], [2.5, 5.8], [5.8, 7.4]]) {
      box(oak, 2.6, 0.06, 1.0, x, 0.74, z, I); legs(2.6, 1.0, 0.72, x, z);
      for (const dx of [-0.8, 0, 0.8]) for (const s of [-1, 1]) {
        chair(x + dx, z + s * 0.72, s > 0 ? Math.PI : 0);
        box(dark, 0.34, 0.02, 0.24, x + dx, 0.78, z + s * 0.24, I); const sc = box(warm, 0.32, 0.2, 0.01, x + dx, 0.88, z + s * 0.14, I); sc.rotation.x = -s * 0.25;
        if (dx === 0) cyl(s > 0 ? white : orange, 0.04, 0.035, 0.09, x + dx + 0.28, 0.82, z + s * 0.2, I, 8);   // a mug
      }
      for (const dx of [-0.9, 0.9]) { cyl(dark, 0.006, 0.006, 2.9, x + dx, 3.4, z, I, 4); cyl(warm, 0.14, 0.2, 0.14, x + dx, 1.92, z, I, 10); }   // pendant lamps
    }
    box(white, 0.04, 1.2, 2.4, WX, 1.7, 8.9, I);                                                            // a whiteboard, with sketches
    for (let i = 0; i < 5; i++) box(i % 2 ? blueM : red, 0.02, 0.02, 0.5 + i * 0.1, WX - 0.03, 1.4 + i * 0.13, 8.6 + (i % 2) * 0.5, I);
    box(oak, 0.8, 0.95, 2.6, WX - 0.4, 0.48, 5.6, I); box(steel, 0.42, 0.42, 0.42, WX - 0.4, 1.17, 4.9, I); box(red, 0.28, 0.32, 0.32, WX - 0.4, 1.12, 5.7, I); for (let i = 0; i < 4; i++) cyl(white, 0.04, 0.035, 0.09, WX - 0.5, 1.0, 6.2 + i * 0.13, I, 8);   // coffee bar

    // ---------- west wall: the 3D-printer wall ----------
    const pw = new THREE.Group(); pw.position.set(-W / 2 + 0.6, 0, -2); I.add(pw);
    for (let u = 0; u < 3; u++) {
      const zc = -4.4 + u * 3.7;
      for (const y of [0.05, 0.8, 1.55, 2.3]) box(steel, 0.7, 0.04, 3.5, 0, y, zc, pw);
      for (const dz of [-1.73, 1.73]) box(steel, 0.7, 2.5, 0.05, 0, 1.25, zc + dz, pw);
      for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) {
        const y = 0.07 + r * 0.75, z = zc - 1.25 + k * 0.83;
        for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) box(dark, 0.025, 0.55, 0.025, 0.02 + dx, y + 0.28, z + dz, pw);   // open frame
        box(dark, 0.44, 0.025, 0.44, 0.02, y + 0.56, z, pw); box(dark, 0.44, 0.05, 0.44, 0.02, y + 0.03, z, pw);
        box(steel, 0.4, 0.02, 0.03, 0.02, y + 0.42, z, pw); box(orange, 0.07, 0.07, 0.07, 0.02 + (k - 1.5) * 0.08, y + 0.4, z, pw);   // gantry + hot end
        box((r + k) % 3 === 0 ? orange : (r + k) % 3 === 1 ? blueM : white, 0.16, 0.06 + ((r * 3 + k) % 5) * 0.05, 0.16, 0.02, y + 0.1 + ((r * 3 + k) % 5) * 0.025, z, pw);   // a part in progress
        const sp = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.03, 6, 12), [orange, green, blueM, red, yellow][(r + k * 2) % 5]); sp.position.set(0.02, y + 0.66, z); sp.rotation.y = Math.PI / 2; pw.add(sp);
      }
    }

    // ---------- middle: the woodshop ----------
    const saw = new THREE.Group(); saw.position.set(-1.8, 0, 1.5); I.add(saw);                              // table saw + outfeed
    box(machine, 0.75, 0.8, 0.75, 0, 0.4, 0, saw); box(steel, 1.6, 0.05, 1.1, 0, 0.87, 0, saw); box(yellow, 1.7, 0.05, 0.07, 0, 0.92, 0.5, saw); box(red, 0.08, 0.14, 0.5, 0, 0.92, -0.1, saw);
    box(oak, 1.6, 0.05, 1.5, 0, 0.87, -1.35, saw); legs(1.6, 1.5, 0.85, 0, -1.35, dark, saw);
    const band = new THREE.Group(); band.position.set(1.6, 0, 3.4); I.add(band);                            // bandsaw
    box(machine, 0.5, 1.0, 0.5, 0, 0.5, 0, band); box(steel, 0.6, 0.04, 0.6, 0, 1.03, 0, band); box(machine, 0.45, 0.8, 0.22, 0, 1.5, -0.05, band); cyl(machine, 0.27, 0.27, 0.2, 0, 1.95, -0.05, band); box(steel, 0.02, 0.5, 0.02, 0, 1.25, 0.14, band);
    const press = new THREE.Group(); press.position.set(3.0, 0, 1.0); I.add(press);                         // drill press
    cyl(steel, 0.05, 0.05, 1.65, 0, 0.83, 0, press, 8); box(dark, 0.4, 0.06, 0.4, 0, 0.03, 0, press); box(steel, 0.32, 0.03, 0.32, 0, 0.8, 0.12, press); box(machine, 0.22, 0.28, 0.42, 0, 1.45, 0.08, press); cyl(dark, 0.1, 0.1, 0.22, 0, 1.68, -0.08, press, 10); cyl(steel, 0.02, 0.012, 0.24, 0, 1.2, 0.2, press, 6);
    const jointer = new THREE.Group(); jointer.position.set(-1.9, 0, -2.4); I.add(jointer);                 // jointer
    box(machine, 0.45, 0.75, 1.1, 0, 0.38, 0, jointer); box(steel, 0.42, 0.04, 2.0, 0, 0.82, 0, jointer); box(yellow, 0.12, 0.08, 0.3, 0.14, 0.87, 0.1, jointer);
    const planer = new THREE.Group(); planer.position.set(0.3, 0, -2.5); I.add(planer);                     // thickness planer on a cart
    legs(0.75, 0.9, 0.65, 0, 0, dark, planer); box(machine, 0.7, 0.34, 0.5, 0, 0.84, 0, planer); box(steel, 0.55, 0.03, 1.2, 0, 0.7, 0, planer);
    const lathe = new THREE.Group(); lathe.position.set(3.4, 0, -2.3); I.add(lathe);                        // wood lathe
    for (const dx of [-0.65, 0.65]) box(dark, 0.08, 0.8, 0.4, dx, 0.4, 0, lathe);
    box(steel, 1.5, 0.08, 0.2, 0, 0.84, 0, lathe); box(machine, 0.28, 0.3, 0.24, -0.62, 1.03, 0, lathe); box(dark, 0.14, 0.2, 0.14, 0.6, 0.98, 0, lathe); cyl(oak, 0.05, 0.05, 0.9, 0, 1.06, 0, lathe, 10).rotation.z = Math.PI / 2;
    const rt = new THREE.Group(); rt.position.set(4.6, 0, 3.2); I.add(rt);                                  // router table
    box(oak, 1.1, 0.06, 0.7, 0, 0.88, 0, rt); legs(1.1, 0.7, 0.85, 0, 0, dark, rt); box(dark, 0.6, 0.08, 0.05, 0, 0.95, 0.1, rt); cyl(steel, 0.02, 0.02, 0.05, 0, 0.93, -0.02, rt, 6);
    bench(2.4, 1.0, 0.0, 0.6); box(ply, 0.8, 0.28, 0.5, -0.5, 1.1, 0.6, I); box(steel, 0.26, 0.18, 0.3, 1.05, 1.05, 0.25, I);   // workbench with a vise + a box in progress
    { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.64), new THREE.MeshStandardMaterial({ map: planTex(5, true), roughness: 0.9 })); p.rotation.x = -Math.PI / 2; p.position.set(0.55, 0.97, 0.7); I.add(p); }   // a plan spread on it
    stool(0.6, 1.5); stool(-0.8, 1.5);

    // ---------- east wall: pegboard + mitre station + lumber ----------
    const peg = M(0xb89a6e, 0.85); peg.userData.noSurface = true;
    box(peg, 0.04, 1.6, 9, WX, 1.9, -7.2, I);
    { const cols = [dark, orange, steel, red, blueM, yellow]; for (let i = 0; i < 46; i++) { const z = -11.4 + (i % 23) * 0.37, y = i < 23 ? 2.25 : 1.6, h = 0.18 + (i * 7 % 5) * 0.06; box(cols[i * 5 % 6], 0.04, h, 0.05 + (i % 3) * 0.04, WX - 0.04, y, z, I); } }   // chisels, squares, saws, drivers
    for (let i = 0; i < 8; i++) { box(steel, 0.04, 0.5, 0.03, WX - 0.05, 1.0, -11 + i * 0.22, I); box(red, 0.05, 0.1, 0.06, WX - 0.05, 1.28, -11 + i * 0.22, I); }   // clamps
    box(oak, 0.8, 0.08, 7, WX - 0.5, 0.92, -7.6, I); for (const z of [-10.8, -7.6, -4.4]) legs(0.8, 0.5, 0.88, WX - 0.5, z);   // long bench
    box(dark, 0.45, 0.3, 0.5, WX - 0.5, 1.1, -7.6, I); box(steel, 0.4, 0.05, 0.05, WX - 0.5, 1.27, -7.6, I).rotation.x = 0.4; cyl(steel, 0.17, 0.17, 0.02, WX - 0.7, 1.22, -7.6, I, 16).rotation.z = Math.PI / 2;   // mitre saw
    for (const [m, h, w, z] of [[red, 0.2, 0.3, -9.4], [yellow, 0.25, 0.2, -9.9], [orange, 0.22, 0.25, -10.4]]) box(m, w, h, 0.3, WX - 0.5, 1.07, z, I);   // power tools
    for (const z of [-3.6, -2.6, -1.6]) { box(dark, 0.1, 3.0, 0.1, WX - 0.1, 1.5, z, I); for (const y of [0.5, 1.1, 1.7, 2.3]) box(dark, 0.7, 0.05, 0.07, WX - 0.45, y, z, I); }
    for (const y of [0.56, 1.16, 1.76]) for (let k = 0; k < 4; k++) box(k % 2 ? oak : ply, 0.13, 0.05, 2.8, WX - 0.2 - k * 0.15, y, -2.6, I);   // lumber rack

    // ---------- back: robot cell, electronics, assembly ----------
    const cell = new THREE.Group(); cell.position.set(-3.8, 0, -7.6); I.add(cell);
    box(steel, 1.4, 0.8, 1.4, 0, 0.4, 0, cell);
    const arm = new THREE.Group(); arm.position.set(0, 0.8, 0); cell.add(arm);
    cyl(dark, 0.24, 0.26, 0.2, 0, 0.1, 0, arm, 14);
    const j1 = new THREE.Group(); j1.position.y = 0.25; j1.rotation.y = 0.6; arm.add(j1);
    const up = new THREE.Group(); up.rotation.z = 0.35; j1.add(up); box(orange, 0.18, 0.95, 0.18, 0, 0.47, 0, up);
    const el = new THREE.Group(); el.position.y = 0.95; el.rotation.z = -1.4; up.add(el); box(orange, 0.14, 0.8, 0.14, 0, 0.4, 0, el); cyl(dark, 0.08, 0.08, 0.18, 0, 0.85, 0, el, 10); box(steel, 0.16, 0.08, 0.05, 0, 0.98, 0, el);
    for (const [dx, dz, w, d] of [[0, -1.4, 2.8, 0.07], [0, 1.4, 2.8, 0.07], [-1.4, 0, 0.07, 2.8], [1.4, 0, 0.07, 2.8]]) box(yellow, w, 0.012, d, dx, 0.03, dz, cell);
    for (const x of [-0.4, 2.6]) { bench(2.6, 0.9, x + 0.1, -10.6); for (let i = 0; i < 3; i++) { box(dark, 0.42, 0.26, 0.3, x - 0.7 + i * 0.85, 1.09, -10.75, I); box(i % 2 ? green : warm, 0.3, 0.14, 0.01, x - 0.7 + i * 0.85, 1.1, -10.59, I); } stool(x + 0.1, -9.8); }   // electronics: scopes, supplies, soldering
    box(oak, 2.8, 0.1, 1.5, -0.2, 0.86, -6.8, I); legs(2.8, 1.5, 0.82, -0.2, -6.8); box(ply, 1.1, 0.5, 0.7, -0.6, 1.16, -6.8, I); box(white, 0.5, 0.26, 0.4, 0.55, 1.04, -6.6, I);   // assembly table with a build on it
    { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), new THREE.MeshStandardMaterial({ map: planTex(3, false), roughness: 0.9 })); p.rotation.x = -Math.PI / 2; p.rotation.z = 0.15; p.position.set(0.6, 0.92, -7.1); I.add(p); }

    // ---------- dust collection: cyclone + a duct run overhead down to the machines ----------
    const duct = M(0x7c848e, 0.45, 0.4); duct.userData.noSurface = true;
    cyl(duct, 0.45, 0.45, 1.4, -6.8, 1.75, -10.6, I, 14); { const c = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.9, 14).rotateX(Math.PI), duct); c.position.set(-6.8, 0.6, -10.6); I.add(c); } cyl(dark, 0.3, 0.3, 0.3, -6.8, 0.15, -10.6, I, 12);
    cyl(duct, 0.11, 0.11, 14, -1.0, 4.4, -3.6, I, 10).rotation.x = Math.PI / 2; cyl(duct, 0.11, 0.11, 5.8, -3.9, 4.4, -10.6, I, 10).rotation.z = Math.PI / 2;
    for (const z of [1.5, -2.4]) { box(duct, 0.1, 3.4, 0.1, -1.0, 2.7, z, I); box(duct, 0.8, 0.1, 0.1, -1.4, 1.05, z, I); }
    // the room in use (i16: bare and flat): stools, offcuts, sheet goods against the wall, work in progress, power drops, sun on the floor
    for (const [x, z] of [[-1.5, -5.6], [0.7, -5.6], [-1.5, -8], [0.7, -8], [1.2, -10], [-0.6, -10]]) { cyl(dark, 0.17, 0.17, 0.05, x, 0.68, z, I, 10); cyl(steel, 0.02, 0.03, 0.66, x, 0.33, z, I, 6); cyl(steel, 0.15, 0.17, 0.02, x, 0.03, z, I, 10); }
    box(steel, 0.7, 0.55, 0.5, WX - 0.6, 0.28, 3.4, I); for (let i = 0; i < 7; i++) box(i % 2 ? oak : ply, 0.09, 0.5 + (i * 37 % 5) * 0.09, 0.09, WX - 0.85 + i * 0.08, 0.7, 3.25 + (i % 3) * 0.13, I);
    for (let i = 0; i < 3; i++) { const s = box(ply, 1.2, 2.3, 0.02, -WX + 0.25 + i * 0.05, 1.15, 7.2 + i * 0.04, I); s.rotation.y = Math.PI / 2; s.rotation.x = 0.08; }
    for (const [x, z, h] of [[-3.2, -4.5, 0.26], [2.1, 1.4, 0.34], [-1.2, 5.2, 0.2]]) { box(oak, 0.4, h, 0.32, x, 0.93 + h / 2, z, I); cyl(orange, 0.04, 0.04, 0.18, x + 0.32, 1.02, z + 0.1, I, 8); }
    for (const [x, z] of [[-3.6, -7.4], [2.6, -2.2], [-2.8, 3.1], [3.2, 6.6]]) { cyl(dark, 0.012, 0.012, 3, x, 3, z, I, 5); box(red, 0.12, 0.2, 0.08, x, 1.45, z, I); }
    { const sun = new THREE.MeshBasicMaterial({ color: 0xffd9a8, transparent: true, opacity: 0.11, blending: THREE.AdditiveBlending, depthWrite: false }); sun.userData.noSurface = true;
      for (const z of [-8, -3, 2, 7]) for (const dz of [-0.75, 0.75]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.2).rotateX(-Math.PI / 2), sun); p.position.set(WX - 2.2, 0.04, z + dz); p.rotation.y = 0.28; I.add(p); } }
    // a rolling tool chest, a fire extinguisher, a first-aid box
    box(red, 0.45, 0.9, 0.6, WX - 1.3, 0.48, -5.2, I); for (let i = 0; i < 5; i++) box(steel, 0.02, 0.02, 0.54, WX - 1.54, 0.15 + i * 0.17, -5.2, I);
    cyl(red, 0.08, 0.08, 0.45, -WX + 0.15, 0.3, 10.8, I, 10); box(white, 0.04, 0.3, 0.4, WX, 1.5, 11, I);
  }
  // build stage per material, read by film.js when the barn goes up in ch08 (r1103: growing merged pieces from the ground looked like a broken render)
  const STAGE = new Map([[conc, 0], [floorM, 0], [glulam, 1], [frameM, 1], [cedar, 1], [clad, 2], [batten, 2], [lining, 2], [liningLong, 2], [glass, 3], [sky, 3], [roofM, 4], [rib, 4], [pv, 4], [pvFrame, 4], [ceil, 4], [warm, 5]]);
  g.traverse(o => { if (o.isMesh && !Array.isArray(o.material) && STAGE.has(o.material)) o.material.userData.stage = STAGE.get(o.material); });
  return g;
}

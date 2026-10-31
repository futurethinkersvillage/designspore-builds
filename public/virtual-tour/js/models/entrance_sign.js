// The resort's entrance sign (Photos/Entrance/01.jpg): two big peeled-log posts stained red-orange under a log beam with
// the "Welcome to" board hung from it on chains, ladders of small boards on chains either side, a shingle-roofed white
// kiosk with the RV/Campground board between the posts, and a short log at each foot with an arrow plate.
// Units metres, origin = ground centre between the posts, the sign faces +Z.
import * as THREE from 'three';

export const meta = { name: 'Entrance sign', footprint: [8.4, 1.6], height: 5.4, sources: ['Photos/Entrance/01.jpg'], notes: 'Sizes from the photo, taking the posts as ~0.55 m diameter.' };

const STAIN = '#b5583a', BOARD_EDGE = '#a4492f', CREAM = '#f5f1e6', INK = '#27241f', RED = '#c6322a';
const LEFT = ['9-Challenging Holes', 'Reasonable Rates', 'Club & Cart Rentals', 'INFORMATION', 'Licensed Pro Shop'];
const RIGHT = ['Full Service RV Sites', 'Deluxe Shower House', 'Covered Tent Sites', 'Sani Station', 'Laundromat', 'Tournaments Welcome'];

function tex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function arrow(g, x, y, L, H = 10) { g.fillStyle = RED; g.fillRect(x, y - H * 0.18, L - H, H * 0.36); g.beginPath(); g.moveTo(x + L, y); g.lineTo(x + L - H * 1.3, y - H * 0.55); g.lineTo(x + L - H * 1.3, y + H * 0.55); g.fill(); }
const boardTex = text => tex(512, 112, (g, w, h) => {
  g.fillStyle = BOARD_EDGE; g.fillRect(0, 0, w, h); g.fillStyle = CREAM; g.fillRect(16, 22, w - 32, h - 44);
  let fs = 46; g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
  do { g.font = `600 ${fs}px Georgia, serif`; fs -= 2; } while (g.measureText(text).width > w - 56);
  g.fillText(text, w / 2, h / 2 + 2);
});
const logTex = () => tex(256, 256, (g, w, h) => {
  g.fillStyle = STAIN; g.fillRect(0, 0, w, h); let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 260; i++) { g.fillStyle = r() < 0.5 ? `rgba(90,36,20,${0.12 + r() * 0.2})` : `rgba(226,136,96,${0.08 + r() * 0.16})`; g.fillRect(r() * w, r() * h, 1 + r() * 2.5, 18 + r() * 90); }
});
const shingleTex = () => tex(256, 256, (g, w, h) => {
  let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; g.fillStyle = '#3e3a36'; g.fillRect(0, 0, w, h);
  for (let y = 0; y < 8; y++) for (let x = -1; x < 8; x++) { const v = 120 + r() * 60; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.fillRect((x + (y % 2) * 0.5) * 32 + 1, y * 32 + 1, 30, 30); }
});

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group(), hi = lod !== 'low', seg = hi ? 16 : 8;
  const logT = logTex(); logT.wrapS = logT.wrapT = THREE.RepeatWrapping;
  const log = new THREE.MeshStandardMaterial({ map: logT, roughness: 0.75 }), chain = new THREE.MeshStandardMaterial({ color: 0x8b8d8f, roughness: 0.5, metalness: 0.5 });
  const white = new THREE.MeshStandardMaterial({ color: 0xf1efe8, roughness: 0.65 }), edge = new THREE.MeshStandardMaterial({ color: BOARD_EDGE, roughness: 0.8 });
  const X = 1.95, H = 4.7;   // post centres, beam height
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, H, seg), log); p.position.set(s * X, H / 2, 0); g.add(p); }
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 7.2, seg), log); beam.rotation.z = Math.PI / 2; beam.position.set(-0.05, H + 0.12, 0); g.add(beam);
  const strap = (x, y0, y1, z = 0.08) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, y0 - y1, 5), chain); c.position.set(x, (y0 + y1) / 2, z); g.add(c); };
  const board = (text, w, h, x, y) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), [edge, edge, edge, edge, new THREE.MeshStandardMaterial({ map: boardTex(text), roughness: 0.7 }), edge]);
    m.position.set(x, y, 0.08); g.add(m);
  };
  // the ladders: outside each post, hung from the beam's overhang on two chains
  const ladder = (list, x, top, step) => {
    list.forEach((t, i) => board(t, 1.5, 0.36, x, top - i * step));
    for (const dx of [-0.6, 0.6]) strap(x + dx, H - 0.02, top - (list.length - 1) * step, 0.05);
  };
  ladder(LEFT, -3.3, 4.05, 0.72); ladder(RIGHT, 3.3, 4.2, 0.65);
  // the welcome board, hung between the posts
  { const m = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.05, 0.06), [edge, edge, edge, edge, new THREE.MeshStandardMaterial({ roughness: 0.7, map: tex(640, 264, (c, w, h) => {
    c.fillStyle = BOARD_EDGE; c.fillRect(0, 0, w, h); c.fillStyle = CREAM; c.fillRect(11, 11, w - 22, h - 22); c.fillStyle = '#23502f'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = '500 41px Georgia, serif'; c.fillText('WELCOME TO', w / 2, 58); c.font = '500 37px Georgia, serif'; c.fillText('WELLS GRAY GOLF RESORT', w / 2, 131); c.fillText('& RV PARK', w / 2, 200);
  }) }), edge]); m.position.set(0, 3.82, 0.08); g.add(m); for (const dx of [-0.95, 0.95]) strap(dx, H - 0.02, 4.34); }
  // the kiosk: white frame, shingled hip roof, RV/Campground board with three red arrows, a small lower board
  const KW = 1.85, KZ = 0.1;
  for (const s of [-1, 1]) for (const z of [-0.32, 0.32]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.05, 0.08), white); p.position.set(s * KW / 2, 1.03, KZ + z); g.add(p); }
  { const m = new THREE.Mesh(new THREE.BoxGeometry(KW, 0.62, 0.04), [white, white, white, white, new THREE.MeshStandardMaterial({ roughness: 0.65, map: tex(600, 202, (c, w, h) => {
    c.fillStyle = '#f7f5ee'; c.fillRect(0, 0, w, h); c.fillStyle = '#17324f'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '700 56px Georgia, serif'; c.fillText('RV/CAMPGROUND', w / 2, 68);
    for (const x of [58, 232, 406]) arrow(c, x, 150, 136, 30);
  }) }), white]); m.position.set(0, 1.72, KZ + 0.34); g.add(m); }
  { const back = new THREE.Mesh(new THREE.BoxGeometry(KW, 1.1, 0.03), new THREE.MeshStandardMaterial({ color: 0xcfcabb, roughness: 0.9 })); back.position.set(0, 0.92, KZ - 0.3); g.add(back); }
  { const m = new THREE.Mesh(new THREE.BoxGeometry(KW + 0.08, 0.2, 0.05), [white, white, white, white, new THREE.MeshStandardMaterial({ roughness: 0.7, map: tex(480, 52, (c, w, h) => { c.fillStyle = '#f7f5ee'; c.fillRect(0, 0, w, h); arrow(c, 190, h / 2, 96, 18); }) }), white]); m.position.set(0, 0.32, KZ + 0.34); g.add(m); }
  { const st = shingleTex(); st.wrapS = st.wrapT = THREE.RepeatWrapping; st.repeat.set(2.4, 1.4);
    const eave = new THREE.Mesh(new THREE.BoxGeometry(KW + 0.28, 0.08, 1.0), white); eave.position.set(0, 2.08, KZ); g.add(eave);
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 1.08, 0.86, 4, 1), new THREE.MeshStandardMaterial({ map: st, roughness: 0.95, flatShading: true })); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, 0.5); r.position.set(0, 2.54, KZ); g.add(r); }
  // the short logs at the foot of each ladder, with an arrow plate
  for (const [x, L] of [[-3.6, 2.2], [3.55, 2.0]]) {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, L, seg), log); l.rotation.z = Math.PI / 2; l.position.set(x, 0.2, 0.15); g.add(l);
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.13), new THREE.MeshStandardMaterial({ roughness: 0.7, map: tex(160, 46, (c, w, h) => { c.fillStyle = '#f7f5ee'; c.fillRect(0, 0, w, h); arrow(c, 32, h / 2, 96, 18); }) })); plate.position.set(x, 0.22, 0.375); g.add(plate);
  }
  // the big pale log lying in front (drone video 0:00)
  { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 3.6, seg), new THREE.MeshStandardMaterial({ color: 0xcfc8b8, roughness: 0.95 })); l.rotation.z = Math.PI / 2; l.rotation.y = 0.9; l.position.set(-5.4, 0.3, 3); g.add(l); }
  return g;
}

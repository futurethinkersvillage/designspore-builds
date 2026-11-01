// The resort's entrance sign as it stands now (Mike's photo, 11-01, data/sign.jpg): two stained log posts under a log beam on steel
// straps, the black "Welcome to" board with the green bear between them, six black amenity boards on chains down each side, a green
// RV/Campground arrow, a short log at each foot. Boards are cut straight out of the photo. Units metres (photo: 180 px = 1 m),
// origin = ground centre between the posts, the sign faces +Z.
import * as THREE from 'three';

export const meta = { name: 'Entrance sign', footprint: [7.2, 1], height: 5.6, sources: ['data/sign.jpg'], notes: 'Sizes from the photo, taking the posts as ~0.55 m across.' };

const PW = 1600, PH = 1194, K = 1 / 180, CX = 693, GY = 1130;   // photo size, scale, the sign's centre line, its ground line in the photo
const LEFT = [[110, 310, 205, 62], [103, 430, 205, 58], [97, 545, 205, 58], [92, 665, 207, 58], [90, 790, 205, 58], [87, 910, 205, 55]];
const RIGHT = [[1065, 265, 280, 70], [1063, 403, 280, 70], [1060, 540, 285, 65], [1062, 690, 285, 75], [1060, 828, 285, 80], [1060, 945, 285, 85]];

const logTex = () => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#b4682f'; g.fillRect(0, 0, 256, 256); let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 300; i++) { g.fillStyle = r() < 0.55 ? `rgba(82,42,16,${0.12 + r() * 0.25})` : `rgba(226,156,92,${0.08 + r() * 0.16})`; g.fillRect(r() * 256, r() * 256, 1 + r() * 2.5, 20 + r() * 110); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group(), seg = lod === 'low' ? 8 : 18;
  const photo = new THREE.TextureLoader().load('data/sign.jpg'); photo.colorSpace = THREE.SRGBColorSpace; photo.anisotropy = 8;
  const face = new THREE.MeshBasicMaterial({ map: photo }), back = new THREE.MeshStandardMaterial({ color: 0x17171a, roughness: 0.8 });
  const log = new THREE.MeshStandardMaterial({ map: logTex(), roughness: 0.8 }), steel = new THREE.MeshStandardMaterial({ color: 0x8e9092, roughness: 0.5, metalness: 0.5 }), trim = new THREE.MeshStandardMaterial({ color: 0xa8652f, roughness: 0.8 });
  const X = 1.72, H = 5.05, ph = y => (GY - y) * K, px = x => (x - CX) * K;
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.31, H, seg), log); p.position.set(s * X, H / 2, 0); g.add(p);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.02, 6, seg), trim); band.rotation.x = Math.PI / 2; band.position.set(s * X, H - 0.12, 0); g.add(band); }
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 7.05, seg), log); beam.rotation.z = Math.PI / 2; beam.position.set(0.05, H + 0.2, 0); g.add(beam);
  const board = (x0, y0, w, h, z = 0.1) => {   // a rectangle of the photo at its own place on the sign
    const G = new THREE.PlaneGeometry(w * K, h * K), uv = G.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (x0 + uv.getX(i) * w) / PW, 1 - (y0 + (1 - uv.getY(i)) * h) / PH);
    const m = new THREE.Mesh(G, face); m.position.set(px(x0 + w / 2), ph(y0 + h / 2), z); g.add(m);
    const b = new THREE.Mesh(new THREE.BoxGeometry(w * K, h * K, 0.04), back); b.position.set(m.position.x, m.position.y, z - 0.025); g.add(b);
    return m;
  };
  board(432, 280, 496, 432);
  const chain = (x, y0, y1, z = 0.08) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, Math.abs(y0 - y1), 5), steel); c.position.set(x, (y0 + y1) / 2, z); g.add(c); };
  for (const [list, x] of [[LEFT, 200], [RIGHT, 1205]]) {
    list.forEach(([a, b, w, h]) => board(a, b, w, h));
    for (const dx of [-85, 85]) { const xx = px(x + dx); chain(xx, H + 0.1, ph(list[list.length - 1][1] + 55)); }
  }
  // arrow: its own outline, cut from the photo
  { const pts = [[387, 808], [790, 808], [790, 762], [928, 878], [787, 998], [787, 945], [387, 945]], sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(px(x), ph(y))));
    const G = new THREE.ShapeGeometry(sh), p = G.attributes.position, uv = G.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) / K + CX) / PW, 1 - (GY - p.getY(i) / K) / PH);
    const m = new THREE.Mesh(G, face); m.position.z = 0.34; g.add(m);
    for (const y of [835, 930]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), steel); r.rotation.x = Math.PI / 2; r.position.set(1.36, ph(y), 0.2); g.add(r); } }
  for (const [x, L] of [[-3.0, 1.55], [3.25, 2.4]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, L, seg), log); l.rotation.z = Math.PI / 2; l.position.set(x, 0.18, 0.1); g.add(l); }
  return g;
}

// The resort's entrance sign, modelled (Mike 11-02: no cut-outs of the concept image; data/sign.jpg is reference only): two stained log posts under a log beam on steel straps,
// the framed black "Welcome to" board with the green bear, six evenly spaced black boards on chains down each side, the green RV/Campground arrow, a short log at each foot.
// Lettering and icons stand slightly proud of the boards. Units metres, origin = ground centre between the posts, the sign faces +Z.
import * as THREE from 'three';

export const meta = { name: 'Entrance sign', footprint: [7.2, 1], height: 5.6, sources: ['data/sign.jpg'], notes: 'Remodelled 11-02. Layout from the photo, boards made uniform at Mike\'s request.' };

const GREEN = '#2fbf4a', WHITE = '#f4f2ec', BLACK = '#17171a';
const logTex = () => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#b4682f'; g.fillRect(0, 0, 256, 256); let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 300; i++) { g.fillStyle = r() < 0.55 ? `rgba(82,42,16,${0.12 + r() * 0.25})` : `rgba(226,156,92,${0.08 + r() * 0.16})`; g.fillRect(r() * 256, r() * 256, 1 + r() * 2.5, 20 + r() * 110); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };

// the bear, walking right (x 0..100, y 0..58)
const BEAR = [[3, 44], [5, 30], [10, 19], [19, 12], [31, 8], [44, 6], [55, 8], [63, 7], [70, 2], [75, 3], [77, 0], [80, 3], [85, 8], [93, 12], [98, 15], [95, 19], [88, 21], [83, 26], [80, 34], [80, 45], [83, 53], [85, 58], [71, 58], [68, 44], [62, 37], [55, 39], [50, 41], [52, 50], [55, 58], [41, 58], [37, 47], [30, 41], [24, 44], [23, 52], [26, 58], [12, 58], [8, 50]];
const line = (g, pts, close) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); };
// icons, in a 100 x 100 box, drawn in the current colour
const ICON = {
  flag(g) { g.lineWidth = 7; line(g, [[48, 80], [48, 12]]); g.stroke(); line(g, [[48, 12], [80, 26], [48, 40]], true); g.fill(); g.beginPath(); g.ellipse(48, 86, 34, 10, 0, 0, 7); g.fill(); },
  club(g) { g.lineWidth = 8; line(g, [[82, 10], [38, 72]]); g.stroke(); g.beginPath(); g.ellipse(28, 80, 20, 12, -0.4, 0, 7); g.fill(); },
  sauna(g) { g.lineWidth = 7; for (const x of [28, 50, 72]) { g.beginPath(); g.moveTo(x, 42); g.bezierCurveTo(x - 12, 30, x + 12, 22, x, 8); g.stroke(); } g.fillRect(16, 52, 68, 34); },
  dome(g) { g.lineWidth = 8; g.beginPath(); g.arc(50, 76, 40, Math.PI, 0); g.closePath(); g.stroke(); line(g, [[50, 36], [50, 76]]); g.stroke(); line(g, [[24, 46], [76, 46]]); g.stroke(); line(g, [[14, 62], [86, 62]]); g.stroke(); },
  swim(g) { g.lineWidth = 7; g.beginPath(); g.arc(70, 26, 11, 0, 7); g.fill(); line(g, [[16, 50], [50, 28], [66, 50]]); g.stroke(); for (const y of [66, 84]) { g.beginPath(); g.moveTo(8, y); for (let x = 8; x < 92; x += 21) g.quadraticCurveTo(x + 10, y - 12, x + 21, y); g.stroke(); } },
  school(g) { g.fillRect(14, 48, 72, 40); line(g, [[50, 22], [78, 48], [22, 48]], true); g.fill(); g.lineWidth = 5; line(g, [[50, 22], [50, 6], [66, 12], [50, 18]]); g.stroke(); g.globalCompositeOperation = 'destination-out'; g.fillRect(42, 62, 16, 26); g.globalCompositeOperation = 'source-over'; },
  shower(g) { g.lineWidth = 8; line(g, [[14, 92], [14, 22], [52, 22], [52, 34]]); g.stroke(); line(g, [[32, 50], [72, 50], [62, 34], [42, 34]], true); g.fill(); for (const x of [38, 52, 66]) for (const y of [62, 78]) g.fillRect(x - 3, y, 6, 9); },
  wifi(g) { g.lineWidth = 9; for (const r of [14, 32, 50]) { g.beginPath(); g.arc(50, 78, r, -2.4, -0.74); g.stroke(); } g.beginPath(); g.arc(50, 78, 8, 0, 7); g.fill(); },
  sani(g) { g.lineWidth = 8; line(g, [[20, 40], [62, 40], [62, 54]]); g.stroke(); g.fillRect(16, 20, 14, 26); line(g, [[20, 62], [84, 62], [76, 90], [28, 90]], true); g.fill(); },
  tent(g) { line(g, [[50, 12], [92, 88], [8, 88]], true); g.fill(); g.globalCompositeOperation = 'destination-out'; line(g, [[50, 46], [66, 88], [34, 88]], true); g.fill(); g.globalCompositeOperation = 'source-over'; },
  wash(g) { g.fillRect(16, 10, 68, 80); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(50, 56, 22, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over'; g.beginPath(); g.arc(50, 56, 12, 0, 7); g.fill(); },
  party(g) { line(g, [[12, 92], [38, 34], [70, 66]], true); g.fill(); g.lineWidth = 6; for (const [a, b, c, d] of [[56, 34, 66, 14], [72, 44, 92, 34], [46, 18, 50, 6], [80, 60, 94, 62]]) { line(g, [[a, b], [c, d]]); g.stroke(); } },
};
const LEFT = [['flag', '9 CHALLENGING', 'HOLES'], ['club', 'CLUB & CART', 'RENTALS'], ['sauna', 'SAUNA &', 'COLD PLUNGE'], ['dome', 'DOMES &', 'CABINS'], ['swim', 'SWIMMING', 'LAKE'], ['school', 'FOREST', 'SCHOOL']];
const RIGHT = [['shower', 'SHOWER', 'HOUSE'], ['wifi', 'WIFI'], ['sani', 'SANI', 'STATION'], ['tent', 'COVERED', 'TENT SITES'], ['wash', 'LAUNDROMAT'], ['party', 'PRIVATE', 'EVENTS']];

// raised artwork: the drawing stacked in thin layers, so lettering and icons have real depth from an angle; the back layers are the darker sides
function raised(w, h, draw, depth = 0.018) {
  const c = document.createElement('canvas'), S = 512 / w; c.width = 512; c.height = Math.max(16, Math.round(h * S));
  const g = c.getContext('2d'); g.scale(c.width / w, c.height / h); draw(g);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const grp = new THREE.Group(), geo = new THREE.PlaneGeometry(w, h), N = 5;
  for (let i = 0; i < N; i++) { const k = i === N - 1 ? 1 : 0.42, m = new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.5, color: new THREE.Color(k, k, k) }); const p = new THREE.Mesh(geo, m); p.position.z = depth * (i + 1) / N; grp.add(p); }
  return grp;
}
const txt = (g, s, x, y, size, color, align = 'center') => { g.fillStyle = color; g.textAlign = align; g.textBaseline = 'middle'; g.font = `700 ${size}px Arial, Helvetica, sans-serif`; g.save(); g.translate(x, y); g.scale(0.86, 1); g.fillText(s, 0, 0); g.restore(); };

export function build({ lod = 'high' } = {}) {
  const g = new THREE.Group(), seg = lod === 'low' ? 8 : 18;
  const log = new THREE.MeshStandardMaterial({ map: logTex(), roughness: 0.8 }), steel = new THREE.MeshStandardMaterial({ color: 0x8e9092, roughness: 0.5, metalness: 0.5 }), trim = new THREE.MeshStandardMaterial({ color: 0xa8652f, roughness: 0.8 });
  const black = new THREE.MeshStandardMaterial({ color: BLACK, roughness: 0.7 }), green = new THREE.MeshStandardMaterial({ color: GREEN, roughness: 0.6 });
  const X = 1.72, H = 5.05;
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.31, H, seg), log); p.position.set(s * X, H / 2, 0); g.add(p);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.02, 6, seg), trim); band.rotation.x = Math.PI / 2; band.position.set(s * X, H - 0.12, 0); g.add(band); }
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 7.3, seg), log); beam.rotation.z = Math.PI / 2; beam.position.set(0, H + 0.2, 0); g.add(beam);

  // the main board
  { const W = 2.76, Ht = 2.4, cy = 3.5, frame = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, Ht + 0.12, 0.1), trim); frame.position.set(0, cy, 0.05); g.add(frame);
    const board = new THREE.Mesh(new THREE.BoxGeometry(W, Ht, 0.12), black); board.position.set(0, cy, 0.07); g.add(board);
    const art = raised(W, Ht, c => {
      c.save(); c.translate(W / 2 - 0.46, 0.14); c.scale(0.0092, 0.0092); c.fillStyle = GREEN; line(c, BEAR, true); c.fill(); c.restore();
      txt(c, 'WELCOME TO', W / 2, 0.95, 0.27, WHITE); txt(c, 'WELLS GRAY GOLF', W / 2, 1.36, 0.33, WHITE); txt(c, '& RV RESORT', W / 2, 1.8, 0.33, WHITE);
    }, 0.022); art.position.set(0, cy, 0.13); g.add(art); }

  // the side boards: one size, one spacing, dead level
  const BW = 1.36, BH = 0.38, GAP = 0.66, TOP = 4.45, SX = 2.82;
  const chain = (x, y0, y1) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, Math.abs(y0 - y1), 5), steel); c.position.set(x, (y0 + y1) / 2, 0); g.add(c); };
  for (const [list, cx] of [[LEFT, -SX], [RIGHT, SX]]) {
    const low = TOP - GAP * (list.length - 1);
    for (const dx of [-0.56, 0.56]) { chain(cx + dx, H + 0.1, 0.28); }
    list.forEach(([icon, a, b], i) => { const y = TOP - i * GAP;
      const board = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, 0.05), black); board.position.set(cx, y, 0.03); g.add(board);
      const art = raised(BW, BH, c => {
        c.save(); c.translate(0.05, 0.05); c.scale(BH * 0.0074, BH * 0.0074); c.fillStyle = GREEN; c.strokeStyle = GREEN; c.lineCap = 'round'; ICON[icon](c); c.restore();
        const tx = 0.86; if (b) { txt(c, a, tx, 0.12, 0.125, WHITE); txt(c, b, tx, 0.265, 0.125, WHITE); } else txt(c, a, tx, BH / 2, 0.15, WHITE);
      }); art.position.set(cx, y, 0.056); g.add(art); });
  }
  // the arrow: a real extruded shape, its lettering raised on it
  { const pts = [[-1.63, 0.38], [0.6, 0.38], [0.6, 0.66], [1.42, 0], [0.6, -0.66], [0.6, -0.38], [-1.63, -0.38]], sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: false }), green), cy = 1.2; m.position.set(0, cy, 0.3); g.add(m);
    const art = raised(2.3, 0.6, c => {
      c.fillStyle = BLACK; c.beginPath(); c.arc(0.24, 0.3, 0.2, 0, 7); c.fill();
      c.save(); c.translate(0.11, 0.17); c.scale(0.0026, 0.0026); c.fillStyle = GREEN; ICON.tent(c); c.restore();
      txt(c, 'RV/CAMPGROUND', 1.36, 0.31, 0.215, BLACK);
    }); art.position.set(-0.42, cy, 0.352); g.add(art);
    const tip = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([[0.84, 0.17], [1.14, 0], [0.84, -0.17]].map(([x, y]) => new THREE.Vector2(x, y)))), new THREE.MeshBasicMaterial({ color: BLACK })); tip.position.set(0, cy, 0.352); g.add(tip);
    for (const y of [cy + 0.26, cy - 0.26]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 6), steel); r.rotation.x = Math.PI / 2; r.position.set(1.36, y, 0.16); g.add(r); } }
  for (const x of [-SX, SX]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 1.7, seg), log); l.rotation.z = Math.PI / 2; l.position.set(x, 0.18, 0); g.add(l); }
  return g;
}

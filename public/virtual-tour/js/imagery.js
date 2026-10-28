// Esri World Imagery mosaics for the land around the drone survey, built at runtime (CORS-enabled tiles),
// plus helpers to map local metres -> mosaic UV through the quadratic fit in meta.json (see tools/prep_affine.py).
import * as THREE from 'three';

const R = 6378137 * Math.PI;
const URL = (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;

const merc = (k, x, y) => [
  k[0] * x + k[1] * y + k[2] + (k[3] * x * x + k[4] * x * y + k[5] * y * y) / 1e4,
  k[6] * x + k[7] * y + k[8] + (k[9] * x * x + k[10] * x * y + k[11] * y * y) / 1e4,
];

// opts: bounds = [x0, x1, y0, y1] local metres (default ±half), url(z, x, y) for other tile sources (default Esri),
// clear = leave missing tiles transparent (for partial-coverage sources like the drone survey)
export async function buildMosaic(k, half, zoom, onTile, opts = {}) {
  let mx0 = Infinity, mx1 = -Infinity, my0 = Infinity, my1 = -Infinity;
  const [bx0_, bx1_, by0_, by1_] = opts.bounds || [-half, half, -half, half];
  for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) {
    const [mx, my] = merc(k, bx0_ + i * (bx1_ - bx0_) / 8, by0_ + j * (by1_ - by0_) / 8);
    mx0 = Math.min(mx0, mx); mx1 = Math.max(mx1, mx); my0 = Math.min(my0, my); my1 = Math.max(my1, my);
  }
  const n = 2 ** zoom, ts = 2 * R / n;
  const tx0 = Math.floor((mx0 + R) / ts), tx1 = Math.floor((mx1 + R) / ts);
  const ty0 = Math.floor((R - my1) / ts), ty1 = Math.floor((R - my0) / ts);
  const cw = (tx1 - tx0 + 1) * 256, ch = (ty1 - ty0 + 1) * 256;
  const canvas = document.createElement('canvas'); canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext('2d', { willReadFrequently: !opts.noSample });
  if (!opts.clear) { ctx.fillStyle = '#3d4a32'; ctx.fillRect(0, 0, cw, ch); }
  const jobs = [];
  for (let tx = tx0; tx <= tx1; tx++) for (let ty = ty0; ty <= ty1; ty++) {
    jobs.push(new Promise(res => {
      const im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = () => { ctx.drawImage(im, (tx - tx0) * 256, (ty - ty0) * 256); onTile?.(); res(); };
      im.onerror = () => { onTile?.(); res(); };
      im.src = (opts.url || URL)(zoom, tx, ty);
    }));
  }
  await Promise.all(jobs);
  // mosaic bounds in mercator; canvas row 0 = north
  const bx0 = -R + tx0 * ts, bx1 = -R + (tx1 + 1) * ts, by1 = R - ty0 * ts, by0 = R - (ty1 + 1) * ts;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16;
  tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true;
  // uv = A·[x, y, 1] + B·[x², xy, y²]/1e4  (u from x row, v from y row)
  const sx = 1 / (bx1 - bx0), sy = 1 / (by1 - by0);
  const uv = {
    uA: new THREE.Vector3(k[0] * sx, k[1] * sx, (k[2] - bx0) * sx), uB: new THREE.Vector3(k[3] * sx, k[4] * sx, k[5] * sx),
    vA: new THREE.Vector3(k[6] * sy, k[7] * sy, (k[8] - by0) * sy), vB: new THREE.Vector3(k[9] * sy, k[10] * sy, k[11] * sy),
  };
  const data = opts.noSample ? null : ctx.getImageData(0, 0, cw, ch).data;
  const sample = (x, y) => {
    const u = uv.uA.x * x + uv.uA.y * y + uv.uA.z + (uv.uB.x * x * x + uv.uB.y * x * y + uv.uB.z * y * y) / 1e4;
    const v = uv.vA.x * x + uv.vA.y * y + uv.vA.z + (uv.vB.x * x * x + uv.vB.y * x * y + uv.vB.z * y * y) / 1e4;
    const px = Math.floor(u * cw), py = Math.floor((1 - v) * ch);
    if (px < 0 || py < 0 || px >= cw || py >= ch) return null;
    const i = (py * cw + px) * 4; return [data[i], data[i + 1], data[i + 2]];
  };
  return { tex, uv, sample, tiles: jobs.length };
}

export function tileCount(k, half, zoom) {
  let mx0 = Infinity, mx1 = -Infinity, my0 = Infinity, my1 = -Infinity;
  for (const [x, y] of [[-half, -half], [half, -half], [-half, half], [half, half]]) {
    const [mx, my] = merc(k, x, y); mx0 = Math.min(mx0, mx); mx1 = Math.max(mx1, mx); my0 = Math.min(my0, my); my1 = Math.max(my1, my);
  }
  const ts = 2 * R / 2 ** zoom;
  return (Math.floor((mx1 + R) / ts) - Math.floor((mx0 + R) / ts) + 1) * (Math.floor((R - my0) / ts) - Math.floor((R - my1) / ts) + 1);
}

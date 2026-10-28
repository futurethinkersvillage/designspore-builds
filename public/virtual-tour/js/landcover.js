// Land-cover map for the close-up ground detail (land.js detailGround): one RGBA texel per metre over the drone
// survey — r = meadow grass, g = golf fairway, b = water, a = gravel road / path. Classes come from the site plan
// (golf course, lake), the water mask (creeks, rivers) and the drone photo's own colours (grass, gravel).
import * as THREE from 'three';
import { polysOf } from './sheet.js';

export function makeLandCover({ meta, L, droneSample, waterCanvas, waterRect, res = 1 }) {
  const o = meta.ortho, W = Math.ceil((o.x1 - o.x0) / res), H = Math.ceil((o.y1 - o.y0) / res);
  const X = x => (x - o.x0) / res, Y = y => (o.y1 - y) / res;
  // golf fairways from the plan (they match the drone survey well)
  const golf = document.createElement('canvas'); golf.width = W; golf.height = H;
  const gg = golf.getContext('2d'); gg.fillStyle = '#fff';
  for (const f of L.golf_course || []) for (const poly of polysOf(f)) {
    gg.beginPath(); for (const ring of poly) ring.forEach((p, i) => i ? gg.lineTo(X(p[0]), Y(p[1])) : gg.moveTo(X(p[0]), Y(p[1]))); gg.fill('evenodd');
  }
  const golfD = gg.getImageData(0, 0, W, H).data;
  // water from the engine's water mask (2 m texels over ±3 km)
  const wctx = waterCanvas.getContext('2d'), wd = wctx.getImageData(0, 0, waterCanvas.width, waterCanvas.height).data;
  const wres = (waterRect.z - waterRect.x) / waterCanvas.width;
  const isW = (x, y) => { const i = Math.floor((waterRect.w - y) / wres) * waterCanvas.width + Math.floor((x - waterRect.x) / wres); return wd[i * 4 + 2] > 60 ? 1 : 0; };

  const raw = document.createElement('canvas'); raw.width = W; raw.height = H;
  const rg = raw.getContext('2d'), img = rg.createImageData(W, H), d = img.data;
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const x = o.x0 + (i + 0.5) * res, y = o.y1 - (j + 0.5) * res, k = (j * W + i) * 4;
    const c = droneSample(x, y);
    let grass = 0, fair = golfD[k] > 127 ? 1 : 0, water = isW(x, y), path = 0;
    if (c) {
      const [r, g, b] = c, lum = (r + g + b) / 3, mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx ? (mx - mn) / mx : 0;
      if (lum > 128 && sat < 0.24) path = 1;                                   // pale, grey-beige: gravel / dirt
      else if (g >= r * 0.95 && g > b * 1.1 && lum > 60) grass = 1;            // lit green: meadow
      else if (lum > 110 && r > g && sat < 0.38) path = 0.6;                   // tan bare ground
    }
    if (fair) { grass = 0; path *= 0.3; }   // fairway wins over grass; cart paths can still show
    d[k] = grass * 255; d[k + 1] = fair * 255; d[k + 2] = water * 255; d[k + 3] = path * 255;
  }
  rg.putImageData(img, 0, 0);
  // soften class edges a little so nothing reads as pixels
  const out = document.createElement('canvas'); out.width = W; out.height = H;
  const oc = out.getContext('2d'); oc.filter = 'blur(1.2px)'; oc.drawImage(raw, 0, 0);
  const tex = new THREE.CanvasTexture(out);
  tex.colorSpace = THREE.NoColorSpace; tex.premultiplyAlpha = false; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.anisotropy = 8;
  return { tex, rect: new THREE.Vector4(o.x0, o.y0, o.x0 + W * res, o.y1), canvas: out };
}

// Clean-realism ground (Mike chose style A, 10-29): the ground-type map (data/groundclass.png, one byte per 0.5 m:
// 0 lawn, 1 fairway, 2 worn grass, 3 yard gravel, 4 gravel road, 5 dirt, 6 forest floor, 7 creek cobbles, 8 water,
// 255 none) becomes three weight textures (A, B: materials; C: r = water traced from the photo, g = surveyed), and the eight CC0 materials (assets/materials, ambientCG) one texture array:
// layers 0–7 colour, 8–15 normal. land.js tiles them in world space with the repeats broken up.
// Hand fixes from the ground brush (js/placer.js) live in their own layer, data/groundpaint.png (255 = not painted),
// so re-running tools/ground_classes.py never wipes them.
import * as THREE from 'three';

const img = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
const pixels = (im, w = im.width, h = im.height) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0, w, h); return g.getImageData(0, 0, w, h).data;
};

export async function loadGround() {
  const [gm, gc, cls, col, nrm, pnt] = await Promise.all([fetch('assets/materials/ground.json').then(r => r.json()), fetch('data/groundclass.json').then(r => r.json()),
    img('data/groundclass.png'), img('assets/materials/ground_color.webp'), img('assets/materials/ground_normal.webp'),
    fetch(`data/groundpaint${/^\d+$/.test(new URLSearchParams(location.search).get('village') || '') ? '_village' + new URLSearchParams(location.search).get('village') : ''}.png`, { cache: 'no-store' }).then(r => r.ok ? r.blob() : null).then(b => b && img(URL.createObjectURL(b))).catch(() => null)]);
  // materials -> one array texture (colour layers, then normal layers)
  const S = gm.res, N = gm.layers.length, arr = new Uint8Array(S * S * 4 * N * 2);
  arr.set(pixels(col), 0); arr.set(pixels(nrm), S * S * 4 * N);
  const mats = new THREE.DataArrayTexture(arr, S, S, N * 2);
  mats.format = THREE.RGBAFormat; mats.type = THREE.UnsignedByteType; mats.wrapS = mats.wrapT = THREE.RepeatWrapping;
  mats.generateMipmaps = true; mats.minFilter = THREE.LinearMipmapLinearFilter; mats.magFilter = THREE.LinearFilter; mats.anisotropy = 8;
  mats.needsUpdate = true;
  // class ids (auto + hand paint) -> weights; texture rows are flipped so north is up in UV
  const W = cls.width, H = cls.height, auto = new Uint8Array(W * H), paint = new Uint8Array(W * H).fill(255);
  { const p = pixels(cls); for (let k = 0; k < W * H; k++) auto[k] = p[k * 4]; }
  if (pnt && pnt.width === W && pnt.height === H) { const p = pixels(pnt); for (let k = 0; k < W * H; k++) paint[k] = p[k * 4]; }
  const a = new Uint8Array(W * H * 4), b = new Uint8Array(W * H * 4), c = new Uint8Array(W * H * 4);
  const write = (i0, j0, i1, j1) => {
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const s = j * W + i, id = paint[s] !== 255 ? paint[s] : auto[s], k = ((H - 1 - j) * W + i) * 4;
      a[k] = a[k + 1] = a[k + 2] = a[k + 3] = b[k] = b[k + 1] = b[k + 2] = b[k + 3] = c[k] = c[k + 1] = c[k + 2] = 0; c[k + 3] = 255;
      if (id < 4) a[k + id] = 255; else if (id < 8) b[k + id - 4] = 255;
      else if (id === 8 || id === 9) { b[k + 3] = 255; c[k] = 255; c[k + 2] = id === 9 ? 255 : 0; }   // water (cobble bed): b = flowing creek, else still
      if (id !== 255) c[k + 1] = 255;
    }
  };
  write(0, 0, W - 1, H - 1);
  const weights = d => { const t = new THREE.DataTexture(d, W, H, THREE.RGBAFormat); t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.needsUpdate = true; return t; };
  const tA = weights(a), tB = weights(b), tC = weights(c), rect = new THREE.Vector4(...gc.rect), res = gc.res;
  let pending = false;
  // the ground type at local (x, y): hand paint over the automatic map (255 = outside the map)
  const classAt = (x, y) => { const i = Math.floor((x - gc.rect[0]) / res), j = Math.floor((gc.rect[3] - y) / res); if (i < 0 || j < 0 || i >= W || j >= H) return 255; const s = j * W + i; return paint[s] !== 255 ? paint[s] : auto[s]; };
  return {
    classAt, mats, tA, tB, tC, rect, sizes: gm.layers.map(l => l.size), means: gm.layers.map(l => new THREE.Vector3(...l.mean)), names: gm.layers.map(l => l.name),
    // paint ground type `id` (255 = back to the automatic map) in a circle of radius r metres around local (x, y)
    paintAt(x, y, r, id) {
      const ci = (x - rect.x) / res, cj = (rect.w - y) / res, R = r / res;
      const i0 = Math.max(0, Math.floor(ci - R)), i1 = Math.min(W - 1, Math.ceil(ci + R)), j0 = Math.max(0, Math.floor(cj - R)), j1 = Math.min(H - 1, Math.ceil(cj + R));
      if (i0 > i1 || j0 > j1) return false;
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if ((i - ci) ** 2 + (j - cj) ** 2 <= R * R) paint[j * W + i] = id;
      write(i0, j0, i1, j1);
      if (!pending) { pending = true; requestAnimationFrame(() => { tA.needsUpdate = tB.needsUpdate = tC.needsUpdate = true; pending = false; }); }
      return true;
    },
    // the hand-paint layer as a PNG blob (grey = ground type, white 255 = not painted)
    paintPNG() {
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g = c.getContext('2d'), d = g.createImageData(W, H);
      for (let k = 0; k < W * H; k++) { d.data[k * 4] = d.data[k * 4 + 1] = d.data[k * 4 + 2] = paint[k]; d.data[k * 4 + 3] = 255; }
      g.putImageData(d, 0, 0); return new Promise(ok => c.toBlob(ok, 'image/png'));
    },
  };
}

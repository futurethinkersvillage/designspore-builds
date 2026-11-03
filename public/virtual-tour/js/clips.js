// Real footage in the film (Mike 11-02): short pieces of one continuous shot, each following the scroll forwards and backwards. A clip is a folder of numbered JPEGs (tools/make_clips.sh),
// fetched as the film nears it. Windows are fractions of their chapter. drone = the 3D camera holds the drone's first view, so it dissolves in; the others are cut-ins from the 3 Years video.
export const CLIPS = [
  { id: 'rapids', ch: 'ch04', a: 0.22, b: 0.46, n: 75, fade: 0.8, cap: 'Hemp Creek · drone footage' },
  { id: 'dome', ch: 'ch05', a: 0.31, b: 0.44, n: 43, fade: 0.25, cap: 'Building the dome' },
  { id: 'ponds', ch: 'ch06', a: 0.3, b: 0.49, n: 75, fade: 0.8, cap: 'The golf course · drone footage' },
  { id: 'gazebo', ch: 'ch06', a: 0.68, b: 0.755, n: 30, fade: 0.2, cap: 'At the gazebo' },
  { id: 'maker', ch: 'ch08', a: 0.56, b: 0.63, n: 29, fade: 0.2, cap: 'Already making things' },
];
export function makeClips({ ranges, chapterIds, total, phone }) {
  const dir = phone ? 'assets/clips_m' : 'assets/clips';
  const c = document.createElement('canvas'); c.width = phone ? 540 : 960; c.height = phone ? 304 : 540;
  c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;object-fit:cover;pointer-events:none;opacity:0;z-index:2';
  const hud = document.querySelector('.hud'); hud.parentNode.insertBefore(c, hud);
  const label = document.createElement('div');
  label.style.cssText = 'position:fixed;right:max(16px,3vw);bottom:max(16px,3vh);z-index:3;font:600 11px/1 Inter,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#F2EDE8;text-shadow:0 1px 8px rgba(0,0,0,.8);pointer-events:none;opacity:0';
  document.body.appendChild(label);
  const g = c.getContext('2d');
  const list = CLIPS.map(k => { const i = chapterIds.indexOf(k.ch), [A, B] = ranges[i], w = B - A; return { ...k, p0: A + w * k.a, p1: A + w * k.b, imgs: null }; }).filter(k => Number.isFinite(k.p0));
  const fetchIt = k => { if (k.imgs) return; k.imgs = Array.from({ length: k.n }, (_, i) => { const im = new Image(); im.src = `${dir}/${k.id}/${String(i + 1).padStart(3, '0')}.jpg`; return im; }); };
  let shown = null, lastDrawn = '', drawnFor = '';
  return {
    update(p) {
      let on = null;
      for (const k of list) { const near = 14 / total; if (p > k.p0 - near && p < k.p1 + near) fetchIt(k); if (p >= k.p0 && p <= k.p1) on = k; }
      if (!on) { if (shown) { c.style.opacity = 0; label.style.opacity = 0; shown = null; } return false; }
      const u = (p - on.p0) / (on.p1 - on.p0), f = on.fade / ((on.p1 - on.p0) * total), op = Math.min(1, u / f, (1 - u) / f);
      const want = Math.min(on.n - 1, Math.floor(u * on.n)), key = on.id + want;
      if (key !== lastDrawn) { for (let d = 0; d <= on.n; d++) { const im = on.imgs[Math.max(0, want - d)]; if (im?.complete && im.naturalWidth) { g.drawImage(im, 0, 0, c.width, c.height); lastDrawn = key; drawnFor = on.id; break; } } }
      if (drawnFor !== on.id) { c.style.opacity = 0; label.style.opacity = 0; return false; }   // not fetched yet: the film just carries on
      c.style.opacity = op; label.textContent = on.cap; label.style.opacity = op; shown = on; return op > 0.999;
    },
  };
}

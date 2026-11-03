// Real footage in the film (Mike 11-02, 11-03): shown picture-in-picture beside the 3D, never cut to. Each clip is one continuous run of the source (tools/make_clips.sh) as numbered
// JPEGs, following the scroll forwards and backwards, fetched (and decoded off the main thread) as the film nears it. Windows are fractions of their chapter.
export const CLIPS = [
  { id: 'camp', ch: 'ch03', a: 0.3, b: 0.56, n: 86, cap: 'The campground · drone' },
  { id: 'rapids', ch: 'ch04', a: 0.18, b: 0.42, n: 75, cap: 'Hemp Creek · drone' },
  { id: 'dome', ch: 'ch05', a: 0.1, b: 0.6, n: 223, cap: 'Building the dome' },
  { id: 'ponds', ch: 'ch06', a: 0.3, b: 0.49, n: 75, cap: 'The golf course · drone' },
  { id: 'gazebo', ch: 'ch06', a: 0.64, b: 0.765, n: 51, cap: 'The community gazebo' },
];
export function makeClips({ ranges, chapterIds, total, phone }) {
  const dir = phone ? 'assets/clips_m' : 'assets/clips';
  const box = document.createElement('div');
  box.style.cssText = phone
    ? 'position:fixed;left:50%;top:9vh;width:86vw;transform:translateX(-50%);z-index:3;pointer-events:none;opacity:0'
    : 'position:fixed;right:max(16px,3vw);top:50%;width:min(36vw,600px);transform:translateY(-50%);z-index:3;pointer-events:none;opacity:0';
  const c = document.createElement('canvas'); c.width = phone ? 400 : 640; c.height = phone ? 225 : 360;
  c.style.cssText = 'display:block;width:100%;aspect-ratio:16/9;border-radius:4px;border:1px solid rgba(242,237,232,.4);box-shadow:0 18px 50px rgba(10,8,14,.55);background:#1A1720';
  const label = document.createElement('div');
  label.style.cssText = 'margin-top:9px;font:600 10.5px/1 Inter,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#F2EDE8;text-shadow:0 1px 8px rgba(0,0,0,.8)';
  box.append(c, label); document.body.appendChild(box);
  const g = c.getContext('2d');
  const list = CLIPS.map(k => { const i = chapterIds.indexOf(k.ch); if (i < 0) return null; const [A, B] = ranges[i], w = B - A; return { ...k, p0: A + w * k.a, p1: A + w * k.b, imgs: null }; }).filter(Boolean);
  const fetchIt = k => { if (k.imgs) return; k.imgs = Array.from({ length: k.n }, (_, i) => { const im = new Image(); im.decoding = 'async'; im.src = `${dir}/${k.id}/${String(i + 1).padStart(3, '0')}.jpg`; im.decode().catch(() => {}); return im; }); };
  let lastDrawn = '', drawnFor = '';
  const hide = () => { box.style.opacity = 0; };
  return {
    update(p) {
      let on = null;
      for (const k of list) { const near = 14 / total; if (p > k.p0 - near && p < k.p1 + near) fetchIt(k); if (p >= k.p0 && p <= k.p1) on = k; }
      if (!on) return hide();
      const u = (p - on.p0) / (on.p1 - on.p0), f = 0.45 / ((on.p1 - on.p0) * total), op = Math.min(1, u / f, (1 - u) / f);
      const want = Math.min(on.n - 1, Math.floor(u * on.n)), key = on.id + want;
      if (key !== lastDrawn) for (let d = 0; d <= on.n; d++) { const im = on.imgs[Math.max(0, want - d)]; if (im?.complete && im.naturalWidth) { g.drawImage(im, 0, 0, c.width, c.height); lastDrawn = key; drawnFor = on.id; break; } }
      if (drawnFor !== on.id) return hide();   // not fetched yet: the film just carries on
      label.textContent = on.cap; box.style.opacity = op;
      box.style.transform = (phone ? 'translateX(-50%) ' : 'translateY(-50%) ') + `scale(${0.96 + 0.04 * op})`;
    },
  };
}

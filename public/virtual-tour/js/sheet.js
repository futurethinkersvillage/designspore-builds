// Draws the master-plan "sheet" (ink on transparent, the shader supplies the paper) and the planned-only overlay
// that stays on the real land. Both cover SHEET (local metres; x = east, y = north).
import { drawMark } from './brand.js';

export const SHEET = { x0: -1560, x1: 1560, y0: -900, y1: 900, px: 4096 }; // just around the parcel, so the plan fills the frame

const EXISTING_BUILDINGS = ['utility_buildings', 'accomodations_for_rent', 'public_areas', 'bathroom_shower_house'];
const RV = ['full_service_rv_sites', 'power_water_rv_sites', 'regular_rv_sites'];

export function polysOf(f) {
  if (f.t === 'Polygon') return [f.c];
  if (f.t === 'MultiPolygon') return f.c;
  return [];
}
export function linesOf(f) {
  if (f.t === 'LineString') return [f.c];
  if (f.t === 'MultiLineString') return f.c;
  return polysOf(f).flat();
}
export function centroid(feats) {
  let sx = 0, sy = 0, n = 0;
  for (const f of feats) {
    const pts = f.t === 'Point' ? [f.c] : linesOf(f).flat();
    for (const p of pts) { sx += p[0]; sy += p[1]; n++; }
  }
  return [sx / n, sy / n];
}
const ringCentroid = r => r.reduce((a, p) => [a[0] + p[0] / r.length, a[1] + p[1] / r.length], [0, 0]);

function rgb(c, a = 1) { return `rgba(${c.map(v => Math.round(v * 255)).join(',')},${a})`; }

export async function drawSheets(L, style) {
  await Promise.all(['500 40px Cormorant', '600 40px Cormorant', '400 20px Inter', '500 20px Inter', '600 20px Inter']
    .map(f => document.fonts.load(f).catch(() => {})));
  const W = SHEET.px, s = W / (SHEET.x1 - SHEET.x0), H = Math.round((SHEET.y1 - SHEET.y0) * s);
  const X = x => (x - SHEET.x0) * s, Y = y => (SHEET.y1 - y) * s;
  const ink = rgb(style.ink), inkA = a => rgb(style.ink, a), plan = style.planned;
  const K = 2.4; // stroke + type scale: the whole sheet is seen at ~0.3 screen px per canvas px

  const sheet = document.createElement('canvas'); sheet.width = W; sheet.height = H;
  let c = sheet.getContext('2d');
  c.lineJoin = 'round'; c.lineCap = 'round';

  const path = (ring, close = true) => { c.beginPath(); ring.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); if (close) c.closePath(); };
  const polyPath = f => { c.beginPath(); for (const poly of polysOf(f)) for (const ring of poly) ring.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); };
  const hatch = (f, color, gap = 7, angle = 45, width = 1.4) => {
    gap *= K; width *= K;
    c.save(); polyPath(f); c.clip('evenodd');
    c.strokeStyle = color; c.lineWidth = width; c.beginPath();
    const a = angle * Math.PI / 180, d = Math.hypot(W, H);
    for (let t = -d; t < d; t += gap) {
      c.moveTo(W / 2 + Math.cos(a) * -d - Math.sin(a) * t, H / 2 + Math.sin(a) * -d + Math.cos(a) * t);
      c.lineTo(W / 2 + Math.cos(a) * d - Math.sin(a) * t, H / 2 + Math.sin(a) * d + Math.cos(a) * t);
    }
    c.stroke(); c.restore();
  };
  const outline = (f, color, width, dash = []) => { c.setLineDash(dash.map(d => d * K)); width *= K; c.strokeStyle = color; c.lineWidth = width; polyPath(f); c.stroke(); c.setLineDash([]); };
  const lines = (f, color, width, dash = []) => { c.setLineDash(dash.map(d => d * K)); width *= K; c.strokeStyle = color; c.lineWidth = width; for (const l of linesOf(f)) { path(l, false); c.stroke(); } c.setLineDash([]); };
  const each = (name, fn) => (L[name] || []).forEach(fn);

  // survey graticule
  if (style.key === 'survey') {
    c.strokeStyle = inkA(0.08); c.lineWidth = 1;
    for (let x = Math.ceil(SHEET.x0 / 200) * 200; x < SHEET.x1; x += 200) { c.beginPath(); c.moveTo(X(x), 0); c.lineTo(X(x), H); c.stroke(); }
    for (let y = Math.ceil(SHEET.y0 / 200) * 200; y < SHEET.y1; y += 200) { c.beginPath(); c.moveTo(0, Y(y)); c.lineTo(W, Y(y)); c.stroke(); }
  }

  // ---- existing (ink) ----
  each('golf_course', f => { c.fillStyle = inkA(style.key === 'survey' || style.key === 'night' ? 0.0 : 0.045); polyPath(f); c.fill('evenodd'); outline(f, inkA(0.7), 1.6); });
  if (style.key === 'survey') each('golf_course', f => { c.fillStyle = 'rgba(96,140,72,0.18)'; polyPath(f); c.fill('evenodd'); });
  for (const n of ['lakes', 'ponds_water_avoid']) each(n, f => {
    if (style.water && n === 'lakes') { c.fillStyle = style.water; polyPath(f); c.fill('evenodd'); } // the 'ponds' layer is buffers, not water
    hatch(f, inkA(style.water ? 0.25 : 0.45), 6, 0, 1.1); outline(f, ink, 2.2);
  });
  each('permaculture_garden', f => { hatch(f, inkA(0.35), 9, 90, 1); outline(f, inkA(0.8), 1.4); });
  for (const n of RV) each(n, f => outline(f, inkA(0.75), 1.1));
  for (const n of ['trails', 'walking_paths']) each(n, f => lines(f, style.trail || inkA(0.55), 1.6, [7, 6]));
  for (const n of EXISTING_BUILDINGS) each(n, f => { c.fillStyle = ink; polyPath(f); c.fill('evenodd'); });
  each('wells_gray_golf_rv_parcel', f => outline(f, ink, 3.2, [26, 8, 4, 8]));

  // ---- planned (accent) ----
  const plannedArea = (f, gap = 9) => { hatch(f, plan, gap, 45, 1.3); outline(f, plan, 2); };
  each('festival_grounds', f => { hatch(f, plan + '55', 16, -45, 1); outline(f, plan, 2.2, [14, 8]); });
  each('camp_plots', f => outline(f, plan + '88', 0.9));
  each('discovery_trail', f => lines(f, plan, 1.8, [2, 6]));
  each('maker_space', f => plannedArea(f, 7));
  each('event_gazebo', f => plannedArea(f, 6));
  each('event_space', f => plannedArea(f, 6));
  each('farmland', f => outline(f, plan, 1.6, [10, 7]));
  for (const n of ['farm_greenhouses', 'farm_buildings']) each(n, f => plannedArea(f, 5));
  for (const n of ['farm_market_garden', 'farm_mandala_garden', 'farm_herb_spiral', 'farm_pond']) each(n, f => outline(f, plan, 1.1));
  each('farm_swales', f => lines(f, plan, 1.2, [5, 4]));
  each('farm_food_forest', f => { for (const poly of polysOf(f)) { const [x, y] = ringCentroid(poly[0]); c.strokeStyle = plan; c.lineWidth = 1; c.beginPath(); c.arc(X(x), Y(y), 3 * s, 0, 7); c.stroke(); } });
  // planned cabins are zomes: a ring + the zome's star facets, ~8 m across (drawn a little larger to read on the sheet)
  for (const n of ['cabins', 'lake_cabins']) each(n, f => {
    for (const poly of polysOf(f)) {
      const [x, y] = ringCentroid(poly[0]), r = 5.5 * s;
      c.strokeStyle = plan; c.lineWidth = 1.2 * K; c.beginPath(); c.arc(X(x), Y(y), r, 0, 7); c.stroke();
      c.lineWidth = 0.6 * K; c.beginPath();
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; c.moveTo(X(x), Y(y)); c.lineTo(X(x) + Math.cos(a) * r, Y(y) + Math.sin(a) * r); }
      c.stroke();
    }
  });
  each('landings', f => { const [x, y] = f.c; c.fillStyle = plan; c.save(); c.translate(X(x), Y(y)); c.rotate(Math.PI / 4); c.fillRect(-4 * K, -4 * K, 8 * K, 8 * K); c.restore(); });

  // ---- labels (leader line from the label to its feature when offset) ----
  const P = name => (L.pano_points || []).find(f => (f.p.name || '').startsWith(name))?.c;
  const cen = n => L[n]?.length ? centroid(L[n]) : null;
  const label = (at, off, text, color, size = 50) => {
    if (!at) return;
    const lx = X(at[0]) + off[0] * K, ly = Y(at[1]) + off[1] * K;
    if (off[0] || off[1]) {
      c.strokeStyle = color; c.lineWidth = 1.1 * K; c.beginPath(); c.moveTo(X(at[0]), Y(at[1])); c.lineTo(lx, ly); c.stroke();
      c.fillStyle = color; c.beginPath(); c.arc(X(at[0]), Y(at[1]), 2.4 * K, 0, 7); c.fill();
    }
    c.font = `500 ${size}px Inter`; c.textBaseline = 'middle';
    c.textAlign = off[0] < 0 ? 'right' : off[0] > 0 ? 'left' : 'center';
    const t = text.toUpperCase().split('').join(' '), tx = lx + Math.sign(off[0]) * 8 * K;
    c.lineWidth = 9 * K; c.strokeStyle = rgb(style.paper, 0.9); c.strokeText(t, tx, ly);
    c.fillStyle = color; c.fillText(t, tx, ly);
  };
  // place names are 3D labels now (labels.js), floating above the land instead of printed onto it

  // ---- frame, north arrow, scale bar, title block: own canvas, fades out when the camera tilts ----
  const furniture = document.createElement('canvas'); furniture.width = W; furniture.height = H;
  c = furniture.getContext('2d');
  const m = 30;
  c.strokeStyle = ink; c.lineWidth = 2.4 * K; c.strokeRect(m, m, W - 2 * m, H - 2 * m);
  c.lineWidth = 0.8 * K; c.strokeRect(m + 9 * K, m + 9 * K, W - 2 * m - 18 * K, H - 2 * m - 18 * K);
  // north arrow + scale bar, bottom left
  const nx = 190, ny = H - 420;
  c.fillStyle = ink; c.beginPath(); c.moveTo(nx, ny - 120); c.lineTo(nx + 42, ny + 40); c.lineTo(nx, ny + 12); c.lineTo(nx - 42, ny + 40); c.closePath(); c.fill();
  c.font = '600 60px Inter'; c.textAlign = 'center'; c.fillText('N', nx, ny + 115);
  const sx0 = 120, sy = H - 170, seg = 100 * s;
  c.font = '400 34px Inter';
  for (let k = 0; k < 5; k++) { c.fillStyle = k % 2 ? rgb(style.paper) : ink; c.fillRect(sx0 + k * seg, sy, seg, 20); }
  c.strokeStyle = ink; c.lineWidth = 3; c.strokeRect(sx0, sy, 5 * seg, 20);
  c.fillStyle = ink; [0, 100, 200, 300, 400, 500].forEach((v, k) => c.fillText(String(v), sx0 + k * seg, sy - 18));
  c.textAlign = 'left'; c.fillText('M', sx0 + 5 * seg + 30, sy + 20);

  // title block, bottom right
  const tw = 1060, th = 520, tx = W - m - 22 * K - tw, ty = H - m - 22 * K - th;
  c.fillStyle = rgb(style.paper, 0.94); c.fillRect(tx, ty, tw, th);
  c.strokeStyle = ink; c.lineWidth = 4; c.strokeRect(tx, ty, tw, th);
  c.lineWidth = 2.5; c.beginPath(); c.moveTo(tx, ty + 190); c.lineTo(tx + tw, ty + 190); c.moveTo(tx, ty + 360); c.lineTo(tx + tw, ty + 360); c.stroke();
  c.textAlign = 'left'; c.fillStyle = ink;
  await drawMark(c, tx + 40, ty + 30, 134);
  c.fillStyle = ink; c.font = '500 104px Cormorant'; c.fillText('Portal.Place', tx + 140, ty + 122);
  c.font = '500 30px Inter'; c.fillText('CAMPUS MASTER PLAN', tx + 144, ty + 166);
  c.font = '400 44px Inter'; c.fillText('Clearwater, BC, Canada', tx + 48, ty + 258);
  c.font = '400 32px Inter'; c.fillStyle = inkA(0.75); c.fillText('400 ACRES · GOLF & RV RESORT', tx + 48, ty + 320);
  // legend
  c.fillStyle = ink; c.fillRect(tx + 48, ty + 404, 70, 40);
  c.font = '400 32px Inter'; c.fillText('EXISTING', tx + 140, ty + 436);
  const lx = tx + tw / 2 + 10;
  c.save(); c.beginPath(); c.rect(lx, ty + 404, 70, 40); c.clip(); c.strokeStyle = plan; c.lineWidth = 3;
  for (let k = -60; k < 120; k += 14) { c.beginPath(); c.moveTo(lx + k, ty + 404); c.lineTo(lx + k + 40, ty + 444); c.stroke(); }
  c.restore(); c.strokeStyle = plan; c.lineWidth = 3; c.strokeRect(lx, ty + 404, 70, 40);
  c.fillStyle = plan; c.fillText('PLANNED', lx + 92, ty + 436);
  c.fillStyle = inkA(0.6); c.font = '400 26px Inter'; c.fillText('SHEET 01', tx + 48, ty + 492); c.fillText('NOT FOR CONSTRUCTION', lx, ty + 492);

  // ---- planned-only overlay for the real land ----
  const overlay = document.createElement('canvas'); overlay.width = W; overlay.height = H;
  const o = overlay.getContext('2d'); o.lineJoin = 'round'; o.lineCap = 'round';
  const glow = style.planGlow;
  const oPoly = f => { o.beginPath(); for (const poly of polysOf(f)) for (const ring of poly) ring.forEach((p, i) => i ? o.lineTo(X(p[0]), Y(p[1])) : o.moveTo(X(p[0]), Y(p[1]))); };
  const oStroke = (f, w, dash = []) => { w *= 1.6; o.setLineDash(dash.map(d => d * 1.6)); o.strokeStyle = glow; o.lineWidth = w; oPoly(f); o.stroke(); o.setLineDash([]); };
  o.shadowColor = 'rgba(0,0,0,0.55)'; o.shadowBlur = 6;
  for (const n of ['festival_grounds']) each(n, f => oStroke(f, 3, [18, 10]));
  for (const n of ['maker_space', 'event_gazebo', 'event_space', 'farm_greenhouses', 'farm_buildings', 'farmland']) each(n, f => oStroke(f, 2.6, n === 'farmland' ? [12, 8] : []));
  for (const n of ['cabins', 'lake_cabins']) each(n, f => {
    for (const poly of polysOf(f)) { const [x, y] = ringCentroid(poly[0]); o.strokeStyle = glow; o.lineWidth = 2.2; o.beginPath(); o.arc(X(x), Y(y), 4 * s, 0, 7); o.stroke(); }
  });
  each('discovery_trail', f => { o.setLineDash([2, 7]); o.strokeStyle = glow; o.lineWidth = 2.4; for (const l of linesOf(f)) { o.beginPath(); l.forEach((p, i) => i ? o.lineTo(X(p[0]), Y(p[1])) : o.moveTo(X(p[0]), Y(p[1]))); o.stroke(); } o.setLineDash([]); });

  // planned labels ride on the real land too, so the plan stays readable after the reveal
  const oLabel = (at, off, text) => {
    if (!at) return;
    const lx = X(at[0]) + off[0] * K, ly = Y(at[1]) + off[1] * K;
    o.shadowBlur = 0; o.strokeStyle = glow; o.lineWidth = 2.6;
    if (off[0] || off[1]) { o.beginPath(); o.moveTo(X(at[0]), Y(at[1])); o.lineTo(lx, ly); o.stroke(); }
    o.font = '600 30px Inter'; o.textBaseline = 'middle'; o.textAlign = off[0] < 0 ? 'right' : off[0] > 0 ? 'left' : 'center';
    const t = text.toUpperCase().split('').join(' '), tx = lx + Math.sign(off[0]) * 8 * K;
    o.lineWidth = 9; o.strokeStyle = 'rgba(20,18,30,0.78)'; o.strokeText(t, tx, ly);
    o.fillStyle = glow; o.fillText(t, tx, ly);
  };
  oLabel(cen('maker_space'), [60, -10], 'Maker space');
  oLabel(cen('cabins'), [70, 10], 'Creekside zomes');
  oLabel(cen('lake_cabins'), [70, 30], 'Lakeside zomes');
  oLabel(cen('farmland'), [-90, -60], 'Farm');
  oLabel(cen('festival_grounds'), [90, 20], 'Festival grounds');
  oLabel(cen('discovery_trail'), [70, -50], 'Art trail');

  return { sheet, overlay, furniture, W, H };
}

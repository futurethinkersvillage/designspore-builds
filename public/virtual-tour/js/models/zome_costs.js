// All-in cost estimates for the planned zome layouts, CAD, built at Wells Gray (Clearwater, BC). Concept budget, not quotes.
// Quantities: the Trillium materials lists + the model's own panel areas and each layout's items. Unit prices: PRICES below.
// Volunteer labour is reported as hours and a value, and is never added to the subtotal.
import { KINDS } from './zome_furniture.js';

// src: 'R' = researched price (see SOURCES), 'A' = my allowance where no local price was published
export const PRICES = {
  // lumber: between Home Depot Canada's bulk "Pro Direct" and single-piece "Premium" listings, BC mill prices are running high in Oct 2026
  l2x4x8: [5.5, 'R', '2x4x8 SPF', 'lumber'], l2x4x10: [8, 'R', '2x4x10 SPF', 'lumber'], l2x4x12: [10.5, 'R', '2x4x12 SPF', 'lumber'],
  l2x6x8: [9.5, 'R', '2x6x8 SPF', 'lumber'], l2x6x10: [12, 'R', '2x6x10 SPF', 'lumber'], l2x6x12: [17, 'R', '2x6x12 SPF', 'lumber'], l2x6x16: [24, 'R', '2x6x16 SPF', 'lumber'], l2x10x10: [30, 'A', '2x10x10 SPF', 'lumber'],
  pt2x4x8: [12, 'A', '2x4x8 pressure treated', 'lumber'], pt2x4x10: [15, 'A', '2x4x10 pressure treated', 'lumber'],
  acx19: [105, 'R', '19 mm plywood, 4x8', 'panels'], cdx13: [62, 'R', '13 mm sheathing, 4x8', 'panels'], osb58: [34, 'R', '5/8 OSB roof sheathing, 4x8', 'panels'], tg34: [75, 'R', '3/4 T&G subfloor, 4x8', 'panels'], ply6: [60, 'A', '6 mm interior plywood, 4x8', 'panels'],
  shingle: [13.6, 'R', 'Shingles per m² (bundle $41.99 / 33.3 ft²)', 'envelope'], iws: [4.7, 'R', 'Ice and water membrane per m² ($84.99 roll)', 'envelope'], underlay: [1.5, 'A', 'Synthetic underlay per m²', 'envelope'], hipcap: [8.3, 'R', 'Hip cap per m of seam ($74.99 / 29.6 lf)', 'envelope'],
  r12: [9.9, 'R', 'R-12 batts per m²', 'envelope'], r20: [15.4, 'R', 'R-20 batts per m²', 'envelope'], poly: [1.5, 'A', 'Vapour barrier + tape per m²', 'envelope'], seamTrim: [3.5, 'A', 'Interior seam trim per m', 'envelope'],
  pc8: [28.6, 'R', '8 mm twin-wall per m² ($85 / 4x8)', 'clear'], pc16: [67.3, 'R', '16 mm triple-wall per m² ($200 / 4x8)', 'clear'], pcBars: [16, 'A', 'Glazing bars, tape, sealant per m²', 'clear'], pcShip: [450, 'R', 'Polycarbonate freight', 'clear'],
  pier: [110, 'A', 'Concrete footing + post + bracket, each (plan sheet assumes $35 with no footing)', 'floor'], floorFinish: [43, 'A', 'Finished floor per m²', 'floor'], cedarWall: [55, 'A', 'Cedar siding + wrap per m²', 'doors'],
  doorA: [950, 'A', 'Full-lite exterior door', 'doors'], doorDouble: [2100, 'R', 'Double patio door (average, Home Depot Canada)', 'doors'], transom: [1400, 'A', 'Gable or transom glazing', 'doors'],
  winHome: [850, 'A', 'Home-plate window on curb', 'windows'], winTri: [600, 'A', 'Triangle window', 'windows'], winFull: [1400, 'A', 'Full diamond window', 'windows'], sky: [450, 'A', 'Skylight panel, each of 10', 'windows'],
};

// furniture and fit-out, each. R = IKEA Canada or dealer listing, A = allowance
export const FIT = {
  king: [1250, 'A'], queen: [1050, 'R'], double: [800, 'R'], single: [450, 'R'], bunk: [900, 'R'], daybed: [550, 'R'], sofa: [749, 'R'], sofabed: [1099, 'R'], loveseat: [549, 'R'], armchair: [399, 'R'], chair: [80, 'R'], stool: [60, 'A'], cushion: [40, 'A'],
  rtable: [350, 'A'], ctable: [170, 'R'], lowtable: [120, 'A'], bistro: [180, 'A'], desk: [480, 'R'], longdesk: [950, 'A'], bookshelf: [200, 'R'], wardrobe: [600, 'R'], cabinet: [220, 'A'], bench: [180, 'A'], rug: [250, 'R'], mat: [45, 'A'], massage: [950, 'A'], telescope: [900, 'A'], piano: [3500, 'A'], drums: [1200, 'A'], amp: [500, 'A'], easel: [120, 'A'], workbench: [450, 'A'], printer: [800, 'A'], booth: [3500, 'A'], screen: [1250, 'A'], kidtable: [150, 'A'], firebowl: [2200, 'A'], towel: [150, 'A'], fridge: [1100, 'A'], lounger: [180, 'A'],
  toilet: [350, 'A'], vanity: [450, 'A'], shower: [1100, 'A'], rollshower: [2000, 'A'], woodstove: [5500, 'A'], saunastove: [3200, 'A'], plunge: [4500, 'R'], saunabox: [10620, 'R'], potting: [400, 'A'], tree: [350, 'A'], planter: [90, 'A'], hanging: [45, 'A'], pond: [900, 'A'], ladder: [300, 'A'], shipstair: [1200, 'A'], stair: [3000, 'A'], arcbench: [220, 'R'], idoor: [0, 'A'],
};

export const RATES = {
  electricPerM2: 85, electricMin: 1800, electricKitchen: 1200, electricBath: 500, electricTub: 1200,   // about $8/ft²; BC electricians $80-150/h
  plumbBath: 4500, plumbKitchen: 1800, plumbSingle: 1500, plumbTubFill: 800, plumbDrain: 900, plumbHose: 600, waterHeater: 900,
  powerFeed: 3000, waterSewerFeed: 4500, sitePrepBase: 1200, sitePrepPerM2: 22,
  engineerBase: 1500, engineerLoft: 1500, wett: 350, leadShare: 0, leadRate: 65, volunteerRate: 31, contingency: 0.15, gst: 0.05, pst: 0.07,
};

const PLAN_BOM = {
  acorn: { frame: [['acx19', 2], ['l2x6x8', 16], ['l2x6x8', 4], ['pt2x4x8', 4], ['l2x4x8', 3]], deck: [['l2x4x8', 15], ['tg34', 2]], piers: 8, entry: [['l2x4x8', 6], ['l2x6x8', 2], ['tg34', 1]], entryPiers: 2, screwsFrame: 75, screwsDeck: 40 },
  z5: { frame: [['acx19', 2], ['l2x6x10', 21], ['l2x10x10', 5], ['pt2x4x10', 5], ['l2x4x8', 3]], deck: [['l2x6x12', 22], ['tg34', 7]], piers: 9, entry: [['l2x6x10', 6], ['tg34', 1]], entryPiers: 2, screwsFrame: 75, screwsDeck: 120, deckDerived: true },
  z6: { frame: [['acx19', 3], ['l2x6x12', 54], ['l2x6x8', 10], ['l2x4x8', 6]], deck: [['l2x6x12', 35], ['tg34', 10]], piers: 11, entry: [['l2x6x10', 8], ['tg34', 2]], entryPiers: 2, screwsFrame: 275, screwsDeck: 24 },
  z75: { frame: [['l2x4x10', 115], ['l2x4x8', 20], ['l2x6x8', 3], ['cdx13', 6], ['l2x4x10', 20]], deck: [['l2x6x16', 20], ['l2x6x8', 30], ['tg34', 16]], piers: 21, entry: [['l2x6x12', 5], ['tg34', 1]], entryPiers: 2, screwsFrame: 300, screwsDeck: 191 },
  z9: { frame: [['l2x4x12', 115], ['l2x4x10', 20], ['l2x6x8', 3]], deck: [['l2x6x16', 30], ['l2x6x8', 40], ['tg34', 21]], piers: 21, entryPiers: 3, screwsFrame: 300, screwsDeck: 191,
    doorB: [['cdx13', 9], ['l2x4x10', 22], ['l2x6x16', 3], ['l2x6x12', 7], ['tg34', 1]], doorC: [['cdx13', 7], ['l2x4x10', 20], ['l2x6x12', 5], ['tg34', 1]] },
};
const DOORWALL = { acorn: 0, z5: 0, z6: 0, z75: 24, z9: { B: 30, C: 22 } };
const DOORHOURS = { A: 60, B: 150, C: 110 };
const round = n => Math.round(n);
const polyA3 = pts => { let a = [0, 0, 0]; for (let i = 1; i < pts.length - 1; i++) { const u = pts[i].map((v, k) => v - pts[0][k]), w = pts[i + 1].map((v, k) => v - pts[0][k]); a = [a[0] + u[1] * w[2] - u[2] * w[1], a[1] + u[2] * w[0] - u[0] * w[2], a[2] + u[0] * w[1] - u[1] * w[0]]; } return Math.hypot(...a) / 2; };

// TNRD Bylaw 2661 Schedule 1: $50 for the first $1000, then $9 per $1000 or part; plumbing $75 + $10 per further fixture; chimney $100
export const tnrdPermit = value => value <= 1000 ? 50 : 50 + 9 * Math.ceil((value - 1000) / 1000);
// Technical Safety BC contractor permit, by job value (2027 column of the fee schedule)
const TSBC = [[150, 16], [400, 38], [1000, 121], [2500, 217], [5000, 352], [10000, 541], [20000, 885], [35000, 1298], [50000, 1808], [100000, 2592], [200000, 3884]];
export const tsbcPermit = v => { for (const [t, f] of TSBC) if (v <= t) return f; return 3884; };

// layouts where the public use may change the building code class: costs below don't include that extra work
export const PUBLIC_USE = ['z75-cafe', 'z9-dining', 'gl-z9-cafe', 'z9-class', 'gl-z75-class', 'z75-cowork', 'z9-maker', 'z9-yoga', 'z75-spa', 'gl-z75-spa', 'gl-z9-spa', 'gl-z6-tub', 'gl-z6-dining', 'z6-office'];

export function costPlan(p) {
  const Z = p.Z, T = Z.T, bom = PLAN_BOM[p.type], P = k => PRICES[k][0];
  const clearRows = p.glass === 'all' ? Infinity : p.glass === 'upper' ? Z.K - 2 : 0;
  let cladA = 0, clearA = 0, seam = 0, panels = 0;
  for (const f of Z.kept) { const a = polyA3(f.pts); if (f.row <= clearRows) clearA += a; else cladA += a; panels++; for (let i = 0; i < f.pts.length; i++) { const u = f.pts[i], w = f.pts[(i + 1) % f.pts.length]; seam += Math.hypot(u[0] - w[0], u[1] - w[1], u[2] - w[2]) / 2; } }
  const floorA = Z.stats.floorArea, heatSpec = T.frameDepth >= 0.089 || T.method === 'beveled' ? 'r12' : 'r12';
  const bomCost = list => list.reduce((s, [k, q]) => s + P(k) * q, 0);
  const L = {};
  const add = (grp, name, amt) => { (L[grp] = L[grp] || []).push([name, round(amt)]); };

  // ---- structure ------------------------------------------------------------------------------------------
  const doorBom = p.type === 'z9' ? (Z.door === 'C' ? bom.doorC : bom.doorB) : (bom.entry || []);
  add('shell', 'Panel frames, base, door framing', bomCost(bom.frame) + bom.screwsFrame);
  add('shell', 'Floor platform and footings', bomCost(bom.deck) + bom.piers * P('pier') + bom.screwsDeck);
  add('shell', 'Entry deck and doorway framing', bomCost(doorBom) + bom.entryPiers * P('pier'));
  const wall = p.type === 'z9' ? DOORWALL.z9[Z.door] : DOORWALL[p.type];
  if (wall) add('shell', 'Dormer siding', wall * P('cedarWall'));
  // ---- skin ---------------------------------------------------------------------------------------------------
  if (cladA) {
    const sheets = cladA * 1.15 / 2.97;
    add('shell', 'Roof sheathing', sheets * P('osb58'));
    add('shell', 'Shingles and membrane', cladA * 1.25 * P('shingle') + cladA * 0.4 * P('iws') + cladA * P('underlay') + seam * (cladA / (cladA + clearA)) * P('hipcap'));
    add('shell', 'Insulation, vapour barrier, interior panels', cladA * (P(heatSpec) + P('poly')) + cladA * 1.15 / 2.97 * P('ply6') + seam * (cladA / (cladA + clearA)) * P('seamTrim'));
  }
  if (clearA) add('shell', 'Polycarbonate panels', clearA * 1.4 * P('pc8') + clearA * P('pcBars') + P('pcShip'));
  add('shell', p.glass ? 'Floor finish (decking)' : 'Floor insulation and finish', floorA * (P('floorFinish') + (p.glass ? 0 : P('r20'))));
  const door = Z.door === 'A' ? P('doorA') : P('doorDouble') + P('transom');
  add('shell', Z.door === 'A' ? 'Entry door' : 'Double doors and gable glazing', door);
  let win = 0; for (const [, , kind] of p.glaze || []) win += kind === 'home' ? P('winHome') : kind === 'tri' ? P('winTri') : P('winFull');
  if (p.sky) win += 10 * P('sky');
  if (win) add('shell', 'Windows and skylights', win);
  // ---- interior build + furniture --------------------------------------------------------------------------------
  const furn = new Map(), n = {}; let wallM = 0, doors = 0;
  const fa = (label, v, q = 1) => { const e = furn.get(label) || [0, 0]; e[0] += v; e[1] += q; furn.set(label, e); };
  for (const it of p.items) {
    n[it.k] = (n[it.k] || 0) + 1;
    if (it.k === 'wall') { const m = Math.hypot(it.a[0] - it.b[0], it.a[1] - it.b[1]); wallM += m; if (it.door !== undefined) doors++; continue; }
    const k = KINDS[it.k], w = it.w || k.w, d = it.d || k.d;
    if (it.k === 'counter') fa('Kitchen run', w * 1100 + ((it.appl || ['sink', 'hob']).includes('hob') ? 700 : 0) + ((it.appl || []).includes('espresso') ? 1800 : 0));
    else if (it.k === 'island') fa('Island', w * 1400);
    else if (it.k === 'servebar') fa('Serving bar', w * 1200);
    else if (it.k === 'table') fa('Table', w * 250);
    else if (it.k === 'hottub') fa('Cedar hot tub', w < 1.9 ? 5500 : w < 2.5 ? 7700 : 14000);
    else if (it.k === 'bed_raised') fa('Raised bed', w * d * 260);
    else if (FIT[it.k] && FIT[it.k][0]) fa(k.label, FIT[it.k][0]);
  }
  const wallsCost = wallM * 2.3 * 58 + doors * 350;
  if (wallM) add('fit', 'Partitions and interior doors', wallsCost);
  if (p.loft) add('fit', 'Loft structure and railing', Z.polyArea(p.loft.poly) * 210 + 600);
  for (const [label, [v, q]] of [...furn].sort((a, b) => b[1][0] - a[1][0])) add('fit', q > 1 ? `${label} × ${q}` : label, v);
  add('fit', 'Lighting and small items', floorA * 35);
  if (!p.glass && !n.woodstove && !n.saunastove) add('fit', 'Electric baseboard heat', floorA * 40);
  // ---- trades ---------------------------------------------------------------------------------------------------------
  const R = RATES, hasKitchen = (n.counter || 0) + (n.servebar || 0) + (n.island || 0) > 0;
  const baths = Math.max(n.shower || 0, n.rollshower || 0, n.toilet || 0);
  const plumbedKitchen = p.items.some(i => (i.k === 'counter' && (i.appl || ['sink']).includes('sink')) || i.k === 'servebar');
  const elec = p.id === 'acorn-sauna' ? R.electricMin * 0.6 : R.electricMin + floorA * R.electricPerM2 * (p.glass ? 0.45 : 1) + (hasKitchen ? R.electricKitchen : 0) + baths * R.electricBath + ((n.hottub || n.plunge) ? R.electricTub : 0) + (n.printer ? 800 : 0) + (n.booth ? 300 : 0);
  add('trades', 'Electrician', elec);
  let plumb = baths * R.plumbBath + (plumbedKitchen ? R.plumbKitchen : 0) + (n.potting || n.bed_raised ? R.plumbHose : 0) + (n.hottub ? R.plumbTubFill * n.hottub : 0) + (n.plunge ? R.plumbTubFill : 0) + (n.hottub || n.plunge || n.saunabox ? R.plumbDrain : 0);
  if (!baths && !plumbedKitchen && (n.vanity || n.shower)) plumb += R.plumbSingle;
  if (baths || plumbedKitchen) plumb += R.waterHeater;
  if (plumb) add('trades', 'Plumber', plumb);
  if (baths || plumbedKitchen || n.hottub || n.plunge) add('trades', 'Water and sewer line to site', R.waterSewerFeed);
  add('trades', 'Power line to site', R.powerFeed);
  add('trades', 'Site prep and excavator', R.sitePrepBase + floorA * R.sitePrepPerM2);
  add('trades', 'Engineer site letter and review', R.engineerBase + (p.loft ? R.engineerLoft : 0));
  if (n.woodstove || n.saunastove) add('trades', 'Stove inspection (WETT)', R.wett);
  // ---- volunteer hours ------------------------------------------------------------------------------------------------
  const perPanel = 2.5 + T.L * 2;
  let hrs = panels * perPanel + cladA * 1.8 + clearA * 1.0 + floorA * 2.5 + DOORHOURS[Z.door] + (bom.piers + bom.entryPiers) * 3 + wallM * 3 + (p.loft ? Z.polyArea(p.loft.poly) * 6 : 0) + (n.stair ? 16 : 0) + (n.shipstair ? 8 : 0);
  hrs += p.items.reduce((s, it) => { if (it.k === 'counter' || it.k === 'island' || it.k === 'servebar') return s + 12; if (it.k === 'wall') return s; if (it.k === 'bed_raised') return s + 3; if (it.k === 'hottub' || it.k === 'saunabox') return s + 10; const K = KINDS[it.k]; return s + (K.soft ? 0.1 : 0.6); }, 0);
  const lead = hrs * R.leadShare, vol = hrs - lead;
  if (lead) add('trades', 'Paid lead carpenter', lead * R.leadRate);   // the site lead is a volunteer; leadShare > 0 would bring a paid one back
  // ---- logistics --------------------------------------------------------------------------------------------------------
  const loads = Math.ceil(floorA / 25) + 1;
  add('logistics', `Delivery from Kamloops (${loads} load${loads > 1 ? 's' : ''})`, loads * 450);
  add('logistics', 'Scaffold or lift rental', 400 + Z.stats.shellH * Z.stats.shellH * 90);
  add('logistics', 'Waste bin, site insurance', 500 + floorA * 30);
  // ---- permits ---------------------------------------------------------------------------------------------------------
  const sum = g => (L[g] || []).reduce((s, x) => s + x[1], 0);
  const hardValue = sum('shell') + sum('fit') + sum('trades') + sum('logistics') + vol * R.volunteerRate;
  const permitB = tnrdPermit(hardValue) + (baths || plumbedKitchen ? 75 + 10 * (baths * 3 + (plumbedKitchen ? 1 : 0)) : 0) + (n.woodstove || n.saunastove ? 100 : 0);
  add('permits', 'Building and plumbing permit (TNRD fee schedule)', permitB);
  add('permits', 'Electrical permit (Technical Safety BC)', tsbcPermit(elec));
  const subtotalPre = sum('shell') + sum('fit') + sum('trades') + sum('logistics') + sum('permits');
  const goods = sum('shell') + sum('fit');
  const contingency = subtotalPre * R.contingency;
  const tax = goods * (1 + R.contingency) * R.pst + (subtotalPre + contingency) * R.gst;
  const subtotal = subtotalPre + contingency + tax;
  // low / high: materials and trades move differently
  const low = (goods * 0.88 + (subtotalPre - goods) * 0.8) * (1 + 0.1) * 1.11, high = (goods * 1.2 + (subtotalPre - goods) * 1.4) * (1 + 0.2) * 1.12;
  return {
    polyUp: round(clearA * 1.4 * (P('pc16') - P('pc8'))), totalHours: round(hrs),
    id: p.id, lines: L, shell: sum('shell'), fit: sum('fit'), trades: sum('trades'), logistics: sum('logistics'), permits: sum('permits'), contingency: round(contingency), tax: round(tax), subtotal: round(subtotal), low: round(low), high: round(high),
    volunteerHours: round(vol), leadHours: round(lead), volunteerValue: round(vol * R.volunteerRate), crewDays: round(vol / (5 * 8)), perM2: round(subtotal / floorA), areas: { cladA: +cladA.toFixed(1), clearA: +clearA.toFixed(1), seam: +seam.toFixed(1), floorA: +floorA.toFixed(1), panels },
  };
}

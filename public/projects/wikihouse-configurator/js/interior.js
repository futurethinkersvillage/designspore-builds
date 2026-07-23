// Optional interior layer: furnishings, decor, services, wall artwork, and CNC
// plywood furniture (models in furniture-models.js). All off by default. Prices
// are Canadian ballparks (2026). Furniture is laid out relative to the building
// dimensions, so it reflows when the structure length/span changes.
//
// CNC furniture designs reference open cut-file libraries:
//   opendesk.cc · obrary.com · 3axis.co · filson-rohrbacher.com (AtFAB)

export const SERVICES = [
  { id: "electrical", label: "Electrical rough-in + fixtures", unit: "m² floor", cad: 95, note: "wiring, panel, outlets, lighting" },
  { id: "plumbing", label: "Plumbing rough-in", unit: "fixture", cad: 1200, note: "supply + drain per fixture" },
  { id: "water_heater", label: "Hot-water heat pump", unit: "unit", cad: 3800 },
  { id: "water_tank", label: "Rain/water tank + pump", unit: "unit", cad: 2600, note: "off-grid water" },
  { id: "heating", label: "Mini-split heat pump", unit: "unit", cad: 4500, note: "heating + cooling" },
  { id: "ventilation", label: "HRV / MVHR unit", unit: "unit", cad: 3200 },
  { id: "solar", label: "Solar PV + battery", unit: "kW", cad: 2400, note: "per kW installed" },
];

// box = [width(x), height(y), depth(z)] footprint; model -> furniture-models.js builder
export const FIXTURES = [
  { id: "kitchen", label: "Kitchen unit + appliances", cad: 9500, model: "kitchen", box: [2.4, 0.9, 0.6], zone: "back-a", accent: "#c9c2b4" },
  { id: "bathroom", label: "Bathroom pod (WC/basin/shower)", cad: 8500, model: "bathroom", box: [1.8, 2.0, 1.5], zone: "corner-bb", accent: "#dfe6e8" },
  { id: "woodstove", label: "Wood stove + flue", cad: 3400, model: "stove", box: [0.5, 1.2, 0.5], zone: "corner-ab" },
];

export const FURNITURE = [
  { id: "atfab_table", label: "AtFAB dining table", cad: 320, model: "table", box: [1.6, 0.74, 0.9], zone: "center", src: "filson-rohrbacher.com/work/atfab" },
  { id: "opendesk_desk", label: "Opendesk Lean desk", cad: 260, model: "desk", box: [1.4, 0.73, 0.7], zone: "front-a", src: "opendesk.cc" },
  { id: "chairs", label: "CNC chairs (set of 4)", cad: 340, model: "chair", box: [0.45, 0.85, 0.5], zone: "around-table", count: 4, src: "obrary.com" },
  { id: "shelving", label: "CNC shelving wall", cad: 480, model: "shelf", box: [1.8, 2.0, 0.32], zone: "back-b", src: "3axis.co" },
  { id: "bed", label: "CNC platform bed", cad: 420, model: "bed", box: [2.1, 0.6, 1.5], zone: "end-b", src: "opendesk.cc" },
  { id: "sofa", label: "CNC-frame sofa", cad: 560, model: "sofa", box: [2.0, 0.8, 0.9], zone: "front-b", accent: "#7a8a6d", src: "obrary.com" },
  { id: "stools", label: "CNC stools (pair)", cad: 140, model: "stool", box: [0.4, 0.5, 0.4], zone: "front-a", count: 2, src: "3axis.co" },
];

export const DECOR = [
  { id: "rug", label: "Area rug", cad: 250, model: "rug", box: [2.4, 0.02, 1.6], zone: "center", accent: "#a5583f" },
  { id: "plants", label: "Plants (set)", cad: 180, model: "plant", box: [0.4, 1.1, 0.4], zone: "corner-ab", count: 2 },
  { id: "lighting", label: "Pendant + track lighting", cad: 620, model: null, box: [0.3, 0.2, 0.3], zone: "ceiling" },
  { id: "artwork", label: "Wall artwork (curated set)", cad: 400, art: true },
];

export const ALL_INTERIOR = { SERVICES, FIXTURES, FURNITURE, DECOR };

// Named interior layout templates — a template is just a set of enabled item ids.
// Placement reflows with building size, so the same template works at any length.
export const INTERIOR_TEMPLATES = {
  "Empty": [],
  "Studio living": ["kitchen", "sofa", "atfab_table", "chairs", "shelving", "rug", "artwork", "plants", "lighting", "electrical", "heating"],
  "One-bed home": ["kitchen", "bathroom", "bed", "sofa", "shelving", "rug", "artwork", "plants", "lighting", "electrical", "plumbing", "heating", "water_heater"],
  "Home office": ["opendesk_desk", "stools", "shelving", "sofa", "artwork", "plants", "lighting", "electrical", "heating"],
  "Off-grid cabin": ["woodstove", "bed", "atfab_table", "stools", "shelving", "rug", "artwork", "water_tank", "solar", "electrical"],
  "Full house": ["kitchen", "bathroom", "bed", "sofa", "atfab_table", "chairs", "shelving", "woodstove", "rug", "artwork", "plants", "lighting", "electrical", "plumbing", "heating", "ventilation", "water_heater"],
};

function itemById(id) {
  return [...FIXTURES, ...FURNITURE, ...DECOR].find((x) => x.id === id);
}

// deterministic pseudo-random (no Math.random — stable renders)
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

const ART_PALETTES = [
  ["#e07a5f", "#3d405b", "#f2cc8f", "#81b29a"],
  ["#264653", "#2a9d8f", "#e9c46a", "#e76f51"],
  ["#22223b", "#9a8c98", "#c9ada7", "#f2e9e4"],
  ["#d62828", "#f77f00", "#fcbf49", "#003049"],
];

export function artCanvas(seed) {
  const rnd = rng(seed * 7 + 13);
  const pal = ART_PALETTES[Math.floor(rnd() * ART_PALETTES.length)];
  const c = document.createElement("canvas");
  c.width = 256; c.height = 320;
  const g = c.getContext("2d");
  g.fillStyle = pal[0]; g.fillRect(0, 0, c.width, c.height);
  const n = 3 + Math.floor(rnd() * 4);
  for (let i = 0; i < n; i++) {
    g.fillStyle = pal[1 + Math.floor(rnd() * (pal.length - 1))];
    const w = 40 + rnd() * 150, h = 40 + rnd() * 180;
    g.save();
    g.translate(rnd() * c.width, rnd() * c.height);
    g.rotate((rnd() - 0.5) * 0.6);
    if (rnd() > 0.5) g.fillRect(-w / 2, -h / 2, w, h);
    else { g.beginPath(); g.arc(0, 0, w / 2, 0, Math.PI * 2); g.fill(); }
    g.restore();
  }
  g.strokeStyle = "#1a1a1a"; g.lineWidth = 10; g.strokeRect(0, 0, c.width, c.height);
  return c;
}

// Build 3D interior pieces for the enabled items, laid out on the ground floor
// relative to the current footprint. Returns furniture/art piece specs.
export function buildInteriorPieces(selected, metrics) {
  const pieces = [];
  const floorTop = 0.45;
  const halfL = metrics.outerL / 2 - 0.35;   // x
  const halfW = metrics.outerW / 2 - 0.35;   // z
  let tablePos = { x: 0, z: 0 };

  // resolve a zone label to an (x,z) + rotation
  function zonePos(zone, w, d, idx = 0) {
    switch (zone) {
      case "back-a": return { x: halfL - w / 2, z: -halfW + d / 2, rotY: 0 };
      case "back-b": return { x: -halfL + w / 2, z: -halfW + d / 2, rotY: 0 };
      case "front-a": return { x: halfL - w / 2, z: halfW - d / 2, rotY: Math.PI };
      case "front-b": return { x: 0, z: halfW - d / 2, rotY: Math.PI };
      case "end-b": return { x: -halfL + w / 2, z: 0, rotY: 0 };
      case "corner-ab": return { x: -halfL + w / 2 + idx * 0.6, z: halfW - d / 2, rotY: 0 };
      case "corner-bb": return { x: -halfL + w / 2, z: -halfW + d / 2, rotY: 0 };
      case "center": return { x: 0.3, z: 0, rotY: 0 };
      default: return { x: 0, z: 0, rotY: 0 };
    }
  }

  // first pass: locate the table (chairs cluster around it)
  if (selected["atfab_table"]) {
    const it = itemById("atfab_table");
    tablePos = zonePos(it.zone, it.box[0], it.box[2]);
  }

  for (const id of Object.keys(selected)) {
    if (!selected[id]) continue;
    const it = itemById(id);
    if (!it) continue;

    if (it.art) {
      const count = 3;
      for (let k = 0; k < count; k++) {
        pieces.push({ kind: "art", x: (k - (count - 1) / 2) * Math.min(1.4, metrics.outerL / 4),
          y: floorTop + 1.5, z: -halfW - 0.34, sx: 0.7, sy: 0.9, sz: 0.04, seed: k + 1 });
      }
      continue;
    }
    if (!it.model) continue; // e.g. lighting (cost only)

    const [w, h, d] = it.box;
    if (it.zone === "around-table") {
      const n = it.count || 4;
      const rx = it.box[0] + 0.55, rz = it.box[2] + 0.35;
      const offs = [[0, rz], [0, -rz], [rx, 0], [-rx, 0]];
      for (let k = 0; k < n; k++) {
        const o = offs[k % offs.length];
        pieces.push({ kind: "furniture", model: it.model, x: tablePos.x + o[0], y: floorTop, z: tablePos.z + o[1],
          w, d, h, color: it.accent, rotY: Math.atan2(-o[0], -o[1]) });
      }
      continue;
    }
    const n = it.count || 1;
    for (let k = 0; k < n; k++) {
      const p = zonePos(it.zone, w, d, k);
      pieces.push({ kind: "furniture", model: it.model, x: p.x + k * (w + 0.3), y: floorTop, z: p.z,
        w, d, h, color: it.accent, rotY: p.rotY });
    }
  }
  return pieces;
}

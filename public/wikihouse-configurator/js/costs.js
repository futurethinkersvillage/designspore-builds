// Cost model. Mirrors WikiHouse's official BoM structure, plus finish materials
// and an optional interior/services layer (Canadian ballpark prices, 2026).
// A MATERIALS SUBTOTAL is reported before labour so material-only cost is visible.

import { block } from "./blocks.js";
import { roofingById, claddingById } from "./materials.js";
import { SERVICES, FIXTURES, FURNITURE, DECOR } from "./interior.js";

export const RATES = {
  currency: "CAD $",
  sheet: { label: "OSB3 18mm 2440×1220 sheet", unit: "sheet", value: 65 },
  cnc: { label: "CNC cutting", unit: "sheet", value: 60 },
  insulation: { label: "Insulation batts", unit: "m²", value: 14 },
  membrane: { label: "Membranes & tapes", unit: "m² envelope", value: 8 },
  fixings: { label: "Fixings (screws, nails, glue)", unit: "block", value: 6 },
  foundation: { label: "Ground screws / piers", unit: "point", value: 240 },
  windowUnit: { label: "Window units (glazing)", unit: "window", value: 700 },
  doorUnit: { label: "External doors", unit: "door", value: 1500 },
  labour: { label: "Assembly labour", unit: "person-day", value: 400 },
  delivery: { label: "Sheet & material delivery to site", unit: "lump", value: 1200 },
  contingency: { label: "Contingency", unit: "%", value: 10 },
};

const SHEET_MASS_KG = 32;

function interiorCatalog(id) {
  return [...SERVICES, ...FIXTURES, ...FURNITURE, ...DECOR].find((x) => x.id === id);
}

export function computeCosts(result, cfg) {
  const { bom, approx, metrics } = result;
  const approxMap = new Map(approx.map((a) => [a.id, a]));
  const r = RATES;

  // ---- chassis quantities from manifest ----
  let sheets = 0, insulation = 0, blocksN = 0;
  const bomRows = [];
  for (const [id, qty] of bom.entries()) {
    const a = approxMap.get(id);
    const b = block(id);
    const perSheets = a ? a.sheets : b ? b.sheets_est : 2;
    const perIns = a ? a.insulation : b ? b.insulation_m2 : 0;
    const est = a || !b || b.data_source !== "official-bom";
    sheets += perSheets * qty;
    insulation += perIns * qty;
    blocksN += qty;
    bomRows.push({ id, qty, sheets: perSheets * qty, est });
  }
  bomRows.sort((x, y) => x.id.localeCompare(y.id));

  const roofMat = roofingById(cfg.roofing);
  const cladMat = claddingById(cfg.cladding);
  const q = {
    sheets: Math.ceil(sheets),
    insulation: Math.ceil(insulation),
    envelope: Math.ceil(metrics.wallArea + metrics.roofArea + metrics.footprint),
    blocks: blocksN,
    foundationPts: Math.max(6, Math.ceil(metrics.footprint / 4)),
    wallArea: Math.ceil(metrics.wallArea),
    roofArea: Math.ceil(metrics.roofArea),
    windows: metrics.windows,
    doors: metrics.doors,
    labourDays: Math.ceil(blocksN / 6) + (metrics.storeys - 1) * 2,
  };

  // helper builders — editable line (RATES key) vs static line (catalog price)
  const eLine = (key, qty) => ({ label: r[key].label, unit: r[key].unit, qty, key, value: r[key].value, cost: qty * r[key].value });
  const sLine = (label, unit, qty, value) => ({ label, unit, qty, value, cost: qty * value });

  const materialGroups = [
    {
      name: "WikiHouse chassis", materials: true,
      lines: [eLine("sheet", q.sheets), eLine("cnc", q.sheets), eLine("insulation", q.insulation),
        eLine("membrane", q.envelope), eLine("fixings", q.blocks)],
    },
    {
      name: "Envelope finishes", materials: true,
      lines: [
        sLine(`Cladding — ${cladMat.label}`, "m² wall", q.wallArea, cladMat.cad),
        sLine(`Roofing — ${roofMat.label}`, "m² roof", q.roofArea, roofMat.cad),
        eLine("windowUnit", q.windows), eLine("doorUnit", q.doors),
      ],
    },
    {
      name: "Foundation", materials: true,
      lines: [eLine("foundation", q.foundationPts)],
    },
  ];

  // ---- interior & services (optional) ----
  const interiorLines = [];
  for (const id of Object.keys(cfg.interior || {})) {
    if (!cfg.interior[id]) continue;
    const item = interiorCatalog(id);
    if (!item) continue;
    let qty = 1, unit = item.unit || "unit";
    if (id === "electrical") qty = Math.ceil(metrics.floorArea);
    else if (id === "plumbing") qty = Math.max(1, (cfg.interior.kitchen ? 1 : 0) + (cfg.interior.bathroom ? 3 : 0));
    else if (id === "solar") qty = 3; // default 3 kW
    interiorLines.push(sLine(item.label, unit, qty, item.cad));
  }
  if (interiorLines.length) {
    materialGroups.push({ name: "Interior & services", materials: true, lines: interiorLines });
  }

  // ---- build (labour & logistics) — NOT materials ----
  const buildGroup = {
    name: "Labour & logistics", materials: false,
    lines: [eLine("labour", q.labourDays), eLine("delivery", 1)],
  };

  const groups = [...materialGroups, buildGroup];
  for (const g of groups) g.total = g.lines.reduce((a, l) => a + l.cost, 0);

  const materialsSubtotal = materialGroups.reduce((a, g) => a + g.total, 0);
  const labourTotal = buildGroup.total;
  const subtotal = materialsSubtotal + labourTotal;
  const contingency = (subtotal * r.contingency.value) / 100;
  const total = subtotal + contingency;

  return {
    groups, materialsSubtotal, labourTotal, subtotal, contingency, total,
    perM2: total / metrics.floorArea,
    materialsPerM2: materialsSubtotal / metrics.floorArea,
    timberMassKg: Math.round(q.sheets * SHEET_MASS_KG),
    bomRows, quantities: q,
  };
}

export function bomCSV(result, costs, cfg) {
  const lines = [["WikiHouse Skylark configurator - bill of materials"],
    ["System", cfg ? cfg.system : ""],
    [],
    ["Block", "Qty", "Sheets (est)", "Data source"]];
  for (const row of costs.bomRows) {
    lines.push([row.id, row.qty, row.sheets.toFixed(1), row.est ? "estimated" : "official BoM"]);
  }
  lines.push([], ["Cost group", "Item", "Qty", "Unit", "Rate", "Cost"]);
  for (const g of costs.groups) {
    for (const l of g.lines) lines.push([g.name, l.label, l.qty, l.unit, l.value, l.cost.toFixed(0)]);
  }
  lines.push([], ["", "MATERIALS SUBTOTAL", "", "", "", costs.materialsSubtotal.toFixed(0)]);
  lines.push(["", "Labour & logistics", "", "", "", costs.labourTotal.toFixed(0)]);
  lines.push(["", "Contingency " + RATES.contingency.value + "%", "", "", "", costs.contingency.toFixed(0)]);
  lines.push(["", "TOTAL (" + RATES.currency + ")", "", "", "", costs.total.toFixed(0)]);
  lines.push([]);
  lines.push(["Disclaimer: estimates only, not a quote. Structural engineering review required."]);
  return lines.map((l) => l.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
}

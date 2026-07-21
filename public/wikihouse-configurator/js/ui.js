// UI wiring: config state, controls, openings grid, cost panel, BOM, CSV export.
import { SPEC, SYSTEM, loadSystem } from "./blocks.js";
import { SYSTEMS, DEFAULT_SYSTEM } from "./systems.js";
import { assemble, autoSkylightMods } from "./assembler.js";
import { RATES, computeCosts, bomCSV } from "./costs.js";
import { ROOFING, CLADDING } from "./materials.js";
import { SERVICES, FIXTURES, FURNITURE, DECOR, INTERIOR_TEMPLATES } from "./interior.js";

export const config = {
  system: DEFAULT_SYSTEM,
  span: "S",
  modules: 8,
  wallHeight: "M",
  roof: "gable42",
  storeys: 1,
  skylightMods: [],   // explicit module indices with a skylight (edited via roof grid)
  roofing: "standingseam",
  cladding: "larch",
  openings: { front: { 2: "door" }, back: {} },
  showInterior: false,
  interior: {},       // { itemId: true } for enabled interior items
  interiorTemplate: "Empty",
};

// Presets are per-system because roof types & spans differ between systems.
const PRESETS = {
  SKYLARK250: {
    "Micro cabin": { span: "XXS", modules: 5, wallHeight: "S", roof: "skillion10", storeys: 1, skylights: 0,
      roofing: "corrugated", cladding: "charred",
      openings: { front: { 1: "door", 3: "win1" }, back: {} } },
    "Garden studio": { span: "S", modules: 8, wallHeight: "M", roof: "gable42", storeys: 1, skylights: 1,
      roofing: "standingseam", cladding: "larch",
      openings: { front: { 1: "win2", 4: "door", 6: "win1" }, back: { 2: "win2" } } },
    "Big cabin": { span: "L", modules: 12, wallHeight: "L", roof: "gable42", storeys: 1, skylights: 2,
      roofing: "cedar", cladding: "cedar",
      openings: { front: { 1: "win2", 5: "door", 8: "win2", 10: "win1" }, back: { 2: "win2", 7: "win2" } } },
    "Two-storey house": { span: "M", modules: 8, wallHeight: "L", roof: "gable42", storeys: 2, skylights: 1,
      roofing: "asphalt", cladding: "painted",
      openings: { front: { 1: "win2", 4: "door", 6: "win2" }, back: { 2: "win2", 6: "win2" } } },
    "Tall gable barn": { span: "L", modules: 10, wallHeight: "XL", roof: "gable42", storeys: 1, skylights: 0,
      roofing: "standingseam", cladding: "corten",
      openings: { front: { 0: "win2", 4: "door", 8: "win2" }, back: {} } },
    "Green-roof mono": { span: "M", modules: 7, wallHeight: "M", roof: "skillion10", storeys: 1, skylights: 2,
      roofing: "greenroof", cladding: "render",
      openings: { front: { 1: "win2", 3: "door", 5: "win2" }, back: { 2: "win2" } } },
  },
  SKYLARK200: {
    "Micro flat": { span: "XXXS", modules: 5, wallHeight: "S", roof: "flat", storeys: 1, skylights: 0,
      roofing: "epdm", cladding: "charred",
      openings: { front: { 1: "door", 3: "win1" }, back: {} } },
    "Garden studio": { span: "XS", modules: 8, wallHeight: "M", roof: "gable42", storeys: 1, skylights: 1,
      roofing: "standingseam", cladding: "larch",
      openings: { front: { 1: "win2", 4: "door", 6: "win1" }, back: { 2: "win2" } } },
    "Flat-roof cabin": { span: "S", modules: 10, wallHeight: "L", roof: "flat", storeys: 1, skylights: 2,
      roofing: "greenroof", cladding: "cedar",
      openings: { front: { 1: "win2", 5: "door", 8: "win2" }, back: { 2: "win2", 6: "win2" } } },
    "Two-storey": { span: "S", modules: 8, wallHeight: "L", roof: "gable42", storeys: 2, skylights: 1,
      roofing: "asphalt", cladding: "painted",
      openings: { front: { 1: "win2", 4: "door", 6: "win2" }, back: { 2: "win2", 6: "win2" } } },
  },
};

let changeCb = null;
export function onConfigChange(cb) { changeCb = cb; }

let lastResult = null, lastCosts = null;

export function refresh() {
  lastResult = assemble(config);
  lastCosts = computeCosts(lastResult, config);
  renderCostPanel(lastCosts);
  renderBom(lastCosts);
  if (changeCb) changeCb(config, lastResult);
}

function firstAvailable(obj, preferred) {
  return preferred in obj ? preferred : Object.keys(obj)[0];
}

// Populate span + roof dropdowns from the active system, clamping config to what exists.
function populateSystemOptions() {
  const spanSel = document.getElementById("span");
  spanSel.innerHTML = "";
  const spans = Object.entries(SPEC.spans).sort((a, b) => a[1] - b[1]);
  for (const [code, m] of spans) {
    const o = document.createElement("option");
    o.value = code;
    o.textContent = `${code} — ${m.toFixed(1)} m`;
    spanSel.appendChild(o);
  }
  if (!(config.span in SPEC.spans)) {
    config.span = spans[spans.length - 1][0]; // largest available
  }
  spanSel.value = config.span;

  const roofSel = document.getElementById("roof");
  roofSel.innerHTML = "";
  const roofIds = SYSTEM.roofTypes.map((r) => r.id);
  for (const rt of SYSTEM.roofTypes) {
    const o = document.createElement("option");
    o.value = rt.id;
    o.textContent = rt.label;
    roofSel.appendChild(o);
  }
  if (!roofIds.includes(config.roof)) config.roof = roofIds[0];
  roofSel.value = config.roof;

  document.getElementById("sysBlurb").textContent = SYSTEM.blurb;
  buildPresetButtons();
  updateStoreyHint();
}

function buildPresetButtons() {
  const wrap = document.getElementById("presets");
  wrap.innerHTML = "";
  for (const name of Object.keys(PRESETS[config.system] || {})) {
    const b = document.createElement("button");
    b.textContent = name;
    b.addEventListener("click", () => applyPreset(name));
    wrap.appendChild(b);
  }
}

function updateStoreyHint() {
  const el = document.getElementById("storeyHint");
  if (config.storeys > 1 && !SYSTEM.skillionToppers && config.system === "SKYLARK200") {
    el.textContent = "Note: Skylark 200 has no stair blocks — stairs shown as a placeholder.";
  } else if (config.storeys > 1) {
    el.textContent = `${config.storeys} storeys · upper floors use FLOOR-${config.span}-1 blocks + stairs.`;
  } else {
    el.textContent = "WikiHouse Skylark supports 1–3 storeys.";
  }
}

function buildInteriorPanel() {
  const wrap = document.getElementById("interiorPanel");
  wrap.innerHTML = "";
  const cats = [
    ["Fixtures & appliances", FIXTURES],
    ["CNC furniture", FURNITURE],
    ["Decor & artwork", DECOR],
    ["Services (MEP)", SERVICES],
  ];
  for (const [title, items] of cats) {
    const cat = document.createElement("div");
    cat.className = "intCat";
    cat.innerHTML = `<div class="lbl">${title}</div>`;
    for (const it of items) {
      const row = document.createElement("label");
      row.className = "intItem";
      const priceTxt = it.unit ? `$${it.cad}/${it.unit}` : `$${it.cad}`;
      const link = it.src ? ` <a href="https://${it.src}" target="_blank">↗</a>` : "";
      row.innerHTML =
        `<input type="checkbox" data-int="${it.id}">` +
        `<span>${it.label}${link}</span><span class="price">${priceTxt}</span>`;
      const cb = row.querySelector("input");
      cb.checked = !!config.interior[it.id];
      cb.addEventListener("change", () => {
        if (cb.checked) config.interior[it.id] = true; else delete config.interior[it.id];
        refresh();
      });
      cat.appendChild(row);
    }
    wrap.appendChild(cat);
  }
}

async function switchSystem(systemId) {
  await loadSystem(systemId);
  config.system = systemId;
  // clamp modules within slider range; openings valid for any module count
  populateSystemOptions();
  clampOpenings();
  buildOpeningGrids();
  buildSkylightGrid();
  updateLenLabel();
  refresh();
}

export async function initUI() {
  const sysSel = document.getElementById("system");
  for (const s of Object.values(SYSTEMS)) {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.label;
    sysSel.appendChild(o);
  }
  sysSel.value = config.system;
  sysSel.addEventListener("change", () => switchSystem(sysSel.value));

  const spanSel = document.getElementById("span");
  spanSel.addEventListener("change", () => { config.span = spanSel.value; refresh(); });

  const mods = document.getElementById("modules");
  mods.value = config.modules;
  mods.addEventListener("input", () => {
    config.modules = +mods.value;
    clampOpenings();
    config.skylightMods = config.skylightMods.filter((i) => i < config.modules);
    buildOpeningGrids();
    buildSkylightGrid();
    updateLenLabel();
    refresh();
  });
  updateLenLabel();

  const wh = document.getElementById("wallHeight");
  wh.value = config.wallHeight;
  wh.addEventListener("change", () => { config.wallHeight = wh.value; refresh(); });

  const roof = document.getElementById("roof");
  roof.addEventListener("change", () => { config.roof = roof.value; refresh(); });

  const storeys = document.getElementById("storeys");
  storeys.value = config.storeys;
  storeys.addEventListener("change", () => { config.storeys = +storeys.value; updateStoreyHint(); refresh(); });

  const roofing = document.getElementById("roofing");
  for (const r of ROOFING) roofing.add(new Option(`${r.label} — $${r.cad}/m²`, r.id));
  roofing.value = config.roofing;
  roofing.addEventListener("change", () => { config.roofing = roofing.value; refresh(); });

  const cladding = document.getElementById("cladding");
  for (const c of CLADDING) cladding.add(new Option(`${c.label} — $${c.cad}/m²`, c.id));
  cladding.value = config.cladding;
  cladding.addEventListener("change", () => { config.cladding = cladding.value; refresh(); });

  const showInt = document.getElementById("showInterior");
  showInt.checked = config.showInterior;
  showInt.addEventListener("change", () => { config.showInterior = showInt.checked; refresh(); });

  const tmpl = document.getElementById("interiorTemplate");
  for (const name of Object.keys(INTERIOR_TEMPLATES)) tmpl.add(new Option(name, name));
  tmpl.value = config.interiorTemplate;
  tmpl.addEventListener("change", () => applyInteriorTemplate(tmpl.value));

  document.getElementById("csvBtn").addEventListener("click", downloadCSV);
  document.getElementById("saveBtn").addEventListener("click", saveDesign);
  document.getElementById("loadBtn").addEventListener("click", loadDesign);

  populateSystemOptions(); // fills span + roof selects + preset buttons for the active system
  buildInteriorPanel();
  buildOpeningGrids();
  buildSkylightGrid();
}

// ---------- skylight grid (single roof row, toggle per bay) ----------
function buildSkylightGrid() {
  const el = document.getElementById("gridSkylight");
  if (!el) return;
  el.innerHTML = "";
  el.style.gridTemplateColumns = `repeat(${config.modules}, 1fr)`;
  const set = new Set(config.skylightMods);
  for (let i = 0; i < config.modules; i++) {
    const cell = document.createElement("div");
    cell.className = "cell" + (set.has(i) ? " sky" : "");
    cell.textContent = set.has(i) ? "☀" : i + 1;
    cell.addEventListener("click", () => {
      const s = new Set(config.skylightMods);
      if (s.has(i)) s.delete(i); else s.add(i);
      config.skylightMods = [...s].sort((a, b) => a - b);
      buildSkylightGrid();
      refresh();
    });
    el.appendChild(cell);
  }
}

// ---------- interior template switcher ----------
function applyInteriorTemplate(name) {
  const ids = INTERIOR_TEMPLATES[name] || [];
  config.interiorTemplate = name;
  config.interior = {};
  for (const id of ids) config.interior[id] = true;
  config.showInterior = ids.length > 0;
  document.getElementById("showInterior").checked = config.showInterior;
  buildInteriorPanel();
  refresh();
}

function updateLenLabel() {
  document.getElementById("lenLabel").textContent =
    `${config.modules} modules · ${(config.modules * SPEC.module).toFixed(1)} m`;
}

function applyPreset(name) {
  const p = (PRESETS[config.system] || {})[name];
  if (!p) return;
  const sys = config.system, interior = config.interior, showInterior = config.showInterior,
    interiorTemplate = config.interiorTemplate;
  Object.assign(config, JSON.parse(JSON.stringify(p)), { system: sys, interior, showInterior, interiorTemplate });
  // presets carry a numeric `skylights`; convert to explicit module list
  config.skylightMods = autoSkylightMods(p.skylights || 0, config.modules);
  delete config.skylights;
  syncControls();
  updateLenLabel();
  updateStoreyHint();
  buildOpeningGrids();
  refresh();
}

// push config values into the DOM controls
function syncControls() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set("span", config.span);
  set("modules", config.modules);
  set("wallHeight", config.wallHeight);
  set("roof", config.roof);
  set("storeys", config.storeys);
  set("roofing", config.roofing);
  set("cladding", config.cladding);
  buildSkylightGrid();
}

// ---------- openings grid ----------
const CELL_LABEL = { win1: "▢ win", win2: "▢▢ win", door: "▮ door" };
const CELL_CLASS = { win1: "win", win2: "winL", door: "door" };

// states available for a bay, in click-cycle order. Wide options (2-bay window
// and door) are only offered when the next bay is free, so cycling never silently
// drops the opening — it always advances predictably.
function availStates(side, i) {
  const states = [null, "win1"];
  // bay i+1 must be free — but "occupied by this same bay's current wide opening"
  // counts as free, so cycling win2 -> door -> empty keeps working.
  const occ = occupiedBy(side, i + 1);
  const fits2 = i + 2 <= config.modules && !config.openings[side][i + 1] && (occ === null || occ === i);
  if (fits2) states.push("win2", "door");
  return states;
}

function clampOpenings() {
  for (const side of ["front", "back"]) {
    for (const k of Object.keys(config.openings[side])) {
      if (+k >= config.modules) delete config.openings[side][k];
    }
  }
}

function occupiedBy(side, i) {
  // returns the anchor index if module i is covered by an opening starting earlier
  const opens = config.openings[side];
  for (const [k, kind] of Object.entries(opens)) {
    const start = +k;
    const w = kind === "win1" ? 1 : 2;
    if (i > start && i < start + w) return start;
  }
  return null;
}

function buildOpeningGrids() {
  for (const side of ["front", "back"]) {
    const el = document.getElementById(side === "front" ? "gridFront" : "gridBack");
    el.innerHTML = "";
    el.style.gridTemplateColumns = `repeat(${config.modules}, 1fr)`;
    for (let i = 0; i < config.modules; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const anchor = occupiedBy(side, i);
      const kind = config.openings[side][i];
      if (kind) {
        cell.classList.add(CELL_CLASS[kind]);
        cell.textContent = CELL_LABEL[kind];
      } else if (anchor !== null) {
        cell.classList.add(CELL_CLASS[config.openings[side][anchor]], "blocked");
        cell.textContent = "·";
      } else {
        cell.textContent = i + 1;
      }
      cell.addEventListener("click", () => cycleCell(side, i));
      el.appendChild(cell);
    }
  }
}

function cycleCell(side, i) {
  if (occupiedBy(side, i) !== null) return; // covered by a wide opening to the left
  const states = availStates(side, i);
  const cur = config.openings[side][i] || null;
  let idx = states.indexOf(cur);
  if (idx === -1) idx = 0;
  const next = states[(idx + 1) % states.length];
  if (next) config.openings[side][i] = next;
  else delete config.openings[side][i];
  buildOpeningGrids();
  refresh();
}

// ---------- cost panel ----------
function money(v) {
  return v.toLocaleString("en-CA", { maximumFractionDigits: 0 });
}

function renderCostPanel(costs) {
  const el = document.getElementById("costTables");
  document.getElementById("currBadge").textContent = RATES.currency;
  let html = "<table>";
  html += "<tr><th>Item</th><th>Qty</th><th>Rate</th><th>Cost</th></tr>";
  for (const g of costs.groups) {
    // materials subtotal divider before the (non-materials) labour group
    if (g.materials === false) {
      html += `<tr class="subtotalRow"><td>Materials subtotal</td>` +
        `<td colspan="2" class="muted" style="font-size:12px">${money(costs.materialsPerM2)}/m²</td>` +
        `<td>${money(costs.materialsSubtotal)}</td></tr>`;
    }
    html += `<tr class="group"><td colspan="3">${g.name}</td><td>${money(g.total)}</td></tr>`;
    for (const l of g.lines) {
      const rateCell = l.key
        ? `<input class="rate" type="number" data-key="${l.key}" value="${l.value}" step="1">`
        : `<span class="muted">${money(l.value)}</span>`;
      html += `<tr><td>${l.label}<br><span class="muted">${l.qty} × ${l.unit}</span></td>` +
        `<td>${l.qty}</td><td>${rateCell}</td><td>${money(l.cost)}</td></tr>`;
    }
  }
  html += `<tr><td>Contingency</td><td></td>` +
    `<td><input class="rate" type="number" data-key="contingency" value="${RATES.contingency.value}" step="1"> %</td>` +
    `<td>${money(costs.contingency)}</td></tr>`;
  html += `<tr class="totalRow"><td>Total</td><td colspan="2" class="muted" style="font-size:12px">` +
    `${money(costs.perM2)}/m²</td><td>${money(costs.total)}</td></tr>`;
  html += `<tr><td colspan="4" class="muted" style="text-align:left">Structural timber ≈ ` +
    `${(costs.timberMassKg / 1000).toFixed(1)} t (${costs.quantities.sheets} sheets)</td></tr>`;
  html += "</table>";
  el.innerHTML = html;
  el.querySelectorAll("input.rate").forEach((inp) =>
    inp.addEventListener("change", () => {
      RATES[inp.dataset.key].value = +inp.value || 0;
      refresh();
    }));
}

function renderBom(costs) {
  const el = document.getElementById("bomTable");
  let html = "<tr><th>Block</th><th>Qty</th><th>Sheets</th></tr>";
  for (const r of costs.bomRows) {
    html += `<tr><td>${r.id}${r.est ? ' <span class="badge">est.</span>' : ""}</td>` +
      `<td>${r.qty}</td><td>${r.sheets.toFixed(1)}</td></tr>`;
  }
  el.innerHTML = html;
}

function downloadCSV() {
  const csv = bomCSV(lastResult, lastCosts, config);
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "wikihouse-cabin-bom.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------- save / load ----------
function saveDesign() {
  localStorage.setItem("wikihouse-config", JSON.stringify(config));
  const btn = document.getElementById("saveBtn");
  btn.textContent = "Saved ✓";
  setTimeout(() => (btn.textContent = "Save design"), 1200);
}

async function loadDesign() {
  const raw = localStorage.getItem("wikihouse-config");
  if (!raw) return;
  const saved = JSON.parse(raw);
  const targetSystem = SYSTEMS[saved.system] ? saved.system : DEFAULT_SYSTEM;
  if (targetSystem !== config.system) {
    await loadSystem(targetSystem);
  }
  Object.assign(config, saved, { system: targetSystem });
  config.interior = config.interior || {};
  if (!Array.isArray(config.skylightMods)) config.skylightMods = autoSkylightMods(saved.skylights || 0, config.modules);
  document.getElementById("system").value = config.system;
  populateSystemOptions();
  syncControls();
  const tsel = document.getElementById("interiorTemplate");
  if (tsel && config.interiorTemplate) tsel.value = config.interiorTemplate;
  document.getElementById("showInterior").checked = !!config.showInterior;
  buildInteriorPanel();
  updateLenLabel();
  updateStoreyHint();
  buildOpeningGrids();
  refresh();
}

// Trillium Plans Studio — app shell, routing and pane rendering.

import { build } from "./geometry.js";
import { Viewer, GROUP_COLORS } from "./viewer.js";
import { units, fmtLen, fmtArea, fmtBig, fmtDeg, prettyImperial } from "./units.js";
import { normalizePlan, expandEdges, parseImperial } from "./plan.js";

const PASSPHRASE = "trillium";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const app = {
  registry: null,
  methods: {},
  model: null,      // registry entry
  plan: null,       // data/models/<key>.json, or null
  result: null,     // geometry engine output
  tab: "overview",
  viewer: null,
  stock: 12,
};

// ---------------------------------------------------------------- gate

function initGate() {
  const gate = $("#gate");
  if (sessionStorage.getItem("tps-open") === "1") return openApp();
  $("#gateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#gatePass").value.trim().toLowerCase() === PASSPHRASE) {
      sessionStorage.setItem("tps-open", "1");
      openApp();
    } else {
      $("#gateErr").hidden = false;
      $("#gatePass").value = "";
    }
  });
  gate.hidden = false;
  setTimeout(() => $("#gatePass").focus(), 60);
}

function openApp() {
  $("#gate").style.display = "none";
  $("#app").hidden = false;
  start();
}

// ---------------------------------------------------------------- boot

async function start() {
  app.registry = await fetch("data/registry.json").then((r) => r.json());
  buildSidebar();
  wireChrome();
  app.viewer = new Viewer($("#stageCanvas"));
  app.viewer.onSelect = (group) => {
    if (app.tab === "panels") renderPanels();
  };
  const wanted = new URLSearchParams(location.search).get("m");
  const known = (k) => allModels().some((m) => m.key === k);
  await selectModel(
    (wanted && known(wanted) && wanted) ||
    (known("t-3v20") && "t-3v20") ||
    app.registry.groups[0].models[0].key
  );
}

function allModels() {
  return app.registry.groups.flatMap((g) => g.models);
}

function buildSidebar() {
  $("#modelList").innerHTML = app.registry.groups.map((g) => `
    <div class="side-group">
      <div class="side-group-name">${esc(g.name)}</div>
      ${g.models.map((m) => `
        <button class="model-btn" data-key="${esc(m.key)}">
          ${esc(m.label)}<span class="m-size">${esc(m.size)}</span>
        </button>`).join("")}
    </div>`).join("");
  $$("#modelList .model-btn").forEach((b) =>
    b.addEventListener("click", () => selectModel(b.dataset.key)));
}

function wireChrome() {
  $$("#tabs button").forEach((b) => b.addEventListener("click", () => {
    app.tab = b.dataset.tab;
    $$("#tabs button").forEach((x) => x.classList.toggle("on", x === b));
    $$(".pane").forEach((p) => p.classList.toggle("on", p.dataset.pane === app.tab));
    renderTab();
  }));
  $$(".seg button").forEach((b) => b.addEventListener("click", () => {
    units.current = b.dataset.unit;
    $$(".seg button").forEach((x) => x.classList.toggle("on", x === b));
    renderAll();
  }));
  $("#btnPrint").addEventListener("click", () => window.print());
  $("#btnCsv").addEventListener("click", exportCSV);
}

async function selectModel(key) {
  const m = allModels().find((x) => x.key === key);
  if (!m) return;
  app.model = m;
  $$("#modelList .model-btn").forEach((b) => b.classList.toggle("on", b.dataset.key === key));
  history.replaceState(null, "", `?m=${key}`);

  const raw = await fetch(`data/models/${key}.json`)
    .then((r) => (r.ok ? r.json() : null)).catch(() => null);
  app.plan = normalizePlan(raw, m.family);
  app.result = build(m.engine);
  app.viewer.setResult(app.result, { depthIn: m.depthIn || 1.5 });
  app.nameMap = mapGroupsToPlan();
  app.audit = (await loadAudit())?.models.find((x) => x.key === key) || null;

  $("#topModel").innerHTML =
    `<b>${esc(m.label)}</b> · ${esc(m.size)}` +
    (m.approx ? ` <span class="tag warn">4V dims approximate</span>` : "") +
    (app.plan ? "" : ` <span class="tag">plan data pending</span>`);
  updateCheckBadge();
  renderAll();
}

function renderAll() { renderTab(); }

function renderTab() {
  ({ overview: renderOverview, method: renderMethod, panels: renderPanels,
     cutsheets: renderCutSheets, materials: renderMaterials,
     check: renderCheck }[app.tab] || renderOverview)();
}

async function loadAudit() {
  if (app.auditReport !== undefined) return app.auditReport;
  app.auditReport = await fetch("data/audit.json")
    .then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return app.auditReport;
}

function updateCheckBadge() {
  const el = $("#checkBadge");
  const errs = app.audit?.findings?.filter((f) => f.severity === "error").length || 0;
  const issues = app.plan?.pdfIssues?.length || 0;
  const total = errs + issues;
  el.hidden = !app.plan;
  el.textContent = errs ? errs : total ? total : "✓";
  el.classList.toggle("clean", !errs);
}

/**
 * Match each generated panel group to the plan's own panel name by comparing
 * edge-length multisets, so the UI can say "P1 · Hex panel" instead of "P1".
 */
function mapGroupsToPlan() {
  const map = {};
  if (!app.plan?.panels?.length || !app.result) return map;
  const sorted = (lens) => [...lens].sort((a, b) => a - b);
  const near = (a, b) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) <= 0.125);
  const planSigs = app.plan.panels
    .filter((p) => !p.partial)
    .map((p) => ({ name: p.name, sig: sorted(expandEdges(p).map((e) => e.inches).filter((x) => x != null)) }))
    .filter((p) => p.sig.length);
  for (const g of app.result.panelGroups) {
    const s = sorted(g.edges.map((e) => e.length * 12));
    const hit = planSigs.find((p) => near(p.sig, s));
    if (hit) map[g.label] = hit.name;
  }
  return map;
}

const groupName = (label) => app.nameMap?.[label] ? `${label} · ${app.nameMap[label]}` : label;

/** Move the single WebGL canvas into the active pane. */
function mountStage(slot) {
  const stage = $("#stageCanvas");
  if (stage.parentElement !== slot) slot.appendChild(stage);
  requestAnimationFrame(() => app.viewer.frame());
}

// ---------------------------------------------------------------- computed helpers

function ripBevelFor(length) {
  const { strutGroups, dihedrals } = app.result;
  const g = strutGroups.find((G) => Math.abs(G.length - length) < 0.01);
  if (!g) return null;
  const d = dihedrals[g.label];
  return d == null ? 0 : (180 - d) / 2;
}

/**
 * The rip bevel you actually set the saw to. The plan's printed value wins when
 * we have it — it is what the builder cuts; the generated one is a cross-check.
 */
function planBevel() {
  const cs = app.plan?.crossSections || [];
  const strut = cs.find((c) => /panel strut/i.test(c.member || "")) ||
    cs.find((c) => typeof c.bevelDeg === "number");
  return typeof strut?.bevelDeg === "number"
    ? { deg: strut.bevelDeg, source: "plan" }
    : (primaryBevel() != null ? { deg: primaryBevel(), source: "generated" } : null);
}

/** The dominant rip bevel in the generated geometry. */
function primaryBevel() {
  const counts = new Map();
  for (const g of app.result.panelGroups)
    for (const e of g.edges) {
      const b = ripBevelFor(e.length);
      if (b == null || b < 0.05) continue;
      const k = b.toFixed(1);
      counts.set(k, (counts.get(k) || 0) + g.count);
    }
  let best = null, n = -1;
  for (const [k, c] of counts) if (c > n) { n = c; best = k; }
  return best == null ? null : parseFloat(best);
}

/** Unique edges of a panel group, deduped by length. */
function groupEdges(g) {
  const out = [];
  for (const e of g.edges) {
    let hit = out.find((o) => Math.abs(o.length - e.length) < 0.005);
    if (!hit) {
      hit = { length: e.length, pieces: 0, m1: e.m1, m2: e.m2, bevel: ripBevelFor(e.length) };
      out.push(hit);
    }
    hit.pieces++;
  }
  return out.sort((a, b) => b.length - a.length);
}

function allBoardLengths() {
  const { verts, panels, wall } = app.result;
  const L = [];
  for (const p of panels) {
    const f = p.verts;
    for (let i = 0; i < f.length; i++) {
      const a = verts[f[i]], b = verts[f[(i + 1) % f.length]];
      L.push(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
    }
  }
  if (wall) { for (const h of wall.studHeights) L.push(h); for (const s of wall.segs) L.push(s); }
  return L;
}

function computeBOM() {
  const { wall, stats } = app.result;
  const stockFt = app.stock, kerf = 1 / 12;
  const pieces = allBoardLengths().map((l) => l + kerf).sort((a, b) => b - a);
  const strips = [];
  for (const p of pieces) {
    let placed = false;
    for (let i = 0; i < strips.length; i++)
      if (strips[i] + p <= stockFt) { strips[i] += p; placed = true; break; }
    if (!placed) strips.push(Math.min(p, stockFt));
  }
  const wallArea = wall
    ? wall.segs.reduce((s, x, i) => s + x * wall.studHeights[i % wall.studHeights.length], 0) : 0;
  const area = stats.surfaceArea + wallArea;
  return {
    boardCount: pieces.length,
    rippedStock: Math.ceil(strips.length / 2),
    tooLong: pieces.filter((p) => p > stockFt).length,
    area,
    sheets: Math.ceil((area * 1.15) / 32),
    screws: Math.ceil((pieces.length * 5) / 50) * 50,
  };
}

function swatch(label) {
  const i = app.result.panelGroups.findIndex((g) => g.label === label);
  return `<span class="dot" style="background:${GROUP_COLORS[(i < 0 ? 0 : i) % GROUP_COLORS.length]}"></span>`;
}

// ---------------------------------------------------------------- panes

function renderOverview() {
  const pane = $('.pane[data-pane="overview"]');
  const { stats } = app.result;
  const m = app.model, plan = app.plan;
  const bevel = planBevel();

  pane.innerHTML = `
    <div class="page-head">
      <h2>${esc(m.label)} — ${esc(m.size)}</h2>
      <p>${esc(plan?.overview?.summary || m.blurb || "")}</p>
    </div>
    ${m.approx ? `<div class="notice"><b>Heads up —</b> the printed plan for this model uses Trillium's four-length 4V strut breakdown. The 3D model here is generated from a standard Class I 4V breakdown, so the shape is right but generated panel dimensions differ slightly from the printed schedule. <b>Build from the printed schedule</b> on the Cut Sheets tab.</div>` : ""}
    <div class="stat-row">
      <div class="stat"><div class="k">Width at base</div><div class="v">${plan?.overview?.widthAtBase ? prettyImperial(plan.overview.widthAtBase) : fmtBig(stats.baseDiameter)}</div></div>
      <div class="stat"><div class="k">Height</div><div class="v">${plan?.overview?.height ? prettyImperial(plan.overview.height) : fmtBig(stats.height)}</div></div>
      <div class="stat"><div class="k">Floor area</div><div class="v">${fmtArea(stats.floorArea)}</div></div>
      <div class="stat"><div class="k">Panels</div><div class="v">${stats.panelCount}<small> / ${app.result.panelGroups.length} shapes</small></div></div>
      <div class="stat"><div class="k">Rip bevel</div><div class="v">${bevel == null ? "—" : fmtDeg(bevel.deg)}<small> ${bevel.source === "plan" ? "per plan" : "computed"}</small></div></div>
    </div>
    <div class="grid-2 wide">
      <div>
        <div class="stage-slot tall" id="slotOverview">
          <div class="stage-hint">Drag to orbit · scroll to zoom · click a panel to isolate it</div>
        </div>
      </div>
      <div>
        ${plan?.components?.length ? `
          <div class="card">
            <h3>Component list</h3>
            <ul class="plain">
              ${plan.components.map((c) => `<li><span class="q">${esc(c.qty)}</span><span>${esc(c.item)}${c.note ? ` <span class="n">— ${esc(c.note)}</span>` : ""}</span></li>`).join("")}
            </ul>
          </div>` : ""}
        <div class="card">
          <h3>Generated geometry</h3>
          <ul class="plain">
            <li><span class="q">${stats.panelCount}</span><span>panels in ${app.result.panelGroups.length} shapes</span></li>
            <li><span class="q">${stats.boardCount}</span><span>frame boards (shared edges carry two)</span></li>
            <li><span class="q">${fmtArea(stats.surfaceArea)}</span><span>shell surface</span></li>
            <li><span class="q">${fmtBig(stats.sphereDiameter)}</span><span>parent sphere · ${esc(stats.detail || "")}</span></li>
          </ul>
        </div>
        ${plan?.notes?.length ? `
          <div class="card">
            <h3>Model notes</h3>
            ${plan.notes.map((n) => `<p style="margin:0 0 10px;color:var(--ink-2);font-size:13.5px">${esc(n)}</p>`).join("")}
          </div>` : ""}
      </div>
    </div>`;
  mountStage($("#slotOverview"));
  app.viewer.select(null);
}

async function loadMethod(family) {
  const name = family === "zome" ? "method-zome" : "method-dome";
  if (app.methods[name] !== undefined) return app.methods[name];
  app.methods[name] = await fetch(`data/${name}.json`)
    .then((r) => (r.ok ? r.json() : null)).catch(() => null);
  if (!app.methods[name] && name !== "method-dome") return loadMethod("dome");
  return app.methods[name];
}

async function renderMethod() {
  const pane = $('.pane[data-pane="method"]');
  pane.innerHTML = `<div class="empty">Loading…</div>`;
  const md = await loadMethod(app.model.family);
  if (!md) { pane.innerHTML = `<div class="empty">Build method content not available.</div>`; return; }

  const bevel = planBevel();
  // Prefer the plan's own printed miters; fall back to the generated geometry.
  const planMiters = (app.plan?.panels || [])
    .filter((p) => !p.partial)
    .map((p) => ({ name: p.name, degs: [...new Set(p.corners.map((c) => c.deg))] }))
    .filter((p) => p.degs.length);
  const genMiters = [...new Set(app.result.panelGroups.flatMap((g) =>
    g.corners.map((c) => +(90 - c).toFixed(1))))].sort((a, b) => a - b);
  const chipsFor = (step) => {
    if (step.usesValue === "ripBevel") {
      // Zomes publish a bevel pair per band; domes publish one figure for the
      // whole shell. Show whichever the plan actually gives.
      const perPanel = (app.plan?.panels || []).flatMap((p) =>
        p.bevels.map((b) => ({ label: `${p.name} — ${b.label}`, deg: b.deg })));
      const chips = perPanel.length
        ? perPanel.map((b) => `<div class="chip"><span class="ck">${esc(b.label)}</span>
            <span class="cv">${fmtDeg(b.deg)}</span></div>`)
        : bevel == null ? []
        : [`<div class="chip"><span class="ck">Rip bevel${bevel.source === "plan" ? "" : " (computed)"}</span>
             <span class="cv">${fmtDeg(bevel.deg)}</span></div>`,
           ...(app.plan?.crossSections || [])
             .filter((c) => typeof c.bevelDeg === "number" && !/panel strut/i.test(c.member || ""))
             .map((c) => `<div class="chip"><span class="ck">${esc(c.member)}</span>
                <span class="cv">${fmtDeg(c.bevelDeg)}</span></div>`)];
      return chips.length ? `<div class="value-chips">${chips.join("")}</div>` : "";
    }
    if (step.usesValue === "miters") {
      const chips = planMiters.length
        ? planMiters.flatMap((p) => p.degs.map((d) =>
            `<div class="chip"><span class="ck">${esc(p.name)}</span><span class="cv">${fmtDeg(d)}</span></div>`))
        : genMiters.slice(0, 6).map((d) =>
            `<div class="chip"><span class="ck">miter off 90° (computed)</span><span class="cv">${fmtDeg(d)}</span></div>`);
      return chips.length ? `<div class="value-chips">${chips.join("")}</div>` : "";
    }
    return "";
  };

  pane.innerHTML = `
    <div class="page-head">
      <h2>${esc(md.title)}</h2>
      <p>${esc(md.subtitle)}</p>
    </div>
    <div class="card method-intro">
      <h3>The big idea</h3>
      ${md.bigIdea.map((p) => `<p>${p}</p>`).join("")}
      ${md.video ? `<p style="margin-bottom:0"><a href="${esc(md.video)}" target="_blank" rel="noopener">Watch Johnny's step-by-step video →</a></p>` : ""}
    </div>
    ${md.phases.map((ph) => `
      <div class="phase-name">${esc(ph.name)}</div>
      ${ph.steps.map((s) => `
        <div class="step">
          <div><div class="step-n">${s.n}</div></div>
          <div>
            <h4>${esc(s.title)}</h4>
            <p class="goal">${esc(s.goal || "")}</p>
            ${chipsFor(s)}
            <div class="step-body">
              ${(s.body || []).map((p) => `<p>${p}</p>`).join("")}
              ${(s.callouts || []).map((c) => `
                <div class="callout ${esc(c.type)}">
                  <span class="cl-k">${c.type === "warn" ? "Watch out" : c.type === "check" ? "Check" : "Tip"}</span>
                  ${c.text}
                </div>`).join("")}
            </div>
          </div>
        </div>`).join("")}
    `).join("")}
    <div class="card" style="margin-top:26px">
      <h3>Source</h3>
      <p style="color:var(--ink-2);font-size:13.5px;margin:0 0 8px">${esc(md.source)}</p>
      <p style="color:var(--ink-3);font-size:12.5px;margin:0">
        ${esc(md.credits.author)} · <a href="${esc(md.credits.site)}" target="_blank" rel="noopener">${esc(md.credits.site.replace(/^https?:\/\//, ""))}</a>
      </p>
    </div>`;
}

function renderPanels() {
  const pane = $('.pane[data-pane="panels"]');
  const groups = app.result.panelGroups;
  const sel = app.viewer.selected;
  const g = groups.find((x) => x.label === sel);

  pane.innerHTML = `
    <div class="page-head">
      <h2>Panels</h2>
      <p>Each face is a framed panel. Click a panel in the model — or a row below — to isolate that shape and read its dimensions. Miters are given <b>off 90°</b>: that is the number you set the saw to.</p>
    </div>
    <div class="legend" id="legend">
      ${groups.map((x) => `<button data-g="${esc(x.label)}" class="${x.label === sel ? "on" : ""}">
        <span class="dot" style="background:${GROUP_COLORS[groups.indexOf(x) % GROUP_COLORS.length]}"></span>
        ${esc(groupName(x.label))} · ${x.count}× ${esc(x.shape)}</button>`).join("")}
    </div>
    <div class="grid-2 wide">
      <div>
        <div class="stage-slot tall" id="slotPanels">
          <div class="stage-hint">${sel ? `Isolated: ${esc(sel)} — click again to clear` : "Click any panel to isolate its shape"}</div>
          <div class="stage-ctl">
            <label>Explode <input type="range" id="explode" min="0" max="100" value="${Math.round(app.viewer.explode * 100)}"></label>
            <label><input type="checkbox" id="skin" ${app.viewer.showSkin ? "checked" : ""}> Skin</label>
            <label><input type="checkbox" id="spin" ${app.viewer.spin ? "checked" : ""}> Rotate</label>
          </div>
        </div>
      </div>
      <div>
        ${g ? panelDetailCard(g) : `<div class="card"><h3>Panel detail</h3><div class="empty" style="padding:8px 0">Select a panel to see its edge lengths, corner miters and rip bevel.</div></div>`}
        <div class="card">
          <h3>All panel shapes</h3>
          <div class="table-wrap"><table>
            <thead><tr><th>Panel</th><th class="num">Qty</th><th>Shape</th><th class="num">Area</th></tr></thead>
            <tbody>
              ${groups.map((x) => `<tr class="clickable ${x.label === sel ? "on" : ""}" data-g="${esc(x.label)}">
                <td>${swatch(x.label)}${esc(groupName(x.label))}</td>
                <td class="num">${x.count}</td>
                <td>${esc(x.shape)}</td>
                <td class="num">${fmtArea(x.area)}</td></tr>`).join("")}
            </tbody>
          </table></div>
        </div>
      </div>
    </div>`;

  mountStage($("#slotPanels"));
  const pick = (label) => { app.viewer.select(label); renderPanels(); };
  $$("#legend button").forEach((b) => b.addEventListener("click", () => pick(b.dataset.g)));
  $$('.pane[data-pane="panels"] tbody tr[data-g]').forEach((r) =>
    r.addEventListener("click", () => pick(r.dataset.g)));
  $("#explode").addEventListener("input", (e) => app.viewer.setExplode(+e.target.value / 100));
  $("#skin").addEventListener("change", (e) => { app.viewer.setSkin(e.target.checked); renderPanels(); });
  $("#spin").addEventListener("change", (e) => app.viewer.setSpin(e.target.checked));
}

function panelDetailCard(g) {
  const edges = groupEdges(g);
  return `
    <div class="card panel-detail">
      <h3>Panel detail</h3>
      <p class="pd-shape">${swatch(g.label)}${esc(groupName(g.label))} — ${esc(g.shape)}</p>
      <p class="pd-sub">${g.count} needed · ${fmtArea(g.area)} each · ${g.count * g.edges.length} frame boards</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Edge</th><th class="num">Pcs</th><th class="num">Length</th><th class="num">Miters off 90°</th><th class="num">Rip bevel</th></tr></thead>
        <tbody>
          ${edges.map((e, i) => `<tr>
            <td>${String.fromCharCode(65 + i)}</td>
            <td class="num">${e.pieces * g.count}</td>
            <td class="num">${fmtLen(e.length)}</td>
            <td class="num">${fmtDeg(e.m1)} / ${fmtDeg(e.m2)}</td>
            <td class="num">${e.bevel == null ? "—" : fmtDeg(e.bevel)}</td></tr>`).join("")}
        </tbody>
      </table></div>
      <p style="color:var(--ink-3);font-size:12px;margin:12px 0 0">
        Lengths are long-point to long-point on the panel's outer edge. Rip bevel is half the interior
        dihedral, taken off the outer face so mating panels sit flush.
      </p>
    </div>`;
}

function renderCutSheets() {
  const pane = $('.pane[data-pane="cutsheets"]');
  const groups = app.result.panelGroups;
  const bom = computeBOM();
  const plan = app.plan;
  const wall = app.result.wall;

  const planLen = (e) => (units.current === "m" && e.mm ? esc(e.mm) : prettyImperial(e.length));
  const printedTable = plan?.panels?.length ? `
    <div class="card">
      <h3>Printed panel schedule <span class="tag good">from the plan</span></h3>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Panel</th><th class="num">Qty</th><th>Member</th>
          <th class="num">Pcs</th><th class="num">Length</th>
          <th class="num">Miter off 90°</th><th class="num">Rip bevel</th>
        </tr></thead>
        <tbody>
          ${plan.panels.map((p) => {
            const rows = Math.max(p.edges.length, p.corners.length, p.bevels.length,
                                  p.diagonal ? 1 : 0, 1);
            let html = "";
            for (let i = 0; i < rows; i++) {
              const e = p.edges[i], c = p.corners[i], b = p.bevels[i];
              html += `<tr>
                <td>${i === 0 ? esc(p.name) + (p.partial ? ` <span class="tag">partial</span>` : "") : ""}</td>
                <td class="num">${i === 0 ? p.qty ?? "" : ""}</td>
                <td>${e ? esc(e.label) : c ? `<span style="color:var(--ink-3)">${esc(c.label)}</span>` : ""}</td>
                <td class="num">${e && e.count > 1 ? "×" + e.count : e ? "1" : ""}</td>
                <td class="num">${e ? planLen(e) : ""}</td>
                <td class="num">${c ? fmtDeg(c.deg)
                    + (c.obtuse ? ` <span class="tag" title="This corner is obtuse: the real angle is 90° PLUS the saw setting, not minus.">obtuse</span>` : "")
                    + (c.altDeg != null && c.altDeg !== c.deg
                    ? ` <span class="tag warn" title="the metric edition prints a different value">${fmtDeg(c.altDeg)}</span>` : "") : ""}</td>
                <td class="num">${b ? fmtDeg(b.deg) : ""}</td></tr>`;
            }
            if (p.diagonal?.length) html += `<tr>
              <td></td><td></td><td><span style="color:var(--ink-3)">${esc(p.diagonal.label)}</span></td>
              <td class="num"></td><td class="num">${planLen(p.diagonal)}</td>
              <td class="num"></td><td class="num"></td></tr>`;
            return html;
          }).join("")}
        </tbody>
      </table></div>
      ${plan.panels.some((p) => p.corners.some((c) => c.altDeg != null && c.altDeg !== c.deg))
        ? `<p style="color:var(--warn);font-size:12.5px;margin:12px 0 0">
             Amber values are what the <b>metric</b> edition of the same plan prints for that corner.
             Where the two editions disagree, see the Plan Check tab for which one the geometry supports.</p>` : ""}
    </div>` : "";

  pane.innerHTML = `
    <div class="page-head">
      <h2>Cut sheets</h2>
      <p>Everything you take to the saw. ${plan ? "The printed schedule is the build authority; the generated schedule below is computed from the geometry and is useful for cross-checking and for variations." : "Generated from the geometry engine. Verify against the printed plan before cutting."}</p>
    </div>
    ${app.model.approx ? `<div class="notice"><b>4V model —</b> build from the printed schedule. Generated dimensions differ slightly (different strut breakdown).</div>` : ""}
    ${printedTable}
    <div class="card">
      <h3>Generated panel schedule</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Panel</th><th class="num">Qty</th><th>Shape</th><th>Edge</th><th class="num">Pieces</th><th class="num">Length</th><th class="num">Miters off 90°</th><th class="num">Rip bevel</th></tr></thead>
        <tbody>
          ${groups.flatMap((g) => groupEdges(g).map((e, i) => `<tr>
            <td>${i === 0 ? swatch(g.label) + esc(groupName(g.label)) : ""}</td>
            <td class="num">${i === 0 ? g.count : ""}</td>
            <td>${i === 0 ? esc(g.shape) : ""}</td>
            <td>${String.fromCharCode(65 + i)}</td>
            <td class="num">${e.pieces * g.count}</td>
            <td class="num">${fmtLen(e.length)}</td>
            <td class="num">${fmtDeg(e.m1)} / ${fmtDeg(e.m2)}</td>
            <td class="num">${e.bevel == null ? "—" : fmtDeg(e.bevel)}</td></tr>`)).join("")}
        </tbody>
      </table></div>
    </div>
    ${plan?.baseSections?.length ? `
      <div class="card">
        <h3>Base sections <span class="tag good">from the plan</span></h3>
        ${plan.baseSections.map((b) => `
          <p style="color:var(--ink-2);font-size:13.5px;margin:0 0 8px">${esc(b.desc || "")}</p>
          <ul class="plain">
            ${(b.lengths || []).map((L) => `<li><span class="q">${prettyImperial(L)}</span><span class="n">long point to long point</span></li>`).join("")}
            ${b.miterDeg != null ? `<li><span class="q">${fmtDeg(b.miterDeg)}</span><span class="n">miter</span></li>` : ""}
            ${b.taperHeight ? `<li><span class="q">${prettyImperial(b.taperHeight)}</span><span class="n">taper height</span></li>` : ""}
          </ul>`).join("")}
      </div>` : wall ? `
      <div class="card">
        <h3>Base sections / pony wall <span class="tag">generated</span></h3>
        <div class="table-wrap"><table>
          <thead><tr><th>Part</th><th class="num">Qty</th><th class="num">Length</th></tr></thead>
          <tbody>
            ${dedupeLengths(wall.studHeights).map((r) => `<tr><td>Stud</td><td class="num">${r.n}</td><td class="num">${fmtLen(r.v)}</td></tr>`).join("")}
            ${dedupeLengths(wall.segs).map((r) => `<tr><td>Plate</td><td class="num">${r.n}</td><td class="num">${fmtLen(r.v)}</td></tr>`).join("")}
          </tbody>
        </table></div>
      </div>` : ""}
    ${plan?.door?.cutList?.length ? `
      <div class="card">
        <h3>Door <span class="tag good">from the plan</span></h3>
        <p style="color:var(--ink-2);font-size:13.5px;margin:0 0 10px">
          ${plan.door.outerWidth ? `Finished ${prettyImperial(plan.door.outerWidth)} × ${prettyImperial(plan.door.outerHeight || "")}` : ""}
          ${plan.door.gap ? ` · built to leave a ${prettyImperial(plan.door.gap)} gap to the opening` : ""}
        </p>
        ${plan.door.cutList.map((s) => `
          <h3 style="margin-top:14px">${esc(s.stock)} material</h3>
          <ul class="plain">
            ${s.pieces.map((p) => `<li><span class="q">${p.qty}×</span><span>${prettyImperial(p.length)}${p.note ? ` <span class="n">— ${esc(p.note)}</span>` : ""}</span></li>`).join("")}
          </ul>`).join("")}
      </div>` : ""}
    <div class="card">
      <h3>Lumber estimate <span class="tag">geometric</span></h3>
      <div class="stat-row" style="margin:0">
        <div class="stat"><div class="k">Frame boards</div><div class="v">${bom.boardCount}</div></div>
        <div class="stat"><div class="k">Stock (${app.stock}′, ripped)</div><div class="v">${bom.rippedStock}</div></div>
        <div class="stat"><div class="k">Cover area</div><div class="v">${fmtArea(bom.area)}</div></div>
        <div class="stat"><div class="k">4×8 sheets</div><div class="v">${bom.sheets}</div></div>
        <div class="stat"><div class="k">Screws</div><div class="v">${bom.screws}</div></div>
      </div>
      <p style="color:var(--ink-3);font-size:12px;margin:12px 0 0">
        First-fit bin packing with 1″ per cut, assuming each 2× board rips into two struts.
        No door or window openings deducted. Verify before buying.
        ${bom.tooLong ? `<b style="color:var(--warn)"> ${bom.tooLong} board(s) exceed ${app.stock}′ stock.</b>` : ""}
      </p>
    </div>`;
}

function dedupeLengths(arr) {
  const out = [];
  for (const v of arr || []) {
    const hit = out.find((o) => Math.abs(o.v - v) < 0.01);
    if (hit) hit.n++; else out.push({ v, n: 1 });
  }
  return out.sort((a, b) => b.v - a.v);
}

function renderMaterials() {
  const pane = $('.pane[data-pane="materials"]');
  const plan = app.plan;
  const bom = computeBOM();
  pane.innerHTML = `
    <div class="page-head">
      <h2>Tools &amp; materials</h2>
      <p>${plan ? "The shopping list from the plan, plus the geometric estimate for cross-checking." : "No plan data extracted for this model yet — showing the geometric estimate only."}</p>
    </div>
    <div class="grid-2">
      <div>
        ${plan?.materials?.length ? `
          <div class="card">
            <h3>Materials <span class="tag good">from the plan</span></h3>
            <ul class="plain">
              ${plan.materials.map((x) => `<li><span class="q">${esc(x.qty || "")}</span><span>${esc(x.item)}${x.note ? ` <span class="n">— ${esc(x.note)}</span>` : ""}</span></li>`).join("")}
            </ul>
          </div>` : ""}
        <div class="card">
          <h3>Geometric estimate</h3>
          <ul class="plain">
            <li><span class="q">${bom.rippedStock}</span><span>2× boards at ${app.stock}′, each ripped into two struts</span></li>
            <li><span class="q">${bom.boardCount}</span><span>frame boards to cut</span></li>
            <li><span class="q">${bom.sheets}</span><span>4×8 sheets equivalent of cover material (${fmtArea(bom.area)} + 15%)</span></li>
            <li><span class="q">${bom.screws}</span><span>screws</span></li>
          </ul>
        </div>
      </div>
      <div>
        ${plan?.tools?.length ? `
          <div class="card">
            <h3>Tools</h3>
            <ul class="plain">${plan.tools.map((t) => `<li><span>${esc(t)}</span></li>`).join("")}</ul>
          </div>` : ""}
        ${plan?.crossSections?.length ? `
          <div class="card">
            <h3>Member cross-sections</h3>
            <div class="table-wrap"><table>
              <thead><tr><th>Member</th><th class="num">W</th><th class="num">H</th><th class="num">Bevel</th></tr></thead>
              <tbody>${plan.crossSections.map((c) => `<tr>
                <td>${esc(c.member)}</td>
                <td class="num">${prettyImperial(c.width)}</td>
                <td class="num">${prettyImperial(c.height)}</td>
                <td class="num">${c.bevelDeg == null ? "—" : fmtDeg(c.bevelDeg)}</td></tr>`).join("")}</tbody>
            </table></div>
          </div>` : ""}
        ${plan?.baseLayout ? `
          <div class="card">
            <h3>Base layout</h3>
            <ul class="plain">
              ${plan.baseLayout.inToIn ? `<li><span class="q">${prettyImperial(plan.baseLayout.inToIn)}</span><span class="n">inside to inside, across corners</span></li>` : ""}
              ${plan.baseLayout.acrossFlats ? `<li><span class="q">${prettyImperial(plan.baseLayout.acrossFlats)}</span><span class="n">across flats</span></li>` : ""}
              ${plan.baseLayout.sides ? `<li><span class="q">${plan.baseLayout.sides}</span><span class="n">sides</span></li>` : ""}
            </ul>
          </div>` : ""}
      </div>
    </div>
    ${plan?.pdfIssues?.length ? `
      <div class="card">
        <h3>Corrections applied to the original PDF</h3>
        <ul class="plain">${plan.pdfIssues.map((i) => `<li><span>${esc(i)}</span></li>`).join("")}</ul>
      </div>` : ""}`;
}

function renderCheck() {
  const pane = $('.pane[data-pane="check"]');
  const a = app.audit, plan = app.plan;
  if (!plan) {
    pane.innerHTML = `<div class="page-head"><h2>Plan check</h2>
      <p>No plan data has been transcribed for this model yet.</p></div>`;
    return;
  }
  const findings = a?.findings || [];
  const errs = findings.filter((f) => f.severity === "error");
  const rest = findings.filter((f) => f.severity !== "error");
  const sevWord = { error: "Error in the plan", warn: "Check", info: "Note" };

  pane.innerHTML = `
    <div class="page-head">
      <h2>Plan check</h2>
      <p>Every printed dimension is tested twice: against the plan's own internal geometry
      (a triangle's corner angles must total 180°; a rhombus's miter must follow from its side
      and mid-width), and against the model this app generates. Anything the plan contradicts
      about itself is listed here.</p>
    </div>

    ${a?.summary ? `
      <div class="stat-row">
        <div class="stat"><div class="k">Lengths cross-checked</div><div class="v">${a.summary.lengthsMatching}<small> / ${a.summary.lengthsChecked} match</small></div></div>
        <div class="stat"><div class="k">Geometry errors found</div><div class="v" style="color:${errs.length ? "var(--bad)" : "var(--good)"}">${errs.length}</div></div>
        <div class="stat"><div class="k">Transcription notes</div><div class="v">${plan.pdfIssues.length}</div></div>
        <div class="stat"><div class="k">Generated panels</div><div class="v">${a.stats?.generatedPanels ?? "—"}${a.stats?.planPanels ? `<small> / plan lists ${a.stats.planPanels}</small>` : ""}</div></div>
      </div>` : ""}

    ${errs.length ? `
      <h3 style="font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:var(--bad);margin:24px 0 12px">
        Contradictions in the printed plan — do not cut to these
      </h3>
      ${errs.map((f) => `
        <div class="finding error">
          <div class="f-head"><span class="f-sev">${sevWord[f.severity]}</span>
            <span class="f-where">${esc(f.panel || "")}</span></div>
          <p>${esc(f.message)}</p>
          ${f.correct != null ? `<div class="f-fix">Use ${fmtDeg(f.correct)} instead of the printed ${fmtDeg(f.printed)}</div>` : ""}
        </div>`).join("")}`
    : `<div class="check-ok">Every printed panel in this plan is self-consistent, and its dimensions
        agree with the generated geometry.${app.model.approx ? " (Length comparison is relaxed for 4V models — see the note on Cut Sheets.)" : ""}</div>`}

    ${rest.length ? `
      <h3 style="font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-3);margin:28px 0 12px">Other observations</h3>
      ${rest.map((f) => `
        <div class="finding ${esc(f.severity)}">
          <div class="f-head"><span class="f-sev">${sevWord[f.severity] || f.severity}</span>
            <span class="f-where">${esc(f.panel || "")}</span></div>
          <p>${esc(f.message)}</p>
        </div>`).join("")}` : ""}

    ${plan.pdfIssues.length ? `
      <h3 style="font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-3);margin:28px 0 12px">
        Typos, omissions and unclear drawings noted while transcribing
      </h3>
      <div class="card"><ul class="plain">
        ${plan.pdfIssues.map((i) => `<li><span>${esc(typeof i === "string" ? i : i.issue || JSON.stringify(i))}</span></li>`).join("")}
      </ul></div>` : ""}

    ${a?.lengths?.length ? `
      <div class="card">
        <h3>Printed vs generated lengths</h3>
        <div class="table-wrap"><table>
          <thead><tr><th>Panel</th><th>Member</th><th class="num">Plan</th><th class="num">Generated</th><th class="num">Δ</th></tr></thead>
          <tbody>${a.lengths.map((l) => `<tr>
            <td>${esc(l.panel)}</td><td>${esc(l.edge)}</td>
            <td class="num">${prettyImperial(l.printed)}</td>
            <td class="num">${prettyImperial(l.generated)}</td>
            <td class="num" style="color:${l.ok ? "var(--good)" : "var(--warn)"}">
              ${l.deviationIn === 0 ? "exact" : (l.deviationIn > 0 ? "+" : "") + l.deviationIn.toFixed(3) + "″"}</td></tr>`).join("")}
          </tbody>
        </table></div>
      </div>` : ""}`;
}

// ---------------------------------------------------------------- export

function csvEscape(s) {
  s = String(s ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportCSV() {
  const m = app.model, { stats } = app.result;
  const rows = [];
  const push = (...cells) => rows.push(cells.map(csvEscape).join(","));

  push(`Trillium Plans Studio — ${m.label} ${m.size}`);
  push("Base diameter", fmtBig(stats.baseDiameter), "Height", fmtBig(stats.height),
       "Panels", stats.panelCount, "Rip bevel", planBevel() == null ? "—" : fmtDeg(planBevel().deg));
  if (m.approx) push("NOTE", "4V model — printed plan uses a different strut breakdown; verify against the plan.");
  push("");
  push("GENERATED PANEL SCHEDULE");
  push("Panel", "Qty", "Shape", "Edge", "Pieces", "Length", "Length (mm)", "Miter1 off 90", "Miter2 off 90", "Rip bevel");
  for (const g of app.result.panelGroups)
    groupEdges(g).forEach((e, i) => push(
      g.label, g.count, g.shape, String.fromCharCode(65 + i), e.pieces * g.count,
      fmtLen(e.length, "ft"), (e.length * 304.8).toFixed(0),
      e.m1.toFixed(1), e.m2.toFixed(1), e.bevel == null ? "" : e.bevel.toFixed(1)));

  if (app.result.wall) {
    push("");
    push("BASE SECTIONS");
    push("Part", "Qty", "Length", "Length (mm)");
    for (const r of dedupeLengths(app.result.wall.studHeights))
      push("Stud", r.n, fmtLen(r.v, "ft"), (r.v * 304.8).toFixed(0));
    for (const r of dedupeLengths(app.result.wall.segs))
      push("Plate", r.n, fmtLen(r.v, "ft"), (r.v * 304.8).toFixed(0));
  }

  if (app.plan?.panels?.length) {
    push("");
    push("PRINTED PLAN SCHEDULE (build authority)");
    push("Panel", "Qty", "Edge", "Length", "mm");
    for (const p of app.plan.panels)
      for (const e of p.edges || [])
        push(p.name, p.qty ?? "", e.label, e.length, e.mm || "");
    push("Panel", "Corner", "Miter off 90");
    for (const p of app.plan.panels)
      for (const a of p.miterAngles || []) push(p.name, a.corner, a.deg);
  }

  const bom = computeBOM();
  push("");
  push("MATERIALS (geometric estimate)");
  push("Frame boards", bom.boardCount);
  push(`Stock boards (${app.stock}ft, ripped in half)`, bom.rippedStock);
  push("Cover area (sq ft)", Math.round(bom.area));
  push("4x8 sheets equivalent", bom.sheets);
  push("Screws", bom.screws);

  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${m.key}-cutlist.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

initGate();

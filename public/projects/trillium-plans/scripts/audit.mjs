// Plan audit — cross-checks every transcribed plan against geometry.
//
//   node scripts/audit.mjs            # human-readable report
//   node scripts/audit.mjs --write    # also writes data/audit.json for the app
//
// Three independent checks. The first two need no model of ours at all — they
// test the plan against itself, so a failure is an error in the plan:
//
//   1. ANGLE SUM     a triangle's printed corner angles must total 180°.
//   2. ANGLE vs EDGES the printed miters must match the angles implied by the
//                     plan's own printed edge lengths (for rhombi, by the side
//                     length and the printed mid-width diagonal).
//   3. GENERATED     printed edge lengths vs our geometry engine. 3V and zome
//                    models should agree closely; 4V plans use a different
//                    strut breakdown, so deviation there is expected, not a bug.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { build } from "../js/geometry.js";
import { normalizePlan, expandEdges, parseImperial, fmtInches, cornerAngle } from "../js/plan.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

const ANGLE_TOL = 0.35;    // printed to 0.1°, allow rounding of our derivation
const SUM_TOL = 0.6;
const LEN_TOL_IN = 0.0625; // 1/16"
const NEAR_IN = 3;         // a "generated match" further than this is no match

const DEG = 180 / Math.PI;
const clamp = (x) => Math.max(-1, Math.min(1, x));

function triAngles(a, b, c) {
  const ang = (x, y, z) => Math.acos(clamp((y * y + z * z - x * x) / (2 * y * z))) * DEG;
  return [ang(a, b, c), ang(b, c, a), ang(c, a, b)];
}

/**
 * A printed saw setting is normally 90° minus the corner — but where the corner
 * is obtuse it is 90° PLUS it, and the plans almost never say which. So rather
 * than assume, try every acute/obtuse reading and see which one is a triangle.
 *
 * If exactly one reading works, the plan is fine and the useful output is a
 * note telling the builder that corner is obtuse (dialling the number in the
 * obvious direction cuts it twice the miter out). Only when NO reading works
 * is the plan actually wrong.
 */
function checkTriangle(panel, findings) {
  const corners = panel.corners.filter((c) => typeof c.deg === "number");
  const edges = expandEdges(panel).map((e) => e.inches).filter((x) => x != null);
  if (corners.length !== 3) return;

  const fromEdges = edges.length === 3 ? triAngles(...edges).sort((x, y) => x - y) : null;

  const readings = [];
  for (let mask = 0; mask < 8; mask++) {
    const signs = [0, 1, 2].map((i) => !!(mask & (1 << i)));
    // a corner the plan explicitly marks obtuse is not up for reinterpretation
    if (corners.some((c, i) => c.obtuse && !signs[i])) continue;
    const angles = corners.map((c, i) => (signs[i] ? 90 + c.deg : 90 - c.deg));
    if (angles.some((a) => a <= 0 || a >= 180)) continue;
    const sum = angles.reduce((s, a) => s + a, 0);
    if (Math.abs(sum - 180) > SUM_TOL) continue;
    let worst = 0;
    if (fromEdges) {
      const sorted = [...angles].sort((x, y) => x - y);
      worst = Math.max(...sorted.map((a, i) => Math.abs(a - fromEdges[i])));
    }
    readings.push({ signs, angles, worst, obtuse: signs.filter(Boolean).length });
  }

  const good = readings.filter((r) => r.worst <= ANGLE_TOL)
    .sort((a, b) => a.obtuse - b.obtuse || a.worst - b.worst);

  if (good.length) {
    const r = good[0];
    corners.forEach((c, i) => {
      if (r.signs[i] && !c.obtuse)
        findings.push({
          severity: "info", kind: "obtuse-corner",
          message: `${c.label}: the ${c.deg}° saw setting is an OBTUSE corner — the real angle is ${(90 + c.deg).toFixed(1)}°, not ${(90 - c.deg).toFixed(1)}°. The plan doesn't say so; cut it the obvious way and you are ${(2 * c.deg).toFixed(1)}° out.`,
        });
    });
    return;
  }

  // Nothing reads as a valid triangle. Something on this panel is wrong — but
  // it could be a miter OR an edge length, and we must not guess which. Report
  // the disagreement once, showing both sides, and only assert a fix when a
  // second source (the other edition) independently agrees.
  const naive = corners.map(cornerAngle).reduce((s, a) => s + a, 0);
  const printedList = corners.map((c) => `${c.deg}°`).join(" / ");

  if (!fromEdges) {
    findings.push({
      severity: "error", kind: "angle-sum",
      message: `The printed miters (${printedList}) cannot form a triangle — no acute/obtuse reading of them totals 180°; they give ${naive.toFixed(1)}°.`,
    });
    return;
  }

  const implied = fromEdges.map((a) => (a > 90 ? `${(a - 90).toFixed(1)}° obtuse` : `${(90 - a).toFixed(1)}°`)).join(" / ");
  const edgeList = panel.edges.map((e) => e.length).join(" / ");

  // one corroborated correction? (the metric edition printing what the edges imply)
  let corroborated = null;
  for (const c of corners) {
    if (c.altDeg == null) continue;
    for (const want of fromEdges) {
      const alt = want > 90 ? 90 + c.altDeg : 90 - c.altDeg;
      if (Math.abs(alt - want) < ANGLE_TOL && Math.abs(cornerAngle(c) - want) > ANGLE_TOL)
        corroborated = { label: c.label, printed: c.deg, correct: c.altDeg };
    }
  }

  findings.push({
    severity: "error", kind: "panel-inconsistent",
    printed: corroborated ? corroborated.printed : undefined,
    correct: corroborated ? corroborated.correct : undefined,
    message:
      `The printed miters and the printed edge lengths describe different triangles. ` +
      `Miters as printed: ${printedList}. Edge lengths ${edgeList} would require ${implied}. ` +
      (corroborated
        ? `The metric edition prints ${corroborated.correct}° at ${corroborated.label}, which matches the edge lengths — so the ${corroborated.printed}° is the error.`
        : `One of the two is wrong and the drawing alone doesn't say which — check the transcription notes below before cutting.`),
  });
}

function checkRhombus(panel, findings) {
  // A rhombus has two acute and two obtuse corners; plans give one saw setting.
  // Side s and the printed mid-width diagonal d fix the geometry:
  //   corner spanned by d = 2·asin((d/2)/s)
  const side = expandEdges(panel).map((e) => e.inches).filter((x) => x != null)[0];
  const diag = parseImperial(panel.diagonal?.length);
  const printed = panel.corners.map((c) => c.deg).filter((d) => typeof d === "number");
  if (side == null || diag == null || !printed.length) return;
  if (diag / 2 > side) {
    findings.push({
      severity: "error", kind: "impossible",
      message: `Mid-width ${panel.diagonal.length} is more than twice the side ${fmtInches(side)} — no rhombus can have both.`,
    });
    return;
  }
  const spanned = 2 * Math.asin(clamp(diag / 2 / side)) * DEG;
  // the saw setting is off 90° of whichever corner the plan is quoting
  const options = [Math.abs(90 - spanned), Math.abs(90 - (180 - spanned))];
  const best = options.reduce((b, o) =>
    Math.abs(o - printed[0]) < Math.abs(b - printed[0]) ? o : b, options[0]);
  if (Math.abs(best - printed[0]) > ANGLE_TOL)
    findings.push({
      severity: "error", kind: "miter-vs-edges",
      printed: printed[0], correct: +best.toFixed(1),
      message: `Printed miter ${printed[0]}° — side ${fmtInches(side)} with mid-width ${panel.diagonal.length} gives ${best.toFixed(1)}°.`,
    });
}

/**
 * Every dimension printed in both editions must agree. A mismatch means one
 * edition is wrong — which is how the 18' metric sheet's swapped hex base/side
 * labels show up, and that would put all 73 hex panels out.
 */
function checkEditions(panel, findings) {
  const MM_TOL = 2.5; // printed to the nearest mm, rounded from sixteenths
  for (const e of panel.edges) {
    const inches = parseImperial(e.length);
    const mm = e.mm == null ? null : parseFloat(String(e.mm).replace(/[^\d.]/g, ""));
    if (inches == null || mm == null || !isFinite(mm)) continue;
    const expect = inches * 25.4;
    if (Math.abs(mm - expect) > MM_TOL)
      findings.push({
        severity: "error", kind: "edition-mismatch",
        message: `${e.label}: imperial ${e.length} is ${expect.toFixed(0)} mm, but the metric edition prints ${mm.toFixed(0)} mm — a ${Math.abs(mm - expect).toFixed(0)} mm disagreement.`,
      });
  }
}

function auditModel(entry, plan) {
  const out = {
    key: entry.key, label: `${entry.label} ${entry.size}`, family: entry.family,
    approx: !!entry.approx, findings: [], panels: [], lengths: [],
  };
  if (!plan) { out.status = "no-plan-data"; return out; }

  for (const panel of plan.panels) {
    const f = [];
    if (panel.shape === "rhombus") checkRhombus(panel, f);
    else checkTriangle(panel, f);
    checkEditions(panel, f);
    // A panel with two equal corners reports the same defect twice — say it once.
    const seen = new Set();
    const unique = f.filter((x) => {
      const k = `${x.kind}|${x.message}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    out.panels.push({ name: panel.name, shape: panel.shape, findings: unique });
    for (const x of unique) out.findings.push({ ...x, panel: panel.name });
  }

  let result;
  try { result = build(entry.engine); }
  catch (e) {
    out.findings.push({ severity: "warn", kind: "engine", message: `Geometry engine failed: ${e.message}` });
    out.status = "engine-error";
    return out;
  }

  const genLengths = [...new Set(result.panelGroups.flatMap((g) =>
    g.edges.map((e) => +(e.length * 12).toFixed(3))))];
  for (const panel of plan.panels) {
    // Doors, half panels and headers are not in the generated shell — nothing
    // to compare them against, and a nearest-match would be meaningless.
    if (panel.partial) continue;
    for (const e of panel.edges) {
      const target = parseImperial(e.length);
      if (target == null) continue;
      const best = genLengths.reduce((b, L) =>
        Math.abs(L - target) < Math.abs(b - target) ? L : b, genLengths[0] ?? 0);
      const dev = best - target;
      if (Math.abs(dev) > NEAR_IN) continue; // no comparable member — skip silently
      out.lengths.push({
        panel: panel.name, edge: e.label, printed: e.length,
        generated: fmtInches(best), deviationIn: +dev.toFixed(3),
        ok: Math.abs(dev) <= LEN_TOL_IN,
      });
      if (Math.abs(dev) > LEN_TOL_IN && !entry.approx)
        out.findings.push({
          severity: "warn", kind: "length-mismatch", panel: panel.name,
          message: `${e.label}: plan ${e.length}, generated ${fmtInches(best)} (${dev > 0 ? "+" : ""}${dev.toFixed(2)}″).`,
        });
    }
  }

  out.stats = {
    generatedPanels: result.stats.panelCount,
    generatedBoards: result.stats.boardCount,
    generatedShapes: result.panelGroups.length,
    planPanels: plan.panels.reduce((s, p) => s + (p.qty || 0), 0) || null,
  };
  const matched = out.lengths.length;
  out.summary = {
    lengthsChecked: matched,
    lengthsMatching: out.lengths.filter((l) => l.ok).length,
  };
  out.status = out.findings.some((f) => f.severity === "error") ? "errors"
    : out.findings.length ? "notes" : "clean";
  return out;
}

// ------------------------------------------------------------------ run

const registry = read("data/registry.json");
const models = registry.groups.flatMap((g) => g.models);
const report = { models: [] };

for (const entry of models) {
  const p = join(ROOT, "data", "models", `${entry.key}.json`);
  const raw = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  report.models.push(auditModel(entry, normalizePlan(raw, entry.family)));
}

const C = { red: "\x1b[31m", yel: "\x1b[33m", dim: "\x1b[2m", grn: "\x1b[32m", off: "\x1b[0m" };
let errors = 0, warns = 0, noData = 0, clean = 0;
console.log("\nTRILLIUM PLAN AUDIT\n" + "=".repeat(72));
for (const m of report.models) {
  if (m.status === "no-plan-data") { noData++; console.log(`${C.dim}·  ${m.label} — awaiting plan data${C.off}`); continue; }
  const errs = m.findings.filter((f) => f.severity === "error");
  const wrn = m.findings.filter((f) => f.severity === "warn");
  errors += errs.length; warns += wrn.length;
  if (!errs.length && !wrn.length) clean++;
  const mark = errs.length ? `${C.red}✗${C.off}` : wrn.length ? `${C.yel}!${C.off}` : `${C.grn}✓${C.off}`;
  console.log(`\n${mark}  ${m.label}${m.approx ? `${C.dim} (4V — deviation expected)${C.off}` : ""}`);
  if (m.summary)
    console.log(`     ${C.dim}${m.summary.lengthsMatching}/${m.summary.lengthsChecked} printed lengths match the generated model` +
      ` · ${m.stats.generatedPanels} panels / ${m.stats.generatedBoards} boards generated${C.off}`);
  for (const f of m.findings) {
    const c = f.severity === "error" ? C.red : f.severity === "warn" ? C.yel : C.dim;
    console.log(`     ${c}${f.severity.toUpperCase()}${C.off} ${f.panel ? `[${f.panel}] ` : ""}${f.message}`);
  }
  if (!m.findings.length) console.log(`     ${C.grn}self-consistent, and matches the generated geometry${C.off}`);
}
console.log("\n" + "=".repeat(72));
console.log(`${errors} error(s), ${warns} warning(s), ${clean} clean, ${noData} awaiting plan data.\n`);

if (process.argv.includes("--write")) {
  writeFileSync(join(ROOT, "data", "audit.json"), JSON.stringify(report, null, 2));
  console.log("Wrote data/audit.json\n");
}

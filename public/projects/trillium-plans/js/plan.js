// Normalises transcribed plan JSON into one shape the UI and the audit share.
//
// The dome plans and the zome plans were drawn by different hands and use
// different keys (`length`/`mm` vs `imperial`/`metric`, triangles vs rhombi,
// per-corner miters vs one miter for the whole panel). Everything downstream
// works against the normalised form below, so that mess lives only here.
//
//   panel := {
//     id, name, qty, shape, position, note,
//     partial,                 // door/half panel — not present in the generated model
//     edges:   [{ label, length, mm, count }],
//     corners: [{ label, deg, altDeg }],   // saw miter, degrees OFF 90
//     bevels:  [{ label, deg }],           // rip bevel on the outer edge
//     diagonal: { label, length, mm } | null
//   }

const PARTIAL = /\b(half|door|partial|header|window)\b/i;

/**
 * Parse `4'-0 3/16"`, `2 3/8"`, `6' 15/16"`, `7'` -> inches. Null if unparseable.
 *
 * Tokenised rather than matched in one pass: a single regex mis-splits a
 * fraction whose numerator has two digits (`15/16` reads as 1 + 5/16).
 */
export function parseImperial(s) {
  if (s == null) return null;
  if (typeof s === "number") return s;
  let t = String(s).trim().replace(/[″"]/g, '"').replace(/[′’]/g, "'");
  if (!/\d/.test(t)) return null;

  let feet = 0;
  t = t.replace(/(\d+)\s*'/, (_, f) => { feet = +f; return " "; });

  let frac = 0;
  t = t.replace(/(\d+)\s*\/\s*(\d+)/, (_, n, d) => { frac = +n / +d; return " "; });

  const inch = t.match(/(\d+)/);
  return feet * 12 + (inch ? +inch[1] : 0) + frac;
}

/** Inches -> `4'-0 3/16"` */
export function fmtInches(inches) {
  if (inches == null || !isFinite(inches)) return "—";
  const sixteenths = Math.round(inches * 16);
  const whole = Math.floor(sixteenths / 16);
  let f = sixteenths % 16, d = 16;
  while (f % 2 === 0 && f > 0) { f /= 2; d /= 2; }
  return `${Math.floor(whole / 12)}'-${whole % 12}${f ? ` ${f}/${d}` : ""}"`;
}

const WORD_NUM = { two: 2, three: 3, four: 4, five: 5, six: 6 };

/** "Side (x2)" -> 2, "All four sides" -> 4, "Two equal sloped sides" -> 2. */
function edgeCount(label, shape) {
  const l = String(label || "").toLowerCase();
  const x = l.match(/x\s*(\d)/);
  if (x) return +x[1];
  if (/all four|all 4/.test(l)) return 4;
  if (/all sides|all struts/.test(l)) return shape === "rhombus" ? 4 : 3;
  const w = l.match(/\b(two|three|four|five|six)\b[^.]*\b(sides?|struts?|edges?)\b/);
  if (w) return WORD_NUM[w[1]];
  return 1;
}

/**
 * The zome plans label special panels `"special / triangle (base half of a z4)"`,
 * so the family alone is not enough — a half panel is a triangle even in a zome.
 */
function panelShape(p, family) {
  const t = String(p.type || p.shape || "").toLowerCase();
  if (t.includes("rhombus") || t.includes("parallelogram")) return "rhombus";
  if (t.includes("triangle")) return "triangle";
  const corners = (p.miterAngles || []).length;
  if (corners === 3) return "triangle";
  if (corners === 4) return "rhombus";
  return family === "zome" ? "rhombus" : "triangle";
}

function normEdges(raw, shape) {
  const list = (raw || []).map((e) => ({
    label: e.label || e.name || "Edge",
    length: e.length || e.imperial || null,
    mm: e.mm || e.metric || null,
    count: edgeCount(e.label || e.name, shape),
  }));
  // An isosceles triangle given as "Base" + "Side" (no multiplier) is 1 + 2.
  if (shape === "triangle" && list.length === 2 &&
      list.reduce((s, e) => s + e.count, 0) === 2) list[1].count = 2;
  return list;
}

function normCorners(raw, shape) {
  const out = [];
  for (const c of raw || []) {
    const label = c.corner || c.label || "Corner";
    const n = /all corners|all 4|all four/i.test(label) ? (shape === "rhombus" ? 2 : 3) : 1;
    for (let i = 0; i < n; i++)
      out.push({
        label: n > 1 ? `${label} (${i + 1})` : label,
        deg: c.deg,
        // A saw miter is normally 90° minus the corner. Where the corner is
        // obtuse the plan still prints a positive saw setting, so the real
        // corner is 90° PLUS it — the plans note this and it must not be lost.
        obtuse: !!c.obtuse,
        altDeg: c.degMetricPdf ?? c.degMetric ?? null,
      });
  }
  return out;
}

export function normalizePanel(p, family) {
  const shape = panelShape(p, family);
  const name = p.name || p.planLabel || p.position || p.id || "Panel";
  const diag = p.midLength || p.diagonal || null;
  return {
    id: p.id || name,
    name,
    qty: p.qty ?? null,
    shape,
    position: p.position || null,
    note: p.note || null,
    partial: PARTIAL.test(name) || PARTIAL.test(p.id || ""),
    edges: normEdges(p.edges, shape),
    corners: normCorners(p.miterAngles, shape),
    bevels: (p.bevels || []).map((b) => ({ label: b.edge || b.label || "Edge", deg: b.deg })),
    diagonal: diag ? { label: diag.note ? "Mid width" : "Diagonal", length: diag.imperial || diag.length, mm: diag.metric || diag.mm } : null,
  };
}

/** Flatten `edges` honouring `count`, e.g. base + 2 sides -> [b, s, s]. */
/** The real interior angle a printed saw setting corresponds to. */
export function cornerAngle(corner) {
  return corner.obtuse ? 90 + corner.deg : 90 - corner.deg;
}

export function expandEdges(panel) {
  const out = [];
  for (const e of panel.edges) {
    const inches = parseImperial(e.length);
    for (let i = 0; i < e.count; i++) out.push({ ...e, inches });
  }
  return out;
}

export function normalizePlan(raw, family) {
  if (!raw) return null;
  return {
    ...raw,
    family: raw.family || family,
    panels: (raw.panels || []).map((p) => normalizePanel(p, raw.family || family)),
    components: raw.components || raw.componentList || [],
    tools: raw.tools || [],
    materials: raw.materials || [],
    notes: raw.notes || [],
    pdfIssues: raw.pdfIssues || [],
  };
}

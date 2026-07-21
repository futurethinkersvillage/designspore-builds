// Assembler: config -> { pieces (massing for the 3D view), bom (block counts),
// approx (approximation cost lines), metrics }.
// ALL structural block IDs come from the active system profile (SYSTEM); systems never mix.
// Coordinates: X = length, Y = up, Z = span. Units meters.

import { SPEC, SYSTEM, OPENING_WIDTH, familyAvg, hasBlock } from "./blocks.js";
import { buildInteriorPieces } from "./interior.js";

export function assemble(cfg) {
  const S = SYSTEM;
  const M = SPEC.module;
  const wd = SPEC.wallDepth;
  const span = SPEC.spans[cfg.span];
  const spanCols = SPEC.spanCols[cfg.span];
  const H = SPEC.wallHeights[cfg.wallHeight];
  const N = cfg.modules;
  const L = N * M;
  const outerW = span + 2 * wd;
  const outerL = L + 2 * wd;
  const fT = SPEC.floorThickness;
  const storeys = Math.max(1, Math.min(cfg.storeys || 1, 3));
  const storeyH = H + fT;

  const roofType = S.roofTypes.find((r) => r.id === cfg.roof) || S.roofTypes[0];

  const pieces = [];
  const bom = new Map();
  const approx = [];
  const add = (id, n = 1) => bom.set(id, (bom.get(id) || 0) + n);

  const tan42 = Math.tan((42 * Math.PI) / 180);
  const tan10 = Math.tan((10 * Math.PI) / 180);

  // ---------- per storey ----------
  for (let s = 0; s < storeys; s++) {
    const deckY = s * storeyH;
    const wallBaseY = deckY + fT;
    const isTop = s === storeys - 1;

    // floors: ground storey uses -0 (ground) blocks, upper storeys -1 (intermediate)
    const floorMid = s === 0 ? S.floor(cfg.span) : `FLOOR-${cfg.span}-1`;
    const floorEnd = s === 0 ? S.endFloor(cfg.span) : `END-${cfg.span}-1`;
    for (let i = 0; i < N; i++) {
      const isEnd = i === 0 || i === N - 1;
      const bid = isEnd ? floorEnd : floorMid;
      add(bid);
      // floors stay at deck level on explode but fan apart along the length axis
      const fx = i < (N - 1) / 2 ? -1 : i > (N - 1) / 2 ? 1 : 0;
      pieces.push({ kind: "floor", x: (i + 0.5) * M - L / 2, y: deckY + fT / 2, z: 0,
        sx: M - 0.01, sy: fT, sz: outerW, ex: fx, ey: 0, ez: 0, blkX: i, bid, anchorY: deckY });
    }

    // corners
    add(S.corner(cfg.wallHeight), 4);
    for (const cx of [-1, 1]) for (const cz of [-1, 1]) {
      pieces.push({ kind: "corner", x: cx * (L / 2 + wd / 2), y: wallBaseY + H / 2, z: cz * (span / 2 + wd / 2),
        sx: wd, sy: H, sz: wd, ex: cx, ey: 0, ez: cz, bid: S.corner(cfg.wallHeight), anchorY: wallBaseY });
    }

    // side walls + openings (ground storey uses cfg openings; upper storeys mirror windows)
    for (const side of ["front", "back"]) {
      const zc = (side === "front" ? 1 : -1) * (span / 2 + wd / 2);
      const zdir = side === "front" ? 1 : -1;
      const opens = storeyOpenings(cfg, s, side);
      let skip = 0;
      for (let i = 0; i < N; i++) {
        if (skip > 0) { skip--; continue; }
        const kind = opens[i];
        const x0 = i * M - L / 2;
        if (kind && OPENING_WIDTH[kind]) {
          const w = Math.min(OPENING_WIDTH[kind], N - i);
          const obid = kind === "door" ? S.door(cfg.wallHeight)
            : kind === "win2" ? S.window2(cfg.wallHeight) : S.window1(cfg.wallHeight);
          add(obid);
          const wOpen = w * M;
          const sillH = kind === "door" ? 0 : 0.9;
          const headH = H - 0.25;
          const grp = `${s}-${side}-open-${i}`;
          pieces.push({ kind: "wall", grp, x: x0 + wOpen / 2, y: wallBaseY + sillH / 2, z: zc, sx: wOpen - 0.01, sy: sillH, sz: wd, ex: 0, ey: 0, ez: zdir, hidden: sillH === 0 });
          pieces.push({ kind: "wall", grp, x: x0 + wOpen / 2, y: wallBaseY + headH + (H - headH) / 2, z: zc, sx: wOpen - 0.01, sy: H - headH, sz: wd, ex: 0, ey: 0, ez: zdir });
          pieces.push({ kind: kind === "door" ? "door" : "glass", grp,
            x: x0 + wOpen / 2, y: wallBaseY + sillH + (headH - sillH) / 2, z: zc,
            sx: wOpen - 0.12, sy: headH - sillH, sz: wd * 0.35, ex: 0, ey: 0, ez: zdir,
            bid: obid, anchorY: wallBaseY, anchorX: x0 + wOpen / 2, rotY: side === "back" ? Math.PI : 0 });
          skip = w - 1;
        } else {
          add(S.wall(cfg.wallHeight));
          pieces.push({ kind: "wall", x: x0 + M / 2, y: wallBaseY + H / 2, z: zc, sx: M - 0.01, sy: H, sz: wd,
            ex: 0, ey: 0, ez: zdir, bid: S.wall(cfg.wallHeight), anchorY: wallBaseY, rotY: side === "back" ? Math.PI : 0 });
        }
      }
    }

    // end walls: tiled WALL columns across the span (detailed-mode friendly) on both ends
    for (const ex of [-1, 1]) {
      const xc = ex * (L / 2 + wd / 2);
      for (let c = 0; c < spanCols; c++) {
        const z = -span / 2 + (c + 0.5) * (span / spanCols);
        add(S.wall(cfg.wallHeight));
        pieces.push({ kind: "endwall", x: xc, y: wallBaseY + H / 2, z, sx: wd, sy: H, sz: span / spanCols,
          ex, ey: 0, ez: 0, bid: S.wall(cfg.wallHeight), anchorY: wallBaseY, rotY: Math.PI / 2 });
      }
    }

    // stairs (upper storeys need access; STAIR blocks exist in 250 only — never
    // add a block that isn't in THIS system's manifest)
    if (s > 0) {
      const sb = stairBlock(cfg.span);
      if (hasBlock(sb)) add(sb);
      // stair ramp representation from (deckY-storeyH) up to deckY, near the -X end
      pieces.push({ kind: "stair", shape: "ramp", x: -L / 2 + 1.1, y: deckY - storeyH + fT, z: span / 2 - 0.9,
        sx: 1.0, sy: storeyH, sz: 1.6, ex: 0, ey: 0, ez: 0 });
    }
  }

  // ---------- roof (on top storey only) ----------
  const topBaseY = (storeys - 1) * storeyH + fT;
  const topWallTopY = topBaseY + H;
  let ridgeH = 0, roofArea = 0;
  const skyMods = skylightModules(cfg, N);

  if (roofType.kind === "gable") {
    ridgeH = (outerW / 2) * tan42;
    const g = familyAvg(S.gableEndFamily);
    const setId = `${S.gableEndFamily} set (approx.)`;
    add(setId, Math.max(1, spanCols - 1) * 2);
    approx.push({ id: setId, sheets: g.sheets, insulation: g.insulation });
    for (const ex of [-1, 1]) {
      pieces.push({ kind: "endwall", shape: "gableTri", x: ex * (L / 2 + wd / 2), y: topWallTopY, z: 0,
        sx: wd, sy: ridgeH, sz: outerW, ex, ey: 0, ez: 0 });
    }
    for (let i = 0; i < N; i++) {
      const { xc, xLen } = roofModuleX(i, N, M, L, wd);
      if (skyMods.has(i)) {
        add(S.skylight(cfg.span));
        pieces.push({ kind: "roof", shape: "gablePitchL", x: xc, y: topWallTopY, z: 0, sx: xLen, sy: ridgeH, sz: outerW, ex: 0, ey: 1, ez: 0 });
        pieces.push({ kind: "roof", shape: "gablePitchR", x: xc, y: topWallTopY, z: 0, sx: xLen, sy: ridgeH, sz: outerW, ex: 0, ey: 1, ez: 0 });
        addSkylightInset(pieces, (i + 0.5) * M - L / 2, topWallTopY, outerW, ridgeH, +1);
      } else {
        add(roofType.block(cfg.span), roofType.perModule);
        pieces.push({ kind: "roof", shape: "gablePitchL", x: xc, y: topWallTopY, z: 0, sx: xLen, sy: ridgeH, sz: outerW, ex: 0, ey: 1, ez: 0 });
        pieces.push({ kind: "roof", shape: "gablePitchR", x: xc, y: topWallTopY, z: 0, sx: xLen, sy: ridgeH, sz: outerW, ex: 0, ey: 1, ez: 0 });
      }
    }
    roofArea = 2 * Math.hypot(outerW / 2, ridgeH) * outerL;

  } else if (roofType.kind === "skillion") {
    const rise = outerW * tan10;
    ridgeH = rise;
    const s10 = familyAvg(S.skillionToppers);
    const setId = `${S.skillionToppers} topper set (approx.)`;
    add(setId, spanCols * 2);
    approx.push({ id: setId, sheets: s10.sheets, insulation: s10.insulation });
    for (const ex of [-1, 1]) {
      pieces.push({ kind: "endwall", shape: "skillionTri", x: ex * (L / 2 + wd / 2), y: topWallTopY, z: 0,
        sx: wd, sy: rise, sz: outerW, ex, ey: 0, ez: 0 });
    }
    pieces.push({ kind: "wall", x: 0, y: topWallTopY + rise / 2, z: -(span / 2 + wd / 2), sx: L, sy: rise, sz: wd, ex: 0, ey: 0, ez: -1 });
    for (const cx of [-1, 1]) pieces.push({ kind: "corner", x: cx * (L / 2 + wd / 2), y: topWallTopY + rise / 2, z: -(span / 2 + wd / 2), sx: wd, sy: rise, sz: wd, ex: cx, ey: 0, ez: -1 });
    for (let i = 0; i < N; i++) {
      const { xc, xLen } = roofModuleX(i, N, M, L, wd);
      const isSky = skyMods.has(i);
      if (isSky) add(S.skylight(cfg.span)); else add(roofType.block(cfg.span));
      pieces.push({ kind: "roof", shape: "skillionSlab", x: xc, y: topWallTopY, z: 0, sx: xLen, sy: rise, sz: outerW, ex: 0, ey: 1, ez: 0,
        bid: isSky ? null : roofType.block(cfg.span), anchorY: topWallTopY, rotY: Math.PI / 2 });
      if (isSky) addSkillionSkylightInset(pieces, (i + 0.5) * M - L / 2, topWallTopY, outerW, rise);
    }
    roofArea = Math.hypot(outerW, rise) * outerL;

  } else { // flat (200)
    ridgeH = 0.3;
    if (S.vergeFamily) {
      const v = familyAvg(S.vergeFamily);
      const setId = `${S.vergeFamily} edge set (approx.)`;
      add(setId, N * 2);
      approx.push({ id: setId, sheets: v.sheets, insulation: v.insulation });
    }
    for (const cz of [-1, 1]) pieces.push({ kind: "roof", x: 0, y: topWallTopY + 0.15, z: cz * (span / 2 + wd / 2), sx: outerL + 0.3, sy: ridgeH, sz: wd, ex: 0, ey: 1, ez: cz });
    for (let i = 0; i < N; i++) {
      const { xc, xLen } = roofModuleX(i, N, M, L, wd);
      const isSky = skyMods.has(i);
      if (isSky) add(S.skylight(cfg.span)); else add(roofType.block(cfg.span));
      pieces.push({ kind: "roof", x: xc, y: topWallTopY + 0.1, z: 0, sx: xLen, sy: 0.18, sz: outerW,
        ex: 0, ey: 1, ez: 0, bid: roofType.block(cfg.span), anchorY: topWallTopY });
      if (isSky) addRooflight(pieces, (i + 0.5) * M - L / 2, topWallTopY + 0.19, 0);
    }
    roofArea = outerW * outerL;
  }

  // ---------- ties ----------
  let structuralBlocks = 0;
  for (const n of bom.values()) structuralBlocks += n;
  const tieSheets = Math.max(2, Math.round(structuralBlocks * 0.04));
  add("TIES (connector sheets)", tieSheets);
  approx.push({ id: "TIES (connector sheets)", sheets: 1, insulation: 0 });

  // ---------- metrics ----------
  const openCounts = { win: 0, door: 0 };
  for (let s = 0; s < storeys; s++) {
    for (const side of ["front", "back"]) {
      for (const k of Object.values(storeyOpenings(cfg, s, side))) {
        if (k === "door") openCounts.door++; else if (k) openCounts.win++;
      }
    }
  }
  const metrics = {
    footprint: outerW * outerL,
    floorArea: span * L * storeys,
    floorAreaPerStorey: span * L,
    wallArea: 2 * (outerL + outerW) * H * storeys + outerW * ridgeH,
    roofArea, perimeter: 2 * (outerL + outerW),
    ridgeHeight: topWallTopY + ridgeH,
    outerW, outerL, wallH: H, storeys,
    windows: openCounts.win, doors: openCounts.door,
    totalBlocks: structuralBlocks + tieSheets,
  };

  // ---------- interior (optional, ground floor only) ----------
  if (cfg.interior && cfg.showInterior) {
    for (const p of buildInteriorPieces(cfg.interior, metrics)) pieces.push(p);
  }

  return { pieces, bom, approx, metrics };
}

// ground storey = configured openings; upper storeys mirror windows (doors -> win1)
function storeyOpenings(cfg, s, side) {
  const base = (cfg.openings && cfg.openings[side]) || {};
  if (s === 0) return base;
  const out = {};
  for (const [k, v] of Object.entries(base)) out[k] = v === "door" ? "win1" : v;
  return out;
}

function stairBlock(span) {
  // nearest stair size to the span footprint
  const map = { XXXS: "STAIR-S1", XXS: "STAIR-S1", XS: "STAIR-M1", S: "STAIR-M1", M: "STAIR-L1", L: "STAIR-XL1" };
  return map[span] || "STAIR-M1";
}

// A rooflight drawn as a raised box (dark curb + bright glazing) sitting clearly
// proud of the roof surface, so it reads unmistakably as a skylight.
function addRooflight(pieces, x, surfaceY, zc) {
  const topY = surfaceY + 0.34;
  pieces.push({ kind: "skycurb", x, y: topY - 0.09, z: zc, sx: 1.3, sy: 0.24, sz: 1.05, ex: 0, ey: 1, ez: 0 });
  pieces.push({ kind: "skyglass", x, y: topY + 0.05, z: zc, sx: 1.06, sy: 0.06, sz: 0.82, ex: 0, ey: 1, ez: 0 });
}

function addSkylightInset(pieces, x, baseY, outerW, ridgeH, sideSign) {
  const halfW = outerW / 2;
  const f = 0.5;                                 // fraction eave -> ridge
  addRooflight(pieces, x, baseY + ridgeH * f, sideSign * halfW * (1 - f));
}

function addSkillionSkylightInset(pieces, x, baseY, outerW, rise) {
  addRooflight(pieces, x, baseY + rise * 0.5, 0);
}

// roof module extent along X. The end modules extend past the gable end wall
// (which sits at ±(L/2+wd/2), outer face ±(L/2+wd)) plus a verge overhang, so the
// roof fully covers and slightly oversails the gable — no gap at the rake.
const VERGE_OH = 0.15;
function roofModuleX(i, N, M, L, wd) {
  let xc = (i + 0.5) * M - L / 2;
  let xLen = M - 0.01;
  const ext = wd + VERGE_OH;
  if (i === 0) { xc -= ext / 2; xLen += ext; }
  if (i === N - 1) { xc += ext / 2; xLen += ext; }
  return { xc, xLen };
}

// Skylight modules come from an explicit per-module list (cfg.skylightMods),
// edited via the roof grid. Falls back to auto-distributing a numeric
// cfg.skylights count (used by presets before they're normalized).
export function skylightModules(cfg, N) {
  if (Array.isArray(cfg.skylightMods)) {
    return new Set(cfg.skylightMods.filter((i) => i >= 0 && i < N));
  }
  const n = Math.min(cfg.skylights || 0, Math.max(0, N - 2));
  const out = new Set();
  for (let k = 0; k < n; k++) {
    let i = 1 + (Math.round(((k + 0.5) / n) * (N - 2)) | 0);
    while (out.has(i) && i < N - 1) i++;
    out.add(Math.min(i, N - 2));
  }
  return out;
}

// distribute a numeric skylight count into explicit module indices (for presets)
export function autoSkylightMods(count, N) {
  return [...skylightModules({ skylights: count }, N)].sort((a, b) => a - b);
}

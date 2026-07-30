// Shared length/area formatting. Feet in, human-readable out.

export const FT_TO_M = 0.3048;

export const units = { current: "ft" };

/** Reduce a fractional inch count to lowest terms, e.g. 12/16 -> 3/4 */
function reduce(n, d) {
  while (n % 2 === 0 && d % 2 === 0) { n /= 2; d /= 2; }
  return [n, d];
}

/** Feet (decimal) -> `12′ 4 3/8″` or metric equivalent. */
export function fmtLen(ft, unit = units.current) {
  if (ft == null || !isFinite(ft)) return "—";
  if (unit === "m") {
    const m = ft * FT_TO_M;
    return m >= 10 ? m.toFixed(2) + " m" : (m * 1000).toFixed(0) + " mm";
  }
  const sign = ft < 0 ? "-" : "";
  const sixteenths = Math.round(Math.abs(ft) * 12 * 16);
  const whole = Math.floor(sixteenths / 16);
  const frac = sixteenths % 16;
  const f = Math.floor(whole / 12);
  const i = whole % 12;
  let fs = "";
  if (frac) {
    const [n, d] = reduce(frac, 16);
    fs = ` ${n}/${d}`;
  }
  return `${sign}${f}′ ${i}${fs}″`;
}

export function fmtArea(sqft, unit = units.current) {
  if (sqft == null || !isFinite(sqft)) return "—";
  return unit === "m"
    ? (sqft * FT_TO_M * FT_TO_M).toFixed(1) + " m²"
    : Math.round(sqft).toLocaleString() + " ft²";
}

/** Coarse dimension, e.g. overall diameter. */
export function fmtBig(ft, unit = units.current) {
  if (ft == null || !isFinite(ft)) return "—";
  return unit === "m" ? (ft * FT_TO_M).toFixed(2) + " m" : ft.toFixed(1) + " ft";
}

export function fmtDeg(d) {
  if (d == null || !isFinite(d)) return "—";
  return d.toFixed(1).replace(/\.0$/, "") + "°";
}

/**
 * Plan strings are transcribed imperial, e.g. `4'-0 3/16"`. When the user is in
 * metric we show the mm value the metric PDF prints, if we have it.
 */
export function planLen(entry, unit = units.current) {
  if (!entry) return "—";
  if (typeof entry === "string") return prettyImperial(entry);
  if (unit === "m" && entry.mm) return entry.mm;
  return prettyImperial(entry.length);
}

/** `4'-0 3/16"` -> `4′-0 3⁄16″` — typographic marks, ASCII kept in the data. */
export function prettyImperial(s) {
  if (!s) return "—";
  return String(s).replace(/'/g, "′").replace(/"/g, "″");
}

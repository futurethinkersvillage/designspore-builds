// Unit check for the imperial parser — the one place a silent bug would
// corrupt every downstream angle and length comparison.
import { parseImperial, fmtInches } from "../js/plan.js";

const cases = [
  [`4'-0 3/16"`, 48.1875],
  [`3'-5 5/8"`, 41.625],
  [`4'-1 1/4"`, 49.25],
  [`6' 15/16"`, 72.9375],   // two-digit numerator directly after the foot mark
  [`1'-11 11/16"`, 23.6875],
  [`2 3/8"`, 2.375],
  [`15/16"`, 0.9375],
  [`7'`, 84],
  [`11' 11 1/2"`, 143.5],
  [`3'-9 3/4"`, 45.75],
  [`5'-2 1/16"`, 62.0625],
];

let bad = 0;
for (const [s, expect] of cases) {
  const got = parseImperial(s);
  const ok = got != null && Math.abs(got - expect) < 1e-9;
  if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${JSON.stringify(s).padEnd(18)} -> ${got}  (expect ${expect})`);
}
// round trip
for (const [s] of cases) {
  const rt = fmtInches(parseImperial(s));
  const same = parseImperial(rt) === parseImperial(s);
  if (!same) { bad++; console.log(`FAIL  round trip ${s} -> ${rt}`); }
}
console.log(bad ? `\n${bad} FAILURE(S)` : `\nall ${cases.length} parser cases pass, round trip clean`);
process.exit(bad ? 1 : 0);

/**
 * Resize agent avatars from Dropbox into public/agents/ as small webp files.
 * Source images are 1.5–3 MB jpegs; the site only ever renders them at ~48–96px.
 *
 *   node scripts/build-agent-avatars.mjs
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const SRC_DIRS = [
  "D:/Dropbox/Seneca/Agent Avatars/Square",
  "D:/Dropbox/Seneca/Agent Avatars/Square/Remaining",
];
const OUT = "public/agents";

// Agents used on the site → source filename (without extension).
const WANTED = {
  seneca: "Seneca",
  posi: "Posi",
  khal: "Khal",
  ari: "Ari",
  rufus: "Rufus",
  cris: "Cris",
  marcus: "Marcus",
  leo: "Leo",
  cato: "Cato",
  cleo: "Cleo",
  pax: "Pax",
  plato: "Plato",
};

const found = new Map();
for (const dir of SRC_DIRS) {
  let entries = [];
  try {
    entries = await readdir(dir);
  } catch {
    console.warn(`skip (not readable): ${dir}`);
    continue;
  }
  for (const f of entries) {
    const base = path.parse(f).name;
    if (base.endsWith("_BG")) continue; // background variants are 10MB+, unused
    if (!found.has(base)) found.set(base, path.join(dir, f));
  }
}

await mkdir(OUT, { recursive: true });

let ok = 0;
for (const [slug, srcName] of Object.entries(WANTED)) {
  const src = found.get(srcName);
  if (!src) {
    console.warn(`MISSING source for ${slug} (looked for "${srcName}")`);
    continue;
  }
  const dest = path.join(OUT, `${slug}.webp`);
  await sharp(src).resize(192, 192, { fit: "cover" }).webp({ quality: 82 }).toFile(dest);
  ok++;
  console.log(`${slug.padEnd(8)} ← ${path.basename(src)}`);
}
console.log(`\n${ok}/${Object.keys(WANTED).length} avatars written to ${OUT}`);

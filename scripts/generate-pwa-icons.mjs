// One-off generator for Village Dashboard PWA icons.
// Composites the brand logo onto a warm-dark background at the sizes Android/iOS
// need (incl. a maskable variant with safe-zone padding). Run: node scripts/generate-pwa-icons.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "public/images/portal-dao-icon.png");
const OUT = join(root, "public/images");
const BG = { r: 0x1a, g: 0x17, b: 0x20, alpha: 1 }; // --warm-dark #1A1720

async function make(size, innerRatio, outFile) {
  const inner = Math.round(size * innerRatio);
  const logo = await sharp(SRC)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  const offset = Math.round((size - inner) / 2);
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: logo, top: offset, left: offset }])
    .png()
    .toFile(join(OUT, outFile));
  console.log("wrote", outFile, `${size}x${size}`);
}

// "any" icons fill most of the tile; maskable keeps the logo inside the 80% safe zone.
await make(192, 0.7, "icon-192.png");
await make(512, 0.7, "icon-512.png");
await make(512, 0.56, "icon-maskable-512.png");
await make(180, 0.68, "apple-touch-icon.png");
console.log("done");

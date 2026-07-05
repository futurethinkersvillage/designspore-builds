// Build favicon.ico (16/32/48 PNG-in-ICO) + icon.png (192) from the Portal.Place brand mark.
import sharp from "sharp";
import { writeFileSync } from "fs";

const SRC = "C:/Users/miken/Projects/portal-place/app/public/images/icon-512.png";
const OUT_ICO = "C:/Users/miken/Projects/portal-place/app/src/app/favicon.ico";
const OUT_PNG = "C:/Users/miken/Projects/portal-place/app/src/app/icon.png";

const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) {
  pngs.push(await sharp(SRC).resize(size, size, { kernel: "lanczos3" }).png().toBuffer());
}

// ICO container with PNG-compressed entries (supported by all modern browsers)
const count = pngs.length;
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(count, 4);

const entries = [];
let offset = 6 + 16 * count;
pngs.forEach((buf, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 0); // width
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 1); // height
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // planes
  e.writeUInt16LE(32, 6); // bpp
  e.writeUInt32LE(buf.length, 8);
  e.writeUInt32LE(offset, 12);
  entries.push(e);
  offset += buf.length;
});

writeFileSync(OUT_ICO, Buffer.concat([header, ...entries, ...pngs]));
await sharp(SRC).resize(192, 192).png().toFile(OUT_PNG);
console.log("wrote", OUT_ICO, "and", OUT_PNG);

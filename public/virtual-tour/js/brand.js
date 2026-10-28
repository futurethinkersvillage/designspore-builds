// Portal.Place brand: colours + fonts from portal-place/app/src/app/globals.css and the NS deck,
// logo mark from Projects/portal-logo-anim/portal-color.svg (a round portal seen at ~48°: rim + three rings receding).
export const BRAND = {
  warmDark: '#1A1720', indigo: '#38387F', mauve: '#73516F', terracotta: '#AF695E', amber: '#EA824E',
  cream: '#FAF8F4', offWhite: '#F2EDE8',
  serif: 'Cormorant', sans: 'Inter',
};

// The mark is the OFFICIAL artwork (F:/Portal DAO/Design stuff/Logos & Assets/Logo/Portal DAO Icon4x.png), copied
// to assets/brand/portal-mark.png. It is never redrawn or recoloured (Mike: don't change the logo); a redrawn copy
// lost its indigo rim at small sizes and the inner rings looked cut off.
export const MARK_URL = 'assets/brand/portal-mark.png';
export const MARK_ASPECT = 536 / 788; // width / height
export const MARK_COLORS = [BRAND.indigo, BRAND.mauve, BRAND.terracotta, BRAND.amber];

let markImage;
export function loadMark() {
  if (!markImage) markImage = new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = MARK_URL; });
  return markImage;
}
// Draw the mark with its top-left at (x, y), h px tall.
export async function drawMark(ctx, x, y, h) {
  const im = await loadMark();
  ctx.drawImage(im, x, y, h * MARK_ASPECT, h);
}
export function markImg(h = 40) {
  return `<img src="${MARK_URL}" alt="Portal.Place" height="${h}" width="${Math.round(h * MARK_ASPECT)}" style="display:block">`;
}

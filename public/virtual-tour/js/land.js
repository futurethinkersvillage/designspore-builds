// The land: terrain meshes with the paper ⇄ real ground shader, plus the shared "cut + reveal" GLSL that
// trees and buildings use so everything rises out of the sheet together.
//
// Frame: three x = east, y = height above H0, z = south (−north). Local metres from meta.origin_utm10n.
import * as THREE from 'three';
import { SHEET } from './sheet.js';

export const H0 = 600;

// One set of uniforms shared by every material in the scene.
export const U = {
  uCut: { value: -200 },        // the rising cut plane (height above H0)
  uStep: { value: 0 },          // terrace height for the stepped style (0 = smooth)
  uSmooth: { value: 1 },        // 0 = terraced, 1 = true terrain
  uReveal: { value: 0 },        // 0..1 sweep from drawing to real
  uRevealMode: { value: 0 },    // 0 wipe · 1 radial · 2 by height
  uFinish: { value: 0 },        // 0..1 global "everything real" (reaches the far mountains)
  uPaperShade: { value: 0 },    // light the paper model once it has depth
  uPlanOverlay: { value: 0 },   // planned linework on the real land
  uPaper: { value: new THREE.Color() },
  uEdge: { value: new THREE.Color() },
  uFog: { value: new THREE.Color() },
  uFogDensity: { value: 0 },
  uSunDir: { value: new THREE.Vector3(-0.78, 0.47, 0.41).normalize() },
  uContour: { value: 0.16 },
  uContourIndex: { value: 0.34 },
  uHill: { value: 0 },
  uTerraceLines: { value: 0 }, // survey: ink terrace edges on the land while it is still stepped
  uFurniture: { value: 1 },     // sheet border, titles, north arrow, scale: fade out as the camera tilts
  uGrade: { value: 0 },         // pull the land toward the 360° photo's darker, bluer look before the hand-off
  uBands: { value: [new THREE.Color(), new THREE.Color(), new THREE.Color(), new THREE.Color()] },
  uUseBands: { value: 0 },      // radial reveal edge drawn as the logo's rings
  uDroneGain: { value: new THREE.Vector3(1, 1, 1) },
  uExag: { value: 1 },          // vertical exaggeration while the drawing rises (back to 1 before the real land)
  uTide: { value: -200 },       // contour fill: the height the real land has filled up to
  uTideGlow: { value: new THREE.Color('#73516F') },
  uContourCol: { value: new THREE.Color() },
  uContourIdxCol: { value: new THREE.Color() },
  uTime: { value: 0 },          // drives the water ripples
  uSkyTop: { value: new THREE.Color('#3f6fa8') },
  uTreeFade: { value: 1 },
  uLight: { value: new THREE.Vector3(1, 1, 1) },   // multiplies the real ground (dusk / night chapters)
  uWaterAmt: { value: 1 },                          // water strength (the atlas creek lines are off by metres up close)
};

export const REVEAL_GLSL = /* glsl */`
uniform float uCut, uStep, uSmooth, uReveal, uRevealMode, uFinish, uExag, uTide;
float displayH(float h) {
  float hq = uStep > 0.0 ? mix(floor(h / uStep) * uStep, h, uSmooth) : h;
  return min(hq, uCut) * uExag;
}
// contour fill: a "tide" height that rises through the drawn 10 m contours; each band turns real as it's passed
float tideHeight() { return uTide; }
// a little organic wobble on the fill edge, so a flat valley floor fills in waves rather than all in one frame
float tHash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float tNoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(tHash(i), tHash(i + vec2(1, 0)), f.x), mix(tHash(i + vec2(0, 1)), tHash(i + vec2(1, 1)), f.x), f.y); }
float tideJitter(vec2 xy) { return (tNoise(xy * 0.01) - 0.5) * 11.0 + (tNoise(xy * 0.04) - 0.5) * 3.0; } // enough to break up flat ground, not so much it speckles
float radialFront() { return -260.0 + 3400.0 * uReveal + 26000.0 * pow(uReveal, 4.0); } // closed at 0; speeds up to reach the horizon
float radialWidth(float f) { return 110.0 + f * 0.03; }
// 0 = still the drawing, 1 = real. xy = local (east, north), h = true height above H0.
float revealAt(vec2 xy, float h) {
  float r;
  if (uRevealMode < 0.5) {            // diagonal wipe, NW -> SE
    float d = (xy.x - xy.y) * 0.7071;
    float f = mix(-2300.0, 2300.0, uReveal);
    r = smoothstep(f + 90.0, f - 90.0, d);
  } else if (uRevealMode < 1.5) {     // radial from the heart of the property
    float d = length(xy - vec2(-260.0, 80.0));
    float f = radialFront();
    float w = radialWidth(f);
    r = clamp((f + w - d) / (2.0 * w), 0.0, 1.0);   // linear, so the logo-colour stripes come out even
  } else if (uRevealMode > 2.5) {     // contour fill: band by band, from the valley floor up the slopes
    r = clamp((tideHeight() - (h + tideJitter(xy))) / 12.0, 0.0, 1.0);   // continuous, soft-edged
  } else {                            // a point turns real once the cut has passed it
    r = smoothstep(h - 1.0, h + 8.0, uCut);
  }
  return max(r, uFinish);
}
`;

function grid(arr, n, half, holeHalf) {
  const pos = new Float32Array(n * n * 3), hA = new Float32Array(n * n), nor = new Float32Array(n * n * 3);
  const res = 2 * half / (n - 1);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const k = i * n + j, x = -half + j * res, yN = half - i * res;
    pos[k * 3] = x; pos[k * 3 + 1] = 0; pos[k * 3 + 2] = -yN;
    hA[k] = arr[k] - H0 - (holeHalf ? 2 : 0);
    const hx = (arr[i * n + Math.min(j + 1, n - 1)] - arr[i * n + Math.max(j - 1, 0)]) / (2 * res);
    const hyN = (arr[Math.max(i - 1, 0) * n + j] - arr[Math.min(i + 1, n - 1) * n + j]) / (2 * res);
    const v = new THREE.Vector3(-hx, 1, hyN).normalize();
    nor[k * 3] = v.x; nor[k * 3 + 1] = v.y; nor[k * 3 + 2] = v.z;
  }
  const idx = new Uint32Array((n - 1) * (n - 1) * 6);
  let q = 0;
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < n - 1; j++) {
    const a = i * n + j, b = a + 1, c = a + n, d = c + 1;
    idx[q++] = a; idx[q++] = c; idx[q++] = b; idx[q++] = b; idx[q++] = c; idx[q++] = d;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('aH', new THREE.BufferAttribute(hA, 1));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  return g;
}

const VERT = /* glsl */`
${REVEAL_GLSL}
attribute float aH;
varying vec2 vXY; varying float vH; varying vec3 vN; varying vec3 vW;
#include <common>
#include <logdepthbuf_pars_vertex>
void main() {
  vXY = vec2(position.x, -position.z); vH = aH;
  float y = displayH(aH);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vN = aH > uCut + 0.5 ? up : (uStep > 0.0 ? normalize(mix(up, normal, uSmooth)) : normal);
  vec4 w = modelMatrix * vec4(position.x, y, position.z, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
  #include <logdepthbuf_vertex>
}`;

const FRAG = /* glsl */`
${REVEAL_GLSL}
uniform vec3 uPaper, uEdge, uFog, uSunDir;
uniform float uFogDensity, uPaperShade, uPlanOverlay, uContour, uContourIndex, uHill, uHoleHalf, uTerraceLines, uFurniture, uGrade, uUseBands;
uniform vec3 uBands[4];
uniform vec3 uDroneGain, uTideGlow, uContourCol, uContourIdxCol, uSkyTop;
uniform sampler2D tWater; uniform vec4 uWaterRect; uniform float uTime, uHasWater, uTreeFade, uWaterAmt; uniform vec3 uLight;
uniform sampler2D tLand; uniform vec4 uLandRect; uniform float uHasLand;
uniform sampler2D tHi0, tHi1, tHi2; uniform vec3 uHiUA[3], uHiUB[3], uHiVA[3], uHiVB[3]; uniform float uHiN;   // zoom-20 drone patches over the close-up areas   // land cover: r grass, g fairway, b water, a path/gravel
uniform sampler2D tSheet, tOverlay, tFurniture, tNear, tFar, tDrone, tMid;
uniform vec3 uMidUA, uMidUB, uMidVA, uMidVB; uniform float uHasMid;
uniform vec4 uSheetRect, uDroneRect;           // x0, y0, x1, y1 (local metres)
uniform vec3 uNearUA, uNearUB, uNearVA, uNearVB, uFarUA, uFarUB, uFarVA, uFarVB;
uniform float uHasImagery;
varying vec2 vXY; varying float vH; varying vec3 vN; varying vec3 vW;
#include <common>
#include <logdepthbuf_pars_fragment>
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
// sin-free hash (stable at fine scales) for the ground detail
float h12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y); }
// a noise band that fades out before it can alias: period in metres vs the metres this pixel covers
float band(vec2 xy, float period, float px) { return mix(0.5, vn(xy / period), 1.0 - smoothstep(0.35 * period, 0.9 * period, px)); }
// Close-up ground: the satellite / drone photo is far too coarse up close, so near the camera every land-cover class
// gets its own procedural surface, tinted by the (low-passed) photo so it still matches the place.
vec3 detailGround(vec3 photo, vec2 xy, float dist, vec2 dUV) {
  vec2 lUV = (xy - uLandRect.xy) / (uLandRect.zw - uLandRect.xy);
  if (uHasLand < 0.5 || lUV.x < 0.0 || lUV.y < 0.0 || lUV.x > 1.0 || lUV.y > 1.0) return photo;
  float near = 1.0 - smoothstep(250.0, 1100.0, dist);
  if (near <= 0.0) return photo;
  vec4 c = texture2D(tLand, lUV);
  float px = max(fwidth(xy.x), fwidth(xy.y));            // metres of ground under this pixel
  // keep the photo while it still resolves; hand over to class colour only when it's magnified past its resolution
  float mag = 1.0 - smoothstep(0.06, 0.3, px);   // the photo's texels are 0.3 m (zoom-19 drone survey)
  vec3 lp = texture2D(tDrone, dUV, 2.0).rgb * uDroneGain;
  float macro = band(xy, 9.0, px), mid = band(xy, 1.6, px), fine = band(xy, 0.35, px), grain = band(xy, 0.09, px);
  float fr = 1.0 - c.r - c.g - c.a; fr = clamp(fr, 0.0, 1.0);
  // class colours (used up close, tinted by the place's own colour)
  vec3 floorC = mix(lp, vec3(0.22, 0.2, 0.13), 0.35);
  vec3 grassC = mix(lp, vec3(0.34, 0.43, 0.17), 0.35);
  vec3 fairC  = mix(lp, vec3(0.3, 0.47, 0.17), 0.5);
  vec3 pathC  = mix(lp, vec3(0.64, 0.59, 0.5), 0.5);
  vec3 classC = floorC * fr + grassC * c.r + fairC * c.g + pathC * c.a;
  vec3 base = mix(photo, classC, mag * 0.25);   // mostly the photo; class colour only evens out smears
  // surface texture as a light/dark modulation around 1, per class (fades with distance on its own via band())
  float stripe = smoothstep(-0.2, 0.2, sin(dot(xy, vec2(0.7071, 0.7071)) * 0.52));
  float tFloor = (0.78 + 0.44 * mid) * (0.82 + 0.36 * fine) * (0.88 + 0.24 * grain);
  float tGrass = (0.88 + 0.24 * mid) * (0.9 + 0.2 * fine) * (0.94 + 0.12 * grain);   // gentler: the fine bands aliased into dark speckle at distance
  float tFair  = (0.94 + 0.12 * stripe) * (0.95 + 0.1 * fine) * (0.97 + 0.06 * grain);
  float tPath  = (0.88 + 0.24 * mid) * (0.7 + 0.6 * grain) * (0.88 + 0.24 * fine);
  float tex = tFloor * fr + tGrass * c.r + tFair * c.g + tPath * c.a;
  vec3 col = base * mix(1.0, tex * (0.92 + 0.16 * macro), near);
  // dry tufts in the meadow
  col = mix(col, vec3(0.62, 0.56, 0.33), 0.18 * c.r * near * smoothstep(0.66, 0.86, band(xy + 7.0, 2.2, px)));
  return col;
}
float ripple(vec2 q) { return vnoise(q * 0.32) * 0.6 + vnoise(q * 0.85 + 7.3) * 0.3 + vnoise(q * 2.1 - 3.1) * 0.1; }
// Water from the mask (water.js): moving ripples downstream, sky reflection with fresnel, sun glints.
vec3 water(vec3 land, vec2 xy, vec3 wpos) {
  vec2 wUV = (xy - uWaterRect.xy) / (uWaterRect.zw - uWaterRect.xy);
  if (uHasWater < 0.5 || wUV.x < 0.0 || wUV.y < 0.0 || wUV.x > 1.0 || wUV.y > 1.0) return land;
  vec4 m = texture2D(tWater, wUV);
  float amt = smoothstep(0.08, 0.6, m.b);
  if (amt < 0.001) return land;
  vec2 dir = (m.rg - 0.5) * 2.0;                                  // downstream (east, north); ~0 on still water
  float still = 1.0 - clamp(length(dir) * 1.5, 0.0, 1.0);
  vec2 q = xy - dir * uTime * 1.8 + vec2(0.31, 0.23) * uTime * still;
  float e = 0.5, h0 = ripple(q), hx = ripple(q + vec2(e, 0.0)), hy = ripple(q + vec2(0.0, e));
  float k = mix(0.28, 0.16, still);   // gentle surface: no glittery chop
  vec3 N = normalize(vec3(-(hx - h0) / e * k, 1.0, (hy - h0) / e * k)); // three.js z = south
  vec3 V = normalize(cameraPosition - wpos);
  float fres = 0.04 + 0.6 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  vec3 R = reflect(-V, N);
  vec3 sky = mix(uFog, uSkyTop, clamp(R.y * 1.6 + 0.35 * still, 0.0, 1.0));   // still water mirrors the sky, not the haze
  // creeks take the bank's tone; still water (the swimming lake, ponds) is a clear blue-green that mirrors the sky
  // (photo check: Swimming Lake.jpg is a blue mirror, the drone photo's lake reads as dirt)
  vec3 deep = mix(mix(vec3(0.05, 0.08, 0.07), land * 0.55, 0.4), vec3(0.04, 0.1, 0.12), still);   // dark, muted (from above it read bright cyan)
  vec3 wc = mix(deep, sky, clamp(0.12 + fres + 0.12 * still, 0.0, mix(0.55, 0.62, still)));
  wc += vec3(1.0, 0.9, 0.72) * pow(max(dot(R, uSunDir), 0.0), 70.0) * 0.18;  // a soft sheen, never sparkles
  float streak = vn((xy - dir * uTime * 1.2) * vec2(0.6, 0.6)) * (1.0 - still);
  wc *= 0.95 + 0.1 * streak;
  float creekKeep = mix(0.45, 0.0, still);   // creeks: let the real (photographed) creek show through
  // chapters turn uWaterAmt down because the atlas CREEK lines sit a few metres off the photo's; lakes are exact, so
  // still water keeps its full surface
  float amtK = mix(uWaterAmt, 1.0, still * still);
  return mix(land, wc, amt * (1.0 - creekKeep) * uTreeFade * amtK);
}
vec2 quadUV(vec2 p, vec3 uA, vec3 uB, vec3 vA, vec3 vB) {
  vec3 q = vec3(p.x * p.x, p.x * p.y, p.y * p.y) * 1e-4;
  return vec2(dot(uA, vec3(p, 1.0)) + dot(uB, q), dot(vA, vec3(p, 1.0)) + dot(vB, q));
}
float inside(vec2 uv, float f) { return smoothstep(0.0, f, uv.x) * smoothstep(0.0, f, uv.y) * smoothstep(1.0, 1.0 - f, uv.x) * smoothstep(1.0, 1.0 - f, uv.y); }
float contourLine(float h, float interval, float width) {
  float c = abs(fract(h / interval + 0.5) - 0.5) / max(fwidth(h / interval), 1e-5);
  return 1.0 - smoothstep(width - 0.5, width + 0.5, c);
}
void main() {
  #include <logdepthbuf_fragment>
  if (uHoleHalf > 0.0 && abs(vXY.x) < uHoleHalf && abs(vXY.y) < uHoleHalf) discard;
  vec3 n = normalize(vN);
  float ndl = max(dot(n, uSunDir), 0.0);

  // ---- the drawing ----
  vec3 paper = uPaper * (0.985 + 0.03 * hash(floor(vXY * 0.7)));
  float fade = mix(1.0, 0.15, smoothstep(2500.0, 9000.0, length(vW - cameraPosition)));   // distant contours bunch up into a tint
  float ci = contourLine(vH, 50.0, 0.9) * uContourIndex * fade;
  float cm = contourLine(vH, 10.0, 0.55) * uContour * fade * (1.0 - ci);
  paper = mix(paper, uContourCol, clamp(cm, 0.0, 1.0));
  paper = mix(paper, uContourIdxCol, clamp(ci, 0.0, 1.0));
  vec2 sUV = (vXY - uSheetRect.xy) / (uSheetRect.zw - uSheetRect.xy);
  if (sUV.x > 0.0 && sUV.y > 0.0 && sUV.x < 1.0 && sUV.y < 1.0) {
    vec4 s = texture2D(tSheet, sUV);
    paper = mix(paper, s.rgb, s.a);
    vec4 fu = texture2D(tFurniture, sUV);
    paper = mix(paper, fu.rgb, fu.a * uFurniture);
  }
  vec3 ne = normalize(vec3(n.x * uExag * 1.6, n.y, n.z * uExag * 1.6));           // steepened, like a shaded relief map
  float hs = clamp(0.5 + 0.7 * dot(ne, normalize(vec3(-0.55, 0.62, -0.55))), 0.42, 1.2); // light from the NW
  float k = max(uPaperShade, uHill * 0.6);
  paper = mix(paper, paper * hs + vec3(0.09, 0.05, 0.08) * (1.0 - hs), k);         // shadows lean mauve, not black

  // ---- the real land ----
  vec3 real = vec3(0.24, 0.29, 0.2);
  if (uHasImagery > 0.5) {
    vec2 fuv = quadUV(vXY, uFarUA, uFarUB, uFarVA, uFarVB);
    real = texture2D(tFar, fuv).rgb;
    vec2 nuv = quadUV(vXY, uNearUA, uNearUB, uNearVA, uNearVB);
    real = mix(real, texture2D(tNear, nuv).rgb, inside(nuv, 0.04));
    if (uHasMid > 0.5) { vec2 muv = quadUV(vXY, uMidUA, uMidUB, uMidVA, uMidVB); real = mix(real, texture2D(tMid, muv).rgb, inside(muv, 0.08)); }
  }
  vec2 dUV = (vXY - uDroneRect.xy) / (uDroneRect.zw - uDroneRect.xy);
  if (dUV.x > 0.0 && dUV.y > 0.0 && dUV.x < 1.0 && dUV.y < 1.0) {
    vec4 d = texture2D(tDrone, dUV);
    vec3 dc = d.rgb * uDroneGain;
    dc = mix(vec3(dot(dc, vec3(0.299, 0.587, 0.114))), dc, 1.0);   // the photo's own colour (0.86 dulled the fairways)   // the real greens (photo check: fairways read olive-brown when tamed)
    real = mix(real, dc, d.a);
    // sharper zoom-20 survey where the close-ups happen
    for (int i = 0; i < 3; i++) {
      if (float(i) >= uHiN) break;
      vec2 huv = quadUV(vXY, uHiUA[i], uHiUB[i], uHiVA[i], uHiVB[i]);
      if (huv.x <= 0.0 || huv.y <= 0.0 || huv.x >= 1.0 || huv.y >= 1.0) continue;
      vec4 hc = i == 0 ? texture2D(tHi0, huv) : i == 1 ? texture2D(tHi1, huv) : texture2D(tHi2, huv);
      vec3 hdc = hc.rgb * uDroneGain;
      hdc = mix(vec3(dot(hdc, vec3(0.299, 0.587, 0.114))), hdc, 1.0);
      float filled = smoothstep(0.025, 0.07, dot(hc.rgb, vec3(0.333)));   // the z20 survey has black dropout blocks: skip them
      real = mix(real, hdc, hc.a * inside(huv, 0.02) * d.a * filled);
    }
    real = mix(real, detailGround(real, vXY, length(vW - cameraPosition), dUV), d.a);
  }
  real *= 0.80 + 0.36 * ndl;
  real *= vec3(1.04, 1.0, 0.94);   // late-afternoon warmth
  real = water(real, vXY, vW);
  real *= uLight;
  if (uTerraceLines > 0.0) real = mix(real, uEdge, contourLine(vH, uStep, 0.7) * uTerraceLines * 0.6);
  if (sUV.x > 0.0 && sUV.y > 0.0 && sUV.x < 1.0 && sUV.y < 1.0) {
  }
  // grade toward the photo: a touch darker, cooler, more contrast
  vec3 graded = pow(real, vec3(1.18)) * vec3(0.84, 0.92, 1.08) + vec3(0.012, 0.018, 0.03);
  graded = mix(vec3(dot(graded, vec3(0.299, 0.587, 0.114))), graded, 1.12);
  real = mix(real, graded, uGrade);

  float r = revealAt(vXY, vH);
  if (sUV.x > 0.0 && sUV.y > 0.0 && sUV.x < 1.0 && sUV.y < 1.0) {
    vec4 o = texture2D(tOverlay, sUV);
    real = mix(real, o.rgb, o.a * uPlanOverlay * smoothstep(0.6, 1.0, r));
  }
  float edge = (1.0 - abs(r * 2.0 - 1.0)) * (1.0 - uFinish);
  vec3 col = mix(paper, real, r);
  if (uUseBands > 0.5) {
    // the reveal edge as the logo's rings: amber nearest the real land, then terracotta, mauve, rim
    float t = clamp(1.0 - r, 0.0, 1.0) * 4.0;
    vec3 band = t < 1.0 ? uBands[0] : t < 2.0 ? uBands[1] : t < 3.0 ? uBands[2] : uBands[3];
    float on = step(0.02, 1.0 - r) * step(0.02, r);
    col = mix(col, band, on * 0.92 * (1.0 - uFinish));
  } else if (uRevealMode > 2.5) {
    // the tide line: one amber contour at the current fill height
    float hj = vH + tideJitter(vXY);
    float px = abs(hj - tideHeight()) / max(fwidth(hj), 1e-4);
    float tl = 1.0 - smoothstep(0.7, 2.0, px), glow = (1.0 - smoothstep(2.0, 9.0, px)) * step(hj, tideHeight() + 60.0);
    float on = (1.0 - uFinish) * step(-150.0, tideHeight()) * (1.0 - smoothstep(3500.0, 7000.0, length(vW - cameraPosition)));
    col = mix(col, uTideGlow, glow * 0.45 * on);
    col = mix(col, uEdge, tl * 0.95 * on);
  } else {
    col = mix(col, uEdge, edge * 0.55);
  }

  float dist = length(vW - cameraPosition);
  col = mix(col, uFog, 1.0 - exp(-dist * uFogDensity));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export function makeLand({ meta, near, far, sheetTex, overlayTex, furnitureTex, droneTex }) {
  const o = meta.ortho;
  const uniforms = {
    ...U,
    uHoleHalf: { value: 0 },
    tWater: { value: null }, uWaterRect: { value: new THREE.Vector4() }, uHasWater: { value: 0 },
    tLand: { value: null }, uLandRect: { value: new THREE.Vector4() }, uHasLand: { value: 0 },
    tHi0: { value: null }, tHi1: { value: null }, tHi2: { value: null }, uHiN: { value: 0 },
    uHiUA: { value: [0, 1, 2].map(() => new THREE.Vector3()) }, uHiUB: { value: [0, 1, 2].map(() => new THREE.Vector3()) },
    uHiVA: { value: [0, 1, 2].map(() => new THREE.Vector3()) }, uHiVB: { value: [0, 1, 2].map(() => new THREE.Vector3()) },
    tSheet: { value: sheetTex }, tOverlay: { value: overlayTex }, tFurniture: { value: furnitureTex }, tDrone: { value: droneTex },
    tNear: { value: null }, tFar: { value: null }, uHasImagery: { value: 0 }, tMid: { value: null }, uHasMid: { value: 0 },
    uMidUA: { value: new THREE.Vector3() }, uMidUB: { value: new THREE.Vector3() }, uMidVA: { value: new THREE.Vector3() }, uMidVB: { value: new THREE.Vector3() },
    uSheetRect: { value: new THREE.Vector4(SHEET.x0, SHEET.y0, SHEET.x1, SHEET.y1) },
    uDroneRect: { value: new THREE.Vector4(o.x0, o.y0, o.x1, o.y1) },
    uNearUA: { value: new THREE.Vector3() }, uNearUB: { value: new THREE.Vector3() }, uNearVA: { value: new THREE.Vector3() }, uNearVB: { value: new THREE.Vector3() },
    uFarUA: { value: new THREE.Vector3() }, uFarUB: { value: new THREE.Vector3() }, uFarVA: { value: new THREE.Vector3() }, uFarVB: { value: new THREE.Vector3() },
  };
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, extensions: { derivatives: true } });
  const nm = meta.terrain_near, fm = meta.terrain_far;
  const nearMesh = new THREE.Mesh(grid(near, nm.size, nm.half, 0), mat);
  const farMat = mat.clone();
  // share the live uniform objects (clone copies them) so one update drives both meshes
  for (const k in uniforms) farMat.uniforms[k] = uniforms[k];
  farMat.uniforms.uHoleHalf = { value: nm.half - 60 };
  const farMesh = new THREE.Mesh(grid(far, fm.size, fm.half, nm.half), farMat);
  nearMesh.frustumCulled = farMesh.frustumCulled = false;
  const group = new THREE.Group(); group.add(farMesh, nearMesh);

  const setImagery = (nearMosaic, farMosaic, midMosaic) => {
    if (midMosaic) {
      uniforms.tMid.value = midMosaic.tex; uniforms.uHasMid.value = 1;
      uniforms.uMidUA.value.copy(midMosaic.uv.uA); uniforms.uMidUB.value.copy(midMosaic.uv.uB); uniforms.uMidVA.value.copy(midMosaic.uv.vA); uniforms.uMidVB.value.copy(midMosaic.uv.vB);
    }
    uniforms.tNear.value = nearMosaic.tex; uniforms.tFar.value = farMosaic.tex;
    uniforms.uNearUA.value.copy(nearMosaic.uv.uA); uniforms.uNearUB.value.copy(nearMosaic.uv.uB);
    uniforms.uNearVA.value.copy(nearMosaic.uv.vA); uniforms.uNearVB.value.copy(nearMosaic.uv.vB);
    uniforms.uFarUA.value.copy(farMosaic.uv.uA); uniforms.uFarUB.value.copy(farMosaic.uv.uB);
    uniforms.uFarVA.value.copy(farMosaic.uv.vA); uniforms.uFarVB.value.copy(farMosaic.uv.vB);
    uniforms.uHasImagery.value = 1;
  };
  const setHi = mosaics => {
    mosaics.slice(0, 3).forEach((m, i) => {
      uniforms['tHi' + i].value = m.tex;
      uniforms.uHiUA.value[i].copy(m.uv.uA); uniforms.uHiUB.value[i].copy(m.uv.uB); uniforms.uHiVA.value[i].copy(m.uv.vA); uniforms.uHiVB.value[i].copy(m.uv.vB);
    });
    uniforms.uHiN.value = Math.min(3, mosaics.length);
  };
  const setLand = (tex, rect) => { uniforms.tLand.value = tex; uniforms.uLandRect.value.copy(rect); uniforms.uHasLand.value = 1; };
  const setWater = w => { uniforms.tWater.value = w.tex; uniforms.uWaterRect.value.copy(w.rect); uniforms.uHasWater.value = 1; };
  return { group, setImagery, setWater, setLand, setHi };
}

// Bilinear terrain height (true metres above H0) at local x (east), y (north).
export function heightSampler(meta, near, far) {
  const pick = (a, m, x, y) => {
    const { half: h, res: r, size: n } = m;
    const c = (x + h) / r, rr = (h - y) / r;
    const i = Math.min(Math.max(Math.floor(rr), 0), n - 2), j = Math.min(Math.max(Math.floor(c), 0), n - 2);
    const fy = rr - i, fx = c - j;
    return (a[i * n + j] * (1 - fx) + a[i * n + j + 1] * fx) * (1 - fy) + (a[(i + 1) * n + j] * (1 - fx) + a[(i + 1) * n + j + 1] * fx) * fy - H0;
  };
  return (x, y) => (Math.abs(x) < meta.terrain_near.half - 20 && Math.abs(y) < meta.terrain_near.half - 20)
    ? pick(near, meta.terrain_near, x, y) : pick(far, meta.terrain_far, x, y);
}

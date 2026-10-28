// Surface detail for the building models, so they hold up in close-ups: a world-space procedural layer added to
// every opaque MeshStandardMaterial — lap-siding / board lines on walls, shingle courses on roofs, and fine grain
// and weathering everywhere. Glass, glowing and transparent materials are left alone. Patches each material once.
import * as THREE from 'three';

const patched = new WeakSet();
// a material that really glows (glazing, lamps). emissiveIntensity alone is 1 by default on every material.
export const glows = m => !!m.emissive && m.emissiveIntensity > 0.4 && m.emissive.r + m.emissive.g + m.emissive.b > 0.05;

const GLSL = /* glsl */`
float sd_h(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float sd_n(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(sd_h(i), sd_h(i + vec3(1, 0, 0)), f.x), mix(sd_h(i + vec3(0, 1, 0)), sd_h(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(sd_h(i + vec3(0, 0, 1)), sd_h(i + vec3(1, 0, 1)), f.x), mix(sd_h(i + vec3(0, 1, 1)), sd_h(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
// a thin dark line every 'period' metres along t, faded out when a pixel spans more than a line
float sd_lines(float t, float period, float width) {
  float px = fwidth(t) / period;
  float d = abs(fract(t / period) - 0.5) * 2.0;
  return (1.0 - smoothstep(1.0 - width - px, 1.0 - width + px, d)) * (1.0 - smoothstep(0.15, 0.5, px));
}
vec3 surfaceDetail(vec3 col, vec3 wp, vec3 wn) {
  float px = length(fwidth(wp));
  float fadeFine = 1.0 - smoothstep(0.01, 0.06, px), fadeMid = 1.0 - smoothstep(0.04, 0.25, px);
  float grain = sd_n(wp * vec3(40.0, 6.0, 40.0)) * fadeFine;      // grain runs along the boards
  float blotch = sd_n(wp * 0.9) * 0.6 + sd_n(wp * 3.1) * 0.4;     // weathering
  float k = 1.0 + (blotch - 0.5) * 0.16 * fadeMid + (grain - 0.5) * 0.12;
  float wall = 1.0 - smoothstep(0.35, 0.6, abs(wn.y)), roof = smoothstep(0.35, 0.6, wn.y);
  // lap siding / board seams on walls (horizontal), shingle courses on roofs (with staggered joints)
  float siding = sd_lines(wp.y, 0.2, 0.07);
  float course = sd_lines(wp.y, 0.14, 0.12);
  float along = dot(wp.xz, normalize(vec2(wn.z, -wn.x) + 1e-4));
  float joints = sd_lines(along + floor(wp.y / 0.14) * 0.17, 0.34, 0.08) * roof;
  k *= 1.0 - 0.13 * siding * wall - 0.18 * (course + joints) * roof;
  return col * k;
}
`;

export function addSurfaceDetail(root) {
  root.traverse(o => {
    if (!o.isMesh) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (!m || !m.isMeshStandardMaterial || patched.has(m) || m.transparent || glows(m) || m.userData.noSurface) continue;
      if (m.onBeforeCompile !== THREE.Material.prototype.onBeforeCompile) continue;   // already customised elsewhere
      patched.add(m);
      m.onBeforeCompile = sh => {
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vSdP; varying vec3 vSdN;')
          .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n  #ifdef USE_INSTANCING\n  vSdP = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;\n  #else\n  vSdP = (modelMatrix * vec4(transformed, 1.0)).xyz;\n  #endif\n  vSdN = normalize(mat3(modelMatrix) * objectNormal);');
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vSdP; varying vec3 vSdN;\n' + GLSL)
          .replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.rgb = surfaceDetail(diffuseColor.rgb, vSdP, normalize(vSdN));');
      };
      m.customProgramCacheKey = () => 'surface-detail';
      m.needsUpdate = true;
    }
  });
}

// The swimming lake as a real mirror (Lake/Swimming Lake.jpg; reviewers, i16–i18: "the biggest single fix"): a Reflector cut to
// the lake's plan outline, a touch of dark water and slow ripple over the reflected scene. Only costs a render while its
// chapter shows it. Local metres (x = east, y = north, three z = -north).
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';

// the water as the ground map has it: the plan's lake outline runs far past the real shore, which showed as a grey slab on the grass (Mike's drone video 11:44)
const REAL_LAKE = [[-0.2,-235.0],[4.3,-233.2],[5.1,-231.1],[5.2,-229.1],[3.8,-227.5],[3.2,-225.6],[2.5,-223.9],[2.1,-221.9],[1.5,-219.9],[1.2,-217.7],[0.7,-215.4],[0.0,-213.2],[-1.2,-211.3],[-2.9,-209.8],[-3.1,-206.0],[-4.4,-203.4],[-5.3,-199.5],[-6.9,-196.1],[-9.1,-193.2],[-11.8,-191.4],[-14.7,-189.7],[-17.8,-189.3],[-21.1,-189.6],[-24.2,-190.6],[-27.4,-190.3],[-30.5,-190.7],[-33.8,-190.4],[-37.0,-190.8],[-40.1,-191.9],[-42.8,-193.7],[-45.2,-196.1],[-47.0,-199.0],[-48.8,-201.6],[-50.1,-204.6],[-50.7,-208.0],[-50.6,-211.6],[-50.6,-214.8],[-50.6,-217.6],[-49.6,-220.7],[-48.2,-223.7],[-47.6,-226.0],[-47.2,-228.0],[-46.6,-229.9],[-45.9,-231.8],[-45.6,-233.4],[-45.2,-235.0],[-45.1,-236.6],[-44.9,-238.2],[-44.7,-239.7],[-43.8,-241.1],[-43.3,-242.6],[-43.7,-244.4],[-43.0,-245.8],[-42.6,-247.5],[-42.1,-249.1],[-40.7,-250.1],[-42.1,-253.8],[-42.1,-256.6],[-41.7,-259.5],[-41.1,-262.4],[-40.2,-265.4],[-39.7,-270.1],[-38.6,-274.4],[-36.7,-278.3],[-34.1,-281.1],[-31.5,-285.3],[-28.0,-286.3],[-24.5,-287.0],[-20.8,-287.0],[-17.7,-281.8],[-14.8,-279.4],[-12.0,-277.7],[-8.7,-277.8],[-5.6,-277.2],[-2.9,-275.5],[0.1,-274.4],[1.7,-271.1],[2.6,-267.4],[3.4,-264.0],[4.0,-260.7],[4.2,-257.5],[3.6,-254.1],[3.2,-251.2],[2.5,-248.4],[1.1,-245.6],[0.4,-243.4],[-0.5,-241.4],[-0.6,-239.7],[-0.4,-238.2],[-0.7,-236.6],[-0.2,-235.0]];
export function lakeMirror(ctx, _plan) {
  const ring = REAL_LAKE;
  if (ctx._lakeMirror) return ctx._lakeMirror;   // one mirror, the whole film (Mike 10-31: it switched off at hand-offs)
  const shape = new THREE.Shape(ring.map(([x, y]) => new THREE.Vector2(x, y)));
  const n = ring.length, cx = ring.reduce((a, p) => a + p[0], 0) / n, cy = ring.reduce((a, p) => a + p[1], 0) / n;
  const m = new Reflector(new THREE.ShapeGeometry(shape, 8), {
    textureWidth: 1024, textureHeight: 576, clipBias: 0.002, multisample: 2,
    shader: {
      name: 'LakeMirror',
      uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null } },
      vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec2 vP;
        void main() { vUv = textureMatrix * vec4(position, 1.0); vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform sampler2D tDiffuse; varying vec4 vUv; varying vec2 vP;
        void main() {
          vec4 uv = vUv; float r = sin(vP.x * 0.9 + vP.y * 0.35) * sin(vP.y * 1.3 - vP.x * 0.2) + 0.5 * sin(vP.x * 2.3 - vP.y * 1.7);
          uv.xy += vec2(0.0012, 0.0035) * r * uv.w;
          vec3 c = texture2DProj(tDiffuse, uv).rgb;
          c = min(mix(vec3(dot(c, vec3(0.3, 0.6, 0.1))), c, 0.45) * vec3(0.72, 0.84, 0.92), vec3(0.12, 0.17, 0.22));   // deep blue-black in the drone video; a pink dusk sky made it salmon
          gl_FragColor = vec4(mix(vec3(0.02, 0.05, 0.06), c, 0.78), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    },
  });
  m.rotation.x = -Math.PI / 2;
  const hs = ring.map(([x, y]) => ctx.groundAt(x, y)).sort((a, b) => a - b);
  m.position.y = hs[hs.length - 1] + 0.05;   // at the shoreline: from the lake's centre the terrain covered half of it, so the mirror showed as a patch
  m.userData.always = true; m.userData.maxDist = 1100; m.userData.centre = new THREE.Vector3(cx, m.position.y, -cy);   // the film shows it in every chapter, unless the camera is far off
  ctx.scene.add(m); ctx._lakeMirror = m;
  return m;
}

// The swimming lake as a real mirror (Lake/Swimming Lake.jpg; reviewers, i16–i18: "the biggest single fix"): a Reflector cut to
// the lake's plan outline, a touch of dark water and slow ripple over the reflected scene. Only costs a render while its
// chapter shows it. Local metres (x = east, y = north, three z = -north).
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';

// the water as the ground map has it: the plan's lake outline runs far past the real shore, which showed as a grey slab on the grass (Mike's drone video 11:44)
export const REAL_LAKE = [[-47.9,-188.2],[-45.7,-186.9],[-42.8,-186.0],[-39.6,-185.4],[-36.1,-185.1],[-32.7,-185.2],[-29.2,-185.5],[-25.5,-186.1],[-21.6,-187.1],[-17.9,-188.3],[-14.5,-189.7],[-11.4,-191.4],[-8.5,-193.3],[-5.7,-195.4],[-3.2,-197.8],[-0.9,-200.3],[1.0,-203.0],[2.7,-206.0],[4.1,-209.2],[5.4,-212.4],[6.7,-215.5],[7.8,-218.4],[8.7,-221.4],[9.5,-224.3],[10.4,-227.4],[11.2,-230.6],[12.2,-234.0],[13.2,-237.5],[14.3,-241.2],[15.1,-244.9],[15.8,-248.8],[16.1,-253.0],[16.2,-257.5],[16.2,-262.0],[16.0,-266.3],[15.8,-270.0],[15.4,-273.0],[14.9,-275.5],[14.3,-277.7],[13.6,-279.8],[12.7,-282.1],[11.9,-284.8],[11.0,-287.8],[9.9,-290.7],[8.5,-292.9],[6.7,-294.2],[4.3,-294.3],[1.4,-293.4],[-1.8,-291.9],[-5.1,-290.2],[-8.5,-288.8],[-12.1,-287.6],[-16.0,-286.5],[-19.9,-285.2],[-23.6,-283.8],[-26.7,-282.1],[-29.1,-280.2],[-31.0,-278.1],[-32.6,-275.8],[-34.1,-273.1],[-35.8,-270.0],[-37.6,-266.4],[-39.6,-262.3],[-41.5,-257.9],[-43.3,-253.4],[-44.8,-248.8],[-46.1,-244.1],[-47.1,-239.3],[-48.0,-234.4],[-48.8,-229.4],[-49.4,-224.5],[-50.0,-219.5],[-50.4,-214.3],[-50.8,-209.1],[-50.9,-204.4],[-50.9,-200.3],[-50.8,-197.0],[-50.6,-194.1],[-50.2,-191.8],[-49.3,-189.8],[-47.9,-188.2]];
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
          c = min(c * vec3(0.3, 0.38, 0.44), vec3(0.055, 0.09, 0.125));   // deep blue-black in the drone video; a pink dusk sky made it salmon
          gl_FragColor = vec4(mix(vec3(0.02, 0.05, 0.06), c, 0.78), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    },
  });
  m.rotation.x = -Math.PI / 2;
  m.position.y = ctx.lakeLevel;   // the engine dug the bed and raised the bank to this level: this is the only water surface on the lake (Mike 11-01, frame 5831)   // at the shoreline: from the lake's centre the terrain covered half of it, so the mirror showed as a patch
  m.userData.always = true; m.userData.maxDist = 1100; m.userData.centre = new THREE.Vector3(cx, m.position.y, -cy);   // the film shows it in every chapter, unless the camera is far off
  // past maxDist the mirror is off: the same outline in the mirror's deep blue-black stands in, so the lake stays water from the air
  const far = new THREE.Mesh(m.geometry, new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(0.04, 0.068, 0.092) }));
  far.rotation.x = -Math.PI / 2; far.position.y = m.position.y; far.visible = false; m.userData.far = far; ctx.scene.add(far);
  ctx.U.uLakeMirror.value = 1; ctx.scene.add(m); ctx._lakeMirror = m;
  return m;
}

// The swimming lake as a real mirror (Lake/Swimming Lake.jpg; reviewers, i16–i18: "the biggest single fix"): a Reflector cut to
// the lake's plan outline, a touch of dark water and slow ripple over the reflected scene. Only costs a render while its
// chapter shows it. Local metres (x = east, y = north, three z = -north).
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';

export function lakeMirror(ctx, ring) {
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
          gl_FragColor = vec4(mix(vec3(0.02, 0.05, 0.05), c, 0.86), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    },
  });
  m.rotation.x = -Math.PI / 2;
  m.position.y = ctx.groundAt(cx, cy) + 0.3;
  m.userData.always = true; m.userData.maxDist = 1100; m.userData.centre = new THREE.Vector3(cx, m.position.y, -cy);   // the film shows it in every chapter, unless the camera is far off
  ctx.scene.add(m); ctx._lakeMirror = m;
  return m;
}

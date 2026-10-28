// The real 360° photo the flight lands in, a gradient sky, and the portal ring used by the blueprint direction.
import * as THREE from 'three';

// yaw0 = compass heading of the photo's left edge (from tools/pano_align.py)
export function makePano(url, yaw0) {
  let done; const ready = new Promise(res => (done = res));
  const tex = new THREE.TextureLoader().load(url, done, undefined, done);
  // per-pixel lookup below: no mipmaps (they'd seam where the azimuth wraps), plain linear filtering
  tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter;
  const geo = new THREE.SphereGeometry(1500, 64, 32);
  const mat = new THREE.ShaderMaterial({
    uniforms: { map: { value: tex }, uOpacity: { value: 0 }, uIris: { value: -1 }, uRes: { value: new THREE.Vector2(1, 1) },
      uWarm: { value: 0 }, uYaw0: { value: THREE.MathUtils.degToRad(yaw0) }, uDissolve: { value: 0 } },
    vertexShader: `varying vec3 vDir; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vDir = w.xyz - cameraPosition;
      gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform sampler2D map; uniform float uOpacity, uIris, uWarm, uYaw0, uDissolve; uniform vec2 uRes; varying vec3 vDir;
      float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
      void main(){
        // exact equirect lookup from the view direction: azimuth clockwise from north (three.js z = south)
        vec3 d = normalize(vDir);
        float az = atan(d.x, -d.z);
        vec2 uv = vec2(fract((az - uYaw0) / 6.2831853), 0.5 + asin(clamp(d.y, -1.0, 1.0)) / 3.1415927);
        vec3 c = texture2D(map, uv).rgb;
        c = mix(c, c * vec3(1.1, 1.06, 0.88) + 0.02, uWarm);
        float a = uOpacity;
        if (uDissolve > 0.5) {   // the photo arrives in soft organic patches instead of a double exposure
          vec2 q = gl_FragCoord.xy / uRes.y;
          float m = n(q * 5.0) * 0.65 + n(q * 13.0) * 0.35;
          a = smoothstep(m - 0.18, m + 0.18, uOpacity * 1.36 - 0.18);
        }
        if (uIris >= 0.0) {
          vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
          a *= smoothstep(uIris + 0.03, uIris - 0.03, length(p));
        }
        gl_FragColor = vec4(c, a);
        #include <colorspace_fragment>
      }`,
    transparent: true, depthTest: false, depthWrite: false, side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 10; mesh.frustumCulled = false; mesh.visible = false;
  return { mesh, mat, tex, ready };
}

export function makeSky() {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTop: { value: new THREE.Color('#3f6fa8') }, uHorizon: { value: new THREE.Color('#dfe6e8') }, uSun: { value: new THREE.Vector3(-0.78, 0.47, 0.41).normalize() }, uOpacity: { value: 0 } },
    vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`,
    fragmentShader: `uniform vec3 uTop, uHorizon, uSun; uniform float uOpacity; varying vec3 vD;
      void main(){
        float t = pow(clamp(vD.y, 0.0, 1.0), 0.35);   // a visible gradient just above the horizon
        vec3 c = mix(uHorizon, uTop, t);
        float s = max(dot(normalize(vD), uSun), 0.0);
        c += vec3(1.0, 0.86, 0.62) * (pow(s, 600.0) * 2.0 + pow(s, 12.0) * 0.18);
        gl_FragColor = vec4(c, uOpacity);
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide, transparent: true, depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), mat);
  mesh.frustumCulled = false; mesh.renderOrder = -1;
  return { mesh, mat };
}

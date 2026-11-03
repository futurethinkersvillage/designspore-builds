// Camera rig: keyframes -> smooth camera. Shared by the checkpoint-1 timeline (main.js) and every chapter module.
// A keyframe is [t, targetEast, targetNorth, targetHeight, frameH, heading°, pitch°, fov°]:
//   the camera looks at the target from the heading/pitch, back far enough that the visible frame height at the
//   target is frameH metres (frameH 0 = the camera sits exactly at the target). Heights are metres above H0 (land.js).
import * as THREE from 'three';

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = t => t * t * (3 - 2 * t);
export const seg = (p, a, b) => smooth(clamp((p - a) / (b - a)));
const D2R = Math.PI / 180;
export const fwd = (A, P) => new THREE.Vector3(Math.sin(A) * Math.cos(P), Math.sin(P), -Math.cos(A) * Math.cos(P));

export function makeRig(keyframes) {
  let KF;
  // keys = the editable keyframes as given (sorted by t); the working copy KF has headings unwrapped
  const build = keys => {
    KF = keys.map(k => k.slice()).sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < KF.length; i++) { let a = KF[i][5]; while (a - KF[i - 1][5] > 180) a -= 360; while (a - KF[i - 1][5] < -180) a += 360; KF[i][5] = a; }
  };
  let keys = keyframes.map(k => k.slice()); build(keys);
  // cubic Hermite through keyframes (tangents from neighbours, flat at holds, turning points and ends)
  const interp = (p, c) => {
    let i = 0; while (i < KF.length - 2 && p > KF[i + 1][0]) i++;
    const k0 = KF[i], k1 = KF[i + 1], dt = k1[0] - k0[0], t = clamp((p - k0[0]) / dt);
    // monotone (Fritsch–Carlson) tangents: smooth through each key but never overshooting between two keys — a
    // "hold" next to a big move used to slide ~20 m away and back (Mike 10-29: superfluous camera movement)
    const tan = j => {
      if (j === 0 || j === KF.length - 1) return 0;
      const a = KF[j - 1], b = KF[j + 1], k = KF[j];
      const dl = (k[c] - a[c]) / (k[0] - a[0]), dr = (b[c] - k[c]) / (b[0] - k[0]);
      if (dl === 0 || dr === 0 || dl * dr < 0) return 0;
      const m = (b[c] - a[c]) / (b[0] - a[0]);
      return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.min(Math.abs(dl), Math.abs(dr)));
    };
    const m0 = tan(i) * dt, m1 = tan(i + 1) * dt, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * k0[c] + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * k1[c] + (t3 - t2) * m1;
  };
  const at = p => {
    const v = c => interp(p, c);
    const A = v(5) * D2R, P = v(6) * D2R, fov = v(7);
    const dist = v(4) / 2 / Math.tan(fov * D2R / 2);
    const pos = new THREE.Vector3(v(1), v(3), -v(2)).addScaledVector(fwd(A, P), -dist);
    return { pos, A, P, fov, dist };
  };
  return {
    at,
    get keys() { return keys; },
    setKeys(k) { keys = k.map(x => x.slice()).sort((a, b) => a[0] - b[0]); build(keys); },
    // put the camera where the rig says for progress p
    apply(camera, p) {
      const { pos, A, P, fov, dist } = at(p);
      camera.position.copy(pos); camera.rotation.order = 'YXZ'; camera.rotation.set(P, -A, 0);
      camera.fov = fov; camera.near = dist < 5 ? 0.2 : Math.max(1, dist - 4000); camera.far = dist + 60000;
      camera.updateProjectionMatrix();
      return { pos, A, P, fov, dist };
    },
  };
}

// The lines from the lens to what it looks at, every `step` of the path from a to b, for engine.clearTreesNear (array of lines):
// only trees that actually stand in a line of sight go (r1103b: cone trees filled the foreground in ch03 and ch10).
export function sightLines(r, a = 0, b = 1, step = 0.02, u0 = 0.02, u1 = 0.88) {
  const out = [];
  for (let t = a; t <= b + 1e-9; t += step) { const { pos, A, P, dist } = r.at(t), f = fwd(A, P); out.push([u0, (u0 + u1) / 2, u1].map(u => pos.clone().addScaledVector(f, dist * u))); }
  return out;
}

export function views(r, a = 0, b = 1, step = 0.02) {   // camera spots + view directions along the path, for engine.clearTreesInView
  const out = []; for (let t = a; t <= b + 1e-9; t += step) { const { pos, A, P } = r.at(t); out.push({ pos, dir: fwd(A, P) }); } return out;
}

// A chapter's rig API with its saved camera path (from the editor, data/cameras.json) taking precedence over the
// keyframes written in the chapter's code. The code's own keys are kept on rig.defaultKeys.
export function rigFor(id, cameras = {}) {
  return {
    clamp, smooth, seg, fwd, sightLines, views,
    makeRig(kf) {
      const r = makeRig(cameras[id]?.keys || kf);
      r.id = id; r.defaultKeys = kf.map(k => k.slice());
      rigFor.last[id] = r;
      return r;
    },
  };
}
rigFor.last = {};

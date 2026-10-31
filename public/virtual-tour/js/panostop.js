// A real 360° photo inside a chapter (Mike, 2026-10-27: "the 360 photos are really helpful"). The camera parks on the
// photographer's spot, the photo dissolves in around it in soft patches, the view turns, then the photo dissolves
// back into the 3D world. Real places get their close-up from the photo, not from the 3D ground (which smears that close).
//
// Spots + headings come from the old portal.place virtual tour (portal-place/app/src/app/panorama/page.tsx):
// the aerial 360's hotspots ray-cast onto the land put each ground photo within a few metres of its building, then
// each photo's heading (yaw0 = compass bearing of the image's left edge) was solved from landmarks seen in it.
import { makePano } from './pano.js';

export const PANOS = {
  // ~4.5 m WNW of the barrel, facing its door; Hemp Creek + footbridge to the N, bunk cabin to the SSW
  sauna:    { file: 'sauna',    at: [-85.12, -42.86], eye: 2.04, yaw0: 248.33, title: 'The cedar sauna on Hemp Creek' },   // moved with the sauna (Mike re-placed it ~21 m NE, 10-29); yaw0 is compass-true, unchanged
  // ~12 m ENE of the main shower house; the office + golf carts and the forest-school playground beyond (to the W)
  shower:   { file: 'shower',   at: [-66.57, 115.63],  eye: 3.01, yaw0: 73.96, floorAt: [-76.05, 101.56], title: 'Shower house & campground' },   // solved 10-31 from 8 landmarks (tools/pano_solve_shower.py, rms 0.9°): the photo was taken from ~3 m up, ~11 m off the gable and level with the back wall; eye = above the house's ground
  // (DomeLake1 — "Lake & Field" — is NOT used: it shows the dome at its earlier spot. Mike, 10-28)
  // inside the event gazebo (kitchen wall to the NW, open entrance to the SE)
  gazebo:   { file: 'gazebo',   at: [-597, -226],     eye: 1.7, yaw0: 19,  title: 'Inside the gazebo' },   // set so the arrival view is the tables + open side
};
// how much of a real photo is on screen right now (the film hides its "concept" legend over real photos)
export const panoState = { op: 0 };
const SMALL = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) && Math.min(screen.width, screen.height) < 700 && !new URLSearchParams(location.search).has('hq');

export async function panoStop(ctx, id) {
  const P = PANOS[id];
  const p = makePano(`assets/pano/${P.file}_360${SMALL ? '_m' : ''}.jpg`, P.yaw0);
  p.mat.uniforms.uDissolve.value = 0; p.mat.uniforms.uIris.value = -1;   // straight crossfade (cut 10 reviews: the patch dissolve read as blotchy blocks)
  ctx.scene.add(p.mesh);
  await p.ready;
  const z = ctx.groundAt(...(P.floorAt || P.at)) + P.eye;
  // a small cream tag in the corner while the photo is up (the real-world twin of the CONCEPT tag)
  const tag = document.createElement('div');
  tag.style.cssText = 'position:absolute;right:max(16px,3vw);top:max(16px,3vh);font:600 11px/1 Inter,sans-serif;letter-spacing:.18em;color:#F2EDE8;border:1px solid rgba(242,237,232,.7);padding:7px 10px;border-radius:2px;background:rgba(26,23,32,.55);opacity:0;text-transform:uppercase';
  tag.textContent = `Real 360° photo · ${P.title}`; ctx.hud.appendChild(tag);
  return {
    ...P, z,
    // rig keyframe that puts the camera exactly on the photo's spot, looking along heading/pitch
    key: (t, heading, pitch = -4, fov = 62) => [t, P.at[0], P.at[1], z, 0.01, heading, pitch, fov],
    set(op) {
      p.mesh.visible = op > 0.002; p.mesh.position.copy(ctx.camera.position);
      p.mat.uniforms.uOpacity.value = op; panoState.op = Math.max(panoState.op, op);
      const b = ctx.bufferSize(); p.mat.uniforms.uRes.value.set(b.x, b.y);
      tag.style.opacity = String(Math.min(1, Math.max(0, (op - 0.6) / 0.3)));
    },
  };
}

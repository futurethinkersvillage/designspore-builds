// Reference chapter (not part of the film): shows the contract every js/chapters/chNN.js follows. See CHAPTERS.md.
export const meta = {
  id: '_example', title: 'Example — the gazebo', seconds: 12,   // seconds = clip length when recorded
  animated: false,                                                  // true if it must redraw every frame (water, flicker)
};

let rig, cap;
export async function setup(ctx) {
  const { rig: R, placeModel, PANO, heightAt } = ctx;
  await placeModel('gazebo');            // detailed model on its real footprint (meta.place)
  ctx.blocks.visible = false;              // the simple extruded footprints of everything else
  const g = [-569.6, -225.1], h = heightAt(g[0], g[1]);
  // [t, target east, north, height above H0, frame height m (0 = camera AT target), heading°, pitch°, fov°]
  rig = R.makeRig([
    [0.0, g[0], g[1], h + 4, 260, 140, -32, 45],
    [1.0, g[0], g[1], h + 4, 90, 200, -18, 45],
  ]);
  cap = document.createElement('div'); cap.className = 'cap';
  cap.innerHTML = '<div class="eyebrow">Example</div><h1>The gazebo</h1>';
  cap.querySelector('.eyebrow').insertAdjacentHTML('afterbegin', ctx.markImg(40));
  ctx.hud.appendChild(cap);
}

export function update(t, ctx) {
  rig.apply(ctx.camera, t);
  cap.style.opacity = ctx.rig.seg(t, 0.2, 0.35) - ctx.rig.seg(t, 0.85, 0.95);
}

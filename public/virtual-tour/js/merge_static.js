// Draw calls: the film drew about 3,000 per frame, mostly small parts of models far from the camera. Parts of a model that share a material and never move
// separately become one mesh. The models keep their place, and anything named or hidden stays as it is (chapters look those up: picnic tables, for one).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const KEEP_NAMES = new Set(['picnic_table']);
// split = the name of a group whose children each merge on their own (so they can still move separately, e.g. the maker space's kit)
export function mergeStatic(root, keepParts, split) {
  root.updateWorldMatrix(true, true);
  // the review layer names what was clicked: the part names and boxes are kept before the merge removes them
  if (keepParts) { root.userData.parts = []; root.traverse(o => { if (o === root || !(o.name || o.parent === root)) return; const box = new THREE.Box3().setFromObject(o); if (!box.isEmpty() && (o.name || root.children.length > 1)) root.userData.parts.push({ name: o.name || `${root.name || 'part'} ${root.children.indexOf(o) + 1}`, box }); }); }
  const groups = new Map();
  root.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || Array.isArray(o.material) || o.children.length || o.onBeforeRender !== THREE.Object3D.prototype.onBeforeRender) return;
    const g = o.geometry; if (!g?.attributes?.position || g.morphAttributes?.position || o.matrixWorld.determinant() < 0) return;
    for (let a = o; a && a !== root; a = a.parent) if (!a.visible || KEEP_NAMES.has(a.name)) return;
    let bucket = root; for (let a = o.parent; a && a !== root; a = a.parent) if (a.parent?.name === split && split) { bucket = a; break; } else if (a.name === split && split) { bucket = a; break; }
    o.userData._bucket = bucket;
    const key = [bucket.uuid, o.material.uuid, o.renderOrder, o.castShadow, o.receiveShadow, o.layers.mask, o.frustumCulled, !!g.index, Object.entries(g.attributes).map(([k, v]) => `${k}${v.itemSize}${v.normalized}${v.array.constructor.name}`).sort().join(), JSON.stringify({ ...o.userData, _bucket: undefined })].join('|');
    (groups.get(key) ?? groups.set(key, []).get(key)).push(o);
  });
  let before = 0, after = 0; const m = new THREE.Matrix4();
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const bucket = list[0].userData._bucket, inv = bucket.matrixWorld.clone().invert();
    const merged = mergeGeometries(list.map(o => { const g = o.geometry.clone(); g.groups = []; return g.applyMatrix4(m.multiplyMatrices(inv, o.matrixWorld)); }), false);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, list[0].material); mesh.renderOrder = list[0].renderOrder; mesh.castShadow = list[0].castShadow; mesh.receiveShadow = list[0].receiveShadow; mesh.frustumCulled = list[0].frustumCulled; mesh.layers.mask = list[0].layers.mask; mesh.userData = { ...list[0].userData }; mesh.name = 'merged';
    list.forEach(o => { delete o.userData._bucket; o.removeFromParent(); }); bucket.add(mesh); delete mesh.userData._bucket;
    before += list.length; after++;
  }
  return [before, after];
}

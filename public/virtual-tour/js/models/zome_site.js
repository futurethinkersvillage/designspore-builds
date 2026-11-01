// The film's planned zome sites, using the real Trillium types (zome_types.js) instead of one model everywhere (Mike 10-31:
// "the zomes should vary in size"). variant = a plan id from zome_plans.js. Clad zomes carry their plan's windows; only clear
// ones get an interior, since it's the only one you can see into. Geometry is shared per plan. All planned; none exist yet.
import { build as buildType, setDusk, TYPES } from './zome_types.js';
import { planById } from './zome_plans.js';

export const meta = { name: 'Zome site (planned)', footprint: [10, 10], height: 6, notes: 'Origin = floor centre at ground level, door faces +Z.' };

const cache = new Map();
export function build({ lod = 'high', variant = 'z6-onebed' } = {}) {
  const key = variant + lod;
  if (!cache.has(key)) {
    setDusk(false);
    const plan = planById(variant), o = { type: plan.type, door: plan.door, finish: 'slate', glass: plan.glass || null, glaze: plan.glaze || [], sky: !!plan.sky, plan: plan.glass ? plan : null, lod };
    const g = buildType(o); g.userData.baseOut = TYPES[plan.type].printed.baseOut; cache.set(key, g);
  }
  const src = cache.get(key), g = src.clone(); g.userData.baseOut = src.userData.baseOut; g.userData.plan = variant;
  return g;
}

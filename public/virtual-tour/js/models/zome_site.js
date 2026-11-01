// One planned zome of the village: variant = 'plan id|finish|tour' (data/village.json). Real Trillium types from zome_types.js. Clear zomes and
// the ones the camera walks into carry their interior and an open door; the rest carry just their plan's windows. Geometry is shared per variant.
import { build as buildType, setDusk, TYPES } from './zome_types.js';
import { planById } from './zome_plans.js';

export const meta = { name: 'Zome site (planned)', footprint: [10, 10], height: 6, notes: 'Origin = floor centre at ground level, door faces +Z.' };

const cache = new Map();
export function build({ lod = 'high', variant = 'z6-onebed|slate|0' } = {}) {
  const key = variant + lod;
  if (!cache.has(key)) {
    setDusk(false);
    const [id, finish, tour] = variant.split('|'), plan = planById(id), inside = plan.glass || tour === '1';
    const g = buildType({ type: plan.type, door: plan.door, finish: finish === 'clear' ? 'cedar' : finish, glass: plan.glass || null, glaze: plan.glaze || [], sky: !!plan.sky, plan: inside ? plan : null, lod, doorOpen: tour === '1' });
    g.userData.baseOut = TYPES[plan.type].printed.baseOut; cache.set(key, g);
  }
  const src = cache.get(key), g = src.clone(); g.userData.baseOut = src.userData.baseOut; g.userData.plan = variant;
  return g;
}

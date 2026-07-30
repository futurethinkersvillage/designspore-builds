import type { Equipment, MapSite, SiteState } from './types'

/**
 * Extra pad width a rig needs once slide-outs are out. Slide-outs are why
 * length alone is not a sufficient fit test — this is the detail Campspot
 * models and most booking engines miss.
 */
const SLIDE_WIDTH_FT: Record<Equipment['slideOuts'], number> = {
  none: 0,
  driver: 4,
  passenger: 4,
  both: 8,
}

/** Rigs a non-serviced / small site realistically can't take. */
const BIG_RIGS = new Set(['fifth-wheel', 'motorhome'])

export function fitsSite(site: MapSite, eq: Equipment): { ok: boolean; reason?: string } {
  if (eq.lengthFt && site.max_rv_length_ft && eq.lengthFt > site.max_rv_length_ft) {
    return { ok: false, reason: `Too short — this site takes ${Math.floor(site.max_rv_length_ft)} ft` }
  }
  const needed = 8 + SLIDE_WIDTH_FT[eq.slideOuts]
  if (eq.slideOuts !== 'none' && site.width_ft && needed > site.width_ft) {
    return { ok: false, reason: `Too narrow for ${eq.slideOuts === 'both' ? 'both slide-outs' : 'a slide-out'}` }
  }
  if (eq.type && BIG_RIGS.has(eq.type) && site.group === 'regular') {
    return { ok: false, reason: 'Non-serviced field sites don’t take big rigs' }
  }
  return { ok: true }
}

export function siteState(
  site: MapSite,
  occupied: Set<number>,
  eq: Equipment,
  selected: number | null,
): SiteState {
  if (selected === site.site_number) return 'selected'
  if (!site.bookable_by_number) return 'not-bookable'
  if (occupied.has(site.site_number)) return 'occupied'
  return fitsSite(site, eq).ok ? 'available' : 'too-short'
}

/**
 * Campspot's ordering, which is worth copying: sites you can actually book
 * float to the top, but nothing is hidden — an empty list reads as broken,
 * whereas a list with greyed rows reads as informative.
 */
export function sortForDisplay(
  sites: MapSite[],
  occupied: Set<number>,
  eq: Equipment,
): MapSite[] {
  const rank = (s: MapSite) => {
    const st = siteState(s, occupied, eq, null)
    return st === 'available' ? 0 : st === 'too-short' ? 1 : st === 'occupied' ? 2 : 3
  }
  return [...sites].sort((a, b) => rank(a) - rank(b) || a.site_number - b.site_number)
}

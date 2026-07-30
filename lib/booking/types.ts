/** Shared booking types. The journey is category-first, specific-site-second. */

export type CategoryKind = 'rv' | 'tent' | 'lodging' | 'other'

export interface Category {
  slug: string
  name: string
  kind: CategoryKind
  blurb: string
  checkfront_category_id: number
  amenities: string[]
  from_price: number | null
  site_count: number
  /** True when the guest chooses an actual numbered site; false = we assign one. */
  picks_specific_site: boolean
  max_length_ft: number | null
  min_length_ft: number | null
  sites: number[]
  pooled_items: { item_id: number; name: string; stock: number | null }[]
}

export interface Addon {
  item_id: number
  name: string
  group: string
  checkfront_category_id: number
}

export interface Catalog {
  generated_from: string
  note: string
  categories: Category[]
  addons: Addon[]
}

export interface MapSite {
  site_number: number
  group: string
  label: string
  checkfront_item_id: number | null
  checkfront_name: string | null
  bookable_by_number: boolean
  max_rv_length_ft: number | null
  width_ft: number | null
  polygon: [number, number][]
  centroid_px: [number, number]
}

export interface SiteMapData {
  image: { width: number; height: number; full: string; half: string }
  sites: MapSite[]
}

/**
 * Equipment constrains which sites are genuinely usable. Length alone isn't
 * enough — a 32ft trailer with both-side slide-outs needs a wider pad than a
 * 32ft van, and some sites won't take a motorhome at all.
 */
export type EquipmentType =
  | 'tent' | 'van' | 'truck-camper' | 'pop-up'
  | 'travel-trailer' | 'fifth-wheel' | 'motorhome'

export type SlideOuts = 'none' | 'driver' | 'passenger' | 'both'

export interface Equipment {
  type: EquipmentType | null
  lengthFt: number | null
  slideOuts: SlideOuts
}

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  tent: 'Tent',
  van: 'Van / car camper',
  'truck-camper': 'Truck camper',
  'pop-up': 'Pop-up trailer',
  'travel-trailer': 'Travel trailer',
  'fifth-wheel': 'Fifth wheel',
  motorhome: 'Motorhome',
}

export const SLIDE_LABELS: Record<SlideOuts, string> = {
  none: 'None',
  driver: 'Driver side',
  passenger: 'Passenger side',
  both: 'Both sides',
}

/** Why a site is or isn't selectable. Drives colour, sort order and copy. */
export type SiteState = 'available' | 'too-short' | 'occupied' | 'not-bookable' | 'selected'

export interface Search {
  from: string | null   // ISO date
  to: string | null
  guests: number
}

export function nights(from: string | null, to: string | null): number {
  if (!from || !to) return 0
  const a = Date.parse(from + 'T00:00:00')
  const b = Date.parse(to + 'T00:00:00')
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return 0
  return Math.round((b - a) / 86_400_000)
}

export function fmtDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
}

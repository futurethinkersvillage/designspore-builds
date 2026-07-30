/**
 * Availability. Pure: takes the world as data, returns what's bookable.
 *
 * Date ranges are half-open [arrives, departs). A stay ending on the 16th does
 * NOT block a booking arriving on the 16th — turnover days are bookable. This
 * is the single easiest thing to get wrong here and it silently hides free
 * inventory on every changeover day.
 */

export interface Unit {
  id: string
  categoryId: string
  label: string
  capacity: number
  maxLengthFt?: number | null
  widthFt?: number | null
  allowsSlideOuts?: boolean
  allowedRigTypes?: string[] | null
  active?: boolean
}

export interface Occupancy {
  unitId: string
  arrivesOn: string
  departsOn: string
  /** Locked stays cannot be moved by the optimiser. */
  locked?: boolean
  reservationId?: string
}

export interface Block {
  unitId: string
  startsOn: string
  endsOn: string
  reason?: string
}

export interface Rig {
  type?: string | null
  lengthFt?: number | null
  slideOuts?: 'none' | 'driver' | 'passenger' | 'both'
}

export type UnavailableReason =
  | 'occupied' | 'blocked' | 'too-short' | 'too-narrow' | 'rig-not-allowed' | 'inactive'

export interface UnitAvailability {
  unit: Unit
  available: boolean
  reason?: UnavailableReason
  detail?: string
}

/** Extra pad width needed once slide-outs are extended. */
const SLIDE_WIDTH_FT: Record<NonNullable<Rig['slideOuts']>, number> = {
  none: 0, driver: 3, passenger: 3, both: 6,
}
const RIG_BODY_WIDTH_FT = 8.5

export function overlaps(
  aStart: string, aEnd: string, bStart: string, bEnd: string,
): boolean {
  // Strict: touching endpoints do not overlap.
  return aStart < bEnd && aEnd > bStart
}

export function fitsRig(unit: Unit, rig: Rig): { ok: boolean; reason?: UnavailableReason; detail?: string } {
  if (rig.lengthFt && unit.maxLengthFt && rig.lengthFt > unit.maxLengthFt) {
    return {
      ok: false, reason: 'too-short',
      detail: `takes rigs up to ${Math.floor(unit.maxLengthFt)} ft`,
    }
  }
  const slides = rig.slideOuts ?? 'none'
  if (slides !== 'none') {
    if (unit.allowsSlideOuts === false) {
      return { ok: false, reason: 'too-narrow', detail: 'no room for slide-outs' }
    }
    const needed = RIG_BODY_WIDTH_FT + SLIDE_WIDTH_FT[slides]
    if (unit.widthFt && needed > unit.widthFt) {
      return {
        ok: false, reason: 'too-narrow',
        detail: `needs ${needed.toFixed(1)} ft, site is ${Math.floor(unit.widthFt)} ft`,
      }
    }
  }
  if (rig.type && unit.allowedRigTypes && !unit.allowedRigTypes.includes(rig.type)) {
    return { ok: false, reason: 'rig-not-allowed', detail: `doesn't take a ${rig.type}` }
  }
  return { ok: true }
}

export function availabilityFor(
  units: Unit[],
  arrivesOn: string,
  departsOn: string,
  opts: { occupancy?: Occupancy[]; blocks?: Block[]; rig?: Rig } = {},
): UnitAvailability[] {
  const occupancy = opts.occupancy ?? []
  const blocks = opts.blocks ?? []
  const rig = opts.rig ?? {}

  // Pooled units (capacity > 1) count concurrent stays rather than being binary.
  const used = new Map<string, number>()
  for (const o of occupancy) {
    if (overlaps(arrivesOn, departsOn, o.arrivesOn, o.departsOn)) {
      used.set(o.unitId, (used.get(o.unitId) ?? 0) + 1)
    }
  }

  return units.map<UnitAvailability>(unit => {
    if (unit.active === false) {
      return { unit, available: false, reason: 'inactive' }
    }
    const blocked = blocks.find(
      b => b.unitId === unit.id && overlaps(arrivesOn, departsOn, b.startsOn, b.endsOn),
    )
    if (blocked) {
      return { unit, available: false, reason: 'blocked', detail: blocked.reason }
    }
    if ((used.get(unit.id) ?? 0) >= unit.capacity) {
      return { unit, available: false, reason: 'occupied' }
    }
    const fit = fitsRig(unit, rig)
    if (!fit.ok) {
      return { unit, available: false, reason: fit.reason, detail: fit.detail }
    }
    return { unit, available: true }
  })
}

/**
 * Auto-assignment. The default when a guest doesn't pay to lock a site:
 * the system picks, staff can override, locked stays are immovable.
 *
 * Prefers the *smallest* unit that still fits, so a 20 ft van doesn't consume
 * the only 55 ft pad and block a big rig later. That's the whole point of grid
 * optimisation, in its simplest honest form.
 */
export function autoAssign(
  units: Unit[],
  arrivesOn: string,
  departsOn: string,
  opts: { occupancy?: Occupancy[]; blocks?: Block[]; rig?: Rig } = {},
): Unit | null {
  const free = availabilityFor(units, arrivesOn, departsOn, opts)
    .filter(a => a.available)
    .map(a => a.unit)

  if (free.length === 0) return null

  return free.reduce((best, u) => {
    const bl = best.maxLengthFt ?? Number.POSITIVE_INFINITY
    const ul = u.maxLengthFt ?? Number.POSITIVE_INFINITY
    if (ul !== bl) return ul < bl ? u : best
    return u.label.localeCompare(best.label, undefined, { numeric: true }) < 0 ? u : best
  })
}

/** Sort for display: bookable first, everything else visible but demoted. */
export function sortForDisplay(rows: UnitAvailability[]): UnitAvailability[] {
  const rank = (r: UnitAvailability) =>
    r.available ? 0
    : r.reason === 'too-short' || r.reason === 'too-narrow' || r.reason === 'rig-not-allowed' ? 1
    : r.reason === 'occupied' ? 2
    : 3
  return [...rows].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      a.unit.label.localeCompare(b.unit.label, undefined, { numeric: true }),
  )
}

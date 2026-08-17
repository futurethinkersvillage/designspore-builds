import { query } from '@/lib/db'
import type { Occupancy, Unit } from '@/lib/engine/availability'

/**
 * Read side of the booking engine. Everything here returns plain data that the
 * pure engine in lib/engine consumes — no business logic lives in SQL.
 */

export interface DbCategory {
  id: string
  slug: string
  name: string
  kind: 'rv' | 'tent' | 'lodging' | 'activity' | 'program' | 'other'
  blurb: string | null
  picksSpecificUnit: boolean
  sortOrder: number
  baseCents: number | null
  unitCount: number
  capacity: number
  maxLengthFt: number | null
}

export async function listCategories(): Promise<DbCategory[]> {
  const rows = await query<Record<string, unknown>>(`
    SELECT c.id, c.slug, c.name, c.kind, c.blurb,
           c.picks_specific_unit, c.sort_order,
           r.base_cents,
           COUNT(u.id)                        AS unit_count,
           COALESCE(SUM(u.capacity), 0)       AS capacity,
           MAX(u.max_length_ft)               AS max_length_ft
      FROM unit_categories c
      LEFT JOIN inventory_units u ON u.category_id = c.id AND u.active
      LEFT JOIN LATERAL (
        SELECT base_cents FROM rate_plans
         WHERE category_id = c.id AND active
         ORDER BY priority DESC LIMIT 1
      ) r ON TRUE
     WHERE c.active
     GROUP BY c.id, r.base_cents
     ORDER BY c.sort_order
  `)
  return rows.map(r => ({
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    kind: r.kind as DbCategory['kind'],
    blurb: (r.blurb as string) ?? null,
    picksSpecificUnit: Boolean(r.picks_specific_unit),
    sortOrder: Number(r.sort_order),
    baseCents: r.base_cents == null ? null : Number(r.base_cents),
    unitCount: Number(r.unit_count),
    capacity: Number(r.capacity),
    maxLengthFt: r.max_length_ft == null ? null : Number(r.max_length_ft),
  }))
}

export interface DbUnit extends Unit {
  mapPolygon: [number, number][] | null
  mapCentroid: [number, number] | null
  amenities: string[]
}

export async function listUnits(categorySlug?: string): Promise<DbUnit[]> {
  const rows = await query<Record<string, unknown>>(`
    SELECT u.id, u.category_id, u.label, u.capacity,
           u.max_length_ft, u.width_ft, u.allows_slide_outs,
           u.allowed_rig_types, u.amenities, u.map_polygon, u.map_centroid, u.active
      FROM inventory_units u
      JOIN unit_categories c ON c.id = u.category_id
     WHERE u.active AND ($1::text IS NULL OR c.slug = $1)
     ORDER BY u.label
  `, [categorySlug ?? null])

  return rows.map(r => ({
    id: String(r.id),
    categoryId: String(r.category_id),
    label: String(r.label),
    capacity: Number(r.capacity),
    maxLengthFt: r.max_length_ft == null ? null : Number(r.max_length_ft),
    widthFt: r.width_ft == null ? null : Number(r.width_ft),
    allowsSlideOuts: r.allows_slide_outs !== false,
    allowedRigTypes: (r.allowed_rig_types as string[] | null) ?? null,
    active: r.active !== false,
    amenities: (r.amenities as string[]) ?? [],
    mapPolygon: (r.map_polygon as [number, number][] | null) ?? null,
    mapCentroid: (r.map_centroid as [number, number] | null) ?? null,
  }))
}

/**
 * Confirmed stays overlapping [arrives, departs). Half-open on purpose: a stay
 * ending on the arrival date does not conflict, so turnover days stay bookable.
 * `&&` on the generated DATERANGE gets exactly that semantics for free.
 */
export async function occupancyFor(
  arrivesOn: string,
  departsOn: string,
): Promise<Occupancy[]> {
  const rows = await query<Record<string, unknown>>(`
    SELECT ru.unit_id, ru.arrives_on, ru.departs_on,
           r.id AS reservation_id, r.site_locked
      FROM reservation_units ru
      JOIN reservations r ON r.id = ru.reservation_id
     WHERE r.status NOT IN ('cancelled', 'no_show')
       AND ru.stay && daterange($1::date, $2::date, '[)')
  `, [arrivesOn, departsOn])

  return rows.map(r => ({
    unitId: String(r.unit_id),
    arrivesOn: iso(r.arrives_on),
    departsOn: iso(r.departs_on),
    locked: Boolean(r.site_locked),
    reservationId: String(r.reservation_id),
  }))
}

export async function blocksFor(arrivesOn: string, departsOn: string) {
  const rows = await query<Record<string, unknown>>(`
    SELECT unit_id, starts_on, ends_on, reason
      FROM unit_blocks
     WHERE stay && daterange($1::date, $2::date, '[)')
  `, [arrivesOn, departsOn])

  return rows.map(r => ({
    unitId: String(r.unit_id),
    startsOn: iso(r.starts_on),
    endsOn: iso(r.ends_on),
    reason: (r.reason as string) ?? undefined,
  }))
}

export async function activeTaxes() {
  const rows = await query<Record<string, unknown>>(`
    SELECT code, name, percent, exempt_after_nights
      FROM tax_rates WHERE active ORDER BY code
  `)
  return rows.map(r => ({
    code: String(r.code),
    name: String(r.name),
    percent: Number(r.percent),
    exemptAfterNights: r.exempt_after_nights == null ? undefined : Number(r.exempt_after_nights),
  }))
}

export async function ratePlansFor(categorySlug: string) {
  const rows = await query<Record<string, unknown>>(`
    SELECT p.name, p.base_cents, p.weekday_mask, p.starts_on, p.ends_on, p.priority
      FROM rate_plans p
      JOIN unit_categories c ON c.id = p.category_id
     WHERE p.active AND c.slug = $1
     ORDER BY p.priority DESC
  `, [categorySlug])

  return rows.map(r => ({
    name: String(r.name),
    baseCents: Number(r.base_cents),
    weekdays: decodeWeekdays(r.weekday_mask as number | null),
    startsOn: r.starts_on ? iso(r.starts_on) : undefined,
    endsOn: r.ends_on ? iso(r.ends_on) : undefined,
    priority: Number(r.priority ?? 0),
  }))
}

/** Bitmask where bit 0 = Sunday. Null means every day. */
function decodeWeekdays(mask: number | null): number[] | undefined {
  if (mask == null) return undefined
  const days = [0, 1, 2, 3, 4, 5, 6].filter(d => (mask & (1 << d)) !== 0)
  return days.length === 7 ? undefined : days
}

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

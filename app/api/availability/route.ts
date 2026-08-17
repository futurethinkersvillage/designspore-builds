import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db'
import { availabilityFor, autoAssign, sortForDisplay, type Rig } from '@/lib/engine/availability'
import { quote } from '@/lib/engine/pricing'
import {
  activeTaxes, blocksFor, listUnits, occupancyFor, ratePlansFor,
} from '@/lib/repo/inventory'

export const dynamic = 'force-dynamic'

/**
 * GET /api/availability?category=creekside-rv&from=2026-08-14&to=2026-08-16
 *                      &rigType=travel-trailer&rigLength=32&slideOuts=both&guests=2
 *
 * Reads inventory from the database, then runs the pure engine over it. All
 * the judgement lives in lib/engine; this route only marshals data.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')

  if (!category || !from || !to) {
    return NextResponse.json(
      { error: 'category, from and to are required' },
      { status: 400 },
    )
  }
  if (to <= from) {
    return NextResponse.json({ error: 'to must be after from' }, { status: 400 })
  }

  if (!isDbConfigured()) {
    // The static snapshot in /public/booking still serves the page; say so
    // plainly rather than pretending this is live data.
    return NextResponse.json(
      { error: 'database not configured', source: 'none' },
      { status: 503 },
    )
  }

  const rig: Rig = {
    type: url.searchParams.get('rigType'),
    lengthFt: numberOrNull(url.searchParams.get('rigLength')),
    slideOuts: (url.searchParams.get('slideOuts') as Rig['slideOuts']) ?? 'none',
  }
  const guests = Number(url.searchParams.get('guests') ?? 2)

  try {
    const [units, occupancy, blocks, taxes, ratePlans] = await Promise.all([
      listUnits(category),
      occupancyFor(from, to),
      blocksFor(from, to),
      activeTaxes(),
      ratePlansFor(category),
    ])

    if (units.length === 0) {
      return NextResponse.json({ error: `unknown category ${category}` }, { status: 404 })
    }

    const rows = sortForDisplay(availabilityFor(units, from, to, { occupancy, blocks, rig }))
    const suggested = autoAssign(units, from, to, { occupancy, blocks, rig })

    const priced = ratePlans.length
      ? quote({ arrivesOn: from, departsOn: to, guests, ratePlans, taxes })
      : null

    return NextResponse.json({
      source: 'database',
      category,
      from,
      to,
      availableCount: rows.filter(r => r.available).length,
      totalCount: rows.length,
      // The whole list, never just the bookable ones — an empty list reads as
      // broken, whereas a list with reasons reads as informative.
      units: rows.map(r => ({
        id: r.unit.id,
        label: r.unit.label,
        available: r.available,
        reason: r.reason ?? null,
        detail: r.detail ?? null,
        maxLengthFt: r.unit.maxLengthFt ?? null,
        widthFt: r.unit.widthFt ?? null,
        capacity: r.unit.capacity,
      })),
      suggestedUnit: suggested ? { id: suggested.id, label: suggested.label } : null,
      quote: priced && {
        nights: priced.nightCount,
        accommodationCents: priced.accommodationCents,
        taxCents: priced.taxCents,
        totalCents: priced.totalCents,
        warnings: priced.warnings,
      },
    })
  } catch (err) {
    console.error('[availability]', err)
    return NextResponse.json(
      { error: 'availability lookup failed', source: 'error' },
      { status: 500 },
    )
  }
}

function numberOrNull(v: string | null): number | null {
  if (!v) return null
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : null
}

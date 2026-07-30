import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  autoAssign, availabilityFor, fitsRig, overlaps, sortForDisplay, type Unit,
} from '../availability'

const unit = (over: Partial<Unit> & { id: string; label: string }): Unit => ({
  categoryId: 'creekside', capacity: 1, active: true, ...over,
})

const UNITS: Unit[] = [
  unit({ id: 'u101', label: '101', maxLengthFt: 32, widthFt: 20 }),
  unit({ id: 'u107', label: '107', maxLengthFt: 40, widthFt: 24 }),
  unit({ id: 'u125', label: '125', maxLengthFt: 55, widthFt: 31 }),
]

describe('overlaps — half-open ranges', () => {
  it('treats a turnover day as free', () => {
    // Prior stay 12th→16th must NOT block a 16th arrival.
    assert.equal(overlaps('2026-08-16', '2026-08-18', '2026-08-12', '2026-08-16'), false)
  })

  it('treats a departure onto an existing arrival as free', () => {
    assert.equal(overlaps('2026-08-10', '2026-08-12', '2026-08-12', '2026-08-14'), false)
  })

  it('detects a genuine overlap', () => {
    assert.equal(overlaps('2026-08-15', '2026-08-18', '2026-08-12', '2026-08-16'), true)
  })

  it('detects full containment in both directions', () => {
    assert.equal(overlaps('2026-08-13', '2026-08-14', '2026-08-12', '2026-08-16'), true)
    assert.equal(overlaps('2026-08-01', '2026-09-01', '2026-08-12', '2026-08-16'), true)
  })
})

describe('fitsRig', () => {
  it('rejects a rig longer than the pad', () => {
    const r = fitsRig(UNITS[0], { lengthFt: 40 })
    assert.equal(r.ok, false)
    assert.equal(r.reason, 'too-short')
  })

  it('accepts a rig exactly the length of the pad', () => {
    assert.equal(fitsRig(UNITS[1], { lengthFt: 40 }).ok, true)
  })

  it('rejects both-side slide-outs on a narrow pad', () => {
    // 8.5ft body + 6ft slides = 14.5ft needed.
    assert.equal(fitsRig(unit({ id: 'n', label: 'n', widthFt: 12 }), { slideOuts: 'both' }).ok, false)
    assert.equal(fitsRig(unit({ id: 'w', label: 'w', widthFt: 20 }), { slideOuts: 'both' }).ok, true)
  })

  it('honours an explicit no-slide-outs unit', () => {
    const u = unit({ id: 'x', label: 'x', widthFt: 40, allowsSlideOuts: false })
    assert.equal(fitsRig(u, { slideOuts: 'driver' }).ok, false)
    assert.equal(fitsRig(u, { slideOuts: 'none' }).ok, true)
  })

  it('rejects rig types a unit does not accept', () => {
    const u = unit({ id: 't', label: 't', allowedRigTypes: ['tent', 'van'] })
    assert.equal(fitsRig(u, { type: 'motorhome' }).ok, false)
    assert.equal(fitsRig(u, { type: 'van' }).ok, true)
  })

  it('passes when the guest has told us nothing', () => {
    assert.equal(fitsRig(UNITS[0], {}).ok, true)
  })
})

describe('availabilityFor', () => {
  it('frees a unit on the day the prior stay departs', () => {
    const rows = availabilityFor(UNITS, '2026-08-16', '2026-08-18', {
      occupancy: [{ unitId: 'u101', arrivesOn: '2026-08-12', departsOn: '2026-08-16' }],
    })
    assert.equal(rows.find(r => r.unit.id === 'u101')!.available, true)
  })

  it('marks a genuinely occupied unit unavailable', () => {
    const rows = availabilityFor(UNITS, '2026-08-15', '2026-08-17', {
      occupancy: [{ unitId: 'u101', arrivesOn: '2026-08-12', departsOn: '2026-08-16' }],
    })
    const row = rows.find(r => r.unit.id === 'u101')!
    assert.equal(row.available, false)
    assert.equal(row.reason, 'occupied')
  })

  it('respects maintenance blocks', () => {
    const rows = availabilityFor(UNITS, '2026-08-15', '2026-08-17', {
      blocks: [{ unitId: 'u107', startsOn: '2026-08-14', endsOn: '2026-08-20', reason: 'septic' }],
    })
    const row = rows.find(r => r.unit.id === 'u107')!
    assert.equal(row.available, false)
    assert.equal(row.reason, 'blocked')
    assert.equal(row.detail, 'septic')
  })

  it('allows concurrent stays on pooled inventory up to capacity', () => {
    const field = [unit({ id: 'field', label: 'Tenting field', capacity: 3 })]
    const two = availabilityFor(field, '2026-08-15', '2026-08-17', {
      occupancy: [
        { unitId: 'field', arrivesOn: '2026-08-14', departsOn: '2026-08-18' },
        { unitId: 'field', arrivesOn: '2026-08-15', departsOn: '2026-08-16' },
      ],
    })
    assert.equal(two[0].available, true, '2 of 3 taken — still bookable')

    const full = availabilityFor(field, '2026-08-15', '2026-08-17', {
      occupancy: [1, 2, 3].map(() => ({
        unitId: 'field', arrivesOn: '2026-08-14', departsOn: '2026-08-18',
      })),
    })
    assert.equal(full[0].available, false)
    assert.equal(full[0].reason, 'occupied')
  })

  it('excludes inactive units', () => {
    const rows = availabilityFor([unit({ id: 'z', label: 'z', active: false })], '2026-08-15', '2026-08-17')
    assert.equal(rows[0].available, false)
    assert.equal(rows[0].reason, 'inactive')
  })

  it('never offers a unit that cannot take the rig', () => {
    const rows = availabilityFor(UNITS, '2026-08-15', '2026-08-17', { rig: { lengthFt: 45 } })
    for (const row of rows) {
      if (row.available) {
        assert.ok(
          (row.unit.maxLengthFt ?? Infinity) >= 45,
          `unit ${row.unit.label} offered to a 45ft rig but is ${row.unit.maxLengthFt}ft`,
        )
      }
    }
    assert.equal(rows.filter(r => r.available).length, 1)
  })
})

describe('autoAssign', () => {
  it('picks the smallest unit that fits, preserving big pads for big rigs', () => {
    const chosen = autoAssign(UNITS, '2026-08-15', '2026-08-17', { rig: { lengthFt: 30 } })
    assert.equal(chosen?.label, '101')
  })

  it('escalates to a larger unit when the small ones do not fit', () => {
    const chosen = autoAssign(UNITS, '2026-08-15', '2026-08-17', { rig: { lengthFt: 45 } })
    assert.equal(chosen?.label, '125')
  })

  it('skips occupied units', () => {
    const chosen = autoAssign(UNITS, '2026-08-15', '2026-08-17', {
      rig: { lengthFt: 30 },
      occupancy: [{ unitId: 'u101', arrivesOn: '2026-08-14', departsOn: '2026-08-18' }],
    })
    assert.equal(chosen?.label, '107')
  })

  it('returns null when nothing fits rather than guessing', () => {
    assert.equal(autoAssign(UNITS, '2026-08-15', '2026-08-17', { rig: { lengthFt: 60 } }), null)
  })
})

describe('sortForDisplay', () => {
  it('promotes bookable units but keeps everything visible', () => {
    const rows = availabilityFor(UNITS, '2026-08-15', '2026-08-17', {
      rig: { lengthFt: 45 },
      occupancy: [{ unitId: 'u107', arrivesOn: '2026-08-14', departsOn: '2026-08-18' }],
    })
    const sorted = sortForDisplay(rows)
    assert.equal(sorted.length, 3, 'nothing is hidden')
    assert.equal(sorted[0].available, true)
    assert.equal(sorted[0].unit.label, '125')
  })
})

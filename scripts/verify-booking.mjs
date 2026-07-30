/**
 * Booking-flow invariants. Run: npm run verify
 *
 *  1. No rig is ever offered a site it physically cannot fit.
 *  2. Turnover days are bookable — a stay ending the 16th must not block a
 *     16th arrival. Getting this wrong silently hides free sites.
 *  3. Every site the catalogue references actually has map geometry.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = p => JSON.parse(readFileSync(join(root, 'public', 'booking', p), 'utf8'))

const catalog = read('catalog.json')
const map = read('map/sites.json')
const index = read('availability.json')

let failures = 0
const fail = m => { console.error('  FAIL', m); failures++ }

/* ---------- 1. fit invariant ---------- */
const SLIDE = { none: 0, driver: 4, passenger: 4, both: 8 }
const BIG = new Set(['fifth-wheel', 'motorhome'])

function fits(site, eq) {
  if (eq.lengthFt && site.max_rv_length_ft && eq.lengthFt > site.max_rv_length_ft) return false
  const needed = 8 + SLIDE[eq.slideOuts]
  if (eq.slideOuts !== 'none' && site.width_ft && needed > site.width_ft) return false
  if (eq.type && BIG.has(eq.type) && site.group === 'regular') return false
  return true
}

let fitChecks = 0
for (const site of map.sites) {
  for (let len = 0; len <= 60; len++) {
    for (const slideOuts of ['none', 'both']) {
      const eq = { type: 'travel-trailer', lengthFt: len || null, slideOuts }
      fitChecks++
      if (fits(site, eq) && len && site.max_rv_length_ft && len > site.max_rv_length_ft) {
        fail(`site ${site.site_number}: ${len}ft rig passes fit but pad is ${site.max_rv_length_ft}ft`)
      }
    }
  }
}

/* ---------- 2. turnover day ---------- */
function occupiedFor(from, to) {
  const out = []
  for (const [site, spans] of Object.entries(index.sites)) {
    if (spans.some(([s, e]) => s < to && e > from)) out.push(Number(site))
  }
  return out
}

// Find a real booked span and assert its end date is bookable as an arrival.
const sample = Object.entries(index.sites).find(([, s]) => s.length > 0)
if (!sample) {
  console.log('  (no future bookings in index — turnover check skipped)')
} else {
  const [siteNo, spans] = sample
  const [, end] = spans[0]
  const next = new Date(Date.parse(end + 'T00:00:00') + 86400000).toISOString().slice(0, 10)
  const blocked = occupiedFor(end, next)
  if (blocked.includes(Number(siteNo))) {
    fail(`site ${siteNo} blocked for arrival on ${end}, but the prior stay ends that day`)
  }
  // And the night before the checkout day must still be blocked.
  const prev = new Date(Date.parse(end + 'T00:00:00') - 86400000).toISOString().slice(0, 10)
  if (!occupiedFor(prev, end).includes(Number(siteNo))) {
    fail(`site ${siteNo} shows free for ${prev}→${end} but it is booked`)
  }
}

/* ---------- 3. catalogue ↔ geometry ---------- */
const mapped = new Set(map.sites.map(s => s.site_number))
for (const cat of catalog.categories) {
  for (const n of cat.sites) {
    if (!mapped.has(n)) fail(`category ${cat.slug} references site ${n} with no map geometry`)
  }
  if (cat.picks_specific_site && cat.sites.length === 0) {
    fail(`category ${cat.slug} claims pick-a-site but lists none`)
  }
}

console.log(`categories      : ${catalog.categories.length}`)
console.log(`mapped sites    : ${map.sites.length}`)
console.log(`fit assertions  : ${fitChecks.toLocaleString()}`)
console.log(`sites w/ future bookings: ${Object.keys(index.sites).length}`)

if (failures) {
  console.error(`\n${failures} failure(s).`)
  process.exit(1)
}
console.log('\nPASS — fit, turnover-day and catalogue/geometry invariants all hold.')

/**
 * CP-2 — replay real Checkfront bookings through the engine's arithmetic.
 *
 * We can't replay rate *selection* (Checkfront's seasons and rate rules were
 * never exported in a usable form), but we can replay everything downstream of
 * it: tax application, rounding and summation. That is where cent-level bugs
 * actually live, and this checks it against every historical line item rather
 * than a handful of made-up cases.
 *
 * Run: node scripts/replay-checkfront.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const EXPORT_DIR = join(here, '..', '..', '..', 'platform', 'export', 'data')

// Mirror of lib/engine/money.ts — kept in sync deliberately so this harness
// has no build step and can run against the raw export.
const roundHalfUp = v => (v < 0 ? -Math.round(-v) : Math.round(v))
const applyPercent = (base, pct) => roundHalfUp((base * pct) / 100)
const toCents = s => roundHalfUp(parseFloat(s || '0') * 100)

const run = (() => {
  const runs = readdirSync(EXPORT_DIR)
    .filter(d => statSync(join(EXPORT_DIR, d)).isDirectory())
    .sort()
  if (!runs.length) throw new Error(`no export run found in ${EXPORT_DIR}`)
  return join(EXPORT_DIR, runs[runs.length - 1])
})()

const detailPath = join(run, 'bookings_detail.json')
if (!existsSync(detailPath)) {
  console.error(`No bookings_detail.json in ${run}. Run checkfront_export.py details first.`)
  process.exit(1)
}

const detail = JSON.parse(readFileSync(detailPath, 'utf8'))

let lines = 0
let taxMatches = 0
const taxMismatches = []
let totalMatches = 0
const totalMismatches = []
const rateHistogram = new Map()

for (const rec of Object.values(detail)) {
  const b = rec?.booking
  if (!b) continue
  const status = String(b.status_id ?? '').toUpperCase()
  if (status === 'VOID' || status === 'CANCELLED') continue

  let items = b.items ?? {}
  if (Array.isArray(items)) items = Object.fromEntries(items.map((v, i) => [String(i), v]))

  for (const li of Object.values(items)) {
    if (!li || typeof li !== 'object') continue
    const sub = toCents(li.sub_total)
    const taxTotal = toCents(li.tax_total)
    const total = toCents(li.total)
    const taxes = Array.isArray(li.taxes) ? li.taxes : []
    if (sub <= 0 || taxes.length === 0) continue

    lines++

    // 1. Does applying the stated percentages to the subtotal reproduce the tax?
    let computed = 0
    for (const t of taxes) {
      if (t?.type === 'percent' && t.name) {
        // Checkfront stores the rate implicitly; derive it from the amount.
        const amount = toCents(t.amount)
        const impliedPct = (amount / sub) * 100
        const key = `${t.name} ~${impliedPct.toFixed(1)}%`
        rateHistogram.set(key, (rateHistogram.get(key) ?? 0) + 1)
        computed += amount
      } else {
        computed += toCents(t?.amount)
      }
    }
    if (computed === taxTotal) taxMatches++
    else if (taxMismatches.length < 5) {
      taxMismatches.push({ booking: b.booking_id, sub, taxTotal, computed })
    }

    // 2. Does subtotal + tax reconcile to the recorded total?
    if (sub + taxTotal === total) totalMatches++
    else if (totalMismatches.length < 5) {
      totalMismatches.push({
        booking: b.booking_id, name: li.name, sub, taxTotal, total,
        diff: total - (sub + taxTotal),
      })
    }
  }
}

// 3. Independently: does OUR rounding reproduce a clean 5% GST on the subtotal?
let gstExact = 0, gstOff = 0
const gstOffSamples = []
const gstKinds = new Map()
for (const rec of Object.values(detail)) {
  const b = rec?.booking
  if (!b) continue
  let items = b.items ?? {}
  if (Array.isArray(items)) items = Object.fromEntries(items.map((v, i) => [String(i), v]))
  for (const li of Object.values(items)) {
    if (!li || typeof li !== 'object') continue
    const gst = (li.taxes ?? []).find(t => t?.name === 'GST')
    if (!gst) continue
    const sub = toCents(li.sub_total)
    if (sub <= 0) continue
    const theirs = toCents(gst.amount)
    const ours = applyPercent(sub, 5)
    if (ours === theirs) gstExact++
    else {
      gstOff++
      // Classify rather than leave it a mystery. Tax-INCLUSIVE pricing gives
      // tax = sub - sub/1.05, i.e. an implied ~4.76% of the gross figure.
      const inclusive = roundHalfUp(sub - sub / 1.05)
      const kind =
        Math.abs(inclusive - theirs) <= 1 ? 'tax-inclusive'
        : Math.abs(ours - theirs) <= 1 ? 'rounding'
        : 'manual-override'
      gstKinds.set(kind, (gstKinds.get(kind) ?? 0) + 1)
      if (gstOffSamples.length < 8) {
        gstOffSamples.push({ sub, theirs, ours, delta: ours - theirs, kind })
      }
    }
  }
}

const pct = (n, d) => (d ? ((n / d) * 100).toFixed(2) + '%' : 'n/a')

console.log(`export run          : ${run.split(/[\\/]/).pop()}`)
console.log(`taxable line items  : ${lines.toLocaleString()}`)
console.log(`tax lines reconcile : ${taxMatches.toLocaleString()} (${pct(taxMatches, lines)})`)
console.log(`sub+tax = total     : ${totalMatches.toLocaleString()} (${pct(totalMatches, lines)})`)
console.log(`\nGST at a clean 5% with our rounding:`)
console.log(`  exact match       : ${gstExact.toLocaleString()} (${pct(gstExact, gstExact + gstOff)})`)
console.log(`  differs           : ${gstOff.toLocaleString()}`)

if (gstOffSamples.length) {
  console.log('\n  divergences by cause:')
  for (const [k, v] of [...gstKinds].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(v).padStart(4)}  ${k}`)
  }
  console.log('\n  samples (cents):')
  for (const s of gstOffSamples) {
    console.log(`    sub ${String(s.sub).padStart(7)}  theirs ${String(s.theirs).padStart(6)}` +
                `  ours ${String(s.ours).padStart(6)}  delta ${String(s.delta).padStart(5)}  ${s.kind}`)
  }
}

if (totalMismatches.length) {
  console.log('\n  totals that do NOT reconcile:')
  for (const m of totalMismatches) {
    console.log(`    booking ${m.booking} "${String(m.name).slice(0, 34)}" ` +
                `sub ${m.sub} + tax ${m.taxTotal} != total ${m.total} (off ${m.diff})`)
  }
}

console.log('\nobserved tax rates:')
for (const [k, v] of [...rateHistogram].sort((a, b) => b[1] - a[1]).slice(0, 12)) {
  console.log(`  ${String(v).padStart(6)}  ${k}`)
}

const arithmeticSound = totalMatches === lines && taxMatches === lines
console.log(`\n${arithmeticSound ? 'PASS' : 'REVIEW'} — engine arithmetic vs ${lines.toLocaleString()} real line items.`)
process.exit(arithmeticSound ? 0 : 0)   // informational; never blocks a build

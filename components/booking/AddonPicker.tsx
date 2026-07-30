'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Addon, Category } from '@/lib/booking/types'

/** Indicative prices for display. The engine remains the pricing authority. */
const PRICE_HINTS: Record<string, number> = {
  'Firewood bundle': 12,
  'Ice': 5,
  'Sauna': 50,
  'Community Sauna Special': 25,
  'Golf 9 holes': 30,
  'Golf 18 holes': 45,
  'Golf Cart - 9 holes': 25,
  'Golf Cart - 18 Holes': 35,
  'Golf Cart - All Day': 45,
  'Disc Golf Game': 10,
  'Laundry - wash and dry': 8,
}

const GROUP_BLURB: Record<string, string> = {
  'Camp Store': 'Waiting at your site when you arrive.',
  Golf: 'Nine holes through forest and mountain views.',
  Sauna: 'Wood-fired, by the creek. Sessions fill up in the evening.',
}

/** Items that exist in Checkfront but shouldn't be sold in the guest flow. */
const HIDE = /gift certificate|season pass|round golf pass|misc|sani dump|extra tent/i

export default function AddonPicker({
  addons, category, nightsCount, from, to, guests, site,
}: {
  addons: Addon[]
  category: Category
  nightsCount: number
  from: string | null
  to: string | null
  guests: number
  site: string | null
}) {
  const [qty, setQty] = useState<Record<number, number>>({})

  const groups = useMemo(() => {
    const out: Record<string, Addon[]> = {}
    for (const a of addons) {
      if (HIDE.test(a.name)) continue
      ;(out[a.group] ??= []).push(a)
    }
    return out
  }, [addons])

  const total = useMemo(
    () =>
      Object.entries(qty).reduce((sum, [id, q]) => {
        const a = addons.find(x => x.item_id === Number(id))
        return sum + (a ? (PRICE_HINTS[a.name] ?? 0) * q : 0)
      }, 0),
    [qty, addons],
  )

  const stayTotal = (category.from_price ?? 0) * nightsCount
  const picked = Object.values(qty).filter(q => q > 0).length

  const qs = new URLSearchParams({
    from: from ?? '', to: to ?? '', guests: String(guests),
    ...(site ? { site } : {}),
    ...(picked ? { addons: Object.entries(qty).filter(([, q]) => q > 0).map(([id, q]) => `${id}:${q}`).join(',') } : {}),
  }).toString()

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-10 items-start">
      <div className="space-y-8 min-w-0">
        {Object.entries(groups).map(([group, items]) => (
          <section key={group}>
            <h2 className="font-display text-parchment text-xl">{group}</h2>
            {GROUP_BLURB[group] && (
              <p className="font-body text-parchment/50 text-sm mt-1">{GROUP_BLURB[group]}</p>
            )}
            <ul className="mt-4 divide-y divide-parchment/10 border border-parchment/15 rounded-lg overflow-hidden">
              {items.map(a => {
                const price = PRICE_HINTS[a.name]
                const q = qty[a.item_id] ?? 0
                return (
                  <li key={a.item_id} className="flex items-center gap-4 p-4 bg-parchment/[0.02]">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-parchment text-sm">{a.name}</p>
                      {price != null && (
                        <p className="font-body text-parchment/45 text-xs mt-0.5">${price} each</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Stepper
                        value={q}
                        onChange={v => setQty(s => ({ ...s, [a.item_id]: v }))}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      <aside className="lg:sticky lg:top-40 border border-parchment/15 rounded-lg bg-parchment/[0.03] p-5">
        <h2 className="font-body text-[11px] uppercase tracking-[0.18em] text-parchment/70 mb-4">
          Your stay
        </h2>
        <dl className="font-body text-sm space-y-1.5">
          <Row k={category.name} v={stayTotal ? `$${stayTotal}` : '—'} />
          {site && <Row k="Site" v={site} />}
          <Row k="Nights" v={String(nightsCount || '—')} />
          {picked > 0 && <Row k={`Extras (${picked})`} v={`$${total}`} />}
          <div className="flex justify-between pt-2 mt-2 border-t border-parchment/10">
            <dt className="text-parchment font-semibold">Subtotal</dt>
            <dd className="text-parchment font-semibold">${stayTotal + total}</dd>
          </div>
        </dl>
        <p className="font-body text-parchment/40 text-[11px] mt-2">
          Taxes calculated at checkout.
        </p>

        <Link
          href={`/book/${category.slug}/checkout?${qs}`}
          className={`btn-ember w-full justify-center mt-5 ${
            nightsCount === 0 ? 'pointer-events-none opacity-40' : ''
          }`}
        >
          Continue to checkout
        </Link>
      </aside>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-parchment/55 truncate">{k}</dt>
      <dd className="text-parchment shrink-0">{v}</dd>
    </div>
  )
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center border border-parchment/20 rounded">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        aria-label="Decrease"
        className="w-9 h-9 grid place-items-center text-parchment/70 hover:text-parchment
                   disabled:opacity-25 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-8 text-center font-body text-sm text-parchment tabular-nums">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        aria-label="Increase"
        className="w-9 h-9 grid place-items-center text-parchment/70 hover:text-parchment"
      >
        +
      </button>
    </div>
  )
}

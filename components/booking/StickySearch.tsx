'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { fmtDate, nights } from '@/lib/booking/types'

/**
 * Dates stay editable at every step of the funnel. Changing them should never
 * feel like starting over — that's the single biggest usability win in
 * Campspot's flow and it costs almost nothing to copy.
 */
export default function StickySearch({
  from, to, guests,
}: { from: string | null; to: string | null; guests: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [f, setF] = useState(from ?? '')
  const [t, setT] = useState(to ?? '')
  const [g, setG] = useState(guests)

  const n = nights(from, to)

  function apply() {
    if (!f || !t || t <= f) return
    setOpen(false)
    router.push(`${pathname}?from=${f}&to=${t}&guests=${g}`)
  }

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-bark/95 backdrop-blur-sm border-y border-parchment/10">
      <div className="container-content py-3">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full flex items-center justify-between gap-4 text-left group"
          >
            <span className="font-body text-sm text-parchment/80 truncate">
              {n > 0 ? (
                <>
                  <span className="text-parchment">{fmtDate(from)} → {fmtDate(to)}</span>
                  <span className="text-parchment/50">
                    {' '}· {n} {n === 1 ? 'night' : 'nights'} · {guests}{' '}
                    {guests === 1 ? 'guest' : 'guests'}
                  </span>
                </>
              ) : (
                <span className="text-parchment/60">Choose your dates</span>
              )}
            </span>
            <span className="font-body text-xs text-ember group-hover:underline shrink-0">
              Change
            </span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <label className="flex-1 block">
              <span className="block text-[10px] uppercase tracking-[0.15em] text-parchment/50 mb-1">
                Arrive
              </span>
              <input
                type="date" value={f} onChange={e => setF(e.target.value)}
                className="w-full bg-bark border border-parchment/15 rounded px-3 py-2
                           text-parchment font-body text-sm outline-none [color-scheme:dark]"
              />
            </label>
            <label className="flex-1 block">
              <span className="block text-[10px] uppercase tracking-[0.15em] text-parchment/50 mb-1">
                Depart
              </span>
              <input
                type="date" value={t} min={f} onChange={e => setT(e.target.value)}
                className="w-full bg-bark border border-parchment/15 rounded px-3 py-2
                           text-parchment font-body text-sm outline-none [color-scheme:dark]"
              />
            </label>
            <label className="sm:w-32 block">
              <span className="block text-[10px] uppercase tracking-[0.15em] text-parchment/50 mb-1">
                Guests
              </span>
              <select
                value={g} onChange={e => setG(Number(e.target.value))}
                className="w-full bg-bark border border-parchment/15 rounded px-3 py-2
                           text-parchment font-body text-sm outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(v => (
                  <option key={v} value={v} className="bg-bark text-parchment">{v}</option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <button onClick={apply} className="btn-ember">Update</button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-3 font-body text-sm text-parchment/60 hover:text-parchment"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

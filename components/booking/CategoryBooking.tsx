'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  EQUIPMENT_LABELS, SLIDE_LABELS, fmtDate, nights,
  type Category, type Equipment, type EquipmentType, type MapSite,
  type SiteMapData, type SlideOuts,
} from '@/lib/booking/types'
import { fitsSite, siteState, sortForDisplay } from '@/lib/booking/fit'

const SiteMap = dynamic(() => import('./SiteMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full grid place-items-center text-parchment/40 font-body text-sm">
      Loading map…
    </div>
  ),
})

interface Props {
  category: Category
  mapData: SiteMapData
  occupiedList: number[]
  from: string | null
  to: string | null
  guests: number
}

export default function CategoryBooking({
  category, mapData, occupiedList, from, to, guests,
}: Props) {
  const [equipment, setEquipment] = useState<Equipment>({
    type: null, lengthFt: null, slideOuts: 'none',
  })
  const [selected, setSelected] = useState<number | null>(null)
  const [view, setView] = useState<'map' | 'list'>('map')

  const occupied = useMemo(() => new Set(occupiedList), [occupiedList])
  const n = nights(from, to)
  const isRv = category.kind === 'rv'

  const mySites = useMemo(
    () => mapData.sites.filter(s => category.sites.includes(s.site_number)),
    [mapData.sites, category.sites],
  )
  const ordered = useMemo(
    () => sortForDisplay(mySites, occupied, equipment),
    [mySites, occupied, equipment],
  )

  const counts = useMemo(() => {
    let available = 0, blocked = 0
    for (const s of mySites) {
      const st = siteState(s, occupied, equipment, null)
      if (st === 'available') available++
      else blocked++
    }
    return { available, blocked }
  }, [mySites, occupied, equipment])

  const chosen = mySites.find(s => s.site_number === selected) ?? null
  const price = category.from_price ?? 0
  const subtotal = price * (n || 0)

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
      {/* ---------------- left: map + table ---------------- */}
      <div className="min-w-0">
        {category.picks_specific_site ? (
          <>
            <div className="flex items-center justify-between gap-4 mb-3">
              <h2 className="font-display text-parchment text-xl">
                Choose your site
                <span className="font-body text-sm text-parchment/45 ml-3">
                  {counts.available} available
                  {counts.blocked > 0 && ` · ${counts.blocked} unavailable`}
                </span>
              </h2>
              <div className="flex rounded border border-parchment/20 overflow-hidden shrink-0">
                {(['map', 'list'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 font-body text-xs capitalize transition-colors ${
                      view === v ? 'bg-parchment text-bark' : 'text-parchment/60 hover:text-parchment'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {view === 'map' ? (
              <div className="h-[420px] md:h-[560px] border border-parchment/15 rounded-lg overflow-hidden bg-[#12110c]">
                <SiteMap
                  data={mapData}
                  sites={mySites}
                  occupied={occupied}
                  equipment={equipment}
                  selected={selected}
                  onSelect={setSelected}
                />
              </div>
            ) : (
              <SiteTable
                sites={ordered}
                occupied={occupied}
                equipment={equipment}
                selected={selected}
                onSelect={setSelected}
              />
            )}

            <Legend />
          </>
        ) : (
          <div className="border border-parchment/15 rounded-lg p-6 bg-parchment/[0.03]">
            <h2 className="font-display text-parchment text-xl">We'll assign your spot</h2>
            <p className="font-body text-parchment/60 text-sm mt-2 leading-relaxed max-w-prose">
              {category.name} isn't numbered — our team places you on arrival based on
              your setup and who else is on the property that night. If you're arriving
              late, we'll send your spot to your phone before you get here.
            </p>
          </div>
        )}
      </div>

      {/* ---------------- right: the 3-step rail ---------------- */}
      <aside className="lg:sticky lg:top-40 border border-parchment/15 rounded-lg bg-parchment/[0.03] divide-y divide-parchment/10">
        <Step n={1} title="Your trip">
          <dl className="space-y-1.5 font-body text-sm">
            <Line k="Dates" v={n > 0 ? `${fmtDate(from)} → ${fmtDate(to)}` : 'Not set'} />
            <Line k="Nights" v={n > 0 ? String(n) : '—'} />
            <Line k="Guests" v={String(guests)} />
          </dl>
        </Step>

        {isRv && (
          <Step n={2} title="Your setup">
            <p className="font-body text-parchment/45 text-xs mb-3 leading-relaxed">
              Slide-outs need extra width, so this changes which sites actually work.
            </p>
            <label className="block mb-3">
              <span className="block text-[10px] uppercase tracking-[0.15em] text-parchment/50 mb-1">
                Rig type
              </span>
              <select
                value={equipment.type ?? ''}
                onChange={e =>
                  setEquipment(q => ({ ...q, type: (e.target.value || null) as EquipmentType | null }))
                }
                className="w-full bg-bark border border-parchment/15 rounded px-3 py-2
                           text-parchment font-body text-sm outline-none"
              >
                <option value="" className="bg-bark text-parchment">Select…</option>
                {(Object.keys(EQUIPMENT_LABELS) as EquipmentType[]).map(t => (
                  <option key={t} value={t} className="bg-bark text-parchment">
                    {EQUIPMENT_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-3">
              <span className="flex justify-between text-[10px] uppercase tracking-[0.15em] text-parchment/50 mb-1">
                <span>Length</span>
                <span className="text-parchment normal-case tracking-normal text-xs font-semibold">
                  {equipment.lengthFt ? `${equipment.lengthFt} ft` : 'any'}
                </span>
              </span>
              <input
                type="range" min={0} max={55} step={1}
                value={equipment.lengthFt ?? 0}
                onChange={e =>
                  setEquipment(q => ({ ...q, lengthFt: Number(e.target.value) || null }))
                }
                className="w-full accent-ember"
              />
            </label>

            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.15em] text-parchment/50 mb-1">
                Slide-outs
              </span>
              <select
                value={equipment.slideOuts}
                onChange={e => setEquipment(q => ({ ...q, slideOuts: e.target.value as SlideOuts }))}
                className="w-full bg-bark border border-parchment/15 rounded px-3 py-2
                           text-parchment font-body text-sm outline-none"
              >
                {(Object.keys(SLIDE_LABELS) as SlideOuts[]).map(s => (
                  <option key={s} value={s} className="bg-bark text-parchment">
                    {SLIDE_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
          </Step>
        )}

        <Step n={isRv ? 3 : 2} title={category.picks_specific_site ? 'Your site' : 'Your stay'}>
          {category.picks_specific_site ? (
            chosen ? (
              <div>
                <p className="font-display text-parchment text-2xl">Site {chosen.label}</p>
                <p className="font-body text-parchment/55 text-xs mt-1">
                  {chosen.max_rv_length_ft && `Fits up to ${Math.floor(chosen.max_rv_length_ft)} ft`}
                  {chosen.width_ft && ` · ${Math.floor(chosen.width_ft)} ft wide`}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="font-body text-xs text-parchment/45 hover:text-parchment mt-2"
                >
                  Choose a different site
                </button>
              </div>
            ) : (
              <p className="font-body text-parchment/50 text-sm">
                Pick a site on the {view}.
              </p>
            )
          ) : (
            <p className="font-body text-parchment/50 text-sm">
              Assigned on arrival by our team.
            </p>
          )}
        </Step>

        <div className="p-5">
          {n > 0 && price > 0 && (
            <dl className="font-body text-sm space-y-1.5 mb-4">
              <Line k={`$${price} × ${n} ${n === 1 ? 'night' : 'nights'}`} v={`$${subtotal}`} />
              <div className="flex justify-between pt-2 border-t border-parchment/10">
                <dt className="text-parchment font-semibold">Subtotal</dt>
                <dd className="text-parchment font-semibold">${subtotal}</dd>
              </div>
              <p className="text-parchment/40 text-[11px] pt-1">Taxes calculated at checkout.</p>
            </dl>
          )}

          <Link
            href={`/book/${category.slug}/addons?from=${from ?? ''}&to=${to ?? ''}&guests=${guests}${
              chosen ? `&site=${chosen.site_number}` : ''
            }`}
            aria-disabled={n === 0 || (category.picks_specific_site && !chosen)}
            className={`btn-ember w-full justify-center ${
              n === 0 || (category.picks_specific_site && !chosen)
                ? 'pointer-events-none opacity-40'
                : ''
            }`}
          >
            Continue
          </Link>

          {category.picks_specific_site && !chosen && (
            <p className="font-body text-parchment/40 text-[11px] text-center mt-2">
              Choose a site to continue — or{' '}
              <Link
                href={`/book/${category.slug}/addons?from=${from ?? ''}&to=${to ?? ''}&guests=${guests}`}
                className="text-ember hover:underline"
              >
                let us assign one
              </Link>
              .
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}

/* ------------------------------------------------------------------ bits */

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="p-5">
      <h3 className="flex items-center gap-2.5 mb-3">
        <span className="grid place-items-center w-5 h-5 rounded-full bg-ember text-parchment font-body text-[11px] font-bold shrink-0">
          {n}
        </span>
        <span className="font-body text-[11px] uppercase tracking-[0.18em] text-parchment/70">
          {title}
        </span>
      </h3>
      {children}
    </section>
  )
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-parchment/55">{k}</dt>
      <dd className="text-parchment text-right">{v}</dd>
    </div>
  )
}

function SiteTable({
  sites, occupied, equipment, selected, onSelect,
}: {
  sites: MapSite[]; occupied: Set<number>; equipment: Equipment
  selected: number | null; onSelect: (n: number) => void
}) {
  return (
    <div className="border border-parchment/15 rounded-lg overflow-hidden">
      <table className="w-full text-left font-body text-sm">
        <thead className="bg-parchment/[0.06] text-parchment/60">
          <tr>
            <th className="px-4 py-2.5 font-medium text-xs uppercase tracking-wider">Site</th>
            <th className="px-4 py-2.5 font-medium text-xs uppercase tracking-wider">Max length</th>
            <th className="px-4 py-2.5 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Width</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-parchment/8">
          {sites.map(s => {
            const st = siteState(s, occupied, equipment, selected)
            const fit = fitsSite(s, equipment)
            const pickable = st === 'available' || st === 'selected'
            return (
              <tr key={s.site_number} className={pickable ? '' : 'opacity-45'}>
                <td className="px-4 py-3 text-parchment font-medium">{s.label}</td>
                <td className="px-4 py-3 text-parchment/70">
                  {s.max_rv_length_ft ? `${Math.floor(s.max_rv_length_ft)} ft` : '—'}
                </td>
                <td className="px-4 py-3 text-parchment/70 hidden sm:table-cell">
                  {s.width_ft ? `${Math.floor(s.width_ft)} ft` : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  {st === 'selected' ? (
                    <span className="text-creek text-xs font-semibold">✓ Selected</span>
                  ) : pickable ? (
                    <button
                      onClick={() => onSelect(s.site_number)}
                      className="text-ember text-xs font-semibold hover:underline"
                    >
                      Select
                    </button>
                  ) : (
                    <span className="text-parchment/40 text-xs">
                      {st === 'occupied' ? 'Booked' : fit.reason ?? 'Unavailable'}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Legend() {
  const items = [
    ['#057C34', 'Fits your setup'],
    ['#4A2E1C', 'Doesn’t fit'],
    ['#3A342C', 'Already booked'],
  ] as const
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
      {items.map(([c, l]) => (
        <li key={l} className="flex items-center gap-2 font-body text-[11px] text-parchment/50">
          <span className="w-3.5 h-2.5 rounded-sm border border-parchment/25" style={{ background: c }} />
          {l}
        </li>
      ))}
    </ul>
  )
}

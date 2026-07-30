import type { Metadata } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import type { Catalog } from '@/lib/booking/types'
import { fmtDate, nights } from '@/lib/booking/types'
import StickySearch from '@/components/booking/StickySearch'

export const metadata: Metadata = {
  title: 'Book Your Stay — Wells Gray Golf & RV Resort',
  description: 'Check availability for RV sites, tenting, glamping domes and cabins at Wells Gray Resort.',
}

async function getCatalog(): Promise<Catalog> {
  const file = path.join(process.cwd(), 'public', 'booking', 'catalog.json')
  return JSON.parse(await fs.readFile(file, 'utf8'))
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string; guests?: string }
}) {
  const catalog = await getCatalog()
  const from = searchParams.from ?? null
  const to = searchParams.to ?? null
  const guests = Number(searchParams.guests ?? 2)
  const n = nights(from, to)
  const qs = `from=${from ?? ''}&to=${to ?? ''}&guests=${guests}`

  return (
    <div className="section-dark min-h-[100dvh] pt-16 md:pt-20">
      <StickySearch from={from} to={to} guests={guests} />

      <div className="container-content py-10 md:py-14">
        <header className="mb-8 md:mb-10">
          <p className="font-body text-ember text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">
            Availability
          </p>
          <h1 className="heading-h2 text-parchment">Where would you like to stay?</h1>
          {n > 0 && (
            <p className="body-lead text-parchment/60 mt-3">
              {fmtDate(from)} → {fmtDate(to)} · {n} {n === 1 ? 'night' : 'nights'} · {guests}{' '}
              {guests === 1 ? 'guest' : 'guests'}
            </p>
          )}
        </header>

        <div className="grid gap-5 md:gap-6">
          {catalog.categories.map(cat => (
            <article
              key={cat.slug}
              className="border border-parchment/12 rounded-lg overflow-hidden bg-parchment/[0.03]
                         hover:border-parchment/25 transition-colors"
            >
              <div className="p-5 md:p-7 flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="font-display text-parchment text-2xl md:text-[1.75rem]">
                      {cat.name}
                    </h2>
                    {cat.picks_specific_site && (
                      <span className="text-[10px] uppercase tracking-wider text-creek border border-creek/40 rounded-full px-2 py-0.5">
                        Choose your site
                      </span>
                    )}
                  </div>

                  <p className="font-body text-parchment/65 text-sm leading-relaxed mt-2 max-w-prose">
                    {cat.blurb}
                  </p>

                  {cat.amenities.length > 0 && (
                    <ul className="flex flex-wrap gap-2 mt-4">
                      {cat.amenities.map(a => (
                        <li
                          key={a}
                          className="text-[11px] text-parchment/55 border border-parchment/15 rounded px-2 py-1"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="font-body text-parchment/45 text-xs mt-4">
                    {cat.site_count} {cat.site_count === 1 ? 'site' : 'sites'}
                    {cat.max_length_ft && <> · fits rigs up to {cat.max_length_ft} ft</>}
                  </p>
                </div>

                <div className="md:w-52 shrink-0 md:text-right flex md:flex-col items-end md:items-end justify-between gap-3">
                  <div>
                    {cat.from_price && (
                      <>
                        <p className="font-display text-parchment text-3xl leading-none">
                          ${cat.from_price}
                        </p>
                        <p className="font-body text-parchment/45 text-xs mt-1">
                          per night{n > 0 && <> · ${cat.from_price * n} total</>}
                        </p>
                      </>
                    )}
                  </div>
                  <Link href={`/book/${cat.slug}?${qs}`} className="btn-ember whitespace-nowrap">
                    {cat.picks_specific_site ? 'Choose a site' : 'View details'}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="font-body text-parchment/35 text-xs mt-10 max-w-prose">
          Prices shown are typical nightly rates and exclude tax. Your exact total is
          calculated at checkout. Questions? Call{' '}
          <a href="tel:+12506740009" className="text-parchment/60 hover:text-parchment">
            (250) 674-0009
          </a>
          .
        </p>
      </div>
    </div>
  )
}

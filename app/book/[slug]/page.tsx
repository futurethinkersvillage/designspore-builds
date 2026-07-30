import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Catalog, SiteMapData } from '@/lib/booking/types'
import { nights } from '@/lib/booking/types'
import { occupiedFor, type AvailabilityIndex } from '@/lib/booking/availability'
import StickySearch from '@/components/booking/StickySearch'
import CategoryBooking from '@/components/booking/CategoryBooking'

async function readJson<T>(...parts: string[]): Promise<T> {
  return JSON.parse(await fs.readFile(path.join(process.cwd(), 'public', 'booking', ...parts), 'utf8'))
}

async function getCategory(slug: string) {
  const catalog = await readJson<Catalog>('catalog.json')
  return catalog.categories.find(c => c.slug === slug) ?? null
}

export async function generateStaticParams() {
  const catalog = await readJson<Catalog>('catalog.json')
  return catalog.categories.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = await getCategory(params.slug)
  if (!cat) return { title: 'Not found — Wells Gray Resort' }
  return { title: `${cat.name} — Book at Wells Gray Resort`, description: cat.blurb }
}

export default async function CategoryPage({
  params, searchParams,
}: {
  params: { slug: string }
  searchParams: { from?: string; to?: string; guests?: string }
}) {
  const category = await getCategory(params.slug)
  if (!category) notFound()

  const mapData = await readJson<SiteMapData>('map', 'sites.json')

  const from = searchParams.from ?? null
  const to = searchParams.to ?? null
  const guests = Number(searchParams.guests ?? 2)
  const n = nights(from, to)

  // Availability must answer "free for MY dates", not "free today".
  let occupied: number[] = []
  try {
    const index = await readJson<AvailabilityIndex>('availability.json')
    occupied = occupiedFor(index, from, to)
  } catch {
    /* index is optional — absent means we show everything as available */
  }

  return (
    <div className="section-dark min-h-[100dvh] pt-16 md:pt-20">
      <StickySearch from={from} to={to} guests={guests} />

      <div className="container-content py-8 md:py-12">
        <nav className="mb-6">
          <Link
            href={`/book?from=${from ?? ''}&to=${to ?? ''}&guests=${guests}`}
            className="font-body text-xs text-parchment/50 hover:text-parchment"
          >
            ← All accommodation
          </Link>
        </nav>

        <header className="mb-8 max-w-prose">
          <p className="font-body text-ember text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">
            {category.site_count} {category.site_count === 1 ? 'site' : 'sites'}
            {category.max_length_ft && ` · up to ${category.max_length_ft} ft`}
          </p>
          <h1 className="heading-h2 text-parchment">{category.name}</h1>
          <p className="body-lead text-parchment/65 mt-3">{category.blurb}</p>

          {category.amenities.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-5">
              {category.amenities.map(a => (
                <li
                  key={a}
                  className="text-[11px] text-parchment/55 border border-parchment/15 rounded px-2 py-1"
                >
                  {a}
                </li>
              ))}
            </ul>
          )}
        </header>

        {n === 0 && (
          <p className="mb-6 border border-ember/40 bg-ember/10 rounded p-4 font-body text-sm text-parchment/80">
            Choose your dates above to see what's available.
          </p>
        )}

        <CategoryBooking
          category={category}
          mapData={mapData}
          occupiedList={occupied}
          from={from}
          to={to}
          guests={guests}
        />
      </div>
    </div>
  )
}

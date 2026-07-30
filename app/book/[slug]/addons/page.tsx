import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Catalog } from '@/lib/booking/types'
import { nights } from '@/lib/booking/types'
import StickySearch from '@/components/booking/StickySearch'
import AddonPicker from '@/components/booking/AddonPicker'

export const metadata: Metadata = { title: 'Add to your stay — Wells Gray Resort' }

async function getCatalog(): Promise<Catalog> {
  return JSON.parse(
    await fs.readFile(path.join(process.cwd(), 'public', 'booking', 'catalog.json'), 'utf8'),
  )
}

export async function generateStaticParams() {
  const catalog = await getCatalog()
  return catalog.categories.map(c => ({ slug: c.slug }))
}

export default async function AddonsPage({
  params, searchParams,
}: {
  params: { slug: string }
  searchParams: { from?: string; to?: string; guests?: string; site?: string }
}) {
  const catalog = await getCatalog()
  const category = catalog.categories.find(c => c.slug === params.slug)
  if (!category) notFound()

  const from = searchParams.from ?? null
  const to = searchParams.to ?? null
  const guests = Number(searchParams.guests ?? 2)
  const site = searchParams.site ?? null
  const n = nights(from, to)

  return (
    <div className="section-dark min-h-[100dvh] pt-16 md:pt-20">
      <StickySearch from={from} to={to} guests={guests} />

      <div className="container-content py-8 md:py-12">
        <nav className="mb-6">
          <Link
            href={`/book/${category.slug}?from=${from ?? ''}&to=${to ?? ''}&guests=${guests}`}
            className="font-body text-xs text-parchment/50 hover:text-parchment"
          >
            ← Back to {category.name}
          </Link>
        </nav>

        <header className="mb-8 max-w-prose">
          <p className="font-body text-ember text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">
            Step 2 of 3
          </p>
          <h1 className="heading-h2 text-parchment">Anything else?</h1>
          <p className="body-lead text-parchment/65 mt-3">
            Firewood by your site when you arrive, a sauna session booked before the
            evening fills up, a round on the nine. Easier now than at the office.
          </p>
        </header>

        <AddonPicker
          addons={catalog.addons}
          category={category}
          nightsCount={n}
          from={from}
          to={to}
          guests={guests}
          site={site}
        />
      </div>
    </div>
  )
}

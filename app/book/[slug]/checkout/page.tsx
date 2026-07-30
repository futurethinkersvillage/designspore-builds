import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Catalog } from '@/lib/booking/types'
import { fmtDate, nights } from '@/lib/booking/types'
import MembershipMoment from '@/components/booking/MembershipMoment'

export const metadata: Metadata = { title: 'Review your stay — Wells Gray Resort' }

async function getCatalog(): Promise<Catalog> {
  return JSON.parse(
    await fs.readFile(path.join(process.cwd(), 'public', 'booking', 'catalog.json'), 'utf8'),
  )
}

export async function generateStaticParams() {
  const catalog = await getCatalog()
  return catalog.categories.map(c => ({ slug: c.slug }))
}

export default async function CheckoutPage({
  params, searchParams,
}: {
  params: { slug: string }
  searchParams: { from?: string; to?: string; guests?: string; site?: string; addons?: string }
}) {
  const catalog = await getCatalog()
  const category = catalog.categories.find(c => c.slug === params.slug)
  if (!category) notFound()

  const from = searchParams.from ?? null
  const to = searchParams.to ?? null
  const guests = Number(searchParams.guests ?? 2)
  const site = searchParams.site ?? null
  const n = nights(from, to)

  const picked = (searchParams.addons ?? '')
    .split(',')
    .filter(Boolean)
    .map(pair => {
      const [id, q] = pair.split(':')
      const addon = catalog.addons.find(a => a.item_id === Number(id))
      return addon ? { name: addon.name, qty: Number(q) || 1 } : null
    })
    .filter(Boolean) as { name: string; qty: number }[]

  const stayTotal = (category.from_price ?? 0) * n

  return (
    <div className="section-dark min-h-[100dvh] pt-16 md:pt-20">
      <div className="container-content py-10 md:py-14 max-w-3xl">
        <nav className="mb-6">
          <Link
            href={`/book/${category.slug}/addons?from=${from ?? ''}&to=${to ?? ''}&guests=${guests}${site ? `&site=${site}` : ''}`}
            className="font-body text-xs text-parchment/50 hover:text-parchment"
          >
            ← Back to extras
          </Link>
        </nav>

        <header className="mb-8">
          <p className="font-body text-ember text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">
            Step 3 of 3
          </p>
          <h1 className="heading-h2 text-parchment">Review your stay</h1>
        </header>

        <section className="border border-parchment/15 rounded-lg bg-parchment/[0.03] p-6 mb-6">
          <dl className="font-body text-sm space-y-3">
            <Row k="Accommodation" v={category.name} />
            {site && <Row k="Site" v={`#${site}`} />}
            <Row k="Arrive" v={fmtDate(from) || '—'} />
            <Row k="Depart" v={fmtDate(to) || '—'} />
            <Row k="Nights" v={n ? String(n) : '—'} />
            <Row k="Guests" v={String(guests)} />
            {picked.length > 0 && (
              <div className="pt-3 border-t border-parchment/10">
                <dt className="text-parchment/55 mb-1.5">Extras</dt>
                <dd className="space-y-1">
                  {picked.map(p => (
                    <p key={p.name} className="text-parchment">
                      {p.qty} × {p.name}
                    </p>
                  ))}
                </dd>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-parchment/10">
              <dt className="text-parchment font-semibold text-base">Accommodation subtotal</dt>
              <dd className="text-parchment font-semibold text-base">${stayTotal}</dd>
            </div>
          </dl>
          <p className="font-body text-parchment/40 text-[11px] mt-3">
            Extras and taxes are confirmed on the next screen.
          </p>
        </section>

        {/* The single membership moment — shown once, at the point of payment,
            to someone already spending money. Never in the browsing path. */}
        {n > 0 && stayTotal > 0 && <MembershipMoment stayTotal={stayTotal} nights={n} />}

        <a
          href="https://wellsgraygolfresorta.checkfront.com/reserve/"
          className="btn-ember w-full justify-center text-base py-4"
        >
          Complete your booking
        </a>
        <p className="font-body text-parchment/45 text-xs text-center mt-3">
          Payment is processed on our secure reservation system. Questions?{' '}
          <a href="tel:+12506740009" className="text-parchment/70 hover:text-parchment">
            (250) 674-0009
          </a>
        </p>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-parchment/55">{k}</dt>
      <dd className="text-parchment text-right">{v}</dd>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Rates',
  description:
    'Camping, glamping, golf, Stay N Play packages, and seasonal pass rates for Wells Gray Golf & RV Resort. Open May–October.',
}

const campingRates = [
  { type: 'Creekside Serviced RV Site (30A, water, sani dump)', rate: '$65/night' },
  { type: 'Full Service RV Site (30A, water, sewer — non-creekside)', rate: '$65/night' },
  { type: 'Non-Serviced RV Site (field)', rate: '$50/night' },
  { type: 'Covered Tent Site', rate: '$45/night' },
  { type: 'Regular Tent Site', rate: '$40/night' },
  { type: 'Sleeping Cabin — 2 persons', rate: '$60/night' },
  { type: 'Sleeping Cabin — 4 persons', rate: '$90/night' },
  { type: 'Horse Corral + Non-Service RV (2 persons + 1 horse)', rate: '$55/night' },
]

const extras = [
  { type: 'Extra person over 12 yrs (RV or tent)', rate: '$5/night' },
  { type: 'Dog or other pet (max 2 per site)', rate: '$5/night' },
  { type: 'Horse (max 20 corrals total)', rate: '$5/night' },
]

const golfRates = [
  { type: 'Golf — 9 holes', rate: '$30/person' },
  { type: 'Golf — 18 holes', rate: '$45/person' },
  { type: 'Disc Golf game', rate: '$10/person' },
]

const rentals = [
  { type: 'Golf cart — 9 holes (2 persons)', rate: '$25' },
  { type: 'Golf cart — 18 holes (2 persons)', rate: '$40' },
  { type: 'Pull cart (1 person)', rate: '$5' },
  { type: 'Golf clubs (set)', rate: '$10' },
  { type: 'Disc set', rate: '$10' },
]

const packages = [
  { type: '7 Days / 6 Nights — Stay N Play (2 persons)', rate: '$645' },
  { type: '6 Days / 5 Nights — Stay N Play (2 persons)', rate: '$595' },
  { type: '5 Days / 4 Nights — Stay N Play (2 persons)', rate: '$495' },
  { type: '4 Days / 3 Nights — Stay N Play (2 persons)', rate: '$405' },
  { type: '3 Days / 2 Nights — Stay N Play (2 persons)', rate: '$355' },
  { type: '2 Days / 1 Night — Stay N Play (2 persons)', rate: '$215' },
]

const passes = [
  { type: 'Golf Season Pass — Regular', rate: '$550' },
  { type: 'Golf Season Pass — Senior / Junior', rate: '$500' },
  { type: '10-Round Golf Pass', rate: '$250' },
  { type: '20-Round Golf Pass', rate: '$350' },
  { type: 'Gift Certificate (camping & golf)', rate: '$130' },
]

function RateTable({ rows }: { rows: { type: string; rate: string }[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-bark/10">
      <table className="w-full">
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.type} className={i % 2 === 0 ? 'bg-white' : 'bg-parchment/50'}>
              <td className="px-5 py-3 font-body text-sm text-bark">{row.type}</td>
              <td className="px-5 py-3 font-body text-sm font-semibold text-ember text-right whitespace-nowrap">{row.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function RatesPage() {
  return (
    <>
      <RevealInit />

      {/* Header */}
      <section className="section-dark pt-32 pb-16">
        <div className="container-content">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4 reveal">
            Pricing
          </p>
          <h1 className="heading-display text-parchment reveal">
            Rates &amp;<br />Packages
          </h1>
          <p className="body-lead text-parchment/60 mt-4 max-w-prose reveal">
            All rates are per night per site. Base rate includes 2 adults and your own children under 12.
          </p>
        </div>
      </section>

      {/* Rates content */}
      <section className="section-light py-16 md:py-24">
        <div className="container-content max-w-3xl space-y-14">

          <div className="reveal">
            <h2 className="font-display text-bark text-h3 mb-5">Camping Rates</h2>
            <RateTable rows={campingRates} />
          </div>

          <div className="reveal">
            <h2 className="font-display text-bark text-h3 mb-5">Extra Person &amp; Pet Charges</h2>
            <RateTable rows={extras} />
            <p className="font-body text-stone text-xs mt-3 leading-relaxed">
              Up to 4 persons over 12 per site (max 6 total). Max 2 dogs per site.
            </p>
          </div>

          <div className="reveal">
            <h2 className="font-display text-bark text-h3 mb-5">Golf &amp; Disc Golf</h2>
            <RateTable rows={golfRates} />
            <p className="font-body text-stone text-xs mt-3">
              Golf rates are per person and cannot be shared.
            </p>
          </div>

          <div className="reveal">
            <h2 className="font-display text-bark text-h3 mb-5">Equipment Rentals</h2>
            <RateTable rows={rentals} />
          </div>

          <div className="reveal">
            <h2 className="font-display text-bark text-h3 mb-3">Stay N Play Packages</h2>
            <p className="font-body text-stone text-sm mb-5 leading-relaxed">
              Unlimited golf + serviced RV site. For 2 persons. Does not include power cart.
            </p>
            <RateTable rows={packages} />
          </div>

          <div className="reveal">
            <h2 className="font-display text-bark text-h3 mb-5">Season Passes &amp; Gift Cards</h2>
            <RateTable rows={passes} />
          </div>

          {/* Booking & Cancellation policy */}
          <div className="reveal p-6 md:p-8 border border-ember/30 rounded-lg bg-amber-50/50">
            <h2 className="font-display text-bark text-h4 mb-4">Booking &amp; Cancellation Policy</h2>
            <div className="space-y-3 font-body text-stone text-sm leading-relaxed">
              <p>50% of your booking amount is charged at time of reservation.</p>
              <p>The remaining balance is charged 30 days before arrival. Reservations made less than 30 days prior are charged in full.</p>
              <p>Full refund on cancellations made 30+ days before arrival. Cancellations less than 30 days before arrival are non-refundable.</p>
            </div>
          </div>

          {/* Seasonal village note */}
          <div className="reveal p-6 md:p-8 bg-forest/5 border border-forest/20 rounded-lg">
            <h2 className="font-display text-bark text-h4 mb-3">Seasonal RV Pads</h2>
            <p className="font-body text-stone text-sm leading-relaxed mb-5">
              Interested in a full-season site? Our Seasonal Village pads run May–October and include golf, sauna, WIFI, and community amenities. Limited availability.
            </p>
            <Link href="/seasonal-village" className="btn-ember text-sm">See Seasonal Village</Link>
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="section-dark py-14">
        <div className="container-content flex flex-col sm:flex-row items-center justify-between gap-6 reveal">
          <p className="font-display text-parchment text-xl">Ready to book?</p>
          <Link href="/stay#book" className="btn-ember shrink-0">Reserve Your Site</Link>
        </div>
      </section>
    </>
  )
}

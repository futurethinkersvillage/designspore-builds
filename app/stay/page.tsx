import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Stay',
  description:
    'Glamping domes, creekside RV sites, forest sleeping cabins, tenting, and seasonal long-term pads. Every stay at Wells Gray Resort includes access to golf, sauna, and a private lake.',
}

const stays = [
  {
    id: 'dome',
    label: 'Glamping Dome',
    from: '$129/night',
    img: '/images/PXL_20240518_203127249-EDIT-scaled.jpg',
    desc: 'A spacious geodesic dome perched beside the creek, with a queen bed, air conditioning, and windows that let the forest in. The most private stay on the property.',
    details: ['Queen bed', 'Air conditioning', 'Creek views', 'Private patio'],
  },
  {
    id: 'rv-creekside',
    label: 'Creekside RV Sites',
    from: '$65/night',
    img: '/images/20210924_172621-scaled.jpg',
    desc: '30-amp hookups, water connections, and fire pits on the bank of the creek. Wake up to the sound of moving water. These sites fill first — book early.',
    details: ['30-amp power', 'Water hookup', 'Sani dump access', 'Creekside fire pit'],
  },
  {
    id: 'rv-full',
    label: 'Full Service RV Sites',
    from: '$65/night',
    img: '/images/20210713_1838270-scaled.jpg',
    desc: 'Full hookups — power, water, and sewer — for longer stays or larger rigs. Non-creekside, with full access to all resort amenities.',
    details: ['30-amp power', 'Water + sewer hookup', 'WIFI access', 'All amenities'],
  },
  {
    id: 'cabin',
    label: 'Forest Sleeping Cabins',
    from: '$60/night',
    img: '/images/PXL_20250504_163611703-EDIT-scaled.jpg',
    desc: 'Simple, wooden, honest. A double bed, a power outlet, and nothing between you and the sound of the forest. Bring your own bedding and settle in.',
    details: ['Double bed', 'Power outlet', 'No plumbing', 'Forest setting'],
  },
  {
    id: 'tent',
    label: 'Tent Sites',
    from: '$40/night',
    img: '/images/PXL_20250604_163055857-EDIT-scaled.jpg',
    desc: 'Flat, shaded spots near the creek and facilities. Shared fire pits throughout. Group camping available. This is how camping is supposed to feel.',
    details: ['Shaded creek-side', 'Shared fire pits', 'Clean washrooms', 'Group sites available'],
  },
  {
    id: 'seasonal',
    label: 'Seasonal Village Pads',
    from: 'Waitlist',
    img: '/images/PXL_20250629_025242307-EDIT-scaled.jpg',
    desc: 'Return each year to your own seasonal site. Part campground, part community. Limited pads available — join the waitlist to be notified.',
    details: ['30-amp (50-amp soon)', 'Season: May–October', 'Community access', 'Sauna + golf included'],
    cta: { label: 'Join the Waitlist', href: '/seasonal-village' },
  },
]

const amenities = [
  'Deluxe showers & washrooms',
  'Camp store with essentials',
  'Wood-fired sauna (bookable)',
  'Private swimming lake',
  'Event gazebo & picnic areas',
  '9-hole golf course',
  '18-hole disc golf',
  'Family fire pits',
  'Laundry facilities',
  'WIFI access',
  'Horse corrals (20 available)',
  'Kids play areas',
]

export default function StayPage() {
  return (
    <>
      <RevealInit />

      {/* Hero */}
      <section className="relative min-h-[60dvh] flex items-end section-dark overflow-hidden">
        <Image
          src="/images/20210731_180321-scaled.jpg"
          alt="Wells Gray Resort RV sites and grounds"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bark/80 via-bark/50 to-bark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/70 to-transparent" />
        <div className="container-content relative z-10 pb-16 pt-32">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Accommodations
          </p>
          <h1 className="heading-display text-parchment mb-4">
            Find Your Spot<br />in the Forest
          </h1>
          <p className="body-lead text-parchment/70 max-w-[520px]">
            Whether you're here for a night or the whole season, there's a place for you — from glamping domes to creekside RV sites to simple sleeping cabins under the trees.
          </p>
        </div>
      </section>

      {/* Booking anchor placeholder */}
      <div id="book" />

      {/* Stays list */}
      <section className="section-light py-20 md:py-28">
        <div className="container-content">
          <div className="space-y-16 md:space-y-20">
            {stays.map((stay, i) => (
              <div
                key={stay.id}
                className={`reveal md:grid md:grid-cols-5 gap-10 md:gap-14 items-center ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
              >
                {/* Image */}
                <div className="md:col-span-3 relative h-[280px] md:h-[380px] rounded-lg overflow-hidden mb-6 md:mb-0" style={{ direction: 'ltr' }}>
                  <Image
                    src={stay.img}
                    alt={stay.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-2" style={{ direction: 'ltr' }}>
                  <p className="font-body text-ember text-xs font-semibold uppercase tracking-widest mb-2">
                    {stay.from}
                  </p>
                  <h2 className="font-display text-bark text-h3 mb-3">{stay.label}</h2>
                  <p className="font-body text-stone text-base leading-relaxed mb-5">{stay.desc}</p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-7">
                    {stay.details.map(d => (
                      <li key={d} className="font-body text-xs text-stone flex items-start gap-1.5">
                        <span className="text-ember mt-0.5">—</span> {d}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={stay.cta?.href ?? '/stay#book'}
                    className="btn-ember text-sm"
                  >
                    {stay.cta?.label ?? `Reserve a ${stay.label.split(' ')[0]}`}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared Amenities */}
      <section className="section-dark py-16 md:py-24">
        <div className="container-content">
          <div className="reveal mb-10">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">Included With Every Stay</p>
            <h2 className="heading-h2 text-parchment">Shared Amenities</h2>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 reveal">
            {amenities.map(a => (
              <li key={a} className="font-body text-sm text-parchment/70 flex items-start gap-2">
                <span className="text-ember mt-0.5 shrink-0">—</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rates callout */}
      <section className="section-forest py-12">
        <div className="container-content flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-display text-parchment text-xl">
            View the full rate sheet including golf, Stay &amp; Play packages, and seasonal passes.
          </p>
          <Link href="/rates" className="btn-outline-parchment shrink-0">See All Rates</Link>
        </div>
      </section>
    </>
  )
}

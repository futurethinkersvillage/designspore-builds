import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Weddings & Events',
  description:
    'A forest-edge gazebo that seats 120 people, overlooking a creek and a golf course. Weddings, reunions, retreats, and celebrations. Guests can stay on-site.',
}

const uses = [
  { label: 'Weddings & Vow Renewals', desc: 'The forest setting is the decoration. Ceremony and reception in one place, with your guests waking up here the next morning.' },
  { label: 'Family Reunions', desc: 'Everyone stays on-site. No hotels, no logistics. Three days together in the forest — the way a reunion should feel.' },
  { label: 'Wellness & Creative Retreats', desc: 'The sauna, the trails, the coworking gazebo, the lake. Perfect for a group that wants to think, create, and reconnect.' },
  { label: 'Corporate Gatherings', desc: 'Get your team out of a boardroom and into the forest. The shift in environment creates a different quality of conversation.' },
  { label: 'Multi-Day Festivals', desc: 'The land is spacious. We\'ve hosted small festivals, tournaments, and multi-day events. Reach out early for large bookings.' },
  { label: 'Group Camping', desc: 'Booking for a group? RV sites, tenting, and the cabin can all be reserved together.' },
]

export default function VenuePage() {
  return (
    <>
      <RevealInit />

      {/* Hero */}
      <section className="relative min-h-[65dvh] flex items-end section-dark overflow-hidden">
        <Image
          src="/images/461692343_10162000088875148_5722285476960156898_n.jpg"
          alt="Wedding ceremony at Wells Gray Resort"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bark/85 to-bark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/70 to-transparent" />
        <div className="container-content relative z-10 pb-16 pt-32">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Weddings &amp; Events
          </p>
          <h1 className="heading-display text-parchment mb-4">
            A Wild, Beautiful Place<br />to Come Together
          </h1>
          <p className="body-lead text-parchment/70 max-w-[520px]">
            Whether you're planning a wedding, a reunion, or a retreat — this place has a way of making it feel exactly right. No pretension. Just land, light, and the people you love.
          </p>
        </div>
      </section>

      {/* Venue details */}
      <section className="section-light py-20 md:py-28">
        <div className="container-content">
          <div className="md:grid md:grid-cols-5 gap-12 md:gap-16 items-start">
            {/* Left: image */}
            <div className="md:col-span-3 reveal">
              <div className="relative h-[360px] md:h-[500px] rounded-lg overflow-hidden mb-5">
                <Image
                  src="/images/20210621_205223-scaled.jpg"
                  alt="Wells Gray Resort outdoor event gazebo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-[180px] rounded-lg overflow-hidden">
                  <Image
                    src="/images/461719795_10162000089565148_4909250211936855684_n.jpg"
                    alt="Wedding reception at Wells Gray Resort"
                    fill
                    className="object-cover"
                    sizes="30vw"
                  />
                </div>
                <div className="relative h-[180px] rounded-lg overflow-hidden">
                  <Image
                    src="/images/457303431_10161883687870148_8848637454076928890_n.jpg"
                    alt="Wells Gray Resort venue celebration"
                    fill
                    className="object-cover"
                    sizes="30vw"
                  />
                </div>
              </div>
            </div>

            {/* Right: details */}
            <div className="md:col-span-2 mt-10 md:mt-0 reveal">
              <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">The Space</p>
              <h2 className="heading-h2 text-bark mb-5">The Forest-Edge Gazebo</h2>
              <p className="font-body text-stone text-base leading-relaxed mb-6">
                Our open-air gazebo overlooks the golf course and creek. It seats up to 120 people and includes basic kitchen facilities, tables, and nearby washrooms. The surrounding land gives you plenty of space for photos, gathering, and breathing room.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Seats up to 120 guests',
                  'Basic kitchen facilities',
                  'Tables and chairs available',
                  'Golf course & creek views',
                  'On-site washrooms',
                  'Parking for all guests',
                ].map(d => (
                  <li key={d} className="font-body text-sm text-stone flex gap-2">
                    <span className="text-ember shrink-0 mt-0.5">—</span> {d}
                  </li>
                ))}
              </ul>
              <div className="p-5 bg-bark/5 rounded-lg border border-bark/10 mb-7">
                <p className="font-display text-bark text-lg mb-2">Guests Sleep Here Too</p>
                <p className="font-body text-stone text-sm leading-relaxed">
                  RV sites, tenting, cabins, and the glamping dome are available for your guests. No shuttle buses. No tight timelines. Just show up, celebrate, and go to sleep under the trees.
                </p>
              </div>
              <Link href="/contact" className="btn-ember">
                Plan Your Event Here
              </Link>
              <p className="font-body text-xs text-stone mt-4">
                Summer weekends book early. Reach out as soon as you have a date in mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Uses */}
      <section className="section-dark py-20 md:py-24">
        <div className="container-content">
          <div className="reveal mb-12">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">What We Host</p>
            <h2 className="heading-h2 text-parchment">Gatherings of Every Kind</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {uses.map((u, i) => (
              <div key={u.label} className="reveal p-6 border border-border rounded-lg" style={{ transitionDelay: `${i * 70}ms` }}>
                <h3 className="font-display text-parchment text-lg mb-2">{u.label}</h3>
                <p className="font-body text-parchment/60 text-sm leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding photo credit */}
      <section className="section-light py-14">
        <div className="container-content reveal">
          <div className="md:flex items-center justify-between gap-10">
            <div>
              <h2 className="heading-h2 text-bark mb-4">Ready to Talk Dates?</h2>
              <p className="body-lead text-stone max-w-prose">
                Tell us what you're planning and when. We'll let you know what's available and how we can make it work.
              </p>
            </div>
            <Link href="/contact" className="btn-ember mt-8 md:mt-0 shrink-0">
              Get in Touch
            </Link>
          </div>
          <p className="font-body text-xs text-stone mt-8 border-t border-bark/10 pt-6">
            Wedding photography on this page by{' '}
            <a href="http://www.earthinbloom.ca/" target="_blank" rel="noopener noreferrer" className="underline hover:text-ember transition-colors">
              Camille Dhillon at Earth in Bloom Photography
            </a>
          </p>
        </div>
      </section>
    </>
  )
}

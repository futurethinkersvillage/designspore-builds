import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Play',
  description:
    'Golf, disc golf, wood-fired sauna, forest trails, a private lake, and family gathering spaces. Everything you need is right here on the property.',
}

const activities = [
  {
    id: 'golf',
    label: '9-Hole Golf Course',
    tag: 'From $30/person',
    img: '/images/wellsgraygolf8.png',
    desc: 'A relaxed, forested 9-hole course with mountain views in every direction. Not a championship track — something better. The kind of round where you take your time, lose a ball in the trees, and don\'t mind at all.',
    details: [
      '9 holes (play twice for 18)',
      'Golf cart rentals available',
      'Club and pull cart rentals',
      'Season pass options',
      'Stay N Play packages',
    ],
  },
  {
    id: 'disc-golf',
    label: '18-Hole Disc Golf',
    tag: '$10/game',
    img: '/images/wellsgraygolf2.png',
    desc: 'Eighteen holes weaving through the forest and open meadows. Disc rentals on-site if you didn\'t bring your own. A perfect afternoon for any skill level.',
    details: [
      '18 holes through forest',
      'Disc set rentals — $10',
      'Open to all skill levels',
      'Family-friendly layout',
    ],
  },
  {
    id: 'sauna',
    label: 'Wood-Fired Sauna',
    tag: 'Bookable on-site',
    img: '/images/PXL_20240701_001257503-scaled.jpg',
    desc: 'A cedar sauna tucked beside the creek. Fire it up, sweat it out, then step straight into the cold running water. It\'s the kind of reset you don\'t get at a hotel. Book a session when you arrive — mornings and evenings both available.',
    details: [
      'Wood-fired cedar sauna',
      'Creek cold plunge access',
      'Private session booking',
      'Evening sessions available',
    ],
  },
  {
    id: 'lake',
    label: 'Private Swimming Lake',
    tag: 'Included with stay',
    img: '/images/PXL_20240728_033755893-EDIT-scaled.jpg',
    desc: 'A spring-fed lake reserved exclusively for resort guests. No day-trippers, no crowds. Swim, float, watch the dragonflies, and take your time. This is what summer is supposed to be.',
    details: [
      'Spring-fed, clean water',
      'Resort guests only',
      'Picnic area lakeside',
      'Open daily in season',
    ],
  },
  {
    id: 'trails',
    label: 'Forest Trails & Gathering',
    tag: 'Always open',
    img: '/images/Gazebo.png',
    desc: 'Walk the property, find a shaded spot, let the kids roam. There are fire pits, picnic tables, and room to breathe. Not every adventure needs a map.',
    details: [
      'Forest walking paths',
      'Multiple fire pits',
      'Kids play area',
      'Open-air gazebo (bookable)',
    ],
  },
]

export default function PlayPage() {
  return (
    <>
      <RevealInit />

      {/* Hero */}
      <section className="relative min-h-[55dvh] flex items-end section-dark overflow-hidden">
        <Image
          src="/images/wellsgraygolf12.png"
          alt="Wells Gray Resort 9-hole golf course"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bark/80 to-bark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/70 to-transparent" />
        <div className="container-content relative z-10 pb-16 pt-32">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">Activities</p>
          <h1 className="heading-display text-parchment mb-4">
            Relax, Explore,<br />and Play Outdoors
          </h1>
          <p className="body-lead text-parchment/70 max-w-[500px]">
            Golf, disc golf, sauna, swimming, forest trails — everything is right here on the property. Choose your adventure, or just unwind and enjoy the land.
          </p>
        </div>
      </section>

      {/* Activities */}
      <section className="section-light py-20 md:py-28">
        <div className="container-content space-y-20 md:space-y-24">
          {activities.map((act, i) => (
            <div
              key={act.id}
              className={`reveal md:grid md:grid-cols-2 gap-10 md:gap-16 items-center`}
            >
              <div className={`relative h-[280px] md:h-[400px] rounded-lg overflow-hidden mb-6 md:mb-0 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <Image
                  src={act.img}
                  alt={act.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                <p className="font-body text-ember text-xs font-semibold uppercase tracking-widest mb-2">
                  {act.tag}
                </p>
                <h2 className="font-display text-bark text-h3 mb-4">{act.label}</h2>
                <p className="font-body text-stone text-base leading-relaxed mb-5">{act.desc}</p>
                <ul className="space-y-2 mb-7">
                  {act.details.map(d => (
                    <li key={d} className="font-body text-sm text-stone flex gap-2">
                      <span className="text-ember shrink-0">—</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Venue teaser */}
      <section className="section-dark py-16 md:py-20">
        <div className="container-content">
          <div className="md:flex items-center justify-between gap-10 reveal">
            <div className="max-w-xl">
              <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">Events & Gatherings</p>
              <h2 className="heading-h2 text-parchment mb-4">Hosting Something?</h2>
              <p className="body-lead text-parchment/70">
                The forest-edge gazebo seats 120 people. Weddings, reunions, retreats, tournaments — we've hosted them all. Guests can stay on-site.
              </p>
            </div>
            <Link href="/venue" className="btn-ember mt-8 md:mt-0 shrink-0">
              Plan Your Event Here
            </Link>
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="section-forest py-14">
        <div className="container-content text-center reveal">
          <p className="font-display text-parchment text-xl mb-6">
            Golf, sauna, and swimming come with every stay.
          </p>
          <Link href="/stay#book" className="btn-ember">Reserve Your Site</Link>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Explore',
  description:
    'Wells Gray Provincial Park is one of BC\'s most spectacular wild places. Helmcken Falls, Spahats Creek, Moul Falls, hiking, rafting, horseback riding — all within reach.',
}

const waterfalls = [
  {
    name: 'Helmcken Falls',
    desc: 'One of Canada\'s highest waterfalls, plunging 141 metres into a mist-filled canyon. A 15-minute walk from the parking area — and a view you\'ll remember for the rest of your life.',
    drive: '35 min from resort',
  },
  {
    name: 'Spahats Falls',
    desc: 'A dramatic orange-red canyon carved by the creek over millennia. The falls are visible from a viewpoint right at the edge — no hike required, just your breath.',
    drive: '10 min from resort',
  },
  {
    name: 'Moul Falls',
    desc: 'A longer hike (6km return) but the reward is swimming in the pool at the base of the falls. Bring lunch. You\'ll want to stay all afternoon.',
    drive: '45 min from resort',
  },
  {
    name: 'Dawson Falls',
    desc: 'A wide, gentle cascade across the full width of the Clearwater River — sometimes called "Little Niagara." An easy stroll from the parking area.',
    drive: '30 min from resort',
  },
]

const adventures = [
  {
    label: 'Whitewater Rafting',
    desc: 'The Clearwater and Thompson Rivers offer class II–IV rapids depending on season. Half-day and full-day trips available through local outfitters.',
    img: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=700&q=80',
  },
  {
    label: 'Horseback Riding',
    desc: 'Trail rides through the forest and meadows with local guides. Beginner-friendly. A completely different way to see the land.',
    img: 'https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&w=700&q=80',
  },
  {
    label: 'Kayaking & Canoeing',
    desc: 'Clearwater Lake and the river system are perfect for paddling. Rentals available locally, guided tours with Clearwater Lake Tours.',
    img: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=700&q=80',
  },
  {
    label: 'Wildlife Viewing',
    desc: 'Wells Gray is home to moose, black bear, wolverine, osprey, and the rare mountain caribou. Early mornings are best — the meadows along the park road are a reliable starting point.',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80',
  },
]

export default function ExplorePage() {
  return (
    <>
      <RevealInit />

      {/* Hero */}
      <section className="relative min-h-[65dvh] flex items-end section-dark overflow-hidden">
        <Image
          src="https://wellsgrayresort.ca/wp-content/uploads/2025/06/PXL_20230621_022025523.MP-EDIT-scaled.jpg"
          alt="Wells Gray Provincial Park wilderness and waterfalls"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bark/85 to-bark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/70 to-transparent" />
        <div className="container-content relative z-10 pb-16 pt-32">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Wells Gray Provincial Park
          </p>
          <h1 className="heading-display text-parchment mb-4">
            Adventure Starts<br />Right Outside Your Door
          </h1>
          <p className="body-lead text-parchment/70 max-w-[500px]">
            We're inside the boundaries of one of Canada's great wilderness parks. Helmcken Falls. Ancient forests. Rivers no one has named yet. This is your basecamp.
          </p>
        </div>
      </section>

      {/* Park intro */}
      <section className="section-dark py-16 md:py-20">
        <div className="container-content">
          <div className="md:grid md:grid-cols-2 gap-12 md:gap-20 items-center reveal">
            <div>
              <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">The Park</p>
              <h2 className="heading-h2 text-parchment mb-5">
                5,250 km² of Wild
              </h2>
              <p className="body-lead text-parchment/70 mb-5">
                Wells Gray Provincial Park is BC's fourth-largest park — bigger than the entire country of Trinidad and Tobago. It protects old-growth forests, volcanic landscapes, and a river system that's barely been touched.
              </p>
              <p className="font-body text-parchment/60 text-base leading-relaxed">
                We're not just near the park — we're inside it. That means no drive to the gate. Just wake up, walk out, and start exploring.
              </p>
            </div>
            <div className="relative h-[320px] md:h-[420px] rounded-lg overflow-hidden mt-8 md:mt-0">
              <Image
                src="https://wellsgrayresort.ca/wp-content/uploads/2025/06/PXL_20240728_033755893-EDIT-scaled.jpg"
                alt="Private lake in Wells Gray Provincial Park"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Waterfalls */}
      <section className="section-light py-20 md:py-28">
        <div className="container-content">
          <div className="reveal mb-12">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              BC's Waterfall Province
            </p>
            <h2 className="heading-h2 text-bark">The Falls</h2>
            <p className="body-lead text-stone mt-4 max-w-prose">
              Wells Gray is nicknamed "BC's Waterfall Province" — and once you see Helmcken Falls for the first time, you'll understand why they say that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {waterfalls.map((wf, i) => (
              <div key={wf.name} className="reveal p-6 md:p-7 border border-bark/10 rounded-lg" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-display text-bark text-h4">{wf.name}</h3>
                  <span className="font-body text-xs text-ember font-semibold shrink-0 mt-1">{wf.drive}</span>
                </div>
                <p className="font-body text-stone text-sm leading-relaxed">{wf.desc}</p>
              </div>
            ))}
          </div>

          <p className="font-body text-stone text-sm mt-8 reveal">
            Ask at the front desk for a park map and personalized recommendations. We know which trails are best right now.
          </p>
        </div>
      </section>

      {/* Adventure tours */}
      <section className="section-dark py-20 md:py-28">
        <div className="container-content">
          <div className="reveal mb-12">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Guided Adventures
            </p>
            <h2 className="heading-h2 text-parchment">
              Go Further
            </h2>
            <p className="body-lead text-parchment/70 mt-4 max-w-prose">
              Want to go beyond the resort? Local guides offer a range of adventures — we can help you book with our trusted partners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {adventures.map((adv, i) => (
              <div key={adv.label} className="reveal group relative rounded-lg overflow-hidden h-[260px]" style={{ transitionDelay: `${i * 80}ms` }}>
                <Image
                  src={adv.img}
                  alt={adv.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-parchment text-xl mb-1">{adv.label}</h3>
                  <p className="font-body text-parchment/70 text-sm leading-relaxed">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slow moments */}
      <section className="section-light py-20">
        <div className="container-content">
          <div className="md:grid md:grid-cols-2 gap-12 items-center reveal">
            <div>
              <h2 className="heading-h2 text-bark mb-5">The Slow Moments</h2>
              <p className="body-lead text-stone mb-5">
                Not every adventure needs a trail map. Watching the sunrise filter through the trees. Skipping stones in the creek with your kids. Sitting around the fire until everyone's too tired to talk anymore.
              </p>
              <p className="font-body text-stone text-base leading-relaxed">
                These are the moments that stick. The ones you'll talk about on the drive home, and again next summer.
              </p>
            </div>
            <div className="relative h-[300px] md:h-[380px] rounded-lg overflow-hidden mt-8 md:mt-0">
              <Image
                src="https://wellsgrayresort.ca/wp-content/uploads/2025/06/PXL_20240728_033755893-EDIT-scaled.jpg"
                alt="Private lake at Wells Gray Resort"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-forest py-14">
        <div className="container-content flex flex-col sm:flex-row items-center justify-between gap-6 reveal">
          <p className="font-display text-parchment text-xl">Make this your basecamp.</p>
          <Link href="/stay#book" className="btn-ember shrink-0">Reserve Your Site</Link>
        </div>
      </section>
    </>
  )
}

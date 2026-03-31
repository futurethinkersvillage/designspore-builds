import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Wells Gray Golf & RV Resort — Clearwater, BC',
  description:
    'Glamping domes, creekside RV sites, 9-hole golf, wood-fired sauna, and a private lake inside Wells Gray Provincial Park. 2 hours north of Kamloops.',
}

const accommodations = [
  {
    id: 'dome',
    label: 'Glamping Dome',
    desc: 'A spacious geodesic dome with a queen bed and air conditioning, tucked beside the creek. Walls that let the forest in.',
    from: '$129',
    img: 'https://wellsgrayresort.ca/wp-content/uploads/2025/06/PXL_20240518_203127249-EDIT-scaled.jpg',
    size: 'large',
  },
  {
    id: 'rv-creekside',
    label: 'Creekside RV Sites',
    desc: '30-amp hookups, water, and fire pit — right on the creek. Fall asleep to the sound of moving water.',
    from: '$65',
    img: 'https://wellsgrayresort.ca/wp-content/uploads/2025/06/20210924_172621-scaled.jpg',
    size: 'small',
  },
  {
    id: 'cabin',
    label: 'Forest Cabins',
    desc: 'Simple wooden sleeping cabins under the trees. Power, a double bed, and nothing between you and the forest.',
    from: '$60',
    img: 'https://wellsgrayresort.ca/wp-content/uploads/2025/06/PXL_20250504_163611703-EDIT-scaled.jpg',
    size: 'small',
  },
]

const features = [
  {
    icon: '⛳',
    label: '9-Hole Golf',
    desc: 'A relaxed round through forest and mountain views. Carts, clubs, and disc rentals on-site.',
  },
  {
    icon: '🔥',
    label: 'Wood-Fired Sauna',
    desc: 'Tucked by the creek. Book a session, sweat it out, then step into the cold water. Reset complete.',
  },
  {
    icon: '🏊',
    label: 'Private Lake',
    desc: 'A spring-fed swimming lake reserved for resort guests. No crowds. Just water, sun, and sky.',
  },
  {
    icon: '🌲',
    label: 'Wells Gray Park',
    desc: "Canada's Waterfall Province in your backyard. Helmcken Falls, Spahats, Moul — all within 30 minutes.",
  },
]

export default function Home() {
  return (
    <>
      <RevealInit />

      {/* ===================== HERO ===================== */}
      {/* SCROLL-STOP VIDEO HERO */}
      {/*
        Container: full-viewport, min-h-[100dvh]
        Replace <div className="hero-bg-placeholder"> with:
        - <video> tag using drone footage autoPlay muted loop playsInline
        - OR GSAP ScrollTrigger canvas for scroll-scrubbed version
        Drone footage source: YouTube rQwOshB6J3M (Wells Gray Village Aerial)
      */}
      <section className="relative min-h-[100dvh] flex items-end section-dark overflow-hidden">
        {/* Background image placeholder — replace with video */}
        <Image
          src="https://wellsgrayresort.ca/wp-content/uploads/2025/06/dji_fly_20240630_160720_5_1719788849030_photo_optimized-scaled.jpg"
          alt="Aerial view of Wells Gray Resort"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay — left-weighted for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-bark/85 via-bark/50 to-bark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/60 via-transparent to-transparent" />

        {/* Content — left-aligned, NOT centered */}
        <div className="container-content relative z-10 pb-20 md:pb-28 pt-32">
          <div className="max-w-prose">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-5">
              Clearwater, BC · Wells Gray Provincial Park
            </p>
            <h1 className="font-display font-light text-parchment leading-tight tracking-tight text-5xl md:text-6xl lg:text-display-lg mb-6">
              Where the Forest<br />
              <em className="not-italic text-parchment/80">Becomes</em> Home
            </h1>
            <p className="body-lead text-parchment/70 max-w-[520px] mb-10">
              Creekside camping, glamping domes, 9-hole golf, wood-fired sauna, and a private lake — all inside one of BC's wildest provincial parks.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/stay#book" className="btn-ember">
                Reserve Your Site
              </Link>
              <Link href="/stay" className="btn-outline-parchment">
                See What's Here
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
          <span className="font-body text-parchment text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-parchment animate-pulse" />
        </div>
      </section>

      {/* ===================== INTRO STRIP ===================== */}
      <section className="section-forest py-12">
        <div className="container-content">
          <p className="font-display font-light text-parchment/90 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto text-center">
            "A Place to Belong" — two hours north of Kamloops, deep in the heart of Wells Gray Country.
          </p>
        </div>
      </section>

      {/* ===================== ACCOMMODATIONS ===================== */}
      <section className="section-light py-20 md:py-28">
        <div className="container-content">
          <div className="reveal mb-12 md:mb-16">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Where You'll Sleep
            </p>
            <h2 className="heading-h2 text-bark">Find Your<br />Spot in the Forest</h2>
          </div>

          {/* Asymmetric grid — NOT equal 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
            {/* Large featured card */}
            {accommodations.filter(a => a.size === 'large').map(acc => (
              <div key={acc.id} className="md:col-span-3 reveal group relative overflow-hidden rounded-lg bg-bark h-[420px] md:h-[500px]">
                <Image
                  src={acc.img}
                  alt={acc.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="font-body text-xs text-ember font-semibold uppercase tracking-widest mb-2">
                    From {acc.from}/night
                  </p>
                  <h3 className="font-display font-light text-parchment text-2xl mb-2">{acc.label}</h3>
                  <p className="font-body text-sm text-parchment/70 leading-relaxed mb-5 max-w-[340px]">{acc.desc}</p>
                  <Link href="/stay" className="btn-ember text-xs py-2">
                    Reserve a Dome
                  </Link>
                </div>
              </div>
            ))}

            {/* Small cards stacked */}
            <div className="md:col-span-2 flex flex-col gap-4 md:gap-5">
              {accommodations.filter(a => a.size === 'small').map((acc, i) => (
                <div key={acc.id} className={`reveal group relative overflow-hidden rounded-lg bg-bark flex-1 h-[220px] md:h-auto`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <Image
                    src={acc.img}
                    alt={acc.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-body text-xs text-ember font-semibold uppercase tracking-widest mb-1">
                      From {acc.from}/night
                    </p>
                    <h3 className="font-display font-light text-parchment text-lg mb-1">{acc.label}</h3>
                    <p className="font-body text-xs text-parchment/70 leading-relaxed hidden md:block">{acc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10 reveal">
            <Link href="/stay" className="btn-outline-dark">
              View All Accommodations
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES / AMENITIES ===================== */}
      <section className="section-dark py-20 md:py-28">
        <div className="container-content">
          <div className="reveal mb-14">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              While You're Here
            </p>
            <h2 className="heading-h2 text-parchment">More Than a<br />Place to Sleep</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            {features.map((f, i) => (
              <div key={f.label} className="reveal flex gap-5" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-10 h-10 rounded bg-moss/40 flex items-center justify-center shrink-0 text-lg mt-0.5" aria-hidden="true">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display text-parchment text-lg mb-2">{f.label}</h3>
                  <p className="font-body text-sm text-parchment/60 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 reveal">
            <Link href="/play" className="btn-ember">
              Explore Activities
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== VILLAGE CTA (full-width) ===================== */}
      <section className="section-light py-20 md:py-28">
        <div className="container-content">
          <div className="md:grid md:grid-cols-5 gap-12 md:gap-16 items-center">
            {/* Text — 3 cols */}
            <div className="md:col-span-3 reveal">
              <p className="font-body text-forest text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Seasonal Village
              </p>
              <h2 className="heading-h2 text-bark mb-6">
                Not Just a Campground.<br />A Culture.
              </h2>
              <p className="body-lead text-stone mb-6">
                Canada's missing what many other places have: Village Life — where you return each season, where your kids know the neighbours, and where life feels rich with purpose.
              </p>
              <p className="font-body text-stone text-base leading-relaxed mb-8">
                We're building a seasonal RV community for remote workers, families, and free spirits. Limited sites available.
              </p>
              <Link href="/seasonal-village" className="btn-ember">
                Claim Your Seasonal Spot
              </Link>
            </div>

            {/* Image — 2 cols */}
            <div className="md:col-span-2 reveal mt-10 md:mt-0">
              <div className="relative h-[340px] md:h-[420px] rounded-lg overflow-hidden">
                <Image
                  src="https://wellsgrayresort.ca/wp-content/uploads/2025/07/20210620_172133-EDIT-scaled.jpg"
                  alt="Wells Gray Resort seasonal community"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-forest/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WATERFALLS / EXPLORE HOOK ===================== */}
      <section className="relative section-dark py-20 md:py-28 overflow-hidden">
        <Image
          src="https://wellsgrayresort.ca/wp-content/uploads/2025/06/PXL_20230621_022025523.MP-EDIT-scaled.jpg"
          alt="Wells Gray Provincial Park landscape"
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="container-content relative z-10">
          <div className="max-w-2xl reveal">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Wells Gray Provincial Park
            </p>
            <h2 className="heading-h2 text-parchment mb-6">
              Step Outside.<br />One of Canada's Wildest Parks Begins Here.
            </h2>
            <p className="body-lead text-parchment/70 mb-8">
              Helmcken Falls — one of Canada's highest waterfalls — is 30 minutes from your campsite. Spahats, Moul, and dozens more are all within reach. We're your basecamp.
            </p>
            <Link href="/explore" className="btn-ember">
              Plan Your Adventure
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== VENUE TEASER ===================== */}
      <section className="section-light py-20 md:py-24">
        <div className="container-content">
          <div className="md:grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="reveal order-2 md:order-1 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://wellsgrayresort.ca/wp-content/uploads/2025/07/461692343_10162000088875148_5722285476960156898_n.jpg"
                alt="Wells Gray Resort wedding venue"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="reveal order-1 md:order-2">
              <p className="font-body text-forest text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Weddings &amp; Events
              </p>
              <h2 className="heading-h2 text-bark mb-5">
                A Wild, Beautiful Place to Come Together
              </h2>
              <p className="body-lead text-stone mb-6">
                Our forest-edge gazebo seats 120 people and overlooks the golf course and creek. Guests can stay on-site — no shuttle buses, no logistics headaches. Just gather, celebrate, and go to sleep under the trees.
              </p>
              <Link href="/venue" className="btn-outline-dark">
                Plan Your Event Here
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BOTTOM CTA ===================== */}
      <section className="section-dark py-20 md:py-28">
        <div className="container-content text-center">
          <div className="reveal max-w-xl mx-auto">
            <h2 className="heading-h2 text-parchment mb-5">
              Ready to Find Your Spot?
            </h2>
            <p className="body-lead text-parchment/60 mb-8">
              Summer sites fill fast — especially on long weekends. Book directly and skip the platform fees.
            </p>
            <Link href="/stay#book" className="btn-ember">
              Reserve Your Site
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

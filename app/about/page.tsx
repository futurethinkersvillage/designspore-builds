import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Wells Gray Golf & RV Resort has been welcoming families to the BC interior for generations. Here\'s where we came from and where we\'re going.',
}

export default function AboutPage() {
  return (
    <>
      <RevealInit />

      {/* Hero */}
      <section className="relative min-h-[55dvh] flex items-end section-dark overflow-hidden">
        <Image
          src="https://wellsgrayresort.ca/wp-content/uploads/2025/06/dji_fly_20240630_160720_5_1719788849030_photo_optimized-scaled.jpg"
          alt="Aerial view of Wells Gray Resort"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bark/85 to-bark/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/70 to-transparent" />
        <div className="container-content relative z-10 pb-16 pt-32">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">Our Story</p>
          <h1 className="heading-display text-parchment mb-4">
            A Place That's Been<br />Welcoming People Home
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="section-light py-20 md:py-28">
        <div className="container-content">
          <div className="md:grid md:grid-cols-5 gap-12 md:gap-20">
            <div className="md:col-span-3 space-y-6 reveal">
              <p className="font-display text-bark text-h4 font-light leading-relaxed">
                Wells Gray Golf & RV Resort sits at 6624 Clearwater Valley Road — a stretch of land that's been a gathering place for as long as people have come to this valley.
              </p>
              <p className="font-body text-stone text-base leading-relaxed">
                We're located inside the boundaries of Wells Gray Provincial Park, at the edge of Clearwater — a small town two hours north of Kamloops that most people only pass through on their way to somewhere else. We're working to change that.
              </p>
              <p className="font-body text-stone text-base leading-relaxed">
                The resort has been here for decades — hosting families, golfers, and campers who discover that Wells Gray Country has something the more famous BC destinations don't: space. Room to breathe. Trails you won't have to share. Waterfalls you'll sometimes have all to yourself.
              </p>
              <p className="font-body text-stone text-base leading-relaxed">
                Now we're building something new on the same land. A seasonal village for people who want to return each year — not just to camp, but to become part of a community. Remote workers, creative families, and people who believe that living well means living in nature, at least some of the time.
              </p>
              <p className="font-body text-stone text-base leading-relaxed">
                If you've made it this far north, you already know something most people don't: the BC interior is remarkable. We're just trying to make it worth staying a little longer.
              </p>
            </div>
            <div className="md:col-span-2 space-y-4 mt-10 md:mt-0">
              <div className="reveal relative h-[280px] rounded-lg overflow-hidden">
                <Image
                  src="https://wellsgrayresort.ca/wp-content/uploads/2024/02/PXL_20230924_013649576-scaled.jpg"
                  alt="Wells Gray Resort grounds"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="reveal relative h-[220px] rounded-lg overflow-hidden">
                <Image
                  src="https://wellsgrayresort.ca/wp-content/uploads/2025/06/PXL_20240824_0258159262-EDIT-scaled.jpg"
                  alt="Wells Gray Resort accommodation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we are */}
      <section className="section-dark py-20 md:py-24">
        <div className="container-content">
          <div className="reveal mb-12">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">What This Place Is</p>
            <h2 className="heading-h2 text-parchment">More Than a Resort</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                label: 'A Basecamp',
                desc: 'For exploring Wells Gray Provincial Park — Helmcken Falls, Spahats, Moul, and hundreds of trails. We\'re not just near the park. We\'re in it.',
              },
              {
                label: 'A Community',
                desc: 'The Seasonal Village is growing — people who return each year, build relationships, and feel genuinely at home in the forest.',
              },
              {
                label: 'A Place to Slow Down',
                desc: 'Golf in the morning. Sauna by the creek in the evening. A fire with people you like. That\'s what we\'re here for.',
              },
            ].map((item, i) => (
              <div key={item.label} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <h3 className="font-display text-parchment text-h4 mb-3">{item.label}</h3>
                <p className="font-body text-parchment/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-forest py-14">
        <div className="container-content flex flex-col sm:flex-row items-center justify-between gap-6 reveal">
          <p className="font-display text-parchment text-xl">Come see it for yourself.</p>
          <div className="flex gap-4">
            <Link href="/stay#book" className="btn-ember shrink-0">Reserve a Site</Link>
            <Link href="/contact" className="btn-outline-parchment shrink-0">Get in Touch</Link>
          </div>
        </div>
      </section>
    </>
  )
}

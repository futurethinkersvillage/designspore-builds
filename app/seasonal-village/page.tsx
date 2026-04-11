import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Seasonal Village',
  description:
    'Join the Wells Gray Seasonal Village. A limited number of seasonal RV sites for remote workers, families, and free spirits who want to return each summer and build something together.',
}

const pillars = [
  {
    label: 'Remote Work & Entrepreneurship',
    desc: 'Fast WIFI, a coworking gazebo, and a community of people building things. Create and work from the woods.',
  },
  {
    label: 'Family and Belonging',
    desc: 'Return each year to the same community. Your kids know the neighbours. You know the trails. This place becomes yours.',
  },
  {
    label: 'Living Well',
    desc: 'Sauna. Cold creek. Forest walks. Golf and disc golf. A rhythm of life that a city schedule can\'t replicate.',
  },
  {
    label: 'Building with Purpose',
    desc: 'Be part of something early. Help shape what Wells Gray Village becomes — with your ideas and your presence.',
  },
]

const included = [
  '30-amp site (50-amp upgrade coming)',
  'Fast WIFI at every site',
  'Laundry facilities',
  'Sauna access (weekly sessions)',
  'Golf & disc golf memberships (×2)',
  'Coworking gazebo access',
  'Community events',
  'Bonus: 1 night in glamping dome',
]

const comingSoon = [
  'Maker space & shared tools',
  'Community garden & shared kitchen',
  'Hot tub & outdoor gym',
  'Mini cabins & park model RVs',
  'Seasonal retreats & events',
  'Village OS — AI community assistant',
]

const faqs = [
  {
    q: 'What is the season?',
    a: 'May 1 – October 10. Seasonal pads are available for the full season or extended periods within it.',
  },
  {
    q: 'What can I bring?',
    a: 'RVs, camper vans, tiny homes, and park models. Express interest in future dome or cabin options on the waitlist form.',
  },
  {
    q: 'Can I bring my family and pets?',
    a: 'Absolutely. The village is family-friendly and pet-friendly. Many families join us for the full season.',
  },
  {
    q: 'What\'s the vibe?',
    a: 'Self-directed, creative, and community-oriented. This is not a typical campground. It\'s a culture you help build.',
  },
  {
    q: 'How far is it?',
    a: '6624 Clearwater Valley Rd, Clearwater BC — 2 hours north of Kamloops. Right inside Wells Gray Provincial Park.',
  },
]

export default function SeasonalVillagePage() {
  return (
    <>
      <RevealInit />

      {/* Hero */}
      <section className="relative min-h-[70dvh] flex items-end section-dark overflow-hidden">
        <Image
          src="/images/20210731_180321-scaled.jpg"
          alt="Wells Gray Resort seasonal village grounds"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bark/90 via-bark/60 to-bark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/80 to-transparent" />
        <div className="container-content relative z-10 pb-16 pt-32">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Seasonal Village · Limited Sites
          </p>
          <h1 className="heading-display text-parchment mb-4">
            Not Just a Campground.<br />A Culture.
          </h1>
          <p className="body-lead text-parchment/70 max-w-[560px] mb-8">
            Canada's missing what many other places have: Village Life — where you return each season, where your kids know the neighbours, and where life feels rich with purpose.
          </p>
          <Link href="#waitlist" className="btn-ember">
            Claim Your Seasonal Spot
          </Link>
        </div>
      </section>

      {/* What's missing */}
      <section className="section-dark py-20 md:py-24">
        <div className="container-content">
          <div className="md:grid md:grid-cols-2 gap-14 md:gap-20 items-center">
            <div className="reveal">
              <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">The Idea</p>
              <h2 className="heading-h2 text-parchment mb-5">
                A Seasonal Home Base for People Who Want More
              </h2>
              <p className="body-lead text-parchment/70 mb-5">
                Most campgrounds give you a spot to park. We're building something different: a recurring community of people who show up each summer, build relationships over years, and feel genuinely at home.
              </p>
              <p className="font-body text-parchment/60 text-base leading-relaxed">
                Inspired by dacha culture and seasonal cottage living — reimagined for remote workers, creative families, and people who want to live with intention.
              </p>
            </div>
            <div className="relative h-[340px] md:h-[420px] rounded-lg overflow-hidden mt-8 md:mt-0 reveal">
              <Image
                src="/images/PXL_20250629_025242307-EDIT-scaled.jpg"
                alt="Wells Gray Resort seasonal village"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-forest/20" />
            </div>
          </div>
        </div>
      </section>

      {/* 4 pillars */}
      <section className="section-light py-20 md:py-28">
        <div className="container-content">
          <div className="reveal mb-12">
            <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">What We're Building Around</p>
            <h2 className="heading-h2 text-bark">A Culture<br />Built on Four Things</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {pillars.map((p, i) => (
              <div key={p.label} className="reveal p-7 border border-bark/10 rounded-lg" style={{ transitionDelay: `${i * 80}ms` }}>
                <h3 className="font-display text-bark text-h4 mb-3">{p.label}</h3>
                <p className="font-body text-stone text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section-dark py-20 md:py-24">
        <div className="container-content">
          <div className="md:grid md:grid-cols-2 gap-14 items-start">
            <div className="reveal">
              <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">Your Site Includes</p>
              <h2 className="heading-h2 text-parchment mb-8">Everything You Need</h2>
              <ul className="space-y-3">
                {included.map(item => (
                  <li key={item} className="font-body text-parchment/70 text-sm flex gap-3">
                    <span className="text-ember shrink-0">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal mt-10 md:mt-0">
              <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">Coming to the Village</p>
              <h2 className="heading-h2 text-parchment mb-8">What's Next</h2>
              <ul className="space-y-3">
                {comingSoon.map(item => (
                  <li key={item} className="font-body text-parchment/50 text-sm flex gap-3">
                    <span className="text-parchment/30 shrink-0">○</span> {item}
                  </li>
                ))}
              </ul>
              <p className="font-body text-parchment/40 text-xs mt-6">
                Join early. Help shape what's next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist form */}
      <section id="waitlist" className="section-light py-20 md:py-28">
        <div className="container-content">
          <div className="max-w-2xl mx-auto">
            <div className="reveal text-center mb-12">
              <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-3">Limited Availability</p>
              <h2 className="heading-h2 text-bark mb-4">Join the Waitlist</h2>
              <p className="body-lead text-stone">
                We'll reach out when sites become available. Early joiners help shape the community.
              </p>
            </div>

            {/* Form — action endpoint TBD */}
            <form
              action="https://formspree.io/f/contact@wellsgrayresort.ca"
              method="POST"
              className="reveal space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="font-body text-xs font-semibold text-stone uppercase tracking-wide block mb-2">Name</label>
                  <input
                    type="text" id="name" name="name" required
                    className="w-full px-4 py-3 bg-white border border-bark/20 rounded text-bark font-body text-sm focus:outline-none focus:border-ember transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="font-body text-xs font-semibold text-stone uppercase tracking-wide block mb-2">Email</label>
                  <input
                    type="email" id="email" name="email" required
                    className="w-full px-4 py-3 bg-white border border-bark/20 rounded text-bark font-body text-sm focus:outline-none focus:border-ember transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="font-body text-xs font-semibold text-stone uppercase tracking-wide block mb-2">Phone / WhatsApp</label>
                <input
                  type="tel" id="phone" name="phone"
                  className="w-full px-4 py-3 bg-white border border-bark/20 rounded text-bark font-body text-sm focus:outline-none focus:border-ember transition-colors"
                  placeholder="+1 (250) 000-0000"
                />
              </div>
              <div>
                <label htmlFor="excites" className="font-body text-xs font-semibold text-stone uppercase tracking-wide block mb-2">What excites you most about joining?</label>
                <textarea
                  id="excites" name="excites" rows={3}
                  className="w-full px-4 py-3 bg-white border border-bark/20 rounded text-bark font-body text-sm focus:outline-none focus:border-ember transition-colors resize-none"
                  placeholder="Community, coworking, nature, kids growing up in the forest..."
                />
              </div>
              <div>
                <label htmlFor="season" className="font-body text-xs font-semibold text-stone uppercase tracking-wide block mb-2">Ideal start season</label>
                <select
                  id="season" name="season"
                  className="w-full px-4 py-3 bg-white border border-bark/20 rounded text-bark font-body text-sm focus:outline-none focus:border-ember transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="2026">2026 Season</option>
                  <option value="2027">2027 Season</option>
                  <option value="unsure">Not sure yet</option>
                </select>
              </div>
              <button type="submit" className="btn-ember w-full justify-center py-4 text-base">
                Join the Waitlist
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-dark py-16 md:py-20">
        <div className="container-content max-w-2xl mx-auto">
          <h2 className="font-display text-parchment text-h3 mb-10 reveal">Common Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="reveal border-b border-border pb-6" style={{ transitionDelay: `${i * 60}ms` }}>
                <h3 className="font-display text-parchment text-lg mb-2">{faq.q}</h3>
                <p className="font-body text-parchment/60 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

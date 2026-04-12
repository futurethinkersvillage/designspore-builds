import type { Metadata } from 'next'
import Image from 'next/image'
import RevealInit from '@/components/RevealInit'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Wells Gray Golf & RV Resort. Phone, email, or fill out the form — we\'re happy to help plan your stay.',
}

export default function ContactPage() {
  return (
    <>
      <RevealInit />

      {/* Header */}
      <section className="relative min-h-[45dvh] flex items-end section-dark overflow-hidden">
        <Image
          src="/images/20210731_180321-scaled.jpg"
          alt="Wells Gray Resort grounds"
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/80 to-bark/30" />
        <div className="container-content relative z-10 pb-14 pt-32">
          <p className="font-body text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4">Contact</p>
          <h1 className="heading-display text-parchment">Get in Touch</h1>
        </div>
      </section>

      {/* Contact content */}
      <section className="section-light py-16 md:py-24">
        <div className="container-content">
          <div className="md:grid md:grid-cols-5 gap-12 md:gap-16">
            {/* Info panel */}
            <div className="md:col-span-2 reveal">
              <h2 className="font-display text-bark text-h3 mb-8">Find Us</h2>

              <div className="space-y-7">
                <div>
                  <p className="font-body text-xs font-semibold text-stone uppercase tracking-wider mb-2">Address</p>
                  <address className="not-italic font-body text-sm text-bark leading-relaxed">
                    6624 Clearwater Valley Rd<br />
                    Clearwater, BC, Canada<br />
                    <span className="text-stone">2 hours north of Kamloops</span>
                  </address>
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-stone uppercase tracking-wider mb-2">Phone</p>
                  <a href="tel:+12506740009" className="font-body text-sm text-bark hover:text-ember transition-colors">
                    +1 (250) 674-0009
                  </a>
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-stone uppercase tracking-wider mb-2">Email</p>
                  <a href="mailto:contact@wellsgrayresort.ca" className="font-body text-sm text-bark hover:text-ember transition-colors">
                    contact@wellsgrayresort.ca
                  </a>
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-stone uppercase tracking-wider mb-2">Season</p>
                  <p className="font-body text-sm text-bark">May 1 – October 10</p>
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-stone uppercase tracking-wider mb-3">Follow Along</p>
                  <div className="flex gap-4">
                    <a href="https://www.facebook.com/wellsgrayresort" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-bark hover:text-ember transition-colors">Facebook</a>
                    <a href="https://www.instagram.com/wellsgrayresort/" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-bark hover:text-ember transition-colors">Instagram</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-3 mt-10 md:mt-0 reveal">
              <h2 className="font-display text-bark text-h3 mb-8">Send a Message</h2>
              <form
                action="https://formspree.io/f/xjkvpqeg"
                method="POST"
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="font-body text-xs font-semibold text-stone uppercase tracking-wide block mb-2">Name <span className="text-ember" aria-hidden="true">*</span></label>
                    <input
                      type="text" id="contact-name" name="name" required aria-required="true"
                      className="w-full px-4 py-3 bg-white border border-bark/20 rounded text-bark font-body text-sm focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="font-body text-xs font-semibold text-stone uppercase tracking-wide block mb-2">Email <span className="text-ember" aria-hidden="true">*</span></label>
                    <input
                      type="email" id="contact-email" name="email" required aria-required="true"
                      className="w-full px-4 py-3 bg-white border border-bark/20 rounded text-bark font-body text-sm focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 transition-colors"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="font-body text-xs font-semibold text-stone uppercase tracking-wide block mb-2">Subject</label>
                  <select
                    id="contact-subject" name="subject"
                    className="w-full px-4 py-3 bg-white border border-bark/20 rounded text-bark font-body text-sm focus:outline-none focus:border-ember transition-colors"
                  >
                    <option value="" disabled selected>What's this about?</option>
                    <option value="booking">Booking a stay</option>
                    <option value="events">Weddings or events</option>
                    <option value="seasonal">Seasonal Village</option>
                    <option value="golf">Golf rates & passes</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="font-body text-xs font-semibold text-stone uppercase tracking-wide block mb-2">Message <span className="text-ember" aria-hidden="true">*</span></label>
                  <textarea
                    id="contact-message" name="message" rows={5} required aria-required="true"
                    className="w-full px-4 py-3 bg-white border border-bark/20 rounded text-bark font-body text-sm focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 transition-colors resize-none"
                    placeholder="Tell us what you're looking for..."
                  />
                </div>
                <button type="submit" className="btn-ember w-full justify-center py-4 text-base">
                  Send My Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section-dark py-12">
        <div className="container-content reveal">
          <div className="rounded-lg overflow-hidden h-[360px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2514.8!2d-120.0374!3d51.6482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537e2b9b4d3e5555%3A0x1234!2s6624+Clearwater+Valley+Rd%2C+Clearwater%2C+BC!5e0!3m2!1sen!2sca!4v1234567890"
              title="Wells Gray Golf & RV Resort location map"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="font-body text-parchment/50 text-sm">6624 Clearwater Valley Rd, Clearwater BC — 2 hours north of Kamloops</p>
            <a
              href="https://maps.google.com/?q=6624+Clearwater+Valley+Rd,+Clearwater,+BC"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-ember hover:text-ember/80 transition-colors shrink-0 ml-4"
            >
              Open in Maps →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

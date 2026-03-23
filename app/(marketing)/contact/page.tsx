import type { Metadata } from "next";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ready to start a project? Book a strategy call or send us a message. We respond fast.",
};

const services = [
  "AI Systems & Automation",
  "Website Design & Build",
  "Brand & Identity",
  "Media & Content Production",
  "Launch Strategy",
  "Fundraising Campaign",
  "Community & Events",
  "Something else",
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-pad bg-darker border-b border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-5">Contact</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9] mb-6" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
              Let&apos;s talk.
            </h1>
            <p className="text-xl text-white/50 leading-relaxed">
              Tell us about your project and we&apos;ll get back to you within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad bg-dark">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">

            {/* Form */}
            <div className="md:col-span-7">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Your Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 rounded-lg bg-raised border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@company.com"
                      className="w-full px-4 py-3 rounded-lg bg-raised border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Company / Project</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="What are you building?"
                    className="w-full px-4 py-3 rounded-lg bg-raised border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">Service Type</label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <label key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-raised cursor-pointer hover:border-gold/40 transition-colors text-sm text-white/60 hover:text-white">
                        <input type="checkbox" name="services" value={s} className="accent-gold" />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Tell us about your project</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="What are you building? What's the timeline? What does success look like?"
                    className="w-full px-4 py-3 rounded-lg bg-raised border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark font-bold text-lg tracking-wide hover:bg-gold-light btn-press w-full sm:w-auto justify-center">
                  Send Message <ArrowRightIcon size={18} weight="bold" />
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-4 md:col-start-9">
              <div className="sticky top-24 space-y-5">

                {/* Book a Call */}
                <div className="p-6 rounded-xl border border-gold/20 bg-gold/5">
                  <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-3">Faster path</p>
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display-active, var(--font-outfit))" }}>
                    Book a Strategy Call
                  </h3>
                  <p className="text-white/50 text-sm mb-5 leading-relaxed">
                    30 minutes. We&apos;ll understand your goals, share our thinking, and tell you honestly if we&apos;re a fit.
                  </p>
                  <a href="http://futurethinkers.org/call60" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded bg-gold text-dark font-bold text-sm tracking-wide hover:bg-gold-light btn-press w-full">
                    Book Now <ArrowRightIcon size={13} weight="bold" />
                  </a>
                </div>

                {/* Details */}
                <div className="p-6 rounded-xl border border-white/10 bg-raised space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">Based in</p>
                    <p className="text-white/70 text-sm">Clearwater, BC · Canada</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">Response time</p>
                    <p className="text-white/70 text-sm">Within 1 business day</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-1">Services</p>
                    <div className="flex flex-col gap-1 mt-2">
                      <a href="/ai-services" className="text-white/50 hover:text-gold transition-colors text-sm">AI Services →</a>
                      <a href="/launch-services" className="text-white/50 hover:text-gold transition-colors text-sm">Launch Services →</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

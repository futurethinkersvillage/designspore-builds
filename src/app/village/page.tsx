"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoGrid from "@/components/ui/PhotoGrid";
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  Heart,
  Wrench,
  Briefcase,
  House,
  WifiHigh,
  Golf,
  Star,
  CaretDown,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/wells-gray-golf-rv-06-1024x685.jpg"
          alt="Wells Gray Village — 400 acres in Interior BC"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/80 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
          >
            Explore Village Life &mdash; Just 2 Hours North of Kamloops, BC, Canada
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Wells Gray
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              Village.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            Your Seasonal Sanctuary: In Interior BC, Canada
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="https://wellsgrayresort.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Book Your Stay <ArrowUpRight size={14} weight="bold" />
            </a>
            <Link
              href="/workstay"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              Work-Stay Cohorts <ArrowRight size={14} />
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              Explore Membership <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {[
              { value: "400", unit: "ac", label: "Private land" },
              { value: "5+", unit: "yrs", label: "In operation" },
              { value: "50\u00B0", unit: "N", label: "Latitude" },
              { value: "24\u00B0C", unit: "avg", label: "Summer high" },
            ].map((s) => (
              <div key={s.label} className="px-6 py-5 first:pl-0">
                <div className="font-mono text-xl font-light text-white tabular-nums">
                  {s.value}
                  <span className="ml-1 text-sm text-amber">{s.unit}</span>
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FirstPrototype() {
  const values = [
    { icon: Briefcase, label: "Remote Work & Entrepreneurship", body: "With creativity, freedom, and opportunities." },
    { icon: Heart, label: "Family and Belonging", body: "Reconnect with the same people year after year." },
    { icon: Users, label: "Living Well", body: "With health, nature, and rhythm." },
    { icon: Wrench, label: "Building with Purpose", body: "With your hands and your ideas." },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            The vision
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            The First Village<br />
            <span className="italic">Prototype</span>
          </h2>
          <p className="mt-8 text-sm leading-relaxed text-white/45 max-w-[52ch]">
            Most places give you scenery. We&apos;re building community. Canada&apos;s missing
            what many other places have: Village Life — where you return each season,
            where your kids know the neighbors, and where life feels rich with purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-[#0F0E12] p-8"
            >
              <v.icon size={20} weight="light" className="text-amber mb-5" />
              <div className="text-sm font-medium text-white mb-2">{v.label}</div>
              <div className="text-sm leading-relaxed text-white/40">{v.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Amenities() {
  const amenities = [
    { icon: Users, label: "Community Spaces", body: "Spaces for coworking, community events, and gatherings." },
    { icon: Heart, label: "Infrastructure That Supports Health", body: "Sauna, cold creek, nature immersion, forest paths." },
    { icon: House, label: "Your Seasonal Home Base", body: "Full hookup or creek side sites for RVs (30 amp, soon to be 50 amp)" },
    { icon: WifiHigh, label: "Fast Internet", body: "WIFI access at every site, and a coworking gazebo." },
    { icon: Golf, label: "Golf & Disc Golf", body: "9-hole golf course and 18-hole disc golf course amidst breathtaking nature." },
    { icon: Star, label: "Unique Experiences", body: "Geodesic glamping dome, cultural events & gatherings." },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            On the property
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Village Amenities<br />
            <span className="italic">What You Get</span>
          </h2>
          <p className="mt-4 text-sm text-white/40 max-w-[48ch]">
            Inspired by dacha culture and seasonal cottage living, reimagined for modern life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.07, duration: 0.4 }}
              className="bg-warm-dark p-7"
            >
              <a.icon size={18} weight="light" className="text-amber mb-4" />
              <div className="text-sm font-medium text-white mb-2">{a.label}</div>
              <div className="text-sm leading-relaxed text-white/35">{a.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkStayCTA() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_42%]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              May 1 &ndash; 31, 2026
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Join the 2026<br />
              <span className="italic">Village Builder</span><br />
              Work-stay Cohort
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              Be part of a select group of people who will help turn our 400-acre
              campsite, golf course, and forest into a living Village prototype.
              We&apos;re inviting hands-on builders, technologists, creatives, and
              community-minded humans to live on the land, help run the existing
              hospitality operations, and co-create the events, maker space, art
              installations, and systems that will define our first village — and the
              network of villages that follow.
            </p>
            <div className="mt-10">
              <Link
                href="/workstay"
                className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
              >
                Apply <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "400px" }}>
            <Image
              src="/images/wood-working-building-desk-scaled.jpg"
              alt="Building at the village"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FutureOfLiving() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            The way people live is changing
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            The Future of Living<br />
            <span className="italic">And Why We&apos;re Building It</span>
          </h2>
        </div>

        <div className="space-y-5 text-sm leading-relaxed text-white/45 max-w-[60ch]">
          <p>
            They want the freedom to work from anywhere, a place to create and live
            well, and a community that feels like home. We&apos;re building for that
            future — starting here.
          </p>
          <p>
            Soon, we&apos;ll be expanding the Wells Gray Village with new cabins, long-term
            RV sites, glamping units, and more shared infrastructure for wellness,
            co-working, art and maker culture. But that&apos;s just the beginning. This
            place is a first in a North network of Villages — designed for people who
            want to live with purpose, build with others, and stay connected across
            every season.
          </p>
        </div>
      </div>
    </section>
  );
}

function TheLand() {
  const images = [
    { src: "/images/gazebo-campfire.png", alt: "Gazebo campfire" },
    { src: "/images/gemini-2e4dc4.png", alt: "Village concept" },
    { src: "/images/gazebo-interior-scaled.jpg", alt: "Gazebo interior" },
    { src: "/images/wood-working-building-desk-scaled.jpg", alt: "Woodworking building desk" },
    { src: "/images/shower-house-scaled.jpg", alt: "Shower house" },
    { src: "/images/rv-in-campsite-scaled.jpg", alt: "RV in campsite" },
    { src: "/images/disc-golf-tournament-scaled.jpg", alt: "Disc golf tournament" },
    { src: "/images/camper-at-night-scaled.jpg", alt: "Camper at night" },
    { src: "/images/horses.jpg", alt: "Horses" },
    { src: "/images/the-creek-scaled.jpg", alt: "The creek" },
    { src: "/images/camper-daytime-scaled.jpg", alt: "Camper during the day" },
    { src: "/images/cabins-scaled.jpg", alt: "Cabins" },
    { src: "/images/buildings-in-winter-scaled.jpg", alt: "Buildings in winter" },
    { src: "/images/creek-view-1-scaled.jpg", alt: "Creek view" },
    { src: "/images/creek-view-2-scaled.jpg", alt: "Creek view alternate" },
    { src: "/images/swimming-lake-scaled.jpg", alt: "Swimming lake" },
    { src: "/images/horses-in-field-scaled.jpg", alt: "Horses in the field" },
    { src: "/images/kids-on-trampoline-scaled.jpg", alt: "Kids on trampoline" },
    { src: "/images/bear-scaled.jpg", alt: "Bear" },
    { src: "/images/campfire-in-gazebo-scaled.jpg", alt: "Campfire in gazebo" },
    { src: "/images/shower-house-in-field-scaled.jpg", alt: "Shower house in field" },
    { src: "/images/moose-at-lake-scaled.jpg", alt: "Moose at lake" },
    { src: "/images/meditation-group.jpg", alt: "Meditation group" },
    { src: "/images/gazebo-community-meetup-scaled.jpg", alt: "Community meetup" },
    { src: "/images/gazebo-interior-campfire-1024x771.jpg", alt: "Gazebo interior campfire" },
    { src: "/images/gazebo-disc-golf-tournament-scaled.jpg", alt: "Gazebo disc golf tournament" },
    { src: "/images/dome-interior-scaled.jpg", alt: "Dome interior" },
    { src: "/images/aurora-at-night-scaled.jpg", alt: "Aurora at night" },
    { src: "/images/kids-playing-golf-scaled.jpg", alt: "Kids playing golf" },
    { src: "/images/canada-day-meetup-scaled.jpg", alt: "Canada Day meetup" },
    { src: "/images/gazebo-rainbow-scaled.jpg", alt: "Gazebo rainbow" },
    { src: "/images/rv-interior.jpg", alt: "RV interior" },
    { src: "/images/rv-interior-2.jpg", alt: "RV interior alternate" },
    { src: "/images/dome-movie-watching.jpg", alt: "Dome movie watching" },
    { src: "/images/dome-at-night-scaled.jpg", alt: "Dome at night" },
    { src: "/images/sauna-in-winter-scaled.jpg", alt: "Sauna in winter" },
    { src: "/images/cabin-scaled.jpg", alt: "Cabin" },
    { src: "/images/gazebo-view-scaled.jpg", alt: "Gazebo view" },
    { src: "/images/golf-course-3.jpg", alt: "Golf course" },
    { src: "/images/picnic-tables-creek.jpg", alt: "Picnic tables by the creek" },
    { src: "/images/gazebo-interior-2.jpg", alt: "Gazebo interior alternate" },
  ];

  return (
    <section id="land" className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Get a Feel for the Village
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            The<br />
            <span className="italic">Land</span>
          </h2>
          <p className="mt-4 text-sm text-white/40 max-w-[48ch]">
            Browse real images of our dome, sauna, event spaces, RV sites, golf course,
            and views to experience the landscape that&apos;s already drawing guests and
            community.
          </p>
        </div>

        <PhotoGrid
          photos={images}
          cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
    </section>
  );
}

function ComingSoon() {
  const items = [
    "Maker space & upgraded co-working gazebo",
    "Community garden, shared kitchen, and food truck",
    "Hot tub, outdoor gym, and more wellness facilities",
    "Mini cabins, domes, and long term RVs sites",
    "Seasonal gatherings, events & immersions",
    "Village Ai \u2014 our AI-powered community assistant",
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[40%_1fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              What&apos;s next
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Coming Soon<br />
              <span className="italic">to Wells Gray Village</span>
            </h2>
            <p className="mt-8 text-sm text-white/45 max-w-[38ch]">
              Visit or apply to join &amp; help shape what&apos;s next.
            </p>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {items.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 py-5"
              >
                <span className="font-mono text-xs text-white/20 w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-white/55">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VisitCTA() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_40%]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Come see it<br />
              <span className="italic">for yourself.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <a
              href="https://wellsgrayresort.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl bg-white/10 px-6 py-5 transition-all hover:bg-white/20"
            >
              <div>
                <div className="text-sm font-medium text-white">Visit</div>
                <div className="mt-1 text-xs text-white/60 max-w-[38ch]">
                  Join a gathering, work-stay program, or village immersion. Get a taste
                  of village life &amp; discover everything that Wells Gray Village has to
                  offer.
                </div>
              </div>
              <ArrowUpRight size={14} weight="bold" className="text-white/50 shrink-0 ml-4" />
            </a>
            <Link
              href="/membership"
              className="group flex items-center justify-between rounded-2xl bg-white/10 px-6 py-5 transition-all hover:bg-white/20"
            >
              <div>
                <div className="text-sm font-medium text-white">Explore Membership</div>
                <div className="mt-1 text-xs text-white/60 max-w-[38ch]">
                  Access exclusive member benefits, village programs, and private
                  opportunities. Help shape the future of the Village campus from the
                  beginning.
                </div>
              </div>
              <ArrowRight size={14} weight="bold" className="text-white/50 shrink-0 ml-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "When is the opening season?", a: "Wells Gray Village is open from May 1 to early October every year. We are closed in the winter months." },
    { q: "What types of accommodation are available at the village?", a: "We currently offer RV sites, on-site RV rentals, a geodesic dome, bunk cabins, horse corrals, and tenting sites. Cabins, long term RV sites, and more glamping options are coming soon." },
    { q: "What kind of amenities does the village offer?", a: "Amenities include a 120 person gazebo plus several smaller gazebos, a 9 hole golf course and 18 hole disc golf course, pro shop, modern bathrooms and showers, small garden, maker space (members only), private swimming lake, and forest trails." },
    { q: "What kind of programs or events are there?", a: "The village hosts public gatherings, work-stay programs, village immersions, a number of members-only events, and more. Guests are also able to book the venue for events such as weddings, family reunions, tournaments, and retreats." },
    { q: "Can I bring pets?", a: "Yes, the village is pet friendly. Dogs are welcome on leash, and we have 20 horse corrals for guests who travel with their horses." },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[35%_1fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              Your questions answered
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              FAQ
            </h2>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  className="flex w-full items-center justify-between py-6 text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={`text-amber shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      id={`faq-answer-${i}`}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm leading-relaxed text-white/40">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VillagePage() {
  return (
    <>
      <Hero />
      <FirstPrototype />
      <Amenities />
      <WorkStayCTA />
      <FutureOfLiving />
      <TheLand />
      <ComingSoon />
      <VisitCTA />
      <FAQ />
    </>
  );
}

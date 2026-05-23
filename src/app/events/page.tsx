"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarBlank,
  CalendarPlus,
  Campfire,
  Drop,
  Flower,
  Golf,
  MapPin,
  PaintBrushBroad,
  Sparkle,
  TreeEvergreen,
} from "@phosphor-icons/react";

/* ── Constants ────────────────────────────────────────────────────── */

const CHECKFRONT_BASE = "https://wellsgraygolfresorta.checkfront.com/reserve/";
const CALENDAR_SUBSCRIBE =
  "https://calendar.google.com/calendar/r?cid=ib00q6q9c9mvamtcmjftef5e3o@group.calendar.google.com";

function gcalLink({
  title,
  start,
  end,
  location,
  details,
}: {
  title: string;
  start: string; // YYYYMMDD
  end: string;   // YYYYMMDD (exclusive)
  location: string;
  details: string;
}) {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const p = (s: string) => encodeURIComponent(s);
  return `${base}&text=${p(title)}&dates=${start}%2F${end}&location=${p(location)}&details=${p(details)}`;
}

const RESORT_LOCATION = "6624 Clearwater Valley Rd, Clearwater, BC";

/* ── Hero ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-[88dvh] overflow-hidden bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/events/hero.jpg"
          alt="A lit sculpture beside picnic tables at Wells Gray Golf & RV Resort"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "brightness(0.42)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/75 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-28 pb-20 lg:px-16 lg:pt-36 lg:pb-28">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber mb-6 lg:text-xs lg:mb-8"
          >
            Wells Gray Golf &amp; RV Resort · 2026
          </motion.p>

          <div className="overflow-hidden pb-6 -mb-6 lg:pb-10 lg:-mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,12vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Reasons
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-6 -mb-6 lg:pb-10 lg:-mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,12vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              To Gather.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 max-w-[58ch] text-[15px] leading-relaxed text-white/70 lg:mt-10 lg:text-base lg:text-white/65"
          >
            Rural life is rich with activity, but neighbours can go weeks without
            crossing paths. This summer we&apos;re creating more reasons to gather —
            a weekly Sunday rhythm to bring the community together, alongside a
            handful of larger gatherings that turn this place into a cultural
            center of gravity in the region.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3 lg:mt-10 lg:gap-4"
          >
            <a
              href="#sundays"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              See the Sunday rhythm <ArrowRight size={14} weight="bold" />
            </a>
            <a
              href="#special"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white/85 transition-colors hover:border-white/50 hover:text-white"
            >
              Special events
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex items-center gap-2 text-xs text-white/55 lg:mt-12"
          >
            <MapPin size={14} weight="light" className="text-amber/70" />
            <span>6624 Clearwater Valley Rd, Clearwater, BC</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Sunday rhythm ────────────────────────────────────────────────── */

function SundayRhythm() {
  const cohorts = [
    {
      month: "June",
      dates: "7 · 14 · 21 · 28",
      bookingUrl: `${CHECKFRONT_BASE}?item.id.150=1`,
      status: "open" as const,
    },
    {
      month: "July",
      dates: "5 · 12 · 19 · 26",
      status: "soon" as const,
      opens: "Opens Jun 1",
    },
    {
      month: "August",
      dates: "9 · 16 · 23 · 30",
      status: "soon" as const,
      opens: "Opens Jul 1",
    },
  ];

  const smallCards = [
    {
      icon: Drop,
      label: "Community Sauna",
      time: "Sundays · 5:00 – 6:00 PM",
      price: "$15/person · $40/family",
      body: "Sauna, river cold plunge, and good conversations. Open to community members and residents of Clearwater and surrounding areas.",
      bookingUrl: `${CHECKFRONT_BASE}?item.id.139=1`,
    },
    {
      icon: Campfire,
      label: "Campfire",
      time: "Sundays · 6:00 – 7:00 PM",
      price: "Free · all welcome",
      body: "A fire, some chairs, no agenda. Musical instruments are welcome. The way humans have gathered for millennia.",
      bookingUrl: null,
    },
    {
      icon: Golf,
      label: "Golf & Disc Golf",
      time: "Available all day",
      price: "Golf $30 · Disc Golf $10",
      body: "9-hole golf and disc golf courses open throughout the day at drop-in rates. Carts and rentals available.",
      bookingUrl: `${CHECKFRONT_BASE}?item.id.18=1`,
    },
  ];

  return (
    <section id="sundays" className="bg-warm-dark py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            Every Sunday
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            A Weekly<br />
            <span className="italic">Rhythm.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-white/65 max-w-[58ch] lg:mt-8 lg:text-sm lg:text-white/60">
            Forest school for kids, golf and disc golf, community sauna, and a
            campfire to close the day. Come out as a family, bring the
            neighbours, stay for a part or all of it.
          </p>
        </div>

        {/* Forest School — featured card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] lg:mb-5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
            <div className="p-7 lg:p-10">
              <div className="flex items-center gap-2 mb-5">
                <TreeEvergreen size={20} weight="light" className="text-amber" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber/80">
                  Featured · weekly cohort
                </span>
              </div>
              <h3 className="font-serif text-3xl font-light leading-[1.1] text-white lg:text-4xl">
                Forest School
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/55">
                <span>Sundays · 2:00 – 4:45 PM</span>
                <span aria-hidden className="text-white/25">·</span>
                <span>Ages 5–12</span>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-white/65 max-w-[44ch] lg:text-[14.5px] lg:text-white/60">
                An afternoon on the land for the kids — outdoor exploration,
                stories, songs, and crafts focused on building a genuine
                connection with the natural world. Join as a family, or drop the
                kids off and take the afternoon to golf or hike. Parents welcome
                to join; younger siblings welcome with a parent.
              </p>
              <div className="mt-6 inline-flex items-baseline gap-2 rounded-full border border-amber/30 bg-amber/[0.08] px-4 py-2 text-sm text-amber">
                <span className="font-medium">$99</span>
                <span className="text-amber/80">per child / cohort</span>
                <span className="text-amber/50 text-xs">· 2026 intro rate</span>
              </div>
            </div>

            <div className="border-t border-white/[0.06] bg-white/[0.025] p-7 lg:border-l lg:border-t-0 lg:p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45 mb-5">
                2026 cohorts
              </p>
              <div className="space-y-4">
                {cohorts.map((c) => (
                  <div
                    key={c.month}
                    className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="font-serif text-2xl font-light text-white lg:text-[26px] shrink-0">
                      {c.month}
                    </span>
                    <span className="font-mono text-[13px] tracking-wider text-white/55 flex-1 text-center hidden sm:block">
                      {c.dates}
                    </span>
                    {c.status === "open" ? (
                      <a
                        href={c.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber/15 px-3 py-1 text-[12px] font-medium text-amber hover:bg-amber/25 transition-colors"
                      >
                        Register <ArrowRight size={10} weight="bold" />
                      </a>
                    ) : (
                      <span className="shrink-0 text-[11px] text-white/30 italic">
                        {c.opens}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[13px] leading-relaxed text-white/45">
                Four-Sunday cohorts. Register once per month.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sauna + Campfire + Golf */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
          {smallCards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7 lg:p-8"
            >
              <c.icon size={22} weight="light" className="text-amber mb-5" />
              <h3 className="text-lg font-medium text-white lg:text-[17px]">
                {c.label}
              </h3>
              <p className="mt-1 text-[13px] text-white/50">{c.time}</p>
              <p className="mt-4 flex-1 text-[14px] leading-relaxed text-white/60 lg:text-[13.5px] lg:text-white/55">
                {c.body}
              </p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-[13px] font-medium text-amber/90">
                  {c.price}
                </span>
                {c.bookingUrl && (
                  <a
                    href={c.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-white/50 hover:text-white/80 transition-colors"
                  >
                    Book <ArrowRight size={10} weight="bold" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Special events ───────────────────────────────────────────────── */

type SpecialEvent = {
  monthLabel: string;
  dayLabel: string;
  yearLabel: string;
  icon: React.ComponentType<{ size?: number; weight?: "light" | "bold"; className?: string }>;
  badge: string;
  title: string;
  meta: string;
  body: string;
  image?: string;
  imageAlt?: string;
  calendarUrl: string;
};

function SpecialEventCard({ event, i }: { event: SpecialEvent; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: i * 0.05, duration: 0.55 }}
      className="grid grid-cols-1 gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 sm:grid-cols-[120px_1fr] sm:gap-8 sm:p-8 lg:grid-cols-[140px_1fr_minmax(0,1.1fr)] lg:gap-10 lg:p-10"
    >
      {/* Date tile */}
      <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-0">
        <div className="rounded-2xl border border-amber/25 bg-amber/[0.06] px-5 py-4 text-center">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber/85">
            {event.monthLabel}
          </div>
          <div className="font-serif text-3xl font-light leading-none text-white lg:text-4xl">
            {event.dayLabel}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
            {event.yearLabel}
          </div>
        </div>
        <event.icon size={22} weight="light" className="text-amber/70 sm:mt-6" />
      </div>

      {/* Body */}
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber/80 mb-3">
          {event.badge}
        </p>
        <h3 className="font-serif text-[26px] font-light leading-[1.15] text-white lg:text-[32px]">
          {event.title}
        </h3>
        <p className="mt-2 text-[13px] text-white/45">{event.meta}</p>
        <p className="mt-5 text-[15px] leading-relaxed text-white/65 lg:text-[14.5px] lg:text-white/60">
          {event.body}
        </p>
        <a
          href={event.calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-amber/80 transition-colors"
        >
          <CalendarPlus size={13} weight="light" />
          Add to Google Calendar
        </a>
      </div>

      {/* Image (optional) */}
      {event.image && (
        <div className="relative hidden overflow-hidden rounded-xl lg:block">
          <Image
            src={event.image}
            alt={event.imageAlt || ""}
            fill
            sizes="(max-width: 1024px) 0px, 400px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-dark/40 to-transparent" />
        </div>
      )}
    </motion.article>
  );
}

function SpecialEvents() {
  const events: SpecialEvent[] = [
    {
      monthLabel: "May",
      dayLabel: "31",
      yearLabel: "2026",
      icon: Flower,
      badge: "Free · all welcome",
      title: "Community Garden Day & Forest School Free Drop-In",
      meta: "Sunday afternoon · before the summer cohorts begin",
      body: "A free afternoon before the summer cohorts begin. Come work in the garden, let the kids join a drop-in forest school session, and meet some of the people who'll be here this summer. Open to neighbours, local families, and guests.",
      calendarUrl: gcalLink({
        title: "Community Garden Day & Forest School Free Drop-In",
        start: "20260531",
        end: "20260601",
        location: RESORT_LOCATION,
        details:
          "A free afternoon before the summer cohorts begin. Come work in the garden, let the kids join a drop-in forest school session, and meet some of the people who'll be here this summer. Open to neighbours, local families, and guests. Wells Gray Golf & RV Resort.",
      }),
    },
    {
      monthLabel: "Jun",
      dayLabel: "19–21",
      yearLabel: "2026",
      icon: PaintBrushBroad,
      badge: "Artist gathering · planning weekend",
      title: "Artist Gathering",
      meta: "Calling all artists from across Western Canada — Vancouver, Calgary, and beyond",
      body: "A weekend gathering for artists who want to leave something lasting here. We'll walk the land together, share ideas, and begin shaping a vision for permanent art installations that grow out of this place — its ecology, its history, and its people. This is the planning phase: no building yet, just presence, conversation, and creative ground-laying.",
      image: "/images/events/artist-gathering.jpg",
      imageAlt: "Forest art walk at night with glowing totems",
      calendarUrl: gcalLink({
        title: "Artist Gathering — Wells Gray",
        start: "20260619",
        end: "20260622",
        location: RESORT_LOCATION,
        details:
          "A weekend gathering for artists who want to leave something lasting here. Walk the land, share ideas, and begin shaping a vision for permanent art installations. Calling artists from across Western Canada — Vancouver, Calgary, and beyond.",
      }),
    },
    {
      monthLabel: "Sep",
      dayLabel: "7–14",
      yearLabel: "2026",
      icon: Sparkle,
      badge: "Residency + community gathering",
      title: "Artist Residency & Community Gathering",
      meta: "Building week culminating in a community event for 100–200 people",
      body: "What was conceived in June gets built in September. Artists return to the land to construct the installations — working alongside community members, builders, and volunteers. The residency closes with a ticketed community gathering: live music, art, shared meals, and the chance to experience what this place is becoming. Small-scale, rooted in the land, made by the people.",
      calendarUrl: gcalLink({
        title: "Artist Residency & Community Gathering — Wells Gray",
        start: "20260907",
        end: "20260915",
        location: RESORT_LOCATION,
        details:
          "Artists return to build the installations, with a closing ticketed community gathering: live music, art, shared meals. Small-scale, rooted in the land, made by the people. Wells Gray Golf & RV Resort.",
      }),
    },
  ];

  return (
    <section id="special" className="bg-[#0F0E12] py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            Three larger gatherings
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Special<br />
            <span className="italic">Events.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-white/65 max-w-[58ch] lg:mt-8 lg:text-sm lg:text-white/60">
            Alongside the weekly rhythm, we&apos;re inviting artists from across
            Western Canada to help shape this place into something worth coming
            back to season after season.
          </p>
        </div>

        <div className="space-y-4 lg:space-y-5">
          {events.map((e, i) => (
            <SpecialEventCard key={e.title} event={e} i={i} />
          ))}
        </div>

        <p className="mt-12 text-[13px] text-white/45 lg:mt-16">
          Details on tickets, artist applications, and participation coming soon.
        </p>
      </div>
    </section>
  );
}

/* ── Closing ──────────────────────────────────────────────────────── */

function Closing() {
  return (
    <section className="bg-warm-dark py-20 lg:py-28">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-16">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-10 text-center lg:p-16">
          <CalendarBlank size={26} weight="light" className="mx-auto text-amber mb-5" />
          <h2 className="font-serif text-3xl font-light leading-[1.1] text-white lg:text-4xl">
            Add our calendar<br />
            <span className="italic">to yours.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/65 max-w-[46ch] mx-auto lg:text-sm lg:text-white/60">
            Subscribe to the events calendar and stay in the loop on Sunday
            sessions, special events, and details as they&apos;re confirmed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={CALENDAR_SUBSCRIBE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Subscribe to Calendar <ArrowRight size={14} weight="bold" />
            </a>
            <a
              href="https://wellsgrayresort.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              Book a stay <ArrowUpRight size={13} weight="bold" />
            </a>
          </div>
          <p className="mt-10 text-xs uppercase tracking-[0.2em] text-white/35">
            Wells Gray Golf &amp; RV Resort
          </p>
          <p className="mt-2 text-[13px] text-white/50">
            6624 Clearwater Valley Rd, Clearwater, BC
          </p>
        </div>

        <p className="mt-10 text-center font-serif text-2xl italic font-light text-white/70 lg:text-3xl">
          See you out there.
        </p>
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function EventsPage() {
  return (
    <>
      <Hero />
      <SundayRhythm />
      <SpecialEvents />
      <Closing />
    </>
  );
}

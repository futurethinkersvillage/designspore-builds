"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PhotoGrid from "@/components/ui/PhotoGrid";
import {
  ArrowRight,
  Users,
  Mountains,
  Handshake,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/76747423_10163561173205725_3017674924459294720_n-1024x577.jpg"
          alt="Mike and Euvie at Portal.Place"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/90 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="max-w-3xl">
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Our
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              Story.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            Why we set out to build a better way to live, and what comes next.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function ItBeganWithAQuestion() {
  const photos = [
    { src: "/images/about-travel-1.jpg", alt: "Early travels" },
    { src: "/images/about-travel-2.jpg", alt: "Exploring the world" },
    { src: "/images/76747423_10163561173205725_3017674924459294720_n-1024x577.jpg", alt: "Mike and Euvie" },
    { src: "/images/about-travel-3.jpg", alt: "On the road" },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              The beginning
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-10">
              It began with<br />
              <span className="italic">a question</span>
            </h2>
            <div className="space-y-5 text-sm leading-relaxed text-white/45 max-w-[52ch]">
              <p className="text-lg leading-relaxed text-white/60 italic font-serif">
                How do humans live well — really live well — in a world changing this fast?
              </p>
              <p>
                We (Euvie and Mike) met in Vancouver in our early 20s. We were
                freelancing in creative industries – Mike as a recording engineer
                and lighting technician on film sets, Euvie as a photographer and
                actress.
              </p>
              <p>
                We were curious, restless, and painfully aware that modern life —
                despite convenience and comfort — was making people lonely,
                disconnected, stressed, and numb to each other and to nature.
              </p>
              <p>
                So we started an online content creation service, and we left.
                Backpacks and one-way tickets with no plan beyond listening for
                what mattered.
              </p>
              <p className="text-white/60 font-medium">
                That decision changed everything.
              </p>
            </div>
          </div>

          <PhotoGrid
            photos={photos}
            cols="grid-cols-2"
            gap="gap-3"
            sizes="(max-width: 1024px) 50vw, 33vw"
            rounded="rounded-2xl"
            staggerMod={2}
          />
        </div>
      </div>
    </section>
  );
}

function NomadicLearning() {
  const photos = [
    { src: "/images/ft-podcast-cover.jpg", alt: "Future Thinkers Podcast" },
    { src: "/images/about-nomad-1.jpg", alt: "Nomadic life" },
    { src: "/images/about-nomad-2.jpg", alt: "Exploring cultures" },
    { src: "/images/about-nomad-3.jpg", alt: "Building community abroad" },
    { src: "/images/about-nomad-4.jpg", alt: "Learning freely" },
    { src: "/images/about-nomad-5.jpg", alt: "A decade of travel" },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            The journey
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            A decade of<br />
            <span className="italic">nomadic learning</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div className="space-y-5 text-sm leading-relaxed text-white/45 max-w-[52ch]">
            <p>
              From Europe to Southeast Asia to South America, we lived in dozens
              of countries, launched the Future Thinkers Podcast, built online
              businesses, lived cheaply, learned freely, and connected with
              thinkers, artists, technologists, philosophers, and community
              builders from around the world.
            </p>
            <p>
              We experienced the freedom many people dream of — but also
              discovered the limits of rootlessness.
            </p>
            <p className="text-white/60 font-medium">
              Community matters. Stability matters. Shared culture matters.
            </p>
            <p>
              A life in motion can be expansive, but not always grounding.
            </p>
            <p>
              When we had children, we knew it was time for a deeper kind of
              home.
            </p>
          </div>

          <PhotoGrid
            photos={photos}
            cols="grid-cols-3"
            gap="gap-3"
            sizes="(max-width: 1024px) 33vw, 25vw"
            rounded="rounded-2xl"
            staggerMod={3}
          />
        </div>
      </div>
    </section>
  );
}

function ReturningHome() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            Coming home
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-10">
            Returning home —<br />
            <span className="italic">to build what we<br />couldn&apos;t find</span>
          </h2>
          <div className="space-y-5 text-sm leading-relaxed text-white/45 max-w-[52ch]">
            <p>
              We returned to British Columbia and began building something we
              wished existed in the world:
            </p>
            <p className="text-white/60 font-medium">
              A place where people could live closer to nature, raise families in
              community, create, learn, heal, build, and grow — not just
              vacation.
            </p>
            <p>
              Not a utopia. Not escapism. A living prototype for the future.
            </p>
            <p>
              That vision became Portal.Place — and the first village took root
              on a 400-acre riverside property near Wells Gray Park.
            </p>
            <p>
              Today it includes RV and tenting sites, bunk cabins, a geodesic
              dome, sauna and cold plunge, kids&apos; play areas, woodworking
              shop, maker-space, small gardens, horse corrals, event gazebos,
              private lake access, and acres of forest and water.
            </p>
            <p className="text-white/60 font-medium">
              It&apos;s early — but it&apos;s real. And growing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySmartVillages() {
  const bullets = [
    "People return seasonally to the same place, year after year",
    "Families grow beside friends, not alone behind walls",
    "Creativity, wellness, and cooperation become normal, not rare",
    "Nature and technology coexist — instead of competing",
    "Villages form a network, not isolated pockets",
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            The vision
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-10">
            Why Smart Villages —<br />
            <span className="italic">why now</span>
          </h2>
          <div className="space-y-5 text-sm leading-relaxed text-white/45 max-w-[52ch]">
            <p>
              We believe the world is entering a post-job era where automation,
              AI, loneliness, and rising costs are pressuring people to rethink
              how they live.
            </p>
            <p className="text-white/60 font-medium">We see a future where:</p>
            <ul className="space-y-3 pl-1">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="text-white/60 font-medium">
              Portal.Place isn&apos;t just land. It&apos;s a pattern — one
              village leading to many.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhereWereGoing() {
  const ctas = [
    {
      icon: Users,
      title: "Become A Member",
      body: "Join the founding community shaping this new way of living.",
      href: "/membership",
    },
    {
      icon: Mountains,
      title: "Live or Visit",
      body: "Experience it for yourself — nature, community, rhythm.",
      href: "/village",
    },
    {
      icon: Handshake,
      title: "Invest",
      body: "Help bring the next village online and support long-term regeneration.",
      href: "/partner",
    },
  ];

  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl mb-16">
          <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl mb-10">
            Where we&apos;re going —<br />
            <span className="italic">and how to be<br />part of it.</span>
          </h2>
          <div className="space-y-5 text-sm leading-relaxed text-white/80 max-w-[52ch]">
            <p>
              We&apos;re growing Wells Gray into a full-season Smart Village and
              preparing to expand into additional locations over time —
              connecting them into a single membership-based network.
            </p>
            <p>
              This project is still being built — and we&apos;re building it
              with others.
            </p>
            <p className="font-medium text-white">
              If this resonates, there are three ways to engage:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ctas.map((cta, i) => (
            <motion.div
              key={cta.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={cta.href}
                className="group block rounded-2xl bg-white/15 p-8 backdrop-blur-sm transition-all hover:bg-white/25"
              >
                <cta.icon
                  size={28}
                  weight="light"
                  className="text-white mb-5"
                />
                <h3 className="font-serif text-2xl font-light text-white mb-3">
                  {cta.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/70 mb-6">
                  {cta.body}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white transition-all group-hover:gap-3">
                  Learn more <ArrowRight size={13} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Hero />
      <ItBeganWithAQuestion />
      <NomadicLearning />
      <ReturningHome />
      <WhySmartVillages />
      <WhereWereGoing />
    </>
  );
}

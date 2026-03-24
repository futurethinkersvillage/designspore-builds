"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MicrophoneStage,
  TreeEvergreen,
  Globe,
  ArrowUpRight,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/76747423_10163561173205725_3017674924459294720_n-1024x577.jpg"
          alt="Mike and Euvie — Portal.Place founders"
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/90 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
          >
            Portal.Place — Our story
          </motion.p>

          <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              We moved to
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              the mountains.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            Mike Gilliland and Euvie Ivanova are the co-founders of Portal.Place,
            Future Thinkers, and Canada&apos;s first Smart Village prototype. In 2020
            they left city life for 400 acres in BC — not as a retreat, but as an
            experiment.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function Founders() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-20">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
            The founders
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Mike & Euvie
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* Mike */}
          <div>
            <div className="relative overflow-hidden rounded-2xl mb-8" style={{ minHeight: "360px" }}>
              <Image
                src="/images/mike-and-euvie-headshot.jpg"
                alt="Mike Gilliland and Euvie Ivanova"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-2">
              Mike Gilliland
            </div>
            <div className="text-lg font-medium text-white mb-4">
              Designer, Entrepreneur, Village Builder, Podcaster
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>
                A futurist and storyteller who spent the last decade exploring how
                humans can live well in a world transformed by AI, automation, and
                ecological change.
              </p>
              <p>
                Co-founded Future Thinkers with Euvie. In 2020 moved to a 400-acre
                property in the BC mountains to build a real-world Smart Village
                prototype. Over four years built community while developing practical
                skills in land, infrastructure, and digital systems.
              </p>
              <p>
                Now leads design, technology, strategy, and Village OS development
                at Portal.Place.
              </p>
            </div>
          </div>

          {/* Euvie */}
          <div>
            <div className="relative overflow-hidden rounded-2xl mb-8 bg-white/5" style={{ minHeight: "360px" }}>
              <Image
                src="/images/the_woman_in_202512041426-1024x576.jpeg"
                alt="Village community at Wells Gray"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-2">
              Euvie Ivanova
            </div>
            <div className="text-lg font-medium text-white mb-4">
              Educator, Writer, Village Builder, Podcaster
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>
                A cultural creator and network weaver developing healthier ways for
                people to live, learn, and grow. Focused on how communities can raise
                children, support families, and cultivate cultures reconnecting to
                land, purpose, and each other.
              </p>
              <p>
                Grew up in rural Russia and Bulgaria during the USSR collapse. Studied
                psychology at UBC and University of Copenhagen. Spent over a decade
                of international travel with Mike before settling in BC.
              </p>
              <p>
                Her commitment deepened through becoming a mother and co-creating
                the Smart Village prototype.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_42%]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Why this exists
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              A pattern,<br />
              <span className="italic">not just a place</span>
            </h2>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/45 max-w-[52ch]">
              <p>
                The world is entering a post-job era. Automation and AI are pressuring
                people to rethink how they live. City costs are rising. Loneliness is
                epidemic. Climate instability is real.
              </p>
              <p>
                We&apos;re building regenerative, economically viable villages that give
                people a healthier, more meaningful way to live — communities that are
                walkable, intergenerational, resilient, and culturally vibrant.
              </p>
              <p>
                Wells Gray Village is the first prototype. Portal.Place is the network.
                One village becomes the pattern for many.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "400px" }}>
            <Image
              src="/images/many_people_sitting_202512032320-1024x576.jpeg"
              alt="Community gathering at Wells Gray Village"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ThreeOrgs() {
  const orgs = [
    {
      icon: MicrophoneStage,
      name: "Future Thinkers",
      role: "Media & thought leadership",
      body: "A podcast and global community exploring the future of civilization through technology, consciousness, systems thinking, and culture design. Over a decade, it has reached millions and featured hundreds of thinkers. Provides the narrative and intellectual foundation behind the Smart Village Movement.",
      href: "https://futurethinkers.org",
      external: true,
    },
    {
      icon: TreeEvergreen,
      name: "Portal.Place",
      role: "Village network platform",
      body: "The membership-powered platform building a network of Smart Villages — regenerative, culturally rich, AI-supported communities designed for the post-AI world. Members get early access to village programs, seasonal immersions, long-stay opportunities, and development of new locations across bioregions.",
      href: "/membership",
      external: false,
    },
    {
      icon: Globe,
      name: "The Smart Village Movement",
      role: "Model & standard",
      body: "A new model for living that blends nature, community, wellness, regeneration, and technology. An alternative to the rising costs and disconnection of city life. Walkable, intergenerational, resilient, and supported by AI-powered coordination tools. The Smart Village Standard is the blueprint.",
      href: "/partner",
      external: false,
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            The ecosystem
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Three<br />
            <span className="italic">organizations</span>
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {orgs.map((org, i) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group grid grid-cols-1 gap-6 py-10 lg:grid-cols-[14rem_1fr_auto] lg:items-start"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <org.icon size={16} weight="light" className="text-amber" />
                  <div className="text-base font-medium text-white">{org.name}</div>
                </div>
                <div className="text-xs text-amber/60 uppercase tracking-wider">{org.role}</div>
              </div>
              <p className="text-sm leading-relaxed text-white/40 max-w-[55ch]">{org.body}</p>
              {org.external ? (
                <a
                  href={org.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white/40 transition-all hover:text-amber hover:gap-3"
                >
                  Visit site <ArrowUpRight size={13} />
                </a>
              ) : (
                <Link
                  href={org.href}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white/40 transition-all hover:text-amber hover:gap-3"
                >
                  Learn more <ArrowRight size={13} />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetInvolved() {
  const paths = [
    {
      label: "Become a member",
      sub: "Founding community",
      body: "Join the founding members shaping this new way of living. Early access, seasonal immersions, and a stake in the village network.",
      href: "/membership",
      cta: "See membership",
    },
    {
      label: "Live or visit",
      sub: "Wells Gray Village",
      body: "Experience village life for yourself. Book a stay, join a Sunday, or come for a month-long immersion.",
      href: "/village",
      cta: "Explore the village",
    },
    {
      label: "Invest",
      sub: "Partner & investor",
      body: "Help bring the next village online. We&apos;re building the infrastructure for a network of Smart Villages across Canada.",
      href: "/partner",
      cta: "Investment thesis",
    },
  ];

  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
            Three ways<br />
            <span className="italic">to get involved.</span>
          </h2>
        </div>

        <div className="divide-y divide-white/20 border-y border-white/20">
          {paths.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group grid grid-cols-1 gap-6 py-10 lg:grid-cols-[16rem_1fr_auto] lg:items-center"
            >
              <div>
                <div className="text-base font-medium text-white">{p.label}</div>
                <div className="text-xs text-white/60 mt-1 uppercase tracking-wider">{p.sub}</div>
              </div>
              <p className="text-sm leading-relaxed text-white/70 max-w-[55ch]">{p.body}</p>
              <Link
                href={p.href}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white transition-all hover:gap-3"
              >
                {p.cta} <ArrowRight size={13} />
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
      <Founders />
      <Mission />
      <ThreeOrgs />
      <GetInvolved />
    </>
  );
}

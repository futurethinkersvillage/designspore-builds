"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "@/components/ui/Lightbox";
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  Heart,
  FirstAid,
  Wrench,
  CurrencyDollar,
  Buildings,
  TreeEvergreen,
  Waves,
  Mountains,
  Golf,
  Campfire,
  Leaf,
  House,
  Check,
} from "@phosphor-icons/react";

function Marquee() {
  const items = [
    "Near Clearwater, BC",
    "400 Acres",
    "Seasonal \u00B7 Recreational \u00B7 Community",
    "Founded 2019",
    "Membership Now Open",
    "Builders \u00B7 Families \u00B7 Entrepreneurs",
  ];
  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-white/10 bg-warm-dark py-4">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-0 whitespace-nowrap"
      >
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-8">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-amber shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/wells-gray-golf-rv-06-1024x685.jpg"
          alt="Wells Gray Village"
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-dark/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-32 pb-0 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
        >
          The First in a Membership Network of Villages
        </motion.p>

        <div className="overflow-hidden pb-10 -mb-10">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.88] tracking-tighter text-white"
          >
            The Future
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-10 -mb-10">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(3.5rem,9vw,8rem)] italic font-light leading-[0.88] tracking-tighter text-amber"
          >
            of Human
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-10 -mb-10">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.88] tracking-tighter text-white"
          >
            Living.
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 max-w-[56ch]"
        >
          <p className="text-base leading-relaxed text-white/45">
            We&apos;re building a real-world village campus in Interior BC, Canada — with
            RV&apos;s, tiny homes, cabins, programs, and memberships designed for people
            who want a healthier, more connected, future-proof lifestyle.
          </p>
          <p className="mt-4 text-sm text-white/50">
            Families &middot; Creators &middot; Regenerative builders &middot; Remote workers &amp; founders &middot; Values-aligned investors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/village"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            Visit
          </Link>
          <Link
            href="/membership"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
          >
            Explore Membership <ArrowRight size={13} weight="bold" />
          </Link>
          <Link
            href="/partner"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            Investor &amp; Partner Access
          </Link>
        </motion.div>
      </div>

      <div className="mt-16">
        <Marquee />
      </div>
    </section>
  );
}

function CoreIdea() {
  const features = [
    "Each village offers its own natural environment, flavor, and seasonal rhythms",
    "People can move fluidly between them or return to the same one each year",
    "Shared systems support skills development, learning, and cooperation",
    "A membership community connected by a shared culture",
  ];
  const mosaicPhotos = [
    { src: "/images/many_people_sitting_202512032320-1024x576.jpeg", alt: "Community gathering at Portal.Place" },
    { src: "/images/gazebo-interior-campfire-1024x771.jpg", alt: "Campfire evening at the gazebo" },
    { src: "/images/dome-at-night-scaled.jpg", alt: "Geodesic dome at night" },
  ];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-20 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_45%]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              The Core Idea
            </p>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl">
              A Network of Villages<br />
              <span className="italic">For The Post-Ai World</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm leading-relaxed text-white/40 max-w-[45ch]">
              We are starting with our existing 400-acre flagship village site in BC,
              Canada – and adding partner locations with time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="space-y-5 text-sm leading-relaxed text-white/45 max-w-[52ch]">
            <p>
              Portal.Place is building a new kind of village experience — one centered
              on seasonal living, shared culture, and a deep sense of belonging. It&apos;s a
              place where families, creators, and purpose-driven people can return to
              year after year.
            </p>
            <p>
              Our village campus is designed around wellness, shared rhythms, learning,
              and family-oriented community life. You can immerse in nature, build
              lasting friendships, explore new skills, and participate in meaningful
              traditions that continue over seasons. Think of it as a country club with
              21st century values.
            </p>
            <div className="mt-8 space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-amber" />
                  <span className="text-sm text-white/50">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button aria-label={`View photo: ${mosaicPhotos[0].alt}`} className="relative col-span-2 overflow-hidden rounded-2xl cursor-zoom-in" style={{ minHeight: "300px" }} onClick={() => setLightboxIndex(0)}>
              <Image src={mosaicPhotos[0].src} alt={mosaicPhotos[0].alt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover transition-transform duration-500 hover:scale-105" />
            </button>
            <button aria-label={`View photo: ${mosaicPhotos[1].alt}`} className="relative overflow-hidden rounded-xl cursor-zoom-in" style={{ minHeight: "200px" }} onClick={() => setLightboxIndex(1)}>
              <Image src={mosaicPhotos[1].src} alt={mosaicPhotos[1].alt} fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover transition-transform duration-500 hover:scale-105" />
            </button>
            <button aria-label={`View photo: ${mosaicPhotos[2].alt}`} className="relative overflow-hidden rounded-xl cursor-zoom-in" style={{ minHeight: "200px" }} onClick={() => setLightboxIndex(2)}>
              <Image src={mosaicPhotos[2].src} alt={mosaicPhotos[2].alt} fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover transition-transform duration-500 hover:scale-105" />
            </button>
          </div>
        </div>
      </div>
      <Lightbox images={mosaicPhotos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </section>
  );
}

function WhyNow() {
  const areas = [
    { icon: Users, label: "Community", body: "Stronger social ties in real-life, local communities beyond cities and social media, intergenerational & family support." },
    { icon: Heart, label: "Culture", body: "Shared rhythms & traditions, purpose-driven work, and a do-hard-things philosophy." },
    { icon: FirstAid, label: "Health", body: "Daily movement, nature, eustress, better food, environments that regulate your nervous system." },
    { icon: Wrench, label: "Skills", body: "DIY/Maker culture, creativity, collaboration, adaptability, meta-skills." },
    { icon: CurrencyDollar, label: "Economic structure", body: "Local economies, entrepreneurship, wiser use of technology." },
    { icon: Buildings, label: "Infrastructure", body: "Local food, water, energy, shared tools and spaces." },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            The urgency
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Why This<br />
            <span className="italic">Matters Now</span>
          </h2>
          <p className="mt-8 text-sm leading-relaxed text-white/45 max-w-[52ch]">
            AI is transforming reality faster than most people can adapt. We are
            entering a transition that will require new forms of:
          </p>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {areas.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="grid grid-cols-1 gap-4 py-7 lg:grid-cols-[14rem_1fr] lg:items-center"
            >
              <div className="flex items-center gap-4">
                <a.icon size={16} weight="light" className="text-amber shrink-0" />
                <span className="text-sm font-medium text-white">{a.label}</span>
              </div>
              <p className="text-sm leading-relaxed text-white/40 max-w-[55ch]">{a.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-sm text-white/50 max-w-[48ch]">
          A village isn&apos;t just a place to visit. It&apos;s a new lifestyle for the post-AI era.
        </p>
      </div>
    </section>
  );
}

function VillageModel() {
  const components = [
    "Blue Zone principles for long life and health",
    "Local production of housing, energy, and food",
    "Regenerative land management and ecological design",
    "AI-assisted operations, safety, logistics, and knowledge sharing",
    "High-speed digital work infrastructure",
    "Maker spaces, workshops, coworking, learning environments",
    "Seasonal community rhythms, culture, and rituals",
    "A network effect: learnings and innovations flow between villages",
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              The model
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              The Village<br />
              <span className="italic">Model</span>
            </h2>
            <p className="mt-4 text-sm text-amber/70">
              The Best of Blue Zones, Modern Tech, and Regenerative Design
            </p>
            <p className="mt-8 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              Imagine a Network of Villages that combine:
            </p>
            <div className="mt-8 space-y-3">
              {components.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-amber" />
                  <span className="text-sm text-white/50">{c}</span>
                </div>
              ))}
            </div>
            <p className="mt-10 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              This creates a new kind of community — flexible, resilient, and built for the future.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "500px" }}>
            <Image
              src="/images/gemini-2e4dc4.png"
              alt="Smart Village concept"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FirstVillage() {
  const includes = [
    "RV sites, glamping, and camping",
    "Sauna, coworking/event gazebo, and family-friendly spaces",
    "Community garden",
    "A growing maker space and upcoming CNC-powered production shop",
    "Private lake, creeks, trails, and nature immersive environments",
    "A seasonal rhythm inspired by ancestral villages and modern co-living",
    "Village Ai \u2014 our Ai-powered system for coordination and workflows",
    "Next phases: cabins, glamping units, long term RV and tiny home sites, and shared infrastructure for wellness, co-working, learning, art and maker culture",
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Our first village
            </p>
            <h2 className="font-serif text-5xl font-light leading-tight text-white lg:text-6xl">
              Wells Gray, BC.<br />
              <span className="italic text-white/40">The Living Prototype.</span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              We are building the first real-world Village on a stunning 400-acre
              property in the mountains of British Columbia.
            </p>

            <div className="mt-8 space-y-3">
              {includes.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-amber" />
                  <span className="text-sm text-white/50">{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm font-medium text-white/60">
              This village is the first node in the future network.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: "400", unit: "ac", label: "Owned & operating" },
                { value: "5+", unit: "yrs", label: "Running programs" },
                { value: "40+", unit: "", label: "Waterfalls nearby" },
                { value: "2026", unit: "", label: "Membership open" },
              ].map((s) => (
                <div key={s.label} className="border-b border-white/10 pb-5">
                  <div className="font-mono text-3xl font-light tabular-nums text-white">
                    {s.value}
                    {s.unit && <span className="ml-1 text-lg text-amber">{s.unit}</span>}
                  </div>
                  <div className="mt-1.5 text-xs uppercase tracking-wider text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "500px" }}>
            <Image
              src="/images/swimming-lake-scaled.jpg"
              alt="Private lake at Wells Gray Village"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E12]/60 to-transparent" />
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
              {[
                { icon: TreeEvergreen, label: "Forest trails" },
                { icon: Waves, label: "Private lake" },
                { icon: Mountains, label: "Sauna" },
                { icon: Golf, label: "9-hole golf" },
                { icon: Wrench, label: "Maker space" },
                { icon: Campfire, label: "Campfire" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm px-3 py-1.5">
                  <item.icon size={11} weight="light" className="text-amber" />
                  <span className="text-xs text-white/60">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DayInVillage() {
  const dayPhotos = [
    { src: "/images/cabins-scaled.jpg", alt: "Village cabins" },
    { src: "/images/gazebo-community-meetup-scaled.jpg", alt: "Community meetup" },
    { src: "/images/campfire-in-gazebo-scaled.jpg", alt: "Campfire evening" },
  ];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_45%]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              The Living Prototype
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              A Day In<br />
              <span className="italic">The Village</span>
            </h2>
            <div className="mt-10 space-y-5 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>You wake in a cozy cabin overlooking the mountains.</p>
              <p>The morning is quiet except for birdsong and a stream nearby.</p>
              <p>
                You walk a forest trail to the coworking gazebo where other founders,
                creators, and remote workers gather.
              </p>
              <p>
                In the afternoon people collaborate, build, learn, and work on meaningful
                projects — supported by tools, nature, and community. Kids are everywhere.
              </p>
              <p>
                Dinner is shared with families and friends using ingredients from local gardens.
                Nights are for sauna, storytelling, workshops, or music.
                Season by season, life has rhythm again.
              </p>
              <p className="text-white/60 font-medium">
                This is the next evolution of how humans live.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button aria-label={`View photo: ${dayPhotos[0].alt}`} className="relative col-span-2 overflow-hidden rounded-xl cursor-zoom-in" style={{ minHeight: "260px" }} onClick={() => setLightboxIndex(0)}>
              <Image src={dayPhotos[0].src} alt={dayPhotos[0].alt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover transition-transform duration-500 hover:scale-105" />
            </button>
            <button aria-label={`View photo: ${dayPhotos[1].alt}`} className="relative overflow-hidden rounded-xl cursor-zoom-in" style={{ minHeight: "200px" }} onClick={() => setLightboxIndex(1)}>
              <Image src={dayPhotos[1].src} alt={dayPhotos[1].alt} fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover transition-transform duration-500 hover:scale-105" />
            </button>
            <button aria-label={`View photo: ${dayPhotos[2].alt}`} className="relative overflow-hidden rounded-xl cursor-zoom-in" style={{ minHeight: "200px" }} onClick={() => setLightboxIndex(2)}>
              <Image src={dayPhotos[2].src} alt={dayPhotos[2].alt} fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover transition-transform duration-500 hover:scale-105" />
            </button>
          </div>
        </div>
      </div>
      <Lightbox images={dayPhotos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </section>
  );
}

function WhyDifferent() {
  const gaps = [
    "Economic sustainability",
    "Clear governance",
    "Modern infrastructure",
    "Scalable systems",
    "A replicable model",
    "Cultural coherence",
    "A strong value proposition for families and professionals",
    "A way to grow beyond a single location",
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              The difference
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Why This Is<br />
              <span className="italic">Different</span>
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/45 max-w-[48ch]">
              <p>
                Portal.Place is not a commune, co-op, or retreat.
              </p>
              <p>
                It&apos;s a membership platform for village living, supported by real land, a
                clear economic model, and a replicable blueprint. Think of it as a country
                club with 21st century values, designed for the post-AI era.
              </p>
              <p>Most &quot;village&quot; projects fail because they lack:</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="divide-y divide-white/10 border-y border-white/10">
              {gaps.map((g, i) => (
                <motion.div
                  key={g}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 120, damping: 22 }}
                  className="flex items-center gap-4 py-4"
                >
                  <span className="font-mono text-xs text-white/20 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-white/55">{g}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-sm text-white/60 font-medium">
              Portal.Place was designed from the ground up to address these points.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofOfProgress() {
  const achievements = [
    "400 acre site owned & running for 5 years",
    "Multi-year tourism & hospitality operations already working",
    "Dozens of prototypes tested (programming, culture, infrastructure)",
    "Existing network of creators, technologists, founders, families, and thought leaders",
    "Village Ai prototypes already built and in use",
    "Phase 2 planning underway & investor conversations in progress",
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[40%_1fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Track record
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
              Proof Of<br />
              <span className="italic">Progress</span>
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/45 max-w-[38ch]">
              We&apos;re early — but not starting from zero.
            </p>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {achievements.map((a, i) => (
              <motion.div
                key={a}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-start gap-4 py-5"
              >
                <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-amber" />
                <span className="text-sm text-white/55">{a}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GetInvolved() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_40%]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Get<br />
              <span className="italic">Involved.</span>
            </h2>
            <div className="mt-8 max-w-[45ch] space-y-4 text-base leading-relaxed text-white/75">
              <p>
                Help us build a new model for human living — one that can spread across
                regions, countries, and biomes.
              </p>
              <p>
                If you feel the pull toward this way of life — healthier, more meaningful,
                more connected, more resilient — you&apos;re exactly the kind of person we&apos;re
                building this for.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4">
            {[
              {
                label: "Visit",
                sub: "Join a gathering, work-stay program, or village immersion. Get a taste of village life & discover everything that Wells Gray Village has to offer.",
                href: "/village",
              },
              {
                label: "Apply for Membership",
                sub: "Access exclusive member benefits, village programs, and private opportunities. Help shape the future of the Village campus from the beginning.",
                href: "/membership",
              },
              {
                label: "Invest",
                sub: "Join us as we develop the next phases of the Wells Gray Village campus & Portal.Place network. Request private materials for aligned investors who want to participate in a scalable, high-vision project.",
                href: "/partner",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-2xl bg-white/10 px-6 py-5 transition-all hover:bg-white/20"
              >
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-white/60 max-w-[38ch]">{item.sub}</div>
                </div>
                <ArrowRight size={14} weight="bold" className="text-white/50 transition-all group-hover:translate-x-1 group-hover:text-white shrink-0 ml-4" />
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-12 text-xs text-white/50 max-w-[60ch]">
          Because we&apos;re early, we invite serious contributors to request more
          information. Some materials require a signed NDA.
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <CoreIdea />
      <WhyNow />
      <VillageModel />
      <FirstVillage />
      <DayInVillage />
      <WhyDifferent />
      <ProofOfProgress />
      <GetInvolved />
    </>
  );
}

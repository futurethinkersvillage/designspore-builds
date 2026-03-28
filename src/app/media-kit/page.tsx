"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MicrophoneStage,
  DownloadSimple,
  ArrowUpRight,
  FileText,
  Images,
  User,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[60dvh] bg-warm-dark flex items-end">
      <div className="absolute inset-0">
        <Image
          src="/images/many_people_sitting_202512032320-1024x576.jpeg"
          alt="Portal.Place media kit"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-8"
          >
            Press & Media
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Media kit
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              & press.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[44ch] text-base leading-relaxed text-white/55"
          >
            Everything you need to cover Portal.Place, Future Thinkers, Wells Gray Village, and Design Spore. Founder bios, brand assets, key facts, and booking info for interviews.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10"
          >
            <a
              href="https://futurethinkers.org/call60"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Book an interview <ArrowUpRight size={14} weight="bold" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function KeyFacts() {
  const facts = [
    { value: "400 ac", label: "Private land in Interior BC" },
    { value: "5+ yrs", label: "Active resort operation" },
    { value: "10+ yrs", label: "Future Thinkers podcast" },
    { value: "Millions", label: "Podcast listeners reached" },
    { value: "100s", label: "Global thinkers interviewed" },
    { value: "Canada #1", label: "First Smart Village prototype" },
  ];

  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            At a glance
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Key<br />
            <span className="italic">facts</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
          {facts.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="bg-[#0F0E12] p-6"
            >
              <div className="font-mono text-2xl font-light text-white mb-2">{fact.value}</div>
              <div className="text-xs text-white/35 leading-snug">{fact.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThreeOrgs() {
  const orgs = [
    {
      name: "Portal.Place",
      type: "Seasonal village community & membership platform",
      description: "The membership-powered platform anchored at Wells Gray Village near Clearwater, BC — a seasonal, recreational community on 400 acres. Members get access to village programs, golf, sauna on community days, seasonal immersions, and early-supporter recognition. The platform is just launching.",
      logo: "/images/portalplace-logo-horizontal.png",
    },
    {
      name: "Future Thinkers",
      type: "Media platform & global community",
      description: "A podcast and global community exploring the future of civilization through technology, consciousness, systems thinking, and culture design. Over a decade, it has reached millions of listeners and featured hundreds of thinkers and innovators worldwide. Provides the narrative and intellectual backbone behind the community building work.",
      logo: "/images/ftp-blue-logo-dark.png",
    },
    {
      name: "Wells Gray Resort / Village",
      type: "Operating property near Clearwater, BC",
      description: "A 400-acre resort and seasonal village at the gateway to Wells Gray Provincial Park — known for 40+ waterfalls, hiking, horseback riding, canoeing, and whitewater rafting. Operating since 2019 as Wells Gray Resort, now being developed into the first Portal.Place village.",
      logo: null,
    },
    {
      name: "Design Spore",
      type: "Design & technology studio",
      description: "The design and technology studio behind Portal.Place — responsible for brand, digital product, AI systems, and Village OS development. Founded by Mike Gilliland.",
      logo: null,
    },
  ];

  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            The organizations
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            The<br />
            <span className="italic">entities</span>
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
              className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-[18rem_1fr]"
            >
              <div>
                {org.logo ? (
                  <div className="mb-4">
                    <Image
                      src={org.logo}
                      alt={org.name}
                      width={140}
                      height={36}
                      className="h-8 w-auto opacity-80"
                    />
                  </div>
                ) : (
                  <div className="text-base font-medium text-white mb-2">{org.name}</div>
                )}
                <div className="text-xs text-amber/60 uppercase tracking-wider">{org.type}</div>
              </div>
              <p className="text-sm leading-relaxed text-white/40 max-w-[60ch]">{org.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderBios() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            For press use
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Founder<br />
            <span className="italic">bios</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 lg:grid-cols-2">
          {[
            {
              name: "Mike Gilliland",
              title: "Designer, Entrepreneur, Village Builder, Podcaster — CEO & Co-Founder",
              shortBio: "Mike Gilliland is a futurist and storyteller who spent the last decade exploring how humans can live well in a world transformed by AI, automation, and ecological change. He co-founded Future Thinkers — a podcast that has reached millions globally — with his wife Euvie Ivanova. In 2020, Mike moved to a 400-acre property in the BC mountains to build Canada's first Smart Village prototype, developing practical expertise in land, infrastructure, AI systems, and community design. He now leads design, technology, strategy, and Village OS development at Portal.Place.",
              img: "/images/mike-and-euvie-headshot.jpg",
            },
            {
              name: "Euvie Ivanova",
              title: "Educator, Writer, Village Builder, Podcaster — Co-Founder",
              shortBio: "Euvie Ivanova is a cultural creator and network weaver dedicated to developing healthier ways for people to live, learn, and grow. She focuses on how communities can raise children, support families, revive ancestral knowledge, and cultivate cultures that reconnect people to land and purpose. Raised in rural Russia and Bulgaria during the USSR collapse, she studied psychology at UBC and the University of Copenhagen before spending a decade of international exploration with Mike. Her commitment to village building deepened through motherhood and the co-creation of Canada's first Smart Village prototype.",
              img: "/images/the_woman_in_202512041426-1024x576.jpeg",
            },
          ].map((founder, i) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-[#0F0E12] p-8"
            >
              <div className="relative overflow-hidden rounded-xl mb-6" style={{ minHeight: "280px" }}>
                <Image
                  src={founder.img}
                  alt={founder.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="text-base font-medium text-white">{founder.name}</div>
                <button className="flex items-center gap-1.5 text-xs text-amber/60 hover:text-amber transition-colors shrink-0">
                  <DownloadSimple size={13} /> Photo
                </button>
              </div>
              <div className="text-xs text-amber/60 uppercase tracking-wider mb-5">{founder.title}</div>
              <p className="text-sm leading-relaxed text-white/40">{founder.shortBio}</p>
            </motion.div>
          ))}
        </div>

        {/* Combined bio */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-px bg-[#0F0E12] border-t border-white/10 p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <User size={16} weight="light" className="text-amber" />
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber">Combined bio</div>
          </div>
          <p className="text-sm leading-relaxed text-white/40 max-w-[70ch]">
            Mike Gilliland and Euvie Ivanova are the creators of Future Thinkers and Portal.Place,
            and the founders of Canada&apos;s first Smart Village project. Over the past decade they&apos;ve
            interviewed global thinkers, built a thriving online community, and developed a visionary
            real-world village in BC that blends wellness, technology, culture, and regenerative design.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function BrandAssets() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Brand resources
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Logos &<br />
            <span className="italic">assets</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: "Portal.Place — Horizontal",
              preview: "/images/portalplace-logo-horizontal.png",
              bg: "bg-warm-dark",
              dark: true,
            },
            {
              label: "Portal.Place — Vertical (white)",
              preview: "/images/portalplace-logo-vertical-white-738x1024.png",
              bg: "bg-[#1A1720]",
              dark: true,
            },
            {
              label: "Future Thinkers — Dark",
              preview: "/images/ftp-blue-logo-dark.png",
              bg: "bg-warm-dark",
              dark: true,
            },
            {
              label: "Future Thinkers — Light",
              preview: "/images/ftp-blue-logo-light-1.png",
              bg: "bg-white",
              dark: false,
            },
            {
              label: "Wells Gray Resort",
              preview: "/images/wells-gray-resort-logo-green-vertical-1024x983.png",
              bg: "bg-warm-dark",
              dark: true,
            },
            {
              label: "Portal.Place — Vertical",
              preview: "/images/portalplace-logo-vertical.png",
              bg: "bg-white",
              dark: false,
            },
          ].map((asset, i) => (
            <motion.div
              key={asset.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.07, duration: 0.4 }}
              className={`${asset.bg} p-8`}
            >
              <div className="flex items-center justify-center h-32 mb-4">
                <Image
                  src={asset.preview}
                  alt={asset.label}
                  width={160}
                  height={80}
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <div className={`text-sm font-medium mb-3 ${asset.dark ? "text-white" : "text-warm-dark"}`}>
                {asset.label}
              </div>
              <button className={`flex items-center gap-1.5 text-xs transition-colors ${asset.dark ? "text-amber/60 hover:text-amber" : "text-warm-dark/40 hover:text-warm-dark"}`}>
                <DownloadSimple size={13} /> Download
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookInterview() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Book us for<br />
              <span className="italic">your story.</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              Available for podcasts, documentaries, editorial features, and press
              coverage. Schedule a 60-minute call to discuss.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://futurethinkers.org/call60"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-amber transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                Book an interview <ArrowUpRight size={14} weight="bold" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Contact Mike directly <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <MicrophoneStage size={14} weight="light" />
              <span>Future Thinkers Podcast</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={14} weight="light" />
              <span>Portal.Place Documentary (in production)</span>
            </div>
            <div className="flex items-center gap-2">
              <Images size={14} weight="light" />
              <span>High-res photos available on request</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MediaKitPage() {
  return (
    <>
      <Hero />
      <KeyFacts />
      <ThreeOrgs />
      <FounderBios />
      <BrandAssets />
      <BookInterview />
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  FilmSlate,
  ArrowUpRight,
} from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative min-h-[70dvh] bg-warm-dark">
      <div className="absolute inset-0">
        <Image
          src="/images/a_person_filming_202512032314-1024x576.jpeg"
          alt="Documentary series — Portal.Place"
          fill
          priority
          className="object-cover opacity-30"
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
            Portal.Place — Documentary Series (In Production)
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Watch the village
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              being built.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            A documentary series currently in the making — following the creation
            of Canada&apos;s first village of this kind, from raw land to living community.
            Real footage, real people, real building. Episodes will be released as
            production progresses.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

const series = [
  {
    episode: "EP 01",
    title: "Why We Left the City",
    description: "Mike and Euvie explain what drove them from Vancouver to 400 acres in the BC mountains — and what they were trying to build.",
  },
  {
    episode: "EP 02",
    title: "The Land",
    description: "A tour of Wells Gray Village: the forest, the lake, the golf course, and the infrastructure they inherited and are reimagining.",
  },
  {
    episode: "EP 03",
    title: "What Is a Smart Village?",
    description: "Defining the model. What makes a village 'smart' — and how does it differ from an eco-commune, an RV park, or a resort?",
  },
  {
    episode: "EP 04",
    title: "Building Community From Scratch",
    description: "The social infrastructure of a village: who shows up, how trust is built, and what a real community actually looks like day-to-day.",
  },
  {
    episode: "EP 05",
    title: "The Village OS",
    description: "The technology layer: AI-assisted coordination, community dashboards, and the systems that make a village run without burning out its operators.",
  },
  {
    episode: "EP 06",
    title: "Forest School",
    description: "What outdoor education looks like when the classroom is 400 acres. Following kids through a day in Wells Gray Village.",
  },
  {
    episode: "EP 07",
    title: "The Sauna Ritual",
    description: "Wood-fired heat, cold river plunge, and the social glue that holds the village together every evening.",
  },
  {
    episode: "EP 08",
    title: "Revenue & Sustainability",
    description: "How a village pays for itself: the RV park, golf, events, memberships, and the long-stay programs that make it economically viable.",
  },
  {
    episode: "EP 09",
    title: "The Makers",
    description: "The builders, fabricators, and tinkerers contributing their skills to the village in exchange for land and community.",
  },
  {
    episode: "EP 10",
    title: "Village Rhythms",
    description: "A full day inside the village: morning routines, work blocks, shared meals, afternoon recreation, and evening campfire.",
  },
  {
    episode: "EP 11",
    title: "Families & Worldschooling",
    description: "Why remote-working families are choosing the village over city life — and what it means to raise children in this environment.",
  },
  {
    episode: "EP 12",
    title: "The Network Vision",
    description: "Beyond one village. How the Portal.Place model scales into a network of Smart Villages across Canada and beyond.",
  },
];

function Series() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Documentary series — in production
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Planned<br />
            <span className="italic">episode guide</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-white/40 max-w-[52ch]">
            The documentary is currently being filmed. The episodes below represent
            our planned arc — not yet released. Social media clips are published
            separately and are distinct from the documentary series.
          </p>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {series.map((ep, i) => (
            <motion.div
              key={ep.episode}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 4) * 0.05, duration: 0.4 }}
              className="group grid grid-cols-1 gap-4 py-8 lg:grid-cols-[7rem_22rem_1fr_auto] lg:items-center"
            >
              <div className="font-mono text-xs text-amber/50">{ep.episode}</div>
              <div className="text-base font-medium text-white">{ep.title}</div>
              <p className="text-sm leading-relaxed text-white/35 max-w-[52ch]">{ep.description}</p>
              <span className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-white/20 uppercase tracking-wider">
                Coming soon
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MediaCTA() {
  return (
    <section className="bg-amber py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-serif text-5xl font-light leading-[1.05] text-white lg:text-6xl xl:text-7xl">
              Interview us.<br />
              <span className="italic">Tell the story.</span>
            </h2>
            <p className="mt-8 max-w-[45ch] text-base leading-relaxed text-white/75">
              We&apos;re available for interviews, podcasts, documentary features, and
              press coverage. Book directly or visit the media kit.
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
                href="/media-kit"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Media kit <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-3 text-white/60">
              <FilmSlate size={16} weight="light" />
              <span className="text-sm">Future Thinkers Podcast · Portal.Place Documentary (in production)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VideosPage() {
  return (
    <>
      <Hero />
      <Series />
      <MediaCTA />
    </>
  );
}

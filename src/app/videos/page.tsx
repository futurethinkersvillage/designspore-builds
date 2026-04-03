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
          alt="Smart Village Video Series"
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
            Video Series
          </motion.p>

          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Smart Village
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-10 -mb-10">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,8vw,7rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              Video Series.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/55"
          >
            We&apos;re producing an ongoing short-form video series that documents the
            creation of Wells Gray Village in real time — the challenges, the
            breakthroughs, and the people behind the vision.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

const videos = [
  { title: "The Post-Job Economy", body: "Explores AI replacing jobs and how smart villages offer regenerative community alternatives with shared infrastructure and coworking." },
  { title: "The Network Model", body: "Describes seasonal living across multiple connected villages without losing community connections." },
  { title: "Walkthrough: A Day in the Smart Village", body: "Poetic narration depicting daily life: trees, workspace domes, children, communal kitchens, and evening gatherings." },
  { title: "What We\u2019ve Built So Far", body: "Documents four years of development on 400 acres including sauna, geodesic dome, permaculture gardens, irrigation, and Village OS tools." },
  { title: "The Village Moment", body: "Argues villages address job loss, housing costs, and loneliness through shared infrastructure and belonging." },
  { title: "4 Years on 400 Acres", body: "Reflects on learning resilience, problem-solving, and meta-skills through hands-on land management." },
  { title: "Not a utopia", body: "Emphasizes the project as a prototype with real failures, not perfect but improving." },
  { title: "The Real Work of Building A Village", body: "Highlights practical systems development: food, water, power, governance, childcare, housing." },
  { title: "Village With A Brain", body: "Describes AI\u2019s role using LIDAR drones, environmental sensors, and video to coordinate village operations locally." },
  { title: "How We Can Adapt", body: "Lists eight adaptations including meaningful work, affordable housing, intergenerational culture, nature-connected childhood, resilience, local food systems, cultural creation, and proactive building." },
  { title: "The Blue Zones", body: "Connects longevity research with modern village infrastructure combining ancient wisdom and contemporary technology." },
  { title: "Why Most Communities Fail", body: "Identifies four causes: finances, poor infrastructure, a lack of skills, and the inability to navigate relationships." },
  { title: "Lifestyle First Living", body: "Describes shift toward wellness-focused living through glamping, nature immersion, and community orientation." },
  { title: "Third Place Environments", body: "Argues design intentionality creates vibrant spaces where art, music, and food spill into public life." },
  { title: "The Real Wellness Fix", body: "Critiques symptom-based wellness industry; advocates lifestyle design with real food, natural movement, and purpose-driven work." },
  { title: "Digital Nomads and the New Ancestral Future", body: "Discusses remote work trends, millennial wealth priorities, and tech-enabled community organization." },
  { title: "Dacha Culture", body: "Compares village projects to Russian dacha tradition of seasonal countryside living." },
  { title: "AI In The Village", body: "Explains AI coordination for repairs, harvests, events, and shared tools while supporting rather than automating life." },
  { title: "The Next Big Asset Class", body: "Positions villages as real estate investment opportunity superior to suburbs, bunkers, or isolated compounds." },
  { title: "Why do 90% of eco villages fail?", body: "Details practical failures: funding, infrastructure deficiency, skill gaps, and relational conflicts." },
  { title: "Communities of the future", body: "Proposes community land projects addressing employment, resilience, food quality, and skill-building." },
  { title: "We bought land to start a community", body: "2020 crowdfunding story for 400-acre Wells Gray property in British Columbia." },
  { title: "6 Reasons we started a high tech homestead", body: "Motivations: AI disruption concerns, alternative living systems testing, capability development, community strengthening, health improvement, and knowledge sharing." },
];

function Series() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Short-form series
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Episodes
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {videos.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 4) * 0.05, duration: 0.4 }}
              className="group grid grid-cols-1 gap-4 py-8 lg:grid-cols-[4rem_22rem_1fr] lg:items-center"
            >
              <div className="font-mono text-xs text-amber/50">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-base font-medium text-white">{v.title}</div>
              <p className="text-sm leading-relaxed text-white/35 max-w-[52ch]">{v.body}</p>
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
              <span className="text-sm">Future Thinkers Podcast &middot; Portal.Place Documentary (in production)</span>
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

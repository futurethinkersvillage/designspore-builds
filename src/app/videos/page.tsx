"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
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

const shorts = [
  { id: "H_rMIc57qvg", title: "The Post-Job Economy", thumb: "The-Post-Job-Economy.png" },
  { id: "hzkvwahhAco", title: "The Network Model", thumb: "The-Network-Model.png" },
  { id: "TiYIdqt-moU", title: "A Day in the Smart Village", thumb: "A-Day-In-the-Life.png" },
  { id: "ELARkMW6dO4", title: "What We\u2019ve Built So Far", thumb: "What-weve-built-so-far.png" },
  { id: "ezAJdYtH2YE", title: "The Village Moment", thumb: "The-Village-Moment.png" },
  { id: "yKTJNEUO75U", title: "4 Years on 400 Acres", thumb: "4-years-on-400-acres.png" },
  { id: "1sRsNBrOklI", title: "Not a utopia", thumb: "Not-a-utopia.png" },
  { id: "15nHWWl3ZcQ", title: "The Real Work of Building A Village", thumb: "The-Real-Work-of-Building-A-Village.png" },
  { id: "2i019WU41AM", title: "Village With A Brain", thumb: "Village-with-a-brain.png" },
  { id: "kyAwGB1tJH4", title: "How We Can Adapt", thumb: "How-we-can-Adapt.png" },
  { id: "03yEnTSJGfA", title: "The Blue Zones", thumb: "The-Blue-Zones.png" },
  { id: "HHl1WbhYaqI", title: "Why Most Communities Fail", thumb: "Why-Most-Communities-Fail.png" },
  { id: "kcEHwdWe-dA", title: "Lifestyle First Living", thumb: "Lifestyle-First-Living.png" },
  { id: "L7rFBx1tfFM", title: "Third Place Environments", thumb: "Third-Place-Environments.png" },
  { id: "S-SPfZG5bAI", title: "The Real Wellness Fix", thumb: "The-Real-Wellness-Fix.png" },
  { id: "cpZLfU2GpMY", title: "Digital Nomads and the New Ancestral Future", thumb: "digital-nomads-and-the-new-ancestral-future.png" },
  { id: "QXzxysQTHbs", title: "Dacha Culture", thumb: "Dacha-Culture.png" },
  { id: "f3zBVOVrwO8", title: "AI In The Village", thumb: "Ai-in-the-village.png" },
  { id: "lwvqTHRBMso", title: "The Next Big Asset Class", thumb: "The-Next-Big-Asset-Class-1.png" },
];

const regularVideos = [
  { id: "AlElqfrELPQ", title: "Why do 90% of eco villages fail?" },
  { id: "I9BbQNhhkvU", title: "Communities of the future" },
  { id: "B0nPPKMU9tY", title: "We bought land to start a community" },
  { id: "N0nBDkNHhvk", title: "6 Reasons we started a high tech homestead" },
];

const longFormVideos = [
  { id: "xrL-wL5Bueg", title: "Long-Form Episode 1" },
  { id: "lYh18UrSMEE", title: "Long-Form Episode 2" },
  { id: "gdvJFzGUs8Q", title: "Long-Form Episode 3" },
  { id: "0YUnFVDZxgQ", title: "Long-Form Episode 4" },
  { id: "rQwOshB6J3M", title: "Long-Form Episode 5" },
  { id: "Tf_YNgph84o", title: "Long-Form Episode 6" },
];

function VideoShortCard({ id, title, thumb }: { id: string; title: string; thumb: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <div
        className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10"
        style={{ aspectRatio: "9/16" }}
        onClick={() => setPlaying(true)}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            <Image
              src={`/images/${thumb}`}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6 ml-0.5">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-white">{title}</p>
    </div>
  );
}

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
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-white/55">
            19 short-form episodes exploring the ideas, challenges, and vision behind the smart village movement.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {shorts.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
            >
              <VideoShortCard id={v.id} title={v.title} thumb={v.thumb} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegularVideos() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Featured videos
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Deep Dives
          </h2>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-white/55">
            Longer explorations into why communities fail, how ours began, and where we&apos;re headed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {regularVideos.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
            >
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/9" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-white">{v.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LongFormVideos() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
            Long-form content
          </p>
          <h2 className="font-serif text-5xl font-light text-white lg:text-6xl">
            Full-Length Films
          </h2>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-white/55">
            Extended documentary content and in-depth conversations about the future of intentional living.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {longFormVideos.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
            >
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/9" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-white">{v.title}</p>
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
      <RegularVideos />
      <LongFormVideos />
      <MediaCTA />
    </>
  );
}

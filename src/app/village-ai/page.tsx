"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChatWidget } from "@/components/ui/ChatWidget";
import {
  ArrowRight,
  Brain,
  MapTrifold,
  UsersThree,
  Leaf,
  Lightning,
  Question,
} from "@phosphor-icons/react";

const capabilities = [
  {
    icon: MapTrifold,
    title: "Guest Orientation",
    body: "New arrivals ask where the sauna is, what time community dinner starts, or how to get to the creek trail. Village AI handles it — so hosts don't have to repeat themselves.",
  },
  {
    icon: UsersThree,
    title: "Community Coordination",
    body: "Knows the schedule, upcoming events, who's running a workshop, and what's happening at the dome. One place to ask, always up to date.",
  },
  {
    icon: Leaf,
    title: "Local & Regional Intelligence",
    body: "Connected to the Portal.Place Intel feed — weather, trail conditions, wildlife sightings, local events, and what's happening in the broader Wells Gray region.",
  },
  {
    icon: Lightning,
    title: "Personalized to Members",
    body: "Members get context-aware answers based on their booking, preferences, and history at the village. Not a generic chatbot — an AI that knows the place.",
  },
  {
    icon: Brain,
    title: "Operational Brain",
    body: "Booking policy questions, quiet hours, fire ban status, recycling instructions — the day-to-day knowledge that clutters staff inboxes and noticeboards.",
  },
  {
    icon: Question,
    title: "Always Learning",
    body: "Feedback from real guests and members shapes it over time. The more the village evolves, the smarter and more useful Village AI becomes.",
  },
];

export default function VillageAIPage() {
  return (
    <div className="min-h-screen bg-warm-dark">
      {/* Hero */}
      <section className="relative mx-auto max-w-[1400px] px-6 pt-36 pb-24 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber mb-6">
            Coming Soon
          </p>
          <h1 className="font-serif text-[clamp(3rem,7vw,6rem)] font-light leading-[0.92] tracking-tighter text-white">
            Village<br />
            <span className="italic text-amber">AI</span>
          </h1>
          <p className="mt-8 text-base leading-relaxed text-white/60 max-w-[52ch]">
            An AI layer built directly into the village — not a generic assistant,
            but one that knows the land, the schedule, the community, and the people.
            A quiet intelligence woven into daily life at Portal.Place.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Stay updated <ArrowRight size={14} weight="bold" />
            </Link>
            <Link
              href="/village"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              Explore the village <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* What it does */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
        <div className="mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
            What it does
          </p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl">
            Built for village life,<br />
            <span className="italic">not generic use</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="bg-[#0F0E12] p-8"
            >
              <cap.icon size={20} weight="light" className="text-amber mb-5" />
              <div className="text-sm font-medium text-white mb-2">{cap.title}</div>
              <p className="text-sm leading-relaxed text-white/55">{cap.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo section */}
      <section className="border-t border-white/10 bg-[#0A0910]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-16">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                Early prototype
              </p>
              <h2 className="font-serif text-4xl font-light text-white lg:text-5xl mb-6">
                Try the chat<br />
                <span className="italic">right now</span>
              </h2>
              <p className="text-sm leading-relaxed text-white/55 max-w-[48ch] mb-8">
                The chat button in the corner of this page is an early version of
                Village AI — trained on Portal.Place content. Ask it anything about
                the village, membership, or the project. This is what we&apos;re
                building toward, with much deeper local context.
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/30">
                Try asking:
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "What can I do at Wells Gray Village?",
                  "How does membership work?",
                  "Is this good for families?",
                  "Tell me about the geodesic dome",
                ].map((q) => (
                  <li key={q} className="flex items-start gap-2 text-sm text-white/55">
                    <ArrowRight size={12} className="mt-0.5 shrink-0 text-amber" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0F0E12] p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber/10">
                  <Brain size={32} weight="light" className="text-amber" />
                </div>
                <p className="text-sm font-medium text-white mb-2">Village AI</p>
                <p className="text-xs text-white/40 mb-6">
                  Tap the chat icon in the bottom-right corner to start a conversation.
                </p>
                <div className="text-xs text-white/25 font-mono uppercase tracking-wider">
                  Powered by Portal.Place
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-16">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
            The vision
          </p>
          <h2 className="font-serif text-4xl font-light text-white lg:text-5xl mb-8">
            AI as infrastructure,<br />
            <span className="italic">not distraction</span>
          </h2>
          <div className="space-y-5 text-sm leading-relaxed text-white/55 max-w-[52ch]">
            <p>
              Most AI tools are designed to keep you on your screen. Village AI is
              designed to get you off it — to answer your question quickly so you
              can get back to the creek, the sauna, or the conversation.
            </p>
            <p>
              As Portal.Place expands to new locations, Village AI becomes the
              connective layer — a consistent, knowledgeable presence at every
              village node in the network. Local context, global infrastructure.
            </p>
            <p>
              This is an early-stage initiative. If you&apos;re interested in
              contributing — as a developer, AI researcher, or founding member —
              reach out.
            </p>
          </div>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber transition-colors hover:text-amber/80"
            >
              Get in touch <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

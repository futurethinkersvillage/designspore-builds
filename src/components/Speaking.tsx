"use client";

import { motion } from "framer-motion";

const talks = [
  {
    event: "Re:Build Festival",
    topic: "Future Thinkers Smart Village",
    year: "2021",
    description: "Online festival of regenerative village builders — presented the Portal.Place smart village model.",
  },
  {
    event: "The Stoa",
    topic: "Future Thinkers Smart Village",
    year: "2020",
    description: "Presented the smart village vision and practical approach to intentional community design.",
  },
  {
    event: "Future Thinkers Summit",
    topic: "Technology, Consciousness & Community",
    year: "Ongoing",
    description: "Host and speaker at Future Thinkers community events exploring the intersection of AI, systems thinking, and human potential.",
  },
  {
    event: "Collective Sapience Retreat",
    topic: "AI & Regenerative Communities",
    year: "2023",
    description: "Co-facilitated multi-day retreat exploring AI-assisted community governance and resilient rural living.",
  },
];

export default function Speaking() {
  return (
    <section
      id="speaking"
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url('/speaking.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50" />

      <div className="relative mx-auto max-w-5xl px-6 py-32">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
        >
          Speaking
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 max-w-xl text-lg text-neutral-300"
        >
          Available for keynotes, panels, and workshops on AI adoption,
          regenerative communities, and practical technology for a resilient
          future.
        </motion.p>

        <div className="grid gap-4 sm:grid-cols-2">
          {talks.map((talk, i) => (
            <motion.div
              key={talk.event + talk.year}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-lg border border-white/10 bg-neutral-950/50 p-5 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-semibold text-neutral-100">
                  {talk.event}
                </h3>
                <span className="font-mono text-xs text-amber-600/70">
                  {talk.year}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-neutral-400">
                {talk.topic}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {talk.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <a
            href="https://futurethinkers.org/call30"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-600/40 px-6 py-3 font-mono text-sm text-amber-500 transition-colors hover:bg-amber-600/10"
          >
            Book a speaking enquiry &rarr;
          </a>
        </motion.div>
      </div>
    </section>
  );
}

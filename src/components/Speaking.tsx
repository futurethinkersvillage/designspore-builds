"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const talks = [
  { event: "Re:Build Festival", year: "2021" },
  { event: "The Stoa", year: "2020" },
  { event: "Future Thinkers Summit", year: "Ongoing" },
  { event: "Collective Sapience Retreat", year: "2023" },
];

const consultingServices = [
  {
    title: "AI Readiness Briefing",
    description: "60–90 min session covering where AI fits in your org today, what to watch, and what to avoid. Free for qualifying orgs.",
  },
  {
    title: "AI Policy Framework",
    description: "Custom policy document covering data governance, acceptable use, procurement guidelines, and staff training roadmap. $5K–$8K.",
  },
  {
    title: "Retainer",
    description: "Ongoing advisory for orgs actively implementing AI — monthly check-ins, implementation support, staff Q&A. From $2,500/mo.",
  },
];

export default function Speaking() {
  return (
    <section id="speaking" className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Speaking */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-lg border border-neutral-800"
        >
          <div className="relative h-52 w-full overflow-hidden">
            <Image
              src="/speaking.jpg"
              alt="Mike Gilliland speaking at Future Thinkers event"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          </div>

          <div className="p-6">
            <p className="mb-1 font-mono text-xs tracking-widest text-amber-600/80 uppercase">Speaking</p>
            <p className="mb-5 text-sm text-neutral-400">
              Available for keynotes, panels, and workshops on AI adoption,
              regenerative communities, and technology for a resilient future.
            </p>

            <div className="space-y-2">
              {talks.map((talk) => (
                <div key={talk.event} className="flex items-center justify-between border-b border-neutral-800/60 py-2 last:border-0">
                  <span className="text-sm text-neutral-200">{talk.event}</span>
                  <span className="font-mono text-xs text-neutral-500">{talk.year}</span>
                </div>
              ))}
            </div>

            <a
              href="https://futurethinkers.org/call30"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center font-mono text-xs text-amber-500 transition-colors hover:text-amber-400"
            >
              Book a speaking enquiry &rarr;
            </a>
          </div>
        </motion.div>

        {/* Consulting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-lg border border-neutral-800"
        >
          <div className="relative h-52 w-full overflow-hidden bg-neutral-900">
            <Image
              src="/Consulting.png"
              alt="AI Consulting"
              fill
              className="object-cover object-center opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          </div>
          <div className="p-6">
          <p className="mb-1 font-mono text-xs tracking-widest text-amber-600/80 uppercase">Consulting</p>
          <p className="mb-6 text-sm text-neutral-400">
            I help businesses and governments understand, adopt, and govern AI —
            practically, without the hype. Starting with clarity, not complexity.
          </p>

          <div className="space-y-5">
            {consultingServices.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              >
                <h3 className="font-mono text-sm font-semibold text-neutral-100">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">{s.description}</p>
              </motion.div>
            ))}
          </div>

          <a
            href="https://futurethinkers.org/call30"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center font-mono text-xs text-amber-500 transition-colors hover:text-amber-400"
          >
            Book a free AI briefing &rarr;
          </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

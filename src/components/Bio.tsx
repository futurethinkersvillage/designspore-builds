"use client";

import { motion } from "framer-motion";

export default function Bio() {
  return (
    <section id="bio" className="mx-auto max-w-3xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-8 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
      >
        About
      </motion.h2>

      <div className="space-y-6 text-lg leading-relaxed text-neutral-300">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          I&apos;m the founder of{" "}
          <a
            href="https://designspore.co"
            className="text-neutral-100 underline decoration-neutral-700 underline-offset-4 transition-colors hover:decoration-amber-600"
          >
            Design Spore
          </a>
          , an AI services studio, and co-creator of{" "}
          <a
            href="https://futurethinkers.org"
            className="text-neutral-100 underline decoration-neutral-700 underline-offset-4 transition-colors hover:decoration-amber-600"
          >
            Future Thinkers
          </a>
          , a podcast with 130+ episodes exploring technology, society, and
          human potential. My background spans filmmaking, design, branding,
          media, and technology &mdash; but these days I spend most of my time
          building real AI systems and the communities that use them.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          I&apos;m building{" "}
          <a
            href="https://portal.place"
            className="text-neutral-100 underline decoration-neutral-700 underline-offset-4 transition-colors hover:decoration-amber-600"
          >
            Portal.Place
          </a>
          , a flagship smart village prototype near Wells Gray Provincial Park
          in the BC interior &mdash; a living laboratory for off-grid systems,
          AI-assisted community governance, and resilient rural living. It&apos;s
          where I test everything I build.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          I&apos;m not theorizing about AI. Every tool, system, and platform I
          build is deployed, used by real people, and tested against real
          constraints. If it works in an underserved, resource-constrained
          environment, it works anywhere.
        </motion.p>
      </div>
    </section>
  );
}

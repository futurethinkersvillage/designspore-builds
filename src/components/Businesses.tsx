"use client";

import { motion } from "framer-motion";

const businesses = [
  {
    name: "Design Spore",
    url: "https://designspore.co",
    description: "AI services studio — chatbots, automation, websites, and launches.",
  },
  {
    name: "Future Thinkers",
    url: "https://futurethinkers.org",
    description: "Podcast exploring technology, society, and human potential. 130+ episodes.",
  },
  {
    name: "Portal.Place",
    url: "https://portal.place",
    description: "Smart village prototype on land near Wells Gray Provincial Park.",
  },
  {
    name: "Wells Gray Resort",
    url: "https://wellsgrayresort.ca",
    description: "Golf & RV resort with custom booking system and channel management.",
  },
];

export default function Businesses() {
  return (
    <section id="businesses" className="mx-auto max-w-5xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-12 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
      >
        Ventures
      </motion.h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {businesses.map((biz, i) => (
          <motion.a
            key={biz.name}
            href={biz.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-lg border border-neutral-800 p-6 transition-colors hover:border-amber-600/40 hover:bg-neutral-900/50"
          >
            <h3 className="font-mono text-lg font-semibold text-neutral-100 group-hover:text-amber-500 transition-colors">
              {biz.name}
            </h3>
            <p className="mt-2 text-sm text-neutral-400">{biz.description}</p>
            <p className="mt-3 font-mono text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">
              {biz.url.replace("https://", "")} &rarr;
            </p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

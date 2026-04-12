"use client";

import { motion } from "framer-motion";
import vlogs from "@/content/vlogs.json";

interface Vlog {
  title: string;
  youtubeId: string;
  date: string;
  description: string;
}

export default function Vlogs() {
  const items = vlogs as Vlog[];
  if (items.length === 0) return null;

  return (
    <section id="vlogs" className="mx-auto max-w-4xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-12 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
      >
        Vlogs
      </motion.h2>

      <div className="grid gap-8 sm:grid-cols-2">
        {items.map((vlog, i) => (
          <motion.div
            key={vlog.youtubeId}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="aspect-video overflow-hidden rounded-lg border border-neutral-800">
              <iframe
                src={`https://www.youtube.com/embed/${vlog.youtubeId}`}
                title={vlog.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <h3 className="mt-3 font-mono text-sm font-medium text-neutral-100">
              {vlog.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-400">{vlog.description}</p>
            <p className="mt-1 font-mono text-xs text-neutral-600">
              {vlog.date}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

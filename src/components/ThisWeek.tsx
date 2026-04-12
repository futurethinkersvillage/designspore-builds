"use client";

import { motion } from "framer-motion";
import items from "@/content/thisweek.json";

export default function ThisWeek() {
  if (items.length === 0) return null;

  return (
    <section id="this-week" className="mx-auto max-w-3xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-8 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
      >
        This Week
      </motion.h2>

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="border-l-2 border-neutral-800 pl-5"
          >
            <h3 className="font-mono text-base font-medium text-neutral-100">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-400">{item.description}</p>
            <p className="mt-1 font-mono text-xs text-neutral-600">
              {item.date}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

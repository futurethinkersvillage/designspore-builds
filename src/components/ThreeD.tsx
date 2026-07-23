"use client";

import { motion } from "framer-motion";
import models from "@/content/models.json";

export default function ThreeD() {
  if (models.length === 0) return null;

  return (
    <section id="3d" className="mx-auto max-w-5xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-12 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
      >
        3D Modeling
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4 }}
      >
        <a
          href="/3d"
          className="group block rounded-lg border border-neutral-800 p-6 transition-colors hover:border-neutral-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm font-semibold text-neutral-100">
              CAD &amp; 3D Print Portfolio
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-blue-400">
              {models.length} model{models.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Fusion 360 designs, functional prints, and fabrication experiments
            — every model viewable and spinnable right in the browser.
          </p>
          <p className="mt-2 font-mono text-xs text-neutral-600 transition-colors group-hover:text-neutral-400">
            mikegilliland.ca/3d &rarr;
          </p>
        </a>
      </motion.div>
    </section>
  );
}

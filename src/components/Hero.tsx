"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-5xl font-bold tracking-tight text-neutral-100 sm:text-7xl"
      >
        Mike Gilliland
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 max-w-xl text-lg text-neutral-400 sm:text-xl"
      >
        Building AI systems, communities, and businesses from a small town in
        the BC interior.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-3 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
      >
        Clearwater, BC
      </motion.p>
    </section>
  );
}

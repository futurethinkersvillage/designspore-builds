"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="shrink-0"
        >
          <Image
            src="/mike.jpg"
            alt="Mike Gilliland"
            width={160}
            height={160}
            className="rounded-full object-cover grayscale"
            priority
          />
        </motion.div>

        <div className="text-center sm:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono text-5xl font-bold tracking-tight text-neutral-100 sm:text-6xl"
          >
            Mike Gilliland
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-lg text-lg text-neutral-400"
          >
            Building AI systems, communities, and businesses from a small town
            in the BC interior.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-3 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
          >
            Founder · Builder · Podcaster
          </motion.p>
        </div>
      </div>
    </section>
  );
}

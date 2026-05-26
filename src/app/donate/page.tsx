"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "@phosphor-icons/react";
import { CryptoContribute } from "@/components/CryptoContribute";

function Hero() {
  return (
    <section className="relative bg-warm-dark pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
      {/* Subtle background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bf57b989-df81-4b14-8435-046dec6e4fb1-1024x576.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-warm-dark/60 to-warm-dark" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/[0.08] px-4 py-2"
          >
            <Heart size={13} weight="fill" className="text-amber" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber">
              Future Thinkers Foundation · Non-profit
            </span>
          </motion.div>

          <div className="overflow-hidden pb-6 -mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,10vw,6.5rem)] font-light leading-[0.9] tracking-tighter text-white"
            >
              Support the
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-6 -mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,10vw,6.5rem)] italic font-light leading-[0.9] tracking-tighter text-amber"
            >
              mission.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-[52ch] text-base leading-relaxed text-white/60"
          >
            The Future Thinkers Foundation is our non-profit arm — supporting
            education, research, and community development around regenerative
            and Smart Village principles. Donations fund programs, content,
            and the open-source tools that benefit the broader movement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href="#crypto"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Donate with crypto <ArrowRight size={13} weight="bold" />
            </a>
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/75 transition-colors hover:border-white/45 hover:text-white"
            >
              Invest instead →
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 text-xs text-white/35 max-w-[44ch]"
          >
            Crypto donations go to the Future Thinkers Foundation (non-profit).
            If you&apos;re looking for equity investment in Portal.Place, that is a
            separate, formal process — see the Partner page.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default function DonatePage() {
  return (
    <>
      <Hero />
      <div id="crypto">
        <CryptoContribute investHref="/partner#access" />
      </div>
    </>
  );
}

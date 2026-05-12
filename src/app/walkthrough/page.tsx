"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Compass, Users, Handshake } from "@phosphor-icons/react";

function Hero() {
  return (
    <section className="relative bg-warm-dark pt-24 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 h-[70%] w-[85%] rounded-full bg-amber/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="mx-auto max-w-[1100px] text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6"
          >
            Full walkthrough
          </motion.p>

          <div className="overflow-hidden pb-4 -mb-4">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,7vw,6rem)] font-light leading-[0.95] tracking-tighter text-white"
            >
              Wells Gray
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-4 -mb-4">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(3rem,7vw,6rem)] italic font-light leading-[0.95] tracking-tighter text-amber"
            >
              Village Tour.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-[15px] leading-relaxed text-white/65 max-w-[60ch] mx-auto lg:mt-10 lg:text-base lg:text-white/60"
          >
            A walkthrough of the 400-acre property, the long-term vision for the
            Portal.Place network, and a first look at Village OS — the AI-powered
            operating system that runs the village.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 mx-auto max-w-[1200px]"
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
            <iframe
              src="https://www.youtube.com/embed/KBYm2xRwkrM?rel=0&modestbranding=1&playsinline=1"
              title="Portal.Place — Full Walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Seen Village OS in the video? Try it yourself.
          </p>
          <a
            href="https://village-dashboard.portal.place/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-amber/50 bg-amber/10 px-7 py-3 text-sm font-medium text-amber transition-all hover:bg-amber/20 hover:border-amber active:scale-[0.98]"
          >
            Open the Village OS Demo
            <ArrowUpRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function NextSteps() {
  const items = [
    {
      icon: Compass,
      label: "Visit",
      sub: "Plan a stay, immersion, or work-stay. Come experience the village in person and meet the community.",
      href: "/village",
      cta: "Plan a visit",
    },
    {
      icon: Users,
      label: "Membership",
      sub: "Apply for membership and help shape the future of the village campus from the beginning.",
      href: "/membership",
      cta: "Explore membership",
    },
    {
      icon: Handshake,
      label: "Partner & Invest",
      sub: "Investor and partnership opportunities to help develop the Wells Gray Village campus and the broader network.",
      href: "/partner",
      cta: "Partner with us",
    },
  ];

  return (
    <section className="bg-[#0F0E12] py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-5 lg:mb-6">
            Where to go from here
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Three Ways<br />
            <span className="italic">To Get Involved.</span>
          </h2>
        </div>

        <div className="mx-auto max-w-[1100px] grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7 transition-all hover:border-amber/30 hover:bg-white/[0.05]"
              >
                <item.icon size={22} weight="light" className="text-amber mb-5" />
                <div className="text-base font-medium text-white mb-2">{item.label}</div>
                <p className="text-sm leading-relaxed text-white/55 flex-1">{item.sub}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber/80 group-hover:text-amber">
                  {item.cta}
                  <ArrowRight size={13} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-16 text-center text-xs text-white/40">
          Questions? <Link href="/contact" className="text-amber/80 hover:text-amber transition-colors">Get in touch</Link>.
        </p>
      </div>
    </section>
  );
}

export default function WalkthroughPage() {
  return (
    <>
      <Hero />
      <NextSteps />
    </>
  );
}

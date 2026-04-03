"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  WhatsappLogo,
  EnvelopeSimple,
  ArrowUpRight,
} from "@phosphor-icons/react";

const clipEase = [0.16, 1, 0.3, 1] as const;

function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-warm-dark flex items-end">
      <div className="absolute inset-0">
        <Image
          src="/images/76747423_10163561173205725_3017674924459294720_n-1024x577.jpg"
          alt="Portal.Place — Contact"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-warm-dark/70 to-warm-dark/30" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pb-28 pt-48 lg:px-16">
        <div className="overflow-hidden pb-10 -mb-10">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: clipEase }}
            className="font-serif text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.9] tracking-tighter text-white"
          >
            Contact
          </motion.h1>
        </div>
      </div>
    </section>
  );
}

function MikeSection() {
  return (
    <section className="bg-[#0F0E12] py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative aspect-square w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-sm"
          >
            <Image
              src="/images/whatsapp-image-2023-04-17-at-7.56.02-pm-e1682551976380-q5lr8rk29co7jik4bsv2kxcsei9qedfve65zflydz8.jpeg"
              alt="Mike Gilliland"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-4">
              Mike Gilliland
            </h2>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber mb-10">
              Designer &middot; Entrepreneur &middot; Village Builder &middot;
              Podcaster
            </p>

            <div className="mb-10">
              <p className="text-sm text-white/50 mb-3">CEO &amp; Co-Founder of:</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { label: "FutureThinkers.org", href: "https://futurethinkers.org" },
                  { label: "Portal.Place", href: "https://portal.place" },
                  { label: "WellsGrayResort.ca", href: "https://wellsgrayresort.ca" },
                  { label: "DesignSpore.co", href: "https://designspore.co" },
                ].map((v) => (
                  <a
                    key={v.label}
                    href={v.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-amber"
                  >
                    {v.label}
                    <ArrowUpRight size={12} className="opacity-40" />
                  </a>
                ))}
              </div>
            </div>

            <p className="text-base leading-relaxed text-white/45 max-w-[52ch]">
              Mike Gilliland works at the intersection of regenerative community
              development, technology, and storytelling. His ventures include a
              media platform exploring societal futures, a global network of Smart
              Villages, a 400-acre prototype property, and a launch studio
              assisting founders.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactMethods() {
  return (
    <section className="bg-warm-dark py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* Left column */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-6">
              Get in touch
            </p>
            <h2 className="font-serif text-5xl font-light text-white lg:text-6xl mb-8">
              Contact<br />
              <span className="italic">methods</span>
            </h2>
            <p className="text-base leading-relaxed text-white/45 max-w-[48ch]">
              For the time being, I&rsquo;m listing my personal contact details.
              If you want to chat or ask questions about the project, or if you
              want to invest or collaborate, WhatsApp is probably the best choice.
            </p>
          </div>

          {/* Right column — contact cards */}
          <div className="space-y-0 divide-y divide-white/10 border-y border-white/10">
            {[
              {
                icon: WhatsappLogo,
                label: "WhatsApp",
                detail: "+1 (778) 586-5613",
                action: "Message on WhatsApp",
                href: "https://wa.me/17785865613",
              },
              {
                icon: EnvelopeSimple,
                label: "Email",
                detail: "mike@futurethinkers.org",
                action: "Send an email",
                href: "mailto:mike@futurethinkers.org",
              },
            ].map((method, i) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex items-center justify-between py-6"
              >
                <div className="flex items-center gap-4">
                  <method.icon
                    size={18}
                    weight="light"
                    className="text-amber shrink-0"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">
                      {method.label}
                    </div>
                    <div className="text-xs text-white/30 mt-0.5">
                      {method.detail}
                    </div>
                  </div>
                </div>
                <a
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/40 transition-all hover:text-amber hover:gap-3"
                >
                  {method.action} <ArrowUpRight size={13} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <Hero />
      <MikeSection />
      <ContactMethods />
    </>
  );
}

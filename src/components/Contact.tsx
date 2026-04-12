"use client";

import { motion } from "framer-motion";

const links = [
  { label: "Email", href: "mailto:mike@designspore.co", display: "mike@designspore.co" },
  { label: "Book a Call", href: "https://futurethinkers.org/call60", display: "60-min call" },
  { label: "X / Twitter", href: "https://x.com/FutureThinkers_", display: "@FutureThinkers_" },
  { label: "YouTube", href: "https://youtube.com/FutureThinkers", display: "Future Thinkers" },
  { label: "Instagram", href: "https://instagram.com/futurethinkers", display: "@futurethinkers" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mikegilliland", display: "mikegilliland" },
];

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-8 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
      >
        Get in Touch
      </motion.h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="group flex items-center justify-between rounded-lg border border-neutral-800 px-5 py-4 transition-colors hover:border-amber-600/40 hover:bg-neutral-900/50"
          >
            <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
              {link.label}
            </span>
            <span className="text-sm text-neutral-300 group-hover:text-amber-500 transition-colors">
              {link.display} &rarr;
            </span>
          </motion.a>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 text-center font-mono text-xs text-neutral-700"
      >
        Clearwater, BC &middot; {new Date().getFullYear()}
      </motion.p>
    </section>
  );
}

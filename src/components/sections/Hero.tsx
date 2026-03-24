"use client";

import { motion } from "framer-motion";

interface HeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  background?: "dark" | "indigo";
  className?: string;
}

export function Hero({
  title,
  subtitle,
  children,
  background = "dark",
  className = "",
}: HeroProps) {
  const bgStyles = {
    dark: "bg-dark text-white",
    indigo: "bg-indigo text-white",
  };

  return (
    <section
      className={`relative flex min-h-[70vh] items-center justify-center ${bgStyles[background]} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}

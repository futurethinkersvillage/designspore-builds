"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

const navItems = [
  {
    label: "The Village",
    href: "/village",
    children: [
      { label: "About Wells Gray", href: "/village" },
      { label: "Village Immersion", href: "/immersion" },
      { label: "Sunday Community Day", href: "/sunday" },
      { label: "Work-Stay Program", href: "/workstay" },
      { label: "Host An Event", href: "/host" },
      { label: "Videos", href: "/videos" },
    ],
  },
  { label: "Membership", href: "/membership" },
  { label: "Partners", href: "/partner" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about" },
      { label: "Consulting", href: "/consulting" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 z-50 w-full bg-warm-dark/70 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-16">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2.5">
          <div className="overflow-hidden shrink-0" style={{ height: "40px", width: "29px" }}>
            <Image
              src="/images/portalplace-logo-vertical-white-738x1024.png"
              alt=""
              width={29}
              height={40}
              style={{ height: "70px", width: "auto" }}
            />
          </div>
          <span className="text-[0.95rem] font-semibold tracking-tight text-white">
            Portal.Place
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="rounded-md px-4 py-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                {item.label}
              </Link>

              <AnimatePresence>
                {item.children && openDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-white/10 bg-warm-dark/95 p-2 shadow-2xl backdrop-blur-sm"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-4 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/membership"
            className="hidden rounded-full border border-terracotta px-5 py-2 text-sm font-medium text-terracotta transition-all hover:bg-terracotta hover:text-white active:scale-[0.98] lg:block"
          >
            Apply
          </Link>
          <button
            className="lg:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-warm-dark/98 backdrop-blur-sm lg:hidden"
          >
            <div className="space-y-1 px-6 py-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block py-3 text-base text-white/70 hover:text-white transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-2 pl-4 text-sm text-white/35 hover:text-white/70 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="pt-4 pb-2">
                <Link
                  href="/membership"
                  className="inline-flex rounded-full border border-terracotta px-6 py-2.5 text-sm font-medium text-terracotta"
                  onClick={() => setMobileOpen(false)}
                >
                  Apply for membership
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

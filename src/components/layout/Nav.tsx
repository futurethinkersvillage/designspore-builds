"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

function useIsDashboard() {
  const pathname = usePathname();
  return pathname.startsWith("/village-dashboard");
}

const navItems = [
  { label: "Vision", href: "/" },
  {
    label: "Wells Gray Village",
    href: "/village",
    children: [
      { label: "Virtual Tour", href: "/tour" },
      { label: "Gallery", href: "/gallery" },
      { label: "Videos & Photos", href: "/videos" },
      { label: "Village Rhythm", href: "/rhythm" },
      { label: "Village AI", href: "/village-ai" },
      { label: "Work-Stay Cohorts", href: "/workstay" },
      { label: "Book A Stay", href: "https://wellsgrayresort.ca", external: true },
      { label: "Host An Event", href: "/host" },
    ],
  },
  { label: "Members", href: "/membership" },
  { label: "Partners", href: "/partner" },
  { label: "Intel", href: "https://intel.portal.place", external: true },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Consulting", href: "/consulting" },
      { label: "Videos & Documentary", href: "/videos" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  if (pathname === "/investor-print" || pathname === "/tour" || pathname.startsWith("/village-dashboard")) return null;

  return (
    <header className="fixed top-0 z-50 w-full bg-warm-dark/70 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-16">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2.5">
          <div className="shrink-0 overflow-hidden" style={{ height: 26 }}>
            <Image
              src="/images/portalplace-logo-vertical-white-738x1024.png"
              alt="Portal.Place home"
              width={29}
              height={40}
              className="block"
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
              onFocus={() => item.children && setOpenDropdown(item.label)}
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenDropdown(null); }}
            >
              {"external" in item && item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-4 py-2 text-sm transition-colors hover:text-white text-white/60"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  aria-haspopup={item.children ? true : undefined}
                  aria-expanded={item.children ? openDropdown === item.label : undefined}
                  className={`rounded-md px-4 py-2 text-sm transition-colors hover:text-white ${pathname === item.href ? "text-white" : "text-white/60"}`}
                >
                  {item.label}
                </Link>
              )}

              <AnimatePresence>
                {item.children && openDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-white/10 bg-warm-dark/95 p-2 shadow-2xl backdrop-blur-sm"
                  >
                    {item.children.map((child) =>
                      "external" in child && child.external ? (
                        <a
                          key={child.href}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg px-4 py-2.5 text-sm text-white/65 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-4 py-2.5 text-sm text-white/65 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          {child.label}
                        </Link>
                      )
                    )}
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
            className="hidden rounded-full bg-amber px-5 py-2 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98] lg:block"
          >
            Become a Member
          </Link>
          <button
            className="lg:hidden text-white/70 hover:text-white transition-colors cursor-pointer"
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
                  {"external" in item && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-3 text-base transition-colors hover:text-white text-white/70"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={`block py-3 text-base transition-colors hover:text-white ${pathname === item.href ? "text-white" : "text-white/70"}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.children?.map((child) =>
                    "external" in child && child.external ? (
                      <a
                        key={child.href}
                        href={child.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border-l border-white/10 ml-2 pl-4 py-2 text-sm text-white/55 hover:text-white transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </a>
                    ) : (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block border-l border-white/10 ml-2 pl-4 py-2 text-sm text-white/55 hover:text-white transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    )
                  )}
                </div>
              ))}
              <div className="pt-4 pb-2">
                <Link
                  href="/membership"
                  className="inline-flex rounded-full bg-amber px-6 py-2.5 text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Become a Member
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

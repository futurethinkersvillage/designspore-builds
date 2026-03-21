"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";

const navLinks = [
  { href: "/ai-services", label: "AI Services" },
  { href: "/launch-services", label: "Launch" },
  { href: "/case-studies", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-dark/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 transition-opacity hover:opacity-80">
          <Image
            src="https://designspore.co/wp-content/uploads/2023/06/DesignSpore-Logo.png"
            alt="Design Spore"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded text-sm font-medium tracking-wide transition-colors ${
                  active ? "text-gold" : "text-white/60 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/contact" className="text-sm text-white/50 hover:text-white transition-colors font-medium">
            Contact
          </Link>
          <a
            href="http://futurethinkers.org/call60"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2 rounded bg-gold text-dark text-sm font-bold tracking-wide transition-all hover:bg-gold-light btn-press"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-white/70 hover:text-white rounded transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <XIcon size={22} weight="bold" /> : <ListIcon size={22} weight="bold" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/8 bg-darker px-5 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-3 rounded text-sm font-medium transition-colors ${
                  active ? "text-gold bg-gold/10" : "text-white/70 hover:text-white hover:bg-raised"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-3 rounded text-sm text-white/60 hover:text-white hover:bg-raised transition-colors"
          >
            Contact
          </Link>
          <div className="pt-3 mt-2 border-t border-white/8">
            <a
              href="http://futurethinkers.org/call60"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 rounded bg-gold text-dark text-sm font-bold tracking-wide btn-press"
            >
              Book a Strategy Call
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

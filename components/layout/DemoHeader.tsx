"use client";

import { useState, useEffect } from "react";
import { ListIcon, XIcon, PhoneIcon } from "@phosphor-icons/react";
import demoConfigRaw from "@/demo-config.json";
import type { DemoConfig } from "@/lib/demo-config";

const config = demoConfigRaw as DemoConfig;

const navLinks = [
  { href: "#demo-services", label: "Services" },
  { href: "#demo-about", label: "About" },
  { href: "#demo-social-proof", label: "Reviews" },
  { href: "#demo-contact", label: "Contact" },
];

export default function DemoHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-[48px] z-40 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-white/6 bg-darker/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "border-b border-transparent bg-dark/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo / business name */}
        <a href="#" className="flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-75">
          {config.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={config.logoUrl} alt={config.businessName} className="h-8 object-contain" />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
              style={{ background: "var(--accent, #BE8C2A)" }}
            >
              {config.businessName.charAt(0)}
            </div>
          )}
          <span className="font-bold text-white text-base tracking-tight" style={{ fontFamily: "var(--font-display-active, var(--font-fraunces, inherit))" }}>
            {config.businessName}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Site navigation">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="nav-link px-2 py-2">{label}</a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          {config.phone && (
            <a href={`tel:${config.phone}`} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
              <PhoneIcon size={14} />
              {config.phone}
            </a>
          )}
          <a href="#demo-contact" className="btn-primary text-sm">Get a Quote</a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-white/60 hover:text-white rounded transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <XIcon size={22} weight="bold" /> : <ListIcon size={22} weight="bold" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/6 bg-darker/98 backdrop-blur-xl px-5 py-4 flex flex-col gap-0.5">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-3 rounded text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="pt-3 mt-2 border-t border-white/6">
            <a href="#demo-contact" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center text-sm">
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

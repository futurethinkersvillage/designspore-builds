"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, YoutubeLogo, InstagramLogo } from "@phosphor-icons/react";

type FooterLink = { label: string; href: string; external?: boolean };
const footerLinks: { title: string; links: FooterLink[] }[] = [
  {
    title: "Wells Gray Village",
    links: [
      { label: "The Village", href: "/village" },
      { label: "Virtual Tour", href: "/tour" },
      { label: "Village OS", href: "https://village-dashboard.portal.place/", external: true },
      { label: "Videos & Photos", href: "/videos" },
      { label: "Work-Stay Cohorts", href: "/workstay" },
      { label: "Host An Event", href: "/host" },
    ],
  },
  {
    title: "Join",
    links: [
      { label: "Members", href: "/membership" },
      { label: "Partners", href: "/partner" },
      { label: "Consulting", href: "/consulting" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Newsletter signup", email, subject: "Newsletter Signup", message: `${email} signed up for updates.` }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-sm text-white/50">You&apos;re on the list. We&apos;ll be in touch.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
        className="min-w-0 flex-1 rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-[15px] text-white placeholder:text-white/30 focus:border-amber/60 focus-visible:outline-none lg:py-2 lg:text-sm"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="shrink-0 rounded-lg bg-amber px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-amber/90 disabled:opacity-60 lg:py-2"
        aria-label="Subscribe"
      >
        <ArrowRight size={14} weight="bold" />
      </button>
    </form>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/investor-print" || pathname.startsWith("/village-dashboard")) return null;

  return (
    <footer className="bg-warm-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="shrink-0 overflow-hidden" style={{ height: 26 }}>
                <Image
                  src="/images/portalplace-logo-vertical-white-738x1024.png"
                  alt="Portal.Place home"
                  width={26}
                  height={36}
                  className="block shrink-0"
                />
              </div>
              <span className="text-[0.95rem] font-semibold tracking-tight text-white">
                Portal.Place
              </span>
            </Link>
            <p className="mt-4 text-[15px] leading-relaxed text-white/60 max-w-[36ch] lg:text-sm lg:text-white/55">
              A seasonal village and membership community near Clearwater, BC.
            </p>
            {/* Social links */}
            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://www.youtube.com/@FutureThinkers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/50 transition-colors hover:text-amber"
              >
                <YoutubeLogo size={22} weight="light" />
              </a>
              <a
                href="https://www.instagram.com/wellsgrayresort/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/50 transition-colors hover:text-amber"
              >
                <InstagramLogo size={22} weight="light" />
              </a>
            </div>
            {/* Newsletter */}
            <div className="mt-7 max-w-sm">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/50 lg:text-white/40">Stay in the loop</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Nav links — 2-col grid on mobile/tablet, 3-col on desktop within remaining 3 grid cols */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-8">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 lg:text-xs lg:text-white/40">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3 lg:space-y-2.5">
                  {group.links.map((link) =>
                    link.external ? (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block py-0.5 text-[15px] text-white/70 transition-colors hover:text-white lg:text-sm lg:text-white/60"
                        >
                          {link.label}
                        </a>
                      </li>
                    ) : (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="inline-block py-0.5 text-[15px] text-white/70 transition-colors hover:text-white lg:text-sm lg:text-white/60"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center lg:mt-14">
          <p className="text-[13px] text-white/50 lg:text-sm lg:text-white/40">
            &copy; {new Date().getFullYear()} Portal.Place. All rights reserved.
          </p>
          <p className="mt-1 text-[11px] text-white/35 lg:text-xs lg:text-white/25">Near Clearwater, BC · Canada</p>
        </div>
      </div>
    </footer>
  );
}

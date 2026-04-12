"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, YoutubeLogo, InstagramLogo } from "@phosphor-icons/react";

const footerLinks = [
  {
    title: "Wells Gray Village",
    links: [
      { label: "The Village", href: "/village" },
      { label: "Virtual Tour", href: "/tour" },
      { label: "Village AI", href: "/village-ai" },
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
        className="min-w-0 flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-amber/60 focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="shrink-0 rounded-lg bg-amber px-4 py-2 text-sm font-medium text-white transition-all hover:bg-amber/90 disabled:opacity-60"
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
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand + newsletter */}
          <div className="col-span-2 lg:col-span-2">
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
              <span className="text-[0.9rem] font-semibold tracking-tight text-white">
                Portal.Place
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/55 max-w-[32ch]">
              A seasonal village and membership community near Clearwater, BC.
            </p>
            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.youtube.com/@FutureThinkers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/40 transition-colors hover:text-amber"
              >
                <YoutubeLogo size={20} weight="light" />
              </a>
              <a
                href="https://www.instagram.com/wellsgrayresort/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/40 transition-colors hover:text-amber"
              >
                <InstagramLogo size={20} weight="light" />
              </a>
            </div>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">Stay in the loop</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Nav links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} Portal.Place. All rights reserved.
          <p className="text-xs text-white/25 mt-1">Near Clearwater, BC · Canada</p>
        </div>
      </div>
    </footer>
  );
}

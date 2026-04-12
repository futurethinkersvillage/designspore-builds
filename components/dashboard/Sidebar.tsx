"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modules", label: "Browse Services" },
  { href: "/requests", label: "Change Requests" },
  { href: "/account", label: "Account" },
];

const serviceDashboards = [
  { href: "/services/monthly-analytics",       label: "Analytics Report" },
  { href: "/services/chatbot-setup",            label: "Website Chatbot" },
  { href: "/services/review-automation",        label: "Review Generation" },
  { href: "/services/missed-call-text-back",    label: "Missed Call Text-Back" },
  { href: "/services/appointment-booking",      label: "Booking Automation" },
  { href: "/services/lead-sourcing",            label: "Lead Sourcing" },
  { href: "/services/competitor-pricing-monitor", label: "Competitor Monitor" },
  { href: "/services/seo-health-check",         label: "SEO Health Check" },
  { href: "/services/lead-response-automation", label: "Lead Response" },
  { href: "/services/reputation-management",    label: "Reputation Mgmt" },
  { href: "/services/phone-system",             label: "AI Phone System" },
];

const ADMIN_EMAILS = ["mike@designspore.co", "futurethinkerspodcast@gmail.com", "mikenoises@gmail.com"];

interface SidebarProps {
  isDemo?: boolean;
  userEmail?: string | null;
}

export default function Sidebar({ isDemo, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = !isDemo && !!userEmail && ADMIN_EMAILS.includes(userEmail);
  const isOnServiceDash = pathname.startsWith("/services/");
  const [dashOpen, setDashOpen] = useState(isOnServiceDash);

  return (
    <aside className="hidden lg:flex flex-col w-64 sticky top-0 h-screen bg-darker border-r border-white/[0.06] px-6 py-8 shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-2.5 mb-0.5">
          <Image
            src="/uploads/2023/06/DesignSpore-Logo.png"
            alt="DesignSpore"
            width={28}
            height={28}
            className="rounded-md shrink-0"
          />
          <span
            className="text-lg font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-outfit, var(--font-sans))" }}
          >
            Design<span className="text-gold">Spore</span>
          </span>
        </div>
        <p className="text-[11px] text-white/30 mt-0.5 uppercase tracking-widest pl-9">
          Client Portal
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "text-white bg-white/[0.07]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {label}
            </Link>
          );
        })}

        {/* Service Dashboards collapsible */}
        <div className="pt-3">
          <button
            onClick={() => setDashOpen(o => !o)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-colors"
          >
            <span>Service Previews</span>
            <span className="text-white/20 text-base leading-none">{dashOpen ? "−" : "+"}</span>
          </button>

          {dashOpen && (
            <div className="mt-1 space-y-0.5 pl-2">
              {serviceDashboards.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      active
                        ? "text-gold bg-gold/[0.08]"
                        : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Admin link */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors mb-2"
        >
          Admin
        </Link>
      )}

      {/* Sign out / Exit demo */}
      {isDemo ? (
        <a
          href="/api/demo/exit"
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors block"
        >
          Exit demo
        </a>
      ) : (
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
          >
            Sign out
          </button>
        </form>
      )}
    </aside>
  );
}

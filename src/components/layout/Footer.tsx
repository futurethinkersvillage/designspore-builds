import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "Wells Gray Village",
    links: [
      { label: "The Village", href: "/village" },
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
      { label: "Videos & Documentary", href: "/videos" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-warm-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/images/portalplace-logo-vertical-white-738x1024.png"
                alt="Portal.Place home"
                width={26}
                height={36}
                className="shrink-0"
              />
              <span className="text-[0.9rem] font-semibold tracking-tight text-white">
                Portal.Place
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60">
              A seasonal village and membership community near Clearwater, BC.
            </p>
          </div>
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

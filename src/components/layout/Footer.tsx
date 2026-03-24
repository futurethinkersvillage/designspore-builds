import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "Visit",
    links: [
      { label: "The Village", href: "/village" },
      { label: "Village Immersion", href: "/immersion" },
      { label: "Sunday Community Day", href: "/sunday" },
      { label: "Work-Stay", href: "/workstay" },
      { label: "Host An Event", href: "/host" },
    ],
  },
  {
    title: "Join",
    links: [
      { label: "Membership", href: "/membership" },
      { label: "Partners", href: "/partner" },
      { label: "Consulting", href: "/consulting" },
    ],
  },
  {
    title: "Learn More",
    links: [
      { label: "About", href: "/about" },
      { label: "Videos", href: "/videos" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/portalplace-logo-horizontal.png"
                alt="Portal.Place"
                width={140}
                height={36}
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-white/60">
              A Smart Village in Wells Gray, BC.
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
        </div>
      </div>
    </footer>
  );
}

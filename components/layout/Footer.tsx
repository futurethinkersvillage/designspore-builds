import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

const serviceLinks = [
  { href: "/ai-services", label: "AI Services" },
  { href: "/launch-services", label: "Launch Services" },
  { href: "/case-studies", label: "Case Studies" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-darker text-white/60 border-t border-white/8">
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-12 border-b border-white/8">

          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 transition-opacity hover:opacity-80">
              <Image
                src="/uploads/2023/06/DesignSpore-Logo.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span
                className="font-bold text-white text-base tracking-tight"
                style={{ fontFamily: "var(--font-archivo)" }}
              >
                Design Spore
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-white/40">
              AI systems, websites, and automations for real businesses.
              Based in Clearwater, BC.
            </p>
            <p className="text-sm mt-5 text-white/25 leading-relaxed max-w-xs">
              Design Spore is part of a broader effort to build a more
              innovative, resilient Clearwater.{" "}
              <a
                href="https://portal.place"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 underline underline-offset-2 hover:text-gold transition-colors inline-flex items-center gap-0.5"
              >
                Explore Portal.Place
                <ArrowUpRightIcon size={11} />
              </a>
            </p>
          </div>

          {/* Services */}
          <div className="md:col-span-3 md:col-start-7">
            <p className="text-xs uppercase tracking-widest text-white/25 mb-4 font-semibold">Services</p>
            <ul className="flex flex-col gap-3">
              {serviceLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-white/25 mb-4 font-semibold">Company</p>
            <ul className="flex flex-col gap-3">
              {companyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Design Spore. Clearwater, BC, Canada.
          </p>
          <a
            href="http://futurethinkers.org/call60"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gold hover:text-gold-light transition-colors font-semibold tracking-wide"
          >
            Start a Plan &rarr;
          </a>
        </div>
      </div>
    </footer>
  );
}

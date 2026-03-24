import Link from "next/link";
import { signOut } from "@/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modules", label: "Browse Modules" },
  { href: "/my-modules", label: "My Modules" },
  { href: "/account", label: "Account" },
];

interface SidebarProps {
  isDemo?: boolean;
}

export default function Sidebar({ isDemo }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-full bg-darker border-r border-white/[0.06] px-6 py-8 shrink-0">
      {/* Logo */}
      <div className="mb-10">
        <span
          className="text-lg font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-outfit, var(--font-sans))" }}
        >
          Design<span className="text-gold">Spore</span>
        </span>
        <p className="text-[11px] text-white/30 mt-0.5 uppercase tracking-widest">
          Client Portal
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out / Exit demo */}
      {isDemo ? (
        <a
          href="/api/demo/exit"
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors block"
        >
          Exit demo
        </a>
      ) : (
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
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

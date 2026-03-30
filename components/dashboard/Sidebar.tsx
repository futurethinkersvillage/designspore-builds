import Link from "next/link";
import Image from "next/image";
import { signOut, auth } from "@/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modules", label: "Browse Services" },
  { href: "/requests", label: "Change Requests" },
  { href: "/account", label: "Account" },
];

const ADMIN_EMAILS = ["mike@designspore.co", "futurethinkerspodcast@gmail.com", "mikenoises@gmail.com"];

interface SidebarProps {
  isDemo?: boolean;
}

export default async function Sidebar({ isDemo }: SidebarProps) {
  const session = !isDemo ? await auth() : null;
  const isAdmin = session?.user && ADMIN_EMAILS.includes((session.user as { email?: string | null }).email ?? "");
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-full bg-darker border-r border-white/[0.06] px-6 py-8 shrink-0">
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

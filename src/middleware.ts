import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Password-gated paths (startsWith match). "/deck" also covers /deck, /deckN,
// and the static bundles at /deck1/*, /deck2/* (all start with "/deck"). "/join"
// covers the member sales deck + its /join/* bundle. Both decks contain
// membership pricing, which must never be public.
const PROTECTED_PATHS = ["/investor-print", "/deck", "/join"];

const DASHBOARD_HOSTS = [
  "village-dashboard.portal.place",
  "village-dashboard.localhost",
];

function isDashboardHost(host: string): boolean {
  const hostname = host.split(":")[0];
  return DASHBOARD_HOSTS.includes(hostname);
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Subdomain routing: village-dashboard.portal.place → /village-dashboard/*
  if (isDashboardHost(host)) {
    // PWA assets must resolve at the host root (manifest scope + service-worker
    // scope are "/"). Serve them as-is instead of rewriting into /village-dashboard.
    if (pathname === "/manifest.webmanifest" || pathname === "/sw.js") {
      const res = NextResponse.next();
      res.headers.set("x-is-dashboard", "1");
      return res;
    }
    // Rewrite short paths (e.g. /fundraising) to internal /village-dashboard/... paths.
    // Skip if already prefixed (avoids double-rewriting).
    if (!pathname.startsWith("/village-dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname === "/" ? "/village-dashboard" : `/village-dashboard${pathname}`;
      const res = NextResponse.rewrite(url);
      res.headers.set("x-is-dashboard", "1");
      return res;
    }
    // Already an internal village-dashboard path — pass through with header
    const res = NextResponse.next();
    res.headers.set("x-is-dashboard", "1");
    return res;
  }

  // Full-screen routes (no Nav/Footer/Chat) — reuse the dashboard chrome flag.
  if (
    pathname === "/mind-map" || pathname.startsWith("/mind-map/") ||
    pathname === "/map" || pathname.startsWith("/map/") ||
    pathname === "/map-editor" || pathname.startsWith("/map-editor/")
  ) {
    const res = NextResponse.next();
    res.headers.set("x-is-dashboard", "1");
    return res;
  }

  // Existing investor auth logic
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("investor_auth")?.value;
  const validToken = process.env.INVESTOR_AUTH_TOKEN;

  if (!validToken || token !== validToken) {
    const loginUrl = new URL("/investor-login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authed. The /deck, /deckN and /join routes are full-screen iframe decks —
  // render without site chrome (Nav/Footer/Chat), reusing the dashboard flag.
  const res = NextResponse.next();
  if (pathname === "/deck" || /^\/deck\d+$/.test(pathname) || pathname === "/join") {
    res.headers.set("x-is-dashboard", "1");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};

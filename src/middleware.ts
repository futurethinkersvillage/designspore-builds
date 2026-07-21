import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Password-gated paths (startsWith match). "/deck" also covers /deck, /deckN,
// and the static bundles at /deck1/*, /deck2/* (all start with "/deck").
// NOTE: "/cabin-fund" and "/membership" are intentionally NOT gated. "/membership"
// is the public club-membership sales deck (access membership, not a security) that
// collects $2,000 deposits; cabin-fund is public for review. Both render chrome-free
// via the full-screen block below. (/join is a legacy alias → redirects to /membership.)
const PROTECTED_PATHS = ["/investor-print", "/deck"];

const DASHBOARD_HOSTS = [
  "village-dashboard.portal.place",
  "village-dashboard.localhost",
];

function isDashboardHost(host: string): boolean {
  const hostname = host.split(":")[0];
  return DASHBOARD_HOSTS.includes(hostname);
}

// wikihouse-configurator.portal.place → static app at /wikihouse-configurator/*
const CONFIGURATOR_HOSTS = [
  "wikihouse-configurator.portal.place",
  "wikihouse-configurator.localhost",
];

function isConfiguratorHost(host: string): boolean {
  const hostname = host.split(":")[0];
  return CONFIGURATOR_HOSTS.includes(hostname);
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

  // Subdomain routing: wikihouse-configurator.portal.place → static app files.
  // Serve index.html at the root and prefix all other (asset) paths so the app's
  // relative fetches (blocks-*.json, js/, vendor/) resolve under the bundle.
  if (isConfiguratorHost(host)) {
    if (!pathname.startsWith("/wikihouse-configurator")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname === "/"
        ? "/wikihouse-configurator/index.html"
        : `/wikihouse-configurator${pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Legacy: the interactive map moved from /map to /tour (the deck and older
  // links still say portal.place/map). Permanent redirect, search preserved
  // (the #deep-link fragment survives redirects client-side).
  if (pathname === "/map" || pathname.startsWith("/map/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/tour";
    return NextResponse.redirect(url, 308);
  }

  // Full-screen routes (no Nav/Footer/Chat) — reuse the dashboard chrome flag.
  if (
    pathname === "/mind-map" || pathname.startsWith("/mind-map/") ||
    pathname === "/tour" || pathname.startsWith("/tour/") ||
    pathname === "/map-editor" || pathname.startsWith("/map-editor/") ||
    pathname === "/cabin-fund" || pathname.startsWith("/cabin-fund/") ||
    pathname === "/cabin-fund2" || pathname.startsWith("/cabin-fund2/") ||
    pathname === "/future-school" || pathname.startsWith("/future-school/") ||
    pathname === "/future-school4" || pathname.startsWith("/future-school4/") ||
    pathname === "/membership" || pathname.startsWith("/membership/")
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

  // Authed. The /deck and /deckN routes are full-screen iframe decks — render
  // without site chrome (Nav/Footer/Chat), reusing the dashboard flag.
  const res = NextResponse.next();
  if (pathname === "/deck" || /^\/deck\d+$/.test(pathname)) {
    res.headers.set("x-is-dashboard", "1");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};

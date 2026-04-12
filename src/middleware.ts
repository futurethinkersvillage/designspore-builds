import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/deck", "/one-pager", "/investor-print"];

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
    // Already rewritten — skip
    if (pathname.startsWith("/village-dashboard")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = `/village-dashboard${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};

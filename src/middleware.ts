import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/deck", "/one-pager", "/investor-print"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
  matcher: ["/deck/:path*", "/one-pager/:path*", "/investor-print/:path*"],
};

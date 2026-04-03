import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/modules", "/my-modules", "/account"];
const authPaths = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Demo mode bypass — valid ds_demo cookie skips auth entirely
  const demoCookie = request.cookies.get("ds_demo");
  if (demoCookie?.value && demoCookie.value === process.env.DEMO_SECRET) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: true,
  });

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPath = authPaths.some((p) => pathname === p);

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|favicon\\.png).*)"],
};

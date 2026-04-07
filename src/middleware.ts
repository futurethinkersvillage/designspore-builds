import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// No protected routes — investor pages are public.
// Sensitive figures are gated by NDA signature (investor_nda cookie).
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

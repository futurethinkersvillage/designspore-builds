import { NextRequest, NextResponse } from "next/server";

function getPublicOrigin(request: NextRequest): string {
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (request.nextUrl.protocol.replace(":", "") || "https");
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "designspore.co";
  return `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/login", getPublicOrigin(request))
  );
  response.cookies.delete("ds_demo");
  return response;
}

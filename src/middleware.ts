/** biome-ignore-all lint/suspicious/noExplicitAny: *** */

import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
// import { createRouteMatcher } from "./lib/clerkjs/routeMatcher";

export async function middleware(request: NextRequest) {
  const vercelIp = (request as any).ip;

  const xForwardedFor = request.headers.get("x-forwarded-for");

  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  const xRealIp = request.headers.get("x-real-ip");

  const rawIp =
    cfConnectingIp || vercelIp || xRealIp || xForwardedFor || "127.0.0.1";

  const ip = rawIp.split(",")[0].trim();

  const session = getSessionCookie(request);

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-custom-client-ip", ip);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

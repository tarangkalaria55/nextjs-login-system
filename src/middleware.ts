/** biome-ignore-all lint/suspicious/noExplicitAny: *** */

import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { auth } from "./lib/auth/auth";
// import { createRouteMatcher } from "./lib/clerkjs/routeMatcher";

export async function middleware(request: NextRequest) {
  const vercelIp = (request as any).ip;

  const xForwardedFor = request.headers.get("x-forwarded-for");

  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  const xRealIp = request.headers.get("x-real-ip");

  const rawIp =
    cfConnectingIp || vercelIp || xRealIp || xForwardedFor || "127.0.0.1";

  const ip = rawIp.split(",")[0].trim();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  logger.info("middleware", {
    session: session?.session,
    clientIp: ip,
    url: request.url,
    method: request.method,
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-custom-client-ip", ip);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

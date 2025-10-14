import { logger } from "better-auth";
import { type NextRequest, NextResponse } from "next/server";
// import { createRouteMatcher } from "./lib/clerkjs/routeMatcher";

export async function middleware(request: NextRequest) {
  logger.info("middleware GET request", {
    url: request.url,
    method: request.method,
    nextUrl: request.nextUrl,
  });

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

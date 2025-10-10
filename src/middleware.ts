import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth/auth";
import { createRouteMatcher } from "./lib/clerkjs/routeMatcher";

const isAuthRoute = createRouteMatcher(["/login", "/sign-up"]);

const isPublicRoute = createRouteMatcher([]);

const loginUrl = "/login";
const dashboardUrl = "/dashboard";

export async function middleware(request: NextRequest) {
  const isPublicUrl = isPublicRoute(request);
  const isAuthUrl = isAuthRoute(request);
  const isProtectedUrl = !isPublicUrl && !isAuthUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session;

  if (isAuthUrl && isLoggedIn) {
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  if (isProtectedUrl && !isLoggedIn) {
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

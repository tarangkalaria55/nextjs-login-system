import { logger } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";

const authHandlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  logger.info("better-auth GET request", {
    url: request.url,
    method: request.method,
    nextUrl: request.nextUrl,
  });

  return await authHandlers.GET(request);
}

export async function POST(request: NextRequest) {
  logger.info("better-auth POST request", {
    url: request.url,
    method: request.method,
    nextUrl: request.nextUrl,
  });

  return await authHandlers.POST(request);
}

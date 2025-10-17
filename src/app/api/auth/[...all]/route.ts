import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";

// import type { NextRequest } from "next/server";

const authHandlers = toNextJsHandler(auth);

export const { GET, POST } = authHandlers;

// export async function GET(request: NextRequest) {
//   return await authHandlers.GET(request);
// }

// export async function POST(request: NextRequest) {
//   return await authHandlers.POST(request);
// }

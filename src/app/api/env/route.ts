import { type NextRequest, NextResponse } from "next/server";
import { env as clientEnv } from "@/env/client";
import { env as serverEnv } from "@/env/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json({ ...clientEnv, ...serverEnv }, { status: 200 });
}

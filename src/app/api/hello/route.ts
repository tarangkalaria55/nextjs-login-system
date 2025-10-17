import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    { environment: { ...process.env } },
    { status: 200 },
  );
}

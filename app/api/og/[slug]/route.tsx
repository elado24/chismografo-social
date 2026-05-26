import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL("/og-chismografo.png", request.url);

  return NextResponse.redirect(url, {
    status: 307,
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}

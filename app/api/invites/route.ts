import { NextResponse } from "next/server";
import { getClientKey, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { createInvite } from "@/lib/repository";
import { getBaseUrl } from "@/lib/share";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const limit = rateLimit(getClientKey(request, "invite"), 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiadas invitaciones seguidas." }, { status: 429, headers: rateLimitHeaders(limit) });
  }

  const user = await getCurrentUser();
  const invite = await createInvite(user);
  const url = `${getBaseUrl()}/?invite=${invite.code}&utm_source=invite`;

  return NextResponse.json({ invite, url }, { status: 201, headers: rateLimitHeaders(limit) });
}

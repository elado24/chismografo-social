import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientKey, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { createReaction } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";

const reactionSchema = z.object({
  answerId: z.string(),
  emoji: z.enum(["heart", "fire", "laugh", "tea", "shock"])
});

export async function POST(request: Request) {
  const limit = rateLimit(getClientKey(request, "reaction"), 30, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiadas reacciones seguidas." }, { status: 429, headers: rateLimitHeaders(limit) });
  }

  const payload = reactionSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Reacción inválida", details: payload.error.flatten() }, { status: 400 });
  }

  const user = await getCurrentUser();
  const reaction = await createReaction({ user, ...payload.data });

  return NextResponse.json({ reaction }, { status: 201, headers: rateLimitHeaders(limit) });
}

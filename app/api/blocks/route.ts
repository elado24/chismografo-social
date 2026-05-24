import { NextResponse } from "next/server";
import { z } from "zod";
import { blockUser } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";

const blockSchema = z.object({
  blockedUsername: z.string().min(2).max(24),
  reason: z.string().max(180).optional()
});

export async function POST(request: Request) {
  const payload = blockSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Bloqueo inválido", details: payload.error.flatten() }, { status: 400 });
  }

  const blocker = await getCurrentUser();
  if (payload.data.blockedUsername === blocker.username) {
    return NextResponse.json({ error: "No puedes bloquearte a ti mismo." }, { status: 400 });
  }

  const block = await blockUser({ blocker, ...payload.data });

  return NextResponse.json({ block }, { status: 201 });
}

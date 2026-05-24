import { NextResponse } from "next/server";
import { z } from "zod";
import { markNotificationsRead } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";

const readSchema = z.object({
  ids: z.array(z.string()).optional()
});

export async function POST(request: Request) {
  const payload = readSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Solicitud inválida", details: payload.error.flatten() }, { status: 400 });
  }

  const user = await getCurrentUser();
  const result = await markNotificationsRead(user, payload.data.ids);

  return NextResponse.json(result);
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { savePushSubscription } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(10),
    auth: z.string().min(6)
  })
});

export async function POST(request: Request) {
  const payload = subscriptionSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Suscripción push inválida", details: payload.error.flatten() }, { status: 400 });
  }

  const user = await getCurrentUser();
  const subscription = await savePushSubscription({
    user,
    endpoint: payload.data.endpoint,
    p256dh: payload.data.keys.p256dh,
    auth: payload.data.keys.auth,
    userAgent: request.headers.get("user-agent")
  });

  return NextResponse.json({ subscription }, { status: 201 });
}

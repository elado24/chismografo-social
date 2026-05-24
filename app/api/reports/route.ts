import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientKey, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { createReport } from "@/lib/repository";
import { getCurrentUser } from "@/lib/session";

const reportSchema = z.object({
  answerId: z.string().optional(),
  reportedUsername: z.string().min(2).max(24).optional(),
  reason: z.string().min(4).max(240)
});

export async function POST(request: Request) {
  const limit = rateLimit(getClientKey(request, "report"), 6, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiados reportes seguidos." }, { status: 429, headers: rateLimitHeaders(limit) });
  }

  const payload = reportSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Reporte inválido", details: payload.error.flatten() }, { status: 400 });
  }

  if (!payload.data.answerId && !payload.data.reportedUsername) {
    return NextResponse.json({ error: "Indica una respuesta o usuario a reportar." }, { status: 400 });
  }

  const reporter = await getCurrentUser();
  const report = await createReport({ reporter, ...payload.data });

  return NextResponse.json({ report, status: "OPEN" }, { status: 201, headers: rateLimitHeaders(limit) });
}

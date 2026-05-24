import { NextResponse } from "next/server";
import { z } from "zod";
import { extractMentions, moderateText } from "@/lib/moderation";
import { enqueuePush } from "@/lib/push";
import { rateLimit, rateLimitHeaders, getClientKey } from "@/lib/rate-limit";
import { createAnswer } from "@/lib/repository";
import { publishRealtime } from "@/lib/realtime";
import { createShareUrl } from "@/lib/share";
import { getCurrentUser } from "@/lib/session";

const answerSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  body: z.string().min(1).max(280),
  isAnonymous: z.boolean().default(false)
});

export async function POST(request: Request) {
  const limit = rateLimit(getClientKey(request, "answer"), 8, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas respuestas seguidas. Intenta de nuevo en un momento." },
      { status: 429, headers: rateLimitHeaders(limit) }
    );
  }

  const payload = answerSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Respuesta inválida", details: payload.error.flatten() }, { status: 400 });
  }

  const moderation = moderateText(payload.data.body);
  if (!moderation.allowed) {
    return NextResponse.json({ error: "Contenido bloqueado por seguridad", moderation }, { status: 422 });
  }

  const author = await getCurrentUser();
  const mentions = [...new Set(extractMentions(payload.data.body))].slice(0, 5);
  const answer = await createAnswer({
    author,
    questionId: payload.data.questionId,
    question: payload.data.question,
    body: payload.data.body,
    isAnonymous: payload.data.isAnonymous,
    mentionedUsernames: mentions
  });

  await Promise.all(
    answer.mentions.map((friend) =>
      Promise.all([
        publishRealtime({
          type: "mention",
          userId: friend.id,
          payload: {
            from: author.username,
            question: payload.data.question,
            answer: payload.data.body,
            shareSlug: answer.shareSlug
          }
        }),
        enqueuePush({
          userId: friend.id,
          title: `${author.username} te mencionó`,
          body: payload.data.question,
          url: createShareUrl(answer.shareSlug)
        })
      ])
    )
  );

  return NextResponse.json(
    {
      answer,
      shareUrl: createShareUrl(answer.shareSlug),
      moderation
    },
    { status: 201, headers: rateLimitHeaders(limit) }
  );
}

import { NextResponse } from "next/server";
import { listQuestions } from "@/lib/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const mode = searchParams.get("mode");
  const questions = await listQuestions({ category, mode });

  return NextResponse.json({
    questions,
    total: questions.length,
    strategy: process.env.DATABASE_URL ? "prisma-with-seeded-fallback" : "seeded-demo"
  });
}

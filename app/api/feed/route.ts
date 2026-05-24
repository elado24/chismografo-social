import { NextResponse } from "next/server";
import { listViralFeed } from "@/lib/repository";

export async function GET() {
  const items = await listViralFeed();

  return NextResponse.json({
    items,
    rankingWindow: "weekly",
    nextCursor: "demo-cursor"
  });
}

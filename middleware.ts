import { NextRequest, NextResponse } from "next/server";

const socialBotPattern = /facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot/i;

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const slugMatch = request.nextUrl.pathname.match(/^\/share\/([^/]+)$/);

  if (slugMatch && socialBotPattern.test(userAgent)) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/share-meta/${slugMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/share/:slug*"]
};

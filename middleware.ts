import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const slugMatch = request.nextUrl.pathname.match(/^\/share\/([^/]+)$/);

  if (slugMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/share-meta/${slugMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/share/:slug*"]
};

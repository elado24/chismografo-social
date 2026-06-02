import { feedItems } from "@/data/demo";

type Props = { params: Promise<{ slug: string }> };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://chismografo-social.vercel.app";
  const item = feedItems.find((entry) => entry.slug === slug) ?? feedItems[0];
  const url = `${baseUrl}/share/${slug}`;
  const appUrl = `${baseUrl}/?from=share&slug=${slug}`;
  const image = `${baseUrl}/api/og/${slug}`;
  const appId = process.env.FACEBOOK_APP_ID ?? "000000000000000";
  const title = escapeHtml(item.question);
  const description = escapeHtml(item.answer);

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="fb:app_id" content="${escapeHtml(appId)}">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Chismógrafo Social">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:image:secure_url" content="${escapeHtml(image)}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <link rel="canonical" href="${escapeHtml(url)}">
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      color: white;
      background: radial-gradient(circle at 20% 10%, rgba(255,77,103,.32), transparent 24rem),
        radial-gradient(circle at 85% 15%, rgba(33,245,170,.22), transparent 22rem),
        #08080d;
      font-family: Arial, Helvetica, sans-serif;
    }
    main {
      width: min(100%, 560px);
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 28px;
      padding: 28px;
      background: rgba(255,255,255,.08);
      backdrop-filter: blur(18px);
    }
    h1 { font-size: clamp(2rem, 8vw, 3.5rem); line-height: 1; margin: 0 0 20px; }
    p { color: rgba(255,255,255,.78); font-size: 1.2rem; font-weight: 800; line-height: 1.35; }
    a {
      display: inline-flex;
      margin-top: 18px;
      padding: 14px 20px;
      border-radius: 999px;
      background: #21f5aa;
      color: #08080d;
      font-weight: 900;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <main>
    <strong>Chismógrafo Social</strong>
    <h1>${title}</h1>
    <p>${description}</p>
    <a href="${escapeHtml(appUrl)}">Responder mi versión</a>
  </main>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300"
    }
  });
}

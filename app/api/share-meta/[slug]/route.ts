import { feedItems } from "@/data/demo";
import { appBaseUrl, facebookAppId } from "@/lib/constants";

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
  const item = feedItems.find((entry) => entry.slug === slug) ?? feedItems[0];
  const url = `${appBaseUrl}/share/${slug}`;
  const image = `${appBaseUrl}/api/og/${slug}`;
  const title = escapeHtml(item.question);
  const description = escapeHtml(item.answer);

  const html = `<!doctype html>
<html lang="es" prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb#">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="fb:app_id" content="${escapeHtml(facebookAppId)}">
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
  <meta property="og:image:alt" content="Chismógrafo Social - respuesta viral">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <link rel="canonical" href="${escapeHtml(url)}">
</head>
<body>
  <p><a href="${escapeHtml(url)}">Abrir Chismógrafo Social</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600"
    }
  });
}

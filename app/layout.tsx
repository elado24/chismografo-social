import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Chismógrafo Social";
const description =
  "Juego social viral para responder preguntas, mencionar amigos, recibir notificaciones y compartir chismes tipo story.";
const baseUrl = process.env.NEXTAUTH_URL ?? "https://chismografo-social.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title,
  description,
  applicationName: title,
  openGraph: {
    title,
    description,
    type: "website",
    url: baseUrl,
    siteName: title,
    images: [{ url: "/og-chismografo.png", width: 1200, height: 630 }]
  },
  other: {
    "fb:app_id": process.env.FACEBOOK_APP_ID ?? "000000000000000"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-chismografo.png"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#08080d"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

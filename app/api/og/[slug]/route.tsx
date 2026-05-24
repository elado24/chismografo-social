import { ImageResponse } from "next/og";
import { feedItems } from "@/data/demo";

export const runtime = "edge";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const item = feedItems.find((entry) => entry.slug === slug) ?? feedItems[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "white",
          background: "linear-gradient(135deg, #08080d 0%, #261226 52%, #081923 100%)",
          fontFamily: "Arial"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px", fontSize: 34, fontWeight: 900 }}>
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: 22,
              background: "linear-gradient(135deg, #ff4d67, #21f5aa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#08080d"
            }}
          >
            CS
          </div>
          Chismógrafo Social
        </div>
        <div>
          <div style={{ color: "#21f5aa", fontSize: 32, fontWeight: 900, marginBottom: 22 }}>Respuesta viral</div>
          <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.02 }}>{item.question}</div>
          <div style={{ marginTop: 34, fontSize: 36, fontWeight: 800, color: "rgba(255,255,255,.78)" }}>{item.answer}</div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#f8d34a" }}>@{item.author.username} · responde tu versión</div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}

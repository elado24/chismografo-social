import { feedItems } from "@/data/demo";
import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };
const baseUrl = process.env.NEXTAUTH_URL ?? "https://chismografo-social.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = feedItems.find((entry) => entry.slug === slug) ?? feedItems[0];
  const url = `${baseUrl}/share/${slug}`;

  return {
    title: `${item.author.name} respondió en Chismógrafo Social`,
    description: item.question,
    openGraph: {
      title: item.question,
      description: item.answer,
      type: "website",
      url,
      siteName: "Chismógrafo Social",
      images: [{ url: `/api/og/${slug}`, width: 1200, height: 630 }]
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID ?? "000000000000000"
    },
    twitter: {
      card: "summary_large_image",
      title: item.question,
      description: item.answer,
      images: [`/api/og/${slug}`]
    }
  };
}

export default async function SharePage({ params }: Props) {
  const { slug } = await params;
  const item = feedItems.find((entry) => entry.slug === slug) ?? feedItems[0];

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="glass w-full max-w-lg rounded-[2rem] p-6 shadow-hot">
        <div className="flex items-center gap-3">
          <img className="size-14 rounded-2xl object-cover" src={item.author.avatar} alt="" />
          <div>
            <p className="font-black">@{item.author.username}</p>
            <p className="text-sm text-white/54">respuesta viral</p>
          </div>
        </div>
        <h1 className="mt-6 text-3xl font-black leading-tight">{item.question}</h1>
        <p className="mt-5 text-xl font-bold text-white/82">{item.answer}</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-neon px-5 py-3 font-black text-ink">
          Responder mi versión
        </Link>
      </section>
    </main>
  );
}

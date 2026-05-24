import { demoUser, feedItems, friends } from "@/data/demo";
import Link from "next/link";

type Props = { params: Promise<{ username: string }> };

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const user = [demoUser, ...friends].find((person) => person.username === username) ?? demoUser;

  return (
    <main className="min-h-screen px-4 py-8">
      <section className="mx-auto max-w-3xl">
        <div className="glass rounded-[2rem] p-6">
          <div className="flex flex-wrap items-center gap-5">
            <img className="size-24 rounded-[1.5rem] object-cover" src={user.avatar} alt="" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-4xl font-black">@{user.username}</h1>
              <p className="mt-2 text-white/62">Perfil social, menciones, XP y chismes compartibles.</p>
            </div>
            <Link href="/" className="rounded-full bg-white px-5 py-3 font-black text-ink">
              Mencionar
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {["XP 8.4K", "Nivel 18", "Streak 11"].map((stat) => (
            <div key={stat} className="glass rounded-3xl p-5 text-center text-xl font-black">{stat}</div>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {feedItems.map((item) => (
            <article key={item.id} className="glass rounded-3xl p-5">
              <p className="text-sm font-black text-neon">{item.question}</p>
              <p className="mt-2 text-lg font-bold">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

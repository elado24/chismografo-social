"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Crown,
  Flame,
  Heart,
  Home,
  Lock,
  MessageCircle,
  Plus,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserPlus,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { categories, questionBank, type QuestionCategory } from "@/data/questions";
import { demoUser, feedItems, friends, initialNotifications } from "@/data/demo";

type Notification = (typeof initialNotifications)[number];

const formatCount = (value: number) =>
  Intl.NumberFormat("es", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<QuestionCategory | "TODAS">("TODAS");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [toast, setToast] = useState<Notification | null>(null);
  const [liveFeed, setLiveFeed] = useState(feedItems);

  const questions = useMemo(() => {
    if (activeCategory === "TODAS") return questionBank;
    return questionBank.filter((question) => question.category === activeCategory);
  }, [activeCategory]);

  const activeQuestion = questions[activeQuestionIndex % questions.length];
  const unread = notifications.filter((item) => item.unread).length;

  function pickQuestion(offset = 1) {
    setActiveQuestionIndex((current) => (current + offset + questions.length) % questions.length);
  }

  function submitAnswer() {
    if (!answer.trim()) return;
    const mentioned = friends.find((friend) => answer.toLowerCase().includes(`@${friend.username}`));
    const newItem = {
      id: `a_${Date.now()}`,
      author: {
        id: demoUser.id,
        name: demoUser.name,
        username: demoUser.username,
        avatar: demoUser.avatar,
        status: "online"
      },
      question: activeQuestion.prompt,
      answer,
      mentions: mentioned ? [mentioned.username] : [],
      reactions: 1,
      comments: 0,
      shares: 0,
      heat: 73,
      slug: `share-${Date.now()}`
    };

    setLiveFeed((items) => [newItem, ...items].slice(0, 8));

    if (mentioned) {
      const nextNotification = {
        id: `n_${Date.now()}`,
        type: "mention",
        title: `${demoUser.name} mencionó a ${mentioned.name}`,
        body: activeQuestion.prompt,
        unread: true,
        createdAt: "Ahora"
      };
      setNotifications((items) => [nextNotification, ...items]);
      setToast(nextNotification);
      window.setTimeout(() => setToast(null), 3600);
    }

    setAnswer("");
    pickQuestion(1);
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-4 px-3 py-3 md:grid-cols-[18rem_minmax(0,1fr)_22rem] md:px-5">
        <aside className="hidden flex-col justify-between rounded-[1.75rem] border border-white/10 bg-black/24 p-4 backdrop-blur-xl md:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="story-ring grid size-12 place-items-center rounded-2xl p-0.5">
                <div className="grid size-full place-items-center rounded-[0.9rem] bg-ink">
                  <Sparkles className="size-6 text-neon" />
                </div>
              </div>
              <div>
                <p className="text-lg font-black leading-tight">Chismógrafo</p>
                <p className="text-sm text-white/55">Social beta</p>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {[
                { icon: Home, label: "Feed" },
                { icon: Flame, label: "Retos" },
                { icon: Bell, label: "Menciones", count: unread },
                { icon: Trophy, label: "Ranking" },
                { icon: ShieldCheck, label: "Seguridad" }
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-bold text-white/78 transition hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="size-5" />
                    {item.label}
                  </span>
                  {"count" in item && item.count ? (
                    <span className="rounded-full bg-flame px-2 py-0.5 text-xs text-white">{item.count}</span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>

          <div className="glass rounded-3xl p-4">
            <div className="flex items-center gap-3">
              <img className="size-12 rounded-2xl object-cover" src={demoUser.avatar} alt="" />
              <div className="min-w-0">
                <p className="truncate font-black">@{demoUser.username}</p>
                <p className="text-sm text-white/56">Nivel {demoUser.level} · {demoUser.streak} días</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["XP", formatCount(demoUser.xp)],
                ["Rank", `#${demoUser.rank}`],
                ["Viral", "92%"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/8 p-2">
                  <p className="text-xs text-white/48">{label}</p>
                  <p className="font-black">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="relative min-h-[calc(100vh-1.5rem)] rounded-[2rem] border border-white/10 bg-black/20 backdrop-blur-xl">
          <header className="sticky top-0 z-20 flex items-center justify-between rounded-t-[2rem] border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3 md:hidden">
              <Sparkles className="size-6 text-neon" />
              <p className="font-black">Chismógrafo</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink">Para ti</button>
              <button className="rounded-full px-4 py-2 text-sm font-bold text-white/56">Siguiendo</button>
              <button className="rounded-full px-4 py-2 text-sm font-bold text-white/56">Fiesta</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid size-10 place-items-center rounded-full bg-white/10" aria-label="Buscar">
                <Search className="size-5" />
              </button>
              <button className="relative grid size-10 place-items-center rounded-full bg-white/10" aria-label="Notificaciones">
                <Bell className="size-5" />
                {unread ? <span className="absolute -right-1 -top-1 rounded-full bg-flame px-1.5 text-xs font-black">{unread}</span> : null}
              </button>
            </div>
          </header>

          <div className="hide-scrollbar h-[calc(100vh-5.8rem)] snap-y snap-mandatory overflow-y-auto md:h-[calc(100vh-2rem)]">
            <HeroComposer
              answer={answer}
              activeQuestion={activeQuestion}
              categories={categories}
              activeCategory={activeCategory}
              onCategory={setActiveCategory}
              onAnswer={setAnswer}
              onShuffle={() => pickQuestion(1)}
              onSubmit={submitAnswer}
            />

            {liveFeed.map((item) => (
              <article key={item.id} className="relative grid min-h-[calc(100vh-5.8rem)] snap-start place-items-center px-4 py-8 md:min-h-[calc(100vh-2rem)]">
                <div className="w-full max-w-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="story-ring rounded-2xl p-0.5">
                        <img className="size-12 rounded-[0.9rem] object-cover" src={item.author.avatar} alt="" />
                      </div>
                      <div>
                        <p className="font-black">@{item.author.username}</p>
                        <p className="text-sm text-white/54">calor viral {item.heat}%</p>
                      </div>
                    </div>
                    <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink">Seguir</button>
                  </div>

                  <div className="glass rounded-[2rem] p-5 shadow-hot">
                    <div className="mb-5 flex items-center gap-2 text-sm font-black text-neon">
                      <Zap className="size-4" />
                      Tendencia semanal
                    </div>
                    <h2 className="text-2xl font-black leading-tight md:text-4xl">{item.question}</h2>
                    <p className="mt-5 text-xl font-bold leading-snug text-white/88 md:text-2xl">{item.answer}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.mentions.map((mention) => (
                        <span key={mention} className="rounded-full bg-aqua/18 px-3 py-1 text-sm font-black text-aqua">@{mention}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-24 right-5 flex flex-col items-center gap-4 md:bottom-10">
                  <ActionButton icon={Heart} label={formatCount(item.reactions)} tone="hot" />
                  <ActionButton icon={MessageCircle} label={formatCount(item.comments)} />
                  <ActionButton icon={Share2} label={formatCount(item.shares)} />
                </div>
              </article>
            ))}
          </div>

          <MobileNav unread={unread} />
        </section>

        <aside className="hidden space-y-4 md:block">
          <Panel title="Menciones en vivo" icon={Bell}>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/8 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black">{item.title}</p>
                    {item.unread ? <span className="size-2 rounded-full bg-neon" /> : null}
                  </div>
                  <p className="mt-1 text-sm text-white/58">{item.body}</p>
                  <button className="mt-3 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black">Responder</button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Ranking social" icon={Crown}>
            <div className="space-y-3">
              {[demoUser, ...friends].slice(0, 4).map((person, index) => (
                <div key={person.id} className="flex items-center gap-3 rounded-2xl bg-white/8 p-3">
                  <span className="w-6 text-center font-black text-citrus">#{index + 1}</span>
                  <img className="size-10 rounded-xl object-cover" src={person.avatar} alt="" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black">@{person.username}</p>
                    <p className="text-sm text-white/52">{index === 0 ? "Reina del chisme" : "subiendo rápido"}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Invita y desbloquea" icon={UserPlus}>
            <p className="text-sm leading-relaxed text-white/62">
              Comparte tu link, recibe menciones y desbloquea preguntas premium cuando 3 amigos respondan.
            </p>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-neon px-4 py-3 font-black text-ink">
              <Share2 className="size-4" />
              Copiar link viral
            </button>
          </Panel>
        </aside>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed left-1/2 top-5 z-50 w-[min(92vw,26rem)] -translate-x-1/2 rounded-3xl border border-neon/35 bg-ink/92 p-4 shadow-glow backdrop-blur-xl"
          >
            <p className="font-black text-neon">{toast.title}</p>
            <p className="mt-1 text-sm text-white/68">{toast.body}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function HeroComposer(props: {
  answer: string;
  activeQuestion: (typeof questionBank)[number];
  categories: typeof categories;
  activeCategory: QuestionCategory | "TODAS";
  onCategory: (category: QuestionCategory | "TODAS") => void;
  onAnswer: (value: string) => void;
  onShuffle: () => void;
  onSubmit: () => void;
}) {
  return (
    <section className="relative grid min-h-[calc(100vh-5.8rem)] snap-start content-center px-4 py-8 md:min-h-[calc(100vh-2rem)]">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-5 flex items-center gap-3 overflow-x-auto pb-1">
          {props.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => props.onCategory(category.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
                props.activeCategory === category.id ? "bg-white text-ink" : "bg-white/10 text-white/68"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <motion.div layout className="glass rounded-[2rem] p-5 shadow-hot md:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-black text-citrus">
              <Flame className="size-4" />
              Pregunta caliente
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-xs font-black text-white/62">
              <Lock className="size-3.5" />
              anti abuso activo
            </div>
          </div>

          <h1 className="text-3xl font-black leading-tight md:text-5xl">{props.activeQuestion.prompt}</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {props.activeQuestion.modes.map((mode) => (
              <span key={mode} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/60">{mode.toLowerCase()}</span>
            ))}
            <span className="rounded-full bg-flame/18 px-3 py-1 text-xs font-black text-flame">viral {props.activeQuestion.viralLevel}/10</span>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/12 bg-black/24 p-3">
            <textarea
              value={props.answer}
              onChange={(event) => props.onAnswer(event.target.value)}
              placeholder="Escribe algo y menciona a @ana.spark, @luis.mov, @mia.crush..."
              className="min-h-28 w-full resize-none bg-transparent p-2 text-lg font-bold leading-snug text-white outline-none placeholder:text-white/35"
              maxLength={220}
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex -space-x-2">
                {friends.map((friend) => (
                  <img key={friend.id} className="size-9 rounded-full border-2 border-ink object-cover" src={friend.avatar} alt="" />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={props.onShuffle} className="grid size-11 place-items-center rounded-full bg-white/10" aria-label="Otra pregunta">
                  <Sparkles className="size-5" />
                </button>
                <button onClick={props.onSubmit} className="flex items-center gap-2 rounded-full bg-flame px-5 py-3 font-black text-white shadow-hot">
                  <Send className="size-4" />
                  Responder
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ActionButton({ icon: Icon, label, tone }: { icon: LucideIcon; label: string; tone?: "hot" }) {
  return (
    <button className="flex flex-col items-center gap-1 text-xs font-black text-white drop-shadow">
      <span className={`grid size-12 place-items-center rounded-full ${tone === "hot" ? "bg-flame" : "bg-white/14 backdrop-blur-xl"}`}>
        <Icon className="size-5" />
      </span>
      {label}
    </button>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-black/24 p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-5 text-neon" />
        <h2 className="font-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MobileNav({ unread }: { unread: number }) {
  return (
    <nav className="safe-bottom fixed inset-x-3 bottom-0 z-30 grid grid-cols-5 rounded-[1.5rem] border border-white/10 bg-ink/86 px-2 py-2 backdrop-blur-xl md:hidden">
      {[
        { icon: Home, label: "Feed" },
        { icon: Flame, label: "Retos" },
        { icon: Plus, label: "Crear", main: true },
        { icon: Bell, label: "Avisos", count: unread },
        { icon: Trophy, label: "Top" }
      ].map((item) => (
        <button key={item.label} className="relative grid place-items-center gap-1 text-[0.68rem] font-black text-white/70">
          <span className={`grid size-9 place-items-center rounded-full ${item.main ? "bg-white text-ink" : "bg-white/8"}`}>
            <item.icon className="size-4" />
          </span>
          {item.label}
          {"count" in item && item.count ? <span className="absolute right-3 top-0 rounded-full bg-flame px-1 text-[0.62rem] text-white">{item.count}</span> : null}
        </button>
      ))}
    </nav>
  );
}

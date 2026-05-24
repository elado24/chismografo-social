import { questionBank } from "./questions";

export const demoUser = {
  id: "u_demo",
  name: "Valeria",
  username: "valeviral",
  avatar: "/avatar-vale.png",
  xp: 8420,
  level: 18,
  streak: 11,
  rank: 3,
  badges: ["Reina del chisme", "11 días", "Top 3 semanal"]
};

export const friends = [
  { id: "u_ana", name: "Ana", username: "ana.spark", avatar: "/avatar-ana.png", status: "online" },
  { id: "u_luis", name: "Luis", username: "luis.mov", avatar: "/avatar-luis.png", status: "online" },
  { id: "u_mia", name: "Mia", username: "mia.crush", avatar: "/avatar-mia.png", status: "away" },
  { id: "u_noe", name: "Noe", username: "noe.exe", avatar: "/avatar-noe.png", status: "online" }
];

export const feedItems = [
  {
    id: "a_1",
    author: friends[0],
    question: questionBank[4].prompt,
    answer: "@luis.mov pero en versión premium, porque hasta sus red flags tienen diseño.",
    mentions: ["luis.mov"],
    reactions: 1280,
    comments: 94,
    shares: 310,
    heat: 98,
    slug: "red-flags-premium"
  },
  {
    id: "a_2",
    author: friends[1],
    question: questionBank[16].prompt,
    answer: "@mia.crush sería meme viral y encima vendería merch al día siguiente.",
    mentions: ["mia.crush"],
    reactions: 943,
    comments: 51,
    shares: 204,
    heat: 91,
    slug: "meme-y-merch"
  },
  {
    id: "a_3",
    author: friends[2],
    question: questionBank[27].prompt,
    answer: "@valeviral tiene aura de famosa accidental. Un video suyo y se cae la app.",
    mentions: ["valeviral"],
    reactions: 2200,
    comments: 181,
    shares: 620,
    heat: 100,
    slug: "famosa-accidental"
  }
];

export const initialNotifications = [
  {
    id: "n_1",
    type: "mention",
    title: "Te mencionaron",
    body: "Mia respondió que tú serías famosa accidental.",
    unread: true,
    createdAt: "Ahora"
  },
  {
    id: "n_2",
    type: "ranking",
    title: "Subiste al Top 3",
    body: "Tu respuesta de romance explotó esta semana.",
    unread: true,
    createdAt: "12 min"
  },
  {
    id: "n_3",
    type: "streak",
    title: "Streak activo",
    body: "Llevas 11 días creando chisme.",
    unread: false,
    createdAt: "1 h"
  }
];

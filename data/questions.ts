export type QuestionCategory = "CHISME" | "ROMANCE" | "HUMOR" | "AMISTAD" | "VIRAL";
export type GameMode = "FIESTA" | "PAREJA" | "AMIGOS" | "ANONIMO";

export type QuestionSeed = {
  id: string;
  prompt: string;
  category: QuestionCategory;
  tags: string[];
  modes: GameMode[];
  difficulty: number;
  viralLevel: number;
};

const baseQuestions: Omit<QuestionSeed, "id">[] = [
  { prompt: "¿Quién es más probable que se enamore primero?", category: "CHISME", tags: ["crush", "drama"], modes: ["AMIGOS", "FIESTA"], difficulty: 1, viralLevel: 8 },
  { prompt: "¿Quién tiene los mejores secretos?", category: "CHISME", tags: ["secretos"], modes: ["AMIGOS", "ANONIMO"], difficulty: 2, viralLevel: 9 },
  { prompt: "¿Quién sería cancelado primero?", category: "CHISME", tags: ["picante", "viral"], modes: ["FIESTA"], difficulty: 3, viralLevel: 9 },
  { prompt: "¿Quién responde más rápido los mensajes?", category: "AMISTAD", tags: ["chat"], modes: ["AMIGOS"], difficulty: 1, viralLevel: 5 },
  { prompt: "¿Quién tiene más red flags?", category: "CHISME", tags: ["redflags", "romance"], modes: ["FIESTA", "ANONIMO"], difficulty: 3, viralLevel: 10 },
  { prompt: "¿Quién tiene doble vida?", category: "CHISME", tags: ["misterio"], modes: ["ANONIMO", "FIESTA"], difficulty: 3, viralLevel: 10 },
  { prompt: "¿Quién sería influencer famoso?", category: "VIRAL", tags: ["fama", "tiktok"], modes: ["AMIGOS", "FIESTA"], difficulty: 1, viralLevel: 8 },
  { prompt: "¿Quién desaparecería por amor?", category: "ROMANCE", tags: ["intenso"], modes: ["PAREJA", "AMIGOS"], difficulty: 2, viralLevel: 7 },
  { prompt: "¿Quién es más tóxico pero cae bien?", category: "CHISME", tags: ["toxico"], modes: ["FIESTA"], difficulty: 3, viralLevel: 9 },
  { prompt: "¿Quién tiene más pretendientes en secreto?", category: "ROMANCE", tags: ["crush"], modes: ["AMIGOS", "ANONIMO"], difficulty: 2, viralLevel: 9 },
  { prompt: "¿Con quién saldrías si nadie se enterara?", category: "ROMANCE", tags: ["atrevido"], modes: ["ANONIMO", "PAREJA"], difficulty: 4, viralLevel: 10 },
  { prompt: "¿Quién besa mejor según la vibra?", category: "ROMANCE", tags: ["beso"], modes: ["FIESTA", "PAREJA"], difficulty: 3, viralLevel: 10 },
  { prompt: "¿Quién rompería más corazones?", category: "ROMANCE", tags: ["drama"], modes: ["AMIGOS"], difficulty: 2, viralLevel: 8 },
  { prompt: "¿Quién tendría un romance secreto?", category: "ROMANCE", tags: ["secreto"], modes: ["ANONIMO", "FIESTA"], difficulty: 3, viralLevel: 9 },
  { prompt: "¿Quién volvería con su ex aunque diga que no?", category: "ROMANCE", tags: ["ex"], modes: ["AMIGOS", "ANONIMO"], difficulty: 3, viralLevel: 8 },
  { prompt: "¿Quién sobreviviría menos en un apocalipsis?", category: "HUMOR", tags: ["caos"], modes: ["FIESTA"], difficulty: 1, viralLevel: 7 },
  { prompt: "¿Quién sería meme viral por accidente?", category: "HUMOR", tags: ["meme", "viral"], modes: ["AMIGOS", "FIESTA"], difficulty: 1, viralLevel: 8 },
  { prompt: "¿Quién sería arrestado accidentalmente?", category: "HUMOR", tags: ["caos"], modes: ["FIESTA"], difficulty: 2, viralLevel: 8 },
  { prompt: "¿Quién da más cringe pero lo hace con confianza?", category: "HUMOR", tags: ["cringe"], modes: ["AMIGOS"], difficulty: 2, viralLevel: 7 },
  { prompt: "¿Quién tendría un reality show caótico?", category: "HUMOR", tags: ["reality"], modes: ["FIESTA"], difficulty: 1, viralLevel: 8 },
  { prompt: "¿Quién guarda mejor secretos?", category: "AMISTAD", tags: ["lealtad"], modes: ["AMIGOS"], difficulty: 1, viralLevel: 5 },
  { prompt: "¿Quién siempre llega tarde con una excusa épica?", category: "AMISTAD", tags: ["puntualidad"], modes: ["AMIGOS"], difficulty: 1, viralLevel: 6 },
  { prompt: "¿Quién responde aunque sean las 3AM?", category: "AMISTAD", tags: ["lealtad"], modes: ["AMIGOS"], difficulty: 1, viralLevel: 6 },
  { prompt: "¿Quién sería mejor compañero de viaje?", category: "AMISTAD", tags: ["viaje"], modes: ["AMIGOS"], difficulty: 1, viralLevel: 5 },
  { prompt: "¿Quién sería IA primero?", category: "VIRAL", tags: ["ia", "futuro"], modes: ["FIESTA"], difficulty: 1, viralLevel: 8 },
  { prompt: "¿Quién vendería fotos de pies y lo convertiría en startup?", category: "VIRAL", tags: ["atrevido", "dinero"], modes: ["ANONIMO", "FIESTA"], difficulty: 4, viralLevel: 10 },
  { prompt: "¿Quién fingiría su muerte para escapar de un chat grupal?", category: "VIRAL", tags: ["caos"], modes: ["FIESTA"], difficulty: 2, viralLevel: 9 },
  { prompt: "¿Quién tendría más posibilidades de volverse famoso?", category: "VIRAL", tags: ["fama"], modes: ["AMIGOS"], difficulty: 1, viralLevel: 8 },
  { prompt: "¿Quién tendría más haters por decir la verdad?", category: "VIRAL", tags: ["picante"], modes: ["ANONIMO", "FIESTA"], difficulty: 3, viralLevel: 9 },
  { prompt: "¿Quién viviría más tiempo en una isla desierta?", category: "HUMOR", tags: ["supervivencia"], modes: ["AMIGOS"], difficulty: 1, viralLevel: 6 }
];

const templates = [
  "¿Quién sería capaz de {action} solo por {reason}?",
  "¿Quién tiene más vibra de {role} en secreto?",
  "¿Quién ganaría un premio por {action}?",
  "¿Quién se haría viral por {reason}?",
  "¿Quién arruinaría una cita por {action}?"
];

const actions = [
  "mandar un audio de 12 minutos",
  "hacer drama en silencio",
  "inventar una excusa perfecta",
  "ghostear y volver con memes",
  "llorar en una fiesta",
  "coquetear sin darse cuenta",
  "subir una indirecta",
  "crear un grupo secreto"
];

const reasons = [
  "un crush",
  "un reto viral",
  "una historia de Instagram",
  "no perder el streak",
  "defender a su mejor amigo",
  "ganar una apuesta",
  "verse misterioso",
  "evitar una conversación"
];

const roles = [
  "villano simpático",
  "protagonista de reality",
  "cupido caótico",
  "detective del chat",
  "rey del chisme",
  "influencer accidental",
  "ex inolvidable",
  "terapeuta del grupo"
];

const generated = templates.flatMap((template, templateIndex) =>
  actions.slice(0, 6).map((action, index) => {
    const prompt = template
      .replace("{action}", action)
      .replace("{reason}", reasons[(templateIndex + index) % reasons.length])
      .replace("{role}", roles[(templateIndex + index) % roles.length]);

    return {
      prompt,
      category: (["CHISME", "ROMANCE", "HUMOR", "AMISTAD", "VIRAL"] as QuestionCategory[])[(templateIndex + index) % 5],
      tags: ["auto", "viral"],
      modes: index % 2 === 0 ? (["FIESTA", "AMIGOS"] as GameMode[]) : (["ANONIMO", "FIESTA"] as GameMode[]),
      difficulty: 1 + ((templateIndex + index) % 4),
      viralLevel: 6 + ((templateIndex + index) % 5)
    };
  })
);

export const questionBank: QuestionSeed[] = [...baseQuestions, ...generated].map((question, index) => ({
  id: `q_${index + 1}`,
  ...question
}));

export const categories: { id: QuestionCategory | "TODAS"; label: string }[] = [
  { id: "TODAS", label: "Todo" },
  { id: "CHISME", label: "Chisme" },
  { id: "ROMANCE", label: "Romance" },
  { id: "HUMOR", label: "Humor" },
  { id: "AMISTAD", label: "Amistad" },
  { id: "VIRAL", label: "Viral" }
];

const toxicPatterns = [
  /\b(m[aá]tate|suic[ií]date)\b/i,
  /\b(gorda|feo|fea|in[uú]til|basura)\b/i,
  /\b(doxx|direcci[oó]n|tel[eé]fono)\b/i
];

const spamPatterns = [
  /(https?:\/\/\S+){2,}/i,
  /(.)\1{8,}/,
  /(@\w+\s*){8,}/
];

export type ModerationResult = {
  allowed: boolean;
  score: number;
  reasons: string[];
};

export function moderateText(input: string): ModerationResult {
  const reasons: string[] = [];
  let score = 0;

  for (const pattern of toxicPatterns) {
    if (pattern.test(input)) {
      score += 60;
      reasons.push("posible acoso o daño");
    }
  }

  for (const pattern of spamPatterns) {
    if (pattern.test(input)) {
      score += 35;
      reasons.push("posible spam");
    }
  }

  if (input.length > 280) {
    score += 20;
    reasons.push("respuesta demasiado larga");
  }

  return {
    allowed: score < 60,
    score,
    reasons: [...new Set(reasons)]
  };
}

export function extractMentions(input: string) {
  return [...input.matchAll(/@([a-z0-9_ñ.]{2,24})/gi)].map((match) => match[1].toLowerCase());
}

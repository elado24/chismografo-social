import { PrismaClient } from "@prisma/client";
import { questionBank } from "../data/questions";

const prisma = new PrismaClient();

async function main() {
  await prisma.question.createMany({
    data: questionBank.map((question) => ({
      prompt: question.prompt,
      category: question.category,
      tags: question.tags,
      modes: question.modes,
      difficulty: question.difficulty,
      viralLevel: question.viralLevel,
      isAnonymous: question.modes.includes("ANONIMO")
    })),
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

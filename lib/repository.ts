import { feedItems, friends, initialNotifications } from "@/data/demo";
import { questionBank, type GameMode, type QuestionCategory } from "@/data/questions";
import { prisma } from "@/lib/prisma";
import { createShareSlug } from "@/lib/share";
import type { AppUser } from "@/lib/session";

type CreateAnswerInput = {
  author: AppUser;
  questionId: string;
  question: string;
  body: string;
  isAnonymous: boolean;
  mentionedUsernames: string[];
};

export async function listQuestions(filters: { category?: string | null; mode?: string | null }) {
  if (process.env.DATABASE_URL) {
    try {
      const questions = await prisma.question.findMany({
        where: {
          isActive: true,
          category:
            filters.category && filters.category !== "TODAS"
              ? (filters.category as QuestionCategory)
              : undefined,
          modes: filters.mode ? { has: filters.mode as GameMode } : undefined
        },
        orderBy: [{ viralLevel: "desc" }, { createdAt: "desc" }],
        take: 80
      });

      if (questions.length) return questions;
    } catch (error) {
      console.warn("[repository] falling back to seeded questions", error);
    }
  }

  return questionBank.filter((question) => {
    const byCategory = !filters.category || filters.category === "TODAS" || question.category === filters.category;
    const byMode = !filters.mode || question.modes.includes(filters.mode as GameMode);
    return byCategory && byMode;
  });
}

export async function listViralFeed() {
  if (process.env.DATABASE_URL) {
    try {
      const answers = await prisma.answer.findMany({
        orderBy: [{ score: "desc" }, { createdAt: "desc" }],
        include: {
          author: true,
          question: true,
          mentions: { include: { mentionedUser: true } },
          reactions: true
        },
        take: 30
      });

      if (answers.length) {
        return answers.map((answer) => ({
          id: answer.id,
          author: {
            id: answer.author.id,
            name: answer.author.name ?? answer.author.username,
            username: answer.author.username,
            avatar: answer.author.image ?? "/avatar-vale.png",
            status: "online"
          },
          question: answer.question.prompt,
          answer: answer.body,
          mentions: answer.mentions.map((mention) => mention.mentionedUser.username),
          reactions: answer.reactions.length,
          comments: 0,
          shares: Math.max(0, Math.floor(answer.score / 7)),
          heat: Math.min(100, Math.max(32, answer.score)),
          slug: answer.shareSlug
        }));
      }
    } catch (error) {
      console.warn("[repository] falling back to demo feed", error);
    }
  }

  return feedItems;
}

export async function listNotifications(user: AppUser) {
  if (process.env.DATABASE_URL) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { username: user.username } });
      if (!dbUser) return initialNotifications;

      const notifications = await prisma.notification.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
        take: 30
      });

      if (notifications.length) {
        return notifications.map((notification) => ({
          id: notification.id,
          type: notification.type.toLowerCase(),
          title: notification.title,
          body: notification.body,
          unread: !notification.readAt,
          createdAt: notification.createdAt.toISOString()
        }));
      }
    } catch (error) {
      console.warn("[repository] falling back to demo notifications", error);
    }
  }

  return initialNotifications;
}

export async function createAnswer(input: CreateAnswerInput) {
  const matchedDemoFriends = friends.filter((friend) => input.mentionedUsernames.includes(friend.username.toLowerCase()));
  const shareSlug = createShareSlug(input.question);

  if (process.env.DATABASE_URL) {
    try {
      const author = await prisma.user.upsert({
        where: { username: input.author.username },
        update: {
          name: input.author.name,
          image: input.author.image,
          email: input.author.email
        },
        create: {
          username: input.author.username,
          name: input.author.name,
          image: input.author.image,
          email: input.author.email
        }
      });

      const question = await prisma.question.upsert({
        where: { id: input.questionId },
        update: {},
        create: {
          id: input.questionId,
          prompt: input.question,
          category: "CHISME",
          tags: ["user-generated"],
          modes: ["AMIGOS"],
          difficulty: 1,
          viralLevel: 6
        }
      });

      const mentionedUsers = await Promise.all(
        input.mentionedUsernames.map((username) =>
          prisma.user.upsert({
            where: { username },
            update: {},
            create: {
              username,
              name: username,
              image: matchedDemoFriends.find((friend) => friend.username === username)?.avatar
            }
          })
        )
      );

      const answer = await prisma.answer.create({
        data: {
          authorId: author.id,
          questionId: question.id,
          body: input.body,
          shareSlug,
          isAnonymous: input.isAnonymous,
          score: 1,
          mentions: {
            create: mentionedUsers.map((mentionedUser) => ({
              mentionedUserId: mentionedUser.id,
              displayName: mentionedUser.username
            }))
          }
        },
        include: {
          mentions: { include: { mentionedUser: true } }
        }
      });

      await prisma.notification.createMany({
        data: mentionedUsers.map((mentionedUser) => ({
          userId: mentionedUser.id,
          type: "MENTION",
          title: `${author.name ?? author.username} te mencionó`,
          body: input.question,
          data: {
            answerId: answer.id,
            shareSlug,
            question: input.question,
            answer: input.body
          }
        }))
      });

      return {
        id: answer.id,
        shareSlug,
        questionId: question.id,
        body: answer.body,
        mentions: answer.mentions.map((mention) => ({
          id: mention.mentionedUser.id,
          username: mention.mentionedUser.username,
          name: mention.mentionedUser.name ?? mention.mentionedUser.username,
          avatar: mention.mentionedUser.image
        })),
        score: answer.score,
        createdAt: answer.createdAt.toISOString()
      };
    } catch (error) {
      console.warn("[repository] falling back to demo answer", error);
    }
  }

  return {
    id: `a_${Date.now()}`,
    shareSlug,
    questionId: input.questionId,
    body: input.body,
    mentions: matchedDemoFriends,
    score: 1,
    createdAt: new Date().toISOString()
  };
}

export async function createReport(input: {
  reporter: AppUser;
  answerId?: string;
  reportedUsername?: string;
  reason: string;
}) {
  if (process.env.DATABASE_URL) {
    try {
      const reporter = await prisma.user.upsert({
        where: { username: input.reporter.username },
        update: {},
        create: {
          username: input.reporter.username,
          name: input.reporter.name,
          image: input.reporter.image,
          email: input.reporter.email
        }
      });

      const reportedUser = input.reportedUsername
        ? await prisma.user.findUnique({ where: { username: input.reportedUsername } })
        : null;

      return prisma.report.create({
        data: {
          reporterId: reporter.id,
          reportedUserId: reportedUser?.id,
          answerId: input.answerId,
          reason: input.reason
        }
      });
    } catch (error) {
      console.warn("[repository] report stored in fallback only", error);
    }
  }

  return {
    id: `r_${Date.now()}`,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    ...input
  };
}

export async function createReaction(input: { user: AppUser; answerId: string; emoji: string }) {
  if (process.env.DATABASE_URL) {
    try {
      const user = await prisma.user.upsert({
        where: { username: input.user.username },
        update: {},
        create: {
          username: input.user.username,
          name: input.user.name,
          image: input.user.image,
          email: input.user.email
        }
      });

      const reaction = await prisma.reaction.upsert({
        where: {
          answerId_userId_emoji: {
            answerId: input.answerId,
            userId: user.id,
            emoji: input.emoji
          }
        },
        update: {},
        create: {
          answerId: input.answerId,
          userId: user.id,
          emoji: input.emoji
        }
      });

      await prisma.answer.update({
        where: { id: input.answerId },
        data: { score: { increment: 2 } }
      });

      return reaction;
    } catch (error) {
      console.warn("[repository] reaction stored in fallback only", error);
    }
  }

  return {
    id: `react_${Date.now()}`,
    answerId: input.answerId,
    emoji: input.emoji,
    createdAt: new Date().toISOString()
  };
}

export async function markNotificationsRead(user: AppUser, ids?: string[]) {
  if (process.env.DATABASE_URL) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { username: user.username } });
      if (!dbUser) return { updated: 0 };

      const result = await prisma.notification.updateMany({
        where: {
          userId: dbUser.id,
          id: ids?.length ? { in: ids } : undefined,
          readAt: null
        },
        data: { readAt: new Date() }
      });

      return { updated: result.count };
    } catch (error) {
      console.warn("[repository] notification read fallback", error);
    }
  }

  return { updated: ids?.length ?? initialNotifications.filter((item) => item.unread).length };
}

export async function blockUser(input: { blocker: AppUser; blockedUsername: string; reason?: string }) {
  if (process.env.DATABASE_URL) {
    try {
      const blocker = await prisma.user.upsert({
        where: { username: input.blocker.username },
        update: {},
        create: {
          username: input.blocker.username,
          name: input.blocker.name,
          image: input.blocker.image,
          email: input.blocker.email
        }
      });

      const blocked = await prisma.user.upsert({
        where: { username: input.blockedUsername },
        update: {},
        create: {
          username: input.blockedUsername,
          name: input.blockedUsername
        }
      });

      return prisma.userBlock.upsert({
        where: {
          blockerId_blockedId: {
            blockerId: blocker.id,
            blockedId: blocked.id
          }
        },
        update: { reason: input.reason },
        create: {
          blockerId: blocker.id,
          blockedId: blocked.id,
          reason: input.reason
        }
      });
    } catch (error) {
      console.warn("[repository] block fallback", error);
    }
  }

  return {
    id: `block_${Date.now()}`,
    blockedUsername: input.blockedUsername,
    reason: input.reason,
    createdAt: new Date().toISOString()
  };
}

export async function createInvite(user: AppUser) {
  const code = `${user.username}-${Date.now().toString(36)}`;

  if (process.env.DATABASE_URL) {
    try {
      const inviter = await prisma.user.upsert({
        where: { username: user.username },
        update: {},
        create: {
          username: user.username,
          name: user.name,
          image: user.image,
          email: user.email
        }
      });

      return prisma.invite.create({
        data: {
          code,
          inviterId: inviter.id
        }
      });
    } catch (error) {
      console.warn("[repository] invite fallback", error);
    }
  }

  return {
    id: `invite_${Date.now()}`,
    code,
    clicks: 0,
    conversions: 0,
    createdAt: new Date().toISOString()
  };
}

export async function savePushSubscription(input: {
  user: AppUser;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string | null;
}) {
  if (process.env.DATABASE_URL) {
    try {
      const user = await prisma.user.upsert({
        where: { username: input.user.username },
        update: {},
        create: {
          username: input.user.username,
          name: input.user.name,
          image: input.user.image,
          email: input.user.email
        }
      });

      return prisma.pushSubscription.upsert({
        where: { endpoint: input.endpoint },
        update: {
          p256dh: input.p256dh,
          auth: input.auth,
          userAgent: input.userAgent,
          userId: user.id
        },
        create: {
          userId: user.id,
          endpoint: input.endpoint,
          p256dh: input.p256dh,
          auth: input.auth,
          userAgent: input.userAgent
        }
      });
    } catch (error) {
      console.warn("[repository] push subscription fallback", error);
    }
  }

  return {
    id: `push_${Date.now()}`,
    endpoint: input.endpoint,
    createdAt: new Date().toISOString()
  };
}

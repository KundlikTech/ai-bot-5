import { prisma } from "../db/client";
import { summarizeHistory } from "./summarizer.tool";

const MAX_MESSAGES = 10;

export const saveMessage = async (
  conversationId: string,
  role: string,
  content: string,
  userId?: string | null
) => {
  if (!conversationId) {
    throw new Error("conversationId is required");
  }

  await prisma.conversation.upsert({
    where: { id: conversationId },
    update: userId ? { userId } : {},
    create: { id: conversationId, userId: userId ?? undefined },
  });

  return prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
};

export const getHistory = async (conversationId: string) => {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  if (messages.length <= MAX_MESSAGES) return messages;

  const old = messages.slice(0, -MAX_MESSAGES);
  const recent = messages.slice(-MAX_MESSAGES);

  const summary = await summarizeHistory(old);

  return [
    {
      role: "system",
      content: `Summary of previous conversation: ${summary}`,
    },
    ...recent,
  ];
};

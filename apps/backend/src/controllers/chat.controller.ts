import { processMessageStream } from "../services/chat.service";

export const sendMessage = async (c) => {
  let body: any = {};
  try {
    body = await c.req.json();
  } catch (error) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const conversationId =
    body?.conversationId ??
    body?.id ??
    body?.chatId ??
    body?.sessionId ??
    body?.metadata?.conversationId ??
    c.req.header("x-conversation-id");
  const lastMessage = body?.messages?.length
    ? body.messages[body.messages.length - 1]
    : undefined;
  const messageFromContent = lastMessage?.content;
  const messageFromParts = lastMessage?.parts
    ?.filter((part) => part?.type === "text")
    ?.map((part) => part?.text)
    ?.join("");
  const message =
    body?.message ??
    body?.input ??
    body?.prompt ??
    messageFromContent ??
    messageFromParts;

  if (!conversationId || !message) {
    return c.json(
      {
        error: "conversationId and message are required",
        received: {
          hasConversationId: Boolean(conversationId),
          hasMessage: Boolean(message),
          keys: Object.keys(body ?? {}),
        },
      },
      400
    );
  }

  const userId =
    body?.userId ?? body?.metadata?.userId ?? c.req.header("x-user-id");

  const stream = await processMessageStream(message, conversationId, userId);

  return stream;
};

import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getHistory } from "../tools/memory.tool";

export const supportAgentStream = async (
  query: string,
  conversationId: string
) => {
  const history = await getHistory(conversationId);
  return streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages: [
      {
        role: "system",
        content:
          "You are a friendly, helpful assistant. Keep answers concise and user-friendly (1-3 sentences). " +
          "If uncertain, say so briefly and provide general guidance.",
      },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
      { role: "user", content: query },
    ],
  });
};

import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getHistory } from "../tools/memory.tool";

export const billingAgentStream = async (
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
          "You are a friendly billing assistant. Do not access or mention databases. " +
          "Answer questions conversationally and ask for missing details when needed.",
      },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
      { role: "user", content: query },
    ],
  });

};

import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export const summarizeHistory = async (messages: any[]) => {
  const conversation = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: `
Summarize the following conversation briefly.
Keep important facts, user preferences, ids, problems.

${conversation}
`,
  });

  return text;
};

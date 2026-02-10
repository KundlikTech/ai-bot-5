import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getHistory } from "../tools/memory.tool";

export const routerAgent = async (query: string, conversationId?: string) => {
  const lower = (query || "").toLowerCase();
  const orderRegex = /place (an )?order|create order|order now|i want to order|buy now|place order|add item|checkout|pay now/i;
  if (orderRegex.test(lower)) return "order";

  // If the user replied with a short confirmation and the last assistant message asked for confirmation, route to order
  const shortConfirm = /^(yes|y|confirm|proceed|ok|checkout|pay)$/i;
  if (shortConfirm.test(lower) && conversationId) {
    try {
      const history = await getHistory(conversationId);
      const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
      const lastText = lastAssistant?.content?.toLowerCase() ?? "";
      if (/would you like to proceed|would you like to proceed to payment|would you like to proceed\?|would you like to proceed to checkout|would you like to proceed with payment|would you like to add another item|would you like to proceed to payment\?/i.test(lastText)) {
        return "order";
      }
    } catch (e) {
      // ignore and fallthrough to default
    }
  }

  // default route
  return "support";
};

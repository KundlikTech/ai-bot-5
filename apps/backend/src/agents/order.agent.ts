import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getHistory } from "../tools/memory.tool";
import { createOrder } from "../tools/order.tool";

export const orderAgentStream = async (
  query: string,
  conversationId: string,
  userId?: string | null
) => {
  const history = await getHistory(conversationId);

  // Collect recent user messages (including this query) to extract items / amounts
  const recentTexts = [
    ...history.map((m) => (m.role === "user" ? m.content : "")),
  ].filter(Boolean);
  recentTexts.push(query);

  // Parse item lines like "1 item for 250 INR" or "2 items for 300 INR"
  const itemRegex = /(\d+)\s*items?\s*(?:for)?\s*(\d+(?:\.\d+)?)\s*(inr|rs|rupees)?/gi;
  let match: RegExpExecArray | null;
  let total = 0;
  let itemCount = 0;
  for (const text of recentTexts) {
    itemRegex.lastIndex = 0;
    while ((match = itemRegex.exec(text))) {
      const count = parseInt(match[1], 10) || 1;
      const price = Math.round(parseFloat(match[2]) || 0);
      itemCount += count;
      total += count * price;
    }
  }

  // Fallback: parse explicit totals like "amount 500" or "total 500"
  if (total === 0) {
    const totalRegex = /(?:amount|total|budget)[:\s]*?(\d+(?:\.\d+)?)/i;
    for (const text of recentTexts) {
      const t = text.match(totalRegex);
      if (t) {
        total = Math.round(parseFloat(t[1]));
        break;
      }
    }
  }

  const lastUser = query.trim().toLowerCase();
  const confirmRegex = /^(yes|confirm|proceed|place order|checkout|pay)\b/i;

  if (confirmRegex.test(lastUser) && total > 0) {
    const created = await createOrder({ amount: total, currency: "INR", userId });
    const reply = `Your order is placed. Order ID: ${created.orderId}. Amount: ${created.amount} ${created.currency}. ETA: ${created.eta}. Status: ${created.status}.`;

    return streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
        {
          role: "system",
          content:
            "You are a friendly order assistant. You created an order and must return the order id and details to the user.",
        },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
        { role: "assistant", content: reply },
      ],
    });
  }

  // If we parsed items/total but no confirmation yet, summarize and ask to confirm
  if (total > 0) {
    const summary = `Your order is: ${itemCount || 1} item(s), totaling ${total} INR. Would you like to proceed to payment?`;
    return streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
        {
          role: "system",
          content:
            "You are a friendly order assistant. Ask a single confirmation question when a total is known.",
        },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
        { role: "assistant", content: summary },
      ],
    });
  }

  // No items or totals found; ask for details
  return streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages: [
      {
        role: "system",
        content:
          "You are a friendly order assistant. Do not access or mention databases. " +
          "Ask the user for order details: number of items and price per item or total amount.",
      },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
      { role: "assistant", content: "What would you like to order? Please include amount or item count and price." },
    ],
  });
};

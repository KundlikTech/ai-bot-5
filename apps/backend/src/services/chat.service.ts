import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { routerAgent } from "../agents/router.agent";
import { saveMessage } from "../tools/memory.tool";
import { orderAgentStream } from "../agents/order.agent";
import { billingAgentStream } from "../agents/billing.agent";
import { supportAgentStream } from "../agents/support.agent";

export const processMessageStream = async (
  message: string,
  conversationId: string,
  userId?: string | null
) => {
  await saveMessage(conversationId, "user", message, userId);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({
        type: "data-status",
        data: { message: "Routing..." },
      });

      const route = await routerAgent(message, conversationId);

      writer.write({
        type: "data-status",
        data: { message: `Connected to ${route} agent` },
      });

      let result;

      if (route === "order")
        result = await orderAgentStream(message, conversationId, userId);
      else if (route === "billing")
        result = await billingAgentStream(message, conversationId);
      else result = await supportAgentStream(message, conversationId);

      writer.write({
        type: "data-status",
        data: { message: "Generating answer..." },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
};

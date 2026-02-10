import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import Message from "./Message";
import Status from "./Status";

export default function ChatWindow() {
  const [conversationId] = useState(() => crypto.randomUUID());
  const [status, setStatus] = useState("");
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat/messages",
        body: { conversationId },
      }),
    [conversationId]
  );

  const { messages, sendMessage, status: chatStatus } = useChat({
    id: conversationId,
    transport,
    onData(dataPart) {
      if (dataPart.type === "data-status") {
        const message =
          (dataPart.data as { message?: string })?.message ?? "";
        setStatus(message);
        return;
      }

      if (
        (dataPart.data as { type?: string; message?: string })?.type ===
        "status"
      ) {
        const message =
          (dataPart.data as { message?: string })?.message ?? "";
        setStatus(message);
      }
    },
    onFinish() {
      setStatus("");
    },
  });

  const isBusy =
    chatStatus === "submitted" || chatStatus === "streaming";

  const handleSubmit = async (event?: {
    preventDefault?: () => void;
  }) => {
    event?.preventDefault?.();
    const trimmed = input.trim();
    if (!trimmed) return;
    if (isBusy) return;

    setInput("");
    setStatus("");
    await sendMessage(
      { text: trimmed },
      { body: { conversationId } }
    );
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <div>
          <div className="chat-title">Live Support</div>
          <div className="chat-subtitle">Replies in seconds</div>
        </div>
        {status && <Status text={status} />}
      </div>

      <div className="chat-body">
        {messages.length === 0 && (
          <div className="chat-empty">
            Ask about an order, invoice, or product support.
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("");

          if (!text) return null;

          return (
            <Message key={m.id} role={m.role} content={text} />
          );
        })}
      </div>

      <div className="chat-footer">
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask something..."
            className="chat-input"
            disabled={isBusy}
          />
          <button
            className="chat-send"
            type="submit"
            disabled={isBusy || !input.trim()}
          >
            Send
          </button>
        </form>
        <div className="chat-hint">
          Tip: Include an order or invoice id for faster results.
        </div>
      </div>
    </div>
  );
}

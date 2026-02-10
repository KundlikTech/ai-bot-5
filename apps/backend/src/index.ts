import { Hono } from "hono";
import { serve } from "@hono/node-server";
import chatRoutes from "./routes/chat.routes";

const app = new Hono();

app.route("/api/chat", chatRoutes);

app.get("/health", (c) => c.text("OK"));

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("✅ Server running on http://localhost:3000");

import { Hono } from "hono";
import { sendMessage } from "../controllers/chat.controller";
import { rateLimit } from "../middleware/rateLimit";

const router = new Hono();

router.post("/messages", rateLimit, sendMessage);

export default router;

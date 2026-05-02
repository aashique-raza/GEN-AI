import express from "express";
import cors from "cors";
import { sendSuccess } from "./utils/sendResponse.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  return sendSuccess(res, 200, "BiharBoard AI Tutor API is live", {
    docs: {
      health: "/api/health",
      chat: "/api/chat",
    },
  });
});

app.get("/api/health", (req, res) => {
  return sendSuccess(res, 200, "Backend is running", {
    service: "BiharBoard AI Tutor API",
  });
});

app.use("/api/chat", chatRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
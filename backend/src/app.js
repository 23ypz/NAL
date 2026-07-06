import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import researchRoutes from "./routes/researchRoutes.js";
import postgraduateRoutes from "./routes/postgraduateRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import privateMessageRoutes from "./routes/privateMessageRoutes.js";
import competitionCenterRoutes from "./routes/competitionCenterRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests, curl/Postman, and course-demo deployments by default.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_, res) => {
  res.json({ status: "ok", message: "Academic Light backend is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/research-projects", researchRoutes);
app.use("/api/postgraduate-posts", postgraduateRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/private-chat", privateMessageRoutes);
app.use("/api/competition-center", competitionCenterRoutes);
app.use("/api/favorites", favoritesRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

export default app;

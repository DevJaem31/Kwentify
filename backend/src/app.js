import express from "express";
import cors from "cors";
import helmet from "helmet";
import usersRouter from "./routes/users.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running.",
  });
});

app.use("/api/users", usersRouter);

export default app;

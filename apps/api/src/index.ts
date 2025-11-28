import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001",
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/health", healthRouter);
app.use("/api/auth", authRouter);

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API Server Running", version: "1.0.0" });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;

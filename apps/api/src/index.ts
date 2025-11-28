import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";

const app = express();
const DEFAULT_PORT = 3002;
const HTTP_STATUS_INTERNAL_ERROR = 500;
const PORT = process.env.PORT || DEFAULT_PORT;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/health", healthRouter);
app.use("/api/auth", authRouter);

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API Server Running", version: "1.0.0" });
});

// Error handling middleware
app.use(
  (_err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    res
      .status(HTTP_STATUS_INTERNAL_ERROR)
      .json({ error: "Internal Server Error" });
  }
);

app.listen(PORT);

export default app;

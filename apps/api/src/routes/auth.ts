import { type Request, type Response, Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

// Get current session
// Uses the auth middleware to validate session
authRouter.get(
  "/session",
  requireAuth,
  (req: Request, res: Response): void => {
    res.json({
      session: req.session?.session,
      user: req.session?.user,
    });
  }
);

// Protected endpoint example
authRouter.get(
  "/me",
  requireAuth,
  (req: Request, res: Response): void => {
    res.json({
      user: req.session?.user,
    });
  }
);

// Info endpoint for auth configuration
authRouter.get("/info", (_req: Request, res: Response): void => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  res.json({
    message: "Authentication is handled by Better-Auth",
    signInUrl: `${appUrl}/sign-in`,
    signUpUrl: `${appUrl}/sign-up`,
  });
});

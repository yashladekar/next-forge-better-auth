import { Router, type Request, type Response } from "express";
import { auth } from "@repo/auth/server";
import { toNodeHandler } from "better-auth/node";

export const authRouter = Router();

const authHandler = toNodeHandler(auth);

// Handle all auth routes
authRouter.all("/*splat", async (req: Request, res: Response) => {
  try {
    await authHandler(req, res);
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
});

import { type Request, type Response, Router } from "express";

export const authRouter = Router();

// Placeholder auth routes - for production, integrate with Better-Auth
// The main authentication is handled by the app on port 3000

authRouter.get("/session", (_req: Request, res: Response) => {
  // Session validation would go here
  res.json({ message: "Session endpoint - use app auth at port 3000" });
});

authRouter.post("/signin", (_req: Request, res: Response) => {
  res.json({ message: "Sign in via app at port 3000" });
});

authRouter.post("/signout", (_req: Request, res: Response) => {
  res.json({ message: "Sign out via app at port 3000" });
});

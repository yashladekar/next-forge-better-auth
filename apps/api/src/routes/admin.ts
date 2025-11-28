import { type Request, type Response, Router } from "express";
import { requireAdmin } from "../middleware/auth.js";

export const adminRouter = Router();

// All admin routes require admin role
adminRouter.use(requireAdmin);

// Get all users (admin only)
// Note: This calls the app's API to get users since database has server-only imports
adminRouter.get(
  "/users",
  async (req: Request, res: Response): Promise<void> => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    try {
      // Forward the request to the app's admin API
      const response = await fetch(`${appUrl}/api/admin/users`, {
        method: "GET",
        headers: {
          Cookie: req.headers.cookie || "",
          Authorization: req.headers.authorization || "",
        },
      });

      if (!response.ok) {
        res.status(response.status).json({ error: "Failed to fetch users" });
        return;
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("[Admin API] Failed to fetch users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
);

// Get current admin user info (admin only)
adminRouter.get("/me", (req: Request, res: Response): void => {
  res.json({
    user: req.session?.user,
    message: "Admin access verified",
  });
});

// Admin dashboard info (admin only)
adminRouter.get("/dashboard", (_req: Request, res: Response): void => {
  res.json({
    message: "Welcome to the admin dashboard",
    features: ["User Management", "Role Management", "System Settings"],
  });
});

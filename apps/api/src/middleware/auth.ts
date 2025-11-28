import type { NextFunction, Request, Response } from "express";
import { type Role, hasRole, isAdminRole } from "@repo/auth/rbac";

const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_FORBIDDEN = 403;

type SessionData = {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
    role?: Role;
  };
} | null;

// Extend Express Request to include session data
declare global {
  namespace Express {
    interface Request {
      session?: SessionData;
    }
  }
}

/**
 * Validate session by calling the app's auth API
 */
const validateSession = async (
  authHeader: string | undefined,
  cookieHeader: string | undefined
): Promise<SessionData> => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${appUrl}/api/auth/get-session`, {
      method: "GET",
      headers: {
        ...(authHeader && { Authorization: authHeader }),
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as SessionData;
    return data;
  } catch {
    return null;
  }
};

/**
 * Middleware to require authentication
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;

  const session = await validateSession(authHeader, cookieHeader);

  if (!session?.session) {
    res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }

  // Attach session to request for use in route handlers
  req.session = session;
  next();
};

/**
 * Middleware to require a specific role
 */
export const requireRole = (requiredRole: Role) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers.authorization;
    const cookieHeader = req.headers.cookie;

    const session = await validateSession(authHeader, cookieHeader);

    if (!session?.session) {
      res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: "Unauthorized" });
      return;
    }

    const userRole = session.user?.role;
    if (!hasRole(userRole, requiredRole)) {
      res.status(HTTP_STATUS_FORBIDDEN).json({
        error: `Forbidden: ${requiredRole} role required`,
      });
      return;
    }

    req.session = session;
    next();
  };
};

/**
 * Middleware to require admin role
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;

  const session = await validateSession(authHeader, cookieHeader);

  if (!session?.session) {
    res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }

  const userRole = session.user?.role;
  if (!isAdminRole(userRole)) {
    res.status(HTTP_STATUS_FORBIDDEN).json({
      error: "Forbidden: Admin role required",
    });
    return;
  }

  req.session = session;
  next();
};

import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Role } from "./rbac";

type MiddlewareCallback = (
  request: NextRequest
) =>
  | NextResponse
  | Response
  | undefined
  | Promise<NextResponse | Response | undefined>;

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

type MiddlewareConfig = {
  protectedRoutes?: string[];
  publicRoutes?: string[];
  adminRoutes?: string[];
  signInUrl?: string;
  defaultRedirect?: string;
};

/**
 * Check if a path matches any of the given patterns
 */
const matchesPath = (pathname: string, patterns: string[]): boolean => {
  return patterns.some((pattern) => {
    // Handle wildcard patterns
    if (pattern.endsWith("*")) {
      const prefix = pattern.slice(0, -1);
      return pathname.startsWith(prefix);
    }
    return pathname === pattern || pathname.startsWith(`${pattern}/`);
  });
};

/**
 * Create an auth middleware with configurable route protection
 */
export const createAuthMiddleware = (config: MiddlewareConfig = {}) => {
  const {
    protectedRoutes = [],
    publicRoutes = ["/sign-in", "/sign-up", "/api/auth"],
    adminRoutes = [],
    signInUrl = "/sign-in",
    defaultRedirect = "/",
  } = config;

  return async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    // Skip public routes
    if (matchesPath(pathname, publicRoutes)) {
      return NextResponse.next();
    }

    // Check if route needs protection
    const isProtected =
      protectedRoutes.length === 0 || matchesPath(pathname, protectedRoutes);
    const isAdminRoute = matchesPath(pathname, adminRoutes);

    if (!isProtected && !isAdminRoute) {
      return NextResponse.next();
    }

    // Fetch session
    const session = await betterFetch<SessionData>("/api/auth/get-session", {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    const sessionData = session.data;

    // No session - redirect to sign in
    if (!sessionData?.session) {
      const url = new URL(signInUrl, request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Check admin routes
    if (isAdminRoute) {
      const userRole = sessionData.user?.role;
      if (userRole !== "ADMIN") {
        // Redirect non-admin users to default page
        return NextResponse.redirect(new URL(defaultRedirect, request.url));
      }
    }

    return NextResponse.next();
  };
};

/**
 * Auth middleware wrapper for Better-Auth
 * Better-Auth handles session validation server-side via cookies
 * This wrapper allows composing with other middleware
 */
export const authMiddleware = (callback?: MiddlewareCallback) => {
  return (request: NextRequest) => {
    // Execute the callback middleware if provided
    if (callback) {
      return callback(request);
    }
  };
};

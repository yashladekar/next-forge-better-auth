import type { NextRequest, NextResponse } from "next/server";

type MiddlewareCallback = (
  request: NextRequest
) => NextResponse | Response | void | Promise<NextResponse | Response | void>;

/**
 * Auth middleware wrapper for Better-Auth
 * Better-Auth handles session validation server-side via cookies
 * This wrapper allows composing with other middleware
 */
export const authMiddleware = (callback?: MiddlewareCallback) => {
  return async (request: NextRequest) => {
    // Execute the callback middleware if provided
    if (callback) {
      return callback(request);
    }
  };
};

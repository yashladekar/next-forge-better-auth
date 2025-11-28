"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { useMemo } from "react";
import { type Role, ROLES, isAdminRole, hasRole as rbacHasRole } from "./rbac";

const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

/**
 * Hook to get the current user's role
 */
export const useRole = (): Role | null => {
  const { data: session } = useSession();
  return useMemo(() => {
    if (!session?.user) {
      return null;
    }
    return (
      (session.user as unknown as { role?: Role }).role || ROLES.USER
    );
  }, [session?.user]);
};

/**
 * Hook to check if the current user is an admin
 */
export const useIsAdmin = (): boolean => {
  const role = useRole();
  return useMemo(() => isAdminRole(role), [role]);
};

/**
 * Hook to check if the current user has a specific role
 */
export const useHasRole = (requiredRole: Role): boolean => {
  const role = useRole();
  return useMemo(() => rbacHasRole(role, requiredRole), [role, requiredRole]);
};

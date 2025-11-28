"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSession, useRole, useHasRole } from "../client";
import type { Role } from "../rbac";

type AuthGuardProps = {
  children: ReactNode;
  requiredRole?: Role;
  fallback?: ReactNode;
  redirectTo?: string;
  loadingFallback?: ReactNode;
};

/**
 * AuthGuard component for role-based access control
 * Wraps content that should only be visible to users with specific roles
 */
export const AuthGuard = ({
  children,
  requiredRole,
  fallback,
  redirectTo,
  loadingFallback = null,
}: AuthGuardProps) => {
  const { data: session, isPending } = useSession();
  const hasRequiredRole = useHasRole(requiredRole || "USER");
  const router = useRouter();

  const isAuthenticated = Boolean(session?.user);
  const hasAccess = requiredRole ? hasRequiredRole : isAuthenticated;

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!isAuthenticated && redirectTo) {
      router.push(redirectTo);
    } else if (isAuthenticated && !hasAccess && redirectTo) {
      router.push(redirectTo);
    }
  }, [isPending, isAuthenticated, hasAccess, redirectTo, router]);

  // Still loading session
  if (isPending) {
    return <>{loadingFallback}</>;
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (redirectTo) {
      return <>{loadingFallback}</>;
    }
    return <>{fallback}</>;
  }

  // Authenticated but doesn't have required role
  if (!hasAccess) {
    if (redirectTo) {
      return <>{loadingFallback}</>;
    }
    return <>{fallback}</>;
  }

  // Has access
  return <>{children}</>;
};

/**
 * Component that only renders for admin users
 */
type AdminOnlyProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export const AdminOnly = ({ children, fallback = null }: AdminOnlyProps) => {
  return (
    <AuthGuard requiredRole="ADMIN" fallback={fallback}>
      {children}
    </AuthGuard>
  );
};

/**
 * Component that only renders for moderator or admin users
 */
type ModeratorOnlyProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export const ModeratorOnly = ({
  children,
  fallback = null,
}: ModeratorOnlyProps) => {
  const role = useRole();
  const hasAccess = role === "ADMIN" || role === "MODERATOR";

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

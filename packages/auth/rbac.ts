/**
 * Role-Based Access Control (RBAC) utilities for Better-Auth
 */

// Role type matching the Prisma schema
export type Role = "USER" | "ADMIN" | "MODERATOR";

// Role constants
export const ROLES = {
  USER: "USER" as const,
  ADMIN: "ADMIN" as const,
  MODERATOR: "MODERATOR" as const,
};

/**
 * Check if a role has admin privileges
 */
export const isAdminRole = (role: Role | null | undefined): boolean => {
  return role === ROLES.ADMIN;
};

/**
 * Check if a role has moderator privileges (includes admin)
 */
export const isModeratorRole = (role: Role | null | undefined): boolean => {
  return role === ROLES.ADMIN || role === ROLES.MODERATOR;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (
  userRole: Role | null | undefined,
  requiredRole: Role
): boolean => {
  if (!userRole) {
    return false;
  }
  return userRole === requiredRole;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (
  userRole: Role | null | undefined,
  requiredRoles: Role[]
): boolean => {
  if (!userRole) {
    return false;
  }
  return requiredRoles.includes(userRole);
};

/**
 * Role hierarchy for permission checking
 * Higher index = higher privileges
 */
const ROLE_HIERARCHY: Role[] = [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN];

/**
 * Check if user role meets minimum required role level
 */
export const hasMinimumRole = (
  userRole: Role | null | undefined,
  minimumRole: Role
): boolean => {
  if (!userRole) {
    return false;
  }
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(minimumRole);
  return userRoleIndex >= requiredRoleIndex;
};

/**
 * Get display label for a role
 */
export const getRoleLabel = (role: Role): string => {
  switch (role) {
    case ROLES.ADMIN:
      return "Admin";
    case ROLES.MODERATOR:
      return "Moderator";
    case ROLES.USER:
      return "User";
    default:
      return "User";
  }
};

/**
 * Get badge variant for role display
 */
export const getRoleBadgeVariant = (
  role: Role
): "default" | "secondary" | "outline" => {
  switch (role) {
    case ROLES.ADMIN:
      return "default";
    case ROLES.MODERATOR:
      return "secondary";
    case ROLES.USER:
      return "outline";
    default:
      return "outline";
  }
};

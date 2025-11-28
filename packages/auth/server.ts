import "server-only";
import { database } from "@repo/database";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";
import { type Role, ROLES, hasRole as rbacHasRole, isAdminRole } from "./rbac";

// Session configuration constants (in seconds)
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_FOR_SESSION = 7;
const MINUTES_FOR_CACHE = 5;

const SEVEN_DAYS_IN_SECONDS =
  SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_FOR_SESSION;
const ONE_DAY_IN_SECONDS =
  SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
const FIVE_MINUTES_IN_SECONDS = MINUTES_FOR_CACHE * SECONDS_PER_MINUTE;

export const auth = betterAuth({
  database: prismaAdapter(database, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: SEVEN_DAYS_IN_SECONDS,
    updateAge: ONE_DAY_IN_SECONDS,
    cookieCache: {
      enabled: true,
      maxAge: FIVE_MINUTES_IN_SECONDS,
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001",
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: ROLES.USER,
        input: false, // User cannot set their own role
      },
    },
  },
  plugins: [admin()],
});

// Type for user with role
export type UserWithRole = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export const getSession = async () => {
  const headersList = await headers();
  return auth.api.getSession({
    headers: headersList,
  });
};

export const currentUser = async (): Promise<UserWithRole | null> => {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  // Cast to UserWithRole to include role field
  return {
    ...session.user,
    role: (session.user as unknown as { role?: Role }).role || ROLES.USER,
  } as UserWithRole;
};

/**
 * Check if the current user has the specified role
 */
export const hasRole = async (role: Role): Promise<boolean> => {
  const user = await currentUser();
  return rbacHasRole(user?.role, role);
};

/**
 * Check if the current user is an admin
 */
export const isAdmin = async (): Promise<boolean> => {
  const user = await currentUser();
  return isAdminRole(user?.role);
};

/**
 * Require the current user to have a specific role
 * Throws an error if the user doesn't have the required role
 */
export const requireRole = async (role: Role): Promise<UserWithRole> => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: No authenticated user");
  }
  if (!rbacHasRole(user.role, role)) {
    throw new Error(`Forbidden: ${role} role required`);
  }
  return user;
};

/**
 * Require the current user to be an admin
 * Throws an error if the user is not an admin
 */
export const requireAdmin = async (): Promise<UserWithRole> => {
  return requireRole(ROLES.ADMIN);
};

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

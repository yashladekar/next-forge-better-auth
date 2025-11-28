import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { database } from "@repo/database";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: prismaAdapter(database, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001",
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
  ],
});

export const getSession = async () => {
  const headersList = await headers();
  return auth.api.getSession({
    headers: headersList,
  });
};

export const currentUser = async () => {
  const session = await getSession();
  return session?.user || null;
};

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

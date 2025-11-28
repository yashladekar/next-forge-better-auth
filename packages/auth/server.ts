import "server-only";
import { database } from "@repo/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";

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

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const MIN_SECRET_LENGTH = 32;

export const keys = () =>
  createEnv({
    server: {
      BETTER_AUTH_SECRET: z.string().min(MIN_SECRET_LENGTH).optional(),
    },
    client: {
      NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),
    },
    runtimeEnv: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    },
  });

import { createEnv } from "@t3-oss/env-nextjs";

/**
 * @deprecated Stripe integration has been removed.
 * This package is deprecated and will be removed in a future version.
 */
export const keys = () =>
  createEnv({
    server: {},
    runtimeEnv: {},
  });

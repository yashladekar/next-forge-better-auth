import { analytics } from "@repo/analytics/server";
import { getSession } from "@repo/auth/server";
import { flag } from "flags/next";

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const session = await getSession();

      if (!session?.user?.id) {
        return this.defaultValue as boolean;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, session.user.id);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });

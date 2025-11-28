import "server-only";
import { getSession } from "@repo/auth/server";
import { Svix } from "svix";
import { keys } from "../keys";

const svixToken = keys().SVIX_TOKEN;

export const send = async (eventType: string, payload: object) => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const svix = new Svix(svixToken);
  const session = await getSession();

  // Use user ID as app ID since Better-Auth doesn't have orgs by default
  const appId = session?.user?.id;

  if (!appId) {
    return;
  }

  return svix.message.create(appId, {
    eventType,
    payload: {
      eventType,
      ...payload,
    },
    application: {
      name: appId,
      uid: appId,
    },
  });
};

export const getAppPortal = async () => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const svix = new Svix(svixToken);
  const session = await getSession();

  // Use user ID as app ID since Better-Auth doesn't have orgs by default
  const appId = session?.user?.id;

  if (!appId) {
    return;
  }

  return svix.authentication.appPortalAccess(appId, {
    application: {
      name: appId,
      uid: appId,
    },
  });
};

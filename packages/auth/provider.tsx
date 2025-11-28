"use client";

import type { ReactNode } from "react";

type AuthProviderProperties = {
  readonly children: ReactNode;
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

export const AuthProvider = ({
  children,
}: AuthProviderProperties) => {
  // Better-Auth doesn't require a provider wrapper like Clerk
  // The session is managed through cookies and server-side validation
  return <>{children}</>;
};

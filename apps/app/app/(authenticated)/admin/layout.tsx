import { isAdmin } from "@repo/auth/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

type AdminLayoutProperties = {
  readonly children: ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProperties) => {
  const userIsAdmin = await isAdmin();

  if (!userIsAdmin) {
    redirect("/");
  }

  return <>{children}</>;
};

export default AdminLayout;

import { currentUser } from "@repo/auth/server";
import { getRoleLabel, type Role, ROLES } from "@repo/auth/rbac";
import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { redirect } from "next/navigation";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";

const title = "Dashboard";
const description = "Your personal dashboard";

export const metadata: Metadata = createMetadata({ title, description });

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userRole: Role = user.role || ROLES.USER;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-bold text-3xl">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">
            This is your protected dashboard page.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Role</p>
                <Badge variant="secondary">{getRoleLabel(userRole)}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                This is a protected page that requires authentication. Only
                logged-in users can see this content.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

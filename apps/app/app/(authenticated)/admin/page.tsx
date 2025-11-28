import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldIcon, UsersIcon } from "lucide-react";

const title = "Admin Dashboard";
const description = "Manage your application and users";

export const metadata: Metadata = createMetadata({ title, description });

const AdminPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <ShieldIcon className="h-6 w-6" />
        <h1 className="font-semibold text-2xl">Admin Dashboard</h1>
      </div>
      <p className="text-muted-foreground">
        Welcome to the admin dashboard. Manage your application settings and
        users from here.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/users">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage user accounts and roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Manage user roles, view user activity, and handle account
                settings.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;

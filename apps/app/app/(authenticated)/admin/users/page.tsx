import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { UsersIcon } from "lucide-react";
import { database } from "@repo/database";
import { getRoleBadgeVariant, getRoleLabel, type Role } from "@repo/auth/rbac";

const title = "User Management";
const description = "View and manage user accounts";

export const metadata: Metadata = createMetadata({ title, description });

const UsersAdminPage = async () => {
  // Fetch users from database
  let users: Array<{
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
  }> = [];

  try {
    const dbUsers = await database.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    users = dbUsers.map((user) => ({
      ...user,
      role: user.role as Role,
    }));
  } catch {
    // Database might not be available in some environments
    users = [];
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <UsersIcon className="h-6 w-6" />
        <h1 className="font-semibold text-2xl">User Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all user accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No users found. Users will appear here once they sign up.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersAdminPage;

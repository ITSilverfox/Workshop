import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/app/(app)/admin/users/user-form";

const ROLES = ["admin", "owner", "workshop_staff", "accounts", "staff", "driver"];

export default async function UsersPage(props: PageProps<"/admin/users">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const role = typeof searchParams.role === "string" ? searchParams.role : "";
  const editId = typeof searchParams.edit === "string" ? searchParams.edit : "";

  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const { data: viewer } = authUser
    ? await supabase.from("app_users").select("role").eq("id", authUser.id).maybeSingle()
    : { data: null };
  const canManage = viewer?.role === "admin" || viewer?.role === "owner";

  let query = supabase
    .from("app_users")
    .select("id, email, full_name, role, is_active, driver_id, driver:drivers(first_name, last_name)")
    .order("email");
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
  }
  if (role) {
    query = query.eq("role", role);
  }
  const { data: users, error } = await query;

  const { data: editingUser } =
    editId && canManage
      ? await supabase.from("app_users").select("*").eq("id", editId).maybeSingle()
      : { data: null };
  const { data: drivers } = editingUser
    ? await supabase.from("drivers").select("id, first_name, last_name").order("first_name")
    : { data: [] };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="Application accounts, roles, and driver links. Accounts are created through Supabase Auth sign-up, not from this page."
      />

      {editId ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
          </CardHeader>
          <CardContent>
            {canManage && editingUser ? (
              <UserForm user={editingUser} drivers={drivers ?? []} />
            ) : (
              <p className="text-sm text-muted-foreground">
                {canManage
                  ? "User not found."
                  : "You need the admin or owner role to edit users."}
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3" method="get">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="q" className="text-sm font-medium">
                Search
              </label>
              <Input
                id="q"
                name="q"
                placeholder="Name or email…"
                defaultValue={q}
                className="w-56"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                name="role"
                defaultValue={role}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All roles</option>
                {ROLES.map((value) => (
                  <option key={value} value={value} className="capitalize">
                    {value.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || role ? (
              <Button variant="ghost" asChild>
                <Link href="/admin/users">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load users: {error.message}
            </p>
          ) : users && users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Full name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Linked driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" || user.role === "owner"
                            ? "default"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {user.role.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.driver
                        ? [user.driver.first_name, user.driver.last_name]
                            .filter(Boolean)
                            .join(" ")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {canManage ? (
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link href={`/admin/users?edit=${user.id}`}>
                            <Pencil />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No users found{q || role ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

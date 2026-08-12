import Link from "next/link";
import { Plus } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

const STATUS_VARIANT: Record<string, "default" | "secondary"> = {
  active: "default",
  archived: "secondary",
};

export default async function DriversPage(props: PageProps<"/drivers">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const supabase = await createClient();
  let query = supabase
    .from("drivers")
    .select("id, first_name, last_name, emp_id, phone, email, user_status, category, company:companies(name)")
    .order("first_name", { ascending: true });

  if (q) {
    query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,emp_id.ilike.%${q}%`);
  }
  if (status) {
    query = query.eq("user_status", status);
  }

  const { data: drivers, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Drivers"
        description="Everyone assigned to or driving fleet vehicles."
        actions={
          <Button asChild>
            <Link href="/drivers/new">
              <Plus />
              Add Driver
            </Link>
          </Button>
        }
      />

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
                placeholder="Name or employee ID…"
                defaultValue={q}
                className="w-56"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || status ? (
              <Button variant="ghost" asChild>
                <Link href="/drivers">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load drivers: {error.message}
            </p>
          ) : drivers && drivers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">
                      <Link href={`/drivers/${driver.id}`} className="hover:underline">
                        {[driver.first_name, driver.last_name].filter(Boolean).join(" ")}
                      </Link>
                    </TableCell>
                    <TableCell>{driver.emp_id ?? "—"}</TableCell>
                    <TableCell>{driver.phone ?? "—"}</TableCell>
                    <TableCell>{driver.email ?? "—"}</TableCell>
                    <TableCell className="capitalize">
                      {driver.category?.replace(/_/g, " ") ?? "—"}
                    </TableCell>
                    <TableCell>{driver.company?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[driver.user_status] ?? "outline"}
                        className="capitalize"
                      >
                        {driver.user_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No drivers found{q || status ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

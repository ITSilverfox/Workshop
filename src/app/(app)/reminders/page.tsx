import Link from "next/link";
import { Plus } from "lucide-react";
import { format } from "date-fns";
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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  pending: "default",
  sent: "secondary",
  dismissed: "outline",
};

function humanize(value: string) {
  return value.replace(/_/g, " ");
}

export default async function RemindersPage(props: PageProps<"/reminders">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const supabase = await createClient();
  let query = supabase
    .from("reminders")
    .select(
      "id, reminder_for, renewal_type, reminder_at, status, notes, vehicle:vehicles(reg_number), service_task:service_tasks(name)"
    )
    .order("reminder_at", { ascending: true });

  if (q) {
    query = query.ilike("notes", `%${q}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data: reminders, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reminders"
        description="Service and renewal reminders across the fleet."
        actions={
          <Button asChild>
            <Link href="/reminders/new">
              <Plus />
              Add Reminder
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
                placeholder="Notes…"
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
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || status ? (
              <Button variant="ghost" asChild>
                <Link href="/reminders">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load reminders: {error.message}
            </p>
          ) : reminders && reminders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>For</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reminders.map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/reminders/${reminder.id}`}
                        className="hover:underline"
                      >
                        {reminder.vehicle?.reg_number ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">{reminder.reminder_for}</TableCell>
                    <TableCell className="capitalize">
                      {reminder.renewal_type
                        ? humanize(reminder.renewal_type)
                        : reminder.service_task?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(reminder.reminder_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[reminder.status] ?? "outline"}
                        className="capitalize"
                      >
                        {reminder.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reminders found{q || status ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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

const ASSIGNMENT_STATUS_VARIANT: Record<string, "default" | "secondary"> = {
  active: "default",
  ended: "secondary",
};

const HANDOVER_STATUS_VARIANT: Record<string, "default" | "outline"> = {
  approved: "default",
  pending: "outline",
};

function driverName(
  driver: { first_name: string; last_name: string | null } | null
) {
  return driver ? [driver.first_name, driver.last_name].filter(Boolean).join(" ") : null;
}

async function AssignmentsSection({ q, status }: { q: string; status: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("vehicle_assignments")
    .select(
      "id, assigned_at, unassigned_at, status, vehicle:vehicles(reg_number), driver:drivers(first_name, last_name)"
    )
    .order("assigned_at", { ascending: false });

  if (q) {
    query = query.or(
      `reason.ilike.%${q}%,assigned_by.ilike.%${q}%,unassigned_by.ilike.%${q}%`
    );
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data: assignments, error } = await query;

  return (
    <>
      <Card>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3" method="get">
            <input type="hidden" name="tab" value="assignments" />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="q" className="text-sm font-medium">
                Search
              </label>
              <Input
                id="q"
                name="q"
                placeholder="Reason or assigned by…"
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
                <option value="ended">Ended</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || status ? (
              <Button variant="ghost" asChild>
                <Link href="/assignments">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load assignments: {error.message}
            </p>
          ) : assignments && assignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead>Unassigned At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="hover:underline"
                      >
                        {assignment.vehicle?.reg_number ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell>{driverName(assignment.driver) ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={ASSIGNMENT_STATUS_VARIANT[assignment.status] ?? "outline"}
                        className="capitalize"
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{assignment.assigned_at}</TableCell>
                    <TableCell>{assignment.unassigned_at ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No assignments found{q || status ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

async function HandoversSection({ q, status }: { q: string; status: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("vehicle_handovers")
    .select(
      "id, handover_date, handed_over_to, status, vehicle:vehicles(reg_number), driver:drivers(first_name, last_name)"
    )
    .order("handover_date", { ascending: false });

  if (q) {
    query = query.or(`handed_over_to.ilike.%${q}%,checked_by.ilike.%${q}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data: handovers, error } = await query;

  return (
    <>
      <Card>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3" method="get">
            <input type="hidden" name="tab" value="handovers" />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="q" className="text-sm font-medium">
                Search
              </label>
              <Input
                id="q"
                name="q"
                placeholder="Handed over to or checked by…"
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
                <option value="approved">Approved</option>
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || status ? (
              <Button variant="ghost" asChild>
                <Link href="/assignments?tab=handovers">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load handovers: {error.message}
            </p>
          ) : handovers && handovers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Handed Over To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {handovers.map((handover) => (
                  <TableRow key={handover.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/assignments/handovers/${handover.id}`}
                        className="hover:underline"
                      >
                        {handover.vehicle?.reg_number ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell>{driverName(handover.driver) ?? "—"}</TableCell>
                    <TableCell>{handover.handed_over_to ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={HANDOVER_STATUS_VARIANT[handover.status] ?? "outline"}
                        className="capitalize"
                      >
                        {handover.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{handover.handover_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No handovers found{q || status ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default async function AssignmentsPage(props: PageProps<"/assignments">) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab === "handovers" ? "handovers" : "assignments";
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Assignments & Handovers"
        description="Driver assignments and physical vehicle handover checklists."
        actions={
          <Button asChild>
            {tab === "handovers" ? (
              <Link href="/assignments/handovers/new">
                <Plus />
                Add Handover
              </Link>
            ) : (
              <Link href="/assignments/new">
                <Plus />
                Add Assignment
              </Link>
            )}
          </Button>
        }
      />

      <div className="flex items-center gap-2">
        <Button variant={tab === "assignments" ? "default" : "outline"} asChild>
          <Link href="/assignments">Assignments</Link>
        </Button>
        <Button variant={tab === "handovers" ? "default" : "outline"} asChild>
          <Link href="/assignments?tab=handovers">Handovers</Link>
        </Button>
      </div>

      {tab === "handovers" ? (
        <HandoversSection q={q} status={status} />
      ) : (
        <AssignmentsSection q={q} status={status} />
      )}
    </div>
  );
}

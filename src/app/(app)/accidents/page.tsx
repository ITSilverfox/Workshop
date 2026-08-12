import Link from "next/link";
import { format } from "date-fns";
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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  pending: "outline",
  approved: "default",
};

function fmtDateTime(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy, HH:mm") : "—";
}

export default async function AccidentsPage(props: PageProps<"/accidents">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const supabase = await createClient();
  let query = supabase
    .from("accident_reports")
    .select(
      "id, occurred_at, location, incident_type, status, total_fine, vehicle:vehicles(reg_number), driver:drivers(first_name, last_name)"
    )
    .order("occurred_at", { ascending: false });

  if (q) {
    query = query.or(`location.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data: accidentReports, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Accident Reports"
        description="Vehicle accidents, RTA fines and incident records."
        actions={
          <Button asChild>
            <Link href="/accidents/new">
              <Plus />
              Add Accident Report
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
                placeholder="Location or description…"
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
                <Link href="/accidents">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load accident reports: {error.message}
            </p>
          ) : accidentReports && accidentReports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Occurred At</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Incident Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Fine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accidentReports.map((accidentReport) => (
                  <TableRow key={accidentReport.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/accidents/${accidentReport.id}`}
                        className="hover:underline"
                      >
                        {fmtDateTime(accidentReport.occurred_at)}
                      </Link>
                    </TableCell>
                    <TableCell>{accidentReport.vehicle?.reg_number ?? "—"}</TableCell>
                    <TableCell>
                      {accidentReport.driver
                        ? [accidentReport.driver.first_name, accidentReport.driver.last_name]
                            .filter(Boolean)
                            .join(" ")
                        : "—"}
                    </TableCell>
                    <TableCell>{accidentReport.location}</TableCell>
                    <TableCell className="capitalize">
                      {accidentReport.incident_type.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[accidentReport.status] ?? "outline"}
                        className="capitalize"
                      >
                        {accidentReport.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{accidentReport.total_fine ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No accident reports found{q || status ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

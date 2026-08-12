import Link from "next/link";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
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

const STATUSES = ["draft", "under_process", "approved"];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  draft: "outline",
  under_process: "secondary",
  approved: "default",
};

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

export default async function CostAllocationPage(
  props: PageProps<"/cost-allocation">
) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const supabase = await createClient();
  let query = supabase
    .from("cost_allocation_periods")
    .select("id, from_date, to_date, status, created_at")
    .order("from_date", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: periods, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cost Allocation"
        description="Periods used to allocate vehicle costs across companies."
        actions={
          <Button asChild>
            <Link href="/cost-allocation/new">
              <Plus />
              Add Period
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3" method="get">
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
                {STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {status ? (
              <Button variant="ghost" asChild>
                <Link href="/cost-allocation">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load periods: {error.message}
            </p>
          ) : periods && periods.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/cost-allocation/${period.id}`}
                        className="hover:underline"
                      >
                        {fmtDate(period.from_date)}
                      </Link>
                    </TableCell>
                    <TableCell>{fmtDate(period.to_date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[period.status] ?? "outline"}
                        className="capitalize"
                      >
                        {period.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{fmtDate(period.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No periods found{status ? " for this filter" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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

const STATUS_OPTIONS = [
  "pending",
  "under_inspection",
  "scheduled",
  "wip",
  "completed",
  "cancelled",
  "discarded",
  "returned_to_client",
];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  under_inspection: "secondary",
  scheduled: "secondary",
  wip: "default",
  completed: "default",
  cancelled: "destructive",
  discarded: "destructive",
  returned_to_client: "outline",
};

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

export default async function JobCardsPage(props: PageProps<"/job-cards">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const supabase = await createClient();
  let query = supabase
    .from("job_cards")
    .select(
      "id, job_card_no, customer_name, type_of_service, status, scheduled_date, total_amount, vehicle:vehicles(reg_number), technician_received:technicians!job_cards_technician_received_id_fkey(name)"
    )
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`job_card_no.ilike.%${q}%,customer_name.ilike.%${q}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data: jobCards, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Job Cards"
        description="Workshop service and repair jobs."
        actions={
          <Button asChild>
            <Link href="/job-cards/new">
              <Plus />
              Add Job Card
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
                placeholder="Job card no. or customer…"
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
                {STATUS_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q || status ? (
              <Button variant="ghost" asChild>
                <Link href="/job-cards">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load job cards: {error.message}
            </p>
          ) : jobCards && jobCards.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Card No.</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type of Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobCards.map((jobCard) => (
                  <TableRow key={jobCard.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/job-cards/${jobCard.id}`}
                        className="hover:underline"
                      >
                        {jobCard.job_card_no}
                      </Link>
                    </TableCell>
                    <TableCell>{jobCard.vehicle?.reg_number ?? "—"}</TableCell>
                    <TableCell>{jobCard.customer_name ?? "—"}</TableCell>
                    <TableCell className="capitalize">
                      {jobCard.type_of_service.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[jobCard.status] ?? "outline"}
                        className="capitalize"
                      >
                        {jobCard.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{jobCard.technician_received?.name ?? "—"}</TableCell>
                    <TableCell>{fmtDate(jobCard.scheduled_date)}</TableCell>
                    <TableCell>{jobCard.total_amount ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No job cards found{q || status ? " for these filters" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
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

const INSPECTION_STATUS = "under_inspection";

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

export default async function InspectionsPage(props: PageProps<"/inspections">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  const supabase = await createClient();
  let query = supabase
    .from("job_cards")
    .select(
      "id, job_card_no, customer_name, scheduled_date, due_date, inspection_checklist, vehicle:vehicles(reg_number), technician_inspected:technicians!job_cards_technician_inspected_id_fkey(name)"
    )
    .eq("status", INSPECTION_STATUS)
    .order("scheduled_date", { ascending: true });

  if (q) {
    query = query.or(`job_card_no.ilike.%${q}%,customer_name.ilike.%${q}%`);
  }

  const { data: jobCards, error } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inspections"
        description="Job cards currently under inspection."
        actions={
          <Button variant="outline" asChild>
            <Link href="/job-cards">View all job cards</Link>
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
            <Button type="submit" variant="outline">
              Filter
            </Button>
            {q ? (
              <Button variant="ghost" asChild>
                <Link href="/inspections">Clear</Link>
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load inspections: {error.message}
            </p>
          ) : jobCards && jobCards.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Card No.</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Technician Inspecting</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Checklist</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobCards.map((jobCard) => {
                  const checklistCount = Array.isArray(jobCard.inspection_checklist)
                    ? jobCard.inspection_checklist.length
                    : 0;
                  return (
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
                      <TableCell>{jobCard.technician_inspected?.name ?? "—"}</TableCell>
                      <TableCell>{fmtDate(jobCard.scheduled_date)}</TableCell>
                      <TableCell>{fmtDate(jobCard.due_date)}</TableCell>
                      <TableCell>
                        {checklistCount > 0 ? (
                          <Badge variant="secondary">{checklistCount} item(s)</Badge>
                        ) : (
                          <Badge variant="outline">Empty</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No job cards are currently under inspection{q ? " for this search" : ""}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

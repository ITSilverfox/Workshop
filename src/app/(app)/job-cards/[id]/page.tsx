import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  deleteJobCard,
  addJobCardItem,
  deleteJobCardItem,
  addJobCardLabor,
  deleteJobCardLabor,
} from "@/app/(app)/job-cards/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ITEM_SOURCE_TYPES = ["in_stock", "inter_company", "external"];

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

function fmtDateTime(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy, HH:mm") : "—";
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? "—"}</span>
    </div>
  );
}

export default async function JobCardDetailPage(
  props: PageProps<"/job-cards/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: jobCard } = await supabase
    .from("job_cards")
    .select(
      "*, vehicle:vehicles(reg_number, vehicle_name), company:companies(name), requested_by_driver:drivers(first_name, last_name), technician_received:technicians!job_cards_technician_received_id_fkey(name), technician_inspected:technicians!job_cards_technician_inspected_id_fkey(name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!jobCard) {
    notFound();
  }

  const [{ data: items }, { data: labor }, { data: statusHistory }, { data: technicians }] =
    await Promise.all([
      supabase
        .from("job_card_items")
        .select("*")
        .eq("job_card_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("job_card_labor")
        .select("*, technician:technicians(name)")
        .eq("job_card_id", id)
        .order("work_date", { ascending: true }),
      supabase
        .from("job_card_status_history")
        .select("*")
        .eq("job_card_id", id)
        .order("changed_at", { ascending: true }),
      supabase.from("technicians").select("*").order("name"),
    ]);

  const requestedByName = jobCard.requested_by_driver
    ? [jobCard.requested_by_driver.first_name, jobCard.requested_by_driver.last_name]
        .filter(Boolean)
        .join(" ")
    : null;

  const checklist = Array.isArray(jobCard.inspection_checklist)
    ? jobCard.inspection_checklist
    : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={jobCard.job_card_no}
        description={jobCard.vehicle?.reg_number ?? jobCard.customer_name ?? undefined}
        actions={
          <>
            <Badge className="capitalize">{jobCard.status.replace(/_/g, " ")}</Badge>
            <Button variant="outline" asChild>
              <Link href={`/job-cards/${jobCard.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this job card?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes job card {jobCard.job_card_no}. This cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteJobCard.bind(null, jobCard.id)}>
                    <AlertDialogAction
                      type="submit"
                      variant="destructive"
                      className="w-full"
                    >
                      Delete
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Vehicle" value={jobCard.vehicle?.reg_number} />
          <Detail label="Company" value={jobCard.company?.name} />
          <Detail label="Customer name" value={jobCard.customer_name} />
          <Detail
            label="Type of service"
            value={jobCard.type_of_service.replace(/_/g, " ")}
          />
          <Detail label="Service interval (km)" value={jobCard.service_type_km} />
          <Detail label="Serial number" value={jobCard.serial_number} />
          <Detail label="Internal job" value={jobCard.is_internal ? "Yes" : "No"} />
          <Detail
            label="Under warranty"
            value={jobCard.under_warranty == null ? null : jobCard.under_warranty ? "Yes" : "No"}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>People</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Requested by" value={requestedByName} />
          <Detail label="Driver name (free text)" value={jobCard.driver_name_text} />
          <Detail label="Technician received" value={jobCard.technician_received?.name} />
          <Detail
            label="Technician inspected"
            value={jobCard.technician_inspected?.name}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status &amp; Workflow</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Accounts submitted" value={jobCard.accounts_submitted} />
          <Detail label="RTA status" value={jobCard.rta_status?.replace(/_/g, " ")} />
          <Detail
            label="RTA passing type"
            value={jobCard.rta_passing_type?.replace(/_/g, " ")}
          />
          {jobCard.cancellation_reason ? (
            <div className="col-span-full flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Cancellation reason</span>
              <span className="text-sm whitespace-pre-wrap">
                {jobCard.cancellation_reason}
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Service requested" value={fmtDate(jobCard.service_req_date)} />
          <Detail label="Scheduled date" value={fmtDate(jobCard.scheduled_date)} />
          <Detail label="Due date" value={fmtDate(jobCard.due_date)} />
          <Detail label="Time in" value={fmtDateTime(jobCard.time_in)} />
          <Detail label="Time out" value={fmtDateTime(jobCard.time_out)} />
          <Detail label="Completed at" value={fmtDateTime(jobCard.completed_at)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Odometer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Current reading (km)" value={jobCard.current_reading_km} />
          <Detail label="Last serviced (km)" value={jobCard.last_serviced_km} />
          <Detail label="Next service due (km)" value={jobCard.next_service_km} />
        </CardContent>
      </Card>

      {jobCard.issue_description || jobCard.action_taken || jobCard.further_remarks ? (
        <Card>
          <CardHeader>
            <CardTitle>Issue &amp; Remarks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Issue description</span>
              <span className="text-sm whitespace-pre-wrap">
                {jobCard.issue_description ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Action taken</span>
              <span className="text-sm whitespace-pre-wrap">
                {jobCard.action_taken ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Further remarks</span>
              <span className="text-sm whitespace-pre-wrap">
                {jobCard.further_remarks ?? "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Invoice &amp; Financials</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Invoice number" value={jobCard.invoice_number} />
          <Detail label="Invoice date" value={fmtDate(jobCard.invoice_date)} />
          <Detail label="Invoice file" value={jobCard.invoice_path} />
          <Detail label="Labor amount" value={jobCard.labor_amount} />
          <Detail label="Parts amount" value={jobCard.parts_amount} />
          <Detail label="Tax amount" value={jobCard.tax_amount} />
          <Detail label="Total amount" value={jobCard.total_amount} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          {checklist && checklist.length > 0 ? (
            <pre className="max-h-80 overflow-auto rounded-lg bg-muted p-3 text-xs">
              {JSON.stringify(checklist, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No checklist items recorded.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {items && items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="capitalize">
                      {item.source_type.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>{item.item_name ?? "—"}</TableCell>
                    <TableCell>{item.quantity ?? "—"}</TableCell>
                    <TableCell>{item.unit ?? "—"}</TableCell>
                    <TableCell>{item.rate ?? "—"}</TableCell>
                    <TableCell>{item.amount ?? "—"}</TableCell>
                    <TableCell>{item.notes ?? "—"}</TableCell>
                    <TableCell>
                      <form action={deleteJobCardItem.bind(null, item.id, jobCard.id)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          aria-label="Delete item"
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No items recorded yet.</p>
          )}

          <form
            action={addJobCardItem.bind(null, jobCard.id)}
            className="flex flex-wrap items-end gap-2 border-t pt-4"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="source_type" className="text-xs font-medium">
                Source
              </label>
              <select
                id="source_type"
                name="source_type"
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                {ITEM_SOURCE_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {value.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="item_name" className="text-xs font-medium">
                Item
              </label>
              <Input id="item_name" name="item_name" className="w-40" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quantity" className="text-xs font-medium">
                Qty
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                defaultValue={1}
                className="w-20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="unit" className="text-xs font-medium">
                Unit
              </label>
              <Input id="unit" name="unit" className="w-20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rate" className="text-xs font-medium">
                Rate
              </label>
              <Input
                id="rate"
                name="rate"
                type="number"
                step="0.01"
                defaultValue={0}
                className="w-24"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="amount" className="text-xs font-medium">
                Amount
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={0}
                className="w-24"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="item_notes" className="text-xs font-medium">
                Notes
              </label>
              <Input id="item_notes" name="notes" className="w-40" />
            </div>
            <Button type="submit" variant="outline">
              <Plus />
              Add item
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Labor</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {labor && labor.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technician</TableHead>
                  <TableHead>Work Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {labor.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.technician?.name ?? "—"}</TableCell>
                    <TableCell>{fmtDate(entry.work_date)}</TableCell>
                    <TableCell>{entry.hours ?? "—"}</TableCell>
                    <TableCell>{entry.amount ?? "—"}</TableCell>
                    <TableCell>{entry.notes ?? "—"}</TableCell>
                    <TableCell>
                      <form action={deleteJobCardLabor.bind(null, entry.id, jobCard.id)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          aria-label="Delete labor entry"
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No labor entries recorded yet.</p>
          )}

          <form
            action={addJobCardLabor.bind(null, jobCard.id)}
            className="flex flex-wrap items-end gap-2 border-t pt-4"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="technician_id" className="text-xs font-medium">
                Technician
              </label>
              <select
                id="technician_id"
                name="technician_id"
                defaultValue=""
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">Unassigned</option>
                {(technicians ?? []).map((technician) => (
                  <option key={technician.id} value={technician.id}>
                    {technician.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="work_date" className="text-xs font-medium">
                Work date
              </label>
              <Input id="work_date" name="work_date" type="date" className="w-36" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="hours" className="text-xs font-medium">
                Hours
              </label>
              <Input id="hours" name="hours" type="number" step="0.01" className="w-20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="labor_amount_row" className="text-xs font-medium">
                Amount
              </label>
              <Input
                id="labor_amount_row"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={0}
                className="w-24"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="labor_notes" className="text-xs font-medium">
                Notes
              </label>
              <Input id="labor_notes" name="notes" className="w-40" />
            </div>
            <Button type="submit" variant="outline">
              <Plus />
              Add labor
            </Button>
          </form>
        </CardContent>
      </Card>

      {statusHistory && statusHistory.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Changed At</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="capitalize">
                      {entry.status.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>{fmtDateTime(entry.changed_at)}</TableCell>
                    <TableCell>{entry.changed_by ?? "—"}</TableCell>
                    <TableCell>{entry.notes ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

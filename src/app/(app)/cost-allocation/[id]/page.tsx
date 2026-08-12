import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deletePeriod, deleteInvoice } from "@/app/(app)/cost-allocation/actions";
import { getInvoiceFormLookups } from "@/app/(app)/cost-allocation/lookups";
import { InvoiceForm } from "@/app/(app)/cost-allocation/invoice-form";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  draft: "outline",
  under_process: "secondary",
  approved: "default",
};

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? "—"}</span>
    </div>
  );
}

export default async function PeriodDetailPage(
  props: PageProps<"/cost-allocation/[id]">
) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const editId = typeof searchParams.edit === "string" ? searchParams.edit : "";

  const supabase = await createClient();

  const { data: period } = await supabase
    .from("cost_allocation_periods")
    .select("*, creator:app_users(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (!period) {
    notFound();
  }

  const [{ data: invoices }, lookups] = await Promise.all([
    supabase
      .from("cost_allocation_invoices")
      .select("*, company:companies(name)")
      .eq("period_id", id)
      .order("created_at", { ascending: true }),
    getInvoiceFormLookups(),
  ]);

  const editingInvoice = editId
    ? invoices?.find((invoice) => invoice.id === editId) ?? null
    : null;

  const totals = (invoices ?? []).reduce(
    (acc, invoice) => ({
      invoice_value: acc.invoice_value + (invoice.invoice_value ?? 0),
      ho_cost: acc.ho_cost + (invoice.ho_cost ?? 0),
      total_cost: acc.total_cost + (invoice.total_cost ?? 0),
    }),
    { invoice_value: 0, ho_cost: 0, total_cost: 0 }
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${fmtDate(period.from_date)} – ${fmtDate(period.to_date)}`}
        description="Cost allocation period"
        actions={
          <>
            <Badge
              variant={STATUS_VARIANT[period.status] ?? "outline"}
              className="capitalize"
            >
              {period.status.replace("_", " ")}
            </Badge>
            <Button variant="outline" asChild>
              <Link href={`/cost-allocation/${period.id}/edit`}>
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
                  <AlertDialogTitle>Delete this period?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes this period, along with all invoices
                    and expense ledger entries linked to it. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deletePeriod.bind(null, period.id)}>
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
          <CardTitle>Period</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="From date" value={fmtDate(period.from_date)} />
          <Detail label="To date" value={fmtDate(period.to_date)} />
          <Detail label="Status" value={period.status.replace("_", " ")} />
          <Detail label="Created by" value={period.creator?.full_name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices && invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Invoice Value</TableHead>
                  <TableHead>HO Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.company?.name ?? "—"}
                    </TableCell>
                    <TableCell>{invoice.invoice_number ?? "—"}</TableCell>
                    <TableCell>{invoice.invoice_value ?? "—"}</TableCell>
                    <TableCell>{invoice.ho_cost ?? "—"}</TableCell>
                    <TableCell>{invoice.total_cost ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link
                            href={`/cost-allocation/${period.id}?edit=${invoice.id}`}
                          >
                            <Pencil />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Trash2 />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this invoice?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes this invoice line item.
                                This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <form action={deleteInvoice.bind(null, invoice.id)}>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell />
                  <TableCell className="font-semibold">
                    {totals.invoice_value}
                  </TableCell>
                  <TableCell className="font-semibold">{totals.ho_cost}</TableCell>
                  <TableCell className="font-semibold">
                    {totals.total_cost}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No invoices recorded for this period yet.
            </p>
          )}
        </CardContent>
      </Card>

      <InvoiceForm
        periodId={period.id}
        invoice={editingInvoice}
        companies={lookups.companies}
      />
    </div>
  );
}

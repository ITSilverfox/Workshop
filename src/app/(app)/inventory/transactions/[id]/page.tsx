import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteTransaction } from "@/app/(app)/inventory/transactions/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  purchase_external: "Purchase (external)",
  purchase_internal: "Purchase (internal)",
  inter_company: "Inter-company",
  issue_to_job_card: "Issue to job card",
  adjustment_in: "Adjustment in",
  adjustment_out: "Adjustment out",
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

export default async function TransactionDetailPage(
  props: PageProps<"/inventory/transactions/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: transaction } = await supabase
    .from("inventory_transactions")
    .select(
      "*, item:items(id, name, item_code, unit), job_card:job_cards(id, job_card_no), vendor:vendors(id, name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!transaction) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={transaction.item?.name ?? "Stock Transaction"}
        description={fmtDate(transaction.transaction_date)}
        actions={
          <>
            <Badge className="capitalize">
              {TRANSACTION_TYPE_LABEL[transaction.transaction_type] ??
                transaction.transaction_type}
            </Badge>
            <Button variant="outline" asChild>
              <Link href={`/inventory/transactions/${transaction.id}/edit`}>
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
                  <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes this stock transaction record.
                    This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteTransaction.bind(null, transaction.id)}>
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
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail
            label="Item"
            value={
              transaction.item ? (
                <Link
                  href={`/inventory/items/${transaction.item.id}`}
                  className="hover:underline"
                >
                  {transaction.item.name}
                </Link>
              ) : null
            }
          />
          <Detail label="Transaction date" value={fmtDate(transaction.transaction_date)} />
          <Detail label="Quantity" value={`${transaction.quantity} ${transaction.item?.unit ?? ""}`.trim()} />
          <Detail label="Rate" value={transaction.rate} />
          <Detail label="Amount" value={transaction.amount} />
          <Detail label="Reference no." value={transaction.reference_no} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Records</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail
            label="Job card"
            value={
              transaction.job_card ? (
                <Link
                  href={`/job-cards/${transaction.job_card.id}`}
                  className="hover:underline"
                >
                  {transaction.job_card.job_card_no}
                </Link>
              ) : null
            }
          />
          <Detail
            label="Vendor"
            value={
              transaction.vendor ? (
                <Link
                  href={`/admin/vendors/${transaction.vendor.id}`}
                  className="hover:underline"
                >
                  {transaction.vendor.name}
                </Link>
              ) : null
            }
          />
        </CardContent>
      </Card>

      {transaction.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{transaction.notes}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

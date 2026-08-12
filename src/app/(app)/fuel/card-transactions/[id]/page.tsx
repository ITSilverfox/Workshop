import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteCardTransaction } from "@/app/(app)/fuel/card-transactions/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
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

export default async function CardTransactionDetailPage(
  props: PageProps<"/fuel/card-transactions/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: transaction } = await supabase
    .from("fuel_card_transactions")
    .select("*, vehicle:vehicles(reg_number, vehicle_name)")
    .eq("id", id)
    .maybeSingle();

  if (!transaction) {
    notFound();
  }

  const vehicleLabel = transaction.vehicle
    ? transaction.vehicle.vehicle_name
      ? `${transaction.vehicle.reg_number} — ${transaction.vehicle.vehicle_name}`
      : transaction.vehicle.reg_number
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Card Transaction — ${fmtDateTime(transaction.transacted_at)}`}
        description={vehicleLabel ?? "Unmatched transaction"}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/fuel/card-transactions/${transaction.id}/edit`}>
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
                    This permanently removes this card transaction. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteCardTransaction.bind(null, transaction.id)}>
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
          <Detail label="Vehicle" value={vehicleLabel} />
          <Detail label="Date & time" value={fmtDateTime(transaction.transacted_at)} />
          <Detail label="Source" value={transaction.source} />
          <Detail label="Bill reference" value={transaction.bill_reference} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amount</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Amount" value={transaction.amount} />
          <Detail label="Litres" value={transaction.litres} />
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

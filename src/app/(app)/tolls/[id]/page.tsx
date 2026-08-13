import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteTollTransaction } from "@/app/(app)/tolls/actions";
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

export default async function TollTransactionDetailPage(props: PageProps<"/tolls/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: transaction } = await supabase
    .from("toll_transactions")
    .select(
      "*, vehicle:vehicles(reg_number, vehicle_name), toll_account:toll_accounts(account_name), owned_company:companies!toll_transactions_owned_company_id_fkey(name), allocated_company:companies!toll_transactions_allocated_company_id_fkey(name), account:chart_of_accounts(account_name)"
    )
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
        title={`Toll Transaction — ${fmtDateTime(transaction.occurred_at)}`}
        description={vehicleLabel ?? "Unmatched transaction"}
        actions={
          <>
            <Badge variant="outline" className="capitalize">
              {transaction.transaction_type.replace(/_/g, " ")}
            </Badge>
            <Button variant="outline" asChild>
              <Link href={`/tolls/${transaction.id}/edit`}>
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
                    This permanently removes this toll transaction. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteTollTransaction.bind(null, transaction.id)}>
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
          <Detail label="Toll account" value={transaction.toll_account?.account_name} />
          <Detail label="Date & time" value={fmtDateTime(transaction.occurred_at)} />
          <Detail label="Source" value={transaction.source} />
          <Detail label="Amount" value={transaction.amount} />
          <Detail label="Reference number" value={transaction.reference_no} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accounting</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Owned by company" value={transaction.owned_company?.name} />
          <Detail label="Allocated company" value={transaction.allocated_company?.name} />
          <Detail label="Chart of accounts" value={transaction.account?.account_name} />
        </CardContent>
      </Card>
    </div>
  );
}

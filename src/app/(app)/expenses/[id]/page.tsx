import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteExpense } from "@/app/(app)/expenses/actions";
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

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? "—"}</span>
    </div>
  );
}

export default async function ExpenseDetailPage(
  props: PageProps<"/expenses/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: expense } = await supabase
    .from("vehicle_expense_ledger")
    .select(
      "*, vehicle:vehicles(reg_number), company:companies(name), period:cost_allocation_periods(from_date, to_date, status)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!expense) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${capitalize(expense.category)} Expense`}
        description={fmtDate(expense.entry_date)}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/expenses/${expense.id}/edit`}>
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
                  <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes this ledger entry. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteExpense.bind(null, expense.id)}>
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
          <CardTitle>Expense</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Entry date" value={fmtDate(expense.entry_date)} />
          <Detail label="Category" value={capitalize(expense.category)} />
          <Detail label="Amount" value={expense.amount} />
          <Detail label="Quantity" value={expense.quantity} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allocation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Company" value={expense.company?.name} />
          <Detail label="Vehicle" value={expense.vehicle?.reg_number} />
          <Detail
            label="Cost allocation period"
            value={
              expense.period
                ? `${fmtDate(expense.period.from_date)} – ${fmtDate(expense.period.to_date)}`
                : null
            }
          />
        </CardContent>
      </Card>

      {expense.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{expense.notes}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

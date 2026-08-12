import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ExpenseForm } from "@/app/(app)/expenses/expense-form";
import { getExpenseFormLookups } from "@/app/(app)/expenses/lookups";

export default async function EditExpensePage(
  props: PageProps<"/expenses/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: expense }, lookups] = await Promise.all([
    supabase.from("vehicle_expense_ledger").select("*").eq("id", id).maybeSingle(),
    getExpenseFormLookups(),
  ]);

  if (!expense) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Expense"
        description="Update this expense entry's details."
      />
      <ExpenseForm expense={expense} lookups={lookups} />
    </div>
  );
}

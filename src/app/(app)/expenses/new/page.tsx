import { PageHeader } from "@/components/page-header";
import { ExpenseForm } from "@/app/(app)/expenses/expense-form";
import { getExpenseFormLookups } from "@/app/(app)/expenses/lookups";

export default async function NewExpensePage() {
  const lookups = await getExpenseFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Expense" description="Record a new vehicle expense entry." />
      <ExpenseForm lookups={lookups} />
    </div>
  );
}

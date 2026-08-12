import { PageHeader } from "@/components/page-header";
import { TransactionForm } from "@/app/(app)/inventory/transactions/transaction-form";
import { getTransactionFormLookups } from "@/app/(app)/inventory/transactions/lookups";

export default async function NewTransactionPage() {
  const lookups = await getTransactionFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add Transaction"
        description="Record a stock movement for an inventory item."
      />
      <TransactionForm lookups={lookups} />
    </div>
  );
}

import { PageHeader } from "@/components/page-header";
import { CardTransactionForm } from "@/app/(app)/fuel/card-transactions/card-transaction-form";
import { getCardTransactionFormLookups } from "@/app/(app)/fuel/card-transactions/lookups";

export default async function NewCardTransactionPage() {
  const lookups = await getCardTransactionFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Card Transaction" description="Record a fuel card transaction." />
      <CardTransactionForm lookups={lookups} />
    </div>
  );
}

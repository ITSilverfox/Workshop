import { PageHeader } from "@/components/page-header";
import { TollTransactionForm } from "@/app/(app)/tolls/toll-transaction-form";
import { getTollTransactionFormLookups } from "@/app/(app)/tolls/lookups";

export default async function NewTollTransactionPage() {
  const lookups = await getTollTransactionFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Toll Transaction" description="Record a new toll transaction." />
      <TollTransactionForm lookups={lookups} />
    </div>
  );
}

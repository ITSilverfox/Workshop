import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { TransactionForm } from "@/app/(app)/inventory/transactions/transaction-form";
import { getTransactionFormLookups } from "@/app/(app)/inventory/transactions/lookups";

export default async function EditTransactionPage(
  props: PageProps<"/inventory/transactions/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: transaction }, lookups] = await Promise.all([
    supabase.from("inventory_transactions").select("*").eq("id", id).maybeSingle(),
    getTransactionFormLookups(),
  ]);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Stock Transaction"
        description="Update this stock transaction record."
      />
      <TransactionForm transaction={transaction} lookups={lookups} />
    </div>
  );
}

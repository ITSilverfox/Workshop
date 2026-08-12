import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { CardTransactionForm } from "@/app/(app)/fuel/card-transactions/card-transaction-form";
import { getCardTransactionFormLookups } from "@/app/(app)/fuel/card-transactions/lookups";

export default async function EditCardTransactionPage(
  props: PageProps<"/fuel/card-transactions/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: transaction }, lookups] = await Promise.all([
    supabase.from("fuel_card_transactions").select("*").eq("id", id).maybeSingle(),
    getCardTransactionFormLookups(),
  ]);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Card Transaction"
        description="Update this fuel card transaction's details."
      />
      <CardTransactionForm transaction={transaction} lookups={lookups} />
    </div>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { TollTransactionForm } from "@/app/(app)/tolls/toll-transaction-form";
import { getTollTransactionFormLookups } from "@/app/(app)/tolls/lookups";

export default async function EditTollTransactionPage(
  props: PageProps<"/tolls/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: transaction }, lookups] = await Promise.all([
    supabase.from("toll_transactions").select("*").eq("id", id).maybeSingle(),
    getTollTransactionFormLookups(),
  ]);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Toll Transaction"
        description="Update this toll transaction's details."
      />
      <TollTransactionForm transaction={transaction} lookups={lookups} />
    </div>
  );
}

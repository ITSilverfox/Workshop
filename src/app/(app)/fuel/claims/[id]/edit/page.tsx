import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ClaimForm } from "@/app/(app)/fuel/claims/claim-form";

export default async function EditClaimPage(props: PageProps<"/fuel/claims/[id]/edit">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: claim } = await supabase
    .from("fuel_expense_claims")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!claim) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit Claim" description="Update this claim's details." />
      <ClaimForm claim={claim} />
    </div>
  );
}

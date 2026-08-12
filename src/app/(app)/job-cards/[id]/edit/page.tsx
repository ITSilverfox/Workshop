import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { JobCardForm } from "@/app/(app)/job-cards/job-card-form";
import { getJobCardFormLookups } from "@/app/(app)/job-cards/lookups";

export default async function EditJobCardPage(
  props: PageProps<"/job-cards/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: jobCard }, lookups] = await Promise.all([
    supabase.from("job_cards").select("*").eq("id", id).maybeSingle(),
    getJobCardFormLookups(),
  ]);

  if (!jobCard) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit ${jobCard.job_card_no}`}
        description="Update this job card's details."
      />
      <JobCardForm jobCard={jobCard} lookups={lookups} />
    </div>
  );
}

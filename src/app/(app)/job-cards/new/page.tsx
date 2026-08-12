import { PageHeader } from "@/components/page-header";
import { JobCardForm } from "@/app/(app)/job-cards/job-card-form";
import { getJobCardFormLookups } from "@/app/(app)/job-cards/lookups";

export default async function NewJobCardPage() {
  const lookups = await getJobCardFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Job Card" description="Create a new workshop job card." />
      <JobCardForm lookups={lookups} />
    </div>
  );
}

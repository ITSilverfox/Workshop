import { PageHeader } from "@/components/page-header";
import { HandoverForm } from "@/app/(app)/assignments/handover-form";
import { getAssignmentLookups } from "@/app/(app)/assignments/lookups";

export default async function NewHandoverPage() {
  const lookups = await getAssignmentLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add Handover"
        description="Record a vehicle handover and condition checklist."
      />
      <HandoverForm lookups={lookups} />
    </div>
  );
}

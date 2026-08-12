import { PageHeader } from "@/components/page-header";
import { AssignmentForm } from "@/app/(app)/assignments/assignment-form";
import { getAssignmentLookups } from "@/app/(app)/assignments/lookups";

export default async function NewAssignmentPage() {
  const lookups = await getAssignmentLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Assignment" description="Assign a vehicle to a driver." />
      <AssignmentForm lookups={lookups} />
    </div>
  );
}

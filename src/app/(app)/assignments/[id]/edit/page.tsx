import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { AssignmentForm } from "@/app/(app)/assignments/assignment-form";
import { getAssignmentLookups } from "@/app/(app)/assignments/lookups";

export default async function EditAssignmentPage(
  props: PageProps<"/assignments/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: assignment }, lookups] = await Promise.all([
    supabase.from("vehicle_assignments").select("*").eq("id", id).maybeSingle(),
    getAssignmentLookups(),
  ]);

  if (!assignment) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit Assignment" description="Update this vehicle assignment." />
      <AssignmentForm assignment={assignment} lookups={lookups} />
    </div>
  );
}

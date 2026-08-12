import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { HandoverForm } from "@/app/(app)/assignments/handover-form";
import { getAssignmentLookups } from "@/app/(app)/assignments/lookups";

export default async function EditHandoverPage(
  props: PageProps<"/assignments/handovers/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: handover }, lookups] = await Promise.all([
    supabase.from("vehicle_handovers").select("*").eq("id", id).maybeSingle(),
    getAssignmentLookups(),
  ]);

  if (!handover) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Handover"
        description="Update this vehicle handover checklist."
      />
      <HandoverForm handover={handover} lookups={lookups} />
    </div>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { AccidentReportForm } from "@/app/(app)/accidents/accident-report-form";
import { getAccidentReportFormLookups } from "@/app/(app)/accidents/lookups";

export default async function EditAccidentReportPage(
  props: PageProps<"/accidents/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: accidentReport }, lookups] = await Promise.all([
    supabase.from("accident_reports").select("*").eq("id", id).maybeSingle(),
    getAccidentReportFormLookups(),
  ]);

  if (!accidentReport) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Accident Report"
        description="Update this accident report's details."
      />
      <AccidentReportForm accidentReport={accidentReport} lookups={lookups} />
    </div>
  );
}

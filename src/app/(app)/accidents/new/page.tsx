import { PageHeader } from "@/components/page-header";
import { AccidentReportForm } from "@/app/(app)/accidents/accident-report-form";
import { getAccidentReportFormLookups } from "@/app/(app)/accidents/lookups";

export default async function NewAccidentReportPage() {
  const lookups = await getAccidentReportFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Accident Report" description="Record a new vehicle incident." />
      <AccidentReportForm lookups={lookups} />
    </div>
  );
}

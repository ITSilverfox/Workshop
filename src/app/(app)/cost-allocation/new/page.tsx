import { PageHeader } from "@/components/page-header";
import { PeriodForm } from "@/app/(app)/cost-allocation/period-form";

export default function NewPeriodPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add Period"
        description="Create a new cost allocation period."
      />
      <PeriodForm />
    </div>
  );
}

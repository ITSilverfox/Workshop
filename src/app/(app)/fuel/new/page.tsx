import { PageHeader } from "@/components/page-header";
import { FuelEntryForm } from "@/app/(app)/fuel/fuel-entry-form";
import { getFuelEntryFormLookups } from "@/app/(app)/fuel/lookups";

export default async function NewFuelEntryPage() {
  const lookups = await getFuelEntryFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Fuel Entry" description="Log a new fuel fill-up." />
      <FuelEntryForm lookups={lookups} />
    </div>
  );
}

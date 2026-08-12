import { PageHeader } from "@/components/page-header";
import { DriverForm } from "@/app/(app)/drivers/driver-form";
import { getDriverFormLookups } from "@/app/(app)/drivers/lookups";

export default async function NewDriverPage() {
  const lookups = await getDriverFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Driver" description="Register a new driver or staff user." />
      <DriverForm lookups={lookups} />
    </div>
  );
}

import { PageHeader } from "@/components/page-header";
import { VehicleForm } from "@/app/(app)/vehicles/vehicle-form";
import { getVehicleFormLookups } from "@/app/(app)/vehicles/lookups";

export default async function NewVehiclePage() {
  const lookups = await getVehicleFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Vehicle" description="Register a new vehicle in the fleet." />
      <VehicleForm lookups={lookups} />
    </div>
  );
}

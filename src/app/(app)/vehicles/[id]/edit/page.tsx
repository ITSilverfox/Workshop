import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { VehicleForm } from "@/app/(app)/vehicles/vehicle-form";
import { getVehicleFormLookups } from "@/app/(app)/vehicles/lookups";

export default async function EditVehiclePage(
  props: PageProps<"/vehicles/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: vehicle }, lookups] = await Promise.all([
    supabase.from("vehicles").select("*").eq("id", id).maybeSingle(),
    getVehicleFormLookups(),
  ]);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit ${vehicle.reg_number}`}
        description="Update this vehicle's details."
      />
      <VehicleForm vehicle={vehicle} lookups={lookups} />
    </div>
  );
}

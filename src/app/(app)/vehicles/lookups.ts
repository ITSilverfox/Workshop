import { createClient } from "@/lib/supabase/server";

export async function getVehicleFormLookups() {
  const supabase = await createClient();

  const [{ data: vehicleTypes }, { data: vehicleGroups }, { data: companies }, { data: drivers }] =
    await Promise.all([
      supabase.from("vehicle_types").select("*").order("name"),
      supabase.from("vehicle_groups").select("*").order("name"),
      supabase.from("companies").select("*").order("name"),
      supabase.from("drivers").select("*").order("first_name"),
    ]);

  return {
    vehicleTypes: vehicleTypes ?? [],
    vehicleGroups: vehicleGroups ?? [],
    companies: companies ?? [],
    drivers: drivers ?? [],
  };
}

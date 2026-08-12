import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export type VehicleAssignment = Tables<"vehicle_assignments">;
export type VehicleHandover = Tables<"vehicle_handovers">;

export async function getAssignmentLookups() {
  const supabase = await createClient();

  const [{ data: vehicles }, { data: drivers }] = await Promise.all([
    supabase.from("vehicles").select("id, reg_number").order("reg_number"),
    supabase.from("drivers").select("id, first_name, last_name").order("first_name"),
  ]);

  return {
    vehicles: vehicles ?? [],
    drivers: drivers ?? [],
  };
}

export type AssignmentLookups = Awaited<ReturnType<typeof getAssignmentLookups>>;

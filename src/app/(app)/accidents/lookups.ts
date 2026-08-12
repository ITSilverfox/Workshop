import { createClient } from "@/lib/supabase/server";

export async function getAccidentReportFormLookups() {
  const supabase = await createClient();

  const [{ data: vehicles }, { data: drivers }, { data: companies }] = await Promise.all([
    supabase.from("vehicles").select("id, reg_number").order("reg_number"),
    supabase.from("drivers").select("*").order("first_name"),
    supabase.from("companies").select("*").order("name"),
  ]);

  return {
    vehicles: vehicles ?? [],
    drivers: drivers ?? [],
    companies: companies ?? [],
  };
}

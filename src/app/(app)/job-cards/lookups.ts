import { createClient } from "@/lib/supabase/server";

export async function getJobCardFormLookups() {
  const supabase = await createClient();

  const [{ data: vehicles }, { data: companies }, { data: drivers }, { data: technicians }] =
    await Promise.all([
      supabase.from("vehicles").select("id, reg_number").order("reg_number"),
      supabase.from("companies").select("*").order("name"),
      supabase.from("drivers").select("*").order("first_name"),
      supabase.from("technicians").select("*").order("name"),
    ]);

  return {
    vehicles: vehicles ?? [],
    companies: companies ?? [],
    drivers: drivers ?? [],
    technicians: technicians ?? [],
  };
}

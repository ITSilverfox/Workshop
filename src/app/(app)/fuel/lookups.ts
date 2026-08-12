import { createClient } from "@/lib/supabase/server";

export async function getFuelEntryFormLookups() {
  const supabase = await createClient();

  const [{ data: vehicles }, { data: vendors }] = await Promise.all([
    supabase.from("vehicles").select("*").order("reg_number"),
    supabase.from("vendors").select("*").order("name"),
  ]);

  return {
    vehicles: vehicles ?? [],
    vendors: vendors ?? [],
  };
}

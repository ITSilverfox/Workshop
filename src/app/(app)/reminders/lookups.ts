import { createClient } from "@/lib/supabase/server";

export async function getReminderFormLookups() {
  const supabase = await createClient();

  const [{ data: vehicles }, { data: serviceTasks }] = await Promise.all([
    supabase.from("vehicles").select("*").order("reg_number"),
    supabase.from("service_tasks").select("*").order("name"),
  ]);

  return {
    vehicles: vehicles ?? [],
    serviceTasks: serviceTasks ?? [],
  };
}

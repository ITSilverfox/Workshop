import { createClient } from "@/lib/supabase/server";

export async function getExpenseFormLookups() {
  const supabase = await createClient();

  const [{ data: companies }, { data: vehicles }, { data: periods }] =
    await Promise.all([
      supabase.from("companies").select("*").order("name"),
      supabase.from("vehicles").select("id, reg_number").order("reg_number"),
      supabase
        .from("cost_allocation_periods")
        .select("*")
        .order("from_date", { ascending: false }),
    ]);

  return {
    companies: companies ?? [],
    vehicles: vehicles ?? [],
    periods: periods ?? [],
  };
}

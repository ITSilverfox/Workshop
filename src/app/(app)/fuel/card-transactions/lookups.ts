import { createClient } from "@/lib/supabase/server";

export async function getCardTransactionFormLookups() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase.from("vehicles").select("*").order("reg_number");

  return {
    vehicles: vehicles ?? [],
  };
}

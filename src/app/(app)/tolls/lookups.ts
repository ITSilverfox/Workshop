import { createClient } from "@/lib/supabase/server";

export async function getTollTransactionFormLookups() {
  const supabase = await createClient();

  const [{ data: vehicles }, { data: tollAccounts }, { data: companies }, { data: accounts }] =
    await Promise.all([
      supabase.from("vehicles").select("*").order("reg_number"),
      supabase.from("toll_accounts").select("*").order("account_name"),
      supabase.from("companies").select("*").order("name"),
      supabase.from("chart_of_accounts").select("*").order("account_name"),
    ]);

  return {
    vehicles: vehicles ?? [],
    tollAccounts: tollAccounts ?? [],
    companies: companies ?? [],
    accounts: accounts ?? [],
  };
}

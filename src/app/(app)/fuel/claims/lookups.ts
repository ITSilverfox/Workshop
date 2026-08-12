import { createClient } from "@/lib/supabase/server";

export async function getClaimLineFormLookups() {
  const supabase = await createClient();

  const [{ data: companies }, { data: drivers }, { data: accounts }] = await Promise.all([
    supabase.from("companies").select("*").order("name"),
    supabase.from("drivers").select("*").order("first_name"),
    supabase.from("chart_of_accounts").select("*").order("account_name"),
  ]);

  return {
    companies: companies ?? [],
    drivers: drivers ?? [],
    accounts: accounts ?? [],
  };
}

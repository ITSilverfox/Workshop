import { createClient } from "@/lib/supabase/server";

export async function getTransactionFormLookups() {
  const supabase = await createClient();

  const [{ data: items }, { data: jobCards }, { data: vendors }] = await Promise.all([
    supabase.from("items").select("id, name").order("name"),
    supabase.from("job_cards").select("*").order("job_card_no"),
    supabase.from("vendors").select("*").order("name"),
  ]);

  return {
    items: items ?? [],
    jobCards: jobCards ?? [],
    vendors: vendors ?? [],
  };
}

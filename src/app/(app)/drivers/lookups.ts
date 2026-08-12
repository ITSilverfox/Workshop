import { createClient } from "@/lib/supabase/server";

export async function getDriverFormLookups() {
  const supabase = await createClient();
  const { data: companies } = await supabase.from("companies").select("*").order("name");

  return {
    companies: companies ?? [],
  };
}

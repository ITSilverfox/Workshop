import { createClient } from "@/lib/supabase/server";

export async function getInvoiceFormLookups() {
  const supabase = await createClient();
  const { data: companies } = await supabase.from("companies").select("*").order("name");

  return {
    companies: companies ?? [],
  };
}

import { createClient } from "@/lib/supabase/server";

export async function getItemFormLookups() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("item_categories")
    .select("*")
    .order("name");

  return {
    categories: categories ?? [],
  };
}

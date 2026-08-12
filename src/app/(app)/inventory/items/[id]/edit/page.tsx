import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ItemForm } from "@/app/(app)/inventory/items/item-form";
import { getItemFormLookups } from "@/app/(app)/inventory/items/lookups";

export default async function EditItemPage(props: PageProps<"/inventory/items/[id]/edit">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: item }, lookups] = await Promise.all([
    supabase.from("items").select("*").eq("id", id).maybeSingle(),
    getItemFormLookups(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Edit ${item.name}`} description="Update this item's details." />
      <ItemForm item={item} lookups={lookups} />
    </div>
  );
}

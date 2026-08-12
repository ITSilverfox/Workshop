import { PageHeader } from "@/components/page-header";
import { ItemForm } from "@/app/(app)/inventory/items/item-form";
import { getItemFormLookups } from "@/app/(app)/inventory/items/lookups";

export default async function NewItemPage() {
  const lookups = await getItemFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add Item" description="Register a new inventory item." />
      <ItemForm lookups={lookups} />
    </div>
  );
}

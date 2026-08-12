import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { FuelEntryForm } from "@/app/(app)/fuel/fuel-entry-form";
import { getFuelEntryFormLookups } from "@/app/(app)/fuel/lookups";

export default async function EditFuelEntryPage(props: PageProps<"/fuel/[id]/edit">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: entry }, lookups] = await Promise.all([
    supabase.from("fuel_entries").select("*").eq("id", id).maybeSingle(),
    getFuelEntryFormLookups(),
  ]);

  if (!entry) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit Fuel Entry" description="Update this fuel entry's details." />
      <FuelEntryForm entry={entry} lookups={lookups} />
    </div>
  );
}

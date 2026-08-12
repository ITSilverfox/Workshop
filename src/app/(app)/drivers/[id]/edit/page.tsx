import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { DriverForm } from "@/app/(app)/drivers/driver-form";
import { getDriverFormLookups } from "@/app/(app)/drivers/lookups";

export default async function EditDriverPage(props: PageProps<"/drivers/[id]/edit">) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: driver }, lookups] = await Promise.all([
    supabase.from("drivers").select("*").eq("id", id).maybeSingle(),
    getDriverFormLookups(),
  ]);

  if (!driver) {
    notFound();
  }

  const fullName = [driver.first_name, driver.last_name].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Edit ${fullName}`} description="Update this driver's details." />
      <DriverForm driver={driver} lookups={lookups} />
    </div>
  );
}

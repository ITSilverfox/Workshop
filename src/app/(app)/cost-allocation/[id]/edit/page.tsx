import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { PeriodForm } from "@/app/(app)/cost-allocation/period-form";

export default async function EditPeriodPage(
  props: PageProps<"/cost-allocation/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: period } = await supabase
    .from("cost_allocation_periods")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!period) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Period"
        description="Update this cost allocation period."
      />
      <PeriodForm period={period} />
    </div>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ReminderForm } from "@/app/(app)/reminders/reminder-form";
import { getReminderFormLookups } from "@/app/(app)/reminders/lookups";

export default async function EditReminderPage(
  props: PageProps<"/reminders/[id]/edit">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: reminder }, lookups] = await Promise.all([
    supabase.from("reminders").select("*").eq("id", id).maybeSingle(),
    getReminderFormLookups(),
  ]);

  if (!reminder) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit Reminder" description="Update this reminder's details." />
      <ReminderForm reminder={reminder} lookups={lookups} />
    </div>
  );
}

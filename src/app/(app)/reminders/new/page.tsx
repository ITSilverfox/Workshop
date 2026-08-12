import { PageHeader } from "@/components/page-header";
import { ReminderForm } from "@/app/(app)/reminders/reminder-form";
import { getReminderFormLookups } from "@/app/(app)/reminders/lookups";

export default async function NewReminderPage() {
  const lookups = await getReminderFormLookups();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add Reminder"
        description="Schedule a new service or renewal reminder."
      />
      <ReminderForm lookups={lookups} />
    </div>
  );
}

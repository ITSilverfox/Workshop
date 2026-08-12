import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  deleteReminder,
  addReminderRecipient,
  removeReminderRecipient,
} from "@/app/(app)/reminders/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  pending: "default",
  sent: "secondary",
  dismissed: "outline",
};

function fmtDate(value: string | null | undefined) {
  return value ? format(new Date(value), "dd MMM yyyy") : "—";
}

function humanize(value: string | null | undefined) {
  return value ? value.replace(/_/g, " ") : null;
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? "—"}</span>
    </div>
  );
}

function driverName(driver: { first_name: string; last_name: string | null } | null) {
  return driver ? [driver.first_name, driver.last_name].filter(Boolean).join(" ") : "—";
}

export default async function ReminderDetailPage(
  props: PageProps<"/reminders/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: reminder } = await supabase
    .from("reminders")
    .select(
      "*, vehicle:vehicles(reg_number, vehicle_name), service_task:service_tasks(name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!reminder) {
    notFound();
  }

  const [{ data: recipients }, { data: allDrivers }] = await Promise.all([
    supabase
      .from("reminder_recipients")
      .select("driver_id, driver:drivers(id, first_name, last_name)")
      .eq("reminder_id", id),
    supabase.from("drivers").select("id, first_name, last_name").order("first_name"),
  ]);

  const recipientIds = new Set((recipients ?? []).map((r) => r.driver_id));
  const availableDrivers = (allDrivers ?? []).filter((d) => !recipientIds.has(d.id));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={reminder.vehicle?.reg_number ?? "Reminder"}
        description={
          humanize(reminder.renewal_type) ??
          reminder.service_task?.name ??
          reminder.reminder_for
        }
        actions={
          <>
            <Badge
              variant={STATUS_VARIANT[reminder.status] ?? "outline"}
              className="capitalize"
            >
              {reminder.status}
            </Badge>
            <Button variant="outline" asChild>
              <Link href={`/reminders/${reminder.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this reminder?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes this reminder and its recipients. This
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteReminder.bind(null, reminder.id)}>
                    <AlertDialogAction
                      type="submit"
                      variant="destructive"
                      className="w-full"
                    >
                      Delete
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Reminder Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Vehicle" value={reminder.vehicle?.reg_number} />
          <Detail label="Reminder for" value={reminder.reminder_for} />
          <Detail label="Renewal type" value={humanize(reminder.renewal_type)} />
          <Detail label="Service task" value={reminder.service_task?.name} />
          <Detail label="Due" value={fmtDate(reminder.reminder_at)} />
        </CardContent>
      </Card>

      {reminder.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{reminder.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Recipients</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {recipients && recipients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead className="w-0" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipients.map((recipient) => (
                  <TableRow key={recipient.driver_id}>
                    <TableCell>{driverName(recipient.driver)}</TableCell>
                    <TableCell>
                      <form
                        action={removeReminderRecipient.bind(
                          null,
                          reminder.id,
                          recipient.driver_id
                        )}
                      >
                        <Button type="submit" variant="ghost" size="icon-sm">
                          <X />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No recipients added yet.</p>
          )}

          {availableDrivers.length > 0 ? (
            <form
              action={addReminderRecipient.bind(null, reminder.id)}
              className="flex flex-wrap items-end gap-3"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="driver_id" className="text-sm font-medium">
                  Add recipient
                </label>
                <select
                  id="driver_id"
                  name="driver_id"
                  defaultValue=""
                  className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  <option value="" disabled>
                    Select a driver…
                  </option>
                  {availableDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driverName(driver)}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="outline">
                Add
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createReminder, updateReminder, type ReminderFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Reminder, Vehicle, Tables } from "@/lib/supabase/types";

type ServiceTask = Tables<"service_tasks">;

const REMINDER_FOR = ["service", "renewal"];
const RENEWAL_TYPES = ["emission_test", "inspection", "insurance", "registration"];
const STATUSES = ["pending", "sent", "dismissed"];

function toDateTimeInput(value: string | null | undefined) {
  return value ? value.slice(0, 16) : "";
}

function humanize(value: string) {
  return value.replace(/_/g, " ");
}

export function ReminderForm({
  reminder,
  lookups,
}: {
  reminder?: Reminder;
  lookups: { vehicles: Vehicle[]; serviceTasks: ServiceTask[] };
}) {
  const initialState: ReminderFormState = { error: null };
  const action = reminder ? updateReminder.bind(null, reminder.id) : createReminder;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Reminder Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="vehicle_id">Vehicle</FieldLabel>
            <Select name="vehicle_id" defaultValue={reminder?.vehicle_id ?? undefined}>
              <SelectTrigger id="vehicle_id" className="w-full">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {lookups.vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.reg_number}
                    {vehicle.vehicle_name ? ` — ${vehicle.vehicle_name}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="reminder_for">Reminder for</FieldLabel>
            <Select
              name="reminder_for"
              defaultValue={reminder?.reminder_for ?? undefined}
            >
              <SelectTrigger id="reminder_for" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {REMINDER_FOR.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select name="status" defaultValue={reminder?.status ?? "pending"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="renewal_type">Renewal type</FieldLabel>
            <Select
              name="renewal_type"
              defaultValue={reminder?.renewal_type ?? undefined}
            >
              <SelectTrigger id="renewal_type" className="w-full">
                <SelectValue placeholder="Not applicable" />
              </SelectTrigger>
              <SelectContent>
                {RENEWAL_TYPES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {humanize(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="service_task_id">Service task</FieldLabel>
            <Select
              name="service_task_id"
              defaultValue={reminder?.service_task_id ?? undefined}
            >
              <SelectTrigger id="service_task_id" className="w-full">
                <SelectValue placeholder="Not applicable" />
              </SelectTrigger>
              <SelectContent>
                {lookups.serviceTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="reminder_at">Due</FieldLabel>
            <Input
              id="reminder_at"
              name="reminder_at"
              type="datetime-local"
              defaultValue={toDateTimeInput(reminder?.reminder_at)}
              required
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Textarea
                name="notes"
                placeholder="Additional notes about this reminder…"
                defaultValue={reminder?.notes ?? ""}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={reminder ? `/reminders/${reminder.id}` : "/reminders"}>
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : reminder ? "Save changes" : "Create reminder"}
        </Button>
      </div>
    </form>
  );
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type ReminderFormState = { error: string | null };

function str(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseReminderPayload(formData: FormData): TablesInsert<"reminders"> {
  return {
    vehicle_id: String(formData.get("vehicle_id") ?? "").trim(),
    reminder_for: String(formData.get("reminder_for") ?? "").trim(),
    reminder_at: String(formData.get("reminder_at") ?? "").trim(),
    renewal_type: str(formData, "renewal_type"),
    service_task_id: str(formData, "service_task_id"),
    status: str(formData, "status") ?? "pending",
    notes: str(formData, "notes"),
  };
}

function validateReminderPayload(payload: TablesInsert<"reminders">) {
  if (!payload.vehicle_id) return "Vehicle is required.";
  if (!payload.reminder_for) return "Reminder type is required.";
  if (!payload.reminder_at) return "Due date is required.";
  return null;
}

export async function createReminder(
  _prevState: ReminderFormState,
  formData: FormData
): Promise<ReminderFormState> {
  const payload = parseReminderPayload(formData);
  const validationError = validateReminderPayload(payload);
  if (validationError) {
    return { error: validationError };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reminders")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/reminders");
  redirect(`/reminders/${data.id}`);
}

export async function updateReminder(
  id: string,
  _prevState: ReminderFormState,
  formData: FormData
): Promise<ReminderFormState> {
  const payload = parseReminderPayload(formData);
  const validationError = validateReminderPayload(payload);
  if (validationError) {
    return { error: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reminders").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/reminders");
  revalidatePath(`/reminders/${id}`);
  redirect(`/reminders/${id}`);
}

export async function deleteReminder(id: string) {
  const supabase = await createClient();
  await supabase.from("reminders").delete().eq("id", id);
  revalidatePath("/reminders");
  redirect("/reminders");
}

export async function addReminderRecipient(reminderId: string, formData: FormData) {
  const driverId = str(formData, "driver_id");
  if (driverId) {
    const supabase = await createClient();
    await supabase
      .from("reminder_recipients")
      .insert({ reminder_id: reminderId, driver_id: driverId });
  }
  revalidatePath(`/reminders/${reminderId}`);
}

export async function removeReminderRecipient(reminderId: string, driverId: string) {
  const supabase = await createClient();
  await supabase
    .from("reminder_recipients")
    .delete()
    .eq("reminder_id", reminderId)
    .eq("driver_id", driverId);
  revalidatePath(`/reminders/${reminderId}`);
}

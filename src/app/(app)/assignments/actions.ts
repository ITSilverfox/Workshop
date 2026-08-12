"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type AssignmentFormState = { error: string | null };
export type HandoverFormState = { error: string | null };

function str(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function num(formData: FormData, name: string) {
  const value = str(formData, name);
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function bool(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function parseAssignmentPayload(formData: FormData): TablesInsert<"vehicle_assignments"> {
  return {
    vehicle_id: String(formData.get("vehicle_id") ?? "").trim(),
    driver_id: String(formData.get("driver_id") ?? "").trim(),
    status: str(formData, "status") ?? "active",
    assigned_at: str(formData, "assigned_at") ?? new Date().toISOString().slice(0, 10),
    unassigned_at: str(formData, "unassigned_at"),
    assigned_by: str(formData, "assigned_by"),
    unassigned_by: str(formData, "unassigned_by"),
    reason: str(formData, "reason"),
    starting_odometer: num(formData, "starting_odometer"),
    ending_odometer: num(formData, "ending_odometer"),
    notes: str(formData, "notes"),
  };
}

export async function createAssignment(
  _prevState: AssignmentFormState,
  formData: FormData
): Promise<AssignmentFormState> {
  const payload = parseAssignmentPayload(formData);
  if (!payload.vehicle_id || !payload.driver_id) {
    return { error: "Vehicle and driver are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_assignments")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/assignments");
  redirect(`/assignments/${data.id}`);
}

export async function updateAssignment(
  id: string,
  _prevState: AssignmentFormState,
  formData: FormData
): Promise<AssignmentFormState> {
  const payload = parseAssignmentPayload(formData);
  if (!payload.vehicle_id || !payload.driver_id) {
    return { error: "Vehicle and driver are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("vehicle_assignments")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/assignments");
  revalidatePath(`/assignments/${id}`);
  redirect(`/assignments/${id}`);
}

export async function deleteAssignment(id: string) {
  const supabase = await createClient();
  await supabase.from("vehicle_assignments").delete().eq("id", id);
  revalidatePath("/assignments");
  redirect("/assignments");
}

function parseHandoverPayload(formData: FormData): TablesInsert<"vehicle_handovers"> {
  return {
    vehicle_id: String(formData.get("vehicle_id") ?? "").trim(),
    driver_id: str(formData, "driver_id"),
    status: str(formData, "status") ?? "pending",
    handover_date: str(formData, "handover_date") ?? new Date().toISOString().slice(0, 10),
    handed_over_to: str(formData, "handed_over_to"),
    checked_by: str(formData, "checked_by"),
    odometer_reading: num(formData, "odometer_reading"),
    front_condition: str(formData, "front_condition"),
    rear_condition: str(formData, "rear_condition"),
    left_condition: str(formData, "left_condition"),
    right_condition: str(formData, "right_condition"),
    tools_spares_ok: bool(formData, "tools_spares_ok"),
    keys_ok: bool(formData, "keys_ok"),
    registration_card_available: bool(formData, "registration_card_available"),
    other_issues: str(formData, "other_issues"),
    notes: str(formData, "notes"),
  };
}

export async function createHandover(
  _prevState: HandoverFormState,
  formData: FormData
): Promise<HandoverFormState> {
  const payload = parseHandoverPayload(formData);
  if (!payload.vehicle_id) {
    return { error: "Vehicle is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_handovers")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/assignments");
  redirect(`/assignments/handovers/${data.id}`);
}

export async function updateHandover(
  id: string,
  _prevState: HandoverFormState,
  formData: FormData
): Promise<HandoverFormState> {
  const payload = parseHandoverPayload(formData);
  if (!payload.vehicle_id) {
    return { error: "Vehicle is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("vehicle_handovers")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/assignments");
  revalidatePath(`/assignments/handovers/${id}`);
  redirect(`/assignments/handovers/${id}`);
}

export async function deleteHandover(id: string) {
  const supabase = await createClient();
  await supabase.from("vehicle_handovers").delete().eq("id", id);
  revalidatePath("/assignments");
  redirect("/assignments?tab=handovers");
}

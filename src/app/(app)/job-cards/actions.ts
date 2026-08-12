"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type JobCardFormState = { error: string | null };

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

function parseJobCardFields(
  formData: FormData
): Omit<TablesInsert<"job_cards">, "job_card_no"> {
  return {
    vehicle_id: str(formData, "vehicle_id"),
    company_id: str(formData, "company_id"),
    customer_name: str(formData, "customer_name"),
    is_internal: bool(formData, "is_internal"),
    type_of_service: String(formData.get("type_of_service") ?? "").trim(),
    service_type_km: str(formData, "service_type_km"),
    serial_number: str(formData, "serial_number"),
    under_warranty: bool(formData, "under_warranty"),
    status: str(formData, "status") ?? "pending",
    rta_status: str(formData, "rta_status"),
    rta_passing_type: str(formData, "rta_passing_type"),
    accounts_submitted: str(formData, "accounts_submitted") ?? "pending",
    cancellation_reason: str(formData, "cancellation_reason"),
    requested_by: str(formData, "requested_by"),
    driver_name_text: str(formData, "driver_name_text"),
    technician_received_id: str(formData, "technician_received_id"),
    technician_inspected_id: str(formData, "technician_inspected_id"),
    service_req_date:
      str(formData, "service_req_date") ?? new Date().toISOString().slice(0, 10),
    scheduled_date: str(formData, "scheduled_date"),
    due_date: str(formData, "due_date"),
    time_in: str(formData, "time_in"),
    time_out: str(formData, "time_out"),
    completed_at: str(formData, "completed_at"),
    current_reading_km: num(formData, "current_reading_km"),
    last_serviced_km: num(formData, "last_serviced_km"),
    next_service_km: num(formData, "next_service_km"),
    issue_description: str(formData, "issue_description"),
    action_taken: str(formData, "action_taken"),
    further_remarks: str(formData, "further_remarks"),
    invoice_number: str(formData, "invoice_number"),
    invoice_date: str(formData, "invoice_date"),
    labor_amount: num(formData, "labor_amount"),
    parts_amount: num(formData, "parts_amount"),
    tax_amount: num(formData, "tax_amount"),
    total_amount: num(formData, "total_amount"),
  };
}

export async function createJobCard(
  _prevState: JobCardFormState,
  formData: FormData
): Promise<JobCardFormState> {
  const fields = parseJobCardFields(formData);
  if (!fields.type_of_service) {
    return { error: "Type of service is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_cards")
    .insert({ ...fields, job_card_no: "" })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/job-cards");
  redirect(`/job-cards/${data.id}`);
}

export async function updateJobCard(
  id: string,
  _prevState: JobCardFormState,
  formData: FormData
): Promise<JobCardFormState> {
  const fields = parseJobCardFields(formData);
  if (!fields.type_of_service) {
    return { error: "Type of service is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("job_cards").update(fields).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/job-cards");
  revalidatePath(`/job-cards/${id}`);
  redirect(`/job-cards/${id}`);
}

export async function deleteJobCard(id: string) {
  const supabase = await createClient();
  await supabase.from("job_cards").delete().eq("id", id);
  revalidatePath("/job-cards");
  redirect("/job-cards");
}

export async function addJobCardItem(jobCardId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("job_card_items").insert({
    job_card_id: jobCardId,
    source_type: String(formData.get("source_type") ?? "in_stock").trim(),
    item_name: str(formData, "item_name"),
    quantity: num(formData, "quantity"),
    unit: str(formData, "unit"),
    rate: num(formData, "rate"),
    amount: num(formData, "amount"),
    notes: str(formData, "notes"),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/job-cards/${jobCardId}`);
}

export async function deleteJobCardItem(id: string, jobCardId: string) {
  const supabase = await createClient();
  await supabase.from("job_card_items").delete().eq("id", id);
  revalidatePath(`/job-cards/${jobCardId}`);
}

export async function addJobCardLabor(jobCardId: string, formData: FormData) {
  const supabase = await createClient();
  const workDate = str(formData, "work_date");
  const { error } = await supabase.from("job_card_labor").insert({
    job_card_id: jobCardId,
    technician_id: str(formData, "technician_id"),
    hours: num(formData, "hours"),
    amount: num(formData, "amount"),
    notes: str(formData, "notes"),
    ...(workDate ? { work_date: workDate } : {}),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/job-cards/${jobCardId}`);
}

export async function deleteJobCardLabor(id: string, jobCardId: string) {
  const supabase = await createClient();
  await supabase.from("job_card_labor").delete().eq("id", id);
  revalidatePath(`/job-cards/${jobCardId}`);
}

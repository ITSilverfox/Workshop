"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type AccidentReportFormState = { error: string | null };

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

function parseAccidentReportPayload(formData: FormData): TablesInsert<"accident_reports"> {
  return {
    vehicle_id: str(formData, "vehicle_id") ?? "",
    driver_id: str(formData, "driver_id"),
    company_id: str(formData, "company_id"),
    incident_type: str(formData, "incident_type") ?? "",
    occurred_at: str(formData, "occurred_at") ?? "",
    location: str(formData, "location") ?? "",
    description: str(formData, "description"),
    inspected_by: str(formData, "inspected_by"),
    police_report: bool(formData, "police_report"),
    police_report_type: str(formData, "police_report_type"),
    fine_details: str(formData, "fine_details"),
    total_fine: num(formData, "total_fine"),
    status: str(formData, "status") ?? "pending",
  };
}

export async function createAccidentReport(
  _prevState: AccidentReportFormState,
  formData: FormData
): Promise<AccidentReportFormState> {
  const payload = parseAccidentReportPayload(formData);
  if (!payload.vehicle_id) {
    return { error: "Vehicle is required." };
  }
  if (!payload.incident_type) {
    return { error: "Incident type is required." };
  }
  if (!payload.location) {
    return { error: "Location is required." };
  }
  if (!payload.occurred_at) {
    return { error: "Date/time of occurrence is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accident_reports")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/accidents");
  redirect(`/accidents/${data.id}`);
}

export async function updateAccidentReport(
  id: string,
  _prevState: AccidentReportFormState,
  formData: FormData
): Promise<AccidentReportFormState> {
  const payload = parseAccidentReportPayload(formData);
  if (!payload.vehicle_id) {
    return { error: "Vehicle is required." };
  }
  if (!payload.incident_type) {
    return { error: "Incident type is required." };
  }
  if (!payload.location) {
    return { error: "Location is required." };
  }
  if (!payload.occurred_at) {
    return { error: "Date/time of occurrence is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("accident_reports").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/accidents");
  revalidatePath(`/accidents/${id}`);
  redirect(`/accidents/${id}`);
}

export async function deleteAccidentReport(id: string) {
  const supabase = await createClient();
  await supabase.from("accident_reports").delete().eq("id", id);
  revalidatePath("/accidents");
  redirect("/accidents");
}

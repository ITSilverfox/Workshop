"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type VehicleFormState = { error: string | null };

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

function parseVehiclePayload(formData: FormData): TablesInsert<"vehicles"> {
  return {
    reg_number: String(formData.get("reg_number") ?? "").trim(),
    vehicle_name: str(formData, "vehicle_name"),
    vehicle_type_id: str(formData, "vehicle_type_id"),
    vehicle_group_id: str(formData, "vehicle_group_id"),
    color: str(formData, "color"),
    year_of_manufacture: num(formData, "year_of_manufacture"),
    chassis_number: str(formData, "chassis_number"),
    engine_number: str(formData, "engine_number"),
    capacity: num(formData, "capacity"),
    fuel_type: str(formData, "fuel_type"),
    odometer_unit: str(formData, "odometer_unit") ?? "kms",
    vehicle_status: str(formData, "vehicle_status") ?? "active",
    assignment_status: str(formData, "assignment_status") ?? "unassigned",
    current_driver_id: str(formData, "current_driver_id"),
    allocated_company_id: str(formData, "allocated_company_id"),
    owned_company_id: str(formData, "owned_company_id"),
    user_type: str(formData, "user_type"),
    sold_status: str(formData, "sold_status"),
    reg_expiry: str(formData, "reg_expiry"),
    adv_permit_no: str(formData, "adv_permit_no"),
    adv_permit_issue_date: str(formData, "adv_permit_issue_date"),
    adv_permit_expiry: str(formData, "adv_permit_expiry"),
    insurance_company: str(formData, "insurance_company"),
    insurance_policy_no: str(formData, "insurance_policy_no"),
    insurance_issue_date: str(formData, "insurance_issue_date"),
    insurance_expiry: str(formData, "insurance_expiry"),
    starting_odometer: num(formData, "starting_odometer"),
    last_updated_km: num(formData, "last_updated_km"),
    service_interval_km: num(formData, "service_interval_km"),
    next_service_km: num(formData, "next_service_km"),
    last_service_at: str(formData, "last_service_at"),
    purchase_date: str(formData, "purchase_date"),
    purchase_value: num(formData, "purchase_value"),
    net_book_value: num(formData, "net_book_value"),
    depreciation_pct: num(formData, "depreciation_pct"),
    batch_number: str(formData, "batch_number"),
    gps_required: bool(formData, "gps_required"),
    spare_keys_available: bool(formData, "spare_keys_available"),
    number_of_spare_keys: num(formData, "number_of_spare_keys"),
    salik_tag_number: str(formData, "salik_tag_number"),
    notes: str(formData, "notes"),
  };
}

export async function createVehicle(
  _prevState: VehicleFormState,
  formData: FormData
): Promise<VehicleFormState> {
  const payload = parseVehiclePayload(formData);
  if (!payload.reg_number) {
    return { error: "Registration number is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/vehicles");
  redirect(`/vehicles/${data.id}`);
}

export async function updateVehicle(
  id: string,
  _prevState: VehicleFormState,
  formData: FormData
): Promise<VehicleFormState> {
  const payload = parseVehiclePayload(formData);
  if (!payload.reg_number) {
    return { error: "Registration number is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${id}`);
  redirect(`/vehicles/${id}`);
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient();
  await supabase.from("vehicles").delete().eq("id", id);
  revalidatePath("/vehicles");
  redirect("/vehicles");
}

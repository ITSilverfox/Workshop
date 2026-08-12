"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type FuelEntryFormState = { error: string | null };

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

function parseFuelEntryPayload(formData: FormData) {
  return {
    vehicle_id: str(formData, "vehicle_id"),
    entry_date: str(formData, "entry_date"),
    odometer_km: num(formData, "odometer_km"),
    price_per_unit: num(formData, "price_per_unit"),
    litres: num(formData, "litres"),
    total_amount: num(formData, "total_amount"),
    vendor_id: str(formData, "vendor_id"),
    invoice_number: str(formData, "invoice_number"),
    partial_fill: bool(formData, "partial_fill"),
  };
}

function validateFuelEntry(parsed: ReturnType<typeof parseFuelEntryPayload>) {
  if (!parsed.vehicle_id) return "Vehicle is required.";
  if (parsed.odometer_km == null) return "Odometer reading is required.";
  if (parsed.price_per_unit == null) return "Price per unit is required.";
  return null;
}

export async function createFuelEntry(
  _prevState: FuelEntryFormState,
  formData: FormData
): Promise<FuelEntryFormState> {
  const parsed = parseFuelEntryPayload(formData);
  const validationError = validateFuelEntry(parsed);
  if (validationError) {
    return { error: validationError };
  }

  const payload: TablesInsert<"fuel_entries"> = {
    ...parsed,
    vehicle_id: parsed.vehicle_id,
    odometer_km: parsed.odometer_km,
    price_per_unit: parsed.price_per_unit,
    entry_date: parsed.entry_date ?? new Date().toISOString().slice(0, 10),
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fuel_entries")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/fuel");
  redirect(`/fuel/${data.id}`);
}

export async function updateFuelEntry(
  id: string,
  _prevState: FuelEntryFormState,
  formData: FormData
): Promise<FuelEntryFormState> {
  const parsed = parseFuelEntryPayload(formData);
  const validationError = validateFuelEntry(parsed);
  if (validationError) {
    return { error: validationError };
  }

  const payload: TablesInsert<"fuel_entries"> = {
    ...parsed,
    vehicle_id: parsed.vehicle_id,
    odometer_km: parsed.odometer_km,
    price_per_unit: parsed.price_per_unit,
    entry_date: parsed.entry_date ?? new Date().toISOString().slice(0, 10),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("fuel_entries").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/fuel");
  revalidatePath(`/fuel/${id}`);
  redirect(`/fuel/${id}`);
}

export async function deleteFuelEntry(id: string) {
  const supabase = await createClient();
  await supabase.from("fuel_entries").delete().eq("id", id);
  revalidatePath("/fuel");
  redirect("/fuel");
}

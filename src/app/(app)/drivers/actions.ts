"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type DriverFormState = { error: string | null };

function str(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseDriverPayload(formData: FormData): TablesInsert<"drivers"> {
  const addressLine = str(formData, "address_line");
  const addressCity = str(formData, "address_city");
  const addressCountry = str(formData, "address_country");
  const hasAddress = addressLine || addressCity || addressCountry;

  return {
    prefix: str(formData, "prefix"),
    first_name: String(formData.get("first_name") ?? "").trim(),
    last_name: str(formData, "last_name"),
    suffix: str(formData, "suffix"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    date_of_birth: str(formData, "date_of_birth"),
    emp_id: str(formData, "emp_id"),
    company_id: str(formData, "company_id"),
    category: str(formData, "category"),
    driving_type: str(formData, "driving_type"),
    user_status: str(formData, "user_status") ?? "active",
    user_type: str(formData, "user_type") ?? "driver",
    license_number: str(formData, "license_number"),
    license_class: str(formData, "license_class"),
    license_state: str(formData, "license_state"),
    notes: str(formData, "notes"),
    address: hasAddress
      ? {
          line: addressLine,
          city: addressCity,
          country: addressCountry,
        }
      : null,
  };
}

export async function createDriver(
  _prevState: DriverFormState,
  formData: FormData
): Promise<DriverFormState> {
  const payload = parseDriverPayload(formData);
  if (!payload.first_name) {
    return { error: "First name is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("drivers")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/drivers");
  redirect(`/drivers/${data.id}`);
}

export async function updateDriver(
  id: string,
  _prevState: DriverFormState,
  formData: FormData
): Promise<DriverFormState> {
  const payload = parseDriverPayload(formData);
  if (!payload.first_name) {
    return { error: "First name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("drivers").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/drivers");
  revalidatePath(`/drivers/${id}`);
  redirect(`/drivers/${id}`);
}

export async function deleteDriver(id: string) {
  const supabase = await createClient();
  await supabase.from("drivers").delete().eq("id", id);
  revalidatePath("/drivers");
  redirect("/drivers");
}

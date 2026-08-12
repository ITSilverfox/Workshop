"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type VendorFormState = { error: string | null };

function str(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseVendorPayload(formData: FormData): TablesInsert<"vendors"> {
  const addressLine = str(formData, "address_line");
  const addressCity = str(formData, "address_city");
  const addressCountry = str(formData, "address_country");
  const hasAddress = addressLine || addressCity || addressCountry;

  return {
    name: String(formData.get("name") ?? "").trim(),
    vendor_type: String(formData.get("vendor_type") ?? "").trim(),
    contact_person: str(formData, "contact_person"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    website: str(formData, "website"),
    address: hasAddress
      ? { line: addressLine, city: addressCity, country: addressCountry }
      : null,
  };
}

export async function createVendor(
  _prevState: VendorFormState,
  formData: FormData
): Promise<VendorFormState> {
  const payload = parseVendorPayload(formData);
  if (!payload.name) {
    return { error: "Name is required." };
  }
  if (!payload.vendor_type) {
    return { error: "Vendor type is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("vendors").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/vendors");
  redirect("/admin/vendors");
}

export async function updateVendor(
  id: string,
  _prevState: VendorFormState,
  formData: FormData
): Promise<VendorFormState> {
  const payload = parseVendorPayload(formData);
  if (!payload.name) {
    return { error: "Name is required." };
  }
  if (!payload.vendor_type) {
    return { error: "Vendor type is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("vendors").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/vendors");
  redirect("/admin/vendors");
}

export async function deleteVendor(id: string) {
  const supabase = await createClient();
  await supabase.from("vendors").delete().eq("id", id);
  revalidatePath("/admin/vendors");
  redirect("/admin/vendors");
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type TechnicianFormState = { error: string | null };

function str(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function bool(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function parseTechnicianPayload(formData: FormData): TablesInsert<"technicians"> {
  return {
    name: String(formData.get("name") ?? "").trim(),
    designation: str(formData, "designation"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    is_active: bool(formData, "is_active"),
  };
}

export async function createTechnician(
  _prevState: TechnicianFormState,
  formData: FormData
): Promise<TechnicianFormState> {
  const payload = parseTechnicianPayload(formData);
  if (!payload.name) {
    return { error: "Name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("technicians").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/technicians");
  redirect("/admin/technicians");
}

export async function updateTechnician(
  id: string,
  _prevState: TechnicianFormState,
  formData: FormData
): Promise<TechnicianFormState> {
  const payload = parseTechnicianPayload(formData);
  if (!payload.name) {
    return { error: "Name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("technicians").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/technicians");
  redirect("/admin/technicians");
}

export async function deleteTechnician(id: string) {
  const supabase = await createClient();
  await supabase.from("technicians").delete().eq("id", id);
  revalidatePath("/admin/technicians");
  redirect("/admin/technicians");
}

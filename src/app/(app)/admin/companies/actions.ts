"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type CompanyFormState = { error: string | null };

function str(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function bool(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function parseCompanyPayload(formData: FormData): TablesInsert<"companies"> {
  return {
    name: String(formData.get("name") ?? "").trim(),
    code: str(formData, "code"),
    is_active: bool(formData, "is_active"),
    notes: str(formData, "notes"),
  };
}

export async function createCompany(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const payload = parseCompanyPayload(formData);
  if (!payload.name) {
    return { error: "Name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("companies").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/companies");
  redirect("/admin/companies");
}

export async function updateCompany(
  id: string,
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const payload = parseCompanyPayload(formData);
  if (!payload.name) {
    return { error: "Name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("companies").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/companies");
  redirect("/admin/companies");
}

export async function deleteCompany(id: string) {
  const supabase = await createClient();
  await supabase.from("companies").delete().eq("id", id);
  revalidatePath("/admin/companies");
  redirect("/admin/companies");
}

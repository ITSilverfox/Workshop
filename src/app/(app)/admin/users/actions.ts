"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/types";

export type AppUserFormState = { error: string | null };

function str(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function bool(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function parseAppUserPayload(formData: FormData): TablesUpdate<"app_users"> {
  return {
    full_name: str(formData, "full_name"),
    role: String(formData.get("role") ?? "").trim(),
    is_active: bool(formData, "is_active"),
    driver_id: str(formData, "driver_id"),
  };
}

export async function updateAppUser(
  id: string,
  _prevState: AppUserFormState,
  formData: FormData
): Promise<AppUserFormState> {
  const payload = parseAppUserPayload(formData);
  if (!payload.role) {
    return { error: "Role is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("app_users")
    .update(payload)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }
  if (!data) {
    return {
      error: "Update was not applied. You may not have permission to edit this user.",
    };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

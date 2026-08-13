"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type AccountFormState = { error: string | null };

function str(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function bool(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function parseAccountPayload(formData: FormData): TablesInsert<"chart_of_accounts"> {
  return {
    account_code: str(formData, "account_code"),
    account_name: String(formData.get("account_name") ?? "").trim(),
    account_type: str(formData, "account_type"),
    parent_account: str(formData, "parent_account"),
    is_admin_expense: bool(formData, "is_admin_expense"),
  };
}

export async function createAccount(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const payload = parseAccountPayload(formData);
  if (!payload.account_name) {
    return { error: "Account name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("chart_of_accounts").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

export async function updateAccount(
  id: string,
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const payload = parseAccountPayload(formData);
  if (!payload.account_name) {
    return { error: "Account name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("chart_of_accounts")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();
  await supabase.from("chart_of_accounts").delete().eq("id", id);
  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

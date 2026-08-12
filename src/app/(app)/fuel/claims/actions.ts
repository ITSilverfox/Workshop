"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type ClaimFormState = { error: string | null };

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

function parseClaimPayload(formData: FormData): TablesInsert<"fuel_expense_claims"> {
  return {
    claim_date: str(formData, "claim_date") ?? new Date().toISOString().slice(0, 10),
    vendor_name: str(formData, "vendor_name"),
    ref_no: str(formData, "ref_no"),
    status: str(formData, "status") ?? "pending_with_hr",
    journal_entry_number: str(formData, "journal_entry_number"),
    journal_id: str(formData, "journal_id"),
    books_jv_link: str(formData, "books_jv_link"),
  };
}

export async function createClaim(
  _prevState: ClaimFormState,
  formData: FormData
): Promise<ClaimFormState> {
  const payload = parseClaimPayload(formData);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fuel_expense_claims")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/fuel/claims");
  redirect(`/fuel/claims/${data.id}`);
}

export async function updateClaim(
  id: string,
  _prevState: ClaimFormState,
  formData: FormData
): Promise<ClaimFormState> {
  const payload = parseClaimPayload(formData);

  const supabase = await createClient();
  const { error } = await supabase.from("fuel_expense_claims").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/fuel/claims");
  revalidatePath(`/fuel/claims/${id}`);
  redirect(`/fuel/claims/${id}`);
}

export async function deleteClaim(id: string) {
  const supabase = await createClient();
  await supabase.from("fuel_expense_claims").delete().eq("id", id);
  revalidatePath("/fuel/claims");
  redirect("/fuel/claims");
}

export async function addClaimLine(claimId: string, formData: FormData) {
  const payload: TablesInsert<"fuel_expense_claim_lines"> = {
    claim_id: claimId,
    plate_number_text: str(formData, "plate_number_text"),
    driver_id: str(formData, "driver_id"),
    company_id: str(formData, "company_id"),
    fuel_type: str(formData, "fuel_type"),
    unit_price: num(formData, "unit_price"),
    amount_excl_vat: num(formData, "amount_excl_vat"),
    vat_amount: num(formData, "vat_amount"),
    total_amount: num(formData, "total_amount"),
    account_id: str(formData, "account_id"),
    notes: str(formData, "notes"),
  };

  const supabase = await createClient();
  await supabase.from("fuel_expense_claim_lines").insert(payload);
  revalidatePath(`/fuel/claims/${claimId}`);
}

export async function deleteClaimLine(claimId: string, lineId: string) {
  const supabase = await createClient();
  await supabase.from("fuel_expense_claim_lines").delete().eq("id", lineId);
  revalidatePath(`/fuel/claims/${claimId}`);
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type TollTransactionFormState = { error: string | null };

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

function datetime(formData: FormData, name: string) {
  const value = str(formData, name);
  if (value === null) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function parseTollTransactionPayload(formData: FormData) {
  return {
    vehicle_id: str(formData, "vehicle_id"),
    toll_account_id: str(formData, "toll_account_id"),
    occurred_at: datetime(formData, "occurred_at"),
    amount: num(formData, "amount"),
    transaction_type: str(formData, "transaction_type"),
    source: str(formData, "source") ?? "salik",
    owned_company_id: str(formData, "owned_company_id"),
    allocated_company_id: str(formData, "allocated_company_id"),
    account_id: str(formData, "account_id"),
    reference_no: str(formData, "reference_no"),
  };
}

function validateTollTransaction(parsed: ReturnType<typeof parseTollTransactionPayload>) {
  if (parsed.amount == null) return "Amount is required.";
  if (parsed.occurred_at == null) return "Transaction date & time is required.";
  if (!parsed.transaction_type) return "Transaction type is required.";
  return null;
}

export async function createTollTransaction(
  _prevState: TollTransactionFormState,
  formData: FormData
): Promise<TollTransactionFormState> {
  const parsed = parseTollTransactionPayload(formData);
  const validationError = validateTollTransaction(parsed);
  if (validationError) {
    return { error: validationError };
  }

  const payload: TablesInsert<"toll_transactions"> = {
    ...parsed,
    amount: parsed.amount!,
    occurred_at: parsed.occurred_at!,
    transaction_type: parsed.transaction_type!,
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("toll_transactions")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tolls");
  redirect(`/tolls/${data.id}`);
}

export async function updateTollTransaction(
  id: string,
  _prevState: TollTransactionFormState,
  formData: FormData
): Promise<TollTransactionFormState> {
  const parsed = parseTollTransactionPayload(formData);
  const validationError = validateTollTransaction(parsed);
  if (validationError) {
    return { error: validationError };
  }

  const payload: TablesInsert<"toll_transactions"> = {
    ...parsed,
    amount: parsed.amount!,
    occurred_at: parsed.occurred_at!,
    transaction_type: parsed.transaction_type!,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("toll_transactions").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tolls");
  revalidatePath(`/tolls/${id}`);
  redirect(`/tolls/${id}`);
}

export async function deleteTollTransaction(id: string) {
  const supabase = await createClient();
  await supabase.from("toll_transactions").delete().eq("id", id);
  revalidatePath("/tolls");
  redirect("/tolls");
}

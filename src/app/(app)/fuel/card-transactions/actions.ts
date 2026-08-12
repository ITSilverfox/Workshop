"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type CardTransactionFormState = { error: string | null };

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

function parseCardTransactionPayload(formData: FormData) {
  return {
    vehicle_id: str(formData, "vehicle_id"),
    transacted_at: datetime(formData, "transacted_at"),
    amount: num(formData, "amount"),
    litres: num(formData, "litres"),
    source: str(formData, "source") ?? "cafu",
    bill_reference: str(formData, "bill_reference"),
    notes: str(formData, "notes"),
  };
}

function validateCardTransaction(parsed: ReturnType<typeof parseCardTransactionPayload>) {
  if (parsed.amount == null) return "Amount is required.";
  if (parsed.transacted_at == null) return "Transaction date & time is required.";
  return null;
}

export async function createCardTransaction(
  _prevState: CardTransactionFormState,
  formData: FormData
): Promise<CardTransactionFormState> {
  const parsed = parseCardTransactionPayload(formData);
  const validationError = validateCardTransaction(parsed);
  if (validationError) {
    return { error: validationError };
  }

  const payload: TablesInsert<"fuel_card_transactions"> = {
    ...parsed,
    amount: parsed.amount,
    transacted_at: parsed.transacted_at,
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fuel_card_transactions")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/fuel/card-transactions");
  redirect(`/fuel/card-transactions/${data.id}`);
}

export async function updateCardTransaction(
  id: string,
  _prevState: CardTransactionFormState,
  formData: FormData
): Promise<CardTransactionFormState> {
  const parsed = parseCardTransactionPayload(formData);
  const validationError = validateCardTransaction(parsed);
  if (validationError) {
    return { error: validationError };
  }

  const payload: TablesInsert<"fuel_card_transactions"> = {
    ...parsed,
    amount: parsed.amount,
    transacted_at: parsed.transacted_at,
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("fuel_card_transactions")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/fuel/card-transactions");
  revalidatePath(`/fuel/card-transactions/${id}`);
  redirect(`/fuel/card-transactions/${id}`);
}

export async function deleteCardTransaction(id: string) {
  const supabase = await createClient();
  await supabase.from("fuel_card_transactions").delete().eq("id", id);
  revalidatePath("/fuel/card-transactions");
  redirect("/fuel/card-transactions");
}

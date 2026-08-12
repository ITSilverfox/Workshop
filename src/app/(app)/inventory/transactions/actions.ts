"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type TransactionFormState = { error: string | null };

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

function parseTransactionPayload(formData: FormData) {
  return {
    item_id: String(formData.get("item_id") ?? "").trim(),
    transaction_type: String(formData.get("transaction_type") ?? "").trim(),
    quantity: num(formData, "quantity"),
    rate: num(formData, "rate"),
    amount: num(formData, "amount"),
    job_card_id: str(formData, "job_card_id"),
    vendor_id: str(formData, "vendor_id"),
    reference_no: str(formData, "reference_no"),
    transaction_date: str(formData, "transaction_date"),
    notes: str(formData, "notes"),
  };
}

function buildPayload(
  parsed: ReturnType<typeof parseTransactionPayload>
): { error: string } | { error: null; payload: TablesInsert<"inventory_transactions"> } {
  if (!parsed.item_id) {
    return { error: "Item is required." };
  }
  if (!parsed.transaction_type) {
    return { error: "Transaction type is required." };
  }
  const quantity = parsed.quantity;
  if (quantity === null) {
    return { error: "Quantity is required." };
  }

  return {
    error: null,
    payload: {
      ...parsed,
      quantity,
      transaction_date: parsed.transaction_date ?? new Date().toISOString().slice(0, 10),
    },
  };
}

export async function createTransaction(
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const built = buildPayload(parseTransactionPayload(formData));
  if (built.error !== null) {
    return { error: built.error };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory_transactions")
    .insert(built.payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inventory/transactions");
  redirect(`/inventory/transactions/${data.id}`);
}

export async function updateTransaction(
  id: string,
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const built = buildPayload(parseTransactionPayload(formData));
  if (built.error !== null) {
    return { error: built.error };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("inventory_transactions")
    .update(built.payload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inventory/transactions");
  revalidatePath(`/inventory/transactions/${id}`);
  redirect(`/inventory/transactions/${id}`);
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  await supabase.from("inventory_transactions").delete().eq("id", id);
  revalidatePath("/inventory/transactions");
  redirect("/inventory/transactions");
}

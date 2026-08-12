"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type ExpenseFormState = { error: string | null };

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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseExpensePayload(
  formData: FormData
): TablesInsert<"vehicle_expense_ledger"> {
  return {
    entry_date: str(formData, "entry_date") ?? todayIso(),
    category: str(formData, "category") ?? "",
    amount: num(formData, "amount") ?? 0,
    quantity: num(formData, "quantity"),
    company_id: str(formData, "company_id") ?? "",
    vehicle_id: str(formData, "vehicle_id"),
    period_id: str(formData, "period_id"),
    notes: str(formData, "notes"),
  };
}

export async function createExpense(
  _prevState: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  const payload = parseExpensePayload(formData);
  if (!payload.category) {
    return { error: "Category is required." };
  }
  if (!payload.company_id) {
    return { error: "Company is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_expense_ledger")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/expenses");
  redirect(`/expenses/${data.id}`);
}

export async function updateExpense(
  id: string,
  _prevState: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  const payload = parseExpensePayload(formData);
  if (!payload.category) {
    return { error: "Category is required." };
  }
  if (!payload.company_id) {
    return { error: "Company is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("vehicle_expense_ledger")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/expenses");
  revalidatePath(`/expenses/${id}`);
  redirect(`/expenses/${id}`);
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  await supabase.from("vehicle_expense_ledger").delete().eq("id", id);
  revalidatePath("/expenses");
  redirect("/expenses");
}

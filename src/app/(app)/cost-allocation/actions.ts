"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type PeriodFormState = { error: string | null };
export type InvoiceFormState = { error: string | null };

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

function parsePeriodPayload(
  formData: FormData
): TablesInsert<"cost_allocation_periods"> {
  return {
    from_date: str(formData, "from_date") ?? "",
    to_date: str(formData, "to_date") ?? "",
    status: str(formData, "status") ?? "draft",
  };
}

export async function createPeriod(
  _prevState: PeriodFormState,
  formData: FormData
): Promise<PeriodFormState> {
  const payload = parsePeriodPayload(formData);
  if (!payload.from_date || !payload.to_date) {
    return { error: "From and to dates are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("cost_allocation_periods")
    .insert({ ...payload, created_by: user?.id ?? null })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cost-allocation");
  redirect(`/cost-allocation/${data.id}`);
}

export async function updatePeriod(
  id: string,
  _prevState: PeriodFormState,
  formData: FormData
): Promise<PeriodFormState> {
  const payload = parsePeriodPayload(formData);
  if (!payload.from_date || !payload.to_date) {
    return { error: "From and to dates are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("cost_allocation_periods")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cost-allocation");
  revalidatePath(`/cost-allocation/${id}`);
  redirect(`/cost-allocation/${id}`);
}

export async function deletePeriod(id: string) {
  const supabase = await createClient();
  await supabase.from("cost_allocation_periods").delete().eq("id", id);
  revalidatePath("/cost-allocation");
  redirect("/cost-allocation");
}

function parseInvoicePayload(
  formData: FormData
): TablesInsert<"cost_allocation_invoices"> {
  return {
    period_id: str(formData, "period_id") ?? "",
    company_id: str(formData, "company_id") ?? "",
    invoice_number: str(formData, "invoice_number"),
    invoice_value: num(formData, "invoice_value"),
    ho_cost: num(formData, "ho_cost"),
    total_cost: num(formData, "total_cost"),
  };
}

export async function createInvoice(
  _prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const payload = parseInvoicePayload(formData);
  if (!payload.period_id) {
    return { error: "Period is required." };
  }
  if (!payload.company_id) {
    return { error: "Company is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("cost_allocation_invoices").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/cost-allocation/${payload.period_id}`);
  redirect(`/cost-allocation/${payload.period_id}`);
}

export async function updateInvoice(
  id: string,
  _prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const payload = parseInvoicePayload(formData);
  if (!payload.period_id) {
    return { error: "Period is required." };
  }
  if (!payload.company_id) {
    return { error: "Company is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("cost_allocation_invoices")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/cost-allocation/${payload.period_id}`);
  redirect(`/cost-allocation/${payload.period_id}`);
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cost_allocation_invoices")
    .delete()
    .eq("id", id)
    .select("period_id")
    .single();

  if (data?.period_id) {
    revalidatePath(`/cost-allocation/${data.period_id}`);
    redirect(`/cost-allocation/${data.period_id}`);
  }

  revalidatePath("/cost-allocation");
  redirect("/cost-allocation");
}

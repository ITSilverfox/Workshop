"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

export type ItemFormState = { error: string | null };
export type CategoryFormState = { error: string | null };

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

function parseItemPayload(formData: FormData): TablesInsert<"items"> {
  return {
    name: String(formData.get("name") ?? "").trim(),
    item_code: str(formData, "item_code"),
    part_number: str(formData, "part_number"),
    category_id: str(formData, "category_id"),
    unit: str(formData, "unit") ?? "pcs",
    rate: num(formData, "rate") ?? 0,
    status: str(formData, "status") ?? "active",
  };
}

export async function createItem(
  _prevState: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  const payload = parseItemPayload(formData);
  if (!payload.name) {
    return { error: "Item name is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inventory/items");
  redirect(`/inventory/items/${data.id}`);
}

export async function updateItem(
  id: string,
  _prevState: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  const payload = parseItemPayload(formData);
  if (!payload.name) {
    return { error: "Item name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("items").update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inventory/items");
  revalidatePath(`/inventory/items/${id}`);
  redirect(`/inventory/items/${id}`);
}

export async function deleteItem(id: string) {
  const supabase = await createClient();
  await supabase.from("items").delete().eq("id", id);
  revalidatePath("/inventory/items");
  redirect("/inventory/items");
}

function parseCategoryPayload(formData: FormData): TablesInsert<"item_categories"> {
  return {
    name: String(formData.get("name") ?? "").trim(),
    purchase_type: str(formData, "purchase_type"),
  };
}

export async function createItemCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const payload = parseCategoryPayload(formData);
  if (!payload.name) {
    return { error: "Category name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("item_categories").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inventory/items");
  return { error: null };
}

export async function updateItemCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const payload = parseCategoryPayload(formData);
  if (!payload.name) {
    return { error: "Category name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("item_categories")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inventory/items");
  return { error: null };
}

export async function deleteItemCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("item_categories").delete().eq("id", id);
  revalidatePath("/inventory/items");
}

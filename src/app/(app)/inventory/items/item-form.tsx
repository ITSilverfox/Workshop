"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createItem, updateItem, type ItemFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/lib/supabase/types";

type Item = Tables<"items">;
type ItemCategory = Tables<"item_categories">;

const UNITS = ["pcs", "liter", "meter", "ltr"];
const STATUSES = ["active", "inactive"];

export function ItemForm({
  item,
  lookups,
}: {
  item?: Item;
  lookups: { categories: ItemCategory[] };
}) {
  const initialState: ItemFormState = { error: null };
  const action = item ? updateItem.bind(null, item.id) : createItem;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" name="name" defaultValue={item?.name ?? ""} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="item_code">Item code</FieldLabel>
            <Input id="item_code" name="item_code" defaultValue={item?.item_code ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="part_number">Part number</FieldLabel>
            <Input
              id="part_number"
              name="part_number"
              defaultValue={item?.part_number ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="category_id">Category</FieldLabel>
            <Select name="category_id" defaultValue={item?.category_id ?? undefined}>
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {lookups.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="unit">Unit</FieldLabel>
            <Select name="unit" defaultValue={item?.unit ?? "pcs"}>
              <SelectTrigger id="unit" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="rate">Rate</FieldLabel>
            <Input
              id="rate"
              name="rate"
              type="number"
              step="0.01"
              defaultValue={item?.rate ?? 0}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select name="status" defaultValue={item?.status ?? "active"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={item ? `/inventory/items/${item.id}` : "/inventory/items"}>
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : item ? "Save changes" : "Create item"}
        </Button>
      </div>
    </form>
  );
}

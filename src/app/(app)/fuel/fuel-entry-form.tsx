"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createFuelEntry, updateFuelEntry, type FuelEntryFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

type FuelEntry = Tables<"fuel_entries">;
type Vehicle = Tables<"vehicles">;
type Vendor = Tables<"vendors">;

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

export function FuelEntryForm({
  entry,
  lookups,
}: {
  entry?: FuelEntry;
  lookups: { vehicles: Vehicle[]; vendors: Vendor[] };
}) {
  const initialState: FuelEntryFormState = { error: null };
  const action = entry ? updateFuelEntry.bind(null, entry.id) : createFuelEntry;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Entry Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="vehicle_id">Vehicle</FieldLabel>
            <Select name="vehicle_id" defaultValue={entry?.vehicle_id ?? undefined}>
              <SelectTrigger id="vehicle_id" className="w-full">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {lookups.vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicle_name
                      ? `${vehicle.reg_number} — ${vehicle.vehicle_name}`
                      : vehicle.reg_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="entry_date">Entry date</FieldLabel>
            <Input
              id="entry_date"
              name="entry_date"
              type="date"
              defaultValue={toDateInput(entry?.entry_date) || todayInput()}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="odometer_km">Odometer (km)</FieldLabel>
            <Input
              id="odometer_km"
              name="odometer_km"
              type="number"
              defaultValue={entry?.odometer_km ?? ""}
              required
            />
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="partial_fill"
              name="partial_fill"
              defaultChecked={entry?.partial_fill ?? false}
            />
            <FieldLabel htmlFor="partial_fill">Partial fill</FieldLabel>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fuel &amp; Cost</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="price_per_unit">Price per unit</FieldLabel>
            <Input
              id="price_per_unit"
              name="price_per_unit"
              type="number"
              step="0.01"
              defaultValue={entry?.price_per_unit ?? ""}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="litres">Litres</FieldLabel>
            <Input
              id="litres"
              name="litres"
              type="number"
              step="0.01"
              defaultValue={entry?.litres ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="total_amount">Total amount</FieldLabel>
            <Input
              id="total_amount"
              name="total_amount"
              type="number"
              step="0.01"
              defaultValue={entry?.total_amount ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="vendor_id">Vendor</FieldLabel>
            <Select name="vendor_id" defaultValue={entry?.vendor_id ?? undefined}>
              <SelectTrigger id="vendor_id" className="w-full">
                <SelectValue placeholder="No vendor" />
              </SelectTrigger>
              <SelectContent>
                {lookups.vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="invoice_number">Invoice number</FieldLabel>
            <Input
              id="invoice_number"
              name="invoice_number"
              defaultValue={entry?.invoice_number ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={entry ? `/fuel/${entry.id}` : "/fuel"}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : entry ? "Save changes" : "Create fuel entry"}
        </Button>
      </div>
    </form>
  );
}

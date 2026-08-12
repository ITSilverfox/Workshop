"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createExpense, updateExpense, type ExpenseFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/lib/supabase/types";

type Expense = Tables<"vehicle_expense_ledger">;
type Company = Tables<"companies">;
type Period = Tables<"cost_allocation_periods">;
type VehicleOption = Pick<Tables<"vehicles">, "id" | "reg_number">;

const CATEGORIES = [
  "fuel",
  "admin",
  "repair",
  "registration",
  "salary",
  "revenue",
  "headcount",
];

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

function periodLabel(period: Period) {
  return `${toDateInput(period.from_date)} – ${toDateInput(period.to_date)}`;
}

export function ExpenseForm({
  expense,
  lookups,
}: {
  expense?: Expense;
  lookups: {
    companies: Company[];
    vehicles: VehicleOption[];
    periods: Period[];
  };
}) {
  const initialState: ExpenseFormState = { error: null };
  const action = expense ? updateExpense.bind(null, expense.id) : createExpense;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Expense</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="entry_date">Entry date</FieldLabel>
            <Input
              id="entry_date"
              name="entry_date"
              type="date"
              defaultValue={toDateInput(expense?.entry_date) || todayInput()}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select name="category" defaultValue={expense?.category ?? undefined}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={expense?.amount ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.01"
              defaultValue={expense?.quantity ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allocation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="company_id">Company</FieldLabel>
            <Select
              name="company_id"
              defaultValue={expense?.company_id ?? undefined}
            >
              <SelectTrigger id="company_id" className="w-full">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {lookups.companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="vehicle_id">Vehicle</FieldLabel>
            <Select name="vehicle_id" defaultValue={expense?.vehicle_id ?? undefined}>
              <SelectTrigger id="vehicle_id" className="w-full">
                <SelectValue placeholder="Not vehicle-specific" />
              </SelectTrigger>
              <SelectContent>
                {lookups.vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.reg_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="period_id">Cost allocation period</FieldLabel>
            <Select name="period_id" defaultValue={expense?.period_id ?? undefined}>
              <SelectTrigger id="period_id" className="w-full">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                {lookups.periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {periodLabel(period)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Textarea
                name="notes"
                placeholder="Additional notes about this expense…"
                defaultValue={expense?.notes ?? ""}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={expense ? `/expenses/${expense.id}` : "/expenses"}>
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : expense ? "Save changes" : "Create expense"}
        </Button>
      </div>
    </form>
  );
}

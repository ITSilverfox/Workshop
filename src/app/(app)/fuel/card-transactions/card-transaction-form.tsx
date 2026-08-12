"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createCardTransaction,
  updateCardTransaction,
  type CardTransactionFormState,
} from "./actions";
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

type CardTransaction = Tables<"fuel_card_transactions">;
type Vehicle = Tables<"vehicles">;

function toDateTimeInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function CardTransactionForm({
  transaction,
  lookups,
}: {
  transaction?: CardTransaction;
  lookups: { vehicles: Vehicle[] };
}) {
  const initialState: CardTransactionFormState = { error: null };
  const action = transaction
    ? updateCardTransaction.bind(null, transaction.id)
    : createCardTransaction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="vehicle_id">Vehicle</FieldLabel>
            <Select name="vehicle_id" defaultValue={transaction?.vehicle_id ?? undefined}>
              <SelectTrigger id="vehicle_id" className="w-full">
                <SelectValue placeholder="Unmatched" />
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
            <FieldLabel htmlFor="transacted_at">Transaction date &amp; time</FieldLabel>
            <Input
              id="transacted_at"
              name="transacted_at"
              type="datetime-local"
              defaultValue={
                toDateTimeInput(transaction?.transacted_at) || toDateTimeInput(new Date().toISOString())
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="source">Source</FieldLabel>
            <Input id="source" name="source" defaultValue={transaction?.source ?? "cafu"} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amount</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={transaction?.amount ?? ""}
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
              defaultValue={transaction?.litres ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="bill_reference">Bill reference</FieldLabel>
            <Input
              id="bill_reference"
              name="bill_reference"
              defaultValue={transaction?.bill_reference ?? ""}
            />
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
                placeholder="Additional notes about this transaction…"
                defaultValue={transaction?.notes ?? ""}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={transaction ? `/fuel/card-transactions/${transaction.id}` : "/fuel/card-transactions"}>
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : transaction ? "Save changes" : "Create transaction"}
        </Button>
      </div>
    </form>
  );
}

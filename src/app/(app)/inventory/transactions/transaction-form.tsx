"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createTransaction,
  updateTransaction,
  type TransactionFormState,
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

type InventoryTransaction = Tables<"inventory_transactions">;
type JobCard = Tables<"job_cards">;
type Vendor = Tables<"vendors">;

const TRANSACTION_TYPES = [
  "purchase_external",
  "purchase_internal",
  "inter_company",
  "issue_to_job_card",
  "adjustment_in",
  "adjustment_out",
];

function label(value: string) {
  return value.replace(/_/g, " ");
}

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

export function TransactionForm({
  transaction,
  lookups,
}: {
  transaction?: InventoryTransaction;
  lookups: { items: Pick<Tables<"items">, "id" | "name">[]; jobCards: JobCard[]; vendors: Vendor[] };
}) {
  const initialState: TransactionFormState = { error: null };
  const action = transaction
    ? updateTransaction.bind(null, transaction.id)
    : createTransaction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="item_id">Item</FieldLabel>
            <Select name="item_id" defaultValue={transaction?.item_id ?? undefined}>
              <SelectTrigger id="item_id" className="w-full">
                <SelectValue placeholder="Select an item" />
              </SelectTrigger>
              <SelectContent>
                {lookups.items.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="transaction_type">Transaction type</FieldLabel>
            <Select
              name="transaction_type"
              defaultValue={transaction?.transaction_type ?? undefined}
            >
              <SelectTrigger id="transaction_type" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_TYPES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="transaction_date">Transaction date</FieldLabel>
            <Input
              id="transaction_date"
              name="transaction_date"
              type="date"
              defaultValue={
                transaction
                  ? toDateInput(transaction.transaction_date)
                  : new Date().toISOString().slice(0, 10)
              }
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.01"
              defaultValue={transaction?.quantity ?? ""}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="rate">Rate</FieldLabel>
            <Input
              id="rate"
              name="rate"
              type="number"
              step="0.01"
              defaultValue={transaction?.rate ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={transaction?.amount ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="reference_no">Reference no.</FieldLabel>
            <Input
              id="reference_no"
              name="reference_no"
              defaultValue={transaction?.reference_no ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Records</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="job_card_id">Job card</FieldLabel>
            <Select
              name="job_card_id"
              defaultValue={transaction?.job_card_id ?? undefined}
            >
              <SelectTrigger id="job_card_id" className="w-full">
                <SelectValue placeholder="Not linked to a job card" />
              </SelectTrigger>
              <SelectContent>
                {lookups.jobCards.map((jobCard) => (
                  <SelectItem key={jobCard.id} value={jobCard.id}>
                    {jobCard.job_card_no}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="vendor_id">Vendor</FieldLabel>
            <Select name="vendor_id" defaultValue={transaction?.vendor_id ?? undefined}>
              <SelectTrigger id="vendor_id" className="w-full">
                <SelectValue placeholder="Select a vendor" />
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
          <Link
            href={
              transaction
                ? `/inventory/transactions/${transaction.id}`
                : "/inventory/transactions"
            }
          >
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

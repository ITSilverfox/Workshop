"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createTollTransaction,
  updateTollTransaction,
  type TollTransactionFormState,
} from "./actions";
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

type TollTransaction = Tables<"toll_transactions">;
type Vehicle = Tables<"vehicles">;
type TollAccount = Tables<"toll_accounts">;
type Company = Tables<"companies">;
type ChartOfAccount = Tables<"chart_of_accounts">;

const TRANSACTION_TYPES = ["toll_trip", "parking", "topup", "deduction"];
const SOURCES = ["salik", "mak", "sfc", "was", "manual"];

function label(value: string) {
  return value.replace(/_/g, " ");
}

function toDateTimeInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function TollTransactionForm({
  transaction,
  lookups,
}: {
  transaction?: TollTransaction;
  lookups: {
    vehicles: Vehicle[];
    tollAccounts: TollAccount[];
    companies: Company[];
    accounts: ChartOfAccount[];
  };
}) {
  const initialState: TollTransactionFormState = { error: null };
  const action = transaction
    ? updateTollTransaction.bind(null, transaction.id)
    : createTollTransaction;
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
            <FieldLabel htmlFor="toll_account_id">Toll account</FieldLabel>
            <Select
              name="toll_account_id"
              defaultValue={transaction?.toll_account_id ?? undefined}
            >
              <SelectTrigger id="toll_account_id" className="w-full">
                <SelectValue placeholder="No toll account" />
              </SelectTrigger>
              <SelectContent>
                {lookups.tollAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.account_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="occurred_at">Date &amp; time</FieldLabel>
            <Input
              id="occurred_at"
              name="occurred_at"
              type="datetime-local"
              defaultValue={
                toDateTimeInput(transaction?.occurred_at) || toDateTimeInput(new Date().toISOString())
              }
            />
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
            <FieldLabel htmlFor="source">Source</FieldLabel>
            <Select name="source" defaultValue={transaction?.source ?? "salik"}>
              <SelectTrigger id="source" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((value) => (
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
              defaultValue={transaction?.amount ?? ""}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="reference_no">Reference number</FieldLabel>
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
          <CardTitle>Accounting</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="owned_company_id">Owned by company</FieldLabel>
            <Select
              name="owned_company_id"
              defaultValue={transaction?.owned_company_id ?? undefined}
            >
              <SelectTrigger id="owned_company_id" className="w-full">
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
            <FieldLabel htmlFor="allocated_company_id">Allocated company</FieldLabel>
            <Select
              name="allocated_company_id"
              defaultValue={transaction?.allocated_company_id ?? undefined}
            >
              <SelectTrigger id="allocated_company_id" className="w-full">
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
            <FieldLabel htmlFor="account_id">Chart of accounts</FieldLabel>
            <Select name="account_id" defaultValue={transaction?.account_id ?? undefined}>
              <SelectTrigger id="account_id" className="w-full">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {lookups.accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.account_name}
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
          <Link href={transaction ? `/tolls/${transaction.id}` : "/tolls"}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : transaction ? "Save changes" : "Create transaction"}
        </Button>
      </div>
    </form>
  );
}

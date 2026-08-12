"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createInvoice, updateInvoice, type InvoiceFormState } from "./actions";
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

type Invoice = Tables<"cost_allocation_invoices">;
type Company = Tables<"companies">;

export function InvoiceForm({
  periodId,
  invoice,
  companies,
}: {
  periodId: string;
  invoice?: Invoice | null;
  companies: Company[];
}) {
  const initialState: InvoiceFormState = { error: null };
  const action = invoice ? updateInvoice.bind(null, invoice.id) : createInvoice;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{invoice ? "Edit Invoice" : "Add Invoice"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="period_id" value={periodId} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field>
              <FieldLabel htmlFor="company_id">Company</FieldLabel>
              <Select
                name="company_id"
                defaultValue={invoice?.company_id ?? undefined}
              >
                <SelectTrigger id="company_id" className="w-full">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
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
                defaultValue={invoice?.invoice_number ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="invoice_value">Invoice value</FieldLabel>
              <Input
                id="invoice_value"
                name="invoice_value"
                type="number"
                step="0.01"
                defaultValue={invoice?.invoice_value ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ho_cost">HO cost</FieldLabel>
              <Input
                id="ho_cost"
                name="ho_cost"
                type="number"
                step="0.01"
                defaultValue={invoice?.ho_cost ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="total_cost">Total cost</FieldLabel>
              <Input
                id="total_cost"
                name="total_cost"
                type="number"
                step="0.01"
                defaultValue={invoice?.total_cost ?? ""}
              />
            </Field>
          </div>
          {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href={`/cost-allocation/${periodId}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : invoice ? "Save changes" : "Add invoice"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

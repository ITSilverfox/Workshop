"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createClaim, updateClaim, type ClaimFormState } from "./actions";
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

type Claim = Tables<"fuel_expense_claims">;

const STATUSES = [
  "pending_with_hr",
  "pending_with_accounts",
  "pending_with_melwyn",
  "jv_creation_pending",
  "jv_created",
];

function label(value: string) {
  return value.replace(/_/g, " ");
}

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

export function ClaimForm({ claim }: { claim?: Claim }) {
  const initialState: ClaimFormState = { error: null };
  const action = claim ? updateClaim.bind(null, claim.id) : createClaim;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Claim Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="claim_date">Claim date</FieldLabel>
            <Input
              id="claim_date"
              name="claim_date"
              type="date"
              defaultValue={toDateInput(claim?.claim_date) || todayInput()}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="ref_no">Reference number</FieldLabel>
            <Input id="ref_no" name="ref_no" defaultValue={claim?.ref_no ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="vendor_name">Vendor name</FieldLabel>
            <Input
              id="vendor_name"
              name="vendor_name"
              defaultValue={claim?.vendor_name ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select name="status" defaultValue={claim?.status ?? "pending_with_hr"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journal</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="journal_entry_number">Journal entry number</FieldLabel>
            <Input
              id="journal_entry_number"
              name="journal_entry_number"
              defaultValue={claim?.journal_entry_number ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="journal_id">Journal ID</FieldLabel>
            <Input id="journal_id" name="journal_id" defaultValue={claim?.journal_id ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="books_jv_link">Books JV link</FieldLabel>
            <Input
              id="books_jv_link"
              name="books_jv_link"
              type="url"
              defaultValue={claim?.books_jv_link ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={claim ? `/fuel/claims/${claim.id}` : "/fuel/claims"}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : claim ? "Save changes" : "Create claim"}
        </Button>
      </div>
    </form>
  );
}

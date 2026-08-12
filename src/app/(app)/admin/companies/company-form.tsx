"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCompany, updateCompany, type CompanyFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { Company } from "@/lib/supabase/types";

export function CompanyForm({ company }: { company?: Company }) {
  const initialState: CompanyFormState = { error: null };
  const action = company ? updateCompany.bind(null, company.id) : createCompany;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" defaultValue={company?.name ?? ""} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="code">Code</FieldLabel>
          <Input id="code" name="code" defaultValue={company?.code ?? ""} />
        </Field>
        <Field orientation="horizontal">
          <Switch
            id="is_active"
            name="is_active"
            defaultChecked={company?.is_active ?? true}
          />
          <FieldLabel htmlFor="is_active">Active</FieldLabel>
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="notes">Notes</FieldLabel>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={company?.notes ?? ""}
          placeholder="Additional notes about this company…"
        />
      </Field>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        {company ? (
          <Button variant="outline" asChild>
            <Link href="/admin/companies">Cancel</Link>
          </Button>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : company ? "Save changes" : "Add company"}
        </Button>
      </div>
    </form>
  );
}

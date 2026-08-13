"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createAccount, updateAccount, type AccountFormState } from "./actions";
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
import type { Tables } from "@/lib/supabase/types";

type Account = Tables<"chart_of_accounts">;

const ACCOUNT_TYPES = ["cost_of_goods_sold", "expense", "other_expense"];

export function AccountForm({ account }: { account?: Account }) {
  const initialState: AccountFormState = { error: null };
  const action = account ? updateAccount.bind(null, account.id) : createAccount;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="account_code">Account code</FieldLabel>
          <Input
            id="account_code"
            name="account_code"
            defaultValue={account?.account_code ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="account_name">Account name</FieldLabel>
          <Input
            id="account_name"
            name="account_name"
            defaultValue={account?.account_name ?? ""}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="account_type">Account type</FieldLabel>
          <Select name="account_type" defaultValue={account?.account_type ?? undefined}>
            <SelectTrigger id="account_type" className="w-full">
              <SelectValue placeholder="Not set" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_TYPES.map((value) => (
                <SelectItem key={value} value={value} className="capitalize">
                  {value.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="parent_account">Parent account</FieldLabel>
          <Input
            id="parent_account"
            name="parent_account"
            defaultValue={account?.parent_account ?? ""}
          />
        </Field>
        <Field orientation="horizontal">
          <Switch
            id="is_admin_expense"
            name="is_admin_expense"
            defaultChecked={account?.is_admin_expense ?? false}
          />
          <FieldLabel htmlFor="is_admin_expense">Admin expense</FieldLabel>
        </Field>
      </div>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        {account ? (
          <Button variant="outline" asChild>
            <Link href="/admin/accounts">Cancel</Link>
          </Button>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : account ? "Save changes" : "Add account"}
        </Button>
      </div>
    </form>
  );
}

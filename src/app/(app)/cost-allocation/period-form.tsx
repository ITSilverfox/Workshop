"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPeriod, updatePeriod, type PeriodFormState } from "./actions";
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

type Period = Tables<"cost_allocation_periods">;

const STATUSES = ["draft", "under_process", "approved"];

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

function label(value: string) {
  return value.replace(/_/g, " ");
}

export function PeriodForm({ period }: { period?: Period }) {
  const initialState: PeriodFormState = { error: null };
  const action = period ? updatePeriod.bind(null, period.id) : createPeriod;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Period</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="from_date">From date</FieldLabel>
            <Input
              id="from_date"
              name="from_date"
              type="date"
              defaultValue={toDateInput(period?.from_date)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="to_date">To date</FieldLabel>
            <Input
              id="to_date"
              name="to_date"
              type="date"
              defaultValue={toDateInput(period?.to_date)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select name="status" defaultValue={period?.status ?? "draft"}>
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

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={period ? `/cost-allocation/${period.id}` : "/cost-allocation"}>
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : period ? "Save changes" : "Create period"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createTechnician, updateTechnician, type TechnicianFormState } from "./actions";
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

type Technician = Tables<"technicians">;

const DESIGNATIONS = ["senior_technician", "junior_technician"];

export function TechnicianForm({ technician }: { technician?: Technician }) {
  const initialState: TechnicianFormState = { error: null };
  const action = technician
    ? updateTechnician.bind(null, technician.id)
    : createTechnician;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" defaultValue={technician?.name ?? ""} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="designation">Designation</FieldLabel>
          <Select
            name="designation"
            defaultValue={technician?.designation ?? undefined}
          >
            <SelectTrigger id="designation" className="w-full">
              <SelectValue placeholder="Not set" />
            </SelectTrigger>
            <SelectContent>
              {DESIGNATIONS.map((value) => (
                <SelectItem key={value} value={value} className="capitalize">
                  {value.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input id="phone" name="phone" defaultValue={technician?.phone ?? ""} />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={technician?.email ?? ""}
          />
        </Field>
        <Field orientation="horizontal">
          <Switch
            id="is_active"
            name="is_active"
            defaultChecked={technician?.is_active ?? true}
          />
          <FieldLabel htmlFor="is_active">Active</FieldLabel>
        </Field>
      </div>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        {technician ? (
          <Button variant="outline" asChild>
            <Link href="/admin/technicians">Cancel</Link>
          </Button>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : technician ? "Save changes" : "Add technician"}
        </Button>
      </div>
    </form>
  );
}

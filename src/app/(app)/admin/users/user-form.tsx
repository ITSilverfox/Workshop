"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateAppUser, type AppUserFormState } from "./actions";
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
import type { AppUser } from "@/lib/supabase/types";

const ROLES = ["admin", "owner", "workshop_staff", "accounts", "staff", "driver"];

export function UserForm({
  user,
  drivers,
}: {
  user: AppUser;
  drivers: { id: string; first_name: string; last_name: string | null }[];
}) {
  const initialState: AppUserFormState = { error: null };
  const action = updateAppUser.bind(null, user.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" defaultValue={user.email} disabled />
        </Field>
        <Field>
          <FieldLabel htmlFor="full_name">Full name</FieldLabel>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={user.full_name ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <Select name="role" defaultValue={user.role}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((value) => (
                <SelectItem key={value} value={value} className="capitalize">
                  {value.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="driver_id">Linked driver</FieldLabel>
          <Select name="driver_id" defaultValue={user.driver_id ?? undefined}>
            <SelectTrigger id="driver_id" className="w-full">
              <SelectValue placeholder="No linked driver" />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {[driver.first_name, driver.last_name].filter(Boolean).join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field orientation="horizontal">
          <Switch id="is_active" name="is_active" defaultChecked={user.is_active} />
          <FieldLabel htmlFor="is_active">Active</FieldLabel>
        </Field>
      </div>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/admin/users">Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

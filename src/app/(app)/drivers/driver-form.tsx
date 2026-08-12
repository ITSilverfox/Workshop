"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createDriver, updateDriver, type DriverFormState } from "./actions";
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
import type { Driver, Company } from "@/lib/supabase/types";

const USER_STATUSES = ["active", "archived"];
const USER_TYPES = ["driver", "non_driver"];
const CATEGORIES = ["office_staff", "field_staff", "management", "management_family"];
const DRIVING_TYPES = ["company_car", "personal_car"];

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

function label(value: string) {
  return value.replace(/_/g, " ");
}

type DriverAddress = { line?: string | null; city?: string | null; country?: string | null };

export function DriverForm({
  driver,
  lookups,
}: {
  driver?: Driver;
  lookups: { companies: Company[] };
}) {
  const initialState: DriverFormState = { error: null };
  const action = driver ? updateDriver.bind(null, driver.id) : createDriver;
  const [state, formAction, pending] = useActionState(action, initialState);
  const address = (driver?.address ?? null) as DriverAddress | null;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="prefix">Prefix</FieldLabel>
            <Input id="prefix" name="prefix" defaultValue={driver?.prefix ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="first_name">First name</FieldLabel>
            <Input
              id="first_name"
              name="first_name"
              defaultValue={driver?.first_name ?? ""}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="last_name">Last name</FieldLabel>
            <Input id="last_name" name="last_name" defaultValue={driver?.last_name ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="suffix">Suffix</FieldLabel>
            <Input id="suffix" name="suffix" defaultValue={driver?.suffix ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" defaultValue={driver?.email ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" name="phone" defaultValue={driver?.phone ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="date_of_birth">Date of birth</FieldLabel>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              defaultValue={toDateInput(driver?.date_of_birth)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="emp_id">Employee ID</FieldLabel>
            <Input id="emp_id" name="emp_id" defaultValue={driver?.emp_id ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="company_id">Company</FieldLabel>
            <Select name="company_id" defaultValue={driver?.company_id ?? undefined}>
              <SelectTrigger id="company_id" className="w-full">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="user_type">User type</FieldLabel>
            <Select name="user_type" defaultValue={driver?.user_type ?? "driver"}>
              <SelectTrigger id="user_type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="user_status">Status</FieldLabel>
            <Select name="user_status" defaultValue={driver?.user_status ?? "active"}>
              <SelectTrigger id="user_status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_STATUSES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select name="category" defaultValue={driver?.category ?? undefined}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {label(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="driving_type">Driving type</FieldLabel>
            <Select name="driving_type" defaultValue={driver?.driving_type ?? undefined}>
              <SelectTrigger id="driving_type" className="w-full">
                <SelectValue placeholder="Select a driving type" />
              </SelectTrigger>
              <SelectContent>
                {DRIVING_TYPES.map((value) => (
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
          <CardTitle>License</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="license_number">License number</FieldLabel>
            <Input
              id="license_number"
              name="license_number"
              defaultValue={driver?.license_number ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="license_class">License class</FieldLabel>
            <Input
              id="license_class"
              name="license_class"
              defaultValue={driver?.license_class ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="license_state">Issuing state</FieldLabel>
            <Input
              id="license_state"
              name="license_state"
              defaultValue={driver?.license_state ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="address_line">Address line</FieldLabel>
            <Input id="address_line" name="address_line" defaultValue={address?.line ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="address_city">City</FieldLabel>
            <Input id="address_city" name="address_city" defaultValue={address?.city ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="address_country">Country</FieldLabel>
            <Input
              id="address_country"
              name="address_country"
              defaultValue={address?.country ?? ""}
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
                placeholder="Additional notes about this driver…"
                defaultValue={driver?.notes ?? ""}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={driver ? `/drivers/${driver.id}` : "/drivers"}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : driver ? "Save changes" : "Create driver"}
        </Button>
      </div>
    </form>
  );
}

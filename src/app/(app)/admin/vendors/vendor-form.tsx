"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createVendor, updateVendor, type VendorFormState } from "./actions";
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
import type { Tables } from "@/lib/supabase/types";

type Vendor = Tables<"vendors">;
type VendorAddress = { line?: string | null; city?: string | null; country?: string | null };

const VENDOR_TYPES = ["fuel", "service"];

export function VendorForm({ vendor }: { vendor?: Vendor }) {
  const initialState: VendorFormState = { error: null };
  const action = vendor ? updateVendor.bind(null, vendor.id) : createVendor;
  const [state, formAction, pending] = useActionState(action, initialState);
  const address = (vendor?.address ?? null) as VendorAddress | null;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" defaultValue={vendor?.name ?? ""} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="vendor_type">Vendor type</FieldLabel>
          <Select name="vendor_type" defaultValue={vendor?.vendor_type ?? undefined}>
            <SelectTrigger id="vendor_type" className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {VENDOR_TYPES.map((value) => (
                <SelectItem key={value} value={value} className="capitalize">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="contact_person">Contact person</FieldLabel>
          <Input
            id="contact_person"
            name="contact_person"
            defaultValue={vendor?.contact_person ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input id="phone" name="phone" defaultValue={vendor?.phone ?? ""} />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={vendor?.email ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="website">Website</FieldLabel>
          <Input id="website" name="website" defaultValue={vendor?.website ?? ""} />
        </Field>
        <Field>
          <FieldLabel htmlFor="address_line">Address line</FieldLabel>
          <Input
            id="address_line"
            name="address_line"
            defaultValue={address?.line ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="address_city">City</FieldLabel>
          <Input
            id="address_city"
            name="address_city"
            defaultValue={address?.city ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="address_country">Country</FieldLabel>
          <Input
            id="address_country"
            name="address_country"
            defaultValue={address?.country ?? ""}
          />
        </Field>
      </div>

      {state.error ? <FieldError errors={[{ message: state.error }]} /> : null}

      <div className="flex justify-end gap-2">
        {vendor ? (
          <Button variant="outline" asChild>
            <Link href="/admin/vendors">Cancel</Link>
          </Button>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : vendor ? "Save changes" : "Add vendor"}
        </Button>
      </div>
    </form>
  );
}
